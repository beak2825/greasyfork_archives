// ==UserScript==
// @name         alwaysmsdeck
// @namespace    https://twitter.com/_phocom
// @version      0.1
// @description  TweetDeck で投稿時刻を常にミリ秒まで表示
// @author       @_phocom
// @match       https://tweetdeck.twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409909/alwaysmsdeck.user.js
// @updateURL https://update.greasyfork.org/scripts/409909/alwaysmsdeck.meta.js
// ==/UserScript==

(function () {
  'use strict'

  function update() {
    let elms = document.querySelectorAll("time");
    elms.forEach(function (elm) {
      let time = elm.firstElementChild;
      if (time.href && time.href.split("/").length >= 6) {
        let id = time.href.split("/")[5];
        time.innerHTML = formatDate(getDateFromSnowFrake(id));
      }
    });
  }
  function getDateFromSnowFrake(id) {
    if (id < 10000000000) return;
    var unixTime = Math.floor(Number(id) / 4194304) + 1288834974657;
    return new Date(unixTime);
  }
  function formatDate(date) {
    return `${date.getMonth() + 1}月` +
      `${date.getDate()}日 ` +
      `${date.getHours().toString().padStart(2, '0')}:` +
      `${date.getMinutes().toString().padStart(2, '0')}:` +
      `${date.getSeconds().toString().padStart(2, '0')}.` +
      `${date.getMilliseconds().toString().padStart(3, '0')} `
  }
  setInterval(update, 300);
})()