// ==UserScript==
// @name         DD Erp Auto Login Base64
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动识别验证码登录
// @author       Sajor

// @match        http://127.0.0.1:8081/

// @include        http://*.*.zxdns.com/login.html
// @include        http://*.*.zxdns.com/
// @include        http://*.ddky.com/login.html
// @include        http://*.ddky.com/
// @include        http://localhost:8800/login.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421198/DD%20Erp%20Auto%20Login%20Base64.user.js
// @updateURL https://update.greasyfork.org/scripts/421198/DD%20Erp%20Auto%20Login%20Base64.meta.js
// ==/UserScript==

(function() {
    function image2Base64(img) {

        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL;
    };

    function erp_auto(res, auto_code_url) {
        var base64 = "";
        var img = new Image();
        img.src = res;
        img.setAttribute("crossOrigin",'Anonymous');

        img.onload = function () {
            base64 = image2Base64(img);
            $.ajax({
                url: auto_code_url,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    "base64": base64,
                    "name": "erp"
                })
            }).done(function(data, status) {
                console.log(data);

                $("#verify").val(data);
                setTimeout(function() {
                    $("#submit").click();
                },0);
            });
        }
    }

        function pos_auto(res, auto_code_url) {
        var base64 = "";
        var img = new Image();
        img.src = res;
        img.setAttribute("crossOrigin",'Anonymous');

        img.onload = function () {
            base64 = image2Base64(img);
            $.ajax({
                url: auto_code_url,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    "base64": base64,
                    "name": "erp"
                })
            }).done(function(data,status){
                //alert("数据: \n" + data + "\n状态: " + status);
                console.log(data);
                $(":text").last().val(data);
                // input 时间
                $(":text").last()[0].dispatchEvent(new Event('input'))
                setTimeout(function() {
                    $(":button").eq(2).click();
                },0);
            });
        }
    }
    $(document).ready(function(){
        var auto_code_url = "http://auto.sajor.work/login_base";

        // POS
        $(".xfk-login-btn").after("<button id='pos_auto' >auto login</button>")
        $("#pos_auto").click(function(){
            // $(".xfk-login-btn").click(function(){
            var res = $("img").last()[0].src;
            console.log(res);
            pos_auto(res, auto_code_url);
            return false;
        });

        // ERP
        $("#submit").after("<button id='erp_auto' >auto login</button>")
        $("#erp_auto").click(function(){
            var res = $("img.login-captcha")[0].src;
            console.log(res);
            erp_auto(res, auto_code_url);
            return false;
        });

    });
})();




