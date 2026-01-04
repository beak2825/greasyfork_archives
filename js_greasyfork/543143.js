// ==UserScript==
// @name         NovelAI webp saver
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Adds a WebP save button.
// @author       BNkarrasco
// @match        https://novelai.net/image
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543143/NovelAI%20webp%20saver.user.js
// @updateURL https://update.greasyfork.org/scripts/543143/NovelAI%20webp%20saver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 便利な関数 ---
    const waitForElement = (selector) => {
        return new Promise(resolve => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);
            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    };


    // =================================================================
    // 機能: WebP 保存
    // =================================================================
    function imageToBlob(imageUrl, format = 'image/webp', quality = 0.9) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(blob => {
                    if (blob) resolve(blob);
                    else reject(new Error('Canvas to Blob conversion failed'));
                }, format, quality);
            };
            img.onerror = () => reject(new Error('Image loading failed'));
            img.src = imageUrl;
        });
    }

    function saveBlob(blob, extension) {
        if (!blob) {
             alert('保存データの作成に失敗しました。');
             return;
        }
        const now = new Date();
        const pad = (num) => num.toString().padStart(2, '0');
        const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${timestamp}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // *** FIX: ボタンを監視・再生成する関数 ***
    function ensureWebpButtonExists() {
        const bottomBar = document.querySelector('.display-grid-bottom');
        if (!bottomBar) return; // アクションバーがなければ何もしない

    // 公式の保存ボタン（フロッピーディスクアイコン）を探す
    // HTML構造に合わせて、アイコンのクラス名を更新 
    const officialSaveButtonWrapper = Array.from(bottomBar.querySelectorAll('div.sc-1f65f26d-0.fHITJA')).find(
        div => div.querySelector('div.sc-ab5125b9-50')
    );

        // 公式保存ボタンがあり、かつWebPボタンがまだない場合のみ生成
        if (officialSaveButtonWrapper && !document.getElementById('single-webp-save-btn-wrapper')) {
            const webpButtonWrapper = officialSaveButtonWrapper.cloneNode(true);
            webpButtonWrapper.id = 'single-webp-save-btn-wrapper';
            webpButtonWrapper.style.position = 'relative';

            const webpButton = webpButtonWrapper.querySelector('button');
            webpButton.setAttribute('aria-label', 'WebPで保存');

            const webpLabel = document.createElement('span');
            webpLabel.textContent = 'W';
            Object.assign(webpLabel.style, {
                position: 'absolute', top: '5px', left: '5px', color: 'white',
                fontWeight: 'bold', fontSize: '10px', textShadow: '0 0 3px black, 0 0 3px black',
                pointerEvents: 'none'
            });
            webpButtonWrapper.appendChild(webpLabel);

            webpButton.onclick = (e) => {
                e.stopPropagation();
                const mainImage = document.querySelector('.display-grid-images img');
                if(mainImage && mainImage.src) {
                    imageToBlob(mainImage.src)
                        .then(blob => saveBlob(blob, 'webp'))
                        .catch(error => alert(`WebP保存エラー: ${error.message}`));
                } else {
                    alert('保存対象のメイン画像が見つかりません。');
                }
            };

            officialSaveButtonWrapper.insertAdjacentElement('afterend', webpButtonWrapper);
        }
    }


    // --- 初期化 ---
    waitForElement('.image-gen-main').then((targetNode) => {
        console.log('[NAI Helper] 初期化を開始します (v2.0-lite)');

        const observer = new MutationObserver(ensureWebpButtonExists);
        observer.observe(targetNode, { childList: true, subtree: true });

        setInterval(ensureWebpButtonExists, 2000);

        ensureWebpButtonExists();

        console.log('[NAI Helper] WebP保存機能の監視を開始しました。');
    });

})();