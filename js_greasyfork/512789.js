// ==UserScript==
// @name         河南财经政法大学校园网自动登录
// @namespace    微信公众号：燕尾笔记铺
// @version      1.0.1
// @description  河南财经政法大学郑东校区校园网自动登录
// @author       HBoyu
// @match        http://49.122.0.102:802/srun_portal_pc.php?ac_id=1&
// @match        http://49.122.0.102:802/srun_portal_success*
// @grant        none
// @license
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/512789/%E6%B2%B3%E5%8D%97%E8%B4%A2%E7%BB%8F%E6%94%BF%E6%B3%95%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/512789/%E6%B2%B3%E5%8D%97%E8%B4%A2%E7%BB%8F%E6%94%BF%E6%B3%95%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';


    if(document.querySelector("#logout")!=null){
        return;
    }
    var user="填写学号"
    var pwd="填写密码"
    document.querySelector("#uname").value=user;
    document.querySelector('input[type="password"]').value=pwd;
    document.querySelector('input[type="submit"]').click();

})();