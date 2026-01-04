// ==UserScript==
// @name         蜜柑計劃 一鍵複製磁連
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  在各字幕組分區新增一鍵「複製磁連」及「特定複製」按鈕。「特定複製」可輸入關鍵字，只複製標題含該關鍵字的磁連
// @author       shanlan (grok-4-fast-reasoning)
// @match        https://mikanani.me/Home/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mikanani.me
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540997/%E8%9C%9C%E6%9F%91%E8%A8%88%E5%8A%83%20%E4%B8%80%E9%8D%B5%E8%A4%87%E8%A3%BD%E7%A3%81%E9%80%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/540997/%E8%9C%9C%E6%9F%91%E8%A8%88%E5%8A%83%20%E4%B8%80%E9%8D%B5%E8%A4%87%E8%A3%BD%E7%A3%81%E9%80%A3.meta.js
// ==/UserScript==

(function() {
'use strict';

function notify(msg) {
    const n = document.createElement('div');
    n.style.position = 'fixed';
    n.style.left = '50%';
    n.style.top = '50%';
    n.style.transform = 'translate(-50%, -50%)';
    n.style.backgroundColor = 'rgba(0,0,0,0.7)';
    n.style.color = 'white';
    n.style.padding = '12px 24px';
    n.style.borderRadius = '8px';
    n.style.zIndex = '9999';
    n.style.fontSize = '30px';
    n.style.boxShadow = '0 2px 12px rgba(0,0,0,0.2)';
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => {
        n.style.transition = 'opacity 1s';
        n.style.opacity = '0';
        setTimeout(() => { n.remove(); }, 1000);
    }, 3000);
}

function main() {
    // 只針對有 id 屬性的 div.subgroup-text（即字幕組區塊），排除 header2-text
    const subgroupDivs = document.querySelectorAll('div.subgroup-text[id]');
    subgroupDivs.forEach(div => {
        const btn = document.createElement('button');
        btn.textContent = '複製磁連';
        btn.style.marginLeft = '10px';
        btn.style.padding = '2px 6px';
        btn.style.fontSize = '12px';

        // 新增「特定複製」按鈕
        const specificBtn = document.createElement('button');
        specificBtn.textContent = '特定複製';
        specificBtn.style.marginLeft = '5px';
        specificBtn.style.padding = '2px 6px';
        specificBtn.style.fontSize = '12px';

        // 避免重複添加（檢查兩個按鈕）
        if (![...div.children].some(c => c.tagName === 'BUTTON' && (c.textContent.includes('複製磁連') || c.textContent.includes('特定複製')))) {
            div.appendChild(btn);
            div.appendChild(specificBtn);
        }

        btn.addEventListener('click', () => {
            // 原邏輯：複製所有磁連
            let table = null;
            const parent = div.parentElement || document;
            const tables = Array.from(parent.querySelectorAll('table'));
            table = tables.find(t => (div.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING));
            if (!table) {
                table = tables.find(t => t.querySelector('a.js-magnet'));
            }

            if (!table) {
                console.log('未找到對應的磁連列表 (table)');
                notify('未找到對應的磁連列表，請稍候或重新載入頁面');
                return;
            }

            const magnetAnchors = table.querySelectorAll('a.js-magnet, a.magnet-link, a[href^="magnet:"]');
            const magnets = [];
            magnetAnchors.forEach(anchor => {
                // 優先 data-clipboard-text，沒有就用 href
                const fullText = anchor.getAttribute('data-clipboard-text') || anchor.getAttribute('href') || '';
                if (fullText) {
                    const match = fullText.match(/^(magnet:\?xt=urn:btih:[^&]+)/);
                    if (match) {
                        magnets.push(match[1]);
                    } else if (fullText.startsWith('magnet:')) {
                        magnets.push(fullText);
                    }
                }
            });

            if (magnets.length === 0) {
                console.log('未找到任何磁連！');
                notify('未找到任何磁連');
                return;
            }

            const result = magnets.join('\n');
            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(result, 'text');
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = result;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            notify('已複製 ' + magnets.length + ' 個磁連，如果有沒複製到的請點擊右下角『顯示更多』');
        });

        // 新增邏輯：特定複製（過濾標題含關鍵字的磁連）
        specificBtn.addEventListener('click', () => {
            const keyword = prompt('請輸入關鍵字（用於過濾標題）：', '');
            if (!keyword || keyword.trim() === '') {
                notify('未輸入關鍵字，取消操作');
                return;
            }
            const kwd = keyword.toLowerCase().trim(); // 忽略大小寫

            let table = null;
            const parent = div.parentElement || document;
            const tables = Array.from(parent.querySelectorAll('table'));
            table = tables.find(t => (div.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING));
            if (!table) {
                table = tables.find(t => t.querySelector('a.js-magnet'));
            }

            if (!table) {
                console.log('未找到對應的磁連列表 (table)');
                notify('未找到對應的磁連列表，請稍候或重新載入頁面');
                return;
            }

            // 遍歷 table 的每一行 <tr>
            const rows = table.querySelectorAll('tr');
            const magnets = [];
            rows.forEach(row => {
                const titleLink = row.querySelector('a.magnet-link-wrap');
                if (titleLink && titleLink.textContent.toLowerCase().includes(kwd)) {
                    const magnetAnchor = row.querySelector('a.js-magnet');
                    if (magnetAnchor) {
                        const fullText = magnetAnchor.getAttribute('data-clipboard-text') || magnetAnchor.getAttribute('href') || '';
                        if (fullText) {
                            const match = fullText.match(/^(magnet:\?xt=urn:btih:[^&]+)/);
                            if (match) {
                                magnets.push(match[1]);
                            } else if (fullText.startsWith('magnet:')) {
                                magnets.push(fullText);
                            }
                        }
                    }
                }
            });

            if (magnets.length === 0) {
                console.log('未找到匹配的磁連！');
                notify('未找到包含關鍵字「' + keyword + '」的磁連');
                return;
            }

            const result = magnets.join('\n');
            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(result, 'text');
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = result;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            notify('已複製 ' + magnets.length + ' 個匹配的磁連，如果有沒複製到的請點擊右下角『顯示更多』');
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}
})();