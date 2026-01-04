// ==UserScript==
// @name         TwitterのRTをRTか引用RTかの確認なしで出来るようにする
// @namespace    https://github.com/Edamamesukai
// @version      1.0.1
// @description タイトルの通りです
// @author       Edamame_sukai
// @match        https://twitter.com/*
// @match        https://tweetdeck.twitter.com/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/467313/Twitter%E3%81%AERT%E3%82%92RT%E3%81%8B%E5%BC%95%E7%94%A8RT%E3%81%8B%E3%81%AE%E7%A2%BA%E8%AA%8D%E3%81%AA%E3%81%97%E3%81%A7%E5%87%BA%E6%9D%A5%E3%82%8B%E3%82%88%E3%81%86%E3%81%AB%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/467313/Twitter%E3%81%AERT%E3%82%92RT%E3%81%8B%E5%BC%95%E7%94%A8RT%E3%81%8B%E3%81%AE%E7%A2%BA%E8%AA%8D%E3%81%AA%E3%81%97%E3%81%A7%E5%87%BA%E6%9D%A5%E3%82%8B%E3%82%88%E3%81%86%E3%81%AB%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定時処理する
    setInterval(() => {
        // RTをするか引用RTをするか確認するダイアログをすっ飛ばしてRTする、またはRTを取り消すダイアログをすっ飛ばしてRTを取り消す
        if (document.querySelector('[data-testid="retweetConfirm"]')) {
            document.querySelector('[data-testid="retweetConfirm"]').click()
        } else if (document.querySelector('[data-testid="unretweetConfirm"]')) {
            document.querySelector('[data-testid="unretweetConfirm"]').click()
        }
    }, 500);
})();