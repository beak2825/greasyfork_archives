// ==UserScript==
// @name         google中文搜索屏蔽繁体
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  google中文搜索结果中屏蔽繁体
// @author       You
// @run-at       document-start
// @match        *://*.google.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428626/google%E4%B8%AD%E6%96%87%E6%90%9C%E7%B4%A2%E5%B1%8F%E8%94%BD%E7%B9%81%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/428626/google%E4%B8%AD%E6%96%87%E6%90%9C%E7%B4%A2%E5%B1%8F%E8%94%BD%E7%B9%81%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log("start...");


    var str = decodeURI(window.location.toString());
    if(escape(str).indexOf("%u")>=0){

        if (window.location.search.indexOf('lr=lang_zh-CN') != -1) {
             return false; // already added
         }

        window.location = str+"&lr=lang_zh-CN";
    }
})();