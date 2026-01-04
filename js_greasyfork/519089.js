// ==UserScript==
// @name         South-Plus Modifier (Updated)
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Modify South-Plus forum style, replace buttons, update breadcrumbs links, and update thread links
// @author       You
// @match        https://www.south-plus.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519089/South-Plus%20Modifier%20%28Updated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519089/South-Plus%20Modifier%20%28Updated%29.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // 添加隱藏元素的樣式
    const hideStyle = document.createElement('style');
    hideStyle.textContent = `
        .js-post, #breadcrumbs, a.fn[href*="simple/index.php"] {
            visibility: hidden;
        }
    `;
    document.head.appendChild(hideStyle);

    // 添加自定義樣式
    function addStyle() {
        const style = document.createElement('style');
        style.textContent = `
            .card-text, .f14 {
                font-size: 40px !important;
                line-height: 1.7 !important;
                word-wrap: break-word !important;
                max-width: 35em !important;
                margin: 0 auto !important;
            }
            img {
                max-width: 100% !important;
                height: auto !important;
            }
            /* 確保在手機模式下按鈕也能顯示 */
            @media (max-width: 768px) {
                .fn[href*="simple/index.php"],
                .fn.author-only-link {
                    display: block !important;
                    margin: 10px auto !important;
                    text-align: center !important;
                    font-size: 1.2em !important;
                }
            }
            .js-post, #breadcrumbs, a.fn[href*="simple/index.php"], .fn.author-only-link{
                visibility: visible;
            }
        `;
        document.head.appendChild(style);
    }

    // 替換收藏按鈕
    function replaceBookmarkButton() {
        const tidMatch = location.href.match(/tid[=-](\d+)/);
        if (!tidMatch) return;
        const tid = tidMatch[1];

        const browserFavorBtn = document.querySelector('a.fn[onclick*="Addtoie"]');
        if (browserFavorBtn) {
            browserFavorBtn.onclick = () => sendmsg(`pw_ajax.php?action=favor&tid=${tid}`, '', 'favor');
            browserFavorBtn.textContent = '收藏';
            browserFavorBtn.title = '收藏该主题';
            browserFavorBtn.style.cursor = 'pointer';
        }
    }

    // 替換 "只看樓主" 按鈕
    function replacePrintButton() {
        const printButton = document.querySelector('a.fn[href*="simple/index.php"]');
        if (!printButton) return;

        const firstPost = document.querySelector('.js-post');
        const authorUid = firstPost?.querySelector('a[href*="uid-"]')?.href.match(/uid-(\d+)/)?.[1];
        if (!authorUid) return;

        const currentUrl = window.location.href;
        const tidMatch = currentUrl.match(/tid-(\d+)/);
        if (!tidMatch) return;

        const authorOnlyUrl = `https://www.south-plus.net/read.php?tid-${tidMatch[1]}-uid-${authorUid}.html`;

        const newButton = document.createElement('a');
        newButton.textContent = '只看樓主';
        newButton.href = authorOnlyUrl;
        newButton.title = '點擊查看只看樓主的帖子';
        newButton.className = 'fn author-only-link';

        printButton.parentNode.insertBefore(newButton, printButton.nextSibling);
        //printButton.style.display = 'none';
    }

    // 修改帖子樣式
    function applyNewStyle() {
        const tables = document.querySelectorAll('.js-post');
        tables.forEach((table) => {
            const uid = table.querySelector('a[href*="uid-"]')?.href.match(/uid-(\d+)/)?.[1];
            if (!uid) return;

            const author = table.querySelector('strong')?.textContent;
            const timestamp = table.querySelector('.fl.gray')?.getAttribute('title')?.replace('发表于: ', '') ||
                table.querySelector('.fl.gray')?.textContent;
            const contentDiv = table.querySelector('.tpc_content');

            const card = document.createElement('div');
            card.className = `card author_${uid}`;
            card.innerHTML = `
                <div class="card-body">
                    <h6 class="card-subtitle mb-2 text-muted row" style="font-size: 18px;">
                        <div class="col-12">
                            <a style="color: #FF7878; font-size: 18px;" href="u.php?action=show&uid=${uid}" target="_blank">
                                <strong>${author}</strong>
                            </a> - ${timestamp}
                            <span class="float-right">[GF]</span>
                        </div>
                    </h6>
                </div>
            `;

            const cardBody = card.querySelector('.card-body');
            cardBody.appendChild(contentDiv);

            const replyButton = document.createElement('button');
            replyButton.type = 'button';
            replyButton.className = 'btn btn-outline-secondary btn-sm';
            replyButton.onclick = () => postreply(`回 ${author} 的帖子`);
            replyButton.style.marginTop = '-5px';
            replyButton.style.fontSize = '16px';
            replyButton.textContent = '回复';

            cardBody.appendChild(document.createElement('br'));
            cardBody.appendChild(replyButton);

            table.parentNode.replaceChild(card, table);
        });
    }

    // 修改面包屑導航中的鏈接
    function updateBreadcrumbs() {
        const breadcrumbs = document.querySelector('#breadcrumbs');
        if (!breadcrumbs) return;

        breadcrumbs.querySelectorAll('a').forEach((link) => {
            const href = link.getAttribute('href');

            // 替換 index.php
            if (href === 'index.php') {
                link.href = 'https://www.south-plus.net/simple/index.php?';
            }

            // 替換 thread.php?fid-x.html 格式
            const threadMatch = href.match(/thread\.php\?fid-(\d+)\.html/);
            if (threadMatch) {
                const fid = threadMatch[1];
                link.href = `https://www.south-plus.net/simple/index.php?f${fid}.html`;
            }
        });
    }

    // 更新簡單模式中 thread 的鏈接
    function updateThreadLinks() {
        const links = document.querySelectorAll('a[href*="simple/index.php?t"]');
        links.forEach((link) => {
            const href = link.getAttribute('href');
            const tidMatch = href.match(/t(\d+)\.html/);
            if (tidMatch) {
                link.href = `https://www.south-plus.net/read.php?tid-${tidMatch[1]}.html`;
            }
        });
    }

    // 加載 Bootstrap 樣式
    if (!document.querySelector('link[href*="bootstrap"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css';
        document.head.appendChild(link);
    }

    // 初始化功能
    window.addEventListener('load', () => {
        addStyle();
        replaceBookmarkButton();
        replacePrintButton();
        applyNewStyle();
        updateBreadcrumbs();
        updateThreadLinks();

        // 移除隱藏樣式
        hideStyle.remove();
    });
})();
