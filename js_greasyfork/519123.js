// ==UserScript==
// @name    交通規制マップ→Wazeエディター
// @namespace  https://example.com/
// @version   1.2
// @description 座標を事前に設定してWazeエディターを開くボタンをウェブページに追加します。
// @match    http://hotmist.ddo.jp/*
// @icon   　　　https://pngimg.com/uploads/waze/waze_PNG21.png
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/519123/%E4%BA%A4%E9%80%9A%E8%A6%8F%E5%88%B6%E3%83%9E%E3%83%83%E3%83%97%E2%86%92Waze%E3%82%A8%E3%83%87%E3%82%A3%E3%82%BF%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/519123/%E4%BA%A4%E9%80%9A%E8%A6%8F%E5%88%B6%E3%83%9E%E3%83%83%E3%83%97%E2%86%92Waze%E3%82%A8%E3%83%87%E3%82%A3%E3%82%BF%E3%83%BC.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // URLから緯度と経度を取得
  var coords = window.location.href.split("@")[1]?.split(",");

  if (!coords || coords.length < 2) {
    console.error('座標がURLから正しく取得できませんでした');
    return;
  }

  var lat = coords[0];
  var lon = coords[1];

  // 縮尺を固定したWazeエディターURLを作成
  var wazeEditorUrl = "https://www.waze.com/ja/editor?env=row&lon=" + lon + "&lat=" + lat + "&zoom=8"; // 希望の縮尺に変更

  // 座標を事前に設定してWazeエディターを開くボタンを作成
  var wazeButton = '<a href="' + wazeEditorUrl + '" target="_blank" style="position: fixed; left: 10px; bottom: 10px;"><button>Wazeエディターで開く</button></a>';
  document.body.insertAdjacentHTML('beforeend', wazeButton);
})();
