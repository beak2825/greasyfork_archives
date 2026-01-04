// ==UserScript==
// @name         浙江大学转专业申请须知自动关闭
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动关闭浙江大学教务系统转专业申请页面的"申请须知"弹窗，无需等待5秒倒计时
// @author       small_fireworks
// @match        https://zdbk.zju.edu.cn/jwglxt/xjydnew/zzysqgl_cxZzysqIndex.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547184/%E6%B5%99%E6%B1%9F%E5%A4%A7%E5%AD%A6%E8%BD%AC%E4%B8%93%E4%B8%9A%E7%94%B3%E8%AF%B7%E9%A1%BB%E7%9F%A5%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/547184/%E6%B5%99%E6%B1%9F%E5%A4%A7%E5%AD%A6%E8%BD%AC%E4%B8%93%E4%B8%9A%E7%94%B3%E8%AF%B7%E9%A1%BB%E7%9F%A5%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    $(document).ready(function() {
        // 使用MutationObserver监听弹窗出现
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // 检查新增节点
                if (mutation.addedNodes) {
                    for (const node of mutation.addedNodes) {
                        if (node.id === 'popTipsModal' ||
                            (node.querySelector && node.querySelector('#popTipsModal')) ||
                            (node.classList && node.classList.contains('bootbox') && node.querySelector('.modal-title')?.textContent.includes('申请须知'))) {
                            handleModal();
                        }
                    }
                }

                // 检查弹窗显示状态变化
                if (mutation.type === 'attributes' && mutation.target.id === 'popTipsModal') {
                    if (mutation.target.style.display === 'block') {
                        handleModal();
                    }
                }
            });
        });

        // 开始监听DOM变化
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style']
        });

        // 处理弹窗函数
        function handleModal() {
            const button = document.querySelector('#popTipsModal #btn_success');
            if (!button) {
                setTimeout(handleModal, 100);
                return;
            }

            // 立即启用按钮并移除倒计时文本
            button.disabled = false;
            button.textContent = '我已阅读，继续';

            // 立即点击按钮
            button.click();
            console.log('已自动关闭申请须知弹窗');
        }

        // 定期检查弹窗状态
        setInterval(() => {
            const modal = document.getElementById('popTipsModal');
            if (modal && modal.style.display === 'block') {
                handleModal();
            }
        }, 500);
    });
})();