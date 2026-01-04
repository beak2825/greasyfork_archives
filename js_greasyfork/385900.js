// ==UserScript==
// @name         last.fm language redirect
// @version      0.1.2
// @description  Redirects to the page of the own language
// @author       CennoxX
// @namespace    https://greasyfork.org/users/21515
// @homepage     https://github.com/CennoxX/userscripts
// @supportURL   https://github.com/CennoxX/userscripts/issues/new?title=[Last.fm%20language%20redirect]%20
// @match        https://www.last.fm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=last.fm
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/385900/lastfm%20language%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/385900/lastfm%20language%20redirect.meta.js
// ==/UserScript==
/* jshint esversion: 10 */
/* eslint quotes: ["warn", "double", {"avoidEscape": true}] */
/* eslint curly: "off" */

(function() {
    "use strict";
    var userLang = navigator.language.split("-")[0];
    var availableLangs = /\b(de|es|fr|it|ja|pl|pt|ru|sv|tr|zh|en)\b/;
    if (availableLangs.test(userLang)){
        var pageLang = document.URL.split('/')[3];
        if (userLang!=pageLang)
        {
            window.location.replace("https://www.last.fm/" + userLang + document.URL.substr(availableLangs.test(pageLang)?22:19));
        }
    }
})();
