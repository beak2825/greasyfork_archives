// ==UserScript==
// @name         ChatGPT Auto Conversation
// @name:ru      ChatGPT Авторазговор
// @namespace    https://github.com/radik097/GPTAutoResponce
// @version      1.3
// @description  Automatically continue conversation with ChatGPT, generating new questions based on previous responses.
// @description:ru Автоматическое продолжение диалога с ChatGPT, генерируя вопросы на основе последних строк ответа.
// @author       Your Name
// @match        *://chat.openai.com/*
// @match        *://chatgpt.com/*
// @require      https://cdn.jsdelivr.net/npm/@kudoai/chatgpt.js@3.3.5/dist/chatgpt.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @license      MIT
// @supportURL   https://github.com/your-repo/issues
// @compatible   firefox Работает корректно
// @compatible   chrome Работает корректно
// @incompatible edge Не тестировался
// @downloadURL https://update.greasyfork.org/scripts/520182/ChatGPT%20Auto%20Conversation.user.js
// @updateURL https://update.greasyfork.org/scripts/520182/ChatGPT%20Auto%20Conversation.meta.js
// ==/UserScript==


(async () => {
    const chatgpt = window.chatgpt;

    if (!chatgpt) {
        console.error('ChatGPT.js library is not loaded!');
        return;
    }

    // Utility function to wait for a new message
    async function waitForResponse() {
        return new Promise((resolve) => {
            new MutationObserver((mutations, observer) => {
                if (document.querySelector('[data-message-author-role="assistant"]')) {
                    observer.disconnect();
                    resolve();
                }
            }).observe(document.body, { childList: true, subtree: true });
        });
    }

    // Function to extract the last two lines of the response
    function extractLastTwoLines(text) {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const lastTwoLines = lines.slice(-2).join(' ');
        return lastTwoLines.trim();
    }

    // Function to generate the next question based on the last two lines
    function generateNextQuestion(lastTwoLines) {
        return `Как ты думаешь об этом: "${lastTwoLines}"?`;
    }

    // Main conversation loop
    async function startAutoConversation() {
    console.log('Starting automatic conversation...');
    while (true) {
        // Wait for the assistant's response
        await waitForResponse();

        // Wait an additional 2 seconds after the response is received
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Get the latest response text
        const assistantMessage = [...document.querySelectorAll('[data-message-author-role="assistant"]')].pop();
        const responseText = assistantMessage?.innerText || '';

        if (!responseText) {
            console.error('Failed to retrieve assistant response.');
            break;
        }

        // Extract the last two lines
        const lastTwoLines = extractLastTwoLines(responseText);
        console.log(`Last two lines: ${lastTwoLines}`);

        // Generate the next question
        const nextQuestion = generateNextQuestion(lastTwoLines);
        console.log(`Next question: ${nextQuestion}`);

        // Send the next question
        chatgpt.send(nextQuestion);

        // Wait a few seconds before proceeding to avoid overwhelming the system
        await new Promise((resolve) => setTimeout(resolve, 4000));
    }
}



    // Wait for the ChatGPT page to load
    await chatgpt.isLoaded();
    console.log('ChatGPT page loaded.');

    // Add a button to toggle automatic conversation
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Start Auto Conversation';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '20px';
    toggleButton.style.right = '20px';
    toggleButton.style.zIndex = '1000';
    toggleButton.style.padding = '10px';
    toggleButton.style.background = '#4CAF50';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';

    document.body.appendChild(toggleButton);

    let isRunning = false;
    toggleButton.addEventListener('click', () => {
        if (isRunning) {
            isRunning = false;
            toggleButton.textContent = 'Start Auto Conversation';
            console.log('Auto conversation stopped.');
        } else {
            isRunning = true;
            toggleButton.textContent = 'Stop Auto Conversation';
            startAutoConversation().catch((err) => {
                console.error('Error during auto conversation:', err);
                isRunning = false;
                toggleButton.textContent = 'Start Auto Conversation';
            });
        }
    });
})();
