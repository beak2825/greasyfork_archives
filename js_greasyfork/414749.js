/* jshint esversion: 6 */
// ==UserScript==
// @name         popupTitleOverAnchorsOnMGS
// @namespace    https://greasyfork.org/ja/users/289387-unagionunagi
// @version      0.4
// @description  MGS動画/PRESTIGEで作品のリンクに(だいたいの)フルタイトルをポップアップ
// @author       unagiOnUnagi
// @match        *://www.mgstage.com/*
// @match        *://www.prestige-av.com/*
// @grant        none
// @license      GPL-2.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/414749/popupTitleOverAnchorsOnMGS.user.js
// @updateURL https://update.greasyfork.org/scripts/414749/popupTitleOverAnchorsOnMGS.meta.js
// ==/UserScript==

function addTitles(itemSelector='.rank_list > ul > li,' +
                    '.pickup_list > li,' +
                    '.carousel-2row-item-wrapper,' +
                    '.right_genre_inner',
                    titleSelector='.title',
                    cxtNode=document.body) {
    // タイトルを設定
    for (let item of cxtNode.querySelectorAll(itemSelector)) {
        const titleEl = item.querySelector(titleSelector);
        if (!titleEl) continue;

        const title = titleEl.textContent.trim();
        titleEl.title = title;
        item.querySelector('img:first-child').title = title;
    }
}

function* pageNum2Trim(pagination) {
    let pageLinks = pagination.querySelectorAll('a[value],strong');
    const length = pageLinks.length;
    if (length <= 5) return;

    pageLinks = Array.from(pageLinks);
    const currPage = pageLinks.findIndex(elem => elem.tagName == 'STRONG');
    const before = currPage - 2;
    const after = currPage + 2;
    if (before < 1) {
        yield* pageLinks.slice(5);
    } else if (currPage >= length - 2) {
        yield* pageLinks.slice(0, length - 5);
    } else {
        yield* pageLinks.filter((_, i) => i < before || i > after);
    }
}

function addTitlesOnMGS(url) {
    // MGS
    if (url.includes('/search/') || url.includes('ppv_advanced.php')) {
        // 検索結果 (商品リスト) ページ

        // ページネーションをページヘッダにも追加
        let pagination = document.querySelector('.pager_search_bottom > p');
        if (pagination) {
            pagination = pagination.cloneNode(true);
            for (let rmNode of pageNum2Trim(pagination)) {
                pagination.removeChild(rmNode);
            }
            let searchForm = document.querySelector('.search_form');
            searchForm.appendChild(pagination);
        }

        // 表示切替:「詳細あり」ならスキップ
        if (url.includes('&disp_type=detail')) return;

        addTitles();

        return;
    }

    // カテゴリトップページ
    for (let item of document.querySelectorAll('.item_box_inner')) {
        let titleSrc = item.querySelector('img.pake');
        if (titleSrc) {
            const title = titleSrc.alt;
            titleSrc.title = title;
            item.querySelector('.videottl').title = title;
        } else if ((titleSrc = item.querySelector('.title'))) {
            const title = titleSrc.textContent.trim();
            titleSrc.title = title;
            item.querySelector('img:first-child').title = title
        }
    }

    addTitles();
    addTitles('#products > li.product', 'p.name');

    // ランキング
    for (let rankingArea of document.querySelectorAll('.right_rank_area,' +
                                                      '.right_ppv_rank,' +
                                                      '.right_anime_rank')) {
        addTitles('ul > li',
                  '.title,.right_ppv_rank_title,.right_anime_rank_title',
                  rankingArea);
    }

    // ジャンル
    // addTitles('div.right_genre_inner');

    // 新着作品
    for (let latest of document.querySelectorAll('.right_latest_list_link')) {
        latest.title = latest.querySelector('p').textContent.trim();
    }
}

function addTitlesOnPrestige(root=document.body) {
    // Prestige-av.com
    for (let prod of root.querySelectorAll('.c-product-card')) {
        // console.log(prod);
        let title = prod.querySelector('img').alt;
        if (title) prod.title = title;
    }
}

(function() {

    const url = document.URL;

    if (url.includes('mgstage.com')) {
        addTitlesOnMGS(url);
    } else {
        addTitlesOnPrestige();

        const observer = new MutationObserver(mutations => {
            for (let mutation of mutations) {
                // console.log(mutation.target);
                addTitlesOnPrestige(mutation.target);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

    }

})();