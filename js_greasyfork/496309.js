// ==UserScript==
// @name         Waze major traffic events from Waze Editor(ja)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  URLから緯度と経度を取得してWaze EditorとWaze Live Mapを開く
// @author       Aoi
// @match        https://www.waze.com/ja/events*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496309/Waze%20major%20traffic%20events%20from%20Waze%20Editor%28ja%29.user.js
// @updateURL https://update.greasyfork.org/scripts/496309/Waze%20major%20traffic%20events%20from%20Waze%20Editor%28ja%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // コンテナを作成
    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.zIndex = '1000';

    // テキスト入力フィールドを作成
    var urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.value = ''; // テキスト入力の中身を空にする
    urlInput.placeholder = 'https://www.waze.com/ja/events?zoom=17&lat=42.9904&lon=141.5554'; // デフォルトのURLをplaceholderにする
    urlInput.style.marginBottom = '5px';
    urlInput.style.width = '400px';

    // ボタンコンテナを作成
    var buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.marginBottom = '5px';

    // 貼り付けボタンを作成
    var pasteButton = document.createElement('button');
    pasteButton.innerHTML = '貼り付け';
    pasteButton.style.padding = '5px 10px';
    pasteButton.style.backgroundColor = '#007bff';
    pasteButton.style.color = 'white';
    pasteButton.style.border = 'none';
    pasteButton.style.borderRadius = '3px';
    pasteButton.style.cursor = 'pointer';
    pasteButton.style.marginRight = '5px';

    // ボタンがクリックされたときにテキスト入力フィールドにクリップボードの内容を貼り付ける
    pasteButton.addEventListener('click', function() {
        navigator.clipboard.readText()
            .then(text => {
                urlInput.value = text.trim();
            })
            .catch(err => {
                console.error('Failed to read clipboard contents: ', err);
            });
    });

    // Waze Editorを開くボタンを作成
    var editorButton = document.createElement('button');
    editorButton.innerHTML = 'Waze Editorで開く';
    editorButton.style.padding = '5px 10px';
    editorButton.style.backgroundColor = '#007bff';
    editorButton.style.color = 'white';
    editorButton.style.border = 'none';
    editorButton.style.borderRadius = '3px';
    editorButton.style.cursor = 'pointer';
    editorButton.style.marginRight = '5px';

    // Waze Live Mapを開くボタンを作成
    var liveMapButton = document.createElement('button');
    liveMapButton.innerHTML = 'Waze Live Mapで開く';
    liveMapButton.style.padding = '5px 10px';
    liveMapButton.style.backgroundColor = '#007bff';
    liveMapButton.style.color = 'white';
    liveMapButton.style.border = 'none';
    liveMapButton.style.borderRadius = '3px';
    liveMapButton.style.cursor = 'pointer';

    // ボタンがクリックされたときにURLから緯度と経度を抽出してWaze EditorのURLを開く
    editorButton.addEventListener('click', function() {
        var url = urlInput.value.trim();
        var urlParams = new URLSearchParams(url.split('?')[1]);
        var lat = urlParams.get('lat');
        var lon = urlParams.get('lon');

        if (lat && lon) {
            // Waze EditorのURLを作成
            var editorUrl = `https://www.waze.com/ja/editor?env=row&lon=${lon}&lat=${lat}&zoom=5`;
            window.open(editorUrl, '_blank');
        } else {
            alert('正しいURLを入力してください。');
        }
    });

    // ボタンがクリックされたときにURLから緯度と経度を抽出してWaze Live MapのURLを開く
    liveMapButton.addEventListener('click', function() {
        var url = urlInput.value.trim();
        var urlParams = new URLSearchParams(url.split('?')[1]);
        var lat = urlParams.get('lat');
        var lon = urlParams.get('lon');

        if (lat && lon) {
            // Waze Live MapのURLを作成
            var liveMapUrl = `https://www.waze.com/ja/live-map/directions?to=ll.${lat}%2C${lon}`;
            window.open(liveMapUrl, '_blank');
        } else {
            alert('正しいURLを入力してください。');
        }
    });

    // ボタンをボタンコンテナに追加
    buttonContainer.appendChild(pasteButton);
    buttonContainer.appendChild(editorButton);
    buttonContainer.appendChild(liveMapButton);

    // コンテナに要素を追加
    container.appendChild(urlInput);
    container.appendChild(buttonContainer);

    // ページにコンテナを追加
    document.body.appendChild(container);
})();
