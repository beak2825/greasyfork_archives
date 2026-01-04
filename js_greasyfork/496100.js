// ==UserScript==
// @name         静岡市道路通行規制情報 しずみちinfo
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  静岡市道路通行規制情報 しずみちinfoから住所を入力してWazeエディターを開くでWazeマップエディターにリダイレクトします
// @author       Your Name
// @match        https://shizuokashi-road.appspot.com/index_pub.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496100/%E9%9D%99%E5%B2%A1%E5%B8%82%E9%81%93%E8%B7%AF%E9%80%9A%E8%A1%8C%E8%A6%8F%E5%88%B6%E6%83%85%E5%A0%B1%20%E3%81%97%E3%81%9A%E3%81%BF%E3%81%A1info.user.js
// @updateURL https://update.greasyfork.org/scripts/496100/%E9%9D%99%E5%B2%A1%E5%B8%82%E9%81%93%E8%B7%AF%E9%80%9A%E8%A1%8C%E8%A6%8F%E5%88%B6%E6%83%85%E5%A0%B1%20%E3%81%97%E3%81%9A%E3%81%BF%E3%81%A1info.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // コンテナdivを作成
  let container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '5px'; // 上部からの距離を設定
  container.style.left = '48%'; // 左から50%に設定
  container.style.transform = 'translateX(-50%)'; // 中央揃えにするための変換
  container.style.zIndex = 1000;
  container.style.padding = '10px';
  container.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  container.style.borderRadius = '5px';
  container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';

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
            input.value = ''; // 入力フィールドをクリア
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
