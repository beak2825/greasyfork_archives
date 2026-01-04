// ==UserScript==
// @name         クリックしたらメディアに移動して、メディアを見ようとしたらポストに飛ぶ
// @namespace    https://github.com/Edamamesukai
// @version      1.0
// @description  タイトルの通り
// @author       Edamame_sukai
// @match        https://x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540605/%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%97%E3%81%9F%E3%82%89%E3%83%A1%E3%83%87%E3%82%A3%E3%82%A2%E3%81%AB%E7%A7%BB%E5%8B%95%E3%81%97%E3%81%A6%E3%80%81%E3%83%A1%E3%83%87%E3%82%A3%E3%82%A2%E3%82%92%E8%A6%8B%E3%82%88%E3%81%86%E3%81%A8%E3%81%97%E3%81%9F%E3%82%89%E3%83%9D%E3%82%B9%E3%83%88%E3%81%AB%E9%A3%9B%E3%81%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/540605/%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%97%E3%81%9F%E3%82%89%E3%83%A1%E3%83%87%E3%82%A3%E3%82%A2%E3%81%AB%E7%A7%BB%E5%8B%95%E3%81%97%E3%81%A6%E3%80%81%E3%83%A1%E3%83%87%E3%82%A3%E3%82%A2%E3%82%92%E8%A6%8B%E3%82%88%E3%81%86%E3%81%A8%E3%81%97%E3%81%9F%E3%82%89%E3%83%9D%E3%82%B9%E3%83%88%E3%81%AB%E9%A3%9B%E3%81%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 監視したいターゲットノードを起点に処理をする
    const observer = new MutationObserver(() => {
        for (const tweetNode of document.querySelectorAll('article:not(.checkMediaClick)')) {
            // クリックしたらメディアに移動する部分
            (() => {
                //console.log(tweetNode);
                // アイコンのノード
                const iconNode = document.evaluate('./div/div/div[2]/div[1]/div/div/div/div/div[2]/div/div[2]/div/a',
                                                   tweetNode,
                                                   null,
                                                   XPathResult.FIRST_ORDERED_NODE_TYPE,
                                                   null).singleNodeValue;

                iconNode.onclick = () => {
                    const isMediaClick = setInterval(() => {
                        const profileTimeline = document.querySelector('[aria-label="プロフィールタイムライン"]')
                        if (profileTimeline) {
                            clearInterval(isMediaClick);

                            // メディアのボタンのノード
                            const mediaButtonNode = Array.from(profileTimeline.getElementsByTagName('a')).slice(-1)[0];


                            // ボタンをクリックする
                            mediaButtonNode.click();
                        };
                    }, 100);
                    tweetNode.classList.add('checkMediaClick');
                };
            })();
        };

        // メディアを見ようとしたらポストに飛ぶ部分
        (() => {
            if (document.querySelector('[role="menuitem"]')?.getAttribute('href')?.includes('status') === true) {
                document.querySelector('[role="menuitem"]').click();
            };
        })();
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });

})();