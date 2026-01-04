// ==UserScript==
// @name         去除博客导流公众号
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  去除openwrite“博客导流公众号”功能
// @author       You
// @include      http*://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392670/%E5%8E%BB%E9%99%A4%E5%8D%9A%E5%AE%A2%E5%AF%BC%E6%B5%81%E5%85%AC%E4%BC%97%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/392670/%E5%8E%BB%E9%99%A4%E5%8D%9A%E5%AE%A2%E5%AF%BC%E6%B5%81%E5%85%AC%E4%BC%97%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
   
    destroyBTWPlugin();

    function destroyBTWPlugin() {
        // 判断是否有插件
        const hasBTWPlugin = typeof BTWPlugin == "function"

        if (hasBTWPlugin) {
            // 获取属性
            const plugin = new BTWPlugin().options;
            if (plugin) {
                // 删除元素
                const read_more_wrap = document.getElementById("read-more-wrap")
                if (read_more_wrap) {
                    read_more_wrap.remove();
                }
                // 删除样式
                const ctner = document.getElementById(plugin.id)
                if (ctner) {
                    ctner.removeAttribute("style");
                }
            }
        }
    }
})();