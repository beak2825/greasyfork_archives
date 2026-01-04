// ==UserScript==
// @name         去除夸克网盘分享链接推广提示
// @namespace    https://axutongxue.com/
// @version      1.1
// @license      MIT
// @description  再也不要看到这句话了："打开「夸克APP」，无需下载在线播放视频，畅享原画5倍速，支持电视投屏。"
// @author       阿虚同学
// @match        *://pan.quark.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521920/%E5%8E%BB%E9%99%A4%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E6%8E%A8%E5%B9%BF%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/521920/%E5%8E%BB%E9%99%A4%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E6%8E%A8%E5%B9%BF%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let t = " ", e = "text", o = "去除小尾巴失败o(╥﹏╥)o", a = "body", l = "copy";
    document.querySelector(a).addEventListener(l, function(a) {
        try {
            let l = a.target.value;
            console.log("原始内容:", l);

            // 过滤掉推广文字，保留以"链接："开头的行
            l = l.split('\n').filter(line =>
                !line.startsWith('，点击链接即可保存。打开「夸克APP」，无需下载在线播放视频，畅享原画5倍速，支持电视投屏。') &&
                line.startsWith('链接：')
            ).map(line =>
                // 去除"链接："前缀
                line.replace(/^链接：/, '')
            ).join('\n');

            console.log("处理后内容:", l);
            a.clipboardData.setData(e, l);
            a.preventDefault();
        } catch (a) {
            console.log(o);
        }
    });
})();
