// ==UserScript==
// @name 在kemono.party和coomer.party中使用滾輪翻頁
// @name:zh-TW 在kemono.party和coomer.party中使用滾輪翻頁
// @name:ja kemono.partyとcoomer.partyでマウスホイールでページを切り替える
// @name:en Scroll with Mouse Wheel for Page Navigation on kemono.party and coomer.party
// @namespace http://tampermonkey.net/
// @version 1.02
// @description 當你將滾輪滾動至頁面頂部或底部時觸發翻頁。
// @description:zh-TW 當你將滾輪滾動至頁面頂部或底部時觸發翻頁。在作者頁面自動展開作者所有作品。
// @description:ja スクロールがページのトップまたはボトムに達した時に自動的にページを切り替えます。作者のページでは自動的に作者のすべての作品を展開します。
// @description:en Automatically switch pages when scrolling to the top or bottom of the page. Automatically expands all works by the artist on the artist's page.
// @author Max
// @match https://kemono.party/*
// @match https://coomer.party/*
// @exclude https://kemono.party/*/user/*/post/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=https://kemono.party
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469480/%E5%9C%A8kemonoparty%E5%92%8Ccoomerparty%E4%B8%AD%E4%BD%BF%E7%94%A8%E6%BB%BE%E8%BC%AA%E7%BF%BB%E9%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/469480/%E5%9C%A8kemonoparty%E5%92%8Ccoomerparty%E4%B8%AD%E4%BD%BF%E7%94%A8%E6%BB%BE%E8%BC%AA%E7%BF%BB%E9%A0%81.meta.js
// ==/UserScript==

var nextPageButton = document.querySelector('.next');
var prevPageButton = document.querySelector('.prev');
var artistsPageTimeout = null;

function scrollToBottomAndRedirect() {
    if (nextPageButton) {
        nextPageButton.click();
        // console.log("已點擊下一頁按鈕:", nextPageButton);
    } else {
        // console.log("無法找到下一頁按鈕");
    }
}

function scrollToTopAndRedirect() {
    if (prevPageButton) {
        prevPageButton.click();
        // console.log("已觸發上一頁按鈕:", prevPageButton);
    } else {
        // console.log("無法找到上一頁按鈕");
    }
}

function handleScroll() {
    var scrollThreshold = 2;

    var isBottom = document.documentElement.scrollHeight - window.innerHeight - window.pageYOffset <= scrollThreshold;
    if (isBottom) {
        scrollToBottomAndRedirect();
    }
    if (window.pageYOffset <= 0) {
        scrollToTopAndRedirect();
    }
    checkArtistsPage();
}

function checkArtistsPage() {
    if (window.location.href.includes('artists') || window.location.href.startsWith('https://kemono.party/posts')|| window.location.href.startsWith('https://coomer.party/posts')) {
        if (!artistsPageTimeout) {
            artistsPageTimeout = setTimeout(function() {
                nextPageButton = document.querySelector('.next.paginator-button-ident');
                prevPageButton = document.querySelector('.prev.paginator-button-ident');
                artistsPageTimeout = null;
            }, 500);
        }
    }
}

window.addEventListener('scroll', handleScroll);
