// ==UserScript==
// @name         影片速度快捷鍵
// @version      0.2
// @description  speed up/down video
// @author       John
// @match        *://*.135mov.com/*
// @match        *://*.8maple.in/*
// @match        *://*.94itv.net/*
// @match        *://*.bilibili.com/*
// @match        *://*.dramasq.cc/*
// @match        *://*.gimy.cc/*
// @match        *://*.gimy.tv/*
// @match        *://*.gimytv.com/*
// @match        *://*.netflix.com/*
// @match        *://*.tangrenjie.tv/*
// @match        *://*.youtube.com/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/814278
// @downloadURL https://update.greasyfork.org/scripts/432233/%E5%BD%B1%E7%89%87%E9%80%9F%E5%BA%A6%E5%BF%AB%E6%8D%B7%E9%8D%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/432233/%E5%BD%B1%E7%89%87%E9%80%9F%E5%BA%A6%E5%BF%AB%E6%8D%B7%E9%8D%B5.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let rate = 1;
  let selectors = [];
  let parentDoc = document;
  let videoObj = null;
  const newDivId = "tampermonkey-video-speed-rate";


  if (/8maple.in/.test(location.hostname)) {
    selectors = [
      'h1.entry-title a'
    ]
  } else if (/bilibili/.test(location.hostname)) {
    selectors = [
      'div.bilibili-player-video-top-title',
      'span.tit'
    ]

  } else if (/dramasq.cc/.test(location.hostname)) {
    selectors = [
      '.dplayer-camera-icon'
    ]

  } else if (/135mov.com/.test(location.hostname)) {
    selectors = [
      '.stui-player__detail h4.title a'
    ]
    parentDoc = parent.document;

  } else if (/gimy/.test(location.hostname)) {
    selectors = [
      '.stui-player h1.title a'
    ]
    parentDoc = parent.document;

  } else if (/netflix/.test(location.hostname)) {
    selectors = ['.ellipsize-text h4','h4.ellipsize-text']

  } else if (/youtube/.test(location.hostname)) {
    selectors = [
      'h1 > yt-formatted-string.style-scope.ytd-video-primary-info-renderer'
    ]
  }

  window.addEventListener('keydown', (e) => {
    const maxRate = 5;
    const ek = e.key;

      if (ek === ']' && rate < maxRate) {
          rate += 0.25
      } else if (ek === '[' && rate > 0.25) {
          rate -= 0.25
      } else if (ek === '=' && rate < maxRate) {
          rate += 0.5
      } else if (ek === '-' && rate > 0.5) {
          rate -= 0.5
      } else if (!isNaN(ek) && ek != ' ' && ek < maxRate) {
          if (/youtube/.test(location.hostname)){
              return
              rate = Number(ek);
          }
      } else {
          return
      }
    setVideoRate()
    addRateTitle()
  })

  function setVideoRate() {
    videoObj = document.querySelector('video');
	if( videoObj != null){
		videoObj.playbackRate = rate
	}else{
        document.querySelectorAll('iframe').forEach(function(o){
            try{
                videoObj = o.contentWindow.document.querySelector('video');
                videoObj.playbackRate = rate
            }catch{}
        });
	}
  }

  function addRateTitle() {
    if (videoObj != null){
        try{
            parentDoc.getElementById(newDivId).remove();
        }catch(e){}

        for (const o of selectors) {
            const el = parentDoc.querySelector(o)
            if (el) {
                let newDiv = document.createElement("span");
                newDiv.id = newDivId;
                newDiv.innerText = `[${rate}x]   `;

                el.before(newDiv);
            }
        }
    }
  }
})();