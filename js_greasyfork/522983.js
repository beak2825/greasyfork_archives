// ==UserScript==
// @name         VK MIXTAPE 2.0
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Блокировка статуса набора текста, прочтения сообщений и скрытие быстрых чатов с подразделами настроек
// @author       retr0dev (https://vk.com/retr0dev)
// @match        https://vk.com/*
// @match        https://vk.com/im*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/522983/VK%20MIXTAPE%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/522983/VK%20MIXTAPE%2020.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getSettings() {
        return {
            preventTyping: localStorage.getItem('vk_privacy_prevent_typing') !== 'false',
            preventRead: localStorage.getItem('vk_privacy_prevent_read') !== 'false',
            hideQuickChats: localStorage.getItem('vk_privacy_hide_quick_chats') === 'true'
        };
    }

    function shouldBlock(data, settings) {
        let dataStr = '';
        if (typeof data === 'string') {
            dataStr = data;
        } else if (typeof data === 'object' && data !== null) {
            try {
                dataStr = JSON.stringify(data);
            } catch (e) {
                return false;
            }
        } else {
            return false;
        }

        const typingPatterns = ['typing', 'setActivity'];
        const readPatterns = ['markAsRead', 'setSeen', 'setReadMessages'];

        if (settings.preventTyping && typingPatterns.some(pattern => dataStr.includes(pattern))) {
            return true;
        }
        if (settings.preventRead && readPatterns.some(pattern => dataStr.includes(pattern))) {
            return true;
        }
        return false;
    }

    const originalWebSocket = window.WebSocket;
    const originalXHR = XMLHttpRequest.prototype.send;
    const originalFetch = window.fetch;

    window.WebSocket = function(url, protocols) {
        const ws = new originalWebSocket(url, protocols);
        const originalSend = ws.send;

        ws.send = function(data) {
            const settings = getSettings();
            if (shouldBlock(data, settings)) {
                console.log('Blocked WebSocket:', data);
                return;
            }
            return originalSend.apply(this, arguments);
        };
        return ws;
    };
    window.WebSocket.prototype = originalWebSocket.prototype;

    XMLHttpRequest.prototype.send = function(data) {
        const settings = getSettings();
        if (shouldBlock(data, settings)) {
            console.log('Blocked XHR:', data);
            return;
        }
        return originalXHR.apply(this, arguments);
    };

    window.fetch = async function(resource, init) {
        const settings = getSettings();
        if (shouldBlock(resource, settings) || (init && shouldBlock(init.body, settings))) {
            console.log('Blocked fetch:', resource || init.body);
            return Promise.resolve(new Response(null, { status: 204 }));
        }
        return originalFetch.apply(this, arguments);
    };

    const styles = `
        .privacy-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(8px);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        .privacy-modal.show {
            display: flex;
            animation: modalFadeIn 0.3s ease;
        }
        .privacy-container {
            background: #1E1E1E;
            padding: 20px;
            border-radius: 28px;
            width: 360px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            max-height: 80vh;
            overflow-y: auto;
        }
        .privacy-header {
            display: flex;
            align-items: center;
            margin-bottom: 24px;
            gap: 12px;
        }
        .privacy-title {
            font-size: 20px;
            font-weight: 600;
            color: #CCCCCC;
        }
        .privacy-section {
            margin-bottom: 20px;
        }
        .privacy-section-title {
            font-size: 16px;
            font-weight: 500;
            color: #FFFFFF;
            margin-bottom: 12px;
            border-bottom: 1px solid #333333;
            padding-bottom: 6px;
        }
        .privacy-option {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            padding: 12px;
            background: #2C2C2C;
            border-radius: 16px;
            transition: background 0.2s ease;
        }
        .privacy-option:hover {
            background: #333333;
        }
        .privacy-switch {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
            margin-right: 12px;
        }
        .privacy-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .privacy-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(255, 255, 255, 0.1);
            transition: background-color 0.3s ease-in-out;
            border-radius: 24px;
        }
        .privacy-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: #FFFFFF;
            transition: transform 0.3s ease-in-out;
            border-radius: 50%;
        }
        input:checked + .privacy-slider {
            background: linear-gradient(135deg, #FF4593, #8C5CFF);
        }
        input:checked + .privacy-slider:before {
            transform: translateX(20px);
        }
        .privacy-option-text {
            font-size: 14px;
            color: #FFFFFF;
            font-weight: 500;
        }
        .privacy-save {
            background: linear-gradient(135deg, #FF4593, #8C5CFF);
            color: white;
            padding: 12px;
            border: none;
            border-radius: 16px;
            cursor: pointer;
            width: 100%;
            font-size: 15px;
            font-weight: 600;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            margin-top: 8px;
        }
        .privacy-save:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(140, 92, 255, 0.3);
        }
        .privacy-save:active {
            transform: translateY(0);
        }
        .privacy-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1E1E1E;
            color: white;
            padding: 12px 20px;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            z-index: 10000;
        }
        .privacy-notification.show {
            opacity: 1;
            transform: translateY(0);
        }
        @keyframes modalFadeIn {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        .privacy-hide-quick-chats .quick_chat_button_container,
        .privacy-hide-quick-chats [class*="quick_chat_button_"],
        .privacy-hide-quick-chats .FlatButton--secondary,
        .privacy-hide-quick-chats .im-page--chat-body-abs,
        .privacy-hide-quick-chats .PpList__item--quick,
        .privacy-hide-quick-chats [class*="quick_chat_"],
        .privacy-hide-quick-chats .im-right-menu,
        .privacy-hide-quick-chats .FCPanel_list,
        .privacy-hide-quick-chats [class*="FCPanel_"] {
            display: none !important;
        }
    `;

    function addStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'privacy-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function createSettingsModal() {
        const settings = getSettings();
        const modal = document.createElement('div');
        modal.className = 'privacy-modal';
        modal.innerHTML = `
            <div class="privacy-container">
                <div class="privacy-header">
                    <div class="privacy-title">VK MIXTAPE 2.0</div>
                </div>
                <div class="privacy-section">
                    <div class="privacy-section-title">Сообщения:</div>
                    <div class="privacy-option">
                        <label class="privacy-switch">
                            <input type="checkbox" id="preventRead" ${settings.preventRead ? 'checked' : ''}>
                            <span class="privacy-slider"></span>
                        </label>
                        <span class="privacy-option-text">Не прочитывать сообщения</span>
                    </div>
                    <div class="privacy-option">
                        <label class="privacy-switch">
                            <input type="checkbox" id="preventTyping" ${settings.preventTyping ? 'checked' : ''}>
                            <span class="privacy-slider"></span>
                        </label>
                        <span class="privacy-option-text">Не отправлять статус набора</span>
                    </div>
                </div>
                <div class="privacy-section">
                    <div class="privacy-section-title">Дополнительно:</div>
                    <div class="privacy-option">
                        <label class="privacy-switch">
                            <input type="checkbox" id="hideQuickChats" ${settings.hideQuickChats ? 'checked' : ''}>
                            <span class="privacy-slider"></span>
                        </label>
                        <span class="privacy-option-text">Скрыть быстрые чаты</span>
                    </div>
                </div>
                <button class="privacy-save">Сохранить</button>
            </div>
        `;
        document.body.appendChild(modal);

        const preventTyping = modal.querySelector('#preventTyping');
        const preventRead = modal.querySelector('#preventRead');
        const hideQuickChats = modal.querySelector('#hideQuickChats');
        const saveButton = modal.querySelector('.privacy-save');

        saveButton.addEventListener('click', () => {
            localStorage.setItem('vk_privacy_prevent_typing', preventTyping.checked);
            localStorage.setItem('vk_privacy_prevent_read', preventRead.checked);
            localStorage.setItem('vk_privacy_hide_quick_chats', hideQuickChats.checked);
            applyQuickChatsVisibility();
            showNotification('Настройки сохранены!');
            modal.classList.remove('show');
        });

        return modal;
    }

    function applyQuickChatsVisibility() {
        const settings = getSettings();
        if (settings.hideQuickChats) {
            document.body.classList.add('privacy-hide-quick-chats');
        } else {
            document.body.classList.remove('privacy-hide-quick-chats');
        }
    }

    function addMenuItem(modal) {
        const observer = new MutationObserver(() => {
            const themeElement = Array.from(document.querySelectorAll('div[role="button"]')).find(el => 
                el.textContent.includes('Тема:')
            );
            
            if (themeElement && !document.querySelector('[data-privacy-settings="true"]')) {
                const privacyItem = document.createElement('div');
                privacyItem.setAttribute('data-privacy-settings', 'true');
                privacyItem.setAttribute('role', 'button');
                privacyItem.className = themeElement.className;
                
                privacyItem.innerHTML = `
                    <div style="display: flex; align-items: center; padding: 4px 6px;">
                        <div style="width: 24px; height: 24px; margin-right: 10px; display: flex; align-items: center;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--vkui--color_icon_accent)" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                            </svg>
                        </div>
                        <span>VK MIXTAPE 2.0</span>
                    </div>
                `;

                privacyItem.addEventListener('click', () => {
                    modal.classList.add('show');
                });

                themeElement.parentNode.insertBefore(privacyItem, themeElement.nextSibling);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function init() {
        addStyles();
        const modal = createSettingsModal();
        addMenuItem(modal);
        applyQuickChatsVisibility();

        const bodyObserver = new MutationObserver(() => {
            applyQuickChatsVisibility();
        });

        bodyObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();