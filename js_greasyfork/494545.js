// ==UserScript==
// @name         Google Maps→交通規制情報オープンデータマップ
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Google Mapsと同じ場所でJarticマップを開く（ズームレベルを19に固定）
// @match        https://www.google.com/maps/*
// @icon         https://pngimg.com/uploads/waze/waze_PNG21.png
// @author       Aoi
// @downloadURL https://update.greasyfork.org/scripts/494545/Google%20Maps%E2%86%92%E4%BA%A4%E9%80%9A%E8%A6%8F%E5%88%B6%E6%83%85%E5%A0%B1%E3%82%AA%E3%83%BC%E3%83%97%E3%83%B3%E3%83%87%E3%83%BC%E3%82%BF%E3%83%9E%E3%83%83%E3%83%97.user.js
// @updateURL https://update.greasyfork.org/scripts/494545/Google%20Maps%E2%86%92%E4%BA%A4%E9%80%9A%E8%A6%8F%E5%88%B6%E6%83%85%E5%A0%B1%E3%82%AA%E3%83%BC%E3%83%97%E3%83%B3%E3%83%87%E3%83%BC%E3%82%BF%E3%83%9E%E3%83%83%E3%83%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ボタンを作成
    var button = document.createElement('button');
    button.textContent = 'Jartic Map';
    button.style.position = 'fixed';
    button.style.padding = '10px 20px';
    button.style.background = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.fontWeight = 'bold';

    // ボタンの位置をローカルストレージから読み込む
    var storedPosition = localStorage.getItem('jarticButtonPosition');
    if (storedPosition) {
        var [x, y] = storedPosition.split(',');
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
    } else {
        // ボタンのデフォルト位置を設定
        button.style.bottom = '14px';
        button.style.left = '67%';
        button.style.transform = 'translateX(-50%)';
    }

    document.body.appendChild(button);

    // ボタンにクリックイベントを追加
    button.addEventListener('click', function() {
        // Google MapsのURLから緯度、経度を抽出（新しい形式に対応）
        var coordinatePattern = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
        var match = window.location.href.match(coordinatePattern);

        if (match) {
            var latitude = match[1]; // 緯度
            var longitude = match[2]; // 経度

            // ズームレベルを19に固定
            var fixedZoomLevel = 19;

            // JarticマップへのURLを作成
            var jarticUrl = `http://hotmist.ddo.jp/jartic_kisei/@${latitude},${longitude},${fixedZoomLevel}z`;

            // 同じタブでJarticマップに遷移
            window.location.href = jarticUrl;
        } else {
            alert("Google MapsのURLから位置情報を取得できませんでした。");
        }
    });

    // ボタンが移動されたときに位置をローカルストレージに保存
    button.addEventListener('mousedown', function(event) {
        var offsetX = event.clientX - button.offsetLeft;
        var offsetY = event.clientY - button.offsetTop;
        document.addEventListener('mousemove', moveButton);

        function moveButton(event) {
            button.style.left = `${event.clientX - offsetX}px`;
            button.style.top = `${event.clientY - offsetY}px`;
        }

        document.addEventListener('mouseup', function() {
            document.removeEventListener('mousemove', moveButton);
            // ボタンの位置をローカルストレージに保存
            localStorage.setItem('jarticButtonPosition', `${button.offsetLeft},${button.offsetTop}`);
        }, { once: true });
    });
})();
