// ==UserScript==
// @name          VoidVerified
// @namespace     http://tampermonkey.net/
// @version       1.25.1
// @author        voidnyan
// @source        https://github.com/voidnyan/void-verified
// @license       MIT
// @description   Social enhancements for AniList.
// @match         https://anilist.co/*
// @require       https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.2.4/purify.min.js
// @grant         GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/475531/VoidVerified.user.js
// @updateURL https://update.greasyfork.org/scripts/475531/VoidVerified.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./src/assets/styles/activity.css":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.void-activity-entry.activity-entry {
    margin-bottom: 20px;
    min-width: 0
}

.void-activity-entry.activity-entry:hover .entry-dropdown,
.void-activity-entry.activity-entry .wrap:hover .time .action {
    opacity: 1;
    transform: none
}

.void-activity-entry .wrap {
    background: rgb(var(--color-foreground));
    border-radius: 4px;
    font-size: 1.3rem;
    overflow: hidden;
    position: relative;
}

.void-activity-entry .text {
    padding: 20px;
}

.void-activity-entry .text .header {
    display: flex;
    align-items: center;
    row-gap: 10px;
    flex-wrap: wrap;
}

.void-activity-entry .text .header > svg {
    height: 20px;
    margin-left: 30px;
    margin-right: 30px;
}

.void-activity-entry .text .avatar {
    border-radius: 3px;
    height: 40px;
    width: 40px;
}

.void-activity-entry .avatar {
    display: inline-block;
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
}

.void-activity-entry .text .name {
    height: 40px;
    line-height: 40px;
    margin-left: 12px;
    vertical-align: top;
}

.void-activity-entry .name {
    color: rgb(var(--color-blue));
    display: inline-block;
    font-size: 1.4rem
}

.void-activity-entry .list .name {
    padding-bottom: 8px
}

.void-activity-entry .text .activity-markdown {
    font-size: 1.4rem;
    line-height: 1.4;
    overflow-wrap: break-word;
    word-break: break-word;
}

.void-activity-entry .text .markdown {
    margin-bottom: 14px;
    margin-top: 14px;
    max-height: 560px;
    overflow: hidden;
}

.void-activity-entry .text .markdown p:first-of-type {
    margin-top: 0;
}

.void-activity-entry .text .markdown p:last-of-type {
    margin-bottom: 0;
}

.void-activity-entry .text .markdown:hover,
.void-activity-entry .reply .markdown:hover,
.void-activity-entry .markdown:hover {
    overflow-y: auto;
}

.void-activity-entry .markdown {
    overflow-wrap: break-word;
    word-break: break-word;
}

.void-activity-entry .wrap .actions,
.void-activity-entry .reply .actions {
    bottom: 12px;
    color: rgb(var(--color-blue-dim));
    position: absolute;
    right: 12px;
    font-family: Overpass, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    font-weight: 800;
}

.void-activity-entry .actions .action {
    cursor: pointer;
    display: inline-block;
    padding-left: 7px;
    padding-right: 2px;
    transition: .2s;
}

.void-activity-entry .actions .action:hover {
    color: rgb(var(--color-blue));
}

.void-activity-entry .actions .count {
    font-size: 1.2rem;
    padding-right: 4px;
}

.void-activity-entry .like-wrap {
    display: inline-block;
    position: relative;
}

.void-activity-entry .button {
    cursor: pointer;
}

.void-activity-entry .liked {
    color: rgb(var(--color-red));
}

.void-activity-entry .fade-enter {
    opacity: 0;
    transform: translateY(3px) scale(.95);
}

.void-activity-entry .fade-enter-active {
    transition-timing-function: cubic-bezier(0,0,.2,1);
    transition: opacity .15s, transform .15s;
}

.void-activity-entry .users {
    background: rgb(var(--color-foreground));
    border-radius: 4px;
    box-shadow: 0 2px 10px 0 rgba(6, 13, 34, .1);
    height: 40px;
    right: -5px;
    overflow: hidden;
    position: absolute;
    top: -40px;
    width: max-content;
    max-width: 400px;
    display: flex;
    flex-wrap: wrap;
}

.void-activity-entry .user {
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    height: 40px;
    width: 40px;
}

.void-activity-entry .activity-replies {
    margin: 20px;
}

.void-activity-entry .reply {
    background: rgb(var(--color-foreground));
    border-radius: 3px;
    font-size: 1.3rem;
    margin-bottom: 15px;
    padding: 14px;
    padding-bottom: 4px;
    position: relative;
}

.void-activity-entry .reply .name {
    color: rgb(var(--color-blue));
    display: inline-block;
    font-size: 1.3rem;
    height: 25px;
    line-height: 25px;
    margin-left: 6px;
    vertical-align: top;
}

.void-activity-entry .reply .avatar {
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 3px;
    display: inline-block;
    height: 25px;
    width: 25px;
}

.void-activity-entry .reply .actions {
    color: rgb(var(--color-blue-dim));
    font-family: Overpass, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    font-weight: 700;
    position: absolute;
    right: 12px;
    top: 12px;
    height: fit-content;
}

.void-activity-entry .wrap .time {
    color: rgb(var(--color-text-lighter));
    font-size: 1.1rem;
    position: absolute;
    right: 12px;
    top: 12px;
    font-family: Overpass, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    font-weight: 800;
}

.void-activity-entry .wrap .time a svg,
.void-activity-entry .wrap .time span svg {
    height: 1.2em;
    vertical-align: sub;
    padding-right: 6px;
}

.void-activity-entry .wrap .time a,
.void-activity-entry .reply .time .action,
.void-activity-entry .reply .void-action {
    opacity: 0;
    transition: opacity .2s ease-in-out;
}

.void-activity-entry .wrap:hover .time a,
.void-activity-entry .reply:hover .time .action,
.void-activity-entry .reply:hover .void-action {
    opacity: 1;
}

.void-activity-entry .void-action svg {
    height: 1em;
}

.void-activity-entry .reply .void-action svg {
    vertical-align: text-top;
    padding-right: 5px;
}

.void-activity-entry .wrap .time .action {
    cursor: pointer;
    opacity: 0;
    padding-right: 10px;
    position: relative;
    transition: .2s
}

.void-activity-entry .void-activity-dropdown-trigger svg {
    font-size: 1.6rem;
}

.void-activity-entry .wrap .time .action:hover {
    color: rgb(var(--color-blue));
}

.void-activity-entry .wrap .time .action svg {
    vertical-align: sub;
}

.void-activity-entry .has-label svg {
    width: 1.4em;
}

.void-activity-entry .wrap .time .action.has-label {
    padding-right: 5px;
}

.has-label:hover.has-label::before {
    display: block;
}

.has-label:before {
    background: rgba(var(--color-overlay),.8);
    border-radius: 5px;
    color: rgba(var(--color-white),.9);
    content: attr(label);
    display: none;
    font-family: Overpass,-apple-system,BlinkMacSystemFont,Segoe UI,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
    font-size: 1.2rem;
    font-weight: 700;
    left: -45px;
    padding: 6px 8px;
    position: absolute;
    text-align: center;
    top: 20px;
    width: 90px;
    white-space: pre-wrap;
}

.void-activity-entry .wrap .time .action.active {
    color: rgba(var(--color-green), .8);
}

.container .void-activity-entry .activity-entry .wrap .time a {
    color: rgb(var(--color-blue-dim));
}

.container .void-activity-entry .activity-entry .wrap .time a:hover {
    color: rgb(var(--color-blue));
}

.void-activity-entry .actions .time {
    color: rgb(var(--color-text-lighter));
    font-size: 1.1rem;
}

.void-activity-entry .reply .markdown {
    line-height: 1.4;
    max-height: 560px;
    overflow: hidden;
}

.void-activity-entry .activity-replies {
    margin: 20px;
}

.void-activity-entry .list {
    display: grid;
    grid-template-columns: 80px auto;
    height: 100%;
    min-height: 110px
}

.void-activity-entry .cover {
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover
}

.void-activity-entry .details {
    padding: 14px 16px;
    padding-right: 100px
}

.void-activity-entry .list .avatar {
    border-radius: 3px;
    height: 36px;
    margin-top: 9px;
    width: 36px
}

.void-activity-entry .list .title {
    color: rgb(var(--color-blue));
    word-break: break-word
}

.void-activity-entry .donator-badge {
    background: rgb(var(--color-background));
    border-radius: 3px;
    color: rgb(var(--color-text));
    display: inline-block;
    font-size: 1.2rem;
    letter-spacing: .03em;
    margin-left: 13px;
    overflow: hidden;
    padding: 4px 7px;
    position: absolute
}

.void-activity-entry .donator-badge.donator-rainbow-badge {
    animation-duration: 20s;
    animation-iteration-count: infinite;
    animation-name: rainbow;
    animation-timing-function: ease-in-out;
    color: rgb(var(--color-white));
}

.void-activity-entry .list .donator-badge {
    top: 12px;
}

.void-activity-entry .text .donator-badge {
    position: relative;
    top: 0
}

.void-activity-entry .mod-badge {
    padding: 3px 6px;
}

.void-activity-entry .donator-badge {
    font-family: Overpass, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    font-weight: 800;
}

.void-activity-entry .mod-badge .label {
    margin: 1px;
    margin-left: 4px;
    letter-spacing: .03rem;
    font-weight: 800;
    text-transform: capitalize;
}

.void-mod-tooltip {
    text-align: start;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.void-mod-tooltip > div {
    display: flex;
    gap: 5px;
}

.void-activity-feed .load-more,
.void-message-feed .load-more {
    background: rgb(var(--color-foreground));
    border-radius: 4px;
    cursor: pointer;
    font-family: Overpass,-apple-system,BlinkMacSystemFont,Segoe UI,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
    font-size: 1.4rem;
    font-weight: 700;
    margin-top: 20px;
    padding: 14px;
    text-align: center;
    transition: .2s
}

.void-activity-feed > .load-more:hover,
.void-message-feed > .load-more:hover {
    color: rgb(var(--color-blue));
    box-shadow: 0 2px 20px 0 rgba(6,13,34,.05)
}

.void-activity-entry .load-more {
    margin-bottom: 20px;
    background: rgb(var(--color-blue));
    color: rgb(var(--color-text-bright));
}

.void-activity-entry .void-action {
    font-size: 1.1rem;
    font-weight: normal;
    display: inline-block;
}

.void-hide-activity-feed .activity-feed:not(.void-message-feed) {
    display: none;
}

.void-hide-activity-feed .scroller {
    display: none;
}

.void-message-header-user {
    display: flex;
    align-items: center;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/assets/styles/collapsibleContainer.css":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.void-collapsible-container {
    background: rgb(var(--color-foreground-grey));
    color: rgb(var(--color-text));
    border-radius: 4px;
    overflow: hidden;
    margin-top: 20px;
    margin-bottom: 20px;
}

.void-collapsible-container-head-wrap {
    background: rgb(var(--color-foreground-grey-dark));
    color: rgb(var(--color-text));
    padding: 10px 15px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
}

.void-collapsible-container-icon svg {
    height: 20px;
    transition: transform 0.3s ease-in-out;
}

.void-collapsible-container:has(.void-collapsible-container-body-wrap.void-collapsed) .void-collapsible-container-icon svg {
    transform: rotate(180deg);
}

.void-collapsible-container-body {
    padding: 20px;
}

.void-collapsible-container-body-wrap {
    max-height: var(--max-height);
    transition: max-height 0.3s ease;
    overflow: hidden;
}

.void-collapsible-container-body-wrap.void-collapsed {
    max-height: 0px;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/assets/styles/dialog.css":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.void-dialog-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9500;
    visibility: hidden;
    background: rgba(18, 22, 28, .9);
}

.void-dialog-wrapper.void-visible {
    visibility: visible;
}

.void-dialog {
    background: rgb(var(--color-foreground));
    max-width: 420px;
    width: 100%;
    border-radius: 4px;
    overflow: hidden;
}

.void-dialog-header-wrap {
    display: flex;
    justify-content: space-between;
    padding: 15px 15px 10px;
    background: rgb(var(--color-foreground-grey-dark));
}

.void-dialog-header-wrap svg {
    height: 1em;
    cursor: pointer;
}

.void-dialog-header {
    font-size: 18px;
    line-height: 1;
}

.void-dialog-content {
    padding: 15px 10px;
    font-size: 14px;
}

.void-dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 5px 15px;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/assets/styles/dropdownMenu.css":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.void-dropdown-menu {
    position: absolute;
    z-index: 9000;
    background-color: #fff;
    box-shadow: 0 1px 10px 0 rgba(49, 54, 68, .15);
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: 4px;
    opacity: 0;
    visibility: hidden;
    transition: opacity .2s, visibility .2s;
    width: fit-content;
    color: rgb(var(--color-text));
    border: 0;
    overflow: initial;
    font-family: Overpass, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    font-weight: 800;
    transform-origin: center top;
    padding: 6px 0;
    display: flex;
    flex-direction: column;
}

.void-dropdown-menu.void-visible {
    opacity: 1;
    visibility: visible;
}

.void-dropdown-menu:after {
    border: solid transparent;
    border-color: transparent;
    border-width: 5px;
    content: " ";
    height: 0;
    left: 50%;
    margin-left: -5px;
    pointer-events: none;
    position: absolute;
    width: 0
}

.void-dropdown-menu.bottom:after {
    border-top-color: #fff;
    top: 100%
}

.void-dropdown-menu.top:after {
    border-bottom-color: #fff;
    bottom: 100%
}

.void-dropdown-menu-item {
    padding: 2px 17px 2px 12px;
    align-items: center;
    line-height: 30px;
    font-size: 14px;
    cursor: pointer;
}

.void-dropdown-menu-item:hover {
    background: rgb(var(--color-blue));
    color: rgb(var(--color-white));
}

.void-dropdown-menu-item:hover a,
.void-dropdown-menu-item a:hover,
a.void-dropdown-menu-item:hover {
    color: rgb(var(--color-white));
}

.void-dropdown-menu-item svg {
    height: 1.1em;
    padding-right: 10px;
    vertical-align: text-top;
}

.void-popover-content {
    padding: 6px 10px;
    font-size: 14px;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/assets/styles/fileInput.css":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.void-file-icon-input-dropbox {
    position: relative;
    cursor: pointer;
}

.void-file-icon-input-dropbox input {
    cursor: pointer;
    height: 0;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    width: 0;
    top: 0;
    left: 0;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/assets/styles/goals.css":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.void-goals-container {
    margin-top: 20px;
}

.void-goals-wrap {
    display: flex;
    flex-direction: column;
    margin-bottom: 25px;
    padding: 20px;
    background: rgb(var(--color-foreground));
    border-radius: 4px;
    overflow: hidden;
    gap: 15px;
}

.void-goal-title {
    font-weight: 600;
    font-size: 1.5rem;
}

.void-goal-description {
    font-size: 1.3rem;
    margin: 6px 0px;
}

.void-milestones {
    display: grid;
    font-size: 1.1rem;
    font-weight: 500;
    grid-template-columns: repeat(3, 1fr);
    overflow: hidden;
    padding: 11px 0;
    user-select: none;
}

.void-milestone {
    display: inline-block;
    position: relative;
    text-align: center;
}

.void-milestone::after {
    color: #c6d5d5;
    content: "|";
    left: 0;
    padding-top: 5px;
    position: absolute;
    text-align: center;
    top: 100%;
    width: 100%;
}

.void-progress {
    background: rgb(var(--color-foreground-grey-dark));
    height: 11px;
    padding: 0 16.5%;
    overflow: hidden;
    border-radius: 4px;
}

.void-progress .void-bar {
    background: linear-gradient(270deg, #02a9ff, #71cfff);
    border-radius: 0 50px 50px 4px;
    box-sizing: content-box;
    height: 100%;
    margin-left: -33.3%;
    padding-right: 33.3%;
    background: rgb(var(--color-blue));
    overflow: hidden;
    position: relative;
}

.void-progress .void-bar::after {
    background: linear-gradient(530deg, hsla(0, 0%, 100%, .5), hsla(0, 0%, 100%, 0));
    content: "";
    height: 100%;
    position: absolute;
    width: 100%;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/assets/styles/keyInput.css":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.void-key-input {
    width: 15ch;
    text-align: center;
}

.void-markdown-shortcut-dialog {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: 12px;
    row-gap: 6px;
    align-items: center;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/assets/styles/markdownDialog.css":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.void-markdown-dialog-container {
    background: rgb(var(--color-foreground));
    border-radius: 4px;
    margin: 10px 0px;
}

.void-markdown-dialog-header {
    width: 100%;
    background: rgb(var(--color-foreground-grey-dark));
    padding: 12px;
    border-radius: 4px 4px 0px 0px;
    user-select: none;
}

.activity-edit:has(.markdown-editor[style*="display: none;"]) .void-markdown-dialog-container,
.void-markdown-dialog-container[closed="true"] {
    display: none;
}

.void-markdown-dialog-header.void-flex {
    display: flex;
    justify-content: space-between;
}

.void-markdown-dialog-body {
    padding: 12px;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/assets/styles/markdownDraftManager.css":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.void-markdown-draft-manager {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.void-markdown-draft-list {
    max-height: 80px;
    overflow-y: auto;
    display: grid;
    grid-template-columns: 160px min-content min-content min-content;
    column-gap: 4px;
}

.void-markdown-draft-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    /*max-width: 50px;*/
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/assets/styles/markdownEditor.css":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.void-activity-edit .input .el-textarea__inner {
    font-size: 1.3rem;
    padding: 8px 15px;
    resize: none;
    background: rgb(var(--color-foreground));
    border: 0;
    box-shadow: unset;
    color: rgb(var(--color-text));
    outline: 0;
    transition: .2s
}

.void-activity-edit .input {
    margin-bottom: 20px;
}

.void-activity-edit .rules-notice {
    text-align: right;
    font-size: 1.2rem;
    margin-bottom: 10px;
    margin-top: 0
}

.void-activity-edit .void-hidden {
    display: none;
}

.void-activity-edit .actions.void-hidden {
    display: none;
}

.void-activity-edit .actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-bottom: 60px
}

.void-activity-edit .actions .button {
    align-items: center;
    background: rgb(var(--color-blue));
    border-radius: 4px;
    color: rgb(var(--color-text-bright));
    cursor: pointer;
    display: inline-flex;
    font-family: Overpass,-apple-system,BlinkMacSystemFont,Segoe UI,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
    font-size: 1.3rem;
    font-weight: 900;
    margin-left: 18px;
    padding: 10px 15px;
    transition: .2s
}

.void-activity-edit .markdown:hover {
    overflow-y: auto;
}

.void-activity-edit .actions .button.cancel {
    background: rgb(var(--color-foreground));
    color: rgb(var(--color-text-lighter))
}

.void-markdown-edit-container {
    background: rgba(18,22,28,.9);
    height: 100vh;
    left: 0;
    top: -100vh;
    opacity: 0;
    position: fixed;
    overflow: auto;
    transition: opacity .4s ease;
    width: 100vw;
    z-index: 3050;
    display: flex;
    justify-content: center;
    align-items: center;
}

.void-markdown-edit-container.void-visible {
    opacity: 1;
    top: 0;
}

.void-markdown-edit-container .void-markdown-edit-content {
    padding: 20px;
    width: 50%;
    background: rgb(var(--color-background));
    border-radius: 4px;
}

@media (max-width: 1040px) {
    .void-markdown-edit-container .void-markdown-edit-content {
        min-width: 90vw;
    }
}

.void-markdown-edit-container .void-markdown-edit-content .activity-edit > .actions {
    margin-bottom: unset;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/assets/styles/markdownTaskbar.css":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.void-markdown-taskbar {
    background: rgb(var(--color-foreground-blue-dark));
    display: flex;
    vertical-align: middle;
}

.void-markdown-taskbar > * {
    cursor: pointer;
    padding: 3px 6px;
    user-select: none;
}

.void-markdown-taskbar > *:hover {
    background: rgb(var(--color-foreground-blue));
}

.void-markdown-taskbar-character-counts-grid {
    display: grid;
    width: 100%;
    grid-template-columns: auto min-content;
    /*grid-template-columns:  min-content;*/
    column-gap: 15px;
    row-gap: 5px;
    justify-items: start;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/assets/styles/miniProfile.css":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.void-mini-profile-container {
    position: absolute;
    z-index: 9999;
    background-color: rgb(var(--color-foreground-grey));
    border-radius: 4px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    user-select: none;
    opacity: 1;
    transition: opacity 0.2s ease-in-out, visibility 0.2s;
    box-shadow: rgb(var(--color-shadow-blue)) 0px 0px 4px;
}

.void-mini-profile-container.void-mini-profile-hidden {
    visibility: hidden;
    opacity: 0;
}

.void-mini-profile-header {
    display: flex;
    padding: 6px;
    align-items: center;
}

.void-mini-profile-avatar {
    display: block;
    width: 60px;
    height: 60px;
    border-radius: 4px;
    background-size: contain;
    background-repeat: no-repeat;
}

.void-mini-profile-username {
    padding-left: 6px;
    color: rgb(var(--color-text-bright));
    font-weight: 600;
    text-shadow: black 0px 0px 4px;
}

.void-mini-profile-donator-badge {
    background: rgb(var(--color-background));
    border-radius: 3px;
    color: rgb(var(--color-text));
    display: inline-block;
    font-size: 1.2rem;
    letter-spacing: .03em;
    margin-left: 13px;
    overflow: hidden;
    padding: 4px 7px;
}

.void-mini-profile-donator-rainbow-badge {
    animation-duration: 20s;
    animation-iteration-count: infinite;
    animation-name: rainbow;
    animation-timing-function: ease-in-out;
    color: rgb(var(--color-white))
}

.void-mini-profile-follow-badge {
    color: rgb(var(--color-text-bright));
}

.void-mini-profile-title {
    font-weight: 700;
    font-size: 13px;
    padding-left: 6px;
}

.void-mini-profile-content-container {
    backdrop-filter: blur(10px);
    background: rgba(var(--color-foreground-grey-dark), .6);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}

.void-mini-profile-section {
    padding: 6px;
    display: flex;
    gap: 6px;
    justify-content: center;
    flex-wrap: wrap;
}

.void-mini-profile-favourite {
    display: block;
    width: 42px;
    height: 57px;
    border-radius: 4px;
    background-size: cover;
}

.void-mini-profile-favourited {
    box-shadow: rgb(var(--color-blue)) 2px 2px;
}

.void-mini-profile-about {
    max-height: 300px;
    overflow-y: hidden;
    user-select: text;
}


.void-mini-profile-about:hover {
    overflow-y: auto;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/assets/styles/poll.css":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.void-poll-container {
    border-radius: 4px;
    overflow: hidden;
}

.void-poll-header {
    font-size: 1.5rem;
    font-weight: 700;
    background: rgb(var(--color-foreground-grey-dark));
    color: rgb(var(--color-text));
    padding: 12px;
    display: flex;
    justify-content: space-between;
}

.void-poll-header-time {
    font-size: 1.2rem;
    display: flex;
    gap: 5px;
    align-items: center;
}

.void-poll-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 10px 0;
}

.void-poll-option {
    padding: 6px 10px;
    display: flex;
    justify-content: space-between;
    position: relative;
    color: rgb(var(--color-text));
}

.void-poll-option.void-voted,
.void-poll-option:hover {
    background: rgb(var(--color-foreground-grey));
    border-radius: 4px;
}

.void-poll-option-description,
.void-poll-option-count {
    z-index: 1;
}

.void-poll-option-description {
    display: flex;
}

.void-poll-option-percentage-bar {
    position: absolute;
    background: linear-gradient(530deg, rgba(255, 255, 255, 1) 0%, rgb(var(--color-blue), 1) 100%);
    bottom: 0;
    left: 0;
    height: 5px;
    border-radius: 4px;
    z-index: 0;
}

.void-poll-option-link {
    display: inline-block;
    vertical-align: text-top;
    margin-left: 8px;
}

.void-poll-option-link svg {
    height: 16px;
    pointer-events: none;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/assets/styles/quickStart.css":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.void-quick-start-container {
    background: rgba(18,22,28,.9);
    height: 100vh;
    left: 0;
    top: -100vh;
    opacity: 0;
    position: fixed;
    overflow: auto;
    transition: opacity .4s ease;
    width: 100vw;
    z-index: 3000;
}

.void-quick-start-container.void-visible {
    opacity: 1;
    top: 0;
}

.void-quick-start-input-container {
    align-items: center;
    background: rgb(var(--color-foreground));
    border-radius: 6px;
    display: grid;
    grid-template-columns: 46px 1fr 46px 46px;
    justify-items: center;
    left: calc(50% - 330px);
    position: absolute;
    top: 40px;
    transition: .25s ease;
    width: 660px;
    z-index: 1;
}

.void-quick-start-command-props-container {
    position: absolute;
    top: 52px;
    justify-self: start;
    border-radius: 4px;
    background: rgb(var(--color-foreground-grey-dark));
    padding: 4px;
}

.void-quick-start-mode-select-container {
    display: flex;
    justify-content: center;
}

.void-quick-start-mode-select-container .void-option {
    font-size: 1.1em;
    padding: 6px 8px;
}

.void-quick-start-input-container svg {
    height: 50%;
}

.void-quick-start-input-container svg:not(:first-child) {
    cursor: pointer;
}

.void-quick-start-input-container input {
    background: transparent;
    border: none;
    color: rgb(var(--color-text));
    font-family: Overpass, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: -.01em;
    margin-left: 0;
    outline: 0;
    padding: 16px 0;
    padding-top: 18px;
    position: relative;
    width: 100%;
    z-index: 2;
}

.void-quick-start-content-container {
    margin: 0 auto;
    max-width: 1700px;
    padding: 150px 60px;
    display: flex;
    flex-direction: column;
    /*gap: 60px;*/
}

.void-quick-start-content-container > * {
    margin-top: 30px;
    margin-bottom: 30px;
}

.void-quick-start-content-container > :first-child {
    margin-top: 0px;
}


.void-quick-start-content-container .void-quick-access-wrap {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 15px;
    align-items: flex-start;
    max-height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
}

.void-quick-start-results-container {
    display: grid;
    grid-gap: 60px;
}

@media screen and (min-width: 1000px) {
    .void-quick-start-results-container {
        grid-template-columns: 1fr 1fr;
    }
}

.void-quick-start-results-container:has(.void-activity-feed) {
    grid-template-columns: 1fr;
    justify-items: center;
}

.void-quick-start-container .void-activity-feed {
    /*min-width: 400px;*/
    max-width: 1000px;
}

@media screen and (min-width: 1000px) {
    .void-quick-start-container .void-activity-feed {
        min-width: 750px;
    }
}

.void-quick-start-results-list {
    background: rgb(var(--color-foreground));
    border-radius: 4px;
    color: rgb(var(--color-text));
    position: relative;
}

.void-quick-start-results-title {
    color: rgba(var(--color-text-bright), .8);
    font-size: 1.4rem;
    font-weight: 600;
    left: 0;
    margin: 0;
    padding: 0;
    position: absolute;
    text-transform: capitalize;
    top: -24px
}

.void-quick-start-result {
    cursor: pointer;
    font-size: 1.5rem;
    font-weight: 600;
    transition: background-color .15s ease,color .15s;
    padding: 10px 15px;
    width: 100%;
    display: block;
}

.void-quick-start-result:first-of-type {
    padding-top: 15px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

.void-quick-start-result:last-of-type {
    padding-bottom: 15px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}

.void-quick-start-result:hover,
.void-quick-start-result:visited:hover {
    background: rgb(var(--color-blue));
    color: rgb(var(--color-text-bright));
}

.void-quick-access-option-input {
    width: 50px;
}

.void-quick-start-notifications {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 300px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgb(var(--color-blue)) rgba(0, 0, 0, 0);
}

.void-quick-start-notifications .void-notification-preview-relation {
    height: 18px;
}

/* has two children */
.void-quick-start-head-container:has(> :last-child:nth-child(2)):not(:has([void-disabled="true"])) {
    display: grid;
    gap: 60px;
}

@media screen and (min-width: 1000px) {
    .void-quick-start-head-container:has(> :last-child:nth-child(2)):not(:has([void-disabled="true"])) {
        grid-template-columns: 2fr 1fr;
    }
}

.void-quick-start-config-container {
    background: rgb(var(--color-foreground));
    border-radius: 4px;
    padding: 20px;
    width: fit-content;
    margin: auto;
    max-height: 400px;
    transition: all 0.5s ease-in-out;
    overflow: hidden;
}

.void-settings .void-quick-start-config-container {
    padding: 0;
    margin: 0;
    max-height: unset;
}

.void-quick-start-config-container[void-hidden="true"] {
    padding-top: 0px;
    padding-bottom: 0px;
    max-height: 0px;
}

.void-quick-start-head-container:has(.void-quick-start-activity-search-params-container) {
    display: flex;
    justify-content: center;
}

.void-quick-start-activity-search-params-container {
    max-width: 1000px;
}

.void-quick-start-activity-search-params-container-head {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.void-quick-start-activity-search-params-container-body {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    background: rgb(var(--color-foreground-grey));
    border-radius: 4px;
}

.void-quick-start-activity-search-params-container-body > * {
    cursor: pointer;
}

.void-quick-start-activity-search-params-container-body:empty::before {
    content: "None selected";
}

.void-quick-start-activity-search-params-container .void-select {
    display: flex;
    width: fit-content;
}

.void-date-range-container {
    display: flex;
    width: fit-content;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
    margin-bottom: 20;
}

.void-date-range-container svg {
    height: 20px;
}

.void-button.void-all-users-button {
    padding: 0px;
    margin-top: 0px;
    background: unset;
    display: inline-block;
    color: rgb(var(--color-text));
}

.void-quick-start-media-cache {
    max-height: 200px;
    overflow-y: auto;
}

.void-quick-start-activity-search-params-container {
    max-height: 3000px;
    transition: max-height 0.3s ease;
    overflow: hidden;
}

.void-quick-start-activity-search-params-container.collapsed {
    max-height: 45px;
}

.void-quick-start-activity-search-params-container .void-collapsible-container {
    background: rgb(var(--color-foreground));
}

.void-quick-start-activity-search-params-container .void-collapsible-container .void-collapsible-container-head-wrap {
    background: rgb(var(--color-foreground-grey-dark));
}

.void-quick-start-activity-search-base-params {
    display: grid;
    gap: 15px
}

.void-quick-start-activity-search-action-container {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 20px;
}

.void-quick-start-activity-search-action-container .void-button {
    width: 100%;
    text-align: center;
    display: block;
    font-size: 1.2em;
}

.transparent .void-quick-start-nav-button svg:hover,
.void-quick-start-nav-button svg:hover {
    color: #d3d5f3;
}

.transparent .void-quick-start-nav-button svg {
    color: rgba(191, 193, 212, .65);
}

.void-quick-start-nav-button svg {
    width: 1.7em;
    color: #777a9e;
    cursor: pointer;
    transition: color .3s ease;
    vertical-align: -0.525em;
}

.void-quick-start-nav-button {
    margin-right: 15px;
    font-size: 1.4rem;
}

.void-quick-start-mobile-nav-button {
    text-decoration: none;
    transition: .15s;
    outline: 0;
}

.void-quick-start-mobile-nav-button:hover {
    color: rgb(var(--color-blue));
}

.void-quick-start-mobile-nav-button svg {
    width: 1.65em;
}

.void-quick-start-mobile-nav-button div {
    color: rgb(var(--color-gray-600));
    display: block;
    font-size: 1rem;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/assets/styles/styles.css":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:root {
    --void-info: 46, 149, 179;
    --void-error: 188, 53, 46;
    --void-success: 80, 162, 80;
    --void-warning: 232, 180, 2;
}


.nav a[href="/settings/developer" i]::after{content: " & Void"}
.void-settings .void-nav ol {
    display: flex;
    flex-wrap: wrap;
    margin: 8px 0px;
    padding: 0;
}

.void-nav {
    margin: 20px 0px 10px;
}


.void-settings .void-nav li {
    list-style: none;
    display: block;
    color: rgb(var(--color-text));
    padding: 4px 8px;
    text-transform: capitalize;
    background: rgb(var(--color-foreground-blue));
    cursor: pointer;
    min-width: 50px;
    text-align: center;
    font-size: 1.4rem;
}

.void-settings .void-nav li.void-active,
.void-settings .void-nav li:hover {
    background: rgb(var(--color-blue));
    color: rgb(var(--color-text-bright));
}

.void-settings .void-nav li:first-child {
    border-radius: 4px 0px 0px 4px;
}

.void-settings .void-nav li:last-child {
    border-radius: 0px 4px 4px 0px;
}

.void-settings .void-settings-header {
    margin-top: 30px;
}

.void-settings .void-table table {
    border-collapse: collapse;
}

.void-settings .void-table :is(th, td) {
    padding: 2px 6px !important;
}

.void-settings .void-table :is(th, td):first-child {
    border-radius: 4px 0px 0px 4px;
}

.void-settings .void-table :is(th, td):last-child {
    border-radius: 0px 4px 4px 0px;
}

.void-settings .void-table tbody tr:hover {
    background-color: rgba(var(--color-foreground-blue), .7);
}

.void-settings .void-table input[type="color"] {
    border: 0;
    height: 24px;
    width: 40px;
    padding: 0;
    background-color: unset;
    cursor: pointer;
}

.void-settings .void-table button {
    background: unset;
    border: none;
    cursor: pointer;
    padding: 0;
}

.void-settings .void-table form {
    padding: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.void-settings .void-settings-header span {
    color: rgb(var(--color-blue));
}

.void-settings .void-settings-list {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.void-setting-label {
    padding-left: 6px;
    vertical-align: middle;
    cursor: pointer;
}

.void-setting-label-container.void-auth-required .void-setting-label {
    color: rgb(var(--color-peach));
}

.void-options-legend {
    margin-top: 8px;
    display: flex;
    gap: 5px;
}

span.void-auth-required {
    color: rgb(var(--color-peach));
}
span.void-api-auth-required {
    color: rgb(var(--color-orange));
}

.void-setting-label-container.void-api-auth-required .void-setting-label {
    color: rgb(var(--color-orange));
}

.void-setting-label-container .void-checkbox {
    vertical-align: middle;
}

.void-setting-label-container {
    display: flex;
    align-items: center;
}

.void-checkbox {
    cursor: pointer;
}


.void-settings .void-settings-list input.void-input {
    width: 50px;
    text-align: center;
    height: 20px;
    font-size: 12px;
}

.void-settings .void-settings-list label {
    padding-left: 8px;
}

.void-settings .void-css-editor label {
    margin-top: 20px;
    fontSize: 2rem;
    display: inline-block;
}

.void-textarea {
    width: 100%;
    height: 300px;
    min-height: 200px;
    resize: vertical;
    background: rgb(var(--color-foreground-blue));
    color: rgb(var(--color-text));
    padding: 4px;
    border-radius: 4px;
    border: 2px solid transparent;
    outline: none !important;
}

.void-textarea:focus {
    border: 2px solid rgb(var(--color-blue)) !important;
}

.void-layout-image-container {
    padding: 4px;
    display: inline-block;
}

.void-layout-image-container:first-child {
    width: 35%;
}

.void-layout-image-container:last-child {
    width: 65%;
}

.void-layout-header {
    text-transform: uppercase;
    margin-top: 2.2em;
    margin-bottom: .8em;
}

.void-layout-image-display {
    height: 140px;
    background-repeat: no-repeat;
    margin: auto;
    margin-bottom: 6px;
    border-radius: 4px;
}

.void-layout-image-display.void-banner {
    width: 100%;
    background-size: cover;
    background-position: 50% 50%;
}

.void-layout-image-display.void-avatar {
    background-size: contain;
    width: 140px;
}

.void-layout-image-container input {
    width: 100%;
}

.void-layout-color-selection {
    margin-top: 10px;
    margin-bottom: 10px;
}

.void-layout-color-selection .void-color-button {
    width: 50px;
    height: 50px;
    display: inline-flex;
    border-radius: 4px;
    margin-right: 10px;
}

.void-layout-color-selection .void-color-button.active {
    border: 4px solid rgb(var(--color-text));
}

.void-layout-color-selection .void-color-picker-container.active {
    border: 2px solid rgb(var(--color-text));
}

.void-color-picker-container {
    display: inline-block;
    vertical-align: top;
    width: 75px;
    height: 50px;
    border: 2px solid transparent;
    border-radius: 4px;
    box-sizing: border-box;
}

.void-color-picker-container:has(:focus) {
    border: 2px solid rgb(var(--color-text));
}

.void-color-picker-input {
    width: 100%;
    height: 20px;
    background-color: rgba(var(--color-background), .6);
    padding: 1px;
    font-size: 11px;
    color: rgb(var(--color-text));
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    text-align: center;
    border: unset;
    border-radius: 0px 0px 4px 4px;
}

.void-color-picker {
    /* width: 100%;;
    height: 50px; */
    block-size: 30px;
    border-width: 0px;
    padding: 0px;
    background-color: unset;
    inline-size: 100%;
    border-radius: 4px;
    appearance: none;
    vertical-align: top;
    padding-block: 0px;
    padding-inline: 0px;
    outline: none;
}

.void-color-picker::-webkit-color-swatch,
.void-color-picker::-moz-color-swatch {
    border: none;
    border-radius: 4px;
}

.void-color-picker::-webkit-color-swatch-wrapper,
.void-color-picker::-webkit-color-swatch-wrapper {
    padding: 0px;
    border-radius: 4px;
}

.void-input {
    background-color: rgba(var(--color-background), .6);
    padding: 4px 6px;
    color: rgb(var(--color-text));
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    border: 2px solid transparent;
    border-radius: 4px;
    box-sizing: border-box;
}

.void-input[type="date"] {
    color-scheme: light;
}

.site-theme-dark .void-input[type="date"] {
    color-scheme: dark;
}

.void-action-container {
    display: inline-block;
    width: fit-content;
}

.void-action-container .void-icon-button {
    padding: 6px 8px;
    margin: 0px;
    background: rgb(var(--color-foreground-blue-dark));
    color: rgb(var(--color-text));
    border-radius: 0px 4px 4px 0px;
    height: 100%;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    border: 2px solid transparent;
    border-left: 0px !important;
    line-height: 1.15;
    box-sizing: border-box;
    vertical-align: top;
}

.void-action-container .void-icon-button:hover {
    color: rgb(var(--color-blue));
}

.void-action-container .void-icon-button svg {
    height: 14px;
}

.void-action-container .void-input {
    border-radius: 4px 0px 0px 4px;
}

a.void-link {
    color: rgb(var(--color-blue)) !important;
}

.void-input.void-sign {
    width: 75px;
    text-align: center;
    height: 20px;
    font-size: 14px;
}

.void-input:focus {
    border: 2px solid rgb(var(--color-blue));
}

.void-button {
    align-items: center;
    background: rgb(var(--color-blue));
    border-radius: 4px;
    color: rgb(var(--color-text-bright));
    cursor: pointer;
    display: inline-flex;
    font-size: 1.3rem;
    padding: 10px 15px;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    border: 0px solid rgb(var(--color-background));
    vertical-align: top;
    margin-top: 15px;
    margin-right: 10px;
}

a.void-button:visited,
a.void-button:hover {
    color: rgb(var(--color-text-bright));
}

.void-button[disabled="true"] {
    cursor: not-allowed;
    background: rgb(var(--color-blue-dim));
}

.void-icon-button {
    display: inline-block;
    cursor: pointer;
    margin-left: 4px;
    margin-right: 4px;
    vertical-align: middle;
}

.void-icon-button svg {
    height: 12px;
    vertical-align: middle;
    display: inline-block;
    pointer-events: none;
}

.void-range-container {
    display: inline-flex;
}

.void-range-display {
    margin-left: 5px;
    user-select: none;
    font-size: 14px;
    font-weight: bold;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-width: 25px;
}

.void-gif-button svg {
    height: 18px;
    vertical-align: top;
    color: rgb(var(--color-red));
}

.void-gif-button:hover svg {
    color: rgb(var(--color-blue));
}

.void-gif-button {
    margin: 0px;
}

.markdown-editor[style*="display: none;"] ~ .void-gif-keyboard-container,
.home > .activity-feed-wrap > .activity-edit:has(.markdown-editor[style*="display: none;"]) .void-activity-reply-controls-container
{
    display: none;
}

.void-gif-keyboard-container {
    width: 100%;
    background: rgb(var(--color-foreground));
    margin-bottom: 12px;
    border-radius: 4px;
}

.void-gif-keyboard-header {
    background: rgb(var(--color-foreground-grey-dark));
    padding: 12px 20px;
    border-radius: 4px 4px 0px 0px;
    display: flex;
    justify-content: space-between;
}

.void-gif-keyboard-control-container {
    display: flex;
    justify-content: space-between;
    padding: 12px 12px 0px 12px;
}

.void-gif-keyboard-list-container {
    height: 300px;
    min-height: 200px;
    max-height: 500px;
    overflow-y: scroll;
    resize: vertical;
    user-select: none;
}

.void-gif-keyboard-list {
    padding: 12px 20px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
}

.void-gif-keyboard-list-column {
    width: calc(100% / 3);
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.void-gif-keyboard-list-placeholder {
    font-size: 20px;
    color: rgb(var(--color-text));
    display: flex;
    height: 220px;
    width: 100%;
    justify-content: center;
    align-items: center;
    user-select: none;
}

.void-gif-keyboard-item img {
    width: 100%;
    background-size: contain;
    background-repeat: no-repeat;
    border-radius: 4px;
    cursor: pointer;
    display: block;

}

.void-gif-like-container {
    position: relative;
    width: 100%;
    display: inline-block;
}

.void-gif-like-container img {
    width: 100%;
}

.void-gif-like-container .void-gif-like {
    position: absolute;
    top: 6px;
    right: 6px;
    height: 20px;
    opacity: 0;
    transition: 0.2s ease-in all;
    color: rgb(var(--color-text-bright));
}

.void-gif-like-container:hover .void-gif-like {
    opacity: 1;
}

.void-gif-like-container .void-gif-like svg {
    height: 24px;
}

.void-gif-like-container .void-gif-like.void-liked,
.void-liked {
    color: rgb(var(--color-red));
}

.void-hidden {
    display: none;
}

.void-pagination-container .void-icon-button.void-active,
.void-pagination-container .void-icon-button:hover {
    color: rgb(var(--color-blue));
}

.void-pagination-container .void-icon-button.void-pagination-skip {
    vertical-align: top;
}

.void-quick-access {
    display: flex;
    flex-direction: column;
}

.void-quick-access .void-quick-access-wrap {
    background: rgb(var(--color-foreground));
    display: grid;
    grid-template-columns: repeat(auto-fill, 60px);
    grid-template-rows: repeat(auto-fill, 80px);
    gap: 15px;
    padding: 15px;
    margin-bottom: 25px;
    border-radius: 4px;
}

.void-quick-access .void-quick-access-notifications-wrapper {
    order: 2;
    margin-bottom: 25px;
}

.void-quick-access .void-quick-access-notifications {
    background: rgb(var(--color-foreground));
    overflow-y: auto;
    max-height: 300px;
    scrollbar-width: thin;
    scrollbar-color: rgb(var(--color-blue)) rgba(0, 0, 0, 0);
    border-radius: 4px;
    transition: max-height 0.5s;
}

.void-notifications-config-wrapper {
    padding: 15px;
}

.void-notifications-list {
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.void-quick-access-notifications[collapsed="true"] {
    max-height: 0px;
}

.void-quick-access-notifications-wrapper .section-header h2 {
    cursor: pointer;
}

.void-quick-access .section-header {
    display: flex;
    justify-content: space-between;
}

.void-quick-access-timer {
    font-size: 12px;
    color: rgb(var(--color-text));
}

.void-quick-access-item {
    display: inline-block;
}

.void-quick-access-pfp {
    background-size: contain;
    background-repeat: no-repeat;
    height: 60px;
    width: 60px;
    border-radius: 4px;
}

.void-quick-access-username {
    display: inline-block;
    text-align: center;
    bottom: -20px;
    width: 100%;
    word-break: break-all;
    font-size: 1.2rem;
}

.void-quick-access-badge {
    position: relative;
}

.void-quick-access-badge::after {
    content: "New";
    background: rgb(var(--color-blue));
    border: 3px solid rgb(var(--color-foreground));
    border-radius: 10px;
    padding: 2px 4px;
    font-size: 9px;
    position: absolute;
    top: 2px;
    right: -10px;
    color: white;
}

.void-notification-wrapper {
    display: flex;
    gap: 6px;
}

.void-notification-wrapper .void-notification-preview {
    width: 30px;
    height: 30px;
    display: inline-block;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    margin-right: 6px;
    border-radius: 4px;
    position: relative;
}

.void-notification-wrapper .void-notification-preview.void-notification-preview-media {
    width: auto;
    height: 30px;
    aspect-ratio: 85 / 115;
    background-size: cover;
}

.void-notification-wrapper .void-notification-preview[data-count]::after {
    content: attr(data-count);
    background: rgb(var(--color-blue));
    border: 3px solid rgb(var(--color-foreground));
    border-radius: 10px;
    padding: 2px 4px;
    font-size: 9px;
    position: absolute;
    top: -6px;
    right: -10px;
    color: white;
}

.void-notification-preview-wrapper {
    position: relative;
}

.void-notification-preview-wrapper:hover .void-notification-group,
.void-notification-group:hover {
    display: flex;
}

.void-notification-group {
    display: none;
    position: absolute;
    top: -30px;
    z-index: 20;
    background: rgb(var(--color-foreground));
    border-radius: 4px;
    overflow: hidden;
}

.void-notification-wrapper:first-child .void-notification-group {
    top: unset;
    bottom: -30px;
}

.void-notification-group .void-notification-group-item {
    display: block;
    width: 30px;
    height: 30px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    z-index: 20;
}

.void-notification-wrapper {
    display: flex;
    align-items: center;
}

.void-notification-wrapper .void-notification-context .void-notification-context-actor {
    color: rgb(var(--color-blue));
}

.void-notification-context-reason {
    font-size: 12px;
    padding-top: 2px;
}

.void-notification-wrapper .void-notification-timestamp {
    font-size: 10px;
    margin-left: auto;
    align-self: start;
    min-width: fit-content;
}

.void-unread-notification {
    margin-left: -5px;
    border-left: 5px solid rgb(var(--color-blue));
}

.void-notification-settings-header {
    margin-bottom: 8px;
}

.void-notification-type-list-header {
    font-size: 16px;
    margin: 8px 0 4px 0;
}

#void-notifications-feed-container {
    display: grid;
    grid-template-columns: fit-content(200px) auto;
    gap: 20px;
}

@media screen and (max-width: 800px) {
    #void-notifications-feed-container {
        grid-template-columns: 1fr;
    }
}

.void-notification-filter-input {
    background: rgb(var(--color-foreground));
    margin-bottom: 30px;
}


.void-notifications-feed-settings {
    margin-top: 25px;
}

.void-notifications-feed-sidebar .void-notifications-config-wrapper {
    padding: 0;
    max-height: max-content;
    transition: max-height 0.5s;
    overflow: hidden;
    font-size: 12px;
}

.void-notifications-feed-sidebar .void-notification-settings-header {
    cursor: pointer;
    user-select: none;
}

.void-notifications-feed-sidebar .void-notifications-config-wrapper[collapsed="true"] {
    max-height: 0px;
}

.notifications-feed.container:has(#void-notifications-feed-container) {
    display: block;
}

.void-notifications-feed-filters {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.void-notifications-feed-filter {
    padding: 6px 8px;
    border-radius: 4px;
    cursor: pointer;
    text-transform: capitalize;
}

.void-notifications-feed-filter.void-active,
.void-notifications-feed-filter:hover {
    background-color: rgb(var(--color-foreground));
}

.void-notifications-feed-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.void-notifications-feed-list .void-notification-wrapper {
    background: rgb(var(--color-foreground));
    border-radius: 4px;
    padding: 8px;
}

.void-notifications-feed-list .void-notification-preview{
    width: 50px;
    height: 50px;
}

.void-notifications-feed-list .void-notification-group-item {
    width: 40px;
    height: 40px;
}

.void-notifications-feed-list .void-notification-preview.void-notification-preview-media {
    height: 50px;
}

.void-notifications-feed-list .void-notification-group,
.void-notifications-feed-list .void-notification-wrapper:first-child .void-notification-group {
    top: -40px;
    bottom: unset;
}


.void-notification-preview-relation {
    height: 30px;
    aspect-ratio: 1 / 1;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    border-radius: 4px;
    position: absolute;
    bottom: -3px;
    right: -3px;
}

.void-quick-access-notifications-wrapper .void-notification-preview-relation {
    height: 18px;
}

.void-notifications-feed-empty-notice {
    text-align: center;
}

.void-notifications-load-more-button,
.void-notification-all-read-button {
    display: block;
    width: 100%;
    font-weight: 650;
}

.void-notification-dot {
    background:rgb(var(--color-peach));
    border-radius:50%;
    bottom:0;
    color:#fff2f2;
    display:block;
    font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
    font-size:1.2rem;
    font-weight:500;
    height:20px;
    left:10px;
    line-height:20px;
    overflow:hidden;
    padding-right:1px;
    position:relative;
    text-align:center;
    transition:.2s;
    width:20px
}

.void-notification-dot:visited,
.void-notification-dot:hover {
    color:#fff2f2;
}

.void-chip {
    background: rgb(var(--color-blue));
    border-radius: 9999px;
    display: inline-block;
    padding: 2px 4px;
    font-size: 9px;
    color: white;
    margin: 0px 4px;
    vertical-align: top;
    user-select: none;
}

.void-loader {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: block;
    margin:15px auto;
    position: relative;
    color: rgb(var(--color-blue));
    left: -100px;
    box-sizing: border-box;
    animation: shadowRolling 2s linear infinite;
}

@keyframes shadowRolling {
    0% {
        box-shadow: 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0);
    }
    12% {
        box-shadow: 100px 0 rgb(var(--color-blue)), 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0);
    }
    25% {
        box-shadow: 110px 0 rgb(var(--color-blue)), 100px 0 rgb(var(--color-blue)), 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0);
    }
    36% {
        box-shadow: 120px 0 rgb(var(--color-blue)), 110px 0 rgb(var(--color-blue)), 100px 0 rgb(var(--color-blue)), 0px 0 rgba(255, 255, 255, 0);
    }
    50% {
        box-shadow: 130px 0 rgb(var(--color-blue)), 120px 0 rgb(var(--color-blue)), 110px 0 rgb(var(--color-blue)), 100px 0 rgb(var(--color-blue));
    }
    62% {
        box-shadow: 200px 0 rgba(255, 255, 255, 0), 130px 0 rgb(var(--color-blue)), 120px 0 rgb(var(--color-blue)), 110px 0 rgb(var(--color-blue));
    }
    75% {
        box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 130px 0 rgb(var(--color-blue)), 120px 0 rgb(var(--color-blue));
    }
    87% {
        box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 130px 0 rgb(var(--color-blue));
    }
    100% {
        box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0);
    }
}

.void-notice {
    font-size: 11px;
    margin-top: 5px;
}

.void-select {
    display: inline-flex;
    flex-wrap: wrap;
}

.void-select .void-option {
    padding: 3px 8px;
    background: rgb(var(--color-foreground-blue));
    font-size: 12px;
    cursor: pointer;
    user-select: none;
}

.void-select .void-option:hover {
    background: rgb(var(--color-foreground-blue-dark));
    color: rgb(var(--color-text));
}

.void-select .void-option:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}

.void-select .void-option:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}

.void-select .void-option.active {
    background: rgb(var(--color-blue));
    color: rgb(var(--color-text-bright));
}

.void-label-container {
    margin-top: 6px;
    margin-bottom: 6px;
}

.void-label-span {
    margin-right: 10px;
    min-width: 200px;
    display: inline-block;
}

.void-upload-in-progress {
    cursor: wait !important;
}

.input:has(> .void-drag-indicator) {
    position: relative;
}

.input:has(> .void-drag-indicator)::before {
    content: "Drop Images";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(var(--color-foreground-grey));
    color: rgb(var(--color-blue));
    backdrop-filter: blur(2px);
    font-size: 20px;
    font-weight: 700;
    opacity: 0.9;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
}

body:has(.void-modal-background[open]) {
    overflow: hidden;
}

.void-modal-background[open] {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    backdrop-filter: brightness(50%);
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
}

.void-modal {
    background: rgb(var(--color-foreground));
    color: rgb(var(--color-text));
    border-radius: 4px;
    min-width: 500px;
    padding: 0;
    margin: 0;
    border-width: 0px;
}

.void-modal-header {
    width: 100%;
    background: rgb(var(--color-background));
    padding: 12px;
    border-radius: 4px 4px 0px 0px;
    display: flex;
    justify-content: space-between;
    font-weight: 700;
}

.void-modal-header .void-icon-button {
    color: rgb(var(--color-red));
    height: 20px;
}

.void-modal-content {
    padding: 12px;
    max-height: 500px;
    overflow-y: scroll;
}

.void-change-log-header {
    margin: 4px 0px;
}

.void-change-log-note {
    margin-bottom: 16px;
}

.void-change-log-list {
    list-style: none;
    gap: 5px;
    padding-left: 20px;
}

.void-change-log-list li:not(:last-child) {
    margin-bottom: 4px;
}

.void-change-log-list-item span:first-child {
    text-align: center;
    width: 13px;
    display: inline-block;
}

.void-change-log-list-item span:last-child {
    margin-left: 6px;
}

.void-tooltip-container:has(input) {
    display: inline-block;
}

.void-tooltip-container {
    position: relative;
}

.void-tooltip {
    position: absolute;
    text-align: center;
    top: -8px;
    left: 50%;
    transform: translate(-50%, -100%);
    font-size: 12px;
    padding: 4px 6px;
    background: rgb(var(--color-foreground-blue));
    border-radius: 4px;
    width: max-content;
    max-width: 200px;
    visibility: hidden;
    z-index: 3000;
}

.void-tooltip-container:hover .void-tooltip {
    visibility: visible;
}

.void-tooltip-container:hover .void-tooltip:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: rgb(var(--color-foreground-blue)) transparent transparent transparent;
}

.void-static-tooltip {
    position: absolute;
    text-align: center;
    padding: 8px 12px;
    top: 0px;
    background: rgba(var(--color-overlay), .85);
    border-radius: 4px;
    width: max-content;
    max-width: 200px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease;
    z-index: 9500;
    font-family: Overpass, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    font-size: 1.3rem;
    pointer-events: none;
    user-select: none;
    color: rgb(var(--color-white));
}

.void-static-tooltip:after {
    border: solid transparent;
    border-color: transparent;
    border-width: 5px;
    content: " ";
    height: 0;
    left: 50%;
    margin-left: -5px;
    pointer-events: none;
    position: absolute;
    width: 0;
}

/* tooptip bottom */
.void-static-tooltip:after {
    border-top-color: rgba(var(--color-overlay),.85);
    top: 100%
}

/* tooltip top */
/*.void-static-tooltip:after {*/
/*    border-bottom-color: rgba(var(--color-overlay),.85);*/
/*    bottom: 100%*/
/*}*/

.void-static-tooltip.void-visible {
    opacity: 1;
    visibility: visible;
}

.void-static-tooltip.void-interactable {
    pointer-events: initial;
    cursor: pointer;
}

.void-button.void-self-message,
.void-button.void-slim {
    margin-top: 0;
    margin-right: 0;
    font-family: inherit;
}

.void-button.void-self-message {
    margin-left: 18px;
    font-weight: 900;
}

.activity-edit .rules-notice {
    display: block;
}

.reply:has(.void-reply-collapse) {
    display: flex;
    gap: 8px;
    padding-left: 8px;
}

.reply[collapsed=true] .markdown {
    display: none;
}

.void-reply-collapse {
    width: 4px;
    min-width: 4px;
    background-color: rgb(var(--color-blue));
    border-radius: 4px;
    cursor: pointer;
    align-self: stretch;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.void-reply-content {
    width: 100%;
}

.reply:hover .void-reply-collapse {
    opacity: 1;
}

#void-toast-container {
    position: fixed;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 9000;
}

#void-toast-container.void-bottom-left {
    bottom: 10px;
    left: 10px;
    flex-direction: column-reverse;
}

#void-toast-container.void-bottom-right {
    bottom: 10px;
    right: 10px;
    flex-direction: column-reverse;
}

#void-toast-container.void-top-left {
    top: 70px;
    left: 10px;
}

#void-toast-container.void-top-right {
    top: 70px;
    right: 10px;
}

.void-toast {
    font-size: 14px;
    color: rgb(var(--color-text-bright));
    min-width: 150px;
    max-width: 300px;
    min-heigth: 50px;
    padding: 10px 8px;
    border-radius: 4px;
}

.void-info {
    background: rgb(var(--void-info));
}

.void-success {
    background: rgb(var(--void-success));
}

.void-error {
    background: rgb(var(--void-error));
}

.void-warning {
    background: rgb(var(--void-warning));
}

.void-activity-reply-controls-container {
    background: rgb(var(--color-foreground));
    border-radius: 4px;
    justify-self: flex-start;
    margin: 10px 0px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
}

.void-activity-reply-controls-container[closed="true"] {
    display: none;
}

.void-media-status-controls {
    display: flex;
    gap: 10px;
    padding: 12px;
    height: 168px;
}

.void-media-status-controls .void-gif-keyboard-list-placeholder {
    height: unset;
}

.void-activity-reply-progress-container {
    display: flex;
    flex-direction: column;
    max-width: 100%;
    flex-shrink: 1;
    overflow: hidden;
}

.void-activity-reply-progress-container .void-media-search-title {
    font-size: 16px;
}

.void-activity-reply-progress-container .void-media-search-type {
    font-size: 12px;
    margin-top: 2px;
}

.void-activity-reply-progress-container .void-layout-header {
    margin-top: 10px;
    margin-bottom: 5px;
}

.void-reply-button-container {
    display: flex;
    justify-content: flex-end;
}

.void-activity-reply-toggle-button {
    display: flex;
    align-items: center;
    background-color: rgb(var(--color-blue));
    padding: 10px 15px;
    border-radius: 4px;
}

.void-media-status-controls .void-status-poster {
    height: 144px;
    aspect-ratio: 75 / 115;
    object-fit: cover;
}

.void-activity-reply-toggle-button svg {
    height: 18px;
}

.void-activity-reply-header {
    width: 100%;
    background: rgb(var(--color-foreground-grey-dark));
    display: flex;
    justify-content: space-between;
    padding: 12px;
    border-radius: 4px 4px 0px 0px;
}

.void-search-container {
    position: relative;
    width: fit-content;
}

.void-search-results {
    position: absolute;
    z-index: 9000;
    background: rgb(var(--color-foreground));
    border: 2px solid rgb(var(--color-blue));
    border-top: 0px solid transparent;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: 0px 0px 4px 4px;
}

.void-user-search-avatar {
    width: 40px;
    height: 40px;
}

.void-user-search-name {
    padding-left: 4px;
    display: flex;
    align-items: center;
}

.void-search-results:empty {
    display: none;
}

.void-ace-editor {
    width: 100%;
    height: 600px;
    max-height: 800px;
    resize: vertical;
    min-height: 150px;
    scrollbar-color: rgb(var(--color-blue)) rgba(0, 0, 0, 0);
}

.void-status-poster {
    height: 85px;
    border-radius: 4px;
    user-select: none;
}

.void-search-result {
    cursor: pointer;
    padding: 4px 6px;
    display: flex;
    gap: 5px;
    text-overflow: ellipsis;
    align-items: center;
}

.void-media-search-poster {
    width: 30px;
    height: 30px;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: 4px;
}

.void-media-search-info {
    max-width: calc(100% - 30px - 4px - 4px);
}

.void-media-search-title {
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.void-media-search-type {
    font-size: 10px;
    font-style: italic;
}

.void-media-search-result:hover {
    background: rgb(var(--color-foreground-grey));
}

.void-image-preview-container {
    display: none;
    position: fixed;
    max-width: 55%;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 4px;
    overflow: hidden;
    z-index: 9500;
}

.void-image-preview-container img {
    width: 100%;
}

.void-dropbox {
    align-items: center;
    background: rgba(var(--color-background),.6);
    border-radius: 4px;
    color: rgb(var(--color-text-lighter));
    cursor: pointer;
    display: inline-flex;
    font-size: 1.3rem;
    height: 200px;
    justify-content: center;
    line-height: 2rem;
    margin-right: 20px;
    outline-offset: -12px;
    outline: 2px dashed rgba(var(--color-text),.2);
    padding: 18px 20px;
    position: relative;
    transition: .2s;
    vertical-align: text-top;
    width: 200px
}

.void-dropbox p {
    font-size: 1.2em;
    padding: 50px 0;
    text-align: center
}

.void-file-input {
    cursor: pointer;
    height: 200px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    width: 100%;
}

.void-media-display-container {
    display: flex;
    width: fit-content;
    border-radius: 4px;
    overflow: hidden;
    background: rgb(var(--color-foreground));
}

.void-media-display-poster {
    aspect-ratio: 85 / 115;
    height: 85px;
    background-size: cover;
    background-position: 50% 50%;
}

.void-media-display-info {
    padding: 15px;
}

.void-media-display-title {
    font-weight: 700;
}

.void-media-display-type {
    font-size: .8em;
    padding-top: 5px;
}

.void-hide-404 .not-found {
    display: none;
}

.markdown .void-video-link {
    display: block;
    width: 100%;
    padding: 10px;
    text-align: center;
    /*aspect-ratio: 16 / 9;*/
    background: rgb(var(--color-foreground-blue-dark));
    color: rgb(var(--color-text));
    border-radius: 4px;
}

.void-quote {
    cursor: pointer;
    transition: border-color .3s ease;
}

.void-quote:hover {
    border-color: rgb(var(--color-blue));
}

.void-has-icon svg {
    height: 14px;
    vertical-align: text-top;
}

.void-icon-pointer svg {
    cursor: pointer;
}

.void-icon-mr svg {
    margin-right: 6px;
}

.void-icon-ml svg {
    margin-left: 6px;
}

.void-icon-v-top svg {
    vertical-align: top;
}

.void-align-right {
    margin-left: auto;
}

.void-align-right-container {
    display: flex;
    gap: inherit;
    margin-left: auto;
}

.void-color-blue {
    color: rgb(var(--color-blue));
}

.void-icon-rotate-90 svg {
    transform: rotate(90deg);
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/assets/styles/utility-classes.css":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.void-flex {
    display: flex;
}

.void-flex-column {
    flex-direction: column;
}

.void-justify-center {
    justify-content: center;
}

.void-justify-between {
    justify-content: space-between;
}

.void-justify-end {
    justify-content: flex-end;
}

.void-items-start {
    align-items: flex-start;
}

.void-items-center {
    align-items: center;
}

.void-p-6 {
    padding: 6px;
}

.void-mt-10 {
    margin-top: 10px;
}

.void-gap-5 {
    gap: 5px;
}

.void-gap-10 {
    gap: 10px;
}

.void-cursor-pointer {
    cursor: pointer;
}

.void-w-100 {
    width: 100%;
}

.void-w-max-content {
    width: max-content;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/noSourceMaps.js":
/***/ ((module) => {



module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

;// CONCATENATED MODULE: ./src/handlers/styleHandler.js
class StyleHandler {
	settings;
	usernameStyles = "";
	highlightStyles = "";
	otherStyles = "";

	constructor(settings) {
		this.settings = settings;
	}

	refreshStyles() {
		this.createStyles();
		this.createStyleLink(this.usernameStyles, "username");
		this.createStyleLink(this.highlightStyles, "highlight");
		this.createStyleLink(this.otherStyles, "other");
	}

	createStyles() {
		this.usernameStyles = "";
		this.otherStyles = "";

		for (const user of this.settings.verifiedUsers) {
			if (
				this.settings.options.enabledForUsername.getValue() ||
				user.enabledForUsername
			) {
				this.createUsernameCSS(user);
			}
		}

		if (this.settings.options.moveSubscribeButtons.getValue()) {
			this.otherStyles += `
                .has-label::before {
                top: -30px !important;
                left: unset !important;
                right: -10px;
                }

                .has-label[label="Unsubscribe"],
                .has-label[label="Subscribe"] {
                font-size: 0.875em !important;
                }

                .has-label[label="Unsubscribe"] {
                color: rgba(var(--color-green),.8);
                }
                `;
		}

		this.createHighlightStyles();

		if (this.settings.options.hideLikeCount.getValue()) {
			this.otherStyles += `
                    .like-wrap .count {
                        display: none;
                    }
                `;
		}
	}

	createHighlightStyles() {
		this.highlightStyles = "";
		for (const user of this.settings.verifiedUsers) {
			if (
				this.settings.options.highlightEnabled.getValue() ||
				user.highlightEnabled
			) {
				this.createHighlightCSS(
					user,
					`div.wrap:has( div.header > a.name[href*="/${user.username}/" i] )`,
				);
				this.createHighlightCSS(
					user,
					`div.wrap:has( div.details > a.name[href*="/${user.username}/" i] )`,
				);
			}

			if (
				this.settings.options.highlightEnabledForReplies.getValue() ||
				user.highlightEnabledForReplies
			) {
				this.createHighlightCSS(
					user,
					`div.reply:has( a.name[href*="/${user.username}/" i] )`,
				);
			}

			this.#createActivityCss(user);
		}

		this.disableHighlightOnSmallCards();
	}

	#createActivityCss(user) {
		const colorUserActivity =
			this.settings.options.colorUserActivity.getValue() ??
			user.colorUserActivity;
		const colorUserReplies =
			this.settings.options.colorUserReplies.getValue() ??
			user.colorUserReplies;

		if (colorUserActivity) {
			this.highlightStyles += `
                div.wrap:has( div.header > a.name[href*="/${
					user.username
				}/"]) a,
                div.wrap:has( div.details > a.name[href*="/${
					user.username
				}/"]) a
                {
                    color: ${this.getUserColor(user)};
                }
            `;
		}
		if (colorUserReplies) {
			this.highlightStyles += `
                .reply:has(a.name[href*="/${user.username}/"]) a,
                .reply:has(a.name[href*="/${
					user.username
				}/"]) .markdown-spoiler::before
                {
                    color: ${this.getUserColor(user)};
                }
            `;
		}
	}

	createUsernameCSS(user) {
		this.usernameStyles += `
            a.name[href*="/${user.username}/" i]::after {
                content: "${
					this.stringIsEmpty(user.sign) ??
					this.settings.options.defaultSign.getValue()
				}";
                color: ${this.getUserColor(user) ?? "rgb(var(--color-blue))"}
            }
        `;
	}

	createHighlightCSS(user, selector) {
		this.highlightStyles += `
                ${selector} {
                    margin-right: -${this.settings.options.highlightSize.getValue()};
                    border-right: ${this.settings.options.highlightSize.getValue()} solid ${
						this.getUserColor(user) ??
						this.getDefaultHighlightColor()
					};
                    border-radius: 5px;
                }
                `;
	}

	disableHighlightOnSmallCards() {
		this.highlightStyles += `
                div.wrap:has(div.small) {
                margin-right: 0px !important;
                border-right: 0px solid black !important;
                }
                `;
	}

	refreshHomePage() {
		if (!this.settings.options.highlightEnabled.getValue()) {
			return;
		}
		this.createHighlightStyles();
		this.createStyleLink(this.highlightStyles, "highlight");
	}

	clearStyles(id) {
		const styles = document.getElementById(`void-verified-${id}-styles`);
		styles?.remove();
	}

	verifyProfile() {
		if (!this.settings.options.enabledForProfileName.getValue()) {
			return;
		}

		const username =
			window.location.pathname.match(/^\/user\/([^/]*)\/?/)[1];

		const user = this.settings.verifiedUsers.find(
			(u) => u.username.toLowerCase() === username.toLowerCase(),
		);

		if (!user) {
			this.clearStyles("profile");
			return;
		}

		const profileStyle = `
                    .name-wrapper h1.name::after {
                    content: "${
						this.stringIsEmpty(user.sign) ??
						this.settings.options.defaultSign.getValue()
					}"
                    }
                `;
		this.createStyleLink(profileStyle, "profile");
	}

	getStyleLink(id) {
		return document.getElementById(`void-verified-${id}-styles`);
	}

	copyUserColor() {
		const usernameHeader = document.querySelector("h1.name");
		const username = usernameHeader.innerHTML.trim();
		const user = this.settings.verifiedUsers.find(
			(u) => u.username === username,
		);

		if (!user) {
			return;
		}

		if (
			!(
				user.copyColorFromProfile ||
				this.settings.options.copyColorFromProfile.getValue()
			)
		) {
			return;
		}

		const color =
			getComputedStyle(usernameHeader).getPropertyValue("--color-blue");

		this.settings.updateUserOption(user.username, "color", color);
	}

	getUserColor(user) {
		return (
			user.colorOverride ??
			(user.color &&
			(user.copyColorFromProfile ||
				this.settings.options.copyColorFromProfile.getValue())
				? `rgb(${user.color})`
				: undefined)
		);
	}

	getDefaultHighlightColor() {
		if (this.settings.options.useDefaultHighlightColor.getValue()) {
			return this.settings.options.defaultHighlightColor.getValue();
		}
		return "rgb(var(--color-blue))";
	}

	createStyleLink(styles, id) {
		const oldLink = document.getElementById(`void-verified-${id}-styles`);
		const link = document.createElement("link");
		link.setAttribute("id", `void-verified-${id}-styles`);
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("type", "text/css");
		link.setAttribute(
			"href",
			"data:text/css;charset=UTF-8," + encodeURIComponent(styles),
		);
		document.head?.append(link);
		oldLink?.remove();
		return link;
	}
	
	stringIsEmpty(string) {
		if (!string || string.length === 0) {
			return undefined;
		}
		return string;
	}
}

;// CONCATENATED MODULE: ./src/assets/localStorageKeys.ts
const LocalStorageKeys = {
    imageHostConfig: "void-verified-image-host-config",
    readNotifications: "void-verified-read-notifications",
    notificationsConfig: "void-verified-notifications-config",
    notificationsConfigQuickAccess: "void-verified-quick-access-notifications-config",
    notificationRelationsCache: "void-verified-notification-relations",
    notificationDeadLinkRelationsCache: "void-verified-notification-deadlink-relations",
    quickStartConfig: "void-verified-quick-start-config",
    gifKeyboardConfig: "void-verified-gif-keyboard",
    globalCSS: "void-verified-global-css",
    goalsConfig: "void-verified-goals",
    layouts: "void-verified-layouts",
    miniProfileCache: "void-verified-mini-profile-cache",
    miniProfileConfig: "void-verified-mini-profile-config",
    verifiedUSers: "void-verified-users",
    settings: "void-verified-settings",
    toasterConfig: "void-verified-toaster-config",
    collapsedContainers: "void-verified-collapsed-containers",
    timeConfig: "void-verified-time-config",
    drafts: "void-verified-markdown-drafts"
};

;// CONCATENATED MODULE: ./src/assets/icons.js
// MIT License

// Copyright (c) 2020 Refactoring UI Inc.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const RefreshIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
        </svg>`, "text/html",).body.childNodes[0];
	return icon;
};

const EyeIcon = () => {
	const icon = new DOMParser().parseFromString(`	<svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
            </svg>;
      `, "text/html",).body.childNodes[0];
	return icon;
};

const EyeClosedIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
            />
        </svg>;
      `, "text/html",).body.childNodes[0];
	return icon;
};

const TrashcanIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
        </svg>;
      `, "text/html",).body.childNodes[0];
	return icon;
};

const AddIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
        </svg>;
      `, "text/html",).body.childNodes[0];
	return icon;
};
const GifIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12.75 8.25v7.5m6-7.5h-3V12m0 0v3.75m0-3.75H18M9.75 9.348c-1.03-1.464-2.698-1.464-3.728 0-1.03 1.465-1.03 3.84 0 5.304 1.03 1.464 2.699 1.464 3.728 0V12h-1.5M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
            />
        </svg>;
      `, "text/html",).body.childNodes[0];
	return icon;
};
const HeartIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
            >
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>;
      `, "text/html",).body.childNodes[0];
	return icon;
};
const DoubleChevronLeftIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
      </svg>
      `, "text/html",).body.childNodes[0];
	return icon;
};
const DoubleChevronRightIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
      </svg>
      `, "text/html",).body.childNodes[0];
	return icon;
};

const CloseIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>

      `, "text/html",).body.childNodes[0];
	return icon;
};

const CogIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
      `, "text/html",).body.childNodes[0];
	return icon;
};

const PensilSquareIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>

      `, "text/html",).body.childNodes[0];
	return icon;
};

const CheckBadgeIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
      </svg>`, "text/html",).body.childNodes[0];
	return icon;
};

const SearchDocumentIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
      `, "text/html",).body.childNodes[0];
	return icon;
};

const FilmIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
				  <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
				</svg>
				`, "text/html",).body.childNodes[0];
	return icon;
}
const MapIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
</svg>
`, "text/html",).body.childNodes[0];
	return icon;
}

const CommandLineIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
</svg>
`, "text/html",).body.childNodes[0];
	return icon;
}

const ArrowLongRightIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
</svg>
`, "text/html",).body.childNodes[0];
	return icon;
}

const ReplyIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg data-v-04d66030="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comments" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-comments fa-w-18 fa-sm"><path data-v-04d66030="" fill="currentColor" d="M416 192c0-88.4-93.1-160-208-160S0 103.6 0 192c0 34.3 14.1 65.9 38 92-13.4 30.2-35.5 54.2-35.8 54.5-2.2 2.3-2.8 5.7-1.5 8.7S4.8 352 8 352c36.6 0 66.9-12.3 88.7-25 32.2 15.7 70.3 25 111.3 25 114.9 0 208-71.6 208-160zm122 220c23.9-26 38-57.7 38-92 0-66.9-53.5-124.2-129.3-148.1.9 6.6 1.3 13.3 1.3 20.1 0 105.9-107.7 192-240 192-10.8 0-21.3-.8-31.7-1.9C207.8 439.6 281.8 480 368 480c41 0 79.1-9.2 111.3-25 21.8 12.7 52.1 25 88.7 25 3.2 0 6.1-1.9 7.3-4.8 1.3-2.9.7-6.3-1.5-8.7-.3-.3-22.4-24.2-35.8-54.5z" class=""></path></svg>
`, "text/html",).body.childNodes[0];
	return icon;
}

const LikeIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg data-v-04d66030="" data-v-5fb0ec91="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heart" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-heart fa-w-16 fa-sm"><path data-v-04d66030="" data-v-5fb0ec91="" fill="currentColor" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z" class=""></path></svg>`, "text/html",).body.childNodes[0];
	return icon;
}

const SubscribeBellIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg data-v-04d66030="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bell" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-bell fa-w-14"><path data-v-04d66030="" fill="currentColor" d="M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z" class=""></path></svg>`, "text/html",).body.childNodes[0];
	return icon;
}


const LinkIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
</svg>
`, "text/html",).body.childNodes[0];
	return icon;
}

const BoldIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bold" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-bold fa-w-12"><path fill="currentColor" d="M333.49 238a122 122 0 0 0 27-65.21C367.87 96.49 308 32 233.42 32H34a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h31.87v288H34a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h209.32c70.8 0 134.14-51.75 141-122.4 4.74-48.45-16.39-92.06-50.83-119.6zM145.66 112h87.76a48 48 0 0 1 0 96h-87.76zm87.76 288h-87.76V288h87.76a56 56 0 0 1 0 112z" class=""></path></svg>
`, "text/html",).body.childNodes[0];
	return icon;
}

const ItalicIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="italic" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="svg-inline--fa fa-italic fa-w-10"><path fill="currentColor" d="M320 48v32a16 16 0 0 1-16 16h-62.76l-80 320H208a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h62.76l80-320H112a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h192a16 16 0 0 1 16 16z" class=""></path></svg>
`, "text/html",).body.childNodes[0];
	return icon;
}

const StrikeThroughIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="strikethrough" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-strikethrough fa-w-16"><path fill="currentColor" d="M496 224H293.9l-87.17-26.83A43.55 43.55 0 0 1 219.55 112h66.79A49.89 49.89 0 0 1 331 139.58a16 16 0 0 0 21.46 7.15l42.94-21.47a16 16 0 0 0 7.16-21.46l-.53-1A128 128 0 0 0 287.51 32h-68a123.68 123.68 0 0 0-123 135.64c2 20.89 10.1 39.83 21.78 56.36H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h480a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-180.24 96A43 43 0 0 1 336 356.45 43.59 43.59 0 0 1 292.45 400h-66.79A49.89 49.89 0 0 1 181 372.42a16 16 0 0 0-21.46-7.15l-42.94 21.47a16 16 0 0 0-7.16 21.46l.53 1A128 128 0 0 0 224.49 480h68a123.68 123.68 0 0 0 123-135.64 114.25 114.25 0 0 0-5.34-24.36z" class=""></path></svg>`, "text/html",).body.childNodes[0];
	return icon;
}

const SpoilerIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye-slash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="svg-inline--fa fa-eye-slash fa-w-20"><path fill="currentColor" d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z" class=""></path></svg>`, "text/html",).body.childNodes[0];
	return icon;
}

const LinkIconMarkdown = () => {
	const icon = new DOMParser().parseFromString(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="link" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-link fa-w-16"><path fill="currentColor" d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z" class=""></path></svg>`, "text/html",).body.childNodes[0];
	return icon;
}

const ImageIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="image" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-image fa-w-16"><path fill="currentColor" d="M464 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48zM112 120c-30.928 0-56 25.072-56 56s25.072 56 56 56 56-25.072 56-56-25.072-56-56-56zM64 384h384V272l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L208 320l-55.515-55.515c-4.686-4.686-12.284-4.686-16.971 0L64 336v48z" class=""></path></svg>`, "text/html",).body.childNodes[0];
	return icon;
}

const YoutubeIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="youtube" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-youtube fa-w-18"><path fill="currentColor" d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" class=""></path></svg>`, "text/html",).body.childNodes[0];
	return icon;
}

const WebMIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="video" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-video fa-w-18"><path fill="currentColor" d="M336.2 64H47.8C21.4 64 0 85.4 0 111.8v288.4C0 426.6 21.4 448 47.8 448h288.4c26.4 0 47.8-21.4 47.8-47.8V111.8c0-26.4-21.4-47.8-47.8-47.8zm189.4 37.7L416 177.3v157.4l109.6 75.5c21.2 14.6 50.4-.3 50.4-25.8V127.5c0-25.4-29.1-40.4-50.4-25.8z" class=""></path></svg>`, "text/html",).body.childNodes[0];
	return icon;
}

const OrderedListIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="list-ol" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-list-ol fa-w-16"><path fill="currentColor" d="M61.77 401l17.5-20.15a19.92 19.92 0 0 0 5.07-14.19v-3.31C84.34 356 80.5 352 73 352H16a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h22.83a157.41 157.41 0 0 0-11 12.31l-5.61 7c-4 5.07-5.25 10.13-2.8 14.88l1.05 1.93c3 5.76 6.29 7.88 12.25 7.88h4.73c10.33 0 15.94 2.44 15.94 9.09 0 4.72-4.2 8.22-14.36 8.22a41.54 41.54 0 0 1-15.47-3.12c-6.49-3.88-11.74-3.5-15.6 3.12l-5.59 9.31c-3.72 6.13-3.19 11.72 2.63 15.94 7.71 4.69 20.38 9.44 37 9.44 34.16 0 48.5-22.75 48.5-44.12-.03-14.38-9.12-29.76-28.73-34.88zM496 224H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM16 160h64a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8H64V40a8 8 0 0 0-8-8H32a8 8 0 0 0-7.14 4.42l-8 16A8 8 0 0 0 24 64h8v64H16a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8zm-3.91 160H80a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8H41.32c3.29-10.29 48.34-18.68 48.34-56.44 0-29.06-25-39.56-44.47-39.56-21.36 0-33.8 10-40.46 18.75-4.37 5.59-3 10.84 2.8 15.37l8.58 6.88c5.61 4.56 11 2.47 16.12-2.44a13.44 13.44 0 0 1 9.46-3.84c3.33 0 9.28 1.56 9.28 8.75C51 248.19 0 257.31 0 304.59v4C0 316 5.08 320 12.09 320z" class=""></path></svg>`, "text/html",).body.childNodes[0];
	return icon;
}

const UnorderedListIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="list-ul" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-list-ul fa-w-16"><path fill="currentColor" d="M48 48a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm0 160a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm0 160a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm448 16H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z" class=""></path></svg>`, "text/html",).body.childNodes[0];
	return icon;
}

const HeaderIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heading" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-heading fa-w-16"><path fill="currentColor" d="M448 96v320h32a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H320a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h32V288H160v128h32a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H32a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h32V96H32a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16h-32v128h192V96h-32a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16z" class=""></path></svg>`, "text/html",).body.childNodes[0];
	return icon;
}

const CenterTextIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="align-center" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-align-center fa-w-14"><path fill="currentColor" d="M432 160H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0 256H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM108.1 96h231.81A12.09 12.09 0 0 0 352 83.9V44.09A12.09 12.09 0 0 0 339.91 32H108.1A12.09 12.09 0 0 0 96 44.09V83.9A12.1 12.1 0 0 0 108.1 96zm231.81 256A12.09 12.09 0 0 0 352 339.9v-39.81A12.09 12.09 0 0 0 339.91 288H108.1A12.09 12.09 0 0 0 96 300.09v39.81a12.1 12.1 0 0 0 12.1 12.1z" class=""></path></svg>`, "text/html",).body.childNodes[0];
	return icon;
}

const QuoteIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="quote-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-quote-right fa-w-16"><path fill="currentColor" d="M464 32H336c-26.5 0-48 21.5-48 48v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48zm-288 0H48C21.5 32 0 53.5 0 80v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48z" class=""></path></svg>`, "text/html",).body.childNodes[0];
	return icon;
}

const CodeIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="code" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="svg-inline--fa fa-code fa-w-20"><path fill="currentColor" d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z" class=""></path></svg>`, "text/html",).body.childNodes[0];
	return icon;
}

const ArrowsLeftRightIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
</svg>
`, "text/html",).body.childNodes[0];
	return icon;
}

const CommunityModIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg data-v-3ce25d2e="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="shield-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon svg-inline--fa fa-shield-alt fa-w-16"><path data-v-3ce25d2e="" fill="currentColor" d="M466.5 83.7l-192-80a48.15 48.15 0 0 0-36.9 0l-192 80C27.7 91.1 16 108.6 16 128c0 198.5 114.5 335.7 221.5 380.3 11.8 4.9 25.1 4.9 36.9 0C360.1 472.6 496 349.3 496 128c0-19.4-11.7-36.9-29.5-44.3zM256.1 446.3l-.1-381 175.9 73.3c-3.3 151.4-82.1 261.1-175.8 307.7z" class=""></path></svg>
`, "text/html",).body.childNodes[0];
	return icon;
}

const AdminIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg data-v-3ce25d2e="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="wrench" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon svg-inline--fa fa-wrench fa-w-16"><path data-v-3ce25d2e="" fill="currentColor" d="M507.73 109.1c-2.24-9.03-13.54-12.09-20.12-5.51l-74.36 74.36-67.88-11.31-11.31-67.88 74.36-74.36c6.62-6.62 3.43-17.9-5.66-20.16-47.38-11.74-99.55.91-136.58 37.93-39.64 39.64-50.55 97.1-34.05 147.2L18.74 402.76c-24.99 24.99-24.99 65.51 0 90.5 24.99 24.99 65.51 24.99 90.5 0l213.21-213.21c50.12 16.71 107.47 5.68 147.37-34.22 37.07-37.07 49.7-89.32 37.91-136.73zM64 472c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z" class=""></path></svg>`, "text/html",).body.childNodes[0];
	return icon;
}

const DeveloperIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg data-v-3ce25d2e="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="code" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="icon svg-inline--fa fa-code fa-w-20"><path data-v-3ce25d2e="" fill="currentColor" d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z" class=""></path></svg>`, "text/html",).body.childNodes[0];
	return icon;
}

const SocialMediaModIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg data-v-3ce25d2e="" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="twitter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon svg-inline--fa fa-twitter fa-w-16"><path data-v-3ce25d2e="" fill="currentColor" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" class=""></path></svg>`, "text/html",).body.childNodes[0];
	return icon;
}

const AnimeDataModIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg data-v-3ce25d2e="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="icon svg-inline--fa fa-play fa-w-14"><path data-v-3ce25d2e="" fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" class=""></path></svg>`, "text/html",).body.childNodes[0];
	return icon;
}

const DiscordModIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg data-v-3ce25d2e="" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="discord" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="icon svg-inline--fa fa-discord fa-w-14"><path data-v-3ce25d2e="" fill="currentColor" d="M297.216 243.2c0 15.616-11.52 28.416-26.112 28.416-14.336 0-26.112-12.8-26.112-28.416s11.52-28.416 26.112-28.416c14.592 0 26.112 12.8 26.112 28.416zm-119.552-28.416c-14.592 0-26.112 12.8-26.112 28.416s11.776 28.416 26.112 28.416c14.592 0 26.112-12.8 26.112-28.416.256-15.616-11.52-28.416-26.112-28.416zM448 52.736V512c-64.494-56.994-43.868-38.128-118.784-107.776l13.568 47.36H52.48C23.552 451.584 0 428.032 0 398.848V52.736C0 23.552 23.552 0 52.48 0h343.04C424.448 0 448 23.552 448 52.736zm-72.96 242.688c0-82.432-36.864-149.248-36.864-149.248-36.864-27.648-71.936-26.88-71.936-26.88l-3.584 4.096c43.52 13.312 63.744 32.512 63.744 32.512-60.811-33.329-132.244-33.335-191.232-7.424-9.472 4.352-15.104 7.424-15.104 7.424s21.248-20.224 67.328-33.536l-2.56-3.072s-35.072-.768-71.936 26.88c0 0-36.864 66.816-36.864 149.248 0 0 21.504 37.12 78.08 38.912 0 0 9.472-11.52 17.152-21.248-32.512-9.728-44.8-30.208-44.8-30.208 3.766 2.636 9.976 6.053 10.496 6.4 43.21 24.198 104.588 32.126 159.744 8.96 8.96-3.328 18.944-8.192 29.44-15.104 0 0-12.8 20.992-46.336 30.464 7.68 9.728 16.896 20.736 16.896 20.736 56.576-1.792 78.336-38.912 78.336-38.912z" class=""></path></svg>`, "text/html",).body.childNodes[0];
	return icon;
}

const MangaDataModIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg data-v-3ce25d2e="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="book-open" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="icon svg-inline--fa fa-book-open fa-w-18"><path data-v-3ce25d2e="" fill="currentColor" d="M542.22 32.05c-54.8 3.11-163.72 14.43-230.96 55.59-4.64 2.84-7.27 7.89-7.27 13.17v363.87c0 11.55 12.63 18.85 23.28 13.49 69.18-34.82 169.23-44.32 218.7-46.92 16.89-.89 30.02-14.43 30.02-30.66V62.75c.01-17.71-15.35-31.74-33.77-30.7zM264.73 87.64C197.5 46.48 88.58 35.17 33.78 32.05 15.36 31.01 0 45.04 0 62.75V400.6c0 16.24 13.13 29.78 30.02 30.66 49.49 2.6 149.59 12.11 218.77 46.95 10.62 5.35 23.21-1.94 23.21-13.46V100.63c0-5.29-2.62-10.14-7.27-12.99z" class=""></path></svg>`, "text/html",).body.childNodes[0];
	return icon;
}

const CharacterDataModIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg data-v-3ce25d2e="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-ninja" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="icon svg-inline--fa fa-user-ninja fa-w-14"><path data-v-3ce25d2e="" fill="currentColor" d="M325.4 289.2L224 390.6 122.6 289.2C54 295.3 0 352.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-70.2-54-127.1-122.6-133.2zM32 192c27.3 0 51.8-11.5 69.2-29.7 15.1 53.9 64 93.7 122.8 93.7 70.7 0 128-57.3 128-128S294.7 0 224 0c-50.4 0-93.6 29.4-114.5 71.8C92.1 47.8 64 32 32 32c0 33.4 17.1 62.8 43.1 80-26 17.2-43.1 46.6-43.1 80zm144-96h96c17.7 0 32 14.3 32 32H144c0-17.7 14.3-32 32-32z" class=""></path></svg>`, "text/html",).body.childNodes[0];
	return icon;
}

const StaffDataModIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg data-v-3ce25d2e="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="icon svg-inline--fa fa-user fa-w-14"><path data-v-3ce25d2e="" fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z" class=""></path></svg>`, "text/html",).body.childNodes[0];
	return icon;
}

const RetiredModIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg data-v-3ce25d2e="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="graduation-cap" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="icon svg-inline--fa fa-graduation-cap fa-w-20"><path data-v-3ce25d2e="" fill="currentColor" d="M622.34 153.2L343.4 67.5c-15.2-4.67-31.6-4.67-46.79 0L17.66 153.2c-23.54 7.23-23.54 38.36 0 45.59l48.63 14.94c-10.67 13.19-17.23 29.28-17.88 46.9C38.78 266.15 32 276.11 32 288c0 10.78 5.68 19.85 13.86 25.65L20.33 428.53C18.11 438.52 25.71 448 35.94 448h56.11c10.24 0 17.84-9.48 15.62-19.47L82.14 313.65C90.32 307.85 96 298.78 96 288c0-11.57-6.47-21.25-15.66-26.87.76-15.02 8.44-28.3 20.69-36.72L296.6 284.5c9.06 2.78 26.44 6.25 46.79 0l278.95-85.7c23.55-7.24 23.55-38.36 0-45.6zM352.79 315.09c-28.53 8.76-52.84 3.92-65.59 0l-145.02-44.55L128 384c0 35.35 85.96 64 192 64s192-28.65 192-64l-14.18-113.47-145.03 44.56z" class=""></path></svg>`, "text/html",).body.childNodes[0];
	return icon;
}

const ChevronDownIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
</svg>
`, "text/html",).body.childNodes[0];
	return icon;
}

const ChevronUpIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
</svg>
`, "text/html",).body.childNodes[0];
	return icon;
}

const PencilSquareIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>
`, "text/html",).body.childNodes[0];
	return icon;
}

const XMarkIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
`, "text/html",).body.childNodes[0];
	return icon;
}

const EllipsisHorizontalIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
</svg>
`, "text/html",).body.childNodes[0];
	return icon;
}

const CheckIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
</svg>
`, "text/html",).body.childNodes[0];
	return icon;
}

const ArrowTurnLeftIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
</svg>
`, "text/html",).body.childNodes[0];
	return icon;
}

const ArrowUpTrayIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
</svg>
`, "text/html",).body.childNodes[0];
	return icon;
}

const ChevronUpDownIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
</svg>
`, "text/html",).body.childNodes[0];
	return icon;
}


const DocumentTextIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
</svg>
`, "text/html",).body.childNodes[0];
	return icon;
}
const DocumentArrowDownIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
</svg>
`, "text/html",).body.childNodes[0];
	return icon;
}

const DocumentArrowUpIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
</svg>
`, "text/html",).body.childNodes[0];
	return icon;
}

const ChatBubbleLeftRightIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
</svg>
`, "text/html",).body.childNodes[0];
	return icon;
}

const ArrowTopRightOnSquareIcon = () => {
	const icon = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
</svg>
`, "text/html",).body.childNodes[0];
	return icon;
}

;// CONCATENATED MODULE: ./src/assets/imageFormats.js
const ImageFormats = [
	"jpg",
	"png",
	"gif",
	"webp",
	"apng",
	"avif",
	"jpeg",
	"svg",
];

;// CONCATENATED MODULE: ./src/utils/vue.ts
class Vue {
    // @ts-ignore
    static vue = document.querySelector('#app')?.__vue__;
    // @ts-ignore
    static router = document.querySelector('#app')?.__vue__?.$router;
    static ensureIsRegistered() {
        let tries = 0;
        let vueInterval = setInterval(() => {
            if (!this.vue && tries < 20) {
                // @ts-ignore
                this.vue = document.querySelector('#app')?.__vue__;
                tries++;
            }
            else {
                clearInterval(vueInterval);
            }
        }, 50);
        let tries2 = 0;
        let routerInterval = setInterval(() => {
            if (!this.router && tries2 < 20) {
                // @ts-ignore
                this.router = document.querySelector('#app')?.__vue__?.$router;
                tries2++;
            }
            else {
                clearInterval(routerInterval);
            }
        }, 50);
    }
    static handleAnchorClickEvent(event) {
        const target = event.target.closest("a");
        if (target.href && Vue.router) {
            if (target.hostname === window.location.hostname) {
                event.preventDefault();
                const path = target.pathname + target.search;
                const pathStart = path.slice(1).split("/")[0];
                const locationStart = window.location.pathname.slice(1).split("/")[0];
                if (pathStart === locationStart) {
                    document.body.classList.add("void-hide-404");
                    this.router.push("/404");
                    setTimeout(() => {
                        this.router.replace(path);
                        document.body.classList.remove("void-hide-404");
                    }, 5);
                }
                else {
                    this.router.push(path);
                }
            }
        }
    }
    static getProps(element) {
        const el = typeof element === "string" ? document.querySelector(element) : element;
        if (!el) {
            return null;
        }
        // @ts-ignore;
        const instance = el.__vue__;
        if (!instance || !instance?.$props) {
            return null;
        }
        return instance.$props;
    }
}

;// CONCATENATED MODULE: ./src/utils/DOM.ts

class DOM_DOM {
    static create(element, classes, children, options = {}) {
        const el = document.createElement(element);
        if (element.toLowerCase() === "a") {
            el.addEventListener("click", (event) => {
                Vue.handleAnchorClickEvent(event);
            });
        }
        this.transformClasses(el, classes);
        if (children) {
            if (Array.isArray(children)) {
                // @ts-ignore
                el.append(...children);
            }
            else {
                // @ts-ignore
                el.append(children);
            }
        }
        for (const key of Object.keys(options)) {
            el[key] = options[key];
        }
        return el;
    }
    static createAnchor(href, classes = null, children = null) {
        const anchor = this.create("a", classes, children);
        anchor.setAttribute("href", href);
        return anchor;
    }
    static createDiv(classes, children) {
        return DOM_DOM.create("div", classes, children);
    }
    static render(element, parent) {
        const htmlElement = document.createElement(element);
        parent.append(htmlElement);
    }
    static renderReplace(element, parent) {
        const htmlElement = document.createElement(element);
        htmlElement.setAttribute("title", "wow");
        parent.replaceChildren(htmlElement);
    }
    static getOrCreate(element, classes) {
        const id = classes
            .split(" ")
            .find((className) => className.startsWith("#"));
        return this.get(id) ?? this.create(element, classes);
    }
    static get(selector) {
        const convertedSelector = this.#convertSelector(selector);
        return document.querySelector(convertedSelector);
    }
    static getAll(selector) {
        const convertedSelector = this.#convertSelector(selector);
        return document.querySelectorAll(convertedSelector);
    }
    static transformClasses(element, classes) {
        if (classes) {
            for (const className of classes?.split(" ")) {
                if (className.startsWith("#")) {
                    element.setAttribute("id", `void-${className.slice(1)}`);
                    continue;
                }
                if (className.startsWith(".")) {
                    element.classList.add(className.slice(1));
                    continue;
                }
                element.classList.add(`void-${className}`);
            }
        }
    }
    static #convertSelector(selector) {
        let results = [];
        for (const className of selector?.split(" ")) {
            if (className.startsWith("#")) {
                results.push(`#void-${className.slice(1)}`);
                continue;
            }
            results.push(`.void-${className}`);
        }
        return results.join(" ");
    }
}

;// CONCATENATED MODULE: ./src/libraries/hotkeys.js
/**! 
 * hotkeys-js v3.13.7 
 * A simple micro-library for defining and dispatching keyboard shortcuts. It has no dependencies. 
 * 
 * Copyright (c) 2024 kenny wong <wowohoo@qq.com> 
 * https://github.com/jaywcjlove/hotkeys-js.git 
 * 
 * @website: https://jaywcjlove.github.io/hotkeys-js
 
 * Licensed under the MIT license 
 */

const isff = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase().indexOf('firefox') > 0 : false;

// 绑定事件
function addEvent(object, event, method, useCapture) {
  if (object.addEventListener) {
    object.addEventListener(event, method, useCapture);
  } else if (object.attachEvent) {
    object.attachEvent("on".concat(event), method);
  }
}
function removeEvent(object, event, method, useCapture) {
  if (object.removeEventListener) {
    object.removeEventListener(event, method, useCapture);
  } else if (object.detachEvent) {
    object.detachEvent("on".concat(event), method);
  }
}

// 修饰键转换成对应的键码
function getMods(modifier, key) {
  const mods = key.slice(0, key.length - 1);
  for (let i = 0; i < mods.length; i++) mods[i] = modifier[mods[i].toLowerCase()];
  return mods;
}

// 处理传的key字符串转换成数组
function getKeys(key) {
  if (typeof key !== 'string') key = '';
  key = key.replace(/\s/g, ''); // 匹配任何空白字符,包括空格、制表符、换页符等等
  const keys = key.split(','); // 同时设置多个快捷键，以','分割
  let index = keys.lastIndexOf('');

  // 快捷键可能包含','，需特殊处理
  for (; index >= 0;) {
    keys[index - 1] += ',';
    keys.splice(index, 1);
    index = keys.lastIndexOf('');
  }
  return keys;
}

// 比较修饰键的数组
function compareArray(a1, a2) {
  const arr1 = a1.length >= a2.length ? a1 : a2;
  const arr2 = a1.length >= a2.length ? a2 : a1;
  let isIndex = true;
  for (let i = 0; i < arr1.length; i++) {
    if (arr2.indexOf(arr1[i]) === -1) isIndex = false;
  }
  return isIndex;
}

// Special Keys
const _keyMap = {
  backspace: 8,
  '⌫': 8,
  tab: 9,
  clear: 12,
  enter: 13,
  '↩': 13,
  return: 13,
  esc: 27,
  escape: 27,
  space: 32,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  del: 46,
  delete: 46,
  ins: 45,
  insert: 45,
  home: 36,
  end: 35,
  pageup: 33,
  pagedown: 34,
  capslock: 20,
  num_0: 96,
  num_1: 97,
  num_2: 98,
  num_3: 99,
  num_4: 100,
  num_5: 101,
  num_6: 102,
  num_7: 103,
  num_8: 104,
  num_9: 105,
  num_multiply: 106,
  num_add: 107,
  num_enter: 108,
  num_subtract: 109,
  num_decimal: 110,
  num_divide: 111,
  '⇪': 20,
  ',': 188,
  '.': 190,
  '/': 191,
  '`': 192,
  '-': isff ? 173 : 189,
  '=': isff ? 61 : 187,
  ';': isff ? 59 : 186,
  '\'': 222,
  '[': 219,
  ']': 221,
  '\\': 220
};

// Modifier Keys
const _modifier = {
  // shiftKey
  '⇧': 16,
  shift: 16,
  // altKey
  '⌥': 18,
  alt: 18,
  option: 18,
  // ctrlKey
  '⌃': 17,
  ctrl: 17,
  control: 17,
  // metaKey
  '⌘': 91,
  cmd: 91,
  command: 91
};
const modifierMap = {
  16: 'shiftKey',
  18: 'altKey',
  17: 'ctrlKey',
  91: 'metaKey',
  shiftKey: 16,
  ctrlKey: 17,
  altKey: 18,
  metaKey: 91
};
const _mods = {
  16: false,
  18: false,
  17: false,
  91: false
};
const _handlers = {};

// F1~F12 special key
for (let k = 1; k < 20; k++) {
  _keyMap["f".concat(k)] = 111 + k;
}

let _downKeys = []; // 记录摁下的绑定键
let winListendFocus = null; // window是否已经监听了focus事件
let _scope = 'all'; // 默认热键范围
const elementEventMap = new Map(); // 已绑定事件的节点记录

// 返回键码
const code = x => _keyMap[x.toLowerCase()] || _modifier[x.toLowerCase()] || x.toUpperCase().charCodeAt(0);
const getKey = x => Object.keys(_keyMap).find(k => _keyMap[k] === x);
const getModifier = x => Object.keys(_modifier).find(k => _modifier[k] === x);

// 设置获取当前范围（默认为'所有'）
function setScope(scope) {
  _scope = scope || 'all';
}
// 获取当前范围
function getScope() {
  return _scope || 'all';
}
// 获取摁下绑定键的键值
function getPressedKeyCodes() {
  return _downKeys.slice(0);
}
function getPressedKeyString() {
  return _downKeys.map(c => getKey(c) || getModifier(c) || String.fromCharCode(c));
}
function getAllKeyCodes() {
  const result = [];
  Object.keys(_handlers).forEach(k => {
    _handlers[k].forEach(_ref => {
      let {
        key,
        scope,
        mods,
        shortcut
      } = _ref;
      result.push({
        scope,
        shortcut,
        mods,
        keys: key.split('+').map(v => code(v))
      });
    });
  });
  return result;
}

// 表单控件控件判断 返回 Boolean
// hotkey is effective only when filter return true
function filter(event) {
  const target = event.target || event.srcElement;
  const {
    tagName
  } = target;
  let flag = true;
  const isInput = tagName === 'INPUT' && !['checkbox', 'radio', 'range', 'button', 'file', 'reset', 'submit', 'color'].includes(target.type);
  // ignore: isContentEditable === 'true', <input> and <textarea> when readOnly state is false, <select>
  if (target.isContentEditable || (isInput || tagName === 'TEXTAREA' || tagName === 'SELECT') && !target.readOnly) {
    flag = false;
  }
  return flag;
}

// 判断摁下的键是否为某个键，返回true或者false
function isPressed(keyCode) {
  if (typeof keyCode === 'string') {
    keyCode = code(keyCode); // 转换成键码
  }
  return _downKeys.indexOf(keyCode) !== -1;
}

// 循环删除handlers中的所有 scope(范围)
function deleteScope(scope, newScope) {
  let handlers;
  let i;

  // 没有指定scope，获取scope
  if (!scope) scope = getScope();
  for (const key in _handlers) {
    if (Object.prototype.hasOwnProperty.call(_handlers, key)) {
      handlers = _handlers[key];
      for (i = 0; i < handlers.length;) {
        if (handlers[i].scope === scope) {
          const deleteItems = handlers.splice(i, 1);
          deleteItems.forEach(_ref2 => {
            let {
              element
            } = _ref2;
            return removeKeyEvent(element);
          });
        } else {
          i++;
        }
      }
    }
  }

  // 如果scope被删除，将scope重置为all
  if (getScope() === scope) setScope(newScope || 'all');
}

// 清除修饰键
function clearModifier(event) {
  let key = event.keyCode || event.which || event.charCode;
  const i = _downKeys.indexOf(key);

  // 从列表中清除按压过的键
  if (i >= 0) {
    _downKeys.splice(i, 1);
  }
  // 特殊处理 cmmand 键，在 cmmand 组合快捷键 keyup 只执行一次的问题
  if (event.key && event.key.toLowerCase() === 'meta') {
    _downKeys.splice(0, _downKeys.length);
  }

  // 修饰键 shiftKey altKey ctrlKey (command||metaKey) 清除
  if (key === 93 || key === 224) key = 91;
  if (key in _mods) {
    _mods[key] = false;

    // 将修饰键重置为false
    for (const k in _modifier) if (_modifier[k] === key) hotkeys[k] = false;
  }
}
function unbind(keysInfo) {
  // unbind(), unbind all keys
  if (typeof keysInfo === 'undefined') {
    Object.keys(_handlers).forEach(key => {
      Array.isArray(_handlers[key]) && _handlers[key].forEach(info => eachUnbind(info));
      delete _handlers[key];
    });
    removeKeyEvent(null);
  } else if (Array.isArray(keysInfo)) {
    // support like : unbind([{key: 'ctrl+a', scope: 's1'}, {key: 'ctrl-a', scope: 's2', splitKey: '-'}])
    keysInfo.forEach(info => {
      if (info.key) eachUnbind(info);
    });
  } else if (typeof keysInfo === 'object') {
    // support like unbind({key: 'ctrl+a, ctrl+b', scope:'abc'})
    if (keysInfo.key) eachUnbind(keysInfo);
  } else if (typeof keysInfo === 'string') {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    // support old method
    // eslint-disable-line
    let [scope, method] = args;
    if (typeof scope === 'function') {
      method = scope;
      scope = '';
    }
    eachUnbind({
      key: keysInfo,
      scope,
      method,
      splitKey: '+'
    });
  }
}

// 解除绑定某个范围的快捷键
const eachUnbind = _ref3 => {
  let {
    key,
    scope,
    method,
    splitKey = '+'
  } = _ref3;
  const multipleKeys = getKeys(key);
  multipleKeys.forEach(originKey => {
    const unbindKeys = originKey.split(splitKey);
    const len = unbindKeys.length;
    const lastKey = unbindKeys[len - 1];
    const keyCode = lastKey === '*' ? '*' : code(lastKey);
    if (!_handlers[keyCode]) return;
    // 判断是否传入范围，没有就获取范围
    if (!scope) scope = getScope();
    const mods = len > 1 ? getMods(_modifier, unbindKeys) : [];
    const unbindElements = [];
    _handlers[keyCode] = _handlers[keyCode].filter(record => {
      // 通过函数判断，是否解除绑定，函数相等直接返回
      const isMatchingMethod = method ? record.method === method : true;
      const isUnbind = isMatchingMethod && record.scope === scope && compareArray(record.mods, mods);
      if (isUnbind) unbindElements.push(record.element);
      return !isUnbind;
    });
    unbindElements.forEach(element => removeKeyEvent(element));
  });
};

// 对监听对应快捷键的回调函数进行处理
function eventHandler(event, handler, scope, element) {
  if (handler.element !== element) {
    return;
  }
  let modifiersMatch;

  // 看它是否在当前范围
  if (handler.scope === scope || handler.scope === 'all') {
    // 检查是否匹配修饰符（如果有返回true）
    modifiersMatch = handler.mods.length > 0;
    for (const y in _mods) {
      if (Object.prototype.hasOwnProperty.call(_mods, y)) {
        if (!_mods[y] && handler.mods.indexOf(+y) > -1 || _mods[y] && handler.mods.indexOf(+y) === -1) {
          modifiersMatch = false;
        }
      }
    }

    // 调用处理程序，如果是修饰键不做处理
    if (handler.mods.length === 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91] || modifiersMatch || handler.shortcut === '*') {
      handler.keys = [];
      handler.keys = handler.keys.concat(_downKeys);
      if (handler.method(event, handler) === false) {
        if (event.preventDefault) event.preventDefault();else event.returnValue = false;
        if (event.stopPropagation) event.stopPropagation();
        if (event.cancelBubble) event.cancelBubble = true;
      }
    }
  }
}

// 处理keydown事件
function dispatch(event, element) {
  const asterisk = _handlers['*'];
  let key = event.keyCode || event.which || event.charCode;

  // 表单控件过滤 默认表单控件不触发快捷键
  if (!hotkeys.filter.call(this, event)) return;

  // Gecko(Firefox)的command键值224，在Webkit(Chrome)中保持一致
  // Webkit左右 command 键值不一样
  if (key === 93 || key === 224) key = 91;

  /**
   * Collect bound keys
   * If an Input Method Editor is processing key input and the event is keydown, return 229.
   * https://stackoverflow.com/questions/25043934/is-it-ok-to-ignore-keydown-events-with-keycode-229
   * http://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
   */
  if (_downKeys.indexOf(key) === -1 && key !== 229) _downKeys.push(key);
  /**
   * Jest test cases are required.
   * ===============================
   */
  ['ctrlKey', 'altKey', 'shiftKey', 'metaKey'].forEach(keyName => {
    const keyNum = modifierMap[keyName];
    if (event[keyName] && _downKeys.indexOf(keyNum) === -1) {
      _downKeys.push(keyNum);
    } else if (!event[keyName] && _downKeys.indexOf(keyNum) > -1) {
      _downKeys.splice(_downKeys.indexOf(keyNum), 1);
    } else if (keyName === 'metaKey' && event[keyName] && _downKeys.length === 3) {
      /**
       * Fix if Command is pressed:
       * ===============================
       */
      if (!(event.ctrlKey || event.shiftKey || event.altKey)) {
        _downKeys = _downKeys.slice(_downKeys.indexOf(keyNum));
      }
    }
  });
  /**
   * -------------------------------
   */

  if (key in _mods) {
    _mods[key] = true;

    // 将特殊字符的key注册到 hotkeys 上
    for (const k in _modifier) {
      if (_modifier[k] === key) hotkeys[k] = true;
    }
    if (!asterisk) return;
  }

  // 将 modifierMap 里面的修饰键绑定到 event 中
  for (const e in _mods) {
    if (Object.prototype.hasOwnProperty.call(_mods, e)) {
      _mods[e] = event[modifierMap[e]];
    }
  }
  /**
   * https://github.com/jaywcjlove/hotkeys/pull/129
   * This solves the issue in Firefox on Windows where hotkeys corresponding to special characters would not trigger.
   * An example of this is ctrl+alt+m on a Swedish keyboard which is used to type μ.
   * Browser support: https://caniuse.com/#feat=keyboardevent-getmodifierstate
   */
  if (event.getModifierState && !(event.altKey && !event.ctrlKey) && event.getModifierState('AltGraph')) {
    if (_downKeys.indexOf(17) === -1) {
      _downKeys.push(17);
    }
    if (_downKeys.indexOf(18) === -1) {
      _downKeys.push(18);
    }
    _mods[17] = true;
    _mods[18] = true;
  }

  // 获取范围 默认为 `all`
  const scope = getScope();
  // 对任何快捷键都需要做的处理
  if (asterisk) {
    for (let i = 0; i < asterisk.length; i++) {
      if (asterisk[i].scope === scope && (event.type === 'keydown' && asterisk[i].keydown || event.type === 'keyup' && asterisk[i].keyup)) {
        eventHandler(event, asterisk[i], scope, element);
      }
    }
  }
  // key 不在 _handlers 中返回
  if (!(key in _handlers)) return;
  const handlerKey = _handlers[key];
  const keyLen = handlerKey.length;
  for (let i = 0; i < keyLen; i++) {
    if (event.type === 'keydown' && handlerKey[i].keydown || event.type === 'keyup' && handlerKey[i].keyup) {
      if (handlerKey[i].key) {
        const record = handlerKey[i];
        const {
          splitKey
        } = record;
        const keyShortcut = record.key.split(splitKey);
        const _downKeysCurrent = []; // 记录当前按键键值
        for (let a = 0; a < keyShortcut.length; a++) {
          _downKeysCurrent.push(code(keyShortcut[a]));
        }
        if (_downKeysCurrent.sort().join('') === _downKeys.sort().join('')) {
          // 找到处理内容
          eventHandler(event, record, scope, element);
        }
      }
    }
  }
}
function hotkeys(key, option, method) {
  _downKeys = [];
  const keys = getKeys(key); // 需要处理的快捷键列表
  let mods = [];
  let scope = 'all'; // scope默认为all，所有范围都有效
  let element = document; // 快捷键事件绑定节点
  let i = 0;
  let keyup = false;
  let keydown = true;
  let splitKey = '+';
  let capture = false;
  let single = false; // 单个callback

  // 对为设定范围的判断
  if (method === undefined && typeof option === 'function') {
    method = option;
  }
  if (Object.prototype.toString.call(option) === '[object Object]') {
    if (option.scope) scope = option.scope; // eslint-disable-line
    if (option.element) element = option.element; // eslint-disable-line
    if (option.keyup) keyup = option.keyup; // eslint-disable-line
    if (option.keydown !== undefined) keydown = option.keydown; // eslint-disable-line
    if (option.capture !== undefined) capture = option.capture; // eslint-disable-line
    if (typeof option.splitKey === 'string') splitKey = option.splitKey; // eslint-disable-line
    if (option.single === true) single = true; // eslint-disable-line
  }
  if (typeof option === 'string') scope = option;

  // 如果只允许单个callback，先unbind
  if (single) unbind(key, scope);

  // 对于每个快捷键进行处理
  for (; i < keys.length; i++) {
    key = keys[i].split(splitKey); // 按键列表
    mods = [];

    // 如果是组合快捷键取得组合快捷键
    if (key.length > 1) mods = getMods(_modifier, key);

    // 将非修饰键转化为键码
    key = key[key.length - 1];
    key = key === '*' ? '*' : code(key); // *表示匹配所有快捷键

    // 判断key是否在_handlers中，不在就赋一个空数组
    if (!(key in _handlers)) _handlers[key] = [];
    _handlers[key].push({
      keyup,
      keydown,
      scope,
      mods,
      shortcut: keys[i],
      method,
      key: keys[i],
      splitKey,
      element
    });
  }
  // 在全局document上设置快捷键
  if (typeof element !== 'undefined' && window) {
    if (!elementEventMap.has(element)) {
      const keydownListener = function () {
        let event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.event;
        return dispatch(event, element);
      };
      const keyupListenr = function () {
        let event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.event;
        dispatch(event, element);
        clearModifier(event);
      };
      elementEventMap.set(element, {
        keydownListener,
        keyupListenr,
        capture
      });
      addEvent(element, 'keydown', keydownListener, capture);
      addEvent(element, 'keyup', keyupListenr, capture);
    }
    if (!winListendFocus) {
      const listener = () => {
        _downKeys = [];
      };
      winListendFocus = {
        listener,
        capture
      };
      addEvent(window, 'focus', listener, capture);
    }
  }
}
function trigger(shortcut) {
  let scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'all';
  Object.keys(_handlers).forEach(key => {
    const dataList = _handlers[key].filter(item => item.scope === scope && item.shortcut === shortcut);
    dataList.forEach(data => {
      if (data && data.method) {
        data.method();
      }
    });
  });
}

// 销毁事件,unbind之后判断element上是否还有键盘快捷键，如果没有移除监听
function removeKeyEvent(element) {
  const values = Object.values(_handlers).flat();
  const findindex = values.findIndex(_ref4 => {
    let {
      element: el
    } = _ref4;
    return el === element;
  });
  if (findindex < 0) {
    const {
      keydownListener,
      keyupListenr,
      capture
    } = elementEventMap.get(element) || {};
    if (keydownListener && keyupListenr) {
      removeEvent(element, 'keyup', keyupListenr, capture);
      removeEvent(element, 'keydown', keydownListener, capture);
      elementEventMap.delete(element);
    }
  }
  if (values.length <= 0 || elementEventMap.size <= 0) {
    // 移除所有的元素上的监听
    const eventKeys = Object.keys(elementEventMap);
    eventKeys.forEach(el => {
      const {
        keydownListener,
        keyupListenr,
        capture
      } = elementEventMap.get(el) || {};
      if (keydownListener && keyupListenr) {
        removeEvent(el, 'keyup', keyupListenr, capture);
        removeEvent(el, 'keydown', keydownListener, capture);
        elementEventMap.delete(el);
      }
    });
    // 清空 elementEventMap
    elementEventMap.clear();
    // 清空 _handlers
    Object.keys(_handlers).forEach(key => delete _handlers[key]);
    // 移除window上的focus监听
    if (winListendFocus) {
      const {
        listener,
        capture
      } = winListendFocus;
      removeEvent(window, 'focus', listener, capture);
      winListendFocus = null;
    }
  }
}
const _api = {
  getPressedKeyString,
  setScope,
  getScope,
  deleteScope,
  getPressedKeyCodes,
  getAllKeyCodes,
  isPressed,
  filter,
  trigger,
  unbind,
  keyMap: _keyMap,
  modifier: _modifier,
  modifierMap
};
for (const a in _api) {
  if (Object.prototype.hasOwnProperty.call(_api, a)) {
    hotkeys[a] = _api[a];
  }
}
if (typeof window !== 'undefined') {
  const _hotkeys = window.hotkeys;
  hotkeys.noConflict = deep => {
    if (deep && window.hotkeys === hotkeys) {
      window.hotkeys = _hotkeys;
    }
    return hotkeys;
  };
  window.hotkeys = hotkeys;
}



;// CONCATENATED MODULE: ./src/components/components.js




const ColorPicker = (value, onChange) => {
	const container = DOM_DOM.create("div", "color-picker-container");
	const colorPicker = DOM_DOM.create("input", "color-picker");
	colorPicker.setAttribute("type", "color");
	colorPicker.value = value;
	colorPicker.addEventListener("change", (event) => {
		onChange(event);
	});

	container.append(colorPicker);
	const inputField = DOM_DOM.create("input", "color-picker-input");
	inputField.value = value ?? "#";
	inputField.setAttribute("type", "text");
	inputField.addEventListener("change", (event) => {
		onChange(event);
	});
	container.append(inputField);
	return container;
};

const InputField = (value, onChange, classes, options = {}) => {
	const inputField = DOM_DOM.create("input", transformClasses("input", classes));
	inputField.value = value;
	for (const [key, value] of Object.entries(options)) {
		inputField.setAttribute(key, value);
	}
	inputField.addEventListener("change", (event) => {
		onChange(event);
	});
	return inputField;
};


const DateInput = (value, onChange, classes, options = {}) => {
	const dateInput = DOM_DOM.create("input", transformClasses("input", classes));
	dateInput.setAttribute("type", "date");
	dateInput.value = value;
	for (const [key, value] of Object.entries(options)) {
		dateInput.setAttribute(key, value);
	}
	dateInput.addEventListener("change", (event) => {
		onChange(event);
	})
	return dateInput;
}

const SecretField = (value, onChange) => {
	const secret = InputField(value, onChange);
	secret.setAttribute("type", "password");
	const eyeIcon = EyeIcon();
	const closedEyeIcon = EyeClosedIcon();

	const container = DOM_DOM.create("div", "action-container", secret);
	const iconButton = IconButton(eyeIcon, (event) => {
		if (event.target.firstChild === eyeIcon) {
			event.target.replaceChildren(closedEyeIcon);
			secret.setAttribute("type", "text");
			return;
		}
		event.target.replaceChildren(eyeIcon);
		secret.setAttribute("type", "password");
	});
	container.append(iconButton);
	return container;
};

const ActionInputField = (value, onClick, icon) => {
	const inputField = InputField(value, () => {});

	const container = DOM_DOM.create("div", "action-container", inputField);
	const iconButton = IconButton(icon, (event) => {
		onClick(event, inputField);
	});
	container.append(iconButton);
	return container;
};

const RangeField = (value, onChange, max, step = 1, min = 0, unit) => {
	const container = DOM_DOM.create("div", "range-container");
	const range = DOM_DOM.create("input", "range");
	const display = DOM_DOM.create("div", "range-display", `${value}${unit ?? ""}`);
	range.setAttribute("type", "range");
	range.addEventListener("change", (event) => {
		onChange(event);
	});
	range.addEventListener("input", (event) => {
		display.replaceChildren(`${event.target.value}${unit ?? ""}`);
	});
	range.setAttribute("max", max);
	range.setAttribute("min", min);
	range.setAttribute("step", step);
	range.setAttribute("value", value);
	container.append(range, display);
	return container;
};

const Image = (url, classes) => {
	const image = DOM_DOM.create("img", classes);
	image.setAttribute("src", url);
	image.setAttribute("draggable", false);
	return image;
};

const Button = (text, onClick, classes) => {
	const button = DOM_DOM.create(
		"button",
		transformClasses("button", classes),
		text,
	);
	button.addEventListener("click", (event) => {
		onClick(event);
	});
	return button;
};

const IconButton = (text, onClick, classes) => {
	const button = DOM_DOM.create(
		"div",
		transformClasses("icon-button", classes),
		text,
	);
	button.addEventListener("click", (event) => {
		onClick(event);
	});
	return button;
};

const Note = (text) => {
	const note = DOM_DOM.create("div", "notice", text);
	return note;
};

const Link = (text, href, target = "_blank", classes) => {
	const link = DOM_DOM.create("a", transformClasses("link", classes), text);
	link.setAttribute("href", href);
	link.setAttribute("target", target);
	return link;
};

const TextArea = (text, onChange, classes) => {
	const textArea = DOM_DOM.create(
		"textarea",
		transformClasses("textarea", classes),
		text,
	);
	textArea.addEventListener("change", (event) => {
		onChange(event);
	});

	return textArea;
};

const Toast = (message, type) => {
	const toast = DOM_DOM.create("div", transformClasses("toast", type), message);
	return toast;
};

const Select = (options) => {
	const container = DOM_DOM.create("div", "select");
	for (const option of options) {
		container.append(option);
	}
	return container;
};

const Option = (value, selected, onClick) => {
	const option = DOM_DOM.create("div", "option", value);
	if (selected) {
		option.classList.add("active");
	}
	option.addEventListener("click", onClick);
	return option;
};

const Label = (text, element) => {
	const container = DOM_DOM.create("div", "label-container");
	const label = DOM_DOM.create("label", "label-span", text);
	const id = Math.random();
	label.setAttribute("for", id);
	element.setAttribute("id", id);
	container.append(label, element);
	return container;
};

const Table = (head, body) => {
	const table = DOM_DOM.create("table", "table", [head, body]);
	return table;
};

const TableHead = (...headers) => {
	const headerCells = headers.map((header) => DOM_DOM.create("th", null, header));
	const headerRow = DOM_DOM.create("tr", null, headerCells);
	const head = DOM_DOM.create("thead", null, headerRow);
	return head;
};

const TableBody = (rows) => {
	const tableBody = DOM_DOM.create("tbody", null, rows);
	return tableBody;
};

const Checkbox = (checked, onChange, disabled = false) => {
	const checkbox = DOM_DOM.create("input", "checkbox");
	checkbox.setAttribute("type", "checkbox");
	checkbox.checked = checked;

	if (disabled) {
		checkbox.setAttribute("disabled", "");
	}

	checkbox.addEventListener("change", onChange);
	return checkbox;
};

const SettingLabel = (text, input) => {
	const container = DOM_DOM.create("div", "setting-label-container", input);
	const label = DOM_DOM.create("label", "setting-label", text);
	const id = Math.random();
	label.setAttribute("for", id);
	input.setAttribute("id", id);
	container.append(label);
	return container;
};

const GifKeyboard = (header) => {
	const container = DOM_DOM.create("div", "gif-keyboard-container");
	container.append(header);
	const gifList = DOM_DOM.create("div", "gif-keyboard-list");
	const controls = DOM_DOM.create("div", "gif-keyboard-control-container");
	container.append(
		DOM_DOM.create("div", "gif-keyboard-list-container", [controls, gifList]),
	);

	return container;
};

const GifItem = (url, onClick, onLike, gifs) => {
	const container = DOM_DOM.create("div", "gif-keyboard-item");
	container.addEventListener("click", () => {
		onClick();
	});
	const img = DOM_DOM.create("img");
	img.setAttribute("src", url);
	container.append(GifContainer(img, onLike, gifs));
	return container;
};

const GifContainer = (imgElement, onLike, gifs) => {
	const container = DOM_DOM.create("div", "gif-like-container");
	container.append(
		imgElement,
		IconButton(
			HeartIcon(),
			(event) => {
				event.stopPropagation();
				event.preventDefault();
				onLike(event);
				if (event.target.classList.contains("void-liked")) {
					event.target.classList.remove("void-liked");
				} else {
					event.target.classList.add("void-liked");
				}
			},
			transformClasses(
				"gif-like",
				gifs.includes(imgElement.src) && "liked",
			),
		),
	);
	return container;
};

const Pagination = (currentPage, maxPage, onClick) => {
	const container = DOM_DOM.create("div", "pagination-container");

	if (maxPage < 1) {
		return container;
	}

	let displayedPages = [];
	if (maxPage >= 3) {
		container.append(
			IconButton(
				DoubleChevronLeftIcon(),
				() => {
					onClick(0);
				},
				`pagination-skip ${currentPage === 0 && "active"}`,
			),
		);
		if (currentPage >= maxPage - 1) {
			displayedPages.push(maxPage - 2, maxPage - 1, maxPage);
		} else if (currentPage === 0) {
			displayedPages.push(currentPage, currentPage + 1, currentPage + 2);
		} else {
			displayedPages.push(currentPage - 1, currentPage, currentPage + 1);
		}
	} else {
		for (let i = 0; i <= maxPage; i++) {
			displayedPages.push(i);
		}
	}

	for (const page of displayedPages) {
		container.append(
			IconButton(
				page + 1,
				() => {
					onClick(page);
				},
				currentPage === page && "active",
			),
		);
	}

	if (maxPage >= 3) {
		container.append(
			IconButton(
				DoubleChevronRightIcon(),
				() => {
					onClick(maxPage);
				},
				`pagination-skip ${currentPage === maxPage && "active"}`,
			),
		);
	}

	return container;
};

const Modal = (content, onClose) => {
	const background = DOM_DOM.create("dialog", "modal-background");
	const container = DOM_DOM.create("div", "modal");

	const closeButton = IconButton(CloseIcon(), (event) => {
		background.close();
		onClose(event);
	});

	const header = DOM_DOM.create("div", "modal-header", "VoidVerified");
	header.append(closeButton);
	container.append(header);

	const contentContainer = DOM_DOM.create("div", "modal-content", content);
	container.append(contentContainer);
	background.append(container);

	background.setAttribute("open", true);
	return background;
};

const Tooltip = (text, child) => {
	const tooltipContainer = DOM_DOM.create("div", "tooltip-container");
	const tooltip = DOM_DOM.create("div", "tooltip", text);
	tooltipContainer.append(tooltip);
	tooltipContainer.append(child);
	return tooltipContainer;
};

const Chip = (text) => {
	const chip = DOM.create("span", "chip", text);
	return chip;
};

const KeyInput = (currentKey, bindingScope, onFocusOut) => {
	const keyInput = DOM_DOM.create("input", "input key-input");
	keyInput.setAttribute("value", currentKey);
	keyInput.addEventListener("keydown", (event) => {
		event.preventDefault();
	});
	keyInput.addEventListener("focusin", () => {
		// @ts-ignore
		hotkeys.setScope(bindingScope);
	});
	keyInput.addEventListener("focusout", (event) => {
		onFocusOut(event);
	});
	return keyInput;
}

const transformClasses = (base, additional) => {
	let classes = base;
	if (additional && additional !== "") {
		classes += ` ${additional}`;
	}
	return classes;
};

;// CONCATENATED MODULE: ./src/api/queries/toggleActivitySubscription.ts
/* harmony default export */ const toggleActivitySubscription = (`mutation ToggleActivitySubscription($activityId: Int, $subscribe: Boolean) {
    ToggleActivitySubscription(activityId: $activityId, subscribe: $subscribe) {
        ... on TextActivity {
            isSubscribed
        }
        ... on ListActivity {
            isSubscribed
        }
        ... on MessageActivity {
            isSubscribed
        }
    }
}
`);

;// CONCATENATED MODULE: ./src/api/queries/toggleLike.ts
/* harmony default export */ const toggleLike = (`mutation ToggleLikeV2($toggleLikeV2Id: Int, $type: LikeableType) {
		  ToggleLikeV2(id: $toggleLikeV2Id, type: $type) {
			... on ListActivity {
			  isLiked
			  likeCount
			}
			... on TextActivity {
			  isLiked
			  likeCount
			}
			... on MessageActivity {
			  isLiked
			  likeCount
			}
			... on ActivityReply {
			  isLiked
			  likeCount
			}
			... on Thread {
			  isLiked
			  likeCount
			}
			... on ThreadComment {
			  isLiked
			  likeCount
			}
		  }
		}`);

;// CONCATENATED MODULE: ./src/api/queries/queryActivityReplies.ts
const ActivityReplyQueryPartial = `createdAt
			  isLiked
			  id
			  likeCount
			  likes {
				avatar {
				  large
				}
				name
			  }
			  text
			  user {
			  	id
				avatar {
				  large
				}
				name
			  }`;
/* harmony default export */ const queryActivityReplies = (`query ActivityReplies($activityId: Int, $page: Int, $perPage: Int) {
		  Page(page: $page, perPage: $perPage) {
			activityReplies(activityId: $activityId) {
				${ActivityReplyQueryPartial}
			}
			pageInfo {
			  hasNextPage
			  currentPage
			  perPage
			  total
			}
		  }
		}`);

;// CONCATENATED MODULE: ./src/api/queries/queryMessages.ts
/* harmony default export */ const queryMessages = (`query Page($sort: [ActivitySort], $isFollowing: Boolean, $type: ActivityType, $asHtml: Boolean, $page: Int, $perPage: Int) {
		  Page(page: $page, perPage: $perPage) {
		  	pageInfo {
			  hasNextPage
			  currentPage
			  perPage
			  total
			}
			activities(sort: $sort, isFollowing: $isFollowing, type: $type) {
			  ... on MessageActivity {
				message(asHtml: $asHtml)
				messenger {
				  name
				  id
				  avatar {
					large
				  }
				  moderatorRoles
				  donatorBadge
				  donatorTier
				}
				recipient {
				  name
				  donatorBadge
				  donatorTier
				  moderatorRoles
				  id
				  avatar {
					large
				  }
				}
				id
				isLiked
				type
				createdAt
				isSubscribed
				likeCount
				replyCount
				likes {
				  avatar {
					large
				  }
				  name
				}
			  }
			}
		  }
		}`);

;// CONCATENATED MODULE: ./src/api/queries/replyToActivityQuery.ts
/* harmony default export */ const replyToActivityQuery = (`mutation SaveActivityReply($activityId: Int, $text: String) {
  SaveActivityReply(activityId: $activityId, text: $text) {
    activityId
    createdAt
    id
    likeCount
    likes {
      avatar {
        large
      }
      name
    }
    isLiked
    text
    user {
      avatar {
        large
      }
      name
      id
    }
  }
}`);

;// CONCATENATED MODULE: ./src/api/queries/searchUsersQuery.ts
/* harmony default export */ const searchUsersQuery = (`
query Query($search: String, $perPage: Int) {
  Page(perPage: $perPage) {
    users(search: $search) {
      avatar {
        large
      }
      id
      name
    }
  }
}
`);

;// CONCATENATED MODULE: ./src/api/queries/saveTextActivityMutation.ts
/* harmony default export */ const saveTextActivityMutation = (`
mutation SaveTextActivity($content: String, $id: Int) {
  SaveTextActivity(text: $content, id: $id) {
    text
  }
}`);

;// CONCATENATED MODULE: ./src/api/queries/saveMessageActivityMutation.ts
/* harmony default export */ const saveMessageActivityMutation = (`
mutation SaveMessageActivity($id: Int, $content: String) {
  SaveMessageActivity(id: $id, message: $content) {
    message
  }
}
`);

;// CONCATENATED MODULE: ./src/api/queries/saveActivityReplyMutation.ts
/* harmony default export */ const saveActivityReplyMutation = (`
mutation SaveActivityReply($id: Int, $content: String) {
  SaveActivityReply(id: $id, text: $content) {
    text
  }
}
`);

;// CONCATENATED MODULE: ./src/api/queries/deleteActivityQuery.ts
/* harmony default export */ const deleteActivityQuery = (`
mutation Mutation($id: Int) {
  DeleteActivity(id: $id) {
    deleted
  }
}
`);

;// CONCATENATED MODULE: ./src/api/queries/deleteActivityReplyQuery.ts
/* harmony default export */ const deleteActivityReplyQuery = (`
mutation Mutation($id: Int) {
  DeleteActivityReply(id: $id) {
    deleted
  }
}
`);

;// CONCATENATED MODULE: ./src/api/imageHostBase.js
class ImageHostBase {
	conventToBase64(image) {
		return new Promise(function (resolve, reject) {
			var reader = new FileReader();
			reader.onloadend = function (e) {
				resolve({
					fileName: this.name,
					result: e.target.result,
					error: e.target.error,
				});
			};
			reader.readAsDataURL(image);
		});
	}
}

;// CONCATENATED MODULE: ./src/api/catboxAPI.js






class CatboxConfig {
	userHash;
	name = "catbox";
	constructor(config) {
		this.userHash = config?.userHash ?? "";
	}
}

class CatboxAPI extends ImageHostBase {
	#url = "https://catbox.moe/user/api.php";
	#configuration;
	constructor(configuration) {
		super();
		this.#configuration = new CatboxConfig(configuration);
	}

	async uploadImage(image) {
		if (!image) {
			return;
		}

		const form = new FormData();
		form.append("reqtype", "fileupload");
		form.append("fileToUpload", image);

		if (this.#configuration.userHash !== "") {
			form.append("userhash", this.#configuration.userHash);
		}

		try {
			if (GM.xmlHttpRequest) {
				Toaster.debug("Uploading image to catbox.");
				const response = await GM.xmlHttpRequest({
					method: "POST",
					url: this.#url,
					data: form,
				});

				if (response.status !== 200) {
					console.error(response.response);
					throw new Error("Image upload to catbox failed.");
				}

				return response.response;
			}
		} catch (error) {
			Toaster.error("Failed to upload image to catbox.");
			return null;
		}
	}

	renderSettings() {
		const container = DOM_DOM.create("div");

		container.append(
			Label(
				"Userhash",
				SecretField(this.#configuration.userHash, (event) => {
					this.#updateUserhash(event, this.#configuration);
				}),
			),
		);

		const p = Note(
			"Catbox.moe works out of the box, but you can provide your userhash to upload images to your account. Your userscript manager should promt you to allow xmlHttpRequest. This is required to upload images to Catbox on AniList.",
		);
		container.append(p);
		return container;
	}

	#updateUserhash(event, configuration) {
		const userHash = event.target.value;
		const config = {
			...configuration,
			userHash,
		};
		ImageHostService.setImageHostConfiguration(config.name, config);
	}
}

;// CONCATENATED MODULE: ./src/api/imgbbAPI.js





class ImgbbAPI extends ImageHostBase {
	#url = "https://api.imgbb.com/1/upload";
	#configuration;
	constructor(configuration) {
		super();
		this.#configuration = configuration;
	}

	async uploadImage(image) {
		const file = await this.conventToBase64(image);
		if (!file.result) {
			return;
		}

		if (!this.#configuration.apiKey) {
			return;
		}

		const base64 = file.result.split("base64,")[1];

		const settings = {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body:
				"image=" +
				encodeURIComponent(base64) +
				"&name=" +
				image.name.split(".")[0],
		};

		try {
			Toaster.debug("Uploading image to imgbb.");
			const response = await fetch(
				`${this.#url}?key=${this.#configuration.apiKey}`,
				settings,
			);
			const data = await response.json();
			Toaster.success("Uploaded image to imgbb.");
			return data.data.url;
		} catch (error) {
			Toaster.error("Failed to upload image to imgbb.");
			console.error(error);
			return null;
		}
	}

	renderSettings() {
		const container = document.createElement("div");

		const apiKey = Label(
			"API key",
			SecretField(this.#configuration.apiKey, (event) => {
				this.#updateApiKey(event, this.#configuration);
			}),
		);

		const note = Note(
			"You need to get the API key from the following link: ",
		);
		note.append(Link("api.imgbb.com", "https://api.imgbb.com/", "_blank"));
		container.append(apiKey, note);

		return container;
	}

	#updateApiKey(event, configuration) {
		const apiKey = event.target.value;
		const config = {
			...configuration,
			apiKey,
		};
		ImageHostService.setImageHostConfiguration(config.name, config);
	}
}

;// CONCATENATED MODULE: ./src/api/imgurAPI.js






class ImgurAPI extends ImageHostBase {
	#url = "https://api.imgur.com/3/image";
	#configuration;
	constructor(configuration) {
		super();
		this.#configuration = configuration;
	}

	async uploadImage(image) {
		const file = await this.conventToBase64(image);
		if (!file.result) {
			return;
		}

		if (!this.#configuration.clientId) {
			return;
		}

		const base64 = file.result.split("base64,")[1];

		const formData = new FormData();
		formData.append("image", base64);
		formData.append("title", image.name.split(".")[0]);

		const settings = {
			method: "POST",
			headers: {
				Authorization: this.#configuration.authToken
					? `Bearer ${this.#configuration.authToken}`
					: `Client-ID ${this.#configuration.clientId}`,
			},
			body: formData,
		};

		try {
			Toaster.debug("Uploading image to imgur.");
			const response = await fetch(this.#url, settings);
			const data = await response.json();
			Toaster.success("Uploaded image to imgur.");
			return data.data.link;
		} catch (error) {
			Toaster.error("Failed to upload image to imgur.");
			console.error("Failed to upload image to imgur.", error);
			return null;
		}
	}

	renderSettings(settingsUi) {
		const container = DOM_DOM.create("div");

		const clientId = Label(
			"Client ID",
			SecretField(this.#configuration?.clientId ?? "", (event) => {
				this.#updateConfig(event, "clientId", this.#configuration);
				settingsUi.renderSettingsUiContent();
			}),
		);

		const clientSecret = Label(
			"Client Secret",
			SecretField(this.#configuration?.clientSecret ?? "", (event) => {
				this.#updateConfig(event, "clientSecret", this.#configuration);
				settingsUi.renderSettingsUiContent();
			}),
		);

		container.append(clientId, clientSecret);

		if (
			this.#configuration.clientId &&
			this.#configuration.clientSecret &&
			!this.#configuration.authToken
		) {
			const authLink = DOM_DOM.create("a", null, "Authorize Imgur");
			authLink.classList.add("button");
			authLink.setAttribute(
				"href",
				`https://api.imgur.com/oauth2/authorize?client_id=${this.#configuration.clientId}&response_type=token`,
			);
			container.append(authLink);
		}

		if (this.#configuration.authToken) {
			const revokeAuthButton = DOM_DOM.create(
				"button",
				null,
				"Clear Authorization",
			);
			revokeAuthButton.classList.add("button");
			revokeAuthButton.addEventListener("click", () => {
				this.#revokeAuth();
				settingsUi.renderSettingsUiContent();
			});
			container.append(revokeAuthButton);
		}

		this.#renderNote(container);
		return container;
	}

	handleAuth() {
		const hash = window.location.hash.substring(1);
		if (!hash) {
			return;
		}

		const [path, token, expires, _, refreshToken] = hash.split("&");

		if (path !== "void_imgur") {
			return;
		}

		let config = { ...this.#configuration };
		config.authToken = token.split("=")[1];
		config.refreshToken = refreshToken.split("=")[1];

		config.expires = new Date(
			new Date().getTime() + Number(expires.split("=")[1]),
		);

		ImageHostService.setImageHostConfiguration(
			imageHosts.imgur,
			config,
		);

		window.history.replaceState(
			null,
			"",
			"https://anilist.co/settings/developer",
		);
	}

	async refreshAuthToken() {
		if (
			!this.#configuration.refreshToken ||
			!this.#configuration.clientSecret ||
			!this.#configuration.clientId
		) {
			return;
		}

		if (new Date() < new Date(this.#configuration.expires)) {
			return;
		}

		const formData = new FormData();
		formData.append("refresh_token", this.#configuration.refreshToken);
		formData.append("client_id", this.#configuration.clientId);
		formData.append("client_secret", this.#configuration.clientSecret);
		formData.append("grant_type", "refresh_token");

		try {
			Toaster.debug("Refreshing imgur token.");
			const response = await fetch("https://api.imgur.com/oauth2/token", {
				method: "POST",
				body: formData,
			});
			if (!response.status === 200) {
				console.error("Failed to reauthorize Imgur");
				return;
			}
			const data = await response.json();
			const config = {
				...this.#configuration,
				authToken: data.access_token,
				expires: new Date(new Date().getTime() + data.expires_in),
			};
			ImageHostService.setImageHostConfiguration(
				imageHosts.imgur,
				config,
			);
			Toaster.success("Refreshed imgur access token.");
		} catch (error) {
			Toaster.error("Error while refreshing imgur token.");
			console.error(error);
		}
	}

	#renderNote(container) {
		const note = Note("How to setup Imgur integration");

		const registerLink = Link(
			"api.imgur.com",
			"https://api.imgur.com/oauth2/addclient",
			"_blank",
		);
		const stepList = DOM_DOM.create("ol", null, [
			DOM_DOM.create("li", null, [
				"Register your application: ",
				registerLink,
				". Use 'https://anilist.co/settings/developer#void_imgur' as callback URL.",
			]),
			DOM_DOM.create(
				"li",
				null,
				"Fill the client id and secret fields with the value Imgur provided.",
			),
			DOM_DOM.create(
				"li",
				null,
				"Click on authorize (you can skip this step if you don't want images tied to your account).",
			),
		]);
		note.append(stepList);
		note.append(
			"Hitting Imgur API limits might get your API access blocked.",
		);

		container.append(note);
	}

	#revokeAuth() {
		const config = {
			...this.#configuration,
			authToken: null,
			refreshToken: null,
		};

		ImageHostService.setImageHostConfiguration(
			imageHosts.imgur,
			config,
		);
	}

	#updateConfig(event, key, configuration) {
		const value = event.target.value;
		const config = {
			...configuration,
			[key]: value,
		};
		ImageHostService.setImageHostConfiguration(
			imageHosts.imgur,
			config,
		);
	}
}

;// CONCATENATED MODULE: ./src/api/imageApiFactory.js




class ImageApiFactory {
	getImageHostInstance() {
		return ImageApiFactory.getImageHostInstance();
	}

	static getImageHostInstance() {
		switch (ImageHostService.getSelectedHost()) {
			case imageHosts.imgbb:
				return new ImgbbAPI(
					ImageHostService.getImageHostConfiguration(
						imageHosts.imgbb,
					),
				);
			case imageHosts.imgur:
				return new ImgurAPI(
					ImageHostService.getImageHostConfiguration(
						imageHosts.imgur,
					),
				);
			case imageHosts.catbox:
				return new CatboxAPI(
					ImageHostService.getImageHostConfiguration(
						imageHosts.catbox,
					),
				);
		}
	}
}

;// CONCATENATED MODULE: ./src/api/imageHostConfiguration.ts




const imageHosts = {
    imgbb: "imgbb",
    imgur: "imgur",
    catbox: "catbox",
};
const imageHostConfiguration = {
    selectedHost: imageHosts.catbox,
    configurations: {
        imgbb: {
            name: "imgbb",
            apiKey: "",
        },
        imgur: {
            name: "imgur",
            clientId: "",
            clientSecret: "",
            expires: null,
            refreshToken: null,
            authToken: null,
        },
        catbox: {
            name: "catbox",
            userHash: "",
        },
    },
};
class ImageHostService {
    static configuration;
    static localStorage = LocalStorageKeys.imageHostConfig;
    static settingContainer = DOM_DOM.createDiv();
    static initialize() {
        const config = JSON.parse(localStorage.getItem(this.localStorage));
        if (!config) {
            localStorage.setItem(this.localStorage, JSON.stringify(imageHostConfiguration));
        }
        else {
            for (const key of Object.keys(imageHostConfiguration.configurations)) {
                if (config.configurations[key]) {
                    continue;
                }
                config.configurations[key] =
                    imageHostConfiguration.configurations[key];
            }
            localStorage.setItem(this.localStorage, JSON.stringify(config));
        }
        this.configuration = config ?? imageHostConfiguration;
    }
    static getImageHostConfiguration(host) {
        return this.configuration.configurations[host];
    }
    static getSelectedHost() {
        return this.configuration.selectedHost;
    }
    static setSelectedHost(host) {
        this.configuration.selectedHost = host;
        localStorage.setItem(this.localStorage, JSON.stringify(this.configuration));
    }
    static setImageHostConfiguration(host, config) {
        this.configuration.configurations[host] = config;
        localStorage.setItem(this.localStorage, JSON.stringify(this.configuration));
    }
    static createImageHostSettings() {
        this.renderImageHostSettings();
        return this.settingContainer;
    }
    static renderImageHostSettings() {
        this.settingContainer.replaceChildren();
        const imageHostOptions = Object.values(imageHosts).map((imageHost) => Option(imageHost, imageHost === ImageHostService.getSelectedHost(), () => {
            ImageHostService.setSelectedHost(imageHost);
            this.renderImageHostSettings();
        }));
        const select = Select(imageHostOptions);
        this.settingContainer.append(Label("Image host", select));
        const hostSpecificSettings = DOM_DOM.create("div");
        const imageHostApi = ImageApiFactory.getImageHostInstance();
        hostSpecificSettings.append(imageHostApi.renderSettings(this));
        this.settingContainer.append(hostSpecificSettings);
    }
}

;// CONCATENATED MODULE: ./src/components/ButtonComponent.ts

class ButtonComponent {
    element;
    constructor(text, onClick, classes) {
        this.element = DOM_DOM.create("button", "button" + (classes ? ` ${classes}` : ""), text);
        this.element.addEventListener("click", onClick);
    }
    setText(text) {
        this.element.replaceChildren(text);
    }
}

;// CONCATENATED MODULE: ./src/api/voidApi.ts



class VoidApiError extends Error {
    constructor(data) {
        super(data.error);
        this.name = "VoidAPIError";
    }
}
class VoidApi {
    static token = localStorage.getItem("void-verified-api-token");
    static clientId = GM_info.script.version === "DEV" ? "26757" : "17382";
    static callbackUrl = GM_info.script.version === "DEV" ? "https://localhost:7013/auth/oauth" : "https://voidnyan.net/auth/oauth";
    static url = GM_info.script.version === "DEV" ? "https://localhost:7013/api" : "https://voidnyan.net/api";
    static async createPoll(poll) {
        return await this.authPost("/polls/create-poll", poll);
    }
    static async vote(vote) {
        return await this.authPost("/polls/vote", vote);
    }
    static async getPoll(id) {
        return await this.get(`/polls/get-poll/${id}`);
    }
    static async deletePoll(id) {
        return await this.authPost("/polls/delete-poll", { pollId: id });
    }
    static async addGifs(gifs) {
        return await this.authPost("/gifs/add-gifs", gifs);
    }
    static async getGifs() {
        return await this.get("/gifs/get-gifs");
    }
    static async addGif(gif) {
        return await this.authPost("/gifs/add-gif", gif);
    }
    static async deleteGif(gif) {
        return await this.authPost("/gifs/delete-gif", gif);
    }
    static async authPost(path, body) {
        const headers = {
            Authorization: "Bearer " + this.token,
            "Content-Type": "application/json"
        };
        const options = {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        };
        const response = await fetch(this.url + path, options);
        return this.handleResponse(response);
    }
    static async get(path) {
        const headers = {
            "Content-Type": "application/json"
        };
        const token = localStorage.getItem("void-verified-api-token");
        if (token) {
            // @ts-ignore
            headers.Authorization = "Bearer " + token;
        }
        const options = {
            method: "GET",
            headers
        };
        const response = await fetch(this.url + path, options);
        return this.handleResponse(response);
    }
    static async handleResponse(response) {
        const data = await this.parse(response);
        if (!response.ok) {
            if (response.status === 401) {
                throw new VoidApiError({ error: "Unauthorized" });
            }
            if (response.status === 429) {
                throw new VoidApiError({ error: "Too Many Requests" });
            }
            console.error(data);
            throw new VoidApiError(data);
        }
        return data;
    }
    static async parse(response) {
        const text = await response?.text();
        if (text && text.trim() !== "") {
            return JSON.parse(text);
        }
        return null;
    }
    static createSettings() {
        const container = DOM_DOM.createDiv();
        container.append(DOM_DOM.create("h3", null, "Authorize (VoidVerified API)"));
        container.append(DOM_DOM.create("p", null, "Some VoidVerified features might need you to authorize with VoidVerified's own API. Below is a list of features that use the API."));
        const list = DOM_DOM.create("ul");
        for (const option of Object.values(StaticSettings.options).filter((x) => x.voidApiAuthRequired)) {
            list.append(DOM_DOM.create("li", null, option.description));
        }
        container.append(list);
        container.append(DOM_DOM.create("p", null, ["VoidVerified API is not associated with AniList. Read our ",
            DOM_DOM.createAnchor("https://voidnyan.net/privacy", null, "Privacy Policy"),
            " and ",
            DOM_DOM.createAnchor("https://voidnyan.net/termsofservice", null, "Terms of Service"),
            " before usage."
        ]));
        container.querySelectorAll("a").forEach(x => x.setAttribute("target", "_blank"));
        if (this.token) {
            const button = new ButtonComponent("Remove auth token", () => {
                this.token = undefined;
                localStorage.removeItem("void-verified-api-token");
                button.element.replaceWith(this.createAuthButton());
            });
            container.append(button.element);
        }
        else {
            container.append(this.createAuthButton());
        }
        return container;
    }
    static createAuthButton() {
        const voidApiAuth = document.createElement("a");
        voidApiAuth.setAttribute("href", `https://anilist.co/api/v2/oauth/authorize?client_id=${VoidApi.clientId}&redirect_uri=${VoidApi.callbackUrl}&response_type=code`);
        voidApiAuth.append("Authenticate Void API");
        voidApiAuth.classList.add("void-button");
        return voidApiAuth;
    }
}

;// CONCATENATED MODULE: ./src/utils/anilistAuth.ts





class AnilistAuth {
    static localStorageAuth = "void-verified-auth";
    static token = null;
    static expires = null;
    static name;
    static id;
    static settingsContainer = DOM_DOM.createDiv();
    static initialize() {
        const auth = JSON.parse(localStorage.getItem(this.localStorageAuth)) ?? null;
        if (auth) {
            this.token = auth.token;
            this.expires = new Date(auth.expires);
        }
        const alAuth = JSON.parse(localStorage.getItem("auth"));
        this.name = alAuth?.name;
        this.id = alAuth?.id;
    }
    static checkAuthFromUrl() {
        const hash = window.location.hash.substring(1);
        if (!hash) {
            return;
        }
        const [path, token, type, expiress] = hash.split("&");
        if (path === "void_imgur") {
            const imgurConfig = ImageHostService.getImageHostConfiguration(imageHosts.imgur);
            new ImgurAPI(imgurConfig).handleAuth();
        }
        if (path === "void_api_auth") {
            VoidApi.token = token;
            localStorage.setItem("void-verified-api-token", token);
        }
        if (path === "void_auth") {
            const expiresDate = new Date(new Date().getTime() + Number(expiress.split("=")[1]) * 1000);
            this.saveAuthToken({
                token: token.split("=")[1],
                expires: expiresDate,
            });
        }
        window.history.replaceState(null, "", "https://anilist.co/settings/developer");
    }
    static saveAuthToken(tokenObject) {
        this.token = tokenObject.token;
        this.expires = tokenObject.expires;
        localStorage.setItem(this.localStorageAuth, JSON.stringify(tokenObject));
    }
    static createSettings() {
        this.renderSettings();
        return this.settingsContainer;
    }
    static renderSettings() {
        this.settingsContainer.replaceChildren();
        const isAuthenticated = this.token !== null &&
            new Date(this.expires) > new Date();
        const clientId = 15519;
        const header = DOM_DOM.create("h3", null, "Authorize (AniList API)");
        const description = DOM_DOM.create("p", null, "Some features of VoidVerified might need your access token to work correctly or fully. Below is a list of features using your access token. If you do not wish to use any of these features, you do not need to authorize. If revoking authentication, be sure to revoke VoidVerified from Anilist Apps as well.");
        const list = DOM_DOM.create("ul");
        for (const option of Object.values(StaticSettings.options).filter((o) => o.authRequired)) {
            list.append(DOM_DOM.create("li", null, option.description));
        }
        // DOM.create uses Vue router so don't use that here
        const authLink = document.createElement("a");
        authLink.classList.add("void-button");
        authLink.append("Authorize VoidVerified");
        authLink.setAttribute("href", `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&response_type=token`);
        const removeAuthButton = DOM_DOM.create("button", null, "Revoke auth token");
        removeAuthButton.classList.add("button");
        removeAuthButton.addEventListener("click", () => {
            this.removeAuthToken();
            this.renderSettings();
        });
        this.settingsContainer.append(header);
        this.settingsContainer.append(description);
        this.settingsContainer.append(list);
        this.settingsContainer.append(!isAuthenticated ? authLink : removeAuthButton);
        this.settingsContainer.append(VoidApi.createSettings());
    }
    static removeAuthToken() {
        this.token = null;
        this.expires = null;
        localStorage.removeItem(this.localStorageAuth);
    }
}

;// CONCATENATED MODULE: ./src/utils/colorFunctions.js
class ColorFunctions {
	static anilistBlue = "120, 180, 255";
	static hexToRgb(hex) {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);

		return `${r}, ${g}, ${b}`;
	}

	static rgbToHex(rgb) {
		const [r, g, b] = rgb.split(",");
		const hex = this.generateHex(r, g, b);
		return hex;
	}

	static generateHex(r, g, b) {
		return (
			"#" +
			[r, g, b]
				.map((x) => {
					const hex = Number(x).toString(16);
					return hex.length === 1 ? "0" + hex : hex;
				})
				.join("")
		);
	}

	static defaultColors = [
		"blue",
		"purple",
		"green",
		"orange",
		"red",
		"pink",
		"gray",
	];

	static defaultColorRgb = {
		gray: "103, 123, 148",
		blue: "61, 180, 242",
		purple: "192, 99, 255",
		green: "76, 202, 81",
		orange: "239, 136, 26",
		red: "225, 51, 51",
		pink: "252, 157, 214",
	};

	static handleAnilistColor(color) {
		if (this.defaultColors.includes(color)) {
			return this.defaultColorRgb[color];
		}

		return this.hexToRgb(color);
	}
}

;// CONCATENATED MODULE: ./src/utils/verifiedUsers.ts









class VerifiedUsers {
    static users = [];
    static tableContainer;
    static initialize() {
        this.users =
            JSON.parse(localStorage.getItem(LocalStorageKeys.verifiedUSers)) ?? [];
    }
    static createUserTable() {
        this.tableContainer = DOM_DOM.create("div", "table #verified-user-table");
        this.renderUserTable();
        return this.tableContainer;
    }
    static renderUserTable() {
        this.tableContainer.replaceChildren();
        this.tableContainer.style = `
            margin-top: 25px;
        `;
        const head = TableHead("Username", "Sign", "Color", "Other");
        const rows = this.users.map((user) => this.createUserRow(user));
        const body = TableBody(rows);
        const table = Table(head, body);
        this.tableContainer.append(table);
        const inputForm = DOM_DOM.create("form");
        inputForm.addEventListener("submit", (event) => {
            this.#handleVerifyUserForm(event);
        });
        const inputFormLabel = DOM_DOM.create("label", null, "Add user");
        inputFormLabel.setAttribute("for", "void-verified-add-user");
        inputForm.append(inputFormLabel);
        inputForm.append(InputField("", () => {
        }, "#verified-add-user"));
        this.tableContainer.append(inputForm);
    }
    static createUserRow(user) {
        const row = DOM_DOM.create("tr");
        const userLink = DOM_DOM.create("a", null, user.username);
        userLink.setAttribute("href", `/user/${user.username}/`);
        userLink.setAttribute("target", "_blank");
        row.append(DOM_DOM.create("td", null, userLink));
        const signInput = InputField(user.sign ?? "", (event) => {
            this.#updateUserOption(user.username, "sign", event.target.value);
        }, "sign");
        const signCell = DOM_DOM.create("td", null, signInput);
        signCell.append(this.#createUserCheckbox(user.enabledForUsername, user.username, "enabledForUsername", StaticSettings.options.enabledForUsername.getValue()));
        row.append(DOM_DOM.create("th", null, signCell));
        const colorInputContainer = DOM_DOM.create("div");
        const colorInput = DOM_DOM.create("input");
        colorInput.setAttribute("type", "color");
        colorInput.value = this.#getUserColorPickerColor(user);
        colorInput.addEventListener("change", (event) => this.#handleUserColorChange(event, user.username), false);
        colorInputContainer.append(colorInput);
        colorInputContainer.append(IconButton(RefreshIcon(), () => {
            this.#handleUserColorReset(user.username);
        }));
        colorInputContainer.append(this.#createUserCheckbox(user.copyColorFromProfile, user.username, "copyColorFromProfile", StaticSettings.options.copyColorFromProfile.getValue()));
        colorInputContainer.append(this.#createUserCheckbox(user.highlightEnabled, user.username, "highlightEnabled", StaticSettings.options.highlightEnabled.getValue()));
        colorInputContainer.append(this.#createUserCheckbox(user.highlightEnabledForReplies, user.username, "highlightEnabledForReplies", StaticSettings.options.highlightEnabledForReplies.getValue()));
        colorInputContainer.append(this.#createUserCheckbox(user.colorUserActivity, user.username, "colorUserActivity", StaticSettings.options.colorUserActivity.getValue()));
        colorInputContainer.append(this.#createUserCheckbox(user.colorUserReplies, user.username, "colorUserReplies", StaticSettings.options.colorUserReplies.getValue()));
        const colorCell = DOM_DOM.create("td", null, colorInputContainer);
        row.append(colorCell);
        const quickAccessCheckbox = this.#createUserCheckbox(user.quickAccessEnabled, user.username, "quickAccessEnabled", StaticSettings.options.quickAccessEnabled.getValue());
        const otherCell = DOM_DOM.create("td", null, quickAccessCheckbox);
        row.append(otherCell);
        const deleteButton = DOM_DOM.create("button", null, "❌");
        deleteButton.addEventListener("click", () => this.#removeUser(user.username));
        row.append(DOM_DOM.create("th", null, deleteButton));
        return row;
    }
    static #getUserColorPickerColor(user) {
        if (user.colorOverride) {
            return user.colorOverride;
        }
        if (user.color &&
            (user.copyColorFromProfile ||
                StaticSettings.options.copyColorFromProfile.getValue())) {
            return ColorFunctions.rgbToHex(user.color);
        }
        if (StaticSettings.options.useDefaultHighlightColor.getValue()) {
            return StaticSettings.options.defaultHighlightColor.getValue();
        }
        return ColorFunctions.rgbToHex(ColorFunctions.anilistBlue);
    }
    static #createUserCheckbox(isChecked, username, settingKey, disabled) {
        const onChange = (event) => {
            this.#updateUserOption(username, settingKey, event.target.checked);
            this.renderUserTable();
        };
        const description = StaticSettings.options[settingKey].description;
        const checkbox = Checkbox(isChecked, onChange, disabled);
        return Tooltip(description, checkbox);
    }
    static #handleUserColorReset(username) {
        this.#updateUserOption(username, "colorOverride", undefined);
        this.renderUserTable();
    }
    static #handleUserColorChange(event, username) {
        const color = event.target.value;
        this.#updateUserOption(username, "colorOverride", color);
    }
    static async #handleVerifyUserForm(event) {
        event.preventDefault();
        const usernameInput = DOM_DOM.get("#verified-add-user");
        const username = usernameInput.value;
        console.log(username);
        await this.verifyUser(username);
        usernameInput.value = "";
        this.renderUserTable();
    }
    static #updateUserOption(username, key, value) {
        this.updateUserOption(username, key, value);
        new StyleHandler(StaticSettings.settingsInstance).refreshStyles();
    }
    static #removeUser(username) {
        this.removeUser(username);
        this.renderUserTable();
        new StyleHandler(StaticSettings.settingsInstance).refreshStyles();
    }
    static updateUserOption(username, key, value) {
        this.users = this.users.map((u) => u.username === username
            ? {
                ...u,
                [key]: value,
            }
            : u);
        localStorage.setItem(LocalStorageKeys.verifiedUSers, JSON.stringify(this.users));
    }
    static updateUserFromApi(apiUser) {
        let user = this.findUser(apiUser);
        if (!user) {
            return;
        }
        const newUser = this.mapApiUser(user, apiUser);
        this.mapVerifiedUsers(newUser);
        localStorage.setItem(LocalStorageKeys.verifiedUSers, JSON.stringify(this.users));
    }
    static findUser(apiUser) {
        let user = this.users.find((u) => u.id && u.id === apiUser.id);
        if (user) {
            return user;
        }
        return this.users.find((u) => u.username.toLowerCase() === apiUser.name.toLowerCase());
    }
    static mapApiUser(user, apiUser) {
        let userObject = { ...user };
        userObject.color = ColorFunctions.handleAnilistColor(apiUser.options.profileColor);
        userObject.username = apiUser.name;
        userObject.avatar = apiUser.avatar.large;
        userObject.banner = apiUser.bannerImage;
        userObject.id = apiUser.id;
        userObject.lastFetch = new Date();
        if (StaticSettings.options.quickAccessBadge.getValue() || user.quickAccessBadge) {
            if ((user.avatar && user.avatar !== userObject.avatar) ||
                (user.color && user.color !== userObject.color) ||
                (user.banner && user.banner !== userObject.banner) ||
                (user.username &&
                    user.username.toLowerCase() !==
                        userObject.username.toLowerCase())) {
                userObject.quickAccessBadgeDisplay = true;
            }
        }
        return userObject;
    }
    static mapVerifiedUsers(newUser) {
        if (this.users.find((u) => u.id && u.id === newUser.id)) {
            this.users = this.users.map((u) => u.id === newUser.id ? newUser : u);
            return;
        }
        this.users = this.users.map((u) => u.username.toLowerCase() === newUser.username.toLowerCase()
            ? newUser
            : u);
    }
    static removeUser(username) {
        this.users = this.users.filter((user) => user.username !== username);
        localStorage.setItem(LocalStorageKeys.verifiedUSers, JSON.stringify(this.users));
    }
    static async verifyUser(username) {
        if (this.users.find((user) => user.username.toLowerCase() === username.toLowerCase())) {
            return;
        }
        try {
            Toaster.debug(`Querying ${username}.`);
            const user = await AnilistAPI.queryUser(username);
            // TODO: refactor updateUserFromApi to not need this user already saved
            this.users.push({
                username,
                avatar: "",
                banner: "",
                color: ColorFunctions.anilistBlue,
                colorUserActivity: false,
                colorUserReplies: false,
                copyColorFromProfile: false,
                enabledForUsername: false,
                highlightEnabled: false,
                highlightEnabledForReplies: false,
                id: undefined,
                lastFetch: new Date(),
                quickAccessBadge: false,
                quickAccessBadgeDisplay: false,
                quickAccessEnabled: false,
                sign: undefined
            });
            this.updateUserFromApi(user);
        }
        catch (error) {
            Toaster.error("Failed to query new user.", error);
        }
    }
}

;// CONCATENATED MODULE: ./src/api/anilistAPI.ts














// [
// 	{
// 		"message": "Invalid token",
// 		"status": 400
// 	}
// ]
class AnilistAPI {
    static url = "https://graphql.anilist.co";
    static async getUserAbout(username) {
        const response = await this.getUserCssAndColour(username);
        return response?.about;
    }
    static async getUserCssAndColour(username) {
        const query = `query ($username: String) {
            User(name: $username) {
                about
				options {
					profileColor
				}
            }
        }`;
        const variables = { username };
        const options = this.getQueryOptions(query, variables);
        const data = await this.fetch(options);
        return data.User;
    }
    static async getUserMediaListCollection(username, type) {
        const query = `query Query($userName: String, $type: MediaType) {
		  MediaListCollection(userName: $userName, type: $type) {
			lists {
			  entries {
				completedAt {
				  year
				  month
				  day
				}
				startedAt {
				  year
				  month
				  day
				}
				media {
				  title {
					userPreferred
				  }
				  format
				  duration
				  id
				}
				status
				progress
				progressVolumes
			  }
			}
			user {
			  about
			}
		  }
		}`;
        const variables = { userName: username, type };
        const options = this.getQueryOptions(query, variables);
        const data = await this.fetch(options);
        return data;
    }
    static async saveUserAbout(about) {
        const query = `mutation ($about: String) {
            UpdateUser(about: $about) {
                about
            }
        }`;
        const variables = { about };
        const options = this.getMutationOptions(query, variables);
        const data = await this.fetch(options);
        return data;
    }
    static async saveUserColor(color) {
        const query = `mutation ($color: String) {
            UpdateUser(profileColor: $color) {
                options {
                    profileColor
                }
            }
        }`;
        const variables = { color };
        const options = this.getMutationOptions(query, variables);
        const data = await this.fetch(options);
        return data;
    }
    static async saveDonatorBadge(text) {
        const query = `mutation ($text: String) {
            UpdateUser(donatorBadge: $text) {
                donatorBadge
            }
        }`;
        const variables = { text };
        const options = this.getMutationOptions(query, variables);
        const data = await this.fetch(options);
        return data;
    }
    static async queryVerifiedUsers() {
        const accountUser = await this.queryUser(AnilistAuth.name);
        VerifiedUsers.updateUserFromApi(accountUser);
        await this.queryUsers(1);
    }
    static async queryUser(username) {
        const variables = { username };
        const query = `query ($username: String!) {
                User(name: $username) {
                  name
                  id
                  avatar {
                    large
                  }
                  bannerImage
                  options {
                    profileColor
                  }
              }
            }
        `;
        const options = this.getQueryOptions(query, variables);
        const data = await this.fetch(options);
        return data.User;
    }
    static async searchUsers(username) {
        const variables = { search: username, perPage: 10 };
        const query = searchUsersQuery;
        const options = this.getQueryOptions(query, variables);
        const data = await this.fetch(options);
        return data.Page.users;
    }
    static async selfMessage(message) {
        const variables = { message, recipientId: AnilistAuth.id };
        const query = `
            mutation($recipientId: Int, $message: String) {
                SaveMessageActivity(message: $message, private: false, recipientId: $recipientId) {
                    id
                }
            }
        `;
        const options = this.getMutationOptions(query, variables);
        const data = await this.fetch(options);
        return data.SaveMessageActivity;
    }
    static async getNotifications(notificationTypes, page = 1, resetNotificationCount = false) {
        const query = `
        query($notificationTypes: [NotificationType], $page: Int, $resetNotificationCount: Boolean) {
            Page(page: $page) {
                notifications(type_in: $notificationTypes,
                    resetNotificationCount: $resetNotificationCount) {
                    ... on ActivityMessageNotification {${activityQuery}}
                    ... on ActivityReplyNotification {${activityQuery}}
                    ... on ActivityMentionNotification{${activityQuery}}
                    ... on ActivityReplySubscribedNotification{${activityQuery}}
                    ... on ActivityLikeNotification{${activityQuery}}
                    ... on ActivityReplyLikeNotification{${activityQuery}}
                    ... on FollowingNotification{${followingQuery}}
                    ... on AiringNotification{${airingQuery}}
                    ... on RelatedMediaAdditionNotification{${relatedMediaQuery}}
                    ... on ThreadCommentMentionNotification{${threadCommentQuery}}
                    ... on ThreadCommentReplyNotification{${threadCommentQuery}}
                    ... on ThreadCommentSubscribedNotification{${threadCommentQuery}}
                    ... on ThreadCommentLikeNotification{${threadCommentQuery}}
                    ... on ThreadLikeNotification{${threadQuery}}
                    ... on MediaDataChangeNotification{${mediaDataChange}}
                    ... on MediaDeletionNotification{${mediaDeleted}}
                }
                pageInfo {
                    currentPage
                    hasNextPage
                }
            }
        }`;
        const variables = {
            notificationTypes,
            page,
            resetNotificationCount,
        };
        const options = this.getMutationOptions(query, variables);
        const data = await this.fetch(options);
        return [data.Page.notifications, data.Page.pageInfo];
    }
    static async getActivityNotificationRelations(activityIds) {
        const userQuery = `
            name
            avatar {
                large
            }`;
        const activitiesQuery = ` ... on ListActivity {
                id
                type
                media {
                    coverImage {large}
                    id
                    type
                    title {
                    	userPreferred
                	}
                }
            }
            ... on TextActivity {
                id
                type
                user {${userQuery}}
            }
            ... on MessageActivity {
                id
                type
                recipient {${userQuery}}
            }`;
        const query = `query($activityIds: [Int]) {
            public: Page(page: 1) {
                activities(id_in: $activityIds, isFollowing: true) {${activitiesQuery}}
            }
            following: Page(page: 1) {
                activities(id_in: $activityIds, isFollowing: false) {${activitiesQuery}}
            }
        }`;
        const variables = { activityIds };
        const options = this.getMutationOptions(query, variables);
        const data = await this.fetch(options);
        const activities = new Set([
            ...data.public.activities,
            ...data.following.activities,
        ]);
        return Array.from(activities);
    }
    static async resetNotificationCount() {
        const query = `query {
            Page(page: 1, perPage: 1) {
                notifications(resetNotificationCount: true) {
                    __typename
                }
            }
        }`;
        const options = this.getMutationOptions(query, {});
        const data = await this.fetch(options);
        return data;
    }
    static async searchMedia(searchword) {
        const query = `query($searchword: String) {
            Page(page: 1, perPage: 10) {
                media(search: $searchword) {
                    id
                    title {
                        userPreferred
                    }
                    coverImage {
                        large
                    }
                    type
                    startDate {
                        year
                    }
                    episodes
                    chapters
                }
            }
        }`;
        const options = this.getMutationOptions(query, { searchword });
        const data = await this.fetch(options);
        return data.Page.media;
    }
    static async getMediaProgress(mediaId) {
        const query = `query($mediaId: Int, $userId: Int) {
			  MediaList(mediaId: $mediaId, userId: $userId) {
				id
				mediaId
				status
				progress
				media {title {
				  romaji
				  english
				  native
				  userPreferred
				}}
				media {
				  episodes
				  chapters
				}
			  }
			}`;
        const options = this.getMutationOptions(query, { mediaId, userId: AnilistAuth.id });
        const data = await this.fetch(options);
        return data.MediaList;
    }
    static async updateMediaProgress(id, mediaId, status, progress) {
        const query = `mutation ($id: Int, $mediaId: Int, $status: MediaListStatus, $progress: Int) {
			  SaveMediaListEntry(id: $id, mediaId: $mediaId, status: $status, progress: $progress) {
				id
			  }
			}
		`;
        const options = this.getMutationOptions(query, { id, status, progress, mediaId });
        const data = await this.fetch(options);
        return data.MediaList;
    }
    static async getCreatedMediaActivity(mediaId) {
        const query = `query ($userId: Int, $mediaId: Int) {
				Activity(userId: $userId, mediaId: $mediaId, sort: ID_DESC, type_in: [ANIME_LIST, MANGA_LIST]) {
					... on ListActivity {
					  id
					}
				  }
				}`;
        const options = this.getMutationOptions(query, { mediaId, userId: AnilistAuth.id });
        const data = await this.fetch(options);
        return data.Activity;
    }
    static async replyToActivity(activityId, reply) {
        const query = replyToActivityQuery;
        const options = this.getMutationOptions(query, { activityId, text: reply });
        const data = await this.fetch(options);
        return data.SaveActivityReply;
    }
    static async getMiniProfile(username, numberOfFavourites) {
        const variables = { name: username, page: 1, perPage: numberOfFavourites };
        const query = `query User($name: String, $page: Int, $perPage: Int) {
			  User(name: $name) {
			    about
				avatar {
				  large
				}
				createdAt
				donatorBadge
				favourites {
				  anime(page: $page, perPage: $perPage) {
					nodes {
					  coverImage {
						large
					  }
					  title {
						userPreferred
					  }
					  id
					  type
					}
				  }
				manga(page: $page, perPage: $perPage) {
					nodes {
					  coverImage {
						large
					  }
					  title {
						userPreferred
					  }
					  id
					  type
					}
				  }
				  characters(page: $page, perPage: $perPage) {
					nodes {
					  name {
						userPreferred
					  }
					  image {
						large
					  }
					  id
					}
				  }
				  staff(page: $page, perPage: $perPage) {
					nodes {
					  name {
						userPreferred
					  }
					  image {
						large
					  }
					  id
					}
				  }
				}
				name
				isFollower
				isFollowing
				options {
				  profileColor
				}
				bannerImage
				donatorTier
			  }
			}`;
        const options = this.getQueryOptions(query, variables);
        const data = await this.fetch(options);
        return data.User;
    }
    static async queryMessages(isFollowing, page = 1) {
        const query = queryMessages;
        const variables = { isFollowing, type: "MESSAGE", sort: "ID_DESC", asHtml: false, page, perPage: 25 };
        const options = this.getQueryOptions(query, variables);
        const data = await this.fetch(options);
        return {
            activities: data.Page.activities,
            pageInfo: data.Page.pageInfo
        };
    }
    static async queryActivityReplies(id, page = 1) {
        const query = queryActivityReplies;
        const variables = { activityId: id, perPage: 50, page };
        const options = this.getQueryOptions(query, variables);
        const data = await this.fetch(options);
        return {
            replies: data.Page.activityReplies,
            pageInfo: data.Page.pageInfo
        };
    }
    static async saveActivityText(type, id, content) {
        let query;
        switch (type) {
            case "TEXT":
                query = saveTextActivityMutation;
                break;
            case "MESSAGE":
                query = saveMessageActivityMutation;
                break;
            case "REPLY":
                query = saveActivityReplyMutation;
                break;
            default:
                throw new Error("Unsupported type " + type);
        }
        const variables = {
            id,
            content
        };
        const options = this.getMutationOptions(query, variables);
        const data = await this.fetch(options);
        return data.SaveActivityReply ?? data.SaveMessageActivity ?? data.SaveTextActivity;
    }
    static async deleteActivity(type, id) {
        const query = type === "ACTIVITY" ? deleteActivityQuery : deleteActivityReplyQuery;
        const variables = { id };
        const options = this.getMutationOptions(query, variables);
        const data = await this.fetch(options);
        return data.DeleteActivityReply?.deleted ?? data.DeleteActivity?.deleted;
    }
    static async toggleLike(id, type) {
        const query = toggleLike;
        const variables = { toggleLikeV2Id: id, type };
        const options = this.getMutationOptions(query, variables);
        const data = await this.fetch(options);
        return data.ToggleLikeV2;
    }
    static async toggleActivitySubscription(id, subscribe) {
        const query = toggleActivitySubscription;
        const variables = { activityId: id, subscribe };
        const options = this.getMutationOptions(query, variables);
        const data = await this.fetch(options);
        return data.ToggleActivitySubscription;
    }
    static async query(query, params) {
        const options = this.getQueryOptions(query, params);
        const data = await this.fetch(options);
        return data;
    }
    static async fetch(options) {
        try {
            const response = await fetch(this.url, options);
            this.setApiLimitRemaining(response);
            const data = await response.json();
            if (!response.ok) {
                let message = "Internal Server Error";
                // The API seems to return 500 with message (bad request) sometimes
                // to not make this confusing for the user, replace the message that ends up in UI
                if (response.status !== 500) {
                    message = data?.errors?.map(x => x.message)?.join(", ");
                }
                throw new AnilistAPIError([{
                        status: response.status,
                        message: message
                    }]);
            }
            if (data.errors) {
                throw new AnilistAPIError(data.errors);
            }
            return data.data;
        }
        catch (error) {
            if (error instanceof AnilistAPIError) {
                console.error("Anilist API returned error: ", error.errors);
            }
            else if (!(error instanceof AnilistAPIError)) {
                console.error(error);
            }
            throw error;
        }
    }
    static async queryUsers(page) {
        const variables = { page, userId: AnilistAuth.id };
        const query = `query ($page: Int, $userId: Int!) {
            Page(page: $page) {
                following(userId: $userId) {
                  name
                  id
                  avatar {
                    large
                  }
                  bannerImage
                  options {
                    profileColor
                  }
                },
                pageInfo {
                  total
                  perPage
                  currentPage
                  lastPage
                  hasNextPage
                }
              }
            }
        `;
        const options = this.getQueryOptions(query, variables);
        const data = await this.fetch(options);
        this.handleQueriedUsers(data.Page.following);
        const pageInfo = data.Page.pageInfo;
        if (pageInfo.hasNextPage) {
            await this.queryUsers(pageInfo.currentPage + 1);
        }
    }
    static handleQueriedUsers(users) {
        for (const user of users) {
            VerifiedUsers.updateUserFromApi(user);
        }
    }
    static getQueryOptions(query, variables) {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        };
        if (AnilistAuth.token) {
            // @ts-ignore
            options.headers.Authorization = `Bearer ${AnilistAuth.token}`;
        }
        return options;
    }
    static getMutationOptions(query, variables) {
        if (!AnilistAuth.token) {
            Toaster.error("Tried to make API query without authorizing VoidVerified. You can do so in the settings.");
            throw new Error("VoidVerified is missing auth token.");
        }
        let queryOptions = this.getQueryOptions(query, variables);
        return queryOptions;
    }
    static setApiLimitRemaining(response) {
        const apiLimitOffset = 60;
        // @ts-ignore
        const remaining = response.headers.get("X-RateLimit-Remaining") - apiLimitOffset;
        if (remaining < 5 && remaining >= 0) {
            Toaster.warning(`Remaining queries before reset: ${remaining}`);
        }
        localStorage.setItem("void-verified-api-limit-remaining", remaining.toString());
    }
}
const userQuery = `user {
    name
    avatar {
        large
    }
}`;
const mediaQuery = `media {
    title {
        userPreferred
    }
    coverImage {
        large
    }
    id
    type
}`;
const activityQuery = `activityId
    type
    id
    ${userQuery}
    createdAt
    context`;
const followingQuery = `type
    id
    context
    createdAt
    ${userQuery}
    `;
const airingQuery = `type
    id
    contexts
    createdAt
    ${mediaQuery}
    episode
    `;
const relatedMediaQuery = `type
    id
    ${mediaQuery}
    context
    createdAt`;
const threadQuery = `type
    id
    context
    threadId
    thread {title}
    ${userQuery}
    createdAt`;
const threadCommentQuery = `type
    id
    context
    thread {
        id
        title
    }
    commentId
    ${userQuery}
    createdAt`;
const mediaDataChange = `type
    id
    context
    ${mediaQuery}
    reason
    createdAt
    `;
const mediaDeleted = `type
    id
    context
    reason
    deletedMediaTitle
    createdAt`;
class AnilistAPIError extends Error {
    errors;
    constructor(errors) {
        super();
        this.errors = errors;
        this.name = "AnilistAPIError";
    }
}

;// CONCATENATED MODULE: ./src/components/selectComponent.ts

class SelectComponent {
    element;
    activeValue;
    constructor(initialValue, values, onClick) {
        this.element = DOM_DOM.create("div", "select");
        this.activeValue = initialValue;
        for (const value of values) {
            const option = DOM_DOM.create("div", "option", value);
            option.setAttribute("value", value.toString());
            option.addEventListener("click", () => {
                onClick(value);
                option.classList.remove("active");
                this.updateActive(value);
            });
            if (this.activeValue === value) {
                option.classList.add("active");
            }
            this.element.append(option);
        }
        ;
    }
    updateActive(value) {
        this.activeValue = value;
        this.element.querySelector(".active")?.classList.remove("active");
        this.element.querySelector(`.void-option[value="${this.activeValue}"]`)?.classList.add("active");
    }
}

;// CONCATENATED MODULE: ./src/utils/toaster.ts






const toastTypes = {
    info: "info",
    success: "success",
    warning: "warning",
    error: "error",
};
const toastLevels = {
    info: 0,
    success: 1,
    warning: 2,
    error: 3,
};
const toastDurations = [1, 3, 5, 10];
const toastLocations = ["top-left", "top-right", "bottom-left", "bottom-right"];
class ToasterConfig {
    toastLevel;
    duration;
    location;
    constructor(config) {
        this.toastLevel = config?.toastLevel ?? 2;
        this.duration = config?.duration ?? 5;
        this.location = config?.location ?? "bottom-left";
    }
}
class ToastInstance {
    type;
    message;
    duration;
    error;
    // durationLeft;
    // interval;
    constructor(message, type, duration, error) {
        this.type = type;
        this.message = message;
        this.duration = duration * 1000;
        this.error = error;
    }
    toast() {
        const toast = Toast(this.message, this.type);
        if (this.error && this.error instanceof AnilistAPIError) {
            toast.append(` (${this.error.errors[0].message})`);
        }
        else if (this.error && this.error instanceof VoidApiError) {
            toast.append(` (${this.error.message})`);
        }
        if (this.error) {
            console.error(this.error);
        }
        // this.durationLeft = this.duration;
        // This code can be used for a visual indicator
        // this.interval = setInterval(
        // 	(toast) => {
        // 		if (this.durationLeft <= 0) {
        // 			this.delete(toast);
        // 			clearInterval(this.interval);
        // 			return;
        // 		}
        // 		this.durationLeft -= 100;
        // 	},
        // 	100,
        // 	toast
        // );
        setTimeout(() => {
            this.delete(toast);
        }, this.duration);
        return toast;
    }
    delete(toast) {
        toast.remove();
    }
}
class Toaster {
    static #config;
    static #configInLocalStorage = LocalStorageKeys.toasterConfig;
    static #settings;
    static initializeToaster(settings) {
        this.#settings = settings;
        const config = JSON.parse(localStorage.getItem(this.#configInLocalStorage));
        this.#config = new ToasterConfig(config);
        const toastContainer = DOM_DOM.create("div", `#toast-container ${this.#config.location}`);
        document.body.append(toastContainer);
    }
    static debug(message) {
        if (!this.#shouldToast(toastTypes.info)) {
            return;
        }
        DOM_DOM.get("#toast-container").append(new ToastInstance(message, toastTypes.info, this.#config.duration).toast());
    }
    static success(message) {
        if (!this.#shouldToast(toastTypes.success)) {
            return;
        }
        DOM_DOM.get("#toast-container").append(new ToastInstance(message, toastTypes.success, this.#config.duration).toast());
    }
    static warning(message, error) {
        if (!this.#shouldToast(toastTypes.warning)) {
            return;
        }
        DOM_DOM.get("#toast-container").append(new ToastInstance(message, toastTypes.warning, this.#config.duration, error).toast());
    }
    static error(message, error) {
        if (!this.#shouldToast(toastTypes.error)) {
            return;
        }
        DOM_DOM.get("#toast-container").append(new ToastInstance(message, toastTypes.error, this.#config.duration, error).toast());
    }
    static critical(message) {
        DOM_DOM.get("#toast-container").append(new ToastInstance(message, toastTypes.error, 8).toast());
    }
    static notify(message) {
        DOM_DOM.get("#toast-container").append(new ToastInstance(message, toastTypes.info, this.#config.duration).toast());
    }
    static #shouldToast(type) {
        return (this.#settings.options.toasterEnabled.getValue() &&
            this.#config.toastLevel <= toastLevels[type]);
    }
    static renderSettings() {
        const container = DOM_DOM.createDiv();
        container.append(DOM_DOM.create("h3", null, "Configure Toasts"));
        container.append(DOM_DOM.create("p", null, "Toasts are notifications that pop up in the corner of your screen when things are happening."));
        const toastTypeSelect = new SelectComponent(this.#config.toastLevel, Object.values(toastTypes), (value) => {
            this.#handleLevelChange(value);
        });
        container.append(Label("Toast level", toastTypeSelect.element));
        const locationSelect = new SelectComponent(this.#config.location, toastLocations, (value) => {
            this.#handleLocationChange(location);
        });
        container.append(Label("Toast location", locationSelect.element));
        const durationSelect = new SelectComponent(this.#config.duration, toastDurations, (value) => {
            this.#handleDurationChange(value);
        });
        container.append(Label("Toast duration", durationSelect.element));
        container.append(Button("Test Toasts", () => {
            Toaster.debug("This is a debug toast.");
            Toaster.success("This is a success toast.");
            Toaster.warning("This is a warning toast.");
            Toaster.error("This is an error toast.");
        }));
        return container;
    }
    static #handleLevelChange(type) {
        this.#config.toastLevel = toastLevels[type];
        this.#saveConfig();
    }
    static #handleLocationChange(location) {
        this.#config.location = location;
        this.#saveConfig();
        const container = DOM_DOM.get("#toast-container");
        for (const className of container.classList) {
            container.classList.remove(className);
        }
        container.classList.add(`void-${location}`);
    }
    static #handleDurationChange(duration) {
        this.#config.duration = duration;
        this.#saveConfig();
    }
    static #saveConfig() {
        localStorage.setItem(this.#configInLocalStorage, JSON.stringify(this.#config));
    }
}

;// CONCATENATED MODULE: ./src/utils/baseConfig.ts
class BaseConfig {
    configInLocalStorage;
    constructor(configInLocalStorage) {
        this.configInLocalStorage = configInLocalStorage;
    }
    save() {
        localStorage.setItem(this.configInLocalStorage, JSON.stringify(this));
    }
}

;// CONCATENATED MODULE: ./src/utils/time.ts





class TimeConfig extends BaseConfig {
    dateFormat;
    use12HourFormat;
    constructor() {
        super(LocalStorageKeys.timeConfig);
        const config = JSON.parse(localStorage.getItem(this.configInLocalStorage));
        this.dateFormat = config?.dateFormat ?? "mm/dd/yyyy";
        this.use12HourFormat = config?.use12HourFormat ?? true;
    }
}
class Time {
    static config = new TimeConfig();
    static convertToString(timestamp) {
        const now = new Date();
        const seconds = Math.floor((now.getTime() - timestamp * 1000) / 1000);
        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return interval + " years ago";
        }
        else if (interval === 1) {
            return "1 year ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months ago";
        }
        else if (interval === 1) {
            return "1 month ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " days ago";
        }
        else if (interval === 1) {
            return "1 day ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " hours ago";
        }
        else if (interval === 1) {
            return "1 hour ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes ago";
        }
        else if (interval === 1) {
            return "1 minute ago";
        }
        return Math.floor(seconds) + " seconds ago";
    }
    static convertToDate(timestamp) {
        if (typeof timestamp === "number") {
            return new Date(timestamp * 1000);
        }
        else if (typeof timestamp === "string") {
            return new Date(timestamp);
        }
        return timestamp;
    }
    static toLocaleString(date) {
        let d = this.convertToDate(date);
        const day = d.getDate().toString().padStart(2, "0");
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const year = d.getFullYear();
        const minute = d.getMinutes().toString().padStart(2, "0");
        const second = d.getSeconds().toString().padStart(2, "0");
        let formattedDate;
        switch (this.config.dateFormat) {
            case "dd/mm/yyyy":
                formattedDate = `${day}/${month}/${year}`;
                break;
            case "mm/dd/yyyy":
                formattedDate = `${month}/${day}/${year}`;
                break;
            case "dd.mm.yyyy":
                formattedDate = `${day}.${month}.${year}`;
                break;
            default:
                formattedDate = `${year}-${month}-${day}`;
        }
        let hour = d.getHours();
        let period = "";
        if (this.config.use12HourFormat) {
            period = hour >= 12 ? "PM" : "AM";
            hour = hour % 12 || 12;
        }
        const hourStr = hour.toString().padStart(2, "0");
        const formattedTime = `${hourStr}:${minute}:${second}${this.config.use12HourFormat ? " " + period : ""}`;
        return `${formattedDate} ${formattedTime}`;
    }
    static toAnilistTimestamp(date) {
        let d = typeof date === "string" ? new Date(date) : date;
        return Math.floor(d.getTime() / 1000);
    }
    static renderConfig() {
        const container = DOM_DOM.createDiv(null, DOM_DOM.create("h3", null, "Time Format Configuration"));
        const dateFormatSelect = new SelectComponent(this.config.dateFormat, ["yyyy-mm-dd", "dd/mm/yyyy", "mm/dd/yyyy", "dd.mm.yyyy"], (value) => {
            this.config.dateFormat = value;
            this.config.save();
        });
        const use12HourFormatCheckbox = Checkbox(this.config.use12HourFormat, (event) => {
            this.config.use12HourFormat = event.target.checked;
            this.config.save();
        });
        container.append(Label("Date format", dateFormatSelect.element), Label("Use 12 hour format", use12HourFormatCheckbox));
        return container;
    }
    static toUpcomingString(date) {
        const d = this.convertToDate(date);
        const now = new Date();
        const diffMs = d.getTime() - now.getTime();
        if (diffMs <= 0)
            return "now";
        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (seconds < 60)
            return `in ${seconds} second${seconds !== 1 ? 's' : ''}`;
        if (minutes < 60)
            return `in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
        if (hours < 24)
            return `in ${hours} hour${hours !== 1 ? 's' : ''}`;
        return `in ${days} day${days !== 1 ? 's' : ''}`;
    }
    static hasTimePassed(sinceDate, time) {
        const now = new Date();
        const elapsed = now.getTime() - sinceDate.getTime(); // milliseconds
        const millisecondsToCompare = (time.days ?? 0) * 24 * 60 * 60 * 1000 +
            (time.hours ?? 0) * 60 * 60 * 1000 +
            (time.minutes ?? 0) * 60 * 1000 +
            (time.seconds ?? 0) * 1000;
        return elapsed >= millisecondsToCompare;
    }
}

;// CONCATENATED MODULE: ./src/handlers/gifKeyboardHandler.ts









const keyboardTabs = {
    gifs: "GIFS",
    images: "Images",
};
class GifKeyboardConfig {
    gifs;
    gifSize;
    images;
    lastSyncTime;
    #configInLocalStorage = LocalStorageKeys.gifKeyboardConfig;
    constructor() {
        const config = JSON.parse(localStorage.getItem(this.#configInLocalStorage));
        this.gifs = config?.gifs ?? [];
        this.images = config?.images ?? [];
        this.gifSize = config?.gifSize ?? 260;
        this.lastSyncTime = config?.lastSyncTime ? new Date(config?.lastSyncTime) : undefined;
    }
    save() {
        localStorage.setItem(LocalStorageKeys.gifKeyboardConfig, JSON.stringify(this));
    }
}
class GifKeyboardHandler {
    static #activeTab = keyboardTabs.gifs;
    static #paginationPage = 0;
    static #pageSize = 30;
    static config = new GifKeyboardConfig();
    static handleGifKeyboard() {
        this.addGifKeyboards();
        this.addMediaLikeButtons();
    }
    static async getGifsFromApi() {
        if (!StaticSettings.options.syncGifsToVoidApi.getValue()) {
            return;
        }
        if (!this.config.lastSyncTime) {
            StaticSettings.options.syncGifsToVoidApi.onValueSet();
            return;
        }
        if (this.config.lastSyncTime && !Time.hasTimePassed(this.config.lastSyncTime, { minutes: 60 })) {
            return;
        }
        try {
            const gifs = await VoidApi.getGifs();
            this.config.gifs = [];
            this.config.images = [];
            for (const gif of gifs) {
                const isGif = gif.url.endsWith(".gif");
                this.addMedia(gif.url, isGif ? keyboardTabs.gifs : keyboardTabs.images);
            }
            this.config.lastSyncTime = new Date();
            this.config.save();
        }
        catch (error) {
            Toaster.error("There was an error syncing gifs with VoidAPI.", error);
        }
    }
    static async syncGifs() {
        const gifs = [...GifKeyboardHandler.config.gifs, ...GifKeyboardHandler.config.images].map(x => {
            return { url: x };
        });
        try {
            Toaster.debug("Uploading local gif collection to VoidAPI.");
            const gifsFromApi = await VoidApi.addGifs(gifs);
            for (const gif of gifsFromApi) {
                const isGif = gif.url.endsWith(".gif");
                GifKeyboardHandler.addMedia(gif.url, isGif ? keyboardTabs.gifs : keyboardTabs.images);
            }
            GifKeyboardHandler.config.lastSyncTime = new Date();
            GifKeyboardHandler.config.save();
        }
        catch (error) {
            Toaster.error("Failed to upload gifs to VoidAPI.", error);
        }
    }
    static addMediaLikeButtons() {
        if (!StaticSettings.options.gifKeyboardEnabled.getValue()) {
            return;
        }
        if (!StaticSettings.options.gifKeyboardLikeButtonsEnabled.getValue()) {
            return;
        }
        const gifs = document.querySelectorAll(":is(.activity-markdown, .reply-markdown) .markdown img[src$='.gif']");
        for (const gif of gifs) {
            this.addMediaLikeButton(gif, keyboardTabs.gifs, this.config.gifs);
        }
        const images = ImageFormats.map((format) => {
            return [
                ...document.querySelectorAll(`:is(.activity-markdown, .reply-markdown) .markdown img[src$='.${format}']`),
            ];
        }).flat(1);
        for (const image of images) {
            this.addMediaLikeButton(image, keyboardTabs.images, this.config.images);
        }
    }
    static addMediaLikeButton(media, mediaType, mediaList) {
        if (media.parentElement.classList.contains("void-gif-like-container")) {
            return;
        }
        const img = media.cloneNode();
        img.removeAttribute("width");
        const gifContainer = GifContainer(img, () => {
            this.addOrRemoveMedia(media.src, mediaType);
            this.config.save();
            this.refreshKeyboards();
        }, mediaList);
        const width = media.getAttribute("width");
        if (width) {
            gifContainer.style.maxWidth = width?.endsWith("%")
                ? width
                : `${width}px`;
        }
        else {
            gifContainer.style.maxWidth = `${img.width}px`;
        }
        media.replaceWith(gifContainer);
    }
    static addGifKeyboards() {
        if (!StaticSettings.options.gifKeyboardEnabled.getValue()) {
            return;
        }
        const markdownEditors = document.querySelectorAll(".markdown-editor");
        for (const markdownEditor of markdownEditors) {
            if (markdownEditor.querySelector(".void-gif-button")) {
                continue;
            }
            const gifKeyboard = GifKeyboard(this.createKeyboardHeader());
            gifKeyboard.classList.add("void-hidden");
            this.renderMediaList(gifKeyboard, markdownEditor);
            this.renderControls(gifKeyboard, markdownEditor);
            const iconButton = IconButton(GifIcon(), () => {
                this.toggleKeyboardVisibility(gifKeyboard);
            }, "gif-button");
            iconButton.setAttribute("title", "GIF Keyboard");
            markdownEditor.append(iconButton);
            markdownEditor.parentNode.insertBefore(gifKeyboard, markdownEditor.nextSibling);
        }
    }
    static refreshKeyboards() {
        const keyboards = DOM_DOM.getAll("gif-keyboard-container");
        for (const keyboard of keyboards) {
            this.refreshKeyboard(keyboard);
        }
    }
    static refreshKeyboard(keyboard) {
        const markdownEditor = keyboard.parentElement.querySelector(".markdown-editor");
        this.renderControls(keyboard, markdownEditor);
        this.renderMediaList(keyboard, markdownEditor);
    }
    static createKeyboardHeader = () => {
        const header = DOM_DOM.create("div", "gif-keyboard-header");
        const options = Object.values(keyboardTabs).map((option) => Option(option, option === this.#activeTab, (event) => {
            this.#activeTab = option;
            const keyboard = event.target.parentElement.parentElement.parentElement; // oh god
            this.refreshKeyboard(keyboard);
            event.target.parentElement.parentElement.replaceWith(this.createKeyboardHeader());
        }));
        header.append(Select(options));
        header.append(RangeField(this.config.gifSize, (event) => {
            this.config.gifSize = event.target.value;
            this.config.save();
        }, 600, 10, 10));
        return header;
    };
    static addOrRemoveMedia(url, mediaType) {
        let mediaList = mediaType === keyboardTabs.gifs
            ? this.config.gifs
            : this.config.images;
        if (mediaList.includes(url)) {
            mediaList = mediaList.filter((media) => media !== url);
            this.removeMediaFromApi(url);
        }
        else {
            mediaList.push(url);
            this.addMediaToApi(url);
        }
        switch (mediaType) {
            case keyboardTabs.gifs:
                this.config.gifs = mediaList;
                break;
            case keyboardTabs.images:
                this.config.images = mediaList;
                break;
        }
    }
    static async addMediaToApi(url) {
        if (!StaticSettings.options.syncGifsToVoidApi.getValue() || !VoidApi.token) {
            return;
        }
        try {
            await VoidApi.addGif({ url });
        }
        catch (error) {
            Toaster.error("Failed to save media to API.", error);
        }
    }
    static async removeMediaFromApi(url) {
        if (!StaticSettings.options.syncGifsToVoidApi.getValue()) {
            return;
        }
        try {
            await VoidApi.deleteGif({ url });
        }
        catch (error) {
            Toaster.error("Failed to delete media from API.", error);
        }
    }
    static addMedia(url, mediaType) {
        let mediaList = mediaType === keyboardTabs.gifs
            ? this.config.gifs
            : this.config.images;
        if (mediaList.includes(url)) {
            return;
        }
        mediaList.push(url);
        switch (mediaType) {
            case keyboardTabs.gifs:
                this.config.gifs = mediaList;
                break;
            case keyboardTabs.images:
                this.config.images = mediaList;
                break;
        }
        this.config.save();
    }
    static toggleKeyboardVisibility(keyboard) {
        if (keyboard.classList.contains("void-hidden")) {
            this.refreshKeyboard(keyboard);
            keyboard.classList.remove("void-hidden");
        }
        else {
            keyboard.classList.add("void-hidden");
        }
    }
    static renderMediaList(keyboard, markdownEditor) {
        if (!keyboard || !markdownEditor) {
            return;
        }
        const mediaItems = keyboard.querySelector(".void-gif-keyboard-list");
        const columns = [1, 2, 3].map(() => {
            return DOM_DOM.create("div", "gif-keyboard-list-column");
        });
        mediaItems.replaceChildren(...columns);
        const textarea = markdownEditor.parentElement.querySelector("textarea");
        const mediaList = this.#activeTab === keyboardTabs.gifs
            ? this.config.gifs
            : this.config.images;
        if (mediaList.length === 0) {
            mediaItems.replaceChildren(DOM_DOM.create("div", "gif-keyboard-list-placeholder", this.#activeTab === keyboardTabs.gifs
                ? "It's pronounced GIF."
                : "You have no funny memes :c"));
        }
        for (const [index, media] of mediaList
            .slice(this.#paginationPage * this.#pageSize, this.#paginationPage * this.#pageSize + this.#pageSize)
            .entries()) {
            mediaItems.children.item(index % 3).append(GifItem(media, () => {
                textarea.setRangeText(`img${this.config.gifSize}(${media})`);
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
            }, () => {
                this.addOrRemoveMedia(media, this.#activeTab);
                this.config.save();
            }, mediaList));
        }
    }
    static renderControls(keyboard, markdownEditor) {
        const container = keyboard.querySelector(".void-gif-keyboard-control-container");
        const mediaField = this.createMediaAddField(keyboard, markdownEditor);
        const pagination = this.createPagination(keyboard, markdownEditor);
        container.replaceChildren(mediaField, pagination);
    }
    static createMediaAddField(keyboard, markdownEditor) {
        const actionfield = ActionInputField("", (_, inputField) => {
            this.handleAddMediaField(inputField, keyboard, markdownEditor);
        }, AddIcon());
        actionfield
            .querySelector("input")
            .setAttribute("placeholder", "Add media...");
        return actionfield;
    }
    static handleAddMediaField(inputField, keyboard, markdownEditor) {
        const url = inputField.value;
        inputField.value = "";
        let format;
        if (url.toLowerCase().endsWith(".gif")) {
            format = keyboardTabs.gifs;
        }
        else if (ImageFormats.some((imgFormat) => url.toLowerCase().endsWith(imgFormat.toLocaleLowerCase()))) {
            format = keyboardTabs.images;
        }
        if (!format) {
            Toaster.error("Url was not recognized as image or GIF.");
            return;
        }
        Toaster.success(`Added media to ${format}`);
        this.addOrRemoveMedia(url, format);
        this.config.save();
        this.refreshKeyboard(keyboard);
    }
    static createPagination(keyboard, markdownEditor) {
        const container = DOM_DOM.create("div", "gif-keyboard-pagination-container");
        const mediaList = this.#activeTab === keyboardTabs.gifs
            ? this.config.gifs
            : this.config.images;
        const maxPages = Math.ceil(mediaList.length / this.#pageSize) - 1;
        if (this.#paginationPage > maxPages) {
            this.#paginationPage = maxPages;
        }
        container.append(Pagination(this.#paginationPage, maxPages, (page) => {
            this.#paginationPage = page;
            this.refreshKeyboards();
        }));
        return container;
    }
}

;// CONCATENATED MODULE: ./src/assets/defaultSettings.ts

const categories = {
    users: "users",
    paste: "paste",
    activity: "activity",
    misc: "misc",
};
const defaultSettings = {
    copyColorFromProfile: {
        defaultValue: true,
        description: "Copy user color from their profile.",
        category: categories.users,
    },
    moveSubscribeButtons: {
        defaultValue: false,
        description: "Move activity subscribe button next to comments and likes.",
        category: categories.activity,
    },
    hideLikeCount: {
        defaultValue: false,
        description: "Hide activity and reply like counts.",
        category: categories.activity,
    },
    enabledForUsername: {
        defaultValue: true,
        description: "Display a verified sign next to usernames.",
        category: categories.users,
    },
    enabledForProfileName: {
        defaultValue: false,
        description: "Display a verified sign next to a profile name.",
        category: categories.users,
    },
    defaultSign: {
        defaultValue: "✔",
        description: "The default sign displayed next to a username.",
        category: categories.users,
    },
    highlightEnabled: {
        defaultValue: true,
        description: "Highlight user activity with a border.",
        category: categories.users,
    },
    highlightEnabledForReplies: {
        defaultValue: true,
        description: "Highlight replies with a border.",
        category: categories.users,
    },
    highlightSize: {
        defaultValue: "5px",
        description: "Width of the highlight border.",
        category: categories.users,
    },
    colorUserActivity: {
        defaultValue: false,
        description: "Color user activity links with user color.",
        category: categories.users,
    },
    colorUserReplies: {
        defaultValue: false,
        description: "Color user reply links with user color.",
        category: categories.users,
    },
    useDefaultHighlightColor: {
        defaultValue: false,
        description: "Use fallback highlight color when user color is not specified.",
        category: categories.users,
    },
    defaultHighlightColor: {
        defaultValue: "#FFFFFF",
        description: "Fallback highlight color.",
        category: categories.users,
    },
    globalCssEnabled: {
        defaultValue: false,
        description: "Enable custom global CSS.",
        category: categories.misc,
    },
    layoutDesignerEnabled: {
        defaultValue: false,
        description: "Enable Layout Designer in the settings tab.",
        category: categories.misc,
        authRequired: true,
    },
    replaceNotifications: {
        defaultValue: false,
        description: "Replace AniList notification system.",
        category: categories.misc,
        authRequired: true,
    },
    quickAccessNotificationsEnabled: {
        defaultValue: false,
        description: "Display quick access of notifications in home page.",
        category: categories.misc,
        authRequired: true,
    },
    quickAccessEnabled: {
        defaultValue: false,
        description: "Display quick access of users in home page.",
        category: categories.users,
    },
    quickAccessBadge: {
        defaultValue: false,
        description: "Display a badge on quick access when changes are detected on user's layout.",
        category: categories.users,
    },
    quickAccessTimer: {
        defaultValue: true,
        description: "Display a timer until next update of Quick Access.",
        category: categories.users,
    },
    pasteEnabled: {
        defaultValue: false,
        description: "Wrap pasted image links with image tags.",
        category: categories.paste,
    },
    pasteWrapImagesWithLink: {
        defaultValue: false,
        description: "Wrap images with a link tag.",
        category: categories.paste,
    },
    pasteImageWidthValue: {
        defaultValue: 420,
        description: "Width used when pasting images.",
        category: categories.paste,
    },
    pasteImageUnitIsPercentage: {
        defaultValue: false,
        description: "Use percentage instead of pixels as image width.",
        category: categories.paste,
    },
    pasteImagesToHostService: {
        defaultValue: false,
        description: "Upload image from the clipboard to image host (configure below).",
        category: categories.paste,
    },
    toasterEnabled: {
        defaultValue: true,
        description: "Enable toast notifications.",
        category: categories.misc,
    },
    removeAnilistBlanks: {
        defaultValue: false,
        description: "Open AniList links in the same tab.",
        category: categories.misc,
    },
    gifKeyboardEnabled: {
        defaultValue: false,
        description: "Add a GIF keyboard to activity editor.",
        category: categories.paste
    },
    gifKeyboardLikeButtonsEnabled: {
        defaultValue: true,
        description: "Add like buttons to add media to GIF keyboard.",
        category: categories.paste,
    },
    syncGifsToVoidApi: {
        defaultValue: false,
        description: "Sync GIFs and images with your other devices through VoidAPI",
        category: categories.paste,
        authRequired: false,
        voidApiAuthRequired: true,
        onValueSet: GifKeyboardHandler.syncGifs
    },
    changeLogEnabled: {
        defaultValue: true,
        description: "Display a changelog when a new version is detected.",
        category: categories.misc,
    },
    selfMessageEnabled: {
        defaultValue: false,
        description: "Enable a self-message button on your profile (requires authentication).",
        category: categories.activity,
        authRequired: true,
    },
    hideMessagesFromListFeed: {
        defaultValue: false,
        description: "Fix AniList bug where private messages are displayed in List activity feed.",
        category: categories.activity,
    },
    replyActivityUpdate: {
        defaultValue: false,
        description: "Add insta-reply to activity update in home feed.",
        category: categories.activity,
        authRequired: true,
    },
    markdownHotkeys: {
        defaultValue: false,
        description: "Enable markdown editor shortcuts.",
        category: categories.activity,
        authRequired: false,
    },
    collapsibleReplies: {
        defaultValue: false,
        description: "Add collapse button to replies.",
        category: categories.activity,
        authRequired: false,
    },
    rememberCollapsedReplies: {
        defaultValue: true,
        description: "Remember collapsed replies.",
        category: categories.activity,
        authRequired: false,
    },
    autoCollapseLiked: {
        defaultValue: false,
        description: "Collapse liked comments.",
        category: categories.activity,
        authRequired: false,
    },
    autoCollapseSelf: {
        defaultValue: false,
        description: "Collapse your own replies.",
        category: categories.activity,
        authRequired: false,
    },
    goalsEnabled: {
        defaultValue: false,
        description: "Display animanga goals in profile overview.",
        category: categories.misc,
        authRequired: true,
    },
    imagePreviewEnabled: {
        defaultValue: false,
        description: "Hover image links to preview.",
        category: categories.activity,
        authRequired: false
    },
    miniProfileEnabled: {
        defaultValue: false,
        description: "Hover over users to view a mini profile.",
        category: categories.users,
        authRequired: false
    },
    replaceVideosWithLinksEnabled: {
        defaultValue: false,
        description: "Replace videos with video links (mobile fix).",
        category: categories.misc,
        authRequired: false
    },
    messageFeedEnabled: {
        defaultValue: false,
        description: "Enable Message-feed in the home page.",
        category: categories.activity,
        authRequired: true
    },
    quickStartEnabled: {
        defaultValue: false,
        description: "Enable VoidVerified QuickStart.",
        category: categories.misc,
        authRequired: true
    },
    activityTimestampTooltipsEnabled: {
        defaultValue: false,
        description: "Replace activity timestamp tooltips.",
        category: categories.misc,
        authRequired: false
    },
    replyToEnabled: {
        defaultValue: false,
        description: "Add Reply To selection to activities and replies.",
        category: categories.activity,
        authRequired: false
    },
    replyDirectLinksEnabled: {
        defaultValue: false,
        description: "Add direct links to replies.",
        category: categories.activity,
        authRequired: false
    },
    scrollToReplyEnabled: {
        defaultValue: true,
        description: "Scroll to reply if it is specified in the URL.",
        category: categories.activity,
        authRequired: false
    },
    markdownTaskbarEnabled: {
        defaultValue: false,
        description: "Add a taskbar to markdown editors.",
        category: categories.activity,
        authRequired: false
    },
    pollsEnabled: {
        defaultValue: false,
        description: "Create and vote on polls.",
        category: categories.activity,
        authRequired: false,
        voidApiAuthRequired: true
    }
};

;// CONCATENATED MODULE: ./src/utils/settings.ts




class Settings {
    localStorageSettings = LocalStorageKeys.settings;
    localStorageAuth = "void-verified-auth";
    version;
    auth = {
        token: AnilistAuth.token,
        expires: AnilistAuth.expires
    };
    anilistUser;
    userId;
    verifiedUsers = VerifiedUsers.users;
    options = StaticSettings.options;
    constructor() {
        this.version = GM_info.script.version;
    }
    isAuthorized() {
        const isAuthorized = this.auth?.token != null;
        return isAuthorized;
    }
    updateUserOption(username, key, value) {
        VerifiedUsers.updateUserOption(username, key, value);
    }
    removeAuthToken() {
        this.auth = null;
        localStorage.removeItem(this.localStorageAuth);
    }
    saveSettingToLocalStorage(key, value) {
        let localSettings = JSON.parse(localStorage.getItem(this.localStorageSettings));
        this.options[key].value = value;
        if (localSettings === null) {
            const settings = {
                [key]: value,
            };
            localStorage.setItem(this.localStorageSettings, JSON.stringify(settings));
            return;
        }
        localSettings[key] = { value };
        localStorage.setItem(this.localStorageSettings, JSON.stringify(localSettings));
    }
}

;// CONCATENATED MODULE: ./src/utils/staticSettings.ts





class staticSettings_Option {
    key;
    value;
    defaultValue;
    description;
    category;
    authRequired;
    voidApiAuthRequired;
    onValueSet;
    constructor(option) {
        this.defaultValue = option.defaultValue;
        this.description = option.description;
        this.category = option.category ?? categories.misc;
        this.authRequired = option.authRequired;
        this.key = option.key;
        this.voidApiAuthRequired = option.voidApiAuthRequired ?? false;
        this.onValueSet = option.onValueSet;
    }
    getValue() {
        if (this.authRequired && !AnilistAuth.token) {
            return false;
        }
        if (this.voidApiAuthRequired && !VoidApi.token) {
            return false;
        }
        if (this.value === "") {
            return this.defaultValue;
        }
        return this.value ?? this.defaultValue;
    }
    setValue(value) {
        let localSettings = JSON.parse(localStorage.getItem(LocalStorageKeys.settings));
        StaticSettings.options[this.key].value = value;
        if (localSettings === null) {
            const settings = {
                [this.key]: value,
            };
            localStorage.setItem(LocalStorageKeys.settings, JSON.stringify(settings));
            return;
        }
        if (this.value === true && this.onValueSet) {
            this.onValueSet();
        }
        localSettings[this.key] = { value };
        localStorage.setItem(LocalStorageKeys.settings, JSON.stringify(localSettings));
    }
}
class StaticSettings {
    static #localStorageSettings = LocalStorageKeys.settings;
    static options = {};
    static settingsInstance;
    static version = GM_info.script.version;
    static initialize() {
        const settingsInLocalStorage = JSON.parse(localStorage.getItem(this.#localStorageSettings)) ?? {};
        for (const [key, val] of Object.entries(defaultSettings)) {
            const value = val;
            value.key = key;
            StaticSettings.options[key] = new staticSettings_Option(value);
        }
        for (const [key, val] of Object.entries(settingsInLocalStorage)) {
            const value = val;
            if (!this.options[key]) {
                continue;
            }
            StaticSettings.options[key].value = value.value;
        }
        this.settingsInstance = new Settings();
    }
}

;// CONCATENATED MODULE: ./src/utils/aceEditorInitializer.ts


class AceEditorInitializer {
    static createEditor(id, value) {
        const container = DOM_DOM.create("div", "ace-editor-container");
        const editor = DOM_DOM.create("div", `#${id} ace-editor`);
        // const search = this.#addSearchComponent(id);
        container.append(editor);
        setTimeout(() => {
            this.#initializeEditor(id, value);
        }, 150);
        return container;
    }
    static #initializeEditor(id, value) {
        const siteTheme = localStorage.getItem("site-theme");
        let theme = "monokai";
        switch (siteTheme) {
            case "dark":
            case "system":
                theme = "monokai";
                break;
            case "contrast":
            default:
                theme = "dawn";
        }
        // @ts-ignore
        const editor = ace.edit(`void-${id}`, {
            mode: "ace/mode/css",
            theme: `ace/theme/${theme}`,
            value: value
        });
        editor.setKeyboardHandler("ace/keyboard/vscode");
        editor.setOptions({
            useWorker: false,
            enableBasicAutocompletion: true,
            highlightSelectedWord: true,
            copyWithEmptySelection: true,
            scrollPastEnd: true,
            showPrintMargin: false,
            wrap: "free"
        });
    }
    static #addSearchComponent(id) {
        const container = DOM_DOM.create("div", "ace-search-container");
        setTimeout(() => {
            // @ts-ignore
            const editor = ace.edit(`void-${id}`);
            const searchInput = InputField("", (event => {
                const searchword = event.target.value;
                editor.find(searchword);
            }));
            container.append(searchInput);
        }, 160);
        return container;
    }
    static addChangeHandler(id, callback) {
        setTimeout(() => {
            // @ts-ignore
            const editor = ace.edit(`void-${id}`);
            editor.on("change", () => {
                callback(editor.getValue());
            });
        }, 150);
    }
}

;// CONCATENATED MODULE: ./src/handlers/globalCSS.ts






class GlobalCSS {
    static styleHandler;
    static styleId = "global-css";
    static css;
    static initialize() {
        this.styleHandler = new StyleHandler(StaticSettings.settingsInstance);
        this.css = localStorage.getItem(LocalStorageKeys.globalCSS) ?? "";
        this.createCss();
    }
    static createCss() {
        if (!StaticSettings.options.globalCssEnabled.getValue() || window.location.pathname.startsWith("/settings/developer")) {
            this.styleHandler.clearStyles(this.styleId);
            return;
        }
        this.styleHandler.createStyleLink(this.css, this.styleId);
    }
    static updateCss(css) {
        this.css = css;
        this.createCss();
        localStorage.setItem(LocalStorageKeys.globalCSS, css);
    }
    static renderEditor() {
        const cssName = "global";
        const container = DOM_DOM.createDiv("css-editor");
        const label = DOM_DOM.create("h3", null, `Custom ${cssName} CSS`);
        container.append(label);
        const editor = AceEditorInitializer.createEditor(`custom-css-editor-${cssName}`, this.css);
        container.append(editor);
        AceEditorInitializer.addChangeHandler(`custom-css-editor-${cssName}`, (value) => {
            this.updateCss(value);
        });
        if (cssName === "global") {
            const notice = DOM_DOM.create("div");
            notice.innerText =
                "Please note that Custom CSS is disabled in the settings. \nIn the event that you accidentally disable rendering of critical parts of AniList, navigate to the settings by URL";
            notice.style.fontSize = "11px";
            container.append(notice);
        }
        const prettifyButton = Button("Prettify", () => {
            // @ts-ignore
            const beautify = ace.require("ace/ext/beautify");
            // @ts-ignore
            const editor = ace.edit(`void-custom-css-editor-${cssName}`);
            const value = editor.getValue()
                .replace(/(\n\s*\n)+/g, '\n\n')
                .replace(/\{[^\}]*\}/g, (block) => {
                // Remove all empty lines within the block
                return block.replace(/\n\s*\n/g, '\n');
            });
            editor.setValue(value);
            beautify.beautify(editor.session);
        });
        container.append(prettifyButton);
        return container;
    }
}

;// CONCATENATED MODULE: ./src/utils/staticTooltip.ts

const distance = 5;
class ClassWithTooltip {
    static tooltip;
    static initializeTooltip() {
        this.tooltip = DOM_DOM.create("div", "static-tooltip");
        document.body.append(this.tooltip);
    }
    static showTooltip(trigger, content, isInteractable = false) {
        this.tooltip.replaceChildren(content);
        const triggerRect = trigger instanceof DOMRect ? trigger : trigger.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        this.tooltip.style.top = `${triggerRect.top + window.scrollY - tooltipRect.height - distance}px`;
        this.tooltip.style.left = `${triggerRect.left + window.scrollX + (triggerRect.width / 2) - (tooltipRect.width / 2)}px`;
        this.tooltip.classList.add("void-visible");
        if (isInteractable) {
            this.tooltip.classList.add("void-interactable");
        }
        else {
            this.tooltip.classList.remove("void-interactable");
        }
    }
    static replaceTooltipContent(content, trigger) {
        this.tooltip.replaceChildren(content);
        const triggerRect = trigger instanceof DOMRect ? trigger : trigger.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        this.tooltip.style.top = `${triggerRect.top + window.scrollY - tooltipRect.height - distance}px`;
        this.tooltip.style.left = `${triggerRect.left + window.scrollX + (triggerRect.width / 2) - (tooltipRect.width / 2)}px`;
    }
    static hideTooltip() {
        this.tooltip.classList.remove("void-visible");
    }
}
class StaticTooltip extends ClassWithTooltip {
    static isVisible = false;
    static initialize() {
        this.initializeTooltip();
        this.hide = this.hide.bind(this);
        this.tooltip.addEventListener("mouseover", () => {
            this.isVisible = true;
        });
        this.tooltip.addEventListener("mouseout", () => {
            this.hide();
        });
    }
    static register(trigger, content, isInteractable = false) {
        trigger.addEventListener("mouseover", () => {
            this.show(trigger, content, isInteractable);
        });
        trigger.addEventListener("mouseout", () => {
            this.hide();
        });
    }
    static show(trigger, content, isInteractable = false) {
        this.isVisible = true;
        this.showTooltip(trigger, content, isInteractable);
    }
    static hide() {
        this.isVisible = false;
        setTimeout(() => {
            if (!this.isVisible) {
                this.hideTooltip();
                this.tooltip.removeEventListener("mouseout", this.hide);
            }
        }, this.tooltip.classList.contains("void-interactable") ? 300 : 0);
    }
}

;// CONCATENATED MODULE: ./src/utils/collapsedReplies.ts
class CollapsedComments {
    static localStorageKey = "void-verified-collapsed-comments";
    static isCollapsed(replyId) {
        const replies = JSON.parse(localStorage.getItem(this.localStorageKey)) ?? [];
        const reply = replies.find(x => x.id === replyId);
        return reply?.isCollapsed;
    }
    static setIsCollapsed(replyId, isCollapsed) {
        const replies = JSON.parse(localStorage.getItem(this.localStorageKey)) ?? [];
        const reply = replies.find(x => x.id === replyId);
        if (!reply) {
            replies.push({
                id: replyId,
                isCollapsed: isCollapsed
            });
        }
        else {
            reply.isCollapsed = isCollapsed;
        }
        localStorage.setItem(this.localStorageKey, JSON.stringify(replies));
    }
}

;// CONCATENATED MODULE: ./src/utils/debouncer.ts
class Debouncer {
    timer = null;
    debounce(func, delay, ...args) {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            func(...args);
            this.timer = null;
        }, delay);
    }
}

;// CONCATENATED MODULE: ./src/handlers/quoteHandler.ts






const ScrollIntoViewOptions = {
    behavior: "smooth",
    block: "start",
};
class QuoteHandler extends ClassWithTooltip {
    static debouncer = new Debouncer();
    static addSelectionListener() {
        this.initializeTooltip();
        this.handleQuoteSelection = this.handleQuoteSelection.bind(this);
        document.addEventListener("selectionchange", () => {
            if (!StaticSettings.options.replyToEnabled.getValue()) {
                return;
            }
            this.handleSelection();
        });
    }
    static handleSelection() {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            this.hideTooltip();
            if (range.collapsed) {
                return;
            }
            this.debouncer.debounce(this.handleQuoteSelection, 100, selection, range);
        }
    }
    static handleQuoteSelection(selection, range) {
        const markdown = (range.commonAncestorContainer.nodeType === 1
            ? range.commonAncestorContainer
            : range.commonAncestorContainer.parentElement).closest(".markdown");
        if (!markdown || (!markdown.closest(".reply") && !markdown.closest(".activity-entry"))) {
            return;
        }
        const rect = range.getBoundingClientRect();
        const quoteSelectionButton = DOM_DOM.create("div", "has-icon icon-mr", [ArrowTurnLeftIcon(), "Reply To"]);
        quoteSelectionButton.addEventListener("click", async (event) => {
            event.stopPropagation();
            const idElement = markdown.closest(".reply") ?? markdown.closest(".activity-entry");
            const activityElement = markdown.closest(".activity-entry");
            const id = DomDataHandler.getIdFromElement(idElement);
            const activityId = DomDataHandler.getIdFromElement(activityElement);
            const ref = idElement === activityElement ? id : `${activityId}/${id}`;
            await navigator.clipboard.writeText(`<blockquote href="${ref}">${selection.toString().trim()}</blockquote>`);
            this.replaceTooltipContent(DOM_DOM.create("div", "has-icon icon-mr", [CheckIcon(), "Copied to Clipboard"]), range.getBoundingClientRect());
            setTimeout(() => {
                this.hideTooltip();
            }, 800);
        });
        this.showTooltip(rect, quoteSelectionButton, true);
    }
    static addQuoteClickHandlers() {
        if (!StaticSettings.options.replyToEnabled.getValue()) {
            return;
        }
        const blockquotes = document.querySelectorAll("blockquote[href]:not(.void-quote)");
        for (const blockquote of blockquotes) {
            if (!blockquote.closest(".reply") && !blockquote.closest(".activity-entry")) {
                continue;
            }
            let activityId, replyId;
            const ref = blockquote.getAttribute("href");
            const isReply = ref.includes("/");
            if (isReply) {
                [activityId, replyId] = ref.split("/");
            }
            else {
                activityId = ref;
            }
            if (!Number.isFinite(Number(activityId))) {
                continue;
            }
            if (isReply && (!Number.isFinite(Number(replyId)) || replyId === "")) {
                continue;
            }
            blockquote.classList.add("void-quote");
            const containingActivity = blockquote.closest(".activity-entry");
            const containingActivityId = DomDataHandler.getIdFromElement(containingActivity);
            if (Number(activityId) === Number(containingActivityId)) {
                blockquote.addEventListener("click", () => {
                    const navHeight = document.querySelector(".nav").getBoundingClientRect().height;
                    if (isReply) {
                        const quotedReply = containingActivity.querySelector(`.reply[void-reply-id="${replyId}"]`);
                        quotedReply.style.scrollMarginTop = (navHeight + 10) + "px";
                        quotedReply.scrollIntoView(ScrollIntoViewOptions);
                    }
                    else {
                        if (window.location.pathname.startsWith("/activity/")) {
                            window.scrollTo({
                                behavior: "smooth",
                                top: 0
                            });
                        }
                        else {
                            containingActivity.style.scrollMarginTop = (navHeight + 10) + "px";
                            containingActivity.scrollIntoView(ScrollIntoViewOptions);
                        }
                    }
                });
            }
            else {
                if (isReply) {
                    StaticTooltip.register(blockquote, DOM_DOM.createAnchor(`/activity/${activityId}?void-reply-id=${replyId}`, "has-icon icon-mr", [
                        LinkIcon(),
                        "Direct Link"
                    ]), true);
                }
                else {
                    StaticTooltip.register(blockquote, DOM_DOM.createAnchor(`/activity/${activityId}`, "has-icon icon-mr", [
                        LinkIcon(),
                        "Direct Link"
                    ]), true);
                }
            }
        }
    }
    static addDirectLinksToReplies() {
        if (!StaticSettings.options.replyDirectLinksEnabled.getValue()) {
            return;
        }
        const replies = document.querySelectorAll(".activity-entry .reply[void-reply-id]:not(:has(.void-reply-direct-link)):not(.preview)");
        for (const reply of replies) {
            const replyId = DomDataHandler.getIdFromElement(reply);
            const activity = reply.closest(".activity-entry");
            const activityId = DomDataHandler.getIdFromElement(activity);
            const anchor = DOM_DOM.createAnchor(`/activity/${activityId}?void-reply-id=${replyId}`, "has-icon reply-direct-link", LinkIcon());
            const actions = reply.querySelector(".actions");
            actions.insertBefore(anchor, actions.querySelector(".action.likes"));
        }
    }
}

;// CONCATENATED MODULE: ./src/handlers/domDataHandler.ts



class DomDataHandler {
    static scrolledReplyId;
    static addReplyIdsToDom() {
        const replies = document.querySelectorAll(".reply:not(.reply[void-reply-id])");
        for (const reply of replies) {
            const id = Vue.getProps(reply)?.id;
            reply.setAttribute("void-reply-id", id);
        }
    }
    static addActivityIdsToDom() {
        const activities = document.querySelectorAll(".activity-entry:not(.activity-entry[void-activity-id])");
        for (const activity of activities) {
            const id = Vue.getProps(activity)?.id;
            activity.setAttribute("void-activity-id", id);
        }
    }
    static getIdFromElement(element) {
        if (!element) {
            return undefined;
        }
        return Number(element.getAttribute("void-reply-id") ?? element.getAttribute("void-activity-id") ?? Vue.getProps(element)?.id);
    }
    static scrollToReply() {
        if (!StaticSettings.options.scrollToReplyEnabled.getValue()) {
            return;
        }
        const urlSearchParams = new URLSearchParams(window.location.search);
        const replyId = Number(urlSearchParams.get("void-reply-id"));
        if (!replyId) {
            this.scrolledReplyId = null;
            return;
        }
        if (this.scrolledReplyId === replyId) {
            return;
        }
        this.scrolledReplyId = replyId;
        let scrolled = false;
        let intervalId = setInterval(() => {
            if (scrolled) {
                clearInterval(intervalId);
                return;
            }
            const reply = document.querySelector(`.reply[void-reply-id="${replyId}"]`);
            if (!reply) {
                return;
            }
            reply.scrollIntoView(ScrollIntoViewOptions);
            scrolled = true;
        }, 25);
    }
}

;// CONCATENATED MODULE: ./src/handlers/activityHandler.ts












class ActivityHandler {
    static moveAndDisplaySubscribeButton() {
        if (!StaticSettings.options.moveSubscribeButtons.getValue()) {
            return;
        }
        const subscribeButtons = document.querySelectorAll("span[label='Unsubscribe'], span[label='Subscribe']");
        for (const subscribeButton of subscribeButtons) {
            if (subscribeButton.parentNode.classList.contains("actions")) {
                continue;
            }
            const container = subscribeButton.parentNode.parentNode;
            const actions = container.querySelector(".actions");
            actions.append(subscribeButton);
        }
    }
    static addSelfMessageButton() {
        if (!StaticSettings.options.selfMessageEnabled.getValue()) {
            return;
        }
        if (!window.location.pathname.startsWith(`/user/${AnilistAuth.name}`)) {
            return;
        }
        const activityEditActions = document.querySelector(".activity-feed-wrap > .activity-edit > .actions");
        if (!activityEditActions ||
            activityEditActions?.querySelector(".void-self-message")) {
            return;
        }
        activityEditActions.append(Button("Message Self", () => {
            this.#handleSelfMessage();
        }, "self-message"));
    }
    static addCollapseReplyButtons() {
        if (!StaticSettings.options.collapsibleReplies.getValue()) {
            return;
        }
        const replies = document.querySelectorAll(".activity-replies .reply:not([collapsed]):not(.preview)");
        for (const reply of replies) {
            this.#addCollapseReplyButton(reply);
        }
    }
    static #addCollapseReplyButton(reply) {
        const button = DOM_DOM.create("div", "reply-collapse");
        const replyId = DomDataHandler.getIdFromElement(reply);
        button.addEventListener("click", () => {
            const isCollapsed = reply.getAttribute("collapsed") === "true";
            reply.setAttribute("collapsed", !isCollapsed);
            if (StaticSettings.options.rememberCollapsedReplies.getValue()) {
                CollapsedComments.setIsCollapsed(replyId, !isCollapsed);
            }
        });
        reply.prepend(button);
        const replyContent = DOM_DOM.create("div", "reply-content");
        replyContent.append(reply.querySelector(".header"), reply.querySelector(".reply-markdown"));
        reply.append(replyContent);
        let isCollapsed = false;
        if (StaticSettings.options.autoCollapseLiked.getValue()) {
            isCollapsed = reply.querySelector(".action.likes .button").classList.contains("liked");
        }
        if (!isCollapsed && StaticSettings.options.autoCollapseSelf.getValue()) {
            isCollapsed = !reply.classList.contains("preview") && reply.querySelector("a.name").innerText.trim() === AnilistAuth.name || isCollapsed;
        }
        if (StaticSettings.options.rememberCollapsedReplies.getValue()) {
            const isManuallyCollapsed = CollapsedComments.isCollapsed(replyId);
            isCollapsed = isManuallyCollapsed !== undefined ? isManuallyCollapsed : isCollapsed;
        }
        reply.setAttribute("collapsed", isCollapsed);
    }
    static async #handleSelfMessage() {
        const message = document.querySelector(".activity-feed-wrap > .activity-edit textarea").value;
        try {
            Toaster.debug("Self-publishing a message.");
            const response = await AnilistAPI.selfMessage(message);
            Toaster.success("Message self-published.");
            if (Vue.router) {
                Vue.router.push(`/activity/${response.id}`);
            }
            else {
                window.location.replace(`https://anilist.co/activity/${response.id}`);
            }
        }
        catch (error) {
            Toaster.error("There was an error self-publishing a message.", error);
        }
    }
    static removeBlankFromAnilistLinks() {
        if (!StaticSettings.options.removeAnilistBlanks.getValue()) {
            return;
        }
        const anilistLinks = document.querySelectorAll("a:not(.void-link)[href^='https://anilist.co'][target='_blank']");
        for (const link of anilistLinks) {
            link.removeAttribute("target");
            link.addEventListener("click", (event) => {
                const target = event.target;
                event.preventDefault();
                const path = target.pathname + target.search;
                Vue.router.push(path);
            });
        }
    }
    static handleImageLinkPreview() {
        if (!StaticSettings.options.imagePreviewEnabled.getValue()) {
            return;
        }
        let imageContainer = document.querySelector(".void-image-preview-container");
        if (!imageContainer) {
            imageContainer = DOM_DOM.createDiv("image-preview-container");
            document.body.append(imageContainer);
        }
        const imageLinks = document.querySelectorAll(ImageFormats.map(format => `.markdown a:not([void-link-preview])[href$='.${format}' i]:not(:has(img))`).join());
        for (const link of imageLinks) {
            link.setAttribute("void-link-preview", "true");
            link.addEventListener("mouseover", (event) => { this.#handleLinkHover(event); });
            link.addEventListener("mouseout", () => {
                imageContainer.style.display = "none";
            });
        }
    }
    static #handleLinkHover(event) {
        let imageContainer = document.querySelector(".void-image-preview-container");
        imageContainer.replaceChildren();
        const href = event.target.getAttribute("href");
        const image = DOM_DOM.create("img");
        image.setAttribute("src", href);
        image.setAttribute("loading", "lazy");
        imageContainer.append(image);
        imageContainer.style.display = "block";
        const position = event.clientY < window.innerHeight / 2 ? `${event.clientY + 20}px` : `${event.clientY - image.clientHeight - 20}px`;
        imageContainer.style.top = position;
    }
    static addTooltipsToTimestamps() {
        if (!StaticSettings.options.activityTimestampTooltipsEnabled.getValue()) {
            return;
        }
        const timestamps = document.querySelectorAll(".activity-entry:not(.void-activity-entry) time[title]");
        for (const timestamp of timestamps) {
            const dateString = timestamp.getAttribute("datetime");
            if (!dateString) {
                continue;
            }
            const time = Time.toLocaleString(new Date(dateString));
            StaticTooltip.register(timestamp, time);
            timestamp.removeAttribute("title");
        }
    }
}

;// CONCATENATED MODULE: ./src/utils/fuzzyMatch.ts
class FuzzyMatch {
    static match(input, target, threshold = 0.5) {
        const lowerInput = input.toLowerCase();
        const lowerTarget = target.toLowerCase();
        if (lowerTarget.includes(lowerInput)) {
            return true;
        }
        return this.fuzzyStringMatch(lowerInput, lowerTarget, threshold);
    }
    static fuzzyStringMatch(input, target, threshold = 0.3) {
        const distance = this.levenshteinDistance(input, target);
        const maxLength = Math.max(input.length, target.length);
        const similarityScore = 1 - distance / maxLength;
        return similarityScore >= threshold;
    }
    static levenshteinDistance(str1, str2) {
        const len1 = str1.length;
        const len2 = str2.length;
        const matrix = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0));
        for (let i = 0; i <= len1; i++) {
            matrix[i][0] = i;
        }
        for (let j = 0; j <= len2; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
            }
        }
        return matrix[len1][len2];
    }
}

;// CONCATENATED MODULE: ./src/handlers/quickAccessHandler.js








class QuickAccess {
	settings;
	#lastFetchedLocalStorage = "void-verified-last-fetched";
	#lastFetched;
	#queryInProgress = false;

	#apiQueryTimeoutInMinutes = 15;
	#apiQueryTimeout = this.#apiQueryTimeoutInMinutes * 60 * 1000;
	constructor(settings) {
		this.settings = settings;
		const fetched = localStorage.getItem(this.#lastFetchedLocalStorage);
		if (fetched) {
			this.#lastFetched = new Date(fetched);
		}
	}

	async renderQuickAccess() {
		if (this.#queryInProgress) {
			return;
		}

		const queried = await this.#queryUsers();

		if (!queried && this.#quickAccessRendered()) {
			this.#updateTimer();
			return;
		}

		if (
			!this.settings.options.quickAccessEnabled.getValue() &&
			!this.settings.verifiedUsers.some((user) => user.quickAccessEnabled)
		) {
			return;
		}

		const quickAccessContainer = DOM_DOM.getOrCreate(
			"div",
			"#quick-access quick-access",
		);

		const container = DOM_DOM.create("div", "quick-access-users-wrap");

		const sectionHeader = this.#renderHeader();
		const users = QuickAccess.renderUsers();

		container.append(sectionHeader, users);

		this.#insertIntoDOM(quickAccessContainer, container);
	}

	#renderHeader() {
		const sectionHeader = document.createElement("div");
		sectionHeader.setAttribute("class", "section-header");
		const title = document.createElement("h2");
		title.append("Users");
		title.setAttribute(
			"title",
			`Last updated at ${this.#lastFetched.toLocaleTimeString()}`,
		);
		sectionHeader.append(title);

		const timer = DOM_DOM.create("span", "quick-access-timer", "");

		const refreshButton = IconButton(RefreshIcon(), () => {
			this.#queryUsers(true);
		});

		sectionHeader.append(DOM_DOM.create("div", null, [timer, refreshButton]));

		return sectionHeader;
	}

	static renderUsers(usernameFilter) {
		const quickAccessBody = document.createElement("div");
		quickAccessBody.setAttribute("class", "void-quick-access-wrap");

		for (const user of this.#getQuickAccessUsers()) {
			if (usernameFilter?.length > 0 && !FuzzyMatch.match(usernameFilter, user.username)) {
				continue;
			}
			quickAccessBody.append(this.#createQuickAccessLink(user));
		}

		return quickAccessBody;
	}

	#updateTimer() {
		if (!this.settings.options.quickAccessTimer.getValue()) {
			return;
		}
		const timer = DOM_DOM.get("quick-access-timer");
		const nextQuery = new Date(
			this.#lastFetched.getTime() + this.#apiQueryTimeout,
		);
		const timeLeftInSeconds = Math.floor((nextQuery - new Date()) / 1000);
		const timeLeftInMinutes = timeLeftInSeconds / 60;

		if (timeLeftInMinutes > 1) {
			timer.replaceChildren(`${Math.floor(timeLeftInSeconds / 60)}m`);
			return;
		}

		timer.replaceChildren(`${timeLeftInSeconds}s`);
	}

	async #queryUsers(ignoreLastFetched = false) {
		const currentTime = new Date();

		if (
			!this.#lastFetched ||
			currentTime - this.#lastFetched > this.#apiQueryTimeout ||
			ignoreLastFetched
		) {
			try {
				Toaster.debug("Querying Quick Access users.");
				this.#queryInProgress = true;
				await AnilistAPI.queryVerifiedUsers();
				Toaster.success("Quick Access users updated.");
			} catch (error) {
				Toaster.error("Querying Quick Access failed.", error);
			} finally {
				this.#lastFetched = new Date();
				localStorage.setItem(
					this.#lastFetchedLocalStorage,
					this.#lastFetched,
				);
				this.#queryInProgress = false;
				return true;
			}
		} else {
			return false;
		}
	}

	clearBadge() {
		const username =
			window.location.pathname.match(/^\/user\/([^/]*)\/?/)[1];
		this.settings.updateUserOption(
			username,
			"quickAccessBadgeDisplay",
			false,
		);
	}

	static #createQuickAccessLink(user) {
		const container = DOM_DOM.create("a", "quick-access-item");
		container.setAttribute(
			"href",
			`/user/${user.username}/`,
		);

		const image = document.createElement("div");
		image.style.backgroundImage = `url(${user.avatar})`;
		image.setAttribute("class", "void-quick-access-pfp");
		container.append(image);

		const username = document.createElement("div");
		username.append(user.username);
		username.setAttribute("class", "void-quick-access-username");

		if (
			(StaticSettings.options.quickAccessBadge.getValue() ||
				user.quickAccessBadge) &&
			user.quickAccessBadgeDisplay
		) {
			container.classList.add("void-quick-access-badge");
		}

		container.append(username);
		return container;
	}

	#quickAccessRendered() {
		const quickAccess = document.querySelector(".home .void-quick-access-wrap");
		return quickAccess !== null;
	}

	static #getQuickAccessUsers() {
		if (StaticSettings.options.quickAccessEnabled.getValue()) {
			return StaticSettings.settingsInstance.verifiedUsers;
		}

		return StaticSettings.settingsInstance.verifiedUsers.filter(
			(user) => user.quickAccessEnabled,
		);
	}

	#insertIntoDOM(quickAccessContainer, container) {
		if (
			quickAccessContainer.querySelector(".void-quick-access-users-wrap")
		) {
			const oldUsers = DOM_DOM.get("quick-access-users-wrap");
			quickAccessContainer.replaceChild(container, oldUsers);
		} else {
			quickAccessContainer.append(container);
		}

		if (DOM_DOM.get("#quick-access")) {
			return;
		}
		const section = document.querySelector(
			".container > .home > div:nth-child(2)",
		);
		section.insertBefore(quickAccessContainer, section.firstChild);
	}
}

;// CONCATENATED MODULE: ./src/utils/markdown.ts

class Markdown {
    static parse(markdown) {
        let html = markdown;
        // Headers
        html = html.replace(/^#####(.*)$/gm, '<h5>$1</h5>');
        html = html.replace(/^####(.*)$/gm, '<h4>$1</h4>');
        html = html.replace(/^###(.*)$/gm, '<h3>$1</h3>');
        html = html.replace(/^##(.*)$/gm, '<h2>$1</h2>');
        html = html.replace(/^#(.*)$/gm, '<h1>$1</h1>');
        // Spoilers
        html = html.replace(/~!(.*?)!~/gs, '<p><span class="markdown-spoiler"><i class="hide-spoiler el-icon-circle-close"></i><span>$1</span></span></p>');
        // Blockquotes
        html = html.replace(/(^>.*(?:\n(?!\s*$).*)*)/gm, match => {
            return `<blockquote>${match.replace(/^>\s?/gm, '').trim()}</blockquote>`;
        });
        // Convert unordered lists (- or *) while allowing <br> between items
        html = html.replace(/(?:^|\n)([*-]) (.+(?:\n?(?:<br>\n?)?[*-] .+)*)/gm, (match, bullet, items) => {
            const listItems = items
                .split(/\n?(?:<br>\n?)?[*-] /g) // Split by newline or <br> followed by another list item
                .map(item => `<li>${item.trim()}</li>`)
                .join('');
            return `<ul>${listItems}</ul>`;
        });
        // Convert ordered lists (1. 2. ...) while allowing <br> between items
        html = html.replace(/(?:^|\n)(\d+)\. (.+(?:\n?(?:<br>\n?)?\d+\. .+)*)/gm, (match, number, items) => {
            const listItems = items
                .split(/\n?(?:<br>\n?)?\d+\. /g) // Split by newline or <br> followed by another numbered item
                .map(item => `<li>${item.trim()}</li>`)
                .join('');
            return `<ol>${listItems}</ol>`;
        });
        // Wrap consecutive text blocks in <p> tags (treating double newlines as paragraph breaks)
        html = html.replace(/\n{2,}/g, '</p><p>');
        // Line Breaks
        // html = html.replace(/(?<!<br>)\n(?!<br>)/g, '<br>');
        html = html.replace(/\n/g, '<br>');
        // Images
        html = html.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img alt="$1" src="$2" />');
        html = html.replace(/img(\d+%?)\(([^)]+)\)/g, function (_, width, url) {
            const unit = width.endsWith("%") ? "%" : "px";
            return `<img src="${url}" width="${width}" />`;
        });
        html = html.replace(/img\(([^)]+)\)/g, '<img src="$1" />');
        // Links
        html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
        // Bold & Italic
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
        // Center
        html = html.replace(/~~~(.*?)~~~/gs, '<center>$1</center>');
        // Strikethrough
        html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');
        // Inline Code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        // Code Blocks
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        // YouTube Embeds
        html = html.replace(/youtube\(([^)]+)\)/g, (_, src) => {
            const id = this.getYoutubeVideoId(src);
            if (!id) {
                return "";
            }
            return `<span class="youtube" id="${id}" style="background-image: url(&quot;https://i.ytimg.com/vi/${id}/hqdefault.jpg&quot;); background-position: center center; background-repeat: no-repeat; background-size: cover;"><span class="play"></span></span>`;
        });
        // WebM Embeds
        html = html.replace(/webm\(([^)]+)\)/g, '<video autoplay loop muted controls><source src="$1" type="video/webm"></video>');
        // Horizontal Rules
        html = html.replace(/---/g, '<hr>');
        // tags: @voidnyan -> /user/voidnyan/
        html = html.replace(/(^|\s)@([a-zA-Z0-9_]+)(?![^<]*>)/g, '$1<a href="/user/$2/">@$2</a>');
        // Add <p> tags at the beginning and end of the entire content
        html = `<p>${html.trim()}</p>`;
        // @ts-ignore
        html = DOMPurify.sanitize(html);
        return html;
    }
    static applyFunctions(markdownElement) {
        for (const spoiler of markdownElement.querySelectorAll(".markdown-spoiler")) {
            spoiler.addEventListener("click", (e) => {
                e.stopPropagation();
                spoiler.classList.add("spoiler-visible");
            });
            spoiler.querySelector("i").addEventListener("click", (e) => {
                e.stopPropagation();
                spoiler.classList.remove("spoiler-visible");
            });
        }
        for (const youtube of markdownElement.querySelectorAll(".youtube")) {
            youtube.addEventListener("click", () => {
                const id = youtube.id;
                const iframe = DOM_DOM.create("iframe");
                iframe.setAttribute("frameborder", "0");
                iframe.setAttribute("src", `https://www.youtube.com/embed/${id}?autoplay=1&autohide=1`);
                youtube.replaceChildren(iframe);
            });
        }
        for (const anchor of markdownElement.querySelectorAll("a")) {
            anchor.setAttribute("target", "_blank");
        }
    }
    static getYoutubeVideoId(url) {
        const pattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S*\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(pattern);
        return match ? match[1] : null;
    }
}

;// CONCATENATED MODULE: ./src/handlers/layoutDesigner.ts











class Layout {
    avatar;
    banner;
    bio;
    color;
    donatorBadge;
    name;
    constructor(layout) {
        this.avatar = layout?.avatar ?? "";
        this.banner = layout?.banner ?? "";
        this.bio = layout?.bio ?? "";
        this.color = layout?.color ?? "";
        this.donatorBadge = layout?.donatorBadge ?? "";
        this.name = layout?.name ?? "New Layout";
    }
}
class LayoutDesigner {
    static layoutsInLocalStorage = LocalStorageKeys.layouts;
    static originalHtml;
    static broadcastChannel;
    static donatorTier = 0;
    static anilistSettings;
    static layout;
    static layouts = {
        selectedLayout: 0,
        preview: false,
        disableCss: false,
        layoutsList: [new Layout()],
    };
    static settingContainer = DOM_DOM.createDiv("layout-designer-container");
    static initialize() {
        this.broadcastChannel = new BroadcastChannel("void-layouts");
        this.broadcastChannel.addEventListener("message", (event) => this.handleBroadcastMessage(event));
        const layouts = JSON.parse(localStorage.getItem(this.layoutsInLocalStorage));
        if (layouts) {
            this.layouts = layouts;
            this.layouts.layoutsList = layouts.layoutsList.map((layout) => new Layout(layout));
        }
        this.anilistSettings = JSON.parse(localStorage.getItem("auth"));
        this.donatorTier = this.anilistSettings?.donatorTier;
        this.layout = this.getSelectedLayout();
    }
    static renderLayoutPreview() {
        if (!StaticSettings.options.layoutDesignerEnabled.getValue()) {
            return;
        }
        if (!window.location.pathname.startsWith("/user/")) {
            return;
        }
        const username = window.location.pathname.match(/^\/user\/([^/]*)\/?/)[1];
        if (username !== AnilistAuth.name || !this.layouts.preview) {
            return;
        }
        this.handleAvatar(this.layout.avatar);
        this.handleBanner(this.layout.banner);
        this.handleColor(this.layout.color);
        this.handleDonatorBadge(this.layout.donatorBadge);
        this.handleCss();
        this.handleAbout(Markdown.parse(this.layout.bio ?? ""));
    }
    static handleBroadcastMessage(event) {
        switch (event.data.type) {
            case "preview":
                this.handlePreviewToggleMessage(event.data.preview);
                break;
            case "layout":
                this.handleLayoutMessage(event.data.layout);
                break;
            case "css":
                this.handleCssMessage(event.data.disableCss);
                break;
        }
    }
    static handlePreviewToggleMessage(preview) {
        this.layouts.preview = preview;
        if (preview ||
            !window.location.pathname.startsWith(`/user/${AnilistAuth.name}/`)) {
            return;
        }
        this.handleAvatar(this.anilistSettings?.avatar?.large);
        this.handleBanner(this.anilistSettings?.bannerImage);
        this.handleColor(this.anilistSettings.options.profileColor);
        this.handleDonatorBadge(this.anilistSettings.donatorBadge);
        this.layouts.disableCss = false;
        this.handleCss();
        this.handleAbout(this.originalHtml);
    }
    static handleLayoutMessage(layout) {
        this.layout = layout;
    }
    static handleCssMessage(disableCss) {
        this.layouts.disableCss = disableCss;
    }
    static handleAvatar(avatar) {
        if (avatar === "") {
            return;
        }
        const avatarElement = document.querySelector("img.avatar");
        if (avatarElement.src !== avatar) {
            avatarElement.src = avatar;
        }
        const avatarLinks = document.querySelectorAll(`a.avatar[href*="${AnilistAuth.name}"]`);
        for (const avatarLink of avatarLinks) {
            if (avatarLink.getAttribute("style") !== `background-image: url(${avatar})`) {
                avatarLink.setAttribute("style", `background-image: url(${avatar})`);
            }
        }
    }
    static handleBanner(banner) {
        if (banner === "") {
            return;
        }
        const bannerElement = document.querySelector(".banner");
        if (bannerElement.getAttribute("style") !== `background-image: url(${banner})`) {
            bannerElement.setAttribute("style", `background-image: url(${banner})`);
        }
    }
    static handleColor(value) {
        let color;
        try {
            color = ColorFunctions.handleAnilistColor(value);
        }
        catch (err) {
            return;
        }
        const pageContent = document.querySelector(".page-content > .user");
        pageContent.style.setProperty("--color-blue", color);
        pageContent.style.setProperty("--color-blue-dim", color);
    }
    static handleDonatorBadge(donatorText) {
        if (this.donatorTier < 3 || donatorText === "") {
            return;
        }
        const donatorBadge = document.querySelector(".donator-badge");
        if (donatorBadge.innerText !== donatorText) {
            donatorBadge.innerText = donatorText;
        }
    }
    static handleCss() {
        if (this.layouts.disableCss) {
            DOM_DOM.get("#verified-user-css-styles")?.setAttribute("disabled", "true");
        }
        else {
            DOM_DOM.get("#verified-user-css-styles")?.removeAttribute("disabled");
        }
    }
    static handleAbout(about) {
        const aboutContainer = document.querySelector(".about .markdown");
        if (!aboutContainer) {
            return;
        }
        if (!this.originalHtml) {
            this.originalHtml = aboutContainer.innerHTML;
        }
        aboutContainer.innerHTML = about !== "" ? about : this.originalHtml;
    }
    static createSettings() {
        this.renderSettings();
        return this.settingContainer;
    }
    static renderSettings() {
        this.settingContainer.replaceChildren();
        const header = DOM_DOM.create("h3", null, "Layout Designer");
        const layoutSelector = this.createLayoutSelector();
        const layoutInfoSection = this.layoutInfoSection();
        const imageSection = DOM_DOM.create("div");
        imageSection.append(this.createImageField("avatar", this.layout.avatar));
        imageSection.append(this.createImageField("banner", this.layout.banner));
        const imageUploadNote = Note("You can preview avatar & banner by providing a link to an image. If you have configured a image host, you can upload images by pasting them to the fields. ");
        imageUploadNote.append(DOM_DOM.create("br"), "Unfortunately AniList API does not support third parties uploading new avatars or banners. You have to upload them separately.");
        const colorSelection = this.createColorSelection();
        const previewButton = new ButtonComponent(this.layouts.preview ? "Disable Preview" : "Enable Preview", () => {
            this.togglePreview();
            previewButton.setText(this.layouts.preview ? "Disable Preview" : "Enable Preview");
        });
        const cssButton = new ButtonComponent(this.layouts.disableCss ? "Enable Css" : "Disable Css", () => {
            this.toggleCss();
            cssButton.setText(this.layouts.disableCss ? "Enable Css" : "Disable Css");
        });
        const getAboutButton = Button("Reset About", () => {
            this.getUserAbout();
        }, "error");
        this.settingContainer.append(header, layoutSelector, layoutInfoSection, imageSection, imageUploadNote, colorSelection);
        if (this.donatorTier >= 3) {
            this.settingContainer.append(this.createDonatorBadgeField());
        }
        this.settingContainer.append(this.createAboutSection(), getAboutButton);
        if (AnilistAuth.token) {
            const saveAboutButton = Button("Publish About", (event) => {
                this.publishAbout(event);
            }, "success");
            this.settingContainer.append(saveAboutButton);
        }
        this.settingContainer.append(previewButton.element);
        if (this.layouts.preview) {
            this.settingContainer.append(cssButton.element);
        }
    }
    static createLayoutSelector() {
        const container = DOM_DOM.create("div");
        container.append(IconButton(AddIcon(), () => {
            this.addLayout();
            this.renderSettings();
        }));
        const options = this.layouts.layoutsList.map((layout, index) => Option(`${layout.name} #${index + 1}`, index === this.layouts.selectedLayout, () => {
            this.switchLayout(index);
            this.renderSettings();
        }));
        container.append(Select(options));
        return container;
    }
    static switchLayout(index) {
        this.layout = this.layouts.layoutsList[index];
        this.layouts.selectedLayout = index;
        this.saveToLocalStorage();
        this.broadcastLayoutChange();
    }
    static addLayout() {
        const layout = new Layout();
        this.layout = layout;
        this.layouts.layoutsList.push(layout);
        this.layouts.selectedLayout = Math.max(this.layouts.layoutsList.length - 1, 0);
        this.saveToLocalStorage();
        this.broadcastLayoutChange();
    }
    static deleteLayout() {
        if (!window.confirm("Are you sure you want to delete this layout?")) {
            return;
        }
        this.layouts.layoutsList.splice(this.layouts.selectedLayout, 1);
        this.layouts.selectedLayout = Math.max(this.layouts.selectedLayout - 1, 0);
        if (this.layouts.layoutsList.length === 0) {
            this.layouts.layoutsList.push(new Layout());
        }
        this.layout = this.layouts.layoutsList[this.layouts.selectedLayout];
        this.saveToLocalStorage();
        this.broadcastLayoutChange();
    }
    static layoutInfoSection() {
        const container = Label("Layout name", InputField(this.layout?.name, (event) => {
            this.updateOption("name", event.target.value);
        }));
        container.append(IconButton(TrashcanIcon(), () => {
            this.deleteLayout();
            this.renderSettings();
        }));
        return container;
    }
    static createInputField(field, value) {
        const input = InputField(value, (event) => {
            this.updateOption(field, event.target.value);
        });
        return input;
    }
    static createImageField(field, value) {
        const container = DOM_DOM.create("div", "layout-image-container");
        const header = DOM_DOM.create("h5", "layout-header", field);
        const display = DOM_DOM.create("div", `layout-image-display ${field}`);
        display.style.backgroundImage = `url(${value})`;
        const input = this.createInputField(field, value);
        container.append(header, display, input);
        return container;
    }
    static createDonatorBadgeField() {
        const container = DOM_DOM.create("div", "layout-donator-badge-container");
        const donatorHeader = DOM_DOM.create("h5", "layout-header", "Donator Badge");
        const donatorInput = InputField(this.layout.donatorBadge, (event) => {
            this.updateOption("donatorBadge", event.target.value);
        });
        donatorInput.setAttribute("maxlength", "24");
        container.append(donatorHeader, donatorInput);
        if (this.layout.donatorBadge !== this.anilistSettings.donatorBadge &&
            this.layout.donatorBadge !== "" &&
            AnilistAuth.token) {
            const publishButton = Button("Publish Donator Badge", (event) => {
                this.publishDonatorText(event);
            });
            container.append(DOM_DOM.create("div", null, publishButton));
        }
        return container;
    }
    static createColorSelection() {
        const container = DOM_DOM.create("div", "layout-color-selection");
        const header = DOM_DOM.create("h5", "layout-header", "Color");
        container.append(header);
        for (const anilistColor of ColorFunctions.defaultColors) {
            container.append(this.createColorButton(anilistColor));
        }
        if (this.donatorTier >= 2) {
            const isDefaultColor = ColorFunctions.defaultColors.some((color) => color === this.layout.color);
            const colorInput = ColorPicker(isDefaultColor ? "" : this.layout.color, (event) => {
                this.updateOption("color", event.target.value);
            });
            if (!isDefaultColor && this.layout.color !== "") {
                colorInput.classList.add("active");
            }
            container.append(colorInput);
        }
        if (AnilistAuth.token &&
            this.layout.color.toLocaleLowerCase() !==
                this.anilistSettings?.options?.profileColor?.toLocaleLowerCase() &&
            this.layout.color !== "") {
            const publishButton = Button("Publish Color", (event) => {
                this.publishColor(event);
            });
            container.append(DOM_DOM.create("div", null, publishButton));
        }
        return container;
    }
    static createAboutSection() {
        const container = DOM_DOM.create("div");
        const aboutHeader = DOM_DOM.create("h5", "layout-header", "About");
        const aboutInput = TextArea(this.layout.bio, (event) => {
            this.updateOption("bio", event.target.value);
        });
        const note = Note("Please note that VoidVerified does not have access to AniList's markdown parser. AniList specific features might not be available while previewing. Recommended to be used for smaller changes like previewing a different image for a layout.");
        container.append(aboutHeader, aboutInput, note);
        return container;
    }
    static async publishAbout(event) {
        const button = event.target;
        button.innerText = "Publishing...";
        try {
            let currentAbout = await AnilistAPI.getUserAbout(AnilistAuth.name);
            if (!currentAbout) {
                currentAbout = "";
            }
            const about = this.transformAbout(currentAbout, this.layout.bio);
            await AnilistAPI.saveUserAbout(about);
            Toaster.success("About published.");
            this.renderSettings();
        }
        catch (error) {
            Toaster.error("Failed to publish about.", error);
        }
    }
    static transformAbout(currentAbout, newAbout) {
        const json = currentAbout.match(/^\[\]\(json([A-Za-z0-9+/=]+)\)/)?.[1];
        if (!json) {
            return newAbout;
        }
        const about = `[](json${json})` + newAbout;
        return about;
    }
    static async publishColor(event) {
        const button = event.target;
        const color = this.layout.color;
        button.innerText = "Publishing...";
        try {
            const result = await AnilistAPI.saveUserColor(color);
            const profileColor = result.UpdateUser?.options?.profileColor;
            this.anilistSettings.options.profileColor = profileColor;
            Toaster.success("Color published.");
        }
        catch (error) {
            Toaster.error("Failed to publish color.", error);
        }
        finally {
            this.renderSettings();
        }
    }
    static async publishDonatorText(event) {
        const button = event.target;
        const donatorText = this.layout.donatorBadge;
        button.innerText = "Publishing...";
        try {
            const result = await AnilistAPI.saveDonatorBadge(donatorText);
            const donatorBadge = result.UpdateUser?.donatorBadge;
            this.anilistSettings.donatorBadge = donatorBadge;
            Toaster.success("Donator badge published.");
        }
        catch (error) {
            Toaster.error("Failed to publish donator badge.", error);
        }
        finally {
            this.renderSettings();
        }
    }
    static async getUserAbout() {
        if (this.layout.bio !== "" &&
            !window.confirm("Are you sure you want to reset about? Any changes will be lost.")) {
            return;
        }
        try {
            Toaster.debug("Querying user about.");
            const about = await AnilistAPI.getUserAbout(AnilistAuth.name);
            const clearedAbout = this.removeJson(about);
            this.updateOption("bio", clearedAbout);
            Toaster.success("About reset.");
        }
        catch (error) {
            Toaster.error("Failed to query current about from AniList API.", error);
        }
    }
    static removeJson(about) {
        return about.replace(/^\[\]\(json([A-Za-z0-9+/=]+)\)/, "");
    }
    static createColorButton(anilistColor) {
        const button = DOM_DOM.create("div", "color-button");
        button.style.backgroundColor = `rgb(${ColorFunctions.handleAnilistColor(anilistColor)})`;
        button.addEventListener("click", () => {
            this.updateOption("color", anilistColor);
        });
        if (this.layout.color === anilistColor) {
            button.classList.add("active");
        }
        return button;
    }
    static updateOption(field, value) {
        this.layout[field] = value;
        this.updateLayout(this.layout);
        this.renderSettings();
    }
    static togglePreview() {
        this.layouts.preview = !this.layouts.preview;
        if (!this.layouts.preview) {
            this.layouts.disableCss = false;
        }
        this.broadcastChannel.postMessage({
            type: "preview",
            preview: this.layouts.preview,
        });
        this.saveToLocalStorage();
        this.renderSettings();
    }
    static toggleCss() {
        this.layouts.disableCss = !this.layouts.disableCss;
        this.broadcastChannel.postMessage({
            type: "css",
            disableCss: this.layouts.disableCss,
        });
        this.saveToLocalStorage();
    }
    static getSelectedLayout() {
        return this.layouts.layoutsList[this.layouts.selectedLayout];
    }
    static updateLayout(layout) {
        this.layouts.layoutsList[this.layouts.selectedLayout] = layout;
        this.saveToLocalStorage();
        this.broadcastLayoutChange();
    }
    static broadcastLayoutChange() {
        this.broadcastChannel.postMessage({
            type: "layout",
            layout: this.layout,
        });
    }
    static saveToLocalStorage() {
        localStorage.setItem(this.layoutsInLocalStorage, JSON.stringify(this.layouts));
    }
}

;// CONCATENATED MODULE: ./src/handlers/anilistFeedFixHandler.js


class AnilistFeedFixHandler {
	#hidePrivateMessages = false;
	#settings;
	#styleHandler;
	constructor(settings) {
		this.#settings = settings;
		this.#styleHandler = new StyleHandler(settings);
	}

	handleFilters() {
		if (
			!this.#settings.options.hideMessagesFromListFeed.getValue() ||
			window.location.pathname !== `/user/${this.#settings.anilistUser}/`
		) {
			return;
		}

		const feedOptions = Array.from(
			document.querySelector(".activity-feed-wrap .section-header ul")
				.children,
		);

		if (!feedOptions) {
			return;
		}

		if (feedOptions[3].getAttribute("void-fixed")) {
			return;
		}

		for (const option of feedOptions.slice(0, 3)) {
			option.addEventListener("click", () => {
				this.#hidePrivateMessages = false;
			});
		}

		feedOptions[3].addEventListener("click", () => {
			this.#hidePrivateMessages = true;
		});
		feedOptions[3].setAttribute("void-fixed", true);
	}

	handleFix() {
		if (
			window.location.pathname !== `/user/${this.#settings.anilistUser}/`
		) {
			this.#styleHandler.clearStyles("private-message-fix");
			this.#hidePrivateMessages = false;
			return;
		}

		if (this.#hidePrivateMessages) {
			this.#styleHandler.createStyleLink(
				hidePrivateMessagesStyle,
				"private-message-fix",
			);
		} else {
			this.#styleHandler.clearStyles("private-message-fix");
		}
	}
}

const hidePrivateMessagesStyle = `
    .activity-feed-wrap .activity-message {
        display: none !important;
    }
`;

;// CONCATENATED MODULE: ./src/components/readNotifications.js


class ReadNotifications {
	static #notificationsInLocalStorage = LocalStorageKeys.readNotifications;
	static #unreadNotificationsFeed = new Set();
	static #unreadNotificationsCount = new Set();
	static getUnreadNotificationsCount(notifications) {
		const readNotifications = this.#getReadNotifications();
		let unreadNotificationsCount = 0;
		this.#unreadNotificationsCount = new Set();
		for (const notification of notifications) {
			if (!readNotifications.has(notification.id)) {
				unreadNotificationsCount++;
				this.#unreadNotificationsCount.add(notification.id);
			}
		}
		return unreadNotificationsCount;
	}

	static markAllAsRead() {
		const readNotifications = this.#getReadNotifications();
		this.#unreadNotificationsFeed.forEach((notification) => {
			readNotifications.add(notification);
		});
		this.#unreadNotificationsCount.forEach((notification) => {
			readNotifications.add(notification);
		});
		this.#unreadNotificationsCount = new Set();
		this.#unreadNotificationsFeed = new Set();
		this.#saveReadNotifications(readNotifications);
	}

	static markMultipleAsRead(notifications) {
		const readNotifications = this.#getReadNotifications();
		notifications.forEach((notification) => {
			readNotifications.add(notification);
		});
		this.#saveReadNotifications(readNotifications);
	}

	static markMultipleAsUnread(notifications) {
		const readNotifications = this.#getReadNotifications();
		notifications.forEach((notification) => {
			readNotifications.delete(notification);
		});
		this.#saveReadNotifications(readNotifications);
	}

	static isRead(notificationId) {
		const readNotifications = this.#getReadNotifications();
		const isRead = readNotifications.has(notificationId);
		if (!isRead) {
			this.#unreadNotificationsFeed.add(notificationId);
		}
		return isRead;
	}

	static resetUnreadNotificationsFeed() {
		this.#unreadNotificationsFeed = new Set();
	}

	static #getReadNotifications() {
		return new Set(
			JSON.parse(localStorage.getItem(this.#notificationsInLocalStorage)),
		);
	}

	static #saveReadNotifications(notifications) {
		let notificationsAsArray = Array.from(notifications);
		if (notificationsAsArray.length > 10000) {
			notificationsAsArray = notificationsAsArray.slice(-10000);
		}
		localStorage.setItem(
			this.#notificationsInLocalStorage,
			JSON.stringify(notificationsAsArray),
		);
	}
}

;// CONCATENATED MODULE: ./src/components/notificationWrapper.js






const NotificationWrapper = (notification, addReadListener = false) => {
	const wrapper = DOM_DOM.create("div", "notification-wrapper");
	const previewWrapper = createPreview(notification);
	const context = createContext(notification);

	const timestamp = DOM_DOM.create(
		"div",
		"notification-timestamp",
		Time.convertToString(notification.createdAt),
	);

	StaticTooltip.register(timestamp, Time.toLocaleString(notification.createdAt));

	wrapper.append(previewWrapper, context, timestamp);
	if (addReadListener) {
		wrapper.addEventListener("click", () => {
			if (wrapper.classList.contains("void-unread-notification")) {
				markAsRead(notification);
				wrapper.classList.remove("void-unread-notification");
			} else {
				markAsUnread(notification);
				wrapper.classList.add("void-unread-notification");
			}
		});
	}
	return wrapper;
};

const markAsRead = (notification) => {
	try {
		const notifications = [
			notification.id,
		];
		if (notification.group) {
			notifications.push(...notification.group.map((item) => item.notificationId));
		}
		ReadNotifications.markMultipleAsRead(notifications);
	} catch (error) {
		console.error(error);
	}
};

const markAsUnread = (notification) => {
	const notifications = [
		notification.id,
		...notification.group?.map((item) => item.notificationId),
	];
	ReadNotifications.markMultipleAsUnread(notifications);
};

const createPreview = (notification) => {
	const previewWrapper = DOM_DOM.create("div", "notification-preview-wrapper");
	if (notification.type === "MEDIA_DELETION") {
		return previewWrapper;
	}
	const linkUrl = notification.user
		? `/user/${notification.user.name}/`
		: `/${notification.media?.type.toLowerCase()}/${
				notification.media?.id
			}`;
	const preview = Link("", linkUrl, "", "notification-preview");
	if (notification.media) {
		preview.classList.add("void-notification-preview-media");
	}
	const imageUrl =
		notification.user?.avatar.large ?? notification.media?.coverImage.large;
	preview.style.backgroundImage = `url(${imageUrl})`;
	previewWrapper.append(preview);

	if (notification.group?.length > 0) {
		preview.setAttribute("data-count", `+${notification.group.length}`);
		const group = createGroup(notification);
		previewWrapper.append(group);
	}

	previewWrapper.addEventListener("click", (event) => {
		event.stopPropagation();
	});

	if (notification.activity) {
		previewWrapper.append(createActivityRelation(notification.activity));
	}

	return previewWrapper;
};

const createActivityRelation = (activity) => {
	let url;
	let image;
	switch (activity.type) {
		case "ANIME_LIST":
			url = `/anime/${activity.media.id}`;
			image = activity.media.coverImage.large;
			break;
		case "MANGA_LIST":
			url = `/manga/${activity.media.id}`;
			image = activity.media.coverImage.large;
			break;
		case "TEXT":
			url = `/user/${activity.user.name}`;
			image = activity.user.avatar.large;
			break;
		case "MESSAGE":
			url = `/user/${activity.recipient.name}`;
			image = activity.recipient.avatar.large;
			break;
	}
	const activityRelation = Link("", url, "", "notification-preview-relation");
	activityRelation.style.backgroundImage = `url(${image})`;
	return activityRelation;
};

const createGroup = (notification) => {
	const group = DOM_DOM.create("div", "notification-group");
	for (const user of notification.group.slice(
		0,
		Math.min(10, notification.group.length),
	)) {
		const groupItem = Link(
			"",
			`/user/${user.name}/`,
			"",
			"notification-group-item",
		);
		groupItem.style.backgroundImage = `url(${user.avatar.large})`;
		group.append(groupItem);
	}
	return group;
};

const createContext = (notification, addReadListener) => {
	if (
		notification.type === "AIRING" ||
		notification.type === "RELATED_MEDIA_ADDITION" ||
		notification.type === "MEDIA_DATA_CHANGE" ||
		notification.type === "MEDIA_DELETION"
	) {
		return createMediaContext(notification, addReadListener);
	}

	const highlight = DOM_DOM.create(
		"span",
		"notification-context-actor",
		notification.user.name,
	);

	const context = DOM_DOM.create("a", "notification-context", [
		highlight,
		`\u00A0${notification.context.trim()}`,
	]);

	if (notification.thread) {
		const thread = DOM_DOM.create(
			"span",
			"notification-context-actor",
			`\u00A0${notification.thread.title}`,
		);
		context.append(thread);
	}

	context.setAttribute("href", getNotificationUrl(notification));
	if (addReadListener) {
		context.addEventListener("click", (event) => {
			event.stopPropagation();
			markAsRead(notification);
		});
	}

	return context;
};

const getNotificationUrl = (notification) => {
	switch (notification.type) {
		case "THREAD_COMMENT_LIKE":
		case "THREAD_COMMENT_MENTION":
		case "THREAD_SUBSCRIBED":
		case "THREAD_COMMENT_REPLY":
			return `/forum/thread/${notification.thread.id}/comment/${notification.commentId}`;
		case "THREAD_LIKE":
			return `/forum/thread/${notification.threadId}/`;
		case "FOLLOWING":
			return `/user/${notification.user.name}/`;
		default:
			return `/activity/${notification.activityId}`;
	}
};

const createMediaContext = (notification, addReadListener) => {
	const highlight = DOM_DOM.create(
		"span",
		"notification-context-actor",
		notification.media?.title?.userPreferred ??
			notification.deletedMediaTitle,
	);
	let context;
	if (notification.type === "AIRING") {
		context = DOM_DOM.create("a", "notification-context", [
			notification.contexts[0],
			notification.episode,
			notification.contexts[1],
			highlight,
			notification.contexts[2],
		]);
	} else {
		context = DOM_DOM.create("a", "notification-context", [
			highlight,
			`\u00A0${notification.context.trim()}`,
		]);
	}
	if (!notification.deletedMediaTitle) {
		context.setAttribute(
			"href",
			`${notification.media.type.toLowerCase()}/${
				notification.media.id
			}`,
		);
	}

	if (notification.reason) {
		const reason = DOM_DOM.create(
			"div",
			"notification-context-reason",
			notification.reason,
		);
		context.append(reason);
	}
	if (addReadListener) {
		context.addEventListener("click", (event) => {
			event.stopPropagation();
			markAsRead(notification);
		});
	}
	return context;
};

;// CONCATENATED MODULE: ./src/handlers/notifications/notificationTypes.js
const notificationTypes = [
	"AIRING",
	"ACTIVITY_LIKE",
	"ACTIVITY_MENTION",
	"ACTIVITY_MESSAGE",
	"ACTIVITY_REPLY",
	"ACTIVITY_REPLY_LIKE",
	"ACTIVITY_REPLY_SUBSCRIBED",
	"FOLLOWING",
	"RELATED_MEDIA_ADDITION",
	"THREAD_COMMENT_LIKE",
	"THREAD_COMMENT_MENTION",
	"THREAD_COMMENT_REPLY",
	"THREAD_LIKE",
	"THREAD_SUBSCRIBED",
	"MEDIA_DATA_CHANGE",
	"MEDIA_DELETION",
	// not implemented
	// "MEDIA_MERGE",
];

;// CONCATENATED MODULE: ./src/handlers/notifications/notificationConfig.js


class NotificationConfig {
	groupNotifications;
	dontGroupWhenFiltering;
	notificationTypes;
	collapsed;
	resetDefaultNotifications;
	addActivityRelation;
	#configInLocalStorage;
	constructor(locaStorageString) {
		this.#configInLocalStorage = locaStorageString;
		const config = JSON.parse(
			localStorage.getItem(this.#configInLocalStorage),
		);
		this.groupNotifications = config?.groupNotifications ?? true;
		this.dontGroupWhenFiltering = config?.dontGroupWhenFiltering ?? true;
		this.notificationTypes = config?.notificationTypes ?? notificationTypes;
		this.collapsed = config?.collapsed ?? false;
		this.resetDefaultNotifications =
			config?.resetDefaultNotifications ?? true;
		this.addActivityRelation = config?.addActivityRelation ?? false;
	}

	save() {
		localStorage.setItem(this.#configInLocalStorage, JSON.stringify(this));
	}
}

;// CONCATENATED MODULE: ./src/handlers/notifications/notificationsCache.js


class NotificationsCache {
	static #notificationRelationsInLocalStorage =
		LocalStorageKeys.notificationRelationsCache;
	static #deadLinkRelations = LocalStorageKeys.notificationDeadLinkRelationsCache;
	static cacheRelations(relations) {
		const relationsMap = this.#getRelations();
		for (const relation of relations) {
			relationsMap.set(relation.id, relation);
		}
		this.#setRelations(relationsMap);
	}

	static filterDeadLinks(activityIds) {
		const deadLinks =
			JSON.parse(localStorage.getItem(this.#deadLinkRelations)) ?? [];
		return activityIds.filter((id) => !deadLinks.includes(id));
	}

	static cacheDeadLinks(activityIds) {
		const deadLinks = new Set(
			JSON.parse(localStorage.getItem(this.#deadLinkRelations)),
		);
		for (const id of activityIds) {
			deadLinks.add(id);
		}
		localStorage.setItem(
			this.#deadLinkRelations,
			JSON.stringify(Array.from(deadLinks)),
		);
	}

	static getCachedRelations(activityIds) {
		const relations = this.#getRelations();
		const cachedIds = Array.from(relations.keys());
		const nonCachedIds = activityIds.filter(
			(id) => !cachedIds.includes(id),
		);
		return [
			Array.from(relations).map((mapEntry) => mapEntry[1]),
			nonCachedIds,
		];
	}

	static #getRelations() {
		const relations = new Map(
			JSON.parse(
				localStorage.getItem(
					this.#notificationRelationsInLocalStorage,
				),
			),
		);
		return relations;
	}

	static #setRelations(relations) {
		localStorage.setItem(
			this.#notificationRelationsInLocalStorage,
			JSON.stringify(Array.from(relations)),
		);
	}
}

;// CONCATENATED MODULE: ./src/handlers/notifications/notificationQuickAccessHandler.ts











class NotificationQuickAccessHandler {
    #settings;
    #shouldQuery = true;
    #shouldRender = true;
    #notifications;
    #timeout = null;
    #config;
    #configOpen = false;
    #shouldQueryAfterConfigClose = false;
    constructor(settings) {
        this.#settings = settings;
        this.#config = new NotificationConfig(LocalStorageKeys.notificationsConfigQuickAccess);
    }
    async renderNotifications() {
        if (!this.#settings.options.quickAccessNotificationsEnabled.getValue() ||
            !this.#settings.isAuthorized()) {
            return;
        }
        if (this.#shouldQuery) {
            await this.#queryNotifications();
        }
        if (!this.#shouldRender) {
            return;
        }
        if (this.#config.hideDefaultNotificationDot) {
            const dot = document.body.querySelector(".user .notification-dot");
            if (dot) {
                dot.style.display = "none";
            }
        }
        if (!this.#notifications) {
            return;
        }
        const quickAccessContainer = DOM_DOM.getOrCreate("div", "#quick-access quick-access");
        const container = DOM_DOM.create("div", "quick-access-notifications");
        if (!this.#configOpen) {
            const notifications = DOM_DOM.create("div", "notifications-list");
            for (const notification of this.#handleNotifications(this.#notifications)) {
                notifications.append(NotificationWrapper(notification));
            }
            container.append(notifications);
        }
        else {
            const configurationContainer = this.#createConfigurationContainer();
            container.append(configurationContainer);
        }
        const containerWrapper = DOM_DOM.create("div", "quick-access-notifications-wrapper");
        const header = DOM_DOM.create("h2", null, ["Notifications"]);
        container.setAttribute("collapsed", this.#config.collapsed);
        header.addEventListener("click", () => {
            this.#config.collapsed = !this.#config.collapsed;
            this.#config.save();
            container.setAttribute("collapsed", this.#config.collapsed);
        });
        const headerWrapper = DOM_DOM.create("div", null, header);
        headerWrapper.classList.add("section-header");
        const reloadButton = this.createReloadButton();
        const clearButton = this.#clearButton();
        const configButton = this.#configOpenButton();
        headerWrapper.append(DOM_DOM.create("span", null, [reloadButton, clearButton, configButton]));
        containerWrapper.append(headerWrapper, container);
        this.#insertIntoDOM(quickAccessContainer, containerWrapper);
    }
    resetShouldRender() {
        this.#shouldRender = true;
        this.#shouldQuery = true;
        clearTimeout(this.#timeout);
        this.#timeout = null;
    }
    async #queryNotifications() {
        this.#shouldQuery = false;
        this.#timeout = setTimeout(() => {
            this.#shouldQuery = true;
        }, 3 * 60 * 1000);
        let notifications = [];
        try {
            const [notifs] = await AnilistAPI.getNotifications(this.#config.notificationTypes.length > 0
                ? this.#config.notificationTypes
                : notificationTypes);
            notifications = notifs;
            this.#shouldRender = true;
        }
        catch (error) {
            Toaster.error("There was an error querying quick access notifications.", error);
        }
        const activityIds = new Set(notifications
            .filter((x) => x.activityId)
            .filter((x) => x.type !== "ACTIVITY_MESSAGE")
            .map((x) => x.activityId));
        if (activityIds.size > 0 && this.#config.addActivityRelation) {
            const [relations, missingIds] = NotificationsCache.getCachedRelations(Array.from(activityIds));
            const nonDeadIds = NotificationsCache.filterDeadLinks(missingIds);
            if (nonDeadIds.length > 0) {
                try {
                    const rels = await AnilistAPI.getActivityNotificationRelations(Array.from(nonDeadIds));
                    relations.push(...rels);
                    NotificationsCache.cacheRelations(rels);
                    const foundIds = rels.map((relation) => relation.id);
                    NotificationsCache.cacheDeadLinks(missingIds.filter((id) => !foundIds.includes(id)));
                }
                catch (error) {
                    console.error(error);
                    Toaster.error("Failed to get activity notification relations.");
                }
            }
            notifications = notifications.map((notification) => {
                notification.activity = relations.find((relation) => notification.activityId === relation.id);
                return notification;
            });
        }
        this.#notifications = notifications;
    }
    #handleNotifications(notifications) {
        if (!notifications) {
            return [];
        }
        if (!this.#config.groupNotifications || notifications.length === 0) {
            return notifications.map((notification) => {
                notification.group = undefined;
                return notification;
            });
        }
        let prevNotification = notifications[0];
        prevNotification.group = [];
        let notificationsCopy = [...notifications];
        const notificationsToRemove = [];
        for (let i = 1; i < notifications.length; i++) {
            const notification = notifications[i];
            notification.group = [];
            if (prevNotification.type === notification.type &&
                prevNotification.activityId === notification.activityId &&
                notification.user) {
                prevNotification.group.push(notification.user);
                notificationsToRemove.push(i);
            }
            else {
                prevNotification = { ...notification };
            }
        }
        return notificationsCopy.filter((_, index) => !notificationsToRemove.includes(index));
    }
    #clearButton = () => {
        const clearButton = IconButton(CheckBadgeIcon(), async () => {
            if (this.#settings.options.replaceNotifications.getValue()) {
                ReadNotifications.markAllAsRead();
                document.querySelector(".void-notification-dot")?.remove();
            }
            try {
                await AnilistAPI.resetNotificationCount();
                document.body
                    .querySelector(".user .notification-dot")
                    ?.remove();
            }
            catch (error) {
                Toaster.error("There was an error resetting notification count.", error);
            }
        });
        clearButton.setAttribute("title", "Mark all as read");
        return clearButton;
    };
    createReloadButton() {
        const reloadButton = IconButton(RefreshIcon(), async () => {
            await this.#queryNotifications();
        });
        return reloadButton;
    }
    #configOpenButton = () => {
        const openConfigurationButton = IconButton(CogIcon(), () => {
            this.#configOpen = !this.#configOpen;
            this.#shouldRender = true;
            if (this.#shouldQueryAfterConfigClose) {
                this.#shouldQuery = true;
                this.#shouldQueryAfterConfigClose = false;
            }
            this.renderNotifications();
        });
        return openConfigurationButton;
    };
    #createConfigurationContainer() {
        const configWrapper = DOM_DOM.create("div", "notifications-config-wrapper");
        const header = DOM_DOM.create("h2", "notification-settings-header", "Notification Settings");
        const basicOptions = this.#createbasicOptions();
        const notificationTypes = this.#createNotificationTypeOptions();
        configWrapper.append(header, basicOptions, notificationTypes);
        return configWrapper;
    }
    #createbasicOptions = () => {
        const container = DOM_DOM.create("div");
        const groupOption = SettingLabel("Group similar notifications.", Checkbox(this.#config.groupNotifications, () => {
            this.#config.groupNotifications =
                !this.#config.groupNotifications;
            this.#config.save();
        }));
        const relationOption = SettingLabel("Add relation to activity notifications.", Checkbox(this.#config.addActivityRelation, () => {
            this.#config.addActivityRelation =
                !this.#config.addActivityRelation;
            this.#config.save();
        }));
        container.append(groupOption, relationOption);
        return container;
    };
    #createNotificationTypeOptions = () => {
        const container = DOM_DOM.create("div");
        const header = DOM_DOM.create("h3", "notification-type-list-header", "Notification Types");
        container.append(header);
        for (const type of notificationTypes) {
            const t = SettingLabel(type, Checkbox(this.#config.notificationTypes.includes(type), () => {
                if (this.#config.notificationTypes.includes(type)) {
                    this.#config.notificationTypes =
                        this.#config.notificationTypes.filter((x) => x !== type);
                }
                else {
                    this.#config.notificationTypes.push(type);
                }
                this.#config.save();
                this.#shouldQueryAfterConfigClose = true;
            }));
            container.append(t);
        }
        return container;
    };
    #insertIntoDOM(quickAccessContainer, container) {
        if (quickAccessContainer.querySelector(".void-quick-access-notifications")) {
            const oldNotifications = DOM_DOM.get("quick-access-notifications-wrapper");
            quickAccessContainer.replaceChild(container, oldNotifications);
        }
        else {
            quickAccessContainer.append(container);
        }
        this.#shouldRender = false;
        if (DOM_DOM.get("#quick-access")) {
            return;
        }
        const section = document.querySelector(".container > .home > div:nth-child(2)");
        section.insertBefore(quickAccessContainer, section.firstChild);
    }
}

;// CONCATENATED MODULE: ./src/components/loader.js
// MIT License
// Copyright (c) 2020 Vineeth.TR

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.



const Loader = () => {
	const loader = DOM_DOM.create("span", "loader");
	return loader;
};

;// CONCATENATED MODULE: ./src/handlers/notifications/notificationFeedHandler.js














class NotificationFeedHandler {
	#settings;
	#config;
	#filter = "custom";
	#pageInfo = {
		currentPage: 0,
		hasNextPage: false,
	};

	#filterWord = "";

	static notifications;
	#feedNotifications = [];

	constructor(settings) {
		this.#settings = settings;
		this.#config = new NotificationConfig(
			LocalStorageKeys.notificationsConfig,
		);

		if (
			this.#settings.options.replaceNotifications.getValue() &&
			this.#settings.isAuthorized()
		) {
			new StyleHandler().createStyleLink(
				notificationReplacementStyles,
				"notifications",
			);
			this.#handleUnreadNotificationsCount(this);
			setInterval(
				() => {
					this.#handleUnreadNotificationsCount(this);
				},
				3 * 60 * 1000,
			);
		}
	}

	renderNotificationsFeed() {
		if (
			!this.#settings.options.replaceNotifications.getValue() ||
			!this.#settings.isAuthorized()
		) {
			return;
		}

		if (!window.location.pathname.startsWith("/notifications")) {
			this.#pageInfo = { currentPage: 0, hasNextPage: false };
			this.#filter = "custom";
			return;
		}

		if (document.querySelector("#void-notifications-feed-container")) {
			return;
		}

		const container = DOM_DOM.create("div", "#notifications-feed-container");
		container.classList.add("container");
		container.append(this.#createSideBar());
		document
			.querySelector(".notifications-feed.container")
			.append(container);

		const notifications = DOM_DOM.create("div", "notifications-feed-list");
		container.append(notifications);

		this.#createNotifications();
	}

	static filterNotifications(notifications, filter) {
		if (filter?.length > 0) {
			notifications = notifications.filter(x => {
				let result = false;
				if (x.user) {
					result = FuzzyMatch.match(filter, x.user.name);
				}
				if (x.contexts && !result) {
					result = x.contexts.some(c => FuzzyMatch.match(filter, c));
				}
				if (x.context && !result) {
					result = FuzzyMatch.match(filter, x.context);
				}
				if (x.activity?.user?.name && !result) {
					result = FuzzyMatch.match(filter, x.activity.user.name)
				}
				if (x.activity?.recipient?.name && !result) {
					result = FuzzyMatch.match(filter, x.activity.recipient.name);
				}
				if (x.activity?.media?.title?.userPreferred && !result) {
					result = FuzzyMatch.match(filter, x.activity.media.title.userPreferred);
				}
				if (x.thread?.title && !result) {
					result = FuzzyMatch.match(filter, x.thread.title);
				}
				return result;
			})
		}
		return notifications;
	}

	async #handleUnreadNotificationsCount(notificationFeedHandler) {
		if (
			!this.#settings.options.replaceNotifications.getValue() ||
			!this.#settings.isAuthorized()
		) {
			return;
		}

		try {
			let [notifications] = await AnilistAPI.getNotifications(
				notificationFeedHandler.#config.notificationTypes,
				1,
				this.#config.resetDefaultNotifications,
			);

			NotificationFeedHandler.notifications = notifications;

			const unreadNotificationsCount =
				ReadNotifications.getUnreadNotificationsCount(notifications);
			document
				.querySelector(".nav .user .void-notification-dot")
				?.remove();
			if (unreadNotificationsCount === 0) {
				return;
			}
			const notificationDot = DOM_DOM.create(
				"a",
				"notification-dot",
				unreadNotificationsCount,
			);
			notificationDot.setAttribute(
				"href",
				"/notifications",
			);

			document.querySelector(".nav .user")?.append(notificationDot);
		} catch (error) {
			Toaster.error("There was an error querying unread notifications", error);
		}
	}

	#createSideBar() {
		const container = DOM_DOM.create("div", "notifications-feed-sidebar");
		container.append(this.#createTextFilter());
		container.append(this.#createFilters());
		container.append(this.#createReadAllButton());
		container.append(this.#createConfigurationContainer());
		return container;
	}

	#createTextFilter() {
		const inputField = InputField(this.#filterWord, () => {}, "notification-filter-input", {placeholder: "Filter current..."});
		inputField.addEventListener("input", (event) => {
			this.#filterWord = event.target.value;
			document.querySelector(".void-notifications-feed-list").replaceChildren([]);
			this.#renderNotifications(this.#feedNotifications);
		});
		return inputField;
	}

	#createFilters() {
		const container = DOM_DOM.create("div", "notifications-feed-filters");
		container.append(
			...filters.map((filter) => {
				const filterButton = DOM_DOM.create(
					"div",
					"notifications-feed-filter",
					filter,
				);
				filterButton.setAttribute("void-filter", filter);
				if (filter === this.#filter) {
					filterButton.classList.add("void-active");
				}
				filterButton.addEventListener("click", () => {
					this.#filter = filter;
					ReadNotifications.resetUnreadNotificationsFeed();
					document
						.querySelector(
							".void-notifications-feed-filter.void-active",
						)
						?.classList.remove("void-active");
					document
						.querySelector(
							`.void-notifications-feed-filter[void-filter="${filter}"]`,
						)
						?.classList.add("void-active");
					this.#pageInfo = { currentPage: 0, hasNextPage: false };
					this.#feedNotifications = [];
					document
						.querySelector(".void-notifications-feed-list")
						.replaceChildren([]);
					this.#createNotifications();
				});
				return filterButton;
			}),
		);
		return container;
	}

	#createReadAllButton = () => {
		const button = Button(
			"Mark all as read",
			async () => {
				ReadNotifications.markAllAsRead();
				document
					.querySelectorAll(".void-unread-notification")
					.forEach((notification) => {
						notification.classList.remove(
							"void-unread-notification",
						);
					});
				document.querySelector(".void-notification-dot")?.remove();
				if (!this.#config.resetDefaultNotifications) {
					try {
						Toaster.debug("Resetting notification count.");
						await AnilistAPI.resetNotificationCount();
						document.body
							.querySelector(".user .notification-dot")
							?.remove();
						Toaster.success("Notifications count reset.");
					} catch (error) {
						Toaster.error(
							"There was an error resetting notification count.",
							error
						);
					}
				}
			},
			"notification-all-read-button",
		);
		return button;
	};

	#createConfigurationContainer() {
		const container = DOM_DOM.create("div", "notifications-feed-settings");
		const header = DOM_DOM.create(
			"h2",
			"notification-settings-header",
			"Notification Settings",
		);

		const configWrapper = DOM_DOM.create("div", "notifications-config-wrapper");
		configWrapper.setAttribute("collapsed", "true");

		const basicOptions = this.#createbasicOptions();
		const notificationTypes = this.#createNotificationTypeOptions();
		configWrapper.append(basicOptions, notificationTypes);

		header.addEventListener("click", () => {
			configWrapper.setAttribute(
				"collapsed",
				!(configWrapper.getAttribute("collapsed") === "true"),
			);
		});

		container.append(header, configWrapper);

		return container;
	}

	#createbasicOptions = () => {
		const container = DOM_DOM.create("div");
		const groupOption = SettingLabel(
			"Group similar notifications.",
			Checkbox(this.#config.groupNotifications, () => {
				this.#config.groupNotifications =
					!this.#config.groupNotifications;
				this.#config.save();
			}),
		);
		const groupFilteringOption = SettingLabel(
			"Don't group notifications when filtering.",
			Checkbox(this.#config.dontGroupWhenFiltering, (e) => {
				this.#config.dontGroupWhenFiltering = e.target.checked;
				this.#config.save();
			})
		);
		const relationOption = SettingLabel(
			"Add relation to activity notifications.",
			Checkbox(this.#config.addActivityRelation, () => {
				this.#config.addActivityRelation =
					!this.#config.addActivityRelation;
				this.#config.save();
			}),
		);
		const resetOption = SettingLabel(
			"Reset AniList's notification count when querying notifications.",
			Checkbox(this.#config.resetDefaultNotifications, () => {
				this.#config.resetDefaultNotifications =
					!this.#config.resetDefaultNotifications;
				this.#config.save();
			}),
		);
		container.append(groupOption,groupFilteringOption, relationOption, resetOption);
		return container;
	};

	#createNotificationTypeOptions = () => {
		const container = DOM_DOM.create("div");
		const header = DOM_DOM.create(
			"h3",
			"notification-type-list-header",
			"Custom Feed",
		);
		container.append(header);

		for (const type of notificationTypes) {
			const t = SettingLabel(
				type,
				Checkbox(this.#config.notificationTypes.includes(type), () => {
					if (this.#config.notificationTypes.includes(type)) {
						this.#config.notificationTypes =
							this.#config.notificationTypes.filter(
								(x) => x !== type,
							);
					} else {
						this.#config.notificationTypes.push(type);
					}
					this.#config.save();
				}),
			);
			container.append(t);
		}

		return container;
	};

	async #createNotifications() {
		this.#showLoader();
		document
			.querySelector(".void-notifications-load-more-button")
			?.remove();
		let notifications = [];

		try {
			Toaster.debug("Querying notification feed.");
			const [notifs, pageInfo] = await AnilistAPI.getNotifications(
				this.#getNotificationTypes(),
				this.#pageInfo.currentPage + 1,
				this.#config.resetDefaultNotifications,
			);
			notifications = notifs;
			this.#pageInfo = pageInfo;
		} catch (error) {
			Toaster.error("There was an error querying notification feed.", error);
		}

		const activityIds = new Set(
			notifications
				.filter((x) => x.activityId)
				.filter((x) => x.type !== "ACTIVITY_MESSAGE")
				.map((x) => x.activityId),
		);

		if (activityIds.size > 0 && this.#config.addActivityRelation) {
			const [relations, missingIds] =
				NotificationsCache.getCachedRelations(Array.from(activityIds));
			const nonDeadIds = NotificationsCache.filterDeadLinks(missingIds);
			if (nonDeadIds.length > 0) {
				try {
					const rels =
						await AnilistAPI.getActivityNotificationRelations(
							Array.from(nonDeadIds),
						);
					relations.push(...rels);
					NotificationsCache.cacheRelations(rels);
					const foundIds = rels.map((relation) => relation.id);
					NotificationsCache.cacheDeadLinks(
						missingIds.filter((id) => !foundIds.includes(id)),
					);
				} catch (error) {
					console.error(error);
					Toaster.error(
						"Failed to get activity notification relations.",
					);
				}
			}
			notifications = notifications.map((notification) => {
				notification.activity = relations.find(
					(relation) => notification.activityId === relation.id,
				);
				return notification;
			});
		}

		this.#feedNotifications.push(...notifications);
		this.#renderNotifications(notifications);
	}

	#renderNotifications(notifications) {
		const notificationElements = [];
		if (notifications.length === 0) {
			notificationElements.push(
				DOM_DOM.create(
					"div",
					"notifications-feed-empty-notice",
					"Couldn't load notifications.",
				),
			);
		}
		notifications = NotificationFeedHandler.filterNotifications(notifications, this.#filterWord);
		for (const notification of this.#groupNotifications(notifications)) {
			const notificationElement = NotificationWrapper(notification, true);
			if (!ReadNotifications.isRead(notification.id)) {
				notificationElement.classList.add("void-unread-notification");
			}
			notificationElements.push(notificationElement);
		}



		document.querySelector(".void-loader")?.remove();

		document
			.querySelector(".void-notifications-feed-list")
			.append(...notificationElements);

		this.#createLoadMoreButton();
	}

	#createLoadMoreButton() {
		if (!this.#pageInfo.hasNextPage) {
			return;
		}
		const button = Button(
			"Load More",
			() => {
				this.#createNotifications(this.#pageInfo.currentPage + 1);
			},
			"notifications-load-more-button",
		);
		document.querySelector(".void-notifications-feed-list").append(button);
	}

	#showLoader() {
		document
			.querySelector(".void-notifications-feed-list")
			.append(Loader());
	}

	#getNotificationTypes() {
		switch (this.#filter) {
			case "custom":
				return this.#config.notificationTypes;
			case "all":
				return notificationTypes;
			case "airing":
				return ["AIRING"];
			case "activity":
				return [
					"ACTIVITY_MENTION",
					"ACTIVITY_MESSAGE",
					"ACTIVITY_REPLY",
					"ACTIVITY_REPLY_SUBSCRIBED",
				];
			case "likes":
				return ["ACTIVITY_LIKE", "ACTIVITY_REPLY_LIKE"];
			case "forum":
				return [
					"THREAD_COMMENT_LIKE",
					"THREAD_COMMENT_MENTION",
					"THREAD_COMMENT_REPLY",
					"THREAD_LIKE",
					"THREAD_SUBSCRIBED",
				];
			case "follows":
				return ["FOLLOWING"];
			case "media":
				return [
					"RELATED_MEDIA_ADDITION",
					"MEDIA_DATA_CHANGE",
					"MEDIA_DELETION",
				];
		}
	}

	#groupNotifications(notifications) {
		if (!notifications) {
			return [];
		}

		if (
			!this.#config.groupNotifications ||
			!notifications ||
			notifications.length === 0 ||
			(this.#config.dontGroupWhenFiltering && this.#filterWord?.length > 0)
		) {
			return notifications.map((notification) => {
				notification.group = undefined;
				return notification;
			});
		}

		let prevNotification = notifications[0];
		prevNotification.group = [];
		let notificationsCopy = [...notifications];
		const notificationsToRemove = [];
		for (let i = 1; i < notifications.length; i++) {
			const notification = notifications[i];
			notification.group = [];
			if (
				prevNotification.type === notification.type &&
				prevNotification.activityId === notification.activityId &&
				notification.user
			) {
				const groupItem = {
					...notification.user,
					notificationId: notification.id,
				};
				prevNotification.group.push(groupItem);
				notificationsToRemove.push(i);
			} else {
				prevNotification = { ...notification };
			}
		}
		return notificationsCopy.filter(
			(_, index) => !notificationsToRemove.includes(index),
		);
	}
}

const filters = [
	"custom",
	"all",
	"airing",
	"activity",
	"forum",
	"follows",
	"likes",
	"media",
];

const notificationReplacementStyles = `
    .nav .user .notification-dot {
        display: none;
    }

    .notifications-feed.container .filters,
    .notifications-feed.container .notifications {
        display: none;
    }
`;

;// CONCATENATED MODULE: ./src/components/domAwareComponent.ts
class DomAwareComponent {
    onDomLoad(target, callback) {
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                for (const node of mutation.addedNodes) {
                    if (node === target || node.contains(target)) {
                        callback();
                        observer.disconnect();
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    onDomUnload(target, callback) {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const removedNode of mutation.removedNodes) {
                    if (removedNode === target || removedNode.contains(target)) {
                        callback();
                        observer.disconnect();
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    addScrollListener(anchor, callback) {
        const scrollContainer = this.findScrollableParent(anchor) /* || window */;
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", callback, { passive: true });
        }
        return scrollContainer;
    }
    findScrollableParent(el) {
        let parent = el.parentElement;
        while (parent) {
            const style = getComputedStyle(parent);
            const overflowY = style.overflowY;
            if (overflowY === "auto" || overflowY === "scroll") {
                return parent;
            }
            parent = parent.parentElement;
        }
        return null;
    }
}

;// CONCATENATED MODULE: ./src/components/baseSearchComponent.ts


class BaseSearchComponent extends DomAwareComponent {
    element;
    resultsContainer;
    constructor() {
        super();
        this.element = DOM_DOM.create("div", "search-container");
        this.resultsContainer = DOM_DOM.create("div", "search-results");
        document.body.append(this.resultsContainer);
        this.updateResultsContainerLocation = this.updateResultsContainerLocation.bind(this);
        this.onDomUnload(this.element, () => {
            this.resultsContainer.remove();
        });
    }
    updateResultsContainerLocation() {
        if (!document.body.contains(this.resultsContainer)) {
            document.body.append(this.resultsContainer);
        }
        const elementRect = this.element.getBoundingClientRect();
        this.resultsContainer.style.top = `${elementRect.bottom + window.scrollY}px`;
        this.resultsContainer.style.left = `${elementRect.left + window.scrollX}px`;
        this.resultsContainer.style.width = `${elementRect.width}px`;
    }
}

;// CONCATENATED MODULE: ./src/components/MediaSearchComponent.ts





class MediaSearchComponent extends BaseSearchComponent {
    input;
    timeout;
    // this is actually read
    allowMultiple;
    keepOpen = false;
    onSelect;
    scrollElement;
    constructor(onSelect, allowMultiple = false) {
        super();
        this.onSelect = onSelect;
        this.allowMultiple = allowMultiple;
        this.input = DOM_DOM.create("input", "input");
        this.input.setAttribute("placeholder", "Search media...");
        this.input.addEventListener("input", (event) => {
            const target = event.target;
            this.handleSearchInput(target.value);
        });
        this.input.addEventListener("focusout", () => {
            this.keepOpen = false;
            // set timeout so clicking on a result works
            setTimeout(() => {
                if (!this.keepOpen) {
                    this.resultsContainer.replaceChildren();
                    this.scrollElement.removeEventListener("scroll", this.updateResultsContainerLocation);
                    window.removeEventListener("resize", this.updateResultsContainerLocation);
                    this.resultsContainer.remove();
                }
            }, 150);
        });
        this.element.append(this.input);
    }
    handleSearchInput(value) {
        clearTimeout(this.timeout);
        if (value === "" || value.length < 3) {
            return;
        }
        this.timeout = setTimeout(async () => {
            try {
                Toaster.debug(`Querying media with search word ${value}`);
                const response = await AnilistAPI.searchMedia(value);
                this.renderSearchResults(response);
            }
            catch (error) {
                Toaster.error(`Failed to query media with search word ${value}`, error);
            }
        }, 800);
    }
    renderSearchResults(results) {
        if (!document.body.contains(this.resultsContainer)) {
            document.body.append(this.resultsContainer);
        }
        this.resultsContainer.replaceChildren();
        this.scrollElement = this.addScrollListener(this.element, this.updateResultsContainerLocation);
        window.addEventListener("resize", this.updateResultsContainerLocation, { passive: true });
        for (const result of results) {
            const resultContainer = DOM_DOM.create("div", "search-result");
            resultContainer.addEventListener("click", function (event) {
                event.stopPropagation();
                this.onSelect(result);
                if (!this.allowMultiple) {
                    this.resultsContainer.replaceChildren();
                }
                else {
                    this.input.focus();
                    this.keepOpen = true;
                }
            }.bind(this));
            resultContainer.append(DOM_DOM.create("div", null, Image(result.coverImage.large, "media-search-poster")));
            const infoContainer = DOM_DOM.create("div", "media-search-info");
            infoContainer.append(DOM_DOM.create("div", "media-search-title", result.title.userPreferred));
            infoContainer.append(DOM_DOM.create("div", "media-search-type", `${result.type} ${result.startDate.year}`));
            resultContainer.append(infoContainer);
            this.resultsContainer.append(resultContainer);
        }
        this.updateResultsContainerLocation();
    }
}

;// CONCATENATED MODULE: ./src/handlers/activityPostHandler.ts







var MediaStatus;
(function (MediaStatus) {
    MediaStatus["Current"] = "CURRENT";
    MediaStatus["Planning"] = "PLANNING";
    MediaStatus["Completed"] = "COMPLETED";
    MediaStatus["Dropped"] = "DROPPED";
    MediaStatus["Paused"] = "PAUSED";
    MediaStatus["Repeating"] = "REPEATING";
})(MediaStatus || (MediaStatus = {}));
class ActivityPostHandler {
    settings;
    selectedSearchResult;
    mediaActivity;
    constructor(settings) {
        this.settings = settings;
    }
    render() {
        if (!this.settings.options.replyActivityUpdate.getValue() || !this.settings.isAuthorized()) {
            return;
        }
        const activityEditContainer = document.querySelector(".home > .activity-feed-wrap > .activity-edit");
        if (!activityEditContainer) {
            return;
        }
        if (DOM_DOM.get("activity-reply-controls-container")) {
            return;
        }
        const markdownInput = activityEditContainer.querySelector(":scope > .input");
        const markdownEditor = activityEditContainer.querySelector(".markdown-editor");
        if (!markdownEditor) {
            return;
        }
        if (!markdownEditor.querySelector(".void-activity-reply-toggle-button")) {
            markdownEditor.append(this.#createToggleButton());
        }
        if (!markdownInput) {
            return;
        }
        activityEditContainer.insertBefore(this.#createControls(), markdownInput);
    }
    #createControls() {
        const container = DOM_DOM.create("div", "activity-reply-controls-container");
        container.append(this.#createHeader());
        container.append(DOM_DOM.create("div", "media-status-controls", DOM_DOM.create("div", "gif-keyboard-list-placeholder", "Select a media...")));
        container.setAttribute("closed", "true");
        return container;
    }
    #createToggleButton() {
        const button = IconButton(FilmIcon(), () => {
            const container = document.querySelector(".void-activity-reply-controls-container");
            const currentValue = container.getAttribute("closed");
            container.setAttribute("closed", currentValue === "true" ? "false" : "true");
        }, "gif-button");
        button.setAttribute("title", "Reply to Activity");
        return button;
    }
    #createStatusAndProgressControl = () => {
        const container = document.querySelector(".void-media-status-controls");
        container.replaceChildren();
        container.append(Image(this.selectedSearchResult.coverImage.large, "status-poster"));
        const progressContainer = DOM_DOM.create("div", "activity-reply-progress-container");
        const mediaTitleContainer = DOM_DOM.create("div");
        mediaTitleContainer.append(DOM_DOM.create("div", "media-search-title", Link(this.selectedSearchResult.title.userPreferred, `/${this.selectedSearchResult.type === "ANIME" ? "anime" : "manga"}/${this.selectedSearchResult.id}`, "_blank")));
        mediaTitleContainer.append(DOM_DOM.create("div", "media-search-type", `${this.selectedSearchResult.startDate.year ?? "Unreleased"} ${this.selectedSearchResult.type}`));
        progressContainer.append(mediaTitleContainer);
        progressContainer.append(DOM_DOM.create("h5", "layout-header", "Status"));
        const options = Object.keys(MediaStatus)
            .filter(status => !(MediaStatus[status] === MediaStatus.Repeating && this.mediaActivity.maxProgress === 1))
            .map((status) => Option(status, MediaStatus[status] === this.mediaActivity.status, () => {
            this.mediaActivity.status = MediaStatus[status];
            this.#createStatusAndProgressControl();
        }));
        const select = Select(options);
        progressContainer.append(select);
        container.append(progressContainer);
        if (this.mediaActivity.status !== MediaStatus.Current && this.mediaActivity.status !== MediaStatus.Repeating) {
            return;
        }
        progressContainer.append(DOM_DOM.create("h5", "layout-header", "Progress"));
        const progressInput = InputField(this.mediaActivity.progress, (event) => {
            this.mediaActivity.progress = Number(event.target.value);
        });
        progressInput.setAttribute("type", "number");
        progressInput.setAttribute("max", this.mediaActivity.maxProgress.toString());
        progressInput.setAttribute("min", "0");
        progressContainer.append(DOM_DOM.create("div", null, progressInput));
    };
    #createHeader() {
        const mediaSearch = new MediaSearchComponent((result) => {
            this.setSelectedSearchResult(result);
        });
        const headerContainer = DOM_DOM.create("div", "activity-reply-header", mediaSearch.element);
        const replyButton = Button("Reply", function () {
            this.#handleReply();
        }.bind(this), "slim");
        headerContainer.append(replyButton);
        return headerContainer;
    }
    async #handleReply() {
        if (!this.selectedSearchResult) {
            Toaster.notify("Please search for a media before replying.");
            return;
        }
        if (this.#validateNotificationOptions()) {
            Toaster.notify(`You have disabled ${this.mediaActivity.status} list activity type. Enable it in settings to create this activity.`);
            return;
        }
        try {
            await AnilistAPI.updateMediaProgress(this.mediaActivity.mediaListId, this.selectedSearchResult.id, this.mediaActivity.status, this.mediaActivity.progress);
        }
        catch (error) {
            Toaster.error("Failed to update media progress", error);
            return;
        }
        try {
            const response = await AnilistAPI.getCreatedMediaActivity(this.selectedSearchResult.id);
            const textarea = document.querySelector(".home > .activity-feed-wrap > .activity-edit > .input > textarea");
            const replyResponse = await AnilistAPI.replyToActivity(response.id, textarea.value);
            if (Vue.router) {
                Vue.router.push(`/activity/${response.id}`);
            }
            else {
                window.location.replace(`https://anilist.co/activity/${response.id}`);
            }
        }
        catch (error) {
            Toaster.error("Failed to reply to activity");
        }
    }
    #validateNotificationOptions() {
        const disabledListActivity = JSON.parse(localStorage.getItem("auth"))?.options?.disabledListActivity;
        return disabledListActivity.some(disabledListActivity => disabledListActivity.type === this.mediaActivity.status && disabledListActivity.disabled);
    }
    async setSelectedSearchResult(result) {
        this.selectedSearchResult = result;
        try {
            const mediaProgress = await AnilistAPI.getMediaProgress(result.id);
            if (mediaProgress) {
                this.mediaActivity = {
                    status: mediaProgress.status,
                    progress: mediaProgress.progress,
                    maxProgress: mediaProgress.media.episodes ?? mediaProgress.media.chapters,
                    mediaListId: mediaProgress.id
                };
            }
            else {
                this.mediaActivity = {
                    status: MediaStatus.Planning,
                    progress: 0,
                    maxProgress: this.selectedSearchResult.episodes ?? this.selectedSearchResult.chapters,
                    mediaListId: undefined
                };
            }
            this.#createStatusAndProgressControl();
        }
        catch (error) {
            Toaster.error("Failed to query media progress", error);
        }
    }
}

;// CONCATENATED MODULE: ./src/handlers/pasteHandler.js




class PasteHandler {
	settings;
	#uploadInProgress = false;

	constructor(settings) {
		this.settings = settings;
	}

	setup() {
		window.addEventListener("paste", (event) => {
			this.#handlePaste(event);
		});
	}

	registerDragAndDropInputs() {
		if (!this.settings.options.pasteImagesToHostService.getValue()) {
			return;
		}
		const inputs = document.querySelectorAll("textarea, input");

		for (const input of inputs) {
			this.#registerDragAndDropInput(input);
		}
	}

	#registerDragAndDropInput(input) {
		input.addEventListener("drop", this.#handleDrop.bind(this));
		input.addEventListener("dragenter", () => {
			input.classList.add("void-drag-indicator");
		});
		input.addEventListener("dragleave", () => {
			input.classList.remove("void-drag-indicator");
		});
	}

	async #handleDrop(event) {
		if (
			event.target.tagName !== "TEXTAREA" &&
			event.target.tagName !== "INPUT" ||
			event.target.classList.contains("input-file")
		) {
			return;
		}

		event.target.classList.remove("void-drag-indicator");
		const currentValue = event.target.value;
		const start = event.target.selectionStart;
		const end = event.target.selectionEnd;
		const beforeSelection = currentValue.substring(0, start);
		const afterSelection = currentValue.substring(end);

		let files;
		if (event.dataTransfer.items) {
			files = [...event.dataTransfer.items].map(item => item.getAsFile());
		} else {
			files = [...event.dataTransfer.files];
		}

		const images = files.filter((file) => file.type.startsWith("image/"));

		if (images.length === 0) {
			return;
		}

		event.preventDefault();

		const result = await this.#handleImages(event, images);
		const transformedClipboard = result.join("\n\n");

		event.target.value = `${beforeSelection}${transformedClipboard}${afterSelection}`;
		event.target.selectionStart = start;
		event.target.selectionEnd = start + transformedClipboard.length;
		event.target.dispatchEvent(new Event('input', {bubbles: true}));
	}

	async #handlePaste(event) {
		if (
			event.target.tagName !== "TEXTAREA" &&
			event.target.tagName !== "INPUT"
		) {
			return;
		}

		const clipboard = event.clipboardData.getData("text/plain").trim();

		const file = event.clipboardData.items[0]?.getAsFile();
		if (file && this.settings.options.pasteImagesToHostService.getValue()) {
			event.preventDefault();
			const _files = event.clipboardData.items;
			const files = Object.values(_files).map((file) => file.getAsFile());
			const images = files.filter((file) => file.type.startsWith("image/"));
			const result = await this.#handleImages(event, images);
			const transformedClipboard = result.join("\n\n");
			window.document.execCommand(
				"insertText",
				false,
				transformedClipboard,
			);
		} else if (this.settings.options.pasteEnabled.getValue()) {
			if (this.#verifyTarget(event)) {
				return;
			}
			event.preventDefault();
			const regex = new RegExp(
				`(?<!\\()\\b(https?:\/\/\\S+\\.(?:${ImageFormats.join(
					"|",
				)}))\\b(?!.*?\\))`,
				"gi",
			);
			const result = clipboard.replace(
				regex,
				(match) =>
					`img${PasteHandler.getImageWidth()}(${match})`,
			);
			window.document.execCommand("insertText", false, result);
			return;
		}
	}

	async #handleImages(event, images) {
		if (this.#uploadInProgress) {
			return;
		}
		this.#uploadInProgress = true;
		document.body.classList.add("void-upload-in-progress");

		const imageApi = new ImageApiFactory().getImageHostInstance();

		try {
			const results = await Promise.all(
				images.map((image) => imageApi.uploadImage(image)),
			);
			return results
				.filter((url) => url !== null)
				.map((url) => this.#handleRow(url, event));
		} catch (error) {
			console.error(error);
			return [];
		} finally {
			this.#uploadInProgress = false;
			document.body.classList.remove("void-upload-in-progress");
		}
	}

	#handleRow(row, event) {
		if (this.#verifyTarget(event)) {
			return row;
		}

		row = row.trim();
		if (ImageFormats.some((format) => row.toLowerCase().endsWith(format))) {
			return PasteHandler.handleImg(row);
		} else if (row.toLowerCase().startsWith("http")) {
			return `[](${row})`;
		} else {
			return row;
		}
	}

	#verifyTarget(event) {
		return event.target.classList.contains("ace_text-input") ||
			event.target.tagName === "INPUT";
	}

	static handleImg(row) {
		const img = `img${this.getImageWidth()}(${row})`;
		let result = img;
		if (StaticSettings.options.pasteWrapImagesWithLink.getValue()) {
			result = `[ ${img} ](${row})`;
		}
		return result;
	}

	static getImageWidth() {
		const isPercentage = StaticSettings.options.pasteImageUnitIsPercentage.getValue();
		const width = StaticSettings.options.pasteImageWidthValue.getValue();
		return  isPercentage ? Math.min(width, 100) + "%" : width.toString();
	}
}

;// CONCATENATED MODULE: ./src/utils/markdownFunctions.ts

var InputType;
(function (InputType) {
    InputType[InputType["Wrap"] = 0] = "Wrap";
    InputType[InputType["LineStart"] = 1] = "LineStart";
    InputType[InputType["EveryLineStart"] = 2] = "EveryLineStart";
    InputType[InputType["Video"] = 3] = "Video";
    InputType[InputType["Link"] = 4] = "Link";
    InputType[InputType["Image"] = 5] = "Image";
})(InputType || (InputType = {}));
const MarkdownCommands = [
    {
        key: "ctrl+b",
        characters: "__",
        specialRemove: "___",
        description: "Bold",
        type: InputType.Wrap
    },
    {
        key: "ctrl+i",
        characters: "_",
        specialRemove: "___",
        description: "Italic",
        type: InputType.Wrap
    },
    {
        key: "alt+shift+5",
        characters: "~~",
        specialRemove: "~~~~~",
        description: "Strikethrough",
        type: InputType.Wrap
    },
    {
        key: "alt+S",
        characters: ["~!", "!~"],
        description: "Spoiler!",
        type: InputType.Wrap
    },
    {
        key: "alt+shift+c",
        characters: "~~~",
        specialRemove: "~~~~~",
        description: "Center",
        type: InputType.Wrap
    },
    {
        key: "ctrl+shift+c",
        characters: "`",
        description: "Code",
        type: InputType.Wrap
    },
    {
        key: "ctrl+shift+alt+c",
        characters: ["<pre>", "</pre>"],
        description: "Code block",
        type: InputType.Wrap
    },
    {
        key: "alt+q",
        characters: ">",
        description: "Quote",
        type: InputType.LineStart
    },
    {
        key: "alt+h",
        characters: "#",
        maxInstances: 5,
        description: "Header",
        type: InputType.LineStart
    },
    {
        key: "alt+b",
        characters: "-",
        description: "Unordered List",
        type: InputType.EveryLineStart
    },
    {
        key: "alt+l",
        characters: "1.",
        description: "Ordered List",
        type: InputType.EveryLineStart
    },
    {
        key: "alt+y",
        characters: ["youtube(", ")"],
        regex: /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)/,
        description: "Youtube Video",
        type: InputType.Video
    },
    {
        key: "alt+w",
        characters: ["webm(", ")"],
        regex: /^(https?:\/\/.*\.(?:webm|mp4))/,
        description: "WebM Video",
        type: InputType.Video
    },
    {
        key: "ctrl+k",
        description: "Link",
        type: InputType.Link
    },
    {
        key: "alt+i",
        description: "Image",
        type: InputType.Image
    }
];
class MarkdownFunctions {
    static handleCommand(command, textarea) {
        switch (command.type) {
            case InputType.Wrap:
                this.wrapSelection(textarea, command.characters, command.specialRemove);
                break;
            case InputType.LineStart:
                this.lineStart(textarea, command.characters, command.maxInstances ?? 1);
                break;
            case InputType.EveryLineStart:
                this.insertAtEveryLine(textarea, command.characters);
                break;
            case InputType.Video:
                this.wrapVideoLink(textarea, command.characters, command.regex);
                break;
            case InputType.Image:
                this.wrapImage(textarea);
                break;
            case InputType.Link:
                this.wrapLink(textarea);
                break;
        }
    }
    static lineStart(textarea, characters, maxInstances = 1) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const lineStart = textarea.value.substring(0, start).lastIndexOf("\n") + 1;
        const before = textarea.value.substring(0, lineStart);
        const [after, selectionDifference] = this.stringStart(textarea.value.substring(lineStart), characters, maxInstances);
        textarea.value = `${before}${after}`;
        textarea.selectionStart = start + selectionDifference;
        textarea.selectionEnd = end + selectionDifference;
    }
    static stringStart(line, characters, maxInstances = 1, allowRemove = true) {
        const lineStartsWithCharacters = line.substring(0, characters.length) === characters;
        const insertMultipleAllowed = maxInstances > 1;
        if (!insertMultipleAllowed && lineStartsWithCharacters) {
            if (allowRemove) {
                const difference = characters.length + 1;
                return [line.substring(difference), -difference];
            }
            return [line, 0];
        }
        const countOfCharactersAtStartOfLine = line.search(`[^${characters}]`);
        if (countOfCharactersAtStartOfLine >= maxInstances) {
            return [line, 0];
        }
        const selectionDifference = characters.length + (!lineStartsWithCharacters ? 1 : 0);
        return [`${characters}${!lineStartsWithCharacters ? " " : ""}${line}`, selectionDifference];
    }
    static insertAtEveryLine(textarea, characters, maxInstances = 1) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const firstLineStart = textarea.value.substring(0, start).lastIndexOf("\n") + 1;
        const before = textarea.value.substring(0, firstLineStart);
        const selection = textarea.value.substring(firstLineStart, end);
        const afterSelection = textarea.value.substring(end);
        const result = [];
        let selectionDifference = 0;
        let firstLineHandled = false;
        let selectionStartDifference = 0;
        const selectionStartsWithCharacters = selection.substring(0, characters.length) === characters;
        for (const line of selection.split("\n")) {
            if (selectionStartsWithCharacters) {
                if (line.substring(0, characters.length) !== characters) {
                    result.push(line);
                    continue;
                }
                const difference = characters.length + 1;
                const transformedLine = line.substring(difference);
                result.push(transformedLine);
                selectionDifference -= difference;
                continue;
            }
            const [transformedLine, _selectionDifference] = this.stringStart(line, characters, maxInstances, false);
            result.push(transformedLine);
            selectionDifference += _selectionDifference;
            if (!firstLineHandled) {
                selectionStartDifference += _selectionDifference;
                firstLineHandled = true;
            }
        }
        textarea.value = `${before}${result.join("\n")}${afterSelection}`;
        textarea.selectionStart = start;
        textarea.selectionEnd = end + selectionDifference;
    }
    static wrapSelection(textarea, characters, specialRemove, isCancellable = true) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        let startCharacters;
        let endCharacters;
        if (Array.isArray(characters)) {
            startCharacters = characters[0];
            endCharacters = characters[1];
        }
        else {
            startCharacters = characters;
            endCharacters = characters;
        }
        let before = textarea.value.substring(0, start);
        const selection = textarea.value.substring(start, end);
        let after = textarea.value.substring(end);
        if (isCancellable && (after.match(this.createRegex(endCharacters)) && before.match(this.createEndRegex(startCharacters)) ||
            specialRemove && (after.match(this.createRegex(specialRemove)) || before.match(this.createEndRegex(specialRemove))))) {
            before = before.substring(0, before.length - startCharacters.length);
            after = after.substring(endCharacters.length);
            textarea.value = `${before}${selection}${after}`;
            textarea.selectionStart = start - startCharacters.length;
            textarea.selectionEnd = end - startCharacters.length;
            return;
        }
        textarea.value = `${before}${startCharacters}${selection}${endCharacters}${after}`;
        textarea.selectionStart = start + startCharacters.length;
        textarea.selectionEnd = end + startCharacters.length;
    }
    static createRegex(startString) {
        const escapedStartString = startString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const lastChar = escapedStartString.slice(-1);
        const regexPattern = `^${escapedStartString}(?!${lastChar})`;
        return new RegExp(regexPattern);
    }
    static createEndRegex(endString) {
        const escapedEndString = endString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const firstChar = escapedEndString.charAt(0);
        const regexPattern = `(?<!${firstChar}.{0})${escapedEndString}$`;
        return new RegExp(regexPattern);
    }
    static wrapVideoLink(textarea, characters, regex) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = textarea.value.substring(0, start);
        const selection = textarea.value.substring(start, end);
        const afterSelection = textarea.value.substring(end);
        if (!selection.match(regex)) {
            return;
        }
        textarea.value = `${before}${characters[0]}${selection}${characters[1]}${afterSelection}`;
        textarea.selectionStart = start + characters[0].length;
        textarea.selectionEnd = end + characters[0].length;
    }
    static wrapLink(textarea) {
        const selectionStart = textarea.selectionStart;
        if (getSelection().toString().match(/(https?:\/\/[^\s]+)/gi)) {
            MarkdownFunctions.wrapSelection(textarea, ["[](", ")"], null, false);
            textarea.selectionStart = selectionStart + 1;
        }
        else {
            const selectionLength = textarea.selectionEnd - textarea.selectionStart;
            MarkdownFunctions.wrapSelection(textarea, ["[", "]()"], null, false);
            textarea.selectionStart = selectionStart + 3 + selectionLength;
        }
        textarea.selectionEnd = textarea.selectionStart;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
    static wrapImage(textarea) {
        const selectionStart = textarea.selectionStart;
        const imageWidth = PasteHandler.getImageWidth();
        this.wrapSelection(textarea, [`img${imageWidth}(`, ")"], null, false);
        textarea.selectionStart = selectionStart + 3 + imageWidth.length;
        textarea.selectionEnd = selectionStart + 3 + imageWidth.length;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
}

;// CONCATENATED MODULE: ./src/handlers/markdownHotkeys.ts






;
const scope = "markdown";
const defaultInputs = MarkdownCommands;
class MarkdownHotkeysConfig {
    mappings;
    constructor() {
        const localStorageConfig = JSON.parse(localStorage.getItem("void-markdown-hotkeys"));
        this.mappings = localStorageConfig?.mappings ?? defaultInputs;
    }
    getMappings(type) {
        return this.mappings.filter(mapping => mapping.type === type);
    }
    getAllMappings() {
        return this.mappings;
    }
    getMapping(description) {
        return this.mappings.find(mapping => mapping.description === description);
    }
    saveMapping(key, mappingDescription) {
        this.mappings = this.mappings.map(mapping => mappingDescription === mapping.description ? {
            ...mapping,
            key
        } : mapping);
        this.#save();
    }
    resetMappings() {
        this.mappings = defaultInputs;
        this.#save();
    }
    #save() {
        localStorage.setItem("void-markdown-hotkeys", JSON.stringify(this));
    }
}
const markdownHotkeys_filter = (event) => {
    const target = event.target || event.srcElement;
    if (target.classList.contains("ace_text-input")) {
        return false;
    }
    if (target.classList.contains("void-key-input")) {
        return true;
    }
    return target.tagName === 'TEXTAREA';
};
class MarkdownHotkeys {
    settings;
    config;
    constructor(settings) {
        this.settings = settings;
        this.config = new MarkdownHotkeysConfig();
    }
    setupMarkdownHotkeys() {
        if (!this.settings.options.markdownHotkeys.getValue()) {
            return;
        }
        // @ts-ignore
        hotkeys.filter = (event) => {
            return true;
        };
        // @ts-ignore
        hotkeys.deleteScope(scope);
        // @ts-ignore
        hotkeys.setScope(scope);
        for (const { key, characters, specialRemove } of this.config.getMappings(InputType.Wrap)) {
            hotkeys(key, scope, (event) => {
                event.preventDefault();
                if (!markdownHotkeys_filter(event)) {
                    return;
                }
                MarkdownFunctions.wrapSelection(event.target, characters, specialRemove);
                event.target.dispatchEvent(new Event('input', { bubbles: true }));
            });
        }
        for (const { key, characters, maxInstances } of this.config.getMappings(InputType.LineStart)) {
            hotkeys(key, scope, (event) => {
                if (!markdownHotkeys_filter(event)) {
                    return;
                }
                event.preventDefault();
                MarkdownFunctions.lineStart(event.target, characters, maxInstances);
                event.target.dispatchEvent(new Event('input', { bubbles: true }));
            });
        }
        for (const { key, characters } of this.config.getMappings(InputType.EveryLineStart)) {
            hotkeys(key, scope, (event) => {
                if (!markdownHotkeys_filter(event)) {
                    return;
                }
                event.preventDefault();
                MarkdownFunctions.insertAtEveryLine(event.target, characters);
                event.target.dispatchEvent(new Event('input', { bubbles: true }));
            });
        }
        for (const { key, characters, regex } of this.config.getMappings(InputType.Video)) {
            hotkeys(key, scope, (event) => {
                if (!markdownHotkeys_filter(event)) {
                    return;
                }
                event.preventDefault();
                MarkdownFunctions.wrapVideoLink(event.target, characters, regex);
                event.target.dispatchEvent(new Event('input', { bubbles: true }));
            });
        }
        this.#addWrapLinksHotkey();
        this.#addWrapImageHotkey();
    }
    renderSettings() {
        if (!this.settings.options.markdownHotkeys.getValue()) {
            return;
        }
        const markdownEditors = document.querySelectorAll(".markdown-editor");
        for (const markdownEditor of markdownEditors) {
            this.#renderSettingAndButton(markdownEditor);
        }
    }
    #renderSettingAndButton(markdownEditor) {
        if (markdownEditor.querySelector(".void-markdown-keybinds")) {
            return;
        }
        const settingsContainer = this.#createSettingsContainer();
        const keybindsButton = IconButton(MapIcon(), () => {
            const closed = settingsContainer.getAttribute("closed") === "true";
            settingsContainer.setAttribute("closed", (!closed).toString());
        }, "gif-button markdown-keybinds");
        keybindsButton.setAttribute("title", "Shortcuts");
        markdownEditor.append(keybindsButton);
        const parent = markdownEditor.parentNode;
        parent.insertBefore(settingsContainer, parent.querySelector(".input"));
    }
    #createSettingsContainer() {
        const container = DOM_DOM.create("div", "markdown-dialog-container");
        container.setAttribute("closed", "true");
        const header = DOM_DOM.create("div", "markdown-dialog-header", "Shortcuts");
        const body = this.#createSettingsContainerBody();
        container.append(header, body);
        return container;
    }
    #createSettingsContainerBody() {
        const body = DOM_DOM.create("div", "markdown-dialog-body");
        const grid = DOM_DOM.create("div", "markdown-shortcut-dialog");
        body.append(grid);
        for (const input of this.config.getAllMappings()) {
            const inputField = KeyInput(input.key, "markdown-mapping", () => {
                this.setupMarkdownHotkeys();
            });
            hotkeys("*", { element: inputField, scope: "markdown-mapping" }, (event) => {
                if (!markdownHotkeys_filter(event)) {
                    return;
                }
                // @ts-ignore
                const keys = hotkeys.getPressedKeyString();
                inputField.value = keys.join("+");
                this.config.saveMapping(keys.join("+"), input.description);
            });
            grid.append(DOM_DOM.create("span", null, input.description), inputField);
        }
        const resetButton = Button("Reset mappings", () => {
            if (window.confirm("Are you sure you want to reset mappings to default?")) {
                this.config.resetMappings();
                body.replaceWith(this.#createSettingsContainerBody());
            }
        });
        body.append(resetButton);
        return body;
    }
    #addWrapLinksHotkey() {
        const mapping = this.config.getMapping("Link");
        hotkeys(mapping.key, scope, (event) => {
            if (!markdownHotkeys_filter(event)) {
                return;
            }
            event.preventDefault();
            MarkdownFunctions.wrapLink(event.target);
        });
    }
    #addWrapImageHotkey() {
        const mapping = this.config.getMapping("Image");
        hotkeys(mapping.key, scope, (event) => {
            if (!markdownHotkeys_filter(event)) {
                return;
            }
            if (getSelection().toString().match(`(https?:\\/\\/.*\\.(?:${ImageFormats.join("|")}))`)) {
                event.preventDefault();
                MarkdownFunctions.wrapImage(event.target);
            }
        });
    }
}

;// CONCATENATED MODULE: ./src/libraries/lz-string.js
// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4
var LZString = (function () {
	// private property
	var f = String.fromCharCode;
	var keyStrBase64 =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var keyStrUriSafe =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
	var baseReverseDic = {};

	function getBaseValue(alphabet, character) {
		if (!baseReverseDic[alphabet]) {
			baseReverseDic[alphabet] = {};
			for (var i = 0; i < alphabet.length; i++) {
				baseReverseDic[alphabet][alphabet.charAt(i)] = i;
			}
		}
		return baseReverseDic[alphabet][character];
	}

	var LZString = {
		compressToBase64: function (input) {
			if (input == null) return "";
			var res = LZString._compress(input, 6, function (a) {
				return keyStrBase64.charAt(a);
			});
			switch (
				res.length % 4 // To produce valid Base64
			) {
				default: // When could this happen ?
				case 0:
					return res;
				case 1:
					return res + "===";
				case 2:
					return res + "==";
				case 3:
					return res + "=";
			}
		},

		decompressFromBase64: function (input) {
			if (input == null) return "";
			if (input == "") return null;
			return LZString._decompress(input.length, 32, function (index) {
				return getBaseValue(keyStrBase64, input.charAt(index));
			});
		},

		compressToUTF16: function (input) {
			if (input == null) return "";
			return (
				LZString._compress(input, 15, function (a) {
					return f(a + 32);
				}) + " "
			);
		},

		decompressFromUTF16: function (compressed) {
			if (compressed == null) return "";
			if (compressed == "") return null;
			return LZString._decompress(
				compressed.length,
				16384,
				function (index) {
					return compressed.charCodeAt(index) - 32;
				},
			);
		},

		//compress into uint8array (UCS-2 big endian format)
		compressToUint8Array: function (uncompressed) {
			var compressed = LZString.compress(uncompressed);
			var buf = new Uint8Array(compressed.length * 2); // 2 bytes per character

			for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
				var current_value = compressed.charCodeAt(i);
				buf[i * 2] = current_value >>> 8;
				buf[i * 2 + 1] = current_value % 256;
			}
			return buf;
		},

		//decompress from uint8array (UCS-2 big endian format)
		decompressFromUint8Array: function (compressed) {
			if (compressed === null || compressed === undefined) {
				return LZString.decompress(compressed);
			} else {
				var buf = new Array(compressed.length / 2); // 2 bytes per character
				for (var i = 0, TotalLen = buf.length; i < TotalLen; i++) {
					buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
				}

				var result = [];
				buf.forEach(function (c) {
					result.push(f(c));
				});
				return LZString.decompress(result.join(""));
			}
		},

		//compress into a string that is already URI encoded
		compressToEncodedURIComponent: function (input) {
			if (input == null) return "";
			return LZString._compress(input, 6, function (a) {
				return keyStrUriSafe.charAt(a);
			});
		},

		//decompress from an output of compressToEncodedURIComponent
		decompressFromEncodedURIComponent: function (input) {
			if (input == null) return "";
			if (input == "") return null;
			input = input.replace(/ /g, "+");
			return LZString._decompress(input.length, 32, function (index) {
				return getBaseValue(keyStrUriSafe, input.charAt(index));
			});
		},

		compress: function (uncompressed) {
			return LZString._compress(uncompressed, 16, function (a) {
				return f(a);
			});
		},
		_compress: function (uncompressed, bitsPerChar, getCharFromInt) {
			if (uncompressed == null) return "";
			var i,
				value,
				context_dictionary = {},
				context_dictionaryToCreate = {},
				context_c = "",
				context_wc = "",
				context_w = "",
				context_enlargeIn = 2, // Compensate for the first entry which should not count
				context_dictSize = 3,
				context_numBits = 2,
				context_data = [],
				context_data_val = 0,
				context_data_position = 0,
				ii;

			for (ii = 0; ii < uncompressed.length; ii += 1) {
				context_c = uncompressed.charAt(ii);
				if (
					!Object.prototype.hasOwnProperty.call(
						context_dictionary,
						context_c,
					)
				) {
					context_dictionary[context_c] = context_dictSize++;
					context_dictionaryToCreate[context_c] = true;
				}

				context_wc = context_w + context_c;
				if (
					Object.prototype.hasOwnProperty.call(
						context_dictionary,
						context_wc,
					)
				) {
					context_w = context_wc;
				} else {
					if (
						Object.prototype.hasOwnProperty.call(
							context_dictionaryToCreate,
							context_w,
						)
					) {
						if (context_w.charCodeAt(0) < 256) {
							for (i = 0; i < context_numBits; i++) {
								context_data_val = context_data_val << 1;
								if (context_data_position == bitsPerChar - 1) {
									context_data_position = 0;
									context_data.push(
										getCharFromInt(context_data_val),
									);
									context_data_val = 0;
								} else {
									context_data_position++;
								}
							}
							value = context_w.charCodeAt(0);
							for (i = 0; i < 8; i++) {
								context_data_val =
									(context_data_val << 1) | (value & 1);
								if (context_data_position == bitsPerChar - 1) {
									context_data_position = 0;
									context_data.push(
										getCharFromInt(context_data_val),
									);
									context_data_val = 0;
								} else {
									context_data_position++;
								}
								value = value >> 1;
							}
						} else {
							value = 1;
							for (i = 0; i < context_numBits; i++) {
								context_data_val =
									(context_data_val << 1) | value;
								if (context_data_position == bitsPerChar - 1) {
									context_data_position = 0;
									context_data.push(
										getCharFromInt(context_data_val),
									);
									context_data_val = 0;
								} else {
									context_data_position++;
								}
								value = 0;
							}
							value = context_w.charCodeAt(0);
							for (i = 0; i < 16; i++) {
								context_data_val =
									(context_data_val << 1) | (value & 1);
								if (context_data_position == bitsPerChar - 1) {
									context_data_position = 0;
									context_data.push(
										getCharFromInt(context_data_val),
									);
									context_data_val = 0;
								} else {
									context_data_position++;
								}
								value = value >> 1;
							}
						}
						context_enlargeIn--;
						if (context_enlargeIn == 0) {
							context_enlargeIn = Math.pow(2, context_numBits);
							context_numBits++;
						}
						delete context_dictionaryToCreate[context_w];
					} else {
						value = context_dictionary[context_w];
						for (i = 0; i < context_numBits; i++) {
							context_data_val =
								(context_data_val << 1) | (value & 1);
							if (context_data_position == bitsPerChar - 1) {
								context_data_position = 0;
								context_data.push(
									getCharFromInt(context_data_val),
								);
								context_data_val = 0;
							} else {
								context_data_position++;
							}
							value = value >> 1;
						}
					}
					context_enlargeIn--;
					if (context_enlargeIn == 0) {
						context_enlargeIn = Math.pow(2, context_numBits);
						context_numBits++;
					}
					// Add wc to the dictionary.
					context_dictionary[context_wc] = context_dictSize++;
					context_w = String(context_c);
				}
			}

			// Output the code for w.
			if (context_w !== "") {
				if (
					Object.prototype.hasOwnProperty.call(
						context_dictionaryToCreate,
						context_w,
					)
				) {
					if (context_w.charCodeAt(0) < 256) {
						for (i = 0; i < context_numBits; i++) {
							context_data_val = context_data_val << 1;
							if (context_data_position == bitsPerChar - 1) {
								context_data_position = 0;
								context_data.push(
									getCharFromInt(context_data_val),
								);
								context_data_val = 0;
							} else {
								context_data_position++;
							}
						}
						value = context_w.charCodeAt(0);
						for (i = 0; i < 8; i++) {
							context_data_val =
								(context_data_val << 1) | (value & 1);
							if (context_data_position == bitsPerChar - 1) {
								context_data_position = 0;
								context_data.push(
									getCharFromInt(context_data_val),
								);
								context_data_val = 0;
							} else {
								context_data_position++;
							}
							value = value >> 1;
						}
					} else {
						value = 1;
						for (i = 0; i < context_numBits; i++) {
							context_data_val = (context_data_val << 1) | value;
							if (context_data_position == bitsPerChar - 1) {
								context_data_position = 0;
								context_data.push(
									getCharFromInt(context_data_val),
								);
								context_data_val = 0;
							} else {
								context_data_position++;
							}
							value = 0;
						}
						value = context_w.charCodeAt(0);
						for (i = 0; i < 16; i++) {
							context_data_val =
								(context_data_val << 1) | (value & 1);
							if (context_data_position == bitsPerChar - 1) {
								context_data_position = 0;
								context_data.push(
									getCharFromInt(context_data_val),
								);
								context_data_val = 0;
							} else {
								context_data_position++;
							}
							value = value >> 1;
						}
					}
					context_enlargeIn--;
					if (context_enlargeIn == 0) {
						context_enlargeIn = Math.pow(2, context_numBits);
						context_numBits++;
					}
					delete context_dictionaryToCreate[context_w];
				} else {
					value = context_dictionary[context_w];
					for (i = 0; i < context_numBits; i++) {
						context_data_val =
							(context_data_val << 1) | (value & 1);
						if (context_data_position == bitsPerChar - 1) {
							context_data_position = 0;
							context_data.push(getCharFromInt(context_data_val));
							context_data_val = 0;
						} else {
							context_data_position++;
						}
						value = value >> 1;
					}
				}
				context_enlargeIn--;
				if (context_enlargeIn == 0) {
					context_enlargeIn = Math.pow(2, context_numBits);
					context_numBits++;
				}
			}

			// Mark the end of the stream
			value = 2;
			for (i = 0; i < context_numBits; i++) {
				context_data_val = (context_data_val << 1) | (value & 1);
				if (context_data_position == bitsPerChar - 1) {
					context_data_position = 0;
					context_data.push(getCharFromInt(context_data_val));
					context_data_val = 0;
				} else {
					context_data_position++;
				}
				value = value >> 1;
			}

			// Flush the last char
			while (true) {
				context_data_val = context_data_val << 1;
				if (context_data_position == bitsPerChar - 1) {
					context_data.push(getCharFromInt(context_data_val));
					break;
				} else context_data_position++;
			}
			return context_data.join("");
		},

		decompress: function (compressed) {
			if (compressed == null) return "";
			if (compressed == "") return null;
			return LZString._decompress(
				compressed.length,
				32768,
				function (index) {
					return compressed.charCodeAt(index);
				},
			);
		},

		_decompress: function (length, resetValue, getNextValue) {
			var dictionary = [],
				next,
				enlargeIn = 4,
				dictSize = 4,
				numBits = 3,
				entry = "",
				result = [],
				i,
				w,
				bits,
				resb,
				maxpower,
				power,
				c,
				data = { val: getNextValue(0), position: resetValue, index: 1 };

			for (i = 0; i < 3; i += 1) {
				dictionary[i] = i;
			}

			bits = 0;
			maxpower = Math.pow(2, 2);
			power = 1;
			while (power != maxpower) {
				resb = data.val & data.position;
				data.position >>= 1;
				if (data.position == 0) {
					data.position = resetValue;
					data.val = getNextValue(data.index++);
				}
				bits |= (resb > 0 ? 1 : 0) * power;
				power <<= 1;
			}

			switch ((next = bits)) {
				case 0:
					bits = 0;
					maxpower = Math.pow(2, 8);
					power = 1;
					while (power != maxpower) {
						resb = data.val & data.position;
						data.position >>= 1;
						if (data.position == 0) {
							data.position = resetValue;
							data.val = getNextValue(data.index++);
						}
						bits |= (resb > 0 ? 1 : 0) * power;
						power <<= 1;
					}
					c = f(bits);
					break;
				case 1:
					bits = 0;
					maxpower = Math.pow(2, 16);
					power = 1;
					while (power != maxpower) {
						resb = data.val & data.position;
						data.position >>= 1;
						if (data.position == 0) {
							data.position = resetValue;
							data.val = getNextValue(data.index++);
						}
						bits |= (resb > 0 ? 1 : 0) * power;
						power <<= 1;
					}
					c = f(bits);
					break;
				case 2:
					return "";
			}
			dictionary[3] = c;
			w = c;
			result.push(c);
			while (true) {
				if (data.index > length) {
					return "";
				}

				bits = 0;
				maxpower = Math.pow(2, numBits);
				power = 1;
				while (power != maxpower) {
					resb = data.val & data.position;
					data.position >>= 1;
					if (data.position == 0) {
						data.position = resetValue;
						data.val = getNextValue(data.index++);
					}
					bits |= (resb > 0 ? 1 : 0) * power;
					power <<= 1;
				}

				switch ((c = bits)) {
					case 0:
						bits = 0;
						maxpower = Math.pow(2, 8);
						power = 1;
						while (power != maxpower) {
							resb = data.val & data.position;
							data.position >>= 1;
							if (data.position == 0) {
								data.position = resetValue;
								data.val = getNextValue(data.index++);
							}
							bits |= (resb > 0 ? 1 : 0) * power;
							power <<= 1;
						}

						dictionary[dictSize++] = f(bits);
						c = dictSize - 1;
						enlargeIn--;
						break;
					case 1:
						bits = 0;
						maxpower = Math.pow(2, 16);
						power = 1;
						while (power != maxpower) {
							resb = data.val & data.position;
							data.position >>= 1;
							if (data.position == 0) {
								data.position = resetValue;
								data.val = getNextValue(data.index++);
							}
							bits |= (resb > 0 ? 1 : 0) * power;
							power <<= 1;
						}
						dictionary[dictSize++] = f(bits);
						c = dictSize - 1;
						enlargeIn--;
						break;
					case 2:
						return result.join("");
				}

				if (enlargeIn == 0) {
					enlargeIn = Math.pow(2, numBits);
					numBits++;
				}

				if (dictionary[c]) {
					entry = dictionary[c];
				} else {
					if (c === dictSize) {
						entry = w + w.charAt(0);
					} else {
						return null;
					}
				}
				result.push(entry);

				// Add w+entry[0] to the dictionary.
				dictionary[dictSize++] = w + entry.charAt(0);
				enlargeIn--;

				w = entry;

				if (enlargeIn == 0) {
					enlargeIn = Math.pow(2, numBits);
					numBits++;
				}
			}
		},
	};
	return LZString;
})();

/* harmony default export */ const lz_string = (LZString);

;// CONCATENATED MODULE: ./src/utils/objectDecoder.ts

class ObjectDecoder {
    static decodeStringToObject(value) {
        let json = (value || "").match(/^\[\]\(json([A-Za-z0-9+/=]+)\)/);
        if (!json) {
            return {
                customCss: "",
            };
        }
        let jsonData;
        try {
            jsonData = JSON.parse(atob(json[1]));
        }
        catch (e) {
            jsonData = JSON.parse(lz_string.decompressFromBase64(json[1]));
        }
        return jsonData;
    }
    static insertJsonToUserBio(about, json) {
        const compressedJson = lz_string.compressToBase64(JSON.stringify(json));
        const target = about.match(/^\[\]\(json([A-Za-z0-9+/=]+)\)/)?.[1];
        if (target) {
            about = about.replace(target, compressedJson);
        }
        else {
            about = `[](json${compressedJson})\n\n` + about;
        }
        return about;
    }
}

;// CONCATENATED MODULE: ./src/utils/common.ts
class Common {
    static isProfile() {
        return window.location.pathname.startsWith("/user/");
    }
    static isOverview() {
        return window.location.pathname.match(/^\/user\/([^/]*)\/$/);
    }
    static getUserNameFromUrl() {
        return window.location.pathname.match(/^\/user\/([^/]*)\/?/)[1];
    }
    static waitToRender(querySelector, renderer) {
        const elementToWait = document.querySelector(querySelector);
        if (!elementToWait) {
            setTimeout(() => {
                this.waitToRender(querySelector, renderer);
            }, 250);
        }
        else {
            renderer(elementToWait);
        }
    }
    static getDayDifference(date1, date2) {
        return Math.round((date2 - date1) / (1000 * 60 * 60 * 24));
    }
    static compareDates(a, b) {
        if (a > b) {
            return -1;
        }
        else if (a < b) {
            return 1;
        }
        return 0;
    }
}

;// CONCATENATED MODULE: ./src/handlers/goalsHandler.ts









const goalTypes = {
    completedAnime: "Completed Anime",
    completedMovies: "Completed Movies",
    completedSeries: "Completed Series",
    watchedEpisodes: "Watched Episodes",
    watchedHours: "Hours Watched",
    completedManga: "Completed Manga",
    completedNovels: "Completed Light Novels",
    readMangaChapters: "Manga Chapters",
    readNovelChapters: "Light Novel Chapters",
    readMangaVolumes: "Manga Volumes",
    readNovelVolumes: "Light Novel Volumes"
};
const initialForm = {
    type: "completedAnime",
    name: "",
    target: 1,
    startAt: "",
    endAt: ""
};
const localStorageKey = LocalStorageKeys.goalsConfig;
class GoalsHandler {
    static #goalForm = { ...initialForm };
    static #goals;
    static initialize() {
        this.#goals = JSON.parse(localStorage.getItem(localStorageKey)) ?? [];
    }
    static renderSettings() {
        const container = DOM_DOM.createDiv("goals-settings");
        this.#goalForm = { ...initialForm };
        this.#renderSettingsContainer(container);
        return container;
    }
    static removeGoalsContainer() {
        document.querySelector("void-goals-container")?.remove();
    }
    static async renderGoals() {
        if (!StaticSettings.options.goalsEnabled.getValue()) {
            return;
        }
        if (!Common.isOverview()) {
            return;
        }
        const username = Common.getUserNameFromUrl();
        if (!username) {
            return;
        }
        Toaster.debug("Querying user goals.");
        let goals;
        let media;
        let mangaMedia;
        const filterByDate = new Date();
        filterByDate.setDate(filterByDate.getDate() + 7);
        try {
            const data = await AnilistAPI.getUserMediaListCollection(username, "ANIME");
            const about = data.MediaListCollection.user.about;
            const json = ObjectDecoder.decodeStringToObject(about);
            goals = json?.goals;
            if (!goals) {
                return;
            }
            goals = goals.filter(x => new Date(x.endAt) > filterByDate);
            media = data.MediaListCollection.lists.map(list => list.entries).flat(1);
            if (goals?.some(goal => this.#isMangaGoal(goal.type))) {
                Toaster.debug("User has manga goals. Querying manga list.");
                const mangaData = await AnilistAPI.getUserMediaListCollection(username, "MANGA");
                mangaMedia = mangaData.MediaListCollection.lists.map(list => list.entries).flat(1);
            }
        }
        catch (error) {
            Toaster.error("Failed to query user goals.", error);
            return;
        }
        const desktopContainer = DOM_DOM.create("div", "goals-container");
        const goalsToDisplay = goals
            .sort((a, b) => Common.compareDates(new Date(a.endAt), new Date(b.endAt))).slice(0, 6);
        if (goalsToDisplay.length > 0) {
            const header = DOM_DOM.create("h2", null, "Goals", { className: "section-header" });
            const container = DOM_DOM.create("div", "goals-wrap");
            for (const goal of goalsToDisplay) {
                const goalContainer = DOM_DOM.create("div");
                goalContainer.append(DOM_DOM.create("div", "goal-title", goal.name));
                const progress = this.#getGoalProgress(goal, this.#isMangaGoal(goal.type) ? mangaMedia : media);
                goalContainer.append(DOM_DOM.create("div", "goal-description", this.#getGoalDescription(goal, progress)));
                goalContainer.append(DOM_DOM.create("div", "milestones", [
                    DOM_DOM.create("div", "milestone", "0"),
                    DOM_DOM.create("div", "milestone", Math.floor(goal.target / 2)),
                    DOM_DOM.create("div", "milestone", goal.target)
                ]));
                const progressBar = DOM_DOM.create("div", "progress", DOM_DOM.create("div", "bar", null, {
                    style: `width: ${progress / goal.target * 100}%`
                }));
                goalContainer.append(Tooltip(`Progress: ${progress}`, progressBar));
                container.append(goalContainer);
            }
            desktopContainer.append(header, container);
        }
        Common.waitToRender(".overview .section:last-child :first-child", (sibling) => {
            sibling.after(desktopContainer);
        });
    }
    static #isMangaGoal(type) {
        switch (type) {
            case "completedManga":
            case "completedNovels":
            case "readMangaChapters":
            case "readNovelChapters":
            case "readMangaVolumes":
            case "readNovelVolumes":
                return true;
            default:
                return false;
        }
    }
    static #getGoalDescription(goal, progress) {
        const [progressDifference, scheduleDescription] = this.#getSchedule(goal, progress);
        switch (goal.type) {
            case "completedAnime":
                return `Watch ${goal.target} anime by ${new Date(goal.endAt).toDateString()}.
				You are ${progressDifference} anime ${scheduleDescription}.`;
            case "completedMovies":
                return `Watch ${goal.target} movies by ${new Date(goal.endAt).toDateString()}.
				You are ${progressDifference} movies ${scheduleDescription}.`;
                break;
            case "completedSeries":
                return `Watch ${goal.target} series by ${new Date(goal.endAt).toDateString()}.
				You are ${progressDifference} series ${scheduleDescription}.`;
            case "watchedEpisodes":
                return `Watch ${goal.target} episodes by ${new Date(goal.endAt).toDateString()}.
				You are ${progressDifference} episodes ${scheduleDescription}.`;
            case "watchedHours":
                return `Watch ${goal.target} hours by ${new Date(goal.endAt).toDateString()}.
				You are ${progressDifference} hours ${scheduleDescription}.`;
            case "completedManga":
                return `Complete ${goal.target} manga by ${new Date(goal.endAt).toDateString()}.
				You are ${progressDifference} manga ${scheduleDescription}.`;
            case "completedNovels":
                return `Complete ${goal.target} light novels by ${new Date(goal.endAt).toDateString()}.
				You are ${progressDifference} light novels ${scheduleDescription}.`;
            case "readMangaChapters":
                return `Read ${goal.target} chapters of manga by ${new Date(goal.endAt).toDateString()}.
				You are ${progressDifference} chapters ${scheduleDescription}.`;
            case "readNovelChapters":
                return `Read ${goal.target} chapters of light novels by ${new Date(goal.endAt).toDateString()}.
				You are ${progressDifference} chapters ${scheduleDescription}.`;
            case "readMangaVolumes":
                return `Read ${goal.target} volumes of manga by ${new Date(goal.endAt).toDateString()}.
				You are ${progressDifference} volumes ${scheduleDescription}.`;
            case "readNovelVolumes":
                return `Read ${goal.target} volumes of light novels by ${new Date(goal.endAt).toDateString()}.
				You are ${progressDifference} volumes ${scheduleDescription}.`;
        }
    }
    static #getSchedule(goal, progress) {
        const goalStart = new Date(goal.startAt);
        const goalEnd = new Date(goal.endAt);
        const dayDifference = Common.getDayDifference(goalStart, goalEnd);
        const desiredDailyProgress = goal.target / dayDifference;
        const currentDate = new Date();
        const currentDayDifference = Common.getDayDifference(goalStart, currentDate > goalEnd ? goalEnd : currentDate);
        const desiredCurrentProgress = Math.floor(desiredDailyProgress * currentDayDifference);
        return [progress < desiredCurrentProgress ? desiredCurrentProgress - progress : progress - desiredCurrentProgress,
            progress < desiredCurrentProgress ? "behind schedule" : "ahead of schedule"];
    }
    static #getGoalProgress(goal, media) {
        let mediaCopy = [...media];
        switch (goal.type) {
            case "completedAnime":
                break;
            case "completedMovies":
                mediaCopy = mediaCopy.filter(entry => entry.media.format === "MOVIE");
                break;
            case "completedSeries":
            case "watchedEpisodes":
                mediaCopy = mediaCopy.filter(entry => entry.media.format === "TV" || entry.media.format === "TV_SHORT"
                    || entry.media.format === "OVA" || entry.media.format === "ONA");
                break;
            case "watchedHours":
                break;
            case "completedManga":
            case "readMangaChapters":
            case "readMangaVolumes":
                mediaCopy = mediaCopy.filter(entry => entry.media.format === "MANGA" || entry.media.format === "ONE_SHOT");
                break;
            case "completedNovels":
            case "readNovelChapters":
            case "readNovelVolumes":
                mediaCopy = mediaCopy.filter(entry => entry.media.format === "NOVEL");
                break;
        }
        const progress = this.#calculateGoalProgress(goal, mediaCopy);
        return progress;
    }
    static #calculateGoalProgress(goal, media) {
        let progress = 0;
        const goalStart = new Date(goal.startAt);
        const goalEnd = new Date(goal.endAt);
        switch (goal.type) {
            case "watchedEpisodes":
            case "readMangaChapters":
            case "readNovelChapters":
                for (const entry of media) {
                    const completedAt = new Date(`${entry.completedAt.year}-${entry.completedAt.month}-${entry.completedAt.day}`);
                    const startedAt = new Date(`${entry.startedAt.year}-${entry.startedAt.month}-${entry.startedAt.day}`);
                    if ((goalStart <= completedAt && goalEnd >= completedAt) ||
                        (goalStart <= startedAt && goalEnd >= startedAt)) {
                        progress += entry.progress;
                    }
                }
                break;
            case "readMangaVolumes":
            case "readNovelVolumes":
                for (const entry of media) {
                    const completedAt = new Date(`${entry.completedAt.year}-${entry.completedAt.month}-${entry.completedAt.day}`);
                    const startedAt = new Date(`${entry.startedAt.year}-${entry.startedAt.month}-${entry.startedAt.day}`);
                    if ((goalStart <= completedAt && goalEnd >= completedAt) ||
                        (goalStart <= startedAt && goalEnd >= startedAt)) {
                        progress += entry.progressVolumes;
                    }
                }
                break;
            case "watchedHours":
                for (const entry of media) {
                    const completedAt = new Date(`${entry.completedAt.year}-${entry.completedAt.month}-${entry.completedAt.day}`);
                    const startedAt = new Date(`${entry.startedAt.year}-${entry.startedAt.month}-${entry.startedAt.day}`);
                    if ((goalStart <= completedAt && goalEnd >= completedAt) ||
                        (goalStart <= startedAt && goalEnd >= startedAt)) {
                        progress += entry.media.duration * entry.progress;
                    }
                }
                return Math.floor(progress / 60);
                break;
            default:
                for (const entry of media) {
                    const completedAt = new Date(`${entry.completedAt.year}-${entry.completedAt.month}-${entry.completedAt.day}`);
                    if (goalStart <= completedAt && goalEnd >= completedAt) {
                        progress++;
                    }
                }
        }
        return progress;
    }
    static #renderSettingsContainer(container) {
        container.replaceChildren();
        const header = DOM_DOM.create("h3", null, "Goals");
        container.append(header);
        container.append(DOM_DOM.create("p", null, "Your goals will be visible on your profile overview. " +
            "They will be ordered by their end date. Only the first six goals will be visible. " +
            "Goals will be visible for seven days after their end date."));
        container.append(this.#renderForm());
        container.append(this.#renderSettingsGoalsList());
        const saveButton = Button("Save", async function () {
            await this.#saveGoals();
        }.bind(this), "success");
        container.append(saveButton);
        const fetchButton = Button("Fetch current", async function () {
            await this.#fetchGoals();
            this.#renderSettingsContainer(container);
        }.bind(this));
        container.append(fetchButton);
        container.append(Note("Please note that AniList doesn't provide a perfect history. " +
            "VoidVerified does it's best to guesstimate the goal progress for you. " +
            "This is done by checking the end dates of your list entries. Some goal types also use start date."));
    }
    static #renderSettingsGoalsList() {
        const container = DOM_DOM.create("table", "table w-100");
        const tableHeader = DOM_DOM.create("tr", null, [
            DOM_DOM.create("th", null, "Name"),
            DOM_DOM.create("th", null, "Type"),
            DOM_DOM.create("th", null, "Start"),
            DOM_DOM.create("th", null, "End"),
            DOM_DOM.create("th", null, "Target"),
            DOM_DOM.create("th", null, "")
        ]);
        container.append(DOM_DOM.create("thead", null, tableHeader));
        const body = DOM_DOM.create("tbody");
        for (const goal of this.#goals) {
            const row = DOM_DOM.create("tr", null, [
                DOM_DOM.create("td", null, goal.name),
                DOM_DOM.create("td", null, goalTypes[goal.type]),
                DOM_DOM.create("td", null, goal.startAt),
                DOM_DOM.create("td", null, goal.endAt),
                DOM_DOM.create("td", null, goal.target),
                DOM_DOM.create("td", null, IconButton(TrashcanIcon(), () => {
                    this.#goals = this.#goals.filter(g => g.id !== goal.id);
                    localStorage.setItem(localStorageKey, JSON.stringify(this.#goals));
                    this.#renderSettingsContainer(container.parentElement);
                }))
            ]);
            body.append(row);
        }
        container.append(body);
        return container;
    }
    static #renderForm() {
        const container = DOM_DOM.create("div", "goal-form");
        container.append(Label("Name", InputField(this.#goalForm.name, (event) => {
            this.#goalForm.name = event.target.value;
        }, null, {
            maxlength: 60,
            type: "text"
        })));
        container.append(Label("Target", InputField(this.#goalForm.target, (event) => {
            this.#goalForm.target = event.target.value;
        }, null, {
            type: "number",
            min: 1
        })));
        container.append(Label("Start", InputField(this.#goalForm.startAt, (event) => {
            this.#goalForm.startAt = event.target.value;
        }, null, {
            type: "date"
        })));
        container.append(Label("End", InputField(this.#goalForm.endAt, (event) => {
            this.#goalForm.endAt = event.target.value;
        }, null, {
            type: "date"
        })));
        const typeOptions = Object.entries(goalTypes).map(([key, value]) => Option(value, key === this.#goalForm.type, () => {
            this.#goalForm.type = key;
            this.#renderSettingsContainer(container.parentElement);
        }));
        container.append(Label("Type", Select(typeOptions)));
        container.append(Button("Add Goal", () => {
            if (this.#validateGoal(this.#goalForm)) {
                return;
            }
            this.#goals.push({
                ...this.#goalForm,
                id: Math.random()
            });
            localStorage.setItem(localStorageKey, JSON.stringify(this.#goals));
            this.#goalForm = { ...initialForm };
            this.#renderSettingsContainer(container.parentElement);
        }));
        return container;
    }
    static #validateGoal(goal) {
        let hasErrors = false;
        if (goal.name === "") {
            Toaster.critical("Goal name is missing.");
            hasErrors = true;
        }
        if (goal.startAt === "") {
            Toaster.critical("Goal start date is missing.");
            hasErrors = true;
        }
        if (goal.endAt === "") {
            Toaster.critical("Goal end date is missing.");
            hasErrors = true;
        }
        if (new Date(goal.startAt) > new Date(goal.endAt)) {
            Toaster.critical("Start date after end date.");
            hasErrors = true;
        }
        return hasErrors;
    }
    static async #saveGoals() {
        try {
            Toaster.debug("Querying API for bio and saving goals.");
            const about = await AnilistAPI.getUserAbout(StaticSettings.settingsInstance.anilistUser);
            const aboutJson = ObjectDecoder.decodeStringToObject(about);
            aboutJson.goals = this.#goals;
            const newAbout = ObjectDecoder.insertJsonToUserBio(about, aboutJson);
            await AnilistAPI.saveUserAbout(newAbout);
            Toaster.success("Saved goals.");
        }
        catch (error) {
            Toaster.error("Failed to save goals.", error);
        }
    }
    static async #fetchGoals() {
        try {
            Toaster.debug("Fetching goals.");
            const about = await AnilistAPI.getUserAbout(StaticSettings.settingsInstance.anilistUser);
            const aboutJson = ObjectDecoder.decodeStringToObject(about);
            if (aboutJson.goals) {
                this.#goals = aboutJson.goals;
                localStorage.setItem(localStorageKey, JSON.stringify(this.#goals));
                Toaster.success("Fetched goals,");
            }
            else {
                Toaster.success("You had no goals saved.");
            }
        }
        catch (error) {
            Toaster.error("Failed to fetch goals.", error);
        }
    }
}

;// CONCATENATED MODULE: ./src/handlers/miniProfileHandler.ts








class MiniProfileHandler {
    static miniProfileContainer;
    static queryInProgress = false;
    static isVisible = false;
    static config;
    static initialize() {
        this.miniProfileContainer = DOM_DOM.create("div", "mini-profile-container mini-profile-hidden");
        this.miniProfileContainer.addEventListener("mouseover", () => {
            this.isVisible = true;
            this.showMiniProfile();
        });
        this.miniProfileContainer.addEventListener("mouseleave", () => {
            this.hideMiniProfile();
        });
        document.body.append(this.miniProfileContainer);
        this.config = new MiniProfileConfig();
    }
    static addUserHoverListeners() {
        if (!StaticSettings.options.miniProfileEnabled.getValue()) {
            return;
        }
        let elements = [...document.querySelectorAll('.activity-entry a.name:not([void-mini="true"])')];
        if (this.config.hoverTags) {
            elements = [...elements, ...document.querySelectorAll('.markdown a[href^="/user/"]:not([void-mini="true"])')];
        }
        for (const element of elements) {
            element.addEventListener("mouseover", () => {
                this.isVisible = true;
                setTimeout(() => {
                    if (!this.isVisible) {
                        return;
                    }
                    this.#hoverUser(element);
                }, 100);
            });
            element.addEventListener("mouseleave", () => {
                this.hideMiniProfile();
            });
            element.addEventListener("click", () => {
                this.hideMiniProfile();
            });
            element.setAttribute("void-mini", "true");
        }
    }
    static async #hoverUser(element) {
        this.miniProfileContainer.replaceChildren();
        if (this.queryInProgress) {
            return;
        }
        let user = null;
        const username = element.innerHTML.trim().replace("@", "");
        try {
            const cachedUser = MiniProfileCache.getUser(username);
            if (cachedUser) {
                user = cachedUser;
            }
            else {
                Toaster.debug("Querying mini profile data.");
                this.queryInProgress = true;
                const data = await AnilistAPI.getMiniProfile(username, this.config.numberOfFavourites);
                if (data === null) {
                    return;
                }
                user = this.addMissingTypes(data);
                MiniProfileCache.addUser(user);
            }
        }
        catch (error) {
            Toaster.error(`Failed to query mini profile data for ${username}`, error);
            return;
        }
        finally {
            this.queryInProgress = false;
        }
        this.miniProfileContainer.style.backgroundImage = `url(${user.bannerImage})`;
        this.miniProfileContainer.style.setProperty("--color-blue", ColorFunctions.handleAnilistColor(user.options.profileColor));
        this.createHeader(user);
        this.createContent(user);
        const elementRect = element.getBoundingClientRect();
        const containerRect = this.miniProfileContainer.getBoundingClientRect();
        this.miniProfileContainer.style.left = `${elementRect.left + window.scrollX + elementRect.width}px`;
        this.miniProfileContainer.style.maxWidth = `${window.innerWidth - elementRect.right - 30}px`;
        if (this.config.position === "top") {
            this.miniProfileContainer.style.top = `${elementRect.top + window.scrollY + elementRect.height - containerRect.height}px`;
        }
        else if (this.config.position === "center") {
            this.miniProfileContainer.style.top = `${elementRect.top + window.scrollY + (elementRect.height / 2) - (containerRect.height / 2)}px`;
        }
        else {
            this.miniProfileContainer.style.top = `${elementRect.top + window.scrollY}px`;
        }
        this.showMiniProfile();
    }
    static addMissingTypes(data) {
        data?.favourites?.characters?.nodes.forEach(character => {
            character["type"] = "character";
        });
        data?.favourites?.staff?.nodes.forEach(staff => {
            staff["type"] = "staff";
        });
        return data;
    }
    static createHeader(user) {
        const header = DOM_DOM.create("div", "mini-profile-header");
        const avatar = DOM_DOM.create("a", "mini-profile-avatar");
        avatar.style.backgroundImage = `url(${user.avatar.large})`;
        header.append(avatar);
        const name = DOM_DOM.create("div", "mini-profile-username", user.name);
        header.append(name);
        this.handleFollowBadge(user, header);
        if (user.donatorTier > 0) {
            const donatorBadge = DOM_DOM.create("div", "mini-profile-donator-badge", user.donatorTier > 3 ? user.donatorBadge : "Donator");
            if (user.donatorTier > 4) {
                donatorBadge.classList.add("void-mini-profile-donator-rainbow-badge");
            }
            header.append(donatorBadge);
        }
        this.miniProfileContainer.append(header);
    }
    static handleFollowBadge(user, header) {
        if (!user.isFollower && !user.isFollowing) {
            return;
        }
        let text = "";
        if (user.isFollower && user.isFollowing) {
            text = "Mutuals";
        }
        else if (user.isFollower) {
            text = "Follows you";
        }
        else {
            text = "Followed";
        }
        const followsYou = DOM_DOM.create("div", " mini-profile-donator-badge mini-profile-follow-badge", text);
        followsYou.style.backgroundColor = `rgba(${ColorFunctions.handleAnilistColor(user.options.profileColor)}, .8)`;
        header.append(followsYou);
    }
    static createContent(user) {
        const content = DOM_DOM.create("div", "mini-profile-content-container");
        if (this.config.displayAnime && user.favourites.anime.nodes.length > 0) {
            content.append(this.addFavourites(user.favourites.anime.nodes));
        }
        if (this.config.displayManga && user.favourites.manga.nodes.length > 0) {
            content.append(this.addFavourites(user.favourites.manga.nodes));
        }
        if (this.config.displayCharacters && user.favourites.characters.nodes.length > 0) {
            content.append(this.addFavourites(user.favourites.characters.nodes));
        }
        if (this.config.displayStaff && user.favourites.staff.nodes.length > 0) {
            content.append(this.addFavourites(user.favourites.staff.nodes));
        }
        if (this.config.displayBio && user.about?.length > 0) {
            content.prepend(this.addBio(user));
        }
        this.miniProfileContainer.append(content);
    }
    static addFavourites(favourites) {
        const favouritesContainer = DOM_DOM.create("div", "mini-profile-section");
        for (const favourite of favourites) {
            const cover = DOM_DOM.create("a", "mini-profile-favourite");
            cover.href = `/${favourite.type.toLowerCase()}/${favourite.id}`;
            cover.style.backgroundImage = `url(${favourite.coverImage?.large ?? favourite.image?.large})`;
            if (favourite.isFavourite) {
                cover.classList.add("void-mini-profile-favourited");
            }
            favouritesContainer.append(Tooltip(favourite.title?.userPreferred ?? favourite.name?.userPreferred, cover));
        }
        return favouritesContainer;
    }
    static addBio(user) {
        const rect = this.miniProfileContainer.getBoundingClientRect();
        const bioMaxWidth = Math.max(rect.width, 500);
        const markdown = DOM_DOM.createDiv(".markdown");
        markdown.innerHTML = Markdown.parse(user.about);
        Markdown.applyFunctions(markdown);
        const container = DOM_DOM.create("div", "mini-profile-section mini-profile-about", markdown);
        container.setAttribute("style", `max-width: ${bioMaxWidth}px`);
        return container;
    }
    static showMiniProfile() {
        if (!this.isVisible) {
            return;
        }
        this.miniProfileContainer.classList.remove("void-mini-profile-hidden");
    }
    static hideMiniProfile() {
        this.isVisible = false;
        setTimeout(() => {
            if (!this.isVisible) {
                this.miniProfileContainer.classList.add("void-mini-profile-hidden");
            }
        }, 300);
    }
    static renderSettings() {
        const container = DOM_DOM.createDiv();
        this.renderSettingsContainer(container, new MiniProfileConfig());
        return container;
    }
    static renderSettingsContainer(container, config) {
        container.replaceChildren();
        container.append(DOM_DOM.create("h3", null, "Mini Profile Configuration"));
        const positionOptions = ["top", "center", "bottom"].map(position => Option(position, config.position === position, () => {
            config.position = position;
            config.save();
            this.renderSettingsContainer(container, config);
        }));
        const positionSelect = Select(positionOptions);
        container.append(Label("Position", positionSelect));
        const numberOfFavourites = RangeField(config.numberOfFavourites, (event) => {
            config.numberOfFavourites = +event.target.value;
            config.save();
            MiniProfileCache.clearCache();
        }, 25, 1, 1);
        container.append(Label("Number of favourites", numberOfFavourites));
        const hoverTagsCheckbox = Checkbox(config.hoverTags, (event) => {
            config.hoverTags = event.target.checked;
            config.save();
        });
        container.append(Label("Show when hovering @", hoverTagsCheckbox));
        const bioCheckBox = Checkbox(config.displayBio, (event) => {
            config.displayBio = event.target.checked;
            config.save();
        });
        const animeCheckbox = Checkbox(config.displayAnime, (event) => {
            config.displayAnime = event.target.checked;
            config.save();
        });
        const mangaCheckBox = Checkbox(config.displayManga, (event) => {
            config.displayManga = event.target.checked;
            config.save();
        });
        const charactersCheckBox = Checkbox(config.displayCharacters, (event) => {
            config.displayCharacters = event.target.checked;
            config.save();
        });
        const staffCheckbox = Checkbox(config.displayStaff, (event) => {
            config.displayStaff = event.target.checked;
            config.save();
        });
        container.append(Label("Display bio", bioCheckBox));
        container.append(Label("Display anime favourites", animeCheckbox));
        container.append(Label("Display manga favourites ", mangaCheckBox));
        container.append(Label("Display character favourites ", charactersCheckBox));
        container.append(Label("Display staff favourites", staffCheckbox));
    }
}
class MiniProfileCache {
    static #localStorage = LocalStorageKeys.miniProfileCache;
    static getUser(username) {
        const cache = this.#getCache();
        const user = cache.find(x => x.name === username);
        if (!user) {
            return;
        }
        const cachedAt = new Date(user.cachedAt);
        cachedAt.setHours(cachedAt.getHours() + 12);
        if (cachedAt < new Date()) {
            this.#removeUser(user);
            return null;
        }
        return user;
    }
    static addUser(user) {
        const cache = this.#getCache();
        if (!this.getUser(user)) {
            user.cachedAt = new Date();
            cache.push(user);
            this.#saveCache(cache);
        }
    }
    static #removeUser(user) {
        const cache = this.#getCache().filter(x => x.name !== user.name);
        this.#saveCache(cache);
    }
    static #getCache() {
        return JSON.parse(localStorage.getItem(this.#localStorage)) ?? [];
    }
    static #saveCache(cache) {
        localStorage.setItem(this.#localStorage, JSON.stringify(cache));
    }
    static clearCache() {
        localStorage.removeItem(this.#localStorage);
    }
}
class MiniProfileConfig {
    numberOfFavourites;
    position;
    hoverTags;
    displayAnime;
    displayManga;
    displayCharacters;
    displayStaff;
    displayBio;
    #localStorage = LocalStorageKeys.miniProfileConfig;
    constructor() {
        const config = JSON.parse(localStorage.getItem(this.#localStorage));
        this.numberOfFavourites = config?.numberOfFavourites ?? 6;
        this.position = config?.position ?? "bottom";
        this.hoverTags = config?.hoverTags ?? true;
        this.displayBio = config?.displayBio ?? true;
        this.displayAnime = config?.displayAnime ?? true;
        this.displayManga = config?.displayManga ?? true;
        this.displayCharacters = config?.displayCharacters ?? false;
        this.displayStaff = config?.displayStaff ?? false;
    }
    save() {
        localStorage.setItem(this.#localStorage, JSON.stringify(this));
    }
}

;// CONCATENATED MODULE: ./src/handlers/videoFixer.ts


class VideoFixer {
    static replaceVideosWithLinks() {
        if (!StaticSettings.options.replaceVideosWithLinksEnabled.getValue()) {
            return;
        }
        document.querySelectorAll(".markdown video source").forEach(s => {
            const source = s;
            const video = source.parentElement;
            const a = DOM_DOM.create("a", "video-link", "Play Video");
            a.setAttribute("href", source.src);
            video.replaceWith(a);
        });
    }
}

;// CONCATENATED MODULE: ./src/handlers/messageFeed/markdownEditor.ts






class MarkdownEditor {
    element;
    markdownEditor;
    actions;
    rulesNotice;
    input;
    textArea;
    previewHeader;
    preview;
    debouncer = new Debouncer();
    publishCallback;
    cancelCallback;
    isVisible = false;
    constructor(publishCallback, cancelCallback) {
        this.publishCallback = publishCallback;
        this.cancelCallback = cancelCallback;
        this.element = DOM_DOM.create("div", ".activity-edit activity-edit");
        this.markdownEditor = this.createMarkdownEditorBar();
        this.input = this.createTextArea();
        this.previewHeader = DOM_DOM.create("h2", ".section-header hidden", "Preview");
        this.preview = this.createPreview();
        this.actions = this.createActions();
        this.rulesNotice = this.createRulesNotice();
        this.element.append(this.markdownEditor, this.input, this.previewHeader, this.preview, this.rulesNotice, this.actions);
    }
    toggleVisibility(visible) {
        this.isVisible = visible;
        if (this.isVisible) {
            this.markdownEditor.classList.remove("void-hidden");
            this.rulesNotice.classList.remove("void-hidden");
            this.actions.classList.remove("void-hidden");
            this.handlePreviewVisibility();
        }
        else {
            this.markdownEditor.classList.add("void-hidden");
            this.rulesNotice.classList.add("void-hidden");
            this.actions.classList.add("void-hidden");
            this.handlePreviewVisibility();
            this.preview.querySelector(".markdown").innerHTML = "";
        }
    }
    setContent(value) {
        this.textArea.value = value;
    }
    handlePreviewVisibility() {
        const markdown = this.preview.querySelector(".markdown").innerHTML;
        if (!markdown || markdown.trim() === "" || markdown.trim() === "<p></p>" || !this.isVisible) {
            this.preview.classList.add("void-hidden");
            this.previewHeader.classList.add("void-hidden");
        }
        else {
            this.preview.classList.remove("void-hidden");
            this.previewHeader.classList.remove("void-hidden");
        }
    }
    resizeTextarea() {
        this.textArea.style.height = "auto";
        this.textArea.style.height = this.textArea.scrollHeight + "px";
    }
    createMarkdownEditorBar() {
        const markdownEditor = DOM_DOM.createDiv(".markdown-editor hidden");
        for (const item of this.markdownBarItems) {
            const action = DOM_DOM.create("div", null, item.icon);
            action.setAttribute("title", item.label);
            action.addEventListener("click", () => {
                const command = MarkdownCommands.find(x => x.description === item.label);
                MarkdownFunctions.handleCommand(command, this.textArea);
            });
            markdownEditor.append(action);
        }
        return markdownEditor;
    }
    createTextArea() {
        const textAreaContainer = DOM_DOM.createDiv(".input .el-textarea");
        this.textArea = DOM_DOM.create("textarea", ".el-textarea__inner");
        this.textArea.setAttribute("autocomplete", "off");
        this.textArea.setAttribute("placeholder", "Write a reply...");
        this.textArea.setAttribute("style", "min-height: 35px; height: 35px;");
        textAreaContainer.append(this.textArea);
        this.textArea.addEventListener("focus", () => {
            this.toggleVisibility(true);
        });
        this.textArea.addEventListener("input", (event) => {
            const target = event.target;
            this.debouncer.debounce(this.handleInput.bind(this), 50, target.value);
        });
        return textAreaContainer;
    }
    handleInput(value) {
        this.resizeTextarea();
        this.preview.querySelector(".markdown").innerHTML = Markdown.parse(value);
        Markdown.applyFunctions(this.preview.querySelector(".markdown"));
        this.handlePreviewVisibility();
    }
    createPreview() {
        const preview = DOM_DOM.createDiv(".reply .preview hidden");
        const header = DOM_DOM.create("div", ".header");
        const user = JSON.parse(localStorage.getItem("auth"));
        const { avatar, name } = BaseActivityComponent.createHeaderUser(user);
        header.append(avatar, name);
        const replyMarkdown = DOM_DOM.create("div", ".reply-markdown");
        const markdown = DOM_DOM.create("div", ".markdown");
        replyMarkdown.append(markdown);
        preview.append(header, replyMarkdown);
        return preview;
    }
    createActions() {
        const actions = DOM_DOM.createDiv(".actions hidden");
        const cancelButton = DOM_DOM.createDiv(".button .cancel", "Cancel");
        cancelButton.addEventListener("click", (event) => {
            event.stopPropagation();
            this.cancel();
        });
        const publishButton = DOM_DOM.create("div", ".button .save", "Publish");
        publishButton.addEventListener("click", () => {
            this.publish();
        });
        actions.append(cancelButton, publishButton);
        return actions;
    }
    async publish() {
        const reply = this.textArea.value;
        this.publishCallback(reply);
        this.cancel();
    }
    cancel() {
        this.toggleVisibility(false);
        this.textArea.value = "";
        if (this.cancelCallback) {
            this.cancelCallback();
        }
    }
    createRulesNotice() {
        const rulesNotice = DOM_DOM.createDiv(".rules-notice hidden");
        const rulesLink = DOM_DOM.create("a", null, "Please read the site guidelines before posting");
        rulesLink.setAttribute("href", "/forum/thread/14");
        rulesLink.setAttribute("target", "_blank");
        rulesNotice.append(rulesLink);
        return rulesNotice;
    }
    markdownBarItems = [
        {
            icon: BoldIcon(),
            label: "Bold"
        },
        {
            icon: ItalicIcon(),
            label: "Italic"
        },
        {
            icon: StrikeThroughIcon(),
            label: "Strikethrough"
        },
        {
            icon: SpoilerIcon(),
            label: "Spoiler!"
        },
        {
            icon: LinkIconMarkdown(),
            label: "Link"
        },
        {
            icon: ImageIcon(),
            label: "Image"
        },
        {
            icon: YoutubeIcon(),
            label: "Youtube Video"
        },
        {
            icon: WebMIcon(),
            label: "WebM Video"
        },
        {
            icon: OrderedListIcon(),
            label: "Ordered List"
        },
        {
            icon: UnorderedListIcon(),
            label: "Unordered List"
        },
        {
            icon: HeaderIcon(),
            label: "Header"
        },
        {
            icon: CenterTextIcon(),
            label: "Center"
        },
        {
            icon: QuoteIcon(),
            label: "Quote"
        },
        {
            icon: CodeIcon(),
            label: "Code"
        }
    ];
}

;// CONCATENATED MODULE: ./src/utils/ALScrollock.ts
class ALScrollock {
    static lock() {
        document.body.classList.add("scroll-lock");
    }
    static unlock() {
        document.body.classList.remove("scroll-lock");
    }
}

;// CONCATENATED MODULE: ./src/utils/dialog.ts




class Dialog {
    static dialogWrapper;
    static dialog;
    static header;
    static content;
    static confirmCallback;
    static initialize() {
        this.dialogWrapper = DOM_DOM.create("div", "dialog-wrapper");
        this.dialog = DOM_DOM.create("div", "dialog");
        this.header = DOM_DOM.create("div", "dialog-header");
        const closeIcon = XMarkIcon();
        closeIcon.addEventListener("click", () => {
            this.close();
        });
        this.dialog.append(DOM_DOM.create("div", "dialog-header-wrap", [this.header, closeIcon]));
        this.content = DOM_DOM.create("div", "dialog-content");
        this.dialog.append(this.content);
        const actions = DOM_DOM.create("div", "dialog-actions");
        const cancelButton = Button("Cancel", () => {
            this.close();
        }, "error slim");
        const confirmButton = Button("Ok", () => {
            this.confirmCallback();
            this.close();
        }, "slim");
        actions.append(cancelButton, confirmButton);
        this.dialog.append(actions);
        this.dialogWrapper.append(this.dialog);
        document.body.append(this.dialogWrapper);
    }
    static inform(content, title = "Notice") {
        if (!this.dialogWrapper) {
            this.initialize();
        }
        this.confirmCallback = () => { };
        this.header.replaceChildren(title);
        this.content.replaceChildren(content);
        this.open();
    }
    static confirm(confirmCallback, content = "Are you sure you want to do this?", title = "Warning") {
        if (!this.dialogWrapper) {
            this.initialize();
        }
        this.confirmCallback = confirmCallback;
        this.header.replaceChildren(title);
        this.content.replaceChildren(content);
        this.open();
    }
    static prompt(callback, title = "Insert Value", placeholder) {
        if (!this.dialogWrapper) {
            this.initialize();
        }
        this.header.replaceChildren(title);
        const input = InputField("", () => { }, "w-100", { placeholder });
        this.content.replaceChildren(input);
        this.confirmCallback = () => {
            callback(input.value);
        };
        this.open();
    }
    static open() {
        ALScrollock.lock();
        this.dialogWrapper.classList.add("void-visible");
    }
    static close() {
        ALScrollock.unlock();
        this.dialogWrapper.classList.remove("void-visible");
    }
    static isOpen() {
        return this.dialogWrapper?.classList.contains("void-visible");
    }
}

;// CONCATENATED MODULE: ./src/components/activity/baseActivityComponent.ts











class BaseActivityComponent {
    replyMarkdownEditor;
    activityReplies;
    activityId;
    editMarkdownEditor;
    editContainer;
    editCallback;
    editType;
    editActivityId;
    constructor(activityId) {
        this.activityId = activityId;
        this.replyMarkdownEditor = new MarkdownEditor(async (reply) => {
            try {
                const data = await AnilistAPI.replyToActivity(this.activityId, reply);
                this.activityReplies.append(this.createReply(data));
                this.activityReplies.append(this.replyMarkdownEditor.element);
            }
            catch (error) {
                Toaster.error("Failed to save reply.", error);
            }
        });
        this.createEditMarkdownEditor();
    }
    createEditMarkdownEditor() {
        // return;
        this.editContainer = DOM_DOM.create("div", "markdown-edit-container");
        this.editMarkdownEditor = new MarkdownEditor(async (value) => {
            try {
                const data = await AnilistAPI.saveActivityText(this.editType, this.editActivityId, value);
                this.editCallback(data.text ?? data.message);
            }
            catch (error) {
                Toaster.error(`Failed to save ${this.editType}.`, error);
            }
        }, () => {
            this.closeEditDialog();
        });
        // this.editMarkdownEditor.toggleVisibility(true);
        this.editContainer.append(DOM_DOM.create("div", "markdown-edit-content", this.editMarkdownEditor.element));
    }
    openEditDialog(item, saveCallback) {
        this.editCallback = saveCallback;
        this.editActivityId = item.id;
        const reply = item;
        const text = item;
        const message = item;
        if (text.type === "TEXT") {
            this.editType = "TEXT";
        }
        else if (message.type === "MESSAGE") {
            this.editType = "MESSAGE";
        }
        else {
            this.editType = "REPLY";
        }
        const content = reply.text ?? text.text ?? message.message;
        this.editContainer.classList.add("void-visible");
        document.body.classList.add("scroll-lock");
        this.editMarkdownEditor.textArea.focus();
        this.editMarkdownEditor.handlePreviewVisibility();
        this.editMarkdownEditor.setContent(content);
        this.editMarkdownEditor.handleInput(content);
    }
    closeEditDialog() {
        this.editContainer.classList.remove("void-visible");
        document.body.classList.remove("scroll-lock");
    }
    createHeaderUser(user) {
        return BaseActivityComponent.createHeaderUser(user);
    }
    static createHeaderUser(user) {
        const avatar = DOM_DOM.create("a", ".avatar");
        avatar.setAttribute("href", `/user/${user.name}/`);
        avatar.setAttribute("style", `background-image: url(${user.avatar.large});`);
        const name = DOM_DOM.create("a", ".name", user.name);
        name.setAttribute("href", `/user/${user.name}/`);
        let donatorBadge = null;
        if (user.donatorTier > 0) {
            donatorBadge = DOM_DOM.create("div", ".donator-badge", user.donatorTier > 3 ? user.donatorBadge : "Donator");
            if (user.donatorTier > 4) {
                donatorBadge.classList.add("donator-rainbow-badge");
            }
        }
        let moderatorBadge = null;
        if (user.moderatorRoles?.length > 0 && !user.moderatorRoles.includes("RETIRED")) {
            moderatorBadge = DOM_DOM.create("div", ".mod-badge-wrap .donator-badge .mod-badge");
            const modBadge = DOM_DOM.create("div", ".mod-badge");
            const icon = this.getModIcon(user.moderatorRoles[0]);
            const strong = DOM_DOM.create("strong", ".label", this.getModDescription(user.moderatorRoles[0]));
            modBadge.append(icon, strong);
            moderatorBadge.append(modBadge);
            const modTooltip = DOM_DOM.create("div", "mod-tooltip");
            for (const modRole of user.moderatorRoles) {
                const item = DOM_DOM.create("div", null, [this.getModIcon(modRole), DOM_DOM.create("strong", null, this.getModDescription(modRole))]);
                modTooltip.append(item);
            }
            StaticTooltip.register(moderatorBadge, modTooltip);
        }
        return { name, avatar, donatorBadge, moderatorBadge };
    }
    createTime(timestamp) {
        const timeAction = DOM_DOM.createDiv(".action .time");
        const time = DOM_DOM.create("time", null, Time.convertToString(timestamp));
        const date = Time.convertToDate(timestamp);
        time.setAttribute("timestamp", date.toString());
        StaticTooltip.register(time, Time.toLocaleString(date));
        timeAction.append(time);
        return timeAction;
    }
    createSubscribeButton(activity) {
        const subscribeButton = DOM_DOM.create("span", ".action .has-label", SubscribeBellIcon());
        subscribeButton.setAttribute("label", activity.isSubscribed ? "Unsubscribe" : "Subscribe");
        if (activity.isSubscribed) {
            subscribeButton.classList.add("active");
        }
        subscribeButton.addEventListener("click", async () => {
            try {
                const subscribe = subscribeButton.getAttribute("label") === "Subscribe";
                const data = await AnilistAPI.toggleActivitySubscription(activity.id, subscribe);
                subscribeButton.setAttribute("label", data.isSubscribed ? "Unsubscribe" : "Subscribe");
            }
            catch (error) {
                Toaster.error("Failed to toggle activity subscription", error);
            }
        });
        return subscribeButton;
    }
    createDirectLink(activity) {
        const directLink = DOM_DOM.create("a", null, [LinkIcon(), "Direct Link"]);
        directLink.setAttribute("href", `/activity/${activity.id}`);
        return directLink;
    }
    createActions(activity) {
        const actions = DOM_DOM.createDiv(".actions");
        const replies = DOM_DOM.create("div", ".action .replies");
        const replyCount = DOM_DOM.create("span", ".count", activity.replyCount);
        const replyIcon = ReplyIcon();
        replies.append(replyCount, replyIcon);
        replies.addEventListener("click", async () => {
            if (!this.activityReplies) {
                return;
            }
            this.activityReplies.classList.toggle("void-hidden");
            if (replies.getAttribute("queried") === "true") {
                return;
            }
            try {
                const repliesData = await AnilistAPI.queryActivityReplies(activity.id);
                this.activityReplies.replaceChildren();
                this.appendReplies(repliesData.replies, repliesData.pageInfo);
                replies.setAttribute("queried", "true");
            }
            catch (error) {
                Toaster.error("Failed to query activity replies.", error);
                this.activityReplies?.classList.add("void-hidden");
                return;
            }
        });
        const likes = this.createLikeAction(activity.id, "ACTIVITY", activity.likes, activity.likeCount, activity.isLiked);
        actions.append(replies, likes);
        return actions;
    }
    createLikeAction(id, type, likes, likeCount, isLiked) {
        const likesContainer = DOM_DOM.create("div", ".action .likes");
        const likeWrapActivity = DOM_DOM.create("div", ".like-wrap .activity");
        likesContainer.append(likeWrapActivity);
        const users = DOM_DOM.create("div", ".users");
        users.setAttribute("style", "display: none;");
        for (const user of likes) {
            const likeUser = DOM_DOM.create("a", ".user");
            likeUser.setAttribute("style", `background-image: url(${user.avatar.large})`);
            likeUser.setAttribute("href", `/user/${user.name}/`);
            users.append(likeUser);
        }
        const likeButton = DOM_DOM.create("div", ".button");
        if (isLiked) {
            likeButton.classList.add("liked");
        }
        const likeCountSpan = DOM_DOM.create("span", ".count", likeCount);
        const likeIcon = LikeIcon();
        likeButton.append(likeCountSpan, likeIcon);
        likeWrapActivity.append(users, likeButton);
        likeButton.addEventListener("click", async () => {
            try {
                const data = await AnilistAPI.toggleLike(id, type);
                if (data.isLiked) {
                    likeButton.classList.add("liked");
                }
                else {
                    likeButton.classList.remove("liked");
                }
                likeCountSpan.innerText = data.likeCount.toString();
            }
            catch (error) {
                Toaster.error("Failed to like activity or reply.", error);
            }
        });
        likeWrapActivity.addEventListener("mouseover", () => {
            users.style.display = "initial";
        });
        likeWrapActivity.addEventListener("mouseout", () => {
            users.style.display = "none";
        });
        return likesContainer;
    }
    createReplyWrap() {
        const replyWrap = DOM_DOM.create("div", ".reply-wrap");
        this.activityReplies = DOM_DOM.create("div", ".activity-replies hidden");
        this.activityReplies.append(Loader());
        replyWrap.append(this.activityReplies);
        return replyWrap;
    }
    appendReplies(replies, pageInfo) {
        for (const reply of replies) {
            this.activityReplies.append(this.createReply(reply));
        }
        this.addLoadMoreRepliesButton(pageInfo);
        this.activityReplies.append(this.replyMarkdownEditor.element);
    }
    addLoadMoreRepliesButton(pageInfo) {
        if (!pageInfo || pageInfo.perPage * pageInfo.currentPage > pageInfo.total) {
            return;
        }
        const loadMoreButton = DOM_DOM.create("div", ".load-more", "Load More");
        loadMoreButton.addEventListener("click", async () => {
            const loader = Loader();
            loadMoreButton.replaceWith(loader);
            try {
                const data = await AnilistAPI.queryActivityReplies(this.activityId, pageInfo.currentPage + 1);
                loader.remove();
                this.appendReplies(data.replies, data.pageInfo);
            }
            catch (error) {
                Toaster.error("Failed to query replies.", error);
            }
        });
        this.activityReplies.append(loadMoreButton);
    }
    createReply(reply) {
        const replyContainer = DOM_DOM.create("div", ".reply");
        replyContainer.setAttribute("void-reply-id", reply.id.toString());
        const { name, avatar, moderatorBadge } = this.createHeaderUser(reply.user);
        const header = DOM_DOM.create("div", ".header", [avatar, name]);
        if (moderatorBadge) {
            header.append(moderatorBadge);
        }
        const actions = DOM_DOM.create("div", ".actions");
        const likeAction = this.createLikeAction(reply.id, "ACTIVITY_REPLY", reply.likes, reply.likeCount, reply.isLiked);
        const timeAction = this.createTime(reply.createdAt);
        actions.append(likeAction, timeAction);
        if (StaticSettings.options.replyDirectLinksEnabled.getValue()) {
            const directLink = DOM_DOM.createAnchor(`/activity/${this.activityId}?void-reply-id=${reply.id}`, "has-icon reply-direct-link icon-ml", LinkIcon());
            actions.prepend(directLink);
        }
        header.append(actions);
        const replyMarkdown = DOM_DOM.create("div", ".reply-markdown");
        const markdown = DOM_DOM.createDiv(".markdown");
        markdown.innerHTML = Markdown.parse(reply.text);
        Markdown.applyFunctions(markdown);
        replyMarkdown.append(markdown);
        if (reply.user.id === StaticSettings.settingsInstance.userId) {
            const editButton = this.createEditButton(reply, (editedValue) => {
                markdown.innerHTML = Markdown.parse(editedValue);
                Markdown.applyFunctions(markdown);
            });
            const deleteButton = this.createDeleteButton("REPLY", reply.id, () => {
                replyContainer.remove();
            });
            editButton.classList.add("action");
            deleteButton.classList.add("action");
            editButton.classList.add("void-action");
            deleteButton.classList.add("void-action");
            actions.prepend(editButton, deleteButton);
        }
        replyContainer.append(header, replyMarkdown);
        return replyContainer;
    }
    createEditButton(activity, callback) {
        const editButton = DOM_DOM.createDiv(null, [PencilSquareIcon(), "Edit"]);
        editButton.addEventListener("click", () => {
            this.openEditDialog(activity, (editedValue) => {
                callback(editedValue);
            });
        });
        return editButton;
    }
    createDeleteButton(type, id, callback) {
        const deleteButton = DOM_DOM.create("div", null, [XMarkIcon(), "Delete"]);
        deleteButton.addEventListener("click", () => {
            Dialog.confirm(async () => {
                try {
                    await AnilistAPI.deleteActivity(type, id);
                    callback();
                }
                catch (error) {
                    Toaster.error("Failed to delete activity or reply.", error);
                }
            }, "Are you sure you want to delete this?");
        });
        return deleteButton;
    }
    static getModDescription(modRole) {
        const modRoleCased = modRole.charAt(0) + modRole.slice(1).toLowerCase().split("_").map(x => x.charAt(0).toLowerCase() + x.slice(1)).join(" ");
        switch (modRole) {
            case "ADMIN":
            case "LEAD_DEVELOPER":
            case "DEVELOPER":
                return modRoleCased;
            default:
                return modRoleCased + " mod";
        }
    }
    static getModIcon(modRole) {
        switch (modRole) {
            case "ADMIN":
                return AdminIcon();
            case "LEAD_DEVELOPER":
            case "DEVELOPER":
                return DeveloperIcon();
            case "LEAD_COMMUNITY":
            case "COMMUNITY":
                return CommunityModIcon();
            case "DISCORD_COMMUNITY":
                return DiscordModIcon();
            case "LEAD_ANIME_DATA":
            case "ANIME_DATA":
                return AnimeDataModIcon();
            case "LEAD_MANGA_DATA":
            case "MANGA_DATA":
                return MangaDataModIcon();
            case "LEAD_SOCIAL_MEDIA":
            case "SOCIAL_MEDIA":
                return SocialMediaModIcon();
            case "RETIRED":
                return RetiredModIcon();
            case "CHARACTER_DATA":
                return CharacterDataModIcon();
            case "STAFF_DATA":
                return StaffDataModIcon();
        }
    }
}

;// CONCATENATED MODULE: ./src/components/popOverComponent.ts


var DropdownDirection;
(function (DropdownDirection) {
    DropdownDirection[DropdownDirection["top"] = 0] = "top";
    DropdownDirection[DropdownDirection["bottomLeft"] = 1] = "bottomLeft";
})(DropdownDirection || (DropdownDirection = {}));
class PopOverComponentBase extends DomAwareComponent {
    trigger;
    menu;
    direction;
    constructor(trigger, direction) {
        super();
        this.menu = DOM_DOM.create("div", "dropdown-menu");
        this.direction = direction;
        this.trigger = trigger;
        this.trigger.classList.add("void-popover-trigger");
        this.trigger.addEventListener("click", () => {
            this.open();
        });
        this.updateDropdownLocation = this.updateDropdownLocation.bind(this);
        this.onDomUnload(trigger, () => {
            this.menu.remove();
        });
    }
    open() {
        if (!document.body.contains(this.menu)) {
            document.body.append(this.menu);
        }
        this.menu.classList.add("void-visible");
        this.updateDropdownLocation();
        const scrollElement = this.addScrollListener(this.trigger, this.updateDropdownLocation);
        window.addEventListener("resize", this.updateDropdownLocation);
        const closeCall = (event) => {
            const menu = event.target.closest(".void-dropdown-menu");
            const t = event.target.closest([...this.trigger.classList].map(x => "." + x));
            if (menu !== this.menu && event.target !== this.trigger && t !== this.trigger) {
                this.close();
                document.removeEventListener("click", closeCall);
                if (scrollElement) {
                    scrollElement.removeEventListener("scroll", this.updateDropdownLocation);
                }
                window.removeEventListener("resize", this.updateDropdownLocation);
            }
        };
        document.addEventListener("click", closeCall);
    }
    updateDropdownLocation() {
        const triggerRect = this.trigger.getBoundingClientRect();
        const menuRect = this.menu.getBoundingClientRect();
        const padding = 5;
        if (this.direction === undefined || this.direction === DropdownDirection.bottomLeft) {
            this.menu.style.top = `${triggerRect.bottom + window.scrollY + padding}px`;
            this.menu.style.left = `${triggerRect.left + window.scrollX - menuRect.width + triggerRect.width}px`;
        }
        else if (this.direction === DropdownDirection.top) {
            if (triggerRect.top - window.scrollY - menuRect.height - padding <= 80) {
                this.menu.style.top = `${triggerRect.bottom + window.scrollY + padding}px`;
                this.menu.classList.add("top");
                this.menu.classList.remove("bottom");
            }
            else {
                this.menu.classList.remove("top");
                this.menu.classList.add("bottom");
                this.menu.style.top = `${triggerRect.top + window.scrollY - menuRect.height - padding}px`;
            }
            this.menu.style.left = `${triggerRect.left + window.scrollX - (menuRect.width / 2) + (triggerRect.width / 2)}px`;
        }
    }
    close() {
        this.menu.classList.remove("void-visible");
    }
}
class PopOverComponent extends PopOverComponentBase {
    constructor(trigger, content, props) {
        super(trigger, props.direction);
        if (typeof content === "string") {
            this.menu.append(DOM_DOM.createDiv("popover-content", content));
        }
        else {
            content.classList.add("void-popover-content");
            this.menu.append(content);
        }
    }
}

;// CONCATENATED MODULE: ./src/components/dropdownComponent.ts


class DropdownMenuComponent extends PopOverComponentBase {
    constructor(options, trigger, callback, initialValue, direction = DropdownDirection.bottomLeft) {
        super(trigger, direction);
        this.createMenu(options, callback, initialValue);
    }
    createMenu(options, callback, initialValue) {
        for (const option of options) {
            let item;
            if (typeof option === "string") {
                item = DOM_DOM.create("div", "dropdown-menu-item");
                item.append(option);
                if (option === initialValue) {
                    item.classList.add("void-active");
                }
            }
            else {
                item = option.item;
                item.classList.add("void-dropdown-menu-item");
                if (option.value === initialValue) {
                    item.classList.add("void-active");
                }
            }
            item.addEventListener("click", () => {
                if (initialValue) {
                    this.menu.querySelector(".void-active")?.classList.remove("void-active");
                    item.classList.add("void-active");
                }
                callback(option);
                this.close();
            });
            this.menu.append(item);
        }
    }
}

;// CONCATENATED MODULE: ./src/components/activity/textActivityComponent.ts






class TextActivityComponent extends BaseActivityComponent {
    element;
    markdown;
    constructor(activity) {
        super(activity.id);
        const activityClass = activity.type === "MESSAGE" ? ".activity-message" : ".activity-text";
        this.element = DOM_DOM.create("div", `activity-entry .activity-entry ${activityClass}`);
        this.element.setAttribute("void-activity-id", activity.id.toString());
        const wrap = DOM_DOM.create("div", ".wrap");
        const text = this.createText(activity);
        const time = this.createTime(activity.createdAt);
        const directLink = this.createDirectLink(activity);
        const subscribeButton = this.createSubscribeButton(activity);
        const dropdownTrigger = DOM_DOM.create("div", "action .action activity-dropdown-trigger", EllipsisHorizontalIcon());
        const dropdownItems = [{ item: directLink, value: "directlink" }];
        const message = activity;
        const textActivity = activity;
        if (message.messenger?.id === StaticSettings.settingsInstance.userId ||
            textActivity.user?.id === StaticSettings.settingsInstance.userId) {
            const editButton = this.createEditButton(activity, (editedValue) => {
                this.markdown.innerHTML = Markdown.parse(editedValue);
                Markdown.applyFunctions(this.markdown);
            });
            dropdownItems.push({ item: editButton, value: "edit" });
        }
        if (message.recipient?.id === StaticSettings.settingsInstance.userId ||
            message.messenger?.id === StaticSettings.settingsInstance.userId ||
            textActivity.user?.id === StaticSettings.settingsInstance.userId) {
            const deleteButton = this.createDeleteButton("ACTIVITY", activity.id, () => {
                this.element.remove();
            });
            dropdownItems.push({ item: deleteButton, value: "delete" });
        }
        new DropdownMenuComponent(dropdownItems, dropdownTrigger, (_) => { });
        time.prepend(subscribeButton, dropdownTrigger);
        const actions = this.createActions(activity);
        wrap.append(text, time, actions);
        const replyWrap = this.createReplyWrap();
        if (activity.replies) {
            this.activityReplies.replaceChildren();
            this.appendReplies(activity.replies);
            actions.querySelector(".action.replies")?.setAttribute("queried", "true");
        }
        this.element.append(wrap, replyWrap);
        this.element.append(this.editContainer);
    }
    createText(activity) {
        const text = DOM_DOM.createDiv(".text");
        const header = DOM_DOM.createDiv(".header");
        if (activity.type === "TEXT") {
            const textActivity = activity;
            this.addUserToHeader(header, textActivity.user);
        }
        else {
            const messageActivity = activity;
            this.addUserToHeader(header, messageActivity.messenger);
            header.append(ArrowLongRightIcon());
            this.addUserToHeader(header, messageActivity.recipient);
        }
        const activityMarkdown = DOM_DOM.create("div", ".activity-markdown");
        this.markdown = DOM_DOM.create("div", ".markdown");
        // @ts-ignore
        this.markdown.innerHTML = Markdown.parse(activity.message ?? activity.text);
        Markdown.applyFunctions(this.markdown);
        activityMarkdown.append(this.markdown);
        text.append(header, activityMarkdown);
        return text;
    }
    addUserToHeader(header, user) {
        const container = DOM_DOM.create("div", "message-header-user");
        const u = this.createHeaderUser(user);
        container.append(u.avatar, u.name);
        if (u.moderatorBadge) {
            container.append(u.moderatorBadge);
        }
        if (u.donatorBadge) {
            container.append(u.donatorBadge);
        }
        header.append(container);
    }
}

;// CONCATENATED MODULE: ./src/handlers/messageFeed/messageFeedHandler.ts






class MessageFeedHandler {
    static messageFeedContainer;
    static currentPage;
    static addFeedFilter() {
        if (window.location.pathname !== "/home" ||
            !StaticSettings.options.messageFeedEnabled.getValue() ||
            !StaticSettings.settingsInstance.isAuthorized()) {
            return;
        }
        const activityTypeSelection = document.querySelector(".feed-select .el-dropdown ul");
        if (!activityTypeSelection || activityTypeSelection.querySelector(".void-messages-feed-filter-option")) {
            return;
        }
        const messageFeedOption = DOM_DOM.create("li", "messages-feed-filter-option", "Messages");
        messageFeedOption.classList.add("el-dropdown-menu__item");
        for (const item of activityTypeSelection.children) {
            item.addEventListener("click", () => {
                item.classList.add("active");
                messageFeedOption.classList.remove("active");
                document.querySelector(".activity-feed-wrap").classList.remove("void-hide-activity-feed");
                document.querySelector(".void-message-feed")?.remove();
            });
        }
        const feedTypeToggle = document.querySelector(".feed-type-toggle");
        for (const item of feedTypeToggle.children) {
            item.addEventListener("click", () => {
                if (messageFeedOption.classList.contains("active")) {
                    document.querySelector(".void-message-feed")?.remove();
                    this.renderMessageFeed();
                }
            });
        }
        messageFeedOption.addEventListener("click", () => {
            activityTypeSelection.querySelector(".active")?.classList.remove("active");
            messageFeedOption.classList.add("active");
            this.renderMessageFeed();
        });
        activityTypeSelection.append(messageFeedOption);
    }
    static async renderMessageFeed() {
        document.querySelector(".activity-feed-wrap").classList.add("void-hide-activity-feed");
        this.messageFeedContainer = DOM_DOM.create("div", ".activity-feed message-feed", Loader());
        document.querySelector(".activity-feed-wrap").append(this.messageFeedContainer);
        let messages;
        const isFollowing = document.querySelector(".feed-type-toggle :first-child").classList.contains("active");
        try {
            const data = await AnilistAPI.queryMessages(isFollowing);
            messages = data.activities;
            this.currentPage = data.pageInfo.currentPage;
        }
        catch (error) {
            Toaster.error("Failed to query messages feed.", error);
            return;
        }
        this.messageFeedContainer.replaceChildren();
        this.appendMessages(messages);
    }
    static appendMessages(messages) {
        for (const message of messages) {
            this.messageFeedContainer.append(new TextActivityComponent(message).element);
        }
        this.messageFeedContainer.append(this.createLoadMoreButton());
    }
    static createLoadMoreButton() {
        const button = DOM_DOM.create("div", ".load-more", "Load More");
        button.addEventListener("click", async () => {
            const loader = Loader();
            button.replaceWith(loader);
            await this.loadMore();
            loader.remove();
        });
        return button;
    }
    static async loadMore() {
        try {
            const isFollowing = document.querySelector(".feed-type-toggle :first-child").classList.contains("active");
            const data = await AnilistAPI.queryMessages(isFollowing, this.currentPage + 1);
            this.currentPage = data.pageInfo.currentPage;
            this.appendMessages(data.activities);
        }
        catch (error) {
            Toaster.error("There was an error querying activities.", error);
        }
    }
}

;// CONCATENATED MODULE: ./src/handlers/quickStart/anilistPaths.ts
const username = JSON.parse(localStorage.getItem("auth"))?.name;
const AnilistPaths = [
    {
        name: "AniList Home",
        path: "/home"
    },
    {
        name: "Notifications",
        path: "/notifications"
    },
    {
        name: "Profile",
        path: `/user/${username}/`
    },
    {
        name: "Favourites",
        path: `/user/${username}/Favorites`
    },
    {
        name: "Social",
        path: `/user/${username}/Social`
    },
    {
        name: `Reviews (${username})`,
        path: `/user/${username}/Reviews`
    },
    {
        name: `Submissions`,
        path: `/user/${username}/submissions`
    },
    {
        name: "Stats: Anime",
        path: `/user/${username}/stats/anime/overview`
    },
    {
        name: "Stats: Anime - Genres",
        path: `/user/${username}/stats/anime/genres`
    },
    {
        name: "Stats: Anime Tags",
        path: `/user/${username}/stats/anime/tags`
    },
    {
        name: "Stats: Anime Voice Actors",
        path: `/user/${username}/stats/anime/tags`
    },
    {
        name: "Stats: Anime Studios",
        path: `/user/${username}/stats/anime/studios`
    },
    {
        name: "Stats: Anime Staff",
        path: `/user/${username}/stats/anime/staff`
    },
    {
        name: "Stats: Manga",
        path: `/user/${username}/stats/manga/overview`
    },
    {
        name: "Stats: Manga - Genres",
        path: `/user/${username}/stats/manga/genres`
    },
    {
        name: "Stats: Manga Tags",
        path: `/user/${username}/stats/manga/tags`
    },
    {
        name: "Stats: Manga Staff",
        path: `/user/${username}/stats/manga/staff`
    },
    {
        name: "Settings: Profile",
        path: "/settings"
    },
    {
        name: "Settings: Account",
        path: "/settings/account"
    },
    {
        name: "Settings: Anime & Manga",
        path: "/settings/media"
    },
    {
        name: "Settings: Lists",
        path: "/settings/lists"
    },
    {
        name: "Settings: Notifications",
        path: "/settings/notifications"
    },
    {
        name: "Settings: VoidVerified",
        path: "/settings/developer"
    },
    {
        name: "Search: Anime",
        path: "/search/anime"
    },
    {
        name: "Search: Manga",
        path: "/search/manga"
    },
    {
        name: "Search: Staff",
        path: "/search/staff"
    },
    {
        name: "Search: Characters",
        path: "/search/characters"
    },
    {
        name: "Browse: Reviews",
        path: "/reviews"
    },
    {
        name: "Browse: Recommendations",
        path: "/recommendations"
    },
    {
        name: "AniList Bugs and Issues",
        path: "/forum/thread/76237"
    },
    {
        name: "Support AniList & AniChart (Donations)",
        path: "/forum/thread/2340"
    },
    {
        name: "AniList Guidelines & Data Submissions ",
        path: "/forum/thread/14"
    },
    {
        name: "Anime",
        path: `/user/${username}/animelist`
    },
    {
        name: "Planning Anime",
        path: `/user/${username}/animelist/Planning`
    },
    {
        name: "Completed Anime",
        path: `/user/${username}/animelist/Completed`
    },
    {
        name: "Watching Anime",
        path: `/user/${username}/animelist/Watching`
    },
    {
        name: "Rewatching Anime",
        path: `/user/${username}/animelist/Rewatching`
    },
    {
        name: "Paused Anime",
        path: `/user/${username}/animelist/Paused`
    },
    {
        name: "Dropped Anime",
        path: `/user/${username}/animelist/Dropped`
    },
    {
        name: "Manga",
        path: `/user/${username}/mangalist`
    },
    {
        name: "Planning Manga",
        path: `/user/${username}/mangalist/Planning`
    },
    {
        name: "Completed Manga",
        path: `/user/${username}/mangalist/Completed`
    },
    {
        name: "Reading Manga",
        path: `/user/${username}/mangalist/Reading`
    },
    {
        name: "Rereading Manga",
        path: `/user/${username}/mangalist/Rereading`
    },
    {
        name: "Paused Manga",
        path: `/user/${username}/mangalist/Paused`
    },
    {
        name: "Paused Manga",
        path: `/user/${username}/mangalist/Paused`
    },
    {
        name: "Dropped Manga",
        path: `/user/${username}/mangalist/Dropped`
    },
    {
        name: "Top 100 Anime",
        path: "/search/anime/top-100"
    },
    {
        name: "Trending Anime",
        path: "/search/anime/trending"
    },
    {
        name: "Top Anime Movies",
        path: "/search/anime/top-movies"
    },
    {
        name: "Top 100 Manga",
        path: "/search/manga/top-100"
    },
    {
        name: "Trending Manga",
        path: "/search/manga/trending"
    },
    {
        name: "Top Manhwa",
        path: "/search/manga/top-manhwa"
    },
    {
        name: "Forum: Overview",
        path: "/forum/overview"
    },
    {
        name: "Forum: Recent",
        path: "/forum/recent"
    },
    {
        name: "Forum: New Threads",
        path: "/forum/new"
    },
    {
        name: "Forum: Subscribed",
        path: "/forum/subscribed"
    },
    {
        name: "Forum: Search",
        path: "/forum/search"
    },
    {
        name: "Community Apps",
        path: "/apps"
    },
    {
        name: "Site Stats",
        path: "/site-stats"
    },
    {
        name: "Moderators",
        path: "/moderators"
    },
    {
        name: "Terms & Privacy",
        path: "/terms"
    }
];

;// CONCATENATED MODULE: ./src/handlers/quickStart/quickStartConfig.ts


class QuickStartConfig extends BaseConfig {
    openQuickStartKeybind;
    addNavigationButtons;
    usersEnabled;
    notificationsEnabled;
    onlyIncludeUnreadNotifications;
    displayAllResultsOnEmpty;
    anilistLinksEnabled;
    voidSettingsEnabled;
    preserveActivitySearch;
    constructor() {
        const configInLocalStorage = LocalStorageKeys.quickStartConfig;
        super(configInLocalStorage);
        const config = JSON.parse(localStorage.getItem(configInLocalStorage));
        this.openQuickStartKeybind = config?.openQuickStartKeybind ?? "ctrl+space";
        this.addNavigationButtons = config?.addNavigationButtons ?? true;
        this.usersEnabled = config?.usersEnabled ?? true;
        this.notificationsEnabled = config?.notificationsEnabled ?? true;
        this.onlyIncludeUnreadNotifications = config?.onlyIncludeUnreadNotifications ?? false;
        this.displayAllResultsOnEmpty = config?.displayAllResultsOnEmpty ?? true;
        this.anilistLinksEnabled = config?.anilistLinksEnabled ?? true;
        this.voidSettingsEnabled = config?.voidSettingsEnabled ?? true;
        this.preserveActivitySearch = config?.preserveActivitySearch ?? true;
    }
}

;// CONCATENATED MODULE: ./src/components/UserSearchComponent.ts





class UserSearchComponent extends BaseSearchComponent {
    input;
    timeout;
    scrollElement;
    onSelect;
    constructor(onSelect) {
        super();
        this.onSelect = onSelect;
        this.input = DOM_DOM.create("input", "input");
        this.input.setAttribute("placeholder", "Search user...");
        this.input.addEventListener("input", (event) => {
            const target = event.target;
            this.handleSearchInput(target.value);
        });
        this.input.addEventListener("focusout", () => {
            // set timeout so clicking on a result works
            setTimeout(() => {
                this.resultsContainer.replaceChildren();
                this.scrollElement.removeEventListener("scroll", this.updateResultsContainerLocation);
                window.removeEventListener("resize", this.updateResultsContainerLocation);
                this.resultsContainer.remove();
            }, 150);
        });
        this.element.append(this.input);
    }
    handleSearchInput(value) {
        clearTimeout(this.timeout);
        if (value === "" || value.length < 3) {
            return;
        }
        this.timeout = setTimeout(async () => {
            try {
                Toaster.debug(`Querying user with search word ${value}`);
                const response = await AnilistAPI.searchUsers(value);
                this.renderSearchResults(response);
            }
            catch (error) {
                Toaster.error(`Failed to query media with search word ${value}`, error);
            }
        }, 800);
    }
    renderSearchResults(results) {
        if (!document.body.contains(this.resultsContainer)) {
            document.body.append(this.resultsContainer);
        }
        this.resultsContainer.replaceChildren();
        this.scrollElement = this.addScrollListener(this.element, this.updateResultsContainerLocation);
        window.addEventListener("resize", this.updateResultsContainerLocation, { passive: true });
        for (const result of results) {
            const resultContainer = DOM_DOM.create("div", "search-result");
            resultContainer.addEventListener("click", function () {
                this.onSelect(result);
                this.resultsContainer.replaceChildren();
            }.bind(this));
            resultContainer.append(DOM_DOM.create("div", null, Image(result.avatar.large, "user-search-avatar")));
            const name = DOM_DOM.create("div", "user-search-name", result.name);
            resultContainer.append(name);
            this.resultsContainer.append(resultContainer);
        }
        this.updateResultsContainerLocation();
    }
}

;// CONCATENATED MODULE: ./src/components/activity/listActivityComponent.ts





class ListActivityComponent extends BaseActivityComponent {
    element;
    activity;
    constructor(activity) {
        super(activity.id);
        this.activity = activity;
        const entryClass = activity.type === "ANIME_LIST" ? ".activity-anime_list" : ".activity-manga_list";
        this.element = DOM_DOM.create("div", `activity-entry .activity-entry ${entryClass}`);
        this.element.setAttribute("void-activity-id", activity.id.toString());
        const wrap = DOM_DOM.create("div", ".wrap");
        wrap.append(this.createList());
        const time = this.createTime(activity.createdAt);
        const dropdownTrigger = DOM_DOM.create("div", "action .action activity-dropdown-trigger", EllipsisHorizontalIcon());
        time.prepend(this.createSubscribeButton(activity), dropdownTrigger);
        const directLink = this.createDirectLink(activity);
        const dropdownItems = [{ item: directLink, value: "directlink" }];
        if (activity.user.id === StaticSettings.settingsInstance.userId) {
            const deleteButton = this.createDeleteButton("ACTIVITY", activity.id, () => {
                this.element.remove();
            });
            dropdownItems.push({
                item: deleteButton,
                value: "delete"
            });
        }
        new DropdownMenuComponent(dropdownItems, dropdownTrigger, (_) => { });
        wrap.append(time);
        const actions = this.createActions(activity);
        wrap.append(actions);
        this.element.append(wrap);
        const replyWrap = this.createReplyWrap();
        if (activity.replies) {
            this.activityReplies.replaceChildren();
            this.appendReplies(activity.replies);
            actions.querySelector(".action.replies")?.setAttribute("queried", "true");
        }
        this.element.append(replyWrap);
        this.element.append(this.editContainer);
    }
    createList() {
        const list = DOM_DOM.createDiv(".list");
        const cover = DOM_DOM.create("a", ".cover");
        cover.setAttribute("style", `background-image: url("${this.activity.media.coverImage.large}");`);
        cover.setAttribute("href", `/${this.activity.media.type.toLocaleLowerCase()}/${this.activity.media.id}`);
        const details = DOM_DOM.create("div", ".details");
        const { name, avatar, donatorBadge } = this.createHeaderUser(this.activity.user);
        details.append(name);
        if (donatorBadge) {
            details.append(donatorBadge);
        }
        const status = this.createStatus();
        details.append(status);
        details.append(avatar);
        list.append(cover, details);
        return list;
    }
    createStatus() {
        const status = DOM_DOM.createDiv(".status", this.getProgress());
        const title = DOM_DOM.create("a", ".title", this.activity.media.title.userPreferred);
        title.setAttribute("href", `/${this.activity.media.type.toLocaleLowerCase()}/${this.activity.media.id}`);
        status.append(title);
        return status;
    }
    getProgress() {
        const status = this.activity.status.charAt(0).toUpperCase() + this.activity.status.slice(1);
        if (status.includes("episode")) {
            return `${status} ${this.activity.progress} of `;
        }
        else if (status.includes("chapter")) {
            return `${status} ${this.activity.progress} of `;
        }
        else {
            return status + " ";
        }
    }
}

;// CONCATENATED MODULE: ./src/components/MediaDisplayComponent.ts

class MediaDisplayComponent {
    element;
    constructor(media) {
        this.element = DOM_DOM.createDiv("media-display-container");
        const poster = DOM_DOM.createDiv("media-display-poster");
        poster.setAttribute("style", `background-image: url(${media.coverImage.large})`);
        const info = DOM_DOM.create("div", "media-display-info");
        const title = DOM_DOM.create("div", "media-display-title", media.title.userPreferred);
        const type = DOM_DOM.create("div", "media-display-type", [media.type, ` (${media.startDate.year ?? "unreleased"})`]);
        info.append(title, type);
        this.element.append(poster, info);
    }
}

;// CONCATENATED MODULE: ./src/handlers/quickStart/modes/latestMediaSearches.ts
class LatestMediaSearches {
    static localStorageKey = "void-verified-activity-search-media-cache";
    static add(media) {
        let mediaCache = this.get();
        if (mediaCache.find(x => x.id === media.id)) {
            return;
        }
        mediaCache.unshift(media);
        mediaCache = mediaCache.slice(0, 10);
        localStorage.setItem(this.localStorageKey, JSON.stringify(mediaCache));
    }
    static get() {
        return JSON.parse(localStorage.getItem(this.localStorageKey)) ?? [];
    }
}

;// CONCATENATED MODULE: ./src/components/collapsibleContainer.ts



class CollapsibleContainer {
    element;
    head;
    body;
    bodyWrap;
    headWrap;
    collapseIconContainer;
    isCollapsed = false;
    emptyContent;
    collapseId;
    constructor(head, body, classes, emptyContent, collapseId) {
        this.emptyContent = emptyContent;
        this.collapseId = collapseId;
        if (this.collapseId) {
            this.isCollapsed = CollapseStatus.getIsCollapsed(this.collapseId);
        }
        this.element = DOM_DOM.create("div", "collapsible-container");
        this.createHead(head);
        this.createBody(body);
        this.element.append(this.headWrap, this.bodyWrap);
        this.setClasses(classes);
    }
    createHead(head) {
        this.head = DOM_DOM.create("div", "collapsible-container-head");
        this.collapseIconContainer = DOM_DOM.create("div", "collapsible-container-icon", ChevronDownIcon());
        this.headWrap = DOM_DOM.create("div", "collapsible-container-head-wrap");
        this.headWrap.addEventListener("click", () => {
            this.handleCollapse(!this.isCollapsed);
        });
        if (head) {
            if (head) {
                if (Array.isArray(head)) {
                    this.head.append(...head);
                }
                else {
                    this.head.append(head);
                }
            }
        }
        this.headWrap.append(this.head, this.collapseIconContainer);
    }
    createBody(body) {
        this.body = DOM_DOM.create("div", "collapsible-container-body");
        this.bodyWrap = DOM_DOM.create("div", "collapsible-container-body-wrap");
        this.bodyWrap.append(this.body);
        this.onDomLoad(body);
        if (this.isCollapsed) {
            this.handleCollapse(this.isCollapsed);
        }
    }
    handleCollapse(collapse) {
        this.isCollapsed = collapse;
        if (this.isCollapsed) {
            this.bodyWrap.classList.add("void-collapsed");
            // this.collapseIconContainer.replaceChildren(ChevronUpIcon());
        }
        else {
            this.bodyWrap.classList.remove("void-collapsed");
            // this.collapseIconContainer.replaceChildren(ChevronDownIcon());
        }
        if (this.collapseId) {
            CollapseStatus.save(this.collapseId, this.isCollapsed);
        }
    }
    setContent(body) {
        this.body.replaceChildren();
        if (body) {
            if (Array.isArray(body)) {
                this.body.append(...body);
            }
            else {
                this.body.append(body);
            }
        }
        else if (this.emptyContent) {
            this.body.append(this.emptyContent);
        }
        const rect = this.body.getBoundingClientRect();
        this.bodyWrap.style.setProperty("--max-height", `${rect.height}px`);
    }
    onDomLoad(body) {
        if (!body && !this.emptyContent) {
            return;
        }
        const observer = new MutationObserver((mutationsList, observer) => {
            mutationsList.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node === this.body || node.contains(this.body)) {
                        this.setContent(body);
                        observer.disconnect();
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    setClasses(classes) {
        if (classes?.head) {
            DOM_DOM.transformClasses(this.head, classes.head);
        }
        if (classes?.body) {
            DOM_DOM.transformClasses(this.body, classes.body);
        }
    }
}
class CollapseStatus {
    static save(collapseId, collapsed) {
        let collapseItems = JSON.parse(localStorage.getItem(LocalStorageKeys.collapsedContainers)) ?? [];
        if (collapseItems.find(x => x.collapseId === collapseId)) {
            collapseItems = collapseItems.map(x => x.collapseId === collapseId ? { ...x, collapsed } : x);
        }
        else {
            collapseItems.push({ collapseId, collapsed });
        }
        localStorage.setItem(LocalStorageKeys.collapsedContainers, JSON.stringify(collapseItems));
    }
    static getIsCollapsed(collapseId) {
        const collapsedItems = JSON.parse(localStorage.getItem(LocalStorageKeys.collapsedContainers)) ?? [];
        const isCollapsed = collapsedItems.find(x => x.collapseId === collapseId)?.collapsed ?? false;
        return isCollapsed;
    }
}

;// CONCATENATED MODULE: ./src/handlers/quickStart/modes/activitySearchMode.ts



















const collapsibleClasses = {
    head: "quick-start-activity-search-params-container-head",
    body: "quick-start-activity-search-params-container-body"
};
class ActivitySearchMode {
    static media = [];
    static user = [];
    static recipients = [];
    static before;
    static after;
    static mode = "List";
    static feed;
    static sort;
    static includeReplies;
    static hasReplies;
    static perPage;
    static parametersContainer;
    static activityFeed;
    static usersDisplay;
    static recipientDisplay;
    static mediaDisplay;
    static activities = [];
    static filter = "";
    static searchButton;
    static queryUsed;
    static paramsUsed;
    static isCreated;
    static pageInfo;
    static scroll;
    static handleMode() {
        const [head, content] = this.createParametersContainer();
        QuickStartHandler.headContainer.append(head);
        QuickStartHandler.resultsContainer.append(content);
        if (QuickStartHandler.config.preserveActivitySearch) {
            QuickStartHandler.container.scrollTop = this.scroll;
        }
    }
    static handleCommand(command) {
        this.filter = command;
        this.appendActivities(this.activities);
    }
    static createParametersContainer() {
        if (QuickStartHandler.config.preserveActivitySearch && this.isCreated) {
            return [this.parametersContainer, this.activityFeed];
        }
        this.activities = [];
        this.media = [];
        this.user = [];
        this.recipients = [];
        this.mode = "List";
        this.feed = "Following";
        this.sort = "Newest";
        this.queryUsed = undefined;
        this.pageInfo = undefined;
        this.paramsUsed = undefined;
        this.hasReplies = false;
        this.includeReplies = false;
        this.perPage = 15;
        this.parametersContainer = DOM_DOM.create("div", "quick-start-activity-search-params-container");
        this.activityFeed = DOM_DOM.create("div", "activity-feed .activity-feed");
        this.preloadParameters();
        this.createParameters();
        if (QuickStartHandler.config.preserveActivitySearch) {
            this.isCreated = true;
            QuickStartHandler.container.addEventListener("scroll", (event) => {
                if (QuickStartHandler.mode === QuickStartMode.ActivitySearch) {
                    // @ts-ignore
                    this.scroll = event.target.scrollTop;
                }
            });
        }
        else {
            this.isCreated = false;
        }
        return [this.parametersContainer, this.activityFeed];
    }
    static createParameters() {
        this.parametersContainer.replaceChildren();
        this.createBaseProperties();
        if (this.mode === "List") {
            this.createMediaParams();
        }
        this.createUserParams();
        this.searchButton = Button("Search Activity", () => {
            this.searchActivity();
        }, "quick-start-search-activity-button");
        const clearButton = Button("Clear Feed", () => {
            this.activityFeed.replaceChildren();
            this.activities = [];
        }, "error");
        const actionContainer = DOM_DOM.create("div", "quick-start-activity-search-action-container", [clearButton, this.searchButton]);
        this.parametersContainer.append(actionContainer);
    }
    static createBaseProperties() {
        const activityTypeSelect = new SelectComponent(this.mode, ["List", "Text", "Message"], (value) => {
            this.mode = value;
            this.createParameters();
        });
        activityTypeSelect.element.addEventListener("click", (event) => {
            event.stopPropagation();
        });
        const feedSelect = new SelectComponent(this.feed, ["Following", "Global"], (value) => {
            this.feed = value;
        });
        const sortSelect = new SelectComponent(this.sort, ["Newest", "Oldest"], (value) => {
            this.sort = value;
        });
        const hasReplies = SettingLabel("Has replies", Checkbox(this.hasReplies, (event) => {
            this.hasReplies = event.target.checked;
        }));
        const includeReplies = SettingLabel("Preload replies (only recommended if you are going to filter through them)", Checkbox(this.includeReplies, (event) => {
            this.includeReplies = event.target.checked;
        }));
        const perPage = SettingLabel("Results per page", RangeField(this.perPage, (event) => {
            this.perPage = event.target.value;
        }, 50, 1, 1));
        const dateRange = this.createDateRangeParams();
        const container = new CollapsibleContainer(activityTypeSelect.element, [
            feedSelect.element,
            sortSelect.element,
            hasReplies,
            includeReplies,
            perPage,
            dateRange
        ], {
            body: "quick-start-activity-search-base-params"
        }, null, "quick-start-search-props");
        this.parametersContainer.append(container.element);
    }
    static createMediaParams() {
        const mediaCache = new CollapsibleContainer("Latest Media Searches", this.createMediaCacheItems(), {
            head: collapsibleClasses.head,
            body: collapsibleClasses.body + " quick-start-media-cache"
        }, "No Previous Media.", "quick-start-media-cache");
        const mediaSearch = new MediaSearchComponent((value) => {
            this.addMedia(value);
            LatestMediaSearches.add(value);
            mediaCache.body.replaceChildren(...this.createMediaCacheItems());
        }, true);
        mediaSearch.element.addEventListener("click", (event) => {
            event.stopPropagation();
        });
        this.mediaDisplay = new CollapsibleContainer(mediaSearch.element, this.media.map(x => this.createSelectedMediaItem(x)), collapsibleClasses, "No media selected.", "quick-start-selected-media");
        this.parametersContainer.append(mediaCache.element, this.mediaDisplay.element);
        this.renderSelectedMedia();
    }
    static createMediaCacheItems() {
        return LatestMediaSearches.get().map(x => {
            const item = new MediaDisplayComponent(x);
            item.element.addEventListener("click", () => {
                this.addMedia(x);
            });
            return item.element;
        });
    }
    static createUserParams() {
        const userSearch = new UserSearchComponent((value) => {
            this.addUser(value);
        });
        if (StaticSettings.settingsInstance.verifiedUsers?.length > 0) {
            const verifiedUserSelection = this.createVerifiedUsersSelector();
            this.parametersContainer.append(verifiedUserSelection.element);
        }
        userSearch.input.setAttribute("placeholder", this.mode === "Message" ? "Search Messagers" : "Search Users");
        userSearch.element.addEventListener("click", (event) => {
            event.stopPropagation();
        });
        this.usersDisplay = new CollapsibleContainer([userSearch.element,
            Button("Remove All", (event) => {
                event.stopPropagation();
                for (const user of this.user) {
                    this.removeUser(user, false);
                }
                this.renderSelectedUsers(false);
            }, "all-users-button")], this.user.map(x => {
            const user = this.createUserItem(x);
            user.addEventListener("click", () => {
                this.removeUser(x);
                this.renderSelectedUsers();
            });
            return user;
        }), collapsibleClasses, "No users selected.", "quick-start-selected-users");
        this.parametersContainer.append(this.usersDisplay.element);
        this.renderSelectedUsers();
        if (this.mode !== "Message") {
            return;
        }
        const recipientSearch = new UserSearchComponent((value) => {
            this.addUser(value, true);
        });
        recipientSearch.input.setAttribute("placeholder", "Search Recipients");
        recipientSearch.element.addEventListener("click", (event) => {
            event.stopPropagation();
        });
        if (StaticSettings.settingsInstance.verifiedUsers?.length > 0) {
            const verifiedUserSelection = this.createVerifiedUsersSelector(true);
            this.parametersContainer.append(verifiedUserSelection.element);
        }
        this.recipientDisplay = new CollapsibleContainer([recipientSearch.element, Button("Remove All", (event) => {
                event.stopPropagation();
                for (const user of this.recipients) {
                    this.removeUser(user, true);
                }
                this.renderSelectedUsers(true);
            }, "all-users-button")], this.recipients.map(x => {
            const user = this.createUserItem(x);
            user.addEventListener("click", () => {
                this.removeUser(x, true);
                this.renderSelectedUsers(true);
            });
            return user;
        }), collapsibleClasses, "No users selected.", "quick-start-selected-recipients");
        this.parametersContainer.append(this.recipientDisplay.element);
        this.renderSelectedUsers(true);
    }
    static verifiedUserToSearchResult(verifiedUser) {
        return {
            name: verifiedUser.username,
            avatar: {
                large: verifiedUser.avatar
            },
            id: verifiedUser.id
        };
    }
    static createDateRangeParams() {
        const afterInput = DateInput(this.after, (event) => {
            this.after = event.target.value;
        });
        const beforeInput = DateInput(this.before, (event) => {
            this.before = event.target.value;
        });
        const dateRange = DOM_DOM.create("div", "date-range-container");
        dateRange.append(afterInput, ArrowsLeftRightIcon(), beforeInput);
        return dateRange;
    }
    static createVerifiedUsersSelector(isRecipient = false) {
        const content = [];
        for (const user of StaticSettings.settingsInstance.verifiedUsers) {
            const userSearchResult = {
                id: user.id,
                avatar: {
                    large: user.avatar
                },
                name: user.username
            };
            const item = this.createUserItem(userSearchResult);
            item.addEventListener("click", () => {
                this.addUser(userSearchResult, isRecipient);
            });
            content.push(item);
        }
        const head = ["Verified Users", Button("Select All", (event) => {
                event.stopPropagation();
                for (const user of StaticSettings.settingsInstance.verifiedUsers) {
                    this.addUser(this.verifiedUserToSearchResult(user), isRecipient, true);
                }
                this.renderSelectedUsers(false);
            }, "all-users-button")];
        const verifiedUserContainer = new CollapsibleContainer(head, content, collapsibleClasses, "No verified users.", isRecipient ? "quick-start-verified-recipients" : "quick-start-verified-users");
        return verifiedUserContainer;
    }
    static addUser(user, isRecipient = false, dontRemove = false) {
        const list = isRecipient ? this.recipients : this.user;
        if (list.every(x => x.id !== user.id)) {
            list.push(user);
        }
        else if (!dontRemove) {
            this.removeUser(user, isRecipient);
        }
        this.renderSelectedUsers(isRecipient);
    }
    static removeUser(user, isRecipient = false) {
        if (isRecipient) {
            this.recipients = this.recipients.filter(x => x.id !== user.id);
        }
        else {
            this.user = this.user.filter(x => x.id !== user.id);
        }
    }
    static addMedia(media) {
        if (!this.media.find(x => media.id === x.id)) {
            this.media.push(media);
            this.renderSelectedMedia();
        }
    }
    static removeMedia(media) {
        this.media = this.media.filter(x => x.id !== media.id);
    }
    static renderSelectedUsers(isRecipient = false) {
        const display = isRecipient ? this.recipientDisplay : this.usersDisplay;
        const content = [];
        const users = isRecipient ? this.recipients : this.user;
        for (const user of users) {
            const item = this.createUserItem(user);
            item.addEventListener("click", () => {
                this.removeUser(user, isRecipient);
                this.renderSelectedUsers(isRecipient);
            });
            content.push(item);
        }
        display.setContent(content);
        if (content.length > 0) {
            display.handleCollapse(false);
        }
    }
    static renderSelectedMedia() {
        const content = [];
        for (const media of this.media) {
            const mediaComponent = this.createSelectedMediaItem(media);
            content.push(mediaComponent);
        }
        this.mediaDisplay.setContent(content);
        if (content.length > 0) {
            this.mediaDisplay.handleCollapse(false);
        }
    }
    static createSelectedMediaItem(media) {
        const mediaComponent = new MediaDisplayComponent(media);
        mediaComponent.element.addEventListener("click", () => {
            this.removeMedia(media);
            this.renderSelectedMedia();
        });
        return mediaComponent.element;
    }
    static createUserItem(user) {
        const item = DOM_DOM.create("div", "quick-access-item");
        const avatar = DOM_DOM.create("div", "quick-access-pfp");
        avatar.setAttribute("style", `background-image: url(${user.avatar.large})`);
        const name = DOM_DOM.create("div", "quick-access-username", user.name);
        item.append(avatar, name);
        return item;
    }
    static async searchActivity() {
        const [query, params] = this.buildQuery();
        this.searchButton.setAttribute("disabled", "true");
        this.activityFeed.replaceChildren(Loader());
        try {
            const response = await AnilistAPI.query(query, params);
            const activities = response.Page.activities;
            this.activities = activities;
            this.queryUsed = query;
            this.pageInfo = response.Page.pageInfo;
            this.paramsUsed = params;
            this.appendActivities(activities);
        }
        catch (error) {
            Toaster.error("There was an error querying activities.", error);
        }
        finally {
            this.searchButton.removeAttribute("disabled");
        }
    }
    static appendActivities(activities, clear = true) {
        const activityElements = this.filterActivities(activities).map(x => {
            switch (x.type) {
                case "ANIME_LIST":
                case "MANGA_LIST":
                    return new ListActivityComponent(x).element;
                case "TEXT":
                case "MESSAGE":
                    return new TextActivityComponent(x).element;
            }
        });
        if (this.activities.length < this.pageInfo.total) {
            activityElements.push(this.createLoadMoreButton());
        }
        if (clear) {
            this.activityFeed.replaceChildren(...activityElements);
        }
        else {
            this.activityFeed.append(...activityElements);
        }
    }
    static createLoadMoreButton() {
        const button = DOM_DOM.createDiv(".load-more", "Load More");
        button.addEventListener("click", async () => {
            const loader = Loader();
            button.replaceWith(loader);
            await this.loadMore();
            loader.remove();
        });
        return button;
    }
    static async loadMore() {
        try {
            const params = {
                ...this.paramsUsed,
                page: this.pageInfo.currentPage + 1
            };
            const response = await AnilistAPI.query(this.queryUsed, params);
            const activities = response.Page.activities;
            this.pageInfo = response.Page.pageInfo;
            this.activities.push(...activities);
            this.appendActivities(activities, false);
        }
        catch (error) {
            Toaster.error("There was an error querying activities.", error);
        }
    }
    static filterActivities(activities) {
        let filteredActivities = [...activities];
        if (this.filter?.length > 0) {
            filteredActivities = filteredActivities.filter(x => {
                let result = false;
                if (x.type === "ANIME_LIST" || x.type === "MANGA_LIST") {
                    result = FuzzyMatch.match(this.filter, x.media.title.userPreferred);
                    if (!result) {
                        result = FuzzyMatch.match(this.filter, x.status);
                    }
                    if (!result && x.progress) {
                        result = FuzzyMatch.match(this.filter, x.progress);
                    }
                }
                else if (x.type === "TEXT") {
                    result = FuzzyMatch.match(this.filter, x.text);
                }
                if (x.type === "MESSAGE") {
                    result = FuzzyMatch.match(this.filter, x.message);
                    if (!result) {
                        result = FuzzyMatch.match(this.filter, x.recipient.name);
                    }
                    if (!result) {
                        result = FuzzyMatch.match(this.filter, x.messenger.name);
                    }
                }
                else {
                    if (!result) {
                        result = FuzzyMatch.match(this.filter, x.user.name);
                    }
                }
                if (!result && x.replies) {
                    result = x.replies.some(reply => FuzzyMatch.match(this.filter, reply.text));
                    if (!result) {
                        result = x.replies.some(reply => FuzzyMatch.match(this.filter, reply.user.name));
                    }
                }
                return result;
            });
        }
        return filteredActivities;
    }
    static buildQuery() {
        switch (this.mode) {
            case "List":
                return this.buildMediaQuery();
            case "Text":
                return this.buildTextQuery();
            case "Message":
                return this.buildMessageQuery();
        }
    }
    static buildMediaQuery() {
        const query = `
			query Query(
			  $perPage: Int,
			  ${this.user.length > 0 ? "$userIdIn: [Int]," : ""}
			  $type: ActivityType,
			  ${this.media.length > 0 ? "$mediaIdIn: [Int]," : ""}
			  ${this.after ? "$createdAtGreater: Int," : ""}
			  ${this.before ? "$createdAtLesser: Int," : ""}
			  $page: Int,
			  $isFollowing: Boolean,
			  $sort: [ActivitySort],
			  $hasReplies: Boolean
			  ) {Page(perPage: $perPage, page: $page) {
				activities(
				${this.user.length > 0 ? "userId_in: $userIdIn," : ""}
				type: $type,
				isFollowing: $isFollowing,
				sort: $sort,
				hasReplies: $hasReplies,
				${this.media.length > 0 ? "mediaId_in: $mediaIdIn," : ""}
				${this.after ? "createdAt_greater: $createdAtGreater," : ""}
				${this.before ? "createdAt_lesser: $createdAtLesser" : ""}
				) {
				  ... on ListActivity {
					createdAt
					id
					isLiked
					isSubscribed
					likeCount
					likes {
					  avatar {
						large
					  }
					  name
					}
					media {
					  coverImage {
						large
					  }
					  type
					  id
					  title {
					  	userPreferred
					  }
					}
					progress
					replyCount
					${this.includeReplies ? `replies {${ActivityReplyQueryPartial}}` : ""}
					status
					type
					user {
					  name
					  id
					  donatorBadge
					  donatorTier
					  moderatorRoles
					  avatar {
						large
					  }
					}
				  }
				}
				pageInfo {
				  hasNextPage
				  currentPage
				  perPage
				  total
				}
			  }
			}
		`;
        const parameters = {
            mediaIdIn: this.media.length > 0 ? this.media.map(x => x.id) : undefined,
            userIdIn: this.user.length > 0 ? this.user.map(x => x.id) : undefined,
            createdAtGreater: this.after ? Time.toAnilistTimestamp(this.after) : undefined,
            createdAtLesser: this.before ? Time.toAnilistTimestamp(this.before) : undefined,
            type: "MEDIA_LIST",
            isFollowing: this.feed === "Following",
            perPage: this.perPage,
            page: 1,
            sort: this.sort === "Newest" ? "ID_DESC" : "ID",
            hasReplies: this.hasReplies
        };
        return [query, parameters];
    }
    static buildMessageQuery() {
        const query = `query Page(
		$page: Int,
		$perPage: Int,
		$type: ActivityType,
		$isFollowing: Boolean,
		${this.user.length > 0 ? "$messengerIdIn: [Int], " : ""}
		${this.recipients.length > 0 ? "$userIdIn: [Int]," : ""}
		${this.after ? "$createdAtGreater: Int," : ""}
		${this.before ? "$createdAtLesser: Int," : ""}
		$sort: [ActivitySort],
		$hasReplies: Boolean) {
		  Page(page: $page, perPage: $perPage) {
			pageInfo {
			  currentPage
			  hasNextPage
			  perPage
			  total
			}
			activities(
			type: $type,
			isFollowing: $isFollowing,
			hasReplies: $hasReplies,
			${this.user.length > 0 ? "messengerId_in: $messengerIdIn," : ""}
			${this.recipients.length > 0 ? "userId_in: $userIdIn," : ""}
			${this.after ? "createdAt_greater: $createdAtGreater," : ""}
			${this.before ? "createdAt_lesser: $createdAtLesser," : ""}
			sort: $sort) {
			  ... on MessageActivity {
				createdAt
				id
				isLiked
				isSubscribed
				likeCount
				replyCount
				${this.includeReplies ? `replies {${ActivityReplyQueryPartial}}` : ""}
				likes {
				  avatar {
					large
				  }
				  name
				}
				recipient {
				  avatar {
					large
				  }
				  id
				  moderatorRoles
				  donatorTier
				  donatorBadge
				  name
				}
				message
				messenger {
				  avatar {
					large
				  }
				  id
				  moderatorRoles
				  name
				  donatorBadge
				  donatorTier
				}
				type
			  }
			}
		  }
		}`;
        const parameters = {
            messengerIdIn: this.user.length > 0 ? this.user.map(x => x.id) : undefined,
            userIdIn: this.recipients.length > 0 ? this.recipients.map(x => x.id) : undefined,
            createdAtGreater: this.after ? Time.toAnilistTimestamp(this.after) : undefined,
            createdAtLesser: this.before ? Time.toAnilistTimestamp(this.before) : undefined,
            type: "MESSAGE",
            isFollowing: this.feed === "Following",
            perPage: this.perPage,
            page: 1,
            sort: this.sort === "Newest" ? "ID_DESC" : "ID",
            hasReplies: this.hasReplies
        };
        return [query, parameters];
    }
    static buildTextQuery() {
        const query = `query Page(
		$page: Int,
		$perPage: Int,
		$type: ActivityType,
		${this.user.length > 0 ? "$userIdIn: [Int]," : ""}
		${this.after ? "$createdAtGreater: Int," : ""}
		${this.before ? "$createdAtLesser: Int," : ""}
		$sort: [ActivitySort],
		$isFollowing: Boolean,
		$hasReplies: Boolean) {
		  Page(page: $page, perPage: $perPage) {
			pageInfo {
			  hasNextPage
			  currentPage
			  perPage
			  total
			}
			activities(
			type: $type,
			${this.user.length > 0 ? "userId_in: $userIdIn," : ""}
			${this.after ? "createdAt_greater: $createdAtGreater," : ""}
			${this.before ? "createdAt_lesser: $createdAtLesser," : ""}
			sort: $sort,,
			hasReplies: $hasReplies,
			isFollowing: $isFollowing) {
			  ... on TextActivity {
				createdAt
				isLiked
				isSubscribed
				likeCount
				likes {
				  avatar {
					large
				  }
				  name
				}
				replyCount
				${this.includeReplies ? `replies {${ActivityReplyQueryPartial}}` : ""}
				text
				type
				user {
				  avatar {
					large
				  }
				  moderatorRoles
				  name
				  id
				  donatorBadge
				  donatorTier
				}
				id
			  }
			}
		  }
		}`;
        const parameters = {
            userIdIn: this.user.length > 0 ? this.user.map(x => x.id) : undefined,
            createdAtGreater: this.after ? Time.toAnilistTimestamp(this.after) : undefined,
            createdAtLesser: this.before ? Time.toAnilistTimestamp(this.before) : undefined,
            type: "TEXT",
            isFollowing: this.feed === "Following",
            perPage: this.perPage,
            page: 1,
            sort: this.sort === "Newest" ? "ID_DESC" : "ID",
            hasReplies: this.hasReplies
        };
        return [query, parameters];
    }
    static preloadParameters() {
        try {
            const [_, type, id] = window.location.pathname.split("/");
            if (window.location.pathname.startsWith("/anime/")) {
                // @ts-ignore
                const title = document.querySelector(".header h1")?.innerText.trim();
                const poster = document.querySelector(".header .cover")?.getAttribute("src");
                const yearHref = document.querySelector(`.value[href*='/search/${type}?']`)?.getAttribute("href");
                const startYear = yearHref.split("=")[1].split("%")[0];
                const media = {
                    id: +id,
                    type: type.toUpperCase(),
                    title: {
                        userPreferred: title
                    },
                    coverImage: {
                        large: poster
                    },
                    startDate: {
                        year: +startYear
                    }
                };
                this.media.push(media);
            }
            else if (window.location.pathname.startsWith("/manga/")) {
                // @ts-ignore
                const title = document.querySelector(".header h1")?.innerText.trim();
                const poster = document.querySelector(".header .cover")?.getAttribute("src");
                const data = [...document.querySelectorAll(".sidebar .data .data-set")];
                // @ts-ignore
                const startDateEntry = data.find(x => x.querySelector(".type").innerText === "Start Date");
                // @ts-ignore
                const startYear = +startDateEntry.querySelector(".value").innerText.split(", ")[1];
                const media = {
                    id: +id,
                    type: type.toUpperCase(),
                    title: {
                        userPreferred: title
                    },
                    coverImage: {
                        large: poster
                    },
                    startDate: {
                        year: +startYear
                    }
                };
                this.media.push(media);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
}

;// CONCATENATED MODULE: ./src/utils/typescript.ts
class Typescript {
    static getTypeKeys(type) {
        return Object.keys(type).filter(key => isNaN(Number(key)));
    }
}

;// CONCATENATED MODULE: ./src/handlers/quickStart/quickStartHandler.ts




















var QuickStartMode;
(function (QuickStartMode) {
    QuickStartMode[QuickStartMode["Dashboard"] = 0] = "Dashboard";
    QuickStartMode[QuickStartMode["ActivitySearch"] = 1] = "ActivitySearch";
})(QuickStartMode || (QuickStartMode = {}));
class QuickStartHandler {
    static container;
    static commandInput;
    static modeSelect;
    static headContainer;
    static resultsContainer;
    static quickAccessUsers;
    static notificationsContainer;
    static configContainer;
    static config;
    static mode = QuickStartMode.Dashboard;
    static debouncer = new Debouncer();
    static initialize() {
        this.config = new QuickStartConfig();
        this.container = DOM_DOM.create("div", "quick-start-container");
        this.configContainer = this.createConfigContainer();
        this.configContainer.setAttribute("void-hidden", "true");
        document.body.append(this.container);
        this.container.addEventListener("click", (event) => {
            if (event.currentTarget === event.target) {
                this.closeQuickStart();
            }
        });
        const inputContainer = DOM_DOM.create("div", "quick-start-input-container");
        this.commandInput = DOM_DOM.create("input");
        this.commandInput.setAttribute("placeholder", "Filter VoidVerified QuickStart");
        this.commandInput.addEventListener("input", (event) => {
            const target = event.target;
            this.debouncer.debounce(this.handleCommand.bind(this), this.mode === QuickStartMode.ActivitySearch ? 350 : 100, target.value);
        });
        inputContainer.append(CommandLineIcon(), this.commandInput);
        const settingsIcon = CogIcon();
        settingsIcon.addEventListener("click", () => {
            this.configContainer.setAttribute("void-hidden", `${this.configContainer.getAttribute("void-hidden") !== "true"}`);
        });
        const closeIcon = CloseIcon();
        closeIcon.addEventListener("click", () => {
            this.closeQuickStart();
        });
        inputContainer.append(settingsIcon, closeIcon);
        this.container.append(inputContainer);
        const modes = Typescript.getTypeKeys(QuickStartMode);
        this.modeSelect = new SelectComponent(QuickStartMode[this.mode], modes, (value) => {
            // @ts-ignore it works
            this.mode = QuickStartMode[value];
            this.openQuickStart(false);
        });
        const contentContainer = DOM_DOM.create("div", "quick-start-content-container");
        contentContainer.addEventListener("click", (event) => {
            if (event.currentTarget === event.target) {
                this.closeQuickStart();
            }
        });
        this.container.append(contentContainer);
        contentContainer.append(DOM_DOM.create("div", "quick-start-mode-select-container", this.modeSelect.element));
        contentContainer.append(this.configContainer);
        this.headContainer = DOM_DOM.create("div", "quick-start-head-container");
        contentContainer.append(this.headContainer);
        this.resultsContainer = DOM_DOM.create("div", "quick-start-results-container");
        this.resultsContainer.addEventListener("click", (event) => {
            if (event.currentTarget === event.target) {
                this.closeQuickStart();
            }
        });
        contentContainer.append(this.resultsContainer);
        hotkeys(this.config.openQuickStartKeybind, "all", this.openQuickStart);
    }
    static bindOpenQuickStart(newBind, oldBind) {
        if (oldBind) {
            // @ts-ignore
            hotkeys.unbind(oldBind, "all", this.openQuickStart);
        }
        hotkeys(newBind, "all", this.openQuickStart);
    }
    static openQuickStart(cycle = true) {
        if (!StaticSettings.options.quickStartEnabled.getValue()) {
            return;
        }
        if (QuickStartHandler.container.classList.contains("void-visible")) {
            QuickStartHandler.commandInput.value = "";
            if (cycle) {
                QuickStartHandler.cycleMode();
            }
        }
        QuickStartHandler.headContainer.replaceChildren();
        QuickStartHandler.resultsContainer.replaceChildren();
        QuickStartHandler.container.classList.add("void-visible");
        ALScrollock.lock();
        QuickStartHandler.commandInput.focus();
        QuickStartHandler.handleModes();
        QuickStartHandler.modeSelect.updateActive(QuickStartMode[QuickStartHandler.mode]);
    }
    static cycleMode() {
        const modes = Object.values(QuickStartMode).filter(value => typeof value === "number");
        if (this.mode + 1 >= modes.length) {
            this.mode = QuickStartMode.Dashboard;
        }
        else {
            this.mode++;
        }
    }
    static handleModes() {
        switch (this.mode) {
            case QuickStartMode.Dashboard:
                this.handleDefaultMode();
                break;
            case QuickStartMode.ActivitySearch:
                this.handleActivitySearchMode();
        }
    }
    static handleDefaultMode() {
        this.quickAccessUsers = DOM_DOM.create("div");
        this.headContainer.append(this.quickAccessUsers);
        this.notificationsContainer = DOM_DOM.create("div", "quick-start-notifications");
        this.headContainer.append(this.notificationsContainer);
        this.handleNotifications();
        this.handleQuickAccessUsers();
        if (this.config.displayAllResultsOnEmpty) {
            this.handleAnilistLinks("");
            this.handleVoidSettings("");
        }
    }
    static handleActivitySearchMode() {
        ActivitySearchMode.handleMode();
    }
    static isOpen() {
        return this.container.classList.contains("void-visible");
    }
    static closeQuickStart() {
        if (!this.isOpen()) {
            return;
        }
        this.mode = QuickStartMode.Dashboard;
        this.container.classList.remove("void-visible");
        ALScrollock.unlock();
        this.resultsContainer.replaceChildren();
        this.headContainer.replaceChildren();
        this.commandInput.value = "";
    }
    static handleCommand(command) {
        switch (this.mode) {
            case QuickStartMode.ActivitySearch:
                ActivitySearchMode.handleCommand(command);
                return;
            case QuickStartMode.Dashboard:
                break;
        }
        this.resultsContainer.replaceChildren();
        this.handleQuickAccessUsers(command);
        this.handleNotifications(command);
        if (command.length === 0 && !this.config.displayAllResultsOnEmpty) {
            return;
        }
        this.handleAnilistLinks(command);
        this.handleVoidSettings(command);
    }
    static handleAnilistLinks(command) {
        if (!this.config.anilistLinksEnabled) {
            return;
        }
        const paths = AnilistPaths.filter(x => FuzzyMatch.match(command, x.name));
        if (paths.length > 0) {
            const pathResults = paths.map(x => {
                const link = DOM_DOM.create("a", "quick-start-result", x.name);
                link.setAttribute("href", x.path);
                link.addEventListener("click", () => {
                    this.closeQuickStart();
                });
                return link;
            });
            this.resultsContainer.append(DOM_DOM.create("div", "quick-start-results-list", [DOM_DOM.create("h3", "quick-start-results-title", "AniList Links"), ...pathResults]));
        }
    }
    static handleVoidSettings(command) {
        if (!this.config.voidSettingsEnabled) {
            return;
        }
        const voidSettings = Object.entries(StaticSettings.options).filter(([_, value]) => FuzzyMatch.match(command, value.description));
        if (voidSettings.length > 0) {
            const options = voidSettings.map(([key, option]) => {
                if (typeof option.getValue() === "boolean") {
                    return DOM_DOM.create("div", "quick-start-result", SettingLabel(option.description, Checkbox(option.getValue(), (event) => {
                        option.setValue(event.target.checked);
                    })));
                }
                const input = InputField(option.getValue(), (event) => {
                    option.setValue(event.target.value);
                }, "quick-access-option-input");
                return DOM_DOM.create("div", "quick-start-result", SettingLabel(option.description, input));
            });
            this.resultsContainer.append(DOM_DOM.create("div", "quick-start-results-list", [DOM_DOM.create("h3", "quick-start-results-title", "VoidVerified Settings"), ...options]));
        }
    }
    static handleQuickAccessUsers(command) {
        if (!this.config.usersEnabled) {
            this.quickAccessUsers.setAttribute("void-disabled", "true");
            this.quickAccessUsers.replaceChildren();
            return;
        }
        this.quickAccessUsers.removeAttribute("void-disabled");
        this.quickAccessUsers.replaceChildren(QuickAccess.renderUsers(command));
    }
    static handleNotifications(command) {
        if (!StaticSettings.options.replaceNotifications.getValue() || !this.config.notificationsEnabled) {
            this.notificationsContainer.setAttribute("void-disabled", "true");
            this.notificationsContainer.replaceChildren();
            return;
        }
        this.notificationsContainer.removeAttribute("void-disabled");
        if (!NotificationFeedHandler.notifications) {
            return;
        }
        const notificationConfig = new NotificationConfig(LocalStorageKeys.notificationsConfig);
        let notifications = [...NotificationFeedHandler.notifications];
        if (this.config.onlyIncludeUnreadNotifications) {
            notifications = notifications.filter(x => !ReadNotifications.isRead(x.id));
        }
        notifications = NotificationFeedHandler.filterNotifications(notifications, command);
        if (notifications.length > 0 && notificationConfig.groupNotifications) {
            const activityIds = new Set(notifications
                .filter((x) => x.activityId)
                .filter((x) => x.type !== "ACTIVITY_MESSAGE")
                .map((x) => x.activityId));
            const [relations] = NotificationsCache.getCachedRelations(Array.from(activityIds));
            notifications = notifications.map((notification) => {
                notification.activity = relations.find((relation) => notification.activityId === relation.id);
                return notification;
            });
        }
        this.notificationsContainer.replaceChildren(...notifications
            .map(x => NotificationWrapper(x, true)));
    }
    static createConfigContainer() {
        const configContainer = DOM_DOM.createDiv("quick-start-config-container");
        configContainer.append(DOM_DOM.create("h3", "header", "QuickStart Configuration"));
        const keybindInput = KeyInput(this.config.openQuickStartKeybind, "all", (event) => {
            this.bindOpenQuickStart(event.target.value, this.config.openQuickStartKeybind);
            this.config.openQuickStartKeybind = event.target.value;
            this.config.save();
        });
        hotkeys("*", { element: keybindInput, scope: "all" }, (event) => {
            if (event.target !== keybindInput) {
                return;
            }
            // @ts-ignore
            const keys = hotkeys.getPressedKeyString();
            keybindInput.value = keys.join("+");
        });
        configContainer.append(Label("Open QuickStart shortcut", keybindInput));
        configContainer.append(SettingLabel("Add QuickStart Button to navigation", Checkbox(this.config.addNavigationButtons, (event) => {
            this.config.addNavigationButtons = event.target.checked;
            this.config.save();
        })));
        configContainer.append(SettingLabel("Display Quick Access users", Checkbox(this.config.usersEnabled, (event) => {
            this.config.usersEnabled = event.target.checked;
            this.config.save();
        })));
        configContainer.append(SettingLabel(`Display notifications (requires "${StaticSettings.options.replaceNotifications.description}" enabled)`, Checkbox(this.config.notificationsEnabled, (event) => {
            this.config.notificationsEnabled = event.target.checked;
            this.config.save();
        })));
        configContainer.append(SettingLabel("Only display unread notifications", Checkbox(this.config.onlyIncludeUnreadNotifications, (event) => {
            this.config.onlyIncludeUnreadNotifications = event.target.checked;
            this.config.save();
        })));
        configContainer.append(SettingLabel("Display all results when search is empty", Checkbox(this.config.displayAllResultsOnEmpty, (event) => {
            this.config.displayAllResultsOnEmpty = event.target.checked;
            this.config.save();
        })));
        configContainer.append(SettingLabel("Include AniList links", Checkbox(this.config.anilistLinksEnabled, (event) => {
            this.config.anilistLinksEnabled = event.target.checked;
            this.config.save();
        })));
        configContainer.append(SettingLabel("Include VoidVerified settings", Checkbox(this.config.voidSettingsEnabled, (event) => {
            this.config.voidSettingsEnabled = event.target.checked;
            this.config.save();
        })));
        configContainer.append(SettingLabel("Preserve activity search on close", Checkbox(this.config.preserveActivitySearch, (event) => {
            this.config.preserveActivitySearch = event.target.checked;
            this.config.save();
        })));
        return configContainer;
    }
    static addNavigationButtons() {
        if (!this.config.addNavigationButtons || !StaticSettings.options.quickStartEnabled.getValue()) {
            return;
        }
        const nav = document.querySelector(".nav > .wrap:not(:has(.void-quick-start-nav-button))");
        if (nav) {
            const button = DOM_DOM.create("div", "quick-start-nav-button");
            button.append(CommandLineIcon());
            button.addEventListener("click", () => {
                this.openQuickStart();
            });
            nav.insertBefore(button, nav.querySelector(".search"));
        }
        const mobileNav = document.querySelector(".mobile-nav .menu:not(:has(.void-quick-start-mobile-nav-button))");
        if (mobileNav) {
            const button = DOM_DOM.create("div", "quick-start-mobile-nav-button");
            button.append(CommandLineIcon());
            button.append(DOM_DOM.create("div", null, "QuickStart"));
            button.addEventListener("click", () => {
                this.openQuickStart();
            });
            mobileNav.append(button);
        }
    }
}

;// CONCATENATED MODULE: ./src/components/fileInputIconComponent.ts


class FileInputIconComponent {
    element;
    input;
    constructor(onFileInput, accept) {
        this.element = DOM_DOM.create("div", "file-icon-input-dropbox");
        this.input = DOM_DOM.create("input");
        this.input.setAttribute("type", "file");
        if (accept) {
            this.input.setAttribute("accept", accept);
        }
        this.input.addEventListener("change", onFileInput);
        this.input.removeAttribute("title");
        this.element.append(this.input, ArrowUpTrayIcon());
        this.element.addEventListener("click", () => {
            this.input.click();
        });
    }
}

;// CONCATENATED MODULE: ./src/components/markdownDraftManager.ts








class MarkdownDraftManager {
    element;
    list;
    textarea;
    constructor(textarea) {
        this.textarea = textarea;
        this.element = DOM_DOM.createDiv("markdown-draft-manager");
        this.element.append(DOM_DOM.createDiv("markdown-draft-header flex justify-center", "Drafts"));
        this.list = DOM_DOM.createDiv("markdown-draft-list has-icon icon-pointer");
        this.element.append(this.list);
        const saveButton = Button("Save New Draft", () => {
            if (this.textarea.value.length === 0) {
                Toaster.error("Cannot save an empty draft.");
                return;
            }
            this.saveDraft();
        }, "slim p-6");
        this.element.append(DOM_DOM.createDiv("markdown-draft-footer flex justify-center", saveButton));
        this.createList();
    }
    createList() {
        this.list.replaceChildren();
        for (const draft of MarkdownDraftStorage.getDrafts()) {
            const title = DOM_DOM.createDiv("markdown-draft-title", draft.name);
            const save = DocumentArrowDownIcon();
            save.addEventListener("click", () => {
                if (this.textarea.value.length === 0) {
                    Toaster.error("Cannot save an empty draft.");
                    return;
                }
                Dialog.confirm(() => {
                    MarkdownDraftStorage.saveDraft({
                        name: draft.name,
                        content: this.textarea.value,
                        timestamp: new Date(),
                    }, true);
                    this.createList();
                }, `Are you sure you want to override draft ${draft.name}?`);
            });
            const load = DocumentArrowUpIcon();
            load.addEventListener("click", () => {
                if (this.textarea.value.length > 0) {
                    Dialog.confirm(() => {
                        this.loadDraft(draft);
                    }, "You will lose your current work by loading a draft.");
                }
                else {
                    this.loadDraft(draft);
                }
            });
            const deleteButton = XMarkIcon();
            deleteButton.addEventListener("click", () => {
                Dialog.confirm(() => {
                    MarkdownDraftStorage.deleteDraft(draft);
                    this.createList();
                }, `Are you sure you want to delete draft ${draft.name}?`);
            });
            const characterCounts = MarkdownDraftManager.createCharacterCounts(draft.content);
            StaticTooltip.register(title, DOM_DOM.createDiv(null, [
                DOM_DOM.createDiv(null, draft.name),
                DOM_DOM.createDiv(null, Time.toLocaleString(draft.timestamp)),
                characterCounts
            ]));
            StaticTooltip.register(save, "Save Draft");
            StaticTooltip.register(load, "Load Draft");
            StaticTooltip.register(deleteButton, "Delete Draft");
            this.list.append(title, save, load, deleteButton);
        }
    }
    saveDraft() {
        Dialog.prompt((value) => {
            const draft = {
                name: value,
                content: this.textarea.value,
                timestamp: new Date()
            };
            MarkdownDraftStorage.saveDraft(draft, false);
            this.createList();
        }, "Name new draft", "Draft name...");
    }
    loadDraft(draft) {
        this.textarea.value = draft.content;
        this.textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }
    static createCharacterCounts(content) {
        const counts = [
            DOM_DOM.create("div", null, "Characters:"),
            DOM_DOM.create("div", null, content.length.toString()),
            DOM_DOM.create("div", null, "Words:"),
            DOM_DOM.create("div", null, (content.match(/\S+/g)?.length ?? 0).toString()),
            DOM_DOM.create("div", null, "Sentences:"),
            DOM_DOM.create("div", null, (content.match(/[^?!.][?!.]/g)?.length ?? 0).toString()),
            DOM_DOM.create("div", null, "Paragraphs:"),
            DOM_DOM.create("div", null, (content.match(/([^\r\n]+(\r?\n)?)+(?=(\r?\n){2,}|$)/g)?.length ?? 0).toString()),
        ];
        return DOM_DOM.create("div", "markdown-taskbar-character-counts-grid", counts);
    }
}
class MarkdownDraftStorage {
    static getDrafts() {
        return JSON.parse(localStorage.getItem(LocalStorageKeys.drafts)) ?? [];
    }
    static saveDraft(draft, override) {
        let drafts = this.getDrafts();
        const exists = drafts.some(x => x.name === draft.name);
        if (exists && !override) {
            Toaster.error("Draft with given name already exists.");
            return;
        }
        else if (exists && override) {
            drafts = drafts.map(x => x.name !== draft.name ? x : draft);
        }
        else {
            drafts.push(draft);
        }
        localStorage.setItem(LocalStorageKeys.drafts, JSON.stringify(drafts));
    }
    static deleteDraft(draft) {
        const drafts = this.getDrafts();
        localStorage.setItem(LocalStorageKeys.drafts, JSON.stringify(drafts.filter(x => x.name !== draft.name)));
    }
}

;// CONCATENATED MODULE: ./src/components/markdownTaskbar.ts












class MarkdownTaskbar {
    element;
    textarea;
    characterCounter;
    endContainer;
    constructor(textarea) {
        this.textarea = textarea;
        this.endContainer = DOM_DOM.createDiv("align-right");
        this.characterCounter = DOM_DOM.createDiv();
        this.endContainer.append(this.characterCounter);
        this.element = DOM_DOM.create("div", "markdown-taskbar has-icon", this.createItems());
        setTimeout(() => {
            textarea
                .closest(".activity-edit")
                ?.querySelector('.void-icon-button[title="Reply to Activity"]')
                ?.addEventListener("click", () => {
                this.updateCharacterCounter();
            });
        }, 100);
    }
    createItems() {
        const items = [];
        if (StaticSettings.options.pasteImagesToHostService.getValue()) {
            items.push(...this.createImageHostItems());
        }
        items.push(this.createDraftManager());
        this.updateCharacterCounter();
        const characterCountPopout = DOM_DOM.create("div", null, MarkdownDraftManager.createCharacterCounts(this.textarea.value));
        StaticTooltip.register(this.characterCounter, characterCountPopout);
        this.textarea.addEventListener("input", (event) => {
            const target = event.target;
            this.updateCharacterCounter();
            characterCountPopout.replaceChildren(MarkdownDraftManager.createCharacterCounts(target.value));
        });
        items.push(this.endContainer);
        return items;
    }
    createImageHostItems() {
        const uploadButton = new FileInputIconComponent(async (event) => {
            const target = event.target;
            const images = [...target.files];
            const imageApi = ImageApiFactory.getImageHostInstance();
            const results = await Promise.all(images.map(image => imageApi.uploadImage(image)));
            const imageRows = results.filter(url => url !== null).map(url => PasteHandler.handleImg(url)).join("\n\n");
            const selectionStart = this.textarea.selectionStart;
            const selectionEnd = this.textarea.selectionEnd;
            const beforeSelection = this.textarea.value.substring(0, selectionStart);
            const afterSelection = this.textarea.value.substring(selectionEnd);
            this.textarea.value = beforeSelection + imageRows + afterSelection;
            this.textarea.selectionStart = selectionStart;
            this.textarea.selectionEnd = selectionStart + imageRows.length;
            this.textarea.dispatchEvent(new Event("input", { bubbles: true }));
        });
        const initialHost = ImageHostService.getSelectedHost();
        const hostDropdown = new DropdownMenuComponent(["imgur", "catbox", "imgbb"], DOM_DOM.create("div", "markdown-taskbar-image-host", initialHost), (value) => {
            ImageHostService.setSelectedHost(value);
            hostDropdown.trigger.replaceChildren(value);
        }, initialHost);
        const wrapWithLink = DOM_DOM.createDiv(null, LinkIcon());
        if (StaticSettings.options.pasteWrapImagesWithLink.getValue()) {
            wrapWithLink.classList.add("void-color-blue");
        }
        wrapWithLink.addEventListener("click", () => {
            const value = StaticSettings.options.pasteWrapImagesWithLink.getValue();
            StaticSettings.options.pasteWrapImagesWithLink.setValue(!value);
            if (value) {
                wrapWithLink.classList.remove("void-color-blue");
            }
            else {
                wrapWithLink.classList.add("void-color-blue");
            }
        });
        StaticTooltip.register(wrapWithLink, "Wrap images with a link");
        const wrapWithImage = DOM_DOM.createDiv(null, ImageIcon());
        if (StaticSettings.options.pasteEnabled.getValue()) {
            wrapWithImage.classList.add("void-color-blue");
        }
        wrapWithImage.addEventListener("click", () => {
            const value = StaticSettings.options.pasteEnabled.getValue();
            StaticSettings.options.pasteEnabled.setValue(!value);
            if (value) {
                wrapWithImage.classList.remove("void-color-blue");
            }
            else {
                wrapWithImage.classList.add("void-color-blue");
            }
        });
        const imageWidth = DOM_DOM.createDiv("icon-rotate-90", ChevronUpDownIcon());
        const widthRange = RangeField(StaticSettings.options.pasteImageWidthValue.getValue(), (event) => {
            StaticSettings.options.pasteImageWidthValue.setValue(event.target.value);
        }, 1000, 5, 10);
        const widthPercentage = DOM_DOM.createDiv(null, StaticSettings.options.pasteImageUnitIsPercentage.getValue() ? "%" : "PX");
        widthPercentage.addEventListener("click", () => {
            const value = StaticSettings.options.pasteImageUnitIsPercentage.getValue();
            StaticSettings.options.pasteImageUnitIsPercentage.setValue(!value);
            const range = widthRange.querySelector("input");
            const display = widthRange.querySelector(".void-range-display");
            if (!value) {
                const width = Math.min(StaticSettings.options.pasteImageWidthValue.getValue(), 100);
                StaticSettings.options.pasteImageWidthValue.setValue(width);
                range.value = width.toString();
                display.replaceChildren(width.toString());
                range.setAttribute("max", "100");
                widthPercentage.replaceChildren("%");
            }
            else {
                range.setAttribute("max", "1000");
                widthPercentage.replaceChildren("PX");
            }
        });
        StaticTooltip.register(imageWidth, DOM_DOM.createDiv("flex", [widthRange, widthPercentage]), true);
        StaticTooltip.register(wrapWithImage, "Wrap images with image tag");
        return [uploadButton.element, hostDropdown.trigger, wrapWithLink, wrapWithImage, imageWidth];
    }
    createDraftManager() {
        const draftManager = new MarkdownDraftManager(this.textarea);
        const draftPopOver = new PopOverComponent(DOM_DOM.createDiv(null, DocumentTextIcon()), draftManager.element, {
            direction: DropdownDirection.top
        });
        return draftPopOver.trigger;
    }
    updateCharacterCounter() {
        this.characterCounter.replaceChildren(this.textarea.value.length + ` / ${this.isReply() ? "8000" : "10000"}`);
    }
    isReply() {
        return !!this.textarea.closest(".reply-wrap") ||
            !!this.textarea.closest(".activity-edit").querySelector(".void-activity-reply-controls-container[closed='false']");
    }
}

;// CONCATENATED MODULE: ./src/handlers/markdownTaskbarHandler.ts


class MarkdownTaskbarHandler {
    static addTaskbars() {
        if (!StaticSettings.options.markdownTaskbarEnabled.getValue()) {
            return;
        }
        const textareas = document.querySelectorAll(".activity-edit .input.el-textarea:not(:has(.void-markdown-taskbar))");
        for (const textarea of textareas) {
            this.addTaskbar(textarea);
        }
    }
    static addTaskbar(textareaContainer) {
        const markdownTaskbar = new MarkdownTaskbar(textareaContainer.querySelector("textarea"));
        textareaContainer.append(markdownTaskbar.element);
    }
}

;// CONCATENATED MODULE: ./src/assets/changeLog.js
class Version {
	versionNumber;
	featureList;
	constructor(versionNumber, featureList) {
		this.versionNumber = versionNumber ?? "";
		this.featureList = featureList ?? [];
	}
}

class Feature {
	description;
	option;
	constructor(description, option) {
		this.description = description ?? "";
		this.option = option ?? undefined;
	}
}

const changeLog = [
	new Version("1.25", [
		new Feature("Sync GIFs and images with your other devices through VoidAPI (requires VoidVerified API authorization)", "syncGifsToVoidApi")
	]),
	new Version("1.24", [
		new Feature("Create and vote on polls (requires VoidVerified API authorization).", "pollsEnabled"),
		new Feature("Add a taskbar to markdown editors.", "markdownTaskbarEnabled")
	]),
	new Version("1.23", [
		new Feature("Add Reply To selection to activities and replies.", "replyToEnabled"),
		new Feature("Add direct links to replies.", "replyDirectLinksEnabled"),
		new Feature("Scroll to reply if it is specified in the URL.", "scrollToReplyEnabled"),
		new Feature("Remember collapsed replies.", "rememberCollapsedReplies"),
	]),
	new Version("1.22", [
		new Feature("Replace videos with video links (mobile fix).", "replaceVideosWithLinksEnabled"),
		new Feature("Added a reload button to quick access notifications."),
		new Feature("Fixed VV adding a gap to end of page.")
	]),
	new Version("1.21", [
		new Feature("Enable VoidVerified QuickStart.", "quickStartEnabled"),
		new Feature("QuickStart can be opened by default with ctrl + space, or by clicking the console icon in navigation."),
		new Feature("Search activities, access notifications and verified users, change VV settings and quickly navigate to Anilist pages."),
		new Feature("Enable Message-feed in the home page.", "messageFeedEnabled"),
		new Feature("Added user bio to mini profile."),
		new Feature("Replace activity timestamp tooltips.", "activityTimestampTooltipsEnabled"),
		new Feature("Export and Import VV configurations in settings."),

	]),
	new Version("1.20", [
		new Feature("Hover over users to view a mini profile.", "miniProfileEnabled")
	]),
	new Version("1.19", [
		new Feature("Display animanga goals in profile overview.", "goalsEnabled"),
		new Feature("Hover image links to preview.", "imagePreviewEnabled")
	]),
	new Version("1.18", [
		new Feature("Removed support for user CSS.")
	]),
	new Version("1.17", [
		new Feature("Add collapse button to replies.", "collapsibleReplies"),
		new Feature("Collapse liked comments.", "autoCollapseLiked"),
		new Feature("Collapse your own replies.", "autoCollapseSelf"),
		new Feature("Fixed not being able to drag text to input fields because of image drag and drop feature.")
	]),
	new Version("1.16", [
		new Feature("Cache user CSS.")
	]),
	new Version("1.15", [
		new Feature("Added shortcuts to markdown editors.",
			"markdownHotkeys"),
		new Feature("Fix inserting clipboard multiple times in some cases."),
		new Feature("Pasting images to code editor doesn't wrap them in image tags."),
		new Feature("Enabled Find/Replace feature in CSS editors."),
		new Feature("Drag and drop images to upload them to image host.")
	]),
	new Version("1.14", [
		new Feature(
			"Add insta-reply to activity update in home feed.",
			"replyActivityUpdate",
		),
		new Feature("Replace CSS text fields with code editors.")
	]),
	new Version("1.13", [
		new Feature(
			"Replace AniList notification system.",
			"replaceNotifications",
		),
		new Feature(
			"Display quick access of notifications in home page.",
			"quickAccessNotificationsEnabled",
		),
		new Feature(
			"Fixed a bug where pasting text with line breaks inserted extra line breaks.",
		),
		new Feature(
			"Fixed a layout designer bug where a GIF did not loop correctly while previewing.",
		),
	]),
	new Version("1.12", [
		new Feature("Enable CSSpy in Layout & CSS tab."),
	]),
	new Version("1.11", [
		new Feature(
			"Fix AniList bug where private messages are displayed in List activity feed.",
			"hideMessagesFromListFeed",
		),
		new Feature(
			"Fix layout designer preview crashing the script when viewing a tab other than overview.",
		),
		new Feature(
			"Fix a bug where disabling layout preview would change another user's layout.",
		),
	]),
	new Version("1.10", [
		new Feature(
			"added a change log to introduce new features",
			"changeLogEnabled",
		),
		new Feature(
			"added a self-message button to user's own profile",
			"selfMessageEnabled",
		),
		new Feature("color coded Layout Designer and CSS action buttons"),
		new Feature(
			"fixed a bug where an API error when publishing CSS could lead to user's about being removed",
		),
	]),
	new Version("1.9", [
		new Feature(
			"added gif keyboard to save gifs/images for later use",
			"gifKeyboardEnabled",
		),
		new Feature(
			"open AniList links in the same tab",
			"removeAnilistBlanks",
		),
		new Feature("have multiple layouts in storage"),
		new Feature("secret field to hide API keys"),
	]),
	new Version("1.8", [
		new Feature("added toast notifications", "toasterEnabled"),
		new Feature(
			"added a timer until next refresh to Quick Access",
			"quickAccessTimer",
		),
		new Feature("added a refresh button to Quick Access"),
		new Feature("added Catbox.moe integration"),
		new Feature("fixed an error when publishing custom CSS or about"),
	]),
	new Version("1.7", [
		new Feature("added a Layout Designer", "layoutDesignerEnabled"),
	]),
];

;// CONCATENATED MODULE: ./src/utils/changeLog.js





class ChangeLog {
	#lastVersion;
	#settings;
	#lastVersionInLocalStorage = "void-verified-changelog-last-version";

	constructor(settings) {
		this.#settings = settings;
		this.#lastVersion = localStorage.getItem(
			this.#lastVersionInLocalStorage,
		);
	}

	renderChangeLog(forceDisplay = false) {
		if (
			!this.#settings.options.changeLogEnabled.getValue() &&
			!forceDisplay
		) {
			return;
		}

		if (!this.#newVersionExists() && !forceDisplay) {
			return;
		}

		const modalBody = [
			DOM_DOM.create(
				"div",
				"change-log-note",
				Note(
					"Here are some changes included in recent releases. You can enable new features here or later from settings. You can view this popup again or disable it from settings.",
				),
			),
		];
		modalBody.push(
			...changeLog.map((version) => {
				return this.#createModalContent(version);
			}),
		);

		document.body.append(
			Modal(modalBody, () => {
				this.#handleClose(this);
			}),
		);
	}

	#newVersionExists() {
		if (!this.#lastVersion) {
			return true;
		}
		const versions = changeLog.map((version) =>
			version.versionNumber.split("."),
		);
		const [lastMajorVersion, lastMinorVersion] =
			this.#lastVersion.split(".");

		for (const [majorVersion, minorVersion] of versions) {
			if (
				Number(majorVersion) > Number(lastMajorVersion) ||
				Number(minorVersion) > Number(lastMinorVersion)
			) {
				return true;
			}
		}

		return false;
	}

	#createModalContent(version) {
		const container = DOM_DOM.create("div");
		const header = DOM_DOM.create(
			"h3",
			"change-log-header",
			`Version ${version.versionNumber}`,
		);
		container.append(header);
		const list = DOM_DOM.create("ul", "change-log-list");
		const listItems = version.featureList.map((feature) => {
			return this.#createFeatureListItem(feature);
		});
		list.append(...listItems);
		container.append(list);
		return container;
	}

	#createFeatureListItem(feature) {
		const container = DOM_DOM.create("li");
		if (feature.option) {
			const value = this.#settings.options[feature.option].getValue();
			container.append(
				SettingLabel(
					feature.description,
					Checkbox(value, (event) => {
						this.#handleOptionChange(event, feature.option);
					}),
				),
			);
			return container;
		}
		container.append(
			DOM_DOM.create("span", "change-log-list-item", [
				DOM_DOM.create("span", null, "-"),
				DOM_DOM.create("span", null, feature.description),
			]),
		);
		return container;
	}

	#handleOptionChange(event, option) {
		const value = event.target.checked;
		StaticSettings.options[option].setValue(value);
	}

	#handleClose(_changeLog) {
		const version = changeLog[0].versionNumber;
		_changeLog.#lastVersion = version;
		localStorage.setItem(_changeLog.#lastVersionInLocalStorage, version);
	}
}

;// CONCATENATED MODULE: ./src/handlers/ConfigHandler.ts




const ignoredKeys = [
    LocalStorageKeys.miniProfileCache,
    LocalStorageKeys.notificationRelationsCache,
    LocalStorageKeys.notificationDeadLinkRelationsCache,
    LocalStorageKeys.readNotifications,
    LocalStorageKeys.collapsedContainers
];
class ConfigHandler {
    static renderSettings() {
        const container = DOM_DOM.createDiv();
        container.append(DOM_DOM.create("h4", null, "Import"));
        container.append(this.createInput());
        container.append(this.createExportSection());
        return container;
    }
    static createInput() {
        const input = DOM_DOM.create("input", "file-input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", ".json");
        input.addEventListener("change", (event) => {
            this.import(event.target.files[0]);
        });
        return DOM_DOM.create("div", "dropbox", [input, DOM_DOM.create("p", null, "Drop VoidVerified config json file here or click to upload")]);
    }
    static createExportSection() {
        const container = DOM_DOM.create("div");
        container.append(DOM_DOM.create("h4", null, "Export"));
        let exportedItems = Object.values(LocalStorageKeys)
            .filter(x => !ignoredKeys.includes(x))
            .map(x => {
            return { exported: true, value: x };
        });
        for (const { exported, value } of exportedItems) {
            const item = SettingLabel(value, Checkbox(exported, (event) => {
                exportedItems = exportedItems.map(x => x.value === value ? { ...x, exported: event.target.checked } : x);
            }));
            container.append(item);
        }
        const exportButton = Button("Export", () => {
            console.log(exportedItems);
            console.log(Object.entries(LocalStorageKeys));
            this.export(Object.entries(LocalStorageKeys)
                .filter(([_, value]) => exportedItems.find(x => x.value === value)?.exported));
        });
        container.append(exportButton);
        return container;
    }
    static export(items) {
        const voidVerifiedConfigs = {};
        for (const [key, value] of items.filter(([_, value]) => !ignoredKeys.includes(value))) {
            let item = localStorage.getItem(value);
            try {
                item = JSON.parse(item);
            }
            catch (error) {
                //
            }
            if (item) {
                voidVerifiedConfigs[key] = item;
            }
        }
        const configsAsString = JSON.stringify(voidVerifiedConfigs);
        const blob = new Blob([configsAsString], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = "VoidVerified_configs";
        link.href = url;
        link.click();
        window.URL.revokeObjectURL(url);
    }
    static import(file) {
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const configs = JSON.parse(e.target.result);
                for (const [key, value] of Object.entries(configs)) {
                    console.log(key, value);
                    if (typeof value !== "string") {
                        localStorage.setItem(LocalStorageKeys[key], JSON.stringify(value));
                    }
                    else {
                        localStorage.setItem(LocalStorageKeys[key], value);
                    }
                }
                Toaster.success("Config successfully imported.");
                window.location.reload();
            }
            catch (error) {
                console.error(error);
                Toaster.error("There was an error reading the file.");
            }
        };
        reader.readAsText(file);
    }
}

;// CONCATENATED MODULE: ./src/handlers/settingsUi.ts

















const subCategories = {
    users: "users",
    authorization: "authorization",
    imageHost: "image host",
    layout: "layout",
    globalCss: "global CSS",
    goals: "goals",
    toasts: "toasts",
    miniProfile: "mini profile",
    quickStart: "quickStart",
    importExport: "Import/Export",
    time: "time"
};
class SettingsUi {
    static activeCategory = "all";
    static activeSubCategory = "users";
    static container = DOM_DOM.createDiv("settings");
    static options = DOM_DOM.createDiv("settings-list");
    static subCategoryNav = DOM_DOM.createDiv("nav");
    static subCategoryContainer = DOM_DOM.createDiv();
    static render() {
        AnilistAuth.checkAuthFromUrl();
        const container = document.querySelector(".settings.container > .content");
        if (container.querySelector(".void-verfied-settings")) {
            return;
        }
        this.createSettings();
        container.append(this.container);
    }
    static removeSettings() {
        this.container?.remove();
    }
    static createSettings() {
        this.container.replaceChildren();
        this.createScriptInfo();
        this.renderCategories();
        this.renderOptions();
        this.container.append(this.options);
        this.container.append(DOM_DOM.createDiv("options-legend", [
            DOM_DOM.create("span", "auth-required", "Auth (AniList)"),
            DOM_DOM.create("span", "api-auth-required", "Auth (VoidVerified API)")
        ]));
        this.renderSubcategoriesNav();
        this.container.append(this.subCategoryNav);
        this.renderSubCategory();
        this.container.append(this.subCategoryContainer);
    }
    static createScriptInfo() {
        const headerContainer = DOM_DOM.create("div", "settings-header");
        const header = DOM_DOM.create("h1", null, "VoidVerified Settings");
        const versionInfo = DOM_DOM.create("p", null, [
            "Version: ",
            DOM_DOM.create("span", null, StaticSettings.version),
        ]);
        headerContainer.append(header);
        headerContainer.append(versionInfo);
        const author = DOM_DOM.create("p", null, [
            "Author: ",
            Link("voidnyan", "/user/voidnyan/"),
        ]);
        const changeLogButton = Button("View Changelog", () => {
            new ChangeLog(StaticSettings.settingsInstance).renderChangeLog(true);
        });
        headerContainer.append(header, versionInfo, author, changeLogButton);
        this.container.append(headerContainer);
    }
    static renderCategories() {
        const nav = new SelectComponent("all", ["all", ...Object.values(categories)], (value) => {
            this.activeCategory = value;
            this.renderOptions();
        });
        this.container.append(DOM_DOM.createDiv("nav", nav.element));
    }
    static renderOptions() {
        this.createOption = this.createOption.bind(this);
        const options = Object.values(StaticSettings.options)
            .filter((option) => option.category === this.activeCategory || this.activeCategory === "all")
            .map(this.createOption);
        this.options.replaceChildren(...options);
    }
    static createOption(option) {
        const value = option.getValue();
        const type = typeof value;
        let input;
        if (type === "boolean") {
            input = Checkbox(value, (event) => {
                option.setValue(event.target.checked);
                if (!this.shouldRenderSubcategory(this.activeSubCategory)) {
                    this.activeSubCategory = subCategories.users;
                    this.renderSubCategory();
                }
                this.renderSubcategoriesNav();
            });
        }
        else if (type === "string" || type === "number") {
            input = InputField(value, (event) => {
                option.setValue(event.target.value);
                if (!this.shouldRenderSubcategory(this.activeSubCategory)) {
                    this.activeSubCategory = subCategories.users;
                    this.renderSubCategory();
                }
                this.renderSubcategoriesNav();
            });
            if (type === "number") {
                input.setAttribute("type", type);
            }
        }
        input.setAttribute("id", option.key);
        const settingLabel = SettingLabel(option.description, input);
        if (option.authRequired) {
            settingLabel.classList.add("void-auth-required");
        }
        if (option.voidApiAuthRequired) {
            settingLabel.classList.add("void-api-auth-required");
        }
        return settingLabel;
    }
    static renderSubcategoriesNav() {
        const subCats = Object.values(subCategories).filter(this.shouldRenderSubcategory);
        const select = new SelectComponent("users", subCats, (value) => {
            this.activeSubCategory = value;
            this.renderSubCategory();
        });
        this.subCategoryNav.replaceChildren(select.element);
    }
    static shouldRenderSubcategory(subCategory) {
        switch (subCategory) {
            case subCategories.users:
            case subCategories.importExport:
            case subCategories.authorization:
            case subCategories.time:
                return true;
            case subCategories.imageHost:
                return StaticSettings.options.pasteImagesToHostService.getValue();
            case subCategories.layout:
                return StaticSettings.options.layoutDesignerEnabled.getValue();
            case subCategories.globalCss:
                return StaticSettings.options.globalCssEnabled.getValue();
            case subCategories.toasts:
                return StaticSettings.options.toasterEnabled.getValue();
            case subCategories.goals:
                return StaticSettings.options.goalsEnabled.getValue();
            case subCategories.miniProfile:
                return StaticSettings.options.miniProfileEnabled.getValue();
            case subCategories.quickStart:
                return StaticSettings.options.quickStartEnabled.getValue();
        }
    }
    static renderSubCategory() {
        this.subCategoryContainer.replaceChildren(this.getSubCategoryContainer());
    }
    static getSubCategoryContainer() {
        switch (this.activeSubCategory) {
            case subCategories.users:
                return VerifiedUsers.createUserTable();
            case subCategories.authorization:
                return AnilistAuth.createSettings();
            case subCategories.imageHost:
                return ImageHostService.createImageHostSettings();
            case subCategories.layout:
                return LayoutDesigner.createSettings();
            case subCategories.globalCss:
                return GlobalCSS.renderEditor();
            case subCategories.toasts:
                return Toaster.renderSettings();
            case subCategories.goals:
                return GoalsHandler.renderSettings();
            case subCategories.miniProfile:
                return MiniProfileHandler.renderSettings();
            case subCategories.importExport:
                return ConfigHandler.renderSettings();
            case subCategories.time:
                return Time.renderConfig();
            case subCategories.quickStart:
                return QuickStartHandler.createConfigContainer();
        }
    }
}

;// CONCATENATED MODULE: ./src/components/inputComponent.ts


class InputComponent {
    element;
    constructor(classes, placeholder) {
        this.element = DOM_DOM.create("input", transformClasses("input", classes));
        if (placeholder) {
            this.element.setAttribute("placeholder", placeholder);
        }
    }
    setType(type) {
        this.element.setAttribute("type", type);
    }
    addChangeListener(callback) {
        this.element.addEventListener("change", callback);
    }
    setValue(value) {
        this.element.value = value;
    }
    getValue() {
        return this.element.value;
    }
}

;// CONCATENATED MODULE: ./src/handlers/pollHandler/pollFormComponent.ts









class PollFormComponent {
    element;
    trigger;
    body;
    titleInput;
    allowMultipleVotesInput;
    closesAtInput;
    optionsContainer;
    options = [];
    textarea;
    constructor(markdownEditor) {
        this.trigger = IconButton(ChatBubbleLeftRightIcon(), () => {
        }, "gif-button");
        this.trigger.setAttribute("title", "Create Poll");
        this.trigger.addEventListener("click", () => {
            const isClosed = this.element.getAttribute("closed") === "true";
            this.element.setAttribute("closed", (!isClosed).toString());
        });
        this.textarea = markdownEditor.parentElement.querySelector(".input textarea");
        this.element = DOM_DOM.createDiv("markdown-dialog-container");
        this.element.setAttribute("closed", "true");
        this.element.append(DOM_DOM.createDiv("markdown-dialog-header", "Create a Poll"));
        if (!VoidApi.token) {
            this.body = DOM_DOM.createDiv("markdown-dialog-body", "Creating polls requires authorizing VoidVerified API in the settings.");
            this.element.append(this.body);
            return;
        }
        this.body = DOM_DOM.createDiv("markdown-dialog-body flex flex-column gap-5 items-start");
        this.element.append(this.body);
        this.titleInput = new InputComponent("w-100", "Ask a question...");
        this.body.append(this.titleInput.element);
        this.addOption = this.addOption.bind(this);
        this.createPoll = this.createPoll.bind(this);
        this.addControls();
    }
    addControls() {
        this.optionsContainer = DOM_DOM.createDiv("flex flex-column gap-5 w-100");
        this.body.append(this.optionsContainer);
        this.addOption();
        this.addOption();
        this.addAddButton();
        this.addPollConfiguration();
        this.addCreatePollButton();
    }
    addOption() {
        const input = new InputComponent("w-100", "Option...");
        const linkInput = new InputComponent(null, "Link (optional)");
        const deleteButton = DOM_DOM.createDiv("has-icon cursor-pointer", XMarkIcon());
        const container = DOM_DOM.createDiv("flex gap-5 items-center", [input.element, linkInput.element, deleteButton]);
        const o = {
            description: input,
            link: linkInput
        };
        deleteButton.addEventListener("click", () => {
            container.remove();
            this.options = this.options.filter(x => x !== o);
        });
        this.optionsContainer.append(container);
        this.options.push(o);
    }
    addAddButton() {
        const button = new ButtonComponent("Add an Option", this.addOption);
        this.body.append(button.element);
    }
    addPollConfiguration() {
        const container = DOM_DOM.createDiv("mt-10");
        this.allowMultipleVotesInput = new SelectComponent("No", ["Yes", "No"], () => { });
        container.append(Label("Allow multiple votes", this.allowMultipleVotesInput.element));
        this.closesAtInput = new InputComponent();
        this.closesAtInput.setType("datetime-local");
        this.closesAtInput.element.setAttribute("min", new Date().toISOString().slice(0, -8));
        container.append(Label("Closes at", this.closesAtInput.element));
        this.body.append(container);
    }
    addCreatePollButton() {
        const button = new ButtonComponent("Create Poll", this.createPoll);
        this.body.append(button.element);
    }
    async createPoll() {
        const createPoll = {
            title: this.titleInput.getValue(),
            options: this.options.map(x => { return { description: x.description.getValue(), link: x.link.getValue() }; }),
            allowMultipleVotes: this.allowMultipleVotesInput.activeValue === "Yes",
            closesAt: new Date(this.closesAtInput.getValue())
        };
        if (!this.pollIsValid(createPoll)) {
            return;
        }
        try {
            const poll = await VoidApi.createPoll(createPoll);
            this.textarea.setRangeText(`[ img100%(${VoidApi.url}/polls/poll-image/${poll.id}) ](${VoidApi.url.replace("/api", "")}/polls/poll/${poll.id})`);
            this.textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
        catch (error) {
            Toaster.error("Failed to create a poll.", error);
        }
    }
    pollIsValid(createPoll) {
        let validationErrors = [];
        if (createPoll.title.length < 5 || createPoll.title.length > 50) {
            validationErrors.push("Poll title should be between 5 and 50 characters.");
        }
        if (createPoll.options.length < 2 || createPoll.options.length > 15) {
            validationErrors.push("Poll should have between 2 and 15 options.");
        }
        if (createPoll.options.map(x => x.description).some(x => x.length < 2 || x.length > 50)) {
            validationErrors.push("All options should be between 2 and 50 characters.");
        }
        if (createPoll.closesAt && new Date(createPoll.closesAt).getTime() < new Date().getTime()) {
            validationErrors.push("Close time should be in the future.");
        }
        if (validationErrors.length > 0) {
            Dialog.inform(validationErrors.join("\n"), "Invalid Poll");
            return false;
        }
        return true;
    }
}

;// CONCATENATED MODULE: ./src/utils/domPurify.ts
class DomPurify {
    static sanitize(input) {
        // @ts-ignore
        return DOMPurify.sanitize(input);
    }
}

;// CONCATENATED MODULE: ./src/handlers/pollHandler/pollComponent.ts








class PollComponent {
    element;
    options;
    pollId;
    totalVotes;
    isClosed;
    constructor(poll) {
        this.pollId = poll.id;
        this.isClosed = poll.isClosed;
        this.updateTotalVotesCount(poll);
        this.element = DOM_DOM.createDiv("poll-container");
        this.createHeader(poll);
        this.options = DOM_DOM.createDiv("poll-options");
        this.updateResults(poll);
        this.element.append(this.options);
    }
    updateResults(poll) {
        this.options.replaceChildren();
        for (const option of poll.options) {
            this.options.append(this.createOption(option));
        }
    }
    createOption(option) {
        const desc = DOM_DOM.createDiv("poll-option-description", DomPurify.sanitize(option.description));
        const percentage = (option.voteCount / Math.max(this.totalVotes, 1) * 100).toFixed(1);
        const voteStats = DOM_DOM.createDiv("poll-option-count", `${option.voteCount} votes (${percentage}%)`);
        const item = DOM_DOM.createDiv("poll-option", [desc, voteStats]);
        if (!this.isClosed) {
            item.classList.add("void-cursor-pointer");
            item.addEventListener("click", async () => {
                try {
                    const poll = await VoidApi.vote({
                        pollId: this.pollId,
                        optionId: option.id,
                        isVoted: !option.isVoted
                    });
                    this.updateTotalVotesCount(poll);
                    this.updateResults(poll);
                }
                catch (error) {
                    Toaster.error("There was an error while voting.", error);
                }
            });
        }
        if (option.link && option.link.trim() !== "") {
            const openLink = document.createElement("a");
            openLink.setAttribute("target", "_blank");
            const href = DomPurify.sanitize(option.link);
            openLink.setAttribute("href", href);
            openLink.classList.add("void-poll-option-link");
            openLink.append(ArrowTopRightOnSquareIcon());
            openLink.addEventListener("click", (event) => {
                event.stopPropagation();
            });
            desc.append(openLink);
        }
        const percentageBar = DOM_DOM.create("div", "poll-option-percentage-bar", null, {
            style: `width: ${percentage}%`
        });
        item.append(percentageBar);
        if (option.isVoted) {
            item.classList.add("void-voted");
        }
        return item;
    }
    createHeader(poll) {
        const header = DOM_DOM.createDiv("poll-header");
        header.append(DOM_DOM.createDiv(null, DomPurify.sanitize(poll.title)));
        const endContainer = DOM_DOM.createDiv("poll-header-time");
        console.log(poll);
        let closeMessage;
        if (!poll.closesAt) {
            closeMessage = "Closes never";
        }
        else {
            closeMessage = poll.isClosed ? "Closed " + Time.convertToString(new Date(poll.closesAt).getTime() / 1000) : "Closes " + Time.toUpcomingString(poll.closesAt);
        }
        const closesAt = DOM_DOM.createDiv(null, closeMessage);
        endContainer.append(closesAt);
        if (poll.isOwner) {
            const deleteButton = IconButton(XMarkIcon(), () => {
                Dialog.confirm(async () => {
                    try {
                        await VoidApi.deletePoll(poll.id);
                        this.element.remove();
                        Dialog.inform("Remove the element from the activity or reply.", "Poll deleted.");
                    }
                    catch (error) {
                        console.error(error);
                        Toaster.error("There was an error deleting poll.", error);
                    }
                }, "Are you sure you want to delete this poll?", "Delete poll?");
            });
            endContainer.append(deleteButton);
        }
        header.append(endContainer);
        this.element.append(header);
    }
    updateTotalVotesCount(poll) {
        this.totalVotes = poll.options.reduce((a, b) => {
            return a + b.voteCount;
        }, 0);
    }
}

;// CONCATENATED MODULE: ./src/handlers/pollHandler/pollHandler.ts





class PollHandler {
    static addPollForms() {
        if (!StaticSettings.options.pollsEnabled.getValue()) {
            return;
        }
        const editors = document.querySelectorAll(".markdown-editor");
        for (const editor of editors) {
            if (editor.querySelector("div[title='Create Poll']")) {
                continue;
            }
            this.addPollForm(editor);
        }
    }
    static replacePollImages() {
        const pollImages = document.querySelectorAll(`img[src^="${VoidApi.url}/polls/poll-image/"]:not(img[void-poll-handling="true"])`);
        for (const pollImage of pollImages) {
            this.replacePollImage(pollImage);
        }
    }
    static async replacePollImage(pollImage) {
        if (!StaticSettings.options.pollsEnabled.getValue()) {
            return;
        }
        if (pollImage.closest(".preview")) {
            return;
        }
        pollImage.setAttribute("void-poll-handling", "true");
        try {
            const pollId = Number(pollImage.src.substring(`${VoidApi.url}/polls/poll-image/`.length));
            const poll = await VoidApi.getPoll(pollId);
            const pollComponent = new PollComponent(poll);
            const imageParent = pollImage.parentElement;
            if (imageParent.tagName.toLowerCase() === "a" && imageParent.getAttribute("href").startsWith(VoidApi.url.replace("/api", ""))) {
                imageParent.replaceWith(pollComponent.element);
            }
            else {
                pollImage.replaceWith(pollComponent.element);
            }
        }
        catch (error) {
            Toaster.error("Failed to get poll data.", error);
        }
    }
    static addPollForm(editor) {
        const pollForm = new PollFormComponent(editor);
        editor.append(pollForm.trigger);
        editor.insertAdjacentElement("afterend", pollForm.element);
    }
}

;// CONCATENATED MODULE: ./src/handlers/intervalScriptHandler.ts
























class IntervalScriptHandler {
    styleHandler;
    settings;
    quickAccess;
    anilistFeedFixHandler;
    notificationQuickAccessHandler;
    notificationFeedHandler;
    activityPostHandler;
    markdownHotkeys;
    pasteHandler;
    constructor(settings) {
        this.settings = settings;
        this.styleHandler = new StyleHandler(settings);
        this.quickAccess = new QuickAccess(settings);
        this.anilistFeedFixHandler = new AnilistFeedFixHandler(settings);
        this.notificationQuickAccessHandler =
            new NotificationQuickAccessHandler(settings);
        this.notificationFeedHandler = new NotificationFeedHandler(settings);
        this.activityPostHandler = new ActivityPostHandler(settings);
        this.markdownHotkeys = new MarkdownHotkeys(settings);
        this.pasteHandler = new PasteHandler(settings);
    }
    currentPath = "";
    evaluationIntervalInSeconds = 1;
    hasPathChanged(path) {
        if (path === this.currentPath) {
            return false;
        }
        this.currentPath = path;
        return true;
    }
    handleIntervalScripts(intervalScriptHandler) {
        const path = window.location.pathname;
        DomDataHandler.addActivityIdsToDom();
        DomDataHandler.addReplyIdsToDom();
        QuickStartHandler.addNavigationButtons();
        ActivityHandler.moveAndDisplaySubscribeButton();
        ActivityHandler.addSelfMessageButton();
        ActivityHandler.removeBlankFromAnilistLinks();
        ActivityHandler.addCollapseReplyButtons();
        GifKeyboardHandler.handleGifKeyboard();
        LayoutDesigner.renderLayoutPreview();
        intervalScriptHandler.anilistFeedFixHandler.handleFix();
        intervalScriptHandler.notificationFeedHandler.renderNotificationsFeed();
        intervalScriptHandler.markdownHotkeys.renderSettings();
        intervalScriptHandler.pasteHandler.registerDragAndDropInputs();
        ActivityHandler.handleImageLinkPreview();
        MiniProfileHandler.addUserHoverListeners();
        ActivityHandler.addTooltipsToTimestamps();
        VideoFixer.replaceVideosWithLinks();
        QuoteHandler.addQuoteClickHandlers();
        DomDataHandler.scrollToReply();
        QuoteHandler.addDirectLinksToReplies();
        MarkdownTaskbarHandler.addTaskbars();
        PollHandler.addPollForms();
        PollHandler.replacePollImages();
        if (path === "/home") {
            intervalScriptHandler.styleHandler.refreshHomePage();
            intervalScriptHandler.quickAccess.renderQuickAccess();
            intervalScriptHandler.notificationQuickAccessHandler.renderNotifications();
            intervalScriptHandler.activityPostHandler.render();
            MessageFeedHandler.addFeedFilter();
        }
        else {
            intervalScriptHandler.notificationQuickAccessHandler.resetShouldRender();
        }
        if (!path.startsWith("/settings/developer")) {
            SettingsUi.removeSettings();
        }
        if (!intervalScriptHandler.hasPathChanged(path)) {
            return;
        }
        GoalsHandler.removeGoalsContainer();
        if (path.startsWith("/user/")) {
            intervalScriptHandler.quickAccess.clearBadge();
            intervalScriptHandler.styleHandler.verifyProfile();
            intervalScriptHandler.anilistFeedFixHandler.handleFilters();
            GoalsHandler.renderGoals();
        }
        else {
            intervalScriptHandler.styleHandler.clearStyles("profile");
        }
        GlobalCSS.createCss();
        if (path.startsWith("/settings/developer")) {
            SettingsUi.render();
        }
    }
    enableScriptIntervalHandling() {
        const interval = setInterval(() => {
            try {
                this.handleIntervalScripts(this);
            }
            catch (error) {
                console.error(error);
                Toaster.critical([
                    "A critical error has occured running interval script loop. VoidVerified is not working correctly. Please check developer console and contact ",
                    Link("voidnyan", "/user/voidnyan/", "_blank"),
                    ".",
                ]);
                clearInterval(interval);
            }
        }, this.evaluationIntervalInSeconds * 1000);
    }
}

;// CONCATENATED MODULE: ./src/handlers/libraryLoader.ts
class LibraryLoader {
    static loadScript(url, callback) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    }
    static loadLibraries() {
        this.loadAceEditor();
        // DOMPurify (https://github.com/cure53/DOMPurify), used to sanitize user generated content before rendering
        // this.loadScript("https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.2.4/purify.min.js");
    }
    // Ace Editor (https://github.com/ajaxorg/ace) used to create a code editor for global CSS
    static loadAceEditor() {
        this.loadScript("https://cdnjs.cloudflare.com/ajax/libs/ace/1.35.0/ace.min.js", () => {
            // @ts-ignore
            ace.config.set("packaged", true);
            // @ts-ignore
            ace.config.set("basePath", "https://cdnjs.cloudflare.com/ajax/libs/ace/1.35.0/ace.min.js");
            // this.loadScript("https://cdnjs.cloudflare.com/ajax/libs/ace/1.35.0/worker-css.js'", () => {});
            this.loadScript("https://cdnjs.cloudflare.com/ajax/libs/ace/1.35.0/mode-css.min.js", () => {
                // @ts-ignore
                ace.config.setModuleUrl("ace/mode/css", "https://cdnjs.cloudflare.com/ajax/libs/ace/1.35.0/mode-css.min.js");
            });
            this.loadScript("https://cdnjs.cloudflare.com/ajax/libs/ace/1.35.0/ext-inline_autocomplete.min.js", () => {
                // @ts-ignore
                ace.config.setModuleUrl("https://cdnjs.cloudflare.com/ajax/libs/ace/1.35.0/ext-inline_autocomplete.min.js");
            });
            this.loadScript("https://cdnjs.cloudflare.com/ajax/libs/ace/1.35.0/ext-beautify.min.js", () => {
                // @ts-ignore
                ace.config.setModuleUrl("https://cdnjs.cloudflare.com/ajax/libs/ace/1.35.0/ext-beautify.min.js");
            });
            this.loadScript("https://cdnjs.cloudflare.com/ajax/libs/ace/1.9.6/theme-monokai.min.js", () => {
                // @ts-ignore
                ace.config.setModuleUrl("https://cdnjs.cloudflare.com/ajax/libs/ace/1.9.6/theme-monokai.min.js");
            });
            this.loadScript("https://cdnjs.cloudflare.com/ajax/libs/ace/1.9.6/theme-dawn.min.js", () => {
                // @ts-ignore
                ace.config.setModuleUrl("https://cdnjs.cloudflare.com/ajax/libs/ace/1.9.6/theme-dawn.min.js");
            });
            this.loadScript("https://cdnjs.cloudflare.com/ajax/libs/ace/1.35.0/keybinding-vscode.min.js", () => {
                // @ts-ignore
                ace.config.setModuleUrl("https://cdnjs.cloudflare.com/ajax/libs/ace/1.35.0/keybinding-vscode.min.js");
            });
            this.loadScript("https://cdnjs.cloudflare.com/ajax/libs/ace/1.35.2/ext-searchbox.min.js", () => {
                // @ts-ignore
                ace.config.setModuleUrl("https://cdnjs.cloudflare.com/ajax/libs/ace/1.35.2/ext-searchbox.min.js");
            });
        });
    }
}

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js");
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js");
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js");
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js");
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/assets/styles/styles.css
var styles = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./src/assets/styles/styles.css");
;// CONCATENATED MODULE: ./src/assets/styles/styles.css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(styles/* default */.A, options);




       /* harmony default export */ const styles_styles = (styles/* default */.A && styles/* default */.A.locals ? styles/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/assets/styles/markdownDialog.css
var markdownDialog = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./src/assets/styles/markdownDialog.css");
;// CONCATENATED MODULE: ./src/assets/styles/markdownDialog.css

      
      
      
      
      
      
      
      
      

var markdownDialog_options = {};

markdownDialog_options.styleTagTransform = (styleTagTransform_default());
markdownDialog_options.setAttributes = (setAttributesWithoutAttributes_default());

      markdownDialog_options.insert = insertBySelector_default().bind(null, "head");
    
markdownDialog_options.domAPI = (styleDomAPI_default());
markdownDialog_options.insertStyleElement = (insertStyleElement_default());

var markdownDialog_update = injectStylesIntoStyleTag_default()(markdownDialog/* default */.A, markdownDialog_options);




       /* harmony default export */ const styles_markdownDialog = (markdownDialog/* default */.A && markdownDialog/* default */.A.locals ? markdownDialog/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/assets/styles/keyInput.css
var keyInput = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./src/assets/styles/keyInput.css");
;// CONCATENATED MODULE: ./src/assets/styles/keyInput.css

      
      
      
      
      
      
      
      
      

var keyInput_options = {};

keyInput_options.styleTagTransform = (styleTagTransform_default());
keyInput_options.setAttributes = (setAttributesWithoutAttributes_default());

      keyInput_options.insert = insertBySelector_default().bind(null, "head");
    
keyInput_options.domAPI = (styleDomAPI_default());
keyInput_options.insertStyleElement = (insertStyleElement_default());

var keyInput_update = injectStylesIntoStyleTag_default()(keyInput/* default */.A, keyInput_options);




       /* harmony default export */ const styles_keyInput = (keyInput/* default */.A && keyInput/* default */.A.locals ? keyInput/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/assets/styles/goals.css
var goals = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./src/assets/styles/goals.css");
;// CONCATENATED MODULE: ./src/assets/styles/goals.css

      
      
      
      
      
      
      
      
      

var goals_options = {};

goals_options.styleTagTransform = (styleTagTransform_default());
goals_options.setAttributes = (setAttributesWithoutAttributes_default());

      goals_options.insert = insertBySelector_default().bind(null, "head");
    
goals_options.domAPI = (styleDomAPI_default());
goals_options.insertStyleElement = (insertStyleElement_default());

var goals_update = injectStylesIntoStyleTag_default()(goals/* default */.A, goals_options);




       /* harmony default export */ const styles_goals = (goals/* default */.A && goals/* default */.A.locals ? goals/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/assets/styles/miniProfile.css
var miniProfile = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./src/assets/styles/miniProfile.css");
;// CONCATENATED MODULE: ./src/assets/styles/miniProfile.css

      
      
      
      
      
      
      
      
      

var miniProfile_options = {};

miniProfile_options.styleTagTransform = (styleTagTransform_default());
miniProfile_options.setAttributes = (setAttributesWithoutAttributes_default());

      miniProfile_options.insert = insertBySelector_default().bind(null, "head");
    
miniProfile_options.domAPI = (styleDomAPI_default());
miniProfile_options.insertStyleElement = (insertStyleElement_default());

var miniProfile_update = injectStylesIntoStyleTag_default()(miniProfile/* default */.A, miniProfile_options);




       /* harmony default export */ const styles_miniProfile = (miniProfile/* default */.A && miniProfile/* default */.A.locals ? miniProfile/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/assets/styles/quickStart.css
var quickStart = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./src/assets/styles/quickStart.css");
;// CONCATENATED MODULE: ./src/assets/styles/quickStart.css

      
      
      
      
      
      
      
      
      

var quickStart_options = {};

quickStart_options.styleTagTransform = (styleTagTransform_default());
quickStart_options.setAttributes = (setAttributesWithoutAttributes_default());

      quickStart_options.insert = insertBySelector_default().bind(null, "head");
    
quickStart_options.domAPI = (styleDomAPI_default());
quickStart_options.insertStyleElement = (insertStyleElement_default());

var quickStart_update = injectStylesIntoStyleTag_default()(quickStart/* default */.A, quickStart_options);




       /* harmony default export */ const styles_quickStart = (quickStart/* default */.A && quickStart/* default */.A.locals ? quickStart/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/assets/styles/activity.css
var activity = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./src/assets/styles/activity.css");
;// CONCATENATED MODULE: ./src/assets/styles/activity.css

      
      
      
      
      
      
      
      
      

var activity_options = {};

activity_options.styleTagTransform = (styleTagTransform_default());
activity_options.setAttributes = (setAttributesWithoutAttributes_default());

      activity_options.insert = insertBySelector_default().bind(null, "head");
    
activity_options.domAPI = (styleDomAPI_default());
activity_options.insertStyleElement = (insertStyleElement_default());

var activity_update = injectStylesIntoStyleTag_default()(activity/* default */.A, activity_options);




       /* harmony default export */ const styles_activity = (activity/* default */.A && activity/* default */.A.locals ? activity/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/assets/styles/markdownEditor.css
var markdownEditor = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./src/assets/styles/markdownEditor.css");
;// CONCATENATED MODULE: ./src/assets/styles/markdownEditor.css

      
      
      
      
      
      
      
      
      

var markdownEditor_options = {};

markdownEditor_options.styleTagTransform = (styleTagTransform_default());
markdownEditor_options.setAttributes = (setAttributesWithoutAttributes_default());

      markdownEditor_options.insert = insertBySelector_default().bind(null, "head");
    
markdownEditor_options.domAPI = (styleDomAPI_default());
markdownEditor_options.insertStyleElement = (insertStyleElement_default());

var markdownEditor_update = injectStylesIntoStyleTag_default()(markdownEditor/* default */.A, markdownEditor_options);




       /* harmony default export */ const styles_markdownEditor = (markdownEditor/* default */.A && markdownEditor/* default */.A.locals ? markdownEditor/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/assets/styles/collapsibleContainer.css
var collapsibleContainer = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./src/assets/styles/collapsibleContainer.css");
;// CONCATENATED MODULE: ./src/assets/styles/collapsibleContainer.css

      
      
      
      
      
      
      
      
      

var collapsibleContainer_options = {};

collapsibleContainer_options.styleTagTransform = (styleTagTransform_default());
collapsibleContainer_options.setAttributes = (setAttributesWithoutAttributes_default());

      collapsibleContainer_options.insert = insertBySelector_default().bind(null, "head");
    
collapsibleContainer_options.domAPI = (styleDomAPI_default());
collapsibleContainer_options.insertStyleElement = (insertStyleElement_default());

var collapsibleContainer_update = injectStylesIntoStyleTag_default()(collapsibleContainer/* default */.A, collapsibleContainer_options);




       /* harmony default export */ const styles_collapsibleContainer = (collapsibleContainer/* default */.A && collapsibleContainer/* default */.A.locals ? collapsibleContainer/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/assets/styles/dialog.css
var dialog = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./src/assets/styles/dialog.css");
;// CONCATENATED MODULE: ./src/assets/styles/dialog.css

      
      
      
      
      
      
      
      
      

var dialog_options = {};

dialog_options.styleTagTransform = (styleTagTransform_default());
dialog_options.setAttributes = (setAttributesWithoutAttributes_default());

      dialog_options.insert = insertBySelector_default().bind(null, "head");
    
dialog_options.domAPI = (styleDomAPI_default());
dialog_options.insertStyleElement = (insertStyleElement_default());

var dialog_update = injectStylesIntoStyleTag_default()(dialog/* default */.A, dialog_options);




       /* harmony default export */ const styles_dialog = (dialog/* default */.A && dialog/* default */.A.locals ? dialog/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/assets/styles/dropdownMenu.css
var dropdownMenu = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./src/assets/styles/dropdownMenu.css");
;// CONCATENATED MODULE: ./src/assets/styles/dropdownMenu.css

      
      
      
      
      
      
      
      
      

var dropdownMenu_options = {};

dropdownMenu_options.styleTagTransform = (styleTagTransform_default());
dropdownMenu_options.setAttributes = (setAttributesWithoutAttributes_default());

      dropdownMenu_options.insert = insertBySelector_default().bind(null, "head");
    
dropdownMenu_options.domAPI = (styleDomAPI_default());
dropdownMenu_options.insertStyleElement = (insertStyleElement_default());

var dropdownMenu_update = injectStylesIntoStyleTag_default()(dropdownMenu/* default */.A, dropdownMenu_options);




       /* harmony default export */ const styles_dropdownMenu = (dropdownMenu/* default */.A && dropdownMenu/* default */.A.locals ? dropdownMenu/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/assets/styles/markdownTaskbar.css
var markdownTaskbar = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./src/assets/styles/markdownTaskbar.css");
;// CONCATENATED MODULE: ./src/assets/styles/markdownTaskbar.css

      
      
      
      
      
      
      
      
      

var markdownTaskbar_options = {};

markdownTaskbar_options.styleTagTransform = (styleTagTransform_default());
markdownTaskbar_options.setAttributes = (setAttributesWithoutAttributes_default());

      markdownTaskbar_options.insert = insertBySelector_default().bind(null, "head");
    
markdownTaskbar_options.domAPI = (styleDomAPI_default());
markdownTaskbar_options.insertStyleElement = (insertStyleElement_default());

var markdownTaskbar_update = injectStylesIntoStyleTag_default()(markdownTaskbar/* default */.A, markdownTaskbar_options);




       /* harmony default export */ const styles_markdownTaskbar = (markdownTaskbar/* default */.A && markdownTaskbar/* default */.A.locals ? markdownTaskbar/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/assets/styles/fileInput.css
var fileInput = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./src/assets/styles/fileInput.css");
;// CONCATENATED MODULE: ./src/assets/styles/fileInput.css

      
      
      
      
      
      
      
      
      

var fileInput_options = {};

fileInput_options.styleTagTransform = (styleTagTransform_default());
fileInput_options.setAttributes = (setAttributesWithoutAttributes_default());

      fileInput_options.insert = insertBySelector_default().bind(null, "head");
    
fileInput_options.domAPI = (styleDomAPI_default());
fileInput_options.insertStyleElement = (insertStyleElement_default());

var fileInput_update = injectStylesIntoStyleTag_default()(fileInput/* default */.A, fileInput_options);




       /* harmony default export */ const styles_fileInput = (fileInput/* default */.A && fileInput/* default */.A.locals ? fileInput/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/assets/styles/markdownDraftManager.css
var markdownDraftManager = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./src/assets/styles/markdownDraftManager.css");
;// CONCATENATED MODULE: ./src/assets/styles/markdownDraftManager.css

      
      
      
      
      
      
      
      
      

var markdownDraftManager_options = {};

markdownDraftManager_options.styleTagTransform = (styleTagTransform_default());
markdownDraftManager_options.setAttributes = (setAttributesWithoutAttributes_default());

      markdownDraftManager_options.insert = insertBySelector_default().bind(null, "head");
    
markdownDraftManager_options.domAPI = (styleDomAPI_default());
markdownDraftManager_options.insertStyleElement = (insertStyleElement_default());

var markdownDraftManager_update = injectStylesIntoStyleTag_default()(markdownDraftManager/* default */.A, markdownDraftManager_options);




       /* harmony default export */ const styles_markdownDraftManager = (markdownDraftManager/* default */.A && markdownDraftManager/* default */.A.locals ? markdownDraftManager/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/assets/styles/utility-classes.css
var utility_classes = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./src/assets/styles/utility-classes.css");
;// CONCATENATED MODULE: ./src/assets/styles/utility-classes.css

      
      
      
      
      
      
      
      
      

var utility_classes_options = {};

utility_classes_options.styleTagTransform = (styleTagTransform_default());
utility_classes_options.setAttributes = (setAttributesWithoutAttributes_default());

      utility_classes_options.insert = insertBySelector_default().bind(null, "head");
    
utility_classes_options.domAPI = (styleDomAPI_default());
utility_classes_options.insertStyleElement = (insertStyleElement_default());

var utility_classes_update = injectStylesIntoStyleTag_default()(utility_classes/* default */.A, utility_classes_options);




       /* harmony default export */ const styles_utility_classes = (utility_classes/* default */.A && utility_classes/* default */.A.locals ? utility_classes/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/assets/styles/poll.css
var poll = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./src/assets/styles/poll.css");
;// CONCATENATED MODULE: ./src/assets/styles/poll.css

      
      
      
      
      
      
      
      
      

var poll_options = {};

poll_options.styleTagTransform = (styleTagTransform_default());
poll_options.setAttributes = (setAttributesWithoutAttributes_default());

      poll_options.insert = insertBySelector_default().bind(null, "head");
    
poll_options.domAPI = (styleDomAPI_default());
poll_options.insertStyleElement = (insertStyleElement_default());

var poll_update = injectStylesIntoStyleTag_default()(poll/* default */.A, poll_options);




       /* harmony default export */ const styles_poll = (poll/* default */.A && poll/* default */.A.locals ? poll/* default */.A.locals : undefined);

;// CONCATENATED MODULE: ./src/assets/styles/styleRegister.ts


















class StyleRegister {
    static registerStyles() {
        const styleHandler = new StyleHandler(new Settings());
        const css = [
            styles_styles,
            styles_markdownDialog,
            styles_keyInput,
            styles_goals,
            styles_miniProfile,
            styles_quickStart,
            styles_activity,
            styles_markdownEditor,
            styles_collapsibleContainer,
            styles_dialog,
            styles_dropdownMenu,
            styles_markdownTaskbar,
            styles_fileInput,
            styles_markdownDraftManager,
            styles_utility_classes,
            styles_poll
        ];
        styleHandler.createStyleLink(css.join("\n"), "script");
    }
}

;// CONCATENATED MODULE: ./src/utils/closeOverlaysHandler.ts



class CloseOverlaysHandler {
    static initialize() {
        hotkeys("esc", "all", () => {
            if (Dialog.isOpen()) {
                Dialog.close();
            }
            else if (QuickStartHandler.isOpen()) {
                QuickStartHandler.closeQuickStart();
            }
        });
    }
}

;// CONCATENATED MODULE: ./src/voidverified.user.js
























ImageHostService.initialize();
AnilistAuth.initialize();
VerifiedUsers.initialize();
StaticSettings.initialize();
GlobalCSS.initialize();
LibraryLoader.loadLibraries();
Vue.ensureIsRegistered();
StaticTooltip.initialize();
LayoutDesigner.initialize();
MiniProfileHandler.initialize();

GoalsHandler.initialize();
new MarkdownHotkeys(StaticSettings.settingsInstance).setupMarkdownHotkeys();
QuickStartHandler.initialize();
Toaster.initializeToaster(StaticSettings.settingsInstance);
const styleHandler = new StyleHandler(StaticSettings.settingsInstance);
styleHandler.refreshStyles();
StyleRegister.registerStyles();
CloseOverlaysHandler.initialize();
QuoteHandler.addSelectionListener();
GifKeyboardHandler.getGifsFromApi();

try {
	const intervalScriptHandler = new IntervalScriptHandler(StaticSettings.settingsInstance);
	intervalScriptHandler.enableScriptIntervalHandling();
} catch (error) {
	Toaster.critical(
		"A critical error has occured setting up intervalScriptHandler. Please check developer console and contact voidnyan.",
	);
	console.error(error);
}

try {
	const pasteHandler = new PasteHandler(StaticSettings.settingsInstance);
	pasteHandler.setup();
} catch (error) {
	Toaster.critical(
		"A critical error has occured setting up pasteHandler. Please check developer console and contact voidnyan.",
	);
}

new ChangeLog(StaticSettings.settingsInstance).renderChangeLog();

new ImgurAPI(
	ImageHostService.getImageHostConfiguration(imageHosts.imgur),
).refreshAuthToken();

console.log(`VoidVerified ${StaticSettings.settingsInstance.version} loaded.`);

})();

/******/ })()
;