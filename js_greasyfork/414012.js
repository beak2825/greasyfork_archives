// ==UserScript==
// @author       鹅鹅鹅
// @version      1.0.0
// @name         万里牛登录
// @namespace    万里牛登录
// @description  万里牛自动登录
// @icon         https://erp.hupun.com/loginfavicon.ico
// @match        https://erp.hupun.com/login
// @downloadURL https://update.greasyfork.org/scripts/414012/%E4%B8%87%E9%87%8C%E7%89%9B%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/414012/%E4%B8%87%E9%87%8C%E7%89%9B%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

//万里牛自动登录
(function() {
    var sign =document.querySelector('.login-btn');//获取登录按钮
    var text =sign.innerText;//获取登录文字
    if(text.indexOf('登录')!=-1){//登 = 0
        sign.click();
    }
})();