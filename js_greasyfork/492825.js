// ==UserScript==
// @name         auto open link from the list
// @namespace    https://carpt.net/
// @version      2024-01-31
// @description  auto open link from the list for carpt
// @author       Cccor
// @match        https://carpt.net/torrents.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=carpt.net
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492825/auto%20open%20link%20from%20the%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/492825/auto%20open%20link%20from%20the%20list.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onbeforeunload = function() {
    return "确定要离开当前页面吗？";
};

    // 创建并添加按钮
    const createButton = (start, end) => {
        const button = document.createElement('button');
        button.textContent = `${start + 1}～${end}`;
        button.addEventListener('click', () => openPageRange(start, end));
        return button;
    };

    // 在页面上添加所有的按钮
    const addButtonToPage = () => {
        const searchButton = document.querySelector('input[value="给我搜"]');
        const container = searchButton.closest('td');

        for (let i = 0; i < 10; i++) {
            const start = i * 10;
            const end = (i + 1) * 10 - 1;
            const button = createButton(start, end);
            container.appendChild(button);
        }
    };

    // 打开指定范围内的链接
    const openPageRange = (start, end) => {
        const tables = document.querySelectorAll('table.torrentname');
        const downloadImgs = Array.from(tables).slice(start, end + 1).flatMap(table =>
            Array.from(table.querySelectorAll('img[title="下载本种"]'))
        );

        downloadImgs.forEach(img => {
            const downloadLink = img.closest('a');
            if (downloadLink && downloadLink.href) {
                window.open(downloadLink.href, '_blank');
            }
        });
    };

    addButtonToPage();
})();