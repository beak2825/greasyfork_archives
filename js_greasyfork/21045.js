// ==UserScript==
// @name         Sankaku Channel Fast Pagination
// @namespace    http://tampermonkey.net/
// @version      20200726
// @description  Disable the thumbnail loading delay on scroll
// @author       Couchy
// @match        https://chan.sankakucomplex.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/21045/Sankaku%20Channel%20Fast%20Pagination.user.js
// @updateURL https://update.greasyfork.org/scripts/21045/Sankaku%20Channel%20Fast%20Pagination.meta.js
// ==/UserScript==

/* jshint esnext: true */
(function() {
    'use strict';
    const realSetTimeout = window.setTimeout;
    window.setTimeout = function(...args){
        const funcStr = args[0].toString();
        if(funcStr.includes("FADE_IN_DURATION")) {
            args[1] = 0;
        }
        return realSetTimeout(...args);
    };
})();