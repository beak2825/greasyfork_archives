// ==UserScript==
// @name				ビリビリライブモザイク削除くん
// @name:en				Bilibili Live Mosaic Remover
// @name:zh-CN				破站直播马赛克删除君
// @name:zh-TW				B 站實況馬賽克移除君
// @license				CC-BY-NC-SA-4.0
// @namespace				https://space.bilibili.com/2033380
// @version				2.1
// @description				モザイクなんてクソ食らえだ！
// @description:en			Fuck you mosaic!
// @description:zh-CN			去你妈的傻逼马赛克！
// @description:zh-TW			幹你娘的白癡馬賽克！
// @author				Misha
// @match				*://live.bilibili.com/*
// @icon				https://icons.duckduckgo.com/ip2/bilibili.com.ico
// @grant				none
// @run-at				document-end
// @supportURL				https://github.com/Mishasama/UserScript/issues
// @homepageURL				https://github.com/Mishasama/UserScript/raw/master/Misha's%20US/Bilibili%20Live%20Mosaic%20Remover/
// @contributionURL			https://ko-fi.com/mishasama
// @contributionAmount			1￥
// @compatible				chrome
// @compatible				edge
// @downloadURL https://update.greasyfork.org/scripts/497670/%E3%83%93%E3%83%AA%E3%83%93%E3%83%AA%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A2%E3%82%B6%E3%82%A4%E3%82%AF%E5%89%8A%E9%99%A4%E3%81%8F%E3%82%93.user.js
// @updateURL https://update.greasyfork.org/scripts/497670/%E3%83%93%E3%83%AA%E3%83%93%E3%83%AA%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A2%E3%82%B6%E3%82%A4%E3%82%AF%E5%89%8A%E9%99%A4%E3%81%8F%E3%82%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
// ポーリング間隔を設定します（例：5000ミリ秒）
var interval = 5000;
var highestZIndex = 2147483647; // 最上層にボタンを保つための最大の32ビット整数

// ページの読み込みが完了したらすぐに実行される関数
function onPageLoad() {
  var targetDiv = document.getElementById('web-player-module-area-mask-panel');
  if (targetDiv) {
    addRemoveButton(targetDiv);
  }
}

// 削除ボタンを作成して追加する関数
function addRemoveButton(targetDiv) {
  var button = document.getElementById('remove-button');
  if (!button) {
    button = document.createElement('button');
    button.id = 'remove-button';
    button.innerHTML = 'モザイクを削除';
    
    // ボタンのスタイルを設定します
    button.style.position = 'fixed'; // 固定位置を使用します
    button.style.zIndex = highestZIndex.toString(); // 最高のz-index値を設定します
    styleButton(button); // スタイルを適用
    document.body.appendChild(button);
  }

  // ボタンのクリックイベントを設定
  button.onclick = function() {
    targetDiv.remove();
    button.remove();
  };

  // ボタンの位置を更新
  updateButtonPosition(button, targetDiv);
}

// ボタンの位置を更新する関数
function updateButtonPosition(button, targetDiv) {
  var rect = targetDiv.getBoundingClientRect();
  button.style.top = window.scrollY + rect.top + rect.height / 2 + 'px';
  button.style.left = window.scrollX + rect.left + rect.width / 2 + 'px';
}

// ボタンのスタイルを設定する関数
function styleButton(button) {
  // 基本スタイル
  button.style.padding = '10px 15px';
  button.style.fontSize = '1rem';
  button.style.fontWeight = 'bold';
  button.style.color = '#fff';
  button.style.background = '#007bff';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.transition = 'background-color 0.3s, box-shadow 0.3s';

  // 影と遷移効果
  button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';

  // マウスオーバー時のスタイル
  button.onmouseover = function() {
    button.style.background = '#0056b3';
    button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
  };

  // マウスアウト時のスタイル
  button.onmouseout = function() {
    button.style.background = '#007bff';
    button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
  };
}

// DOMの変更を監視するMutationObserverを使用
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes.length > 0) {
      var targetDiv = document.getElementById('web-player-module-area-mask-panel');
      if (targetDiv) {
        updateButtonPosition(document.getElementById('remove-button'), targetDiv);
      }
    }
  });
});

// ページの読み込みが完了したイベントをリスン
window.addEventListener('load', onPageLoad);

// DOMの変更を監視を開始
observer.observe(document.body, { childList: true, subtree: true });

// setInterval関数を使用して、定期的にチェックとボタンの位置を更新
setInterval(function() {
  var button = document.getElementById('remove-button');
  var targetDiv = document.getElementById('web-player-module-area-mask-panel');
  if (button && targetDiv) {
    updateButtonPosition(button, targetDiv);
  }
}, interval);
})();
