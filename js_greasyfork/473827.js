// ==UserScript==
// @name         Chat输入框加高
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Chat输入框加高。
// @author       You
// @match        https://chat12.aichatos.xyz/*
// @match        https://chat.jinshutuan.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aichatos.xyz
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473827/Chat%E8%BE%93%E5%85%A5%E6%A1%86%E5%8A%A0%E9%AB%98.user.js
// @updateURL https://update.greasyfork.org/scripts/473827/Chat%E8%BE%93%E5%85%A5%E6%A1%86%E5%8A%A0%E9%AB%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function chanceStyle() {
        // 选择具有 cssr-id="n-input" 属性的 <style> 标签
        var styleElement = document.querySelector('style[cssr-id="n-input"]');

        // 检查是否获取到了 <style> 标签
        if (styleElement) {
            // 获取标签内的 CSS 文本内容
            var cssText = styleElement.innerHTML;
            //console.log(cssText);

            // 使用正则表达式替换 line-height 属性的值
            while (!cssText.includes('line-height: 15;')) {
                cssText = cssText.replace(/\.n-input\s*\{[^}]*line-height:\s*[\d.]+;/, '.n-input { line-height: 15;');
                //console.log(cssText);
            }

            // 更新 <style> 标签的内容
            styleElement.innerHTML = cssText;
        }
    }

    setInterval(chanceStyle, 1000);

    // Your code here...
})();

//https://i0.hdslb.com/bfs/new_dyn/57c31be1db524374851a700c7078da833288389.gif
//https://im5.ezgif.com/tmp/ezgif-5-5fb798e4ee.gif