// ==UserScript==
// @name         Youtube Control Hider
// @namespace    http://tampermonkey.net/
// @version      0.18
// @description  Removes the controls bar that appears upon pause when the h button is pressed.
// @author       Kaanium
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473989/Youtube%20Control%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/473989/Youtube%20Control%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elementsHidden = false;
    var _top, top_grad, _bottom, bottom_grad, brand_image, _shorts;


    function checkElements() {
        if (document.URL.includes('live_chat_replay')) {
            return;
        }
        addKeyListener();
    }

    function isYouTubeShortsLink() {
        const shortsRegex = /youtube\.com\/shorts\//i;
        return shortsRegex.test(window.location.href);
    }

    function getElements() {
        _top = document.querySelector(".ytp-chrome-top");
        top_grad = document.querySelector(".ytp-gradient-top");
        _bottom = document.querySelector(".ytp-chrome-bottom");
        bottom_grad = document.querySelector(".ytp-gradient-bottom");
        brand_image = document.querySelector(".branding-img");
        _shorts = document.querySelectorAll("ytd-reel-player-header-renderer");
    }

    function addKeyListener() {
        document.addEventListener('keydown', function(event) {
            if (event.key === "h" || event.key === "H") {
                if (elementsHidden) {
                    showElements();
                } else {
                    hideElements();
                }
                elementsHidden = !elementsHidden;
            }
        });
    }

    function updateElements(string) {
        getElements();
        _top.style.visibility = string;
        top_grad.style.visibility = string;
        _bottom.style.visibility = string;
        bottom_grad.style.visibility = string;
        if(brand_image) {
            brand_image.style.visibility = string;
        }
        for (var i = 0; i < _shorts.length; ++i) {
            _shorts[i].style.visibility = string;
        }
    }

    function hideElements() {
        updateElements('hidden');
    }

    function showElements() {
        updateElements('visible');
    }

    function waitForLink(callback) {
        if ((window.location.pathname === "/watch" || isYouTubeShortsLink()) && document.readyState === "complete") {
                callback();
        } else {
            setTimeout(function() {
                waitForLink(callback);
            }, 50);
        }
    }

    waitForLink(checkElements);

})();
