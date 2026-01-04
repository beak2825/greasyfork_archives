// ==UserScript==
// @name         北信科校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      0.2
// @match        https://10.144.0.3/a70.htm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @description  若无法登录请查看第7行代码的网址是否为你所处校区的登录网址，若不一样直接修改即可
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461360/%E5%8C%97%E4%BF%A1%E7%A7%91%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/461360/%E5%8C%97%E4%BF%A1%E7%A7%91%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        document.querySelector("#edit_body > div.edit_row.ui-state-active.ui-resizable-autohide > div.tijiao.edit_cell.edit_moreTabs.ui-resizable-autohide > div > div.mt_body > div:nth-child(1) > div > form > input:nth-child(3)").value = "username"//usename为你的登录账号
        document.querySelector("#edit_body > div.edit_row.ui-state-active.ui-resizable-autohide > div.tijiao.edit_cell.edit_moreTabs.ui-resizable-autohide > div > div.mt_body > div:nth-child(1) > div > form > input:nth-child(4)").value = "password"//password为你的登录密码
        document.querySelector("#edit_body > div.edit_row.ui-state-active.ui-resizable-autohide > div.tijiao.edit_cell.edit_moreTabs.ui-resizable-autohide > div > div.mt_body > div:nth-child(1) > div > form > input:nth-child(1)").click()
    
}})();
