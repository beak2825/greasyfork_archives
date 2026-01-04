// ==UserScript==
// @license MIT
// @name         校园网登录
// @namespace    
// @version      0.1
// @description  滚滚滚
// @author       You
// @include      http://login.hnust.cn/
// @downloadURL https://update.greasyfork.org/scripts/444730/%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/444730/%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function () {
    document.querySelector("#edit_body > div.edit_row.ui-resizable-autohide > div.edit_loginBox.normal_box.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(3)").value = '1905060102';

    document.querySelector("#edit_body > div.edit_row.ui-resizable-autohide > div.edit_loginBox.normal_box.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(4)").value = "bai119911";

    document.querySelector("#edit_body > div.edit_row.ui-resizable-autohide > div.edit_loginBox.normal_box.random.loginuse.loginuse_pc.ui-resizable-autohide > div.edit_lobo_cell.edit_radio > span:nth-child(3) > input").click();

    document.querySelector("#edit_body > div.edit_row.ui-resizable-autohide > div.edit_loginBox.normal_box.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(1)").click();
    //window.close();
    // Your code here...
    }
})();