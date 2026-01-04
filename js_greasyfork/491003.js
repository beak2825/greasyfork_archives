// ==UserScript==
// @name              Overleaf PDF Viewer Page Numbers
// @name:zh-CN        Overleaf PDF 预览界面显示页码
// @version           0.1.0
// @description       show page numbers in PDF preview panel
// @description:zh-cn 在 Overleaf 的 PDF 预览界面中显示页码
// @author            wanng
// @match             https://www.overleaf.com/project/*
// @icon              https://www.overleaf.com/favicon.ico
// @grant             none
// @license           MIT
// @namespace https://greasyfork.org/users/326819
// @downloadURL https://update.greasyfork.org/scripts/491003/Overleaf%20PDF%20Viewer%20Page%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/491003/Overleaf%20PDF%20Viewer%20Page%20Numbers.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 设置一个标志来指示按钮是否已添加
    let btnAdded = false;
    let totalLenBtnAdded = false; // 新增标志来指示总页数按钮是否已添加

    const id = setInterval(() => {
        // 只有在两个按钮均未添加时才尝试添加按钮
        if (!btnAdded || !totalLenBtnAdded) {
            const btns = document.querySelector('.pdfjs-controls .btn-group');
            if (btns) {
                if (!btnAdded) {
                    const btn = btns.lastElementChild.cloneNode(true); // 克隆最后一个按钮
                    btn.href = '#';
                    btn.innerText = '...'; // 初始文本

                    // 添加点击事件监听器
                    btn.onclick = () => {
                        // 在按钮点击时重新查询页面元素
                        const pages = document.querySelectorAll('.pdfjs-viewer-inner .pdfViewer .page');
                        const total_len = pages.length; // 获取总页数
                        if (total_len === 0) {
                            btn.innerText = '...'; // 如果没有找到页面，显示Loading...
                            console.log('Attempting to reload pages...');
                            setTimeout(btn.onclick, 10); // 延迟重试
                            return; // 退出函数
                        }

                        for (let i = 0; i < pages.length; ++i) {
                            if (isInViewport(pages[i])) {
                                btn.innerText = `${i + 1}`; // 更新按钮文本为当前页数/总页数
                                break;
                            }
                        }
                    };

                    btns.appendChild(btn); // 将新按钮添加到按钮组中
                    btnAdded = true; // 标记按钮已添加
                    btn.onclick(); // 立即触发一次点击事件以更新按钮文本
                }

                if (!totalLenBtnAdded) {
                    const totalLenBtn = btns.lastElementChild.cloneNode(true); // 再次克隆最后一个按钮
                    totalLenBtn.href = '#';
                    totalLenBtn.innerText = 'total'; // 初始文本

                    // 修改此按钮的点击事件仅显示总页数
                    totalLenBtn.onclick = () => {
                        const pages = document.querySelectorAll('.pdfjs-viewer-inner .pdfViewer .page');
                        totalLenBtn.innerText = `${pages.length}`; // 更新按钮文本显示总页数
                    };

                    btns.appendChild(totalLenBtn); // 将总页数按钮添加到按钮组中
                    totalLenBtnAdded = true; // 标记总页数按钮已添加
                    totalLenBtn.onclick(); // 立即触发一次点击事件以更新按钮文本
                }
            }
        }
    }, 5); // 每1000毫秒检查一次，直到成功添加按钮

    // 定义一个函数来检查元素是否在视口中
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
})();
