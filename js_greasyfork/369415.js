// ==UserScript==
// @name         Watermelon Zhihu
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  一个清净的知乎
// @author       Bluice Zhen
// @match        https://www.zhihu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369415/Watermelon%20Zhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/369415/Watermelon%20Zhihu.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function removeZhuanLan() {
        for (let i = 0; i < eCardList.children.length; i++) {
            if (eCardList.children[i].hidden == false) {
                let eMetaList = eCardList.children[i].getElementsByTagName('meta');
                for (let j = 0; j < eMetaList.length; j++) {
                    if (eMetaList[j].getAttribute('itemprop') === 'url' && eMetaList[j].getAttribute('content').match('zhuanlan')) {
                        eCardList.children[i].hidden = true;
                        console.debug('【Watermelon Zhihu】 屏蔽专栏文章：', eMetaList[j].getAttribute('content'));
                        break;
                    }
                }
            }
        }
    }

    console.debug('【Watermelon Zhihu】 开始运行');
    let eCardList = document.getElementsByClassName("TopstoryMain")[0].children[0];

    removeZhuanLan();
    eCardList.addEventListener('DOMNodeInserted', function () {
        if (window.cardListLength !== eCardList.children.length) {
            removeZhuanLan();
        }
    })
})();
