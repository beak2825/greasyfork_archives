// ==UserScript==
// @name         ChatBot Prompt Replacer
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  Replace shortcuts with predefined text in ChatBot input
// @author       Eric
// @match        https://chatgpt.com/*
// @match        https://claude.ai/*
// @match        https://chat.deepseek.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GPL Licence
// @downloadURL https://update.greasyfork.org/scripts/518207/ChatBot%20Prompt%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/518207/ChatBot%20Prompt%20Replacer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Load replacements from GM storage
    let replacements = GM_getValue('replacements', {
        '/tl': '翻译以下内容：',
        '/pr': "我正在写一篇计算机领域的英文学术论文，请帮我润色。请以```latex ```格式输出，并注意符合latex格式",
        '/qa': "完成这道题。请先分析这道题目，再给出答案。",
        '/cmd': "将以下内容转换为Markdown格式，使用LaTeX语法（行内公式放在$内，单行公式放在$$内）来编写数学公式，并以```Markdown ```的格式输出"
    });

    // Register Settings Menu Command
    GM_registerMenuCommand('Settings', openSettings);
    GM_registerMenuCommand('Reload', observeTargetNode);

    function openSettings() {
        // Create Settings Modal
        const modal = document.createElement('div');
        modal.style.display = 'block';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#000';
        modal.style.color = '#fff';
        modal.style.padding = '20px';
        modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        modal.style.zIndex = '1000';

        modal.innerHTML = '<h2>Settings</h2>';

        for (const [shortcut, replacement] of Object.entries(replacements)) {
            const div = document.createElement('div');
            div.style.marginBottom = '10px';
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.innerHTML = `
                <input type="text" value="${shortcut}" placeholder="Shortcut" style="margin-right: 10px; background-color: #333; color: #fff; width: 100px;" />
                <textarea placeholder="Replacement" style="background-color: #333; color: #fff; width: 300px; height: 60px;"></textarea>
            `;
            const textarea = div.querySelector('textarea');
            textarea.value = replacement;
            modal.appendChild(div);
        }

        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add';
        addBtn.style.backgroundColor = '#333';
        addBtn.style.color = '#fff';
        modal.appendChild(addBtn);

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.style.marginLeft = '10px';
        saveBtn.style.backgroundColor = '#333';
        saveBtn.style.color = '#fff';
        modal.appendChild(saveBtn);

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.marginLeft = '10px';
        cancelBtn.style.backgroundColor = '#333';
        cancelBtn.style.color = '#fff';
        modal.appendChild(cancelBtn);

        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        addBtn.addEventListener('click', () => {
            const div = document.createElement('div');
            div.style.marginBottom = '10px';
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.innerHTML = `
                <input type="text" placeholder="Shortcut" style="margin-right: 10px; background-color: #333; color: #fff; width: 100px;" />
                <textarea placeholder="Replacement" style="background-color: #333; color: #fff; width: 300px; height: 60px;"></textarea>
            `;
            modal.insertBefore(div, addBtn);
        });

        saveBtn.addEventListener('click', () => {
            const inputs = modal.querySelectorAll('div > input, div > textarea');
            const newReplacements = {};
            for (let i = 0; i < inputs.length; i += 2) {
                const shortcut = inputs[i].value.trim();
                const replacement = inputs[i + 1].value.trim();
                if (shortcut && replacement) {
                    newReplacements[shortcut] = replacement;
                }
            }
            GM_setValue('replacements', newReplacements);
            replacements = newReplacements;
            document.body.removeChild(modal);
        });

        // Close modal on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        document.body.appendChild(modal);
    }

    // GPT
    function mutationCallback_ChatGPT(mutationList, observer) {
        console.log(mutationList);
        mutationList.forEach(mutation => {
            if (mutation.type === 'characterData') {
                const inputString = mutation.target.data;
                console.log(inputString);
                // replace shortcuts
                for (const [shortcut, replacement] of Object.entries(replacements)) {
                    if (inputString.includes(shortcut + ' ')) {
                        mutation.target.data = inputString.replace(shortcut + ' ', replacement);
                        const promptTextarea = document.getElementById('prompt-textarea');
                        // 增加一个<p>
                        const newP = document.createElement('p');
                        promptTextarea.appendChild(newP);
                        // 将光标设置到新的<p>中


                        const selection = window.getSelection();
                        const range = document.createRange();
                        range.selectNodeContents(newP);
                        range.collapse(false);
                        selection.removeAllRanges();
                        selection.addRange(range);

                        break;
                    }
                }
            }
        });
    }

    // 确保 targetNode 被正确获取
    function observeTargetNode_GPT() {
        const targetNode = document.getElementById('prompt-textarea');
        if (targetNode) {
            console.log("Target node found:", targetNode);

            const observer = new MutationObserver(mutationCallback_ChatGPT);

            observer.observe(targetNode, {
                childList: true,
                subtree: true,
                characterData: true
            });
        } else {
            console.log("Target node not found, retrying...");
            setTimeout(observeTargetNode_GPT, 1000); // 每秒重试一次
        }
    }

    // Claude AI
    function mutationCallback_Claude(mutationList, observer) {
        console.log(mutationList);
        mutationList.forEach(mutation => {
            if (mutation.type === 'characterData') {
                const inputString = mutation.target.data;
                console.log(inputString);
                // replace shortcuts
                for (const [shortcut, replacement] of Object.entries(replacements)) {
                    if (inputString.includes(shortcut + ' ')) {
                        mutation.target.data = inputString.replace(shortcut + ' ', replacement);

                        // 增加一个<p>
                        const promptTextarea = document.querySelector("body > div.flex.min-h-screen.w-full > div > main > div.top-5.z-10.mx-auto.w-full.max-w-2xl.md\\:sticky > div > fieldset > div.flex.flex-col.bg-bg-000.gap-1\\.5.border-0\\.5.border-border-300.pl-4.pt-2\\.5.pr-2\\.5.pb-2\\.5.sm\\:mx-0.items-stretch.transition-all.duration-200.relative.shadow-\\[0_0\\.25rem_1\\.25rem_rgba\\(0\\,0\\,0\\,0\\.035\\)\\].focus-within\\:shadow-\\[0_0\\.25rem_1\\.25rem_rgba\\(0\\,0\\,0\\,0\\.075\\)\\].hover\\:border-border-200.focus-within\\:border-border-200.cursor-text.z-10.rounded-2xl > div.flex.gap-2 > div.mt-1.max-h-96.w-full.overflow-y-auto.break-words.min-h-\\[4\\.5rem\\] > div");
                        const newP = document.createElement('p');
                        promptTextarea.appendChild(newP);

                        // 将光标设置到新的<p>中
                        const selection = window.getSelection();
                        const range = document.createRange();
                        range.selectNodeContents(newP);
                        range.collapse(false);
                        selection.removeAllRanges();
                        selection.addRange(range);

                        break;
                    }
                }
            }
        });
    }

    function observeTargetNode_ClaudeAI() {
        const targetNode = document.querySelector("body > div.flex.min-h-screen.w-full > div > main > div.top-5.z-10.mx-auto.w-full.max-w-2xl.md\\:sticky > div > fieldset > div.flex.flex-col.bg-bg-000.gap-1\\.5.border-0\\.5.border-border-300.pl-4.pt-2\\.5.pr-2\\.5.pb-2\\.5.sm\\:mx-0.items-stretch.transition-all.duration-200.relative.shadow-\\[0_0\\.25rem_1\\.25rem_rgba\\(0\\,0\\,0\\,0\\.035\\)\\].focus-within\\:shadow-\\[0_0\\.25rem_1\\.25rem_rgba\\(0\\,0\\,0\\,0\\.075\\)\\].hover\\:border-border-200.focus-within\\:border-border-200.cursor-text.z-10.rounded-2xl > div.flex.gap-2 > div.mt-1.max-h-96.w-full.overflow-y-auto.break-words.min-h-\\[4\\.5rem\\] > div")
        if (targetNode) {
            console.log("Target node found:", targetNode);

            const observer = new MutationObserver(mutationCallback_Claude);

            observer.observe(targetNode, {
                childList: true,
                subtree: true,
                characterData: true
            });
        } else {
            console.log("Target node not found, retrying...");
            setTimeout(observeTargetNode_ClaudeAI, 1000); // 每秒重试一次
        }
    }

    // DeepSeek
    function mutationCallback_DeepSeek(mutationList, observer) {
        console.log(mutationList);
        mutationList.forEach(mutation => {
            if (mutation.type === 'childList') {
                const inputString = mutation.target.value;
                console.log(inputString);
                // replace shortcuts
                for (const [shortcut, replacement] of Object.entries(replacements)) {
                    if (inputString.includes(shortcut + ' ')) {
                        const chat_input = document.getElementById('chat-input');
                        chat_input.value = inputString.replace(shortcut + ' ', replacement);
                        console.log(chat_input);
                        document.querySelector(".b13855df").textContent = chat_input.value + '\n';
                        simulateInputAtCursor("\n"); // 模拟按下回车键 DeepSeek修改textarea的值后需要输入其他键才能把修改持久化保存 
                        break;
                    }
                }
            }
        });
    }

    // 确保 targetNode 被正确获取
    function observeTargetNode_DeekSeek() {
        const targetNode = document.getElementById('chat-input');
        if (targetNode) {
            console.log("Target node found:", targetNode);

            const observer = new MutationObserver(mutationCallback_DeepSeek);

            observer.observe(targetNode, {
                childList: true,
                subtree: true,
                characterData: true
            });
        } else {
            console.log("Target node not found, retrying...");
            setTimeout(observeTargetNode_DeekSeek, 1000); // 每秒重试一次
        }
    }


    function observeTargetNode() {
        const isClaudeAI = window.location.href.includes('claude.ai');
        const isChatGPT = window.location.href.includes('chatgpt.com');
        const isDeepSeek = window.location.href.includes("deepseek.com");
        if (isClaudeAI) {
            observeTargetNode_ClaudeAI();
        } else if (isChatGPT) {
            observeTargetNode_GPT();
        } else if (isDeepSeek) {
            observeTargetNode_DeekSeek();
        }
    }

    // Add URL change detection
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('URL changed to', url);
            setTimeout(() => {
                observeTargetNode();
            }, 1000);

        }
    }).observe(document, { subtree: true, childList: true });

    // Also listen to history changes
    window.addEventListener('popstate', function () {
        console.log('URL changed via back/forward');
        setTimeout(() => {
            observeTargetNode();
        }, 1000);
    });

    observeTargetNode();

    // 模拟执行粘贴，尝试所有的可能方式，每0.5秒钟检查一次是否有可输入的焦点元素，持续5s
    function simulateInputAtCursor(message) {
        const maxWaitTime = 5000; // 最大等待时间（毫秒）
        const checkInterval = 500; // 检查间隔（毫秒）

        let attempts = 0;
        const interval = setInterval(() => {
            const activeElement = document.activeElement;

            if (activeElement && (
                activeElement instanceof HTMLInputElement ||
                activeElement instanceof HTMLTextAreaElement ||
                (activeElement.isContentEditable && activeElement.contentEditable === 'true')
            )) {
                clearInterval(interval);
                activeElement.focus();

                // 方式一：尝试使用 document.execCommand 插入文本
                if (document.queryCommandSupported && document.queryCommandSupported('insertText')) {
                    try {
                        document.execCommand('insertText', false, message);
                        // console.log('粘贴成功（方式一）');
                        return;
                    } catch (e) {
                        // console.warn('方式一失败，尝试其他方法');
                    }
                }

                // 方式二：如果 execCommand 失败，尝试直接设置值
                if (activeElement.setSelectionRange) {
                    const start = activeElement.selectionStart;
                    const end = activeElement.selectionEnd;
                    activeElement.value = activeElement.value.substring(0, start) + message + activeElement.value.substring(end);
                    activeElement.setSelectionRange(start + message.length, start + message.length);
                    // console.log('粘贴成功（方式二）');
                    return;
                }

                // 方式三：如果是 contenteditable 元素
                if (activeElement.isContentEditable) {
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        range.deleteContents();
                        const textNode = document.createTextNode(message);
                        range.insertNode(textNode);
                        range.setEndAfter(textNode);
                        range.collapse(false);
                        selection.removeAllRanges();
                        selection.addRange(range);
                        // console.log('粘贴成功（方式三）');
                        return;
                    }
                }

                // 方式四：如果 setSelectionRange 和 contenteditable 也不支持，尝试模拟按键事件
                for (let i = 0; i < message.length; i++) {
                    const keyEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: message[i] });
                    activeElement.dispatchEvent(keyEvent);
                    const inputEvent = new InputEvent('input', { bubbles: true, cancelable: true, data: message[i] });
                    activeElement.dispatchEvent(inputEvent);
                }
                // console.log('粘贴成功（方式四）');
            } else {
                // 如果还没有超过最大等待时间，继续检查
                attempts++;
                if (attempts * checkInterval >= maxWaitTime) {
                    // 超过最大等待时间，停止查找并打印错误信息
                    clearInterval(interval);
                    // console.error('在五秒内未找到可输入的焦点元素，放弃执行粘贴动作。');
                }
            }
        }, checkInterval);
    }

})();