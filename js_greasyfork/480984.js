// ==UserScript==
// @name         無尾熊更新叫貨單-遠端code
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  無尾熊更新叫貨單 功能-遠端code
// @author       You
// @match        https://ec.mallbic.com/Module/2_Inventory/Inventory_Entry.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mallbic.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.6/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/480984/%E7%84%A1%E5%B0%BE%E7%86%8A%E6%9B%B4%E6%96%B0%E5%8F%AB%E8%B2%A8%E5%96%AE-%E9%81%A0%E7%AB%AFcode.user.js
// @updateURL https://update.greasyfork.org/scripts/480984/%E7%84%A1%E5%B0%BE%E7%86%8A%E6%9B%B4%E6%96%B0%E5%8F%AB%E8%B2%A8%E5%96%AE-%E9%81%A0%E7%AB%AFcode.meta.js
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

        var storeid = getCookie("usale_login_store_id");
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