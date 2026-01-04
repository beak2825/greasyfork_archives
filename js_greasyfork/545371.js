// ==UserScript==
// @name        去除掘金顶部的广告
// @namespace   remove-juejin-ad
// @match        *://*.juejin.cn/*
// @match        *://juejin.cn/*
// @grant       none
// @version     1.0.2
// @author      liao brant
// @description 2025/8/11 13:52:08

// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/545371/%E5%8E%BB%E9%99%A4%E6%8E%98%E9%87%91%E9%A1%B6%E9%83%A8%E7%9A%84%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/545371/%E5%8E%BB%E9%99%A4%E6%8E%98%E9%87%91%E9%A1%B6%E9%83%A8%E7%9A%84%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

const styleSheet = document.createElement('style');
styleSheet.id = 'remove-juejin-ad';
document.head.appendChild(styleSheet);


const setDefaultStyle = () => {
  styleSheet.textContent = `
    .view-container .top-banners-container {
      display: none !important;
    }

    .view-container .main-header.header-with-banner,
    .view-container .with-global-banner .view-nav,
    .view-container .with-global-banner .view-nav.top {
      top: 0 !important;
    }
  `;
};

function init() {
  setDefaultStyle();
}

init();