// ==UserScript==
// @name         图灵社区图书快捷翻页
// @namespace    http://www.ituring.com.cn/
// @version      0.1
// @description  支持图书页,快捷(<-和->)翻页
// @author       wpl980
// @match        http://www.ituring.com.cn/book/tupubarticle/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36059/%E5%9B%BE%E7%81%B5%E7%A4%BE%E5%8C%BA%E5%9B%BE%E4%B9%A6%E5%BF%AB%E6%8D%B7%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/36059/%E5%9B%BE%E7%81%B5%E7%A4%BE%E5%8C%BA%E5%9B%BE%E4%B9%A6%E5%BF%AB%E6%8D%B7%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var getLink = function(element, isPrefix) {
        if (!element) return;
        var nextElement = isPrefix ? element.previousElementSibling : element.nextElementSibling;
        if (!nextElement) return;
        var a = nextElement.querySelector("a");
        if (!a) {
            return getLink(nextElement, isPrefix);
        }
        return a.getAttribute("href");
    };
    $(document).on("keydown", function(e) {
        var tag = e.target.tagName.toLowerCase();
        if (tag == 'input' && (e.keyCode != 37 || e.keyCode == 39)) return;
        var $span = $(this).find(".book-nav span[style]");
        if ($span.length <= 0) return;
        var $parentElement = $span.parent();
        var link;
        // <-
        if (e.keyCode == 37) {
            link = getLink($parentElement[0], true);
        }
        // ->
        else if (e.keyCode == 39) {
            link = getLink($parentElement[0], false);
        }
        if (link) {
            window.location.pathname = link;
        }
    });
})();