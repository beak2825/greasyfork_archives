// ==UserScript==
// @name         学习通超星云盘资源新窗口打开
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  学习通超星云盘中的wps资源在新窗口打开
// @author       MUTTERTOOLS
// @match        http://pan-yz.chaoxing.com/*
// @match        https://pan-yz.chaoxing.com/*
// @match        https://pan-yz.cldisk.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/469204/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%B6%85%E6%98%9F%E4%BA%91%E7%9B%98%E8%B5%84%E6%BA%90%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/469204/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%B6%85%E6%98%9F%E4%BA%91%E7%9B%98%E8%B5%84%E6%BA%90%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    pv.openiframe = function (self, file, url){ window.open(url)};
})();