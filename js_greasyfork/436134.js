// ==UserScript==
// @namespace    https://greasyfork.org/zh-CN/users/167084-lin-skywood
// @name         autoLoginForVideoPlatform
// @name:zh      autoLoginForVideoPlatform中文
// @description  autoLogin
// @include      https://service.ymiot.net*
// @author       skywoodlin
// @contributor  skywoodlin
// @version      1.2
// @license      LGPLv3
// @grant        GM_openInTab
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/436134/autoLoginForVideoPlatform.user.js
// @updateURL https://update.greasyfork.org/scripts/436134/autoLoginForVideoPlatform.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // debugger;
    // Your code here...
    let pathname = location.pathname.toLowerCase();
    console.log(pathname);
    if(pathname.includes("login") || pathname === "/") {
        login();
    }else if(pathname.includes('OperationsCenter')){
        // doNothing
    }else if (pathname === 'index' || pathname === '/index/home'){
        changeCurrentUrl();
    }else if (pathname.includes('nologin.htm')) {
        $(".btn-primary").click();
    }

    function login() {
        // debugger;
        if($("#wxLogin").length > 0){
            $("#wxLogin").hide();
            $("#login").show();
        }

        $("#Admins_Account").val("1835000665");
        $("#Admins_Pwd").val("123456");

        sleep(100);

        $("#btnLogin").click();

    }

    function changeCurrentUrl(){
        window.location.href = 'https://service.ymiot.net/OperationsCenter/Index';
    }

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
})();