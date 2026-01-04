// ==UserScript==
// @name         洛谷到 VJudge 跳转脚本
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  在洛谷问题页面的特定位置添加一个跳转到 VJudge 的链接
// @author       Kimi
// @match        https://www.luogu.com.cn/problem/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513027/%E6%B4%9B%E8%B0%B7%E5%88%B0%20VJudge%20%E8%B7%B3%E8%BD%AC%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/513027/%E6%B4%9B%E8%B0%B7%E5%88%B0%20VJudge%20%E8%B7%B3%E8%BD%AC%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getProblemCode() {
        const path = window.location.pathname;
        const match = path.match(/^\/problem\/([^/]+)/);
        return match ? match[1] : null;
    }

    function getVJudgeURL(problemCode) {
        let match;
        if ((match = problemCode.match(/^(CF)(\d+)([A-Za-z]*)(\d*)$/))) {
            // 处理 CF + 数字 + 字母 + 可选数字
            return `https://vjudge.net/problem/${encodeURIComponent(`CodeForces-${match[2]}${match[3]}${match[4]}`)}#author=GPT_zh`;
        }
        if ((match = problemCode.match(/^(P|B)(\d+)$/))) {
            const prefix = '洛谷';
            return `https://vjudge.net/problem/${encodeURIComponent(`${prefix}-${problemCode}`)}#author=GPT_zh`;
        }
        if ((match = problemCode.match(/^(UVA)(\d+)$/))) {
            return `https://vjudge.net/problem/${encodeURIComponent(`UVA-${match[2]}`)}#author=GPT_zh`;
        }
        if ((match = problemCode.match(/^(SP)(\d+)$/))) {
            const span = document.querySelector('span[title*=" - "]');
            if (span) {
                const title = span.getAttribute('title');
                const contestName = title.split(' - ')[0];
                return `https://vjudge.net/problem/${encodeURIComponent(`SPOJ-${contestName}`)}#author=GPT_zh`;
            }
            return null;
        }
        if ((match = problemCode.match(/^AT_(.+)$/))) {
            return `https://vjudge.net/problem/${encodeURIComponent(`AtCoder-${match[1]}`)}#author=GPT_zh`;
        }
        if ((match = problemCode.match(/^AT(.+)$/))) {
            return `https://vjudge.net/problem/${encodeURIComponent(`AtCoder-${match[1]}`)}#author=GPT_zh`;
        }
        return null;
    }

    function injectVJudgeLink(vjudgeURL) {
        const actionDiv = document.querySelector('div.action');
        if (actionDiv) {
            if (!actionDiv.querySelector('a.vjudge-link')) {
                const link = document.createElement('a');
                link.href = vjudgeURL;
                link.target = '_blank';
                link.style.marginLeft = '10px';
                link.textContent = '跳转至 VJudge';
                link.classList.add('vjudge-link');
                actionDiv.appendChild(link);
                console.log('VJudge链接已成功注入:', vjudgeURL);
            }
        } else {
            console.warn('Luogu to VJudge Script: 未找到目标元素 "div.action"。');
        }
    }

    function main() {
        const problemCode = getProblemCode();
        if (!problemCode) {
            console.warn('Luogu to VJudge Script: 无法提取问题代码。');
            return;
        }
        const vjudgeURL = getVJudgeURL(problemCode);
        if (!vjudgeURL) {
            console.warn(`Luogu to VJudge Script: 未找到问题代码 "${problemCode}" 对应的 VJudge 映射。`);
            return;
        }
        injectVJudgeLink(vjudgeURL);
    }

    function observeDOM() {
        const observer = new MutationObserver((mutations, obs) => {
            const actionDiv = document.querySelector('div.action');
            if (actionDiv) {
                main();
                obs.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                main();
                observeDOM();
            });
        } else {
            main();
            observeDOM();
        }
    }

    init();

})();
