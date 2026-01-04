// ==UserScript==
// @name         干他凉的百度百科
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  不要的全去了,还你一个清爽界面
// @author       专制百度100年
// @match        *://baike.baidu.com/item/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/380543/%E5%B9%B2%E4%BB%96%E5%87%89%E7%9A%84%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/380543/%E5%B9%B2%E4%BB%96%E5%87%89%E7%9A%84%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $('div.side-content').remove();
    $('div.header-wrapper').remove();
    $('div.navbar-wrapper').remove();
    $('div.before-content').remove();
    $('div.top-tool').remove();
    $('a.lemma-discussion').remove();
    $('a.edit-lemma').remove();
    $('a.posterFlag').remove();
    $('div.edit-prompt').remove();
    $('div.new-bdsharebuttonbox').remove();
    $('div.wgt-footer-main').remove();
    $('div.layout').remove();
    $('a.edit-icon').remove();
    $('div.main-content').css('width', 'auto');
})();