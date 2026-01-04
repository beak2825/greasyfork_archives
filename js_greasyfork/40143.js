// ==UserScript==
// @name         Filter out Peanut Butters
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       (You)
// @match        http://boards.4chan.org/*/thread/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40143/Filter%20out%20Peanut%20Butters.user.js
// @updateURL https://update.greasyfork.org/scripts/40143/Filter%20out%20Peanut%20Butters.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Array.from(document.querySelectorAll('.n-atb-3')).forEach(x => x.parentNode.parentNode.parentNode.parentNode.style.display = 'none');
})();