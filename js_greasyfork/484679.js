// ==UserScript==
// @name         NovelAI Execution Audio Notifier
// @namespace    http://tampermonkey.net/
// @version      2024-01-19
// @description  NovelAIで生成が成功 or 失敗したら音を鳴らす
// @description:en  This script triggers an audible notification whenever NovelAI successfully generates an image, or fails to do so.
// @author       K. K.
// @match        https://novelai.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=novelai.net
// @grant        none
// @require      http://code.jquery.com/jquery-2.2.4.min.js
// @require      https://cdn.jsdelivr.net/npm/ion-sound@3.0.7/js/ion.sound.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484679/NovelAI%20Execution%20Audio%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/484679/NovelAI%20Execution%20Audio%20Notifier.meta.js
// ==/UserScript==

const $ = window.jQuery;

// 宛先が変わった？
const POST_TARGET_URL_ARRAY = [
    'https://api.novelai.net/ai/generate-image',
    'https://image.novelai.net/ai/generate-image',
];

$.ionSound({
    sounds: [
        {
            name: "button_tiny",
            volume: 0.5
        },
        {
            name: "water_droplet_2",
            volume: 0.1
        },
    ],

    path: "https://cdn.jsdelivr.net/npm/ion-sound@3.0.7/sounds/",
    preload: true,
    multiplay: true
});

(function() {
    'use strict';

    // 元のfetch関数を保存
    let originalFetch = window.fetch;

    // fetch関数をオーバーライド
    window.fetch = function() {
        let fetchArgs = arguments;
        let fetchUrl = fetchArgs[0];

        // 元のfetch関数を呼び出してプロミスを取得
        let fetchPromise = originalFetch.apply(this, fetchArgs);

        // POST先を見て生成先のURLなら完了時に処理を実行
        if (POST_TARGET_URL_ARRAY.includes(fetchUrl)) {
            console.log(`target url: ${fetchUrl}`);
            fetchPromise
                .then(response => {
                    if (!response.ok) {
                        console.error('Server Error:', response.url);
                        $.ionSound.play("water_droplet_2");
                    } else {
                        // console.log('Request Success:', response.url);
                        $.ionSound.play("button_tiny");
                    }
                })
                .catch(error => {
                    console.error('Request Error:', error);
                    $.ionSound.play("water_droplet_2");
                });
        }

        // オリジナルのプロミスを返す
        return fetchPromise;
    };
})();
