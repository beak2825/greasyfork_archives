// ==UserScript==
// @name         nowcoder简洁界面
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  nowcoder刷题极简界面
// @author       You
// @match        https://www.nowcoder.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/436463/nowcoder%E7%AE%80%E6%B4%81%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/436463/nowcoder%E7%AE%80%E6%B4%81%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.nowcoder-logo').hide();
    $('.com-subject-title').hide();
    $('.progress-time').hide();
    $('.ft-wrap').hide();
    $('.ft-cont').hide();
    $('.fixed-menu').hide();
    $('.subject-new-tips').hide();
    $('.com-subject-wrap').hide();
    $('.warning-btn').hide();
    $('.subject-title-box').hide();
    $('.js-call-help').hide();
    $('.js-feedback').hide();
})();