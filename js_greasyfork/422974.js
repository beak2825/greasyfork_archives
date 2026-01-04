// ==UserScript==
// @name         ccf
// @description  ccf优化
// @namespace    zvg.ccf
// @version      0.0.1
// @author       zvg
// @license      Unlicense
// @match        *://bbs.et8.net/*
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/422974/ccf.user.js
// @updateURL https://update.greasyfork.org/scripts/422974/ccf.meta.js
// ==/UserScript==
'use strict'
 
document.head.insertAdjacentHTML('beforeend', `<style>
 
td, th, p, li {
    font: 14px verdana, tahoma, Arial, Helvetica, sans-serif;
}
 
</style>`.replace(/;/g, '!important;'))