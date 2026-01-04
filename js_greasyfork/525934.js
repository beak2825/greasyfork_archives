// ==UserScript==
// @name         液体百科（liquipedia）替换TW旗(主播)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动替换相关图片
// @author       Wind
// @match        https://liquipedia.net/*
// @icon         https://liquipedia.net/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525934/%E6%B6%B2%E4%BD%93%E7%99%BE%E7%A7%91%EF%BC%88liquipedia%EF%BC%89%E6%9B%BF%E6%8D%A2TW%E6%97%97%28%E4%B8%BB%E6%92%AD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525934/%E6%B6%B2%E4%BD%93%E7%99%BE%E7%A7%91%EF%BC%88liquipedia%EF%BC%89%E6%9B%BF%E6%8D%A2TW%E6%97%97%28%E4%B8%BB%E6%92%AD%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 统一替换函数
    function replaceFlagURL(url) {
        // 匹配原图和缩略图路径，替换目录和文件名
        return url
            .replace(
                /(\/commons\/images\/)(thumb\/)?[^/]+\/[^/]+(\/Tw_hd\.png)/g,
                '$1$20/01$3' // 替换路径中的目录为0/01
            )
            .replace(/Tw_hd/g, 'Cn_hd'); // 全局替换文件名
    }

    // 处理所有图片
    let images = document.getElementsByTagName('img');
    for (let img of images) {
        if (img.src.includes('Tw_hd')) {
            img.src = replaceFlagURL(img.src);
        }
        if (img.srcset) {
            // 处理srcset中的多个URL（逗号分隔）
            img.srcset = img.srcset.split(',')
                .map(src => replaceFlagURL(src.trim()))
                .join(', ');
        }
    }
})();