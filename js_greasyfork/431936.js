// ==UserScript==
// @name               Hami Hoykey
// @name:zh-TW         Hami 快捷鍵
// @namespace          http://tampermonkey.net/
// @version            0.7
// @description        add hotkey for HamiVideo. f=fullscreen, Left/Right=TimeControl, space=play/pause, shift+>=speedup, shift+<=speeddown
// @description:zh-tw  幫HamiVideo增加快捷鍵, f=全螢幕, Left/Right=時間控制, space=開始/暫停, shift+>=加速, shift+<=減速
// @author             Long
// @match              https://hamivideo.hinet.net/play/*
// @icon               https://www.google.com/s2/favicons?domain=hinet.net
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/431936/Hami%20Hoykey.user.js
// @updateURL https://update.greasyfork.org/scripts/431936/Hami%20Hoykey.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

  function getPlaybackRate() {
    let videoId = window.location.href.split('/')[4];
    if(isNumeric(videoId) && sessionStorage) {
      return sessionStorage.getItem(`hamihotkey_playbackrate_${videoId}`);
    }
    return null;
  }

  function setPlaybackRate($video, rate) {
    let maxRate = 2;
    let minRate = 0.75;
    rate = Math.min(maxRate, Math.max(minRate, rate));
    $video.playbackRate = rate;
    let videoId = window.location.href.split('/')[4];
    if(isNumeric(videoId) && sessionStorage) {
      sessionStorage.setItem(`hamihotkey_playbackrate_${videoId}`, rate);
    }
  }

  function initHotkey($video) {
    $video.addEventListener('keydown', (e) => {
      // console.log(e);
      if(e.key === 'ArrowLeft') {
        $video.currentTime = Math.max(0, $video.currentTime - 5);
      } else if(e.key === 'ArrowRight') {
        $video.currentTime = Math.min($video.duration, $video.currentTime + 5);
      } else if (e.key === ' ') {
        if($video.paused) {
          $video.play();
        } else {
          $video.pause();
        }
      } else if (e.shiftKey && e.key === '<') {
        setPlaybackRate($video, $video.playbackRate - 0.25);
      } else if (e.shiftKey && e.key === '>') {
        setPlaybackRate($video, $video.playbackRate + 0.25);
      } else if(e.key === 'f' || e.key === 'F') {
        document.querySelector('.vjs-fullscreen-control').click();
      }
    });

    let cachePlaybackRate = getPlaybackRate();
    if(cachePlaybackRate) {
      window.setTimeout(function() {
        $video.playbackRate = cachePlaybackRate;
      }, 500);
      console.log("[Hami Hotkey] set cache PlaybackRate to:", cachePlaybackRate);
    }
    
    $video.focus();
    console.log("[Hami Hotkey] hotkey loaded.", $video);
  };

  // handle dom created event
  let observer = new MutationObserver(mutations => {
    for(let mutation of mutations) {
      for(let node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        if (node.matches('#h5video_html5_api')) {
          initHotkey(node);
        }
      }
    }
  });
  observer.observe(document.getElementById('player'), {
    childList: true,
    attributes: true,
    attributeFilter: ['id']
  });
})();
