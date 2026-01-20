// ==UserScript==
// @name         Twitch - Expand your followed channels list automatically
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Expand your followed channels list automatically with settings
// @author       Jens Nordström
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454542/Twitch%20-%20Expand%20your%20followed%20channels%20list%20automatically.user.js
// @updateURL https://update.greasyfork.org/scripts/454542/Twitch%20-%20Expand%20your%20followed%20channels%20list%20automatically.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // -------------------------------------- SETTINGS -------------------------------------- //
    // Change expandAmount to set how many times the followed channel list should be expanded //
    // -------------------------------------------------------------------------------------- //

    var expandAmount = 3;

    // Wait for the DOM to load
    function waitForElement(querySelector, timeout) {
        return new Promise((resolve, reject) => {
            var timer = false;
            if (document.querySelectorAll(querySelector).length) return resolve();
            const observer = new MutationObserver(() => {
                if (document.querySelectorAll(querySelector).length) {
                    observer.disconnect();
                    if (timer !== false) clearTimeout(timer);
                    return resolve();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    // Initialize
    function clickExpandButton() {
      waitForElement(".side-nav-show-more-toggle__button", 0).then(function() {

        for (var i = 0; i < expandAmount; i++) {
          document.querySelector(".side-nav-show-more-toggle__button > button").click();
        }
      })
    };

    // Run and expand per expandAmount value
    var NumberOfClick = expandAmount;
    var interval = 1000;

    for (var i = 0; i < NumberOfClick; i++) {
      setTimeout(function() {
        clickExpandButton();
      }, i * interval)
    }

})();