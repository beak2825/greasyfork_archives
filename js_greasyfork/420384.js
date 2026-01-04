// ==UserScript==
// @name         DD Erp Auto Login
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动识别验证码登录
// @author       Sajor
// @include      http://erp.test.zxdns.com/login.html
// @include      http://erp*.*.zxdns.com/login.html
// @include      http://erp.*.zxdns.com/login.html
// @include      http://localhost:8800/login.html
// @include      http://saas.ddky.com/login.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420384/DD%20Erp%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/420384/DD%20Erp%20Auto%20Login.meta.js
// ==/UserScript==


(function() {
    $(document).ready(function(){
        var host = "http://101.37.82.127:5000"
        var url = host + "/login";

        // $("#submit").after("<button id='sajor_auto' >auto login</button>")
        // $("#sajor_auto").click(function(){
        $(".xfk-login-btn").click(function(){
            var code = $("img")[0].src;
            $.post(url, {
                name:"erp",
                url:code
            }, function(data,status){
                //alert("数据: \n" + data + "\n状态: " + status);
                $(":text").last().val(data);
                $(":button").last().click();

            });

            // func();
        });

        $("#submit").click(function() {
            var code = $("img.login-captcha")[0].src;
            console.log(code);
            $.post(url, {
                name:"erp",
                url:code
            }, function(data,status) {
                //alert("数据: \n" + data + "\n状态: " + status);
                console.log(data);
                $("#verify").val(data);
                $("#submit").click();

            });

        });

    });

    // Your code here...
})();


