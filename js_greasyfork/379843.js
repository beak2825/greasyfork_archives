// ==UserScript==
// @name         Jike Auto Click Like
// @namespace    JikeWebAutoClickLike
// @version      0.3
// @description  即刻网页版滚动时会对页面所有内容点赞
// @author       liuxsdev(@即刻：秋犯)
// @match        https://web.okjike.com/*
// @run-at       document-end
// @homepage     https://gist.github.com/liuxsdev/15243c150e268da74aae655843cbcde1
// @license      The MIT License (MIT); http://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/379843/Jike%20Auto%20Click%20Like.user.js
// @updateURL https://update.greasyfork.org/scripts/379843/Jike%20Auto%20Click%20Like.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.onmousewheel=function(){
        var selector = 'div.flex.items-center.justify-center.w-5.h-5:not(.text-tint-warming)'
        var zan = document.querySelectorAll(selector)
        zan.forEach(function(item,index){
            var p=item.parentElement;
            p.click();
        })
    }
})();