// ==UserScript==
// @name                Youtube: Hide Rating Bar
// @name:zh-TW          Youtube 隱藏評價欄
// @name:zh-CN          Youtube 隐藏评分栏
// @name:ja             Youtube 評価バーを非表示
// @name:ko             Youtube 등급 표시 줄 숨기기
// @name:ru             Youtube Скрыть панель рейтинга
// @version             1.0.0
// @description         Hide the Like/Dislike bar.
// @description:zh-TW   隱藏 喜歡/不喜歡 的評價欄。
// @description:zh-CN   隐藏 喜欢/不喜欢 的评分栏。
// @description:ja      高評価/低評価 バーを非表示にします。
// @description:ko      좋아요 / 싫어요 표시 줄을 숨 깁니다.
// @description:ru      Скрыть панель «Мне нравится / не нравится».
// @author              Hayao-Gai
// @namespace           https://github.com/HayaoGai
// @icon                https://upload.wikimedia.org/wikipedia/commons/4/4c/YouTube_icon.png
// @match               https://www.youtube.com/*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/404319/Youtube%3A%20Hide%20Rating%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/404319/Youtube%3A%20Hide%20Rating%20Bar.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    const targets = [
        //"ytd-toggle-button-renderer", // button
        "yt-formatted-string.style-scope.ytd-toggle-button-renderer", // number
        //"paper-tooltip.style-scope.ytd-toggle-button-renderer", // tooltip
        "#sentiment" // bar
    ];

    let href = document.location.href;

    init(10);

    observation();

    function init(times) {
        for (let i = 0; i < times; i++) {
            for (const target of targets) {
                setTimeout(() => hideTarget(target), 500 * i);
            }
        }
    }

    function hideTarget(target) {
        document.querySelectorAll(target).forEach(t => t.remove());
    }

    function observation() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => {
                if (href != document.location.href) {
                    href = document.location.href;
                    init(10);
                }
            });
        });
        const target = document.querySelector("body");
        const config = { childList: true, subtree: true };
        observer.observe(target, config);
    }

})();
