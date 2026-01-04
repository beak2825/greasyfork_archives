// ==UserScript==
// @name         恢复百度网盘公开分享选项
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  恢复了百度网盘的公开分享选项
// @author       spectop
// @match        https://pan.baidu.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/395448/%E6%81%A2%E5%A4%8D%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%85%AC%E5%BC%80%E5%88%86%E4%BA%AB%E9%80%89%E9%A1%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/395448/%E6%81%A2%E5%A4%8D%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%85%AC%E5%BC%80%E5%88%86%E4%BA%AB%E9%80%89%E9%A1%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(document.body).bind('DOMNodeInserted', function (e) {
        if ($('#share').length > 0) {
            console.log('has node share');
            if ($(".share-method-line").length === 1) {
                $(".share-method-line").parent().append('<div class="share-method-line"><input type="radio" id="share-method-public" name="share-method" value="public" checked=""><span class="icon radio-icon icon-radio-non"></span><label for="share-method-public"><b>公开分享</b><span>任何人访问链接即可查看，下载！</span></label></div>');
            }
        }
    });
})();