// ==UserScript==
// @name         Timeline Refresher for New TweetDeck
// @namespace    https://twitter.com/@7vU6jrZRuX2ffkY
// @version      0.2.1
// @description  新TweetDeckのTL更新間隔を10秒にするやつ
// @author       @7vU6jrZRuX2ffkY
// @match        https://tweetdeck.twitter.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470357/Timeline%20Refresher%20for%20New%20TweetDeck.user.js
// @updateURL https://update.greasyfork.org/scripts/470357/Timeline%20Refresher%20for%20New%20TweetDeck.meta.js
// ==/UserScript==

setInterval(()=>{
  document.querySelectorAll("div[aria-label^='列を更新']").forEach(d=>{
    if(d.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector("[data-viewportview]").scrollTop==0) d.click();
  });
},10000);