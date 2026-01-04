// ==UserScript==
// @name         Bangumi Open Local Explorer
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  打开bangumi条目相对应的本地文件夹并在obsidian里添加相关笔记
// @author       Sedoruee
// @match        https://bgm.tv/subject/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/513641/Bangumi%20Open%20Local%20Explorer.user.js
// @updateURL https://update.greasyfork.org/scripts/513641/Bangumi%20Open%20Local%20Explorer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 生成随机UUID的函数
    function generateUUID() {
        // 如果浏览器支持crypto.randomUUID()
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }

        // 备用实现方案
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    const pageUrl = window.location.href;
    const todayDate = new Date().toISOString().slice(0, 10);
    const ahkLink = 'localexplorer:D:\\Obsidian\\.code\\python\\Gamecreat_bgmID.py';
    // 为项目生成一个随机UUID，确保页面上三个按钮使用相同的UUID
    const randomUUID = generateUUID();

    const subjectType = document.querySelector('.nameSingle > .grey')?.textContent;
    const subjectTitle = document.querySelector('.nameSingle > a')?.textContent;
    const subjectprofile = document.querySelector('div#subject_summary')?.textContent.replace(/\s+/g, ' ').trim();
    const tagsSelector = '.inner > a.l > span';
    const kindSelector = { 'Galgame': '视觉小说', '剧场版': '剧场版', 'TV': 'TV' };
    const nameSingleSelector = '.nameSingle';

    if (!subjectType) return;

    let nameSingle = document.querySelector(nameSingleSelector);
    if (!nameSingle) return;

    // 第一个按钮：打开本地文件夹
    let button1 = document.createElement('button');
    button1.textContent = '打开本地文件夹';
    button1.style.marginLeft = '10px';
    nameSingle.appendChild(button1);

    button1.addEventListener('click', function() {
        let tags = '', subjectKind = '';

        tags = Array.from(document.querySelectorAll(tagsSelector)).map(tagElement => `  - ${tagElement.textContent}`).join('\n');
        subjectKind = Object.keys(kindSelector).find(key => tags.includes(key));
        subjectKind = kindSelector[subjectKind] || '游戏';
        //正则替换
        const cleanTitle = subjectTitle.replace(/[<>:"/\\|? *\x00-\x1F\x7F#%&{}\[\]()\`~;,'^$=+!@]/g, '_');

        let formattedText = `
---
ID: ${randomUUID}
标题: ${subjectTitle}
链接: ${pageUrl}
类型: ${subjectType}
种类: ${subjectKind}
简介: "${subjectprofile}"
评分:
开始时间: ${todayDate}
结束时间:
用时:
tags:
${tags}
评价:
---

![[000设置/素材库/流程图：${cleanTitle}.canvas]]
![[000设置/素材库/读书笔记：${cleanTitle}.md]]
`;

        GM_setClipboard(formattedText.trim(), 'text');
        window.location.href = ahkLink;
    });

    // 第二个按钮：加入愿望单 (无条件出现)
    let button2 = document.createElement('button');
    button2.textContent = '加入愿望单';
    button2.style.marginLeft = '10px';
    nameSingle.appendChild(button2);

    button2.addEventListener('click', function() {
        let tags = '', subjectKind = '';
        tags = Array.from(document.querySelectorAll(tagsSelector)).map(tagElement => `  - ${tagElement.textContent}`).join('\n');
        subjectKind = Object.keys(kindSelector).find(key => tags.includes(key));
        subjectKind = kindSelector[subjectKind] || '游戏';
        //正则替换
        const cleanTitle = subjectTitle.replace(/[<>:"/\\|? *\x00-\x1F\x7F#%&{}\[\]()\`~;,'^$=+!@]/g, '_');

        let formattedText = `
---
ID: ${randomUUID}
标题: ${subjectTitle}
链接: ${pageUrl}
类型: ${subjectType}
种类: ${subjectKind}
简介: ${subjectprofile}
评分:
开始时间:
结束时间:
用时:
tags:
${tags}
评价:
---

![[000设置/素材库/流程图：${cleanTitle}.canvas]]
![[000设置/素材库/读书笔记：${cleanTitle}.md]]
`;

        GM_setClipboard(formattedText.trim(), 'text');
        window.location.href = ahkLink;
    });

    // 第三个按钮：复制条目信息
    let button3 = document.createElement('button');
    button3.textContent = '复制条目信息';
    button3.style.marginLeft = '10px';
    nameSingle.appendChild(button3);

    button3.addEventListener('click', function() {
        let tags = '', subjectKind = '';
        tags = Array.from(document.querySelectorAll(tagsSelector)).map(tagElement => `  - ${tagElement.textContent}`).join('\n');
        subjectKind = Object.keys(kindSelector).find(key => tags.includes(key));
        subjectKind = kindSelector[subjectKind] || '游戏';
        //正则替换
        const cleanTitle = subjectTitle.replace(/[<>:"/\\|? *\x00-\x1F\x7F#%&{}\[\]()\`~;,'^$=+!@]/g, '_');

        let formattedText = `
---
ID: ${randomUUID}
标题: ${subjectTitle}
链接: ${pageUrl}
类型: ${subjectType}
种类: ${subjectKind}
简介: ${subjectprofile}
评分:
开始时间:
结束时间:
用时:
tags:
${tags}
评价:
---

![[000设置/素材库/流程图：${cleanTitle}.canvas]]
![[000设置/素材库/读书笔记：${cleanTitle}.md]]
`;

        GM_setClipboard(formattedText.trim(), 'text');
        // Create a popup element
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'white';
        popup.style.border = '1px solid black';
        popup.style.padding = '50px';
        popup.style.zIndex = '1000'; // Ensure it's on top
        popup.textContent = '已复制到剪切板';
        document.body.appendChild(popup);

        // Remove the popup after a delay
        setTimeout(() => {
            document.body.removeChild(popup);
        }, 2000); // 2 seconds
    });

})();