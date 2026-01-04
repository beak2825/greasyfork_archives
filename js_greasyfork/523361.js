// ==UserScript==
// @name         LIFEHACK - make jioSaavn lyrics copyable
// @namespace    http://tampermonkey.net/
// @version      2024-07-01
// @description  JioSaavn has disable user select of lyrics on the Website this plugin enables it.
// @author       You
// @match        https://www.jiosaavn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jiosaavn.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523361/LIFEHACK%20-%20make%20jioSaavn%20lyrics%20copyable.user.js
// @updateURL https://update.greasyfork.org/scripts/523361/LIFEHACK%20-%20make%20jioSaavn%20lyrics%20copyable.meta.js
// ==/UserScript==

// Eanble user-select on jio saavn
(function() {
    'use strict';

    // Your code here...
    var elements = document.querySelectorAll('.u-disable-select');

    // Loop through each element and remove the class
    elements.forEach(function(element) {
        element.classList.remove('u-disable-select');
    });
})();