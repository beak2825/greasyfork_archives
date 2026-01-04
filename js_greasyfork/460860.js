// ==UserScript==
// @name        Plex playlist played status
// @description Show played status on playlist when using Plex
// @version     1.1
// @namespace   cybolic.me
// @author      Christian Dannie Storgaard
// @include     https://app.plex.tv/desktop
// @include     https://app.plex.tv/desktop/*
// @include     https://app.plex.tv/desktop#*
// @include     http://localhost:32400/web/*
// @include     http://127.0.0.1:32400/web/*
// @include     https://localhost:32400/web/*
// @include     https://127.0.0.1:32400/web/*
// @grant       none
// @license     GNU GPLv3 
// @downloadURL https://update.greasyfork.org/scripts/460860/Plex%20playlist%20played%20status.user.js
// @updateURL https://update.greasyfork.org/scripts/460860/Plex%20playlist%20played%20status.meta.js
// ==/UserScript==

var info = {
  serverId: '',
  playlistId: '',
  playlistDOM: undefined
};

var logMessage = function (msg) {
  console.info(`[Plex Playlist Played] ${msg}`);
};

var getCurrentUsersData = function () {
  return JSON.parse(localStorage.users)?.users || [];
};

var getCurrentServerId = function () {
  return window.location.hash
    .split('/server/').pop()
    .split?.('/').shift();
};
var getCurrentPlaylistId = function () {
  return decodeURIComponent(window.location.hash)
    .split('key=/playlists/').pop()
    .split?.('&').shift();
};


var getServerDetailsForAll = function () {
  return Object.fromEntries(
    getCurrentUsersData()
      .filter(user => user.servers.length)
      .map(userWithServers => userWithServers.servers)
      .flat()
      .map(server => [ server.machineIdentifier, server ])
  );
}

var getServerDetailsForId = function (serverId) {
  return getServerDetailsForAll()[serverId];
};

var getPlaylist = function (serverId, playlistId) {
  const serverDetails = getServerDetailsForId(serverId);
  const url = `${serverDetails.connections.shift()?.uri || 'https://localhost:32400'}/playlists/${playlistId}/items?includeExternalMedia=1&X-Plex-Token=${serverDetails.accessToken}`;
  logMessage(`looking up ${url}`);
  return fetch(url)
    .then(response => response.text())
    .then(responseText => (new DOMParser()).parseFromString(responseText, 'application/xml'));
};

var getPlaylistElementFromKey = function (serverId, key) {
  return document.querySelectorAll(`a[data-testid="metadataTitleLink"][href*="/server/${serverId}"][href*="${encodeURIComponent(key)}"]`).shift();
};

var addStyle = function (css) {
  let shouldAddToHead = false;
  let style = document.querySelector('#plex-playlist-played-css');
  if (style == null) {
    style = document.createElement('style');
    style.id = 'plex-playlist-played-css';
    shouldAddToHead = true;
  }

  style.textContent = css;

  if (shouldAddToHead) {
    document.head.append(style);
  }
};

var getCssForPlaylist = function (serverId, dom) {
  logMessage("creating css");
  const videosNotPlayed = Array.from(dom.querySelectorAll('Video:not([viewCount])'));
  const css = videosNotPlayed
    // get the library key for these items
    .map(video => ({
      key: video.attributes['key'].value,
      type: video.attributes['type'].value,
    }))
    // generate a CSS rule for each playlist item that targets the only element we can track, the link to the item
    .map(attrs => {
      const selector = `a[data-testid="metadataTitleLink"][href*="/server/${serverId}"][href*="${encodeURIComponent(attrs.key)}&"]`;
      return `${selector}::after {
        content: '';
        position: absolute;
        ${attrs.type === 'episode'
          ? `left: 155px; top: 16px;`
          : `left: 141px; top: 7px;`
        }
        width: 0px;
        height: 0px;
        border: 8px solid #e5a00d;
        border-color: #e5a00d #e5a00d transparent transparent;
        filter: drop-shadow(0px 1px 0px rgba(0,0,0,0.5));
        pointer-events: none;
      }`;
    })
    .join('\n');
  return css;
};

var checkCurrentPage = function () {
  logMessage("checking if current location is playlist");
  if (window.location.hash.includes(`key=${encodeURIComponent('/playlists/')}`)) {
    logMessage("current page is playlist; fetching playlist data");
    info.serverId = getCurrentServerId();
    info.playlistId = getCurrentPlaylistId();
    getPlaylist(info.serverId, info.playlistId).then(dom => {
      logMessage("playlist data fetched, creating CSS");
      info.playlistDOM = dom;
      const css = getCssForPlaylist(info.serverId, info.playlistDOM);
      addStyle(css);
      logMessage('play status added');
    });
  }
};

window.addEventListener('hashchange', checkCurrentPage);
logMessage("added event handler");
checkCurrentPage();