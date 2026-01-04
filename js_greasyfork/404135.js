// ==UserScript==
// @name         Verificari search - screenshot
// @namespace    www.dedeman.ro
// @version      1.8
// @description  Adaugare css pentru eliminarea elementelor nedorite din pagina
// @icon         https://i.dedeman.ro/dedereact/design/images/small-logo.svg
// @author       Dragos
// @match        https://www.dedeman.ro/*/catalogsearch/result/*
// @match        https://www.dedeman.ro/*/c/*
// @grant        GM_addStyle
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/404135/Verificari%20search%20-%20screenshot.user.js
// @updateURL https://update.greasyfork.org/scripts/404135/Verificari%20search%20-%20screenshot.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
    #html-body .related-searches,
    #html-body .products.list.items.product-items:nth-child(n+2),
    #html-body .products.list.items.product-items > .item.product.product-item:nth-child(n+5),
    #html-body .filter-options-item:nth-child(n+3),
    #html-body .category-description,
    #html-body .pagination,
    #html-body .page-footer,
    .related-categories,
    .feedback-search-wrap {
        display: none !important;
    }
    #html-body .sidebar.sidebar-main {
        max-height: 870px; overflow: hidden;
    }
    #html-body .products-grid .product-items {
        margin-bottom: 0 !important;
    }
    #html-body {
       height: unset !important;
    }
    `);
})();