// ==UserScript==
// @name             View the entire image on Twitter
// @name:ja          Twitter 縦長画像Previewerやつ
// @namespace        http://tampermonkey.net/
// @version          1.2.3
// @description      Display the entire vertical image that would otherwise be cropped in the preview
// @description:ja   Twitterでプレビューではトリミングされてしまう縦長の画像を拡大して表示させます
// @author           Nogaccho
// @match            https://twitter.com/*
// @match            https://x.com/*
// @grant            none
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/485891/View%20the%20entire%20image%20on%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/485891/View%20the%20entire%20image%20on%20Twitter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isMediaUrl = () => {
        return /https:\/\/twitter\.com\/.*\/media/.test(window.location.href);
    };

    const previewImage = (imgSrc) => {
        const largeImageUrl = imgSrc.split('?')[0] + '?format=jpg&name=medium';

        const previewDiv = document.createElement('div');
        previewDiv.style.position = 'fixed';
        previewDiv.style.top = '10px';
        previewDiv.style.bottom = '10px';
        previewDiv.style.left = `calc(50%)`;
        previewDiv.style.right = '10px';
        previewDiv.style.zIndex = '9999';
        previewDiv.style.pointerEvents = 'none';
        previewDiv.style.backgroundImage = `url(${largeImageUrl})`;
        previewDiv.style.backgroundSize = 'contain';
        previewDiv.style.backgroundRepeat = 'no-repeat';
        previewDiv.style.backgroundPosition = 'center';
        document.body.appendChild(previewDiv);

        return previewDiv;
    };

    const isTallImage = (img) => {
        return img.naturalHeight / img.naturalWidth > 4 / 3;
    };

    let currentPreview = null;

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (isMediaUrl()) {
                // URLがhttps://twitter.com/*/mediaの場合、機能を無効化
                if (currentPreview) {
                    currentPreview.remove();
                    currentPreview = null;
                }
                observer.disconnect();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('mouseover', (e) => {
        if (!isMediaUrl() && e.target.tagName === 'IMG' && isTallImage(e.target) && !currentPreview) {
            currentPreview = previewImage(e.target.src);
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (!isMediaUrl() && e.target.tagName === 'IMG' && currentPreview) {
            currentPreview.remove();
            currentPreview = null;
        }
    });
})();
