// ==UserScript==
// @name         画像一覧&ダウンロード
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  archive.todayから画像を取得し一覧の表示とダウンロードボタンを表示します。
// @author       あるぱか
// @match        https://archive.md/*
// @exclude      https://archive.md/
// @exclude      https://archive.md/*/
// @exclude      https://archive.md/*/*
// @icon         https://archive.md/apple-touch-icon-144x144.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528702/%E7%94%BB%E5%83%8F%E4%B8%80%E8%A6%A7%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528702/%E7%94%BB%E5%83%8F%E4%B8%80%E8%A6%A7%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 要素の作成と追加
    function displayImageList(imageUrls) {
        // 背景の半透明黒を作成
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'none';
        document.body.appendChild(overlay);

        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '50px';
        container.style.right = '80px';
        container.style.bottom = '50px';
        container.style.left = '80px';
        container.style.backgroundColor = 'white';
        container.style.border = '1px solid black';
        container.style.padding = '10px';
        container.style.zIndex = '10000';
        container.style.overflowY = 'auto';
        container.style.overflowX = 'hidden';
        container.style.display = 'none'; // 最初は表示しない

        const minimizeButton = document.createElement('button');
        minimizeButton.innerText = '×';
        minimizeButton.style.position = 'sticky';
        minimizeButton.style.top = '10px';
        minimizeButton.style.right = '10px';
        minimizeButton.style.zIndex = '10001';
        minimizeButton.style.marginLeft = '98%';
        minimizeButton.style.backgroundColor = '#c04000';
        minimizeButton.style.cursor = 'pointer';
        container.appendChild(minimizeButton);

        const title = document.createElement('h3');
        title.innerText = '画像一覧';
        title.style.textAlign = 'center';
        container.appendChild(title);

        const showButton = document.createElement('button');
        showButton.innerText = '画像一覧表示';
        showButton.style.position = 'fixed';
        showButton.style.top = '10px';
        showButton.style.right = '10px';
        showButton.style.zIndex = '10001';
        showButton.style.cursor = 'pointer';
        showButton.onclick = () => {
            container.style.display = 'block';
            overlay.style.display = 'block';
            showButton.style.display = 'none';
            document.body.style.overflow = 'hidden'; // スクロール無効
        };
        document.body.appendChild(showButton);

        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
        grid.style.gap = '10px';
        container.appendChild(grid);

        imageUrls.forEach(url => {
            const imgContainer = document.createElement('div');
            imgContainer.style.textAlign = 'center';
            imgContainer.style.display = 'flex';
            imgContainer.style.flexDirection = 'column';
            imgContainer.style.alignItems = 'center';
            imgContainer.style.justifyContent = 'space-between';
            imgContainer.style.height = '400px';
            imgContainer.style.marginBottom = '50px';

            const imgWrapper = document.createElement('div');
            imgWrapper.style.flexGrow = '1';
            imgWrapper.style.display = 'flex';
            imgWrapper.style.alignItems = 'center';
            imgWrapper.style.justifyContent = 'center';
            imgWrapper.style.maxHeight = 'calc(100% - 60px)';

            const img = document.createElement('img');
            img.src = url;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            img.style.cursor = 'pointer';
            img.onclick = () => {
                window.open(url, '_blank');
            };

            const saveButton = document.createElement('button');
            saveButton.innerText = '画像を保存';
            saveButton.style.padding = '10px 20px';
            saveButton.style.fontSize = '16px';
            saveButton.style.height = '50px';
            saveButton.style.marginTop = '10px';
            saveButton.style.cursor = 'pointer';
            saveButton.onclick = () => {
                const a = document.createElement('a');
                a.href = url;
                a.download = url.split('/').pop();
                a.click();
            };

            imgWrapper.appendChild(img);
            imgContainer.appendChild(imgWrapper);
            imgContainer.appendChild(saveButton);
            grid.appendChild(imgContainer);
        });

        document.body.appendChild(container);

        minimizeButton.onclick = () => {
            if (container.style.display === 'none') {
                container.style.display = 'block';
                overlay.style.display = 'block';
                minimizeButton.innerText = '縮小';
                document.body.style.overflow = 'hidden'; // スクロール無効
            } else {
                container.style.display = 'none';
                overlay.style.display = 'none';
                showButton.style.display = 'block';
                document.body.style.overflow = 'auto'; // スクロール有効
            }
        };
    }

    // 要素から画像URL取得
    function extractImageUrls() {
        const targetDiv = document.querySelector('#CONTENT > div.html1');
        if (!targetDiv) {
            return [];
        }

        const imageUrls = new Set();
        const imgs = targetDiv.querySelectorAll('img'); // img:not([alt])
        const anchors = targetDiv.querySelectorAll('a');

        imgs.forEach(img => {
            if (img.src && !img.src.endsWith('.svg') && img.src.startsWith('https://archive.md/') && !imageUrls.has(img.src)) {
                imageUrls.add(img.src);
            }
        });

        anchors.forEach(a => {
            if (a.href && !a.href.endsWith('.svg') && a.href.startsWith('https://archive.md/') && (a.href.endsWith('.jpg') || a.href.endsWith('.jpeg') || a.href.endsWith('.png') || a.href.endsWith('.gif') || a.href.endsWith('.mp4')) && !imageUrls.has(a.href)) {
                imageUrls.add(a.href);
            }
        });

        return Array.from(imageUrls);
    }

    function main() {
        const imageUrls = extractImageUrls();
        if (imageUrls.length > 0) {
            displayImageList(imageUrls);
        }
    }

    // 画面読み込み時に作動
    window.addEventListener('load', main);
})();