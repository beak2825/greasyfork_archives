// ==UserScript==
// @name         Bonk.io Spam Filter
// @namespace    http://tampermonkey.net/
// @version      1.87
// @description  Adds spam filter to bonk.io chat.
// @author       Silly One
// @match        https://*.bonk.io/*
// @match        https://*.bonkisback.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513434/Bonkio%20Spam%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/513434/Bonkio%20Spam%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const fixData = {}, chatLog = [], replacedChatLog = [], originalMessages = new Map();

    const antispam = text => text
        .replace(/(.)\1{3,}/g, (m, p1) => p1 + '[x' + m.length + ']')
        .replace(/((?:\b\w+\b\W?)+)\s?(?:\1\s?){2,}/g, (m, p1) => p1 + '[' + 'x' + (m.match(new RegExp(p1, 'g')) || []).length + ']');

    const sanitizeHTML = str => {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    };

    const downloadData = (parentId, color) => {
        try {
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
            const blob = new Blob([JSON.stringify({ fix: fixData, chat: chatLog, replacedChat: replacedChatLog }, null, 2)], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `SFData_${timestamp}.txt`;
            a.click();
            URL.revokeObjectURL(a.href);

            const newDiv = document.createElement('div');
            newDiv.className = 'chat-log-entry';
            newDiv.innerHTML = `Data was downloaded as SFData_${timestamp}.txt<div>If you have any data, please send the SFData file here: https://discord.gg/v6NE6wcccb</div>`;
            if (parentId === 'ingamechatcontent') {
                newDiv.style.color = color;
            }
            document.getElementById(parentId).appendChild(newDiv);
        } catch (error) {
            console.error('Error during data download:', error);
        }
    };

    const addFoodButtons = (msg, parentId, color) => {
        try {
            const buttons = [' [Help] ', ' [Fix] ', ' [Get]'].map((text, i) => {
                const btn = document.createElement('span');
                btn.innerHTML = sanitizeHTML(text);
                btn.className = 'food-button hidden';
                btn.style.webkitTextStroke = '0.3px darkblue';
                btn.onclick = [
                    () => {
                        const newDiv = document.createElement('div');
                        newDiv.style.color = color;
                        newDiv.className = parentId === 'ingamechatcontent' ? '' : 'chat-log-entry';
                        newDiv.innerHTML = sanitizeHTML('Fix specifies what needs fixing. Get downloads data to your device and gives a link to a server to send the data.');
                        msg.parentNode.appendChild(newDiv);
                        document.getElementById(parentId).scrollTop = document.getElementById(parentId).scrollHeight;
                    },
                    () => {
                        fixData[sanitizeHTML(msg.innerText)] = (fixData[sanitizeHTML(msg.innerText)] || 0) + 1;
                        const newDiv = document.createElement('div');
                        newDiv.style.color = color;
                        newDiv.className = parentId === 'ingamechatcontent' ? '' : 'chat-log-entry';
                        newDiv.innerHTML = 'This message was added to the data.';
                        msg.parentNode.appendChild(newDiv);
                        document.getElementById(parentId).scrollTop = document.getElementById(parentId).scrollHeight;
                    },
                    () => {
                        downloadData(parentId, color);
                        buttons.forEach(btn => btn.classList.add('hidden'));
                        if (parentId === 'ingamechatcontent') {
                            const newDiv = document.createElement('div');
                            newDiv.className = '';
                            newDiv.style.color = color;
                            document.getElementById(parentId).appendChild(newDiv);
                        }
                        document.getElementById(parentId).scrollTop = document.getElementById(parentId).scrollHeight;
                    }
                ][i];
                return btn;
            });
            buttons.forEach(btn => msg.parentNode.insertBefore(btn, msg.nextSibling));
            msg.parentNode.addEventListener('mouseover', () => {
                buttons.forEach(btn => btn.classList.remove('hidden'));
                if (originalMessages.has(msg)) msg.innerHTML = originalMessages.get(msg);
            });
            msg.parentNode.addEventListener('mouseout', () => {
                buttons.forEach(btn => btn.classList.add('hidden'));
                if (originalMessages.has(msg)) msg.innerHTML = antispam(originalMessages.get(msg));
            });
        } catch (error) {
            console.error('Error adding food buttons:', error);
        }
    };

    const processMessages = msg => {
        try {
            if (msg.nodeType === Node.ELEMENT_NODE && msg.classList) {
                if (msg.classList.contains('ingamechatmessage')) {
                    chatLog.push(msg.innerHTML);
                    const originalText = msg.innerHTML;
                    originalMessages.set(msg, sanitizeHTML(originalText));
                    const replacedText = antispam(originalText);
                    replacedChatLog.push(replacedText);
                    msg.innerHTML = replacedText;
                    msg.style.color = '#FFFFFF';
                    addFoodButtons(msg, 'ingamechatcontent', 'white');
                } else if (msg.classList.contains('newbonklobby_chat_msg_txt')) {
                    chatLog.push(msg.innerHTML);
                    const originalText = msg.innerHTML;
                    originalMessages.set(msg, sanitizeHTML(originalText));
                    const replacedText = antispam(originalText);
                    replacedChatLog.push(replacedText);
                    msg.innerHTML = replacedText;
                    addFoodButtons(msg, 'newbonklobby_chat_content');
                }
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    };

    const overrideAppendChild = (parentId, chatClass) => {
        const parentElement = document.getElementById(parentId);
        if (!parentElement) return;
        const originalAppendChild = parentElement.appendChild;
        parentElement.appendChild = function (msg) {
            setTimeout(() => {
                if (msg.children[0] && msg.children[0].className === chatClass) {
                    processMessages(msg.children[1] || msg.children[0]);
                }
                originalAppendChild.call(this, msg);
                parentElement.scrollTop = parentElement.scrollHeight;
            }, 0);
        };
    };

    overrideAppendChild('ingamechatcontent', 'ingamechatname');
    new MutationObserver(mutationsList => mutationsList.forEach(mutation =>
        mutation.addedNodes.forEach(node => {
            processMessages(node);
            if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('ingamechatmessage')) {
                document.getElementById('ingamechatcontent').scrollTop = document.getElementById('ingamechatcontent').scrollHeight;
            }
        })
    )).observe(document.body, { childList: true, subtree: true });

    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
        .hidden { display: none; }
        .food-button { color: lightblue; cursor: pointer; text-align: right; }
        .chat-log-entry { color: inherit; }
    `;
    document.head.appendChild(styleElement);

    document.querySelectorAll('.newbonklobby_chat_msg_txt, .ingamechatmessage').forEach(processMessages);
    document.querySelectorAll('.food-button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('ingamechatcontent').scrollTop = document.getElementById('ingamechatcontent').scrollHeight;
        });
    });
})();
