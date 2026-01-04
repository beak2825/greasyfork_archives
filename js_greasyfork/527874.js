// ==UserScript==
// @name    交通規制マップ→Wazeエディター２
// @namespace  https://example.com/
// @version   1.6
// @description 座標を事前に設定し、リロード後に新しいタブでWazeエディターを開くボタンを追加します。
// @match    http://hotmist.ddo.jp/*
// @icon    https://pngimg.com/uploads/waze/waze_PNG21.png
// @grant   none
// @downloadURL https://update.greasyfork.org/scripts/527874/%E4%BA%A4%E9%80%9A%E8%A6%8F%E5%88%B6%E3%83%9E%E3%83%83%E3%83%97%E2%86%92Waze%E3%82%A8%E3%83%87%E3%82%A3%E3%82%BF%E3%83%BC%EF%BC%92.user.js
// @updateURL https://update.greasyfork.org/scripts/527874/%E4%BA%A4%E9%80%9A%E8%A6%8F%E5%88%B6%E3%83%9E%E3%83%83%E3%83%97%E2%86%92Waze%E3%82%A8%E3%83%87%E3%82%A3%E3%82%BF%E3%83%BC%EF%BC%92.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // URLから緯度と経度を取得
  var coords = window.location.href.split("@")[1]?.split(",");
  if (!coords || coords.length < 2) {
    alert('URLから座標を正しく取得できませんでした。URLに「@緯度,経度」を含めてください。');
    console.error('座標がURLから正しく取得できませんでした');
    return;
  }

  var lat = parseFloat(coords[0]);
  var lon = parseFloat(coords[1]);

  // 座標の有効性チェック
  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    alert('無効な座標です。緯度(-90～90)と経度(-180～180)の範囲で正しい数値を指定してください。');
    console.error('無効な座標: lat=' + lat + ', lon=' + lon);
    return;
  }

  // WazeエディターURLを作成（縮尺固定）
  var wazeEditorUrl = "https://www.waze.com/ja/editor?env=row&lon=" + lon + "&lat=" + lat + "&zoom=8";

  // 統合ボタンを作成
  var actionButton = '<button id="actionButton" style="position: fixed; left: 10px; bottom: 10px; padding: 8px 16px; background-color: #00b8d4; color: white; border: none; border-radius: 4px; cursor: pointer;">リロード後にWazeへ</button>';
  document.body.insertAdjacentHTML('beforeend', actionButton);

  // ボタンのクリックイベントを設定
  document.getElementById('actionButton').addEventListener('click', function() {
    // リロード後にWazeエディターを新しいタブで開くフラグをlocalStorageに保存
    localStorage.setItem('openWazeAfterReload', 'true');
    location.reload();
  });

  // ページ読み込み時にフラグをチェックしてWazeエディターを新しいタブで開く
  window.addEventListener('load', function() {
    if (localStorage.getItem('openWazeAfterReload') === 'true') {
      localStorage.removeItem('openWazeAfterReload'); // フラグをクリア
      window.open(wazeEditorUrl, '_blank'); // 新しいタブでWazeエディターを開く
    }
  });
})();