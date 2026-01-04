// ==UserScript==
// @name             Kemono Search Button for Patreon
// @name:ru          Kemono Кнопка Поиска Для Patreon
// @namespace        https://github.com/Silfilia
// @version          1.0.0
// @description      Patreon author search button on Kemono
// @description:ru   Кнопка поиска автора Patreon на Kemono
// @author           Silfilia
// @homepageURL      https://github.com/Silfilia/Kemono-Search-Button-for-Patreon-KSBfP-
// @match            https://www.patreon.com/*
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/534945/Kemono%20Search%20Button%20for%20Patreon.user.js
// @updateURL https://update.greasyfork.org/scripts/534945/Kemono%20Search%20Button%20for%20Patreon.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createKemonoButton(authorName) {
        if (document.querySelector('#kemono-search-button')) return;

        // Remove all spaces from the author's name
        const safeName = authorName.replace(/\s+/g, '');

        const button = document.createElement('a');
        button.id = 'kemono-search-button';
        button.textContent = 'Search on Kemono';
        button.href = `https://kemono.su/artists?q=${encodeURIComponent(safeName)}`;
        button.target = '_blank';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.left = '50%';
        button.style.transform = 'translateX(-50%)';
        button.style.padding = '8px 16px';
        button.style.background = 'rgba(24, 24, 24, 0.2)';
        button.style.backdropFilter = 'blur(8px)';
        button.style.borderRadius = '10px';
        button.style.zIndex = '9999';
        button.style.color = '#FFF';
        button.style.textcolor = 'rgb(255, 255, 255)';
        button.style.fontWeight = 'bold';
        button.style.textDecoration = 'none';
        button.style.transition = 'background 0.3s';
        button.onmouseenter = () => button.style.background = 'rgba(24, 24, 24, 0.4)';
        button.onmouseleave = () => button.style.background = 'rgba(24, 24, 24, 0.2)';

        document.body.appendChild(button);
    }

    function getAuthorName() {
        // Standard author's title
        const header = document.querySelector('h1#pageheader-title');
        if (header && header.textContent.trim()) return header.textContent.trim();

        // Alternative selectors
        const altHeader = document.querySelector('div[data-tag="creator-name"]') ||
                          document.querySelector('h1[class*="sc-"]');
        if (altHeader && altHeader.textContent.trim()) return altHeader.textContent.trim();

        return null;
    }

    function waitForAuthorAndInsertButton() {
        const observer = new MutationObserver(() => {
            const authorName = getAuthorName();
            if (authorName) {
                createKemonoButton(authorName);
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    waitForAuthorAndInsertButton();
})();