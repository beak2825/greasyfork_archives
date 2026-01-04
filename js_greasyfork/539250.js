// ==UserScript==
// @name         Hotmatrix 分数修改器 (高级版)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在 hotmatrix.cn 网站上，将最终得分修改为您想要的分数。此版本能处理动态加载的内容。
// @author       YourName
// @match        http://yun.hotmatrix.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539250/Hotmatrix%20%E5%88%86%E6%95%B0%E4%BF%AE%E6%94%B9%E5%99%A8%20%28%E9%AB%98%E7%BA%A7%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539250/Hotmatrix%20%E5%88%86%E6%95%B0%E4%BF%AE%E6%94%B9%E5%99%A8%20%28%E9%AB%98%E7%BA%A7%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 在这里设置你想要的分数 ---
    const YOUR_DESIRED_SCORE = '80.1'; // 你可以改成任何你想要的数字，比如 99.99

    // 创建一个函数来修改分数
    const modifyScore = () => {
        // 寻找包含分数的 <span class="score"> 元素
        const scoreElement = document.querySelector('span.score');

        // 如果找到了这个元素
        if (scoreElement) {
            // 修改它的文本内容
            scoreElement.textContent = YOUR_DESIRED_SCORE;
            // 在控制台输出成功信息，方便调试
            console.log(`[分数修改器] 成功将分数修改为: ${YOUR_DESIRED_SCORE}`);
            // 成功修改后，返回 true
            return true;
        }
        // 如果没找到，返回 false
        return false;
    };

    // 使用 MutationObserver 来监视页面的变化
    // 这是最高效的方式，一旦目标元素被添加到页面中，就会立即触发
    const observer = new MutationObserver((mutations, obs) => {
        // 尝试修改分数，如果成功了...
        if (modifyScore()) {
            // ...就停止监视，避免不必要的性能消耗
            obs.disconnect();
        }
    });

    // 配置 observer：监视整个文档的子元素和深层子元素的变化
    observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
    });

})();