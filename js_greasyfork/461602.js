// ==UserScript==
// @name         r2monkey - Download Reddit videos
// @namespace    https://github.com/jijirae/r2monkey
// @version      1.1
// @description  Pressing "SHIFT+D" opens the current Reddit video in RapidSave, allowing you to download.
// @author       jijirae
// @match        https://www.reddit.com/*
// @grant        none
// @icon         https://user-images.githubusercontent.com/122718637/224405235-151712ab-86d0-4c0e-98a0-ca353c850293.png
// @downloadURL https://update.greasyfork.org/scripts/461602/r2monkey%20-%20Download%20Reddit%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/461602/r2monkey%20-%20Download%20Reddit%20videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.shiftKey && event.key === 'D') {
            event.preventDefault();
            var currentUrl = window.location.href;
            var rapidsaveUrl = 'https://rapidsave.com/info?url=';
            window.open(rapidsaveUrl + currentUrl, '_blank');
        }
    });
})();