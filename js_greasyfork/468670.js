// ==UserScript==
// @name         KBin Links in New Tab
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Small script for kbin.social to open non-kbin links in a new tab
// @author       miroppb
// @match        https://kbin.social/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kbin.social
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468670/KBin%20Links%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/468670/KBin%20Links%20in%20New%20Tab.meta.js
// ==/UserScript==

var $ = window.jQuery;
/* globals jQuery */

$(document).ready(function() {
    var all = $('a');
    for (var a = 0; a < all.length; a++)
    {
        if ($(all[a]).attr('href').indexOf('kbin.social') == -1 && $(all[a]).attr('href').slice(0,1) != '/')
        {
            $(all[a]).attr('target', '_blank');
        }
    }
});