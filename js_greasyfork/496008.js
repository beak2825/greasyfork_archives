// ==UserScript==
// @name         マップファン住所変更
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  マップファンの住所の数字を変換します
// @author       Aoi
// @match        https://mapfan.com/map/spots/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496008/%E3%83%9E%E3%83%83%E3%83%97%E3%83%95%E3%82%A1%E3%83%B3%E4%BD%8F%E6%89%80%E5%A4%89%E6%9B%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/496008/%E3%83%9E%E3%83%83%E3%83%97%E3%83%95%E3%82%A1%E3%83%B3%E4%BD%8F%E6%89%80%E5%A4%89%E6%9B%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // コンテナdivを作成
    let container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '3px'; // 5pxに変更
    container.style.right = '10px';
    container.style.zIndex = 1000;
    container.style.padding = '10px';
    container.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    container.style.borderRadius = '5px';

    // 入力フィールドを作成
    let input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '住所を入力';
    input.style.marginRight = '10px';

    // ペーストボタンを作成
    let pasteButton = document.createElement('button');
    pasteButton.innerText = '貼り付け';
    pasteButton.style.padding = '10px';
    pasteButton.style.backgroundColor = '#007bff';
    pasteButton.style.color = '#fff';
    pasteButton.style.border = 'none';
    pasteButton.style.borderRadius = '5px';
    pasteButton.style.cursor = 'pointer';

    // ボタンを作成
    let button = document.createElement('button');
    button.innerText = 'クリップボードにコピー';
    button.style.padding = '10px';
    button.style.backgroundColor = '#28a745';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // 入力とボタンをコンテナに追加
    container.appendChild(input);
    container.appendChild(pasteButton);
    container.appendChild(button);

    // コンテナをbodyに追加
    document.body.appendChild(container);

    // 貼り付けボタンにクリックイベントを追加
    pasteButton.addEventListener('click', function() {
        navigator.clipboard.readText()
            .then(text => {
                input.value = text;
            })
            .catch(err => console.error('テキストの読み込みに失敗しました', err));
    });

    // ボタンにクリックイベントを追加
    button.addEventListener('click', function() {
        let address = input.value;

        if (address) {
            // 住所の整形
            address = address.replace(/[０-９]/g, function(s) {
                return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
            }); // 全角数字を半角数字に変換
            address = address.replace(/[一二三四五六七八九〇]/g, function(s) {
                return String.fromCharCode(s.charCodeAt(0) - 0x60);
            }); // 漢数字を半角数字に変換
            address = address.replace(/.+市/, ''); // 市も含む左側の住所を削除

            // コピー処理
            navigator.clipboard.writeText(address)
                .then(() => {
                    alert('住所がクリップボードにコピーされました');
                    input.value = ''; // テキスト入力をクリア
                })
                .catch(err => console.error('住所のコピーに失敗しました', err));
        } else {
            alert('住所を入力してください');
        }
    });

    // 全角数字を半角数字に変換する関数
    function convertFullWidthToHalfWidth(str) {
        return str.replace(/[０-９]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
    }

    // 入力フィールドの入力イベントに全角数字を半角数字に変換する処理を追加
    input.addEventListener('input', function() {
        input.value = convertFullWidthToHalfWidth(input.value);
    });
})();
