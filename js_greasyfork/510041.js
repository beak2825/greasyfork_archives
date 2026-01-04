// ==UserScript==
// @name         twitch chat w/ BONUS masked
// @namespace    awaw
// @version      1.4
// @description  Открывает чат в отдельном окне и подсвечивает все варианты BONUS
// @author       awaw
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510041/twitch%20chat%20w%20BONUS%20masked.user.js
// @updateURL https://update.greasyfork.org/scripts/510041/twitch%20chat%20w%20BONUS%20masked.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Регулярное выражение для замаскированного слова BONUS
    // Оно допускает любые символы, буквы, цифры, спецсимволы, но ограничивает их количество (до 20 символов между каждой парой букв).
    const bonusPattern = /B.{0,20}O.{0,20}N.{0,20}U.{0,20}S/i;

    function createChatButton() {
        if (document.querySelector("#popout-chat-button")) return;

        const button = document.createElement("button");
        button.id = "popout-chat-button";
        button.textContent = "Popout Chat";
        button.style.position = "absolute";
        button.style.top = "100px";
        button.style.right = "20px";
        button.style.padding = "10px";
        button.style.backgroundColor = "#9146FF";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.style.zIndex = 1000;

        document.body.appendChild(button);

        button.addEventListener("click", function() {
            const currentUrl = window.location.href;
            const channelName = currentUrl.split("/").pop();
            const chatUrl = `https://www.twitch.tv/popout/${channelName}/chat?popout=`;
            window.open(chatUrl, "_blank", "width=400,height=600");
        });
    }

    function showNotification(message) {
        const notification = document.createElement("div");
        notification.textContent = `Найдено сообщение с замаскированным "BONUS": ${message}`;
        notification.style.position = "fixed";
        notification.style.top = "50px";
        notification.style.left = "50%";
        notification.style.transform = "translateX(-50%)";
        notification.style.padding = "15px";
        notification.style.backgroundColor = "#ff4444";
        notification.style.color = "white";
        notification.style.fontSize = "16px";
        notification.style.zIndex = "10000";
        notification.style.borderRadius = "5px";
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 20000);
    }

    function monitorChat() {
        const chatContainer = document.querySelector(".chat-scrollable-area__message-container");
        if (!chatContainer) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        const messageText = node.innerText;

                        // Проверяем на наличие замаскированного слова BONUS
                        if (bonusPattern.test(messageText)) {
                            node.style.backgroundColor = "yellow";
                            node.style.fontWeight = "bold";
                            showNotification(messageText);
                        }
                    }
                });
            });
        });

        observer.observe(chatContainer, { childList: true, subtree: true });
    }

    window.addEventListener("load", function() {
        setTimeout(createChatButton, 3000);
        setTimeout(monitorChat, 5000);
    });
})();
