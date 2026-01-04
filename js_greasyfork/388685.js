// ==UserScript==
// @name         经济学人无限制助手
// @namespace    https://github.com/esmusssein777/awesome-script
// @version      1.1
// @description  让你无弹窗、无限制的阅读经济学人。
// @author       Ligz
// @match        *.economist.com/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388685/%E7%BB%8F%E6%B5%8E%E5%AD%A6%E4%BA%BA%E6%97%A0%E9%99%90%E5%88%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/388685/%E7%BB%8F%E6%B5%8E%E5%AD%A6%E4%BA%BA%E6%97%A0%E9%99%90%E5%88%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('the economist script run!')
    let ad = ['fe-blogs__top-ad-wrapper','#piano__in-line-regwall','#bottom-page-wrapper','ribbon__clickable-banner','[aria-label="Advertisement"]']
    setInterval(() => {
        ad.forEach(item => {
            if ($(item)) {$(item).remove();}
        })
    }, 1000)
    let oldContent = "";
    if ($('.blog-post__text')) {
        oldContent = $('.blog-post__text').html();
        setInterval (() => {
            let newContent = $('.blog-post__text').html();
            if (newContent !== oldContent) {
                $('.blog-post__text').html(oldContent);
            }
        }, 100)
    }
})();
