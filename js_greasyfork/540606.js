// ==UserScript==
// @name         Twitch Chat Font - Comic Sans MS
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Меняет шрифт чата Twitch на Comic Sans MS для чистого и читаемого вида чата.
// @author       ChatGPT
// @match        https://www.twitch.tv/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/540606/Twitch%20Chat%20Font%20-%20Comic%20Sans%20MS.user.js
// @updateURL https://update.greasyfork.org/scripts/540606/Twitch%20Chat%20Font%20-%20Comic%20Sans%20MS.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Подключаем Inter с Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const css = `
        .chat-line__message,
        .text-fragment,
        .chat-author__display-name,
        .chat-line__username,
        .chat-line__message--emote {
            font-family: "Comic Sans MS", cursive, sans-serif;
            font-weight: 500 !important;
            font-size: 14px !important;
            line-height: 1.5 !important;
            letter-spacing: 0 !important;
        }
    `;

    function addStyle() {
        if (typeof GM_addStyle !== "undefined") {
            GM_addStyle(css);
        } else {
            const style = document.createElement("style");
            style.textContent = css;
            document.head.appendChild(style);
        }
    }

    // Следим за появлением чата и применяем стиль
    const observer = new MutationObserver(() => {
        if (document.querySelector('.chat-line__message')) {
            addStyle();
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
