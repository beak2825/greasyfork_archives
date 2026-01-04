// ==UserScript==
// @name         トップページをマシにするためのツール
// @namespace    http://tampermonkey.net/
// @version      2024-05-19
// @description  小説家になろうのトップページをマシにするツールです。
// @author       me
// @match        https://syosetu.com/user/top/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=syosetu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495597/%E3%83%88%E3%83%83%E3%83%97%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E3%83%9E%E3%82%B7%E3%81%AB%E3%81%99%E3%82%8B%E3%81%9F%E3%82%81%E3%81%AE%E3%83%84%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/495597/%E3%83%88%E3%83%83%E3%83%97%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E3%83%9E%E3%82%B7%E3%81%AB%E3%81%99%E3%82%8B%E3%81%9F%E3%82%81%E3%81%AE%E3%83%84%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

(function() {
    // 不要なレイアウトを削除
    document.querySelectorAll('.c-up-headline').forEach(x => {x.style.display = 'none';});
    document.querySelectorAll('.p-up-home-news__banner').forEach(x => {x.style.display = 'none';});
    document.querySelector('.l-main').style.width = '790px';
    document.querySelector('.l-sidebar').style.width = '240px';
    document.querySelector('.p-up-home-news__info-more').style.display = 'flex';
    document.querySelector('.p-up-home-news__info-more a').style.margin = '0 0 0 auto';

    // メニューを追加
    let originalMenu = document.createElement('div');
    let createNewNovel = document.createElement('a');
    createNewNovel.textContent = '作品を新規作成';
    createNewNovel.setAttribute('href', 'https://syosetu.com/usernovel/input/');
    createNewNovel.style.cssText = 'padding: 0.5rem 2rem; margin-left: 2rem; border: solid 2px #8d93c8; color: #333; border-radius: 1rem; letter-spacing: 0.1rem';
    originalMenu.appendChild(createNewNovel);
    document.querySelector('.p-up-home-news__info-more').prepend(originalMenu);

    // 「あなたの活動」の表示内容を改修
    let myContents = document.createElement('div');
    myContents.classList.add('myContents');
    let listElement1 = document.createElement('div'); // 投稿済み
    let listElement2 = document.createElement('div'); // 未投稿

    document.querySelectorAll('.c-up-panel.js-tab-b').forEach(x => {
        x.remove();
    });

    // 作品の作成・編集ページ情報をロード
    // 投稿済の一覧を取得
    fetch(`https://syosetu.com/usernovel/list/`)
        .then(data => data.text()).then(html => {listElement1.innerHTML = html;})
        .then(() => {
            // 取得した情報を追加
            myContents.appendChild(listElement1.querySelector('.c-up-panel__body'));
        })
        .then(() => {
            // 未投稿の一覧を取得
            fetch(`https://syosetu.com/usernovel/draftlist/`)
                .then(data => data.text()).then(html => {listElement2.innerHTML = html;})
                .then(() => {
                    // 取得した情報を追加
                    listElement2.querySelector('.c-up-panel__body').style.cssText = 'background-color: #fef4f4';
                    myContents.prepend(listElement2.querySelector('.c-up-panel__body'));
                    document.querySelector('.l-main').appendChild(myContents);

                    // 各話の情報を取得
                    document.querySelectorAll('.myContents .c-up-panel__list-item').forEach(xx => {
                        xx.style.display = 'flex';
                        xx.querySelector('.c-up-novel-item__date').remove();
                        xx.querySelector('.c-up-novel-item__data').remove();

                        // 未投稿フラグ
                        let isDraft = !!xx.querySelector('.c-up-label--novel-draft');
                        // R18フラグ
                        let isR18 = !!xx.querySelector('.c-up-novel-item__data-item--r18');
                        // 短編フラグ
                        let isShort = !!xx.querySelector('.c-up-label--novel-short');

                        // Nコード取得
                        let ncode = xx.querySelector('.c-up-novel-item__title a').getAttribute('href').match(/ncode\/(\d+)/)[1];

                        // 編集/追加ボタン
                        let buttonFlexBox = document.createElement('div');
                        buttonFlexBox.style.cssText = 'display: flex; gap: 0.1rem; margin-left: auto; white-space: nowrap;';
                        let editButton = document.createElement('a');
                        editButton.setAttribute('href', `https://syosetu.com/usernovelmanage/top/ncode/${ncode}`);
                        editButton.classList.add('c-button');
                        editButton.classList.add('c-button--primary');
                        editButton.classList.add('c-button--sm');
                        editButton.textContent = '編集';
                        editButton.style.cssText = 'height: 2rem;';
                        buttonFlexBox.appendChild(editButton);
                        if (!isShort) {
                            // ※短編の場合「追加」不可
                            let addButton = document.createElement('a');
                            addButton.setAttribute('href', `https://syosetu.com/draftepisode/input/ncode/${ncode}`);
                            addButton.classList.add('c-button');
                            addButton.classList.add('c-button--useradd');
                            addButton.classList.add('c-button--sm');
                            addButton.textContent = '追加';
                            addButton.style.cssText = 'height: 2rem;';
                            buttonFlexBox.prepend(addButton);
                        }
                        xx.appendChild(buttonFlexBox);
                    });
                });
        });
})();