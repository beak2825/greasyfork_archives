// ==UserScript==
// @name         test zımbabumba şikayet
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Eklenti yetkililerine özel hızlı şikayet etme eklentisi.
// @match        https://x.com/*
// @author       dursunator
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license      MIT
// @connect      discord.com
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlBKm78ZD4i4X7GDHLZRXNBek_k1WY6YNQNw&s
// @downloadURL https://update.greasyfork.org/scripts/531777/test%20z%C4%B1mbabumba%20%C5%9Fikayet.user.js
// @updateURL https://update.greasyfork.org/scripts/531777/test%20z%C4%B1mbabumba%20%C5%9Fikayet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let config = {
        discordWebhookUrl: GM_getValue('discordWebhookUrl', 'https://ptb.discord.com/api/webhooks/1357485552408199198/sZ7Zb8CZgen_-1cmsdDJnlX7MDmzUFzMMaFGGq5KbGzdwGd2-253mJWOK7sGhK6Y7pjb'),
        autoSendEnabled: GM_getValue('autoSendEnabled', false)
    };
    let sentTweets = new Set(JSON.parse(GM_getValue('sentTweets', '[]')));

    const baseUrl = 'https://vxtwitter.com';
    const defaultSVG = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-clipboard" viewBox="0 0 24 24" stroke-width="2" stroke="#71767C" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24V24H0z" fill="none"/><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><path d="M9 3m0 2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"/></svg>';
    const copiedSVG = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-clipboard-check" viewBox="0 0 24 24" stroke-width="2" stroke="#00abfb" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24V24H0z" fill="none"/><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><path d="M9 3m0 2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"/><path d="M9 14l2 2 4-4"/></svg>';

    GM_addStyle(`
        .modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.4);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .modal-content {
            background-color: #15202B;
            color: #ffffff;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #38444D;
            border-radius: 15px;
            width: 80%;
            max-width: 500px;
        }
        .close {
            color: #8899A6;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
        .close:hover,
        .close:focus {
            color: #1DA1F2;
            text-decoration: none;
            cursor: pointer;
        }
        .modal h2 {
            color: #ffffff;
            margin-bottom: 20px;
        }
        .modal label {
            display: block;
            margin-bottom: 10px;
            color: #8899A6;
        }
        .modal input[type="text"] {
            width: 100%;
            padding: 8px;
            margin-bottom: 20px;
            border: 1px solid #38444D;
            background-color: #192734;
            color: #ffffff;
            border-radius: 5px;
        }
        .modal button {
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 10px;
        }
        .modal button#save-settings {
            background-color: #1DA1F2;
            color: white;
            font-weight: bold;
        }
        .modal button#save-settings:hover {
            background-color: #1A91DA;
        }
        .modal button#clear-history {
            background-color: #E0245E;
            color: white;
            font-weight: bold;

        }
        .modal button#clear-history:hover {
            background-color: #C01E4E;

        }
        .modal button#test-webhook {
            background-color: #17BF63;
            color: white;
            font-weight: bold;

        }
        .modal button#test-webhook:hover {
            background-color: #14A358;
        }
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 10000;
            transition: opacity 0.5s ease-in-out;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .notification.success { background-color: #1DA1F2; }
        .notification.error { background-color: #E0245E; }
        .notification.info { background-color: #17202A; }
        .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
        }
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .slider {
            background-color: #1DA1F2;
        }
        input:checked + .slider:before {
            transform: translateX(26px);
        }
        .settings-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
        }
    `);

    function addSendButtonToTweets() {
        const tweets = document.querySelectorAll('button[data-testid="bookmark"]');
        tweets.forEach(bookmarkButton => {
            const parentDiv = bookmarkButton.parentElement;
            const tweet = parentDiv.closest('article[data-testid="tweet"]');
            if (tweet && !tweet.querySelector('.custom-send-icon')) {
                const sendIcon = document.createElement('div');
                sendIcon.classList.add('custom-send-icon');
                sendIcon.setAttribute('aria-label', 'Discord\'a Gönder');
                sendIcon.setAttribute('role', 'button');
                sendIcon.setAttribute('tabindex', '0');
                sendIcon.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 19px; height: 19px; border-radius: 9999px; transition-duration: 0.2s; cursor: pointer;';

                const tweetUrl = extractTweetUrl(tweet);
                const tweetId = tweetUrl.split('/').pop();
                const isSent = sentTweets.has(tweetId);

                sendIcon.innerHTML = isSent ? copiedSVG : defaultSVG;

                sendIcon.addEventListener('click', (event) => {
                    event.stopPropagation();
                    if (tweetUrl) {
                        if (!isSent) {
                            sendToDiscord(tweetId, tweetUrl, sendIcon);
                        } else {
                            showNotification('Halihazırda şikayet ettin!', 'info');
                        }
                    }
                });

                const parentDivClone = parentDiv.cloneNode(true);
                parentDivClone.style.cssText = 'display: flex; align-items: center;';
                parentDiv.parentNode.insertBefore(parentDivClone, parentDiv.nextSibling);
                parentDivClone.innerHTML = '';
                parentDivClone.appendChild(sendIcon);


                const likeButton = tweet.querySelector('[data-testid="like"]');
                if (likeButton) {
                    likeButton.addEventListener('click', (e) => {
                        if (e.target.closest('[data-testid="like"]')) {
                            if (!isSent && config.autoSendEnabled) {
                                sendToDiscord(tweetId, tweetUrl, sendIcon);
                            }
                        }
                    });
                }
            }
        });
    }

    function extractTweetUrl(tweetElement) {
        const linkElement = tweetElement.querySelector('a[href*="/status/"]');
        if (!linkElement) {
            return;
        }
        let url = linkElement.getAttribute('href').split('?')[0];
        if (url.includes('/photo/')) {
            url = url.split('/photo/')[0];
        }
        return `${baseUrl}${url}`;
    }

    function sendToDiscord(tweetId, link, buttonElement) {
        if (!config.discordWebhookUrl) {
            showNotification('Discord webhook URL is not set. Please set it in the script settings.', 'error');
            return;
        }

        if (sentTweets.has(tweetId)) {
            showNotification('Bu kişiyi/gönderiyi halihazırda şikayet ettin.', 'info');
            return;
        }

        const mentionId = '1119581460337274941';
        const messageContent = `<@${mentionId}> ${link}`;

        GM_xmlhttpRequest({
            method: 'POST',
            url: config.discordWebhookUrl,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ content: messageContent }),
            onload: function(response) {
                if (response.status === 204) {
                    showNotification('Şikayet başarı ile gönderildi', 'success');
                    sentTweets.add(tweetId);
                    GM_setValue('sentTweets', JSON.stringify([...sentTweets]));
                    buttonElement.innerHTML = copiedSVG;
                } else {
                    showNotification('Webhook hatası şikayet gönderilemedi!', 'error');
                    console.error('Webhook hatası şikayet gönderilemedi!', response);
                }
            },
            onerror: function(error) {
                showNotification('Error sending tweet to Discord. Please check your internet connection.', 'error');
                console.error('Error sending tweet to Discord', error);
            }
        });
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.classList.add('notification', type);
        notification.onclick = () => notification.remove();

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }

    function createSettingsModal() {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Twitter to Discord Settings</h2>
                <label for="webhook-url">Discord Webhook URL:</label>
                <input type="text" id="webhook-url" value="${config.discordWebhookUrl}">
                <div class="settings-row">
                    <label for="auto-send">Beğenilerde Otomatik Olarak Gönder:</label>
                    <label class="switch">
                        <input type="checkbox" id="auto-send" ${config.autoSendEnabled ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                <button id="save-settings">Ayarları Kaydet</button>
                <button id="clear-history">Gönderilen Geçmişini Temizle</button>
                <button id="test-webhook">Webhook'u Test Et</button>
            </div>
        `;

        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.close');
        const saveBtn = modal.querySelector('#save-settings');
        const clearHistoryBtn = modal.querySelector('#clear-history');
        const testWebhookBtn = modal.querySelector('#test-webhook');

        closeBtn.onclick = () => modal.style.display = 'none';
        saveBtn.onclick = saveSettings;
        clearHistoryBtn.onclick = clearSentTweetsHistory;
        testWebhookBtn.onclick = testWebhook;

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };

        return modal;
    }

    function saveSettings() {
        const webhookUrl = document.getElementById('webhook-url').value;
        const autoSend = document.getElementById('auto-send').checked;

        config.discordWebhookUrl = webhookUrl;
        config.autoSendEnabled = autoSend;

        GM_setValue('discordWebhookUrl', webhookUrl);
        GM_setValue('autoSendEnabled', autoSend);

        showNotification('Settings saved successfully', 'success');
        document.querySelector('.modal').style.display = 'none';
    }

    function clearSentTweetsHistory() {
        if (confirm('Are you sure you want to clear the history of sent tweets? This will allow re-sending of previously sent tweets.')) {
            sentTweets.clear();
            GM_setValue('sentTweets', '[]');
            showNotification('Gönderilen Tweet Geçmişi Halihazırda Temizlendi.', 'success');
        }
    }

    function testWebhook() {
        const webhookUrl = document.getElementById('webhook-url').value;
        if (!webhookUrl) {
            showNotification('Lütfen testten önce bir Webhook URL\'si girin.', 'error');
            return;
        }

        const mentionId = '1119581460337274941';
        const testMessage = `<@${mentionId}> Test message from Twitter to Discord script`;

        GM_xmlhttpRequest({
            method: 'POST',
            url: webhookUrl,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ content: testMessage }),
            onload: function(response) {
                if (response.status === 204) {
                    showNotification('Webhook testi başarılı!', 'success');
                } else {
                    showNotification('Webhook testi başarısız. Lütfen URL\'yi kontrol edin.', 'error');
                }
            },
            onerror: function(error) {
                showNotification('Webhook test hatası. Lütfen internet bağlantınızı kontrol edin.', 'error');
            }
        });
    }

    const settingsModal = createSettingsModal();

    GM_registerMenuCommand('Twitter Yer İşaretleri Discord\'a Ayarları', () => {
        settingsModal.style.display = 'block';
    });

    const observer = new MutationObserver(addSendButtonToTweets);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('DOMContentLoaded', addSendButtonToTweets);
})();