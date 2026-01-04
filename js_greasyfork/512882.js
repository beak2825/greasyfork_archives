// ==UserScript==
// @license MIT
// @name         Redirect to Random Wikipedia Article (Multiple Sites)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Redirects to a random Wikipedia article when visiting specific websites
// @author       Ohmu
// @match        https://www.youtube.com/shorts/*
// @match        https://www.m.youtube.com/shorts/*
// @match        https://youtube.com/shorts/*
// @match        https://m.youtube.com/shorts/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512882/Redirect%20to%20Random%20Wikipedia%20Article%20%28Multiple%20Sites%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512882/Redirect%20to%20Random%20Wikipedia%20Article%20%28Multiple%20Sites%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Check if the current page URL matches either target pattern
    if (window.location.href.match(/^https:\/\/www\.youtube\.com\/shorts\//) || 
        window.location.href.match(/^https:\/\/www\.m\.youtube\.com\/shorts\//) || 
        window.location.href.match(/^https:\/\/youtube\.com\/shorts\//) || 
        window.location.href.match(/^https:\/\/m\.youtube\.com\/shorts\//)) {
        // Redirect to a random Wikipedia article
        window.location.href = "https://en.wikipedia.org/wiki/Special:Random";
    }
})();
