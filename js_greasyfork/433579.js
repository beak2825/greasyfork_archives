// ==UserScript==
// @name         大连东软校园网自动连接1
// @description  校园网自动连接脚本
// @author       BuKe, Class 19005, Department of Software Engineering, DNUI
// @email        66482504@qq.com 
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @match        https://aaa.neusoft.edu.cn/portal.html
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/433579/%E5%A4%A7%E8%BF%9E%E4%B8%9C%E8%BD%AF%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%8E%A51.user.js
// @updateURL https://update.greasyfork.org/scripts/433579/%E5%A4%A7%E8%BF%9E%E4%B8%9C%E8%BD%AF%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%8E%A51.meta.js
// ==/UserScript==
$(function() {
   document.querySelector('body > div:nth-child(1) > div > a.btn.btn-lg.btn-success.col-12.rounded-0.fs-1.mt-2.p-5').click();
})