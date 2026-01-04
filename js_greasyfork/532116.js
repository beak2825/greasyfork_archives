// ==UserScript==
// @name         Lolz.live Icon Replacer / Deleter
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Удаляет иконки или заменяет их на кастомные с настройками
// @author       eretly
// @match        https://lolz.live/*
// @match        https://lzt.market/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532116/Lolzlive%20Icon%20Replacer%20%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/532116/Lolzlive%20Icon%20Replacer%20%20Deleter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // НАСТРОЙКИ
    const YOUR_IMAGE_URL = "https://cspromogame.ru//storage/upload_images/avatars/1309.jpg";
    const OTHERS_IMAGE_URL = "https://avatars.dzeninfra.ru/get-zen_doc/2419806/pub_62405301471f227ab529eff5_6240557718cfc01044432b7c/scale_1200";
    const YOUR_USERNAME = "KusuriYakuzen";
    const REPLACE_MODE = 1; // 1=у себя и у других, 2=только у себя, 3=все кроме себя
    const USE_DIFFERENT_ICON_FOR_OTHERS = true; // true - заменяет иконку у других на OTHERS_IMAGE_URL
    const ROUNDED_STYLE = false; // true - круглые иконки, false - квадратные
    const REMOVE_DEFAULT_ICONS = false; // true - удаляет иконки полностью

    const IMG_STYLE = `
        width: 16px;
        height: 16px;
        vertical-align: middle;
        margin-left: 3px;
        display: inline !important;
        object-fit: cover;
        ${ROUNDED_STYLE ? 'border-radius: 50%;' : ''}
    `;

    const getUsername = (el) => {
        const usernameElement = el.closest('[class*="username"], .message-userDetails, .memberHeader');
        if (!usernameElement) return null;

        const span = usernameElement.querySelector('span:not([class*="icon"]):not([class*="arrow"])');
        if (span) return span.textContent.trim();

        const link = usernameElement.querySelector('a[href*="/members/"]');
        return link ? link.textContent.trim() : null;
    };

    const processIcons = () => {
        document.querySelectorAll('.uniqUsernameIcon, .uniqUsernameIcon--custom').forEach(el => {
            if (el.dataset.processed) return;

            const username = getUsername(el);
            const isCurrentUser = username && username.includes(YOUR_USERNAME);
            let shouldReplace = false;
            let imageUrl = YOUR_IMAGE_URL;

            switch (REPLACE_MODE) {
                case 1:
                    shouldReplace = true;
                    if (USE_DIFFERENT_ICON_FOR_OTHERS && !isCurrentUser) imageUrl = OTHERS_IMAGE_URL;
                    break;
                case 2:
                    shouldReplace = isCurrentUser;
                    break;
                case 3:
                    shouldReplace = !isCurrentUser;
                    if (USE_DIFFERENT_ICON_FOR_OTHERS) imageUrl = OTHERS_IMAGE_URL;
                    break;
            }

            if (shouldReplace) {
                if (REMOVE_DEFAULT_ICONS) {
                    el.remove();
                } else {
                    const img = new Image();
                    img.src = imageUrl;
                    img.style = IMG_STYLE;
                    img.alt = "";
                    el.parentNode.insertBefore(img, el);
                    el.remove();
                }
            }

            el.dataset.processed = "true";
        });
    };

    processIcons();

    const observer = new MutationObserver(processIcons);
    observer.observe(document, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        setTimeout(processIcons, 1000);
        setTimeout(processIcons, 3000);
    });
})();
