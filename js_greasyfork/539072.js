// ==UserScript==
// @name         爱学班班作文编辑器复制粘贴解锁
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  解除ityxb平台编辑器的复制粘贴限制，点击编辑器弹出自定义文本框，自由复制粘贴，编辑完成后同步回原文。
// @author       error404
// @license      MIT
// @match        https://stu.ityxb.com/writePaper/busywork/*
// @icon         https://stu.ityxb.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539072/%E7%88%B1%E5%AD%A6%E7%8F%AD%E7%8F%AD%E4%BD%9C%E6%96%87%E7%BC%96%E8%BE%91%E5%99%A8%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E8%A7%A3%E9%94%81.user.js
// @updateURL https://update.greasyfork.org/scripts/539072/%E7%88%B1%E5%AD%A6%E7%8F%AD%E7%8F%AD%E4%BD%9C%E6%96%87%E7%BC%96%E8%BE%91%E5%99%A8%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E8%A7%A3%E9%94%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 工具函数：创建弹窗
    function showTextareaDialog(defaultValue, onConfirm) {
        // 避免重复弹窗
        if (document.getElementById('ityxb-paste-dialog')) return;

        const dialog = document.createElement('div');
        dialog.id = 'ityxb-paste-dialog';
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.zIndex = 99999;
        dialog.style.background = '#fff';
        dialog.style.border = '1px solid #aaa';
        dialog.style.borderRadius = '8px';
        dialog.style.boxShadow = '0 0 16px #0003';
        dialog.style.padding = '20px';
        dialog.style.minWidth = '400px';

        const tip = document.createElement('div');
        tip.innerHTML = '请在此文本框进行编辑，防止平台无法复制粘贴。<br>（如需关闭请刷新页面）';
        tip.style.marginBottom = '10px';
        tip.style.color = '#333';

        const textarea = document.createElement('textarea');
        textarea.style.width = '100%';
        textarea.style.height = '200px';
        textarea.value = defaultValue || '';

        const btnBox = document.createElement('div');
        btnBox.style.textAlign = 'right';
        btnBox.style.marginTop = '10px';

        const okBtn = document.createElement('button');
        okBtn.textContent = '确定';
        okBtn.style.marginRight = '10px';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';

        btnBox.appendChild(okBtn);
        btnBox.appendChild(cancelBtn);

        dialog.appendChild(tip);
        dialog.appendChild(textarea);
        dialog.appendChild(btnBox);

        document.body.appendChild(dialog);

        okBtn.onclick = function() {
            onConfirm(textarea.value);
            document.body.removeChild(dialog);
        };
        cancelBtn.onclick = function() {
            document.body.removeChild(dialog);
        };
    }

    // 主逻辑
    function hackEditor() {
        // 查找所有编辑器
        const editors = document.querySelectorAll('.editor-box .ke-edit-iframe');
        editors.forEach(iframe => {
            // 避免重复绑定
            if (iframe._ityxb_hacked) return;
            iframe._ityxb_hacked = true;

            // 监听iframe的点击事件
            iframe.addEventListener('load', function() {
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                if (!doc) return;
                doc.body.addEventListener('click', function(e) {
                    e.preventDefault();
                    // 获取当前内容
                    let text = doc.body.innerText || doc.body.textContent || '';
                    showTextareaDialog(text, function(newText) {
                        // 支持换行
                        doc.body.innerHTML = newText.split('\n').map(line => `<p>${line}</p>`).join('');
                    });
                });
            });

            // 如果iframe已加载，直接绑定
            if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                const doc = iframe.contentDocument;
                doc.body.addEventListener('click', function(e) {
                    e.preventDefault();
                    let text = doc.body.innerText || doc.body.textContent || '';
                    showTextareaDialog(text, function(newText) {
                        doc.body.innerHTML = newText.split('\n').map(line => `<p>${line}</p>`).join('');
                    });
                });
            }
        });
    }

    // 页面加载后自动执行
    function waitForEditor() {
        const timer = setInterval(() => {
            if (document.querySelector('.editor-box .ke-edit-iframe')) {
                clearInterval(timer);
                hackEditor();
            }
        }, 500);
    }

    waitForEditor();
})();
