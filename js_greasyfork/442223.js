// ==UserScript==
// @name         页面自动刷新
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  页面自动刷新：自动刷新页面
// @author       wll
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @icon         https://img-blog.csdnimg.cn/20181221195058594.gif
// @match        http://jira.square.life:8080/secure/shdsd-TimeWise-TimeSheet.jspa
// @match        http://172.18.100.162:8080/job/zengyuan/
// @grant        GM_registerMenuCommand
// @run-at       document-body
// @note         授权联系：	leiwang2010@163.com
// @note         版本更新	22-03-25 0.0.1	页面自动刷新：自动刷新页面


// @downloadURL https://update.greasyfork.org/scripts/442223/%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/442223/%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function initMenu(){
        var html =
        '<meta http-equiv="refresh" content="8" />'
		+'<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />'
		+'<meta http-equiv="Pragma" content="no-cache" />'
		+'<meta http-equiv="Expires" content="0" />'
        $('head').append(html);
    }

    window.setInterval(function() {initMenu();}, 10*1000);

})();