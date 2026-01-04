// ==UserScript==
// @name         nyh优化
// @description  nyh
// @namespace    zvg-nyh
// @version      0.0.1
// @author       zvg
// @license      Unlicense
// @match        *://www.nanyaohui.com/*
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/422989/nyh%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/422989/nyh%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
'use strict'
 
document.head.insertAdjacentHTML('beforeend', `<style>

body {
    background: none;
}

</style>`.replace(/;/g, '!important;'))