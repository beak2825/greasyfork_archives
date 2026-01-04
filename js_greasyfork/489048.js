// ==UserScript==
// @name         UnityRoomゲームクリーナー
// @name:en      UnityRoom Game Cleaner
// @namespace    http://your.website.com
// @version      1.2
// @description  UnityRoomで閲覧数が1000以下のゲームまたは指定された閾値未満のゲーム（目のアイコンの横の数字）を非表示にする。
// @description:en  Hide games in UnityRoom that have less than 1000 views or less than the specified threshold (the number next to the eye icon).
// @license      MIT
// @author       Your Name
// @match        https://unityroom.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489048/UnityRoom%E3%82%B2%E3%83%BC%E3%83%A0%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%8A%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/489048/UnityRoom%E3%82%B2%E3%83%BC%E3%83%A0%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%8A%E3%83%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var threshold = 1000; // デフォルトの閲覧数閾値
    var hiddenGames = []; // 非表示にしたゲームのリスト

    // 設定画面を生成する関数
    function createSettingsUI() {
        // 設定用のHTML要素を作成
        var settingsDiv = document.createElement('div');
        settingsDiv.innerHTML = `
            <div>
                <label for="viewThreshold">閲覧数閾値:</label>
                <input type="number" id="viewThreshold" value="${threshold}" min="1">
                <button id="saveThreshold">保存</button>
            </div>
        `;

        // 保存ボタンがクリックされたときの処理
        settingsDiv.querySelector('#saveThreshold').addEventListener('click', function() {
            // 入力された閾値を取得して設定を更新
            var newThreshold = parseInt(settingsDiv.querySelector('#viewThreshold').value);
            if (!isNaN(newThreshold) && newThreshold > 0) {
                threshold = newThreshold;
                updateHiddenGames();
                hideLowViewGames();
            }
        });

        // 設定用の要素をページに追加
        document.body.prepend(settingsDiv);
    }

    // 非表示にしたゲームを表示する関数
    function showHiddenGames() {
        hiddenGames.forEach(function(tile) {
            tile.style.display = 'block';
        });
        hiddenGames = []; // リストをクリア
    }

    // 1000以下の閲覧数を持つゲームを非表示にする関数
    function hideLowViewGames() {
        // bl_gameTile_attr_pvクラスの要素をすべて取得
        var gameTiles = document.querySelectorAll('.bl_gameTile_attr_pv');

        // 各要素について処理
        gameTiles.forEach(function(tile) {
            // 閲覧数の値を取得
            var views = parseInt(tile.innerText);

            // 閲覧数が閾値未満の場合、要素を非表示にする
            if (views <= threshold) {
                var gameTile = tile.closest('.bl_gameTile');
                gameTile.style.display = 'none';
                hiddenGames.push(gameTile);
            }
        });
    }

    // ページが変更されたときにゲームを非表示にする関数
    function pageChangeListener(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                // 追加されたノードにゲームタイルが含まれている場合、再度ゲームを非表示にする
                hideLowViewGames();
            }
        });
    }

    // ページの変更を監視
    var observer = new MutationObserver(pageChangeListener);
    var observerConfig = { childList: true, subtree: true };
    observer.observe(document.body, observerConfig);

    // 設定画面を生成
    createSettingsUI();

    // 非表示にしたゲームを表示するための関数
    function updateHiddenGames() {
        showHiddenGames();
    }

    // ページが読み込まれたときに関数を実行
    window.addEventListener('load', hideLowViewGames);
})();
