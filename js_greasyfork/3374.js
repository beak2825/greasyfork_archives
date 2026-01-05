// ==UserScript==
// @name         Hacker News Search
// @namespace    http://www.ryangittins.com/
// @author       Ryan Gittins
// @version      1.0.3
// @description  Adds a simple search box to the top bar of the Hacker News site.
// @match        *://news.ycombinator.com/*
// @copyright    2014
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/3374/Hacker%20News%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/3374/Hacker%20News%20Search.meta.js
// ==/UserScript==

// Grab the top bar
var selector = document.querySelector('td > table > tbody > tr');

// Insert a new td between the submit link and the login link
var cell = selector.insertCell(2);

// Inject the search box html into the header
cell.innerHTML = '<span><form method="get" action="//hn.algolia.com/" style="margin:0;"><input style="height:20px;" type="text" name="q" size="16" placeholder="Search"></form></span>';