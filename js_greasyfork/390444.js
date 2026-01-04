// ==UserScript==
// @name         Darkmode Favro
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        https://favro.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/390444/Darkmode%20Favro.user.js
// @updateURL https://update.greasyfork.org/scripts/390444/Darkmode%20Favro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Activated Darkmode Favro');

    GM_addStyle (`

    * {
        --webkit-scrollbar-color: dark;
        --color-text-primary: white;
        --color-text-link: #97c7ff;
        --color-primary-tint: #081B33;
        --color-secondary-tint: #152642;
        --color-hight-contrast-tint: #2e4662;
        --color-accentuated-tint: #2F4562;
        --color-widget-tint: #2F4562;
        --color-border-tint: #0c2b4f;
    }

    /* loading screen */
    .fui-loading {
    transition: background-color 500ms ease-out 2s;
    background-color: var(--color-primary-tint) !important;
    }

    pre {
       background: var(--color-primary-tint) !important;
    }

    .popup {
        --popup-bgcolor: var(--color-primary-tint) !important;
    }

    .popup-content {
       border: 1px solid var(--color-border-tint) !important;
    }

    /* card modal */
    .commentspane, .contentwrapper,
    .cardeditor-topbar {
       background: var(--color-widget-tint) !important;
       border-bottom: 1px solid var(--color-secondary-tint) !important;
    }

    tokenlist .token-member .name {
       color: black !important;
    }

    /* card modal fields */
    .cardattributes .cardfield>.edit {
       border: none !important;
    }

    /* card modal comment background */
    .commentspane .cardcomment .details {
       background: var(--color-primary-tint) !important;
    }

    .prosemirror-quickinsert.layout-default {
       background: linear-gradient(90deg,hsla(0,0%,100%,0) 0,#fff 15%,#2e4662);
    }

    .favro-checklistitem:hover,
    .favro-checklistitem.is-active {
       background-color: #061324 !important;
    }

    .input {
       color: black !important;
       border-radius: 3px !important;
    }

    body {
       color: var(--color-text-primary) !important;
    }

    .widget, .widget-minimized, .boardcolumn-summaries, .widget-title-summaries, .widget-title .widget-title-name-text {
       color: var(--color-text-primary) !important;
    }

    .card-title-text {
       color: var(--color-text-primary) !important;
    }

    .card-field-section .card-field-name {
       color: var(--color-text-primary) !important;
    }

    .popup-userfield {
       color: #ffffff !important;
    }

    .pagesearch .ui-searchmodal-results {
       background-color: #2f4562 !important;
    }

    .page-search-item {
       background-color: var(--color-primary-tint) !important;
       border: none !important;
       color: #ffffff !important;
    }

    /* card in board */
    .card.layout-board,
    .ui-textfield-input textarea {
       background-color: var(--color-primary-tint) !important;
       border: none !important;
       color: #ffffff !important;
    }

    .card.layout-board .cardfield.cardfield-relations .relationslist {
       display: none !important;
    }

    .singlewidgetfeed .item .details .info .name, .close {
       color: #ffffff !important;
    }

    .ui-modal-header {
       border: none !important;
    }

    .fui-menu2-item:not(.is-disabled):not(.color-textlink):hover {
       background-color: #061324 !important;
    }

    .tokenlist,
    .addtoken {
       background-color: #152642 !important;
    }

    .tokenlist .token-member,
    .tokenlistpicker {
       background-color: #2f4562 !important;
    }

    .tokenlistpicker {
       border: 1px solid #2f4562 !important;
    }

    .singlewidgetfeed .date {
       background-color: var(--color-primary-tint) !important;
    }

    span.textwithlink.style-link {
       color: #ffffff !important;
       font-weight: 600;
    }

    .fui-dropdown-listitem {
       color: #ffffff !important;
    }

    .popup-window-middle,
    .popup-window-topbar,
    .search-edit {
       background-color: var(--color-primary-tint) !important;
       color: #ffffff !important;
    }

    .search-widget-wrapper:hover {
       background-color: #2f4562 !important;
    }

    /* Add card button in board view */
    .widget-minimized .board-column-addcard>.text:before, .widget .board-column-addcard>.text:before {
    background-color: var(--color-hight-contrast-tint) !important;
    }

    .widget-minimized .board-column-addcard>.text, .widget .board-column-addcard>.text {
    background-color: var(--color-hight-contrast-tint) !important;
    }

    /* links */

    /** add board link */
    .widget-board-add {
    color: var(--color-text-link) !important;
    }

    /* link to collection relation in card modal */
    .cardrelations .relation .text {
    color: var(--color-text-link) !important;
    }

    .fui-icon {
    stroke: var(--color-text-primary) !important;
    }

    .fui-btn.mod-text {
    color: var(--color-text-primary) !important;
    }

    .fui-btn.mod-textlink.color-secondary {
    color: var(--color-text-link);
    }

    .workspace-widgets {
    background: var(--color-primary-tint) !important;
    }

    /* sidebar */
    .workspace .navpane {
    background-color: var(--color-primary-tint) !important;
    }

    .workspace .navpane.mod-collapsable:hover {
    background-color: #152642 !important;
    }

    .navpane-item.is-selected .item-content {
       background-color: #506680 !important;
    }

    /* board */
    .workspace-widgets .widget {
    background: #2F4562 !important;
    }

    .pageheader, .board-stickyheader {
    background-color: #2F4562 !important;
    border-bottom: none !important;
    }

    /* board top bar lane */
    .card.card-as-lane {
    display: none !important;
    }

    .widget-title.mod-sticky, .widget-title:hover {
    background: inherit !important;
    }

    /* notifications */
    .notificationbadge[title=Edited], .notificationbadge[title=Moved], .notificationbadge[title=Mentioned]:not(.is-major) {
    display: none !important
    }

    .unreadindicator {
    display: none !important
    }

    /* tree view */
    .ui-tableheaders.sheet-table-headers .columnheader {
    background-color: var(--color-hight-contrast-tint) !important;
    }

    .singlewidgetpageapp.is-sheet .group-row .cell {
    background-color: var(--color-hight-contrast-tint) !important;
    border-bottom: 1px solid rgba(23,37,51,.24) !important;
    border-left: 1px solid rgba(23,37,51,.24) !important;
    }

    .sheet-table-headers .columnheader+.columnheader, .singlewidgetpageapp.is-sheet .columnheader+.columnheader {
    border-left: 1px solid rgba(23,37,51,.24) !important;
    }

    .sheet-addcolumn {
    background-color: var(--color-hight-contrast-tint) !important;
    }

    /* between board lanes */
    .workspace-widgets .widget.widget.widgettype-board .boardcolumn:not(.mod-dragged):after {
    border-right: 1px solid rgba(23,37,51,.24) !important;
    }

    /* form text */
    .form-splitsection .form-subtext {
        color: var(--color-text-primary) !important;
    }

    .ui-fullscreenmodal-content {
       color: var(--color-text-primary) !important;
    }

    .desktop .ui-temporary-overrides h1, .desktop .ui-temporary-overrides h2, .desktop .ui-temporary-overrides h3, .desktop .ui-temporary-overrides h4, .desktop .ui-temporary-overrides h5, .desktop .ui-temporary-overrides h6 {
       color: var(--color-text-primary) !important;
    }

    .desktop .fui-expandable .fui-expandable-header:not(.mod-noexpand):hover {
      color: var(--color-text-primary) !important;
    }
    `);

    // Your code here...
})();