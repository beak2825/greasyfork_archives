// ==UserScript==
// @name          Test
// @namespace     https://github.com/iHydra
// @version       1.5.7.112
// @description   Test1
// @include       http*://www.hackforums.net/*
// @include       http*://hackforums.net/*
// @author        Test
// @contributor   Hash G.
// @contributor   Kondax
// @contributor   Sasori
// @contributor   Yani
// @require       https://code.jquery.com/jquery-2.1.4.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.8.0/highlight.min.js
// @resource      MainCSS https://raw.githubusercontent.com/iHydra/flatdarkness/master/userscript/stylesheet_1.5.7.css
// @resource      HLCSS https://raw.githubusercontent.com/isagalaev/highlight.js/master/src/styles/monokai-sublime.css
// @grant         GM_addStyle
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_getResourceText
// @run-at        document-ready
// @downloadURL https://update.greasyfork.org/scripts/32769/Test.user.js
// @updateURL https://update.greasyfork.org/scripts/32769/Test.meta.js
// ==/UserScript==
function injectHideLocation() {
    // Credit: Emlybus
    if (document.URL.indexOf("www.") != -1) {
        $.get("https://www.hackforums.net/misc.php", function () { });
    } else {
        $.get("https://hackforums.net/misc.php", function () { });
    }
}