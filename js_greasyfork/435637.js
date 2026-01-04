// ==UserScript==
// @name         Yan 蝦皮 折扣碼顯示外掛
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  mi.kaku.tw
// @author       Yan and modify by tn
// @grant        none
// @include     https://shopee.tw/user/voucher-wallet*
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @run-at      document-end
// @license tn
// @downloadURL https://update.greasyfork.org/scripts/435637/Yan%20%E8%9D%A6%E7%9A%AE%20%E6%8A%98%E6%89%A3%E7%A2%BC%E9%A1%AF%E7%A4%BA%E5%A4%96%E6%8E%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/435637/Yan%20%E8%9D%A6%E7%9A%AE%20%E6%8A%98%E6%89%A3%E7%A2%BC%E9%A1%AF%E7%A4%BA%E5%A4%96%E6%8E%9B.meta.js
// ==/UserScript==
function base64DecodeUnicode(str) {
    // Convert Base64 encoded bytes to percent-encoding, and then get the original string.
    var percentEncodedStr = atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('');

    return decodeURIComponent(percentEncodedStr);
}
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
     window.addEventListener('scroll',vouches);

    function vouches(){
        $("a").each(function() {
            var link=$(this).attr('href');
            var res = link.search("voucher/details");
            if (res>0 ){
                var result = link.split('&');
                if($(this).next().length==0){
                    var voucher_code=base64DecodeUnicode(decodeURIComponent(result[1].split('=')[1]));
                    $(this).after("&nbsp;<a href='https://shopee.tw/search?promotionId="+result[2].split('=')[1]+"'>"+voucher_code+"</a>");
                }
            }
        })
    }
})();