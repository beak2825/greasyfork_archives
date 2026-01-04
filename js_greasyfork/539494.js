// ==UserScript==
// @name         Twitterでフォローしたりされたりしてたらツイートのアカウント名の色を変える
// @namespace    https://github.com/Edamamesukai
// @version      1.1
// @description  タイトルのまま
// @author       Edamame_sukai
// @match        https://x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539494/Twitter%E3%81%A7%E3%83%95%E3%82%A9%E3%83%AD%E3%83%BC%E3%81%97%E3%81%9F%E3%82%8A%E3%81%95%E3%82%8C%E3%81%9F%E3%82%8A%E3%81%97%E3%81%A6%E3%81%9F%E3%82%89%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E3%81%AE%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88%E5%90%8D%E3%81%AE%E8%89%B2%E3%82%92%E5%A4%89%E3%81%88%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/539494/Twitter%E3%81%A7%E3%83%95%E3%82%A9%E3%83%AD%E3%83%BC%E3%81%97%E3%81%9F%E3%82%8A%E3%81%95%E3%82%8C%E3%81%9F%E3%82%8A%E3%81%97%E3%81%A6%E3%81%9F%E3%82%89%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E3%81%AE%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88%E5%90%8D%E3%81%AE%E8%89%B2%E3%82%92%E5%A4%89%E3%81%88%E3%82%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 監視したいターゲットノードを起点に処理をする
    const observer = new MutationObserver(() => {
        for (const tweetNode of document.querySelectorAll('article:not(.checkFollowingAndFollowedBy)')) {
            // フォローしているか、フォローされているかの情報を取得できるノード
            const followInfoNode = document.evaluate('./div/div/div[2]/div[2]/div[last()]/div/div',
                                                     tweetNode,
                                                     null,
                                                     XPathResult.FIRST_ORDERED_NODE_TYPE,
                                                     null).singleNodeValue;

            // アカウント名の親ノード
            const accountNameNode = document.evaluate('./div/div/div[2]/div[2]/div[1]/div/div[1]/div/div/div[1]/div/a/div/div[1]/span',
                                                      tweetNode,
                                                      null,
                                                      XPathResult.FIRST_ORDERED_NODE_TYPE,
                                                      null).singleNodeValue;

            // どちらかまたは両方のノードがnullの場合飛ばす
            if (followInfoNode === null || accountNameNode === null) {
                tweetNode.classList.add('checkFollowingAndFollowedBy');
                continue;
            }


            try {
                const propertyNames = Object.getOwnPropertyNames(followInfoNode);

                for (const propName of propertyNames) {
                    if (propName.includes('__reactProps') === true) {
                        // フォローしているかされているかの状態を取得する
                        const isFollowing = followInfoNode[propName].children[1]?.props?.retweetWithCommentLink?.state?.quotedStatus?.user?.following;
                        const isFollowed_by = followInfoNode[propName].children[1]?.props?.retweetWithCommentLink?.state?.quotedStatus?.user?.followed_by;



                        // アカウント名の子ノードに色を付ける
                        for (const accountColorNode of accountNameNode.children) {
                            if (accountColorNode.innerText !== '' && isFollowing === true && isFollowed_by === true) { // フォローしててされてたら
                                accountColorNode.setAttribute('style', 'color: #32CD32;')
                            } else if (accountColorNode.innerText !== '' && isFollowing === true) { // フォローしてたら
                                accountColorNode.setAttribute('style', 'color: #1DA1F2;')
                            } else if (accountColorNode.innerText !== '' && isFollowed_by === true) { // フォローされてたら
                                accountColorNode.setAttribute('style', 'color: #ffa500;')
                            } else { // 当てはまらなかったら
                                accountColorNode.setAttribute('style', 'color: #a9a9a9;')
                            };
                        };
                    };
                };

            } catch (error) {
                console.error(error);
                // console.log(tweetNode);

            } finally {
                tweetNode.classList.add('checkFollowingAndFollowedBy');
                // console.log('クラスが追加されました:', tweetNode.className);
            };
        };
    });

    observer.observe(document, { // documentを監視のターゲットにする
        childList: true,
        subtree: true
    });


})();