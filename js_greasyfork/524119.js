// ==UserScript==
// @name         Soundcloudジャケット画像ダウンローダー
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Soundcloudのジャケット画像をダウンロードするやつ
// @author       hitsub
// @match        *://soundcloud.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524119/Soundcloud%E3%82%B8%E3%83%A3%E3%82%B1%E3%83%83%E3%83%88%E7%94%BB%E5%83%8F%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%80%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/524119/Soundcloud%E3%82%B8%E3%83%A3%E3%82%B1%E3%83%83%E3%83%88%E7%94%BB%E5%83%8F%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%80%E3%83%BC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const sanitizeFileName = (title) => {
        return title.replace(/[\\/:*?"<>|]/g, '_').trim();
    };

    const downloadImage = async (url, fileName) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = objectUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            URL.revokeObjectURL(objectUrl);
        } catch (error) {
            console.error('画像のダウンロード中にエラーが発生しました:', error);
            alert('画像のダウンロードに失敗しました。コンソールを確認してください。');
        }
    };

    const findAndDownloadImage = async () => {
        const ogTitleMeta = document.querySelector('meta[property="og:title"]');
        const ogTitle = ogTitleMeta ? sanitizeFileName(ogTitleMeta.content || 'image') : 'image';

        const imageSources = Array.from(document.querySelectorAll('img')).map(img => img.src);
        const metaContents = Array.from(document.querySelectorAll('meta[content]')).map(meta => meta.content);
        const allUrls = [...imageSources, ...metaContents];

        const firstImage = allUrls.find(src => src.includes('sndcdn.com') && (src.endsWith('500x500.jpg') || src.endsWith('500x500.png')));

        if (firstImage) {
            const fileExtension = firstImage.endsWith('500x500.jpg') ? '.jpg' : '.png';
            await downloadImage(firstImage, `${ogTitle}${fileExtension}`);
        } else {
            alert('ジャケット画像が見つかりませんでした。ページをリロードしてもう一度試してください。');
        }
    };

    const waitForElement = (selector, timeout = 10000) => {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`要素 ${selector} が見つかりませんでした。`));
                } else {
                    requestAnimationFrame(checkElement);
                }
            };

            checkElement();
        });
    };

    const addButtonToUserNav = async () => {
        try {
            const userNav = await waitForElement('.header__userNav');

            // 新しいボタンを作成
            const button = document.createElement('a');
            button.textContent = 'ジャケ画保存';
            button.className = 'header__userNavButton header__userNavItem';
            button.style.display = 'inline-flex'; // フレックスボックスを使用
            button.style.alignItems = 'center'; // ボタン内のテキストを垂直中央揃え
            button.style.justifyContent = 'center'; // テキストを水平中央揃え
            button.style.height = `${userNav.offsetHeight}px`; // ヘッダーと同じ高さにする
            button.style.lineHeight = `${userNav.offsetHeight}px`; // テキストの中央揃え
            button.style.padding = '0 10px'; // 横方向の余白を調整
            button.style.backgroundColor = '#eb5105'; // ボタンの背景色
            button.style.color = '#fff'; // ボタンの文字色
            button.style.fontWeight = 'bold'; // 文字を太字に
            button.style.borderRadius = '5px'; // ボタンの角丸
            button.style.cursor = 'pointer';
            button.style.textDecoration = 'none';
            button.style.marginLeft = '10px'; // 他のボタンと間隔を設定

            button.addEventListener('click', findAndDownloadImage);
            userNav.appendChild(button);
        } catch (error) {
            console.error(error.message);
        }
    };



    // ページが読み込まれたら実行
    window.addEventListener('load', addButtonToUserNav);
})();
