// ==UserScript==
// @name         SegumiOS Open Local Explorer from bilibili
// @namespace    http://tampermonkey.net/
// @version      1.19
// @description  Open local explorer and create notes for bilibili videos.
// @author       Sedoruee&Yuri
// @match        https://www.bilibili.com/video/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @require       https://cdn.jsdelivr.net/npm/sweetalert2@11
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520221/SegumiOS%20Open%20Local%20Explorer%20from%20bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/520221/SegumiOS%20Open%20Local%20Explorer%20from%20bilibili.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pageUrl = window.location.href;
    const bvMatch = pageUrl.match(/bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/);
    const cleanUrl = bvMatch ? `https://www.bilibili.com/video/${bvMatch[1]}/` : pageUrl;
    const todayDate = new Date().toISOString().slice(0, 10);
    const ahkLink = 'localexplorer:D:\\Obsidian\\000设置\\脚本\\python\\Gamecreat_bgmID.py'; // Remember to update this!

    const subjectTitle = document.querySelector('h1.video-title')?.textContent?.trim() || "未命名视频";
    const subjectprofile = document.querySelector('div.basic-desc-info')?.textContent?.replace(/\s+/g, ' ')?.trim() || "";
    const tagsElements = document.querySelectorAll('div.tag-panel .tag-link') || [];
    let tags = Array.from(tagsElements).map(tagElement => tagElement.textContent.trim()).join(' ');

    const isGame = /(游戏|单机游戏|主机游戏|PC游戏)/i.test(tags);
    const isOnlineCourse = /(网课|知识|学习|教程|课程)/i.test(tags);
    let videoType = isGame ? "游戏" : (isOnlineCourse ? "网课" : "其他");

    const panel = document.createElement('div');
    panel.id = 'bilibili-note-panel';
    document.body.appendChild(panel);

    const button = document.createElement('button');
    button.id = 'bilibili-note-button';
    button.textContent = '打开本地文件夹并创建笔记';
    panel.appendChild(button);

    GM_addStyle(`
        #bilibili-note-panel {
          position: absolute;
          z-index: 9999;
          background-color: #f0f0f0;
          color: #333;
          border: 1px solid #ccc;
          padding: 5px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          opacity: 0.9;
          min-width: 150px;
          max-width: 200px;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        #bilibili-note-panel.active {
          transform: scale(1.05);
          opacity: 1;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        #bilibili-note-button {
          background-color: #FFB6C1;
          border: none;
          color: white;
          padding: 8px 16px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 14px;
          margin: 0;
          cursor: pointer;
          border-radius: 6px;
          transition: background-color 0.3s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          white-space: nowrap;
          animation: button-pulse 1s infinite;
        }

        #bilibili-note-button:hover {
          background-color: #FF80AB;
        }

        @keyframes button-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
    `);

    button.addEventListener('click', () => {
        let formattedTags = Array.from(tagsElements).map(tagElement => `  - ${tagElement.textContent.trim()}`).join('\n');

        let formattedText = `
---
标题: ${subjectTitle}
链接: ${cleanUrl}
类型: 视频
种类: ${videoType}
简介: ${subjectprofile}
评分:
开始时间: ${todayDate}
结束时间:
用时:
tags:
${formattedTags}
评价:
---

![[000设置/素材库/流程图：${subjectTitle}.canvas]]
![[000设置/素材库/读书笔记：${subjectTitle}.md]]
`;

        GM_setClipboard(formattedText.trim(), 'text');

        try {
            window.location.href = ahkLink;
        } catch (error) {
            console.error("Error opening local explorer:", error);
            Swal.fire({
                icon: 'error',
                title: '错误!',
                text: '打开本地文件夹失败，请检查路径是否正确。'
            });
            return;
        }

        let timeLeft = 3;
        let countdown;

        Swal.fire({
            icon: 'success',
            title: '成功!',
            text: '笔记已复制到剪贴板，并已打开本地文件夹！',
            showConfirmButton: true,
            confirmButtonText: `关闭 (${timeLeft}s)`,
            allowOutsideClick: false,
            didOpen: () => {
                countdown = setInterval(() => {
                    timeLeft--;
                    Swal.getConfirmButton().textContent = `关闭 (${timeLeft}s)`;
                    if (timeLeft <= 0) {
                        clearInterval(countdown);
                        Swal.close();
                    }
                }, 1000);
            },
            willClose: () => {
                clearInterval(countdown);
            }
        });
    });

    const horizontalSpacing = 20; // Adjust this value to control spacing

    function positionPanel() {
        const titleElement = document.querySelector('h1.video-title');

        if (titleElement) {
            const titleRect = titleElement.getBoundingClientRect();
            const panel = document.getElementById('bilibili-note-panel');
            panel.style.top = `${titleRect.top + window.scrollY}px`;
            panel.style.left = `${titleRect.right + horizontalSpacing}px`;
        }
    }

    positionPanel();
    window.addEventListener('resize', positionPanel);
    window.addEventListener('scroll', positionPanel);

})();