// ==UserScript==
// @name         ColoredMercury
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Adds site's colors to the mobile skin of FANDOM
// @author       Unai Mengual
// @match        http://*.wikia.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/31015/ColoredMercury.user.js
// @updateURL https://update.greasyfork.org/scripts/31015/ColoredMercury.meta.js
// ==/UserScript==

jQuery(function () {
    'use strict';
    if (!jQuery('body').hasClass('mobile-wiki')) {
        return;
    }
    jQuery.get('/__load/-/only=scripts&skin=oasis/startup', function (startup) {
        var color = startup.replace(/[\s\S]*color-buttons":"(#[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})[\s\S]*/, '$1');
        jQuery('.wiki-page-header:not(.has-hero-image), .portable-infobox  .pi-secondary-background')
            .css('background', color);
        jQuery('.edit-section .icon').not('.wiki-page-header__wrapper .edit-section .icon')
            .css('fill', color + '!important');
    });
});
