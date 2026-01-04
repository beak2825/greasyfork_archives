// Enhance titles - YouTube
//
// Hide watched videos on YouTube
//
// https://greasyfork.org/scripts/390633-enhance-titles-youtube
// Copyright (C) 2019, Guido Villa
//
// For information/instructions on user scripts, see:
// https://greasyfork.org/help/installing-user-scripts
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name            Enhance titles - YouTube
// @description     Hide watched videos on YouTube
// @version         1.4
// @author          guidovilla
// @date            01.11.2019
// @copyright       2019, Guido Villa (https://greasyfork.org/users/373199-guido-villa)
// @license         GPL-3.0-or-later
// @homepageURL     https://greasyfork.org/scripts/390633-enhance-titles-youtube
// @supportURL      https://gitlab.com/gv-browser/userscripts/issues
// @contributionURL https://tinyurl.com/gv-donate-72
//
// @namespace       https://greasyfork.org/users/373199-guido-villa
//
// @match           https://www.youtube.com/*
//
// @require         https://greasyfork.org/scripts/391648/code/userscript-utils.js
// @require         https://greasyfork.org/scripts/390248/code/entry-list.js
// @downloadURL https://update.greasyfork.org/scripts/390633/Enhance%20titles%20-%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/390633/Enhance%20titles%20-%20YouTube.meta.js
// ==/UserScript==
//
// --------------------------------------------------------------------
//
// To-do (priority: [H]igh, [M]edium, [L]ow):
//   - [L] hide selective titles?
//
// Changelog:
// ----------
// 2019.11.01 [1.4] Cleanups&optimizations
// 2019.10.05 [1.3] Fix completion status appearing later (after ELProcessed)
// 2019.10.03 [1.2] Refactor using EntryList library
// 2019.09.30 [1.1] First public version, correct @namespace and other headers
// 2019.06.17 [1.0] First version
//
// --------------------------------------------------------------------

/*jshint -W008 */
/* global EL: readonly */

(function() {
    'use strict';

    /* BEGIN CONTEXT DEFINITION */

    var youtube = EL.newContext('YouTube');


    youtube.getPageEntries = function() {
        return document.querySelectorAll('a#thumbnail');
    };


    youtube.isValidEntry = function(entry) {
        var st = entry.querySelector('#overlays');
        return !!(st && st.innerHTML);
    };


    youtube.determineType = function(_I_lists, _I_entryData, entry) {
        var st = entry.querySelector('#overlays #progress');
        return (st && st.style.width == "100%");
    };


    youtube.processItem = function(entry, _I_entryData, _I_processingType) {
        entry.style.opacity = .1;
    };

    /* END CONTEXT DEFINITION */



    //-------- "main" --------
    EL.startup(youtube);

})();
