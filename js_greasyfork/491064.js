// ==UserScript==
// @name         Redirect IMDB Cast links to Mobile
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replaces all the links to view the cast of an IMDB title with the mobile version of the site because the mobile version has better formatting, but redirect back to desktop for the media gallery because that one is better
// @author       You
// @match        https://www.imdb.com/*
// @match        https://m.imdb.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imdb.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491064/Redirect%20IMDB%20Cast%20links%20to%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/491064/Redirect%20IMDB%20Cast%20links%20to%20Mobile.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var links = document.querySelectorAll('a[href*="fullcredits/cast"]');
    links.forEach(function(thing) {thing.href = thing.href.replace("www","m")});

    links = document.querySelectorAll('a[href*="mediaindex"]');
    links.forEach(function(thing) {thing.href = thing.href.replace("//m.","//www.")});
})();