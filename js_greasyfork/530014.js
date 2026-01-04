// ==UserScript==
// @name         Grok Chat Archiver
// @namespace    https://greasyfork.org/users/78459
// @version      0.1.8.12
// @description  Archive Grok chats with improved logic, speaker tags, and timestamps
// @author       xAI Helper
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530014/Grok%20Chat%20Archiver.user.js
// @updateURL https://update.greasyfork.org/scripts/530014/Grok%20Chat%20Archiver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAX_CHARS = 400000;

    const ui = document.createElement('div');
    ui.style.cssText = 'position: fixed; top: 40px; right: 10px; z-index: 9999;';
    ui.innerHTML = `
        <button id="backupBtn" style="padding: 5px 10px;">手動備份</button>
        <input id="code1" placeholder="第一個編碼" style="position: absolute; top: 30px; right: 0; width: 200px; padding: 5px;">
        <input id="code2" placeholder="第二個編碼" style="position: absolute; top: 70px; right: 0; width: 200px; padding: 5px;">
    `;
    document.body.appendChild(ui);

    const btn = document.getElementById('backupBtn');
    const input1 = document.getElementById('code1');
    const input2 = document.getElementById('code2');

    function findCommonContainer(startCode, endCode) {
        const allElements = document.getElementsByTagName('*');
        let startEls = [];
        let endEls = [];

        for (let el of allElements) {
            if (el.textContent.includes(startCode)) startEls.push(el);
            if (el.textContent.includes(endCode)) endEls.push(el);
        }

        if (!startEls.length || !endEls.length) {
            console.log('找不到起點或終點元素');
            return null;
        }

        let common = null;
        for (let start of startEls) {
            for (let end of endEls) {
                let parent = start;
                while (parent && !parent.contains(end)) {
                    parent = parent.parentElement;
                }
                if (parent && (!common || common.contains(parent))) {
                    common = parent;
                }
            }
        }
        return common;
    }

    function tryFetchMessages(startCode, endCode) {
        let container = findCommonContainer(startCode, endCode);
        if (!container) {
            console.log('無法找到共同容器');
            return null;
        }

        // 改用 childNodes 遍歷並合併文字
        const nodes = container.childNodes;
        let messages = [];
        let currentText = '';
        let inRange = false;

        for (let node of nodes) {
            if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
                const text = node.textContent.trim();
                if (text) {
                    if (text.includes(startCode)) inRange = true;
                    if (inRange) {
                        currentText += text + '\n';
                    }
                    if (text.includes(endCode)) {
                        messages.push({ text: currentText.trim(), isUser: true });
                        break;
                    }
                }
            }
        }

        // 分割成單行並去重
        const uniqueMessages = [];
        const seen = new Set();
        messages.forEach(msg => {
            msg.text.split('\n').forEach(line => {
                if (line.trim() && !seen.has(line.trim())) {
                    uniqueMessages.push({ text: line.trim(), isUser: true });
                    seen.add(line.trim());
                }
            });
        });

        return uniqueMessages.length > 0 ? uniqueMessages : null;
    }

    function extractKeywords() {
        const text = document.body.textContent;
        const words = text.split(/\s+/).filter(w => w.length > 4 && !w.match(/^(const|var|let|function|Grok|Chat|return|使用者|grant|version)$/));
        const freq = {};
        words.forEach(w => freq[w] = (freq[w] || 0) + 1);
        const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
        const keywords = sorted.slice(0, 2).map(([word]) => word);
        if (keywords.length < 2) {
            console.log('無法提取足夠的獨特關鍵字');
            return null;
        }
        return keywords;
    }

    function backupChat() {
        let startCode = input1.value.trim();
        let endCode = input2.value.trim();
        let messages;

        if (!startCode && !endCode) {
            console.log('未提供編碼，嘗試自動關鍵字模式');
            const keywords = extractKeywords();
            if (!keywords) {
                console.log('自動模式失敗：無有效關鍵字');
                return;
            }
            const [kw1, kw2] = keywords;
            console.log(`自動提取關鍵字：${kw1}, ${kw2}`);
            messages = tryFetchMessages(kw1, kw2);
            startCode = kw1;
            endCode = kw2;
        } else if (startCode && endCode) {
            messages = tryFetchMessages(startCode, endCode);
        } else {
            console.log('請提供完整的雙編碼');
            return;
        }

        if (!messages) {
            console.log('抓取失敗');
            return;
        }

        const threadId = '1901046224352051214';
        const seq = `G3-CHK-${threadId}-${Math.floor(Math.random() * 1000)}`;
        let content = `# 對話紀錄（緒ID：${threadId}，序號：${seq})\n`;
        messages.forEach(msg => {
            const speaker = msg.isUser ? '[使用者]' : '[Grok]';
            const time = msg.time ? `${msg.time} - ` : '';
            content += `${speaker} ${time}${msg.text}\n`;
        });

        if (content.length > MAX_CHARS) {
            content = content.slice(0, MAX_CHARS);
            console.log(`字數超限，已截斷至 ${MAX_CHARS} 字元`);
        }

        console.log(`成功抓取，使用 ${startCode} 和 ${endCode}，訊息數：${messages.length}`);
        console.log(`備份完成：chat_${threadId}.txt，大小：${content.length} 字`);

        const blob = new Blob([content], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `chat_${threadId}.txt`;
        link.click();
    }

    btn.onclick = backupChat;
})();