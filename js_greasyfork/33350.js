// ==UserScript==
// @name         Geocaching + ProjectGC + Style
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Some small design changes when using ProjectGC with Geocaching
// @author       Martin Jahn
// @match        https://www.geocaching.com/geocache/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33350/Geocaching%20%2B%20ProjectGC%20%2B%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/33350/Geocaching%20%2B%20ProjectGC%20%2B%20Style.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('head').append('<link rel="stylesheet" type="text/css" href="https://caching.martinjahn.org/projectgc-geocaching-custom.css">');

})();