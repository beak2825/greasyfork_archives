// ==UserScript==
// @name                Twitter: Hide Retweet
// @name:zh-TW          Twitter 隱藏轉推
// @name:zh-CN          Twitter 隐藏转推
// @name:ja             Twitter リツイートを非表示
// @name:ko             Twitter 리트 윗 숨기기
// @name:ru             Twitter Скрыть ретвит
// @version             1.0.10
// @description         Hide retweet, like, reply, and follow posts on your twitter timeline.
// @description:zh-TW   隱藏 Twitter 時間軸上轉推、喜歡、回覆、和跟隨的文章。
// @description:zh-CN   隐藏 Twitter 时间轴上转推、喜欢、回复、和关注的帖子。
// @description:ja      Twitter のタイムラインでリツイート、いいね、返信、フォロー投稿を非表示にします。
// @description:ko      트위터 타임 라인에서 리트 윗, 좋아요, 팔로 답글 및 게시물을 숨 깁니다.
// @description:ru      Скрывайте ретвиты, лайки, следовать ответы и посты в своем твиттере.
// @author              Hayao-Gai
// @namespace           https://github.com/HayaoGai
// @icon                https://i.imgur.com/M9oO8K9.png
// @match               https://twitter.com/*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/384702/Twitter%3A%20Hide%20Retweet.user.js
// @updateURL https://update.greasyfork.org/scripts/384702/Twitter%3A%20Hide%20Retweet.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    // retweet, like, reply, follow
    const targets = [
        `path[d="M23.615 15.477c-.47-.47-1.23-.47-1.697 0l-1.326 1.326V7.4c0-2.178-1.772-3.95-3.95-3.95h-5.2c-.663 0-1.2.538-1.2 1.2s.537 1.2 1.2 1.2h5.2c.854 0 1.55.695 1.55 1.55v9.403l-1.326-1.326c-.47-.47-1.23-.47-1.697 0s-.47 1.23 0 1.697l3.374 3.375c.234.233.542.35.85.35s.613-.116.848-.35l3.375-3.376c.467-.47.467-1.23-.002-1.697zM12.562 18.5h-5.2c-.854 0-1.55-.695-1.55-1.55V7.547l1.326 1.326c.234.235.542.352.848.352s.614-.117.85-.352c.468-.47.468-1.23 0-1.697L5.46 3.8c-.47-.468-1.23-.468-1.697 0L.388 7.177c-.47.47-.47 1.23 0 1.697s1.23.47 1.697 0L3.41 7.547v9.403c0 2.178 1.773 3.95 3.95 3.95h5.2c.664 0 1.2-.538 1.2-1.2s-.535-1.2-1.198-1.2z"]`,
        `path[d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"]`,
        `path[d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788z"]`,
        `path[d="M12.225 12.165c-1.356 0-2.872-.15-3.84-1.256-.814-.93-1.077-2.368-.805-4.392.38-2.826 2.116-4.513 4.646-4.513s4.267 1.687 4.646 4.513c.272 2.024.008 3.46-.806 4.392-.97 1.106-2.485 1.255-3.84 1.255zm5.849 9.85H6.376c-.663 0-1.25-.28-1.65-.786-.422-.534-.576-1.27-.41-1.968.834-3.53 4.086-5.997 7.908-5.997s7.074 2.466 7.91 5.997c.164.698.01 1.434-.412 1.967-.4.505-.985.785-1.648.785z"]`
    ];
    let currentUrl = document.location.href;
    let updating = false;

    init(10);

    locationChange();

    window.addEventListener("scroll", update);

    function init(times) {
        for (let i = 0; i < times; i++) {
            for (const target of targets) {
                setTimeout(() => findTarget(target), 500 * i);
            }
        }
    }

    function findTarget(target) {
        document.querySelectorAll(`${target}:not(.hide-retweet-set)`).forEach(t => {
            t.classList.add("hide-retweet-set");
            t.closest(".r-1ila09b").parentElement.style.display = "none";
        });
    }

    function update() {
        if (updating) return;
        updating = true;
        init(3);
        setTimeout(() => { updating = false; }, 1000);
    }

    function locationChange() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => {
                if (currentUrl !== document.location.href) {
                    currentUrl = document.location.href;
                    init(10);
                }
            });
        });
        const target = document.body;
        const config = { childList: true, subtree: true };
        observer.observe(target, config);
    }

})();
