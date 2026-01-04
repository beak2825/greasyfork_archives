// ==UserScript==
// @name         site:で原神wikiに飛ぶ（スマホ対応）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Execute UserScript
// @author       Your Name
// @include      https://gamewith.jp/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531384/site%3A%E3%81%A7%E5%8E%9F%E7%A5%9Ewiki%E3%81%AB%E9%A3%9B%E3%81%B6%EF%BC%88%E3%82%B9%E3%83%9E%E3%83%9B%E5%AF%BE%E5%BF%9C%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/531384/site%3A%E3%81%A7%E5%8E%9F%E7%A5%9Ewiki%E3%81%AB%E9%A3%9B%E3%81%B6%EF%BC%88%E3%82%B9%E3%83%9E%E3%83%9B%E5%AF%BE%E5%BF%9C%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let selectedText = ""; // 選択テキストを保存

    // タップ時にも選択テキストを取得できるようにする
    document.addEventListener("mouseup", () => {
        selectedText = window.getSelection().toString().trim();
    });

    document.addEventListener("touchend", () => {
        selectedText = window.getSelection().toString().trim();
    });

    const button = document.createElement('div');
    button.style.position = 'fixed';
    button.style.top = '15px';
    button.style.left = '150px';
    button.style.width = '40px';
    button.style.height = '40px';
    button.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    button.style.color = 'white';
    button.style.borderRadius = '8px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '10000';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.fontSize = '14px';
    button.innerText = '🔍';

    button.addEventListener('click', () => {
        const siteName = "wikiwiki.jp";
        if (selectedText) {
            const query = encodeURIComponent(`site:${siteName} ${selectedText}`);
            window.open(`https://www.google.com/search?q=${query}`, "_blank");
        } else {
            alert("検索する文字を選択してください");
        }
    });

    document.body.appendChild(button);
})();
