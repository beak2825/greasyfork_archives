// ==UserScript==
// @name         Gemini 生图自动执行
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动点击Redo按钮并等待生成10次，带进度提示和完成提醒
// @match        https://gemini.google.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536653/Gemini%20%E7%94%9F%E5%9B%BE%E8%87%AA%E5%8A%A8%E6%89%A7%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/536653/Gemini%20%E7%94%9F%E5%9B%BE%E8%87%AA%E5%8A%A8%E6%89%A7%E8%A1%8C.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function waitForElements(checkFn, timeout = 60000) {
        return new Promise((resolve, reject) => {
            const interval = 1000;
            let elapsed = 0;
            const timer = setInterval(() => {
                if (checkFn()) {
                    clearInterval(timer);
                    resolve(true);
                } else if (elapsed >= timeout) {
                    clearInterval(timer);
                    reject(new Error('等待元素超时'));
                }
                elapsed += interval;
            }, interval);
        });
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function createFloatingButton() {
        const btn = document.createElement('button');
        btn.id = 'auto-gen-image-btn';
        btn.textContent = '自动执行生图10次';
        btn.style.position = 'fixed';
        btn.style.right = '20px';
        btn.style.top = '20%';
        btn.style.transform = 'translateY(-50%)';
        btn.style.zIndex = 999;
        btn.style.padding = '10px 16px';
        btn.style.fontSize = '16px';
        btn.style.backgroundColor = '#4CAF50';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        document.body.appendChild(btn);
        return btn;
    }

    function createProgressDisplay() {
        const div = document.createElement('div');
        div.id = 'progress-display';
        div.style.position = 'fixed';
        div.style.right = '20px';
        div.style.top = '20%';
        div.style.transform = 'translateY(-50%)';
        div.style.zIndex = 999;
        div.style.padding = '10px 16px';
        div.style.fontSize = '16px';
        div.style.backgroundColor = '#333';
        div.style.color = 'white';
        div.style.borderRadius = '5px';
        div.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
        div.style.display = 'none';
        document.body.appendChild(div);
        return div;
    }

    function flashTitle(message, count = 10) {
        const originalTitle = document.title;
        let i = 0;
        let flashing = true;
        const interval = setInterval(() => {
            document.title = flashing ? message : originalTitle;
            flashing = !flashing;
            i++;
            if (i >= count * 2) {
                clearInterval(interval);
                document.title = originalTitle;
            }
        }, 500);
    }

    async function runAutomation() {
        const button = document.querySelector('#auto-gen-image-btn');
        const progress = document.querySelector('#progress-display');
        if (!button || !progress) return;

        button.style.display = 'none';
        progress.style.display = 'block';

        for (let i = 1; i <= 10; i++) {
            progress.textContent = `正在执行第 ${i} 次...`;
            const redoBtn = document.querySelector('button[aria-label="Redo"]');
            if (redoBtn) {
                redoBtn.click();

                 // 新增：点击后等待 5 秒再执行下一步
                await sleep(5000);
                console.log(`第 ${i} 次等待`);
                try {
                    await waitForElements(() =>
                        document.querySelector('button[aria-label="Download full size image"]') &&
                        document.querySelector('button[aria-label="Redo"]')
                    );
                } catch (e) {
                    console.warn(`第 ${i} 次等待失败:`, e);
                }
            } else {
                console.warn(`第 ${i} 次未找到 Redo 按钮`);
            }
        }

        progress.textContent = '已完成！';
        setTimeout(() => {
            progress.style.display = 'none';
            button.style.display = 'block';
        }, 2000);

        flashTitle('自动生图完毕...');
    }

    const observer = new MutationObserver(() => {
        const redoBtn = document.querySelector('button[aria-label="Redo"]');
        const existing = document.querySelector('#auto-gen-image-btn');
        if (redoBtn && !existing) {
            const button = createFloatingButton();
            const progress = document.querySelector('#progress-display') || createProgressDisplay();
            button.onclick = runAutomation;
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
