// ==UserScript==
// @name         隐藏colamanhua广告
// @namespace    ChatGPT
// @version      1.3
// @description  隐藏colamanhua网站上的广告
// @match        https://www.colamanhua.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466887/%E9%9A%90%E8%97%8Fcolamanhua%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/466887/%E9%9A%90%E8%97%8Fcolamanhua%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

let style = document.createElement('style');
    style.innerHTML = `[style='display: block; width: 100%; height: 132px; background: rgb(170, 170, 170);'],[style='bottom: 132px;'],body > DIV[style*='height: 33px'][style*='132px !important;'],body > DIV[class][style^='bottom: '][style$='vw; display: block;'],[style*='z-index: 214748364'],.mlad,[class$='_b'],[style*='8.5vw;background: #000;opacity:0.01;'] {display: none !important;visibility: hidden; opacity: 0; z-index: -999; width: 0; height: 0; pointer-events: none; position: absolute; left: -9999px; top: -9999px;}`;
    document.head.appendChild(style);
if (window.location.href.includes(".html")) {
  window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = '';

    // 根据需要定制弹窗的内容
    var message = '您确定要离开当前页面吗？';

    return message;
  });
}