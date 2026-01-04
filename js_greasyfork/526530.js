// ==UserScript==
// @name           Add quote RT link to Twitter
// @name:ja        Twitter引用RTリンク追加
// @description    Add a link to view people who liked or retweeted.
// @description:ja 引用リツイートやいいねした人を見るリンクを追加
// @namespace      http://tampermonkey.net/
// @version        0.2／ＰＣ用カスタム
// @namespace      kmikrt
// @license        MIT
// @match          *://twitter.com/*
// @match          *://mobile.twitter.com/*
// @match          *://x.com/*
// @match          *://mobile.x.com/*
// @grant          none
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/526530/Add%20quote%20RT%20link%20to%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/526530/Add%20quote%20RT%20link%20to%20Twitter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createTweetActionsContainer(containerId, url) {
        const container = document.createElement('div');
        container.id = containerId;
        container.innerHTML = `
        <div role="group" class="css-1dbjc4n r-18u37iz r-1w6e6rj" style="height: 60px; display: flex; align-items: center; white-space: nowrap;">
            <div role="separator" class="css-1dbjc4n r-1dgieki r-1efd50x r-5kkj8d r-109y4c4 r-13qz1uu"></div>
            <div class="css-1dbjc4n r-1mf7evn r-1yzf0co">
                <a href="${url}/retweets" class="css-4rbku5 css-18t94o4 css-901oao r-18jsvk2 r-1loqt21 r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0" style="white-space: nowrap; text-decoration: none;">
                    <div class="css-1dbjc4n r-xoduu5 r-1udh08x"></div>
                    <span class="css-901oao css-16my406 r-poiln3 r-1b43r93 r-1cwl3u0 r-bcqeeo r-qvutc0" style="color:rgba(83,100,113,1.00); font-size: 15px;">リツイート</span>
                </a>　
                <a href="${url}/quotes" class="css-4rbku5 css-18t94o4 css-901oao r-18jsvk2 r-1loqt21 r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0" style="white-space: nowrap; text-decoration: none;">
                    <div class="css-1dbjc4n r-xoduu5 r-1udh08x"></div>
                    <span class="css-901oao css-16my406 r-poiln3 r-1b43r93 r-1cwl3u0 r-bcqeeo r-qvutc0" style="color:rgba(83,100,113,1.00); font-size: 15px;">引用リツイート</span>
                </a>　
                <a href="${url}/likes" class="css-4rbku5 css-18t94o4 css-901oao r-18jsvk2 r-1loqt21 r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0" style="white-space: nowrap; text-decoration: none;">
                    <div class="css-1dbjc4n r-xoduu5 r-1udh08x"></div>
                    <span class="css-901oao css-16my406 r-poiln3 r-1b43r93 r-1cwl3u0 r-bcqeeo r-qvutc0" style="color:rgba(83,100,113,1.00); font-size: 15px;">いいね</span>
                </a>
            </div>　　
        </div>`;
        return container;
    }

    function applyTweetActionsContainer(selector, containerId) {
        if (!document.getElementById(containerId)) {
            const targetElement = document.querySelector(selector);
            if (targetElement) {
                const url = location.href.replace(/\/(photo|video)\/[1-4]$/, '');
                const container = createTweetActionsContainer(containerId, url);
                targetElement.before(container);
            }
        }
    }

    function intervalHandler() {
        const urlPattern = /\/status\/\d+(\/(photo|video)\/[1-4])?$/;
        const isStatusPage = urlPattern.test(location.href);

        if (isStatusPage) {
            if (/\/photo\/[1-4]$/.test(location.href)) {
                const parentSelector = '.css-175oi2r.r-aqfbo4.r-zchlnj.r-1d2f490.r-1xcajam.r-12vffkv';
                if (document.querySelector(parentSelector)) {
                    applyTweetActionsContainer(`${parentSelector} .css-175oi2r.r-1kbdv8c.r-18u37iz.r-1oszu61.r-3qxfft.r-n7gxbd.r-1dgieki.r-1efd50x.r-5kkj8d.r-h3s6tt.r-1wtj0ep.r-j5o65s.r-rull8r.r-qklmqi`, 'tweetActionsContainer2');
                    applyTweetActionsContainer(`${parentSelector} .css-175oi2r.r-1kbdv8c.r-18u37iz.r-1oszu61.r-3qxfft.r-n7gxbd.r-1dgieki.r-1efd50x.r-5kkj8d.r-h3s6tt.r-1wtj0ep`, 'tweetActionsContainer2');
                }
            } else {
                applyTweetActionsContainer('.css-175oi2r.r-1kbdv8c.r-18u37iz.r-1oszu61.r-3qxfft.r-n7gxbd.r-1dgieki.r-1efd50x.r-5kkj8d.r-h3s6tt.r-1wtj0ep.r-j5o65s.r-rull8r.r-qklmqi', 'tweetActionsContainer');
                applyTweetActionsContainer('.css-175oi2r.r-1kbdv8c.r-18u37iz.r-1oszu61.r-3qxfft.r-n7gxbd.r-1dgieki.r-1efd50x.r-5kkj8d.r-h3s6tt.r-1wtj0ep', 'tweetActionsContainer');
            }
        }
    }

    // 🔍 DOM監視開始（瞬時に対応）
    const observer = new MutationObserver(() => {
        intervalHandler();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // ⏱ フォールバックとして定期チェックも残す（安全対策）
    setInterval(() => {
        intervalHandler();
    }, 1000);
})();
