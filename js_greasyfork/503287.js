// ==UserScript==
// @name         ニコニココメント透過度チェンジャー
// @namespace    torokesou
// @version      1.2
// @description  ニコニコ動画のコメントの透過度を1%から100%まで細かく調整できます。
// @author       torokesou
// @icon         https://small.fileditchstuff.me/s13/EOkUlnplWyDyVhbloKCe.png
// @match        *://www.nicovideo.jp/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503287/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E9%80%8F%E9%81%8E%E5%BA%A6%E3%83%81%E3%82%A7%E3%83%B3%E3%82%B8%E3%83%A3%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/503287/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E9%80%8F%E9%81%8E%E5%BA%A6%E3%83%81%E3%82%A7%E3%83%B3%E3%82%B8%E3%83%A3%E3%83%BC.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2024 torokesou

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    const STORAGE_KEY = 'commentOpacity';

    // 透過度を設定する関数
    function setCommentOpacity(opacity) {
        opacity = Math.max(0.01, Math.min(opacity, 1));

        const comments = document.querySelectorAll('div[data-name="comment"]');
        comments.forEach(comment => {
            comment.style.opacity = opacity;
        });
    }

    // ローカルストレージに保存された透過度を取得して適用する関数
    function applySavedOpacity() {
        const savedOpacity = localStorage.getItem(STORAGE_KEY);
        if (savedOpacity !== null) {
            setCommentOpacity(parseFloat(savedOpacity));
        }
    }

    // ポップアップウィンドウを表示し、透過度を設定して保存する関数
    function showOpacityPopup() {
        const savedOpacity = localStorage.getItem(STORAGE_KEY) ? localStorage.getItem(STORAGE_KEY) * 100 : 100;

        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = '#333';
        popup.style.color = '#fff';
        popup.style.padding = '20px';
        popup.style.borderRadius = '10px';
        popup.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.5)';
        popup.style.zIndex = 10000;
        popup.style.width = '300px';
        popup.style.fontFamily = 'Arial, sans-serif';

        const title = document.createElement('h2');
        title.innerText = 'コメント透過度設定';
        title.style.marginBottom = '15px';
        title.style.fontSize = '18px';
        title.style.color = '#0099FF'; // タイトルの色を#0099FFに変更
        popup.appendChild(title);

        const label = document.createElement('label');
        label.innerText = '透過度（1% - 100%）:';
        label.style.display = 'block';
        label.style.marginBottom = '10px';
        label.style.fontSize = '14px';
        popup.appendChild(label);

        const sliderContainer = document.createElement('div');
        sliderContainer.style.display = 'flex';
        sliderContainer.style.alignItems = 'center';

        const input = document.createElement('input');
        input.type = 'number';
        input.min = 1;
        input.max = 100;
        input.value = savedOpacity;
        input.style.flex = '1';
        input.style.marginRight = '10px';
        input.style.padding = '5px';
        input.style.fontSize = '14px';
        input.style.borderRadius = '5px';
        input.style.border = '1px solid #555';
        input.style.backgroundColor = '#444';
        input.style.color = '#fff';
        popup.appendChild(input);

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 1;
        slider.max = 100;
        slider.value = savedOpacity;
        slider.style.flex = '3';
        slider.style.cursor = 'pointer';
        slider.oninput = () => {
            input.value = slider.value;
            const opacityValue = parseFloat(slider.value) / 100;
            setCommentOpacity(opacityValue); // スライダーを動かすたびにリアルタイムで透過度を適用
        };
        input.oninput = () => {
            slider.value = input.value;
            const opacityValue = parseFloat(input.value) / 100;
            setCommentOpacity(opacityValue); // 数値入力でもリアルタイムに透過度を適用
        };
        sliderContainer.appendChild(input);
        sliderContainer.appendChild(slider);
        popup.appendChild(sliderContainer);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.marginTop = '20px';

        const button = document.createElement('button');
        button.innerText = 'OK'; // ボタンのテキストを「OK」に変更
        button.style.flex = '1';
        button.style.padding = '10px';
        button.style.borderRadius = '5px';
        button.style.border = 'none';
        button.style.backgroundColor = '#0099FF'; // 設定ボタンの色を#0099FFに変更
        button.style.color = '#fff';
        button.style.fontSize = '14px';
        button.style.cursor = 'pointer';
        button.onclick = () => {
            const opacityValue = parseFloat(input.value) / 100;
            if (!isNaN(opacityValue)) {
                localStorage.setItem(STORAGE_KEY, opacityValue);  // ローカルストレージに保存
                document.body.removeChild(popup);
            } else {
                alert("無効な値です。1から100の間で入力してください。");
            }
        };
        buttonContainer.appendChild(button);

        const closeButton = document.createElement('button');
        closeButton.innerText = 'キャンセル';
        closeButton.style.flex = '1';
        closeButton.style.padding = '10px';
        closeButton.style.marginLeft = '10px';
        closeButton.style.borderRadius = '5px';
        closeButton.style.border = 'none';
        closeButton.style.backgroundColor = '#555';
        closeButton.style.color = '#fff';
        closeButton.style.fontSize = '14px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => {
            document.body.removeChild(popup);
        };
        buttonContainer.appendChild(closeButton);

        popup.appendChild(buttonContainer);
        document.body.appendChild(popup);
    }

    // ページの完全な読み込みを待ってから透過度を適用
    window.addEventListener('load', () => {
        setTimeout(applySavedOpacity, 200);   // 200ms後に適用
        setTimeout(applySavedOpacity, 600);   // 600ms後に再適用
        setTimeout(applySavedOpacity, 1200);  // 1200ms後に再適用
        setTimeout(applySavedOpacity, 3000);  // 3000ms後に再適用
        setTimeout(applySavedOpacity, 5000);  // 5000ms後に再適用
    });

    // URLの変更を監視して透過度を再適用
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            setTimeout(applySavedOpacity, 200);   // 200ms後に適用
            setTimeout(applySavedOpacity, 600);   // 600ms後に再適用
            setTimeout(applySavedOpacity, 1200);  // 1200ms後に再適用
            setTimeout(applySavedOpacity, 3000);  // 3000ms後に再適用
            setTimeout(applySavedOpacity, 5000);  // 5000ms後に再適用
        }
    }).observe(document, {subtree: true, childList: true});

    // メニューコマンドに透過度調整オプションを追加
    GM_registerMenuCommand("コメントの透過度を設定", showOpacityPopup);

})();
