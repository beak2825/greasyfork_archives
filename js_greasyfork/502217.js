// ==UserScript==
// @name         强制网页使用苹方
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  强制网页使用苹方字体，如果本地无法找到，则询问是否打开下载页面
// @author       Your Name
// @license      MIT
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/502217/%E5%BC%BA%E5%88%B6%E7%BD%91%E9%A1%B5%E4%BD%BF%E7%94%A8%E8%8B%B9%E6%96%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/502217/%E5%BC%BA%E5%88%B6%E7%BD%91%E9%A1%B5%E4%BD%BF%E7%94%A8%E8%8B%B9%E6%96%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const downloadURL = 'https://github.com/accr/koudaiHK_Web/blob/master/fonts/PingFang-SC-Regular/PingFang%20Regular.ttf';
    const permanentCancelKey = 'permanentCancelPingFang';
    const checkDoneKey = 'pingFangCheckDone';

    // 添加苹方字体的CSS样式
    function addPingFangFont() {
        GM_addStyle(`
            body, p, h1, h2, h3, h4, h5, h6, a, span, div {
                font-family: 'PingFang', 'PingFang SC', 'PingFang TC', 'PingFang HK', 'PingFang SC Regular', 'PingFang TC Regular', 'PingFang HK Regular', sans-serif !important;
            }
        `);
    }

    // 检查本地是否已有苹方字体
    function checkLocalFont() {
        let testElement = document.createElement('span');
        testElement.style.fontFamily = 'PingFang';
        testElement.innerText = 'Test';
        document.body.appendChild(testElement);
        let fontAvailable = (testElement.clientHeight > 0);
        document.body.removeChild(testElement);
        return fontAvailable;
    }

    // 显示询问对话框
    function showConfirmDialog() {
        if (confirm('苹方字体未检测到，是否打开下载页面以手动下载苹方字体？')) {
            GM_openInTab(downloadURL, { active: true });
        } else if (confirm('是否永久取消下载苹方字体？')) {
            GM_setValue(permanentCancelKey, true);
        }
    }

    // 主函数
    function main() {
        const permanentCancel = GM_getValue(permanentCancelKey, false);
        if (permanentCancel) return;

        const checkDone = GM_getValue(checkDoneKey, false);
        if (checkDone) return;

        GM_setValue(checkDoneKey, true);

        if (checkLocalFont()) {
            addPingFangFont();
        } else {
            showConfirmDialog();
        }
    }

    // 运行主函数
    main();
})();
