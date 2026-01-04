// ==UserScript==
// @name           磁力链文本变链接
// @namespace       https://greasyfork.org/zh-CN/scripts/445899
// @version         1.5
// @description     点击magnet协议文本变为超链接
// @author          dwpublic
// @include         http*://*
// @match           http*://*
// @grant           none
// @run-at          document-end
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/445899/%E7%A3%81%E5%8A%9B%E9%93%BE%E6%96%87%E6%9C%AC%E5%8F%98%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/445899/%E7%A3%81%E5%8A%9B%E9%93%BE%E6%96%87%E6%9C%AC%E5%8F%98%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==


(function() {
document.onclick = function(e) {
    var link = /((magnet?:)(\.|\w|-|#|\?|=|\/|\+|@|%|&|:|;|!|\*|(?![\u4e00-\u9fa5\s*\n\r'"]))+)/g;
    if (!e.target.innerHTML.match(/<a/) && e.target.innerText != undefined && e.target.innerText.match(link) ) {
        e.target.innerHTML = e.target.innerHTML.replace(link ,'<a target="_blank" href="$1" style="text-decoration:underline;">$1</a>');
    }
};

})();
