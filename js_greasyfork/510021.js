// ==UserScript==
// @name         Чат в новом окне
// @version      1.2
// @description  открывает чат стрима в новом окне
// @author       awaw
// @match        https://www.twitch.tv/*
// @grant        none
// @license      MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/510021/%D0%A7%D0%B0%D1%82%20%D0%B2%20%D0%BD%D0%BE%D0%B2%D0%BE%D0%BC%20%D0%BE%D0%BA%D0%BD%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/510021/%D0%A7%D0%B0%D1%82%20%D0%B2%20%D0%BD%D0%BE%D0%B2%D0%BE%D0%BC%20%D0%BE%D0%BA%D0%BD%D0%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

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

    window.addEventListener("load", function() {
        setTimeout(createChatButton, 3000);
    });
})();