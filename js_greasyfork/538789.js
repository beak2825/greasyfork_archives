// ==UserScript==
// @name         【高校教师培训】弹窗“确定”点击
// @namespace    http://tampermonkey.net/
// @version      10.0
// @description  只做一件事：持续寻找 src 包含 cdnad.html 的 iframe，并在其中点击 onclick 为 SubmitAnswers_5() 的按钮。
// @author       Gemini
// @match        *://*/*
// @grant        none
// @license      MPL-2.0 License
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538789/%E3%80%90%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD%E3%80%91%E5%BC%B9%E7%AA%97%E2%80%9C%E7%A1%AE%E5%AE%9A%E2%80%9D%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/538789/%E3%80%90%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD%E3%80%91%E5%BC%B9%E7%AA%97%E2%80%9C%E7%A1%AE%E5%AE%9A%E2%80%9D%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 脚本启动时在主页面控制台打印信息
    console.log('【极简版脚本】已启动，开始持续寻找目标...');

    // 设置一个定时器，每秒检查一次
    const findAndClickInterval = setInterval(() => {

        // 步骤 1: 在主页面寻找目标 iframe
        // 我们使用属性选择器，寻找 src 中包含特定路径的 iframe
        const targetIframe = document.querySelector('iframe[src*="/Content/h5view/page/cdnad.html"]');

        // 如果找到了 iframe
        if (targetIframe) {
            console.log('【极简版脚本】成功找到目标 iframe，尝试进入内部...');

            try {
                // 步骤 2: 访问 iframe 的内部文档
                // 使用兼容性写法，以防万一
                const iframeDoc = targetIframe.contentDocument || targetIframe.contentWindow.document;

                if (iframeDoc) {
                    // 步骤 3: 在 iframe 内部寻找目标按钮
                    // 使用非常精确的属性选择器定位按钮
                    const targetButton = iframeDoc.querySelector('button[onclick="SubmitAnswers_5()"]');

                    // 如果找到了按钮
                    if (targetButton) {
                        console.log('【极简版脚本】成功在 iframe 中找到目标按钮!', targetButton);
                        console.log('【极简版脚本】将在半秒后点击...');

                        setTimeout(() => {
                            targetButton.click();
                            console.log('【极简版脚本】点击完成，任务结束，停止监控。');
                            // 清除定时器，因为任务已经完成
                            clearInterval(findAndClickInterval);
                        }, 500); // 延迟半秒点击，更稳妥
                    }
                    // 如果没找到按钮，不做任何事，等待下一次轮询
                }
            } catch (error) {
                // 如果因为安全策略无法访问 iframe，打印错误并停止
                console.error('【极简版脚本】无法访问 iframe 内容 (可能是跨域安全限制)，监控被迫停止。', error);
                clearInterval(findAndClickInterval);
            }
        }
        // 如果没找到 iframe，不做任何事，等待下一次轮询

    }, 1000); // 每 1000 毫秒 (1秒) 检查一次

})();