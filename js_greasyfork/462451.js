// ==UserScript==
// @name         複製認證資料
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  複製賣家中心認證資料
// @author       You
// @match        https://seller.shopee.tw/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shopee.tw
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462451/%E8%A4%87%E8%A3%BD%E8%AA%8D%E8%AD%89%E8%B3%87%E6%96%99.user.js
// @updateURL https://update.greasyfork.org/scripts/462451/%E8%A4%87%E8%A3%BD%E8%AA%8D%E8%AD%89%E8%B3%87%E6%96%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        var clone = $('a:contains("賣家中心")').first().clone();
        clone.attr("href","#").attr("id","copyToken").html("複製認證資料");
        $('a:contains("賣家中心")').first().after(clone);
        $('#copyToken').click(function(){

            $(this).focus();
            var token = localStorage.getItem("mini-session");
            console.log(token);
            //navigator.clipboard.writeText(JSON.stringify(token));
            GM_setClipboard(token);
            alert("ok");
        });


    },1700);
    // Your code here...
})();