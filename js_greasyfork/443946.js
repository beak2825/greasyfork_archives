// ==UserScript==
// @name         Shift Space Toggle Youtube CE Element
// @name:en         Shift Space Toggle Youtube CE Element
// @name:ja         Shift Space Toggle Youtube CE Element
// @name:zh-TW         Shift Space Toggle Youtube CE Element
// @name:zh-CN         Shift Space Toggle Youtube CE Element
// @name         Shift Space Toggle Youtube CE Element
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  This is to toggle annoying Youtube CE Element near the end of the video
// @description:en  This is to toggle annoying Youtube CE Element near the end of the video
// @description:ja  これは、ビデオの終わり近くにある迷惑な Youtube CE 要素を切り替えるためのものです。
// @description:zh-TW  這是為了切換在影片結尾附近煩人的 Youtube CE 元素
// @description:zh-CN  這是為了切換在影片結尾附近煩人的 Youtube CE 元素
// @author       CY Fung
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443946/Shift%20Space%20Toggle%20Youtube%20CE%20Element.user.js
// @updateURL https://update.greasyfork.org/scripts/443946/Shift%20Space%20Toggle%20Youtube%20CE%20Element.meta.js
// ==/UserScript==

/* jshint esversion:6 */
(function() {
  'use strict';

  let videoElm = null;
  const ceElems = [];
  let isPassiveAvailable = null

  let earliestShown = -1;
  let endTime = -1;

  const WeakRef = window?.WeakRef;

  let videoReady = false

  let lastPress = -1
  const allowList = [
        'DIV', 'SPAN', 'BODY', 'HTML', 'VIDEO', 'A',
        'YTD-PLAYER', 'YTD-WATCH-FLEXY', 'YTD-PAGE-MANAGER', 'YTD-MINIPLAYER'
    ];

  function cacheCEElems() {

    const m = document.querySelectorAll('ytd-player#ytd-player .ytp-ce-element');
    if (m.length === 0) return false;

    ceElems.length = 0;
    for (const elm of m) {
      ceElems.push(new WeakRef(elm))
    }

    return true;

  }

  function videoTimeUpdate(evt) {

    //passive = true
    //capture = false

    if (!videoReady) {
      if (evt?.target?.matches('ytd-player#ytd-player video')) {
        videoReady = true
        if (cacheCEElems() === false) setTimeout(cacheCEElems, 180);
      }
    }

    if (ceElems.length === 0) return;

    const video = evt.target;
    const anyShown = ceElems.some((elmRef) => elmRef.deref()?.classList?.contains('ytp-ce-element-show') === true)
    //console.log(135, anyShown, video.currentTime)
    if (anyShown) {
      if (earliestShown > 0 && -earliestShown < -video.currentTime) {
        earliestShown = video.currentTime
        endTime = video.duration
      } else if (earliestShown < 0) {
        videoElm = new WeakRef(video);
        earliestShown = video.currentTime
        endTime = video.duration
      }
    }


  }

  function initialForVideoDetection(evt) {

    //passive = true
    //capture = true

    const video = evt?.target;
    if (video?.nodeName === 'VIDEO' && typeof video.src == 'string') {} else return;

    videoReady = false;
    ceElems.length = 0;

    videoElm = null;
    earliestShown = -1;
    endTime = -1;


    new Promise(function() {


      if (video.hasAttribute('usr-video-cem')) return;
      video.setAttribute('usr-video-cem', '');

      if (isPassiveAvailable === null) isPassiveAvailable = checkPassive();
      video.addEventListener('timeupdate', videoTimeUpdate, optCapture(true, false));

    })

  }

  function pageKeyDownfunction(evt) {
    //passive = false
    //capture = true

    if (evt.code === 'Space' && evt.shiftKey) {

      if (!allowList.includes(evt.target.nodeName)) return;

      if (endTime > earliestShown && earliestShown > 0) {

        let video = videoElm?.deref();

        if (!video) return;

        let p = (video.currentTime - earliestShown) / (endTime - earliestShown);
        if (p >= 0 && p <= 1) {
          evt.preventDefault();
          evt.stopPropagation();
          evt.stopImmediatePropagation();

          for (const ceElem of ceElems) {
            ceElem?.deref()?.classList.toggle('ytp-ce-element-show');
          }
        }

      }

    }
  }

  function checkPassive() {

    let passiveSupported = false;

    try {
      const options = {
        get passive() {
          passiveSupported = true;
          return false;
        }
      };

      window.addEventListener("test", null, options);
      window.removeEventListener("test", null, options);
    } catch (err) {
      passiveSupported = false;
    }

    return passiveSupported

  }

  const optCapture = (passive, capture) => isPassiveAvailable ? { passive, capture } : capture;

  new Promise(function() {

    if (isPassiveAvailable === null) isPassiveAvailable = checkPassive();
    document.addEventListener('canplay', initialForVideoDetection, optCapture(true, true));

  })

  document.addEventListener('keydown', pageKeyDownfunction, true)

  //ytp-ce-video ytp-ce-top-left-quad ytp-ce-size-853 ytp-ce-element-show

  // Your code here...
})();