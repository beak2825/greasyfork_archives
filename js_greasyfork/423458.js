// ==UserScript==
// @name         Unblur Farschule.de
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Unblur the pictures and comments on the Fahrschule website
// @author       Jatoxo
// @match        *://*.fahrschule.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423458/Unblur%20Farschulede.user.js
// @updateURL https://update.greasyfork.org/scripts/423458/Unblur%20Farschulede.meta.js
// ==/UserScript==

(function() {
    'use strict';

    addGlobalStyle('.tip_comment_container, .fancybox-image {-webkit-filter: blur(0)}');
    window.videoServer = "https://www.fuehrerschein-lernsystem.de/videos/iOS/hd/"
    window.videoHDServer = "https://www.fuehrerschein-lernsystem.de/videos/iOS/hd/"
    window.videoLowServer = "https://www.fuehrerschein-lernsystem.de/videos/iOS/hd/"

    window.video_setting['afterLoad'] = null

    window.video_setting['autoHeight'] = false
    window.video_setting['height'] = 600





})();


function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}