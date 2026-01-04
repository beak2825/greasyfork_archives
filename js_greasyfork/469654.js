// ==UserScript==
// @name         Tweetdecコレクション操作改善
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  コレクションを表示してるときの操作を改善
// @author       y_kahou
// @match        https://tweetdeck.twitter.com/
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/469654/Tweetdec%E3%82%B3%E3%83%AC%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3%E6%93%8D%E4%BD%9C%E6%94%B9%E5%96%84.user.js
// @updateURL https://update.greasyfork.org/scripts/469654/Tweetdec%E3%82%B3%E3%83%AC%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3%E6%93%8D%E4%BD%9C%E6%94%B9%E5%96%84.meta.js
// ==/UserScript==


if (typeof GM_getValue('addCollectionHide') === "undefined") { GM_setValue('addCollectionHide', false) }
if (typeof GM_getValue('actionsMenuHide') === "undefined") { GM_setValue('actionsMenuHide', false) }
if (typeof GM_getValue('dragHandleHide') === "undefined") { GM_setValue('dragHandleHide', false) }

// addCollectionボタンを非表示
let addCollectionHide = GM_getValue('addCollectionHide', false);
if (addCollectionHide) {
    GM_addStyle(' ul.tweet-actions>li[title="Add Collection"] { display: none; } ')
}
// アクションメニュー「…」ボタンを非表示
let actionsMenuHide = GM_getValue('actionsMenuHide', false);
if (actionsMenuHide) {
    GM_addStyle(' ul.tweet-actions>li:nth-child(4) { display: none; } ')
}
// Drag to Collection「十」矢印ボタンを非表示
let dragHandleHide = GM_getValue('dragHandleHide', false);
if (dragHandleHide) {
    GM_addStyle(' li.tweet-drag-handle { display: none; } ')
}





class AddCollection {

    inject(article) {
        let btn_group = article.querySelector('div[role="group"]:last-of-type, ul.tweet-actions, ul.tweet-detail-actions');

        if (btn_group.querySelector('[rel="removeFromCustomTimeline"]')) {
            return;
        }

        let handle = btn_group.querySelector('.tweet-drag-handle');
        handle.classList.remove('margin-l--7');
        handle.classList.add('margin-r--10');

        let collection = handle.cloneNode(true);
        collection.setAttribute('title', 'Add Collection')
        collection.classList.remove('tweet-drag-handle');
        collection.classList.remove('margin-l--7');
        collection.classList.add('margin-r--10');
        collection.querySelector('i').classList.remove('icon-move');
        collection.querySelector('i').classList.add('icon-custom-timeline');
        collection.querySelector('span.is-vishidden').textContent = 'Add Collection';
        collection.addEventListener('click', e => {
            this.click(btn_group);
            e.stopPropagation();
        })
        btn_group.appendChild(collection);

        article.dataset.c_injected = 'true';
    }

    async click(group) {
        let menu = group.querySelector('li:nth-child(4)');
        menu.querySelector('a').click();
        await wait(200)

        let ac = menu.querySelector('.feature-customtimelines')
        ac.classList.add('is-selected')
        ac.querySelector('a').click()
        await wait(200)

        if (document.querySelector('#actions-modal h3').textContent != ' Include Tweet in:') {
            return;
        }
        if (document.querySelectorAll('#actions-modal li').length == 1) {
            let checkbox = document.querySelector('#actions-modal li [type="checkbox"]');
            if (!checkbox.checked) {
                checkbox.click()
            }
            document.querySelector('#actions-modal button').click();
        }
    }
}
function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    })
}


(function () {
    const AD = new AddCollection();

    // 全体を監視してボタン追加の処理を実行
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(node => {
        let article = node.tagName == 'ARTICLE' && node || node.tagName == 'DIV' && (node.querySelector('article') || node.closest('article'));
        if (article && !article.dataset.c_injected && article.dataset.tweetId) AD.inject(article);
    }))).observe(document.body, {childList: true, subtree: true});
})();