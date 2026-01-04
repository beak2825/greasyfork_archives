// ==UserScript==
// @name         经贸学院校园网自动登录-超级小兔
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  超级小兔的校园网Web认证
// @author       超级小兔
//下面两个match项修改为web认证的网址前半部分，后半部分用*
// @match        http://10.10.10.3/srun_portal_pc*
// @match        http://10.10.10.3/srun_portal_success*
// @license      超级小兔
// @icon         https://gitcode.net/qq_44112897/imgbed/-/raw/master/images/logo.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460379/%E7%BB%8F%E8%B4%B8%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95-%E8%B6%85%E7%BA%A7%E5%B0%8F%E5%85%94.user.js
// @updateURL https://update.greasyfork.org/scripts/460379/%E7%BB%8F%E8%B4%B8%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95-%E8%B6%85%E7%BA%A7%E5%B0%8F%E5%85%94.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(document.querySelector("#loginout")!=null){
        return;
    }
    //改为用户名
    var user=123456
    //改为密码
    var pwd=123456
    //获取用户名框id
    document.querySelector("#username").value=user;
    //获取密码框id
    document.querySelector("#password").value=pwd;
    //获取登录按钮id
    document.querySelector("#login-account").click();

})();
