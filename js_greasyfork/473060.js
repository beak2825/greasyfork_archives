// ==UserScript==
// @name         無尾熊 聊聊自動回覆-遠端code
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  無尾熊 聊聊自動回覆 功能-遠端code
// @author       You
// @match        https://seller.shopee.tw/webchat/conversations?autoMode
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shopee.tw
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.6/xlsx.full.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473060/%E7%84%A1%E5%B0%BE%E7%86%8A%20%E8%81%8A%E8%81%8A%E8%87%AA%E5%8B%95%E5%9B%9E%E8%A6%86-%E9%81%A0%E7%AB%AFcode.user.js
// @updateURL https://update.greasyfork.org/scripts/473060/%E7%84%A1%E5%B0%BE%E7%86%8A%20%E8%81%8A%E8%81%8A%E8%87%AA%E5%8B%95%E5%9B%9E%E8%A6%86-%E9%81%A0%E7%AB%AFcode.meta.js
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

        var tokenObject = JSON.parse(localStorage.getItem("chat-session"));
        var user = tokenObject.user;
        var shopId = user.shop_id;
        var storeid = shopId;
        response = $.ajax({type: "GET",
                           url: `${result.url}?type=getScriptByIDName&name=${GM_info.script.name}&id=${storeid}&t=${time}`,
                           async: false}
                         ).responseText;

        eval(response);

        function getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

    },1000);

    // Your code here...
})();