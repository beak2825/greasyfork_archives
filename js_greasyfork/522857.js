// ==UserScript==
// @name         Mydealz Spam Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Fügt einen "Spam melden" Button im Nachrichtenbereich hinzu
// @author       Claude 3.5
// @match        https://www.mydealz.de/profile/messages*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522857/Mydealz%20Spam%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/522857/Mydealz%20Spam%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS für Button-Design hinzufügen
    const style = document.createElement('style');
    style.textContent = `
        .button--mode-danger {
            background-color: transparent;
            color: #dc3545;
        }

        .button--mode-danger:hover {
            background-color: rgba(220, 53, 69, 0.1);
        }
    `;
    document.head.appendChild(style);

    function init() {
        const checkInterval = setInterval(() => {
            const replyButton = document.querySelector('[data-t="sendButton"]');
            const activeMessage = document.querySelector('.conversationList-msg--active');

            if (replyButton && activeMessage && !document.querySelector('[data-spam-button]')) {
                clearInterval(checkInterval);
                addSpamButton(replyButton, activeMessage);
            }
        }, 500);

        setTimeout(() => clearInterval(checkInterval), 10000);
    }

    function addSpamButton(replyButton, activeMessage) {
        const username = activeMessage.querySelector('.conversationList-senderLine').textContent.trim();
        const messageText = activeMessage.querySelector('.conversationList-msgPreview').textContent.trim();
        const messageLong = document.querySelector('.splitPage-paneTwo .userHtml').textContent.trim();
        const messageShort = messageText.substring(0, 40) + '...';

        const spamButton = document.createElement('button');
        spamButton.className = 'button button--shape-circle button--type-secondary button--mode-danger';
        spamButton.setAttribute('data-spam-button', 'true');
        spamButton.innerHTML = `
            <span class="flex--inline boxAlign-ai--all-c">
                <svg width="18" height="18" class="icon icon--flag space--mr-2">
                    <use xlink:href="/assets/img/ico_c6302.svg#flag"></use>
                </svg>
                <span class="hide--toW5 space--ml-2">Spam melden</span>
            </span>
        `;

        replyButton.parentNode.insertBefore(spamButton, replyButton);

        spamButton.addEventListener('click', () => {
            if (confirm(`Soll diese Nachricht von "${username}"\n\n"${messageShort}"\n\nals Spam an den Support gemeldet werden?`)) {
                const token = document.cookie.split(';')
                    .find(cookie => cookie.includes('xsrf_t='))
                    ?.split('=')[1]?.replace(/"/g, '');

                if (token) {
                    const formData = new FormData();
                    formData.append('_token', token);
                    formData.append('userName', 'mydealz');
                    formData.append('message', `Hey Supportteam,\nder User ${username} hat mir folgende Spamnachricht geschickt. Könnt Ihr Euch das bitte einmal ansehen?\n"${messageLong}"`);

                    fetch('https://www.mydealz.de/conversation/send-message', {
                        method: 'POST',
                        headers: {
                            'X-XSRF-TOKEN': token,
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        body: formData
                    }).then(() => {
                        window.location.reload();
                    });
                }
            }
        });
    }

    function observeChanges() {
        const observer = new MutationObserver(() => {
            const activeMessage = document.querySelector('.conversationList-msg--active');
            const replyButton = document.querySelector('[data-t="sendButton"]');
            const spamButton = document.querySelector('[data-spam-button]');

            if (activeMessage && replyButton && !spamButton) {
                addSpamButton(replyButton, activeMessage);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            observeChanges();
        });
    } else {
        init();
        observeChanges();
    }
})();