// ==UserScript==
// @name         pytorch中文网全文阅读
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  对pytorch中文网pytorch123.com的阅读全文限制进行了解除
// @author       Jerrita
// @match        http://pytorch123.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403496/pytorch%E4%B8%AD%E6%96%87%E7%BD%91%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/403496/pytorch%E4%B8%AD%E6%96%87%E7%BD%91%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('div').remove('#read-more-wrap');
    $('div #main').attr('style', '');
})();