// ==UserScript==
// @name         Twitterツイート保存
// @namespace    https://github.com/Edamamesukai
// @version      1.1
// @description  タイトルのまま
// @author       Edamame_sukai
// @match        https://x.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/540404/Twitter%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/540404/Twitter%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Tampermonkeyストレージのキー名
    const STORAGE_KEY = 'savedTweetsData';

    // 最初に保存されたツイートを保存する
    console.log(JSON.parse(GM_getValue(STORAGE_KEY, '[]')));

    // 監視したいターゲットノードを起点に処理をする
    const observer = new MutationObserver(() => {
        for (const tweetNode of document.querySelectorAll('article:not(.checkSavedTweet)')) {
            try {
                // ツイート本文のそれぞれのテキスト
                const tweetTextNode = tweetNode.querySelector('[data-testid="tweetText"]')?.children ?? []

                // ツイート本文のテキストだけを取得する
                let tweetText = ''
                for (const tweetTextChildNode of tweetTextNode) {
                    tweetText = tweetText + tweetTextChildNode.innerText;
                };

                // アカウント名の親ノード
                const accountNameNode = document.evaluate('./div/div/div[2]/div[2]/div[1]/div/div[1]/div/div/div[1]/div/a/div/div[1]/span',
                                                          tweetNode,
                                                          null,
                                                          XPathResult.FIRST_ORDERED_NODE_TYPE,
                                                          null).singleNodeValue;

                // アカウント名を取得する
                let accountName = '';
                for (const accountNameChildNode of accountNameNode.children) {
                    if (accountNameChildNode.innerText !== '') {
                        accountName = accountName + accountNameChildNode.innerText;
                    } else {
                        accountName = accountName + accountNameChildNode.alt;
                    };
                };

                // ユーザーIDのノード
                const accountIDNode = document.evaluate('./div/div/div[2]/div[2]/div[1]/div/div[1]/div/div/div[2]/div/div[1]/a/div/span',
                                                        tweetNode,
                                                        null,
                                                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                                                        null).singleNodeValue;

                const accountID = accountIDNode.innerText;

                // ツイートした時間のノード
                const tweetTimestampNode = document.evaluate('./div/div/div[2]/div[2]/div[1]/div/div[1]/div/div/div[2]/div/div[3]/*/time',
                                                             tweetNode,
                                                             null,
                                                             XPathResult.FIRST_ORDERED_NODE_TYPE,
                                                             null).singleNodeValue;

                // tweetTimestampNodeのノードがない（時間がわからない）場合はnullにする
                const tweetTimestamp = tweetTimestampNode !== null
                ? tweetTimestampNode.getAttribute('datetime')
                : null;


                // tweetIDを取得する
                let tweetID = null;
                for (const tweetIDNode of tweetNode.getElementsByTagName('a')) {
                    if (isNaN(tweetIDNode.href.split('/').slice(-1)[0]) === false) {
                        tweetID = tweetIDNode.href.split('/')[5];
                        break;
                    };
                };

                const tweetURL = 'https://x.com/' + accountID.slice(1) + '/status/' + tweetID;

                const tweetData = {
                    tweetID: tweetID,
                    accountName: accountName,
                    tweetURL: tweetURL,
                    text: tweetText,
                    tweetTimestamp: tweetTimestamp,
                    savedTimestamp: new Date().getTime()
                };

                // ここでストレージを読み込んでtweetIDがあったら消してから上から保存する
                let tweetDatas = JSON.parse(GM_getValue(STORAGE_KEY, '[]'));

                if (!tweetDatas.some(tweetData => tweetData.tweetID === tweetID)) {
                    // console.log('ツイートがありません、追加します。');
                    tweetDatas.unshift(tweetData);
                } else {
                    // console.log('ツイートがありました');
                };

                // console.log(tweetData)
                // console.log(tweetDatas);

                GM_setValue(STORAGE_KEY, JSON.stringify(tweetDatas));

                tweetNode.classList.add('checkSavedTweet');
            } catch (error) {
                console.error(error);
                console.log('なにかのエラーでツイートが保存できませんでした');
                console.log(tweetNode);
            };
        };
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });

})();