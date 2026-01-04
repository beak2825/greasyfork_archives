// ==UserScript==
// @name         Wiadomości Allegro w karcie zamówienia SA
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Pobieranie wiadomości Allegro i wyświetlanie ich w karcie zamówienia w SellAsist jako nowe pole
// @author       Dawid
// @match        https://premiumtechpanel.sellasist.pl/admin/orders/edit/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      Proprietary
// @connect      premiumtechpanel.sellasist.pl
// @downloadURL https://update.greasyfork.org/scripts/525048/Wiadomo%C5%9Bci%20Allegro%20w%20karcie%20zam%C3%B3wienia%20SA.user.js
// @updateURL https://update.greasyfork.org/scripts/525048/Wiadomo%C5%9Bci%20Allegro%20w%20karcie%20zam%C3%B3wienia%20SA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const addMessagesSection = () => {
        console.log("Dodawanie sekcji z wiadomościami...");
        const loginElement = document.querySelector('a[href*="allegro.pl/uzytkownik/"]');

        if (!loginElement) {
            console.log("Nie znaleziono loginu klienta.");
            return;
        }

        setTimeout(() => {
            fetchMessages(loginElement.textContent.trim(), loginElement);
        }, 2000);

        console.log("Rozpoczynamy pobieranie wiadomości...");
    };

    const fetchMessages = (clientLogin, loginElement) => {
        console.log(`Pobieranie wiadomości dla klienta: ${clientLogin}`);
        const encodedLogin = encodeURIComponent(clientLogin);
        const searchUrl = `https://premiumtechpanel.sellasist.pl/admin/allegro_messages/edit?interlocutor_login=${encodedLogin}&new_filters=1`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: searchUrl,
            onload: function (response) {
                const responseText = response.responseText;
                const messageLinkRegex = /href="(https:\/\/premiumtechpanel\.sellasist\.pl\/admin\/allegro_messages\/show\/\d+)"/g;
                const messageLinks = [];
                let match;

                while (match = messageLinkRegex.exec(responseText)) {
                    messageLinks.push(match[1]);
                }

                console.log(`Znaleziono ${messageLinks.length} linków do wiadomości`);

                if (messageLinks.length > 0) {
                    let messages = [];
                    let completedRequests = 0;

                    messageLinks.forEach(messageUrl => {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: messageUrl,
                            onload: function (messageResponse) {
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(messageResponse.responseText, 'text/html');
                                const messageElements = doc.querySelectorAll('.dispute-message');

                                messageElements.forEach(element => {
                                    const isFromBuyer = element.classList.contains('message-buyer');
                                    const dateElement = element.querySelector('.dispute-seller-date, .dispute-buyer-date');
                                    const contentElement = element.querySelector('div[style="margin-bottom: 5px"]');
                                    const attachments = element.querySelectorAll('a.download_attachment');

                                    if (dateElement && contentElement) {
                                        let messageContent = formatMessage(contentElement.textContent.trim());

                                        if (attachments.length > 0) {
                                            const attachmentTexts = Array.from(attachments).map(attachment =>
                                                `<i>Załącznik: ${attachment.getAttribute('download')}</i>`
                                            );
                                            if (messageContent) {
                                                messageContent += '<br>';
                                            }
                                            messageContent += attachmentTexts.join('<br>');
                                        }

                                        messages.push({
                                            content: messageContent || '<i>(pusta wiadomość)</i>',
                                            timestamp: dateElement.textContent.trim(),
                                            sender: isFromBuyer ? 'Klient' : 'My'
                                        });
                                    }
                                });

                                completedRequests++;
                                if (completedRequests === messageLinks.length) {
                                    if (messages.length > 0) {
                                        messages.sort((a, b) => {
                                            const dateA = a.timestamp.split(' ')[0].split('-').reverse().join('-');
                                            const dateB = b.timestamp.split(' ')[0].split('-').reverse().join('-');
                                            return new Date(dateB + ' ' + b.timestamp.split(' ')[1]) -
                                                   new Date(dateA + ' ' + a.timestamp.split(' ')[1]);
                                        });
                                        console.log(`Znaleziono ${messages.length} wiadomości.`);
                                        displayMessages(loginElement, messages);
                                    } else {
                                        console.log("Nie znaleziono żadnych wiadomości.");
                                        displayMessages(loginElement, [{
                                            content: "<i>Brak wiadomości.</i>",
                                            timestamp: "",
                                            sender: ""
                                        }]);
                                    }
                                }
                            },
                            onerror: function (error) {
                                console.log("Błąd przy pobieraniu wiadomości:", error);
                                completedRequests++;
                                if (completedRequests === messageLinks.length) {
                                    displayMessages(loginElement, messages.length > 0 ? messages : [{
                                        content: "<i>Błąd pobierania niektórych wiadomości.</i>",
                                        timestamp: "",
                                        sender: ""
                                    }]);
                                }
                            }
                        });
                    });
                } else {
                    console.log("Nie znaleziono żadnych wiadomości.");
                    displayMessages(loginElement, [{
                        content: "<i>Brak wiadomości.</i>",
                        timestamp: "",
                        sender: ""
                    }]);
                }
            },
            onerror: function (error) {
                console.log("Błąd przy wyszukiwaniu wiadomości:", error);
                displayMessages(loginElement, [{
                    content: "<i>Błąd wyszukiwania wiadomości.</i>",
                    timestamp: "",
                    sender: ""
                }]);
            }
        });
    };

    const formatMessage = (message) => {
        const formattedMessage = message
            .replace(/(?:\r\n|\r|\n)/g, '<br>')
            .replace(/\s{2,}/g, ' ')
            .trim();
        return formattedMessage;
    };

    const displayMessages = (loginElement, messages) => {
        console.log(`Wyświetlanie wiadomości...`);
        const container = document.createElement('div');
        container.style = `
            margin-top: 10px;
            padding: 10px;
            background: #f8f9fa;
            border: 1px solid #ced4da;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #333;
        `;

        container.innerHTML = `<strong style="font-size: 16px;">Wiadomości Allegro:</strong>`;

        messages.reverse().forEach((message, index) => {
            const messageContainer = document.createElement('div');
            messageContainer.style = `
                margin-top: 10px;
                padding: 8px;
                background: #ffffff;
                border: 1px solid #ddd;
                border-radius: 4px;
                box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
                word-wrap: break-word;
            `;

            messageContainer.innerHTML = `
                <strong style="color: ${message.sender === 'Klient' ? '#0099ff' : '#2ecc71'};">
                    Wiadomość ${index + 1} (${message.sender}):
                </strong>
                <div style="color: #666; font-size: 12px; margin-top: 3px;">${message.timestamp}</div>
                <div style="margin-top: 5px;">${message.content}</div>
            `;

            container.appendChild(messageContainer);
        });

        loginElement.parentNode.insertBefore(container, loginElement.nextSibling);
    };

    window.addEventListener('load', addMessagesSection);
})();
