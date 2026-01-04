// ==UserScript==
// @name         ignited space 汉化
// @namespace    http://your.namespace.here
// @version      0.1
// @description  燃烧天空原版自动调用G8汉化文件
// @author       G8-GPT
// @match        https://the-ignited-space.vercel.app/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481993/ignited%20space%20%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/481993/ignited%20space%20%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建第一个 script 元素
    var script1 = document.createElement('script');
    script1.src = 'https://g1tyx.github.io/the-ignited-space/chs.js';
    script1.type = 'text/javascript';

    // 创建第二个 script 元素
    var script2 = document.createElement('script');
    script2.src = 'https://g1tyx.github.io/the-ignited-space/core.js';
    script2.type = 'text/javascript';

    // 添加事件监听器，确保页面加载完成后再执行脚本
    window.onload = function() {
        // 将两个 script 元素添加到页面的 head 元素中
        document.head.appendChild(script1);
        document.head.appendChild(script2);

        // 可以在这里添加其他脚本逻辑或操作
    };

})();