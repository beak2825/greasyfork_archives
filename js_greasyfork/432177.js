// ==UserScript==
// @name         YoutubeLiveConnectionsTranspoter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  title
// @author       yuma
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432177/YoutubeLiveConnectionsTranspoter.user.js
// @updateURL https://update.greasyfork.org/scripts/432177/YoutubeLiveConnectionsTranspoter.meta.js
// ==/UserScript==

(function () {
    'use strict';
    (function () {
        // 3,000ミリ秒（3秒）後に 関数「Test」 を実行
        setTimeout(Test, 3000);
        // 関数「Test」を定義 ※任意の関数名でOK
        function Test() {
            const target = document.getElementsByClassName("view-count")[0];
            console.log(target);
            // オブザーバインスタンスを作成
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    // 何かしたいこと
                    let text = mutation.target.data.replace(/[^0-9]/g, '');
                    text = Number(text);
                    console.log(text);
                    let sendJSON = JSON.stringify({
                        Connections : text
                    }); 
                    ws.send(sendJSON);
                });
            });

            // オブザーバの設定
            const config = {
                characterData: true,
                attributes: true,
                subtree: true
            };

            const ws = new WebSocket("ws://localhost:23699");

            // 対象ノードとオブザーバの設定を渡す
            observer.observe(target, config);

            //実行させたいスクリプト処理内容を記述

        }
    })();
    // Your code here...
})();