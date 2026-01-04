// ==UserScript==
// @name         LUOA BigBlueButton Fix
// @namespace    http://tampermonkey.net/
// @version      2024-01-05
// @description  -
// @author       -
// @match        http*://luoa.instructure.com/courses/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instructure.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483959/LUOA%20BigBlueButton%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/483959/LUOA%20BigBlueButton%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    for (var elementIndex in document.getElementsByClassName('conferences')) {
        const element = document.getElementsByClassName('conferences')[elementIndex];
        element.tagName === 'A' ? element.textContent = 'Conferences' : {};
    }
})();