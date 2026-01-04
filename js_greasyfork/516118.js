// ==UserScript==
// @name         LZTCopyLink
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  1 секунда для копирование  
// @author       HashBrute
// @match        https://lolz.live/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/516118/LZTCopyLink.user.js
// @updateURL https://update.greasyfork.org/scripts/516118/LZTCopyLink.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCopyLinkButtonToFirstPost() {
        const firstPost = document.querySelector('li.message.firstPost');
        if (!firstPost || firstPost.querySelector('.copyLinkButton')) return;

        const postId = firstPost.id;
        const authorName = firstPost.getAttribute('data-author');

        const copyLinkButton = document.createElement('a');
        copyLinkButton.setAttribute('role', 'button');
        copyLinkButton.classList.add('item', 'control', 'copyLinkButton');
        copyLinkButton.title = `Скопировать ссылку на пост ${authorName}`;
        copyLinkButton.setAttribute('data-username', authorName);

        const icon = document.createElement('i');
        icon.className = 'fa fa-wheelchair';
        icon.style.fontSize = '20px';
        icon.style.color = '#8C8C8C';
        icon.style.marginRight = '5px';

        copyLinkButton.appendChild(icon);

        copyLinkButton.addEventListener('click', () => {
            const link = `${window.location.origin}${window.location.pathname}#${postId}`;
            GM_setClipboard(link);

            if (typeof XenForo !== 'undefined' && typeof XenForo.alert === 'function') {
                XenForo.alert('Ссылка скопирована в буфер обмена!', '', 5000);
            }
        });

        const publicControls = firstPost.querySelector('.publicControls');
        if (publicControls) {
            publicControls.appendChild(copyLinkButton);
        }
    }

    const observer = new MutationObserver(() => {
        addCopyLinkButtonToFirstPost();
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
