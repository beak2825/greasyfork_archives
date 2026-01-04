// ==UserScript==
// @name         pixiv 自動查看差分和評論
// @namespace    pixiv 自動查看差分和評論
// @version      8.0.1
// @description  pixiv 自動點擊圖片的查看全部和評論的瀏覽更多按鈕
// @author       fmnijk
// @match        https://www.pixiv.net/*
// @icon         https://www.google.com/s2/favicons?domain=pixiv.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/406482/pixiv%20%E8%87%AA%E5%8B%95%E6%9F%A5%E7%9C%8B%E5%B7%AE%E5%88%86%E5%92%8C%E8%A9%95%E8%AB%96.user.js
// @updateURL https://update.greasyfork.org/scripts/406482/pixiv%20%E8%87%AA%E5%8B%95%E6%9F%A5%E7%9C%8B%E5%B7%AE%E5%88%86%E5%92%8C%E8%A9%95%E8%AB%96.meta.js
// ==/UserScript==

/* $ and $$ */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/*----force listen to locationchange work start----*/
history.pushState = ( f => function pushState(){
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('pushstate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.pushState);

history.replaceState = ( f => function replaceState(){
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('replacestate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.replaceState);

window.addEventListener('popstate',()=>{
    window.dispatchEvent(new Event('locationchange'))
});
/*----force listen to locationchange work end----*/

function keeptrying(times, delay) {
    if(times == 0){
        return false;
    }

    if (!window.location.href.includes('/artworks/')) {
        return false;
    }

    // All keywords to match
    // 測試: https://www.pixiv.net/artworks/44298467
    const keywords = [
        /*多張插圖*/
        '查看全部', '查看全部', 'See all', 'すべて見る', '모두 보기',
        /*超長簡介(閱讀後續)*/
        '閱讀後續', '查看后续', 'Continue Reading', '続きを読む', '이어서 읽기',
        /*超長評論(閱讀後續) 和簡介一樣*/
        // '閱讀後續', '查看后续', 'Continue Reading', '続きを読む', '이어서 읽기',
        /*顯示更多評論(瀏覽更多)*/
        '瀏覽更多', '浏览更多', 'See more', 'もっと見る', '더보기',
        /*評論的評論(查看回復)*/
        '查看回復', '查看回复', 'Display Replies', '返信を見る', '답변 보기',

        /*忘了*/
        '查看歷史', '查看历史',
    ];

    // Click all buttons that match keywords
    function clickButtonsWithKeywords() {
        const buttons = $$('main > section > div > div button');
        buttons.forEach(button => {
            const text = button.textContent.trim();
            console.log(text);
            if (keywords.includes(text)) {
                button.click();
            }
        });
    }

    clickButtonsWithKeywords();

    setTimeout(( () => keeptrying(times - 1, delay) ), delay);
}

(window.onload = function () {
    'use strict';
    keeptrying(50, 200);
    window.addEventListener('locationchange', function (){
        keeptrying(50, 200);
    })
})();
