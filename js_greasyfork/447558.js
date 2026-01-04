// ==UserScript==
// @name         MC Wiki简体中文化
// @version      0.2
// @description  MC fandomWiki 繁体语言转简体中文。
// @author       54
// @include      https://minecraft.fandom.com/zh/wiki/*
// @license MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/447558/MC%20Wiki%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/447558/MC%20Wiki%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('自动切换MC维基语言')
    if (document.URL.includes('?variant=zh-tw')) {
        let wiki_href = window.location.href;
        wiki_href = wiki_href.replace('?variant=zh-tw','?variant=zh-cn');
        window.location.href = wiki_href;
    }
})();