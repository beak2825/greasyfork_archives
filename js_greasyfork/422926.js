// ==UserScript==
// @name         农工商自动认证 - 电信8M
// @namespace    
// @version      1.1
// @description  广东农工商职业技术学院 学生上网认证系统 自动认证脚本
// @author       Rainbrony
// @include      *://10.6.1.3/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422926/%E5%86%9C%E5%B7%A5%E5%95%86%E8%87%AA%E5%8A%A8%E8%AE%A4%E8%AF%81%20-%20%E7%94%B5%E4%BF%A18M.user.js
// @updateURL https://update.greasyfork.org/scripts/422926/%E5%86%9C%E5%B7%A5%E5%95%86%E8%87%AA%E5%8A%A8%E8%AE%A4%E8%AF%81%20-%20%E7%94%B5%E4%BF%A18M.meta.js
// ==/UserScript==

(function() {
    var acc = {
        账号: "改成你的学号",
        密码: "身份证后六位"
    }
    'use strict';
    if (window.location.pathname == "/portalAuthAction.do" ) {
        window.close();
    }
    else if (window.location.pathname == "/portal.do" ) {
        document.getElementById("useridtemp").value = acc.账号;
        document.getElementById("passwd").value = acc.密码;
        document.getElementsByClassName("btnlogin")[0].click();
    }
})();