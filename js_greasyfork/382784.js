// ==UserScript==
// @name         屏蔽Pixiv搜索结果的会员遮挡
// @namespace    https://4cy.me/
// @version      0.1
// @description  屏蔽Pixiv搜索结果的会员遮挡，可以直接点击5项热门内容
// @author       某亚瑟
// @match        https://www.pixiv.net/search.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382784/%E5%B1%8F%E8%94%BDPixiv%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E7%9A%84%E4%BC%9A%E5%91%98%E9%81%AE%E6%8C%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/382784/%E5%B1%8F%E8%94%BDPixiv%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E7%9A%84%E4%BC%9A%E5%91%98%E9%81%AE%E6%8C%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("._premium-lead-popular-d-body").removeChild(document.querySelector(".popular-introduction-overlay"));
})();