// ==UserScript==
// @name         Reddit URL Parameter Remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes "?tl=xx" from Reddit URLs
// @author       creatzs
// @match        *://*.reddit.com/*
// @match        *://reddit.com/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/533264/Reddit%20URL%20Parameter%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/533264/Reddit%20URL%20Parameter%20Remover.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    location.href = location.href.replace('?tl=*', '')
})();
