// ==UserScript==
// @name         P9新标签打开帖子
// @namespace    undefined
// @version      0.80
// @description  让P9社区点击帖子可以打开新标签
// @author       法爷
// @match        *://*.psnine.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28878/P9%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/28878/P9%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    document.querySelectorAll('.inner.mt40 a,.inner.mt20 a,.box a,.showbar a').forEach(item => item.setAttribute('target','_blank'));
    document.querySelectorAll('.page a,.inav a').forEach(item => item.removeAttribute('target'));
    function $$(selector, context) {
        context = context || document;
        var elements = context.querySelectorAll(selector);
        return Array.prototype.slice.call(elements);}
    a=$$('ul.list li'); for (var i in a){ link=a[i].getAttribute('onclick'); link = link.split('=')[1]; a[i].setAttribute("onclick", "javascript:window.open("+ link + ", '_blank');");};
})();