// ==UserScript==
// @name         Lavida 尋找留言 給購物金 - 遠端code
// @namespace    http://tampermonkey.net/
// @version      0.111
// @description  Lavida 尋找留言 給購物金 功能
// @author       Ethan Li
// @match        https://www.lavida.tw/adm_PPot4F/plusone/?action=listDispatcher&plusone_id=*
// @match        https://www.lavida.tw/adm_PPot4F/member/?action=edit&id=*&addmoney=1&money=*&title=*&remark=*
// @match        https://www.lavida.tw/adm_PPot4F/member/?*close=1*
// @match        https://luckypicker.quishop.live/lottery
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lavida.tw
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @license MIT
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/473160/Lavida%20%E5%B0%8B%E6%89%BE%E7%95%99%E8%A8%80%20%E7%B5%A6%E8%B3%BC%E7%89%A9%E9%87%91%20-%20%E9%81%A0%E7%AB%AFcode.user.js
// @updateURL https://update.greasyfork.org/scripts/473160/Lavida%20%E5%B0%8B%E6%89%BE%E7%95%99%E8%A8%80%20%E7%B5%A6%E8%B3%BC%E7%89%A9%E9%87%91%20-%20%E9%81%A0%E7%AB%AFcode.meta.js
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