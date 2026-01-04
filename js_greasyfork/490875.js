// ==UserScript==
// @name         掘金美化器 By Heyl
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  美化文章内容和目录
// @author       yongli.he
// @license      GPL-3.0 License
// @match      https://juejin.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @require https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/490875/%E6%8E%98%E9%87%91%E7%BE%8E%E5%8C%96%E5%99%A8%20By%20Heyl.user.js
// @updateURL https://update.greasyfork.org/scripts/490875/%E6%8E%98%E9%87%91%E7%BE%8E%E5%8C%96%E5%99%A8%20By%20Heyl.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const render = function(){
        $('.main-container').css('max-width', '98vw');
        $('.main-area').css('width', 'auto');
        $('.main-area').css('margin-left', '100px');
        $('.main-area').css('margin-right', 'calc(25rem + 15px)');
    }
    const renderSuspendPanel = function(){
        $('.article-suspended-panel').css('margin-left', '1rem');
    }
    $(function(){
        setTimeout(render, 1500);
        setTimeout(renderSuspendPanel, 3000);
    });
})();