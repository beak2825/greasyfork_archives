// ==UserScript==
// @name         全网页右边栏笔记备注（升级版）
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在所有网页上添加右边栏笔记功能，数据保存在本地。如果有笔记内容，默认弹出2秒然后缩回。
// @author       四点金
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/507485/%E5%85%A8%E7%BD%91%E9%A1%B5%E5%8F%B3%E8%BE%B9%E6%A0%8F%E7%AC%94%E8%AE%B0%E5%A4%87%E6%B3%A8%EF%BC%88%E5%8D%87%E7%BA%A7%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/507485/%E5%85%A8%E7%BD%91%E9%A1%B5%E5%8F%B3%E8%BE%B9%E6%A0%8F%E7%AC%94%E8%AE%B0%E5%A4%87%E6%B3%A8%EF%BC%88%E5%8D%87%E7%BA%A7%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const notePanel = document.createElement('div');
    notePanel.id = 'note-panel';
    notePanel.style.position = 'fixed';
    notePanel.style.right = '-250px';
    notePanel.style.top = '50px';
    notePanel.style.width = '250px';
    notePanel.style.height = '400px';
    notePanel.style.backgroundColor = '#f9f9f9';
    notePanel.style.border = '1px solid #ccc';
    notePanel.style.borderRadius = '8px';
    notePanel.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.1)';
    notePanel.style.transition = 'right 0.3s ease';
    notePanel.style.zIndex = '9999';
    notePanel.style.padding = '10px';
    notePanel.style.fontFamily = 'Arial, sans-serif';
    notePanel.innerHTML = `
        <textarea id="note-content" style="width:100%; height:80%; resize:none; padding:5px; font-size:14px; border-radius:4px; border:1px solid #ccc;" placeholder="在这里输入笔记..."></textarea>
        <button id="save-note" style="width:100%; margin-top:10px; background-color:#4CAF50; color:white; border:none; border-radius:4px; padding:10px 0;">保存笔记</button>
        <button id="delete-note" style="width:100%; margin-top:5px; background-color:#f44336; color:white; border:none; border-radius:4px; padding:10px 0;">删除笔记</button>
        <p id="status" style="text-align:center; font-size:12px; color:gray; margin-top:5px;">笔记未保存</p>
    `;

    document.body.appendChild(notePanel);

    const currentUrl = window.location.href;
    const savedNote = localStorage.getItem(currentUrl);
    const noteContent = document.getElementById('note-content');
    const statusText = document.getElementById('status');

    if (savedNote) {
        noteContent.value = savedNote;
        statusText.textContent = '笔记已加载';
        notePanel.style.right = '0';
        setTimeout(() => {
            notePanel.style.right = '-250px';
        }, 2000);
    }

    notePanel.addEventListener('mouseenter', () => {
        notePanel.style.right = '0';
    });

    notePanel.addEventListener('mouseleave', () => {
        notePanel.style.right = '-250px';
    });

    const saveButton = document.getElementById('save-note');
    const deleteButton = document.getElementById('delete-note');

    saveButton.addEventListener('click', () => {
        const note = noteContent.value;
        localStorage.setItem(currentUrl, note);
        statusText.textContent = '笔记已保存！';
    });

    deleteButton.addEventListener('click', () => {
        localStorage.removeItem(currentUrl);
        noteContent.value = '';
        statusText.textContent = '笔记已删除';
    });

    noteContent.addEventListener('input', () => {
        const note = noteContent.value;
        localStorage.setItem(currentUrl, note);
        statusText.textContent = '自动保存中...';
        setTimeout(() => {
            statusText.textContent = '笔记已保存！';
        }, 1000);
    });
})();
