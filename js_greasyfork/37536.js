// ==UserScript==
// @name         CSDN博客
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  专注阅读CSDN博客主要内容
// @author       You
// @match        *://blog.csdn.net/*/article/details/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37536/CSDN%E5%8D%9A%E5%AE%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/37536/CSDN%E5%8D%9A%E5%AE%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $container = $('div.container.clearfix');
    var $children;
    if ($container.length > 0) {
        var $parent = $container.parent();
        $children = $parent.children(':not(div.container.clearfix)');
        remove($children);
        $children = $container.children(':not(main)');
        remove($children);
        var $main = $container.children('main');
        $main.css('width', '100%');
        $children = $main.children(':not(article,div.readall_box)');
        remove($children);
    } else {
        var $target = $('#article_details');
        while ($target.length > 0) {
            if ($target[0].id === 'main') {
                $target.css('padding-left', '0');
            } else if ($target[0].tagName.toLowerCase() === 'body') {
                break;
            }
            var $siblings = $target.siblings();
            remove($siblings);
            $target = $target.parent();
        }
    }

    function remove(list) {
        for (var i = 0; i < list.length; ++i) {
            list[i].remove();
        }
    }
})();