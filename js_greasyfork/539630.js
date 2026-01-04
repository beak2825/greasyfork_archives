// ==UserScript==
// @name         =LOVE, ≠ME, ≒JOY スマホ版ページをPC版にリダイレクトする
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Redirects from sp.subdomains for =LOVE, ≠ME, and ≒JOY to their main sites.
// @author       anonymous
// @match        https://sp.equal-love.jp/*
// @match        https://sp.not-equal-me.jp/*
// @match        https://sp.nearly-equal-joy.jp/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539630/%3DLOVE%2C%20%E2%89%A0ME%2C%20%E2%89%92JOY%20%E3%82%B9%E3%83%9E%E3%83%9B%E7%89%88%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92PC%E7%89%88%E3%81%AB%E3%83%AA%E3%83%80%E3%82%A4%E3%83%AC%E3%82%AF%E3%83%88%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/539630/%3DLOVE%2C%20%E2%89%A0ME%2C%20%E2%89%92JOY%20%E3%82%B9%E3%83%9E%E3%83%9B%E7%89%88%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92PC%E7%89%88%E3%81%AB%E3%83%AA%E3%83%80%E3%82%A4%E3%83%AC%E3%82%AF%E3%83%88%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const newUrl = window.location.href.replace('//sp.', '//');
    window.location.replace(newUrl);
})();