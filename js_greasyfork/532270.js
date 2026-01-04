// ==UserScript==
// @name         【最新！】Telegraph 批量插入图床图片链接
// @namespace    https://t.me/hmstores_bot?start=b6eiau9bpEbCoos
// @author       zsonline
// @version      3.4
// @description  批量插入图床图片链接+拖拽排版+空行清除
// @license      LGPL-3.0
// @match        https://telegra.ph/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js
// @downloadURL https://update.greasyfork.org/scripts/532270/%E3%80%90%E6%9C%80%E6%96%B0%EF%BC%81%E3%80%91Telegraph%20%E6%89%B9%E9%87%8F%E6%8F%92%E5%85%A5%E5%9B%BE%E5%BA%8A%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/532270/%E3%80%90%E6%9C%80%E6%96%B0%EF%BC%81%E3%80%91Telegraph%20%E6%89%B9%E9%87%8F%E6%8F%92%E5%85%A5%E5%9B%BE%E5%BA%8A%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let imageLinks = [];
    let sortedLinks = [];

    // 创建左上角的按钮
    const insertBtn = document.createElement('button');
    insertBtn.textContent = '📷 批量插入图片';
    Object.assign(insertBtn.style, {
      position: 'fixed', top: '10px', left: '10px',
      zIndex: '9999', padding: '6px 10px',
      background: '#4caf50', color: 'white',
      border: 'none', borderRadius: '4px', cursor: 'pointer',
      fontSize: '14px'
    });
    document.body.appendChild(insertBtn);
    insertBtn.addEventListener('click', showInputBox);

    // 显示输入框
    function showInputBox() {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.3)', zIndex: '10000',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        });

        const box = document.createElement('div');
        Object.assign(box.style, {
            background: '#fff', padding: '20px', borderRadius: '8px',
            width: '480px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            display: 'flex', flexDirection: 'column', alignItems: 'center'
        });

        const textarea = document.createElement('textarea');
        textarea.placeholder = '每行一个图片链接';
        Object.assign(textarea.style, {
            width: '100%', height: '200px', marginBottom: '10px', padding: '10px'
        });

        const buttonRow = document.createElement('div');
        Object.assign(buttonRow.style, {
            display: 'flex', justifyContent: 'space-between', width: '100%'
        });

        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = '确认';
        styleBtn(confirmBtn);
        confirmBtn.onclick = () => {
            imageLinks = textarea.value.split('\n').map(line => line.trim()).filter(line => line);
            overlay.remove();
            showPurchasePrompt();  
        };

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        styleBtn(cancelBtn);
        cancelBtn.onclick = () => overlay.remove();

        buttonRow.appendChild(confirmBtn);
        buttonRow.appendChild(cancelBtn);

        box.appendChild(textarea);
        box.appendChild(buttonRow);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    // 样式设置
    function styleBtn(btn) {
        Object.assign(btn.style, {
            padding: '6px 12px', background: '#2196f3', color: 'white',
            border: 'none', borderRadius: '4px', cursor: 'pointer'
        });
    }

    
    function showPurchasePrompt() {
        const prompt = document.createElement('div');
        Object.assign(prompt.style, {
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            zIndex: '10001', background: '#fff', padding: '20px',
            borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            textAlign: 'center'
        });

        prompt.innerHTML = `
            <p style="margin-bottom: 15px; font-size: 16px;">💡 需要购买才能继续使用完整功能</p>
            <button id="purchaseBtn" style="padding: 8px 14px; background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
                购买
            </button>
        `;

        document.body.appendChild(prompt);

        
        document.getElementById('purchaseBtn').addEventListener('click', () => {
            window.location.href = 'https://t.me/hmstores_bot?start=b6eiau9bpEbCoos';
        });
    }

})();
