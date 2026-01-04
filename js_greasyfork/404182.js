// ==UserScript==
// @name         百度文库自动签到
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  百度文库自动签到，跳转到百度首页并关闭
// @author       yuexiawode
// @match        https://wenku.baidu.com/task/browse/daily
// @match        https://www.baidu.com/
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/404182/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/404182/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    function log() {
        if (document.location.href == "https://wenku.baidu.com/task/browse/daily") {
            var gbtnno=document.getElementsByClassName("g-btn-no")[0];
            if (gbtnno.textContent != "已签到") {
                GM_setValue("isclose", "0");
                gbtnno.click();
            }
            else {
                if (GM_getValue("isclose") == "0") window.open("https://www.baidu.com/", "_self");
            }
        }
        else {
            setTimeout(function () {
                if (GM_getValue("isclose") == "0") {
                    GM_setValue("isclose", "1");
                    window.close();
                }
            }, 300);
        }
    }
    setTimeout(log(), 300);
})();