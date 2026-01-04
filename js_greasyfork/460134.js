// ==UserScript==
// @name         Twitter文章完全ミュート
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  公式ミュート機能は単語（とTwitterが認識した語句）にしか効きません。ブラウザ版Twitterでこれを解決します。ミュートワード編集はコード弄ってね。正規表現OK
// @author       匿名Cat
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460134/Twitter%E6%96%87%E7%AB%A0%E5%AE%8C%E5%85%A8%E3%83%9F%E3%83%A5%E3%83%BC%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/460134/Twitter%E6%96%87%E7%AB%A0%E5%AE%8C%E5%85%A8%E3%83%9F%E3%83%A5%E3%83%BC%E3%83%88.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // 文字列・正規表現のみに対応しています。それ以外は書かないで下さい。
  const NGs = [
    "ﾘｽｶ",
    /リスト?カ(ット)?/,
  ]

  console.log('Twitter文章完全ミュート')
  $?.noConflict()
  jQuery(document).ready($ => {
    $(document).arrive('[id^=id__]', tweet => {
      const tweetTxt = tweet.innerText
      const isNG = NGs.find(ng => typeof ng == 'string' ? !!~tweetTxt.indexOf(ng) : ng?.test(tweetTxt))
      if (isNG) $(tweet.closest('[data-testid="cellInnerDiv"]')).css('display', 'none')
    })
  })
})();