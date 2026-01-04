// ==UserScript==
// @name         soul モバイル版 5ch スクロール不可広告削除
// @namespace    
// @version      2025-03-13
// @description  スクロールを可能にする
// @author       あるぱか
// @match        https://itest.5ch.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=5ch.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529678/soul%20%E3%83%A2%E3%83%90%E3%82%A4%E3%83%AB%E7%89%88%205ch%20%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB%E4%B8%8D%E5%8F%AF%E5%BA%83%E5%91%8A%E5%89%8A%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/529678/soul%20%E3%83%A2%E3%83%90%E3%82%A4%E3%83%AB%E7%89%88%205ch%20%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB%E4%B8%8D%E5%8F%AF%E5%BA%83%E5%91%8A%E5%89%8A%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("body").classList.remove("is5x7asParentNoScroll");
})();