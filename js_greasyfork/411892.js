// ==UserScript==
// @name         工时破解脚本3
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://gs-scgl.hnisi.com.cn/scpt/gzl/filltask/query_manageTaskCal.xhtml?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411892/%E5%B7%A5%E6%97%B6%E7%A0%B4%E8%A7%A3%E8%84%9A%E6%9C%AC3.user.js
// @updateURL https://update.greasyfork.org/scripts/411892/%E5%B7%A5%E6%97%B6%E7%A0%B4%E8%A7%A3%E8%84%9A%E6%9C%AC3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var func2 = window.openAddWindow;
    window.openAddWindow = function (url,title,height,width,isReload){
        func2(url,title,height,width,isReload);
        $('#simplemodal-container').css('z-index','1005');
        $('#simplemodal-data').remove();
    };
    // Your code here...
})();