// ==UserScript==
// @name         Google 搜索结果去除 CSDN
// @namespace    https://raw.githubusercontent.com/atever/browserfork/master/remove_csdn_for_google_result.js
// @version      0.1.1
// @description  remove_csdn_for_google_result.js
// @license      MIT License
// @author       ateveryuan@gmail.com
// @match        https://*.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390905/Google%20%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%8E%BB%E9%99%A4%20CSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/390905/Google%20%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%8E%BB%E9%99%A4%20CSDN.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var searchQuery = window.location.search;
    var reg = /(&q=|\?q=).*&oq=/;
    if(searchQuery.indexOf("csdn") === -1 && reg.test(searchQuery)) {
        window.location.href = addFWORD(searchQuery);
    }
    function addFWORD(searchQuery) {
        var str = searchQuery.split('&oq=');
        return str[0].concat('+-csdn&oq=').concat(str[1]);
    }
})();
