// ==UserScript==
// @name         NovelJump
// @name:zh      小说章节跳转
// @namespace    https://github.com/SuniRein/scripts
// @version      1.1.0
// @description  轻松跳转小说章节
// @author       SuniRein
// @match        https://www.linovelib.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linovelib.com
// @license      GPL3
// @supportURL   https://github.com/SuniRein/scripts/blob/main/CHANGELOG.md
// @downloadURL https://update.greasyfork.org/scripts/536930/NovelJump.user.js
// @updateURL https://update.greasyfork.org/scripts/536930/NovelJump.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getCurrentUrlInfo() {
        const match = location.pathname.match(/\/novel\/(\d+)\/(\d+)(?:_(\d+))?\.html/);
        if (!match) {
            console.error('[NovelJump] 当前页面 URL 格式不符合预期');
            return null;
        }
        return {
            novelId: parseInt(match[1], 10),
            chapterId: parseInt(match[2], 10),
            sectionId: match[3] ? parseInt(match[3], 10) : 1,
        };
    }

    function generateUrl(novelId, chapterId, sectionId) {
        return `/novel/${novelId}/${chapterId}${sectionId > 1 ? '_' + sectionId : ''}.html`;
    }

    function jump(novelId, chapterId, sectionId) {
        if (chapterId < 1) {
            console.warn('[NovelJump] 无效的章节编号: ', chapterId);
            return;
        }

        if (sectionId < 1) {
            console.warn('[NovelJump] 无效的节偏移值');
            return;
        }

        window.location.href = generateUrl(novelId, chapterId, sectionId);
    }

    function getFinalSectionId(info) {
        if (info.sectionId == 1) {
            console.log('[NovelJump] 当前章节为第一节，无法获取最后一节 ID');
            return null;
        }

        const title = document.getElementsByTagName('h1')[0].textContent;
        const finalSectionIdStr = title.match(/（(\d+)\/(\d+)）/)[2];
        const finalSectionId = parseInt(finalSectionIdStr, 10);
        console.log('[NovelJump] 成功获取最后一节 ID');

        return finalSectionId;
    }

    // 创建悬浮框并添加到页面
    function createFloatingPanel(info) {
        const { novelId, chapterId, sectionId } = info;

        const panel = document.createElement('div');
        panel.id = 'chapter-nav-box';
        panel.style.position = 'fixed';
        panel.style.top = '50%';
        panel.style.right = '10px';
        panel.style.transform = 'translateY(-50%)';
        panel.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        panel.style.border = '1px solid #ccc';
        panel.style.borderRadius = '8px';
        panel.style.padding = '10px';
        panel.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
        panel.style.zIndex = '9999';
        panel.style.fontFamily = 'sans-serif';
        panel.style.fontSize = '14px';
        panel.style.width = '90px';

        const prevBtn = document.createElement('button');
        prevBtn.textContent = '上一章';
        prevBtn.onclick = () => jump(novelId, chapterId - 1, 1);

        const nextBtn = document.createElement('button');
        nextBtn.textContent = '下一章';
        nextBtn.onclick = () => jump(novelId, chapterId + 1, 1);

        const input = document.createElement('input');
        input.type = 'number';
        input.min = '1';
        input.placeholder = '节号';
        input.id = 'section-input';
        input.style.width = '100%';
        input.style.marginTop = '6px';
        input.style.boxSizing = 'border-box';
        input.value = sectionId + 1; // 自动填充下一节

        const goBtn = document.createElement('button');
        goBtn.textContent = '跳转节';
        goBtn.onclick = () => {
            const sectionInput = document.getElementById('section-input');
            const section = parseInt(sectionInput.value, 10);
            if (isNaN(section) || section <= 0) {
                alert('请输入有效的节号（正整数）！');
                return;
            }
            jump(novelId, chapterId, section);
        };

        let elements = [prevBtn, nextBtn, input, goBtn];

        let finalSectionId = getFinalSectionId(info);
        if (finalSectionId) {
            const lastBtn = document.createElement('button');
            lastBtn.textContent = '最后一节';
            lastBtn.onclick = () => jump(novelId, chapterId, finalSectionId);
            elements.push(lastBtn);
        }

        elements.forEach((el) => {
            el.style.display = 'block';
            el.style.margin = '4px 0';
            el.style.width = '100%';
            el.style.padding = '6px';
            if (el.tagName === 'BUTTON') {
                el.style.backgroundColor = '#409eff';
                el.style.color = '#fff';
                el.style.border = 'none';
                el.style.borderRadius = '4px';
                el.style.cursor = 'pointer';
                el.onmouseenter = () => (el.style.backgroundColor = '#66b1ff');
                el.onmouseleave = () => (el.style.backgroundColor = '#409eff');
            }
            panel.appendChild(el);
        });

        document.body.appendChild(panel);
    }

    console.log('[NovelJump] 解析页面信息');
    const info = getCurrentUrlInfo();
    console.debug('[NovelJump] 当前页面信息:', info);

    function waitForBodyAndInit() {
        const checkInterval = setInterval(() => {
            if (document.body) {
                clearInterval(checkInterval);
                createFloatingPanel(info);
                console.log('[NovelJump] 脚本加载完成');
            }
        }, 100);
    }

    waitForBodyAndInit();
})();
