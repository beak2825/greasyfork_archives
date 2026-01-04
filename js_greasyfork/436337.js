// ==UserScript==
// @name         江西师范大学校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  编辑代码页面填写账户密码以及运营商
// @author       You
// @match        http://*/*
// @grant        none
// @include    *:http://172.16.8.8/srun_portal_success?ac_id=1&srun_wait=1&theme=basic2&srun_domain=@cucc
// @downloadURL https://update.greasyfork.org/scripts/436337/%E6%B1%9F%E8%A5%BF%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/436337/%E6%B1%9F%E8%A5%BF%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //用户自定义
    var usr=""//账号
    var pwd=""//密码
    var ips=""//填写运营商联通填 @cucc,移动 @cmcc 电信 @ctcc 校园宽带 @jxnu
        document.querySelector("#username").value=usr
        document.querySelector("#password").value=pwd
        document.querySelector("#domain").value=ips
        document.querySelector("#login").click();
   
})();