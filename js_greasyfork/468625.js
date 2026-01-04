// ==UserScript==
// @name        ChatGPT Automatically Continue Conversations with a given Prompt
// @namespace   Violentmonkey Scripts
// @match       https://chat.openai.com/*
// @grant       none
// @license     MIT
// @version     1.0.1
// @author      Dillon
// @description This user script enables ChatGPT users to effortlessly and seamlessly continue conversations with a given prompt. This script utilizes the MutationObserver API to detect changes in the DOM and simulates keyboard and mouse events to input and send the prompt automatically. It is designed to be used with the OpenAI ChatGPT interface and should be compatible with most modern web browsers.
// @downloadURL https://update.greasyfork.org/scripts/468625/ChatGPT%20Automatically%20Continue%20Conversations%20with%20a%20given%20Prompt.user.js
// @updateURL https://update.greasyfork.org/scripts/468625/ChatGPT%20Automatically%20Continue%20Conversations%20with%20a%20given%20Prompt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        console.debug('load auto repeat js')
        let cp = prompt('Send a message to sendTextarea', 'Please continue without repeat, ensure that your responses do not contain redundant content or themes from previous responses.') || ''
        console.log(`cp: ${cp}`)

        const sendButton = document.querySelector('button.absolute');
        const sendTextarea = document.getElementById('prompt-textarea');
        console.debug(`sendButton: ${sendButton}`);
        console.debug(`sendTextarea: ${sendTextarea}`);

        const config = { attributes: true, childList: true, subtree: true };

        const callback = function(mutationsList, observer) {

            if (!cp){
              return false
            }

            for(let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
                    console.debug('Button attribute changed...');
                    if (!sendButton.disabled){
                        console.debug('ChatGPT response is complete. Sending next command...');
                        // 设置textarea的值
                        let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                        nativeInputValueSetter.call(sendTextarea, cp);

                        let ev2 = new Event('input', { bubbles: true});
                        sendTextarea.dispatchEvent(ev2);

                        // 创建一个新的'keydown'事件
                        // 延迟一段时间，然后模拟Enter键和点击事件
                        setTimeout(function() {
                            // 创建并触发一个键盘事件
                            let event = new KeyboardEvent('keydown', {
                                key: 'Enter'
                            });
                            sendTextarea.dispatchEvent(event);
                            sendTextarea.dispatchEvent(event);

                            // 点击按钮
                            sendButton.click();
                        }, 3000);  // 1000毫秒，或者1秒
                    }
                }

                if (mutation.type === 'childList') {
                    let targetNode = document.querySelector('div.text-2xl');
                    if (!targetNode) {
                        console.debug('Target node is missing...');
                        sendButton.disabled = false;
                    }
                }
            }
        };

        const observer = new MutationObserver(callback);

        observer.observe(document.body, config);
    });
})();