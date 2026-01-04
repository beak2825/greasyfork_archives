// ==UserScript==
// @name         51taoshiwan 自动打开作业页面(影响登录，登录后再运行脚本)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动按顺序处理补作业和撤回重做
// @author       Xiaocanln & DeepSeek
// @match        https://infotech.51taoshi.com/hw/stu/myHomework.do*
// @match        https://infotech.51taoshi.com/hw/stu/viewHomework.do*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536729/51taoshiwan%20%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E4%BD%9C%E4%B8%9A%E9%A1%B5%E9%9D%A2%28%E5%BD%B1%E5%93%8D%E7%99%BB%E5%BD%95%EF%BC%8C%E7%99%BB%E5%BD%95%E5%90%8E%E5%86%8D%E8%BF%90%E8%A1%8C%E8%84%9A%E6%9C%AC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536729/51taoshiwan%20%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E4%BD%9C%E4%B8%9A%E9%A1%B5%E9%9D%A2%28%E5%BD%B1%E5%93%8D%E7%99%BB%E5%BD%95%EF%BC%8C%E7%99%BB%E5%BD%95%E5%90%8E%E5%86%8D%E8%BF%90%E8%A1%8C%E8%84%9A%E6%9C%AC%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 处理准备页面的“做作业”按钮
    if (window.location.href.includes('viewHomework.do')) {
        const doHomeworkBtn = document.querySelector('button.btn-danger');
        if (doHomeworkBtn) {
            doHomeworkBtn.click();
        }
        return;
    }

    // 处理作业列表页面的补作业和撤回按钮
    function handleHomeworkPage() {
        // 检测补作业按钮
        const makeUpBtns = [...document.querySelectorAll('button.btn-primary')].reverse();
        if (makeUpBtns.length > 0) {
            makeUpBtns[0].click();
            return;
        }

        // 检测撤回重做按钮
        const redoBtns = [...document.querySelectorAll('button.btn-warning')].reverse();
        if (redoBtns.length > 0) {
            redoBtns[0].click();
            // 检测弹窗并确认
            const checkPopup = setInterval(() => {
                const confirmBtn = [...document.querySelectorAll('.layui-layer-btn0')].find(btn => btn.textContent.includes('确定'));
                if (confirmBtn) {
                    confirmBtn.click();
                    clearInterval(checkPopup);
                    setTimeout(() => location.reload(), 2000);
                }
            }, 500);
            return;
        }
    }

    // 延迟执行以等待页面加载完成
    setTimeout(handleHomeworkPage, 2000);
})();