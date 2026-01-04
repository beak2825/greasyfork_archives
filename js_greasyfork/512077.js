// ==UserScript==
// @name         南京信息工程大学金牛湖校区自动登录
// @namespace    微信公众号：燕尾笔记铺
// @version      1.0.1
// @description  南京信息工程大学金牛湖校区校园网自动登录
// @author       HBoyu
// @match        http://10.32.2.6/srun_portal_pc*
// @match        http://10.32.2.6/srun_portal_success*
// @grant        none
// @license
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512077/%E5%8D%97%E4%BA%AC%E4%BF%A1%E6%81%AF%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6%E9%87%91%E7%89%9B%E6%B9%96%E6%A0%A1%E5%8C%BA%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/512077/%E5%8D%97%E4%BA%AC%E4%BF%A1%E6%81%AF%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6%E9%87%91%E7%89%9B%E6%B9%96%E6%A0%A1%E5%8C%BA%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';


    if(document.querySelector("#logout")!=null){
        return;
    }
    var user="填写账户即学号"
    var pwd="填写密码"
    var yunyin="填写运营商" //中国移动：0-@cmcc 中国联通：1-@unicom 中国电信：2-@telecom 校园网：3-@campus
    document.querySelector("#username").value=user;
    document.querySelector("#password").value=pwd;
    document.querySelector("#domain").value=yunyin;
    document.querySelector("#login-account").click();

})();