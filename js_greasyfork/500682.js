// ==UserScript==
// @name           IPA試験過去問
// @name:ja      IPA試験過去問
// @namespace    https://greasyfork.org/ja/users/570127
// @version      1.0.0
// @description  右矢印で次の問題です
// @description:ja 右矢印で次の問題です
// @author       universato
// @grant        none
// @match        https://www.nw-siken.com/*
// @license      MIT
// @supportURL   https://twitter.com/universato
// @downloadURL https://update.greasyfork.org/scripts/500682/IPA%E8%A9%A6%E9%A8%93%E9%81%8E%E5%8E%BB%E5%95%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/500682/IPA%E8%A9%A6%E9%A8%93%E9%81%8E%E5%8E%BB%E5%95%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowRight'){
            document.querySelector("button.submit").click(); // 次の問題へ
        }
    });
})();