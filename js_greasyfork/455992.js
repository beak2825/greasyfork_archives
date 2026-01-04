// ==UserScript==
// @name         山东大学（威海）教务系统弹窗修复
// @namespace    https://www.yuzheng14.com/
// @version      1.0.1
// @description  修复因学校不修改 chromium 内核 57 版本以上不支持的 api 导致的弹窗无法弹出的 bug
// @author       yuzheng14
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455992/%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%EF%BC%88%E5%A8%81%E6%B5%B7%EF%BC%89%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%BC%B9%E7%AA%97%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/455992/%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%EF%BC%88%E5%A8%81%E6%B5%B7%EF%BC%89%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%BC%B9%E7%AA%97%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.showModalDialog = window.open
})();