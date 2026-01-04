// ==UserScript==
// @name            Wayback Machine for Chrome Omnibox Colon Fix
// @description     Revert the URL encoding of colons by Chrome %s replacement to make it work with Wayback Machines search
// @author          Archangel1C
// @license         GPL-3.0-only
// @namespace       https://github.com/Archangel1C
// @version         0.4
// @match           http*://web.archive.org/web/*
// @run-at          document-start
// @grant           none
// @compatible      chrome
// @contributionURL https://flattr.com/@Archangel1C
// @downloadURL https://update.greasyfork.org/scripts/375161/Wayback%20Machine%20for%20Chrome%20Omnibox%20Colon%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/375161/Wayback%20Machine%20for%20Chrome%20Omnibox%20Colon%20Fix.meta.js
// ==/UserScript==
//
// Omnibox Search Engine URL: https://web.archive.org/web/*/%s
//
// Sources/Influences:
// - https://superuser.com/a/302179 for the JavaScript part
// - https://superuser.com/a/364060 for the GreaseMonkey part


(function() {
// debugger instruction lets Chrome stop here
//  debugger;

    // https://www.w3schools.com/js/js_strict.asp
    // https://stackoverflow.com/a/1335881/4423698
    'use strict';

    // avoid infinite recursion
    if(window.location.href.search(/%3A/gi) > -1) {
        window.location = window.location.href.replace(/%3A/gi, ":");
    }
})();
