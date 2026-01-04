// ==UserScript==
// @name         TVer PiP解除ブロック（最終版）
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  TVerのPiP解除を防ぎ、PiPを強制可能にする（disablePictureInPicture削除対応）
// @author       Anonymous
// @license      MIT
// @match        *://tver.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529180/TVer%20PiP%E8%A7%A3%E9%99%A4%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF%EF%BC%88%E6%9C%80%E7%B5%82%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/529180/TVer%20PiP%E8%A7%A3%E9%99%A4%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF%EF%BC%88%E6%9C%80%E7%B5%82%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("TVer PiP解除スクリプト（最終版）が実行されました");

    function enablePiPBypass() {
        try {
            // `disablePictureInPicture` を削除
            const removeDisablePiP = () => {
                let video = document.querySelector('video');
                if (video) {
                    video.removeAttribute('disablePictureInPicture');
                    console.log("disablePictureInPicture 属性を削除しました");
                } else {
                    console.log("video 要素が見つかりません");
                }
            };

            // exitPictureInPicture の無効化（書き換え不可回避）
            const redefineExitPiP = () => {
                if (typeof document.exitPictureInPicture === "function") {
                    document.exitPictureInPicture = function() {
                        console.log("PiP強制終了をブロックしました");
                    };
                    console.log("exitPictureInPicture のオーバーライド完了");
                }
            };

            // MutationObserver の無効化
            const disableMutationObserver = () => {
                window.MutationObserver = class {
                    constructor() {}
                    observe() {}
                    disconnect() {}
                };
                console.log("MutationObserverを無効化しました");
            };

            // 監視しながら定期的に PiP 関連の設定を適用
            setInterval(() => {
                try {
                    removeDisablePiP();
                    redefineExitPiP();
                } catch (error) {
                    console.error("PiP設定の再適用中にエラー:", error);
                }
            }, 1000);

            disableMutationObserver();

            // PiPを手動で起動するショートカットキー
            document.addEventListener("keydown", function(event) {
                if (event.key === "p") {
                    let video = document.querySelector('video');
                    if (video) {
                        video.requestPictureInPicture().catch(err => console.log("PiPエラー: ", err));
                    }
                }
            });

            console.log("TVer PiP スクリプト（最終版）の適用完了");
        } catch (error) {
            console.error("TVer PiP解除スクリプト（最終版）でエラーが発生:", error);
        }
    }

    // 5秒遅延してスクリプトを適用
    setTimeout(enablePiPBypass, 5000);
})();
