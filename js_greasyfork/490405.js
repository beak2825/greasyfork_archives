// ==UserScript==
// @name         FastPic & TurboImageHost & ImageBam & ImageVenue expand image Link Replacer
// @description  Заменяет ссылку страницы просмотра изображения на прямую ссылку изображения
// @match        https://fastpic.org/view/*
// @match        https://fastpic.org/fullview/*
// @match        https://www.turboimagehost.com/*
// @match        https://www.imagebam.com/image/*
// @match        https://imx.to/i/*
// @match        https://www.imagevenue.com/*
// @match        https://imgbox.com/*
// @match        https://prnt.sc/*
// @grant        none
// @version      1.345
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/490405/FastPic%20%20TurboImageHost%20%20ImageBam%20%20ImageVenue%20expand%20image%20Link%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/490405/FastPic%20%20TurboImageHost%20%20ImageBam%20%20ImageVenue%20expand%20image%20Link%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для проверки URL изображения и перенаправления на него
    function checkAndRedirect(imageSrc) {
        // Проверяем, если изображение заканчивается на .ext,
        if (imageSrc && (imageSrc.endsWith('.jpg') || imageSrc.endsWith('.jpeg') || imageSrc.endsWith('.gif') || imageSrc.endsWith('.png') || imageSrc.endsWith('.webp'))) {
            window.location.href = imageSrc;
        }
    }
    
    // Проверяем, находимся ли мы на странице просмотра или fullview fastpic.org
    if (window.location.href.startsWith('https://fastpic.org/view/') || window.location.href.startsWith('https://fastpic.org/fullview/')) {
        var image = document.querySelector('img.image');
        var src = image ? image.getAttribute('src') : null;
        if (src && src.startsWith('https://i')) {
            window.location.href = src;
        }
    }

    // Проверяем, находимся ли мы на странице www.turboimagehost.com
    if (window.location.href.startsWith('https://www.turboimagehost.com/')) {
        var turboImage = document.querySelector('img.uImage');
        var turboSrc = turboImage ? turboImage.getAttribute('src') : null;
        checkAndRedirect(turboSrc);
    }

    // Проверяем, находимся ли мы на странице imagebam.com
    if (window.location.href.startsWith('https://www.imagebam.com/image/')) {
        let continueLink = document.querySelector('#continue a');
        if (continueLink) {
            continueLink.click();
        }

        let mainImage = document.querySelector('.main-image');
        if (mainImage) {
            let src = mainImage.getAttribute('src');
            checkAndRedirect(src);
        }

        let fullImageLink = document.querySelector('a[data-toggle="full"]');
        if (fullImageLink) {
            let fullImageSrc = fullImageLink.href;
            checkAndRedirect(fullImageSrc);
        }
    }

    // Проверяем, находимся ли мы на странице imx.to
if (window.location.href.startsWith('https://imx.to/i/')) {
    const observer = new MutationObserver(() => {
        const anchor = document.querySelector('div[style*="text-align:center;"] > a[href*="/u/i/"]');
        if (anchor && anchor.href) {
            observer.disconnect();
            window.location.href = anchor.href;
        }
    });

    const continueBtn = document.querySelector('#continuetoimage input[type="submit"]');
    if (continueBtn) {
        observer.observe(document.body, { childList: true, subtree: true });
        continueBtn.click();
    } else {
        const anchor = document.querySelector('div[style*="text-align:center;"] > a[href*="/u/i/"]');
        if (anchor && anchor.href) {
            window.location.href = anchor.href;
        }
    }
}

    // Поддержка www.imagevenue.com
    if (window.location.href.startsWith('https://www.imagevenue.com/')) {
        // Находим изображение с классом main-image
        let imageVenueImage = document.querySelector('img#main-image');
        let imageVenueSrc = imageVenueImage ? imageVenueImage.getAttribute('src') : null;
        checkAndRedirect(imageVenueSrc);
    }

    // Проверяем, находимся ли мы на странице imgbox.com
    if (window.location.href.startsWith('https://imgbox.com/')) {
        // Находим изображение с классом image-content и id img
        let imgBoxImage = document.querySelector('img.image-content#img');
        let imgBoxSrc = imgBoxImage ? imgBoxImage.getAttribute('src') : null;
        checkAndRedirect(imgBoxSrc);
    }

    if (window.location.href.startsWith('https://prnt.sc/')) {
        let prntImage = document.querySelector('img.screenshot-image');
        let prntSrc = prntImage ? prntImage.getAttribute('src') : null;
        checkAndRedirect(prntSrc);
    }
})();
