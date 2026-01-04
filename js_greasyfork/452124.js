// ==UserScript==
// @name         Jellyfin Playlist Generator
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Adds a button to generate M3U playlists from shows for Jellyfin
// @author       SuperMonkey
// @match        https://*/jellyfin/web/index.html
// @icon         https://jellyfin.org/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/452124/Jellyfin%20Playlist%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/452124/Jellyfin%20Playlist%20Generator.meta.js
// ==/UserScript==

const { fetch: originalFetch } = window;
let injected = false;
let apiKey = loadAPIKey();
let M3UDownloadButtonHTML = `<button is="emby-button" type="button" class="button-flat btnDL detailButton emby-button" title="Download M3U"><div class="detailButton-content"><span aria-hidden="true" class="material-icons detailButton-icon download"></span></div></button>`;
let linksDownloadButtonHTML = `<button is="emby-button" type="button" class="button-flat btnDL detailButton emby-button" title="Download Links"><div class="detailButton-content"><span aria-hidden="true" class="material-icons detailButton-icon link"></span></div></button>`;

window.fetch = async (...args) => {
  let [resource, config ] = args;
  const response = await originalFetch(resource, config);
  if (!validHash(location.hash)) return response;
  let mainDetailButtons = document.querySelector('#itemDetailPage:not([class*=hide]) .mainDetailButtons');
  if (mainDetailButtons && !mainDetailButtons.querySelector('.btnDL') && response.url.includes("Fields=ItemCounts%2CPrimaryImageAspectRatio%2CBasicSyncInfo%2CCanDelete%2CMediaSourceCount%2COverview")) {
    const json = await response.clone().json();
    const items = json["Items"];
    if (items) {
      let videoItems = items.filter(item => item.VideoType === "VideoFile");
      injectButtons(mainDetailButtons, videoItems);
    }
  }
  return response;
};

function loadAPIKey() {
  let jellyfinCredentials = localStorage.getItem("jellyfin_credentials");
  jellyfinCredentials = JSON.parse(jellyfinCredentials);
  let serverCredentials = jellyfinCredentials.Servers.find((server) => server.ManualAddress.includes(location.origin));
  return serverCredentials.AccessToken;
}

function htmlToElement(html) {
  var template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

function validHash(hash) {
  return (/details\?id=[A-Fa-f0-9]{32}&serverId=[A-Fa-f0-9]{32}/.test(hash));
}

function generateM3U(videoItems) {
  let M3U = "#EXTM3U\n";
  let playlistName = "";
  videoItems.forEach((item) => {
    if (!playlistName) playlistName = `${item.SeriesName} - ${item.SeasonName}`;
    let title = `${item.SeriesName} - ${item.SeasonName} Episode ${item.IndexNumber} - ${item.Name}`;
    let url = `${location.origin}/jellyfin/Items/${item.Id}/Download?api_key=${apiKey}`;
    M3U += `#EXTINF:0,${title}\n${url}\n`;
  })
  return [playlistName, M3U]
}

function generateLinks(videoItems) {
  let links = "";
  let playlistName = "";
  videoItems.forEach((item) => {
    if (!playlistName) playlistName = `${item.SeriesName} - ${item.SeasonName}`;
    links += `${location.origin}/jellyfin/Items/${item.Id}/Download?api_key=${apiKey}\n`;
  })
  return [playlistName, links]
}

function injectButtons(mainDetailButtons, videoItems) {
  const M3UDownloadButton = htmlToElement(M3UDownloadButtonHTML);
  const linksDownloadButton = htmlToElement(linksDownloadButtonHTML);
  M3UDownloadButton.addEventListener('click', function() {
    let [playlistName, M3U] = generateM3U(videoItems);
    const blob = new Blob([M3U], {type: "text/plain;charset=utf-8"});
    saveAs(blob, `${playlistName}.m3u`);
  })
  linksDownloadButton.addEventListener('click', function() {
    let [playlistName, links] = generateLinks(videoItems);
    const blob = new Blob([links], {type: "text/plain;charset=utf-8"});
    saveAs(blob, `${playlistName}.txt`);
  })
  mainDetailButtons.prepend(M3UDownloadButton);
  mainDetailButtons.prepend(linksDownloadButton);
}
