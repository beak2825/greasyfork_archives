// ==UserScript==
// @name         Youtube Middle Mouse Mute
// @namespace https://github.com/Klawneb
// @version      0.2
// @description  Mute the Youtube player by clicking middle mouse
// @author       Klawneb
// @match        https://www.youtube.com/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/3/3f/Mute_Icon.svg
// @grant        none
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/450252/Youtube%20Middle%20Mouse%20Mute.user.js
// @updateURL https://update.greasyfork.org/scripts/450252/Youtube%20Middle%20Mouse%20Mute.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var playerContainer;
    var hoveringOver = false;
    if (document.querySelector('#movie_player > div.html5-video-container > video') != null) {
        playerContainer = document.querySelector('#movie_player > div.html5-video-container > video');
        playerContainer.addEventListener("mouseenter", function(event) {
                    console.log("entered");
                    hoveringOver = true;
                });
                playerContainer.addEventListener("mouseleave", function(event) {
                    hoveringOver = false;
                });
    }
    else {
        document.addEventListener("DOMNodeInserted", function(event) {
            if (event.target.id === '#movie_player > div.html5-video-container > video') {
                playerContainer = document.querySelector('#movie_player > div.html5-video-container > video');
                playerContainer.addEventListener("mouseenter", function(event) {
                    console.log("entered");
                    hoveringOver = true;
                });
                playerContainer.addEventListener("mouseleave", function(event) {
                    hoveringOver = false;
                });
            }
        });
    }
    document.addEventListener("mousedown", function(event) {
        if (event.button === 1) {
            if (hoveringOver) {
                event.preventDefault();
                document.querySelector('.ytp-mute-button').click();
            }
        }
    });
})();