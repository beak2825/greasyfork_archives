// ==UserScript==
// @name             Twitter Enlarge the image in the media section
// @name:ja          Twitter メディア欄で画像を拡大するやつ
// @namespace        http://tampermonkey.net/
// @version          1.1.2
// @description      Enlarge the image in the media section to view the entire image
// @description:ja  メディア欄の画像を拡大して全体表示します。
// @author           Nogaccho
// @match            https://twitter.com/*
// @match            https://x.com/*
// @grant            none
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/485931/Twitter%20Enlarge%20the%20image%20in%20the%20media%20section.user.js
// @updateURL https://update.greasyfork.org/scripts/485931/Twitter%20Enlarge%20the%20image%20in%20the%20media%20section.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let previewDiv = null;
    let lastHoveredImage = null;
    let previewImg = null;

    function createPreviewDiv() {
        if (previewDiv === null) {
            previewDiv = document.createElement('div');
            document.body.appendChild(previewDiv);
            previewDiv.style.position = 'fixed';
            previewDiv.style.zIndex = '1000';
            previewDiv.style.pointerEvents = 'none';
            previewDiv.style.display = 'none';
            previewDiv.style.transform = 'translate(-50%, -50%)';
            adjustPreviewDivStyle();
        }
    }

    function adjustPreviewDivStyle() {
        const windowWidth = window.innerWidth;
        if (windowWidth > 1015) {
            previewDiv.style.left = (windowWidth * 0.83) + 'px';
            previewDiv.style.top = '50%';
        } else {
            previewDiv.style.left = '50%';
            previewDiv.style.top = '50%';
        }
    }

    function adjustPreviewImgStyle() {
    if (previewImg) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (windowWidth > 1300) {
            previewImg.style.maxWidth = 'calc(100vw - 970px)';
            previewImg.style.maxHeight = 'calc(100vh - 100px)';
        } else if (windowWidth > 1150) {
            previewImg.style.maxWidth = 'calc(100vw - 860px)';
            previewImg.style.maxHeight = 'calc(100vh - 80px)';
        } else if (windowWidth > 1015) {
            previewImg.style.maxWidth = 'calc(100vw - 750px)';
            previewImg.style.maxHeight = 'calc(100vh - 65px)';
        } else if (windowWidth > 850) {
            previewImg.style.maxWidth = 'calc(100vw - 650px)';
            previewImg.style.maxHeight = 'calc(100vh - 50px)';
        } else {
            previewImg.style.maxWidth = 'calc(100vw - 400px)';
            previewImg.style.maxHeight = 'calc(100vh - 50px)';
        }
    }
}


    function addEventListeners() {
        document.addEventListener('mouseover', onMouseOver);
        document.addEventListener('mouseout', onMouseOut);
        window.addEventListener('resize', onWindowResize);
    }

    function removeEventListeners() {
        document.removeEventListener('mouseover', onMouseOver);
        document.removeEventListener('mouseout', onMouseOut);
        window.removeEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
        adjustPreviewDivStyle();
        adjustPreviewImgStyle();
    }

    function onMouseOver(event) {
        const target = event.target;
        if (target.tagName === 'IMG' && target.src && target.src.includes('twimg.com')) {
            const highResImageUrl = target.src.split('?')[0] + '?format=jpg&name=small';
            const img = new Image();
            img.onload = function() {
                const aspectRatio = img.width / img.height;
                if (aspectRatio < 2.5 || aspectRatio > 3.5) {
                    if (lastHoveredImage !== target) {
                        lastHoveredImage = target;
                        previewImg = document.createElement('img');
                        previewImg.src = highResImageUrl;
                        previewImg.style.objectFit = 'contain';
                        adjustPreviewImgStyle();

                        previewDiv.innerHTML = '';
                        previewDiv.appendChild(previewImg);
                        previewDiv.style.display = 'block';
                    }
                }
            };
            img.src = highResImageUrl;
        }
    }

    function onMouseOut(event) {
        if (!event.relatedTarget || event.relatedTarget.tagName !== 'IMG') {
            previewDiv.style.display = 'none';
            lastHoveredImage = null;
        }
    }

    const observer = new MutationObserver((mutations, obs) => {
        if (window.location.href.includes('/media')) {
            createPreviewDiv();
            addEventListeners();
        } else {
            removeEventListeners();
            if (previewDiv) {
                previewDiv.style.display = 'none';
            }
        }
    });

    observer.observe(document, { childList: true, subtree: true });
})();
