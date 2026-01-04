// ==UserScript==
// @name         gops自动登录插件
// @namespace    http://www.guahao.com/
// @version      1.0.1
// @description  gops自动登录
// @author       aoqh
// @match       *://user.guahao-test.com/login*
// @match       *://user.guahao-test.com/dologin*
// @match       *://user.guahao-test.com/oidc/authorize*
// @match        *://user.gops.guahao.cn/login*
// @match        *://user.gops.guahao.cn/dologin*
// @match        *://user.gops.guahao.cn/oidc/authorize*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/418398/gops%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/418398/gops%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


(function() {
    'use strict';
    toastr.options.timeOut="60000";
    var autoLogin = GM_getValue("autoLogin");

    $("body").prepend('<div style="zoom:180%;left: 45%;z-index:9999;position:absolute;"><input class="autoLogin" type="checkbox">自动登录</div>')
    $("body").prepend('<a id="gmSetValue"/>')
    if(autoLogin){
        $(".autoLogin").attr("checked","checked");
    }
    $("#gmSetValue").click(function () {
        GM_setValue("user",$("#loginId").val());
        GM_setValue("password", encodeURIComponent(encryptWithKey($("#password").val(), "hvxtgjBKJviq2Mgb")));
    });

    $(".autoLogin").change(function() {
        GM_setValue("autoLogin",$(this).is(':checked'));
    });
    var tmp = doSubmmit;
    doSubmmit = function(){
        $("#gmSetValue").click();
        tmp();
    }
    if(autoLogin){
        toastr.info('正在登录中，登录成功后自动跳转，请稍等...')
        $("body").append('<div style="background: rgba(0,0,0,0.5);position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 1050;"/>')
        $.ajax({
            "async": true,
            "crossDomain": true,
            "url": window.location.protocol+"//"+window.location.host+"/dologin",
            "method": "POST",
            "data": "method=dologin&target=&validCodeType=&errMsg=&msg=&loginId="+GM_getValue("user")+"&encryptpwd="+GM_getValue("password")+"&validCode="
        }).done(function (response) {
            console.log("登录完成")
            location.reload();
        });

    }

})();