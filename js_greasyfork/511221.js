// ==UserScript==
// @name         Nektome gemini ai
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  типо ии gemini базарит с ними 
// @author       eretly
// @match        https://nekto.me/chat/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      generativelanguage.googleapis.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511221/Nektome%20gemini%20ai.user.js
// @updateURL https://update.greasyfork.org/scripts/511221/Nektome%20gemini%20ai.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = '';

    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    const systemInstruction = `Сюда типо то, как он должен отвечать, но отвечает криво косо`;

    const instructionWords = systemInstruction.split(' ');

    const generationConfig = {
        temperature: 1.3,
        candidateCount: 1,
        topP: 0.1,
        topK: 77,
        maxOutputTokens: 1024,
    };

    let messageQueue = [];
    let isProcessing = false;
    let skipCurrentProcessing = false;

    const maxRetries = 10;

    console.log('Script started. Monitoring buttons and chat messages...');

    GM_addStyle(`
        #skipProcessingButton {
            position: fixed;
            top: -5px;
            right: 10px;
            width: 50px;
            height: 50px;
            background-color: transparent;
            color: #333;
            border: none;
            font-size: 24px;
            cursor: pointer;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.7;
            transition: opacity 0.3s;
        }
        #skipProcessingButton:hover {
            opacity: 1;
        }
    `);

    const skipButton = document.createElement('button');
    skipButton.id = 'skipProcessingButton';
    skipButton.innerHTML = '⏭️';
    skipButton.title = 'Skip processing current message';
    document.body.appendChild(skipButton);

    skipButton.addEventListener('click', () => {
        console.log('Skip button clicked. Skipping current message processing.');
        skipCurrentProcessing = true;
        if (isProcessing) {
            stopTyping();
            isProcessing = false;
            processNextMessage();
        }
    });


    function resetChat() {
        console.log('Chat reset initiated.');
        chatHistory = [];
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        messageQueue = [];
        isProcessing = false;
        skipCurrentProcessing = false;
        console.log('Chat memory cleared.');
    }

    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function addButtonListener(button, buttonName) {
        if (button) {
            button.addEventListener('click', () => {
                console.log(`${buttonName} clicked.`);
                resetChat();
            });
        } else {
            console.log(`${buttonName} not found yet.`);
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const startChatBtn = getElementByXpath('//*[@id="searchCompanyBtn"]');
                    addButtonListener(startChatBtn, 'Start chat button');

                    const newChatBtn = getElementByXpath('/html/body/div[6]/div/div[2]/div[2]/div[7]/div/div[2]/div/button[2]');
                    addButtonListener(newChatBtn, 'New chat button');

                    if (node.classList && node.classList.contains('mess_block') && node.classList.contains('nekto')) {
                        const messageTextElement = node.querySelector('.window_chat_dialog_text.talk-bubble.tri');
                        if (messageTextElement) {
                            const messageText = messageTextElement.innerText.trim();
                            console.log('New message received:', messageText);
                            messageQueue.push(messageText);
                            processNextMessage();
                        }
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    console.log('DOM observer started.');

    async function processNextMessage() {
        if (messageQueue.length === 0) {
            console.log('Message queue is empty.');
            isProcessing = false;
            return;
        }

        if (isProcessing) {
            console.log('Currently processing another message. The new message is added to the queue.');
            return;
        }

        isProcessing = true;
        skipCurrentProcessing = false;
        const currentMessage = messageQueue.shift();
        console.log('Processing message:', currentMessage);

        chatHistory.push({ role: 'user', content: currentMessage });
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

        const filteredMessage = currentMessage.split(' ').filter(word => !instructionWords.includes(word) || word === 'ТЫ').join(' ');

        logDebugInfo(filteredMessage);

        try {
            const responseText = await retryWithRandomConfig(filteredMessage);
            if (skipCurrentProcessing) {
                console.log('Message processing skipped by user.');
                isProcessing = false;
                processNextMessage();
                return;
            }

            console.log('AI Response before parsing:', responseText);

            const cleanedResponse = parseAndCleanAIResponse(responseText);

            if (cleanedResponse && !containsForbiddenContent(cleanedResponse)) {
                chatHistory.push({ role: 'ai', content: cleanedResponse });
                localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

                await simulateTyping(cleanedResponse);
                console.log('Message processed.');
                isProcessing = false;
                processNextMessage();
            } else {
                console.warn('Forbidden or censored content detected, skipping...');
                isProcessing = false;
                processNextMessage();
            }
        } catch (error) {
            console.error('Error processing message:', error);
            isProcessing = false;
            processNextMessage();
        }
    }

    function logDebugInfo(filteredMessage) {
        const chatHistoryLog = chatHistory.map(entry => `${entry.role}: ${entry.content}`).join(' | ');
        const fullRequestLog = `
            Инструкция: ${systemInstruction}
            История чата: ${chatHistoryLog}
            Отправляемое сообщение: ${filteredMessage}
        `;
        console.log('Отправляемый запрос к ИИ:\n', fullRequestLog);
    }

    function parseAndCleanAIResponse(responseText) {
        const warningPhrases = [
            'Warning: this response may be offensive',
            'AI response contains sensitive content',
            'This AI may use inappropriate language',
            'Content restricted by policy',
            'Censored'
        ];

        const cleanedResponse = responseText.split('\n')
            .filter(line => !warningPhrases.some(phrase => line.includes(phrase)))
            .join('\n');

        return cleanedResponse.trim();
    }

    function containsForbiddenContent(responseText) {
        const forbiddenWords = ['badword1', 'badword2']; // эт нахуй не надо
        return forbiddenWords.some(word => responseText.includes(word));
    }

    async function retryWithRandomConfig(prompt) {
        let retries = 0;
        let responseText = '';

        while (retries < maxRetries && !skipCurrentProcessing) {
            try {
                responseText = await sendToGemini(prompt, modifyConfigRandomly());
                if (responseText) {
                    return responseText;
                }
            } catch (error) {
                console.warn(`Attempt ${retries + 1} failed. Retrying...`);
            }
            retries++;
        }

        if (skipCurrentProcessing) {
            throw new Error('Message processing skipped by user.');
        }

        throw new Error('Max retries reached, unable to get valid response from AI.');
    }

    function modifyConfigRandomly() {
        const newConfig = {
            temperature: Math.random() * 0.5 + 1,
            topP: Math.random() * 0.5 + 0.4,
            topK: Math.floor(Math.random() * 50 + 50),
            candidateCount: 1,
            maxOutputTokens: 1024,
        };
        console.log('Modified AI Config for retry:', newConfig);
        return newConfig;
    }

    function sendToGemini(prompt, config) {
        return new Promise((resolve, reject) => {
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            console.log('Sending message to AI:', prompt);

            const chatHistoryText = chatHistory.map(entry => `${entry.role === 'user' ? 'User' : 'AI'}: ${entry.content}`).join('\n');
            const fullPrompt = `
                ВОТ ИСТОРИЯ ВАШЕГО ДИАЛОГА, ОБРАЩАЙСЯ НА НЕЕ: "${chatHistoryText}"
                Сообщение собеседника: ${prompt}
            `;

            const data = {
                contents: [
                    {
                        parts: [
                            {
                                text: `${systemInstruction}/n${fullPrompt}`
                            }
                        ]
                    }
                ],
                generationConfig: config,
            };

            const makeRequest = () => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(data),
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            console.log('Raw response from AI:', data);

                            if (data && data.candidates && data.candidates.length > 0) {
                                const candidate = data.candidates[0];
                                let aiResponse = candidate?.content?.parts?.[0]?.text || candidate?.text || '';

                                if (aiResponse) {
                                    resolve(aiResponse);
                                } else {
                                    console.warn('AI response is empty or not properly structured.');
                                    reject('AI response is empty or not properly structured.');
                                }
                            } else {
                                console.warn('AI response contains no valid candidates.');
                                reject('AI response contains no valid candidates.');
                            }
                        } catch (error) {
                            console.error('Error parsing response:', error);
                            reject('Failed to process AI response.');
                        }
                    },
                    onerror: function(error) {
                        console.error('Error sending request to AI:', error);
                        reject('Не удалось связаться с ИИ.');
                    }
                });
            };

            const handleAPIRequest = async () => {
                await delay(2000);
                makeRequest();
            };

            handleAPIRequest();
        });
    }

    let typingInterval;

    function simulateTyping(text) {
        return new Promise((resolve) => {
            const inputSelector = '.emojionearea-editor';
            const inputField = document.querySelector(inputSelector);
            if (!inputField) {
                console.error('Input field not found');
                return resolve();
            }

            inputField.textContent = '';
            let index = 0;

            function typeNextChar() {
                if (index < text.length && !skipCurrentProcessing) {
                    inputField.textContent += text[index];
                    inputField.dispatchEvent(new Event('input', { bubbles: true }));
                    index++;
                    typingInterval = setTimeout(typeNextChar, 80);
                } else {
                    if (!skipCurrentProcessing) {
                        setTimeout(() => {
                            const event = new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, which: 13 });
                            inputField.dispatchEvent(event);
                            resolve();
                        }, 500);
                    } else {
                        inputField.textContent = '';
                        resolve();
                    }
                }
            }
            typeNextChar();
        });
    }

    function stopTyping() {
        clearTimeout(typingInterval);
        const inputSelector = '.emojionearea-editor';
        const inputField = document.querySelector(inputSelector);
        if (inputField) {
            inputField.textContent = '';
        }
    }
})();