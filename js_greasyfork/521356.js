// ==UserScript==
// @name         Slack Typing Notification
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Notify when someone is typing in Slack with enhanced UI and smooth animations
// @author       Mahmudul Hasan Shawon
// @icon         https://www.slack.com/favicon.ico
// @match        https://app.slack.com/client/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521356/Slack%20Typing%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/521356/Slack%20Typing%20Notification.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let typingPopup = null;

    // Create fade-in/out keyframes dynamically
    function addKeyframes() {
        const styleSheet = document.styleSheets[0];
        styleSheet.insertRule(`
            @keyframes fadeInOut {
                0%, 100% { opacity: 0; }
                50% { opacity: 1; }
            }
        `, styleSheet.cssRules.length);
    }

    // Create notification popup
    function createNotification(username) {
        if (typingPopup) return;

        typingPopup = document.createElement('div');
        Object.assign(typingPopup.style, {
            position: 'fixed',
            bottom: '35px',
            left: '60%',
            transform: 'translateX(-50%) translateY(100px)',
            padding: '10px 20px',
            backgroundColor: '#1dbf73',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 'bold',
            borderRadius: '12px',
            boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)',
            zIndex: '10000',
            opacity: '0',
            transition: 'all 0.5s ease-in-out',
        });

        typingPopup.innerHTML = `<span id="typing-text" style="animation: fadeInOut 3s infinite;">💬 ${username} is typing...</span>`;
        document.body.appendChild(typingPopup);

        requestAnimationFrame(() => {
            typingPopup.style.transform = 'translateX(-50%) translateY(0)';
            typingPopup.style.opacity = '1';
        });
    }

    // Remove notification popup with animation
    function removeNotification() {
        if (typingPopup) {
            typingPopup.style.transform = 'translateX(-50%) translateY(100px)';
            typingPopup.style.opacity = '0';

            setTimeout(() => {
                typingPopup.remove();
                typingPopup = null;
            }, 500);
        }
    }

    // Observe typing events
    function observeTyping() {
        const observer = new MutationObserver((mutations) => {
            const typingDetected = mutations.some((mutation) =>
                Array.from(mutation.addedNodes).some((node) => {
                    if (node.nodeType === 1 && node.textContent.includes('is typing')) {
                        const usernameMatch = node.textContent.match(/^(.*) is typing/);
                        if (usernameMatch) createNotification(usernameMatch[1].trim());
                        return true;
                    }
                    return false;
                })
            );

            if (!typingDetected) removeNotification();
        });

        const targetNode = document.querySelector('.p-notification_bar');
        if (targetNode) {
            observer.observe(targetNode, { childList: true, subtree: true });
        } else {
            console.warn('Target container for typing events not found!');
        }
    }

    // Add responsive design for different screen sizes
    function addResponsiveStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            @media (max-width: 768px) {
                #typing-popup {
                    left: 50%;
                    transform: translateX(-50%) translateY(100px);
                    font-size: 12px;
                    padding: 8px 16px;
                }
            }

            @media (max-width: 480px) {
                #typing-popup {
                    font-size: 10px;
                    padding: 6px 12px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    window.addEventListener('load', () => {
        addKeyframes();
        observeTyping();
        addResponsiveStyles();
    });
})();
