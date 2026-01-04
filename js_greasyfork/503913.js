// ==UserScript==
// @name         dアニメストア　ダブルクリックでフルスクリーン化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  dアニメストアの動画再生ページで画面をダブルクリックしたらフルスクリーンモードに変更します。
// @author       ChatGPT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=docomo.ne.jp
// @match        https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503913/d%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%B9%E3%83%88%E3%82%A2%E3%80%80%E3%83%80%E3%83%96%E3%83%AB%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%A7%E3%83%95%E3%83%AB%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/503913/d%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%B9%E3%83%88%E3%82%A2%E3%80%80%E3%83%80%E3%83%96%E3%83%AB%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%A7%E3%83%95%E3%83%AB%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to enter fullscreen mode
    function enterFullscreen() {
        let elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { // Safari
            elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) { // Firefox
            elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) { // IE/Edge
            elem.msRequestFullscreen();
        }
    }

    // Function to exit fullscreen mode
    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { // Safari
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }

    // Function to toggle fullscreen mode on body double click
    function toggleFullscreen(event) {
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
            exitFullscreen();
        } else {
            enterFullscreen();
        }
    }

    // Add event listener to the body for double click
    document.body.addEventListener('dblclick', toggleFullscreen);

    console.log("Tampermonkey script for fullscreen toggle initialized.");
})();
