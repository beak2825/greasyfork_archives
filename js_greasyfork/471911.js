// ==UserScript==
// @name         無尾熊 低庫存 提醒-遠端code
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  無尾熊 低庫存 提醒 功能-遠端code
// @author       You
// @match        https://ec.mallbic.com/Module/2_Good/Good_Entry.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mallbic.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.6/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/471911/%E7%84%A1%E5%B0%BE%E7%86%8A%20%E4%BD%8E%E5%BA%AB%E5%AD%98%20%E6%8F%90%E9%86%92-%E9%81%A0%E7%AB%AFcode.user.js
// @updateURL https://update.greasyfork.org/scripts/471911/%E7%84%A1%E5%B0%BE%E7%86%8A%20%E4%BD%8E%E5%BA%AB%E5%AD%98%20%E6%8F%90%E9%86%92-%E9%81%A0%E7%AB%AFcode.meta.js
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