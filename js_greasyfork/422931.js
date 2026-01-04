// ==UserScript==
// @name         农工商自动认证 - 天翼客户端/移动线路
// @namespace    
// @version      1.1
// @description  广东农工商职业技术学院 学生上网认证系统 自动认证脚本
// @author       Rainbrony
// @include      *://10.6.1.3/*
// @include      *://125.88.59.131:*
// @include      *://221.179.9.21:*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422931/%E5%86%9C%E5%B7%A5%E5%95%86%E8%87%AA%E5%8A%A8%E8%AE%A4%E8%AF%81%20-%20%E5%A4%A9%E7%BF%BC%E5%AE%A2%E6%88%B7%E7%AB%AF%E7%A7%BB%E5%8A%A8%E7%BA%BF%E8%B7%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/422931/%E5%86%9C%E5%B7%A5%E5%95%86%E8%87%AA%E5%8A%A8%E8%AE%A4%E8%AF%81%20-%20%E5%A4%A9%E7%BF%BC%E5%AE%A2%E6%88%B7%E7%AB%AF%E7%A7%BB%E5%8A%A8%E7%BA%BF%E8%B7%AF.meta.js
// ==/UserScript==

(function() {
    var acc = {
        账号: "改成你的学号",
        密码: "身份证后六位"
    }
    'use strict';
    if (window.location.pathname == "/portalAuthAction.do" ) {
        window.opener=null; window.open("",'_self',""); window.close();
    }
    else if (window.location.host == "125.88.59.131:10001") {
        window.opener=null; window.open("",'_self',""); window.close();
    }
    else if (window.location.host == "221.179.9.21") {
        window.close();
    }
    else if (window.location.pathname == "/portal.do" ) {
        document.getElementById("useridtemp").value = acc.账号;
        document.getElementById("passwd").value = acc.密码;
        document.getElementsByClassName("btnlogin")[0].click();
        //idbox.value = acc.账号;
        //pw.value = acc.密码;
        //btn[0].click();
    }
})();