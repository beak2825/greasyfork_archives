// ==UserScript==
// @name         广州小学优课挂机
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  挂机
// @author       k某某
// @match        *://*.uooconline.com/*
// @match        *://mooc1-1.chaoxing.com/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396621/%E5%B9%BF%E5%B7%9E%E5%B0%8F%E5%AD%A6%E4%BC%98%E8%AF%BE%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/396621/%E5%B9%BF%E5%B7%9E%E5%B0%8F%E5%AD%A6%E4%BC%98%E8%AF%BE%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
setTimeout(kzj,3000);
    function kzj() {
document.getElementsByTagName("video")[0].playbackRate=16;
setInterval(function (){ document.getElementsByClassName("vjs-play-control vjs-control vjs-button vjs-paused")[0].click()}, 1000);
   }


})();
