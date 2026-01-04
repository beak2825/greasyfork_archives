// ==UserScript==
// @name         Bangumi 复制到剪切板
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Bangumi 复制条目信息到剪切板
// @author       Sedoruee
// @match        https://bgm.tv/subject/*
// @match        https://www.imdb.com/title/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519761/Bangumi%20%E5%A4%8D%E5%88%B6%E5%88%B0%E5%89%AA%E5%88%87%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/519761/Bangumi%20%E5%A4%8D%E5%88%B6%E5%88%B0%E5%89%AA%E5%88%87%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pageUrl = window.location.href;
    const todayDate = new Date().toISOString().slice(0, 10);
    const ahkLink = 'localexplorer:D:\\Tools\\Autohotkey\\Gamecreat_bgmID.ahk';

    let subjectType, subjectTitle, subjectprofile, tagsSelector, kindSelector, statusSelector, nameSingleSelector;

    if (pageUrl.includes('bgm.tv')) {
        subjectType = document.querySelector('.nameSingle > .grey')?.textContent;
        subjectTitle = document.querySelector('.nameSingle > a')?.textContent;
        subjectprofile = document.querySelector('div#subject_summary')?.textContent.replace(/\s+/g, ' ').trim();
        tagsSelector = '.inner > a.l > span';
        kindSelector = { 'Galgame': '视觉小说', '剧场版': '剧场版', 'TV': 'TV', '漫画系列': '漫画' };
        statusSelector = { '我在玩这游戏': '进行中', '我玩过这游戏': '已完成', '我想玩这游戏': '愿望单' };
        nameSingleSelector = '.nameSingle';
    } else if (pageUrl.includes('imdb.com')) {
        subjectType = document.querySelector('.sc-ec65ba05-2 > .ipc-inline-list__item:nth-child(1)')?.textContent;
        subjectTitle = document.querySelector('span[data-testid="hero__primary-text"]')?.textContent;
        subjectprofile = document.querySelector('div[data-testid="plot-xl"]')?.textContent.replace(/\s+/g, ' ').trim();
        kindSelector = subjectType;
        statusSelector = 'Playing';
        nameSingleSelector = '.sc-afe43def-1';
    } else {
        return;
    }

    if (!subjectType) return;

    let button = document.createElement('button');
    button.textContent = '复制条目信息';
    button.style.marginLeft = '10px';

    button.addEventListener('click', function() {
        let tags = '', subjectKind = '', status = '';

        if (pageUrl.includes('bgm.tv')) {
            tags = Array.from(document.querySelectorAll(tagsSelector)).map(tagElement => `  - ${tagElement.textContent}`).join('\n');
            subjectKind = Object.keys(kindSelector).find(key => tags.includes(key));
            subjectKind = kindSelector[subjectKind] || '游戏';
            status = statusSelector[document.querySelector('span.interest_now')?.textContent.trim()] || '未知状态';
        } else if (pageUrl.includes('imdb.com')) {
            subjectKind = kindSelector;
            status = statusSelector;
        }

        let formattedText = `
---
标题: ${subjectTitle}
链接: ${pageUrl}
类型: ${subjectType}
种类: ${subjectKind}
简介: ${subjectprofile}
评分:
开始时间: ${todayDate}
结束时间:
用时:
tags:
${tags}
评价:
---

![[000设置/素材库/流程图：${subjectTitle}.canvas]]
![[000设置/素材库/读书笔记：${subjectTitle}.md]]
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

// Add the popup to the page
document.body.appendChild(popup);

// Set a timeout to remove the popup after a short delay (e.g., 0.6 seconds)
setTimeout(() => {
  document.body.removeChild(popup);
}, 600);

// Add the popup to the page
document.body.appendChild(popup);
    });

    let nameSingle = document.querySelector(nameSingleSelector);
    if (nameSingle) nameSingle.appendChild(button);
})();