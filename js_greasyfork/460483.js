// ==UserScript==
// @name         Speed2.0
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  加速bilibili视频
// @author       Goose
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @license      AGPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460483/Speed20.user.js
// @updateURL https://update.greasyfork.org/scripts/460483/Speed20.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var tmm = window.setInterval(function(){
        var video = document.getElementsByTagName("video")[0];
        if(video){
          video.playbackRate = 15;
          window.clearInterval(tmm);
        }
      }, 2000);
})();