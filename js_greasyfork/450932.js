// ==UserScript==
// @name         駿河屋のお気に入りリスト、入荷リストから購入可能商品のみハイライト
// @license      Apache License 2.0
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  駿河屋の購入可能なお気に入り商品のハイライティングをします
// @author       Keisuke URAGO <bravo@resourcez.org>
// @match        https://www.suruga-ya.jp/pcmypage/action_favorite_list/detail/*
// @match        https://www.suruga-ya.jp/pcmypage/action_nyuka_search/list*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=suruga-ya.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450932/%E9%A7%BF%E6%B2%B3%E5%B1%8B%E3%81%AE%E3%81%8A%E6%B0%97%E3%81%AB%E5%85%A5%E3%82%8A%E3%83%AA%E3%82%B9%E3%83%88%E3%80%81%E5%85%A5%E8%8D%B7%E3%83%AA%E3%82%B9%E3%83%88%E3%81%8B%E3%82%89%E8%B3%BC%E5%85%A5%E5%8F%AF%E8%83%BD%E5%95%86%E5%93%81%E3%81%AE%E3%81%BF%E3%83%8F%E3%82%A4%E3%83%A9%E3%82%A4%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/450932/%E9%A7%BF%E6%B2%B3%E5%B1%8B%E3%81%AE%E3%81%8A%E6%B0%97%E3%81%AB%E5%85%A5%E3%82%8A%E3%83%AA%E3%82%B9%E3%83%88%E3%80%81%E5%85%A5%E8%8D%B7%E3%83%AA%E3%82%B9%E3%83%88%E3%81%8B%E3%82%89%E8%B3%BC%E5%85%A5%E5%8F%AF%E8%83%BD%E5%95%86%E5%93%81%E3%81%AE%E3%81%BF%E3%83%8F%E3%82%A4%E3%83%A9%E3%82%A4%E3%83%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const addTarget = node => {
        for(var e of node.querySelectorAll('td.gnavBox')) {
            if(e.querySelector('input[type=button]').value.match(/^カ/)){
                e.style.backgroundColor='#CCFFCC'
            }
            for (var a of e.querySelectorAll('a[href*="/product/detail/"]')) {
                a.setAttribute('target', '_blank')
            }
        }
    }
    window.addEventListener('load', () => {
        const container = document.querySelector('.read.mt10')
        addTarget(container)

        const observer = new MutationObserver((mutations) => {
            for(var mutation of mutations) {
                if (mutation.type == 'childList') {
                    for(var node of mutation.addedNodes) {
                        addTarget(node)
                    }
                }
            }
        });

        const config = { attributes: false, childList: true, characterData: false };

        observer.observe(container, config);
    })
})();