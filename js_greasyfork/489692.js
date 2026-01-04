// ==UserScript==
// @name         清览题库|清览测验禁用复制和全屏（QINGLINE）
// @namespace    https://app.qingline.net/student/examing*
// @version      0.2
// @description  为清览题库的清览测验提供复制题目和自动退出全屏功能
// @author       NellPoi
// @connect      *
// @match        https://app.qingline.net/student/examing*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489692/%E6%B8%85%E8%A7%88%E9%A2%98%E5%BA%93%7C%E6%B8%85%E8%A7%88%E6%B5%8B%E9%AA%8C%E7%A6%81%E7%94%A8%E5%A4%8D%E5%88%B6%E5%92%8C%E5%85%A8%E5%B1%8F%EF%BC%88QINGLINE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/489692/%E6%B8%85%E8%A7%88%E9%A2%98%E5%BA%93%7C%E6%B8%85%E8%A7%88%E6%B5%8B%E9%AA%8C%E7%A6%81%E7%94%A8%E5%A4%8D%E5%88%B6%E5%92%8C%E5%85%A8%E5%B1%8F%EF%BC%88QINGLINE%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    console.log('清览题库|清览测验禁用复制和全屏 => start');
    'use strict';

    window.addEventListener('load', function () {
        setTimeout(() => {
            init();
        }, 1000);
    });

    function getQuesText() {
        const $ = (s) => [...document.querySelectorAll(s)];

        const head = $(".stem")[0]
            .textContent
            .trim()
            .replace(/^（[0-9]+）/, "")
            .replace(/[。？]/, "")
            .replace(/（\s+?）/g, " ");

        const body = $(".sec_item").map(
            (option) => option.textContent.trim()
        ).join(" ");

        return head + "\n" + body;
    }

    function init() {
        console.log('清览题库|清览测验禁用复制和全屏 => init');
        // 选择fixed_con元素
        const fixedCon = document.querySelector('.fixed_con');

        // 创建一个新的按钮元素
        const newButton = document.createElement('button');
        newButton.type = 'button';
        newButton.style.marginRight = "10px";
        newButton.className = 'complete_btn ant-btn';

        // 创建一个新的span元素并将其添加到按钮中
        const newSpan = document.createElement('span');
        newSpan.textContent = '复制当前题目题目和内容';
        newButton.appendChild(newSpan);

        // 添加新按钮作为fixed_con元素的第一个子元素
        fixedCon.insertBefore(newButton, fixedCon.firstChild);

        newButton.addEventListener('click', function () {
            const textToCopy = getQuesText();
            navigator.clipboard.writeText(textToCopy)
                .then(function () {
                    console.log('Text copied to clipboard');
                    // 创建一个新的元素来显示复制成功的消息
                    const copySuccessMessage = document.createElement('div');
                    copySuccessMessage.textContent = '复制成功~';
                    copySuccessMessage.style.position = 'fixed';
                    copySuccessMessage.style.bottom = '10px';
                    copySuccessMessage.style.right = '10px';
                    copySuccessMessage.style.padding = '10px';
                    copySuccessMessage.style.backgroundColor = '#3d64ff';
                    copySuccessMessage.style.color = 'white';
                    copySuccessMessage.style.borderRadius = '5px';
                    document.body.appendChild(copySuccessMessage);

                    // 一段时间后隐藏消息
                    setTimeout(function () {
                        copySuccessMessage.style.display = 'none';
                    }, 2000);
                })
                .catch(function (error) {
                    console.error('Failed to copy text to clipboard:', error);
                });
        });

        // 检查是否存在弹窗
        const modal = document.querySelector('.ant-modal-body');
        console.log(modal);
        if (modal) {
            const modalRoot = document.querySelector('.ant-modal-root.ant-modal-confirm.ant-modal-confirm-info.ant-modal-info.ant-modal-confirm.ant-modal-confirm-info.ant-modal-info');
            modalRoot.remove();
        }
    }
})();