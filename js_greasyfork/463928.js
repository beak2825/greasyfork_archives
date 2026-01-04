// ==UserScript==
// @name         Reddit Embedded Video Expnader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Expands the frame size of videos embedded on old Reddit to 720p
// @author       Spencer Ayers-Hale
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @match        https://*.reddit.com/*
// @match        https://www.redditmedia.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463928/Reddit%20Embedded%20Video%20Expnader.user.js
// @updateURL https://update.greasyfork.org/scripts/463928/Reddit%20Embedded%20Video%20Expnader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var num = document.getElementsByTagName("iframe").length; //number of iframes on page
    var cnt = 0; //currnent iframe
    var w = 1280; //traget width
    var h = 720; //traget height

    while(cnt < num){
        var frame = document.getElementsByTagName("iframe")[cnt]; //get current iframe

        //apply new width and height
        if (frame.className == "media-embed" || frame.src.substring(0,23) == "https://www.youtube.com"){
           frame.width=w;
           frame.height=h;
        }

        cnt ++;
    }
})();