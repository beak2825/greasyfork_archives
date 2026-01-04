// ==UserScript==
// @name         点击(最终幻想XIV || 最终幻想14 || FFXIV || FF14)中文维基物品名操作
// @version      1.0
// @author       Atail
// @match        ff14.huijiwiki.com/wiki/*
// @grant        GM_notification
// @license      GNU GPLv3
// @namespace    http://tampermonkey.net/
// @description 个人简陋制作 点击复制最终幻想XIV中文维基的物品名 一键跳转Universalis
// @downloadURL https://update.greasyfork.org/scripts/426665/%E7%82%B9%E5%87%BB%28%E6%9C%80%E7%BB%88%E5%B9%BB%E6%83%B3XIV%20%7C%7C%20%E6%9C%80%E7%BB%88%E5%B9%BB%E6%83%B314%20%7C%7C%20FFXIV%20%7C%7C%20FF14%29%E4%B8%AD%E6%96%87%E7%BB%B4%E5%9F%BA%E7%89%A9%E5%93%81%E5%90%8D%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/426665/%E7%82%B9%E5%87%BB%28%E6%9C%80%E7%BB%88%E5%B9%BB%E6%83%B3XIV%20%7C%7C%20%E6%9C%80%E7%BB%88%E5%B9%BB%E6%83%B314%20%7C%7C%20FFXIV%20%7C%7C%20FF14%29%E4%B8%AD%E6%96%87%E7%BB%B4%E5%9F%BA%E7%89%A9%E5%93%81%E5%90%8D%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==

'use strict';

const createNotification = (text) => GM_notification({
    text: `『${text}』复制成功`,
    title: '提示',
    image: 'https://av.huijiwiki.com/site_avatar_ff14_l.png?r=0.97450500%201644674382',
    timeout: 2000
});

const copyHandler = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        createNotification(text);
    } catch {
        const node = Object.assign(document.createElement('textarea'), {
            value: text,
            style: 'position:fixed;opacity:0;'
        });
        document.body.append(node);
        node.select();
        document.execCommand('copy');
        node.remove();
        createNotification(text);
    }
};

const createActionButton = (text, clickHandler) => {
    const btn = Object.assign(document.createElement('button'), {
        className: 'ff-action-btn',
        textContent: text,
        onclick: clickHandler
    });
    return btn;
};

const checkMarketStatus = () => {
    const listItem = [...document.querySelectorAll('ul.color-warning > li')]
        .find(li => li.textContent.trim() === '不可在市场出售');
    return !listItem;
};

const processMainTitle = () => {
    const titleEl = document.querySelector('.infobox-item--name-title');
    if (!titleEl) return;

    // 添加复制按钮
    const titleText = titleEl.textContent.trim();
    titleEl.append(createActionButton('复制', () => copyHandler(titleText)));

    // 添加市场跳转
    if (checkMarketStatus()) {
        const garlandLink = document.querySelector('.external[href*="garlandtools"]');
        if (garlandLink) {
            const itemId = garlandLink.href.split('/').pop();
            titleEl.append(createActionButton('跳转市场', () => {
                location.assign(`https://universalis.app/market/${itemId}`);
            }));
        }
    }
};

const processLocalizationPanel = () => {
    for (const div of document.querySelectorAll('.img-v-align-baseline > div')) {
        const text = div.textContent.trim();
        div.append(createActionButton('复制', () => copyHandler(text)));
    }
};

const processCraftingRecipes = () => {
    for (const td of document.querySelectorAll('.item-craft-list td:has(a)')) {
        const text = td.textContent.split('×')[0].trim();
        td.append(createActionButton('复制', () => copyHandler(text)));
    }
};

const processExchangeTables = (headerText) => {
    const spans = document.querySelectorAll('span');
    for (const span of spans) {
        if (span.textContent.trim() === headerText) {
            const table = span.parentElement.nextElementSibling?.querySelector('table');
            if (!table) continue;

            const tds = table.querySelectorAll('td:not(:last-child)');
            for (const td of tds) {
                const text = td.textContent.split('×')[0].trim();
                td.append(createActionButton('复制', () => copyHandler(text)));
            }
        }
    }
};

// 初始化样式
const initStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .ff-action-btn {
            border: 1px dashed #d9d9d9;
            border-radius: 2px;
            color: #fff;
            font-size: 14px;
            margin-left: 10px;
            background: #1c1c1c;
            cursor: pointer;
            padding: 2px 8px;
            transition: opacity 0.2s;
        }
        .ff-action-btn:hover { opacity: 0.8 }
    `;
    document.head.append(style);
};

// 主执行流程
const init = () => {
    initStyles();
    processMainTitle();
    processLocalizationPanel();
    processCraftingRecipes();
    ['通过兑换获得', '用于兑换'].forEach(processExchangeTables);
};

const initialize = () => {
    if (document.readyState === 'complete' ||
        document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    }
};

initialize();