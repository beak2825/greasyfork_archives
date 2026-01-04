// ==UserScript==
// @name         掘金小册免费看
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  掘金小册 免费观看 须知：【图片无法显示 需要与浏览器代理插件Requestly一起使用，代理插件共享配置 https://app.requestly.io/rules#sharedList/df4e414ab2fb4eb090b72318dad63db5-headers-1742213480655 导入即可！】
// @author       Growing
// @match         https://juejin.cn/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530141/%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%E5%85%8D%E8%B4%B9%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/530141/%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%E5%85%8D%E8%B4%B9%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
         document.querySelectorAll('.section-list a').forEach(a => {
        // 提取原 <a> 标签的 href
        let originalHref = a.getAttribute('href');
        console.log(originalHref)
        if (originalHref) {
            let id = originalHref.split('/').pop(); // 获取最后的路径部分作为 ID

            // 创建新的跳转按钮
            let btn = document.createElement('button');
            btn.style.width = "69px";
            btn.style.height = "25px";
            btn.style.marginLeft = "10px";
            btn.style.fontSize = "10px";
            btn.textContent = '免费看';
            btn.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                window.open(`http://166.108.194.17:9952/juejin/${id}`)
            };
            console.log("btn")

            a.appendChild(btn);
        }
    });
    }, 5000)
    // Your code here...
})();