// ==UserScript==
// @name         Solo Chaptering
// @namespace    http://hermanfassett.me
// @version      0.1
// @description  Fix next/previous links
// @author       Herman Fassett
// @match        https://sololeveling.net/manga/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399114/Solo%20Chaptering.user.js
// @updateURL https://update.greasyfork.org/scripts/399114/Solo%20Chaptering.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fix links for chapters
    // Get the select dropdown for previous/next links
    const $select = jQuery(".controls select");

    // Extract links from select dropdown
    const previousChapter = $select[0].options[$select[0].selectedIndex + 1].value;
    const nextChapter = $select[0].options[$select[0].selectedIndex - 1].value;

    // Get the previous/next buttons (lol they misspelled controls class on the bottom controls div)
    const $previousButtons = jQuery(".controls [rel=prev], .contorls [rel=prev]");
    const $nextButtons = jQuery(".controls [rel=next], .contorls [rel=next]");

    // Now update button links!
    $previousButtons.attr("href", previousChapter);
    $nextButtons.attr("href", nextChapter);

    // Get back to reading kid
})();