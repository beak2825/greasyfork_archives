// ==UserScript==
// @name            Catbox Mod
// @name:ja         Catbox Mod
// @namespace       https://catbox.moe/
// @version         1.0
// @description     Open the list of files in the latest order when clicking the View Files button in User Home, Added URL copy button (📋) to file list
// @description:ja  User HomeのView Filesボタンをクリックした際にファイル一覧を最新順で開くようにする, ファイル一覧にURLコピーボタン(📋)を追加
// @match           https://catbox.moe/user/*
// @icon            https://catbox.moe/favicon.ico
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/532764/Catbox%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/532764/Catbox%20Mod.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // View Files link changed to sorted URL (sort by newest)
    const link = document.querySelector('a.linkbutton[href="view.php"]');
    if (link) {
        link.href = "view.php?page=&sortby=newest";
    }

    // Add copy button
    const links = document.querySelectorAll('#results a.linkbutton');

    links.forEach(link => {
        const imgUrl = link.href;

        // create button
        const btn = document.createElement('button');
        btn.textContent = '📋';
        btn.style.marginLeft = '6px';
        btn.style.padding = '1px 0 2px';
        btn.style.width = '20px';
        btn.style.fontSize = '16px';
        btn.style.cursor = 'pointer';
        btn.style.borderRadius = '4px';
        btn.style.background = 'none';
        btn.style.border = 'none'

        // Copy link URL
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            navigator.clipboard.writeText(imgUrl).then(() => {
                btn.textContent = '✅';
                setTimeout(() => {btn.textContent = '📋'}, 1000);
            });
        });

        // Add button
        link.parentNode.insertBefore(btn, link.nextSibling);
    });
})();