// ==UserScript==
// @name         CSDN自动展开全文
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  打开 CSDN 自动展开全文
// @author       Kismetliu
// @match        https://*.csdn.net/*
// @match        http://*.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395430/CSDN%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/395430/CSDN%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let getButton = document.getElementsByClassName('btn-readmore')[0].click();
})();