// ==UserScript==
// @name         教务系统登录
// @namespace    http:///
// @description  用于艾利斯皇家医学院教务自动登录
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://10.0.4.150/jsxsd/
// @grant        none
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/413846/%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/413846/%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
console.log('start');
$(document).ready(function () {
    $('#userAccount')[0].value='学号';
    $('#userPassword')[0].value='密码';
    $('#btnSubmit').click();
});
console.log('complete');