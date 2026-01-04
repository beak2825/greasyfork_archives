// ==UserScript==
// @name         anilib.me → v1.animelib.org Redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Автоматически перенаправляет все клики по ссылкам с anilib.me на v1.animelib.org с сохранением пути.
// @author       Jango_Bimba
// @match        *://*/*
// @exclude      *://v1.animelib.org/*
// @icon         https://v1.animelib.org/static/images/logo/al/favicon.ico?188e0f6980d07cdc3b0b838e08cdc5ca
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544153/anilibme%20%E2%86%92%20v1animeliborg%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/544153/anilibme%20%E2%86%92%20v1animeliborg%20Redirect.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SOURCE_DOMAINS = ['anilib.me', 'www.anilib.me'];
    const TARGET_DOMAIN = 'https://v1.animelib.org';

    function handleMouseDown(e) {
        if (e.button !== 0 && e.button !== 1) return;

        const link = e.target.closest('a');
        if (!link || !link.href) return;

        try {
            const url = new URL(link.href);

            if (SOURCE_DOMAINS.includes(url.hostname)) {
                const newUrl = TARGET_DOMAIN + url.pathname + url.search + url.hash;

                if (e.button === 1) {
                    e.preventDefault();
                    window.open(newUrl, '_blank');
                }

                if (e.button === 0) {
                    e.preventDefault();
                    window.location.href = newUrl;
                }
            }
        } catch (err) {
            console.warn('Не удалось обработать URL:', link.href);
        }
    }

    document.addEventListener('mousedown', handleMouseDown, true);

    window.addEventListener('load', () => {
        document.addEventListener('mousedown', handleMouseDown, true);
    }, { once: true });
})();