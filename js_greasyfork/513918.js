// ==UserScript==
// @name         掌心纵横四海-任务通用
// @namespace    http://fybgame.top/
// @version      1.0.0
// @description  现在还不能做商店买东西的任务，同时有时候打怪如果怪物在后面位置可能会重复打前面的怪
// @author       fyb
// @match        http://wwvv.anxiusuo.com/wap/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513918/%E6%8E%8C%E5%BF%83%E7%BA%B5%E6%A8%AA%E5%9B%9B%E6%B5%B7-%E4%BB%BB%E5%8A%A1%E9%80%9A%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/513918/%E6%8E%8C%E5%BF%83%E7%BA%B5%E6%A8%AA%E5%9B%9B%E6%B5%B7-%E4%BB%BB%E5%8A%A1%E9%80%9A%E7%94%A8.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 定义常量
    const CONSTANTS = {
        BASE_URL: 'http://wwvv.anxiusuo.com/wap/',
        URLS: {
            CK: '?ck',
            MAP: '?map',
            TASK: '?task',
            PK: '?pk',
            NPC: '?npc',
            TASK_ID: '?task_id',
            TASK_SUBMIT: '?task_id_submit_into',
            NPC_GET: '?npc_get_into',
            TASK_GET: '?task_get_into'
        },
        SELECTORS: {
            WAP_CLASS: 'wap_class',
            TASK_COMPLETE_TEXT: '完成任务'
        }
    };

    // 工具函数
    function generateRandomDelay(min, max) {
        min = Math.ceil(min * 10);
        max = Math.floor(max * 10);
        const result = (Math.floor(Math.random() * (max - min + 1)) + min) / 10;
        return parseFloat(result.toFixed(1));
    }

    function removeChinese(str) {
        return str.replace(/[\u4E00-\u9FA5]/g, '');
    }

    function clickElement(element) {
        if (element) {
            element.click();
            return true;
        }
        return false;
    }

    // 核心功能
    function attack() {
        const firstLink = document.getElementsByTagName('a')[0];
        clickElement(firstLink);
    }

    function checkTaskCompletion() {
        const wapClass = document.getElementById(CONSTANTS.SELECTORS.WAP_CLASS);
        if (!wapClass || !wapClass.textContent.includes(CONSTANTS.SELECTORS.TASK_COMPLETE_TEXT)) {
            return false;
        }

        const [current, total] = wapClass.textContent
            .split('(')[1]
            .split(')')[0]
            .split('/')
            .map(num => parseInt(removeChinese(num)));

        if (current >= total) {
            window.localStorage.setItem('task', '1');
            return true;
        }
        return false;
    }

    // 页面处理函数
    function handleMainPage() {
        const links = document.getElementsByTagName('a');
        const urlPatterns = [
            { pattern: CONSTANTS.URLS.TASK, condition: () => true },
            { pattern: CONSTANTS.URLS.PK, condition: () => true },
            { pattern: CONSTANTS.URLS.NPC, condition: (link) => link.previousElementSibling.tagName === 'IMG' },
            { pattern: CONSTANTS.URLS.MAP, condition: () => true }
        ];

        for (let i = 0; i < links.length; i++) {
            const link = links[i];

            if (window.localStorage.getItem('task') === '1' && link.innerHTML === '任务') {
                clickElement(link);
                break;
            }

            for (const { pattern, condition } of urlPatterns) {
                if (link.href.includes(CONSTANTS.BASE_URL + pattern) && condition(link)) {
                    clickElement(link);
                    return;
                }
            }
        }
    }

    function handleTaskPage() {
        const links = document.getElementsByTagName('a');
        for (let i = 0; i < links.length; i++) {
            if (links[i].href.includes(CONSTANTS.BASE_URL + CONSTANTS.URLS.TASK_ID)) {
                clickElement(links[i]);
                window.localStorage.setItem('task', '0');
                break;
            }
        }
    }

    function handlePKPage() {
        checkTaskCompletion();
        setInterval(attack, generateRandomDelay(800, 1000));
    }

    function handleNPCPage() {
        const links = document.getElementsByTagName('a');
        for (let i = 0; i < links.length; i++) {
            if (['IMG', 'FONT'].includes(links[i].previousElementSibling?.tagName)) {
                clickElement(links[i]);
            }
        }
    }

    function handleTaskGetPage() {
        const links = document.getElementsByTagName('a');

        // 特殊情况处理
        if (links.length === 4 && !links[0].childNodes[0].className.includes('todaguai')) {
            for (let i = 0; i < links.length; i++) {
                if (links[i].href.includes(CONSTANTS.BASE_URL + CONSTANTS.URLS.TASK_SUBMIT)) {
                    clickElement(links[i]);
                    return;
                }
            }
        }

        // 常规情况处理
        for (let i = 0; i < links.length; i++) {
            if (links[i].childNodes[0].style.display !== 'none' &&
                links[i].innerHTML.includes('引路蜂')) {
                clickElement(links[i]);
                break;
            }
        }
    }

    // 主要处理逻辑
    function handleCurrentPage() {
        const currentUrl = window.location.href;

        if (currentUrl.includes(CONSTANTS.BASE_URL + CONSTANTS.URLS.CK) ||
            currentUrl.includes(CONSTANTS.BASE_URL + CONSTANTS.URLS.MAP)) {
            handleMainPage();
        } if (currentUrl.includes(CONSTANTS.BASE_URL + CONSTANTS.URLS.TASK)) {
            handleTaskPage();
        } if (currentUrl.includes(CONSTANTS.BASE_URL + CONSTANTS.URLS.PK)) {
            handlePKPage();
        } if (currentUrl.includes(CONSTANTS.BASE_URL + CONSTANTS.URLS.TASK_SUBMIT)) {
            clickElement(document.getElementsByTagName('a')[0]);
        } if (currentUrl.includes(CONSTANTS.BASE_URL + CONSTANTS.URLS.NPC_GET)) {
            handleNPCPage();
        } if (currentUrl.includes(CONSTANTS.BASE_URL + CONSTANTS.URLS.TASK_GET)) {
            handleTaskGetPage();
        }
    }

    // 初始化执行
    handleCurrentPage();
})();