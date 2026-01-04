// ==UserScript==
// @name         NCWU校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  用于NCWU校园网自动登录
// @author       codefarmershen
// @match        http://10.1.1.10/a79.htm?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505576/NCWU%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/505576/NCWU%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

// 等待网页完成加载
window.addEventListener('load', function() {
    document.querySelector('[placeholder="账号"]').value='填写校园网账号'
    document.querySelector('[placeholder="密码"]').value='填写校园网密码'
    document.querySelector('[name="ISP_select"]').value='@cmcc'//移动校园网填(@cmcc),联通校园网填(@unicom),电信校园网填(@telecom)
    document.querySelector('[value="登录"]').click()
}, false);