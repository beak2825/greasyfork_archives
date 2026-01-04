// ==UserScript==
// @name         隔壁网自动签到
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       sugarzhang
// @match        http://www.gebi1.com/portal.php
// @include      *://www.gebi1.com*
// @grant        GM_addStyle
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://cdn.bootcss.com/sweetalert/2.1.2/sweetalert.min.js
// @require      https://code.jquery.com/jquery-latest.js
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/394718/%E9%9A%94%E5%A3%81%E7%BD%91%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/394718/%E9%9A%94%E5%A3%81%E7%BD%91%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //登录状态下，寻找上方头像的签到按钮并点击
    document.querySelector('#qing_user_menu > a:nth-child(6)').onclick();
    //等待签到面板出现，选择心情开心并点击
    setTimeout(function(){
        document.querySelector('#kx').onclick();
    },2000);
    //点击签到按钮
    setTimeout(function(){
        document.querySelector('#qiandao > p > button').onclick();
    },3000);

})();