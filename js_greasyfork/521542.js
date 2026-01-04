// ==UserScript==
// @name         shopline店铺跳过密码
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  shopline店铺跳过密码,方便测试
// @author       zhoubihui
// @match        *://*/password?redirect_url=*
// @match        *://*/password
// @match        *://*/password?
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      AGPL License
// @grant        GM_xmlhttpRequest
// @connect      *
 
// @downloadURL https://update.greasyfork.org/scripts/521542/shopline%E5%BA%97%E9%93%BA%E8%B7%B3%E8%BF%87%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/521542/shopline%E5%BA%97%E9%93%BA%E8%B7%B3%E8%BF%87%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==
 
(function () {
    'use strict';

    window.addEventListener("load", function(){
        // 设置cookie,  l_spwd=1
        document.cookie="l_spwd=1"

        var location = document.location;
        // 获取redirect_url跳转
        var query = location.search.substring(1);
        var vars = query.split("&");
        var redirectUrl = "";
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] === "redirect_url") {
                redirectUrl = decodeURIComponent(pair[1])
            }
        }
        console.log(redirectUrl)

        if (redirectUrl === '') {
            return
        }

        // 拼接域名
        var targetUrl = location.origin + redirectUrl;
        console.log(targetUrl);

        // 替换URL, 强制刷新
        window.history.pushState('','',targetUrl);
        window.location.reload(true);
    });
})();