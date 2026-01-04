// ==UserScript==
// @name         Fandom wikis sidebar cleanup
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  No description for you
// @author       aolko
// @license      GPL-3.0-or-later
// @match        *://fandom.com*
// @match        *://*.fandom.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fandom.com
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/458252/Fandom%20wikis%20sidebar%20cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/458252/Fandom%20wikis%20sidebar%20cleanup.meta.js
// ==/UserScript==

/* globals $ */
var $ = window.jQuery;

function cleanup_sidebar(){
    $(`body > div.global-navigation > div.global-navigation__top > .global-navigation__nav > .global-navigation__links > a:not(:last-child), body > div.global-navigation > div.global-navigation__top > .global-navigation__nav > .global-navigation__links > .wds-dropdown`).remove();
}


$(function() {
    cleanup_sidebar();
});

(function() {
    'use strict';
    console.log('You are running fandom wiki sidebar cleanup userscript');
})();