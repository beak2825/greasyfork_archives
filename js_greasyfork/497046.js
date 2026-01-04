// ==UserScript==
// @namespace    arwikibigfont
// @name         اقرأ ويكي وأعينك مرتاحة
// @version      0.2
// @description  Our eyes deserve better care; therefore, replace that unpleasant font with one that is easier to read and improve the typography.
// @match        https://ar.wikipedia.org/*
// @copyright    You
// @grant        GM_addStyle
// @icon         https://ar.wikipedia.org/favicon.ico
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/497046/%D8%A7%D9%82%D8%B1%D8%A3%20%D9%88%D9%8A%D9%83%D9%8A%20%D9%88%D8%A3%D8%B9%D9%8A%D9%86%D9%83%20%D9%85%D8%B1%D8%AA%D8%A7%D8%AD%D8%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/497046/%D8%A7%D9%82%D8%B1%D8%A3%20%D9%88%D9%8A%D9%83%D9%8A%20%D9%88%D8%A3%D8%B9%D9%8A%D9%86%D9%83%20%D9%85%D8%B1%D8%AA%D8%A7%D8%AD%D8%A9.meta.js
// ==/UserScript==

GM_addStyle ( `
    html, body, #content h1, #content h2, #content #firstHeading, p, ul, ol, tr, .mw-body .mw-editsection, .mw-body .mw-editsection-like, .ui-widget, .mw-body #toc h2, .mw-body .toc h2, .flow-topic-title, h2.flow-board-header-title, .mw-collapsible-toggle, .mw-collapsible-toggle > a, .CategoryTreeToggle, .CategoryTreeEmptyBullet, .NavToggle, .vector-legacy-sidebar .vector-menu-portal .vector-menu-content li {
        font-family: 'Noto Sans Arabic', Helvetica, sans-serif !important;font-size:1.1em;line-height: calc(3ex / 0.32) !important;
    }
    #p-search {
        line-height:0;
    }
` );