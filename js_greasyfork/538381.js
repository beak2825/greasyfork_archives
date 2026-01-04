// ==UserScript==
// @name         BSQ-Shopify小助手
// @namespace    http://tampermonkey.net/
// @version      2025-08-27
// @description  Shopify小助手（仅在变体页面注入样式）
// @author       You
// @match        https://admin.shopify.com/store/huanuo-shop-new/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shopify.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538381/BSQ-Shopify%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/538381/BSQ-Shopify%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let styleTagId = "bsq-shopify-style";

    function addStyle() {
        if (!document.getElementById(styleTagId)) {
            const style = document.createElement("style");
            style.id = styleTagId;
            style.textContent = `
              .Polaris-Labelled--hidden span.Polaris-Thumbnail {
                width:100px !important;
                height: 100px !important;
              }
              .Polaris-Labelled--hidden button[class^="_imageContainer"] {
                width:100px !important;
                height: 100px !important;
              }
              div[class^="_PositionedOverlay"]{
                top: 100px !important;
              }
              div[class^="_PositionedOverlay"] div[class^="_CardPopover-show"]{
                max-height: 80vh !important;
              }
            `;
            document.head.appendChild(style);
            console.log("✅ BSQ 样式已注入");
        }
    }

    function removeStyle() {
        const style = document.getElementById(styleTagId);
        if (style) {
            style.remove();
            console.log("❌ BSQ 样式已移除");
        }
    }

    function checkPage() {
        if (location.pathname.includes("/products/") && location.pathname.includes("/variants/")) {
            addStyle();
        } else {
            removeStyle();
        }
    }

    // 初次加载检查
    checkPage();

    // 监听 SPA 导航变化
    if (window.navigation) {
        window.navigation.addEventListener("navigate", () => {
            setTimeout(checkPage, 300);
        });
    } else {
        // 回退方案（兼容性更广）
        window.addEventListener("popstate", checkPage);
        window.addEventListener("pushState", checkPage);
        window.addEventListener("replaceState", checkPage);
    }

})();
