// ==UserScript==
// @name         DuckDuckGo: Default to past year
// @namespace    adamw.uk
// @version      1.2
// @description  Make DuckDuckGo (DDG) default to showing results from the past year.
// @author       Adam W
// @match        https://duckduckgo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418750/DuckDuckGo%3A%20Default%20to%20past%20year.user.js
// @updateURL https://update.greasyfork.org/scripts/418750/DuckDuckGo%3A%20Default%20to%20past%20year.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = window.location.href;
    
    if (url.indexOf('&df=') == -1) {
        var newurl = url + '&df=y';
        window.location.replace(newurl);
    }
})();