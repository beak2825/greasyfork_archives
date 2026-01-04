// ==UserScript==
// @name         Hide Image-less and Deleted Responses
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  一度でもスレあきに削除されたことがあるIDと文字レスのみのIDを非表示。スレ文にキーワードを含む、mayと人工知能板のIDスレでのみ動作。ブラウザ下端に設定ボタン。
// @author       としあき
// @match        https://may.2chan.net/b/res/*
// @match        https://dec.2chan.net/85/res/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497472/Hide%20Image-less%20and%20Deleted%20Responses.user.js
// @updateURL https://update.greasyfork.org/scripts/497472/Hide%20Image-less%20and%20Deleted%20Responses.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // デバッグ出力の有効化
    const DEBUG_MODE = false;

    // ID の削除ステータスを保存するオブジェクト
    const deletedIDs = {};

    // 画像付きレスを投稿したIDを保存するオブジェクト
    const imagePostedIDs = new Set();

    // ふたクロが有効かどうか
    var isFutsuroEnabled;

    // ID が表示されているかどうか
    var isIDDisplayed = false;

    // デバッグ出力を行う関数
    function debugLog(message) {
        if (DEBUG_MODE) {
            console.log(message);
        }
    }

    // レスの情報をデバッグ出力する関数
    function logResponseInfo(element) {
        const resNoElement = element.querySelector(isFutsuroEnabled ? '.res_no' : '.rsc');
        const resNo = resNoElement ? resNoElement.textContent : 'N/A';
        const id = extractID(element);
        const hasImage = !!element.querySelector('img');
        const content = element.querySelector('blockquote').textContent.trim().replace(/\s+/g, ' ');
        debugLog(`[レス番号] ${resNo} ID: ${id} 画像${hasImage ? 'あり' : 'なし'} 本文: ${content}`);
    }

    // レスからIDを抽出する関数
    function extractID(element) {
        if (isFutsuroEnabled) {
            const idElement = element.querySelector('.idip');
            return idElement ? idElement.textContent : null;
        } else {
            const idElement = element.querySelector('.cnw');
            const idText = idElement ? idElement.textContent: null;
            const match = /ID:([^ ]+)/.exec(idText);
            return match ? match[1] : null;
        }
    }

    // 画像無しレスと削除レスを非表示にする関数
    function hideResponses() {
        // 設定値を取得
        const hideNonImagePosters = localStorage.getItem('hideNonImagePosters') === 'true';
        const hideDeletedIDs = localStorage.getItem('hideDeletedIDs') === 'true';
        const keywords = localStorage.getItem('keywords') || "AI,ＡＩ,🥦";

        // 0レス目本文のキーワードチェック
        const masterContent = document.querySelector(isFutsuroEnabled ? '#master blockquote' : '.thre > blockquote').textContent.trim();
        const keywordMatch = keywords.split(',').some(keyword => masterContent.includes(keyword.trim()));

        if (!keywordMatch) {
            debugLog("0レス目本文にキーワードが見つかりませんでした。スクリプトは動作しません。");
            return;
        }

        // ホワイトリストを作成
        const whitelist = createWhitelist();
        debugLog('ホワイトリスト:', whitelist);

        // 対象となる要素をふたクロの有無で切り替え
        const targetElements = isFutsuroEnabled ?
            document.querySelectorAll('.thre table, .thre #master') :
            document.querySelectorAll('.thre table');

        targetElements.forEach((element) => {
            // レス内のID取得
            const id = extractID(element);

            // デバッグ出力
            logResponseInfo(element);

            // 画像レスをしていないIDを非表示にする設定が有効
            if (hideNonImagePosters && !imagePostedIDs.has(id)) {
                debugLog(`ID ${id} は画像レスをしていないため非表示にします`);
                element.style.display = 'none';
                return; // 他の判定をスキップ
            }

            // 管理者削除されたことのあるIDを非表示にする設定が有効
            if (hideDeletedIDs && deletedIDs[id]) {
                debugLog(`ID ${id} は管理者削除されたことがあるため非表示にします`);
                element.style.display = 'none';
                return; // 他の判定をスキップ
            }

            // ホワイトリストにないIDのレスは非表示
            if (!whitelist.has(id)) {
                debugLog(`ID ${id} はホワイトリストにないため非表示にします`);
                element.style.display = 'none';
            }
        });
    }

    // ホワイトリストを作成する関数
    function createWhitelist() {
        const whitelist = new Set();

        // 対象となる要素をふたクロの有無で切り替え
        const targetElements = isFutsuroEnabled ?
            document.querySelectorAll('.thre table, .thre #master') :
            document.querySelectorAll('.thre table, .thre > span:first-of-type');

        targetElements.forEach((element) => {
            const id = extractID(element);

            // 削除されたレスか判定
            const deleteMessage = element.querySelector('blockquote font[color="#ff0000"]');
            if (deleteMessage && deleteMessage.textContent.trim() === 'スレッドを立てた人によって削除されました') {
                deletedIDs[id] = true;
                return; // スレッド管理者によって削除されたレスはスキップ
            }

            // 画像付きレスならIDを保存
            if (element.querySelector('img')) {
                imagePostedIDs.add(id);
            }

            // ホワイトリストに追加（設定によりフィルタされる）
            whitelist.add(id);
        });
        return whitelist;
    }

    // ローカルストレージに設定値が存在しない場合はデフォルト値を設定
    if (localStorage.getItem('hideNonImagePosters') === null) {
        localStorage.setItem('hideNonImagePosters', true);
    }
    if (localStorage.getItem('hideDeletedIDs') === null) {
        localStorage.setItem('hideDeletedIDs', true);
    }
    if (localStorage.getItem('keywords') === null) {
        localStorage.setItem('keywords', "AI,ＡＩ,🥦");
    }

    // 設定画面の HTML
    const settingsHTML = `
    <div id="settings-dialog" style="display:none; position:fixed; top:50%; left:50%; transform: translate(-50%, -50%); background-color: black; padding: 20px; border: 1px solid #ccc; z-index: 1000;">
      <h2>設定</h2>
      <label for="hide-non-image-posters">一度も画像レスをしていないIDを非表示:</label>
      <input type="checkbox" id="hide-non-image-posters" ${localStorage.getItem('hideNonImagePosters') === 'true' ? 'checked' : ''}>
      <br>
      <label for="hide-deleted-ids">管理者削除されたことのあるIDを非表示:</label>
      <input type="checkbox" id="hide-deleted-ids" ${localStorage.getItem('hideDeletedIDs') === 'true' ? 'checked' : ''}>
      <br>
      <label for="keywords">動作に必要な0レス目本文キーワード（カンマ区切り）:</label><br>
      <textarea id="keywords" rows="4" cols="50">${localStorage.getItem('keywords') || "AI,ＡＩ,🥦"}</textarea>
      <br>
      <button id="save-settings">保存</button>
      <button id="close-settings">閉じる</button>
    </div>
    `;

    // 設定画面の追加
    const settingsDialog = document.createElement('div');
    settingsDialog.innerHTML = settingsHTML;
    document.body.appendChild(settingsDialog);

    // 設定画面を開く関数
    function openSettings() {
        document.getElementById('settings-dialog').style.display = 'block';
    }

    // 設定画面を閉じる関数
    function closeSettings() {
        document.getElementById('settings-dialog').style.display = 'none';
    }

    // 保存ボタンのクリックイベント
    document.getElementById('save-settings').addEventListener('click', () => {
        localStorage.setItem('hideNonImagePosters', document.getElementById('hide-non-image-posters').checked);
        localStorage.setItem('hideDeletedIDs', document.getElementById('hide-deleted-ids').checked);
        localStorage.setItem('keywords', document.getElementById('keywords').value);
        closeSettings();
    });

    // 閉じるボタンのクリックイベント
    document.getElementById('close-settings').addEventListener('click', closeSettings);

    // 設定画面を開くボタンを追加 (例)
    const settingsButton = document.createElement('button');
    settingsButton.textContent = '設定';
    settingsButton.addEventListener('click', openSettings);
    document.body.appendChild(settingsButton); // 好きな場所にボタンを追加

    // ページ読み込み後、少し待ってからhideResponsesを実行
    setTimeout(() => {
        isFutsuroEnabled = !!document.querySelector('#fvw_menu');

        // ① ふたクロが有効な場合
        if (isFutsuroEnabled) {
            const masterSpan = document.querySelector('#master span.cnm');
            if (masterSpan && masterSpan.textContent.includes('[id表示]')) {
                isIDDisplayed = true;
            }
        }
        // ② ふたクロが有効でない場合
        else {
            const firstCnmSpan = document.querySelector('div.thre span.cnm');
            if (firstCnmSpan && firstCnmSpan.textContent.includes('mailto:id表示')) {
                isIDDisplayed = true;
            }
        }

        if (isIDDisplayed) {
            hideResponses(); // ページ読み込み時の処理

            // MutationObserver - ".thre"の子要素の変化を監視
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList' && mutation.target.classList.contains('thre')) {
                        hideResponses();
                    }
                }
            });

            // 観察対象の要素
            const threContainer = document.querySelector('.thre');
            if (threContainer) {
                observer.observe(threContainer, { childList: true });
            }
        } else {
            debugLog('IDが表示されていないため、スクリプトは動作しません。');
        }
    }, 100); // 0.1秒（100ミリ秒）後に実行
})();