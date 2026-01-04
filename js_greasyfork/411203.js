// ==UserScript==
// @name         百度网盘复制链接函数
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        https://pan.baidu.com/disk/home*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411203/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5%E5%87%BD%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/411203/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5%E5%87%BD%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.handleBaiduLink = function(raw) {
        const mat = raw.match(/(https:\/\/pan\.baidu\.com\/[\w-]+?\/[\w-]+?)\s*?提取码.+?([a-z0-9]{4})/im);
        const link = mat[1];
        const code = mat[2];
        let copy_text = `百度网盘链接：<a href="${link}" rel="noopener noreferrer" target="_blank">${link}</a>，提取码：${code}。`;
        // 调用chrome api拷贝的剪贴板
        copy(copy_text);
        return copy_text;
    };
})();