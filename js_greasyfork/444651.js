// ==UserScript==
// @name Dark NotABug
// @namespace -
// @version 0.1
// @description Dark theme for notabug.org
// @author NotYou
// @license GPL-3.0-or-later
// @grant GM_addStyle
// @run-at document-start
// @match *://*.notabug.org/*
// @downloadURL https://update.greasyfork.org/scripts/444651/Dark%20NotABug.user.js
// @updateURL https://update.greasyfork.org/scripts/444651/Dark%20NotABug.meta.js
// ==/UserScript==

(function() {
let css = `
:root {
    --c-w: rgb(255, 255, 255);
    --c-w-t: rgba(255, 255, 255, .7);
    --c-h: rgb(22, 27, 34);
    --c-b: rgb(48, 54, 61);
    --c-i: rgb(13, 17, 23);
}

* {
    scrollbar-width: thin;
    scrollbar-color: var(--c-b) var(--c-i);
}

#home-div {
    width: 100%;
    background-color: var(--c-b);
    overflow: hidden;
}

#home-title-l-span, #home-title-r-span, .hljs-string {
    color: rgb(255, 227, 143) !important;
}

#home-title-span {
    color: rgb(116, 255, 67);
}

.item .ui.mini.image, [alt="logo"], [src="/img/hack.png"] {
    filter: invert(1);
}

#header-div, .menu.transition, .ui.button .ui.basic.label, #repo-files-table * {
    background-color: var(--c-h) !important;
    color: var(--c-w);
}

#header-div .item, #header-div .ui.header {
    color: var(--c-w) !important;
}

#header-div .item:hover, #header-div .ui.header:hover, .notabug-item:hover, .ui.menu .ui.dropdown .menu > .notabug-item:hover {
    background-color: unset !important;
    color: var(--c-w-t) !important;
}

.menu.transition.visible, #repo-files-table, #branch-list .item {
    border: 1px solid var(--c-b) !important;
}

.ui.dropdown .menu > .divider, footer {
    border-top: 1px solid var(--c-b);
}

#header-div .ui.dropdown > .menu > .item:hover {
    background-color: rgb(31, 111, 235) !important;
    border-radius: unset;
}

.following.bar.light {
    border-bottom: 1px solid rgba(0, 0, 0, 0);
}

.ui.card, .ui.cards > .card {
    box-shadow: rgb(0, 0, 0) 0px 1px 3px 0px, var(--c-h) 0px 0px 0px 1px;
    background-color: var(--c-h);
}

.ui.grid .ui.three, .ui.compact.small.menu, .ui.vertical {
    border: 1px;
}

.ui.top.header, .ui.grid .ui.three > .item, .ui.attached.table.segment, .ui.compact .item, .ui.attached.segment, .ui.vertical .item {
    background-color: var(--c-h) !important;
    border: 1px solid var(--c-b) !important;
}

.ui.grid .ui.three > .item.active {
    background-color: rgb(18, 24, 31);
}

.item, .black, .black > * > *, .ui.header, .ui.tiny.basic.status.buttons > :not(.active), .ui.menu .ui.dropdown .menu > .item, .ui.menu .ui.dropdown .menu > .active.item, body > .full, .ui.card, .ui.cards > .card, #header-div .ui.dropdown > .menu > .item:hover, .ui.basic.button, #branch-list .item, .ui.selection.dropdown *, .ui.tiny .ui.basic.button:not(.active), input, code, label {
    color: var(--c-w) !important;
}

.icon, footer, .ui.top.header, #file-content > * > .markdown, .markdown:not(code) h1 .octicon-link, .markdown:not(code) h2 .octicon-link, .markdown:not(code) h3 .octicon-link, .markdown:not(code) h4 .octicon-link, .markdown:not(code) h5 .octicon-link, .markdown:not(code) h6 .octicon-link, #repo-clone-url, .file-actions .ui.button, .ui.selection.dropdown, .ui.huge .divider {
    color: var(--c-w);
}

.ui.menu .ui.dropdown .menu > .item:hover, .ui.menu .ui.dropdown .menu > .active.item:hover, .ui.menu .ui.dropdown .menu > .item:active, .ui.menu .ui.dropdown .menu > .active.item:active, .ui.basic.button:hover, .ui.pagination .disabled.item, .ui.basic.button:active, .ui.basic.button:focus {
    color: var(--c-w-t) !important;
}

.ui.basic.button:hover, .ui.basic.buttons .button:hover, .ui.basic.button:active, .ui.basic.buttons .button:active, .ui.basic.button:focus, .ui.basic.buttons .button:focus, input, body > .full, .header-wrapper, #branch-list .item, .file-actions .ui.button, body:not(.full-width) {
    background-color: var(--c-i) !important;
}

#home-footer-div, #git-stats, #branch-list .item.selected, .ui.container .ui.center.segment, .ui.pagination {
    background-color: var(--c-h) !important;
}

.ui.selection.dropdown, .ui.vertical .active.item, .ui.pagination .active.item, .lines-num > *, .ui.gray.label {
    background-color: var(--c-b) !important;
}

input, .ui.compact .active.item, .file-actions .ui.button:hover {
    border: 1px solid var(--c-b) !important;
}

.linenums * {
    color: var(--c-w-t);
}

footer {
    background-color: unset;
}

.ui.attached.segment {
    border-radius: 4px;
}

.ui.tabular .active.item {
    color: var(--c-w) !important;
    border-bottom: 0px !important;
    border-color: rgba(34, 36, 38, 0.15) !important;
    background-color: var(--c-i) !important;
}

.markdown:not(code) h1, .markdown:not(code) h2 {
    border-bottom: 1px solid var(--c-b);
}

.disabled {
    cursor: not-allowed !important;
}

pre, .linenums {
    background-color: rgb(19, 19, 19) !important;
}

.hljs-variable {
    color: rgb(56, 199, 232);
}

.hljs-keyword {
    color: rgb(108, 238, 81);
}

.hljs-comment, .hljs-quote {
    color: rgb(125, 125, 125);
}

.hljs-number {
    color: rgb(183, 80, 187);
}

.hljs-tag, .hljs-name, .hljs-attribute {
    color: rgb(210, 191, 83);
}

.hljs-attr {
    color: rgb(244, 84, 84) !important;
}

.hljs-selector-tag {
    color: rgb(213, 100, 100) !important;
}

.hljs-selector-class {
    color: rgb(100, 213, 213) !important;
}

.hljs-selector-pseudo {
    color: rgb(100, 213, 117) !important;
}

.hljs-selector-id {
    color: rgb(100, 104, 213) !important;
}

.hljs-params {
    color: rgb(196, 157, 108) !important;
}

.hljs-class .hljs-title {
    color: rgb(102, 112, 255);
}

.hljs-function .hljs-title {
    color: rgb(236, 115, 42);
}

.hljs-function .hljs-title {
    color: rgb(236, 115, 42);
}

.hljs-built_in, .hljs-builtin-name {
    color: rgb(24, 186, 240) !important;
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
