// ==UserScript==
// @name         xjau自动登录
// @namespace    https://blog.zhecydn.asia/
// @version      2.3
// @description  新疆农大xjau校园网一键自动登录脚本
// @author       Mr.Yang，zhecydn
// @match        http://10.5.1.9/srun_portal_pc*
// @match        http://10.5.1.9/srun_portal_phone*
// @match        http://10.5.1.9/srun_portal_mobile*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=100.32
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466384/xjau%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/466384/xjau%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //usr 上网账号
    //pwd 密码
    if(document.querySelector("#logout")!=null){
        return;
    }
    var user=你的学号
    var pwd=你的密码
    document.querySelector("#username").value=user;
    document.querySelector("#password").value=pwd;
    document.querySelector("#remember").click();
    document.querySelector("#login-account").click();

})();