// ==UserScript==
// @name         bilibili取关
// @namespace    https://greasyfork.org/zh-CN/scripts/458299-bilibili%E5%8F%96%E5%85%B3
// @version      1.0.1
// @description  bilibili我的关注页面添加取关按钮
// @author       Yong_Hu_Ming
// @license      MIT License
// @match        *://space.bilibili.com/*
// @grant        none
// @icon         https://static.hdslb.com/images/favicon.ico
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/458299/bilibili%E5%8F%96%E5%85%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/458299/bilibili%E5%8F%96%E5%85%B3.meta.js
// ==/UserScript==

'use strict';

var $ = window.jQuery;

function run() {

    $('div.fans-action div:last-child').before('<div class="fans-action-btn fans-action-follow" id="quguan"><span class="fans-action-text">取关</span></div>');

    $('div#quguan').click(function(){
        $(this).prev().find('ul > li:last-child').click();
    })
    //$('li.be-pager-item')
}

(window.onload=function() {
    run();
    $('li.be-pager-item').click(function(){
        setTimeout(() => {
            run();
        }, 500);
    })
})();