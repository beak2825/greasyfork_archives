// ==UserScript==
// @name         Baidu Google Switcher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  add baidu -> google & google -> baidu capability
// @author       rhinoc
// @match        https://www.baidu.com/*
// @match        https://www.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420234/Baidu%20Google%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/420234/Baidu%20Google%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getQueryVariable(str) {
       var query = location.search.substring(1);
       var vars = query.split("&");
       for (var i = 0; i < vars.length; i++) {
           var pair = vars[i].split("=");
           if (pair[0] === str) return pair[1];
       }
       return false;
    }

    const BD_BASE = 'https://www.baidu.com/s?wd=';
    const GG_BASE = 'https://www.google.com/search?q=';
    const queryStr = getQueryVariable('q') || getQueryVariable('wd');

    function bd2gg() {
        document.getElementById("result_logo").href = GG_BASE + queryStr;
    }

    function gg2bd() {
        document.getElementById("logo").href = BD_BASE + queryStr;
    }

    location.host === "www.baidu.com" ? bd2gg() : gg2bd();
})();