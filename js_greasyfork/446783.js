// ==UserScript==
// @name         河南工业大学校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  首次使用需根据代码提示文本为学号和密码，否则不能使用！ 搭配windows定时任务可实现全天联网，离校科研顶呱呱！参考自：https://blog.csdn.net/qq_20534023/article/details/124186965 
// @author       Brights Lee
// @match        http://auth.haut.edu.cn/srun_portal_pc?ac_id=1&theme=basic
// @match        http://172.18.210.30/srun_portal_success*
// @match        http://auth.haut.edu.cn/srun_portal_success?ac_id=1&theme=basic
// @match        http://auth.haut.edu.cn/srun_portal_pc?ac_id=1&theme=basic&srun_domain=
// @match        http://auth.haut.edu.cn/srun_portal_pc?ac_id=1&theme=basic&srun_domain=&srun_domain=&srun_domain=
// @icon         https://www.google.com/s2/favicons?sz=64&domain=100.32
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446783/%E6%B2%B3%E5%8D%97%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/446783/%E6%B2%B3%E5%8D%97%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(document.querySelector("#logout")!=null){
        return;
    }
    var user="请将此段文本替换为你的学号"
    var pwd= "请将此段文本替换为你的密码"
    document.querySelector("#username").value=user;
    document.querySelector("#password").value=pwd;
    document.querySelector("#cas-login").click();

})();