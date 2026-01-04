// ==UserScript==
// @name               自研 - BoBoPic - Pixiv 日榜文章直达链接
// @name:en_US         Self-made - BoBoPic - Pixiv Ranking articles Direct link
// @description        为「Pixiv 综合排行榜热门插画图片」类文章添加直达链接。
// @description:en_US  Put direct links in the 'Popular Illustration Images from the Pixiv Comprehensive Rankings' articles.
// @version            1.0.1
// @author             CPlayerCHN
// @license            MulanPSL-2.0
// @namespace          https://www.gitlink.org.cn/CPlayerCHN
// @match              https://bobopic.com/pixiv-*.html
// @icon               http://bobopic.com/favicon.ico
// @run-at             document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/484215/%E8%87%AA%E7%A0%94%20-%20BoBoPic%20-%20Pixiv%20%E6%97%A5%E6%A6%9C%E6%96%87%E7%AB%A0%E7%9B%B4%E8%BE%BE%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/484215/%E8%87%AA%E7%A0%94%20-%20BoBoPic%20-%20Pixiv%20%E6%97%A5%E6%A6%9C%E6%96%87%E7%AB%A0%E7%9B%B4%E8%BE%BE%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 调整样式
    GM_addStyle('.miebangbangda a { transition: unset !important }');

    // 定义「pid 容器」
    let span = document.querySelectorAll('.miebangbangda');

    // 为「pid 容器」添加链接
    span.forEach((elm) => {
        elm.innerHTML = `<a href="https://pixiv.net/artworks/${elm.textContent}" target="_blank" rel="nofollow noopener noreferrer">${elm.textContent}</a>`;
    })

})();