// ==UserScript==
// @name         LIVE in Desktop Palyer
// @namespace    http://tampermonkey.net/LIVEinDesktopPlayer
// @version      0.3.1
// @description  using desktop player watching Bilibili and Youtube live
// @author       luoyayu
// @match        https://live.bilibili.com/*
// @match        https://www.youtube.com/watch*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/406930/LIVE%20in%20Desktop%20Palyer.user.js
// @updateURL https://update.greasyfork.org/scripts/406930/LIVE%20in%20Desktop%20Palyer.meta.js
// ==/UserScript==

// THE CODE USE `Potplayer` FOR EXAMPLE

// WINDOWS USER NOTICE
/* paste below code into a file named `potplayer.reg`, then click and run it

Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\potplayer\shell\open\command]
@="cmd /k ( set \"var=%1\" & call set var=%%var:potplayer://=%% & call C:\Program Files\DAUM\PotPlayer\PotPlayerMini64.exe %%var%%)"
 */

// Unix USER NOTICE
/*
 * Create a custom URL Protocol Handler for desktop player
 */

(function() {
  'use strict';
  const host = window.location.host;
  const int = window.setInterval(isPaused, 1000);
  const end_int = window.setTimeout(()=>{
      window.clearInterval(int);
  }, 1000*5);

  function jump2player(video_url) {
    const jump_link = document.createElement('a');
    jump_link.setAttribute('href', 'potplayer://' + video_url); // !! fill your custom url scheme !!
    jump_link.click();
  }

  function isPaused() {
    let d;

    if (host === 'www.youtube.com') {
      d = document.getElementsByClassName('ytp-play-button ytp-button')[0]; // btn
    } else if (host === 'live.bilibili.com') {
      d = document.getElementsByClassName('bilibili-live-player relative')[0]; // player
    }

    if (d !== undefined) {
      let state = undefined;

      if (host === 'www.youtube.com') {
        state = document.getElementsByClassName(
            'ytp-play-button ytp-button')[0].getElementsByClassName(
            'ytp-svg-fill')[0].getAttribute('d') ===
            'M 12,25 19,25 19,11 12,11 z M 19,25 26,25 26,11 19,11 z';
      } else if (host === 'live.bilibili.com') {
        state = d.getAttribute('data-video-state') === 'playing';
      }

      if (state === false) { // paused
        // window.clearInterval(int);
      } else {
        if (host === 'www.youtube.com') {
          d.click();
        } else if (host === 'live.bilibili.com') {
          document.getElementsByClassName('blpui-btn icon-btn')[0].click(); // btn
        }
      }
    }
  }

  if (host === 'www.youtube.com') {
    const is_live = document.getElementsByClassName(
        'ytp-live-badge')[0].getAttribute('disabled').length === 0;

    if (is_live) {
      jump2player(window.location.href);
    }
  } else {
    const cid = window.location.pathname.substr(1);

    if (!isNaN(cid)) {
      GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://api.live.bilibili.com/room/v1/Room/playUrl?platform=h5&cid=' +
            cid,
        onload: xhr => {
          let ret = xhr.response;
          jump2player(JSON.parse(ret).data.durl[0].url);
        },
      });
    }
  }

})();