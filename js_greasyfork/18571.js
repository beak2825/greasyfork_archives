// ==UserScript==
// @name         Rightmove/Zoopla title shortener
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove "<n> bed <type> for sale in" from the page title on Rightmove and Zoopla, leaving just the address.
// @author       Alex Willmer
// @match        http://www.rightmove.co.uk/property-for-sale/*
// @match        http://www.zoopla.co.uk/for-sale/details/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18571/RightmoveZoopla%20title%20shortener.user.js
// @updateURL https://update.greasyfork.org/scripts/18571/RightmoveZoopla%20title%20shortener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.title = document.title.replace(/([0-9] (bed|bedroom) )?([Hh]ouse|[Ff]lat|[Aa]partment|[Pp]roperty) for sale in /, '');
})();