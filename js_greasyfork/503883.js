// ==UserScript==
// @name         NCWU教务系统自动登录
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动登录NCWU教务系统
// @author       NCWU小沈
// @match        https://authserver.ncwu.edu.cn/authserver/login*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=firefoxchina.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503883/NCWU%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/503883/NCWU%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
var i = 1;
(function() {
    if(i==1){
        document.querySelector('[id="username"]').value="填学号"
        document.querySelector('[id="passwordShow"]').value="填密码"
        document.querySelector('[id="passbutton"]').click()
        i++;
    }
})();