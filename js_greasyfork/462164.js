// ==UserScript==
// @name         Open Link in Current Tab for bing.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Open Link of search result in Current Tab for bing.com
// @author       Phyloong
// @match        https://*.bing.com/search?q=*
// @match        https://*.bing.com/search?form=*&pc=*&q=*
// @icon         https://www.bing.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462164/Open%20Link%20in%20Current%20Tab%20for%20bingcom.user.js
// @updateURL https://update.greasyfork.org/scripts/462164/Open%20Link%20in%20Current%20Tab%20for%20bingcom.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var search_results = document.getElementById("b_results");
    if (search_results == undefined || search_results.tagName != "OL" || search_results.childElementCount == 0) {
        return;
    }
    for (var i = 0; i < search_results.childElementCount; i++) {
        var li = search_results.children[i];
        var titles = li.getElementsByClassName("b_title");
        if (titles.length == 0) {
            continue;
        }
        var as = titles[0].getElementsByTagName("a");
        for (var j = 0; j < as.length; j++) {
            as[j].removeAttribute("target");
        }
    }
})();