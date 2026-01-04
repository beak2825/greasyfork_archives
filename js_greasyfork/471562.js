// ==UserScript==
// @name         無尾熊自動列印條碼單-遠端code
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  無尾熊自動列印條碼單功能-遠端code
// @author       You
// @match        https://ec.mallbic.com/Module/2_Order/Order_Entry.aspx
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471562/%E7%84%A1%E5%B0%BE%E7%86%8A%E8%87%AA%E5%8B%95%E5%88%97%E5%8D%B0%E6%A2%9D%E7%A2%BC%E5%96%AE-%E9%81%A0%E7%AB%AFcode.user.js
// @updateURL https://update.greasyfork.org/scripts/471562/%E7%84%A1%E5%B0%BE%E7%86%8A%E8%87%AA%E5%8B%95%E5%88%97%E5%8D%B0%E6%A2%9D%E7%A2%BC%E5%96%AE-%E9%81%A0%E7%AB%AFcode.meta.js
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
