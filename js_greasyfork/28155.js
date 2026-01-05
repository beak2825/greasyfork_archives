// ==UserScript==
// @name         Zhihu Laji Search
// @namespace    https://github.com/cbozi/zhihu-laji-search
// @author       cbozi
// @version      0.1
// @description  Replace zhihu search button with google search
// @match       *://zhihu.com/*
// @match       *://*.zhihu.com/*
// @downloadURL https://update.greasyfork.org/scripts/28155/Zhihu%20Laji%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/28155/Zhihu%20Laji%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var google = "https://www.google.com/search";
    var bing = "http://www.bing.com/search";
    var baseURL = google;
    var site = " site:zhihu.com";

    // Your code here...
    var form = document.getElementById("zh-top-search-form");
    form.onsubmit = function(){
        var form = document.getElementById("zh-top-search-form");
        form.type.removeAttribute("name");
        form.setAttribute("action", baseURL);
        form.q.value += site;
    };
})();
