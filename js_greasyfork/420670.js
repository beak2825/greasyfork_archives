// ==UserScript==
// @name         Local Erp Auto Login
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  本地自动识别验证码登录
// @author       Sajor

// @match        http://127.0.0.1:8081/

// @include        http://*.*.zxdns.com/
// @include        http://*.ddky.com/
// @include        http://localhost:8800/login.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420670/Local%20Erp%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/420670/Local%20Erp%20Auto%20Login.meta.js
// ==/UserScript==

(function() {
    $(document).ready(function(){
        var auto_code_url = "http://127.0.0.1:5000/login";

        // POS
        $(".xfk-login-btn").after("<button id='pos_auto' >auto login</button>")
        $("#pos_auto").click(function(){
            // $(".xfk-login-btn").click(function(){
            var code = $("img")[0].src;
            $.post(auto_code_url, {
                name:"erp",
                url:code
            }, function(data,status){
                //alert("数据: \n" + data + "\n状态: " + status);
                console.log(data);
                $(":text").last().val(data);
                // input 时间
                $(":text").last()[0].dispatchEvent(new Event('input'))
                setTimeout(function() {
                    $(":button").eq(2).click();
                },0);

            });
            return false;
        });

        // ERP
        $("#submit").after("<button id='erp_auto' >auto login</button>")
        $("#erp_auto").click(function(){
            var code = $("img")[1].src;
            $.post(auto_code_url, {
                name:"erp",
                url:code
            }, function(data,status){
                $("#verify").val(data);
                console.log("1");
                setTimeout(function() {
                    $("#submit").click();
                    console.log("2");
                },0);
            });
            return false;
        });

    });
})();

