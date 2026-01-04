// ==UserScript==
// @name         結合画像ダウンロード（アリババ用）
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  画像を順番に結合してダウンロードするボタンを左下に追加。画像と画像の間に点線が入り、区切りを可視化。
// @license      MIT
// @match        https://detail.1688.com/offer/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/519322/%E7%B5%90%E5%90%88%E7%94%BB%E5%83%8F%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89%EF%BC%88%E3%82%A2%E3%83%AA%E3%83%90%E3%83%90%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/519322/%E7%B5%90%E5%90%88%E7%94%BB%E5%83%8F%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89%EF%BC%88%E3%82%A2%E3%83%AA%E3%83%90%E3%83%90%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        #downloadMergedImageButton {
            position: fixed;
            bottom: 10px;
            left: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 5px;
            font-size: 14px;
            font-family: Arial, sans-serif;
            cursor: pointer;
            z-index: 9999;
        }
        #downloadMergedImageButton.processing {
            background-color: #FFA500;
            cursor: not-allowed;
        }
        #downloadMergedImageButton.complete {
            background-color: #008CBA;
        }
        #downloadMergedImageButton:hover:not(.processing) {
            background-color: #45a049;
        }

        .content-detail {
            position: relative;
        }
        .content-detail img {
            display: block;
            margin: 0 auto;
        }
        .content-detail .overlay-line {
            position: absolute;
            left: 0;
            height: 2px;
            background-color: transparent;
            border-top: 2px dotted #FF6347;
            z-index: 8;
        }
    `);

    const button = document.createElement('button');
    button.id = 'downloadMergedImageButton';
    button.textContent = '結合画像 ⬇️';
    document.body.appendChild(button);

    function addOverlayLines() {
        const container = document.querySelector('.content-detail');
        if (!container) return;

        const images = container.querySelectorAll('img');
        for (let i = 0; i < images.length - 1; i++) {
            const currentImage = images[i];
            const nextImage = images[i + 1];

            const gap = nextImage.offsetTop - (currentImage.offsetTop + currentImage.offsetHeight);

            if (gap <= 10) {
                const overlay = document.createElement('div');
                overlay.className = 'overlay-line';
                overlay.style.top = `${currentImage.offsetTop + currentImage.offsetHeight}px`;
                overlay.style.width = `${currentImage.offsetWidth}px`;
                container.appendChild(overlay);
            }
        }
    }

    button.addEventListener('click', async () => {
        if (button.classList.contains('processing')) return;

        button.textContent = '処理中…';
        button.classList.add('processing');

        const images = document.querySelectorAll('.content-detail img');
        if (images.length === 0) {
            button.textContent = '画像が見つかりません';
            button.classList.remove('processing');
            return;
        }

        document.querySelectorAll('.content-detail .overlay-line').forEach((line) => line.remove());

        const loadedImages = [];
        for (const img of images) {
            const imgUrl = img.src || img.dataset.src;
            if (imgUrl) {
                try {
                    const image = await loadImage(imgUrl);
                    loadedImages.push(image);
                } catch (err) {
                    console.error('画像のロードに失敗:', imgUrl, err);
                }
            }
        }

        if (loadedImages.length === 0) {
            button.textContent = 'ロード失敗';
            button.classList.remove('processing');
            return;
        }

        const mergedCanvas = mergeImages(loadedImages);
        if (!mergedCanvas) {
            button.textContent = '結合失敗';
            button.classList.remove('processing');
            return;
        }

        const link = document.createElement('a');
        link.download = 'merged_image.jpg';
        link.href = mergedCanvas.toDataURL('image/jpeg');
        link.click();

        button.textContent = 'ダウンロード完了！';
        button.classList.remove('processing');
        button.classList.add('complete');

        setTimeout(() => {
            button.textContent = '結合画像 ⬇️';
            button.classList.remove('complete');
        }, 3000);
    });

    function loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
            img.src = url;
        });
    }

    function mergeImages(images) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const width = Math.max(...images.map((img) => img.width));
        const totalHeight = images.reduce((sum, img) => sum + img.height, 0);
        canvas.width = width;
        canvas.height = totalHeight;

        let yOffset = 0;
        for (const img of images) {
            context.drawImage(img, 0, yOffset, img.width, img.height);
            yOffset += img.height;
        }

        return canvas;
    }

    function updateOverlayLines() {
        const container = document.querySelector('.content-detail');
        if (!container) return;

        container.querySelectorAll('.overlay-line').forEach((line) => line.remove());

        const images = container.querySelectorAll('img');
        for (let i = 0; i < images.length - 1; i++) {
            const currentImage = images[i];
            const nextImage = images[i + 1];

            const gap = nextImage.offsetTop - (currentImage.offsetTop + currentImage.offsetHeight);

            if (gap <= 10) {
                const overlay = document.createElement('div');
                overlay.className = 'overlay-line';
                overlay.style.top = `${currentImage.offsetTop + currentImage.offsetHeight - container.scrollTop}px`;
                overlay.style.width = `${currentImage.offsetWidth}px`;
                container.appendChild(overlay);
            }
        }
    }

    document.addEventListener('scroll', updateOverlayLines);

    window.addEventListener('load', () => {
        window.setTimeout(() => {
            addOverlayLines();
        }, 500);
    });
})();
