// ==UserScript==
// @name         Twitter counter eraser
// @name:ja      [Twitter] カウンターを非表示
// @description  Hide the Twitter's Reply/Favorite/Retweet Counter. [The new UI is not supported at the moment]
// @description:ja Twitterから、リプライ/お気に入り/リツイートのカウンターを削除。他人の承認が見てられない人のためのプラグインです。※新UIには今の所対応しておりません。
// @namespace    masshiro.blog
// @version      20200412
// @author       masshiro
// @license      MIT License
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37113/Twitter%20counter%20eraser.user.js
// @updateURL https://update.greasyfork.org/scripts/37113/Twitter%20counter%20eraser.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode('.ProfileTweet-actionCountForPresentation,.MomentCapsuleLikesCount,.tweet-stats-container,[data-testid="viewCount"]{display:none !important;}'));
    document.getElementsByTagName('head')[0].appendChild(style);
})();