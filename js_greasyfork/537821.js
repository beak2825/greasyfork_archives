// ==UserScript==
// @name         Filtering "Incomplete" for PterClub
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  支持“非完结”种子主副标题过滤 + 精确识别制作组（仅匹配以 - 开头并出现在标题结尾的情况）
// @author       @Zuoans
// @match        https://pterclub.com/torrents.php* 
// @license      MIT
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/537821/Filtering%20%22Incomplete%22%20for%20PterClub.user.js
// @updateURL https://update.greasyfork.org/scripts/537821/Filtering%20%22Incomplete%22%20for%20PterClub.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ====================== 样式定义 ======================
    GM_addStyle(`
        :root {
            --blue-start: rgba(51, 160, 200, 0.6);
            --blue-mid: rgba(51, 160, 200, 0.1);
            --purple-start: rgba(147, 112, 219, 0.5);
            --purple-mid: rgba(147, 112, 219, 0.1);
        }

        /* incomplete样式 */
        table.torrentname > tbody > tr.tm-incomplete:not(.tm-group) {
            background: linear-gradient(to right, var(--blue-start) 0%, var(--blue-mid) 50%, rgba(255,255,255,0) 90%) !important;
        }

        /* 制作组样式 */
        table.torrentname > tbody > tr.tm-group:not(.tm-incomplete) {
            background: linear-gradient(to right, var(--purple-start) 0%, var(--purple-mid) 50%, rgba(255,255,255,0) 90%) !important;
        }

        /* incomplete&制作组双重标记样式 */
        table.torrentname > tbody > tr.tm-incomplete.tm-group {
            background: linear-gradient(to right, var(--purple-start) 0%, var(--purple-mid) 50%, rgba(255,255,255,0) 90%) !important;
        }

        /* 文字保护 */
        table.torrentname [class*="tm-"] td {
            text-shadow: 0 1px 1px rgba(255,255,255,0.1),
                         0 -1px 1px rgba(0,0,0,0.1) !important;
        }
    `);

    // 目标制作组列表（新增 PTerWEB）
    const targetGroups = [
        'AdBlue', 'AREY', 'BdC', 'BMDru', 'CatEDU', 'c0kE',
        'doraemon', 'JKCT', 'KMX', 'Lislander', 'RO',
        'Telesto', 'XPcl', 'ZTR', 'PTerWEB'
    ];

    // 辅助函数：转义正则特殊字符
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[$$\$$]/g, '\\$&');
    }

    // ✅ 制作组正则：只匹配以 - 开头，并出现在标题结尾的组名（如 -ZTR）
    const groupRegex = new RegExp(
        `-(?:${targetGroups.map(g => escapeRegExp(g)).join('|')})(?=[\\s\\W]|$)`, 
        'i'
    );

    // 排除关键词正则（包含 Complete / Fin / FIN+ 的行不能被标记为 non-complete）
    const excludeKeywordRegex = /\b(?:Complete|Fin)(?!\w)|FIN\+/gi;

    // 新增：incomplete 正则（仅检测 SxxExx 或 第X集，不考虑 EP）
    const incompleteRegex = /(?:^|\s)(S\d+E\d+|第\d+集)(?=\s|$)/i;

    function safeHighlight() {
        const rows = document.querySelectorAll('table.torrentname > tbody > tr');

        rows.forEach(tr => {
            tr.classList.remove('tm-incomplete', 'tm-group');

            // 获取主标题
            const titleLink = tr.querySelector('.torrentname a');
            if (!titleLink) return;

            let mainTitle = titleLink.innerText.trim();

            // 获取副标题
            let subTitleEl = tr.querySelector('.torrentname div[style*="margin-top"] span');
            let subTitle = subTitleEl ? subTitleEl.innerText.trim() : '';

            let fullTitle = (mainTitle + ' ' + subTitle).trim();

            // 检查是否包含排除关键词
            const hasExclusion = excludeKeywordRegex.test(fullTitle);

            // 判断是否为非完结（主副标题中任意一个满足即可）
            const isIncomplete = !hasExclusion && incompleteRegex.test(fullTitle);

            // 判断是否为目标制作组（✅ 仅匹配以 - 开头并出现在结尾的组名）
            const isTargetGroup = groupRegex.test(fullTitle);

            if (isIncomplete) tr.classList.add('tm-incomplete');
            if (isTargetGroup) tr.classList.add('tm-group');
        });
    }

    // MutationObserver 设置
    const observer = new MutationObserver(mutations => {
        if (mutations.some(mut => mut.addedNodes.length > 0)) {
            safeHighlight();
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        safeHighlight();
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });

    // 页面卸载时清理
    window.addEventListener('unload', () => {
        document.querySelectorAll('tr').forEach(el => {
            el.className = el.className.replace(/\btm-\w+\b/g, '');
        });
    });

})();