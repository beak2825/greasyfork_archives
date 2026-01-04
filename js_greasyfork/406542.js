// ==UserScript==
// @name         Hungama.com free movies & tv shows
// @namespace    http://ashish.link/
// @version      0.1.1
// @description  Get access to all movies and tv shows on hungama.com for free.
// @author       Ashish Ranjan
// @match        https://www.hungama.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/406542/Hungamacom%20free%20movies%20%20tv%20shows.user.js
// @updateURL https://update.greasyfork.org/scripts/406542/Hungamacom%20free%20movies%20%20tv%20shows.meta.js
// ==/UserScript==

(function() {
  'use strict';
  window.google = {
    ima: {
      AdDisplayContainer: function() {},
      AdsLoader: function() {},
      AdsRequest: function() {}
    }
  };
  window.addEventListener(
    'load',
    function() {
      window.showNotificationPopup = window.videoPlayerObj.pause = () => {}
    },
    false
  )
})()
