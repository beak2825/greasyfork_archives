// ==UserScript==
// @name               huiji-tieba-script
// @name:zh-CN         百度灰机汉化组吧脚本
// @version            0.1.2
// @description        Automatic URL conversion, fix sticker link
// @description:zh-cn  自动转换4位尾号为网址, 修复包含表情的链接
// @author             yahiousun
// @include            *://tieba.baidu.com/p/*
// @grant              none
// @namespace https://greasyfork.org/users/157242
// @downloadURL https://update.greasyfork.org/scripts/34589/huiji-tieba-script.user.js
// @updateURL https://update.greasyfork.org/scripts/34589/huiji-tieba-script.meta.js
// ==/UserScript==

(function(window, document) {
    'use strict';
    var CODE_REGEX = /(\u4ee3\u7801|\u4ee3\u53f7|\u5c3e\u53f7|\u672b\u4f4d|\u56db\u4f4d|\u56db\u4f4d\u6570|\u4f60\u4eec\u61c2\u5f97)[^\d]*?(\d{4})(?!：)/g;
    var STICKER_REGEX = /h([^<]*<img[^>]*class="BDE_Smiley[^>]*>)+[^<]*omnibus\/100(\d{4})/g;
    var TEMPLATE = "<a href=\"http://smp.yoedge.com/view/omnibus/100$2\" target=\"_blank\">http://smp.yoedge.com/view/omnibus/100$2</a>";
    var THRESHOLD = 300;

    function debounce(fn, thershold, context) {
        var timer = null;
        return function() {
            clearTimeout(timer);
            var args = arguments;
            timer = setTimeout(function() {
                fn.apply(context, args);
            }, thershold);
        };
    }

    function smp() {
        var contents = document.querySelectorAll('cc');
        var comments = document.querySelectorAll('.lzl_content_main');
        if (CODE_REGEX.test(document.body.innerHTML)) {
            if (typeof contents !== 'undefined') {
                [].forEach.call(contents, function(node) {
                    node.innerHTML = node.innerHTML.replace(CODE_REGEX, TEMPLATE);
                });
            }
            if (typeof comments !== 'undefined') {
                [].forEach.call(comments, function(node) {
                    node.innerHTML = node.innerHTML.replace(CODE_REGEX, TEMPLATE);
                });
            }
        }
        if (STICKER_REGEX.test(document.body.innerHTML)) {
            if (typeof contents !== 'undefined') {
                [].forEach.call(contents, function(node) {
                    node.innerHTML = node.innerHTML.replace(STICKER_REGEX, TEMPLATE);
                });
            }
            if (typeof comments !== 'undefined') {
                [].forEach.call(comments, function(node) {
                    node.innerHTML = node.innerHTML.replace(STICKER_REGEX, TEMPLATE);
                });
            }
        }
    }

    window.addEventListener('DOMNodeInserted', debounce(smp, THRESHOLD));
    window.addEventListener('DOMSubtreeModified', debounce(smp, THRESHOLD));
})(window, document);