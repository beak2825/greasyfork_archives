// ==UserScript==
// @name         8chan Auto-Catalog Redirect
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically redirects from 8chan.se board pages to their catalog
// @author       You
// @match        *://8chan.se/*
// @match        *://8chan.moe/*
// @match        *://8chan.cc/*
// @match        *://alephchvkipd2houttjirmgivro5pxullvcgm4c47ptm7mhubbja6kad.onion/*
// @exclude      /^*:\/\/(8chan\.se|8chan\.moe|8chan\.cc|alephchvkipd2houttjirmgivro5pxullvcgm4c47ptm7mhubbja6kad\.onion)\/.*\..*$/
// @exclude      /^*:\/\/(8chan\.se|8chan\.moe|8chan\.cc|alephchvkipd2houttjirmgivro5pxullvcgm4c47ptm7mhubbja6kad\.onion)\/.*\/.*\..*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536122/8chan%20Auto-Catalog%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/536122/8chan%20Auto-Catalog%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get current URL
    var currentUrl = window.location.href;

    // Check if we're on a board page that's not already the catalog
    if (currentUrl.match(/8chan\.se\/[^\/]+\/?$/) ||
        currentUrl.match(/8chan\.moe\/[^\/]+\/?$/) ||
        currentUrl.match(/8chan\.cc\/[^\/]+\/?$/) ||
        currentUrl.match(/alephchvkipd2houttjirmgivro5pxullvcgm4c47ptm7mhubbja6kad\.onion\/[^\/]+\/?$/) ) {
        // Redirect to catalog
        window.location.href = currentUrl.replace(/\/?$/, '/catalog.html');
    }
})();

// @match        https://8chan.se/*
// @match        https://8chan.moe/*
// @exclude      https://8chan.se/*.js
// @exclude      https://8chan.se/*.php
// @exclude      https://8chan.se/*.html
// @exclude      https://8chan.se/*/catalog.html
// @exclude      https://8chan.se/*/thread/*
// @exclude      https://8chan.se/*/res/*
// @exclude      https://8chan.moe/*.js
// @exclude      https://8chan.moe/*.php
// @exclude      https://8chan.moe/*.html
// @exclude      https://8chan.moe/*/catalog.html
// @exclude      https://8chan.moe/*/thread/*
// @exclude      https://8chan.moe/*.html
// @exclude      https://8chan.moe/*/res/*