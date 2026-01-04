// ==UserScript==
// @name         知乎移除搜索热词
// @namespace    https://greasyfork.org/zh-CN/users/948411
// @version      1.3
// @description  移除知乎页面顶部的搜索热词。通过拦截原型方法实现，不会出现闪现现象。
// @author       Moe
// @match        https://www.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/assets/apple-touch-icon-152.81060cab.png
// @grant        none
// @license      Apache License 2.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533500/%E7%9F%A5%E4%B9%8E%E7%A7%BB%E9%99%A4%E6%90%9C%E7%B4%A2%E7%83%AD%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/533500/%E7%9F%A5%E4%B9%8E%E7%A7%BB%E9%99%A4%E6%90%9C%E7%B4%A2%E7%83%AD%E8%AF%8D.meta.js
// ==/UserScript==

(function() {
    "use strict";
    const nativeSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
        if (name === "placeholder" && this.closest?.(".SearchBar-input")) {
            Element.prototype.setAttribute = nativeSetAttribute;
            return;
        }
        nativeSetAttribute.call(this, name, value);
    };
})();
