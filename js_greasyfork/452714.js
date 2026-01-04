// ==UserScript==
// @name         BC: keyboard shortcuts
// @description  for Bandcamp and its embeded player: seek, autoseek when changing track, play/pause, go to prev/next release, volume control, pitch control. Designed for those digging through lots of tunes.
// @namespace    userscript1
// @version      1.4.6
// @grant        GM.xmlHttpRequest
// @connect      bandcamp.com
// @match        https://bandcamp.com/*
// @match        https://*.bandcamp.com/*
// @match        https://*/*
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/452714/BC%3A%20keyboard%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/452714/BC%3A%20keyboard%20shortcuts.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Key_ settings refer to physical positions as if you had a QWERTY layout, not letters.
  // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values
  const playPause   = 'KeyP';
  const prev        = 'KeyI';
  const next        = 'KeyO';
  const prevAndSeek = 'KeyH';
  const nextAndSeek = 'KeyL';
  const seekBack    = 'KeyJ';
  const seekForward = 'KeyK';
  const prevRelease = 'KeyY';
  const nextRelease = 'KeyU';
  const volDown     = 'Minus';
  const volUp       = 'Equal';
  const speedDown   = 'BracketLeft';
  const speedUp     = 'BracketRight';
  const speedReset  = 'Semicolon';
  const initialSeek = 60;
  const manualSeek  = 30;
  // end configuration


  // only run on *bandcamp.com or bandcamp on a custom domain
  if (!window.location.hostname.endsWith('bandcamp.com')
      && !document.head.querySelector('meta[property="twitter:site"][content="@bandcamp"]') ) {
        return;
  }


  const aud = $('audio');
  // if (!aud) { return; }   // we want to allow next release on non-player pages
  var prevButton, nextButton, playButton;
  $('#customHeaderWrapper')?.insertAdjacentHTML('beforeEnd', `<div id="shortcuts-message" style="position:absolute; text-align: center; left: 0; right: 0;"></div>`);


  window.addEventListener('keydown', (evt) => {
      if (evt.altKey || evt.ctrlKey || evt.metaKey) { return; }

      if ($('.ui-widget-overlay') || document.activeElement.tagName == 'INPUT') {
        // don't run if dialog box is open or we're typing into a field
        return;
      }

      // check every time to allow collection page to work
      if (!findButtons() && (evt.code != nextRelease)) {
        return;
      }

      // console.log(evt.code);  // uncomment to check key codes
      switch(evt.code) {
          case prev:
              prevButton.click();
              scrollEmbedPlayer();
              message('');
              break;
          case prevAndSeek:
              prevButton.click();
              aud.currentTime = initialSeek;
              scrollEmbedPlayer();
              message('');
              break;
          case next:
              nextButton.click();
              scrollEmbedPlayer();
              message('');
              break;
          case nextAndSeek:
              nextButton.click();
              aud.currentTime = initialSeek;
              scrollEmbedPlayer();
              message('');
              break;
          case seekBack:
              if (aud.paused) {
                playButton.click();
              }
              aud.currentTime -= manualSeek;
              break;
          case seekForward:
              if (aud.paused) {
                playButton.click();
              }
              aud.currentTime += manualSeek;
              break;
          case playPause:
              playButton.click();
              if (playPause === 'Space') {
                evt.preventDefault();  // prevent page scroll
              }
              break;
          case nextRelease:
              aud.pause();
              changeRelease(1);
              break;
          case prevRelease:
              aud.pause();
              changeRelease(-1);
              break;
          case volDown:
              aud.volume = Math.max(aud.volume - 0.1, 0).toFixed(2);
              break;
          case volUp:
              aud.volume = Math.min(aud.volume + 0.1, 1).toFixed(2);
              break;
          case speedDown:
            aud.preservesPitch = false;
            aud.playbackRate = Math.max(aud.playbackRate - 0.02, 0.2).toFixed(2);
            message(aud.playbackRate);
            break;
          case speedUp:
            aud.preservesPitch = false;
            aud.playbackRate = Math.min(aud.playbackRate + 0.02, 3).toFixed(2);
            message(aud.playbackRate);
            break;
          case speedReset:
            aud.playbackRate = 1;
            message('');
            break;

      }
  }, false);

  function findButtons() {
    prevButton = $('div.prevbutton') || $('div.prev-icon');
    nextButton = $('div.nextbutton') || $('div.next-icon');
    playButton = $('div.playbutton') || $('div.playpause') || $('div#big_play_button');
    return playButton;
  }

  function scrollEmbedPlayer() {
    $('li.currenttrack')?.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'nearest'});
  }

  function $(s) {
    return document.querySelector(s);
  }

  function message(str) {
    var elm = $('#shortcuts-message');
    if (elm) { elm.textContent = str; }
  }

  async function changeRelease(direction) {
    var path = window.location.pathname;
    if ((path == '/' || path == '/music' || path == '/releases') && direction == 1) {
      // try clicking 2nd item in the discography on the right
      document.querySelectorAll('#discography .trackTitle a')[1]?.click();
      // try clicking 1st item in the grid list
      $('li.music-grid-item a , div.ipCellImage a')?.click();
      return;
    }
    if (!/^\/album|track/.test(path)) { return; }

    var releasesURL;
    var cacheMe = false;
    var labelLink = $('a.back-to-label-link');
    if (labelLink && labelLink.textContent.includes('back to')) {
      releasesURL = new URL(labelLink.href);
    } else {
      releasesURL = new URL('https://' + window.location.hostname + '/music');
      cacheMe = true;
    }

    const lsKey = 'shortcuts-release-data';
    if (cacheMe && lsGet(lsKey)) {
      console.log('fetching release data from cache');
      var releaseLinks = lsGet(lsKey);
    } else {
      console.log('fetching release data from:', releasesURL.href);
      var doc = await fetchDOM(releasesURL.href);
      // get exact href value, a.href after a cross domain fetch adds the wrong domain to /bare/paths
      var releaseLinks = Array.from(
          doc.querySelectorAll('li.music-grid-item a , div.ipCellImage a')).map(a => a.getAttribute('href')
          );

      // bandcamp limits the number of releases in the raw HTML,
      // the rest are available from a data attribute
      var str = doc.querySelector('#music-grid')?.dataset.clientItems;
      if (str) {
        var data = JSON.parse(str);
        var moreLinks = data.map( ({page_url}) => page_url);
        releaseLinks = releaseLinks.concat(moreLinks);
      }
      // console.log(releaseLinks);

      if (cacheMe) {
        lsSet(lsKey, releaseLinks, 1000 * 60 * 10);
      }
    }

    // todo: URL object compare
    var i = releaseLinks.findIndex(e => e.split('?')[0].endsWith(window.location.pathname));
    if (i == -1) {
      var err = 'error: current item not found on /music page';
      console.log(err);
      message(err);
      return;
    }

    var url = releaseLinks[i + direction];
    if (url) {
      if (!url.startsWith('https://')) {
        url = 'https://' + releasesURL.hostname + url;
      }
      // message(`going to ${(i + 1) + direction} of ${releaseLinks.length}`);
      console.log('navigating to:', url);
      window.location = url;
    } else {
      var msg = 'no more releases';
      if (!cacheMe) {
        msg += ' (checked label page)';
      }
      message(msg);
    }
  }

  function lsSet(key, value, ttl) {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  function lsGet(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) { return null; }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  }

  const corsFetch = url => {
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        url: encodeURI(url),
        onload: res => resolve(res.responseText),
        onerror: res => reject(res)
      });
    });
  };

  const fetchDOM = async url => {
    const responseText = await corsFetch(url);
    const parser = new DOMParser();
    return parser.parseFromString(responseText, "text/html");
  };

})();