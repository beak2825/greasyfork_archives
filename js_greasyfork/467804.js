// ==UserScript==
// @name         星星改條碼
// @namespace    http://tampermonkey.net/
// @version      0.221
// @description  星星改條碼 調整修碼大小
// @author       You
// @match        https://ec.mallbic.com/Module/T_emplate/GridPrintPage.htm?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mallbic.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467804/%E6%98%9F%E6%98%9F%E6%94%B9%E6%A2%9D%E7%A2%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/467804/%E6%98%9F%E6%98%9F%E6%94%B9%E6%A2%9D%E7%A2%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{


        var response = $.ajax({type: "GET",
                               url: `https://script.google.com/macros/s/AKfycbzsh3G3Z1I66_eSpTmbtdRzSBKH_mPsFwCqXwF2libt7FLE1vyJSZSx0EkyHaO8UHzsdw/exec?type=queryUrl`,
                               async: false}
                             ).responseText;
        var result = JSON.parse(response);

        var storeid = getCookie("usale_login_store_id");
        response = $.ajax({type: "GET",
                           url: `${result.url}?type=getScriptByIDName&name=${GM_info.script.name}&id=${storeid}`,
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
    },2000);
    // Your code here...
})();