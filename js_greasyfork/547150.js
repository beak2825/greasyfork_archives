// ==UserScript==
// @name            Open in Murglar
// @name:ru         Открыть в Murglar
// @namespace       http://tampermonkey.net/
// @version         1.2
// @description     Adds a button to open the current page (if supported) in Murglar.
// @description:ru  Добавляет кнопку для открытия текущей страницы (если она поддерживается) в Murglar.
// @author          badmannersteam
// @match           *://vk.com/*
// @match           *://m.vk.com/*
// @match           *://vk.ru/*
// @match           *://m.vk.ru/*
// @match           *://music.yandex.ru/*
// @match           *://music.yandex.by/*
// @match           *://music.yandex.ua/*
// @match           *://music.yandex.kz/*
// @match           *://music.yandex.com/*
// @match           *://soundcloud.com/*
// @match           *://m.soundcloud.com/*
// @match           *://www.deezer.com/*
// @match           *://deezer.com/*
// @match           *://zvuk.com/*
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/547150/Open%20in%20Murglar.user.js
// @updateURL https://update.greasyfork.org/scripts/547150/Open%20in%20Murglar.meta.js
// ==/UserScript==

const icon = "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2048%2048'%3E" +
    "%3Crect%20width='48'%20height='48'%20fill='%23fff'/%3E%3Cpath%20fill='%23010101'%20fill-opacity='.06'%20d=" +
    "'M35.527%2048H48V27.711L20.094%200h-.231'/%3E%3Cpath%20fill='%23767676'%20d='M24.871%2015.297h13.086a.86.86" +
    "%200%200%201%20.742.692v1.325a.86.86%200%200%201-.742.69H24.87a.86.86%200%200%201-.742-.69v-1.324a.86.86%200" +
    "%200%201%20.742-.693Zm-4.648%209.379h13.086a.86.86%200%200%201%20.742.692v1.324a.86.86%200%200%201-.742.692" +
    "H20.223a.86.86%200%200%201-.742-.692v-1.325a.86.86%200%200%201%20.742-.691ZM36.258%2031.07h6.281a.64.64%200%200" +
    "%201%20.656.52v.16a.64.64%200%200%201-.656.52h-6.28a.64.64%200%200%201-.656-.52v-.16a.64.64%200%200%201%20.656-" +
    ".52Zm4.375-3.856h1.055a.5.5%200%200%201%20.344.793l-2.094%202.047a.5.5%200%200%201-.691%200l-2.094-2.047a.5.5" +
    "%200%200%201%20.344-.793h.934v-2.102a.5.5%200%200%201%20.52-.52h1.445a.5.5%200%200%201%20.5.52Zm-15.762-7.222" +
    "h13.086a.86.86%200%200%201%20.742.692v1.324a.86.86%200%200%201-.742.692H24.871a.86.86%200%200%201-.742-.692v-" +
    "1.325a.86.86%200%200%201%20.742-.691Z'/%3E%3Cpath%20fill='%231c7074'%20d='M0%200v48h35.527L19.863%200Z'/%3E%3C" +
    "path%20fill='%23fff'%20d='M15.34%2025.047v-8.712a1.04%201.04%200%200%201%201.04-1.039h4.12a1.04%201.04%200%200" +
    "%201%201.04%201.04v1.719a1.04%201.04%200%200%201-1.04%201.04h-2.086a1.04%201.04%200%200%200-1.043%201.04v8.281" +
    "a3.804%203.804%200%200%201-3.805%203.808%203.804%203.804%200%200%201-3.805-3.808%203.804%203.804%200%200%201%20" +
    "3.805-3.804c.641%200%201.242.16%201.773.437Z'/%3E%3C/svg%3E";

(function () {
    'use strict';

    const vk = [/^\/audio/, /^\/music\/playlist/, /^\/music\/album/, /^\/artist/, /^\/id/, /^\/club/];
    const yandex = [/^\/playlists\//, /^\/artist\//, /^\/album\//, /^\/track\//];
    const soundcloud = [/.*/];
    const deezer = [/^.*\/artist\/.*/, /^.*\/album\/.*/, /^.*\/playlist\/.*/, /^.*\/track\/.*/];
    const zvuk = [/^\/track\//, /^\/release\//, /^\/playlist\//, /^\/artist\//];

    const patternsByHost = {
        'vk.com': vk,
        'm.vk.com': vk,
        'vk.ru': vk,
        'm.vk.ru': vk,

        'music.yandex.ru': yandex,
        'music.yandex.by': yandex,
        'music.yandex.ua': yandex,
        'music.yandex.kz': yandex,
        'music.yandex.com': yandex,

        'soundcloud.com': soundcloud,
        'm.soundcloud.com': soundcloud,

        'deezer.com': deezer,
        'www.deezer.com': deezer,

        'zvuk.com': zvuk
    };

    function shouldDisplayButton() {
        const host = location.hostname.toLowerCase();
        const patterns = patternsByHost[host];
        if (!patterns)
            return false;
        return patterns.some(re => re.test(location.pathname));
    }

    const openButton = document.createElement('button');
    Object.assign(openButton.style, {
        position: 'fixed',
        top: '20px',
        right: '120px',
        zIndex: '9999',
        width: '36px',
        height: '36px',
        backgroundImage: `url("${icon}")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer'
    });

    openButton.addEventListener('mouseenter', () => {
        openButton.style.filter = 'brightness(0.8)';
    });
    openButton.addEventListener('mouseleave', () => {
        openButton.style.filter = '';
    });

    openButton.addEventListener('click', () => {
        const currentUrl = window.location.href;
        const targetUrl = `murglar://open?url=${encodeURIComponent(currentUrl)}`;
        console.log(`Attempting to open: ${targetUrl}`);
        window.location.href = targetUrl;
    });

    window.addEventListener('load', () => {
        if (shouldDisplayButton())
            document.body.appendChild(openButton);
    });

    const push = history.pushState;
    history.pushState = function () {
        push.apply(this, arguments);
        if (shouldDisplayButton() && !document.body.contains(openButton))
            document.body.appendChild(openButton);
        else if (!shouldDisplayButton() && document.body.contains(openButton))
            openButton.remove();
    };
    window.addEventListener('popstate', () => {
        if (shouldDisplayButton() && !document.body.contains(openButton))
            document.body.appendChild(openButton);
        else if (!shouldDisplayButton() && document.body.contains(openButton))
            openButton.remove();
    });
})();