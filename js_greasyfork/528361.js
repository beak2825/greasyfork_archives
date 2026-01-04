// ==UserScript==
// @name         Open2ch Imgur Image Hider
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  open2ch.netでImgur画像を非表示にし、ポップアップ表示を防ぎ、非表示URLを管理するスクリプト
// @author       Anonymous
// @match        *://*.open2ch.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528361/Open2ch%20Imgur%20Image%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/528361/Open2ch%20Imgur%20Image%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ローカルストレージから非表示URLとデフォルト非表示設定を取得
    const hiddenUrls = new Set(GM_getValue('hiddenUrls', []));
    const defaultHide = GM_getValue('defaultHide', true);

    // 画像を非表示にする関数
    function hideImage(img, url) {
        if (img.previousSibling && img.previousSibling.classList?.contains('hide-container')) {
            return;
        }

        const container = document.createElement('div');
        container.classList.add('hide-container');
        container.style.display = 'inline-block';
        container.style.width = (img.width || 200) + 'px';
        container.style.height = (img.height || 'auto');
        container.innerHTML = '<span>[非表示画像]</span> <button class="show-btn">表示</button>';
        img.parentNode.insertBefore(container, img);
        img.style.display = 'none';
        img.removeAttribute('data-shown'); // 表示フラグをリセット

        // 「表示」ボタンのイベントリスナー
        container.querySelector('.show-btn').addEventListener('click', (event) => {
            event.stopPropagation();
            event.preventDefault();
            showImage(container, img, url);
            hiddenUrls.delete(url);
            GM_setValue('hiddenUrls', Array.from(hiddenUrls));
        });

        if (!hiddenUrls.has(url)) {
            hiddenUrls.add(url);
            GM_setValue('hiddenUrls', Array.from(hiddenUrls));
        }
    }

    // 画像を表示する関数
    function showImage(container, img, url) {
        img.style.display = '';
        img.setAttribute('data-shown', 'true'); // 表示フラグを設定
        container.parentNode.insertBefore(img, container);
        container.remove();

        // 既存の「非表示」ボタンがあれば削除
        const existingHideBtn = img.nextSibling;
        if (existingHideBtn && existingHideBtn.classList?.contains('hide-btn')) {
            existingHideBtn.remove();
        }

        // 新しい「非表示」ボタンを追加
        const hideBtn = document.createElement('button');
        hideBtn.textContent = '非表示';
        hideBtn.classList.add('hide-btn');
        hideBtn.style.marginLeft = '5px';
        hideBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            event.preventDefault();
            hideImage(img, url);
        });
        img.parentNode.insertBefore(hideBtn, img.nextSibling);

        // 画像のクリックイベントを無効化
        img.addEventListener('click', (event) => {
            event.stopPropagation();
            event.preventDefault();
        });

        // 親要素のリンク動作を防止
        const parentLink = img.closest('a');
        if (parentLink) {
            parentLink.addEventListener('click', (event) => {
                if (event.target === img || event.target.classList.contains('hide-btn') || event.target.classList.contains('show-btn')) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            });
        }
    }

    // 画像を処理する関数
    function processImages() {
        document.querySelectorAll('img[src^="https://i.imgur.com/"]').forEach(img => {
            const url = img.src;
            const isShown = img.getAttribute('data-shown') === 'true';

            if ((hiddenUrls.has(url) || defaultHide) && !isShown) {
                if (img.style.display !== 'none' && !img.previousSibling?.classList?.contains('hide-container')) {
                    hideImage(img, url);
                }
            } else if (!isShown && (!img.nextSibling || !img.nextSibling.classList?.contains('hide-btn'))) {
                const hideBtn = document.createElement('button');
                hideBtn.textContent = '非表示';
                hideBtn.classList.add('hide-btn');
                hideBtn.style.marginLeft = '5px';
                hideBtn.addEventListener('click', (event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    hideImage(img, url);
                });
                img.parentNode.insertBefore(hideBtn, img.nextSibling);
                img.addEventListener('click', (event) => {
                    event.stopPropagation();
                    event.preventDefault();
                });

                // 親要素のリンク動作を防止
                const parentLink = img.closest('a');
                if (parentLink) {
                    parentLink.addEventListener('click', (event) => {
                        if (event.target === img || event.target.classList.contains('hide-btn')) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    });
                }
            }
        });
    }

    // 初回読み込み時に画像を処理
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        processImages();
    } else {
        window.addEventListener('DOMContentLoaded', processImages);
    }

    // 動的に追加される画像に対応
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => processImages());
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // デフォルト非表示設定を切り替えるメニュー
    GM_registerMenuCommand('デフォルト非表示の切り替え', () => {
        const newValue = !defaultHide;
        GM_setValue('defaultHide', newValue);
        alert('デフォルト非表示が' + (newValue ? '有効' : '無効') + 'になりました。ページを再読み込みしてください。');
    });

    // 非表示URL一覧を表示する関数
    function showHiddenUrls() {
        const hiddenList = Array.from(hiddenUrls);
        if (hiddenList.length === 0) {
            alert('非表示にしている画像はありません。');
            return;
        }

        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#fff';
        modal.style.padding = '20px';
        modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        modal.style.zIndex = '10000';
        modal.style.maxHeight = '80%';
        modal.style.overflowY = 'auto';

        const title = document.createElement('h3');
        title.textContent = '非表示にした画像のURL一覧';
        modal.appendChild(title);

        const list = document.createElement('ul');
        hiddenList.forEach(url => {
            const listItem = document.createElement('li');
            listItem.textContent = url;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '削除';
            deleteBtn.style.marginLeft = '10px';
            deleteBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                event.preventDefault();
                hiddenUrls.delete(url);
                GM_setValue('hiddenUrls', Array.from(hiddenUrls));
                listItem.remove();
                document.querySelectorAll(`img[src="${url}"]`).forEach(img => {
                    if (img.style.display === 'none') {
                        const container = img.previousSibling;
                        if (container && container.classList?.contains('hide-container')) {
                            showImage(container, img, url);
                        }
                    }
                });
            });
            listItem.appendChild(deleteBtn);
            list.appendChild(listItem);
        });
        modal.appendChild(list);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '閉じる';
        closeBtn.style.marginTop = '10px';
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        modal.appendChild(closeBtn);

        document.body.appendChild(modal);
    }

    // メニューに「非表示URL一覧を表示」を追加
    GM_registerMenuCommand('非表示URL一覧を表示', showHiddenUrls);
})();