// ==UserScript==
// @name         Tapd Auto Close Popup
// @namespace    https://www.tapd.cn/
// @version      0.1.0
// @description  关闭tpad人数限制弹框
// @author       u2joy
// @match        https://www.tapd.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532069/Tapd%20Auto%20Close%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/532069/Tapd%20Auto%20Close%20Popup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const popupSelector = '.el-dialog';
    const closeBtnSelector = '.el-dialog__headerbtn';
    const wrapCls = '.company-renew-dialog';

    // 每隔一段时间（此处1s）检查弹窗
    const popupInterval = setInterval(() => {
        const popup = document.querySelectorAll(popupSelector);
        const closeBtns = document.querySelectorAll(closeBtnSelector);
        console.log(closeBtns)
        if (popup && closeBtns) {
            closeBtns.forEach(i=>i.click());
        }
        clearInterval(popupInterval);
    }, 1000);
})();
