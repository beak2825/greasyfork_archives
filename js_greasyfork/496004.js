// ==UserScript==
// @name     Shizuoka Douro to Waze with Address
// @namespace  http://tampermonkey.net/
// @version    0.1
// @description  Shizuoka Douroの地図にテキスト入力フィールドとボタンを追加し、同じ場所またはアドレスでWazeマップエディターにリダイレクトします
// @author    Your Name
// @match     http://douro.pref.shizuoka.jp/kisei/*
// @grant     none
// @downloadURL https://update.greasyfork.org/scripts/496004/Shizuoka%20Douro%20to%20Waze%20with%20Address.user.js
// @updateURL https://update.greasyfork.org/scripts/496004/Shizuoka%20Douro%20to%20Waze%20with%20Address.meta.js
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

  // ボタンを作成
  let button = document.createElement('button');
  button.innerText = 'Wazeエディターで開く';
  button.style.padding = '10px';
  button.style.backgroundColor = '#28a745';
  button.style.color = '#fff';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';

  // 入力とボタンをコンテナに追加
  container.appendChild(input);
  container.appendChild(button);

  // コンテナをbodyに追加
  document.body.appendChild(container);

  // Wazeを新しいタブで開く関数
  function redirectToWazeInNewTab(lon, lat) {
    let wazeURL = `https://www.waze.com/editor?env=row&lon=${lon}&lat=${lat}&zoom=5`;
    window.open(wazeURL, '_blank');
  }

  // ボタンにクリックイベントを追加
  button.addEventListener('click', function() {
    let address = input.value;

    if (address) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            let lon = data[0].lon;
            let lat = data[0].lat;
            redirectToWazeInNewTab(lon, lat); // Wazeを新しいタブで開く
          } else {
            alert('住所が見つかりません');
          }
        });
    } else {
      let urlParams = new URLSearchParams(window.location.search);
      let extents = urlParams.get('extents');

      if (extents) {
        let coords = extents.split(',');
        let minLon = parseFloat(coords[0]);
        let minLat = parseFloat(coords[1]);
        let maxLon = parseFloat(coords[2]);
        let maxLat = parseFloat(coords[3]);
        let centerLon = (minLon + maxLon) / 2;
        let centerLat = (minLat + maxLat) / 2;

        redirectToWazeInNewTab(centerLon, centerLat); // Wazeを新しいタブで開く
      }
    }
  });
})();
