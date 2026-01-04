// ==UserScript==
// @name         Auto start Nekto.me Audiochat
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirects from /peer to /searching on Nekto.me Audiochat when the button appears
// @author       enne
// @match        https://nekto.me/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488921/Auto%20start%20Nektome%20Audiochat.user.js
// @updateURL https://update.greasyfork.org/scripts/488921/Auto%20start%20Nektome%20Audiochat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function redirectToSearching() {
        window.location.href = 'https://nekto.me/audiochat#/searching';
    }

    const checkButtonInterval = setInterval(() => {
        const startButton = document.querySelector('.go-scan-button');
        if (startButton) {

            redirectToSearching();
        }
    }, 1000);

})();
