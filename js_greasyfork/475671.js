// ==UserScript==
// @name         vuchaev2015
// @license      MIT
// @version      1.0
// @author       k1erry
// @icon         https://i.imgur.com/phojwCv.jpg
// @description  Превращает весь форум в вучаевых
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @namespace    http://example.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475671/vuchaev2015.user.js
// @updateURL https://update.greasyfork.org/scripts/475671/vuchaev2015.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const replacementImageURL = 'https://zelenka.guru/data/avatars/l/302/302690.jpg';

    const newStyle = `
        background: linear-gradient(180deg, #FFFFFF 25%, rgba(0, 0, 0, 0.37) 52.08%), radial-gradient(86.67% 86.67% at 50% 50%, #D9D9D9 0%, #767676 34.38%, #3A3A3A 50.51%, #FBFBFB 50.52%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0px -2px 5px rgba(255, 255, 255, 0.54), 0px 2px 5px rgba(0, 0, 0, 0.86);
    `;

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

        const usernames = document.querySelectorAll('.username');
        usernames.forEach(username => {
            username.style.cssText = newStyle;
        });

        const spansWithInlineStyles = document.querySelectorAll('span[style*="color: #ebebff;"]');
        spansWithInlineStyles.forEach(span => {
            span.style.cssText = newStyle;
        });
    }

    const observer = new MutationObserver(replaceImagesAndStyles);
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    replaceImagesAndStyles();
})();
