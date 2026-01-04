// ==UserScript==
// @name         快速跳转萌娘百科
// @namespace    https://github.com/Zao-chen/Bangumi2Wiki
// @version      2.0.3
// @description  在tab栏中添加跳转萌娘百科按钮。支持条目、人物与角色页面。可以自定义链接。
// @match        https://bangumi.tv/subject/*
// @match        https://bangumi.tv/person/*
// @match        https://bangumi.tv/character/*
// @match        https://bgm.tv/subject/*
// @match        https://bgm.tv/person/*
// @match        https://bgm.tv/character/*
// @match        https://chii.in/subject/*
// @match        https://chii.in/person/*
// @match        https://chii.in/character/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532719/%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BD%AC%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/532719/%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BD%AC%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LOCAL_KEY = 'moegirl_link_template';
    const DEFAULT_TEMPLATE = 'https://zh.moegirl.org.cn/index.php?search={title}';

    const titleLink = document.querySelector('h1.nameSingle a');

    const isSubjectPage = location.pathname.includes('/subject/');
    const isPersonPage = location.pathname.includes('/person/');
    const isCharacterPage = location.pathname.includes('/character/');
    let displayTitle = null;

    if (isSubjectPage || isPersonPage || isCharacterPage) {
        const tips = document.querySelectorAll('#infobox li span.tip');
        for (const tip of tips) {
            const text = tip.textContent.trim();
            if (isSubjectPage && text.startsWith("中文名")) {
                const li = tip.closest('li');
                if (li) {
                    displayTitle = li.textContent.replace(/^中文名[:：]\s*/, '').trim();
                    break;
                }
            }
            if ((isPersonPage || isCharacterPage) && text.startsWith("简体中文名")) {
                const li = tip.closest('li');
                if (li) {
                    displayTitle = li.textContent.replace(/^简体中文名[:：]\s*/, '').trim();
                    break;
                }
            }
        }
    }

    // fallback：使用主标题本身
    if (!displayTitle) {
        displayTitle = titleLink?.textContent.trim() || '未知条目';
    }

    // 去除季数，例如“xxx 第1季”
    displayTitle = displayTitle.replace(/第.*季/g, '').trim();

    const navTabs = document.querySelector('.navTabs.clearit') || document.querySelector('.navTabs');
    if (navTabs) {
        const secondTab = navTabs.children[1] || navTabs.firstElementChild;
        const newTab = document.createElement("li");
        const link = document.createElement("a");
        link.href = 'javascript:void(0)';
        link.textContent = "萌百";
        link.setAttribute('title', `点击跳转到“${displayTitle}”萌娘百科，长按可设置跳转模板`);

        let pressTimer = null;
        let longPressTriggered = false;
        let pointerMoved = false;
        let startX = 0;
        let startY = 0;

        function startPressTimer(e) {
            longPressTriggered = false;
            pointerMoved = false;
            const touch = e.touches ? e.touches[0] : e;
            startX = touch.clientX;
            startY = touch.clientY;

            pressTimer = setTimeout(() => {
                longPressTriggered = true;
                const current = localStorage.getItem(LOCAL_KEY) || DEFAULT_TEMPLATE;
                const newTemplate = prompt("请输入跳转链接模板，使用 {title} 表示条目标题：", current);
                if (newTemplate && newTemplate.includes('{title}')) {
                    localStorage.setItem(LOCAL_KEY, newTemplate);
                    alert("✅ 已保存新模板，刷新页面以生效！");
                } else if (newTemplate) {
                    alert("⚠️ 模板格式无效，必须包含 {title} 作为占位符！");
                }
            }, 700);
        }

        function cancelPressTimer() {
            clearTimeout(pressTimer);
        }

        function handlePointerMove(e) {
            const touch = e.touches ? e.touches[0] : e;
            const dx = Math.abs(touch.clientX - startX);
            const dy = Math.abs(touch.clientY - startY);
            if (dx > 10 || dy > 10) {
                pointerMoved = true;
                cancelPressTimer();
            }
        }

        link.addEventListener("pointerdown", startPressTimer);
        link.addEventListener("pointerup", cancelPressTimer);
        link.addEventListener("pointercancel", cancelPressTimer);
        link.addEventListener("pointermove", handlePointerMove);

        // 防止手机端长按弹出默认菜单
        link.addEventListener("contextmenu", (e) => e.preventDefault());

        link.addEventListener("click", (e) => {
            if (longPressTriggered) {
                e.preventDefault(); // 如果是长按触发，不跳转
                return;
            }
            const template = localStorage.getItem(LOCAL_KEY) || DEFAULT_TEMPLATE;
            const finalUrl = template.replace(/{title}/g, encodeURIComponent(displayTitle));
            window.open(finalUrl, "_blank");
        });

        newTab.appendChild(link);
        navTabs.insertBefore(newTab, secondTab);
    }

})();