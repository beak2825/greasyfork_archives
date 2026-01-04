// ==UserScript==
// @name         Sync between Sexy.AI and SillyTavern optimized
// @namespace    http://tampermonkey.net/
// @version      3.4.1
// @description  Enhanced and optimized integration between SillyTavern and Sexy.AI
// @author       You
// @match        https://sexy.ai/workflow*
// @match        https://staticui.sexy.ai/*
// @match        http://103.70.12.123:8000/*
// @match        http://127.0.0.1:8000/*
// @match        http://*/*:8000/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/518219/Sync%20between%20SexyAI%20and%20SillyTavern%20optimized.user.js
// @updateURL https://update.greasyfork.org/scripts/518219/Sync%20between%20SexyAI%20and%20SillyTavern%20optimized.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Script started on URL:", window.location.href);

    const isSexyAI = window.location.href.includes('sexy.ai') || window.location.href.includes('staticui.sexy.ai');
    const isSillyTavern = window.location.href.includes(':8000');

    // Utility Functions
    function createStyledButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            padding: 5px 8px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            opacity: 0.8;
            transition: all 0.3s;
            margin-left: 5px;
        `;
        button.addEventListener('mouseover', () => button.style.opacity = '1');
        button.addEventListener('mouseout', () => button.style.opacity = '0.8');
        button.addEventListener('click', onClick);
        return button;
    }

    function showNotification(message) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #4CAF50;
            color: white;
            padding: 8px;
            border-radius: 4px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        overlay.textContent = message;
        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 300);
            }, 1500);
        });
    }

    // Extract original text from message
    function extractOriginalText(messageNode) {
        const originalText = messageNode.getAttribute('data-original-text');
        if (originalText) {
            return originalText;
        }

        const messageText = messageNode.querySelector('.mes_text');
        if (!messageText) return '';

        const clone = messageText.cloneNode(true);
        const buttonContainer = clone.querySelector('.button-container');
        if (buttonContainer) {
            buttonContainer.remove();
        }

        return clone.textContent.trim();
    }

    // SexyAI Implementation
    if (isSexyAI) {
        if (window.location.href.includes('staticui.sexy.ai')) {
            const promptButton = createStyledButton('Get Prompt', () => {
                const prompt = GM_getValue('st_prompt', null);
                if (prompt) {
                    const positiveInput = document.querySelector('textarea') ||
                                        document.querySelector('input[type="text"]');

                    if (positiveInput) {
                        positiveInput.value = prompt;
                        const event = new Event('input', { bubbles: true });
                        positiveInput.dispatchEvent(event);
                        GM_setValue('st_prompt', null);
                        promptButton.style.backgroundColor = '#2196F3';
                        promptButton.textContent = 'Prompt Added';
                        setTimeout(() => {
                            promptButton.style.backgroundColor = '#4CAF50';
                            promptButton.textContent = 'Get Prompt';
                        }, 2000);
                    }
                }
            });
            promptButton.style.cssText += 'position: fixed; right: 20px; top: 80px;';
            document.body.appendChild(promptButton);
        }

        // Optimized image handling for SexyAI
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                const allImages = document.querySelectorAll('img');
                const latestImages = Array.from(allImages)
                    .slice(-1)
                    .map(img => img.src);

                GM_setValue('sexyai_images', JSON.stringify(latestImages));
                showNotification('Images Synced');
            }
        }, true);
    }

    // SillyTavern Implementation
    else if (isSillyTavern) {
function showImageModal(imageUrl) {
    const existingModal = document.querySelector('.image-modal-container');
    if (existingModal) {
        existingModal.remove();
    }

    const images = JSON.parse(GM_getValue('sexyai_images', '[]'));
    if (images.length === 0) return;

    const container = document.createElement('div');
    container.className = 'image-modal-container';
    container.style.cssText = `
        position: fixed;
        top: 0px;
        right: 20px;
        z-index: 10000;
        padding: 0px;
        border-radius: 0px;
        max-width: 300px;
    `;

    const imgElement = new Image();
    imgElement.style.cssText = `
        width: 100%;
        height: auto;
        max-height: 400px;
        object-fit: contain;
        border-radius: 0px;
    `;

    // Luôn hiển thị ảnh mới nhất
    imgElement.src = images[images.length - 1];

    const keyHandler = (e) => {
        if (!container.isConnected) return;
        if (e.key === 'Escape') container.remove();
    };

    document.addEventListener('keydown', keyHandler);
    container.addEventListener('remove', () => {
        document.removeEventListener('keydown', keyHandler);
    });

    container.appendChild(imgElement);
    document.body.appendChild(container);
}
        function addControlButtons() {
            if (document.querySelector('#show_image_button') || document.querySelector('#send_prompt_button')) {
                return;
            }

            const extensionsButton = document.querySelector('#extensionsMenuButton');
            const optionsButton = document.querySelector('#options_button');

            if (extensionsButton && optionsButton) {
                const showImageButton = document.createElement('div');
                showImageButton.id = 'show_image_button';
                showImageButton.className = 'fa-solid fa-eye interactable';
                showImageButton.title = 'Show/Hide Images';
                showImageButton.style.cssText = `
                    display: flex;
                    cursor: pointer;
                    opacity: 0.7;
                    margin: 0 5px;
                    font-size: 18px;
                    transition: all 0.3s;
                `;
                showImageButton.tabIndex = "0";

                const sendPromptButton = document.createElement('div');
                sendPromptButton.id = 'send_prompt_button';
                sendPromptButton.className = 'fa-solid fa-paper-plane interactable';
                sendPromptButton.title = 'Send Prompt';
                sendPromptButton.style.cssText = `
                    display: flex;
                    cursor: pointer;
                    opacity: 0.7;
                    margin: 0 5px;
                    font-size: 18px;
                    transition: all 0.3s;
                `;
                sendPromptButton.tabIndex = "0";

                let isShowingImages = false;

                showImageButton.addEventListener('click', () => {
                    isShowingImages = !isShowingImages;
                    showImageButton.style.color = isShowingImages ? 'var(--accent-color, #4CAF50)' : '';
                    showImageButton.style.opacity = isShowingImages ? '1' : '0.7';

                    if (isShowingImages) {
                        const images = JSON.parse(GM_getValue('sexyai_images', '[]'));
                        if (images.length > 0) {
                            showImageModal(images[0]);
                        }
                    } else {
                        const existingModal = document.querySelector('.image-modal-container');
                        if (existingModal) {
                            existingModal.remove();
                        }
                    }
                });

                sendPromptButton.addEventListener('click', () => {
                    const messages = document.getElementsByClassName('mes');
                    const lastMessage = messages[messages.length - 1];
                    if (lastMessage) {
                        const text = extractOriginalText(lastMessage);
                        const match = text.match(/image###([^#]+)###/);
                        if (match) {
                            const prompt = match[1].trim();
                            GM_setValue('st_prompt', prompt);
                            sendPromptButton.style.color = 'var(--accent-color, #4CAF50)';
                            setTimeout(() => {
                                sendPromptButton.style.color = '';
                            }, 2000);
                        }
                    }
                });

                optionsButton.parentNode.insertBefore(showImageButton, optionsButton.nextSibling);
                extensionsButton.parentNode.insertBefore(sendPromptButton, extensionsButton.nextSibling);
            }
        }

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.removedNodes.length > 0) {
                    if (!document.querySelector('#show_image_button') || !document.querySelector('#send_prompt_button')) {
                        addControlButtons();
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initial setup
        let checkInterval = setInterval(() => {
            if (document.querySelector('#options_button') && document.querySelector('#extensionsMenuButton')) {
                addControlButtons();
                if (document.querySelector('#show_image_button') && document.querySelector('#send_prompt_button')) {
                    clearInterval(checkInterval);
                }
            }
        }, 1000);
    }
})();