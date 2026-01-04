// ==UserScript==
// @name         ResetEra Thread Title Last Unread
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Changes thread titles to link to the last unread post, rather than the first page
// @author       A Spooky Ghost
// @match        https://www.resetera.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36490/ResetEra%20Thread%20Title%20Last%20Unread.user.js
// @updateURL https://update.greasyfork.org/scripts/36490/ResetEra%20Thread%20Title%20Last%20Unread.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Boo its me a spooky ghost");

    // set unread as the default title link
    $('h3.title').each(function() {

        var titleLink = $('a', this).not('.unreadLink');
        var opLink = titleLink.attr('href');

        titleLink.attr('href', opLink + "unread");
    }
                      );
})();