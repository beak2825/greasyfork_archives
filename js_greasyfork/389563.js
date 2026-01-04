// ==UserScript==
// @name         Togetterの「この続きを読む」を自動でクリック
// @namespace    https://ciffelia.com/
// @version      1.0.1
// @description  Togetterの「この続きを読む」を自動でクリックします
// @author       Ciffelia <mc.prince.0203@gmail.com> (https://ciffelia.com/)
// @match        https://togetter.com/li/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/389563/Togetter%E3%81%AE%E3%80%8C%E3%81%93%E3%81%AE%E7%B6%9A%E3%81%8D%E3%82%92%E8%AA%AD%E3%82%80%E3%80%8D%E3%82%92%E8%87%AA%E5%8B%95%E3%81%A7%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/389563/Togetter%E3%81%AE%E3%80%8C%E3%81%93%E3%81%AE%E7%B6%9A%E3%81%8D%E3%82%92%E8%AA%AD%E3%82%80%E3%80%8D%E3%82%92%E8%87%AA%E5%8B%95%E3%81%A7%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF.meta.js
// ==/UserScript==

(() => {
  document.getElementById('more_tweet_btn').click()
})()
