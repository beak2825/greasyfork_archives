// ==UserScript==
// @name         homesのPRを非表示にするやつ
// @namespace    http://tampermonkey.net/
// @version      0.4.2
// @description  homes.co.jpの特定のページで特定のdivを非表示にする
// @author       Honahuku
// @match        https://www.homes.co.jp/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480915/homes%E3%81%AEPR%E3%82%92%E9%9D%9E%E8%A1%A8%E7%A4%BA%E3%81%AB%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/480915/homes%E3%81%AEPR%E3%82%92%E9%9D%9E%E8%A1%A8%E7%A4%BA%E3%81%AB%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hidePRDivs() {
        var icons = document.querySelectorAll('span.icon');
        icons.forEach(function(icon) {
            if (icon.textContent.trim() === 'PR') {
                var parentDiv = icon.closest('div.ui-frame');
                if (parentDiv) {
                    parentDiv.style.display = 'none';
                }
            }
        });
    }

    // ページが読み込まれたら実行する
    window.addEventListener('load', function() {
        hidePRDivs();

        // searchResult要素の変更を監視する
        var observer = new MutationObserver(hidePRDivs);
        var target = document.getElementById('searchResult');
        if (target) {
            observer.observe(target, { childList: true, subtree: true });
        }
    }, false);
})();
