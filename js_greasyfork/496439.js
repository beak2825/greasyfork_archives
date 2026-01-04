// ==UserScript==
// @name        国土交通省道路情報提供システム→GoogleMapへ
// @namespace   http://tampermonkey.net/
// @version     0.15
// @description 地図にテキスト入力フィールドとボタンを追加し、同じ場所またはアドレスでGoogle Mapsにリダイレクトします
// @author      Your Name
// @match       https://www.road-info-prvs.mlit.go.jp/roadinfo/pc/*
// @icon        https://pngimg.com/uploads/waze/waze_PNG21.png
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/496439/%E5%9B%BD%E5%9C%9F%E4%BA%A4%E9%80%9A%E7%9C%81%E9%81%93%E8%B7%AF%E6%83%85%E5%A0%B1%E6%8F%90%E4%BE%9B%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E2%86%92GoogleMap%E3%81%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/496439/%E5%9B%BD%E5%9C%9F%E4%BA%A4%E9%80%9A%E7%9C%81%E9%81%93%E8%B7%AF%E6%83%85%E5%A0%B1%E6%8F%90%E4%BE%9B%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E2%86%92GoogleMap%E3%81%B8.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // コンテナdivを作成
  let container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '45%';
  container.style.bottom = '0px';
  container.style.transform = 'translateX(-50%)';
  container.style.zIndex = 1000;
  container.style.padding = '10px';
  container.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  container.style.borderRadius = '5px';
  container.style.display = 'flex';
  container.style.alignItems = 'center';

  // 入力フィールドを作成
  let input = document.createElement('input');
  input.type = 'text';
  input.placeholder = '住所を入力';
  input.style.marginRight = '10px';
  input.style.height = '25px'; // 高さを設定
  input.style.padding = '5px';

  // ボタンを作成
  let button = document.createElement('button');
  button.innerText = 'Google Mapsで開く';
  button.style.padding = '5px 10px';
  button.style.backgroundColor = '#4285f4';
  button.style.color = '#fff';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.height = '30px'; // ボタンの高さを入力フィールドより少し小さく設定
  button.style.lineHeight = '20px'; // テキストの行高を設定

  // 入力とボタンをコンテナに追加
  container.appendChild(input);
  container.appendChild(button);

  // コンテナをbodyに追加
  document.body.appendChild(container);

  // Google Mapsを新しいタブで開く関数
  function redirectToGoogleMapsInNewTab(lon, lat) {
    let googleMapsURL = `https://www.google.com/maps/@${lat},${lon},15z`;
    window.open(googleMapsURL, '_blank');
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
            redirectToGoogleMapsInNewTab(lon, lat); // Google Mapsを新しいタブで開く
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

        redirectToGoogleMapsInNewTab(centerLon, centerLat); // Google Mapsを新しいタブで開く
      }
    }
  });
})();
