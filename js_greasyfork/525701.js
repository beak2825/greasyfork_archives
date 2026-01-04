// ==UserScript==
// @name         mylist-list
// @namespace    twitter.com/neon_uriel
// @version      2025-02-03
// @description  guroshi
// @author       neon
// @match        https://www.nicovideo.jp/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @run-at      document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525701/mylist-list.user.js
// @updateURL https://update.greasyfork.org/scripts/525701/mylist-list.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 監視対象のノード (body 全体を監視)
    const targetNode = document.body;
    const url = new URL(window.location.href);
    const smNumber = url.pathname.substring(url.pathname.lastIndexOf('/') + 1);

    // MutationObserver のコールバック関数
    const observerCallback = function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                let menu = document.querySelector('#menu\\:\\:rk\\:\\:content');
                if (menu && !document.getElementById('custom-button')) {
                    addButton(menu);
                    observer.disconnect(); // 1回追加したら監視を終了
                }
            }
        }
    };

    // ボタンを追加する関数
    function addButton(target) {
        let button = document.createElement('button');
        button.id = 'custom-button';
        button.innerText = 'マイリスト一覧';
        button.style.margin = '10px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';


        // ボタンのクリックイベント
        button.addEventListener('click', function() {
            console.log('ボタンがクリックされました');
            window.open("https://www.nicovideo.jp/openlist/" + smNumber, "_blank");
        });

        // 指定の要素にボタンを追加
        target.appendChild(button);
        console.log('ボタンを追加しました');
    }

    // MutationObserver のオプション (子ノードの変更を監視)
    const observerOptions = { childList: true, subtree: true };

    // MutationObserver を作成
    const observer = new MutationObserver(observerCallback);

    // 監視を開始
    observer.observe(targetNode, observerOptions);
})();
