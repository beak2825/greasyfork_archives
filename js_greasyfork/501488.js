// ==UserScript==
// @name            vk voice message download
// @name:ru         Загрузка голосовых сообщений из ВК
// @namespace       http://tampermonkey.net/
// @version         0.1.0
// @description     Allows you to download voice messages!
// @description:ru  Позволяет скачивать голосовые сообщения из ВК!
// @author          VEGAMETA
// @match           *://vk.com/im*
// @match           *://m.vk.com/mail*
// @icon            data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEyIiBmaWxsPSIjNTE4MUI4Ii8+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTkuODQ2IDE2Ljg2Yy0uNDY3LjMwMy0uODQ2LjA5Ny0uODQ2LS40NVY3LjU4OGMwLS41NTEuMzgtLjc1Mi44NDYtLjQ1bDYuOTEgNC40OGMuMzI0LjIxLjMyNy41NDkgMCAuNzYxbC02LjkxIDQuNDh6Ii8+PC9nPjwvc3ZnPg==
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/501488/vk%20voice%20message%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/501488/vk%20voice%20message%20download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createButton(link) {
        const icon = document.createElement('div');
        icon.style.position = 'absolute';
        icon.style.width = '18px';
        icon.style.height = '18px';
        icon.style.marginTop = '22px';
        icon.style.marginLeft = '2px';
        icon.style.backgroundImage = 'url("data:image/png;base64,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")';
        icon.style.backgroundSize = 'contain';
        icon.style.zIndex = 1;
        icon.addEventListener('click', async () => {
            event.stopPropagation();
            try {
                const response = await fetch(link);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.setAttribute('download', 'voicemessage.mp3'); // задать имя файла для скачивания
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Download failed:', error);
            }
        });
        return icon;
    }

    function processBlocks() {
        const isMobileSite = window.location.hostname.startsWith('m.');
        const messageSelector = isMobileSite ? '.im_msg_audiomsg' : '.im_msg_media_audio_message';

        const blocks = document.querySelectorAll(messageSelector);
        blocks.forEach(block => {
            const vmsg = block.querySelector('.audio-msg-track');
            const existingIcon = block.querySelector('.download-button');
            if (existingIcon) return;
            const link = vmsg.getAttribute('data-mp3');
            if (!link) return;
            const icon = createButton(link);
            icon.classList.add('download-button');
            block.insertBefore(icon, block.firstChild);
        });
    }

    processBlocks();

    const observer = new MutationObserver(processBlocks);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();