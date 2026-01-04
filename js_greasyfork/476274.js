// ==UserScript==
// @name         СУЕТА
// @license      MIT
// @version      1.0
// @author       k1erry
// @icon         https://lztcdn.com/files/310336b3-c10e-4ad1-8fdf-0bbe73835ca1.webp
// @description  Превращает весь форум в суету
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @namespace    http://example.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476274/%D0%A1%D0%A3%D0%95%D0%A2%D0%90.user.js
// @updateURL https://update.greasyfork.org/scripts/476274/%D0%A1%D0%A3%D0%95%D0%A2%D0%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const replacementImageURL = 'https://lztcdn.com/files/310336b3-c10e-4ad1-8fdf-0bbe73835ca1.webp';

    function replaceImagesAndStyles() {
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            img.src = replacementImageURL;
        });

        const avatars = document.querySelectorAll('.avatar');
        avatars.forEach(avatar => {
            const span = avatar.querySelector('.img');
            if (span) {
                span.style.backgroundImage = `url('${replacementImageURL}')`;
            }

            const img = avatar.querySelector('img');
            if (img) {
                img.src = replacementImageURL;
            }
        });

        const sidebarImages = document.querySelectorAll('img.sidebarUserAvatar');
        sidebarImages.forEach(img => {
            img.src = replacementImageURL;
        });
    }

    const observer = new MutationObserver(replaceImagesAndStyles);
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    replaceImagesAndStyles();
})();
