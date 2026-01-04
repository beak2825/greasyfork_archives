// ==UserScript==
// @name         PPSUC_Webvpn_Connect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动连接公大Webvpn
// @author       123yonghu
// @match        https://webvpn.ppsuc.edu.cn/login
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475493/PPSUC_Webvpn_Connect.user.js
// @updateURL https://update.greasyfork.org/scripts/475493/PPSUC_Webvpn_Connect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var stu_num = 'test'; // 学号
    var stu_pwd = 'test'; // 密码
    if(document.querySelector('#user_name') == null)
 {
     return;
 }
    document.querySelector('#user_name').value = stu_num;
    document.querySelector('#form > div:nth-child(4) > div > input[type=password]').value = stu_pwd;
    var btn=document.querySelector('#login');
    btn.click();

})();