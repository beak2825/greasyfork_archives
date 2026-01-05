// ==UserScript==
// @id              9chConvert
// @name            旧２ｃｈ変換
// @version         0.1.1
// @namespace       Anonymous.2ch
// @author          nsmr0604
// @description     新しい２ちゃんねるにようこそ
// @license         Public Domain
// @include         http*://2ch.net/*
// @include         http*://5ch.net/*
// @include         http*://*.2ch.net/*
// @include         http*://*.5ch.net/*
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/14887/%E6%97%A7%EF%BC%92%EF%BD%83%EF%BD%88%E5%A4%89%E6%8F%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/14887/%E6%97%A7%EF%BC%92%EF%BD%83%EF%BD%88%E5%A4%89%E6%8F%9B.meta.js
// ==/UserScript==

(function () {
document.location.replace(document.URL.replace("https://","http://").replace("5ch","2ch").replace("2ch.net","2ch.sc"));
})();