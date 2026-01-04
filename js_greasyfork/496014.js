// ==UserScript==
// @name         Waze住所入力支援
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Wazeマップエディターにテキスト入力フィールドとボタンを追加し、住所をクリップボードに貼り付けます
// @author       Aoi
// @match        https://*.waze.com/ja/editor*
// @grant        none
// @icon         https://pngimg.com/uploads/waze/waze_PNG21.png
// @downloadURL https://update.greasyfork.org/scripts/496014/Waze%E4%BD%8F%E6%89%80%E5%85%A5%E5%8A%9B%E6%94%AF%E6%8F%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/496014/Waze%E4%BD%8F%E6%89%80%E5%85%A5%E5%8A%9B%E6%94%AF%E6%8F%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 都道府県のリスト
    const prefectures = [
        "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
        "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
        "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
        "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
        "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
        "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
        "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
    ];

    // 市区町村の一般的なサフィックスリスト
    const suffixes = ["市", "区", "町", "村", "郡", "町", "村"];

    // ボタンの高さと幅を指定する変数
    const buttonHeight = '30px';
    const buttonWidth = '60px';

    // コンテナdivを作成
    let container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.zIndex = 1000;
    container.style.padding = '0';
    container.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    container.style.borderRadius = '5px';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.overflow = 'hidden';
    container.style.height = `calc(${buttonHeight} + 10px)`; // 固定高さを指定
    container.style.width = 'auto'; // 必要に応じて調整

    // ローカルストレージから位置を取得
    const storedPosition = localStorage.getItem('buttonPosition');
    if (storedPosition) {
        const { left, top } = JSON.parse(storedPosition);
        container.style.left = left;
        container.style.top = top;
    } else {
        container.style.left = '41%';
        container.style.bottom = '21px';
    }

    // ローカルストレージからサイズを取得
    const storedSize = localStorage.getItem('buttonSize');
    if (storedSize) {
        const { width, height } = JSON.parse(storedSize);
        container.style.width = width;
        container.style.height = height;
    }

    // ページ読み込み時に保存された位置とサイズを復元する
    window.addEventListener('load', function() {
        const storedPosition = localStorage.getItem('buttonPosition');
        const storedSize = localStorage.getItem('buttonSize');

        if (storedPosition) {
            const { left, top } = JSON.parse(storedPosition);
            container.style.left = left;
            container.style.top = top;
        }

        if (storedSize) {
            const { width, height } = JSON.parse(storedSize);
            container.style.width = width;
            container.style.height = height;
        }
    });

    // ハンドルを作成
    let handle = document.createElement('div');
    handle.style.width = '100%';
    handle.style.height = '15px';
    handle.style.backgroundColor = '#87CEEB'; // 空色に変更
    handle.style.color = '#fff';
    handle.style.cursor = 'move';
    handle.style.display = 'flex';
    handle.style.alignItems = 'center';
    handle.style.justifyContent = 'center';
    handle.innerText = 'Move';

    // 入力フィールドとボタン用のラッパーを作成
    let inputWrapper = document.createElement('div');
    inputWrapper.style.display = 'flex';
    inputWrapper.style.alignItems = 'center';
    inputWrapper.style.width = '100%';
    inputWrapper.style.height = '100%'; // 固定高さを指定

    // 入力フィールドを作成
    let input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '住所を入力';
    input.style.margin = '0';
    input.style.padding = '5px';
    input.style.flex = '1';
    input.style.height = buttonHeight;
    input.style.lineHeight = buttonHeight;
    input.style.verticalAlign = 'middle';

    // ペーストボタンを作成
    let pasteButton = document.createElement('button');
    pasteButton.innerText = 'Paste';
    pasteButton.style.padding = '5px';
    pasteButton.style.backgroundColor = '#007bff';
    pasteButton.style.color = '#fff';
    pasteButton.style.border = 'none';
    pasteButton.style.borderRadius = '0';
    pasteButton.style.cursor = 'pointer';
    pasteButton.style.margin = '0';
    pasteButton.style.height = buttonHeight;
    pasteButton.style.width = buttonWidth;
    pasteButton.style.display = 'flex';
    pasteButton.style.alignItems = 'center';
    pasteButton.style.justifyContent = 'center';
    pasteButton.style.lineHeight = buttonHeight;
    pasteButton.style.verticalAlign = 'middle';

    // クリップボードボタンを作成
    let button = document.createElement('button');
    button.innerText = 'Change';
    button.style.padding = '5px';
    button.style.backgroundColor = '#28a745';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '0 5px 5px 0';
    button.style.cursor = 'pointer';
    button.style.margin = '0';
    button.style.height = buttonHeight;
    button.style.width = buttonWidth;
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.lineHeight = buttonHeight;
    button.style.verticalAlign = 'middle';

    // リサイズハンドルを作成
    let resizeHandle = document.createElement('div');
    resizeHandle.style.width = '10px';
    resizeHandle.style.height = '10px';
    resizeHandle.style.backgroundColor = '#87CEEB';
    resizeHandle.style.cursor = 'nwse-resize';
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.right = '0';
    resizeHandle.style.bottom = '0';

    // 入力フィールドとボタンをラッパーに追加
    inputWrapper.appendChild(input);
    inputWrapper.appendChild(pasteButton);
    inputWrapper.appendChild(button);

    // コンテナにハンドルとラッパーを追加
    container.appendChild(handle);
    container.appendChild(inputWrapper);
    container.appendChild(resizeHandle);

    // コンテナをbodyに追加
    document.body.appendChild(container);

    // ドラッグ用の変数
    let isDragging = false;
    let initialX, initialY;
    let offsetX, offsetY;

    // マウスダウンイベント
    handle.addEventListener('mousedown', function(e) {
        isDragging = true;
        initialX = e.clientX;
        initialY = e.clientY;
        offsetX = container.offsetLeft;
        offsetY = container.offsetTop;
    });

    // マウスムーブイベント
    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            let dx = e.clientX - initialX;
            let dy = e.clientY - initialY;
            container.style.left = offsetX + dx + 'px';
            container.style.top = offsetY + dy + 'px';
        }
    });

    // マウスアップイベント
    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;

            // 位置をローカルストレージに保存
            localStorage.setItem('buttonPosition', JSON.stringify({
                left: container.style.left,
                top: container.style.top
            }));
        }
    });

    // リサイズ用の変数
    let isResizing = false;
    let initialWidth, initialHeight;

    // リサイズハンドルのマウスダウンイベント
    resizeHandle.addEventListener('mousedown', function(e) {
        isResizing = true;
        initialX = e.clientX;
        initialY = e.clientY;
        initialWidth = container.offsetWidth;
        initialHeight = container.offsetHeight;
        e.preventDefault(); // テキスト選択を防ぐ
    });

    // リサイズ時のマウスムーブイベント
    document.addEventListener('mousemove', function(e) {
        if (isResizing) {
            let dx = e.clientX - initialX;
            let dy = e.clientY - initialY;
            container.style.width = initialWidth + dx + 'px';
            container.style.height = initialHeight + dy + 'px';
        }
    });

    // リサイズ終了時のマウスアップイベント
    document.addEventListener('mouseup', function() {
        if (isResizing) {
            isResizing = false;

            // サイズをローカルストレージに保存
            localStorage.setItem('buttonSize', JSON.stringify({
                width: container.style.width,
                height: container.style.height
            }));
        }
    });

    // 全角数字を半角数字に変換する関数
    function toHalfWidth(str) {
        return str.replace(/[０-９]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
    }

    // 住所処理ロジック
    button.addEventListener('click', async function() {
        let address = input.value;

        if (address) {
            // 全角数字を半角数字に変換
            address = toHalfWidth(address);

            // 住所から都道府県を削除
            for (let pref of prefectures) {
                if (address.startsWith(pref)) {
                    address = address.substring(pref.length).trim();
                    break;
                }
            }

            // 市区町村を削除
            for (let suffix of suffixes) {
                const index = address.indexOf(suffix);
                if (index !== -1) {
                    address = address.substring(index + 1).trim();
                    break;
                }
            }

            // 「郡」が含まれている場合、その後の「町」も削除
            const gunIndex = address.indexOf('郡');
            if (gunIndex !== -1) {
                const machiIndex = address.indexOf('町', gunIndex);
                if (machiIndex !== -1) {
                    address = address.substring(machiIndex + 1).trim();
                }
            }

            // クリップボードに住所をコピー
            try {
                await navigator.clipboard.writeText(address);
                console.log('住所がクリップボードにコピーされました: ', address);
            } catch (err) {
                console.error('クリップボードへのコピーに失敗しました: ', err);
            }

            // 入力フィールドを空白に
            input.value = '';
        }
    });

    // ペーストボタンがクリックされたときにクリップボードのテキストを入力フィールドに貼り付け
    pasteButton.addEventListener('click', async function() {
        try {
            const text = await navigator.clipboard.readText();
            input.value = text;
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    });
})();
