// ==UserScript==
// @name         Mobile Metacritic critic page
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        http://*.metacritic.com/movie/*
// @exclude        http://*.metacritic.com/movie/*/critic-reviews
// @run-at              (document-end || document-start || document-ready)
// @use-greasemonkey true
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30757/Mobile%20Metacritic%20critic%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/30757/Mobile%20Metacritic%20critic%20page.meta.js
// ==/UserScript==

//alert('h');
    window.open(window.location.href + '/critic-reviews');
    
// Your code here