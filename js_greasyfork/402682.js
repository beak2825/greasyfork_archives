// ==UserScript==
// @name         4chan sounds player
// @version      3.5.0
// @namespace    rccom
// @description  A player designed for 4chan sounds threads.
// @author       RCC
// @match        *://boards.4chan.org/*
// @match        *://boards.4channel.org/*
// @match        *://desuarchive.org/*
// @match        *://arch.b4k.co/*
// @match        *://archived.moe/*
// @match        *://warosu.org/*
// @match        *://archive.nyafuu.org/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @grant        GM_addValueChangeListener
// @connect      4chan.org
// @connect      4channel.org
// @connect      a.4cdn.org
// @connect      desu-usergeneratedcontent.xyz
// @connect      arch-img.b4k.co
// @connect      archive-media-0.nyafuu.org
// @connect      4cdn.org
// @connect      a.pomf.cat
// @connect      pomf.cat
// @connect      files.catbox.moe
// @connect      catbox.moe
// @connect      share.dmca.gripe
// @connect      z.zz.ht
// @connect      z.zz.fo
// @connect      zz.ht
// @connect      too.lewd.se
// @connect      lewd.se
// @connect      *
// @run-at       document-start
// @require      https://gitcdn.link/repo/richtr/NoSleep.js/07fcee254724ab1b79076fbc22f3dd447649a2eb/dist/NoSleep.min.js
// @require      https://gitcdn.link/repo/Stuk/jszip/7bbcb3873db23f6d27550cdbb6c4cc2bdeb32194/dist/jszip.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.min.js
// @downloadURL https://update.greasyfork.org/scripts/402682/4chan%20sounds%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/402682/4chan%20sounds%20player.meta.js
// ==/UserScript==


/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/bootstrap-icons/icons/arrow-clockwise.svg":
/*!****************************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/arrow-clockwise.svg ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-arrow-clockwise\" viewBox=\"0 0 16 16\">\n  <path fill-rule=\"evenodd\" d=\"M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z\"/>\n  <path d=\"M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/arrow-down.svg":
/*!***********************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/arrow-down.svg ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-arrow-down\" viewBox=\"0 0 16 16\">\n  <path fill-rule=\"evenodd\" d=\"M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/arrow-repeat.svg":
/*!*************************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/arrow-repeat.svg ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-arrow-repeat\" viewBox=\"0 0 16 16\">\n  <path d=\"M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z\"/>\n  <path fill-rule=\"evenodd\" d=\"M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/arrow-up.svg":
/*!*********************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/arrow-up.svg ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-arrow-up\" viewBox=\"0 0 16 16\">\n  <path fill-rule=\"evenodd\" d=\"M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/arrows-collapse.svg":
/*!****************************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/arrows-collapse.svg ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-arrows-collapse\" viewBox=\"0 0 16 16\">\n  <path fill-rule=\"evenodd\" d=\"M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zm7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0zm-.5 11.707l-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0v-3.793z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/arrows-expand.svg":
/*!**************************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/arrows-expand.svg ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-arrows-expand\" viewBox=\"0 0 16 16\">\n  <path fill-rule=\"evenodd\" d=\"M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zM7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/bootstrap-reboot.svg":
/*!*****************************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/bootstrap-reboot.svg ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-bootstrap-reboot\" viewBox=\"0 0 16 16\">\n  <path d=\"M1.161 8a6.84 6.84 0 1 0 6.842-6.84.58.58 0 0 1 0-1.16 8 8 0 1 1-6.556 3.412l-.663-.577a.58.58 0 0 1 .227-.997l2.52-.69a.58.58 0 0 1 .728.633l-.332 2.592a.58.58 0 0 1-.956.364l-.643-.56A6.812 6.812 0 0 0 1.16 8z\"/>\n  <path d=\"M6.641 11.671V8.843h1.57l1.498 2.828h1.314L9.377 8.665c.897-.3 1.427-1.106 1.427-2.1 0-1.37-.943-2.246-2.456-2.246H5.5v7.352h1.141zm0-3.75V5.277h1.57c.881 0 1.416.499 1.416 1.32 0 .84-.504 1.324-1.386 1.324h-1.6z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/box-arrow-in-left.svg":
/*!******************************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/box-arrow-in-left.svg ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-box-arrow-in-left\" viewBox=\"0 0 16 16\">\n  <path fill-rule=\"evenodd\" d=\"M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0v-2z\"/>\n  <path fill-rule=\"evenodd\" d=\"M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/box-arrow-right.svg":
/*!****************************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/box-arrow-right.svg ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-box-arrow-right\" viewBox=\"0 0 16 16\">\n  <path fill-rule=\"evenodd\" d=\"M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z\"/>\n  <path fill-rule=\"evenodd\" d=\"M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/chat-right-quote.svg":
/*!*****************************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/chat-right-quote.svg ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-chat-right-quote\" viewBox=\"0 0 16 16\">\n  <path d=\"M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z\"/>\n  <path d=\"M7.066 4.76A1.665 1.665 0 0 0 4 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/check-square.svg":
/*!*************************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/check-square.svg ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-check-square\" viewBox=\"0 0 16 16\">\n  <path d=\"M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z\"/>\n  <path d=\"M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/chevron-down.svg":
/*!*************************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/chevron-down.svg ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-chevron-down\" viewBox=\"0 0 16 16\">\n  <path fill-rule=\"evenodd\" d=\"M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/chevron-up.svg":
/*!***********************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/chevron-up.svg ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-chevron-up\" viewBox=\"0 0 16 16\">\n  <path fill-rule=\"evenodd\" d=\"M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/file-earmark-image.svg":
/*!*******************************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/file-earmark-image.svg ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-file-earmark-image\" viewBox=\"0 0 16 16\">\n  <path d=\"M6.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z\"/>\n  <path d=\"M14 14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5V14zM4 1a1 1 0 0 0-1 1v10l2.224-2.224a.5.5 0 0 1 .61-.075L8 11l2.157-3.02a.5.5 0 0 1 .76-.063L13 10V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/file-earmark-music.svg":
/*!*******************************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/file-earmark-music.svg ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-file-earmark-music\" viewBox=\"0 0 16 16\">\n  <path d=\"M11 6.64a1 1 0 0 0-1.243-.97l-1 .25A1 1 0 0 0 8 6.89v4.306A2.572 2.572 0 0 0 7 11c-.5 0-.974.134-1.338.377-.36.24-.662.628-.662 1.123s.301.883.662 1.123c.364.243.839.377 1.338.377.5 0 .974-.134 1.338-.377.36-.24.662-.628.662-1.123V8.89l2-.5V6.64z\"/>\n  <path d=\"M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/filter.svg":
/*!*******************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/filter.svg ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-filter\" viewBox=\"0 0 16 16\">\n  <path d=\"M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/fullscreen-exit.svg":
/*!****************************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/fullscreen-exit.svg ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-fullscreen-exit\" viewBox=\"0 0 16 16\">\n  <path d=\"M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5zM0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zm10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/fullscreen.svg":
/*!***********************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/fullscreen.svg ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-fullscreen\" viewBox=\"0 0 16 16\">\n  <path d=\"M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/gear.svg":
/*!*****************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/gear.svg ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-gear\" viewBox=\"0 0 16 16\">\n  <path d=\"M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z\"/>\n  <path d=\"M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/github.svg":
/*!*******************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/github.svg ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-github\" viewBox=\"0 0 16 16\">\n  <path d=\"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/image.svg":
/*!******************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/image.svg ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-image\" viewBox=\"0 0 16 16\">\n  <path d=\"M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z\"/>\n  <path d=\"M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/info-circle.svg":
/*!************************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/info-circle.svg ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-info-circle\" viewBox=\"0 0 16 16\">\n  <path d=\"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\"/>\n  <path d=\"M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/layout-text-window.svg":
/*!*******************************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/layout-text-window.svg ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-layout-text-window\" viewBox=\"0 0 16 16\">\n  <path d=\"M3 6.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z\"/>\n  <path d=\"M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v1H1V2a1 1 0 0 1 1-1h12zm1 3v10a1 1 0 0 1-1 1h-2V4h3zm-4 0v11H2a1 1 0 0 1-1-1V4h10z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/link-45deg.svg":
/*!***********************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/link-45deg.svg ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-link-45deg\" viewBox=\"0 0 16 16\">\n  <path d=\"M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.001 1.001 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z\"/>\n  <path d=\"M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 0 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 0 0-4.243-4.243L6.586 4.672z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/music-note-list.svg":
/*!****************************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/music-note-list.svg ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-music-note-list\" viewBox=\"0 0 16 16\">\n  <path d=\"M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2z\"/>\n  <path fill-rule=\"evenodd\" d=\"M12 3v10h-1V3h1z\"/>\n  <path d=\"M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1V2.82z\"/>\n  <path fill-rule=\"evenodd\" d=\"M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/pause-fill.svg":
/*!***********************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/pause-fill.svg ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-pause-fill\" viewBox=\"0 0 16 16\">\n  <path d=\"M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/pause.svg":
/*!******************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/pause.svg ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-pause\" viewBox=\"0 0 16 16\">\n  <path d=\"M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/play-fill.svg":
/*!**********************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/play-fill.svg ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-play-fill\" viewBox=\"0 0 16 16\">\n  <path d=\"M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/play.svg":
/*!*****************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/play.svg ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-play\" viewBox=\"0 0 16 16\">\n  <path d=\"M10.804 8L5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/plus-circle.svg":
/*!************************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/plus-circle.svg ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-plus-circle\" viewBox=\"0 0 16 16\">\n  <path d=\"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\"/>\n  <path d=\"M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/search.svg":
/*!*******************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/search.svg ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-search\" viewBox=\"0 0 16 16\">\n  <path d=\"M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/shuffle.svg":
/*!********************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/shuffle.svg ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-shuffle\" viewBox=\"0 0 16 16\">\n  <path fill-rule=\"evenodd\" d=\"M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5z\"/>\n  <path d=\"M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/skip-end-fill.svg":
/*!**************************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/skip-end-fill.svg ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-skip-end-fill\" viewBox=\"0 0 16 16\">\n  <path d=\"M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.308v7.384c0 .63.692 1.01 1.233.697L11.5 8.753V12a.5.5 0 0 0 1 0V4z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/skip-end.svg":
/*!*********************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/skip-end.svg ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-skip-end\" viewBox=\"0 0 16 16\">\n  <path d=\"M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.713 3.31 4 3.655 4 4.308v7.384c0 .653.713.998 1.233.696L11.5 8.752V12a.5.5 0 0 0 1 0V4zM5 4.633L10.804 8 5 11.367V4.633z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/skip-start-fill.svg":
/*!****************************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/skip-start-fill.svg ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-skip-start-fill\" viewBox=\"0 0 16 16\">\n  <path d=\"M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.54-.313 1.232.066 1.232.696v7.384c0 .63-.692 1.01-1.232.697L5 8.753V12a.5.5 0 0 1-1 0V4z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/skip-start.svg":
/*!***********************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/skip-start.svg ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-skip-start\" viewBox=\"0 0 16 16\">\n  <path d=\"M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.52-.302 1.233.043 1.233.696v7.384c0 .653-.713.998-1.233.696L5 8.752V12a.5.5 0 0 1-1 0V4zm7.5.633L5.696 8l5.804 3.367V4.633z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/soundwave.svg":
/*!**********************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/soundwave.svg ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-soundwave\" viewBox=\"0 0 16 16\">\n  <path fill-rule=\"evenodd\" d=\"M8.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5zm-2 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm-6 1.5A.5.5 0 0 1 5 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm8 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm-10 1A.5.5 0 0 1 3 7v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5zm12 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/speaker.svg":
/*!********************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/speaker.svg ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-speaker\" viewBox=\"0 0 16 16\">\n  <path d=\"M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z\"/>\n  <path d=\"M8 4.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zM8 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-3.5 1.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/square.svg":
/*!*******************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/square.svg ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-square\" viewBox=\"0 0 16 16\">\n  <path d=\"M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/tools.svg":
/*!******************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/tools.svg ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-tools\" viewBox=\"0 0 16 16\">\n  <path d=\"M1 0L0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.356 3.356a1 1 0 0 0 1.414 0l1.586-1.586a1 1 0 0 0 0-1.414l-3.356-3.356a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3c0-.269-.035-.53-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814L1 0zm9.646 10.646a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708zM3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026L3 11z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/trash.svg":
/*!******************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/trash.svg ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-trash\" viewBox=\"0 0 16 16\">\n  <path d=\"M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z\"/>\n  <path fill-rule=\"evenodd\" d=\"M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/volume-mute-fill.svg":
/*!*****************************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/volume-mute-fill.svg ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-volume-mute-fill\" viewBox=\"0 0 16 16\">\n  <path d=\"M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/volume-mute.svg":
/*!************************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/volume-mute.svg ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-volume-mute\" viewBox=\"0 0 16 16\">\n  <path d=\"M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM6 5.04L4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96V5.04zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/volume-up-fill.svg":
/*!***************************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/volume-up-fill.svg ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-volume-up-fill\" viewBox=\"0 0 16 16\">\n  <path d=\"M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z\"/>\n  <path d=\"M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z\"/>\n  <path d=\"M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/volume-up.svg":
/*!**********************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/volume-up.svg ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-volume-up\" viewBox=\"0 0 16 16\">\n  <path d=\"M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z\"/>\n  <path d=\"M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z\"/>\n  <path d=\"M10.025 8a4.486 4.486 0 0 1-1.318 3.182L8 10.475A3.489 3.489 0 0 0 9.025 8c0-.966-.392-1.841-1.025-2.475l.707-.707A4.486 4.486 0 0 1 10.025 8zM7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12V4zM4.312 6.39L6 5.04v5.92L4.312 9.61A.5.5 0 0 0 4 9.5H2v-3h2a.5.5 0 0 0 .312-.11z\"/>\n</svg>");

/***/ }),

/***/ "./node_modules/bootstrap-icons/icons/x.svg":
/*!**************************************************!*\
  !*** ./node_modules/bootstrap-icons/icons/x.svg ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-x\" viewBox=\"0 0 16 16\">\n  <path d=\"M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z\"/>\n</svg>");

/***/ }),

/***/ "./src/_.js":
/*!******************!*\
  !*** ./src/_.js ***!
  \******************/
/***/ ((module) => {

const _ = module.exports;

module.exports.set = function set(object, path, value) {
	const props = path.split('.');
	const lastProp = props.pop();
	const setOn = props.reduce((obj, k) => obj[k] || (obj[k] = {}), object);
	setOn && (setOn[lastProp] = value);
	return object;
};

module.exports.get = function get(object, path, dflt) {
	if (typeof path !== 'string') {
		return dflt;
	}
	if (path === '') {
		return object;
	}
	const props = path.split('.');
	const lastProp = props.pop();
	const parent = props.reduce((obj, k) => obj && obj[k], object);
	return parent && lastProp in parent
		? parent[lastProp]
		: dflt;
};

/**
 * Check two values are equal. Arrays/Objects are deep checked.
 */
module.exports.isEqual = function isEqual(a, b, strict = true) {
	if (typeof a !== typeof b) {
		return false;
	}
	if (Array.isArray(a, b)) {
		return a === b || a.length === b.length && a.every((_a, i) => isEqual(_a, b[i]));
	}
	if (a && b && typeof a === 'object' && a !== b) {
		const allKeys = Object.keys(a);
		allKeys.push(...Object.keys(b).filter(k => !allKeys.includes(k)));
		return allKeys.every(key => _.isEqual(a[key], b[key]));
	}
	// eslint-disable-next-line eqeqeq
	return strict ? a === b : a == b;
};

module.exports.toDuration = function toDuration(number) {
	number = Math.floor(number || 0);
	let [ seconds, minutes, hours ] = _duration(0, number);
	seconds < 10 && (seconds = '0' + seconds);
	hours && minutes < 10 && (minutes = '0' + minutes);
	return (hours ? hours + ':' : '') + minutes + ':' + seconds;
};

module.exports.timeAgo = function timeAgo(date) {
	const [ seconds, minutes, hours, days, weeks ] = _duration(Math.floor(date), Math.floor(Date.now() / 1000));
	/* _eslint-disable indent */
	return weeks > 1 ? weeks + ' weeks ago'
		: days > 0 ? days + (days === 1 ? ' day' : ' days') + ' ago'
		: hours > 0 ? hours + (hours === 1 ? ' hour' : ' hours') + ' ago'
		: minutes > 0 ? minutes + (minutes === 1 ? ' minute' : ' minutes') + ' ago'
		: seconds + (seconds === 1 ? ' second' : ' seconds') + ' ago';
	/* eslint-enable indent */
};

function _duration(from, to) {
	const diff = Math.max(0, to - from);
	return [
		diff % 60,
		Math.floor(diff / 60) % 60,
		Math.floor(diff / 60 / 60) % 24,
		Math.floor(diff / 60 / 60 / 24) % 7,
		Math.floor(diff / 60 / 60 / 24 / 7)
	];
}

module.exports.element = function element(html, parent, position = 'beforeend') {
	let el;
	if (html instanceof Node) {
		el = html;
	} else {
		const container = document.createElement('div');
		container.innerHTML = html;
		el = container.children[0];
	}
	parent && parent.insertAdjacentElement(position, el);
	el instanceof Element && _.elementHandler(el);
	return el;
};

module.exports.elementHTML = function elementHTML(el, content) {
	el.innerHTML = content;
	_.elementHandler(el);
};

module.exports.elementHandler = function elementHandler(el) {
	// Wire up resize elements.
	el.querySelectorAll(`.${ns}-expander`).forEach(el => {
		el.classList.add('no-touch-action');
		Player.events.set(el, 'pointdragstart', 'position.initResize');
		Player.events.set(el, 'pointdrag.unbound', 'position.doResize');
		Player.events.set(el, 'pointdragend', 'position.stopResize');
	});
	// Wire up popovers.
	const popovers = Array.from(el.querySelectorAll(`.${ns}-popover`));
	el.classList.contains(`${ns}-popover`) && (popovers.push(el));
	popovers.forEach(popover => {
		popover.addEventListener('mouseenter', Player.display._popoverMouseEnter);
		popover.addEventListener('mouseleave', Player.display._popoverMouseLeave);
		popover.nodeName !== 'A' && popover.addEventListener('click', Player.display._popoverClick);
	});
	// Wire up events from attributes.
	Player.events.apply(el);
};

module.exports.escAttr = function (str, escapeDoubleQuote) {
	return str
		.replace(';', '&#59;')
		.replace(/'/g, '&#39;')
		.replace(/"/g, escapeDoubleQuote ? '\\&#34;' : '&#34;')
		.replace(/\n/g, '\\n');
};


/***/ }),

/***/ "./src/api.js":
/*!********************!*\
  !*** ./src/api.js ***!
  \********************/
/***/ ((module) => {

const cache = {};

module.exports = {
	get
};

async function get(url) {
	return new Promise(function (resolve, reject) {
		const headers = {};
		if (cache[url]) {
			headers['If-Modified-Since'] = cache[url].lastModified;
		}
		GM.xmlHttpRequest({
			method: 'GET',
			url,
			headers,
			responseType: 'json',
			onload: response => {
				if (response.status >= 200 && response.status < 300) {
					cache[url] = { lastModified: response.responseHeaders['last-modified'], response: response.response };
				}
				resolve(response.status === 304 ? cache[url].response : response.response);
			},
			onerror: reject
		});
	});
}


/***/ }),

/***/ "./src/components/actions/index.js":
/*!*****************************************!*\
  !*** ./src/components/actions/index.js ***!
  \*****************************************/
/***/ ((module) => {

module.exports = {
	atRoot: [ 'togglePlay', 'play', 'pause', 'next', 'previous', 'stop', 'toggleMute', 'volumeUp', 'volumeDown' ],
	public: [ 'togglePlay', 'play', 'pause', 'next', 'previous', 'stop', 'toggleMute', 'volumeUp', 'volumeDown' ],

	initialize() {
		// Keep this reference to switch Player.audio to standalone videos and back.
		Player.controls._audio = Player.audio;
	},

	/**
	 * Switching being playing and paused.
	 */
	togglePlay() {
		if (Player.audio.paused) {
			Player.play();
		} else {
			Player.pause();
		}
	},

	/**
	 * Start playback.
	 */
	async play(sound, { paused } = {}) {
		try {
			// Handle id instead of sound object.
			if (typeof sound === 'string') {
				sound = Player.sounds.find(s => s.id === sound);
			}
			// If nothing is currently selected to play start playing the first sound.
			if (!sound && !Player.playing && Player.sounds.length) {
				sound = Player.sounds[0];
			}

			// If a new sound is being played update the display.
			if (sound && sound !== Player.playing) {
				if (Player.playing) {
					Player.playing.playing = false;
				}
				// Remove play on load listeners for the previous sound.
				Player.video.removeEventListener('canplaythrough', Player.actions.playOnceLoaded);
				Player.audio.removeEventListener('canplaythrough', Player.actions.playOnceLoaded);
				// Remove audio events from the video, and add them back for standalone video.
				const audioEvents = Player.controls.audioEvents;
				for (let evt in audioEvents) {
					let handlers = Array.isArray(audioEvents[evt]) ? audioEvents[evt] : [ audioEvents[evt] ];
					handlers.forEach(handler => {
						const handlerFunction = Player.getHandler(handler);
						Player.video.removeEventListener(evt, handlerFunction);
						sound.standaloneVideo && Player.video.addEventListener(evt, handlerFunction);
					});
				}
				sound.playing = true;
				Player.playing = sound;
				Player.audio.src = sound.src;
				Player.isVideo = sound.image.endsWith('.webm') || sound.type === 'video/webm';
				Player.isStandalone = sound.standaloneVideo;
				Player.video.loop = !Player.isStandalone;
				Player.audio = sound.standaloneVideo ? Player.video : Player.controls._audio;
				Player.audio._linked = Player.isVideo && !Player.isStandalone && Player.video;
				Player.video._linked = Player.isVideo && !Player.isStandalone && Player.audio;
				Player.container.classList[Player.isVideo ? 'add' : 'remove']('playing-video');
				Player.container.classList[Player.isVideo || sound.image.endsWith('gif') ? 'add' : 'remove']('playing-animated');
				await Player.trigger('playsound', sound);
			}

			if (!paused) {
				// If there's a video and sound wait for both to load before playing.
				if (!Player.isStandalone && Player.isVideo && (Player.video.readyState < 3 || Player.audio.readyState < 3)) {
					Player.video.addEventListener('canplaythrough', Player.actions.playOnceLoaded);
					Player.audio.addEventListener('canplaythrough', Player.actions.playOnceLoaded);
				} else {
					Player.audio.play();
				}
			}
		} catch (err) {
			Player.logError('There was an error playing the sound. Please check the console for details.', err);
		}
	},

	/**
	 * Handler to only start playback once the video and audio are both loaded.
	 */
	playOnceLoaded(e) {
		if (e.currentTarget.readyState > 3 && e.currentTarget._linked.readyState > 3) {
			e.currentTarget.removeEventListener('canplaythrough', Player.actions.playOnceLoaded);
			e.currentTarget._linked.removeEventListener('canplaythrough', Player.actions.playOnceLoaded);
			e.currentTarget._inlinePlayer && e.currentTarget._inlinePlayer.pendingControls && e.currentTarget._inlinePlayer.pendingControls();
			e.currentTarget._linked.play();
			e.currentTarget.play();
		} else {
			!e.currentTarget.paused && e.currentTarget.pause();
			!e.currentTarget._linked.paused && e.currentTarget._linked.pause();
			e.currentTarget.currentTime !== 0 && (e.currentTarget.currentTime = 0);
			e.currentTarget._linked.currentTime !== 0 && (e.currentTarget._linked.currentTime = 0);
		}
	},

	/**
	 * Pause playback.
	 */
	pause() {
		Player.audio && Player.audio.pause();
	},

	/**
	 * Stop playback.
	 */
	stop() {
		Player.audio.src = null;
		Player.playing = null;
		Player.isVideo = false;
		Player.isStandalone = false;
		Player.trigger('stop');
	},

	/**
	 * Play the next sound.
	 */
	next(opts) {
		Player.actions._movePlaying(1, opts);
	},

	/**
	 * Play the previous sound.
	 */
	previous(opts) {
		// Over three seconds into a sound restarts it instead.
		const restartSeconds = typeof Player.config.restartSeconds == 'number' && Player.config.restartSeconds;
		if (restartSeconds && Player.audio.currentTime > restartSeconds) {
			Player.audio.currentTime = 0;
		} else {
			Player.actions._movePlaying(-1, opts);
		}
	},

	_movePlaying(direction, { force, group, paused } = {}) {
		// If there's no sound fall out.
		if (!Player.sounds.length) {
			return;
		}
		// If there's no sound currently playing or it's not in the list then just play the first sound.
		const currentIndex = Player.sounds.indexOf(Player.playing);
		if (currentIndex === -1) {
			return Player.play(Player.sounds[0]);
		}
		// Get the next index, either repeating the same, wrapping round to repeat all or just moving the index.
		let nextSound;
		if (!force && Player.config.repeat === 'one') {
			nextSound = Player.sounds[currentIndex];
		} else {
			let newIndex = currentIndex;
			// Get the next index wrapping round if repeat all is selected
			// Keep going if it's group move, there's still more sounds to check, and the next sound is still in the same group.
			do {
				newIndex = Player.config.repeat === 'all'
					? ((newIndex + direction) + Player.sounds.length) % Player.sounds.length
					: newIndex + direction;
				nextSound = Player.sounds[newIndex];
			} while (group && nextSound && newIndex !== currentIndex && (!nextSound.post || nextSound.post === Player.playing.post));
		}
		nextSound && Player.play(nextSound, { paused });
	},

	/**
	 * Raise the volume by 5%.
	 */
	volumeUp() {
		Player.audio.volume = Math.min(Player.audio.volume + 0.05, 1);
	},

	/**
	 * Lower the volume by 5%.
	 */
	volumeDown() {
		Player.audio.volume = Math.max(Player.audio.volume - 0.05, 0);
	},

	/**
	 * Mute the audio, or reset it to the last volume prior to muting.
	 */
	toggleMute() {
		Player.audio.volume = (Player._lastVolume || 0.5) * !Player.audio.volume;
	}
};


/***/ }),

/***/ "./src/components/controls/index.js":
/*!******************************************!*\
  !*** ./src/components/controls/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var _ = __webpack_require__(/*! ./src/_ */ "./src/_.js");
module.exports = {
	template: __webpack_require__(/*! ./templates/controls.tpl */ "./src/components/controls/templates/controls.tpl"),

	audioEvents: {
		ended: () => Player.config.autoplayNext && Player.next(),
		pause: 'controls.handleMediaEvent',
		play: 'controls.handleMediaEvent',
		seeked: 'controls.handleMediaEvent',
		waiting: 'controls.handleMediaEvent',
		ratechange: 'controls.handleMediaEvent',
		timeupdate: 'controls.updateDuration',
		loadedmetadata: [ 'controls.updateDuration', 'controls' ],
		durationchange: 'controls.updateDuration',
		volumechange: 'controls.updateVolume',
		loadstart: 'controls.pollForLoading',
		error: 'controls.handleAudioError'
	},

	actions: {
		previous: 'previous({ force: true })',
		playPause: 'togglePlay',
		next: 'next({ force: true })',
		seek: 'controls.handleSeek($event, "main")',
		mute: 'toggleMute',
		volume: 'controls.handleVolume($event, "main")',
		fullscreen: 'display.toggleFullScreen'
	},

	async initialize() {
		// Apply the previous volume
		GM.getValue('volume').then(volume => volume >= 0 && volume <= 1 && (Player.audio.volume = volume));

		// Only poll for the loaded data when the player is open.
		Player.on('show', () => Player._hiddenWhilePolling && Player.controls.pollForLoading());
		Player.on('hide', () => {
			Player._hiddenWhilePolling = !!Player._loadingPoll;
			Player.controls.stopPollingForLoading();
		});
		Player.on('rendered', () => {
			Player.video = Player.$(`.${ns}-video`);
			Player.video.dataset.id = 'main';
			// Keep track of heavily updated elements.
			Player.audio.volumeBar = Player.video.volumeBar = Player.$(`.${ns}-volume-bar .${ns}-current-bar`);
			Player.audio.currentTimeBar = Player.video.currentTimeBar = Player.$(`.${ns}-seek-bar .${ns}-current-bar`);
			Player.audio.loadedBar = Player.video.loadedBar = Player.$(`.${ns}-seek-bar .${ns}-loaded-bar`);

			// Set the initial volume/seek bar positions and hidden controls.
			Player.controls.updateDuration({ currentTarget: Player.audio });
			Player.controls.updateVolume({ currentTarget: Player.audio });
			Player.controls.preventWrapping();
		});
		// Show all the controls when wrapping prevention is disabled.
		Player.on('config:preventControlsWrapping', newValue => !newValue && Player.controls.showAllControls());
		// Reset the hidden controls when the hide order is changed.
		Player.on('config:controlsHideOrder', () => {
			Player.controls.setHideOrder();
			Player.controls.preventWrapping();
		});
		// Sync audio/video when the tab is focused.
		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'visible') {
				Player.controls.sync(Player.audio);
			}
		});
	},

	/**
	 * Handle audio errors
	 */
	handleAudioError(err) {
		if (Player.playing) {
			Player.logError(`Failed to play ${Player.playing.title}. Please check the console for details.`, err, 'warning');
			Player.playing.error = err;
			setTimeout(() => Player.next({ paused: true }), 3000);
		}
	},

	/**
	 * Handle audio events. Sync the video up, and update the controls.
	 */
	handleMediaEvent(e) {
		const audio = e.currentTarget._inlineAudio || e.currentTarget;
		Player.controls.sync(e.currentTarget);
		Player.controls.updateDuration(e);
		document.querySelectorAll(`.${ns}-play-button[data-audio="${audio.dataset.id}"]`).forEach(el => {
			el.classList[audio.paused ? 'add' : 'remove'](`${ns}-play`);
		});
	},

	/**
	 * Sync the webm to the audio. Matches the videos time and play state to the audios.
	 */
	sync(from) {
		const to = from._linked;
		if (from && from.readyState > 3 && to && to.readyState > 3) {
			to.currentTime = from.currentTime % to.duration;
			to[from.paused ? 'pause' : 'play']();
			to.playbackRate = from.playbackRate;
			to.defaultPlaybackRate = from.defaultPlaybackRate;
		}
	},

	/**
	 * Poll for how much has loaded. I know there's the progress event but it unreliable.
	 */
	pollForLoading() {
		Player._loadingPoll = Player._loadingPoll || setInterval(Player.controls.updateLoaded, 1000);
	},

	/**
	 * Stop polling for how much has loaded.
	 */
	stopPollingForLoading() {
		Player._loadingPoll && clearInterval(Player._loadingPoll);
		Player._loadingPoll = null;
	},

	/**
	 * Update the loading bar.
	 */
	updateLoaded() {
		const length = Player.audio.buffered.length;
		const size = length > 0
			? (Player.audio.buffered.end(length - 1) / Player.audio.duration) * 100
			: 0;
		// If it's fully loaded then stop polling.
		size === 100 && Player.controls.stopPollingForLoading();
		Player.audio.loadedBar.style.width = size + '%';
	},

	/**
	 * Update the seek bar and the duration labels.
	 */
	updateDuration(e) {
		const media = e.currentTarget;
		const audio = media._inlineAudio || media;
		const controls = media._inlinePlayer ? media._inlinePlayer.controls : document;
		const currentTime = _.toDuration(media.currentTime);
		const duration = _.toDuration(media.duration);
		const audioId = audio.dataset.id;
		// Gross use of childNodes to avoid textContent triggering mutation observers of other scripts.
		controls && controls.querySelectorAll(`.${ns}-current-time[data-audio="${audioId}"]`).forEach(el => el.childNodes[0].textContent = currentTime);
		controls && controls.querySelectorAll(`.${ns}-duration[data-audio="${audioId}"]`).forEach(el => el.childNodes[0].textContent = duration);
		Player.controls.updateProgressBarPosition(audio.currentTimeBar, media.currentTime, media.duration);
	},

	/**
	 * Update the volume bar.
	 */
	updateVolume(e) {
		const audio = e.currentTarget._inlineAudio || e.currentTarget;
		const controls = audio._inlinePlayer ? audio._inlinePlayer.controls : Player.container;
		const vol = audio.volume;
		// Store volume of the main player.
		if (audio === Player.audio) {
			vol > 0 && (Player._lastVolume = vol);
			GM.setValue('volume', vol);
		}
		controls && controls.querySelectorAll(`.${ns}-volume-button[data-audio="${audio.dataset.id}"]`).forEach(el => {
			el.classList[vol === 0 ? 'add' : 'remove']('mute');
			el.classList[vol > 0 ? 'add' : 'remove']('up');
		});
		Player.controls.updateProgressBarPosition(audio.volumeBar, audio.volume, 1);
	},

	/**
	 * Update a progress bar width. Adjust the margin of the circle so it's contained within the bar at both ends.
	 */
	updateProgressBarPosition(bar, current, total) {
		if (!bar) {
			return;
		}
		current || (current = 0);
		total || (total = 0);
		const ratio = !total ? 0 : Math.max(0, Math.min(((current || 0) / total), 1));
		bar.style.width = `calc(${ratio * 100}% - ${(0.8 * ratio) - 0.4}rem)`;
	},

	/**
	 * Handle the user interacting with the seek bar.
	 */
	handleSeek(e, audioId) {
		const media = audioId === 'main'
			? Player.audio
			: Player.inline.audio[audioId]._inlinePlayer.master;
		if (media && media.duration && media.duration !== Infinity) {
			media.currentTime = media.duration * Player.controls._getBarXRatio(e);
		}
	},

	/**
	 * Handle the user interacting with the volume bar.
	 */
	handleVolume(e, audioId) {
		const audio = audioId === 'main' ? Player.audio : Player.inline.audio[audioId];
		audio.volume = Player.controls._getBarXRatio(e);
	},

	_getBarXRatio(e) {
		const offset = 0.4 * Player.remSize;
		const offsetX = e.offsetX || (e.targetTouches[0].pageX - e.currentTarget.getBoundingClientRect().left);
		return Math.max(0, Math.min(1, (offsetX - offset) / (parseInt(getComputedStyle(e.currentTarget).width, 10) - (2 * offset))));
	},

	/**
	 * Set all controls visible.
	 */
	showAllControls() {
		Player.$all(`.${ns}-controls [data-hide-id]`).forEach(el => el.style.display = null);
	},

	/**
	 * Hide elements in the controls instead of wrapping
	 */
	preventWrapping() {
		if (!Player.config.preventControlWrapping) {
			return;
		}
		const controls = Player.$(`.${ns}-controls`);
		// If the offset top of the last visible child than this value it indicates wrapping.
		const expectedOffsetTop = parseFloat(window.getComputedStyle(controls).paddingTop);
		const hideElements = Player.controls.hideOrder || Player.controls.setHideOrder();
		let visibleChildren = Array.prototype.slice.call(controls.children);
		let lastChild = visibleChildren.pop();
		let hidden = 0;
		// Show everything to check what has wrapped.
		Player.controls.showAllControls();
		// Keep hiding elements until the last visible child has not wrapped, or there's nothing left to hide.
		while (lastChild.offsetTop > expectedOffsetTop && hidden < hideElements.length) {
			const hide = hideElements[hidden++];
			hide.style.display = 'none';
			visibleChildren = visibleChildren.filter(el => el !== hide);
			hide === lastChild && (lastChild = visibleChildren.pop());
		}
	},

	/**
	 * Set the hide order from the user config.
	 */
	setHideOrder() {
		if (!Array.isArray(Player.config.controlsHideOrder)) {
			Player.settings.reset('controlsHideOrder');
		}
		const controls = Player.$(`.${ns}-controls`);
		return Player.controls.hideOrder = Player.config.controlsHideOrder
			.map(id => controls.querySelector(`[data-hide-id="${id}"]`))
			.filter(el => el)
			.sort((a, b) => a.dataset.hideOrder - b.dataset.hideOrder);
	}
};


/***/ }),

/***/ "./src/components/display/index.js":
/*!*****************************************!*\
  !*** ./src/components/display/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var _ = __webpack_require__(/*! ./src/_ */ "./src/_.js");
const cssTemplate = __webpack_require__(/*! ../../scss/style.scss */ "./src/scss/style.scss");
const cssVarsTemplate = __webpack_require__(/*! ../../scss/root.scss */ "./src/scss/root.scss");
const css4chanXPolyfillTemplate = __webpack_require__(/*! ../../scss/4chan-x-polyfill.scss */ "./src/scss/4chan-x-polyfill.scss");

const menus = {
	themes: __webpack_require__(/*! ./templates/themes_menu.tpl */ "./src/components/display/templates/themes_menu.tpl"),
	views: __webpack_require__(/*! ./templates/views_menu.tpl */ "./src/components/display/templates/views_menu.tpl")
};

const dismissedContentCache = {};
const dismissedRestoreCache = {};

const noSleep = typeof NoSleep === 'function' && new NoSleep();
const enableNoSleep = () => noSleep.enable();
const disableNoSleep = () => noSleep.disable();

module.exports = {
	atRoot: [ 'show', 'hide' ],
	public: [ 'show', 'hide' ],
	template: __webpack_require__(/*! ./templates/body.tpl */ "./src/components/display/templates/body.tpl"),
	_noSleepEnabled: false,

	async initialize() {
		try {
			Player.display.dismissed = (await GM.getValue('dismissed')).split(',');
		} catch (err) {
			Player.display.dismissed = [];
		}
		// Reset marquees when a new sound is played.
		Player.on('playsound', () => {
			Player.display._marquees = {};
			!Player.display._marqueeTO && Player.display.runTitleMarquee();
		});
		// Store the rem size
		Player.remSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
		// Set up no sleep
		Player.on('config:preventSleep', Player.display._initNoSleep);
		Player.display._initNoSleep(Player.config.preventSleep);
		// Close dialogs when the user clicks anywhere or presses escape.
		document.body.addEventListener('click', Player.display.closeDialogs);
		document.body.addEventListener('keydown', e => e.key === 'Escape' && Player.display.closeDialogs(e));
		// Update fullscreen details when details are changed/loaded
		Player.on('playsound', Player.display.updateFullScreenDetails);
		Player.on('tags-loaded', sound => sound === Player.playing && Player.display.updateFullScreenDetails());
	},

	/**
	 * Create the player show/hide button in to the 4chan X header.
	 */
	createPlayerButton() {
		if (Site === 'FoolFuuka') {
			// Add a sounds link in the nav for archives
			const nav = document.querySelector('.navbar-inner .nav:nth-child(2)');
			const li = _.element('<li><a href="javascript:;">Sounds</a></li>', nav);
			li.children[0].addEventListener('click', Player.display.toggle);
		} else if (Site === 'Fuuka') {
			const br = document.querySelector('body > div > br');
			br.parentNode.insertBefore(document.createTextNode('['), br);
			_.element('<a href="#" @click.prevent="display.toggle">Sounds</a>', br, 'beforebegin');
			br.parentNode.insertBefore(document.createTextNode(']'), br);
		} else if (isChanX) {
			// Add a button in the header for 4chan X.
			_.element(`<span id="shortcut-sounds" class="shortcut brackets-wrap" data-index="0">
				<a href="#" @click.prevent="display.toggle" title="Sounds" class="fa fa-play-circle">Sounds</a>
			</span>`, document.getElementById('shortcut-settings'), 'beforebegin');
		} else {
			// Add a [Sounds] link in the top and bottom nav for native 4chan.
			document.querySelectorAll('#settingsWindowLink, #settingsWindowLinkBot').forEach(function (link) {
				_.element('<a href="#" @click.prevent="display.toggle">Sounds</a>', link, 'beforebegin');
				link.parentNode.insertBefore(document.createTextNode('] ['), link);
			});
		}
	},

	/**
	 * Render the player.
	 */
	async render() {
		try {
			if (Player.container) {
				document.body.removeChild(Player.container);
				document.head.removeChild(Player.stylesheet);
			}

			// Create the main stylesheet.
			Player.stylesheet = Player.stylesheet || _.element('<style id="sound-player-css"></style>', document.head);
			Player.stylesheet.innerHTML = (!isChanX ? '/* 4chanX Polyfill */\n\n' + css4chanXPolyfillTemplate() : '')
				+ '\n\n/* Sounds Player CSS */\n\n' + cssTemplate();
			Player.display.updateCSSVars();

			// Create the main player. For native threads put it in the threads to get free quote previews.
			const parent = Thread && !isChanX && document.body.querySelector('.board') || document.body;
			Player.container = _.element(Player.display.template(), parent);

			await Player.trigger('rendered');
		} catch (err) {
			Player.logError('There was an error rendering the sound player.', err);
			// Can't recover, throw.
			throw err;
		}
	},

	updateCSSVars() {
		// Insert the stylesheet if it doesn't exist. 4chan X polyfill, sound player styling, and user styling.
		Player.varsCSS = Player.varsCSS || _.element('<style id="sound-player-css-vars"></style>', document.head);
		Player.varsCSS.innerHTML = '\n\n/* Sounds Player CSS variables */\n\n' + cssVarsTemplate();
	},

	/**
	 * Change what view is being shown
	 */
	async setViewStyle(style) {
		// Get the size and style prior to switching.
		const previousStyle = Player.config.viewStyle;

		// Exit fullscreen before changing to a different view.
		if (style !== 'fullscreen') {
			document.fullscreenElement && document.exitFullscreen();
		}

		// Change the style.
		Player.set('viewStyle', style);
		Player.container.setAttribute('data-view-style', style);

		if (style === 'playlist' || style === 'image') {
			Player.controls.preventWrapping();
		}
		// Try to reapply the pre change sizing unless it was fullscreen.
		if (previousStyle !== 'fullscreen' || style === 'fullscreen') {
			const [ width, height ] = (await GM.getValue('size') || '').split(':');
			width && height && Player.position.resize(parseInt(width, 10), parseInt(height, 10));
			Player.position.setPostWidths();
		}

		Player.trigger('view', style, previousStyle);
	},

	/**
	 * Togle the display status of the player.
	 */
	toggle() {
		if (Player.container.style.display === 'none') {
			Player.show();
		} else {
			Player.hide();
		}
	},

	/**
	 * Hide the player. Stops polling for changes, and pauses the aduio if set to.
	 */
	hide() {
		Player.container.style.display = 'none';

		Player.isHidden = true;
		Player.trigger('hide');
	},

	/**
	 * Show the player. Reapplies the saved position/size, and resumes loaded amount polling if it was paused.
	 */
	async show() {
		if (!Player.container.style.display) {
			return;
		}
		Player.container.style.display = null;

		Player.isHidden = false;
		await Player.trigger('show');
	},

	/**
	 * Stop playback and close the player.
	 */
	async close() {
		Player.stop();
		Player.hide();
	},

	/**
	 * Toggle the video/image and controls fullscreen state
	 */
	async toggleFullScreen() {
		if (!document.fullscreenElement) {
			// Make sure the player (and fullscreen contents) are visible first.
			if (Player.isHidden) {
				Player.show();
			}
			Player.$(`.${ns}-player`).requestFullscreen();
			document.body.addEventListener('pointermove', Player.display._fullscreenMouseMove);
			Player.display._fullscreenMouseMove();
		} else if (document.exitFullscreen) {
			document.exitFullscreen();
			document.body.removeEventListener('pointermove', Player.display._fullscreenMouseMove);
		}
	},

	_fullscreenMouseMove() {
		Player.container.classList.remove('cursor-inactive');
		Player.display.fullscreenCursorTO && clearTimeout(Player.display.fullscreenCursorTO);
		Player.display.fullscreenCursorTO = setTimeout(function () {
			Player.container.classList.add('cursor-inactive');
		}, 2000);
	},

	updateFullScreenDetails() {
		const tags = Player.playing.tags || {};
		document.querySelector('.fullscreen-details').innerHTML = [
			Player.playing.name,
			[ tags.title, tags.artist ].filter(Boolean).join(' - ')
		].filter(Boolean).join(' • ') || Player.playing.title;
	},

	/**
	 * Handle the fullscreen state being changed
	 */
	_handleFullScreenChange() {
		if (document.fullscreenElement) {
			Player.display.setViewStyle('fullscreen');
			document.querySelector(`.${ns}-image-link`).removeAttribute('href');
		} else {
			if (Player.playing) {
				document.querySelector(`.${ns}-image-link`).href = Player.playing.image;
			}
			Player.playlist.restore();
		}
		Player.controls.preventWrapping();
	},

	async restore(restore) {
		const restoreIndex = Player.display.dismissed.indexOf(restore);
		if (restore && restoreIndex > -1) {
			Player.display.dismissed.splice(restoreIndex, 1);
			Player.$all(`[\\@click^='display.restore("${restore}")']`).forEach(el => {
				_.element(dismissedContentCache[restore], el, 'beforebegin');
				el.parentNode.removeChild(el);
			});
			await GM.setValue('dismissed', Player.display.dismissed.join(','));
		}
	},

	async dismiss(dismiss) {
		if (dismiss && !Player.display.dismissed.includes(dismiss)) {
			Player.display.dismissed.push(dismiss);
			Player.$all(`[data-dismiss-id="${dismiss}"]`).forEach(el => {
				_.element(`<a href="#" @click.prevent='display.restore("${dismiss}")'>${dismissedRestoreCache[dismiss]}</a>`, el, 'beforebegin');
				el.parentNode.removeChild(el);
			});
			await GM.setValue('dismissed', Player.display.dismissed.join(','));
		}
	},

	ifNotDismissed(name, restore, text) {
		dismissedContentCache[name] = text;
		dismissedRestoreCache[name] = restore;
		return Player.display.dismissed.includes(name)
			? `<a href="#" @click.prevent='display.restore("${name}")'>${restore}</a>`
			: text;
	},

	/**
	 * Display a menu
	 */
	showMenu(relative, menu, parent) {
		const dialog = typeof menu === 'string' ? _.element(menus[menu]()) : menu;
		Player.display.closeDialogs();
		parent || (parent = Player.container);
		parent.appendChild(dialog);

		// Position the menu.
		Player.position.showRelativeTo(dialog, relative);

		// Add the focused class handler
		dialog.querySelectorAll('.entry').forEach(el => {
			el.addEventListener('mouseenter', e => {
				Player.display._setFocusedMenuItem(e);
				el.dispatchEvent(new CustomEvent('entry-focus'));
			});
		});
		// Allow clicks of sub menus
		dialog._keepOpenFor = Array.from(dialog.querySelectorAll('.entry.has-submenu'));
		dialog._closeFor = Array.from(dialog.querySelectorAll('.submenu'));

		Player.trigger('menu-open', dialog);
	},

	_setFocusedMenuItem(e) {
		const submenu = e.currentTarget.querySelector('.submenu');
		const menu = e.currentTarget.closest('.dialog');
		const currentFocus = menu.querySelectorAll('.focused');
		currentFocus.forEach(el => {
			el.classList.remove('focused');
			el.dispatchEvent(new CustomEvent('entry-blur'));
		});
		e.currentTarget.classList.add('focused');
		// Move the menu to the other side if there isn't room.
		if (submenu && submenu.getBoundingClientRect().right > document.documentElement.clientWidth) {
			submenu.style.inset = '0px 100% auto auto';
		}
	},

	/**
	 * Close any open menus.
	 */
	closeDialogs(e) {
		document.querySelectorAll(`.${ns}-dialog`).forEach(dialog => {
			const clickableElements = (dialog._keepOpenFor || []).concat(dialog.dataset.allowClick ? dialog : []);
			// Close the dialog if there's no event...
			const closeDialog = !e
				// ...the event was not for an element that allows the dialog to stay open
				|| !clickableElements.find(el => el === e.target || el.contains(e.target))
				// ...or the event was for an element explicitly set to close the dialog.
				|| (dialog._closeFor || []).find(el => el === e.target || el.contains(e.target));
			if (closeDialog) {
				dialog.parentNode.removeChild(dialog);
				Player.trigger('menu-close', dialog);
			}
		});
	},

	async runTitleMarquee() {
		Player.display._marqueeTO = setTimeout(Player.display.runTitleMarquee, 1000);
		document.querySelectorAll(`.${ns}-title-marquee`).forEach(title => {
			const offset = title.parentNode.getBoundingClientRect().width - (title.scrollWidth + 1);
			const location = title.getAttribute('data-location');
			// Fall out if the title is fully visible.
			if (offset >= 0) {
				return title.style.marginLeft = null;
			}
			const data = Player.display._marquees[location] = Player.display._marquees[location] || {
				direction: 1,
				position: parseInt(title.style.marginLeft, 10) || 0
			};
			// Pause at each end.
			if (data.pause > 0) {
				data.pause--;
				return;
			}
			data.position -= (20 * data.direction);

			// Pause then reverse direction when the end is reached.
			if (data.position > 0 || data.position < offset) {
				data.position = Math.min(0, Math.max(data.position, offset));
				data.direction *= -1;
				data.pause = 1;
			}

			title.style.marginLeft = data.position + 'px';
		});
	},

	_popoverMouseEnter: e => {
		const icon = e.currentTarget;
		const wide = icon.classList.contains('wide');
		if (!icon.infoEl || !Player.container.contains(icon.infoEl)) {
			icon.infoEl = _.element(`<div class="${ns}-popover-body ${wide ? 'wide' : ''} ${ns}-dialog dialog">${icon.dataset.content}</div>`, Player.container);
			icon.infoEl._keepOpenFor = [ icon ];
			Player.position.showRelativeTo(icon.infoEl, icon);
		}
	},

	_popoverMouseLeave: e => {
		const icon = e.currentTarget;
		if (icon.infoEl && !icon.infoEl._clicked) {
			icon.infoEl.parentNode.removeChild(icon.infoEl);
			delete icon.infoEl;
		}
	},

	_popoverClick: e => {
		const icon = e.currentTarget;
		const openPopover = icon.infoEl && Player.container.contains(icon.infoEl);
		if (!openPopover) {
			Player.display._popoverMouseEnter(e);
		} else if (!(icon.infoEl._clicked = !icon.infoEl._clicked)) {
			Player.display._popoverMouseLeave(e);
		}
	},

	_initNoSleep: newValue => {
		const action = newValue ? 'addEventListener' : 'removeEventListener';
		if (!noSleep || !!newValue === Player.display._noSleepEnabled) {
			return;
		}
		Player.audio[action]('play', enableNoSleep);
		Player.audio[action]('pause', disableNoSleep);
		Player.audio[action]('ended', disableNoSleep);
		Player.display._noSleepEnabled = !!newValue;
		if (!Player.audio.paused) {
			noSleep[newValue ? 'enable' : 'disable']();
		}
	},

	untz() {
		const container =  Player.$(`.${ns}-image-link`);
		Player.untzing = !Player.untzing;
		Player.audio.playbackRate = Player.audio.defaultPlaybackRate = Player.untzing ? 1.3 : 1;
		Player.container.classList[Player.untzing ? 'add' : 'remove']('untz');
		if (Player.untzing) {
			const overlay = Player.$('.image-color-overlay');
			let rotate = 0;
			overlay.style.filter = `brightness(1.5); hue-rotate(${rotate}deg)`;
			(function color() {
				overlay.style.filter = `hue-rotate(${rotate = 360 - rotate}deg)`;
				Player.untzColorTO = setTimeout(color, 500);
			}());
			(function bounce() {
				if (Player.untzing) {
					container.style.transform = `scale(${1 + Math.random() * 0.05})`;
					container.style.filter = `brightness(${1 + Math.random() * 0.5}) blur(${Math.random() * 3}px)`;
					Player.untzBounceTO = setTimeout(bounce, 200);
				}
			}());
		} else {
			container.style.transform = null;
			container.style.filter = null;
			clearTimeout(Player.untzBounceTO);
			clearTimeout(Player.untzColorTO);
		}
	}
};


/***/ }),

/***/ "./src/components/events/index.js":
/*!****************************************!*\
  !*** ./src/components/events/index.js ***!
  \****************************************/
/***/ ((module) => {

module.exports = {
	atRoot: [ 'on', 'off', 'trigger' ],

	// Holder of event handlers.
	_events: { },

	initialize() {
		const eventLocations = { Player, ...Player.components };
		const audio = [];

		for (let comp of Object.values(eventLocations)) {
			comp.audioEvents && audio.push(comp.audioEvents);
		}

		// Clear mousedown listeners when the mouse/touch is released.
		document.body.addEventListener('pointerup', Player.events.clearMousedown);
		document.body.addEventListener('pointercancel', Player.events.clearMousedown);

		Player.on('rendered', function () {
			// Wire up audio events.
			for (let eventList of audio) {
				for (let evt in eventList) {
					let handlers = Array.isArray(eventList[evt]) ? eventList[evt] : [ eventList[evt] ];
					handlers.forEach(handler => Player.audio.addEventListener(evt, Player.getHandler(handler)));
				}
			}
		});
	},

	/**
	 * Add event listeners from event attributes on an elements and all it's decendents.
	 *
	 * @param {Element} element The element to set event listeners for.
	 */
	apply(element) {
		// Find all elements with event attributes, including the given element.
		const eventAttrs = [];
		const elAttrs = document.evaluate('.//attribute::*[starts-with(name(), "@")]', element, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		for (let i = 0; i < elAttrs.snapshotLength; i++) {
			eventAttrs.push(elAttrs.snapshotItem(i));
		}
		const childAttrs = document.evaluate('.//*/attribute::*[starts-with(name(), "@")]', element, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		for (let i = 0; i < childAttrs.snapshotLength; i++) {
			eventAttrs.push(childAttrs.snapshotItem(i));
		}

		for (let attr of eventAttrs) {
			Player.events.set(attr.ownerElement, attr.name.slice(1), attr.value);
		}
	},

	set(el, attr, action) {
		action = action.trim();
		const [ evt, ...modsArr ] = attr.split('.');
		const mods = modsArr.reduce((m, n) => {
			m[n] = true;
			return m;
		}, {});

		// Remove listener already set.
		const listeners = el._eventListeners || (el._eventListeners = {});
		listeners[evt] && el.removeEventListener(evt, listeners[evt]);

		// If the action is JS lazily create a script element to get the handler. Avoids CSP blocking new Function.
		let handler = action && (Player.getHandler(action) || function ($event) {
			const script = document.createElement('script');
			script.innerText = `window.${ns}Handler = function(Player, $event) { with (Player) { ${action} } };`;
			document.head.appendChild(script);
			handler = unsafeWindow[`${ns}Handler`].bind(null, Player);
			delete unsafeWindow[`${ns}Handler`];
			handler($event);
		});
		const listener = function (evt) {
			if (mods.prevent) {
				evt.preventDefault();
			}
			if (mods.stop) {
				evt.stopPropagation();
			}
			if (mods.disabled && evt.currentTarget.classList.contains('disabled')) {
				evt.currentTarget.classList.contains('disabled');
			}

			return handler && handler.call(this, evt, Player);
		};

		// Point drag is a special case to handle pointer dragging.
		if (evt === 'pointdrag') {
			const downListener = e => {
				// No idea why but this seems to fire twice. So avoid that.
				if (!e._dragInit) {
					e._dragInit = true;
					listeners.pointdragstart && listeners.pointdragstart(e);
					if (!e.preventDrag) {
						el.setPointerCapture(e.pointerId);
						Player._mousedown = el;
						Player._mousedownListener = listener;
						Player._mousedownMoveEl = mods.unbound ? document.documentElement : el;
						Player._mousedownMoveEl.addEventListener('pointermove', listener, mods);
						el.addEventListener('pointerleave', listener, mods);
						mods.boxed && el.addEventListener('pointerleave', Player.events.clearMousedown);
						!mods.move && listener(e);
					}
				}
			};
			el.addEventListener('pointerdown', downListener);
			listeners.pointerdown = downListener;
		} else if (evt === 'pointdragstart' || evt === 'pointdragend') {
			listeners[evt] = listener;
		} else {
			el.addEventListener(evt, listener, mods);
			listeners[evt] = listener;
		}
	},

	/**
	 * Create an event listener on the player.
	 *
	 * @param {String} evt The name of the events.
	 * @param {function} handler The handler function.
	 */
	on(evt, handler) {
		const evts = Array.isArray(evt) ? evt : [ evt ];
		evts.forEach(evt => {
			Player.events._events[evt] || (Player.events._events[evt] = []);
			Player.events._events[evt].push(handler);
		});
	},

	/**
	 * Remove an event listener on the player.
	 *
	 * @param {String} evt The name of the events.
	 * @param {function} handler The handler function.
	 */
	off(evt, handler) {
		const index = Player.events._events[evt] && Player.events._events[evt].indexOf(handler);
		if (index > -1) {
			Player.events._events[evt].splice(index, 1);
		}
	},

	/**
	 * Trigger an event on the player.
	 *
	 * @param {String} evt The name of the events.
	 * @param {*} data Data passed to the handler.
	 */
	async trigger(evt, ...data) {
		const events = Player.events._events[evt] || [];
		for (let handler of events) {
			await handler(...data);
		}
	},

	clearMousedown(e) {
		if (Player._mousedown) {
			Player._mousedown.releasePointerCapture(e.pointerId);
			Player._mousedownMoveEl.removeEventListener('pointermove', Player._mousedownListener);
			Player._mousedown.removeEventListener('pointerleave', Player._mousedownListener);
			Player._mousedown._eventListeners.pointdragend && Player._mousedown._eventListeners.pointdragend(e);
			Player._mousedown = Player._mousedownListener = null;
		}
	}
};


/***/ }),

/***/ "./src/components/footer/index.js":
/*!****************************************!*\
  !*** ./src/components/footer/index.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var _ = __webpack_require__(/*! ./src/_ */ "./src/_.js");
module.exports = {
	template: () => Player.userTemplate.build({
		template: Player.config.footerTemplate
			+ `<div class="${ns}-expander" data-direction="sw"></div><div class="${ns}-expander" data-direction="se"></div>`,
		location: 'footer',
		sound: Player.playing,
		defaultName: '4chan Sounds',
		outerClass: `${ns}-col-auto`
	}),

	initialize() {
		Player.userTemplate.maintain(Player.footer, 'footerTemplate');
	},

	render() {
		_.elementHTML(Player.$(`.${ns}-footer`), Player.footer.template());
	}
};


/***/ }),

/***/ "./src/components/header/index.js":
/*!****************************************!*\
  !*** ./src/components/header/index.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var _ = __webpack_require__(/*! ./src/_ */ "./src/_.js");
module.exports = {
	template: () => Player.userTemplate.build({
		template: Player.config.headerTemplate
			+ `<div class="${ns}-expander" data-direction="nw"></div><div class="${ns}-expander" data-direction="ne"></div>`,
		location: 'header',
		sound: Player.playing,
		defaultName: '4chan Sounds',
		outerClass: `${ns}-col-auto`
	}),

	initialize() {
		Player.userTemplate.maintain(Player.header, 'headerTemplate');
	},

	render() {
		_.elementHTML(Player.$(`.${ns}-header`), Player.header.template());
	}
};


/***/ }),

/***/ "./src/components/hotkeys/index.js":
/*!*****************************************!*\
  !*** ./src/components/hotkeys/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const settingsConfig = __webpack_require__(/*! config */ "./src/config/index.js");

let keyConfigs;

module.exports = {
	_keyMap: {
		' ': 'space',
		arrowleft: 'left',
		arrowright: 'right',
		arrowup: 'up',
		arrowdown: 'down'
	},

	initialize() {
		Player.on('rendered', Player.hotkeys.apply);
		Player.on('config:hotkeys', Player.hotkeys.apply);

		keyConfigs = settingsConfig.reduce((c, s) => {
			s.property === 'hotkey_bindings' && s.settings.forEach(s => c[s.property.slice(16)] = s);
			return c;
		}, {});

		// Setup up hardware media keys.
		if ('mediaSession' in navigator && Player.config.hardwareMediaKeys) {
			const actions = [
				[ 'play', () => Player.play() ],
				[ 'pause', () => Player.pause() ],
				[ 'stop', () => Player.pause() ],
				[ 'previoustrack', () => Player.previous() ],
				[ 'nexttrack', () => Player.next() ],
				[ 'seekbackward', evt => Player.audio.currentTime -= evt.seekOffset || 10 ],
				[ 'seekforward', evt => Player.audio.currentTime += evt.seekOffset || 10 ],
				[ 'seekto', evt => Player.audio.currentTime += evt.seekTime ]
			];
			for (let [ type, handler ] of actions) {
				try {
					navigator.mediaSession.setActionHandler(type, handler);
				} catch (err) {
					// not enabled...
				}
			}

			// Keep the media metadata updated.
			Player.audio.addEventListener('pause', () => navigator.mediaSession.playbackState = 'paused');
			Player.audio.addEventListener('ended', () => navigator.mediaSession.playbackState = 'paused');
			Player.audio.addEventListener('play', Player.hotkeys.setMediaMetadata);
			Player.audio.addEventListener('ratechange', Player.hotkeys.setMediaPosition);
			Player.audio.addEventListener('seeked', Player.hotkeys.setMediaPosition);
			Player.on('tags-loaded', sound => sound === Player.playing && Player.hotkeys.setMediaMetadata());
		}
	},

	async setMediaMetadata() {
		const sound = Player.playing;
		const tags = sound.tags || {};
		navigator.mediaSession.playbackState = 'playing';
		const metadata = {
			title: tags.title || sound.name || sound.title,
			artist: tags.artist ||  `/${Board}/ - ${Thread || '4chan Sounds Player'}`,
			album: tags.album || document.title,
			artwork: [
				{
					src: Player.playing.thumb,
					sizes: '125x125'
				}
			]
		};

		// If it's not a video add the full image to artwork. (TODO: grab the first frame for videos)
		// If we have the dimensions already add the artwork, otherwise load them then reset the metadata.
		if (!Player.isVideo) {
			if (sound._fullDimension) {
				metadata.artwork.push({
					src: Player.playing.image,
					sizes: sound._fullDimension
				});
			} else {
				const img = new Image();
				img.onload = function () {
					sound._fullDimension = img.width + 'x' + img.height;
					Player.hotkeys.setMediaMetadata();
				};
				img.src = Player.playing.image;
			}
		}

		navigator.mediaSession.metadata = new MediaMetadata(metadata);
		Player.hotkeys.setMediaPosition();
	},

	setMediaPosition() {
		navigator.mediaSession.setPositionState({
			duration: Player.audio.duration || 0,
			playbackRate: Player.audio.playbackRate,
			position: Player.audio.currentTime
		});
	},

	addHandler: () => {
		Player.hotkeys.removeHandler();
		document.body.addEventListener('keydown', Player.hotkeys.handle);
	},
	removeHandler: () => {
		document.body.removeEventListener('keydown', Player.hotkeys.handle);
	},

	/**
	 * Apply the selecting hotkeys option
	 */
	apply() {
		const type = Player.config.hotkeys;
		Player.hotkeys.removeHandler();
		Player.off('show', Player.hotkeys.addHandler);
		Player.off('hide', Player.hotkeys.removeHandler);

		if (type === 'always') {
			// If hotkeys are always enabled then just set the handler.
			Player.hotkeys.addHandler();
		} else if (type === 'open') {
			// If hotkeys are only enabled with the player open toggle the handler as the player opens/closes.
			// If the player is already open set the handler now.
			if (!Player.isHidden) {
				Player.hotkeys.addHandler();
			}
			Player.on('show', Player.hotkeys.addHandler);
			Player.on('hide', Player.hotkeys.removeHandler);
		}
	},

	/**
	 * Handle a keydown even on the body
	 */
	handle(e) {
		// Ignore events on inputs so you can still type.
		if (Player.isHidden && (Player.config.hotkeys !== 'always' || !Player.sounds.length)) {
			return;
		}
		const inputFocused = [ 'INPUT', 'SELECT', 'TEXTAREA', 'INPUT' ].includes(e.target.nodeName)
		const k = e.key.toLowerCase();
		const bindings = Player.config.hotkey_bindings || {};

		// Look for a matching hotkey binding
		Object.entries(bindings).forEach(function checkBinding([ name, keyDef ]) {
			if (Array.isArray(keyDef)) {
				return keyDef.find(_def => checkBinding([ name, _def ]));
			}
			const bindingConfig = k === keyDef.key
				&& (!!keyDef.shiftKey === !!e.shiftKey) && (!!keyDef.ctrlKey === !!e.ctrlKey) && (!!keyDef.metaKey === !!e.metaKey)
				&& (!keyDef.ignoreRepeat || !e.repeat)
				&& keyConfigs[name];

			if (bindingConfig && (!inputFocused || bindingConfig.allowFocusedInput)) {
				e.preventDefault();
				e._binding = keyDef;
				Player.getHandler(bindingConfig.keyHandler)(e);
			}
		});
	},

	/**
	 * Turn a hotkey definition or key event into an input string.
	 */
	stringifyKey(key) {
		let k = key.key.toLowerCase();
		Player.hotkeys._keyMap[k] && (k = Player.hotkeys._keyMap[k]);
		return (key.ctrlKey ? 'Ctrl+' : '') + (key.shiftKey ? 'Shift+' : '') + (key.metaKey ? 'Meta+' : '') + k;
	},

	/**
	 * Turn an input string into a hotkey definition object.
	 */
	parseKey(str) {
		const keys = str.split('+');
		let key = keys.pop();
		Object.keys(Player.hotkeys._keyMap).find(k => Player.hotkeys._keyMap[k] === key && (key = k));
		const newValue = { key };
		keys.forEach(key => newValue[key.toLowerCase() + 'Key'] = true);
		return newValue;
	}
};


/***/ }),

/***/ "./src/components/inline/index.js":
/*!****************************************!*\
  !*** ./src/components/inline/index.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var _ = __webpack_require__(/*! ./src/_ */ "./src/_.js");
const selectors = __webpack_require__(/*! ../../selectors */ "./src/selectors.js");
const controlsTemplate = __webpack_require__(/*! ../controls/templates/controls.tpl */ "./src/components/controls/templates/controls.tpl");

module.exports = {
	idx: 0,

	audio: { },
	expandedNodes: [ ],

	// Similar but not exactly the audio events in the controls component.
	mediaEvents: {
		ended: evt => Player.inline._movePlaying(evt.currentTarget.dataset.id, +(Player.config.expandedRepeat !== 'one')),
		pause: 'controls.handleMediaEvent',
		play: 'controls.handleMediaEvent',
		seeked: 'controls.handleMediaEvent',
		waiting: 'controls.handleMediaEvent',
		timeupdate: 'controls.updateDuration',
		loadedmetadata: 'controls.updateDuration',
		durationchange: 'controls.updateDuration',
		volumechange: 'controls.updateVolume'
	},

	initialize() {
		if (!is4chan) {
			return;
		}

		Player.inline.observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				mutation.addedNodes.forEach(Player.inline.handleAddedNode);
				mutation.removedNodes.forEach(Player.inline.handleRemovedNode);
			});
		});

		Player.on('config:playExpandedImages', Player.inline._handleConfChange);
		Player.on('config:playHoveredImages', Player.inline._handleConfChange);
		Player.inline._handleConfChange();
	},

	/**
	 * Start/stop observing for hover images when a dependent conf is changed.
	 */
	_handleConfChange() {
		if (Player.config.playExpandedImages || Player.config.playHoveredImages) {
			Player.inline.start();
		} else {
			Player.inline.stop();
		}
	},

	/**
	 * Check if an added node is an expanded/hover sound image and play the audio.
	 *
	 * @param {Element} node Added node.
	 */
	handleAddedNode(node) {
		try {
			if (node.nodeName !== 'IMG' && node.nodeName !== 'VIDEO') {
				return;
			}
			const isExpandedImage = Player.config.playExpandedImages && node.matches(selectors.expandedImage);
			const isHoverImage = Player.config.playHoveredImages && node.matches(selectors.hoverImage);

			if (isExpandedImage || isHoverImage) {
				const isVideo = node.nodeName === 'VIDEO';
				let id;
				try {
					// 4chan X images have the id set. Handy.
					// Otherwise get the parent post, looking up the image link for native hover images, and the id from it.
					id = isChanX
						? node.dataset.fileID.split('.')[1]
						: (isExpandedImage ? node : document.querySelector(`a[href$="${node.src.replace(/^https?:/, '')}"]`))
							.closest(selectors.posts).id.slice(selectors.postIdPrefix.length);
				} catch (err) {
					return;
				}
				// Check for sounds added to the player.
				let sounds = id && Player.sounds.filter(s => s.post === id && !s.standaloneVideo) || [];
				if (Player.config.expandedAllowFiltered) {
					sounds = sounds.concat(Player.filteredSounds.filter(s => s.post === id && !s.disallow.host));
				}
				if (!sounds.length) {
					return;
				}
				// Create a new audio element.
				const audio = new Audio(sounds[0].src);
				const aId = audio.dataset.id = Player.inline.idx++;
				const master = isVideo && Player.config.expandedLoopMaster === 'video' ? node : audio;
				Player.inline.audio[aId] = audio;

				// Remember this node is playing audio.
				Player.inline.expandedNodes.push(node);

				// Add some data and cross link the nodes.
				node.classList.add(`${ns}-has-inline-audio`);
				node._inlineAudio = audio;
				audio._inlinePlayer = node._inlinePlayer = {
					master,
					video: node,
					isVideo,
					audio,
					sounds,
					index: 0
				};
				// Link video & audio so they sync.
				if (isVideo) {
					node._linked = audio;
					audio._linked = node;
				}

				// Start from the beginning taking the volume from the main player.
				audio.src = sounds[0].src;
				audio.volume = Player.audio.volume;
				audio.currentTime = 0;

				// Add the sync handlers to which source is master.
				Player.inline.updateSyncListeners(master, 'add');

				// Show the player controls for expanded images/videos.
				const showPlayerControls = isExpandedImage && Player.config.expandedControls;

				if (isVideo && showPlayerControls) {
					// Remove the default controls, and remove them again when 4chan X tries to add them.
					node.controls = false;
					node.controlsObserver = new MutationObserver(() => node.controls = false);
					node.controlsObserver.observe(node, { attributes: true });
					// Play/pause the audio instead when the video is clicked.
					node.addEventListener('click', () => Player.inline.playPause(aId));
				}

				// For videos wait for both to load before playing.
				if (isVideo && (node.readyState < 3 || audio.readyState < 3)) {
					audio.pause();
					node.pause();
					// Set the add controls function so playOnceLoaded can run it when it's ready.
					node._inlinePlayer.pendingControls = showPlayerControls && addControls;
					node.addEventListener('canplaythrough', Player.actions.playOnceLoaded);
					audio.addEventListener('canplaythrough', Player.actions.playOnceLoaded);
				} else {
					showPlayerControls && addControls();
					audio.play();
				}

				function addControls() {
					delete node._inlinePlayer.pendingControls;
					node.parentNode.classList.add(`${ns}-has-controls`);
					// Create the controls and store the bars on the audio node for reference. Avoid checking the DOM.
					const controls = audio._inlinePlayer.controls = _.element(controlsTemplate({
						audio,
						multiple: sounds.length > 1,
						audioId: aId,
						inline: true,
						actions: {
							previous: `inline.previous("${aId}")`,
							playPause: `inline.playPause("${aId}")`,
							next: `inline.next("${aId}")`,
							seek: `controls.handleSeek($event, "${aId}")`,
							mute: `inline.mute("${aId}")`,
							volume: `controls.handleVolume($event, "${aId}")`
						}
					}), node.parentNode);
					// Don't want to close the expanded image or open the image when the controls are clicked.
					controls.addEventListener('click', e => {
						e.preventDefault();
						e.stopPropagation();
					});
					audio.volumeBar = controls.querySelector(`.${ns}-volume-bar .${ns}-current-bar`);
					audio.currentTimeBar = controls.querySelector(`.${ns}-seek-bar .${ns}-current-bar`);
					Player.controls.updateProgressBarPosition(audio.volumeBar, audio.volume, 1);
				}
			}
		} catch (err) {
			Player.logError('Failed to play sound.', err);
		}
	},

	/**
	 * Check if a removed node is an expanded/hover sound image and stop the audio.
	 *
	 * @param {Element} node Added node.
	 */
	handleRemovedNode(node) {
		const nodes = [ node ];
		node.querySelectorAll && nodes.push(...node.querySelectorAll(`.${ns}-has-inline-audio`));
		nodes.forEach(node => {
			if (node._inlineAudio) {
				Player.inline._removeForNode(node);
			}
		});
	},

	_removeForNode(node) {
		// Stop removing controls.
		node.controlsObserver && node.controlsObserver.disconnect();
		// Stop listening for media events.
		Player.inline.updateSyncListeners(node._inlinePlayer.master, 'remove');
		// Remove controls.
		const controls = node._inlineAudio._inlinePlayer.controls;
		if (controls) {
			controls.parentNode.classList.remove(`${ns}-has-controls`);
			controls.parentNode.removeChild(controls);
		}
		// Stop the audio and cleanup the data.
		node._inlineAudio.pause();
		delete Player.inline.audio[node._inlineAudio.dataset.id];
		delete node._inlineAudio;
		Player.inline.expandedNodes = Player.inline.expandedNodes.filter(n => n !== node);
	},

	/**
	 * Set audio/video sync listeners on a video for an inline sound webm.
	 *
	 * @param {Element} video Video node.
	 * @param {String} action add or remove.
	 */
	updateSyncListeners(node, action) {
		if (node.nodeName === 'VIDEO' || node.nodeName === 'AUDIO') {
			const audio = node._inlineAudio || node;
			if (action === 'remove') {
				const video = audio._inlinePlayer.video;
				video.removeEventListener('canplaythrough', Player.actions.playOnceLoaded);
				audio.removeEventListener('canplaythrough', Player.actions.playOnceLoaded);
			}
			Object.entries(Player.inline.mediaEvents).forEach(([ event, handler ]) => {
				node[`${action}EventListener`](event, Player.getHandler(handler));
			});
		}
	},

	/**
	 * Start observing for expanded/hover images.
	 */
	start() {
		Player.inline.observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	},

	/**
	 * Stop observing for expanded/hover images.
	 */
	stop() {
		Player.inline.observer.disconnect();
		Player.inline.expandedNodes.forEach(Player.inline._removeForNode);
		Player.inline.expandedNodes = [];
	},

	/**
	 * Handle previous click for inline controls.
	 *
	 * @param {String} audioId Identifier of the inline audio.
	 */
	previous(audioId) {
		const audio = Player.inline.audio[audioId];
		if (audio.currentTime > 3) {
			audio.currentTime = 0;
		} else {
			Player.inline._movePlaying(audioId, -1);
		}
	},

	/**
	 * Handle next click for inline controls.
	 *
	 * @param {String} audioId Identifier of the inline audio.
	 */
	next(audioId) {
		Player.inline._movePlaying(audioId, 1);
	},

	_movePlaying(audioId, dir) {
		const audio = Player.inline.audio[audioId];
		const data = audio && audio._inlinePlayer;
		const count = data.sounds.length;
		const repeat = Player.config.expandedRepeat;
		if (data && (repeat !== 'none' || data.index + dir >= 0 && data.index + dir < count)) {
			data.index = (data.index + dir + count) % count;
			audio.src = data.sounds[data.index].src;
			if (data.controls) {
				const prev = data.controls.querySelector(`.${ns}-previous-button`);
				const next = data.controls.querySelector(`.${ns}-next-button`);
				prev && prev.classList[repeat !== 'all' && data.index === 0 ? 'add' : 'remove']('disabled');
				next && next.classList[repeat !== 'all' && data.index === count - 1 ? 'add' : 'remove']('disabled');
			}
			// For videos wait for both to load before playing.
			if (data.isVideo && (data.video.readyState < 3 || audio.readyState < 3)) {
				data.master.currentTime = 0;
				data.master.pause();
				data.video.pause();
				data.video.addEventListener('canplaythrough', Player.actions.playOnceLoaded);
				audio.addEventListener('canplaythrough', Player.actions.playOnceLoaded);
			} else {
				data.master.currentTime = 0;
				data.master.play();
			}
		}
	},

	/**
	 * Handle play/pause click for inline controls.
	 *
	 * @param {String} audioId Identifier of the inline audio.
	 */
	playPause(audioId) {
		const audio = Player.inline.audio[audioId];
		audio && audio[audio.paused ? 'play' : 'pause']();
	},

	/**
	 * Handle mute click for inline controls.
	 *
	 * @param {String} audioId Identifier of the inline audio.
	 */
	mute(audioId) {
		const audio = Player.inline.audio[audioId];
		audio && (audio.volume = (Player._lastVolume || 0.5) * !audio.volume);
	}
};


/***/ }),

/***/ "./src/components/minimised/index.js":
/*!*******************************************!*\
  !*** ./src/components/minimised/index.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var _ = __webpack_require__(/*! ./src/_ */ "./src/_.js");
/* provided dependency */ var Icons = __webpack_require__(/*! ./src/icons */ "./src/icons.js");
module.exports = {
	_showingPIP: false,

	initialize() {
		if (isChanX) {
			Player.userTemplate.maintain(Player.minimised, 'chanXTemplate', [ 'chanXControls' ], [ 'show', 'hide', 'stop' ]);
		}
		Player.on('rendered', Player.minimised.render);
		Player.on('show', Player.minimised.hidePIP);
		Player.on('hide', Player.minimised.showPIP);
		Player.on('stop', Player.minimised.hidePIP);
		Player.on('playsound', Player.minimised.showPIP);
	},

	render() {
		if (Player.container && isChanX) {
			let container = document.querySelector(`.${ns}-chan-x-controls`);
			// Create the element if it doesn't exist.
			// Set the user template and control events on it to make all the buttons work.
			if (!container) {
				container = _.element(`<span class="${ns}-chan-x-controls ${ns}-col-auto ${ns}-align-center"></span>`, document.querySelector('#shortcuts'), 'afterbegin');
			}

			if (Player.config.chanXControls === 'never' || Player.config.chanXControls === 'closed' && !Player.isHidden) {
				return container.innerHTML = '';
			}

			const audioId = Player.audio.dataset.id;
			// Render the contents.
			_.elementHTML(container, Player.userTemplate.build({
				template: Player.config.chanXTemplate,
				location: '4chan-X-controls',
				sound: Player.playing,
				replacements: {
					'prev-button': `<a href="#" class="${ns}-media-control ${ns}-previous-button ${ns}-hover-fill" @click.prevent='previous({"force":true})'>${Icons.skipStart} ${Icons.skipStartFill}</a>`,
					'play-button': `<a href="#" class="${ns}-media-control ${ns}-play-button ${ns}-hover-fill ${!Player.audio || Player.audio.paused ? `${ns}-play` : ''}" @click.prevent="togglePlay" data-audio="${audioId}">${Icons.play} ${Icons.pause} ${Icons.playFill} ${Icons.pauseFill}</a>`,
					'next-button': `<a href="#" class="${ns}-media-control ${ns}-next-button ${ns}-hover-fill" @click.prevent='next({"force":true})'>${Icons.skipEnd} ${Icons.skipEndFill} </a>`,
					'sound-current-time': `<span class="${ns}-current-time" data-audio="${audioId}">0:00</span>`,
					'sound-duration': `<span class="${ns}-duration" data-audio="${audioId}">0:00</span>`
				}
			}));
		}
	},

	/**
	 * Move the image to a picture in picture like thumnail.
	 */
	showPIP() {
		if (!Player.isHidden || !Player.config.pip || !Player.playing || Player.minimised._showingPIP) {
			return;
		}
		Player.minimised._showingPIP = true;
		const image = document.querySelector(`.${ns}-image-link`);
		document.body.appendChild(image);
		image.classList.add(`${ns}-pip`);
		image.style.bottom = (Player.position.getHeaderOffset().bottom + 10) + 'px';
		image.style.height = null;
		// Show the player again when the image is clicked.
		image.addEventListener('click', Player.minimised._handleImageClick);
	},

	/**
	 * Move the image back to the player.
	 */
	hidePIP() {
		Player.minimised._showingPIP = false;
		const image = document.querySelector(`.${ns}-image-link`);
		const controls = Player.$(`.${ns}-controls`);
		controls.parentNode.insertBefore(document.querySelector(`.${ns}-image-link`), controls);
		image.classList.remove(`${ns}-pip`);
		image.style.bottom = null;
		image.style.height = Player.config.imageHeight + 'px';
		image.removeEventListener('click', Player.minimised._handleImageClick);
	},

	_handleImageClick: e => {
		e.preventDefault();
		Player.show();
	}
};


/***/ }),

/***/ "./src/components/playlist/index.js":
/*!******************************************!*\
  !*** ./src/components/playlist/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var _ = __webpack_require__(/*! ./src/_ */ "./src/_.js");
/* provided dependency */ var Icons = __webpack_require__(/*! ./src/icons */ "./src/icons.js");
const { postIdPrefix } = __webpack_require__(/*! ../../selectors */ "./src/selectors.js");
const xhrReplacer = __webpack_require__(/*! ../../xhr-replace */ "./src/xhr-replace.js");

const itemMenuTemplate = __webpack_require__(/*! ./templates/item_menu.tpl */ "./src/components/playlist/templates/item_menu.tpl");

module.exports = {
	atRoot: [ 'add', 'remove' ],
	public: [ 'search' ],

	tagLoadTO: {},

	template: __webpack_require__(/*! ./templates/player.tpl */ "./src/components/playlist/templates/player.tpl"),
	listTemplate: __webpack_require__(/*! ./templates/list.tpl */ "./src/components/playlist/templates/list.tpl"),
	tagsDialogTemplate: __webpack_require__(/*! ./templates/tags_dialog.tpl */ "./src/components/playlist/templates/tags_dialog.tpl"),

	initialize() {
		// Keep track of the last view style so we can return to it.
		Player.playlist._lastView = Player.config.viewStyle === 'playlist' || Player.config.viewStyle === 'image'
			? Player.config.viewStyle
			: 'playlist';

		Player.on('view', style => {
			// Focus the playing song when switching to the playlist.
			style === 'playlist' && Player.playlist.scrollToPlaying();
			// Track state.
			if (style === 'playlist' || style === 'image') {
				Player.playlist._lastView = style;
			}
		});

		// Keey track of the hover image element.
		Player.on('rendered', Player.playlist.afterRender);

		// Various things to do when a new sound plays.
		Player.on('playsound', sound => {
			// Update the image/video.
			Player.playlist.showImage(sound);
			// Update the previously and the new playing rows.
			Player.$all(`.${ns}-list-item.playing, .${ns}-list-item[data-id="${Player.playing.id}"]`).forEach(el => {
				const newItem = Player.playlist.listTemplate({ sounds: [ Player.sounds.find(s => s.id === el.dataset.id) ] });
				_.element(newItem, el, 'beforebegin');
				el.parentNode.removeChild(el);
			});
			// If the player isn't fullscreen scroll to the playing item.
			Player.config.viewStyle !== 'fullscreen' && Player.playlist.scrollToPlaying('nearest');
			// Scroll the thread to the playing post.
			Player.config.autoScrollThread && sound.post && (location.href = location.href.split('#')[0] + '#' + postIdPrefix + sound.post);
			// Load tags from the audio file.
			Player.playlist.loadTags(Player.playing.id);
		});

		// Reset to the placeholder image when the player is stopped.
		Player.on('stop', () => {
			Player.$all(`.${ns}-list-item.playing`).forEach(el => el.classList.remove('playing'));
			const container = Player.$(`.${ns}-image-link`);
			container.href = '#';
			Player.$(`.${ns}-background-image`).src = Player.video.src = '';
			Player.$(`.${ns}-image`).src = `data:image/svg+xml;base64,${btoa(Icons.fcSounds)}`;
			container.classList.remove(`${ns}-show-video`);
		});

		// Reapply filters when they change
		Player.on('config:filters', Player.playlist.applyFilters);
		Player.on('config:allow', Player.playlist.applyFilters);

		// Listen to anything that can affect the display of hover images
		Player.on('config:hoverImages', Player.playlist.setHoverImageVisibility);
		Player.on('menu-open', Player.playlist.setHoverImageVisibility);
		Player.on('menu-close', Player.playlist.setHoverImageVisibility);

		// Listen to the search display being toggled
		Player.on('config:showPlaylistSearch', Player.playlist.toggleSearch);

		// Listen for the playlist being shuffled/ordered.
		Player.on('config:shuffle', Player.playlist._handleShuffle);

		// Update an open tags info dialog when tags are loaded for a sound.
		Player.on('tags-loaded', sound => {
			const dialog = Player.$(`.tags-dialog[data-sound-id="${sound.id}"]`);
			dialog && _.elementHTML(dialog, Player.playlist.tagsDialogTemplate(sound));
		});

		// Resize the image when the config is changed (from other tabs)
		Player.on('config:imageHeight', height => Player.$(`.${ns}-image-link`).style.height = height + 'px');

		// Preload the next audio.
		Player.on([ 'playsound', 'order' ], () => {
			const next = Player.sounds[(Player.sounds.indexOf(Player.playing) + 1) % Player.sounds.length];
			next && Player.playlist.preload(next);
		});

		// Maintain changes to the user templates it's dependent values
		Player.userTemplate.maintain(Player.playlist, 'rowTemplate', [ 'shuffle' ]);

		// Resize observer to handle transparent images
		Player.playlist.imageResizeObserver = new ResizeObserver(Player.playlist.resizeTransBG);
	},

	/**
	 * Render the playlist.
	 */
	render() {
		_.elementHTML(Player.$(`.${ns}-list-container`), Player.playlist.listTemplate());
		Player.playlist.afterRender();
	},

	afterRender() {
		Player.playlist.image = Player.$(`.${ns}-image`);
		Player.playlist.transparentImageBG = Player.$(`.${ns}-image-transparent-bg`);
		Player.playlist.hoverImage = Player.$(`.${ns}-hover-image`);
		Player.playlist.imageResizeObserver.disconnect();
		Player.playlist.imageResizeObserver.observe(Player.playlist.image);
		Player.playlist.image.onload = Player.playlist.resizeTransBG;
	},

	/**
	 * Restore the last playlist or image view.
	 */
	restore() {
		Player.display.setViewStyle(Player.playlist._lastView || 'playlist');
	},

	/**
	 * Update the image displayed in the player.
	 */
	showImage(sound) {
		const container = document.querySelector(`.${ns}-image-link`);
		const img = container.querySelector(`.${ns}-image`);
		const background = container.querySelector(`.${ns}-background-image`);
		img.src = background.src = '';
		img.src = background.src = sound.imageOrThumb;
		Player.isVideo && (Player.video.src = sound.image);
		if (Player.config.viewStyle !== 'fullscreen') {
			container.href = sound.image;
		}
		container.classList[Player.isVideo ? 'add' : 'remove'](ns + '-show-video');
	},

	/**
	 * Resize the background element that prevents transparent images display over themself.
	 */
	resizeTransBG() {
		const contentBoxRatio = Player.playlist.image.width / Player.playlist.image.height;
		const imageSizeRatio = Player.playlist.image.naturalWidth / Player.playlist.image.naturalHeight;
		const bgEl = Player.playlist.transparentImageBG;
		bgEl.style.width = Math.min(imageSizeRatio / contentBoxRatio * 100, 100) + '%';
		bgEl.style.height = Math.min(contentBoxRatio / imageSizeRatio * 100, 100) + '%';
	},

	/**
	 * Switch between playlist and image view.
	 */
	toggleView(e) {
		e && e.preventDefault();
		let style = Player.config.viewStyle === 'playlist' ? 'image'
			: Player.config.viewStyle === 'image' ? 'playlist'
			: Player.playlist._lastView;
		Player.display.setViewStyle(style);
	},

	/**
	 * Add a new sound from the thread to the player.
	 */
	add(sound, skipRender) {
		try {
			const id = sound.id;
			// Make sure the sound is not a duplicate.
			if (Player.sounds.find(sound => sound.id === id)) {
				return;
			}

			// Add the sound with the location based on the shuffle settings.
			let index = Player.config.shuffle
				? Math.floor(Math.random() * Player.sounds.length - 1)
				: Player.sounds.findIndex(s => Player.compareIds(s.id, id) > 1);
			index < 0 && (index = Player.sounds.length);
			Player.sounds.splice(index, 0, sound);

			if (Player.container) {
				if (!skipRender) {
					// Add the sound to the playlist.
					const list = Player.$(`.${ns}-list-container`);
					let rowContainer = _.element(`<div>${Player.playlist.listTemplate({ sounds: [ sound ] })}</div>`);
					if (index < Player.sounds.length - 1) {
						const before = Player.$(`.${ns}-list-item[data-id="${Player.sounds[index + 1].id}"]`);
						list.insertBefore(rowContainer.children[0], before);
					} else {
						list.appendChild(rowContainer.children[0]);
					}
				}

				// If nothing else has been added yet show the image for this sound.
				if (Player.sounds.length === 1) {
					Player.playlist.showImage(sound);
				}
				// Auto show if enabled, we're on a thread, and this is the first non-standlone item.
				if (Player.config.autoshow && /\/thread\//.test(location.href) && Player.sounds.filter(s => !s.standaloneVideo).length === 1) {
					Player.show();
				}
				Player.trigger('add', sound);
			}
		} catch (err) {
			Player.logError('There was an error adding to the sound player. Please check the console for details.', err);
			console.log('[4chan sounds player]', sound);
		}
	},

	addFromDrop(e) {
		for (let item of e.dataTransfer.items) {
			const entry = item.getAsEntry ? item.getAsEntry() : item.webkitGetAsEntry();
			entry && Player.playlist._scanEntry(entry);
		}
	},

	_scanEntry(entry) {
		if (entry.isDirectory) {
			return Player.playlist._readEntries(entry.createReader());
		}
		return entry.file(file => Player.playlist.addFromFiles([ file ]));
	},

	_readEntries(reader) {
		reader.readEntries(entries => {
			if (entries.length) {
				entries.forEach(Player.playlist._scanEntry);
				Player.playlist._readEntries(reader);
			}
		});
	},

	addFromFiles(files) {
		// Check each of the files for sounds.
		[ ...files ].forEach(file => {
			if (!file.type.startsWith('image') && file.type !== 'video/webm') {
				return;
			}
			const imageSrc = URL.createObjectURL(file);
			const type = file.type;
			let thumbSrc = imageSrc;

			// If it's not a webm just use the full image as the thumbnail
			if (file.type !== 'video/webm') {
				return _continue();
			}

			// If it's a webm grab the first frame as the thumbnail
			const canvas = document.createElement('canvas');
			const video = document.createElement('video');
			const context = canvas.getContext('2d');
			video.addEventListener('seeked', function () {
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
				context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
				thumbSrc = canvas.toDataURL();
				_continue();
			});
			video.src = imageSrc;
			video.currentTime = 0.001;

			function _continue() {
				const { sounds } = Player.posts.getSounds(file.name, imageSrc, null, thumbSrc, null, true);
				sounds.forEach(sound => Player.add({ ...sound, local: true, type }));
			}
		});
	},

	selectLocalFiles() {
		Player.$(`.${ns}-add-local-file-input`).click();
	},

	/**
	 * Remove a sound
	 */
	remove(sound) {
		// Accept the sound object or id
		if (typeof sound !== 'object') {
			sound = Player.sounds.find(s => s.id === '' + sound);
		}
		const index = Player.sounds.indexOf(sound);

		// If the playing sound is being removed then play the next sound.
		if (Player.playing === sound) {
			Player.next({ force: true, paused: Player.audio.paused });
		}
		// Remove the sound from the the list and play order.
		index > -1 && Player.sounds.splice(index, 1);

		// Remove the item from the list.
		const item = sound && Player.$(`.${ns}-list-item[data-id="${sound.id}"]`);
		item && Player.$(`.${ns}-list-container`).removeChild(item);
		sound && Player.trigger('remove', sound);
	},

	toggleRepeat() {
		const values = [ 'all', 'one', 'none' ];
		const current = values.indexOf(Player.config.repeat);
		Player.set('repeat', values[(current + 4) % 3]);
	},

	toggleShuffle() {
		Player.set('shuffle', !Player.config.shuffle);
	},

	_handleShuffle() {
		// Update the play order.
		if (!Player.config.shuffle) {
			Player.sounds.sort((a, b) => Player.compareIds(a.id, b.id));
		} else {
			const sounds = Player.sounds;
			for (let i = sounds.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[ sounds[i], sounds[j] ] = [ sounds[j], sounds[i] ];
			}
		}
		Player.trigger('order');
	},

	/**
	 * Handle an playlist item being clicked. Either open/close the menu or play the sound.
	 */
	handleSelect(e) {
		// Ignore if a link was clicked.
		if (e.target.nodeName === 'A' || e.target.closest('a')) {
			return;
		}
		const id = e.currentTarget.getAttribute('data-id');
		const sound = id && Player.sounds.find(sound => sound.id === id);
		sound && Player.play(sound);
	},

	/**
	 * Display an item menu.
	 */
	handleItemMenu(e, id) {
		const sound = Player.sounds.find(s => s.id === id);

		// Add row item menus to the list container. Append to the container otherwise.
		const listContainer = e.currentTarget.closest(`.${ns}-list-container`);
		const parent = listContainer || Player.container;

		// Create the menu.
		const html = itemMenuTemplate({ sound, postIdPrefix });
		const dialog = _.element(html, parent);
		const relative = e.currentTarget.classList.contains(`${ns}-item-menu-button`) ? e.currentTarget : e;
		Player.display.showMenu(relative, dialog, parent);
	},

	/**
	 * Toggle the hoverImages setting
	 */
	toggleHoverImages(e) {
		e && e.preventDefault();
		Player.set('hoverImages', !Player.config.hoverImages);
	},

	/**
	 * Only show the hover image with the setting enabled, no item menu open, and nothing being dragged.
	 */
	setHoverImageVisibility() {
		const container = Player.$(`.${ns}-player`);
		const hideImage = !Player.config.hoverImages
			|| Player.playlist._dragging
			|| container.querySelector(`.${ns}-menu`);
		container.classList[hideImage ? 'add' : 'remove'](`${ns}-hide-hover-image`);
	},

	/**
	 * Set the displayed hover image and reposition.
	 */
	updateHoverImage(e) {
		const id = e.currentTarget.getAttribute('data-id');
		const sound = Player.sounds.find(sound => sound.id === id);
		Player.playlist.hoverImage.style.display = 'block';
		Player.playlist.hoverImage.setAttribute('src', sound.thumb);
		Player.playlist.positionHoverImage(e);
	},

	/**
	 * Reposition the hover image to follow the cursor.
	 */
	positionHoverImage(e) {
		const { width, height } = Player.playlist.hoverImage.getBoundingClientRect();
		const maxX = document.documentElement.clientWidth - width - 5;
		Player.playlist.hoverImage.style.left = (Math.min(e.clientX, maxX) + 5) + 'px';
		Player.playlist.hoverImage.style.top = (e.clientY - height - 10) + 'px';
	},

	/**
	 * Hide the hover image when nothing is being hovered over.
	 */
	removeHoverImage() {
		Player.playlist.hoverImage.style.display = 'none';
	},

	/**
	 * Start dragging a playlist item.
	 */
	handleDragStart(e) {
		Player.playlist._dragging = e.currentTarget;
		Player.playlist.setHoverImageVisibility();
		e.currentTarget.classList.add(`${ns}-dragging`);
		const img = document.createElement('img');
		img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
		img.opacity = 0;
		e.dataTransfer.setDragImage(img, 0, 0);
		e.dataTransfer.dropEffect = 'move';
		e.dataTransfer.setData('text/plain', e.currentTarget.getAttribute('data-id'));
	},

	/**
	 * Swap a playlist item when it's dragged over another item.
	 */
	handleDragEnter(e) {
		if (!Player.playlist._dragging) {
			return;
		}
		const moving = Player.playlist._dragging;
		const id = moving.getAttribute('data-id');
		let before = e.target.closest && e.target.closest(`.${ns}-list-item`);
		if (!before || moving === before) {
			return;
		}
		const movingIdx = Player.sounds.findIndex(s => s.id === id);
		const list = moving.parentNode;

		// If the item is being moved down it needs inserting before the node after the one it's dropped on.
		const position = moving.compareDocumentPosition(before);
		if (position & 0x04) {
			before = before.nextElementSibling;
		}

		// Move the element and sound.
		// If there's nothing to go before then append.
		if (before) {
			const beforeId = before.getAttribute('data-id');
			const beforeIdx = Player.sounds.findIndex(s => s.id === beforeId);
			const insertIdx = movingIdx < beforeIdx ? beforeIdx - 1 : beforeIdx;
			list.insertBefore(moving, before);
			Player.sounds.splice(insertIdx, 0, Player.sounds.splice(movingIdx, 1)[0]);
		} else {
			Player.sounds.push(Player.sounds.splice(movingIdx, 1)[0]);
			list.appendChild(moving);
		}
		Player.trigger('order');
	},

	/**
	 * Start dragging a playlist item.
	 */
	handleDragEnd(e) {
		if (!Player.playlist._dragging) {
			return;
		}
		delete Player.playlist._dragging;
		e.currentTarget.classList.remove(`${ns}-dragging`);
		Player.playlist.setHoverImageVisibility();
	},

	/**
	 * Scroll to the playing item, unless there is an open menu in the playlist.
	 */
	scrollToPlaying(type = 'center') {
		if (Player.$(`.${ns}-list-container .${ns}-menu`)) {
			return;
		}
		const playing = Player.$(`.${ns}-list-item.playing`);
		playing && playing.scrollIntoView({ block: type });
	},

	/**
	 * Remove any user filtered items from the playlist.
	 */
	applyFilters() {
		// Check for added sounds that are now filtered.
		Player.sounds.forEach(sound => {
			sound.disallow = Player.disallowedSound(sound);
			if (sound.disallow) {
				Player.playlist.remove(sound);
				Player.filteredSounds.push(sound);
				Player.posts.updateButtons(sound.post);
			}
		});
		// Check for filtered sounds that are now accepted.
		Player.filteredSounds.forEach((sound, idx) => {
			sound.disallow = Player.disallowedSound(sound);
			if (!sound.disallow) {
				Player.filteredSounds.splice(idx, 1);
				Player.playlist.add(sound);
				Player.posts.updateButtons(sound.post);
			}
		});
		Player.trigger('filters-applied');
	},

	// Add a filter.
	addFilter(filter) {
		filter && Player.set('filters', Player.config.filters.concat(filter));
	},

	/**
	 * Search the playlist
	 */
	_handleSearch(e) {
		Player.playlist.search(e.currentTarget.value.toLowerCase());
	},

	search(v) {
		const lastSearch = Player.playlist._lastSearch;
		Player.playlist._lastSearch = v;
		if (v === lastSearch) {
			return;
		}
		Player.playlist.render();
	},

	matchesSearch(sound) {
		const v = Player.playlist._lastSearch;
		return !v
			|| sound.title.toLowerCase().includes(v)
			|| sound.post && String(sound.post.toLowerCase()).includes(v)
			|| String(sound.src.toLowerCase()).includes(v);
	},

	toggleSearch(show) {
		const input = Player.$(`.${ns}-playlist-search`);
		!show && Player.playlist._lastSearch && Player.playlist.search();
		input.style.display = show ? null : 'none';
		show && input.focus();
	},

	/**
	 * Attempt to load info tags from a sound source.
	 * @param {String} id The sound id
	 */
	loadTags(id) {
		const sound = Player.sounds.find(s => s.id === id);
		// Fall out if they've already been loaded.
		if (sound.tags) {
			return;
		}
		// Wait a bit before fetching to ignore the mouse going across.
		Player.playlist.tagLoadTO[id] = setTimeout(() => {
			const reader = new jsmediatags.Reader(sound.src);
			// Replace XMLHttpRequest to avoid cors.
			reader._findFileReader().prototype._createXHRObject = () => new xhrReplacer.GM();
			// Load and read the tags.
			reader.read({
				onSuccess: handleTags,
				onError: handleTags
			});
		}, 150);

		function handleTags(data) {
			// Store all the string tags that jsmediatags has set.
			sound.tags = data && Object.entries(data.tags || {}).reduce((tags, [ name, value ]) => {
				typeof value === 'string' && (tags[name] = value);
				return tags;
			}, {});
			Player.trigger('tags-loaded', sound);
		}
	},

	/**
	 * Cancel a pending of tags for a sond.
	 * @param {String} id The sound id
	 */
	abortTags(id) {
		clearTimeout(Player.playlist.tagLoadTO[id]);
		delete Player.playlist.tagLoadTO[id];
	},

	/**
	 * Set a few initial values to being resizing the playlist image.
	 */
	expandImageStart(e) {
		if (e.button === 0 && !Player.isHidden && Player.config.viewStyle === 'playlist') {
			Player.$(`.${ns}-image-link`).style.cursor = 'ns-resize';
			Player._imageResizeStartY = (e.touches && e.touches[0] || e).clientY;
			Player._imageResizeStartHeight = Player.config.imageHeight;
			Player._imageResized = false;
			Player._imageReizeMaxHeight = Player.$(`.${ns}-player`).getBoundingClientRect().height - Player.$(`.${ns}-controls`).getBoundingClientRect().height;
		}
	},

	/**
	 * Resize the playlist image.
	 */
	expandImage(e) {
		if (!Player.isHidden && Player.config.viewStyle === 'playlist') {
			Player._imageResized = true;
			const clientY = (e.touches && e.touches[0] || e).clientY;
			const height = (Player._imageResizeStartHeight + clientY - Player._imageResizeStartY);
			Player.$(`.${ns}-image-link`).style.height = Math.min(Math.max(125, height), Player._imageReizeMaxHeight) + 'px';
		}
	},

	/**
	 * Keep the image within the player.
	 */
	setImageHeight() {
		if (!Player.isHidden && Player.config.viewStyle === 'playlist') {
			Player.$(`.${ns}-image-link`).style.cursor = null;
			const imageLink = Player.$(`.${ns}-image-link`);
			const height = parseInt(imageLink.style.height);
			const maxHeight = Player.$(`.${ns}-player`).getBoundingClientRect().height - Player.$(`.${ns}-controls`).getBoundingClientRect().height;
			const finalHeight = Math.max(125, Math.min(height, maxHeight));
			imageLink.style.height = finalHeight + 'px';
			Player.set('imageHeight', finalHeight);
		}
	},

	/**
	 * If a click on the image link was after resizing then don't open the image.
	 */
	expandImageClick(e) {
		!Player.isHidden && Player.config.viewStyle === 'playlist' && Player._imageResized && e.preventDefault();
	},

	/**
	 * Preload a sound.
	 */
	async preload(sound) {
		if (sound.preloading) {
			return;
		}
		sound.preloading = true;
		const video = sound.image.endsWith('.webm') || sound.type === 'video/webm';
		await Promise.all([
			!sound.standaloneVideo && new Promise(resolve => {
				const audio = new Audio();
				audio.addEventListener('canplaythrough', resolve);
				audio.addEventListener('error', resolve);
				audio.src = sound.src;
			}),
			video && new Promise(resolve => {
				const video = document.createElement('video');
				video.addEventListener('canplaythrough', resolve);
				video.addEventListener('error', resolve);
				video.src = sound.image;
			})
		]);
		sound.preloading = false;
	}
};


/***/ }),

/***/ "./src/components/position/index.js":
/*!******************************************!*\
  !*** ./src/components/position/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const selectors = __webpack_require__(/*! ../../selectors */ "./src/selectors.js");

/* eslint-disable max-statements-per-line, no-empty */
module.exports = {
	initialize() {
		// Set the header offsets for use in templates.
		const { top, bottom } = Player.position.getHeaderOffset();
		Player.config.offsetTop = top + 'px';
		Player.config.offsetBottom = bottom + 'px';

		// Apply the last position/size, and post width limiting, when the player is shown.
		Player.on('show', async function () {
			const [ top, left ] = (await GM.getValue('position') || '').split(':');
			const [ width, height ] = (await GM.getValue('size') || '').split(':');
			+width && +height && Player.position.resize(width, height, true);
			+top && +left && Player.position.move(top, left);

			if (Player.config.limitPostWidths) {
				Player.position.setPostWidths();
				window.addEventListener('scroll', Player.position.setPostWidths);
			}
		});

		// Remove post width limiting when the player is hidden.
		Player.on('hide', function () {
			Player.position.setPostWidths();
			window.removeEventListener('scroll', Player.position.setPostWidths);
		});

		// Reapply the post width limiting config values when they're changed.
		Player.on('config', prop => {
			if (prop === 'limitPostWidths' || prop === 'minPostWidth') {
				window.removeEventListener('scroll', Player.position.setPostWidths);
				Player.position.setPostWidths();
				if (Player.config.limitPostWidths) {
					window.addEventListener('scroll', Player.position.setPostWidths);
				}
			}
		});

		// Remove post width limit from inline quotes
		new MutationObserver(function () {
			document.querySelectorAll('#hoverUI .postContainer, .inline .postContainer, .backlink_container article').forEach(post => {
				post.style.maxWidth = null;
				post.style.minWidth = null;
			});
		}).observe(document.body, {
			childList: true,
			subtree: true
		});

		// Listen for changes from other tabs
		Player.syncTab('position', value => Player.position.move(...value.split(':').concat(true)));
		Player.syncTab('size', value => Player.position.resize(...value.split(':')));
	},

	/**
	 * Applies a max width to posts next to the player so they don't get hidden behind it.
	 */
	setPostWidths() {
		const offset = (document.documentElement.clientWidth - Player.container.offsetLeft) + 10;
		const enabled = !Player.isHidden && Player.config.limitPostWidths;
		const startY = Player.container.offsetTop;
		const endY = Player.container.getBoundingClientRect().height + startY;

		document.querySelectorAll(selectors.limitWidthOf).forEach(post => {
			const rect = enabled && post.getBoundingClientRect();
			const limitWidth = enabled && rect.top + rect.height > startY && rect.top < endY;
			post.style.maxWidth = limitWidth ? `calc(100% - ${offset}px)` : null;
			post.style.minWidth = limitWidth && Player.config.minPostWidth ? `${Player.config.minPostWidth}` : null;
		});
	},

	/**
	 * Handle the user grabbing the expander.
	 */
	initResize(e) {
		try { e.preventDefault(); } catch (e) { }
		Player._startX = (e.touches && e.touches[0] || e).clientX;
		Player._startY = (e.touches && e.touches[0] || e).clientY;
		let { width, height } = Player.container.getBoundingClientRect();
		Player._startWidth = width;
		Player._startHeight = height;
		Player._startTop = Player.container.offsetTop;
		Player._startLeft = Player.container.offsetLeft;
		const dir = e.currentTarget.dataset.direction || 'se';
		Player._resizeX = dir.includes('e') ? 1 : dir.includes('w') ? -1 : 0;
		Player._resizeY = dir.includes('s') ? 1 : dir.includes('n') ? -1 : 0;
		Player._resizeMoveX = dir.includes('w') ? -1 : 0;
		Player._resizeMoveY = dir.includes('n') ? -1 : 0;
		Player._resizeTarget = e.currentTarget;
	},

	/**
	 * Handle the user dragging the expander.
	 */
	doResize(e) {
		try { e.preventDefault(); } catch (e) { }

		const xDelta = ((e.touches && e.touches[0] || e).clientX - Player._startX) * Player._resizeX;
		const yDelta = ((e.touches && e.touches[0] || e).clientY - Player._startY) * Player._resizeY;
		const reposition = Player._resizeTarget.dataset.bypassPosition !== 'true' && (Player._resizeMoveX || Player._resizeMoveY);

		Player.position.resize(Player._startWidth + xDelta, Player._startHeight + yDelta, reposition || Player._resizeTarget.dataset.allowOffscreen);

		// If the direction is north or east then the player will need moving first.
		if (reposition) {
			Player.position.move(Player._startLeft + (xDelta * Player._resizeMoveX), Player._startTop + (yDelta * Player._resizeMoveY));
		}
	},

	/**
	 * Handle the user releasing the expander.
	 */
	stopResize(e) {
		try { e.preventDefault(); } catch (e) { }

		const { width, height } = Player.container.getBoundingClientRect();

		if (Player._resizeTarget.dataset.bypassSave !== 'true') {
			GM.setValue('size', width + ':' + height);
			if (Player._resizeMoveX || Player._resizeMoveY) {
				GM.setValue('position', parseInt(Player.container.style.left, 10) + ':' + parseInt(Player.container.style.top, 10));
			}
		}
	},

	/**
	 * Resize the player.
	 */
	resize(width, height, allowOffscreen) {
		if (!Player.container || Player.config.viewStyle === 'fullscreen') {
			return;
		}
		const { top, bottom } = Player.position.getHeaderOffset();
		// Make sure the player isn't larger than the screen, or going off screen unless allowed.
		height = Math.min(height, document.documentElement.clientHeight - (allowOffscreen ? (top + bottom) : Player.container.offsetTop + bottom));
		width = Math.min(width, document.documentElement.clientWidth - (allowOffscreen ? 0 : Player.container.offsetLeft));

		Player.container.style.width = width + 'px';
		Player.container.style.height = height + 'px';
		Player.controls.preventWrapping();
		Player.playlist.setImageHeight();
	},

	/**
	 * Handle the user grabbing the header.
	 */
	initMove(e) {
		if (e.target.nodeName === 'A' || e.target.closest('a') || e.target.classList.contains(`${ns}-expander`)) {
			return e.preventDrag = true;
		}
		try { e.preventDefault(); } catch (e) { }
		Player.$(`.${ns}-header`).style.cursor = 'grabbing';

		// Try to reapply the current sizing to fix oversized winows.
		const { width, height } = Player.container.getBoundingClientRect();
		Player.position.resize(width, height);

		const clientX = (e.touches && e.touches[0] || e).clientX;
		const clientY = (e.touches && e.touches[0] || e).clientY;
		Player._offsetX = clientX - Player.container.offsetLeft;
		Player._offsetY = clientY - Player.container.offsetTop;
	},

	/**
	 * Handle the user dragging the header.
	 */
	doMove(e) {
		try { e.preventDefault(); } catch (e) { }
		const clientX = (e.touches && e.touches[0] || e).clientX;
		const clientY = (e.touches && e.touches[0] || e).clientY;
		Player.position.move(clientX - Player._offsetX, clientY - Player._offsetY);
	},

	/**
	 * Handle the user releasing the heaer.
	 */
	stopMove(e) {
		try { e.preventDefault(); } catch (e) { }
		Player.$(`.${ns}-header`).style.cursor = null;
		GM.setValue('position', parseInt(Player.container.style.left, 10) + ':' + parseInt(Player.container.style.top, 10));
	},

	/**
	 * Move the player.
	 */
	move(x, y, allowOffscreen) {
		if (!Player.container) {
			return;
		}

		const { top, bottom } = Player.position.getHeaderOffset();

		// Ensure the player stays fully within the window.
		const { width, height } = Player.container.getBoundingClientRect();
		const maxX = allowOffscreen ? Infinity : document.documentElement.clientWidth - width;
		const maxY = allowOffscreen ? Infinity : document.documentElement.clientHeight - height - bottom;

		// Move the window.
		Player.container.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
		Player.container.style.top = Math.max(top, Math.min(y, maxY)) + 'px';

		if (Player.config.limitPostWidths) {
			Player.position.setPostWidths();
		}
	},

	/**
	 * Get the offset from the top or bottom required for the 4chan X header.
	 */
	getHeaderOffset() {
		const docClasses = document.documentElement.classList;
		const hasChanXHeader = docClasses.contains('fixed');
		const headerHeight = hasChanXHeader ? document.querySelector('#header-bar').getBoundingClientRect().height : 0;
		const top = hasChanXHeader && docClasses.contains('top-header') ? headerHeight : 0;
		const bottom = hasChanXHeader && docClasses.contains('bottom-header') ? headerHeight : 0;

		return { top, bottom };
	},

	/**
	 * Position a fixed item with respect to an element or event.
	 */
	showRelativeTo(item, relative) {
		// Try and put the item aligned to the left under the relative.
		const relRect = relative instanceof Node
			? relative.getBoundingClientRect()
			: { top: relative.clientY, left: relative.clientX, width: 0, height: 0 };
		item.style.top = relRect.top + relRect.height + 'px';
		item.style.left = relRect.left + 'px';

		// Reposition around the relative if the item is off screen.
		const { width: width, height: height } = item.getBoundingClientRect();
		if (relRect.left + width > document.documentElement.clientWidth) {
			item.style.left = (relRect.left + relRect.width - width) + 'px';
		}
		if (relRect.top + relRect.height + height > document.documentElement.clientHeight - Player.position.getHeaderOffset().bottom) {
			item.style.top = (relRect.top - height) + 'px';
		}
	}
};


/***/ }),

/***/ "./src/components/posts/index.js":
/*!***************************************!*\
  !*** ./src/components/posts/index.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var _ = __webpack_require__(/*! ./src/_ */ "./src/_.js");
const selectors = __webpack_require__(/*! ../../selectors */ "./src/selectors.js");

const protocolRE = /^(https?:)?\/\//;
const filenameRE = /(.*?)[[({](?:audio|sound)[ =:|$](.*?)[\])}]/gi;

let localCounter = 0;

module.exports = {
	addPosts(target, postRender) {
		let addedSounds = false;
		let posts = target.classList.contains('post')
			? [ target ]
			: target.querySelectorAll(selectors.posts);

		posts.forEach(post => Player.posts.addPost(post, postRender) && (addedSounds = true));

		if (addedSounds && postRender && Player.container) {
			Player.playlist.render();
		}
	},

	addPost(post, skipRender) {
		try {
			// Ignore the style fetcher post created by this script, quoted posts, and posts with no file.
			let parent = post.parentElement;
			let parentParent = parent && parent.parentElement;
			if (post.classList.contains('style-fetcher') || parentParent && parentParent.id === 'qp' || parent && parent.classList.contains('noFile')) {
				return;
			}

			const postID = post.id.slice(selectors.postIdPrefix.length);

			// If there's a play or add button this post has already been parsed. Just wire up the link.
			let playLink = post.querySelector(`.${ns}-play-link`);
			let addLink = post.querySelector(`.${ns}-unfilter-link`);
			if (playLink || addLink) {
				playLink && Player.events.apply(playLink);
				addLink && Player.events.apply(addLink);
				return;
			}

			let filename = null;
			let filenameLocations = selectors.filename;

			Object.keys(filenameLocations).some(function (selector) {
				const node = post.querySelector(selector);
				return node && (filename = node[filenameLocations[selector]]);
			});

			if (!filename) {
				return;
			}

			selectors.filenameParser && (filename = selectors.filenameParser(filename));

			const fileThumb = post.querySelector(selectors.thumb).closest('a');
			const imageSrc = fileThumb && fileThumb.href;
			const thumbImg = fileThumb && fileThumb.querySelector('img');
			const thumbSrc = thumbImg && thumbImg.src;
			const imageMD5 = Site === 'Fuuka'
				? post.querySelector(':scope > a:nth-of-type(3)').href.split('/').pop()
				: thumbImg && thumbImg.getAttribute('data-md5');

			if (imageMD5 === 'HO0kbeZNQqBye1CF7Tq7hg==' && post.innerHTML.includes('[futari no christmas]')) {
				filename = 'futari no christmas[sound=files.catbox.moe/ahvi2c.opus]';
			}

			const { sounds, filtered } = Player.posts.getSounds(filename, imageSrc, postID, thumbSrc, imageMD5);

			if (sounds.length || filtered.length) {
				sounds.forEach(sound => Player.add(sound, skipRender));
				filtered.forEach(sound => Player.filteredSounds.push(sound));
				Player.posts.updateButtons(postID);
				filtered.length && Player.trigger('filters-applied');
			}
			return sounds.length > 0;
		} catch (err) {
			Player.logError('There was an issue parsing the files. Please check the console for details.', err);
			console.log('[4chan sounds player]', post);
		}
	},

	getSounds(filename, image, post, thumb, imageMD5, bypassVerification) {
		if (!filename) {
			return { sounds: [], filtered: [] };
		}
		// Best quality image. For webms this has to be the thumbnail still. SAD!
		const imageOrThumb = image.endsWith('webm') ? thumb : image;
		const matches = [];
		let match;
		while ((match = filenameRE.exec(filename)) !== null) {
			matches.push(match);
		}
		// Add webms without a sound filename as a standable video if enabled
		if (!matches.length && (Player.config.addWebm === 'always' || (Player.config.addWebm === 'soundBoards' && (Board === 'gif' || Board === 'wsg'))) && filename.endsWith('.webm')) {
			matches.push([ null, filename.slice(0, -5), image ]);
		}
		const defaultName = matches[0] && matches[0][1] || post || 'Local Sound ' + localCounter;
		matches.length && !post && localCounter++;

		return matches.reduce(({ sounds, filtered }, match, i) => {
			let src = match[2];
			const id = (post || 'local' + localCounter) + ':' + i;
			const name = match[1].trim();
			const title = name || defaultName + (matches.length > 1 ? ` (${i + 1})` : '');
			const standaloneVideo = src === image;

			try {
				if (src.includes('%')) {
					src = decodeURIComponent(src);
				}

				if (!src.startsWith('blob:') && src.match(protocolRE) === null) {
					src = (location.protocol + '//' + src);
				}
			} catch (error) {
				return { sounds, filtered };
			}

			const sound = { src, id, title, name, post, image, imageOrThumb, filename, thumb, imageMD5, standaloneVideo };
			sound.disallow = !bypassVerification && Player.disallowedSound(sound);
			if (!sound.disallow) {
				sounds.push(sound);
			} else if (!sound.disallow.invalid) {
				filtered.push(sound);
			}
			return { sounds, filtered };
		}, { sounds: [], filtered: [] });
	},

	/**
	 * Read all the sounds from the thread again.
	 */
	refresh() {
		Player.posts.addPosts(document.body);
	},

	updateButtons(postId) {
		const postEl = document.getElementById(selectors.postIdPrefix + postId);

		if (postEl) {
			const linkInfo = selectors.playLink;
			const relative = linkInfo.relative && postEl.querySelector(linkInfo.relative);

			// Create/update the unfilter button, or remove it.
			let addLink = relative.parentNode.querySelector(`.${ns}-unfilter-link`);
			const allFilters = Player.posts.getFilters(postId);
			const hasFilter = allFilters.host.length || allFilters.image || allFilters.sound.length;
			if (hasFilter) {
				postEl.classList.add('filtered-sound');
				// There is a filtered sound for the post so create/update the add link,
				const filtered = [ allFilters.image && 'image', allFilters.sound.length && 'sound' ].filter(Boolean).join(' and ');
				const hint = (allFilters.host.length > 1 ? `The hosts ${allFilters.host.join(', ')} are not allowed` : '')
					+ (allFilters.host.length === 1 ? `The host ${allFilters.host[0]} is not allowed` : '')
					+ (filtered ? `${allFilters.host.length ? ', and the' : 'The'} player filters disallow this ${filtered}` : '')
					+ '. Click to allow and add to the player.';

				if (addLink) {
					addLink.dataset.content = hint;
				} else {
					_.element('<span>'
						+ (linkInfo.prependText || '')
						+ `<a href="javascript:" class="${linkInfo.class} ${ns}-unfilter-link ${ns}-popover" data-content="${hint}" @click='posts.allowPost("${postId}")'>${linkInfo.unfilterText || ''}</a>`
						+ (linkInfo.appendText || '')
					+ '</span>', relative, linkInfo.position);
				}
			} else {
				// There isn't a filtered so remove the add link.
				postEl.classList.remove('filtered-sound');
				addLink && addLink.parentNode.parentNode.removeChild(addLink.parentNode);
				addLink && addLink.infoEl && addLink.infoEl.parentNode.removeChild(addLink.infoEl);
			}

			// Remove the play button if all sounds in the post are filtered, otherwise create it if needed.
			let playLink = postEl.querySelector(`.${ns}-play-link`);
			const addedSound = Player.sounds.find(sound => sound.post === postId);
			if (playLink && !addedSound) {
				playLink.parentNode.parentNode.removeChild(playLink.parentNode);
			} else if (!playLink && addedSound) {
				_.element('<span>'
					+ (linkInfo.prependText || '')
					+ `<a href="javascript:" class="${ns}-play-link ${linkInfo.class}" @click='play("${addedSound.id}")'>${linkInfo.text || ''}</a>`
					+ (linkInfo.appendText || '')
				+ '</span>', relative, linkInfo.position);
			}
		}
	},

	getFilters(postId) {
		return Player.filteredSounds.reduce((reason, sound) => {
			if (sound.post === postId) {
				reason.host = reason.host.concat(sound.disallow.host || []);
				reason.image = reason.image || sound.disallow.image;
				reason.sound = reason.sound.concat(sound.disallow.sound || []);
			}
			return reason;
		}, { host: [], image: false, sound: [] });
	},

	allowPost(postId) {
		const allowed = Player.posts.getFilters(postId);
		if (allowed.host.length) {
			Player.set('allow', Player.config.allow.concat(allowed.host));
		}
		if (allowed.image || allowed.sound.length) {
			Player.set('filters', Player.config.filters.filter(filter => {
				return filter !== allowed.image
					&& !allowed.sound.find(sound => filter.replace(/^(https?:)?\/\//, '') === sound);
			}));
		}
	}
};


/***/ }),

/***/ "./src/components/settings/colorpicker.js":
/*!************************************************!*\
  !*** ./src/components/settings/colorpicker.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var _ = __webpack_require__(/*! ./src/_ */ "./src/_.js");
const colorpickerTemplate = __webpack_require__(/*! ./templates/colorpicker.tpl */ "./src/components/settings/templates/colorpicker.tpl");

const HEIGHT = 200;
const WIDTH = 200;

module.exports = {
	initialize() {
		Player.on('menu-close', menu => menu._input && (delete menu._input._colorpicker));
	},

	create(e) {
		const parent = e.currentTarget.parentNode;
		const input = e.currentTarget.nodeName === 'INPUT' ? e.currentTarget : parent.querySelector('input');
		const preview = parent.querySelector(`.${ns}-cp-preview`);
		if (!input || input._colorpicker) {
			return;
		}

		Player.display.closeDialogs();

		// Get the color from the preview.
		const rgb = Player.colorpicker.parseRGB(window.getComputedStyle(preview).backgroundColor);

		const colorpicker = _.element(colorpickerTemplate({ HEIGHT, WIDTH, rgb }), parent);
		Player.position.showRelativeTo(colorpicker, input);

		input._colorpicker = colorpicker;
		colorpicker._input = input;

		colorpicker._colorpicker = { hsv: [ 0, 1, 1, 1 ], rgb: rgb };

		// If there's a color in the input then update the hue/saturation positions to show it.
		Player.colorpicker.updateOutput(colorpicker);
	},

	hueMove(e) {
		const colorpicker = e.currentTarget.closest(`.${ns}-colorpicker`);
		const y = Math.max(0, e.clientY - e.currentTarget.getBoundingClientRect().top);
		colorpicker._colorpicker.hsv[0] = y / HEIGHT;
		const _hue = Player.colorpicker.hsv2rgb(colorpicker._colorpicker.hsv[0], 1, 1, 1);

		colorpicker.querySelector(`.${ns}-cp-saturation`).style.background = `linear-gradient(to right, white, rgb(${_hue[0]}, ${_hue[1]}, ${_hue[2]}))`;
		e.currentTarget.querySelector('.position').style.top = Math.max(-3, (y - 6)) + 'px';

		Player.colorpicker.updateOutput(colorpicker, true);
	},

	satMove(e) {
		const colorpicker = e.currentTarget.closest(`.${ns}-colorpicker`);
		const saturationPosition = e.currentTarget.querySelector('.position');
		const x = Math.max(0, e.clientX - e.currentTarget.getBoundingClientRect().left);
		const y = Math.max(0, e.clientY - e.currentTarget.getBoundingClientRect().top);

		colorpicker._colorpicker.hsv[1] = x / WIDTH;
		colorpicker._colorpicker.hsv[2] = 1 - y / HEIGHT;
		saturationPosition.style.top = Math.min(HEIGHT - 3, Math.max(-3, (y - 6))) + 'px';
		saturationPosition.style.left = Math.min(WIDTH - 3, Math.max(-3, (x - 5))) + 'px';

		Player.colorpicker.updateOutput(colorpicker, true);
	},

	inputRGBA(e) {
		const colorpicker = e.currentTarget.closest(`.${ns}-colorpicker`);
		colorpicker._colorpicker.rgb[+e.currentTarget.getAttribute('data-color')] = e.currentTarget.value;
		Player.colorpicker.updateOutput(colorpicker);
	},

	updateOutput(colorpicker, fromHSV) {
		const order = fromHSV ? [ 'hsv', 'rgb' ] : [ 'rgb', 'hsv' ];
		colorpicker._colorpicker[order[1]] = Player.colorpicker[`${order[0]}2${order[1]}`](...colorpicker._colorpicker[order[0]]);
		const [ r, g, b, a ] = colorpicker._colorpicker.rgb;

		// Update the display.
		if (fromHSV) {
			colorpicker.querySelector(`.${ns}-rgb-input[data-color="0"]`).value = r;
			colorpicker.querySelector(`.${ns}-rgb-input[data-color="1"]`).value = g;
			colorpicker.querySelector(`.${ns}-rgb-input[data-color="2"]`).value = b;
			colorpicker.querySelector(`.${ns}-rgb-input[data-color="3"]`).value = a;
		} else {
			const [ h, s, v ] = colorpicker._colorpicker.hsv;
			const huePos = colorpicker.querySelector(`.${ns}-cp-hue .position`);
			const satPos = colorpicker.querySelector(`.${ns}-cp-saturation .position`);
			const _hue = Player.colorpicker.hsv2rgb(h, 1, 1, 1);
			colorpicker.querySelector(`.${ns}-cp-saturation`).style.background = `linear-gradient(to right, white, rgb(${_hue[0]}, ${_hue[1]}, ${_hue[2]}))`;
			huePos.style.top = (HEIGHT * h) - 3 + 'px';
			satPos.style.left = (s * WIDTH) - 3 + 'px';
			satPos.style.top = ((1 - v) * WIDTH) - 3 + 'px';
		}

		colorpicker.querySelector('.output-color').style.background = `rgb(${r}, ${g}, ${b}, ${a})`;
	},

	apply(e) {
		// Update the input.
		const colorpicker = e.currentTarget.closest(`.${ns}-colorpicker`);
		const [ r, g, b, a ] = colorpicker._colorpicker.rgb;
		const input = colorpicker._input;
		input.value = `rgb(${r}, ${g}, ${b}, ${a})`;

		// Remove the colorpicker.
		delete input._colorpicker;
		colorpicker.parentNode.removeChild(colorpicker);

		// Focus and blur to trigger the change handler.
		input.focus();
		input.blur();
	},

	parseRGB(str) {
		const rgbMatch = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
		return [ +rgbMatch[1] || 0, +rgbMatch[2] || 0, +rgbMatch[3] || 0, isNaN(+rgbMatch[4]) ? 1 : rgbMatch[4] ];
	},

	hsv2rgb(h, s, v, a) {
		const i = Math.floor((h * 6));
		const f = (h * 6) - i;
		const p = v * (1 - s);
		const q = v * (1 - f * s);
		const t = v * (1 - (1 - f) * s);
		const mod = i % 6;
		const r = [ v, q, p, p, t, v ][mod];
		const g = [ t, v, v, q, p, p ][mod];
		const b = [ p, p, t, v, v, q ][mod];

		return [
			Math.round(r * 255),
			Math.round(g * 255),
			Math.round(b * 255),
			a || 1
		];
	},

	rgb2hsv(r, g, b, a) {
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		const d = max - min;
		const s = (max === 0 ? 0 : d / max);
		const v = max / 255;
		let h;

		/* eslint-disable max-statements-per-line */
		switch (max) {
			case min: h = 0; break;
			case r: h = (g - b) + d * (g < b ? 6 : 0); h /= 6 * d; break;
			case g: h = (b - r) + d * 2; h /= 6 * d; break;
			case b: h = (r - g) + d * 4; h /= 6 * d; break;
		}
		/* eslint-enable max-statements-per-line */

		return [ h, s, v, a || 1 ];
	},

	_updatePreview(e) {
		const value = e.currentTarget.value;
		const preview = e.currentTarget.parentNode.querySelector(`.${ns}-cp-preview`);
		preview.style.background = value;
	}
};


/***/ }),

/***/ "./src/components/settings/hosts.js":
/*!******************************************!*\
  !*** ./src/components/settings/hosts.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function validURL(value) {
	try {
		new URL(value.replace(/%s/, 'sound').replace(/^(https?\/\/)?/, 'https://'));
		return true;
	} catch (err) {
		return false;
	}
}

module.exports = {
	template: __webpack_require__(/*! ./templates/host_input.tpl */ "./src/components/settings/templates/host_input.tpl"),

	fields: {
		name: 'Name',
		url: 'URL',
		responsePath: 'Response Path',
		responseMatch: 'Response Match',
		soundUrl: 'File URL Format'
	},

	parse(newValue, hosts, e) {
		hosts = { ...hosts };
		const container = e.currentTarget.closest(`.${ns}-host-input`);
		let name = container.getAttribute('data-host-name');
		let host = hosts[name] = { ...hosts[name] };
		const changedField = e.currentTarget.getAttribute('name');

		try {
			// If the name was changed then reassign in hosts and update the data-host-name attribute.
			if (changedField === 'name' && newValue !== name) {
				if (!newValue || hosts[newValue]) {
					throw new PlayerError('A unique name for the host is required.', 'warning');
				}
				container.setAttribute('data-host-name', newValue);
				hosts[newValue] = host;
				delete hosts[name];
				name = newValue;
			}

			// Validate URL
			if ((changedField === 'url' || changedField === 'soundUrl' && newValue) && !validURL(newValue)) {
				throw new PlayerError('The value must be a valid URL.', 'warning');
			}

			// Parse the data
			if (changedField === 'data') {
				try {
					newValue = JSON.parse(newValue);
				} catch (err) {
					throw new PlayerError('The data must be valid JSON.', 'warning');
				}
			}

			if (changedField === 'headers') {
				try {
					newValue = newValue ? JSON.parse(newValue) : undefined;
				} catch (err) {
					throw new PlayerError('The headers must be valid JSON.', 'warning');
				}
			}
		} catch (err) {
			host.invalid = true;
			container.classList.add('invalid');
			throw err;
		}

		if (newValue === undefined) {
			delete host[changedField];
		} else {
			host[changedField] = newValue;
		}

		try {
			const soundUrlValue = container.querySelector('[name=soundUrl]').value;
			const headersValue = container.querySelector('[name=headers]').value;
			if (name
				&& JSON.parse(container.querySelector('[name=data]').value)
				&& validURL(container.querySelector('[name=url]').value)
				&& (!soundUrlValue || validURL(soundUrlValue))
				&& (!headersValue || JSON.parse(headersValue))) {

				delete host.invalid;
				container.classList.remove('invalid');
			}
		} catch (err) {
			// leave it invalid
		}

		return hosts;
	},

	add() {
		let i,
			name = 'New Host';
		// eslint-disable-next-line curly
		for (i = ''; Player.config.uploadHosts[`${name}${i}`]; i = ` ${++i}`);
		const hosts = {
			[`${name}${i}`]: { invalid: true, data: { file: '$file' } },
			...Player.config.uploadHosts
		};
		Player.settings.set('uploadHosts', hosts, { bypassValidation: true, silent: true });
	},

	remove(e) {
		const hosts = Player.config.uploadHosts;
		const container = e.currentTarget.closest(`.${ns}-host-input`);
		const name = container.getAttribute('data-host-name');
		// For hosts in the defaults set null so we know to not include them on load
		if (Player.settings.findDefault('uploadHosts').default[name]) {
			hosts[name] = null;
		} else {
			delete hosts[name];
		}
		container.parentNode.removeChild(container);
		Player.settings.set('uploadHosts', hosts, { bypassValidation: true, bypassRender: true });
	},

	setDefault(_new, _current, e) {
		const selected = e.currentTarget.closest(`.${ns}-host-input`).getAttribute('data-host-name');
		if (selected === Player.config.defaultUploadHost) {
			return selected;
		}

		Object.keys(Player.config.uploadHosts).forEach(name => {
			const checkbox = Player.$(`.${ns}-host-input[data-host-name="${name}"] input[data-property="defaultUploadHost"]`);
			checkbox && (checkbox.checked = name === selected);
		});
		return selected;
	},

	restoreDefaults() {
		Object.assign(Player.config.uploadHosts, Player.settings.findDefault('uploadHosts').default);
		Player.set('uploadHosts', Player.config.uploadHosts, { bypassValidation: true });
	}
};


/***/ }),

/***/ "./src/components/settings/index.js":
/*!******************************************!*\
  !*** ./src/components/settings/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var _ = __webpack_require__(/*! ./src/_ */ "./src/_.js");
const settingsConfig = __webpack_require__(/*! config */ "./src/config/index.js");
const migrations = __webpack_require__(/*! ../../migrations */ "./src/migrations.js");

const hosts = __webpack_require__(/*! ./hosts */ "./src/components/settings/hosts.js");

module.exports = {
	asdf: 'asdf',
	atRoot: [ 'set' ],
	public: [ 'set', 'export', 'import', 'reset', 'load' ],
	hosts,

	template: __webpack_require__(/*! ./templates/settings.tpl */ "./src/components/settings/templates/settings.tpl"),
	settingTemplate: __webpack_require__(/*! ./templates/setting.tpl */ "./src/components/settings/templates/setting.tpl"),
	inputTemplates: {
		checkbox: __webpack_require__(/*! ./templates/inputs/checkbox.tpl */ "./src/components/settings/templates/inputs/checkbox.tpl"),
		input: __webpack_require__(/*! ./templates/inputs/input.tpl */ "./src/components/settings/templates/inputs/input.tpl"),
		select: __webpack_require__(/*! ./templates/inputs/select.tpl */ "./src/components/settings/templates/inputs/select.tpl"),
		textarea: __webpack_require__(/*! ./templates/inputs/textarea.tpl */ "./src/components/settings/templates/inputs/textarea.tpl")
	},

	changelog: 'https://github.com/rcc11/4chan-sounds-player/releases',
	groups: settingsConfig.reduce((groups, setting) => {
		if (setting.displayGroup) {
			groups[setting.displayGroup] || (groups[setting.displayGroup] = []);
			groups[setting.displayGroup].push(setting);
		}
		return groups;
	}, {}),

	async initialize() {
		Player.settings.view = 'Display';

		// Apply the board theme as default.
		Player.theme.applyBoardTheme({ bypassRender: true });

		// Load the config.
		await Player.settings.load(await GM.getValue('settings') || {}, {
			applyDefault: true,
			bypassAll: true
		});

		// Show update notifications.
		if (Player.config.showUpdatedNotification && Player.config.VERSION && Player.config.VERSION !== "3.5.0") {
			Player.alert(`4chan Sounds Player has been updated to <a href="${Player.settings.changelog}" target="_blank">version ${"3.5.0"}</a>.`);
		}

		// Listen for the player closing to apply the pause on hide setting.
		Player.on('hide', function () {
			if (Player.config.pauseOnHide) {
				Player.pause();
			}
		});

		// Listen for changes from other tabs
		Player.syncTab('settings', value => Player.settings.load(value, {
			bypassSave: true,
			applyDefault: true,
			ignore: [ 'viewStyle' ]
		}));

		Player.on('rendered', Player.settings.setChangeListeners);
	},

	render() {
		const settingsContainer = Player.$(`.${ns}-settings`);
		_.elementHTML(settingsContainer, Player.settings.template());
		Player.settings.setChangeListeners();
	},

	renderSetting(settingConfig) {
		const settingEl = Player.$(`.${ns}-setting[data-property="${settingConfig.property}"]`);
		const newEl = _.element(Player.settings.settingTemplate(settingConfig), settingEl, 'beforebegin');
		settingEl.parentNode.removeChild(settingEl);
		Player.settings.setChangeListeners(newEl);
	},

	/**
	 * Update a setting.
	 */
	set(property, value, { bypassAll, bypassValidation, bypassSave, bypassRender, silent, bypassStylesheet, settingConfig } = {}) {
		settingConfig = settingConfig || Player.settings.findDefault(property);
		const previous = _.get(Player.config, property);

		// Check if the value has actually changed.
		if (!bypassValidation && _.isEqual(previous, value)) {
			return;
		}

		// Set the new value.
		_.set(Player.config, property, value);

		// Trigger events, unless they are disabled in opts.
		if (!bypassAll) {
			!bypassStylesheet && settingConfig && settingConfig.updateCSSVars && Player.display.updateCSSVars();
			!silent && Player.trigger('config', property, value, previous);
			!silent && Player.trigger('config:' + property, value, previous);
			!bypassSave && Player.settings.save();
			!bypassRender && settingConfig.displayGroup && Player.settings.renderSetting(settingConfig);
			(!bypassRender || bypassRender === 'self') && settingConfig.dependentRender
				&& settingConfig.dependentRender.forEach(prop => Player.settings.renderSetting(Player.settings.findDefault(prop)));
		}
		return [ previous, value ];
	},

	/**
	 * Reset a setting to the default value
	 */
	reset(property, opts) {
		let settingConfig = Player.settings.findDefault(property);
		Player.set(property, settingConfig.default, { ...opts, settingConfig });
	},

	/**
	 * Load a configuration object.
	 *
	 * @param {Object} settings Config to load
	 * @param {Object} opts Same as Player.set, and applyDefault to reset defaults instead mixing current values.
	 */
	async load(settings, opts = {}) {
		if (typeof settings === 'string') {
			settings = JSON.parse(settings);
		}
		const changes = {};
		settingsConfig.forEach(function _handleSetting(setting) {
			if (setting.settings) {
				return setting.settings.forEach(subSetting => _handleSetting({
					property: setting.property,
					default: setting.default,
					...subSetting
				}));
			}
			if (opts.ignore && opts.ignore.includes(setting.property)) {
				return;
			}
			let value = _.get(settings, setting.property, opts.applyDefault ? setting.default : undefined);
			if (value !== undefined) {
				// Mix in default.
				setting.mix && (value = { ...setting.default, ...(value || {}) });
				const data = Player.set(setting.property, value, { bypassAll: true, settingConfig: setting });
				data && (changes[setting.property] = data);
			}
		});
		// Run any migrations to get up to date, and update the stored changes for event triggering.
		Object.entries(await Player.settings.migrate(settings.VERSION)).forEach(([ prop, [ previous, current ] ]) => {
			changes[prop] = [ changes[prop] ? changes[prop][1] : previous, current ];
		});
		// Finally, trigger events.
		if (!opts.bypassAll) {
			!opts.bypassStylesheet && Player.display.updateCSSVars();
			!opts.silent && Object.entries(changes).forEach(([ prop, [ previous, current ] ]) => {
				Player.trigger('config', prop, current, previous);
				Player.trigger('config:' + prop, current, previous);
			});
			!opts.bypassSave && Player.settings.save();
			!opts.bypassRender && Player.settings.render();
		}
	},

	/**
	 * Persist the player settings.
	 */
	save() {
		try {
			// Filter settings that haven't been modified from the default.
			const settings = settingsConfig.reduce(function _handleSetting(settings, setting) {
				if (setting.settings) {
					setting.settings.forEach(subSetting => _handleSetting(settings, {
						property: setting.property,
						default: setting.default,
						...subSetting
					}));
				} else {
					let userVal = _.get(Player.config, setting.property);
					if (userVal !== undefined && !_.isEqual(userVal, setting.default)) {
						// If the setting is a mixed in object only store items that differ from the default.
						if (setting.mix) {
							userVal = Object.keys(userVal).reduce((changed, key) => {
								if (!_.isEqual(setting.default[key], userVal[key])) {
									changed[key] = userVal[key];
								}
								return changed;
							}, {});
						}
						_.set(settings, setting.property, userVal);
					}
				}
				return settings;
			}, {});
			// Show the playlist or image view on load, whichever was last shown.
			settings.viewStyle = Player.playlist._lastView;
			// Store the player version with the settings.
			settings.VERSION = "3.5.0";
			// Save the settings.
			return GM.setValue('settings', JSON.stringify(settings));
		} catch (err) {
			Player.logError('There was an error saving the sound player settings.', err);
		}
	},

	/**
	 * Run migrations when the player is updated.
	 */
	async migrate(fromVersion) {
		// Fall out if the player hasn't updated.
		if (!fromVersion || fromVersion === "3.5.0") {
			return {};
		}
		const changes = {};
		for (let i = 0; i < migrations.length; i++) {
			let mig = migrations[i];
			if (Player.settings.compareVersions(fromVersion, mig.version) < 0) {
				try {
					console.log('[4chan sound player] Migrate:', mig.name);
					Object.entries(await mig.run()).forEach(([ prop, [ current, previous ] ]) => {
						changes[prop] = [ current, changes[prop] ? changes[prop][1] : previous ];
					});
				} catch (err) {
					console.error(err);
				}
			}
		}
		return changes;
	},

	/**
	 * Compare two semver strings.
	 */
	compareVersions(a, b) {
		const [ aVer, aHash ] = a.split('-');
		const [ bVer, bHash ] = b.split('-');
		const aParts = aVer.split('.');
		const bParts = bVer.split('.');
		for (let i = 0; i < 3; i++) {
			if (+aParts[i] > +bParts[i]) {
				return 1;
			}
			if (+aParts[i] < +bParts[i]) {
				return -1;
			}
		}
		return aHash !== bHash;
	},

	/**
	 * Find a setting in the default configuration.
	 */
	findDefault(property) {
		let settingConfig;
		settingsConfig.find(function (setting) {
			if (setting.property === property) {
				return settingConfig = setting;
			}
			if (setting.settings) {
				let subSetting = setting.settings.find(_setting => _setting.property === property);
				return subSetting && (settingConfig = {
					...setting,
					actions: null,
					settings: null,
					description: null,
					...subSetting,
					isSubSetting: true
				});
			}
			return false;
		});
		return settingConfig || { property };
	},

	/**
	 * Toggle whether the player or settings are displayed.
	 */
	toggle(group) {
		// Blur anything focused so the change is applied.
		let focused = Player.$(`.${ns}-settings :focus`);
		focused && focused.blur();

		// Restore the playlist if there's no group given and the settings are already open.
		if (!group && Player.config.viewStyle === 'settings') {
			return Player.playlist.restore();
		}
		// Switch to the settings view if it's not already showing.
		if (Player.config.viewStyle !== 'settings') {
			Player.display.setViewStyle('settings');
		}
		// Switch to a given group.
		if (group && group !== Player.settings.view) {
			Player.settings.showGroup(group);
		}
	},

	showGroup(group) {
		Player.settings.view = group;
		const currentGroup = Player.$(`.${ns}-settings-group.active`);
		const currentTab = Player.$(`.${ns}-settings-tab.active`);
		currentGroup && currentGroup.classList.remove('active');
		currentTab && currentTab.classList.remove('active');
		Player.$(`.${ns}-settings-group[data-group="${group}"]`).classList.add('active');
		Player.$(`.${ns}-settings-tab[data-group="${group}"]`).classList.add('active');
	},

	async import() {
		const fileInput = _.element('<input type="file">');
		const _import = async () => {
			let config;
			try {
				config = await (await fetch(URL.createObjectURL(fileInput.files[0]))).json();
			} catch (err) {
				Player.logError(`Expected a JSON config file and got ${fileInput.files[0].type}.`, err, 'warning');
			}
			fileInput.removeEventListener('change', _import);
			Player.settings.load(config);
		};
		fileInput.addEventListener('change', _import);
		fileInput.click();
	},

	async export(e) {
		// Use the saved settings to only export non-default user settings. Shift click exports everything for testing.
		const settings = e && e.shiftKey ? JSON.stringify(Player.config, null, 4) : await GM.getValue('settings') || '{}';
		const blob = new Blob([ settings ], { type: 'application/json' });
		const a = _.element(`<a href="${URL.createObjectURL(blob)}" download="4chan-sp-config.json" rel="noopener" target="_blank"></a>`);
		a.click();
		URL.revokeObjectURL(a.href);
	},

	setChangeListeners(target) {
		const settingsContainer = target || Player.$(`.${ns}-settings`);
		settingsContainer.querySelectorAll(`.${ns}-settings input, .${ns}-settings textarea`).forEach(el => {
			el.addEventListener('focusout', Player.settings.handleChange);
		});
		settingsContainer.querySelectorAll(`.${ns}-settings input[type=checkbox], .${ns}-settings select`).forEach(el => {
			el.addEventListener('change', Player.settings.handleChange);
		});
	},

	/**
	 * Handle the user making a change in the settings view.
	 */
	handleChange(e) {
		try {
			const input = e.currentTarget;
			const property = input.getAttribute('data-property');
			if (!property) {
				return;
			}
			let settingConfig = Player.settings.findDefault(property);

			// Get the new value of the setting.
			const currentValue = _.get(Player.config, property);
			let newValue = input[input.getAttribute('type') === 'checkbox' ? 'checked' : 'value'];

			if (settingConfig.parse) {
				newValue = Player.getHandler(settingConfig.parse)(newValue, currentValue, e);
			}

			// Not the most stringent check but enough to avoid some spamming.
			if (!_.isEqual(currentValue, newValue, !settingConfig.looseCompare)) {
				// Update the setting.
				Player.set(property, newValue, { bypassValidation: true, bypassRender: 'self', settingConfig });
			}
		} catch (err) {
			Player.logError('There was an error updating the setting.', err);
		}
	},

	/**
	 * Converts a key event in an input to a string representation set as the input value.
	 */
	handleKeyChange(e) {
		e.preventDefault();
		if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Meta') {
			return;
		}
		e.currentTarget.value = e.which === 8 || e.key.toLowerCase() === 'backspace'
			? ''
			: Player.hotkeys.stringifyKey(e);
	}
};


/***/ }),

/***/ "./src/components/theme/index.js":
/*!***************************************!*\
  !*** ./src/components/theme/index.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var _ = __webpack_require__(/*! ./src/_ */ "./src/_.js");
const selectors = __webpack_require__(/*! ../../selectors */ "./src/selectors.js");
const settingsConfig = __webpack_require__(/*! config */ "./src/config/index.js");

const saveMenuTemplate = __webpack_require__(/*! ./templates/save_theme_menu.tpl */ "./src/components/theme/templates/save_theme_menu.tpl");

module.exports = {
	public: [ 'switch', 'next', 'previous' ],

	savedThemesTemplate: __webpack_require__(/*! ./templates/saved_themes.tpl */ "./src/components/theme/templates/saved_themes.tpl"),
	themeKeybindsTemplate: __webpack_require__(/*! ./templates/theme_keybinds.tpl */ "./src/components/theme/templates/theme_keybinds.tpl"),

	async initialize() {
		// Create the user stylesheet and update it when dependent config values are changed.
		Player.theme.render();
		Player.userTemplate.maintain(Player.theme, 'customCSS');
		Player.theme.validateOrder();
	},

	render() {
		Player.userStylesheet = Player.userStylesheet || _.element('<style id="sound-player-user-css"></style>', document.head);
		Player.userStylesheet.innerHTML = Player.userTemplate.build({
			template: '/* Sounds Player User CSS */\n\n' + Player.config.customCSS,
			sound: Player.playing,
			ignoreButtons: true,
			ignoreDisplayBlocks: true,
			ignoreSoundName: true,
			ignoreVersion: true
		});
	},

	forceBoardTheme() {
		Player.theme.applyBoardTheme({ force: true });
		Player.settings.save();
	},

	/**
	 * Get colors from the board theme.
	 */
	applyBoardTheme(opts = {}) {
		// Create a reply element to gather the style from
		const div = _.element(`<div class="${selectors.styleFetcher}"></div>`, document.body);
		const style = document.defaultView.getComputedStyle(div);

		// Make sure the style is loaded.
		// TODO: This sucks. Should observe the stylesheets for changes to make it work.
		// That would also make theme changes apply without a reload.
		if (style.backgroundColor === 'rgba(0, 0, 0, 0)') {
			return setTimeout(Player.display.applyBoardTheme, 0);
		}
		Object.assign(style, { page_background: window.getComputedStyle(document.body).backgroundColor });

		// Apply the computed style to the color config.
		const colorSettingMap = {
			'colors.text': style.color,
			'colors.background': style.backgroundColor,
			'colors.odd_row': style.backgroundColor,
			'colors.border': style.borderBottomColor,
			// If the border is the same color as the text don't use it as a background color.
			'colors.even_row': style.borderBottomColor === style.color ? style.backgroundColor : style.borderBottomColor,
			// Set this for use in custom css and templates
			'colors.page_background': window.getComputedStyle(document.body).backgroundColor,
			// Playing row is a more saturated and brighter odd row.
			'colors.playing': (() => {
				const oddRowHSV = Player.colorpicker.rgb2hsv(...Player.colorpicker.parseRGB(style.backgroundColor));
				const playingRGB = Player.colorpicker.hsv2rgb(
					oddRowHSV[0],
					Math.min(1, oddRowHSV[1] + 0.25),
					Math.min(1, oddRowHSV[2] + 0.15)
				);
				return `rgb(${playingRGB[0]}, ${playingRGB[1]}, ${playingRGB[2]})`;
			})()
		};
		settingsConfig.find(s => s.property === 'colors').settings.forEach(setting => {
			const updateConfig = opts.force || (setting.default === _.get(Player.config, setting.property));
			colorSettingMap[setting.property] && (setting.default = colorSettingMap[setting.property]);
			updateConfig && Player.set(setting.property, setting.default, { bypassSave: true, bypassRender: true, bypassStylesheet: true });
		});

		// Clean up the element.
		document.body.removeChild(div);

		if (!opts.bypassRender) {
			// Updated the stylesheet.
			Player.display.updateCSSVars();
			// Re-render the settings.
			Player.settings.render();
		}
	},

	/**
	 * Switch to the next theme, wrapping round to the beginning.
	 */
	next() {
		const order = [ 'Default' ].concat(Player.config.savedThemesOrder);
		const cIndex = order.indexOf(Player.config.selectedTheme);
		const next = order[(cIndex + order.length + 1) % order.length];
		Player.theme.switch(next);
	},

	/**
	 * Switch to the previous theme, wrapping round to the end.
	 */
	previous() {
		const order = [ 'Default' ].concat(Player.config.savedThemesOrder);
		const cIndex = order.indexOf(Player.config.selectedTheme);
		const previous = order[(cIndex + order.length - 1) % order.length];
		Player.theme.switch(previous);
	},

	/**
	 * Switch theme.
	 * @param {String} name The name of the theme to switch to.
	 * @param {Object} opts Options passed to player.load
	 */
	switch(name) {
		if (name !== 'Default' && !Player.config.savedThemes[name]) {
			return Player.logError(`Theme '${name}' does not exist.`, null, 'warning');
		}
		Player.set('selectedTheme', name);
		if (name === 'Default') {
			[ 'headerTemplate', 'footerTemplate', 'rowTemplate', 'chanXTemplate', 'customCSS' ].forEach(prop => {
				Player.settings.reset(prop, { bypassRender: true, bypassStylesheet: true });
			});
			Player.settings.render();
			Player.display.updateCSSVars();
		} else {
			Player.settings.load(Player.config.savedThemes[name]);
		}
	},

	/**
	 * Make sure the saved themes order contains all and only the saved themes, without duplicates.
	 */
	validateOrder() {
		const order = Player.config.savedThemesOrder;
		let _i;
		Player.config.savedThemesOrder = order
			.concat(Object.keys(Player.config.savedThemes))
			.filter((name, i) => Player.config.savedThemes[name] && (_i = order.indexOf(name), _i === -1 || _i === i));
	},

	parseSwitch(newValue, bindings, e) {
		bindings = [ ...bindings ];
		const themeName = e.currentTarget.parentNode.dataset.name;
		if (themeName !== 'Default' && !Player.config.savedThemes[themeName]) {
			Player.logError(`No theme named '${themeName}'.`, null, 'warning');
		}
		const keyDef = Player.hotkeys.parseKey(newValue);
		if (!keyDef.key) {
			bindings = bindings.filter(def => def.themeName !== themeName);
		} else {
			let binding = bindings.find(def => def.themeName === themeName);
			binding || bindings.push(binding = { themeName });
			Object.assign(binding, keyDef);
		}
		return bindings;
	},

	handleSwitch(e) {
		Player.theme.switch(e._binding.themeName);
	},

	moveUp: e => Player.theme._swapOrder(e, -1),
	moveDown: e => Player.theme._swapOrder(e, 1),
	_swapOrder(e, dir) {
		const name = e.currentTarget.closest('[data-theme]').dataset.theme;
		const order = Player.config.savedThemesOrder;
		const i = order.indexOf(name);
		if (i + dir >= 0 && i + dir < order.length) {
			[ order[i], order[i + dir] ] = [ order[i + dir], order[i] ];
			Player.$(`[data-theme="${name}"]`).style.order = i + dir;
			Player.$(`[data-theme="${order[i]}"]`).style.order = i;
			Player.settings.set('savedThemes', Player.config.savedThemes, { bypassValidation: true, bypassRender: true });
		}
	},

	remove(e) {
		const themes = Player.config.savedThemes;
		const row = e.currentTarget.closest('[data-theme]');
		const name = row.dataset.theme;
		// Can't delete the default. It's not actually a stored theme.
		if (name === 'Default') {
			return Player.logError('Cannot delete the default theme. You can instead overwrite it.', null, 'warning');
		}
		// For default themes set null so we know to not include them.
		if (Player.settings.findDefault('savedThemes').default[name]) {
			themes[name] = null;
		} else {
			delete themes[name];
		}
		Player.config.savedThemesOrder = Player.config.savedThemesOrder.filter(_name => _name !== name);
		// Remove the row
		row.parentNode.removeChild(row);
		Player.settings.set('savedThemes', themes, { bypassValidation: true, bypassRender: true });
		// Remove hotkey binding
		const bindingIndex = Player.config.hotkey_bindings.switchTheme.find(def => def.themeName === name);
		if (bindingIndex) {
			Player.set('hotkey_bindings.switchTheme', Player.config.hotkey_bindings.switchTheme.splice(bindingIndex, 1), { bypassValidation: true });
		}
	},

	restoreDefaults() {
		Object.assign(Player.config.savedThemes, Player.settings.findDefault('savedThemes').default);
		Player.theme.validateOrder();
		Player.set('savedThemes', Player.config.savedThemes, { bypassValidation: true });
	},

	showSaveOptions(e) {
		const open = Player.$(`.${ns}-theme-save-options`);
		if (open) {
			return Player.container.removeChild(open);
		}
		const el = _.element(saveMenuTemplate({ settingsConfig }), Player.container);
		Player.position.showRelativeTo(el, e.currentTarget);
		Player.$(`.${ns}-save-theme-name`).focus();
	},

	toggleSaveFields() {
		Player.$(`.${ns}-theme-save-options`).classList.toggle('fields-collapsed');
		Player.position.showRelativeTo(Player.$(`.${ns}-theme-save-options`), Player.$('[\\@click^="theme.showSaveOptions"]'));
	},

	toggleSaveButtonText(e) {
		Player.$(`.${ns}-save-theme`).innerHTML = Player.config.savedThemes[e.currentTarget.value] ? 'Update' : 'Create';
	},

	save() {
		const name = Player.$(`.${ns}-save-theme-name`).value;
		if (!name) {
			return Player.logError('A name is required to save a theme.', null, 'warning');
		}
		const checked = Player.$all(`.${ns}-theme-save-options input:checked`);
		const data = [ ...checked ].reduce((data, el) => _.set(data, el.value, _.get(Player.config, el.value)), {});
		Player.config.savedThemes[name] = data;
		Player.config.savedThemesOrder.indexOf(name) === -1 && Player.config.savedThemesOrder.push(name);
		Player.set('savedThemes', Player.config.savedThemes, { bypassValidation: true });
		Player.container.removeChild(Player.$(`.${ns}-theme-save-options`));
	}
};


/***/ }),

/***/ "./src/components/theme/themes.js":
/*!****************************************!*\
  !*** ./src/components/theme/themes.js ***!
  \****************************************/
/***/ ((module) => {

module.exports = {
	'Fixed Playlist': {
		chanXControls: 'always',
		headerTemplate: '<div class="playlist-resizer fcsp-expander" data-direction="w" data-bypass-save="true" data-bypass-position="true" data-allow-offscreen="true"></div>\nrepeat-button shuffle-button hover-images-button playlist-button\nsound-title-marquee\nview-menu-button add-button theme-menu-button close-button',
		rowTemplate: 'sound-title\np:{<img class="fcsp-row-image" src="sound-imageOrThumb">}\n<img class="fcsp-row-thumb" src="sound-thumb">',
		customCSS: '/* Fix the player to the right at full height (minus the 4chan X header) */\n#fcsp-container[data-view-style="playlist"] {\n\t/* Fixed width *\\/\n\twidth: 25rem !important;/**/\n\theight: auto !important;\n\ttop: $config[offsetTop] !important;\n\tright: 0px !important;\n\tbottom: $config[offsetBottom] !important;\n\tleft: auto !important;\n\theight: auto !important;\n\tmax-height: calc(100% - 24px);\n\tbackground: none !important;\n\tborder: none !important;\n}\n\n/* Hide things when the playlist is open */\n/* Hide the image with the playlist open, unless it\'s a webm.\n * To show gifs as well change playing-video to playing-animated. */\n#fcsp-container[data-view-style="playlist"]:not(.playing-video) .fcsp-image-link,/**/ \n#fcsp-container[data-view-style="playlist"] .fcsp-controls,\n#fcsp-container[data-view-style="playlist"] .fcsp-hover-image,\n#fcsp-container[data-view-style="playlist"] .fcsp-footer,\n#fcsp-container[data-view-style="fullscreen"] .fcsp-row-thumb,\n#fcsp-container[data-view-style="fullscreen"] .fcsp-row-image {\n\tdisplay: none !important;\n}\n/* Header is shown with adjustments to handle the changed container style */\n/* Opacity and absolute position are used to auto hide the header */\n#fcsp-container[data-view-style="playlist"] .fcsp-header {\n\tposition: absolute !important;\n\topacity: 0;\n\tz-index: 9;\n\tcursor: inherit;\n\tbackground: $config[colors.background];\n\tborder-width: 0 1px 1px 0;\n\ttransition: all .3s ease;\n}\n#fcsp-container[data-view-style="playlist"] .fcsp-header:hover {\n\topacity: 1;\n}\n\n/* Don\'t show a scrollbar for the playlist for aesthetic reasons */\n#fcsp-container[data-view-style="playlist"] .fcsp-under-image {\n\tscrollbar-width: none;\n}\n#fcsp-container[data-view-style="playlist"] .fcsp-under-image::-webkit-scrollbar {\n\tdisplay: none;\n}\n\n/* Chunky playlist items, with no background and a squared thumbnail image. */\n#fcsp-container[data-view-style="playlist"] .fcsp-list-item {\n\tbackground: none !important;\n\theight: auto !important;\n\tline-height: initial;\n\ttext-align: right;\n\talign-items: center;\n\ttransition: all .5s ease;\n\tfont-size: 1rem;\n\tcolor: $config[colors.text];\n}\n#fcsp-container[data-view-style="playlist"] .fcsp-row-thumb, #fcsp-container[data-view-style="playlist"] .fcsp-row-image {\n\theight: 3rem;\n\twidth: 3rem;\n\tobject-fit: cover;\n\ttransition: all .5s ease;\n}\n/* Show a gradient background and increase the size of list items when you hover over them. */\n#fcsp-container[data-view-style="playlist"] .fcsp-list-item:hover {\n\tfont-size: 1.5rem;\n\tfont-weight: bold;\n\tbackground-image: radial-gradient(circle at -50%, #0000 70%, $config[colors.odd_row]) !important;\n\tcolor: $config[colors.background];\n\t-webkit-text-stroke: 1px black;\n}\n#fcsp-container[data-view-style="playlist"] .fcsp-list-item:hover .fcsp-row-thumb {\n\theight: 4rem;\n\twidth: 4rem;\n}\n#fcsp-container[data-view-style="playlist"] .fcsp-row-image {\n\theight: 7rem;\n\twidth: 7rem;\n}\n/* Add a gradient background to the playing item, make the text bigger, and style the text. */\n#fcsp-container[data-view-style="playlist"] .fcsp-list-item.playing {\n\tbackground-image: radial-gradient(circle at -50%, #0000 70%, $config[colors.playing]) !important;\n\tpadding-left: 2px;\n\tfont-weight: bold;\n\tfont-size: 1.5rem;\n\tcolor: $config[colors.page_background];\n\t-webkit-text-stroke: 1px black;\n\ttext-shadow: 0 0 2px $config[colors.border];\n}\n/* Swap the thumb image with the full image for the playing item. */\n#fcsp-container[data-view-style="playlist"] .fcsp-list-item:not(.playing) .fcsp-row-image {\n\tdisplay: none;\n}\n#fcsp-container[data-view-style="playlist"] .fcsp-list-item.playing .fcsp-row-thumb {\n\tdisplay: none;\n}\n/* Same gradient background style for dragging items. */\n#fcsp-container[data-view-style="playlist"] .fcsp-dragging {\n\tbackground-image: radial-gradient(circle at -50%, #0000 70%, $config[colors.dragging]) !important\n}\n\n/* Add a resizer to the left of the header when the playlist is open. */\n.playlist-resizer {\n\topacity: 1 !important;\n\tmargin: 0 !important;\n\twidth: .25rem !important;\n\theight: auto !important;\n\tbackground-color: $config[colors.border] !important;\n\tposition: absolute;\n\tleft: -.25rem !important;\n\ttop: 0 !important;\n\tbottom: 0 !important;\n\tborder-radius: 100% 0 0 100%;\n\tcursor: ew-resize !important;\n\tdisplay: none;\n\ttransition: all .5s ease;\n}\n.playlist-resizer:hover {\n\twidth: .4rem !important;\n\tleft: -.4rem !important;\n}\n#fcsp-container[data-view-style="playlist"] .playlist-resizer {\n\tdisplay: block;\n}\n/* Hide the default resizers */\n#fcsp-container[data-view-style="playlist"] .fcsp-expander:not(.playlist-resizer) {\n\tdisplay: none;\n}\n'
	}
};


/***/ }),

/***/ "./src/components/threads/index.js":
/*!*****************************************!*\
  !*** ./src/components/threads/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var _ = __webpack_require__(/*! ./src/_ */ "./src/_.js");
const { get } = __webpack_require__(/*! ../../api */ "./src/api.js");

const maxSavedBoards = 10;
const boardsURL = 'https://a.4cdn.org/boards.json';
const catalogURL = 'https://a.4cdn.org/%s/catalog.json';

module.exports = {
	template: __webpack_require__(/*! ./templates/threads.tpl */ "./src/components/threads/templates/threads.tpl"),
	boardsTemplate: __webpack_require__(/*! ./templates/boards.tpl */ "./src/components/threads/templates/boards.tpl"),
	listsTemplate: __webpack_require__(/*! ./templates/list.tpl */ "./src/components/threads/templates/list.tpl"),

	boardList: null,
	soundThreads: null,
	displayThreads: {},
	selectedBoards: Board ? [ Board ] : [ 'a' ],
	showAllBoards: false,

	async initialize() {
		Player.threads.hasParser = is4chan && typeof Parser !== 'undefined';
		// If the native Parser hasn't been intialised chuck customSpoiler on it so we can call it for threads.
		// You shouldn't do things like this. We can fall back to the table view if it breaks though.
		if (Player.threads.hasParser && !Parser.customSpoiler) {
			Parser.customSpoiler = {};
		}

		Player.on('show', Player.threads._initialFetch);
		Player.on('view', Player.threads._initialFetch);
		Player.on('rendered', Player.threads.afterRender);
		Player.on('config:threadsViewStyle', Player.threads.render);
		try {
			const savedBoards = await GM.getValue('threads_board_selection');
			savedBoards && (Player.threads.selectedBoards = savedBoards.split(','));
		} catch (err) {
			// Leave it defaulted to the current board.
		}
	},

	/**
	 * Fetch the threads when the threads view is opened for the first time.
	 */
	_initialFetch() {
		if (Player.container && Player.config.viewStyle === 'threads' && Player.threads.boardList === null) {
			Player.threads.fetchBoards(true);
			Player.off('show', Player.threads._initialFetch);
			Player.off('view', Player.threads._initialFetch);
		}
	},

	render() {
		if (Player.container) {
			_.elementHTML(Player.$(`.${ns}-threads`), Player.threads.template());
			Player.threads.afterRender();
		}
	},

	/**
	 * Render the threads and apply the board styling after the view is rendered.
	 */
	afterRender() {
		const threadList = Player.$(`.${ns}-thread-list`);
		if (threadList) {
			const bodyStyle = document.defaultView.getComputedStyle(document.body);
			threadList.style.background = bodyStyle.backgroundColor;
			threadList.style.backgroundImage = bodyStyle.backgroundImage;
			threadList.style.backgroundRepeat = bodyStyle.backgroundRepeat;
			threadList.style.backgroundPosition = bodyStyle.backgroundPosition;
		}
		Player.threads.renderThreads();
	},

	/**
	 * Render just the threads.
	 */
	renderThreads() {
		if (!Player.threads.hasParser || Player.config.threadsViewStyle === 'table') {
			_.elementHTML(Player.$(`.${ns}-threads-body`), Player.threads.listsTemplate());
		} else {
			try {
				const list = Player.$(`.${ns}-thread-list`);
				list.innerHTML = '';
				for (let board in Player.threads.displayThreads) {
					// Create a board title
					const boardConf = Player.threads.boardList.find(boardConf => boardConf.board === board);
					const boardTitle = `/${boardConf.board}/ - ${boardConf.title}`;
					_.element(`<div class="boardBanner"><div class="boardTitle">${boardTitle}</div></div>`, list);

					// Add each thread for the board
					const threads = Player.threads.displayThreads[board];
					for (let i = 0; i < threads.length; i++) {
						list.appendChild(Parser.buildHTMLFromJSON.call(Parser, threads[i], threads[i].board, true, true));

						// Add a line under each thread
						_.element('<hr style="clear: both">', list);
					}
				}
			} catch (err) {
				Player.logError('Unable to display the threads board view.', err, 'warning');
				// If there was an error fall back to the table view.
				Player.set('threadsViewStyle', 'table');
				Player.renderThreads();
			}
		}
	},

	/**
	 * Render just the board selection.
	 */
	renderBoards() {
		_.elementHTML(Player.$(`.${ns}-thread-board-list`), Player.threads.boardsTemplate());
	},

	/**
	 * Toggle the threads view.
	 */
	toggle() {
		if (Player.config.viewStyle === 'threads') {
			Player.playlist.restore();
		} else {
			Player.display.setViewStyle('threads');
		}
	},

	/**
	 * Switch between showing just the selected boards and all boards.
	 */
	toggleBoardList() {
		Player.threads.showAllBoards = !Player.threads.showAllBoards;
		Player.$(`.${ns}-all-boards-link`).innerHTML = Player.threads.showAllBoards ? 'Selected Only' : 'Show All';
		Player.threads.renderBoards();
	},

	/**
	 * Select/deselect a board.
	 */
	async toggleBoard(board, selected) {
		if (selected) {
			!Player.threads.selectedBoards.includes(board) && Player.threads.selectedBoards.unshift(board);
		} else {
			Player.threads.selectedBoards = Player.threads.selectedBoards.filter(b => b !== board);
		}
		await GM.setValue('threads_board_selection', Player.threads.selectedBoards.slice(0, maxSavedBoards).join(','));
	},

	/**
	 * Fetch the board list from the 4chan API.
	 */
	async fetchBoards(fetchThreads) {
		Player.threads.loading = true;
		Player.threads.render();
		Player.threads.boardList = (await get(boardsURL)).boards;
		if (fetchThreads) {
			Player.threads.fetch();
		} else {
			Player.threads.loading = false;
			Player.threads.render();
		}
	},

	/**
	 * Fetch the catalog for each selected board and search for sounds in OPs.
	 */
	async fetch() {
		Player.threads.loading = true;
		Player.threads.render();
		if (!Player.threads.boardList) {
			try {
				await Player.threads.fetchBoards();
			} catch (err) {
				return Player.logError('Failed fetching the boards list.', err);
			}
		}
		const allThreads = [];
		try {
			await Promise.all(Player.threads.selectedBoards.map(async board => {
				const boardConf = Player.threads.boardList.find(boardConf => boardConf.board === board);
				if (!boardConf) {
					return;
				}
				const pages = boardConf && await get(catalogURL.replace('%s', board));
				(pages || []).forEach(({ page, threads }) => {
					allThreads.push(...threads.map(thread => Object.assign(thread, { board, page, ws_board: boardConf.ws_board })));
				});
			}));

			Player.threads.soundThreads = allThreads.filter(thread => {
				const { sounds } = Player.posts.getSounds(thread.filename, `https://i.4cdn.org/${thread.board}/${thread.tim}${thread.ext}`, thread.no, `https://i.4cdn.org/${thread.board}/${thread.tim}s${thread.ext}`, thread.md5, true);
				return sounds.length;
			});
		} catch (err) {
			Player.logError('Failed searching for sounds threads.', err);
		}
		Player.threads.loading = false;
		Player.threads.filter(Player.$(`.${ns}-threads-filter`).value, true);
		Player.threads.render();
	},

	/**
	 * Apply the filter input to the already fetched threads.
	 */
	filter(search, skipRender) {
		search = search.toLowerCase();
		Player.threads.filterValue = search || '';
		if (Player.threads.soundThreads === null) {
			return;
		}
		Player.threads.displayThreads = Player.threads.soundThreads.reduce((threadsByBoard, thread) => {
			if (!search || thread.sub && thread.sub.toLowerCase().includes(search) || thread.com && thread.com.toLowerCase().includes(search)) {
				threadsByBoard[thread.board] || (threadsByBoard[thread.board] = []);
				threadsByBoard[thread.board].push(thread);
			}
			return threadsByBoard;
		}, {});
		!skipRender && Player.threads.renderThreads();
	}
};


/***/ }),

/***/ "./src/components/tools/create.js":
/*!****************************************!*\
  !*** ./src/components/tools/create.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var _ = __webpack_require__(/*! ./src/_ */ "./src/_.js");
/* provided dependency */ var Icons = __webpack_require__(/*! ./src/icons */ "./src/icons.js");
// Seems to be the cut off point for file names
const maxFilenameLength = 218;

const completeTemplate = __webpack_require__(/*! ./templates/create-complete.tpl */ "./src/components/tools/templates/create-complete.tpl");
const hostsTemplate = __webpack_require__(/*! ./templates/hosts-select.tpl */ "./src/components/tools/templates/hosts-select.tpl");

/**
 * This component is mixed into tools so these function are under `Player.tools`.
 */
const createTool = module.exports = {
	_uploadIdx: 0,
	createTemplate: __webpack_require__(/*! ./templates/create.tpl */ "./src/components/tools/templates/create.tpl"),
	createHostsTemplate: hostsTemplate,
	createCompleteTemplate: completeTemplate,

	/**
	 * Update the view when the hosts are updated.
	 */
	initialize() {
		Player.on('config:uploadHosts', () => Player.$(`.${ns}-create-hosts-container`).innerHTML = hostsTemplate());
		Player.on('config:defaultUploadHost', newValue => Player.$(`.${ns}-create-sound-host`).value = newValue);
		Player.on('rendered', createTool.afterRender);
	},

	/**
	 * Store references to various elements.
	 */
	afterRender() {
		createTool.status = Player.$(`.${ns}-create-sound-status`);
		Player.tools.imgInput = Player.$(`.${ns}-create-sound-img`);
		Player.tools.sndInput = Player.$(`.${ns}-create-sound-snd`);
	},

	/**
	 * Show/hide the "Use webm" checkbox when an image is selected.
	 */
	async handleImageSelect(e) {
		const input = e && e.currentTarget || Player.tools.imgInput;
		const image = input.files[0];
		let placeholder = image.name.replace(/\.[^/.]+$/, '');

		if (await Player.tools.hasAudio(image)) {
			Player.logError('Audio not allowed for the image webm.', null, 'warning');
		}

		// Show the image name as the placeholder for the name input since it's the default
		Player.$(`.${ns}-create-sound-name`).setAttribute('placeholder', placeholder);
	},

	/**
	 * Update the custom file input display when the input changes
	 */
	handleFileSelect(input, files) {
		const container = input.closest(`.${ns}-file-input`);
		const fileText = container.querySelector('.text');
		const fileList = container.querySelector(`.${ns}-file-list`);
		files || (files = [ ...input.files ]);
		container.classList[files.length ? 'remove' : 'add']('placeholder');
		fileText.innerHTML = files.length > 1
			? files.length + ' files'
			: files[0] && files[0].name || '';
		fileList && (_.elementHTML(fileList, files.length < 2 ? '' : files.map((file, i) =>
			`<div class="${ns}-row">
				<div class="${ns}-col ${ns}-truncate-text">${file.name}</div>
				<a class="${ns}-col-auto" @click.prevent="tools.handleFileRemove" href="#" data-idx="${i}">${Icons.close}</a>
			</div>`
		).join('')));
	},

	/**
	 * Handle a file being removed from a multi input
	 */
	handleFileRemove(e) {
		const idx = +e.currentTarget.getAttribute('data-idx');
		const input = e.currentTarget.closest(`.${ns}-file-input`).querySelector('input[type="file"]');
		const dataTransfer = new DataTransfer();
		for (let i = 0; i < input.files.length; i++) {
			i !== idx && dataTransfer.items.add(input.files[i]);
		}
		input.files = dataTransfer.files;
		Player.tools.handleFileSelect(input);
	},

	/**
	 * Show/hide the sound input when "Use webm" is changed.
	 */
	handleWebmSoundChange(e) {
		const sound = Player.tools.sndInput;
		const image = Player.tools.imgInput;
		Player.tools.handleFileSelect(sound, e.currentTarget.checked && [ image.files[0] ]);
	},

	toggleSoundInput(type) {
		const showURL = type === 'url';
		Player.$(`.${ns}-create-sound-snd-url`).closest(`.${ns}-row`).style.display = showURL ? null : 'none';
		Player.$(`.${ns}-create-sound-snd`).closest(`.${ns}-file-input`).style.display = showURL ? 'none' : null;
		Player.tools.useSoundURL = showURL;
	},

	/**
	 * Handle files being dropped on the create sound section.
	 */
	handleCreateSoundDrop(e) {
		const targetInput = e.target.nodeName === 'INPUT' && e.target.getAttribute('type') === 'file' && e.target;
		[ ...e.dataTransfer.files ].forEach(file => {
			const isVideo = file.type.startsWith('video');
			const isImage = file.type.startsWith('image') || file.type === 'video/webm';
			const isSound = file.type.startsWith('audio');
			if (isVideo || isImage || isSound) {
				const input = file.type === 'video/webm' && targetInput
					? targetInput
					: isImage
						? Player.tools.imgInput
						: Player.tools.sndInput;
				const dataTransfer = new DataTransfer();
				if (input.multiple) {
					[ ...input.files ].forEach(file => dataTransfer.items.add(file));
				}
				dataTransfer.items.add(file);
				input.files = dataTransfer.files;
				Player.tools.handleFileSelect(input);
				input === Player.tools.imgInput && Player.tools.handleImageSelect();
				// Make sure sound file input is shown if a sound file is dropped
				if (input === Player.tools.sndInput && Player.tools.useSoundURL) {
					Player.tools.toggleSoundInput('file');
				}
			}
		});
		return false;
	},

	/**
	 * Handle the create button.
	 * Extracts video/audio if required, uploads the sound, and creates an image file names with [sound=url].
	 */
	async handleCreate() {
		// Revoke the URL for an existing created image.
		Player.tools._createdImageURL && URL.revokeObjectURL(Player.tools._createdImageURL);
		Player.tools._createdImage = null;

		createTool.status.style.display = 'block';
		createTool.status.innerHTML = 'Creating sound image';

		Player.$(`.${ns}-create-button`).disabled = true;

		// Gather the input values.
		const host = Player.config.uploadHosts[Player.$(`.${ns}-create-sound-host`).value];
		const useSoundURL = Player.tools.useSoundURL;
		let image = Player.tools.imgInput.files[0];
		let soundURLs = useSoundURL && Player.$(`.${ns}-create-sound-snd-url`).value.split(',').map(v => v.trim()).filter(v => v);
		let sounds = !(Player.$(`.${ns}-use-video`) || {}).checked || !image || !image.type.startsWith('video')
			? [ ...Player.tools.sndInput.files ]
			: image && [ image ];
		const customName = Player.$(`.${ns}-create-sound-name`).value;
		// Only split a given name if there's multiple sounds.
		const names = customName
			? ((soundURLs || sounds).length > 1 ? customName.split(',') : [ customName ]).map(v => v.trim())
			: image && [ image.name.replace(/\.[^/.]+$/, '') ];

		try {
			if (!image) {
				throw new PlayerError('Select an image or webm.', 'warning');
			}

			// No audio allowed for the "image" webm.
			if (image.type.startsWith('video') && await Player.tools.hasAudio(image)) {
				createTool.status.innerHTML += '<br>Audio not allowed for the image webm.'
					+ '<br>Remove the audio from the webm and try again.';
				throw new PlayerError('Audio not allowed for the image webm.', 'warning');
			}

			const soundlessLength = names.join('').length + (soundURLs || sounds).length * 8;
			if (useSoundURL) {
				try {
					// Make sure each url is valid and strip the protocol.
					soundURLs = soundURLs.map(url => new URL(url) && url.replace(/^(https?:)?\/\//, ''));
				} catch (err) {
					throw new PlayerError('The provided sound URL is invalid.', 'warning');
				}
				if (maxFilenameLength < soundlessLength + soundURLs.join('').length) {
					throw new PlayerError('The generated image filename is too long.', 'warning');
				}
			} else {
				if (!sounds || !sounds.length) {
					throw new PlayerError('Select a sound.', 'warning');
				}

				// Check the final filename length if the URL length is known for the host.
				// Limit to 8 otherwise. zz.ht is as small as you're likely to get and that can only fit 8.
				const tooManySounds = host.filenameLength
					? maxFilenameLength < soundlessLength + (host.filenameLength) * sounds.length
					: sounds.length > 8;
				if (tooManySounds) {
					throw new PlayerError('The generated image filename is too long.', 'warning');
				}

				// Check videos have audio.
				sounds = await Promise.all(sounds.map(async sound => {
					if (sound.type.startsWith('video')) {
						if (!await Player.tools.hasAudio(sound)) {
							throw new PlayerError(`The selected video has no audio. (${sound.name})`, 'warning');
						}
					}
					return sound;
				}));

				// Upload the sounds.
				try {
					soundURLs = await Promise.all(sounds.map(async sound => Player.tools.postFile(sound, host)));
				} catch (err) {
					throw new PlayerError('Upload failed.', 'error', err);
				}
			}

			if (!soundURLs.length) {
				throw new PlayerError('No sounds selected.', 'warning');
			}

			// Create a new file that includes [sound=url] in the name.
			let filename = '';
			for (let i = 0; i < soundURLs.length; i++) {
				filename += (names[i] || '') + '[sound=' + encodeURIComponent(soundURLs[i].replace(/^(https?:)?\/\//, '')) + ']';
			}
			const ext = image.name.match(/\.([^/.]+)$/)[1];

			// Keep track of the create image and a url to it.
			Player.tools._createdImage = new File([ image ], filename + '.' + ext, { type: image.type });
			Player.tools._createdImageURL = URL.createObjectURL(Player.tools._createdImage);

			// Complete! with some action links
			_.element(completeTemplate(), createTool.status);
		} catch (err) {
			createTool.status.innerHTML += '<br>Failed! ' + (err instanceof PlayerError ? err.reason : '');
			Player.logError('Failed to create sound image', err);
		}
		Player.$(`.${ns}-create-button`).disabled = false;
	},

	hasAudio(file) {
		if (!file.type.startsWith('audio') && !file.type.startsWith('video')) {
			return false;
		}
		return new Promise((resolve, reject) => {
			const url = URL.createObjectURL(file);
			const video = document.createElement('video');
			video.addEventListener('loadeddata', () => {
				URL.revokeObjectURL(url);
				resolve(video.mozHasAudio || !!video.webkitAudioDecodedByteCount);
			});
			video.addEventListener('error', reject);
			video.src = url;
		});
	},

	/**
	 * Upload the sound file and return a link to it.
	 */
	async postFile(file, host) {
		const idx = Player.tools._uploadIdx++;

		if (!host || host.invalid) {
			throw new PlayerError('Invalid upload host.', 'error');
		}

		const formData = new FormData();
		Object.keys(host.data).forEach(key => {
			if (host.data[key] !== null) {
				formData.append(key, host.data[key] === '$file' ? file : host.data[key]);
			}
		});

		createTool.status.innerHTML += `<br><span class="${ns}-upload-status-${idx}">Uploading ${file.name}</span>`;

		return new Promise((resolve, reject) => {
			GM.xmlHttpRequest({
				method: 'POST',
				url: host.url,
				data: formData,
				responseType: host.responsePath ? 'json' : 'text',
				headers: host.headers,
				onload: async response => {
					if (response.status < 200 || response.status >= 300) {
						return reject(response);
					}
					const responseVal = host.responsePath
						? _.get(response.response, host.responsePath)
						: host.responseMatch
							? (response.responseText.match(new RegExp(host.responseMatch)) || [])[1]
							: response.responseText;
					const uploadedUrl = (host.soundUrl ? host.soundUrl.replace('%s', responseVal) : responseVal).trim();
					Player.$(`.${ns}-upload-status-${idx}`).innerHTML = `Uploaded ${file.name} to <a href="${uploadedUrl}" target="_blank">${uploadedUrl}</a>`;
					resolve(uploadedUrl);
				},
				upload: {
					onprogress: response => {
						const total = response.total > 0 ? response.total : file.size;
						Player.$(`.${ns}-upload-status-${idx}`).innerHTML = `Uploading ${file.name} - ${Math.floor(response.loaded / total * 100)}%`;
					}
				},
				onerror: reject
			});
		});
	},

	/**
	 * Add the created sound image to the player.
	 */
	addCreatedToPlayer() {
		Player.playlist.addFromFiles([ Player.tools._createdImage ]);
	},

	/**
	 * Open the QR window and add the created sound image to it.
	 */
	addCreatedToQR() {
		if (!is4chan) {
			return;
		}
		// Open the quick reply window.
		const qrLink = document.querySelector(isChanX ? '.qr-link' : '.open-qr-link');

		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(Player.tools._createdImage);

		// 4chan X, drop the file on the qr window.
		if (isChanX && qrLink) {
			qrLink.click();
			const event = new CustomEvent('drop', { view: window, bubbles: true, cancelable: true });
			event.dataTransfer = dataTransfer;
			document.querySelector('#qr').dispatchEvent(event);

		// Native, set the file input value. Check for a quick reply
		} else if (qrLink) {
			qrLink.click();
			document.querySelector('#qrFile').files = dataTransfer.files;
		} else {
			document.querySelector('#togglePostFormLink a').click();
			document.querySelector('#postFile').files = dataTransfer.files;
			document.querySelector('.postForm').scrollIntoView();
		}
	}
};


/***/ }),

/***/ "./src/components/tools/download.js":
/*!******************************************!*\
  !*** ./src/components/tools/download.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var _ = __webpack_require__(/*! ./src/_ */ "./src/_.js");
const progressBarsTemplate = __webpack_require__(/*! ./templates/download-progress.tpl */ "./src/components/tools/templates/download-progress.tpl");

const get = (src, opts) => {
	let xhr;
	// Wrap so aborting rejects.
	let p = new Promise((resolve, reject) => {
		xhr = GM.xmlHttpRequest({
			method: 'GET',
			url: src,
			responseType: 'blob',
			onload: response => resolve(response.response),
			onerror: response => reject(response),
			onabort: response => {
				response.aborted = true;
				reject(response);
			},
			...(opts || {})
		});
	});
	if (opts && opts.catch) {
		p = p.catch(opts.catch);
	}
	p.abort = xhr.abort;
	return p;
};

/**
 * This component is mixed into tools so these function are under `Player.tools`.
 */
const downloadTool = module.exports = {
	downloadTemplate: __webpack_require__(/*! ./templates/download.tpl */ "./src/components/tools/templates/download.tpl"),
	_downloading: null,

	/**
	 * Update the view when the hosts are updated.
	 */
	initialize() {
		Player.on('rendered', downloadTool.afterRender);
	},

	/**
	 * Store references to various elements.
	 */
	afterRender() {
		downloadTool.resetDownloadButtons();
	},

	async _handleDownloadCancel() {
		if (Player.tools._downloading) {
			Player.tools._downloadAllCanceled = true;
			Player.tools._downloading.forEach(dls => dls.forEach(dl => dl && dl.abort()));
		}
	},

	async _handleDownload(e) {
		Player.tools._downloadAllCanceled = false;
		e.currentTarget.style.display = 'none';
		Player.$(`.${ns}-download-all-cancel`).style.display = null;

		await Player.tools.downloadThread({
			includeImages: Player.$('.download-all-images').checked,
			includeSounds: Player.$('.download-all-audio').checked,
			ignoreDownloaded: Player.$('.download-all-ignore-downloaded').checked,
			maxSounds: +Player.$('.download-all-max-sounds').value || 0,
			concurrency: Math.max(1, +Player.$('.download-all-concurrency').value || 1),
			compression: Math.max(0, Math.min(+Player.$('.download-all-compression').value || 0, 9)),
			status: Player.$(`.${ns}-download-all-status`)
		}).catch(() => { /* it's logged */ });

		Player.tools.resetDownloadButtons();
	},

	resetDownloadButtons() {
		Player.$(`.${ns}-download-all-start`).style.display = Player.tools._downloading ? 'none' : null;
		Player.$(`.${ns}-download-all-cancel`).style.display = Player.tools._downloading ? null : 'none';
		Player.$(`.${ns}-download-all-save`).style.display = Player.tools.threadDownloadBlob ? null : 'none';
		Player.$(`.${ns}-download-all-clear`).style.display = Player.tools.threadDownloadBlob ? null : 'none';
		Player.$(`.${ns}-ignore-downloaded`).style.display = Player.sounds.some(s => s.downloaded) ? null : 'none';
	},

	/**
	 * Trigger a download for a file using GM.xmlHttpRequest to avoid cors issues.
	 *
	 * @param {String} src URL of the field to download.
	 * @param {String} name Name to save the file as.
	 */
	async download(src, name) {
		try {
			const blob = await get(src);
			const a = _.element(`<a href="${URL.createObjectURL(blob)}" download="${_.escAttr(name)}" rel="noopener" target="_blank"></a>`);
			a.click();
			URL.revokeObjectURL(a.href);
		} catch (err) {
			Player.logError('There was an error downloading.', err, 'warning');
		}
	},

	/**
	 * Download the images and/or sounds in the thread as zip file.
	 *
	 * @param {Boolean} includeImages Whether images should be included in the download.
	 * @param {Boolean} includeSounds Whether audio files should be included in the download.
	 * @param {Boolean} ignoreDownloaded Whether sounds previously downloaded should be omitted from the download.
	 * @param {Boolean} maxSounds The maximum number of sounds to download.
	 * @param {Boolean} concurrency How many sounds can be download at the same time.
	 * @param {Boolean} compression Compression level.
	 * @param {Element} [status] Element in which to display the ongoing status of the download.
	 */
	async downloadThread({ includeImages, includeSounds, ignoreDownloaded, maxSounds, concurrency, compression, status }) {
		const zip = new JSZip();

		!(maxSounds > 0) && (maxSounds = Infinity);
		const toDownload = Player.sounds.filter(s => s.post && (!ignoreDownloaded || !s.downloaded)).slice(0, maxSounds);
		const count = toDownload.length;

		status && (status.style.display = 'block');

		if (!count || !includeImages && !includeSounds) {
			return status && (status.innerHTML = 'Nothing to download.');
		}

		Player.tools._downloading = [];
		status && (status.innerHTML = `Downloading ${count} sound images.<br><br>
			This may take a while. You can leave it running in the background, but if you background the tab your browser will slow it down.
			You'll be prompted to download the zip file once complete.<br><br>`);

		const elementsArr = new Array(concurrency).fill(0).map(() => {
			// Show currently downloading files with progress bars.
			const el = status && _.element(progressBarsTemplate({ includeSounds, includeImages }), status);
			const dlRef = [];
			Player.tools._downloading.push(dlRef);
			// Allow each download to be canceled individually. In case there's a huge download you don't want to include.
			el && (el.querySelector(`.${ns}-cancel-download`).onclick = () => dlRef.forEach(dl => dl && dl.abort()));
			return {
				dlRef,
				el,
				status: el && el.querySelector(`.${ns}-current-status`),
				image: el && el.querySelector(`.${ns}-image-bar`),
				sound: el && el.querySelector(`.${ns}-sound-bar`)
			};
		});

		let running = 0;

		// Download arg builder. Update progress bars, and catch errors to log and continue.
		const getArgs = (data, sound, type) => ({
			responseType: 'arraybuffer',
			onprogress: data[type] && (rsp => data[type].style.width = ((rsp.loaded / rsp.total) * 100) + '%'),
			catch: err => {
				if (err.aborted) {
					return 'aborted';
				}
				if (!err.aborted && !Player.tools._downloadAllCanceled) {
					console.error('[4chan sounds player] Download failed', err);
					status && _.element(`<p>Failed to download ${sound.title} ${type}!</p>`, elementsArr[0].el, 'beforebegin');
				}
			}
		});

		await Promise.all(elementsArr.map(async function downloadNext(data) {
			const sound = toDownload.shift();
			// Fall out if all downlads were canceled.
			if (!sound || Player.tools._downloadAllCanceled) {
				data.el && status.removeChild(data.el);
				return;
			}
			const i = ++running;
			// Show the name and reset the progress bars.
			if (data.el) {
				data.status.textContent = `${i} / ${count}: ${sound.title}`;
				data.image.style.width = data.sound.style.width = '0';
			}

			// Create a folder per post if images and sounds are being downloaded.
			const prefix = includeImages && includeSounds ? sound.post + '/' : '';
			// Download image and sound as selected.
			const [ imageRsp, soundRsp ] = await Promise.all([
				data.dlRef[0] = includeImages && get(sound.image, getArgs(data, sound, 'image')),
				data.dlRef[1] = includeSounds && get(sound.src, getArgs(data, sound, 'sound'))
			]);

			// No post-handling if the whole download was canceled.
			if (!Player.tools._downloadAllCanceled) {
				if (imageRsp === 'aborted' || soundRsp === 'aborted') {
					// Show which sounds were individually aborted.
					status && _.element(`<p>Skipped ${sound.title}.</p>`, elementsArr[0].el, 'beforebegin');
				} else {
					// Add the downloaded files to the zip.
					imageRsp && zip.file(`${prefix}${sound.filename}`, imageRsp);
					soundRsp && zip.file(`${prefix}${encodeURIComponent(sound.src)}`, soundRsp);
					// Flag the sound as downloaded.
					sound.downloaded = true;
				}
			}
			// Move on to the next sound.
			await downloadNext(data);
		}));

		// Show where we canceled at, if we did cancel.
		Player.tools._downloadAllCanceled && _.element(`<span>Canceled at ${running} / ${count}.`, status);
		// Generate the zip file.
		const zipProgress = status && _.element('<div>Generating zip file...</div>', status);
		try {
			const zipOptions = {
				type: 'blob',
				compression: compression ? 'DEFLATE' : 'STORE',
				compressionOptions: {
					level: compression
				}
			};
			Player.tools.threadDownloadBlob = await zip.generateAsync(zipOptions, metadata => {
				status && (zipProgress.textContent = `Generating zip file (${metadata.percent.toFixed(2)}%)...`);
			});

			// Update the display and prompt to download.
			status && _.element('<span>Complete!', status);
			Player.tools.saveThreadDownload();
		} catch (err) {
			console.error('[4chan sounds player] Failed to generate zip', err);
			status && (zipProgress.textContent = 'Failed to generate zip file!');
		}
		Player.tools._downloading = null;
		Player.tools.resetDownloadButtons();
	},

	saveThreadDownload() {
		const threadNum = Thread || '-';
		const a = _.element(`<a href="${URL.createObjectURL(Player.tools.threadDownloadBlob)}" download="sounds-thread-${Board}-${threadNum}" rel="noopener" target="_blank"></a>`);
		a.click();
		URL.revokeObjectURL(a.href);
	},

	clearDownloadBlob() {
		delete Player.tools.threadDownloadBlob;
		Player.tools.resetDownloadButtons();
	}
};


/***/ }),

/***/ "./src/components/tools/index.js":
/*!***************************************!*\
  !*** ./src/components/tools/index.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var _ = __webpack_require__(/*! ./src/_ */ "./src/_.js");
const createTool = __webpack_require__(/*! ./create */ "./src/components/tools/create.js");
const downloadTool = __webpack_require__(/*! ./download */ "./src/components/tools/download.js");

module.exports = {
	template: __webpack_require__(/*! ./templates/tools.tpl */ "./src/components/tools/templates/tools.tpl"),

	...createTool,
	...downloadTool,

	initialize() {
		createTool.initialize();
		downloadTool.initialize();
	},

	render() {
		_.elementHTML(Player.$(`.${ns}-tools`).innerHTML, Player.tools.template());
		createTool.afterRender();
		downloadTool.afterRender();
	},

	toggle() {
		if (Player.config.viewStyle === 'tools') {
			Player.playlist.restore();
		} else {
			Player.display.setViewStyle('tools');
		}
	},

	/**
	 * Encode the decoded input.
	 */
	handleDecoded(e) {
		Player.$(`.${ns}-encoded-input`).value = encodeURIComponent(e.currentTarget.value);
	},

	/**
	 * Decode the encoded input.
	 */
	handleEncoded(e) {
		Player.$(`.${ns}-decoded-input`).value = decodeURIComponent(e.currentTarget.value);
	}
};


/***/ }),

/***/ "./src/components/user-template/buttons.js":
/*!*************************************************!*\
  !*** ./src/components/user-template/buttons.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Icons = __webpack_require__(/*! ./src/icons */ "./src/icons.js");
/* provided dependency */ var _ = __webpack_require__(/*! ./src/_ */ "./src/_.js");
const { postIdPrefix } = __webpack_require__(/*! ../../selectors */ "./src/selectors.js");

module.exports = [
	{
		property: 'repeat',
		tplName: 'repeat',
		action: 'playlist.toggleRepeat',
		actionMods: '.prevent',
		values: {
			all: { attrs: [ 'title="Repeat All"' ], icon: Icons.arrowRepeat },
			one: { attrs: [ 'title="Repeat One"' ], icon: Icons.arrowClockwise },
			none: { attrs: [ 'title="No Repeat"' ], class: 'muted', icon: Icons.arrowRepeat }
		}
	},
	{
		property: 'shuffle',
		tplName: 'shuffle',
		action: 'playlist.toggleShuffle',
		actionMods: '.prevent',
		values: {
			true: { attrs: [ 'title="Shuffled"' ], icon: Icons.shuffle },
			false: { attrs: [ 'title="Ordered"' ], class: 'muted', icon: Icons.shuffle }
		}
	},
	{
		property: 'viewStyle',
		tplName: 'playlist',
		action: 'playlist.toggleView',
		values: {
			default: { attrs: [ 'title="Player"' ], class: 'muted', icon: () => (Player.playlist._lastView === 'playlist' ? Icons.arrowsExpand : Icons.arrowsCollapse) },
			playlist: { attrs: [ 'title="Hide Playlist"' ], icon: Icons.arrowsExpand },
			image: { attrs: [ 'title="Show Playlist"' ], icon: Icons.arrowsCollapse }
		}
	},
	{
		property: 'hoverImages',
		tplName: 'hover-images',
		action: 'playlist.toggleHoverImages',
		values: {
			true: { attrs: [ 'title="Hover Images Enabled"' ], icon: Icons.image },
			false: { attrs: [ 'title="Hover Images Disabled"' ], class: 'muted', icon: Icons.image }
		}
	},
	{
		tplName: 'add',
		action: 'playlist.selectLocalFiles',
		actionMods: '.prevent',
		icon: Icons.plus,
		attrs: [ 'title="Add local files"' ]
	},
	{
		tplName: 'reload',
		action: 'posts.refresh',
		actionMods: '.prevent',
		icon: Icons.reboot,
		attrs: [ 'title="Reload the playlist"' ]
	},
	{
		property: 'viewStyle',
		tplName: 'settings',
		action: 'settings.toggle()',
		actionMods: '.prevent',
		icon: Icons.gear,
		attrs: [ 'title="Settings"' ],
		values: {
			default: { class: 'muted' },
			settings: { }
		}
	},
	{
		property: 'viewStyle',
		tplName: 'threads',
		action: 'threads.toggle',
		actionMods: '.prevent',
		icon: Icons.search,
		attrs: [ 'title="Threads"' ],
		values: {
			default: { class: 'muted' },
			threads: { }
		}
	},
	{
		property: 'viewStyle',
		tplName: 'tools',
		action: 'tools.toggle',
		actionMods: '.prevent',
		icon: Icons.tools,
		attrs: [ 'title="Tools"' ],
		values: {
			default: { class: 'muted' },
			tools: { }
		}
	},
	{
		tplName: 'close',
		action: 'hide',
		actionMods: '.prevent',
		icon: Icons.close,
		attrs: [ 'title="Hide the player"' ]
	},
	{
		tplName: 'playing',
		requireSound: true,
		action: 'playlist.scrollToPlaying("center")',
		actionMods: '.prevent',
		icon: Icons.musicNoteList,
		attrs: [ 'title="Scroll the playlist to the currently playing sound."' ]
	},
	{
		tplName: 'post',
		requireSound: true,
		icon: Icons.chatRightQuote,
		showIf: data => data.sound.post,
		attrs: data => [
			`href=${'#' + postIdPrefix + data.sound.post}`,
			'title="Jump to the post for the current sound"'
		]
	},
	{
		tplName: 'image',
		requireSound: true,
		icon: Icons.image,
		attrs: data => [
			`href=${data.sound.image}`,
			'title="Open the image in a new tab"',
			'target="_blank"'
		]
	},
	{
		tplName: 'sound',
		requireSound: true,
		icon: Icons.soundwave,
		attrs: data => [
			`href=${data.sound.src}`,
			'title="Open the sound in a new tab"',
			'target="_blank"'
		]
	},
	{
		tplName: /dl-(image|sound)/,
		requireSound: true,
		action: data => {
			const src = data.sound[data.tplNameMatch[1] === 'image' ? 'image' : 'src'];
			const name = data.sound[data.tplNameMatch[1] === 'image' ? 'filename' : 'name'] || '';
			return `tools.download("${_.escAttr(src, true)}", "${_.escAttr(name, true)}")`;
		},
		actionMods: '.prevent',
		icon: data => data.tplNameMatch[1] === 'image'
			? Icons.fileEarmarkImage
			: Icons.fileEarmarkMusic,
		attrs: data => [
			`title="${data.tplNameMatch[1] === 'image' ? 'Download the image with the original filename' : 'Download the sound'}"`
		]
	},
	{
		tplName: /filter-(image|sound)/,
		requireSound: true,
		action: data => `playlist.addFilter("${data.tplNameMatch[1] === 'image' ? data.sound.imageMD5 : data.sound.src.replace(/^(https?:)?\/\//, '')}")`,
		actionMods: '.prevent',
		icon: Icons.filter,
		showIf: data => data.tplNameMatch[1] === 'sound' || data.sound.imageMD5,
		attrs: data => [
			`title="Add the ${data.tplNameMatch[1] === 'image' ? 'image MD5' : 'sound URL'} to the filters."`,
		]
	},
	{
		tplName: 'remove',
		requireSound: true,
		action: data => `remove("${data.sound.id}")`,
		icon: Icons.trash,
		attrs: data => [
			'title="Filter the image."',
			`data-id="${data.sound.id}"`
		]
	},
	{
		tplName: 'menu',
		requireSound: true,
		class: `${ns}-item-menu-button`,
		action: data => `playlist.handleItemMenu($event, "${data.sound.id}")`,
		actionMods: '.prevent.stop',
		icon: Icons.chevronDown
	},
	{
		tplName: 'view-menu',
		action: 'display.showMenu($event.currentTarget, "views")',
		actionMods: '.prevent.stop',
		icon: Icons.chevronDown,
		attrs: [ 'title="Switch View"' ]
	},
	{
		tplName: 'theme-menu',
		action: 'display.showMenu($event.currentTarget, "themes")',
		actionMods: '.prevent.stop',
		icon: Icons.layoutTextWindow,
		attrs: [ 'title="Switch Theme"' ]
	},
	{
		tplName: 'untz',
		action: 'display.untz',
		icon: Icons.speaker,
		attrs: [ 'title="UNTZ"' ]
	}
];


/***/ }),

/***/ "./src/components/user-template/index.js":
/*!***********************************************!*\
  !*** ./src/components/user-template/index.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var _ = __webpack_require__(/*! ./src/_ */ "./src/_.js");
const buttons = __webpack_require__(/*! ./buttons */ "./src/components/user-template/buttons.js");

// Regex for replacements
const playingRE = /p: ?{([^}]*)}/g;
const hoverRE = /h: ?{([^}]*)}/g;
// Create a regex to find buttons/links, ignore matches if the button/link name is itself a regex.
const tplNames = buttons.map(conf => `${conf.tplName.source && conf.tplName.source.replace(/\(/g, '(?:') || conf.tplName}`);
const buttonRE = new RegExp(`(${tplNames.join('|')})-(?:button|link)(?:\\:"([^"]+?)")?`, 'g');
const soundTitleRE = /sound-title/g;
const soundTitleMarqueeRE = /sound-title-marquee/g;
const soundIndexRE = /sound-index/g;
const soundCountRE = /sound-count/g;
const soundPropRE = /sound-(src|id|name|post|imageOrThumb|image|thumb|filename|imageMD5)(-esc)?/g;
const soundFilterCountRE = /filtered-count/g;
const configRE = /\$config\[([^\]]+)\]/g;

// Hold information on which config values components templates depend on.
const componentDeps = [ ];

module.exports = {
	buttons,

	initialize() {
		Player.on('config', Player.userTemplate._handleConfig);
		Player.on('playsound', () => Player.userTemplate._handleEvent('playsound'));
		[ 'add', 'remove', 'order', 'show', 'hide', 'stop' ].forEach(evt => {
			Player.on(evt, Player.userTemplate._handleEvent.bind(null, evt));
		});
	},

	/**
	 * Build a user template.
	 */
	build(data) {
		const outerClass = data.outerClass || '';
		const name = data.sound && data.sound.title || data.defaultName;
		let _data = { ...data };

		const _confFuncOrText = v => (typeof v === 'function' ? v(_data) : v);

		// Apply common template replacements, unless they are opted out.
		let html = data.template.replace(configRE, (...args) => _.get(Player.config, args[1]));
		!data.ignoreDisplayBlocks && (html = html
			.replace(playingRE, Player.playing && Player.playing === data.sound ? '$1' : '')
			.replace(hoverRE, `<span class="${ns}-hover-display ${outerClass}">$1</span>`));
		!data.ignoreButtons && (html = html.replace(buttonRE, function (full, type, text) {
			let buttonConf = Player.userTemplate._findButtonConf(type);
			_data.tplNameMatch = buttonConf.tplNameMatch;
			if (buttonConf.requireSound && !data.sound || buttonConf.showIf && !buttonConf.showIf(_data)) {
				return '';
			}
			// If the button config has sub values then extend the base config with the selected sub value.
			// Which value to use is taken from the `property` in the base config of the player config.
			// This gives us different state displays.
			if (buttonConf.values) {
				let topConf = buttonConf;
				const valConf = buttonConf.values[_.get(Player.config, buttonConf.property)] || buttonConf.values[Object.keys(buttonConf.values)[0]];
				buttonConf = { ...topConf, ...valConf };
			}
			const attrs = [ ...(_confFuncOrText(buttonConf.attrs) || []) ];
			attrs.some(attr => attr.startsWith('href')) || attrs.push('href="javascript:;"');
			(buttonConf.class || outerClass) && attrs.push(`class="${buttonConf.class || ''} ${outerClass || ''}"`);
			buttonConf.action && attrs.push(`@click${buttonConf.actionMods || ''}='${_confFuncOrText(buttonConf.action)}'`);

			// Replace spaces with non breaking spaces in user text to prevent collapsing.
			return `<a ${attrs.join(' ')}>${text && text.replace(/ /g, ' ') || _confFuncOrText(buttonConf.icon) || _confFuncOrText(buttonConf.text)}</a>`;
		}));
		!data.ignoreSoundName && (html = html
			.replace(soundTitleMarqueeRE, name ? `<div class="${ns}-col ${ns}-truncate-text" style="margin: 0 .5rem; text-overflow: clip;"><span title="${name}" class="${ns}-title-marquee" data-location="${data.location || ''}">${name}</span></div>` : '')
			.replace(soundTitleRE, name ? `<div class="${ns}-col ${ns}-truncate-text" style="margin: 0 .5rem"><span title="${name}">${name}</span></div>` : ''));
		!data.ignoreSoundProperties && (html = html
			.replace(soundPropRE, (...args) => data.sound ? (args[2] ? _.escAttr(data.sound[args[1]], true) : data.sound[args[1]]) : '')
			.replace(soundIndexRE, data.sound ? Player.sounds.indexOf(data.sound) + 1 : 0)
			.replace(soundCountRE, Player.sounds.length)
			.replace(soundFilterCountRE, Player.filteredSounds.length));
		!data.ignoreVersion && (html = html.replace(/%v/g, "3.5.0"));

		// Apply any specific replacements
		if (data.replacements) {
			for (let k of Object.keys(data.replacements)) {
				html = html.replace(new RegExp(k, 'g'), data.replacements[k]);
			}
		}

		return html;
	},

	/**
	 * Sets up a components to render when the template or values within it are changed.
	 */
	maintain(component, property, alwaysRenderConfigs = [], alwaysRenderEvents = []) {
		componentDeps.push({
			component,
			property,
			...Player.userTemplate.findDependencies(property, null),
			alwaysRenderConfigs,
			alwaysRenderEvents
		});
	},

	/**
	 * Find all the config dependent values in a template.
	 */
	findDependencies(property, template) {
		template || (template = _.get(Player.config, property));
		// Figure out what events should trigger a render.
		const events = [];

		// add/remove should render templates showing the count.
		// playsound/stop should render templates either showing properties of the playing sound or dependent on something playing.
		// order should render templates showing a sounds index.
		const hasCount = soundCountRE.test(template);
		const hasSoundProp = soundTitleRE.test(template) || soundPropRE.test(template);
		const hasIndex = soundIndexRE.test(template);
		const hasPlaying = playingRE.test(template);
		const hasFilterCount = soundFilterCountRE.test(template);
		hasCount && events.push('add', 'remove');
		// The row template handles this itself to avoid a full playlist render.
		property !== 'rowTemplate' && (hasSoundProp || hasIndex || hasPlaying) && events.push('playsound', 'stop');
		hasIndex && events.push('order');
		hasFilterCount && events.push('filters-applied');

		// Find which buttons the template includes that are dependent on config values.
		const config = [];
		let match;
		while ((match = buttonRE.exec(template)) !== null) {
			// If user text is given then the display doesn't change.
			if (!match[2]) {
				let buttonConf = Player.userTemplate._findButtonConf(match[1]);
				if (buttonConf.property) {
					config.push(buttonConf.property);
				}
			}
		}
		// Find config references.
		while ((match = configRE.exec(template)) !== null) {
			config.push(match[1]);
		}

		return { events, config };
	},

	/**
	 * When a config value is changed check if any component dependencies are affected.
	 */
	_handleConfig(property, value) {
		// Check if a template for a components was updated.
		componentDeps.forEach(depInfo => {
			if (depInfo.property === property) {
				Object.assign(depInfo, Player.userTemplate.findDependencies(property, value));
				depInfo.component.render();
			}
		});
		// Check if any components are dependent on the updated property.
		componentDeps.forEach(depInfo => {
			if (depInfo.alwaysRenderConfigs.includes(property) || depInfo.config.includes(property)) {
				depInfo.component.render();
			}
		});
	},

	/**
	 * When a player event is triggered check if any component dependencies are affected.
	 */
	_handleEvent(type) {
		// Check if any components are dependent on the updated property.
		componentDeps.forEach(depInfo => {
			if (depInfo.alwaysRenderEvents.includes(type) || depInfo.events.includes(type)) {
				depInfo.component.render();
			}
		});
	},

	_findButtonConf: type => {
		let tplNameMatch;
		let buttonConf = buttons.find(conf => {
			if (conf.tplName === type) {
				return tplNameMatch = [ type ];
			}
			return tplNameMatch = conf.tplName.test && type.match(conf.tplName);
		});
		return buttonConf && { ...buttonConf, tplNameMatch };
	}
};


/***/ }),

/***/ "./src/config/display.js":
/*!*******************************!*\
  !*** ./src/config/display.js ***!
  \*******************************/
/***/ ((module) => {

module.exports = [
	{
		property: 'autoshow',
		default: true,
		title: 'Autoshow',
		description: 'Automatically show the player when the thread contains sounds.',
		displayGroup: 'Display'
	},
	{
		property: 'pauseOnHide',
		default: true,
		title: 'Pause On Hide',
		description: 'Pause the player when it\'s hidden.',
		displayGroup: 'Display',
		allowInTheme: true
	},
	{
		property: 'showUpdatedNotification',
		default: true,
		title: 'Show Update Notifications',
		description: 'Show notifications when the player is successfully updated.',
		displayGroup: 'Display'
	},
	{
		property: 'hoverImages',
		title: 'Hover Images',
		default: false,
		allowInTheme: true
	},
	{
		title: 'Controls',
		displayGroup: 'Display',
		allowInTheme: true,
		settings: [
			{
				property: 'preventControlWrapping',
				title: 'Prevent Wrapping',
				description: 'Hide controls to prevent wrapping when the player is too small',
				default: true
			},
			{
				property: 'controlsHideOrder',
				title: 'Hide Order',
				description: 'Order controls are hidden in to prevent wrapping. '
					+ 'Available controls are '
					+ '<pre class="option">previous</pre> '
					+ '<pre class="option">next</pre> '
					+ '<pre class="option">seek-bar</pre> '
					+ '<pre class="option">time</pre> '
					+ '<pre class="option">duration</pre> '
					+ '<pre class="option">volume</pre> '
					+ '<pre class="option">volume-button</pre> '
					+ '<pre class="option">volume-bar</pre> '
					+ 'and <pre class="option">fullscreen</pre>.',
				default: [ 'fullscreen', 'duration', 'volume-bar', 'seek-bar', 'time', 'previous' ],
				displayMethod: 'textarea',
				inlineTextarea: true,
				format: v => v.join('\n'),
				parse: v => v.split(/\s+/)
			}
		]
	},
	{
		title: 'Minimised Display',
		description: 'Optional displays for when the player is minimised.',
		displayGroup: 'Display',
		allowInTheme: true,
		settings: [
			{
				property: 'pip',
				title: 'Thumbnail',
				description: 'Display a fixed thumbnail of the playing sound in the bottom right of the thread.',
				default: true
			},
			{
				property: 'maxPIPWidth',
				title: 'Max Width',
				description: 'Maximum width for the thumbnail.',
				default: '150px',
				updateCSSVars: true
			},
			{
				property: 'chanXControls',
				title: '4chan X Header Controls',
				description: 'Show playback controls in the 4chan X header. The display can be customised in Settings>Theme.',
				displayMethod: isChanX || null,
				default: 'closed',
				options: {
					always: 'Always',
					closed: 'Only with the player closed',
					never: 'Never'
				}
			}
		]
	},
	{
		title: 'Thread',
		displayGroup: 'Display',
		allowInTheme: true,
		settings: [
			{
				property: 'autoScrollThread',
				description: 'Automatically scroll the thread to posts as sounds play.',
				title: 'Auto Scroll',
				default: false
			},
			{
				property: 'limitPostWidths',
				description: 'Limit the width of posts so they aren\'t hidden under the player.',
				title: 'Limit Post Widths',
				default: true
			},
			{
				property: 'minPostWidth',
				title: 'Minimum Width',
				default: '50%'
			}
		]
	},
	{
		property: 'threadsViewStyle',
		title: 'Threads View',
		description: 'How threads in the threads view are listed.',
		settings: [ {
			title: 'Display',
			default: 'table',
			options: {
				table: 'Table',
				board: 'Board'
			}
		} ]
	},
	{
		title: 'Colors',
		displayGroup: 'Display',
		property: 'colors',
		updateCSSVars: true,
		allowInTheme: true,
		class: `${ns}-colorpicker-input`,
		attrs: '@focusout.stop.prevent="colorpicker._updatePreview" @click="colorpicker.create"',
		displayMethod: ({ value, attrs }) => `<div class="${ns}-col">
				<input type="text" ${attrs} value="${value}">
				<div class="${ns}-cp-preview" style="background: ${value}" @click.stop.prevent="colorpicker.create"></div>
			</div>`,
		actions: [
			{ title: 'Match Theme', handler: 'theme.forceBoardTheme', mods: '.prevent' }
		],
		// These colors will be overriden with the theme defaults at initialization. They're set to yotsuba b here.
		settings: [
			{
				property: 'colors.text',
				default: '#000000',
				title: 'Text'
			},
			{
				property: 'colors.background',
				default: '#d6daf0',
				title: 'Background'
			},
			{
				property: 'colors.border',
				default: '#b7c5d9',
				title: 'Border'
			},
			{
				property: 'colors.odd_row',
				default: '#d6daf0',
				title: 'Odd Row',
			},
			{
				property: 'colors.even_row',
				default: '#b7c5d9',
				title: 'Even Row'
			},
			{
				property: 'colors.playing',
				default: '#98bff7',
				title: 'Playing Row'
			},
			{
				property: 'colors.dragging',
				default: '#c396c8',
				title: 'Dragging Row'
			},
			{
				property: 'colors.controls_background',
				default: '#3f3f44',
				title: 'Controls Background',
				description: 'The controls container element background.',
				actions: [ { title: 'Reset', handler: 'settings.reset("colors.controls_background")', mods: '.prevent' } ],
			},
			{
				property: 'colors.controls_inactive',
				default: '#FFFFFF',
				title: 'Control Items',
				description: 'The playback controls and played bar.',
				actions: [ { title: 'Reset', handler: 'settings.reset("colors.controls_inactive")', mods: '.prevent' } ],
			},
			{
				property: 'colors.controls_active',
				default: '#00b6f0',
				title: 'Focused Control Items',
				description: 'The control items when hovered.',
				actions: [ { title: 'Reset', handler: 'settings.reset("colors.controls_active")', mods: '.prevent' } ],
			},
			{
				property: 'colors.controls_empty_bar',
				default: '#131314',
				title: 'Volume/Seek Bar Background',
				decscription: 'The background of the volume and seek bars.',
				actions: [ { title: 'Reset', handler: 'settings.reset("colors.controls_empty_bar")', mods: '.prevent' } ],
			},
			{
				property: 'colors.controls_loaded_bar',
				default: '#5a5a5b',
				title: 'Loaded Bar Background',
				description: 'The loaded bar within the seek bar.',
				actions: [ { title: 'Reset', handler: 'settings.reset("colors.controls_loaded_bar")', mods: '.prevent' } ],
			},
			// Not configurable but here for access in templates.
			{
				property: 'colors.page_background',
				default: 'rgb(238, 242, 255)',
				displayMethod: null,
				allowInTheme: false
			}
		]
	}
];


/***/ }),

/***/ "./src/config/filter.js":
/*!******************************!*\
  !*** ./src/config/filter.js ***!
  \******************************/
/***/ ((module) => {

module.exports = [
	{
		property: 'addWebm',
		title: 'Include WebM',
		description: 'Whether to add all WebM files regardless of a sound filename.',
		default: 'soundBoards',
		displayGroup: 'Filter',
		options: {
			always: 'Always',
			soundBoards: 'Boards with sound',
			never: 'Never'
		}
	},
	{
		property: 'allow',
		title: 'Allowed Hosts',
		description: 'Which domains sounds are allowed to be loaded from.',
		default: [
			'4cdn.org',
			'catbox.moe',
			'dmca.gripe',
			'lewd.se',
			'pomf.cat',
			'zz.ht',
			'zz.fo'
		],
		actions: [ { title: 'Reset', handler: 'settings.reset("allow")', mods: '.prevent' } ],
		displayGroup: 'Filter',
		displayMethod: 'textarea',
		attrs: 'rows=10',
		format: v => v.join('\n'),
		parse: v => v.split('\n')
	},
	{
		property: 'filters',
		default: [ '# Image MD5 or sound URL' ],
		title: 'Filters',
		description: 'List of URLs or image MD5s to filter, one per line.\nLines starting with a # will be ignored.',
		actions: [ { title: 'Reset', handler: 'settings.reset("filters")', mods: '.prevent' } ],
		displayGroup: 'Filter',
		displayMethod: 'textarea',
		attrs: 'rows=10',
		format: v => v.join('\n'),
		parse: v => v.split('\n')
	}
];


/***/ }),

/***/ "./src/config/hosts.js":
/*!*****************************!*\
  !*** ./src/config/hosts.js ***!
  \*****************************/
/***/ ((module) => {

module.exports = [
	{
		property: 'defaultUploadHost',
		default: 'catbox',
		parse: 'settings.hosts.setDefault'
	},
	{
		property: 'uploadHosts',
		title: 'Hosts',
		actions: [
			{ title: 'Add', handler: 'settings.hosts.add', mods: '.prevent' },
			{ title: 'Restore Defaults', handler: 'settings.hosts.restoreDefaults', mods: '.prevent' }
		],
		displayGroup: 'Hosts',
		displayMethod: 'settings.hosts.template',
		parse: 'settings.hosts.parse',
		looseCompare: true,
		wideDesc: true,
		description: 'Each host needs a unique name and URL that points to an upload endpoint. '
			+ '<br><br>The form data is a JSON representation of the data sent with the upload, with the file being indicated as "$file". '
			+ 'The form data and headers allow for any other information to be sent, such as a user token.'
			+ '<br><br>A response path or match can optionally be provided to get a link to the uploaded file from the response. '
			+ 'Use "Response Path" for JSON responses to set where a link or filename can be found in the response. '
			+ 'For all other responses "Response Match" takes a regular expression (without slashes) that is applied to the result, with the first capture group being the link or filename. '
			+ 'File URL format can be set if you only have part of the link, such as the filename. The response, or response path/match result, will be inserted in place of %s.',
		mix: true,
		default: {
			catbox: {
				default: true,
				url: 'https://catbox.moe/user/api.php',
				data: { reqtype: 'fileupload', fileToUpload: '$file', userhash: null },
				filenameLength: 29
			},
			pomf: {
				url: 'https://pomf.cat/upload.php',
				data: { 'files[]': '$file' },
				responsePath: 'files.0.url',
				soundUrl: 'a.pomf.cat/%s',
				filenameLength: 23
			},
			zz: {
				url: 'https://zz.ht/api/upload',
				responsePath: 'files.0.url',
				data: {
					'files[]': '$file'
				},
				headers: {
					token: null
				},
				filenameLength: 19
			},
			lewd: {
				url: 'https://lewd.se/upload',
				data: { file: '$file' },
				headers: { token: null, shortUrl: true },
				responsePath: 'data.link',
				filenameLength: 30
			}
		}
	}
];


/***/ }),

/***/ "./src/config/index.js":
/*!*****************************!*\
  !*** ./src/config/index.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = [
	// Order the groups appear in.
	...__webpack_require__(/*! ./display */ "./src/config/display.js"),
	...__webpack_require__(/*! ./playback */ "./src/config/playback.js"),
	...__webpack_require__(/*! ./filter */ "./src/config/filter.js"),
	...__webpack_require__(/*! ./keybinds */ "./src/config/keybinds.js"),
	...__webpack_require__(/*! ./theme */ "./src/config/theme.js"),
	...__webpack_require__(/*! ./hosts */ "./src/config/hosts.js"),

	{
		property: 'viewStyle',
		default: 'playlist'
	},
	{
		property: 'showPlaylistSearch',
		default: true
	},
	{
		property: 'imageHeight',
		default: 125
	},

	// These are for availability in templates
	{
		property: 'offsetTop',
		default: '0'
	},
	{
		property: 'offsetBottom',
		default: '0'
	}
];


/***/ }),

/***/ "./src/config/keybinds.js":
/*!********************************!*\
  !*** ./src/config/keybinds.js ***!
  \********************************/
/***/ ((module) => {

const hasMediaSession = 'mediaSession' in navigator;
const keybindOpts = {
	displayGroup: 'Keybinds',
	format: 'hotkeys.stringifyKey',
	parse: 'hotkeys.parseKey',
	attrs: '@keydown="settings.handleKeyChange"',
	property: 'hotkey_bindings',
	allowInTheme: true
};

module.exports = [
	{
		title: 'Keybinds',
		displayGroup: 'Keybinds',
		settings: [
			{
				property: 'hotkeys',
				default: 'open',
				title: 'Enabled',
				options: {
					always: 'Always',
					open: 'Only with the player open',
					never: 'Never'
				}
			},
			{
				property: 'hardwareMediaKeys',
				title: 'Hardware Media Keys',
				displayGroup: 'Keybinds',
				description: 'Enable playback control via hardware media keys.'
					+ (!hasMediaSession ? ' Your browser does not support this feature.' : ''),
				default: hasMediaSession,
				attrs: !hasMediaSession && 'disabled'
			}
		]
	},
	{
		title: 'Playback',
		themeFieldTitle: 'Playback Keybinds',
		...keybindOpts,
		settings: [
			{
				property: 'hotkey_bindings.playPause',
				title: 'Play/Pause',
				keyHandler: 'togglePlay',
				ignoreRepeat: true,
				default: { key: ' ' }
			},
			{
				property: 'hotkey_bindings.previous',
				title: 'Previous',
				keyHandler: () => Player.previous({ force: true }),
				ignoreRepeat: true,
				default: { key: 'arrowleft' }
			},
			{
				property: 'hotkey_bindings.next',
				title: 'Next',
				keyHandler: () => Player.next({ force: true }),
				ignoreRepeat: true,
				default: { key: 'arrowright' }
			},
			{
				property: 'hotkey_bindings.previousGroup',
				title: 'Previous Group',
				keyHandler: () => Player.previous({ force: true, group: true }),
				ignoreRepeat: true,
				default: { shiftKey: true, key: 'arrowleft' }
			},
			{
				property: 'hotkey_bindings.nextGroup',
				title: 'Next Group',
				keyHandler: () => Player.next({ force: true, group: true }),
				ignoreRepeat: true,
				default: { shiftKey: true, key: 'arrowright' }
			},
			{
				property: 'hotkey_bindings.volumeUp',
				title: 'Volume Up',
				keyHandler: 'actions.volumeUp',
				default: { shiftKey: true, key: 'arrowup' }
			},
			{
				property: 'hotkey_bindings.volumeDown',
				title: 'Volume Down',
				keyHandler: 'actions.volumeDown',
				default: { shiftKey: true, key: 'arrowdown' }
			},
			{
				property: 'hotkey_bindings.shuffle',
				title: 'Shuffle',
				keyHandler: 'playlist.toggleShuffle',
				default: { key: '' }
			},
			{
				property: 'hotkey_bindings.repeat',
				title: 'Toggle Repeat',
				keyHandler: 'playlist.toggleRepeat',
				default: { key: '' }
			}
		]
	},
	{
		title: 'Display',
		themeFieldTitle: 'Display Keybinds',
		...keybindOpts,
		settings: [
			{
				property: 'hotkey_bindings.closePlayer',
				title: 'Close',
				keyHandler: 'display.close',
				default: { key: '' }
			},
			{
				property: 'hotkey_bindings.togglePlayer',
				title: 'Show/Hide',
				keyHandler: 'display.toggle',
				default: { key: 'h' }
			},
			{
				property: 'hotkey_bindings.toggleFullscreen',
				title: 'Toggle Fullscreen',
				keyHandler: 'display.toggleFullScreen',
				default: { key: '' },
				allowFocusedInput: true
			},
			{
				property: 'hotkey_bindings.togglePlaylist',
				title: 'Toggle Playlist',
				keyHandler: 'playlist.toggleView',
				default: { key: '' }
			},
			{
				property: 'hotkey_bindings.toggleSearch',
				title: 'Toggle Playlist Search',
				keyHandler: () => Player.set('showPlaylistSearch', !Player.config.showPlaylistSearch),
				default: { key: '' },
				allowFocusedInput: true
			},
			{
				property: 'hotkey_bindings.scrollToPlaying',
				title: 'Jump To Playing',
				keyHandler: () => Player.playlist.scrollToPlaying(),
				default: { key: '' }
			},
			{
				property: 'hotkey_bindings.toggleHoverImages',
				title: 'Toggle Hover Images',
				keyHandler: 'playlist.toggleHoverImages',
				default: { key: '' }
			},
			{
				property: 'hotkey_bindings.toggleAutoScroll',
				title: 'Toggle Thread Scroll',
				keyHandler: () => Player.set('autoScrollThread', !Player.config.autoScrollThread),
				default: { key: '' }
			}
		]
	},
	{
		title: 'Theme',
		themeFieldTitle: 'Theme Keybinds',
		...keybindOpts,
		settings: [
			{
				property: 'hotkey_bindings.nextTheme',
				title: 'Next Theme',
				keyHandler: 'theme.next',
				default: { key: '' }
			},
			{
				property: 'hotkey_bindings.previousTheme',
				title: 'Previous Theme',
				keyHandler: 'theme.previous',
				default: { key: '' }
			},
			{
				property: 'hotkey_bindings.switchTheme',
				title: 'Select Theme',
				keyHandler: 'theme.handleSwitch',
				default: [ ],
				displayMethod: 'theme.themeKeybindsTemplate',
				parse: 'theme.parseSwitch',
				format: null
			}
		]
	}
];


/***/ }),

/***/ "./src/config/playback.js":
/*!********************************!*\
  !*** ./src/config/playback.js ***!
  \********************************/
/***/ ((module) => {

module.exports = [
	{
		property: 'shuffle',
		title: 'Shuffle',
		displayGroup: 'Playback',
		default: false
	},
	{
		property: 'repeat',
		title: 'Repeat',
		displayGroup: 'Playback',
		default: 'all',
		options: {
			all: 'All',
			one: 'One',
			none: 'None'
		}
	},
	{
		property: 'preventSleep',
		title: 'Prevent Sleep',
		displayGroup: 'Playback',
		description: 'Prevent sleeping while audio is playing. This only works when the browser and tab are in the foreground.',
		default: true
	},
	{
		property: 'autoplayNext',
		title: 'Autoplay Next',
		displayGroup: 'Playback',
		description: 'Automatically play the next sound when the current one finishes.',
		default: true
	},
	{
		property: 'restartSeconds',
		title: 'Restart After',
		displayGroup: 'Playback',
		description: 'How long into a track until selecting previous restarts the track instead. Set to 0 to disable.',
		default: 3,
		parse: v => +v >= 0 && +v < Infinity ? +v : 0
	},
	{
		title: 'Inline Player',
		displayGroup: 'Playback',
		settings: [
			{
				property: 'playExpandedImages',
				title: 'Expanded Image',
				description: 'Play audio when sound images are expanded.',
				default: true,
				dependentRender: [ 'expandedControls' ]
			},
			{
				property: 'expandedControls',
				title: 'Expanded Controls',
				description: 'Show playback controls for expanded images.',
				default: true,
				attrs: () => !Player.config.playExpandedImages ? 'disabled' : ''
			},
			{
				property: 'expandedLoopMaster',
				title: 'Master Source',
				default: 'sound',
				description: 'Which media source to play in full for audio and video of different durations.',
				options: {
					sound: 'Audio',
					video: 'Video',
					// longest: 'Longest'
				}
			},
			{
				property: 'expandedAllowFiltered',
				title: 'Allow Filtered',
				default: true,
				description: 'Allow sounds that have been filtered to be played inline. '
					+ 'Sounds from unknown hosts will not be played regardless of this setting.',
			},
			{
				property: 'expandedRepeat',
				title: 'Repeat',
				default: 'all',
				description: 'How to repeat expanded images with multiple sounds.',
				options: {
					all: 'All',
					one: 'One',
					none: 'None'
				}
			},
			{
				property: 'playHoveredImages',
				title: 'Hover Image',
				description: 'Play audio when sound hover images are shown. This applies to hover images displayed by the native extention or 4chan X.',
				default: true
			}
		]
	}
];


/***/ }),

/***/ "./src/config/theme.js":
/*!*****************************!*\
  !*** ./src/config/theme.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = [
	{
		property: 'savedThemes',
		title: 'Saved Themes',
		actions: [
			{ title: 'Restore Defaults', handler: 'theme.restoreDefaults', mods: '.prevent' },
			{ title: 'Save Current', handler: 'theme.showSaveOptions', mods: '.prevent.stop' }
		],
		displayGroup: 'Theme',
		displayMethod: 'theme.savedThemesTemplate',
		mix: true,
		default: __webpack_require__(/*! ../components/theme/themes.js */ "./src/components/theme/themes.js")
	},
	{
		property: 'savedThemesOrder',
		default: [ ],
	},
	{
		property: 'selectedTheme',
		default: 'Default'
	},
	{
		property: 'headerTemplate',
		title: 'Header',
		actions: [ { title: 'Reset', handler: 'settings.reset("headerTemplate")', mods: '.prevent' } ],
		default: 'repeat-button shuffle-button hover-images-button playlist-button\nsound-title-marquee\nview-menu-button add-button theme-menu-button close-button',
		displayGroup: 'Theme',
		displayMethod: 'textarea',
		themeField: true
	},
	{
		property: 'rowTemplate',
		title: 'Row',
		actions: [ { title: 'Reset', handler: 'settings.reset("rowTemplate")', mods: '.prevent' } ],
		default: 'sound-title h:{menu-button}',
		displayGroup: 'Theme',
		displayMethod: 'textarea',
		themeField: true
	},
	{
		property: 'footerTemplate',
		title: 'Footer',
		actions: [ { title: 'Reset', handler: 'settings.reset("footerTemplate")', mods: '.prevent' } ],
		default: 'playing-button:"sound-index /&nbsp;" sound-count sounds\n'
			+ '<div class="fcsp-col"></div>\n'
			+ 'p:{\n'
			+ '		post-link\n'
			+ '		Open [ image-link sound-link ]\n'
			+ '		Download [ dl-image-button dl-sound-button ]\n'
			+ '}\n'
			+ `<div class="${ns}-expander" data-direction="se"></div>\n`,
		displayGroup: 'Theme',
		displayMethod: 'textarea',
		attrs: 'rows="10"',
		themeField: true
	},
	{
		property: 'chanXTemplate',
		title: '4chan X Header',
		default: 'p:{\n\tpost-link:"sound-title"\n\tprev-button\n\tplay-button\n\tnext-button\n\tsound-current-time / sound-duration\n}',
		actions: [ { title: 'Reset', handler: 'settings.reset("chanXTemplate")', mods: '.prevent' } ],
		displayGroup: 'Theme',
		displayMethod: 'textarea',
		attrs: 'rows="10"',
		themeField: true
	},
	{
		property: 'customCSS',
		title: 'Custom CSS',
		default: '',
		displayGroup: 'Theme',
		displayMethod: 'textarea',
		attrs: 'rows="10"',
		themeField: true
	}
];


/***/ }),

/***/ "./src/globals.js":
/*!************************!*\
  !*** ./src/globals.js ***!
  \************************/
/***/ (() => {

/**
 * Global variables and helpers.
 */

window.ns = 'fcsp';

window.is4chan = location.hostname.includes('4chan.org') || location.hostname.includes('4channel.org');
window.isChanX = document.documentElement && document.documentElement.classList.contains('fourchan-x');
window.Board = location.pathname.split('/')[1];
window.Thread = (location.href.match(/\/thread\/(\d+)/) || [])[1];

// Determine what type of site this is. Default to FoolFuuka as the most common archiver.
window.Site = is4chan ? '4chan'
	: ((document.head.querySelector('meta[name="generator"]') || {}).content || '').includes('FoolFuuka') ? 'FoolFuuka'
	: ((document.head.querySelector('meta[name="description"]') || {}).content || '').includes('Fuuka') ? 'Fuuka'
	: 'FoolFuuka';

class PlayerError extends Error {
	constructor(msg, type, err) {
		super(msg);
		this.reason = msg;
		this.type = type;
		this.error = err;
	}
}
window.PlayerError = PlayerError;


/***/ }),

/***/ "./src/icons.js":
/*!**********************!*\
  !*** ./src/icons.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
	fcSounds: '<svg width="452" height="257" xmlns="http://www.w3.org/2000/svg"><g><text font-weight="bold" font-style="italic" font-family="Helvetica, Arial, sans-serif" font-size="250" y="197" fill-opacity="0.05" fill="#000000">4sp</text></g></svg>',
	arrowClockwise: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/arrow-clockwise.svg */ "./node_modules/bootstrap-icons/icons/arrow-clockwise.svg").default,
	arrowsCollapse: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/arrows-collapse.svg */ "./node_modules/bootstrap-icons/icons/arrows-collapse.svg").default,
	arrowDown: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/arrow-down.svg */ "./node_modules/bootstrap-icons/icons/arrow-down.svg").default,
	arrowsExpand: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/arrows-expand.svg */ "./node_modules/bootstrap-icons/icons/arrows-expand.svg").default,
	arrowRepeat: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/arrow-repeat.svg */ "./node_modules/bootstrap-icons/icons/arrow-repeat.svg").default,
	arrowUp: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/arrow-up.svg */ "./node_modules/bootstrap-icons/icons/arrow-up.svg").default,
	boxArrowInLeft: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/box-arrow-in-left.svg */ "./node_modules/bootstrap-icons/icons/box-arrow-in-left.svg").default,
	boxArrowRight: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/box-arrow-right.svg */ "./node_modules/bootstrap-icons/icons/box-arrow-right.svg").default,
	chatRightQuote: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/chat-right-quote.svg */ "./node_modules/bootstrap-icons/icons/chat-right-quote.svg").default,
	checkSquare: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/check-square.svg */ "./node_modules/bootstrap-icons/icons/check-square.svg").default,
	chevronDown: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/chevron-down.svg */ "./node_modules/bootstrap-icons/icons/chevron-down.svg").default,
	chevronUp: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/chevron-up.svg */ "./node_modules/bootstrap-icons/icons/chevron-up.svg").default,
	close: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/x.svg */ "./node_modules/bootstrap-icons/icons/x.svg").default.replace(/viewBox="[^"]+"/, 'viewBox="2 2 12 12"'),
	gear: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/gear.svg */ "./node_modules/bootstrap-icons/icons/gear.svg").default,
	fileEarmarkImage: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/file-earmark-image.svg */ "./node_modules/bootstrap-icons/icons/file-earmark-image.svg").default,
	fileEarmarkMusic: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/file-earmark-music.svg */ "./node_modules/bootstrap-icons/icons/file-earmark-music.svg").default,
	filter: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/filter.svg */ "./node_modules/bootstrap-icons/icons/filter.svg").default,
	fullscreen: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/fullscreen.svg */ "./node_modules/bootstrap-icons/icons/fullscreen.svg").default,
	fullscreenExit: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/fullscreen-exit.svg */ "./node_modules/bootstrap-icons/icons/fullscreen-exit.svg").default,
	github: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/github.svg */ "./node_modules/bootstrap-icons/icons/github.svg").default,
	image: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/image.svg */ "./node_modules/bootstrap-icons/icons/image.svg").default,
	infoCircle: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/info-circle.svg */ "./node_modules/bootstrap-icons/icons/info-circle.svg").default,
	layoutTextWindow: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/layout-text-window.svg */ "./node_modules/bootstrap-icons/icons/layout-text-window.svg").default,
	link: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/link-45deg.svg */ "./node_modules/bootstrap-icons/icons/link-45deg.svg").default,
	musicNoteList: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/music-note-list.svg */ "./node_modules/bootstrap-icons/icons/music-note-list.svg").default,
	play: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/play.svg */ "./node_modules/bootstrap-icons/icons/play.svg").default.replace(/viewBox="[^"]+"/, 'viewBox="2 2 12 12"'),
	playFill: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/play-fill.svg */ "./node_modules/bootstrap-icons/icons/play-fill.svg").default.replace(/viewBox="[^"]+"/, 'viewBox="2 2 12 12"'),
	pause: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/pause.svg */ "./node_modules/bootstrap-icons/icons/pause.svg").default.replace(/viewBox="[^"]+"/, 'viewBox="2 2 12 12"'),
	pauseFill: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/pause-fill.svg */ "./node_modules/bootstrap-icons/icons/pause-fill.svg").default.replace(/viewBox="[^"]+"/, 'viewBox="2 2 12 12"'),
	plus: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/plus-circle.svg */ "./node_modules/bootstrap-icons/icons/plus-circle.svg").default,
	reboot: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/bootstrap-reboot.svg */ "./node_modules/bootstrap-icons/icons/bootstrap-reboot.svg").default,
	search: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/search.svg */ "./node_modules/bootstrap-icons/icons/search.svg").default,
	shuffle: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/shuffle.svg */ "./node_modules/bootstrap-icons/icons/shuffle.svg").default,
	skipEnd: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/skip-end.svg */ "./node_modules/bootstrap-icons/icons/skip-end.svg").default.replace(/viewBox="[^"]+"/, 'viewBox="2 2 12 12"'),
	skipEndFill: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/skip-end-fill.svg */ "./node_modules/bootstrap-icons/icons/skip-end-fill.svg").default.replace(/viewBox="[^"]+"/, 'viewBox="2 2 12 12"'),
	skipStart: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/skip-start.svg */ "./node_modules/bootstrap-icons/icons/skip-start.svg").default.replace(/viewBox="[^"]+"/, 'viewBox="2 2 12 12"'),
	skipStartFill: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/skip-start-fill.svg */ "./node_modules/bootstrap-icons/icons/skip-start-fill.svg").default.replace(/viewBox="[^"]+"/, 'viewBox="2 2 12 12"'),
	soundwave: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/soundwave.svg */ "./node_modules/bootstrap-icons/icons/soundwave.svg").default,
	speaker: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/speaker.svg */ "./node_modules/bootstrap-icons/icons/speaker.svg").default,
	square: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/square.svg */ "./node_modules/bootstrap-icons/icons/square.svg").default,
	tools: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/tools.svg */ "./node_modules/bootstrap-icons/icons/tools.svg").default,
	trash: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/trash.svg */ "./node_modules/bootstrap-icons/icons/trash.svg").default,
	volumeMute: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/volume-mute.svg */ "./node_modules/bootstrap-icons/icons/volume-mute.svg").default.replace(/viewBox="[^"]+"/, 'viewBox="1 1 14 14"'),
	volumeMuteFill: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/volume-mute-fill.svg */ "./node_modules/bootstrap-icons/icons/volume-mute-fill.svg").default.replace(/viewBox="[^"]+"/, 'viewBox="1 1 14 14"'),
	volumeUp: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/volume-up.svg */ "./node_modules/bootstrap-icons/icons/volume-up.svg").default.replace(/viewBox="[^"]+"/, 'viewBox="1 1 14 14"'),
	volumeUpFill: __webpack_require__(/*! ../node_modules/bootstrap-icons/icons/volume-up-fill.svg */ "./node_modules/bootstrap-icons/icons/volume-up-fill.svg").default.replace(/viewBox="[^"]+"/, 'viewBox="1 1 14 14"')
};


/***/ }),

/***/ "./src/components/controls/templates/controls.tpl":
/*!********************************************************!*\
  !*** ./src/components/controls/templates/controls.tpl ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Icons = __webpack_require__(/*! ./src/icons */ "./src/icons.js");
module.exports = (data = {}) => `<div class="${ns}-controls ${ns}-row ${data.inline ? `${ns}-inline-controls` : '' }" data-audio="${data.audioId}">
	<div class="${ns}-col-auto">
		${data.inline && !data.multiple ? '' : `
			<div class="${ns}-media-control ${ns}-previous-button ${ns}-hover-fill ${data.inline && Player.config.expandedRepeat !== 'all' ? 'disabled' : ''}" @click.disabled='${data.actions.previous}' data-hide-id="previous">
				${Icons.skipStart} ${Icons.skipStartFill}
			</div>
		`}
		<div class="${ns}-media-control ${ns}-play-button ${ns}-hover-fill ${!data.audio || data.audio.paused ? `${ns}-play` : ''}" @click='${data.actions.playPause}' data-audio="${data.audioId}">
			${Icons.play} ${Icons.pause} ${Icons.playFill} ${Icons.pauseFill}
		</div>
		${data.inline && !data.multiple ? '' : `
			<div class="${ns}-media-control ${ns}-next-button ${ns}-hover-fill" @click.disabled='${data.actions.next}' data-hide-id="next">
				${Icons.skipEnd} ${Icons.skipEndFill}
			</div>
		`}
	</div>
	<div class="${ns}-col" data-hide-id="seek-bar">
		<div class="${ns}-seek-bar ${ns}-progress-bar" @pointdrag.prevent='${data.actions.seek}'>
			<div class="${ns}-full-bar">
				<div class="${ns}-loaded-bar"></div>
				<div class="${ns}-current-bar"></div>
			</div>
		</div>
	</div>
	<div class="${ns}-col-auto" data-hide-id="time">
		<span>
			<span class="${ns}-current-time" data-audio="${data.audioId}">0:00</span>
			<span class="${ns}-text-muted" data-hide-id="duration">
				/ <span class="${ns}-duration" data-audio="${data.audioId}">0:00</span>
			</span>
		</span>
	</div>
	<div class="${ns}-col-auto" data-hide-id="volume">
		<div class="${ns}-media-control ${ns}-volume-button ${ns}-hover-fill up" @click='${data.actions.mute}' data-hide-id="volume-button" data-audio="${data.audioId}">
			${Icons.volumeMute} ${Icons.volumeMuteFill}
			${Icons.volumeUp} ${Icons.volumeUpFill}
		</div>
		<div class="${ns}-volume-bar ${ns}-progress-bar" @pointdrag.prevent='${data.actions.volume}' data-hide-id="volume-bar">
			<div class="${ns}-full-bar">
				<div class="${ns}-current-bar" style="width: ${Player.audio.volume * 100}%"></div>
			</div>
		</div>
	</div>
	${data.inline ? '' : `
		<div class="${ns}-col-auto" data-hide-id="fullscreen">
			<div class="${ns}-media-control ${ns}-fullscreen-button" @click='${data.actions.fullscreen}'>
				${Icons.fullscreen} ${Icons.fullscreenExit}
			</div>
		</div>
	`}
</div>`

/***/ }),

/***/ "./src/components/display/templates/body.tpl":
/*!***************************************************!*\
  !*** ./src/components/display/templates/body.tpl ***!
  \***************************************************/
/***/ ((module) => {

module.exports = (data = {}) => `<div id="${ns}-container" data-view-style="${Player.config.viewStyle}" @drop.stop.prevent='playlist.addFromDrop' style="top: 30px; left: 0px; width: 360px; height: 360px; display: none;">
	<div class="${ns}-header ${ns}-row ${ns}-align-center ${ns}-hover-trigger" @pointdragstart="position.initMove" @pointdrag.unbound="position.doMove" @pointdragend="position.stopMove">
		${Player.header.template(data)}
	</div>

	<div class="${ns}-player ${!Player.config.hoverImages ? `${ns}-hide-hover-image` : ''}" @fullscreenchange="display._handleFullScreenChange">
		${Player.playlist.template(data)}
	</div>
	<div class="${ns}-settings ${ns}-panel">
		${Player.settings.template(data)}
	</div>
	<div class="${ns}-threads ${ns}-panel">
		${Player.threads.template(data)}
	</div>
	<div class="${ns}-tools ${ns}-panel">
		${Player.tools.template(data)}
	</div>

	<div class="${ns}-footer ${ns}-row ${ns}-align-center ${ns}-hover-trigger">
		${Player.footer.template(data)}
	</div>
	<input class="${ns}-add-local-file-input" type="file" @change.prevent='playlist.addFromFiles($event.currentTarget.files)' style="display: none" accept="image/*,.webm" multiple>
</div>`

/***/ }),

/***/ "./src/components/display/templates/themes_menu.tpl":
/*!**********************************************************!*\
  !*** ./src/components/display/templates/themes_menu.tpl ***!
  \**********************************************************/
/***/ ((module) => {

module.exports = (data = {}) => `<div class="${ns}-menu ${ns}-dialog dialog" id="menu" tabindex="0" data-type="post" style="position: fixed;">
	${[ 'Default' ].concat(Player.config.savedThemesOrder).map(name => `
		<a class="${ns}-row nowrap ${ns}-align-center entry" href="#" @click.prevent='theme.switch("${name}");playlist.restore'>
			<span ${Player.config.selectedTheme === name ? 'style="font-weight: 700;"' : ''}>${name}</span>
		</a>
	`).join('')}
</div>`


/***/ }),

/***/ "./src/components/display/templates/views_menu.tpl":
/*!*********************************************************!*\
  !*** ./src/components/display/templates/views_menu.tpl ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Icons = __webpack_require__(/*! ./src/icons */ "./src/icons.js");
module.exports = (data = {}) => `<div class="${ns}-menu ${ns}-dialog dialog" id="menu" tabindex="0" data-type="post" style="position: fixed;">
	${[ 'playlist', 'image' ].includes(Player.config.viewStyle) ? ''
		: `<a class="${ns}-row nowrap ${ns}-align-center entry" href="#" @click.prevent="playlist.restore"><div class="${ns}-col">Player</div><div class="${ns}-col-auto">${Icons.musicNoteList}</div></a>`}
	${Player.config.viewStyle === 'settings' ? ''
		: `<a class="${ns}-row nowrap ${ns}-align-center entry" href="#" @click.prevent="settings.toggle()"><div class="${ns}-col">Settings</div><div class="${ns}-col-auto">${Icons.gear}</div></span></a>`}
	${Player.config.viewStyle === 'threads' ? ''
		: `<a class="${ns}-row nowrap ${ns}-align-center entry" href="#" @click.prevent="threads.toggle"><div class="${ns}-col">Threads</div><div class="${ns}-col-auto">${Icons.search}</div></span></a>`}
	${Player.config.viewStyle === 'tools' ? ''
		: `<a class="${ns}-row nowrap ${ns}-align-center entry" href="#" @click.prevent="tools.toggle"><div class="${ns}-col">Tools</div><div class="${ns}-col-auto">${Icons.tools}</div></span></a>`}
</div>`


/***/ }),

/***/ "./src/components/playlist/templates/item_menu.tpl":
/*!*********************************************************!*\
  !*** ./src/components/playlist/templates/item_menu.tpl ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var _ = __webpack_require__(/*! ./src/_ */ "./src/_.js");
module.exports = (data = {}) => `<div class="${ns}-menu dialog ${ns}-dialog" id="menu" tabindex="0" data-type="post" style="position: fixed;">
	${data.sound.post ? `<a class="entry" href="#${data.postIdPrefix + data.sound.post}">Show Post</a>` : ''}
	<div class="entry has-submenu" @entry-focus='playlist.loadTags("${data.sound.id}")' @entry-blur='playlist.abortTags("${data.sound.id}")'>
		Details
		<div class="dialog submenu tags-dialog" @click.stop="" data-sound-id="${data.sound.id}" style="inset: 0px auto auto 100%;">
			${Player.playlist.tagsDialogTemplate(data.sound)}
		</div>
	</div>
	<div class="entry has-submenu">
		Open
		<div class="dialog submenu" style="inset: 0px auto auto 100%;">
			<a class="entry" href="${data.sound.image}" target="_blank">Image</a>
			<a class="entry" href="${data.sound.src}" target="_blank">Sound</a>
		</div>
	</div>
	<div class="entry has-submenu">
		Download
		<div class="dialog submenu" style="inset: 0px auto auto 100%;">
			<a class="entry" href="#" @click.prevent='tools.download("${_.escAttr(data.sound.image, true)}", "${_.escAttr(data.sound.filename, true)}")'>Image</a>
			<a class="entry" href="#" @click.prevent='tools.download("${_.escAttr(data.sound.src, true)}", "${_.escAttr(data.sound.name, true)}")'>Sound</a>
		</div>
	</div>
	<div class="entry has-submenu">
		Filter
		<div class="dialog submenu" style="inset: 0px auto auto 100%;">
			${data.sound.imageMD5 ? `<a class="entry" href="#" @click.prevent='playlist.addFilter("${data.sound.imageMD5}")'>Image</a>` : ''}
			<a class="entry" href="#" @click.prevent='playlist.addFilter("${_.escAttr(data.sound.src, true).replace(/^(https?\:)?\/\//, '')}")'>Sound</a>
		</div>
	</div>
	<a class="entry" href="#" @click.prevent='remove("${data.sound.id}")'>Remove</a>
</div>`


/***/ }),

/***/ "./src/components/playlist/templates/list.tpl":
/*!****************************************************!*\
  !*** ./src/components/playlist/templates/list.tpl ***!
  \****************************************************/
/***/ ((module) => {

module.exports = (data = {}) => (data.sounds || Player.sounds).map(sound => !Player.playlist.matchesSearch(sound) ? '' : `
	<div
		class="${ns}-list-item ${ns}-row ${sound.playing ? 'playing' : ''} ${ns}-align-center ${ns}-hover-trigger"
		@click="playlist.handleSelect"
		@dragstart.passive="playlist.handleDragStart"
		@dragenter.prevent="playlist.handleDragEnter"
		@dragend.prevent="playlist.handleDragEnd"
		@dragover.prevent=""
		@drop.prevent=""
		@contextmenu.stop.prevent='playlist.handleItemMenu($event, "${sound.id}")'
		@mouseenter="playlist.updateHoverImage"
		@mouseleave="playlist.removeHoverImage"
		@mousemove.passive="playlist.positionHoverImage"
		data-id="${sound.id}"
		${!Player.playlist.matchesSearch(sound) ? '__style="display: none"' : ''}
		draggable="true"
	>
		${Player.userTemplate.build({
			template: Player.config.rowTemplate,
			location: 'item-' + sound.id,
			sound,
			outerClass: `${ns}-col-auto`
		})}
	</div>`
).join('')

/***/ }),

/***/ "./src/components/playlist/templates/player.tpl":
/*!******************************************************!*\
  !*** ./src/components/playlist/templates/player.tpl ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Icons = __webpack_require__(/*! ./src/icons */ "./src/icons.js");
module.exports = (data = {}) => `<a
	class="${ns}-image-link"
	target="_blank"
	style="height: ${Player.config.imageHeight}px"
	@pointdragstart.prevent="playlist.expandImageStart"
	@pointdrag.move.prevent="playlist.expandImage"
	@pointdragend.prevent="playlist.setImageHeight"
	@click="playlist.expandImageClick"
>
	<div class="fullscreen-details"></div>
	<div class="image-color-overlay"></div>
	<img class="${ns}-background-image"></img>
	<div class="${ns}-image-transparent-bg"></div>
	<img id="fcspImage" class="${ns}-image" src="data:image/svg+xml;base64,${btoa(Icons.fcSounds)}"></img>
	<video class="${ns}-video" @play='controls.sync' @pause='controls.sync' loop="true"></video>
</a>
${Player.controls.template({
	audio: Player.audio,
	audioId: Player.audio.dataset.id,
	actions: Player.controls.actions
})}
<div class="${ns}-under-image">
	<input
		type="input"
		class="${ns}-playlist-search"
		@keyup="playlist._handleSearch"
		style="min-width: 100%; box-sizing: border-box; ${!Player.config.showPlaylistSearch ? 'display: none;' : ''}"
		placeholder="Search"
	/>
	<div class="${ns}-list-container">
		${Player.playlist.listTemplate()}
	</div>
</div>
<img class="${ns}-hover-image">`

/***/ }),

/***/ "./src/components/playlist/templates/tags_dialog.tpl":
/*!***********************************************************!*\
  !*** ./src/components/playlist/templates/tags_dialog.tpl ***!
  \***********************************************************/
/***/ ((module) => {

module.exports = (data = {}) => {
	if (!data.tags) {
		return '<div class="entry">Loading</div>';
	}
	const tagsArr = Object.entries(data.tags);
	if (!tagsArr.length) {
		return '<div class="entry">No data</div>';
	}
	return tagsArr.map(([ name, value ]) => `<div class="entry">
		<span class="tag-name">
			${name[0].toUpperCase() + name.slice(1)}:
		</span>
		${value}
	</div>`).join('');
}

/***/ }),

/***/ "./src/components/settings/templates/colorpicker.tpl":
/*!***********************************************************!*\
  !*** ./src/components/settings/templates/colorpicker.tpl ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Icons = __webpack_require__(/*! ./src/icons */ "./src/icons.js");
module.exports = (data = {}) => `<div class="${ns}-colorpicker ${ns}-dialog dialog" data-allow-click="true" style="top: 0px; left: 0px;">
	<div class="${ns}-cp-saturation" @pointdrag="colorpicker.satMove" style="height: ${data.HEIGHT}px; width: ${data.WIDTH}px;">
		<div class="position" style="left: ${data.WIDTH - 3}px; top: -3px;"></div>
	</div>
	<div class="${ns}-cp-hue" @pointdrag="colorpicker.hueMove" style="height: ${data.HEIGHT}px">
		<div class="position"></div>
	</div>
	<div class="${ns}-output" style="text-align: right;">
		<a href="#" class="${ns}-close-colorpicker" @click.prevent="display.closeDialogs()">${Icons.close}</a>
		<div class="output-color" style="background: rgb(${data.rgb[0]}, ${data.rgb[1]}, ${data.rgb[2]});"></div>

		<table>
			${['R','G','B','A'].map((n, i) => `
				<tr>
					<td>${n}:</td>
					<td>
						<input
							type="text"
							class="${ns}-rgb-input"
							@change="colorpicker.inputRGBA"
							data-color="${i}"
							value="${data.rgb[i]}"
						/>
					</td>
				</tr>
			`).join('')}
		</table>

		<button @click.stop.prevent="colorpicker.apply">Apply</button><br>
	</div>
</div>`

/***/ }),

/***/ "./src/components/settings/templates/host_input.tpl":
/*!**********************************************************!*\
  !*** ./src/components/settings/templates/host_input.tpl ***!
  \**********************************************************/
/***/ ((module) => {

module.exports = (data = {}) => Object.entries(Player.config.uploadHosts).map(([ name, host ]) => `
	<div class="${ns}-row ${ns}-col ${ns}-host-input ${host.invalid ? 'invalid' : ''}" data-host-name="${name}">
		<div class="${ns}-row ${ns}-host-controls">
			<div class="${ns}-col-auto">
				<label>
					<input
						type="checkbox"
						data-property="defaultUploadHost"
						${Player.config.defaultUploadHost === name ? 'checked': ''}
					/>
					Default
				</label>
			</div>
			<div class="${ns}-col-auto">
				<a href="#" class="${ns}-heading-action" @click.prevent="settings.hosts.remove">
					Remove
				</a>
			</div>
		</div>
		<div class="${ns}-row">
			${Object.entries(Player.settings.hosts.fields).map(([ field, title ]) => `
				<div class="${ns}-col">
					<input
						type="text"
						data-property="uploadHosts"
						name="${field}"
						value="${(field === 'name' ? name : host[field]) || ''}"
						placeholder="${title}"
					/>
				</div>
			`).join('')}
		</div>
		<div class="${ns}-row">
			<div class="${ns}-col">
				<textarea data-property="uploadHosts" name="data" placeholder="Data (JSON)">${
					JSON.stringify(host.data, null, 4)
				}</textarea>
			</div>
		</div>
		<div class="${ns}-row">
			<div class="${ns}-col">
				<textarea data-property="uploadHosts" name="headers" placeholder="Headers (JSON)">${
					host.headers ? JSON.stringify(host.headers, null, 4) : ''
				}</textarea>
			</div>
		</div>
	</div>
`).join('')

/***/ }),

/***/ "./src/components/settings/templates/inputs/checkbox.tpl":
/*!***************************************************************!*\
  !*** ./src/components/settings/templates/inputs/checkbox.tpl ***!
  \***************************************************************/
/***/ ((module) => {

module.exports = (data = {}) => `<div class="${ns}-col ${ns}-align-center">
	<input type="checkbox" ${data.attrs} ${data.value ? 'checked' : ''} />
</div>`

/***/ }),

/***/ "./src/components/settings/templates/inputs/input.tpl":
/*!************************************************************!*\
  !*** ./src/components/settings/templates/inputs/input.tpl ***!
  \************************************************************/
/***/ ((module) => {

module.exports = (data = {}) => `<div class="${ns}-col ${ns}-align-center">
	<input type="text" ${data.attrs} value="${data.value}"/>
</div>`

/***/ }),

/***/ "./src/components/settings/templates/inputs/select.tpl":
/*!*************************************************************!*\
  !*** ./src/components/settings/templates/inputs/select.tpl ***!
  \*************************************************************/
/***/ ((module) => {

module.exports = (data = {}) => `<div class="${ns}-col ${ns}-align-center">
	<select ${data.attrs}>
		${Object.keys(data.setting.options).map(k => `<option value="${k}" ${data.value === k ? 'selected' : ''}>
			${data.setting.options[k]}
		</option>`).join('')}
	</select>
</div>`

/***/ }),

/***/ "./src/components/settings/templates/inputs/textarea.tpl":
/*!***************************************************************!*\
  !*** ./src/components/settings/templates/inputs/textarea.tpl ***!
  \***************************************************************/
/***/ ((module) => {

module.exports = (data = {}) => `<div class="${ns}-col ${!data.setting.inlineTextarea ? `${ns}-row` : ''} ${ns}-align-center">
	<textarea ${data.attrs}>${data.value}</textarea>
</div>`

/***/ }),

/***/ "./src/components/settings/templates/setting.tpl":
/*!*******************************************************!*\
  !*** ./src/components/settings/templates/setting.tpl ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var _ = __webpack_require__(/*! ./src/_ */ "./src/_.js");
/* provided dependency */ var Icons = __webpack_require__(/*! ./src/icons */ "./src/icons.js");
module.exports = (data = {}) => data.displayMethod === null ? '' : `
<div class="${ns}-row ${ns}-align-start ${ns}-setting ${data.isSubSetting ? `${ns}-sub-settings` : ''}" data-property="${data.property}">
	<div class="${ns}-col ${ns}-heading">
		<span>
			${data.title}
			${data.description ? `<i class="${ns}-info-circle ${ns}-popover ${data.wideDesc ? 'wide' : ''}" data-content="${_.escAttr(data.description)}">${Icons.infoCircle}</i>` : ''}
		</span>
		${!data.actions || !data.actions.length ? '' : `<div style="display: inline-block; margin: 0 .25rem">
			${(data.actions || []).map(action => `
				<a href="#" class="${ns}-heading-action" @click${action.mods || ''}='${action.handler}'>${action.title}</a>
			`).join(' ')}
		</div>`}
	</div>

	${data.dismissTextId
		? `<div class="${ns}-col" style="min-width: 100%">
			${Player.display.ifNotDismissed(
				data.dismissTextId,
				data.dismissRestoreText,
				`<div data-dismiss-id="${data.dismissTextId}">
					${data.text}
					<a href="#" @click.prevent='display.dismiss("${data.dismissTextId}")' style="display:block; margin-top:.25rem">
						Dismiss
					</a>
				</div>`
			)}
		</div>`
	: data.text
		? data.text
	: ''}

	${(() => {
		// Recusively call for sub settings.
		if (data.settings) {
			return data.settings.map(subSetting => Player.settings.settingTemplate({
				...data,
				actions: null,
				settings: null,
				description: null,
				...subSetting,
				isSubSetting: true
			})).join('')
		}

		value = _.get(Player.config, data.property, data.default);
		attrs = (typeof data.attrs === 'function' ? data.attrs() : data.attrs || '')
			+ (data.class ? ` class="${data.class}"` : '')
			+ ` data-property="${data.property}"`;

		if (data.format) {
			value = Player.getHandler(data.format)(value);
		}
		let type = typeof value;
		if (type === 'object') {
			value = JSON.stringify(value, null, 4)
		}

		inputTemplate = typeof data.displayMethod === 'function' && data.displayMethod
			|| _.get(Player, data.displayMethod)
			|| data.displayMethod && Player.settings.inputTemplates[data.displayMethod]
			|| type === 'boolean' && Player.settings.inputTemplates.checkbox
			|| type === 'object' && Player.settings.inputTemplates.textarea
			|| data.options && Player.settings.inputTemplates.select
			|| Player.settings.inputTemplates.input;

		return inputTemplate({ value, attrs, setting: data });
	})()}
</div>`

/***/ }),

/***/ "./src/components/settings/templates/settings.tpl":
/*!********************************************************!*\
  !*** ./src/components/settings/templates/settings.tpl ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Icons = __webpack_require__(/*! ./src/icons */ "./src/icons.js");
module.exports = (data = {}) => `<div class="${ns}-settings-tabs ${ns}-row">
	<div class="${ns}-settings-tab-group ${ns}-col-auto">
		<a href="#" class="${ns}-settings-reset-all ${ns}-settings-tab"
			@click.prevent='settings.load({},{"applyDefault":true,"ignore":["viewStyle"]})'
			title="Reset all settings to their default values.">
			${Icons.reboot}
		</a>
		<a href="#" class="${ns}-settings-export ${ns}-settings-tab"
			@click.prevent="settings.export"
			title="Export. Shift click to export all settings. Otherwise only modified settings are included in the export.">
			${Icons.boxArrowRight}
		</a>
		<a href="#" class="${ns}-settings-import ${ns}-settings-tab"
			@click.prevent="settings.import"
			title="Import. Settings not included in the import will be left as their current value.">
			${Icons.boxArrowInLeft}
		</a>
		<a href="${Player.settings.changelog}" class="${ns}-settings-tab" target="_blank" title="v${"3.5.0"}">
			${Icons.github}
		</a>
	</div>
	<div class="${ns}-settings-tab-group ${ns}-col-auto">
		${Object.keys(Player.settings.groups).map(name => 
			`<a href="#" class="${ns}-settings-tab ${Player.settings.view !== name ? '' : 'active'}"
				@click.prevent='settings.showGroup("${name}")'
				data-group="${name}">
				${name}
			</a>`
		).join(' | ')}
	</div>
</div>
${Object.entries(Player.settings.groups).map(([ name, settings ]) => `
	<div class="${ns}-settings-group ${Player.settings.view !== name ? '' : 'active'}" data-group="${name}">
		${settings.map(Player.settings.settingTemplate).join('')}
	</div>
`).join('')}`

/***/ }),

/***/ "./src/components/theme/templates/save_theme_menu.tpl":
/*!************************************************************!*\
  !*** ./src/components/theme/templates/save_theme_menu.tpl ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Icons = __webpack_require__(/*! ./src/icons */ "./src/icons.js");
module.exports = (data = {}) => `<div class="${ns}-theme-save-options ${ns}-dialog fields-collapsed dialog" data-allow-click="true" style="top: 0px; left: 0px;">
	<div class="${ns}-row ${ns}-align-center">
		<div class="${ns}-col">
			<input type="text" class="${ns}-save-theme-name" @keyup.prevent="theme.toggleSaveButtonText" placeholder="Name">
		</div>
		<div class="${ns}-col">
			<a class="${ns}-save-theme" @click.prevent="theme.save" href="#">Create</a>
		</div>
	</div>
	<a class="${ns}-row" @click.prevent="theme.toggleSaveFields" href="#" style="margin: .25rem 0">
		<span style="margin-right: .25rem">Included Settings</span>
		${Icons.chevronDown}
		${Icons.chevronUp}
	</a>
	${(function saveFieldOptions(settings, parent) {
		return settings.map(s => {
			const id = s.property && `theme_field-${s.property.replace(/\./g, '_')}`;
			return s.settings
				? saveFieldOptions(s.settings, s)
				: { ...(parent || {}), ...s }.allowInTheme || s.themeField
					? `<div><input type="checkbox" id="${id}" value="${s.property}" ${s.themeField ? 'checked' : ''}><label for="${id}">${parent ? `${parent.themeFieldTitle || parent.title}: ` : ''}${s.title}</label></div>`
					: '';
		}).join('');
	})(data.settingsConfig)}
</div>`

/***/ }),

/***/ "./src/components/theme/templates/saved_themes.tpl":
/*!*********************************************************!*\
  !*** ./src/components/theme/templates/saved_themes.tpl ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Icons = __webpack_require__(/*! ./src/icons */ "./src/icons.js");
module.exports = (data = {}) => `<div class="${ns}-row ${ns}-saved-themes">
	<div class="${ns}-row ${ns}-align-start ${ns}-sub-settings" data-theme="Default" style="order: ${-1}">
		<div class="${ns}-col ${ns}-space-between">Default</div>
		<div class="${ns}-col">
			<a href="#" class="${ns}-heading-action" @click.prevent='theme.switch("Default")' data-property="savedTheme">${Player.config.selectedTheme === 'Default' ? Icons.checkSquare : Icons.square}</a>
		</div>
	</div>
	${Player.config.savedThemesOrder.map((name, i) => `
		<div class="${ns}-row ${ns}-align-start ${ns}-sub-settings" data-theme="${name}" style="order: ${i}">
			<div class="${ns}-col ${ns}-space-between">${name}</div>
			<div class="${ns}-col">
				<a href="#" class="${ns}-heading-action" @click.prevent='theme.switch("${name}")'>${Player.config.selectedTheme === name ? Icons.checkSquare : Icons.square}</a>
				<a href="#" class="${ns}-heading-action ${ns}-move-theme-up ${i === 0 ? 'disabled' : '' }" @click.prevent="theme.moveUp" >${Icons.arrowUp}</a>
				<a href="#" class="${ns}-heading-action ${ns}-move-theme-down ${i === Player.config.savedThemesOrder.length - 1 ? 'disabled' : '' }" @click.prevent="theme.moveDown">${Icons.arrowDown}</a>
				<a href="#" class="${ns}-heading-action ${ns}-remove-theme" @click.prevent="theme.remove">${Icons.trash}</a>
			</div>
		</div>
	`).join('')}
</div>`


/***/ }),

/***/ "./src/components/theme/templates/theme_keybinds.tpl":
/*!***********************************************************!*\
  !*** ./src/components/theme/templates/theme_keybinds.tpl ***!
  \***********************************************************/
/***/ ((module) => {

module.exports = (data = {}) => [ 'Default' ].concat(Player.config.savedThemesOrder).map(name => `
	<div class="${ns}-row ${ns}-select-themes">
		<div class="${ns}-col"><span style="padding-left: .5rem">- ${name}</span></div>
		<div class="${ns}-col" data-name="${name}">
			<input
				type="text"
				@keydown="settings.handleKeyChange"
				value="${Player.hotkeys.stringifyKey(Player.config.hotkey_bindings.switchTheme.find(def => def.themeName === name) || { key: '' })}"
				data-property="hotkey_bindings.switchTheme"
			/>
		</div>
	</div>
`).join('')


/***/ }),

/***/ "./src/components/threads/templates/boards.tpl":
/*!*****************************************************!*\
  !*** ./src/components/threads/templates/boards.tpl ***!
  \*****************************************************/
/***/ ((module) => {

module.exports = (data = {}) => (Player.threads.boardList || []).map(board => {
	let checked = Player.threads.selectedBoards.includes(board.board);
	return !checked && !Player.threads.showAllBoards ? '' : `
		<label>
			<input
				type="checkbox"
				@change='threads.toggleBoard("${board.board}", $event.currentTarget.checked)'
				value="${board.board}"
				${checked ? 'checked' : ''}
			/>
			/${board.board}/
		</label>`
}).join('')

/***/ }),

/***/ "./src/components/threads/templates/list.tpl":
/*!***************************************************!*\
  !*** ./src/components/threads/templates/list.tpl ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var _ = __webpack_require__(/*! ./src/_ */ "./src/_.js");
module.exports = (data = {}) => Object.keys(Player.threads.displayThreads).reduce((rows, board) => {
	return rows.concat(Player.threads.displayThreads[board].map(thread => `
		<tr>
			<td>
				<a class="quotelink" href="//boards.${thread.ws_board ? '4channel' : '4chan'}.org/${thread.board}/thread/${thread.no}#p${thread.no}" target="_blank">
					>>>/${thread.board}/${thread.no}
				</a>
			</td>
			<td>${thread.sub || ''}</td>
			<td>${thread.replies} / ${thread.images}</td>
			<td>${_.timeAgo(thread.time)}</td>
			<td>${_.timeAgo(thread.last_modified)}</td>
		</tr>
	`))
}, []).join('')


/***/ }),

/***/ "./src/components/threads/templates/threads.tpl":
/*!******************************************************!*\
  !*** ./src/components/threads/templates/threads.tpl ***!
  \******************************************************/
/***/ ((module) => {

module.exports = (data = {}) => `<div class="${ns}-heading lined">
	Active Threads
	${!Player.threads.loading ? `- <a class="${ns}-heading-action" @click.prevent="threads.fetch" href="#">Update</a>` : ''}
</div>

<div style="margin: 0 .25rem; display: ${Player.threads.loading ? 'block' : 'none'}">Loading</div>

<div style="margin: 0 .25rem; display: ${Player.threads.loading ? 'none' : 'block'}">
	<div class="${ns}-heading">
		Filter
	</div>
	<input
		type="text"
		class="${ns}-threads-filter"
		@keyup='threads.filter($event.target.value)'
		value="${Player.threads.filterValue || ''}"
	/>

	<div class="${ns}-heading">
		Boards -
		<a class="${ns}-all-boards-link ${ns}-heading-action" @click.prevent="threads.toggleBoardList" href="#">
			${Player.threads.showAllBoards ? 'Selected Only' : 'Show All'}
		</a>
	</div>
	<div class="${ns}-thread-board-list">
		${Player.threads.boardsTemplate(data)}
	</div>

	${!Player.threads.hasParser
		? ''
		: `<div class="${ns}-heading" style="text-align: center">
			${Player.config.threadsViewStyle !== 'table'
				? `<a class="${ns}-heading-action" @click.prevent='set("threadsViewStyle","table")' href="#">Table</a>`
				: `<span>Table</span>`}
			|
			${Player.config.threadsViewStyle !== 'board'
				? `<a class="${ns}-heading-action" @click.prevent='set("threadsViewStyle","board")' href="#">Board</a>`
				: `<span>Board</span>`}
		</div>`
	}
	${
		!Player.threads.hasParser || Player.config.threadsViewStyle === 'table'
		? `<table>
				<tr>
					<th>Thread</th>
					<th>Subject</th>
					<th>Replies/Images</th>
					<th>Started</th>
					<th>Updated</th>
				<tr>
				<tbody class="${ns}-threads-body"></tbody>
			</table>`
		: `<div class="${ns}-thread-list"></div>`
	}
</div>`


/***/ }),

/***/ "./src/components/tools/templates/create-complete.tpl":
/*!************************************************************!*\
  !*** ./src/components/tools/templates/create-complete.tpl ***!
  \************************************************************/
/***/ ((module) => {

module.exports = (data = {}) => `<span>
	<br>Complete!<br>
	${is4chan ? '<a href="#" @click.prevent="tools.addCreatedToQR">Post</a> - ' : ''}
	<a href="#" @click.prevent="tools.addCreatedToPlayer">Add</a> -
	<a href="${Player.tools._createdImageURL}" download="${Player.tools._createdImage.name}" title="${Player.tools._createdImage.name}">Download</a>
</span>`

/***/ }),

/***/ "./src/components/tools/templates/create.tpl":
/*!***************************************************!*\
  !*** ./src/components/tools/templates/create.tpl ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Icons = __webpack_require__(/*! ./src/icons */ "./src/icons.js");
module.exports = (data = {}) => `<div class="${ns}-heading lined">
	Create Sound Image
</div>
<div class="m-2">
	<div class="${ns}-create-sound-form" @drop.stop.prevent="tools.handleCreateSoundDrop">
		<div class="${ns}-row mb-4">
			${Player.display.ifNotDismissed('createSoundDetails', 'Show Help',
			`<div class="${ns}-col" data-dismiss-id="createSoundDetails">
				Select an image and sound to combine as a sound image.
				The sound will be uploaded to the selected file host and the url will be added to the image filename.<br/>
				<br/>
				Multiple sound files, or a comma-separated list of sound URLs, can be given for a single image.
				If you do have multiple sounds the name will also be a considered comma-separated list.<br/>
				<a href="#" @click.prevent='display.dismiss("createSoundDetails")'>Dismiss</a>
			</div>`)}
		</div>

		<div class="${ns}-row">
			<span>Host - <a @click.prevent='settings.toggle("Hosts")' href="#">Config</a></span>
		</div>
		<div class="${ns}-row">
			<div class="${ns}-col ${ns}-create-hosts-container">
				${Player.tools.createHostsTemplate()}
			</div>
		</div>

		<div class="${ns}-row mt-2">
			Data
		</div>
		<div class="${ns}-row">
			<div class="${ns}-col">
				<input type="text" class="${ns}-create-sound-name w-100" placeholder="Name/s">
			</div>
		</div>

		<div class="${ns}-row">
			<div class="${ns}-col">
				<div class="${ns}-file-input placeholder">
					<div class="${ns}-file-overlay w-100">
						<span class="placeholder-text">Select/Drop Image</span>
						<span class="text"></span>
						<input
							class="${ns}-create-sound-img"
							@change='tools.handleImageSelect;tools.handleFileSelect($event.target)'
							type="file"
							accept="image/*,.webm"
						/>
					</div>
				</div>
			</div>

			<div class="${ns}-col">
				<div class="${ns}-file-input placeholder" ${Player.tools.useSoundURL ? 'display: none;' : ''}>
					<div class="${ns}-file-overlay w-100">
						<span class="placeholder-text">Select/Drop Sound/s</span>
						<span class="text"></span>
						<div class="overfile ${ns}-input-append">
							<a href="#" @click.prevent='tools.toggleSoundInput("url")' title="Enter a URL of a previously uploaded file.">
								${Icons.link}
							</a>
						</div>
						<input
							type="file"
							class="${ns}-create-sound-snd"
							@change='tools.handleFileSelect($event.target)'
							accept="audio/*,video/*"
							multiple
						/>
					</div>
					<div class="${ns}-file-list"></div>
				</div>
				<div class="${ns}-row ${ns}-align-center" style="position: relative; ${Player.tools.useSoundURL ? '' : 'display: none;'}">
					<a href="#" class="${ns}-input-append" @click.prevent='tools.toggleSoundInput("file")' title="Select a file to upload.">
						${Icons.fileEarmarkMusic}
					</a>
					<input
						type="text"
						class="${ns}-create-sound-snd-url w-100"
						placeholder="Sound URL/s"
					/>
				</div>
			</div>
		</div>

		<div class="${ns}-row mt-4">
			<div class="${ns}-col-auto">
				<button class="${ns}-create-button" @click.prevent="tools.handleCreate">Create</button>
			</div>
		</div>
	</div>

	<div class="${ns}-create-sound-status" ${Player.tools._createdImage ? '' : 'style="display: none"'}>
		${Player.tools._createdImage ? Player.tools.createCompleteTemplate() : ''}
	</div>
</div>`

/***/ }),

/***/ "./src/components/tools/templates/download-progress.tpl":
/*!**************************************************************!*\
  !*** ./src/components/tools/templates/download-progress.tpl ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Icons = __webpack_require__(/*! ./src/icons */ "./src/icons.js");
module.exports = (data = {}) => `<div class="mb-2">
	<div>
		<a class="${ns}-cancel-download pointer">${Icons.close}</a>
		<span class="${ns}-current-status"></span>
	</div>
	<div class="${ns}-row ${ns}-align-center" ${data.includeImages ? '' : 'style="display: none;"'}>
		<div class="${ns}-col-auto mr-4">${Icons.image}</div>
		<div class="${ns}-col"><div class="${ns}-full-bar"><div class="${ns}-image-bar"></div></div></div>
	</div>
	<div class="${ns}-row ${ns}-align-center" ${data.includeSounds ? '' : 'style="display: none;"'}>
		<div class="${ns}-col-auto mr-4">${Icons.soundwave}</div>
		<div class="${ns}-col"><div class="${ns}-full-bar"><div class="${ns}-sound-bar"></div></div></div>
	</div>
</div>`


/***/ }),

/***/ "./src/components/tools/templates/download.tpl":
/*!*****************************************************!*\
  !*** ./src/components/tools/templates/download.tpl ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Icons = __webpack_require__(/*! ./src/icons */ "./src/icons.js");
module.exports = (data = {}) => `<div class="${ns}-heading lined mt-5">Download All</div>
<div class="m-2">
	<div class="${ns}-row" style="white-space: nowrap">
		<label class="${ns}-col-auto m-0 mr-3" style="height: 1.5rem;">
			<input type="checkbox" class="download-all-images m-0 mr-2" checked>
			Images
		</label>
		<label class="${ns}-col-auto m-0 mr-3" style="height: 1.5rem;">
			<input type="checkbox" class="download-all-audio m-0 mr-2" checked>
			Audio
		</label>
		<label class="${ns}-col-auto m-0 mr-3 ${ns}-ignore-downloaded" style="height: 1.5rem;">
			<input type="checkbox" class="download-all-ignore-downloaded m-0 mr-2" checked>
			<span>
				Skip Downloaded <i class="${ns}-info-circle ${ns}-popover" data-content="Skip sounds you've already downloaded.">${Icons.infoCircle}</i>
			</span>
		</label>
		<div class="${ns}-row ${ns}-align-center">
			<div class="${ns}-col mr-2">Download Concurrency</div>
			<div class="${ns}-col"><input type="number" class="download-all-concurrency" min="1" value="1" style="width: 3rem;"></div>
		</div>
		<div class="${ns}-row ${ns}-align-center">
			<div class="${ns}-col mr-2">
				Compression Level
				<i class="${ns}-info-circle ${ns}-popover" data-content="0 (none/fastest) to 9 (best/slowest). It's unlikely to achieve significant compression however.">${Icons.infoCircle}</i>
			</div>
			<div class="${ns}-col"><input type="number" class="download-all-compression" min="0" max="9" value="0" style="width: 3rem;"></div>
		</div>
		<div class="${ns}-row ${ns}-align-center">
			<div class="${ns}-col mr-2">
				Max Sounds
				<i class="${ns}-info-circle ${ns}-popover" data-content="Maximum number of sounds to download in one zip. 0 for unlimited. Useful for batching downloads to avoid memory contraints.">${Icons.infoCircle}</i>
			</div>
			<div class="${ns}-col"><input type="number" class="download-all-max-sounds" min="0" value="0" style="width: 3rem;"></div>
		</div>
	</div>
	<div class="${ns}-download-all-status" style="display: none;"></div>
	<div class="${ns}-row mt-4 ${ns}-align-center">
		<button @click.prevent="tools._handleDownload" class="${ns}-download-all-start">Download</button>
		<button @click.prevent="tools._handleDownloadCancel" class="${ns}-download-all-cancel">Cancel</button>
		<button @click.prevent="tools.saveThreadDownload" class="${ns}-download-all-save ml-2 ${ns}-popover" @click="tools.saveThreadDownload" data-content="Save the last download.">Save</button>
		<div class="${ns}-download-all-clear ml-2">
			<a href="#" @click.prevent="tools.clearDownloadBlob">Clear</a><i class="${ns}-info-circle ${ns}-popover ml-1" data-content="Clear the last download to free memory.">${Icons.infoCircle}</i>
		</div>
	</div>
</div>`

/***/ }),

/***/ "./src/components/tools/templates/hosts-select.tpl":
/*!*********************************************************!*\
  !*** ./src/components/tools/templates/hosts-select.tpl ***!
  \*********************************************************/
/***/ ((module) => {

module.exports = (data = {}) => `<select class="${ns}-create-sound-host">
	${Object.keys(Player.config.uploadHosts).map((hostId, i) =>
		Player.config.uploadHosts[hostId] && !Player.config.uploadHosts[hostId].invalid
			? `<option value="${hostId}" ${Player.config.defaultUploadHost === hostId ? 'selected' : ''}>${hostId}</option>`
			: ''
	).join('')}
</select>`

/***/ }),

/***/ "./src/components/tools/templates/tools.tpl":
/*!**************************************************!*\
  !*** ./src/components/tools/templates/tools.tpl ***!
  \**************************************************/
/***/ ((module) => {

module.exports = (data = {}) => `${Player.tools.createTemplate()}
${Player.tools.downloadTemplate()}

<div class="${ns}-heading lined mt-5">Encode / Decode URL</div>
<div class="m-2">
	<div class="${ns}-row">
		<input type="text" class="${ns}-col ${ns}-decoded-input" @keyup="tools.handleDecoded" placeholder="https://">
		<input type="text" class="${ns}-col ${ns}-encoded-input" @keyup="tools.handleEncoded" placeholder="https%3A%2F%2F">
	</div>
</div>`

/***/ }),

/***/ "./src/scss/4chan-x-polyfill.scss":
/*!****************************************!*\
  !*** ./src/scss/4chan-x-polyfill.scss ***!
  \****************************************/
/***/ ((module) => {

module.exports = (data = {}) => `.dialog {
  background: var(--fcsp-background);
  background: var(--fcsp-background);
  border-color: var(--fcsp-border);
  border-radius: 3px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  border-radius: 3px;
  padding-top: 1px;
  padding-bottom: 3px;
}

.entry {
  position: relative;
  display: block;
  padding: 0.125rem 0.5rem;
  min-width: 70px;
  white-space: nowrap;
}
.entry.has-submenu::after {
  content: "";
  border-left: 0.5em solid;
  border-top: 0.3em solid transparent;
  border-bottom: 0.3em solid transparent;
  display: inline-block;
  margin: 0.35em;
  position: absolute;
  right: 3px;
}
.entry.focused {
  background: rgba(255, 255, 255, 0.33);
}
.entry.focused > .submenu {
  display: block;
}

.submenu {
  position: absolute;
  display: none;
}`

/***/ }),

/***/ "./src/scss/root.scss":
/*!****************************!*\
  !*** ./src/scss/root.scss ***!
  \****************************/
/***/ ((module) => {

module.exports = (data = {}) => `:root {
  --fcsp-text: ${Player.config.colors.text};
  --fcsp-background: ${Player.config.colors.background};
  --fcsp-border: ${Player.config.colors.border};
  --fcsp-odd-row: ${Player.config.colors.odd_row};
  --fcsp-even-row: ${Player.config.colors.even_row};
  --fcsp-playing: ${Player.config.colors.playing};
  --fcsp-dragging: ${Player.config.colors.dragging};
  --fcsp-controls-background: ${Player.config.colors.controls_background};
  --fcsp-controls-active: ${Player.config.colors.controls_active};
  --fcsp-controls-inactive: ${Player.config.colors.controls_inactive};
  --fcsp-controls-empty-bar: ${Player.config.colors.controls_empty_bar};
  --fcsp-controls-loaded-bar: ${Player.config.colors.controls_loaded_bar};
  --fcsp-muted: #909090;
  --fcsp-max-pip-size: ${Player.config.maxPIPWidth};
}`

/***/ }),

/***/ "./src/scss/style.scss":
/*!*****************************!*\
  !*** ./src/scss/style.scss ***!
  \*****************************/
/***/ ((module) => {

module.exports = (data = {}) => `.${ns}-colorpicker {
  position: fixed;
  padding: 0.25rem;
  white-space: nowrap;
  z-index: 999;
}
.${ns}-colorpicker .${ns}-cp-saturation {
  display: inline-block;
  position: relative;
}
.${ns}-colorpicker .${ns}-cp-saturation .position {
  width: 5px;
}
.${ns}-colorpicker .${ns}-cp-saturation::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  background: black;
  -webkit-mask-image: linear-gradient(#0000, #000);
  mask-image: linear-gradient(#0000, #000);
}
.${ns}-colorpicker .${ns}-cp-hue {
  margin-left: 0.5rem;
  display: inline-block;
  position: relative;
  width: 30px;
  background: linear-gradient(to bottom, #F00, #FF0, #0F0, #0FF, #00F, #F0F, #F00);
}
.${ns}-colorpicker .${ns}-cp-hue .position {
  top: -3px;
  left: -1px;
  right: -1px;
}
.${ns}-colorpicker .${ns}-cp-saturation .position, .${ns}-colorpicker .${ns}-cp-hue .position {
  position: absolute;
  height: 5px;
  border-radius: 1rem;
}
.${ns}-colorpicker .${ns}-output {
  vertical-align: top;
  margin-left: 1rem;
  display: inline-block;
}
.${ns}-colorpicker .${ns}-output .${ns}-rgb-input {
  width: 2rem;
}
.${ns}-colorpicker .${ns}-output .output-color {
  height: 40px;
  margin: 0.25rem 0;
}

.${ns}-cp-preview, .${ns}-cp-saturation .position, .${ns}-cp-hue .position, .${ns}-output .output-color {
  border: solid 1px black;
  box-shadow: inset 0 0 0 1px #EEE;
}

.${ns}-cp-preview {
  height: 1em;
  width: 1em;
  margin-left: 0.125rem;
}

.${ns}-text-muted {
  color: var(--fcsp-muted);
}

.${ns}-controls {
  align-items: center;
  padding: 0.5rem 0;
  position: relative;
  background: var(--fcsp-controls-background);
  justify-content: space-between;
}
.${ns}-controls > div {
  margin: 0 0.5rem;
}
.${ns}-controls .${ns}-current-time {
  color: var(--fcsp-controls-inactive);
}
.${ns}-controls .${ns}-media-control {
  width: 1.5rem;
  height: 1.5rem;
  font-size: 1rem;
  color: var(--fcsp-controls-inactive);
}
.${ns}-controls .${ns}-media-control.disabled {
  cursor: inherit;
  filter: brightness(0.5) grayscale(1);
}
.${ns}-controls .${ns}-media-control:hover:not(.disabled) {
  color: var(--fcsp-controls-active);
}

.${ns}-media-control {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.${ns}-media-control.${ns}-hover-fill svg[class$=-fill], .${ns}-media-control.${ns}-hover-fill svg[class*="-fill "] {
  display: none;
}
.${ns}-media-control.${ns}-hover-fill:hover:not(.disabled) svg {
  display: none;
}
.${ns}-media-control.${ns}-hover-fill:hover:not(.disabled) svg[class$=-fill], .${ns}-media-control.${ns}-hover-fill:hover:not(.disabled) svg[class*="-fill "] {
  display: block;
}
.${ns}-media-control.${ns}-play-button:not(.${ns}-play) svg.bi-play-fill, .${ns}-media-control.${ns}-play-button:not(.${ns}-play) svg.bi-play {
  display: none !important;
}
.${ns}-media-control.${ns}-play-button.${ns}-play svg.bi-pause-fill, .${ns}-media-control.${ns}-play-button.${ns}-play svg.bi-pause {
  display: none !important;
}
.${ns}-media-control.${ns}-fullscreen-button svg.bi-fullscreen-exit {
  display: none;
}
#${ns}-container[data-view-style=fullscreen] .${ns}-media-control.${ns}-fullscreen-button svg.bi-fullscreen-exit {
  display: block;
}
#${ns}-container[data-view-style=fullscreen] .${ns}-media-control.${ns}-fullscreen-button svg.bi-fullscreen {
  display: none;
}
.${ns}-media-control.${ns}-volume-button.mute .bi:not(.bi-volume-mute):not(.bi-volume-mute-fill) {
  display: none;
}
.${ns}-media-control.${ns}-volume-button.up .bi:not(.bi-volume-up):not(.bi-volume-up-fill) {
  display: none;
}

.${ns}-progress-bar {
  min-width: 3.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
}
.${ns}-progress-bar:hover .${ns}-current-bar:after {
  background: var(--fcsp-controls-active);
}

.${ns}-full-bar {
  height: 0.3rem;
  width: 100%;
  background: var(--fcsp-controls-empty-bar);
  border-radius: 1rem;
  position: relative;
}
.${ns}-full-bar > div {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 1rem;
}
.${ns}-full-bar .${ns}-loaded-bar {
  background: var(--fcsp-controls-loaded-bar);
}
.${ns}-full-bar .${ns}-current-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.${ns}-full-bar .${ns}-current-bar:after {
  content: "";
  background: var(--fcsp-controls-inactive);
  height: 0.8rem;
  min-width: 0.8rem;
  border-radius: 1rem;
  box-shadow: rgba(0, 0, 0, 0.76) 0 0 3px 0;
  margin-right: -0.4rem;
}

.${ns}-seek-bar .${ns}-current-bar {
  background: var(--fcsp-controls-active);
}

.${ns}-volume-bar .${ns}-current-bar {
  background: var(--fcsp-controls-inactive);
}

.${ns}-chan-x-controls .${ns}-current-time, .${ns}-chan-x-controls .${ns}-duration {
  margin: 0 0.25rem;
}

.${ns}-header, .${ns}-footer {
  text-align: center;
  padding: 0.125rem;
  max-width: 100%;
  line-height: 1rem;
}
.${ns}-header .${ns}-expander, .${ns}-footer .${ns}-expander {
  opacity: 0;
  position: absolute;
  bottom: -0.25rem;
  right: -0.25rem;
  height: 0.75rem;
  width: 0.75rem;
  cursor: se-resize;
  background: linear-gradient(to bottom right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 50%, var(--fcsp-border) 55%, var(--fcsp-border) 100%);
}
.${ns}-header .${ns}-expander[data-direction=sw], .${ns}-footer .${ns}-expander[data-direction=sw] {
  left: -0.25rem;
  right: auto;
  transform: rotate(90deg);
  cursor: sw-resize;
}
.${ns}-header .${ns}-expander[data-direction=nw], .${ns}-footer .${ns}-expander[data-direction=nw] {
  left: -0.25rem;
  top: -0.25rem;
  right: auto;
  bottom: auto;
  transform: rotate(180deg);
  cursor: nw-resize;
}
.${ns}-header .${ns}-expander[data-direction=ne], .${ns}-footer .${ns}-expander[data-direction=ne] {
  right: -0.25rem;
  top: -0.25rem;
  bottom: auto;
  transform: rotate(270deg);
  cursor: ne-resize;
}

.${ns}-header {
  cursor: grab;
  border-bottom: solid 1px var(--fcsp-border);
}

.${ns}-footer {
  cursor: grab;
  border-top: solid 1px var(--fcsp-border);
}

.${ns}-title-marquee {
  transition: margin-left 1s linear;
}

.${ns}-menu svg.bi {
  margin: 0 -0.25rem 0 0.25rem;
}

.${ns}-header svg.bi, .${ns}-footer svg.bi {
  margin: 0 0.125rem;
}

.muted svg.bi {
  opacity: 0.45;
}

svg.bi {
  overflow: visible;
  height: 1em;
  width: 1em;
}

.fileText svg.bi {
  vertical-align: text-bottom;
}

.${ns}-image-link {
  text-align: center;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}
.${ns}-image-link.${ns}-show-video .${ns}-video {
  display: block;
}
.${ns}-image-link.${ns}-show-video .${ns}-image {
  display: none;
}
.${ns}-image-link.${ns}-pip {
  position: fixed;
  right: 10px;
  align-items: end;
}
.${ns}-image-link.${ns}-pip .${ns}-image, .${ns}-image-link.${ns}-pip .${ns}-video {
  width: auto;
  height: auto;
  max-height: var(--fcsp-max-pip-size);
  max-width: var(--fcsp-max-pip-size);
  object-fit: contain;
}
.${ns}-image-link.${ns}-pip .${ns}-image-transparent-bg, .${ns}-image-link.${ns}-pip .${ns}-background-image {
  display: none;
}
.${ns}-image-link .${ns}-video {
  display: none;
}
.${ns}-image-link .${ns}-image, .${ns}-image-link .${ns}-video {
  height: 100%;
  width: 100%;
  object-fit: contain;
  z-index: 1;
}
.${ns}-image-link .${ns}-background-image {
  position: absolute;
  top: -20px;
  bottom: -20px;
  left: -20px;
  right: -20px;
  object-fit: cover;
  object-position: center;
  height: calc(100% + 40px);
  width: calc(100% + 40px);
  filter: blur(10px) brightness(0.7) saturate(0.5) contrast(0.7);
  z-index: -1;
}
.${ns}-image-link .${ns}-background-image:not([src]) {
  display: none;
}
.${ns}-image-link .${ns}-image-transparent-bg {
  background-color: var(--fcsp-background);
  position: absolute;
}
.untz .${ns}-image-link {
  transition: all 0.1s linear;
}

#${ns}-container[data-view-style=fullscreen].playing-video .${ns}-background-image {
  display: none;
}
#${ns}-container[data-view-style=fullscreen].playing-video .${ns}-image-link, #${ns}-container[data-view-style=fullscreen] .${ns}-image-transparent-bg {
  background: black;
}

#${ns}-container.playing-video .${ns}-image-transparent-bg {
  display: none;
}

.image-color-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 255, 0, 0.5);
  transition: all 0.5s linear;
  display: none;
}
.untz .image-color-overlay {
  display: block;
}

.${ns}-has-controls {
  position: relative;
}
.${ns}-has-controls .${ns}-controls {
  cursor: auto;
  flex-wrap: nowrap;
  overflow: hidden;
  min-width: auto;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
.${ns}-has-controls:not(:hover) .${ns}-controls {
  display: none;
}
html:not(.fourchan-x) .${ns}-has-controls > video + .${ns}-controls {
  left: 20px;
  right: 20px;
}

#${ns}-container {
  position: fixed;
  display: flex;
  flex-direction: column;
  background: var(--fcsp-background);
  color: var(--fcsp-text);
  border: 1px solid var(--fcsp-border);
  box-sizing: border-box;
  min-width: 7rem;
  line-height: 1rem;
}
#${ns}-container .w-100 {
  width: 100%;
  min-width: 100%;
}
#${ns}-container input[type=text], #${ns}-container input[type=number], #${ns}-container select, #${ns}-container .${ns}-file-overlay {
  background: white;
  color: black;
  height: 1.5rem !important;
  padding: 2px 4px 3px;
  box-sizing: border-box;
  margin: 0;
  border-radius: 0;
  border: solid 1px var(--fcsp-border);
  padding: 0 0.25rem;
}
#${ns}-container .m-0 {
  margin: 0;
}
#${ns}-container .mx-0 {
  margin-right: 0;
  margin-left: 0;
}
#${ns}-container .my-0 {
  margin-top: 0;
  margin-bottom: 0;
}
#${ns}-container .mr-0 {
  margin-right: 0;
}
#${ns}-container .ml-0 {
  margin-left: 0;
}
#${ns}-container .mt-0 {
  margin-top: 0;
}
#${ns}-container .mb-0 {
  margin-bottom: 0;
}
#${ns}-container .m-1 {
  margin: 0.125rem;
}
#${ns}-container .mx-1 {
  margin-right: 0.125rem;
  margin-left: 0.125rem;
}
#${ns}-container .my-1 {
  margin-top: 0.125rem;
  margin-bottom: 0.125rem;
}
#${ns}-container .mr-1 {
  margin-right: 0.125rem;
}
#${ns}-container .ml-1 {
  margin-left: 0.125rem;
}
#${ns}-container .mt-1 {
  margin-top: 0.125rem;
}
#${ns}-container .mb-1 {
  margin-bottom: 0.125rem;
}
#${ns}-container .m-2 {
  margin: 0.25rem;
}
#${ns}-container .mx-2 {
  margin-right: 0.25rem;
  margin-left: 0.25rem;
}
#${ns}-container .my-2 {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}
#${ns}-container .mr-2 {
  margin-right: 0.25rem;
}
#${ns}-container .ml-2 {
  margin-left: 0.25rem;
}
#${ns}-container .mt-2 {
  margin-top: 0.25rem;
}
#${ns}-container .mb-2 {
  margin-bottom: 0.25rem;
}
#${ns}-container .m-3 {
  margin: 0.375rem;
}
#${ns}-container .mx-3 {
  margin-right: 0.375rem;
  margin-left: 0.375rem;
}
#${ns}-container .my-3 {
  margin-top: 0.375rem;
  margin-bottom: 0.375rem;
}
#${ns}-container .mr-3 {
  margin-right: 0.375rem;
}
#${ns}-container .ml-3 {
  margin-left: 0.375rem;
}
#${ns}-container .mt-3 {
  margin-top: 0.375rem;
}
#${ns}-container .mb-3 {
  margin-bottom: 0.375rem;
}
#${ns}-container .m-4 {
  margin: 0.5rem;
}
#${ns}-container .mx-4 {
  margin-right: 0.5rem;
  margin-left: 0.5rem;
}
#${ns}-container .my-4 {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
#${ns}-container .mr-4 {
  margin-right: 0.5rem;
}
#${ns}-container .ml-4 {
  margin-left: 0.5rem;
}
#${ns}-container .mt-4 {
  margin-top: 0.5rem;
}
#${ns}-container .mb-4 {
  margin-bottom: 0.5rem;
}
#${ns}-container .m-5 {
  margin: 1rem;
}
#${ns}-container .mx-5 {
  margin-right: 1rem;
  margin-left: 1rem;
}
#${ns}-container .my-5 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
#${ns}-container .mr-5 {
  margin-right: 1rem;
}
#${ns}-container .ml-5 {
  margin-left: 1rem;
}
#${ns}-container .mt-5 {
  margin-top: 1rem;
}
#${ns}-container .mb-5 {
  margin-bottom: 1rem;
}
#${ns}-container .pointer {
  cursor: pointer;
}

.${ns}-panel {
  padding: 0 0.25rem;
  height: 100%;
  width: calc(100% - .5rem);
  overflow: auto;
}

.${ns}-heading {
  font-weight: 600;
  margin: 0.5rem 0;
}
.${ns}-heading.lined {
  border-bottom: solid 1px var(--fcsp-border);
}
.${ns}-heading.lined .${ns}-heading-action {
  text-decoration: none;
}

.${ns}-heading-action {
  font-weight: normal;
  text-decoration: underline;
  display: inline-flex;
}

.${ns}-row {
  display: flex;
  flex-wrap: wrap;
  min-width: 100%;
  box-sizing: border-box;
}
.${ns}-row.nowrap {
  flex-wrap: nowrap;
}

.${ns}-col-auto {
  flex: 0 0 auto;
  width: auto;
  max-width: 100%;
  display: inline-flex;
}

.${ns}-col {
  flex-basis: 0;
  flex-grow: 1;
  max-width: 100%;
  width: 100%;
  position: relative;
}

.${ns}-hover-display {
  display: none;
}

.${ns}-hover-trigger:hover .${ns}-hover-display {
  display: flex;
}

[\\\@pointdrag], .no-touch-action {
  touch-action: none;
}

.${ns}-truncate-text {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.${ns}-align-center {
  align-items: center;
  align-content: center;
  align-self: center;
}

.${ns}-align-start {
  align-items: start;
  align-content: start;
  align-self: start;
}

.${ns}-space-between {
  justify-content: space-between;
}

.${ns}-player {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
}
.${ns}-player .${ns}-hover-image {
  position: fixed;
  max-height: 125px;
  max-width: 125px;
  z-index: 2;
}
.${ns}-player.${ns}-hide-hover-image .${ns}-hover-image {
  display: none !important;
}

.${ns}-under-image {
  flex-grow: 1;
  overflow: auto;
}

.${ns}-list-item {
  list-style-type: none;
  padding: 0.15rem 0.25rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  background: var(--fcsp-odd-row);
  overflow: hidden;
  height: 1.3rem;
}
.${ns}-list-item:nth-child(2n) {
  background: var(--fcsp-even-row);
}
.${ns}-list-item:nth-child(n).playing {
  background: var(--fcsp-playing);
}
.${ns}-list-item .${ns}-item-menu-button {
  right: 0.25rem;
}
.${ns}-list-item.${ns}-dragging {
  background: var(--fcsp-dragging);
}

.dialog .tags-dialog .entry {
  cursor: initial;
}

.${ns}-settings textarea {
  border: solid 1px var(--fcsp-border);
  min-width: 100%;
  min-height: 4rem;
  box-sizing: border-box;
  white-space: pre;
}
.${ns}-settings .${ns}-sub-settings .${ns}-heading {
  font-weight: normal;
  margin: 0;
  justify-content: space-between;
}
.${ns}-settings .${ns}-sub-settings .${ns}-col {
  min-height: 1.55rem;
  display: flex;
  align-items: center;
  align-content: center;
  white-space: nowrap;
}
.${ns}-settings .${ns}-settings-tabs {
  justify-content: space-between;
  flex-direction: row-reverse;
  margin: 0 -0.25rem;
}
.${ns}-settings .${ns}-settings-tab-group {
  text-align: center;
  white-space: nowrap;
  align-items: center;
}
.${ns}-settings .${ns}-settings-tab {
  display: flex;
  margin: 0.25rem;
  text-decoration: underline;
  text-align: center;
}
.${ns}-settings .${ns}-settings-tab.active {
  font-weight: bold;
}
.${ns}-settings .${ns}-settings-tab svg.bi {
  margin: 0 -0.125rem;
}
.${ns}-settings .${ns}-settings-group {
  display: none;
}
.${ns}-settings .${ns}-settings-group.active {
  display: block;
}
.${ns}-settings .${ns}-host-input {
  margin: 0.5rem 0;
  border-top: solid 1px var(--fcsp-border);
}
.${ns}-settings .${ns}-host-input.invalid {
  border: solid 1px red;
}
.${ns}-settings .${ns}-host-input .${ns}-host-controls {
  align-items: center;
  justify-content: space-between;
  margin: 0.125rem 0;
}
.${ns}-settings .${ns}-host-input input[type=text] {
  min-width: 100%;
  box-sizing: border-box;
}

.${ns}-theme-save-options {
  position: fixed;
  max-height: 20rem;
  overflow: auto;
  padding: 0.25rem;
}
.${ns}-theme-save-options:not(.fields-collapsed) .bi-chevron-down, .${ns}-theme-save-options.fields-collapsed .bi-chevron-up, .${ns}-theme-save-options.fields-collapsed input[type=checkbox]:not(:checked), .${ns}-theme-save-options.fields-collapsed input[type=checkbox]:not(:checked) + label {
  display: none;
}

.${ns}-info-circle {
  cursor: pointer;
}
.${ns}-info-circle svg {
  height: 0.8em;
  width: 0.8em;
}

.${ns}-popover-body {
  position: fixed;
  padding: 0.25rem;
  max-width: 12rem;
  text-align: center;
  border-radius: 0.3rem;
}
.${ns}-popover-body.wide {
  max-width: 20rem;
}

pre.option {
  display: inline;
  background: #f5f5f5;
  border: 1px solid #b7c5d9;
  border-radius: 4px;
  padding: 0 0.3em;
  font-size: 0.9em;
  white-space: nowrap;
}

.${ns}-threads .${ns}-thread-board-list label {
  display: inline-block;
  width: 4rem;
}
.${ns}-threads .${ns}-thread-list {
  margin: 0.5rem -0.25rem 0;
  padding: 0.5rem 1rem;
  border-top: solid 1px var(--fcsp-border);
}
.${ns}-threads .${ns}-thread-list .boardBanner {
  margin: 1rem 0;
}
.${ns}-threads table {
  border-top: solid 1px var(--fcsp-border);
  width: 100%;
  margin-top: 0.5rem;
  border-collapse: collapse;
}
.${ns}-threads table th {
  border-bottom: solid 1px var(--fcsp-border);
}
.${ns}-threads table th, .${ns}-threads table td {
  text-align: left;
  padding: 0.25rem;
}
.${ns}-threads table tr {
  padding: 0.25rem 0;
}
.${ns}-threads table .${ns}-threads-body tr {
  background: var(--fcsp-even-row);
}
.${ns}-threads table .${ns}-threads-body tr:nth-child(2n) {
  background: var(--fcsp-odd-row);
}

.${ns}-download-all-status, .${ns}-create-sound-status {
  margin-top: 0.5rem;
  border: solid 1px var(--fcsp-border);
  border-radius: 5px;
  padding: 0.25rem;
}

.${ns}-file-overlay, .${ns}-tools input[type=text] {
  display: flex;
  align-items: center;
}

.${ns}-file-input.placeholder span, .${ns}-create-sound-form input[type=text]::placeholder {
  color: #AAA;
  opacity: 1;
}

.${ns}-file-input .${ns}-file-overlay {
  position: relative;
  background: white;
}
.${ns}-file-input .placeholder-text {
  display: none;
}
.${ns}-file-input.placeholder .placeholder-text {
  display: inherit;
}
.${ns}-file-input span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.${ns}-file-input input[type=file] {
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  position: absolute;
  left: 0;
  opacity: 0;
}
.${ns}-file-input .overfile {
  z-index: 9999;
}
.${ns}-file-input .${ns}-file-list {
  padding: 0 0.25rem;
}
.${ns}-file-input .${ns}-file-list:empty {
  display: none;
}

.${ns}-input-append {
  position: absolute;
  display: flex;
  align-items: center;
  background: white;
  padding-left: 0.25rem;
  right: 0.125rem;
}

.${ns}-tools .${ns}-full-bar {
  background: none;
  height: 5px;
}
.${ns}-tools .${ns}-full-bar > div {
  background: var(--fcsp-border);
}

.${ns}-threads, .${ns}-settings, .${ns}-tools, .${ns}-player, .fullscreen-details {
  display: none;
}

#${ns}-container[data-view-style=settings] .${ns}-settings {
  display: block;
}

#${ns}-container[data-view-style=threads] .${ns}-threads {
  display: block;
}

#${ns}-container[data-view-style=tools] .${ns}-tools {
  display: block;
}

#${ns}-container[data-view-style=image] .${ns}-player,
#${ns}-container[data-view-style=playlist] .${ns}-player,
#${ns}-container[data-view-style=fullscreen] .${ns}-player {
  display: flex;
}

#${ns}-container[data-view-style=image] .${ns}-under-image {
  display: none;
}
#${ns}-container[data-view-style=image] .${ns}-image-link {
  height: auto;
}

#${ns}-container[data-view-style=playlist] .${ns}-image-link {
  flex-shrink: 0;
  flex-grow: 0;
}

#${ns}-container[data-view-style=fullscreen] .${ns}-player {
  scrollbar-width: none;
}
#${ns}-container[data-view-style=fullscreen] .${ns}-player::-webkit-scrollbar {
  display: none;
}
#${ns}-container[data-view-style=fullscreen].cursor-inactive .${ns}-player {
  cursor: none;
}
#${ns}-container[data-view-style=fullscreen].cursor-inactive .${ns}-controls, #${ns}-container[data-view-style=fullscreen].cursor-inactive .fullscreen-details {
  opacity: 0;
}
#${ns}-container[data-view-style=fullscreen] .${ns}-image-link {
  height: calc(100% - .4rem) !important;
}
#${ns}-container[data-view-style=fullscreen] .${ns}-controls {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  z-index: 2;
}
#${ns}-container[data-view-style=fullscreen] .${ns}-under-image {
  position: absolute;
  top: 100%;
  width: 100%;
}
#${ns}-container[data-view-style=fullscreen] .fullscreen-details {
  display: block;
  opacity: 0.7;
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  text-align: left;
  background: var(--fcsp-controls-background);
  color: var(--fcsp-controls-inactive);
  padding: 0.5rem 1rem;
  font-size: 1.5rem;
  line-height: 1.5rem;
  border-radius: 0.375rem;
  z-index: 2;
}`

/***/ }),

/***/ "./src/migrations.js":
/*!***************************!*\
  !*** ./src/migrations.js ***!
  \***************************/
/***/ ((module) => {

// Migrations must return { [prop]: [ previous, updated ], ... }
module.exports = [
	{
		version: '3.0.0',
		name: 'hosts-filename-length',
		async run() {
			const defaultHosts = Player.settings.findDefault('uploadHosts').default;
			Object.keys(defaultHosts).forEach(host => {
				Player.config.uploadHosts[host].filenameLength = defaultHosts[host].filenameLength;
			});
			return {};
		}
	},
	{
		version: '3.3.0',
		name: 'sound-name-title-swap',
		async run() {
			const config = Player.config;
			const changes = {};
			const templates = [ 'headerTemplate', 'rowTemplate', 'footerTemplate', 'chanXTemplate', 'customCSS' ];
			templates.forEach(prop => {
				/sound-name/.test(config[prop]) && (changes[prop] = [
					config[prop],
					config[prop] = config[prop].replace(/sound-name/g, 'sound-title')
				]);
			});
			return changes;
		}
	},
	{
		version: '3.4.0',
		name: 'disable-inline-player-for-existing-users',
		async run() {
			Player.config.playExpandedImages = false;
			Player.config.playHoveredImages = false;
			return {
				playExpandedImages: [ true, false ],
				playHoveredImages: [ true, false ]
			};
		}
	},
	{
		version: '3.4.7',
		name: 'zz-ht-to-zz-fo',
		async run() {
			const original = [ ...Player.config.allow ];
			Player.config.allow.push('zz.fo');
			return {
				allow: [ original, Player.config.allow ]
			}
		}
	}
];


/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var _ = __webpack_require__(/*! ./src/_ */ "./src/_.js");
const components = {
	// Settings must be first.
	settings: __webpack_require__(/*! ./components/settings */ "./src/components/settings/index.js"),
	events: __webpack_require__(/*! ./components/events */ "./src/components/events/index.js"),
	actions: __webpack_require__(/*! ./components/actions */ "./src/components/actions/index.js"),
	colorpicker: __webpack_require__(/*! ./components/settings/colorpicker */ "./src/components/settings/colorpicker.js"),
	controls: __webpack_require__(/*! ./components/controls */ "./src/components/controls/index.js"),
	display: __webpack_require__(/*! ./components/display */ "./src/components/display/index.js"),
	footer: __webpack_require__(/*! ./components/footer */ "./src/components/footer/index.js"),
	header: __webpack_require__(/*! ./components/header */ "./src/components/header/index.js"),
	hotkeys: __webpack_require__(/*! ./components/hotkeys */ "./src/components/hotkeys/index.js"),
	inline: __webpack_require__(/*! ./components/inline */ "./src/components/inline/index.js"),
	minimised: __webpack_require__(/*! ./components/minimised */ "./src/components/minimised/index.js"),
	playlist: __webpack_require__(/*! ./components/playlist */ "./src/components/playlist/index.js"),
	position: __webpack_require__(/*! ./components/position */ "./src/components/position/index.js"),
	posts: __webpack_require__(/*! ./components/posts */ "./src/components/posts/index.js"),
	theme: __webpack_require__(/*! ./components/theme */ "./src/components/theme/index.js"),
	threads: __webpack_require__(/*! ./components/threads */ "./src/components/threads/index.js"),
	tools: __webpack_require__(/*! ./components/tools */ "./src/components/tools/index.js"),
	userTemplate: __webpack_require__(/*! ./components/user-template */ "./src/components/user-template/index.js")
};

// Create a global ref to the player.
const Player = window.Player = module.exports = {
	ns,

	// Store a ref to the components so they can be iterated.
	components,

	audio: new Audio(),
	sounds: [],
	filteredSounds: [],
	isHidden: true,
	container: null,
	ui: {},
	_public: [],

	// Build the config from the default
	config: {},

	// Helper function to query elements in the player.
	$: (...args) => Player.container && Player.container.querySelector(...args),
	$all: (...args) => Player.container && Player.container.querySelectorAll(...args),

	/**
	 * Set up the player.
	 */
	async initialize() {
		if (Player.initialized) {
			return;
		}
		Player.initialized = true;
		try {
			Player.audio.dataset.id = 'main';
			Player.sounds = [ ];
			// Run the initialisation for each component.
			for (let name in components) {
				components[name].initialize && await components[name].initialize();
			}

			// Show a button to open the player.
			Player.display.createPlayerButton();

			// Render the player, but not neccessarily show it.
			await Player.display.render();

			// Expose some functionality via PlayerEvent custom events.
			document.addEventListener('PlayerEvent', e => {
				if (e.detail.action && ( true || 0)) {
					return _.get(Player, e.detail.action).apply(window, e.detail.arguments);
				}
			});
		} catch (err) {
			Player.logError('There was an error initializing the sound player. Please check the console for details.', err);
			// Can't recover so throw this error.
			throw err;
		}
	},

	/**
	 * Returns the function of Player referenced by name or a given handler function.
	 * @param {String|Function} handler Name to function on Player or a handler function.
	 */
	getHandler(handler) {
		return typeof handler === 'string' ? _.get(Player, handler) : handler;
	},

	/**
	 * Compare two ids for sorting.
	 */
	compareIds(a, b) {
		const [ aPID, aSID ] = a.split(':');
		const [ bPID, bSID ] = b.split(':');
		const postDiff = aPID - bPID;
		return postDiff !== 0 ? postDiff : aSID - bSID;
	},

	/**
	 * Check whether a sound src and image are allowed and not filtered.
	 */
	disallowedSound({ src, imageMD5 }) {
		try {
			const link = new URL(src);
			src = src.replace(/^(https?:)?\/\//, '');
			const host = link.hostname.toLowerCase();
			const result = { };
			result.host = !Player.config.allow.find(h => host === h || host.endsWith('.' + h)) && host;
			for (let filter of Player.config.filters) {
				result.image = result.image || filter === imageMD5 && imageMD5;
				result.sound = result.sound || filter.replace(/^(https?:)?\/\//, '') === src && src;
				if (result.image && result.sound) {
					break;
				}
			}
			return result.host || result.image || result.sound
				? result
				: false;
		} catch (err) {
			return { invalid: true };
		}
	},

	/**
	 * Listen for changes
	 */
	syncTab: (property, callback) => typeof GM_addValueChangeListener !== 'undefined' && GM_addValueChangeListener(property, (_prop, oldValue, newValue, remote) => {
		remote && callback(newValue, oldValue);
	}),

	/**
	 * Log errors and show an error notification.
	 */
	logError(message, error, type) {
		console.error('[4chan sounds player]', message, error);
		if (error instanceof PlayerError) {
			error.error && console.error('[4chan sound player]', error.error);
			message = error.reason;
			type = error.type || type;
		}
		Player.alert(message, type || 'error', 5);
	},

	/**
	 * Show a notification using 4chan X or the native extention.
	 */
	alert(content, type = 'info', lifetime = 5) {
		if (isChanX) {
			content = _.element(`<span>${content}</span`);
			document.dispatchEvent(new CustomEvent('CreateNotification', {
				bubbles: true,
				detail: { content, type, lifetime }
			}));
		} else if (typeof Feedback !== 'undefined') {
			Feedback.showMessage(content, type === 'info' ? 'notify' : 'error', lifetime * 1000);
		}
	}
};

// Add each of the components to the player.
for (let name in components) {
	Player[name] = components[name];
	(Player[name].atRoot || []).forEach(k => Player[k] = Player[name][k]);
	(Player[name].public || []).forEach(k => {
		Player._public.push((Player[name].atRoot || []).includes(k) ? k : `${name}.${k}`);
	});
}


/***/ }),

/***/ "./src/selectors.js":
/*!**************************!*\
  !*** ./src/selectors.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Icons = __webpack_require__(/*! ./src/icons */ "./src/icons.js");
module.exports = {
	'4chan': {
		postIdPrefix: 'p',
		posts: '.post',
		// For 4chan there's native / 4chan X / 4chan X with file info formatting
		filename: {
			'.fileText .file-info .fnfull': 'textContent',
			'.fileText .file-info > a': 'textContent',
			'.fileText > a': 'title',
			'.fileText': 'textContent'
		},
		thumb: '.fileThumb',
		expandedImage: isChanX ? '.full-image' : '.expanded-thumb, .expandedWebm',
		hoverImage: isChanX ? '#ihover' : '#image-hover',
		playLink: {
			class: '',
			text: Icons.playFill,
			relative: '.fileText a',
			position: 'afterend',
			prependText: ' ',
			unfilterText: Icons.filter
		},
		// Deliberately missing dots because this is used to set the class
		styleFetcher: 'post reply style-fetcher',
		limitWidthOf: '.thread > .postContainer'
	},
	FoolFuuka: {
		postIdPrefix: '',
		posts: 'article',
		// For the archive the OP and reply selector differs
		filename: {
			'.thread_image_box .post_file_filename': 'textContent',
			'.post_file_filename': 'title'
		},
		thumb: '.thread_image_link',
		playLink: {
			class: 'btnr',
			text: 'Play',
			relative: '.post_controls',
			position: 'beforeend',
			unfilterText: 'Add'
		},
		styleFetcher: 'post_wrapper style-fetcher',
		limitWidthOf: '.posts > article.post'
	},
	Fuuka: {
		postIdPrefix: 'p',
		posts: '.content > div, td.reply',
		filename: {
			':scope > span': 'textContent'
		},
		filenameParser: v => v.split(', ').slice(2).join(', '),
		thumb: '.thumb',
		playLink: {
			class: '',
			text: 'play',
			relative: 'br:nth-of-type(2)',
			position: 'beforebegin',
			prependText: ' [',
			appendText: ']',
			unfilterText: 'add'
		},
		styleFetcher: 'reply style-fetcher',
		limitWidthOf: '.content > div, .content > table'
	}
}[Site];


/***/ }),

/***/ "./src/xhr-replace.js":
/*!****************************!*\
  !*** ./src/xhr-replace.js ***!
  \****************************/
/***/ ((module) => {

function toGM() {
	XMLHttpRequest = xhrGM;
};
 function toNative() {
	XMLHttpRequest = xhrNative;
};

const xhrNative = XMLHttpRequest;
const xhrGM = function() {
	let method, url, headers = {}, mime;
	this.open = (m, u) => {
		method = m;
		url = u;
	};
	this.setRequestHeader = (name, value) => headers[name] = value;
	this.getAllResponseHeaders = () => this.responseHeaders;
	this.getResponseHeader = name => this._responseHeaders[name.toLowerCase()];
	this.overrideMimeType = m => mime = m;
	this.send = data => {
		GM.xmlHttpRequest({
			method,
			url,
			headers,
			data,
			responseType: this.responseType,
			onload: data => {
				Object.assign(this, data);
				this._responseHeaders = (data.responseHeaders || '').split('\n').reduce((headers, h) => {
					let [ name, ...val ] = h.split(': ');
					headers[name.toLowerCase()] = val.join(': ');
					return headers;
				}, {});
				this.responseText = data.responseText;
				this.onload(this)
			},
			onerror: this.onerror,
			onreadystatechange: this.onreadystatechange,
			ontimeout: this.ontimeout,
			timeout: this.timeout,
			overrideMimeType: mime
		});
	};
	this.onload = null;
	return this;
};

module.exports.GM = xhrGM;
module.exports.native = xhrNative;
module.exports.toGM = toGM;
module.exports.toNative = toNative;

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
/******/ 			// no module.id needed
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
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/


async function doInit() {
	// Require globals again here just in case 4chan X loaded before timeout below.
	__webpack_require__(/*! ./globals */ "./src/globals.js");

	// Require these here so every other require is sure of the 4chan X state.
	const Player = __webpack_require__(/*! ./player */ "./src/player.js");

	await Player.initialize();

	Player.posts.addPosts(document.body, true);

	const observer = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			if (mutation.type === 'childList') {
				mutation.addedNodes.forEach(function (node) {
					if (node.nodeType === Node.ELEMENT_NODE) {
						Player.posts.addPosts(node);
					}
				});
			}
		});
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true
	});
}

document.addEventListener('4chanXInitFinished', doInit);

// The timeout makes sure 4chan X will have added it's classes and be identified.
setTimeout(function () {
	__webpack_require__(/*! ./globals */ "./src/globals.js");

	// If it's already known 4chan X is installed this can be skipped.
	if (!isChanX) {
		if (document.readyState !== 'loading') {
			doInit();
		} else {
			document.addEventListener('DOMContentLoaded', doInit);
		}
	}
}, 0);


})();

/******/ })()
;