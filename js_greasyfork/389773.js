// ==UserScript==
// @name         吉大校园网自助营业厅密码输入
// @namespace    https://github.com/Yesterday17/Gadgets
// @version      1.0.1
// @description  解除吉林大学校园网自助营业厅密码输入环节的强制手动输入。
// @author       Yesterday17
// @match        https://ip.jlu.edu.cn/pay/*
// @run-at       document-body
// @supportURL   https://github.com/Yesterday17/Gadgets/issues
// @downloadURL https://update.greasyfork.org/scripts/389773/%E5%90%89%E5%A4%A7%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A9%E8%90%A5%E4%B8%9A%E5%8E%85%E5%AF%86%E7%A0%81%E8%BE%93%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/389773/%E5%90%89%E5%A4%A7%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A9%E8%90%A5%E4%B8%9A%E5%8E%85%E5%AF%86%E7%A0%81%E8%BE%93%E5%85%A5.meta.js
// ==/UserScript==

(() => {
  document.querySelectorAll('[readonly]').forEach(ro => {
    ro.removeAttribute('readonly');
    ro.removeAttribute('onclick');
  });
})();
