// ==UserScript==
// @name         Lavida 尋找未付款名單 - 遠端code
// @namespace    http://tampermonkey.net/
// @version      0.111
// @description  Lavida 尋找未付款名單 功能
// @author       Ethan Li
// @match        https://www.lavida.tw/adm_PPot4F/plusone/?*plusone_id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lavida.tw
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @license MIT
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/482931/Lavida%20%E5%B0%8B%E6%89%BE%E6%9C%AA%E4%BB%98%E6%AC%BE%E5%90%8D%E5%96%AE%20-%20%E9%81%A0%E7%AB%AFcode.user.js
// @updateURL https://update.greasyfork.org/scripts/482931/Lavida%20%E5%B0%8B%E6%89%BE%E6%9C%AA%E4%BB%98%E6%AC%BE%E5%90%8D%E5%96%AE%20-%20%E9%81%A0%E7%AB%AFcode.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    setTimeout(()=>{
 
        var time = new Date().getTime();
 
        var response = $.ajax({type: "GET",
                               url: `https://script.google.com/macros/s/AKfycbzsh3G3Z1I66_eSpTmbtdRzSBKH_mPsFwCqXwF2libt7FLE1vyJSZSx0EkyHaO8UHzsdw/exec?type=queryUrl&t=${time}`,
                               async: false}
                             ).responseText;
        var result = JSON.parse(response);
 
        response = $.ajax({type: "GET",
                           url: `${result.url}?type=getScriptByName&name=${GM_info.script.name}&t=${time}`,
                           async: false}
                         ).responseText;
 
        eval(response);
 
    },1000);
    // Your code here...
})();