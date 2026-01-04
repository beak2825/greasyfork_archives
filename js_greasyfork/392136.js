// ==UserScript==
// @author       Gocc
// @version      1.5
// @name         万物在线IMEI自动点击登录
// @namespace    万物在线IMEI自动点击登录
// @description  IMEI账号密码默认保存在浏览器的情况下, 自动点击登录
// @icon         https://lite.gmiot.net/favicon.ico
// @match        *://lite.gmiot.net/index.shtml
// @downloadURL https://update.greasyfork.org/scripts/392136/%E4%B8%87%E7%89%A9%E5%9C%A8%E7%BA%BFIMEI%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/392136/%E4%B8%87%E7%89%A9%E5%9C%A8%E7%BA%BFIMEI%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
(function() {
    var tab1 =document.querySelector('#menuProduct');//点击IMEI号(tab)按钮
    var tab2 =document.querySelector('.by_imei .login_btn');//点击登录按钮
    tab1.click();
    tab2.click();
})();