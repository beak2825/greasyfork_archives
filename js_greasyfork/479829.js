// ==UserScript==
// @name         悦读助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  悦读列表页面分页位置修改
// @author       Xinconan
// @match        https://*/ebook/web/project/showBooksByMisCode*
// @match        https://*/ebook/web/newBook/showBooksByChCode*
// @match        http://*/interlibSSO/goto/129/+xc940ygx9bm//ebook/web/*/showBooksBy*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=51zhy.cn
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479829/%E6%82%A6%E8%AF%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/479829/%E6%82%A6%E8%AF%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const customStyles = `
    .m-page:is(div, #a) {
    position: fixed;
    top: 40%;
    background: #fff;
    }
    `
    GM_addStyle(customStyles);
})();