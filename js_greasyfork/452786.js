// ==UserScript==
// @name         湖南省事业单位工作人员培训
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Autologin
// @author       hui
// @match        https://hnxxpt.zgzjzj.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zgzjzj.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452786/%E6%B9%96%E5%8D%97%E7%9C%81%E4%BA%8B%E4%B8%9A%E5%8D%95%E4%BD%8D%E5%B7%A5%E4%BD%9C%E4%BA%BA%E5%91%98%E5%9F%B9%E8%AE%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/452786/%E6%B9%96%E5%8D%97%E7%9C%81%E4%BA%8B%E4%B8%9A%E5%8D%95%E4%BD%8D%E5%B7%A5%E4%BD%9C%E4%BA%BA%E5%91%98%E5%9F%B9%E8%AE%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        var class_login=document.querySelector("#app > div.index > div.content > div > div.banner > div.login-wrap > div.login-contain > div:nth-child(1) > div:nth-child(2) > input")
        if(class_login){
        class_login.value="432503196910265709"
        document.querySelector("#app > div.index > div.content > div > div.banner > div.login-wrap > div.login-contain > div.login-ipt.m > div > input").value="123Aa?"
        document.querySelector("#app > div.index > div.content > div > div.banner > div.login-wrap > div.login-contain > div.login-btn > button.el-button.denglu.el-button--primary > span").click()
        window.open("https://www.hnsydwpx.cn/center.html","_parent")}
    },2000)
    // Your code here...
})();