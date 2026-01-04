// ==UserScript==
// @name         Yan 蝦皮 折扣碼顯示外掛
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  mi.kaku.tw
// @author       Yan
// @grant        none
// @include     https://shopee.tw/user/voucher-wallet/*
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/402488/Yan%20%E8%9D%A6%E7%9A%AE%20%E6%8A%98%E6%89%A3%E7%A2%BC%E9%A1%AF%E7%A4%BA%E5%A4%96%E6%8E%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/402488/Yan%20%E8%9D%A6%E7%9A%AE%20%E6%8A%98%E6%89%A3%E7%A2%BC%E9%A1%AF%E7%A4%BA%E5%A4%96%E6%8E%9B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var show_code=0
     var input=document.createElement("input");
     input.type="button";
     input.value="秀出折扣碼";
     input.id="show_btn";
     input.onclick = vouches;
     input.setAttribute("style", "font-size:18px;position:absolute;top:120px;right:240px;");
     document.body.appendChild(input);


    function vouches(){
        $("a").each(function() {
            var link=$(this).attr('href');
            var res = link.search("voucher-details");
            if (res>0 ){
                var result = link.split('/');
                $(this).html(result[2]);

            }

        })
    }
})();

