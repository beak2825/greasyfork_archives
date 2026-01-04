// ==UserScript==
// @name        nicovideo-next-video-canceler
// @namespace   https://github.com/dnek
// @version     1.9
// @author      dnek
// @description ニコニコ動画の連続再生オフ機能を、公式より少し便利にします（プレイリストは普通に連続再生、動画終了時に全画面を自動解除）。※公式のプレイヤー設定の「次の動画を自動再生」はONのままにしてください。「nicovideo-autoplay-canceler」「nicovideo-player-expander」は別のスクリプトです。
// @description:ja    ニコニコ動画の連続再生オフ機能を、公式より少し便利にします（プレイリストは普通に連続再生、動画終了時に全画面を自動解除）。※公式のプレイヤー設定の「次の動画を自動再生」はONのままにしてください。「nicovideo-autoplay-canceler」「nicovideo-player-expander」は別のスクリプトです。
// @homepageURL https://github.com/dnek/nicovideo-next-video-canceler
// @match       https://www.nicovideo.jp/*
// @grant       none
// @license     MIT license
// @downloadURL https://update.greasyfork.org/scripts/502712/nicovideo-next-video-canceler.user.js
// @updateURL https://update.greasyfork.org/scripts/502712/nicovideo-next-video-canceler.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const observer = new MutationObserver((mutationList, observer) => {
        mutationList.filter(mutation => mutation.type === 'childList').forEach(mutation => {
            for (const node of mutation.addedNodes) {
                if (
                    node.nodeType === 1 &&
                    node.tagName === 'DIV' &&
                    node.innerHTML.includes('data-element-name="next_video_confirmation_cancel"')
                ) {
                    const buttonEl = node.querySelector('button[data-element-name="next_video_confirmation_cancel"]');
                    if (buttonEl !== null) {
                        buttonEl.click();
                        console.log('next video cancel button clicked.');

                        const fullScreenButtonEl = document.querySelector('button[aria-label="ブラウザ内最大化解除（b）"]') || document.querySelector('button[aria-label="全画面表示を終了"]');
                        if (fullScreenButtonEl !== null) {
                            fullScreenButtonEl.click();
                            console.log('full screen exit button clicked.');
                        }
                    }
                }
            }
        });
    });
    const options = {
        childList: true,
        subtree: true,
    };
    observer.observe(document.body, options);
})();
