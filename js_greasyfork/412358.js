// ==UserScript==
// @name         Youtube AutoLike
// @homepageURL https://github.com/Koalapvh13/Tampermonkey-Scripts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script to automatically like Youtube Videos Opened in Browser 
// @license MIT
// @icon https://lh3.googleusercontent.com/zw07Qyfb7MnF8J9pZJ6eYheztKq1shP1j6tUqyDYZj6R60nNrrPrFZvC9k5JIe2m9t2GfQLbXg=w128-h128-e365-rj-sc0x00ffffff
// @author       Matheus Dias Vieira
// @copyright 2020, Matheus Dias Vieira (https://github.com/Koalapvh13)
// @match        http*://*.youtube.com/watch?v=*
// @include      http*://*.youtube.com/*
// @include      http*://youtube.com/*
// @include      http*://*.youtu.be/*
// @include      http*://youtu.be/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412358/Youtube%20AutoLike.user.js
// @updateURL https://update.greasyfork.org/scripts/412358/Youtube%20AutoLike.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const like = () => {
    const interval = setInterval(() => {
      const btnlike = document.querySelector("#top-level-buttons > ytd-toggle-button-renderer:nth-child(1)")
      if (btnlike) {
        clearInterval(interval)
        if (!btnlike.classList.contains("style-default-active")) {
          btnlike.click()
        }
      }

    }, 1000)
  }

  document.body.addEventListener("yt-navigate-finish", function (event) {
    if (window.location.pathname == "/watch") {
      console.log(window.location.href)
      console.log(window.location.pathname)
      like()
    }

  });

})();
