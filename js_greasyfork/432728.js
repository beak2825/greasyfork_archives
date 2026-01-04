// ==UserScript==
// @name        youtube 字幕区域优化
// @namespace    https://www.zhihu.com/people/yin-xiao-bo-11
// @version      0.1.2
// @description  给 youtube 的字幕区域增加活动区域 aria-live 属性，以便于屏幕阅读器自动朗读外挂字幕
// @author       Veg
// @include        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432728/youtube%20%E5%AD%97%E5%B9%95%E5%8C%BA%E5%9F%9F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/432728/youtube%20%E5%AD%97%E5%B9%95%E5%8C%BA%E5%9F%9F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
(function() {
'use strict';
let mo = new MutationObserver( (mutationRecord) => {
middleFunction();
});
mo.observe(document.body, {
'childList': true,
'subtree': true
});
middleFunction();
function middleFunction() {
let caption = document.querySelector('div.ytp-caption-window-container');
if (caption) {
caption.setAttribute('aria-live', 'assertive');
}
}
})();