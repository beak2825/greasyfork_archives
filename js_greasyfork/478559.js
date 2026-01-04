// ==UserScript==
// @name         Anilibria remove AD
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes intrusive AD and metrics from anilibria website
// @author       Lunat1q
// @match        https://www.anilibria.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilibria.tv
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478559/Anilibria%20remove%20AD.user.js
// @updateURL https://update.greasyfork.org/scripts/478559/Anilibria%20remove%20AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let adElements = document.querySelectorAll('[data-cfasync]');
    adElements.forEach((e) => e.remove());

    setInterval(
        function() {
            let adElements2 = document.querySelectorAll('[async]');
            adElements2.forEach((e) => e.remove());
    }, 1000);
})();