// ==UserScript==
// @name         2022安全教育平台课程中心答题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  安全教育平台 自动答题
// @author       You
// @match        https://*.xueanquan.com/html/jt/*
// @icon         
// @license     GPL License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445693/2022%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%AF%BE%E7%A8%8B%E4%B8%AD%E5%BF%83%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/445693/2022%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%AF%BE%E7%A8%8B%E4%B8%AD%E5%BF%83%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {

    'use strict';

    window.addEventListener ("load", pageFullyLoaded);
    function pageFullyLoaded () {
        console.log ("==> Page is fully loaded, including images.", new Date() );
        setTimeout(alertFunc, 1000);

        function alertFunc() {

            $("input[type=radio][value='1']").attr("checked","checked");

        }

    }

    // Your code here...
})();