// ==UserScript==
// @name         LZT PIBBLES FOR turb
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Заменяет все картинки на пибблов
// @author       https://lolz.live/matbast0s
// @match        https://lolz.live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540630/LZT%20PIBBLES%20FOR%20turb.user.js
// @updateURL https://update.greasyfork.org/scripts/540630/LZT%20PIBBLES%20FOR%20turb.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const imgurImages = [
        'https://i.imgur.com/WyOkCEA.png',
        'https://i.imgur.com/gBx8SuW.png'
    ];

    function getRandomImg() {
        return imgurImages[Math.floor(Math.random() * imgurImages.length)];
    }

    function replaceAllImages() {
        const imgUrl = getRandomImg();

        document.querySelectorAll('img:not([data-pibbled])').forEach(img => {
            if (
                img.src.includes('nztcdn.com') ||
                img.classList.contains('trophy-icon')
            ) {
                img.src = imgUrl;
                img.setAttribute('data-pibbled', 'true');
            } else if (img.dataset.src && img.dataset.src.includes('nztcdn.com')) {
                img.dataset.src = imgUrl;
                img.setAttribute('data-pibbled', 'true');
            }
        });

        document.querySelectorAll('[style]:not([data-pibbled])').forEach(el => {
            const bg = el.style.backgroundImage;
            if (bg && bg.includes('nztcdn.com')) {
                el.style.backgroundImage = `url("${imgUrl}")`;
                el.setAttribute('data-pibbled', 'true');
            }
        });

        document.querySelectorAll('i.trophy-icon:not([data-pibbled])').forEach(icon => {
            icon.style.backgroundImage = `url("${imgUrl}")`;
            icon.style.backgroundSize = 'contain';
            icon.style.backgroundRepeat = 'no-repeat';
            icon.style.backgroundPosition = 'center';
            icon.innerHTML = '';
            icon.setAttribute('data-pibbled', 'true');
        });

        if (!document.body.hasAttribute('data-pibbled')) {
            document.body.style.backgroundImage = `url("${imgUrl}")`;
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundAttachment = 'fixed';
            document.body.setAttribute('data-pibbled', 'true');
        }
    }
    
    const observer = new MutationObserver(() => {
        replaceAllImages();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    replaceAllImages();
})();
