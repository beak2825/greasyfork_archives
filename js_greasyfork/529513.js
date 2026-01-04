// ==UserScript==
// @name         Twitch Emote Image Resizer
// @name:ja      Twitch スタンプ選択画面のスタンプデカくするヤツ
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace 1.0 with 3.0 in Twitch emote image src attributes and apply custom CSS
// @description:ja Twitchのスタンプ選択画面が小さくて見づらいのでデカくするヤツです
// @author       TOFULIX
// @match        https://www.twitch.tv/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529513/Twitch%20Emote%20Image%20Resizer.user.js
// @updateURL https://update.greasyfork.org/scripts/529513/Twitch%20Emote%20Image%20Resizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // カスタムCSSの追加
    const customCSS = `
.emote-button {
    height: 50px!important;
    width: 50px!important;
}
.emote-button__link {
    height: 50px!important;
    width: 50px!important;
}
.emote-button .emote-button__link img.emote-picker__image,img.emote-picker__emote-image.tw-image {
    width: 50px!important;
    height: 50px!important;
    max-height: unset!important;
}
    `;

    // CSSをページに適用
    const styleElement = document.createElement('style');
    styleElement.textContent = customCSS;
    document.head.appendChild(styleElement);

    // メイン関数: 全てのimg要素を処理
    function updateEmoteImages() {
        const images = document.querySelectorAll('img.emote-picker__image, img.emote-picker__emote-image');

        images.forEach(img => {
            if (img.src && img.src.endsWith('/1.0')) {
                img.src = img.src.replace(/\/1\.0$/, '/3.0');
            }

            // srcsetも更新
            if (img.srcset) {
                img.srcset = img.srcset.replace(/\/1\.0 1\.0x/g, '/3.0 1.0x')
                                      .replace(/\/2\.0 2\.0x/g, '/3.0 2.0x');
            }
        });
    }

    // ページロード時に実行
    updateEmoteImages();

    // ページ内容が動的に変わる可能性があるためMutationObserverを設定
    const observer = new MutationObserver(mutations => {
        // DOM変更を検出したら実行
        updateEmoteImages();
    });

    // bodyの変更を監視（設定によって調整可能）
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();