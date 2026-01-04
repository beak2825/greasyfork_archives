// ==UserScript==
// @name         Remove learncpp ADS
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove learncpp ADS or ads blank area
// @author       You
// @match        https://www.learncpp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=learncpp.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473366/Remove%20learncpp%20ADS.user.js
// @updateURL https://update.greasyfork.org/scripts/473366/Remove%20learncpp%20ADS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('span.ezoic-ad').forEach(d=>d.remove());
    
})();