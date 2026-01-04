// ==UserScript==
// @name         JZC Auto Login
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动识别验证码登录
// @author       Sajor

// @match        http://127.0.0.1:3000/user/login*
// @match        http://localhost:3000/user/login*
// @match        http://jz-test.zimeitang.cn/user/login*
// @match        http://jz.zimeitang.cn/user/login*



// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.4.1/jquery.min.js
// @include      http://47.99.165.231:3000/user/login*
// @include      http://localhost:3000/user/login*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435083/JZC%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/435083/JZC%20Auto%20Login.meta.js
// ==/UserScript==

(function() {

    function erp_auto(res, auto_code_url) {
        var base64 = res;
        $.ajax({
                url: auto_code_url,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    "base64": base64,
                    "name": "erp",
                    "threshold": 120,
                    "count": 0
                }), success:function(data) {
                    console.log(data);

                    $(":text")[1].value = data;
                    $(":text")[1].dispatchEvent(new Event('input'));
                    $(":submit").click();
                    // document.images[0].click();
                    //setTimeout(function() {
                    //    $("#submit").click();
                    //},0);
            }
        });
    }


    $(document).ready(function(){
        var auto_code_url = "http://auto.sajor.work/login_base";
        var img = document.images[0];

        // ERP
        $(".login-button").after("<button id='erp_auto' >auto login</button>")
        $("#erp_auto").click(function(){
            var res = document.images[0].currentSrc;
            erp_auto(res, auto_code_url);
            return false;
        });

    });
})();




