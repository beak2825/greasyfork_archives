// ==UserScript==
// @name         南阳农业职业学院校园网自动登录脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  南阳农业职业学院校园网自动登录脚本-LongSir
// @author       LongSir
// @match        http://172.16.255.2/a79.htm
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478872/%E5%8D%97%E9%98%B3%E5%86%9C%E4%B8%9A%E8%81%8C%E4%B8%9A%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/478872/%E5%8D%97%E9%98%B3%E5%86%9C%E4%B8%9A%E8%81%8C%E4%B8%9A%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        document.querySelector("#edit_body > div:nth-child(3) > div.edit_cell.edit_moreTabs.ui-resizable-autohide > div > div.mt_body > div:nth-child(1) > div > form > input:nth-child(4)").value=123456789; //数字为账号

        document.querySelector("#edit_body > div:nth-child(3) > div.edit_cell.edit_moreTabs.ui-resizable-autohide > div > div.mt_body > div:nth-child(1) > div > form > input:nth-child(5)").value = "pwd"; //pwd为密码

        document.querySelector("#edit_body > div:nth-child(3) > div.edit_cell.edit_moreTabs.ui-resizable-autohide > div > div.mt_body > div:nth-child(1) > div > select").value = "@unicom"; //默认联通,""内留空为校园网选项

        document.querySelector("#edit_body > div:nth-child(3) > div.edit_cell.edit_moreTabs.ui-resizable-autohide > div > div.mt_body > div:nth-child(1) > div > form > input:nth-child(2)").click();
    }, 3000); //3000为3秒后执行,最小为1秒
})();