// ==UserScript==
// @name 巴哈姆特 - 貼圖選單優化 (縮小導航貼圖)
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description 縮小巴哈姆特貼圖選單中的導航貼圖尺寸，優化顯示更多選項，保留列表貼圖不變
// @author ME
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.forum.gamer.com.tw/*
// @match *://*.www.gamer.com.tw/*
// @downloadURL https://update.greasyfork.org/scripts/542983/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20-%20%E8%B2%BC%E5%9C%96%E9%81%B8%E5%96%AE%E5%84%AA%E5%8C%96%20%28%E7%B8%AE%E5%B0%8F%E5%B0%8E%E8%88%AA%E8%B2%BC%E5%9C%96%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542983/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20-%20%E8%B2%BC%E5%9C%96%E9%81%B8%E5%96%AE%E5%84%AA%E5%8C%96%20%28%E7%B8%AE%E5%B0%8F%E5%B0%8E%E8%88%AA%E8%B2%BC%E5%9C%96%29.meta.js
// ==/UserScript==

(function() {
  let css = `
    /* 針對導航欄的樣式，限制在 tippy 彈窗內 */
    [data-tippy-root] .baha_gif.tab-wrapper .tab-nav.mes-sticker-slide.sticker-index.slick-initialized.slick-slider .slick-slide[data-slick-index] {
      width: 30px !important; /* 縮小導航欄項目寬度 */
      height: 30px; /* 縮小導航欄項目高度 */
    }

    /* 縮小導航欄貼圖 */
    [data-tippy-root] .baha_gif.tab-wrapper .tab-nav.mes-sticker-slide.sticker-index .sticker-item img {
      width: 24px; /* 縮小導航欄圖片 */
      height: 24px;
      object-fit: contain;
    }

    /* 調整導航欄容器 */
    [data-tippy-root] .baha_gif.tab-wrapper .tab-nav.mes-sticker-slide.sticker-index {
      height: 34px; /* 縮小導航欄高度 */
    }

    /* 確保貼圖選單容器適應內容 */
    [data-tippy-root] .baha_gif.tab-wrapper .tab-content_sticker .sticker-list-content {
      max-height: 320px; /* 保持足夠高度 */
      overflow-y: auto; /* 允許滾動 */
    }
  `;

  if (typeof GM_addStyle !== "undefined") {
    GM_addStyle(css);
  } else {
    const styleNode = document.createElement("style");
    styleNode.appendChild(document.createTextNode(css));
    (document.querySelector("head") || document.documentElement).appendChild(styleNode);
  }
})();