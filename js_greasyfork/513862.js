// ==UserScript==
// @name         豆瓣用户主页记录
// @version      0.0.2
// @description  为每个豆瓣用户创建独立的记录，存储用户名、用户ID和网址
// @author       ✌
// @match        https://www.douban.com/people/*
// @grant        GM.setValue
// @grant        GM.getValue
// @namespace https://greasyfork.org/users/1384897
// @downloadURL https://update.greasyfork.org/scripts/513862/%E8%B1%86%E7%93%A3%E7%94%A8%E6%88%B7%E4%B8%BB%E9%A1%B5%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/513862/%E8%B1%86%E7%93%A3%E7%94%A8%E6%88%B7%E4%B8%BB%E9%A1%B5%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 延迟以确保页面加载完成
    setTimeout(async function () {
        const userNameElement = document.querySelector('#db-usr-profile h1');
        if (!userNameElement) {
            console.error('未找到用户名元素');
            return;
        }

        const userName = userNameElement.innerText.trim();
        const userURL = window.location.href;
        const userID = userURL.split('/').filter(Boolean).pop();

        const profileHeader = document.querySelector('#db-usr-profile h1');
        if (!profileHeader) {
            console.error('未找到用户资料头部');
            return;
        }

        const noteContainer = document.createElement('div');
        noteContainer.style.marginTop = '10px';
        noteContainer.style.display = 'flex';

        const noteInput = document.createElement('textarea');
        noteInput.rows = 4;
        noteInput.cols = 50;
        noteInput.placeholder = '记录关于该用户...';
        noteInput.style.flexGrow = '1';
        noteInput.style.fontSize = '14px';

        const savedData = await GM.getValue(`user_data_${userID}`, { note: '', name: userName, url: userURL });
        noteInput.value = savedData.note; 

        if (savedData.note) {
            noteInput.readOnly = true;
            noteInput.style.backgroundColor = '#f0f0f0';
        }

        const saveButton = document.createElement('button');
        saveButton.innerText = '保存';
        saveButton.style.marginLeft = '5px';
        saveButton.style.padding = '2px 5px';
        saveButton.style.fontSize = '11px';
        saveButton.style.height = '30px';

        saveButton.addEventListener('click', async function () {
            const noteContent = noteInput.value;
            if (noteContent) {
                await GM.setValue(`user_data_${userID}`, {
                    note: noteContent,
                    name: userName,
                    url: userURL,
                    id: userID
                });

                noteInput.readOnly = true;
                noteInput.style.backgroundColor = '#f0f0f0';
            } else {
                alert('请输入内容后再保存');
            }
        });

        noteInput.addEventListener('dblclick', function () {
            noteInput.readOnly = false;
            noteInput.style.backgroundColor = '#ffffff';
        });

        noteContainer.appendChild(noteInput);
        noteContainer.appendChild(saveButton);

        profileHeader.appendChild(noteContainer);
    }, 1000);
})();
