// ==UserScript==
// @name         ecco.ps
// @description  ps优化
// @namespace    zvg.ecco.ps
// @version      0.0.1
// @author       zvg
// @license      Unlicense
// @match        *://ps.ecco.com/*
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/422973/eccops.user.js
// @updateURL https://update.greasyfork.org/scripts/422973/eccops.meta.js
// ==/UserScript==
'use strict'
 
document.head.insertAdjacentHTML('beforeend', `<style>
 
#search-results > div.product-tile-container.ng-isolate-scope > div > product-expand > div > product-info > div > div.product-info-data.ps-container.ps-theme-default > div.label-infos > div.colors-wrapper.ng-scope > div.name.ng-binding.ng-scope,
    #search-results > div.product-tile-container.ng-isolate-scope > div > div > div > search-product-tile > div.info-container > div.product-header > div.product-title > div.subtitle-container > div > div,
    #search-results > div.product-tile-container.ng-isolate-scope > div > product-expand > div > product-info > div > div.product-info-data.ps-container.ps-theme-default > div.prices-infos > div.wsp.ng-scope > span.price {
        color: red;
    }
 
    /* Order History */
    #order-history > div:nth-child(2) > div > order-history-month > div > table > tbody > tr > td:nth-child(2) > span {
        font-weight: 400;
    }
    /* Order date */
    #order-history > div:nth-child(2) > div > order-history-month > div > table > thead > tr > th:nth-child(1),
    #order-history > div:nth-child(2) > div > order-history-month > div > table > tbody > tr > td:nth-child(1) {
        text-align: left;
        width: 90px;
    }
    /* Order type */
    #order-history > div:nth-child(2) > div > order-history-month > div > table > thead > tr > th:nth-child(2),
    #order-history > div:nth-child(2) > div > order-history-month > div > table > tbody > tr > td:nth-child(2) {
        text-align: center;
        width: 80px;
    }
    /* Purchase order number */
    #order-history > div:nth-child(2) > div > order-history-month > div > table > thead > tr > th:nth-child(3),
    #order-history > div:nth-child(2) > div > order-history-month > div > table > tbody > tr > td:nth-child(3) {
        text-align: left;
        width: 170px;
        padding-left: 1em;
        color: blue;
        font-weight: 700;
    }
    #order-history > div:nth-child(2) > div > order-history-month > div > table > tbody > tr > td:nth-child(3) {
        font-size: 16px;
    }
    /* ECCO order number */
    #order-history > div:nth-child(2) > div > order-history-month > div > table > thead > tr > th:nth-child(4),
    #order-history > div:nth-child(2) > div > order-history-month > div > table > tbody > tr > td:nth-child(4) {
        text-align: left !important;
        width: 150px;
        padding-left: 1em;
    }
    /* Ship to address */
    #order-history > div:nth-child(2) > div > order-history-month > div > table > thead > tr > th:nth-child(5),
    #order-history > div:nth-child(2) > div > order-history-month > div > table > tbody > tr > td:nth-child(5) {
        width: 190px;
        text-align: left;
        padding-left: 1em;
    }
 
    /* Invoice numbers */
    #order-history > div:nth-child(2) > div > order-history-month > div > table > thead > tr > th:nth-child(6),
    #order-history > div:nth-child(2) > div > order-history-month > div > table > tbody > tr > td:nth-child(6) {
        width: 460px;
        text-align: left;
        padding-left: 1em;
    }
 
    /* Net price */
    #order-history > div:nth-child(2) > div > order-history-month > div > table > thead > tr > th:nth-child(7),
    #order-history > div:nth-child(2) > div > order-history-month > div > table > tbody > tr > td:nth-child(7) {
        text-align: left;
        color: red;
        width: 140px;
        font-weight: 800;
    }
    #order-history > div:nth-child(2) > div > order-history-month > div > table > tbody > tr > td:nth-child(7) {
        font-size: 16px;
    }
 
    /* Qty */
    #order-history > div:nth-child(2) > div > order-history-month > div > table > thead > tr > th:nth-child(8),
    #order-history > div:nth-child(2) > div > order-history-month > div > table > tbody > tr > td:nth-child(8) {
        text-align: left;
        color: DarkOrange;
        font-weight: 800;
    }
    #order-history > div:nth-child(2) > div > order-history-month > div > table > tbody > tr > td:nth-child(8) {
        font-size: 22px;
    }
 
    /* order 详情*/
    #order > div:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(4),
    #order > div:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(5) {
        color: white;
        background-color: red;
        font-weight: 800;
    }
    /* Invoice numbers */
    #order > div:nth-child(1) > table:nth-child(2) > tbody > tr > th {
        width: auto;
        min-width: 140px;
    }
    #order > div:nth-child(1) > table:nth-child(2) > tbody > tr > td {
        text-align: left;
    }
    /* Order type */
    #order > div:nth-child(1) > table:nth-child(2) > tbody > tr:nth-child(2) > td {
        color: #6cc77b;
        font-weight: 700;
    }
    /* Product */
    #order > div:nth-child(1) > table.data-table > tbody > tr > td.basket-cell.product > div > div > div.product-title.ng-binding {
        font-weight: 400;
        font-size: 12px;
    }
    #order > div:nth-child(1) > table.data-table > tbody > tr > td.basket-cell.product > div > div > div.product-id.ng-binding {
        color: red;
        font-weight: 700;
        font-size: 14px;
    }
    #order > div:nth-child(1) > table.data-table > tbody > tr > td.basket-cell.product > div > img {
        width: 100px;
    }
    /* Size */
    #order > div:nth-child(1) > table.data-table > thead > tr > th.basket-cell.sizes.ng-binding,
    #order > div:nth-child(1) > table.data-table > tbody > tr > td.basket-cell.sizes {
        width: 320px;
    }
    /* Qty */
    #order > div:nth-child(1) > table.data-table > thead > tr > th:nth-child(3),
    #order > div:nth-child(1) > table.data-table > tbody > tr > td.basket-cell.quantity.ng-binding {
        width: 62px;
        text-align: center;
        color: DarkOrange;
    }
    #order > div:nth-child(1) > table.data-table > tbody > tr > td.basket-cell.quantity.ng-binding {
        font-size: 48px;
        font-weight: 800;
    }
    /* Date */
    #order > div:nth-child(1) > table.data-table > thead > tr > th:nth-child(4),
    #order > div:nth-child(1) > table.data-table > tbody > tr > td.basket-cell.date.ng-binding {
        text-align: left;
        width: 80px;
    }
    /* Unit price */
    #order > div:nth-child(1) > table.data-table > thead > tr > th:nth-child(5),
    #order > div:nth-child(1) > table.data-table > tbody > tr > td:nth-child(5) {
        width: 80px;
        text-align: left;
        color: red;
    }
    #order > div:nth-child(1) > table.data-table > tbody > tr > td:nth-child(5) {
        font-size: 16px;
        font-weight: 400;
    }
    /* Price */
    #order > div:nth-child(1) > table.data-table > thead > tr > th:nth-child(6),
    #order > div:nth-child(1) > table.data-table > tbody > tr > td:nth-child(6) {
        width: 80px;
        text-align: left;
        color: red;
        font-weight: 800;
    }
    #order > div:nth-child(1) > table.data-table > tbody > tr > td:nth-child(6) {
        font-size: 16px;
    }
    /* Show details */
    #order > div:nth-child(1) > table.data-table > tbody > tr > td > table {
        width: 100%;
    }
    #order > div:nth-child(1) > table.data-table > tbody > tr > td > table > tbody > tr > th {
        text-align: right;
        width: 90%;
    }
    #order > div:nth-child(1) > table.data-table > tbody > tr > td > table > tbody > tr > td {
        padding-left: 1em;
        text-align: left;
    }
    /* Totals */
    #order > div:nth-child(1) > table.data-table > tfoot > tr > td:nth-child(3),
    #order > div:nth-child(1) > table.data-table > tfoot > tr > td:nth-child(6) {
        font-size: 48px;
        font-weight: 800;
    }
 
</style>`.replace(/;/g, '!important;'))