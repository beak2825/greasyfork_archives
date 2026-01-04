// ==UserScript==
// @name         Google site search on IThome
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将IT之家搜索替换为谷歌site语法搜索
// @author       entr0pia, ChatGPT
// @match        https://www.ithome.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463437/Google%20site%20search%20on%20IThome.user.js
// @updateURL https://update.greasyfork.org/scripts/463437/Google%20site%20search%20on%20IThome.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var btns = document.getElementsByName("sa");

    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function(e) {
            e.preventDefault();
            var searchQuery = "site:ithome.com " + encodeURIComponent(document.querySelector('input[name="q"]').value);
            window.open("https://www.google.com/search?q=" + searchQuery, "_blank");
        });
    }

})();
