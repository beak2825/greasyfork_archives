// ==UserScript==
// @name         YouTube TOOLS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  YouTube
// @author       https://vk.com/id168989031
// @match        https://www.tampermonkey.net/scripts.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389361/YouTube%20TOOLS.user.js
// @updateURL https://update.greasyfork.org/scripts/389361/YouTube%20TOOLS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var jherisYT;
    window.onkeyup = function(e) {
        if(e.code == "KeyQ") {
            if(!jherisYT) {
                jherisYT = true;
                var stYTyle = document.createElement('style');
                stYTyle.setAttribute('data-id', 'jjehrsd');
                stYTyle.innerHTML = '[theater] #player-theater-container #columns {margin-top: 39px} [theater] #player-theater-container .ytp-gradient-top {display: none!important} [theater] #player-theater-container .ytp-chrome-top {display: none!important} [theater] #player-theater-container .video-stream.html5-main-video {height: 100vh!important; width: 100vw!important; top: 0!important; left: 0!important} [theater] #player-theater-container {max-height: 100vh!important; height: 100vh!important} [theater] .ytp-chrome-bottom {width: 100vw!important; left: 0!important; opacity: 1!important; background: #000000} #masthead-container {display: none} ytd-page-manager {margin-top: 0!important} [theater] #player-theater-container #movie_player {height: calc(100vh + 39px)} *::-webkit-scrollbar {display: none}';
                document.head.appendChild(stYTyle);
            } else {
                jherisYT = false;
                for(var i = 0; i < document.head.getElementsByTagName('style').length + 1; i++) {
                    var element = document.head.getElementsByTagName('style')[i];
                    if(element.hasAttribute('data-id') && element.getAttribute('data-id') == "jjehrsd") {
                        element.remove();
                    }
                }
            }
        }
    }
})();