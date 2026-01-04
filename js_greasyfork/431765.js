// ==UserScript==
// @name         稿定设计
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隐藏编辑区水印
// @author       AN drew
// @match        *://www.gaoding.com/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431765/%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/431765/%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
        $('.editor-watermark').hide();
        $('.remove-watermark').hide();
    },1)
})();