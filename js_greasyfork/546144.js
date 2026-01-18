// ==UserScript==
// @name         DLsiteに任意のリンク追加
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  DLsiteの作品ページで、カテゴリに応じて任意のリンクを追加します。お気に入りページにも対応しています。
// @author       You
// @match        https://www.dlsite.com/maniax/work/=/product_id/*
// @match        https://www.dlsite.com/maniax-touch/work/=/product_id/*
// @match        https://www.dlsite.com/maniax/mypage/wishlist*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dlsite.com
// @grant        GM_openInTab
// @license      GPL-2.
// @downloadURL https://update.greasyfork.org/scripts/546144/DLsite%E3%81%AB%E4%BB%BB%E6%84%8F%E3%81%AE%E3%83%AA%E3%83%B3%E3%82%AF%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/546144/DLsite%E3%81%AB%E4%BB%BB%E6%84%8F%E3%81%AE%E3%83%AA%E3%83%B3%E3%82%AF%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //設定：タブを開く間隔（ミリ秒） 1000 = 1秒
    const OPEN_INTERVAL = 300;

    //ここにお好みのURLを
    const MangaCG_URL = "";
    const asmr_URL = "";
    const MangaCG_ButtonText = "";
    const Asmr_ButtonText = "";

    const LINK_CONFIG = {
        'マンガ': {
            url: ({ title }) => `${MangaCG_URL}${encodeURIComponent(title)}`,
            text: `${MangaCG_ButtonText}`,
            color: '#e91e63'
        },
        'CG・イラスト': {
            url: ({ title }) => `${MangaCG_URL}${encodeURIComponent(title)}`,
            text: `${MangaCG_ButtonText}`,
            color: '#e91e63'
        },
        'ボイス・ASMR': {
            url: ({ rjCode }) => `${asmr_URL}${rjCode}`,
            text: `${Asmr_ButtonText}`,
            color: '#03a9f4'
        }
    };


    const getRjCodeFromUrl = (url) => {
        const match = url.match(/product_id\/(RJ\d+)/);
        return match ? match[1] : null;
    };


    const observeDomChanges = (callback) => {
        const observer = new MutationObserver(() => {
            // ページ遷移などを考慮し、遅延実行
            setTimeout(callback, 300);
        });
        observer.observe(document.body, { childList: true, subtree: true });
        // 初期実行
        setTimeout(callback, 0);
    };

    // 待機用関数
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // PC版 作品ページの処理

    function initPcWorkPage() {
        const addLinkButton = () => {
            // 既に追加済みの場合は処理を中断
            if (document.querySelector('.work_dynamic_link')) return;

            const category = document.querySelector("#category_type a span")?.title;
            const title = document.getElementById("work_name")?.textContent.trim();
            const rjCode = getRjCodeFromUrl(location.href);

            if (!category || !title || !rjCode) return;

            const config = LINK_CONFIG[category];
            if (!config) return; // 対象カテゴリでない場合は終了

            const linkUrl = config.url({ title, rjCode });

            const buttonHtml = `
                <p class="work_dynamic_link" style="margin: 10px 0;">
                    <a href="${linkUrl}" target="_blank"
                       style="display: block; padding: 8px; background: ${config.color}; color: white; text-align: center; border-radius: 4px; text-decoration: none;">
                        ${config.text}
                    </a>
                </p>`;

            document.querySelector('#work_buy_btn .work_favorite')?.insertAdjacentHTML('afterend', buttonHtml);
        };

        observeDomChanges(addLinkButton);
    }

    //スマホ版 作品ページの処理

    function initTouchWorkPage() {
        const category = document.querySelector("#category_type a span")?.title;
        const title = document.getElementById("work_name")?.textContent.trim();
        const rjCode = getRjCodeFromUrl(location.href);

        if (!category || !title || !rjCode) return;

        const config = LINK_CONFIG[category];
        if (!config) return;

        const linkUrl = config.url({ title, rjCode });
        const newButton = document.createElement('div');
        newButton.style.width = '100%';
        newButton.innerHTML = `
            <a href="${linkUrl}" target="_blank"
               style="display: block; color: #fff; background: ${config.color}; padding: 8px; text-align: center; border-radius: 4px; text-decoration: none;">
                ${config.text}
            </a>`;

        const favSnsContainer = document.querySelector('.work_fav_sns');
        if (favSnsContainer) {
            favSnsContainer.style.display = 'flex';
            favSnsContainer.style.flexDirection = 'column';
            favSnsContainer.style.gap = '10px';
            favSnsContainer.appendChild(newButton);
        }
    }

    //お気に入りページの処理

    function initWishlistPage() {

        //ドキュメントスタイルの取得
        var sheets = document.styleSheets
        var sheet = sheets[sheets.length - 1];

        //スタイルルールの追加
        sheet.insertRule(
            '.dynamic-link-clone p a::before { content: none !important }',
            sheet.cssRules.length
        );

        // 「すべて開く」ボタンの追加処理
        const addOpenAllButton = () => {
            const targetBox = document.querySelector('.status_select_box');
            // すでにボタンがある場合やターゲットがない場合は何もしない
            if (!targetBox || document.getElementById('open-all-custom-links-btn')) return;

            const openBtn = document.createElement('a');
            openBtn.id = 'open-all-custom-links-btn';
            openBtn.href = '#';
            openBtn.textContent = '全Linkを開く';
            openBtn.style.cssText = `
                float: right;
                margin-top: 6px;
                margin-right: 10px;
                padding: 4px 12px;
                background: #666;
                color: #fff;
                font-size: 12px;
                text-decoration: none;
                border-radius: 3px;
                cursor: pointer;
                transition: background 0.3s;
            `;

            openBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                const addedLinks = document.querySelectorAll('.dynamic-link-clone a');

                if (addedLinks.length === 0) {
                    alert('開くリンクが見つかりません。');
                    return;
                }

                if(!confirm(`${addedLinks.length}個のタブを順番に開きます。\n(サーバー負荷軽減のため、1件につき${OPEN_INTERVAL}m秒待機します)`)){
                    return;
                }

                // ボタンを無効化して連打防止
                const originalText = "全Linkを開く";
                openBtn.style.pointerEvents = 'none';
                openBtn.style.background = '#aaa';

                for (let i = 0; i < addedLinks.length; i++) {
                    const link = addedLinks[i];
                    if (link.href) {
                        // 進捗表示
                        openBtn.textContent = `Open... ${i + 1}/${addedLinks.length}`;

                        // タブを開く
                        GM_openInTab(link.href, { active: false, insert: true });

                        // 指定時間待機 (最後の1回以外)
                        if (i < addedLinks.length - 1) {
                            await sleep(OPEN_INTERVAL);
                        }
                    }
                }

                // 完了表示
                openBtn.textContent = '完了!';
                openBtn.style.background = '#4caf50'; // 緑色

                // 2秒後に元に戻す
                setTimeout(() => {
                    openBtn.textContent = originalText;
                    openBtn.style.background = '#666';
                    openBtn.style.pointerEvents = 'auto';
                }, 2000);
            });

            targetBox.appendChild(openBtn);
        };

        const addLinksToFavorites = () => {
            // まず一括オープンボタンを追加
            addOpenAllButton();

            const favoriteItems = document.querySelectorAll('.one_column_work_item:not(.dynamic-button-added)');

            favoriteItems.forEach(item => {
                item.classList.add('dynamic-button-added'); // 二重処理防止

                const category = item.querySelector('.work_category a')?.textContent.trim();
                const titleAnchor = item.querySelector('dt.work_name > a');
                const cartButtonListItem = item.querySelector('p.work_cart_xs')?.closest('li.work_btn_list_item');

                if (!category || !titleAnchor || !cartButtonListItem) return;

                const config = LINK_CONFIG[category];
                if (!config) return;

                const productTitle = titleAnchor.title;
                const rjCode = getRjCodeFromUrl(titleAnchor.href);
                const linkUrl = config.url({ title: productTitle, rjCode });

                if (!linkUrl) return;

                const newListItem = cartButtonListItem.cloneNode(true);
                newListItem.classList.add('dynamic-link-clone');
                newListItem.style.marginTop = '5px';

                const newLink = newListItem.querySelector('a');
                if (newLink) {
                    newLink.href = linkUrl;
                    newLink.target = '_blank';
                    newLink.textContent = config.text;
                    newLink.style.background = config.color;
                    newLink.style.borderColor = config.color;
                    newLink.style.color = 'white';

                }
                cartButtonListItem.after(newListItem);
            });
        };

        observeDomChanges(addLinksToFavorites);
    }


    const path = location.pathname;

    if (path.includes('/maniax/work/')) {
        initPcWorkPage();
    } else if (path.includes('/maniax-touch/work/')) {
        initTouchWorkPage();
    } else if (path.includes('/maniax/mypage/wishlist')) {
        initWishlistPage();
    }
})();