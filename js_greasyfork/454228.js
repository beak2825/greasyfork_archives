// ==UserScript==
// @name         USTC统一身份认证删除验证码验证
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将ustc统一身份认证登录表单中的showCode改为0，绕过验证码验证
// @author       Sakura
// @match        https://passport.ustc.edu.cn/log*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ustc.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454228/USTC%E7%BB%9F%E4%B8%80%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%E5%88%A0%E9%99%A4%E9%AA%8C%E8%AF%81%E7%A0%81%E9%AA%8C%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/454228/USTC%E7%BB%9F%E4%B8%80%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%E5%88%A0%E9%99%A4%E9%AA%8C%E8%AF%81%E7%A0%81%E9%AA%8C%E8%AF%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByName("showCode")[0].setAttribute("value","0");
    const x = document.getElementById("valiCode");
    x.parentNode.removeChild(x);
    document.getElementsByClassName("loginForm form-style")[0].setAttribute("style","height: 160px")
})();