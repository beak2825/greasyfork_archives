// ==UserScript==
// @name         驰游包包提key
// @namespace    https://greasyfork.org/zh-CN/users/117402
// @version      0.3
// @description  驰游慈善包提key
// @author       khanid
// @match        http://www.ccyyshop.com/order/id/*
// @icon         http://ccyycn.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29132/%E9%A9%B0%E6%B8%B8%E5%8C%85%E5%8C%85%E6%8F%90key.user.js
// @updateURL https://update.greasyfork.org/scripts/29132/%E9%A9%B0%E6%B8%B8%E5%8C%85%E5%8C%85%E6%8F%90key.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".showkey-box h2").after('<p style="color:#000;font-size:14px;line-height:16px;"><button type="button" id="getkey">获取key</button><button type="button" id="copykey" style="margin-left:10px;">复制key</button></p><p><input type="text" id="thekey" style="color:#000;font-size:12px;width:600px;"/></p>');
    $(document).ready(function(e){
        $("#getkey").click(function(){
            $(".deliver-btn").trigger("click");
        });
        $("#copykey").click(function(){
            var keynum = $(".deliver-gkey");
            var key;
            for(var x=0;x<keynum.length;x++){
                if(x===0){
                    key = $.trim($(".deliver-gkey").eq(x).text());
                }else{
                    key = key+","+$.trim($(".deliver-gkey").eq(x).text());
                }
            }
            $("#thekey").val(key);
            $("#thekey").select();
            document.execCommand('copy');
        });
    });
})();