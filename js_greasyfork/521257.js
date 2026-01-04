// ==UserScript==
// @name         掘金外链免点击自动跳转
// @namespace    zonahaha
// @version      0.0.3
// @description  点击外链时自动触发继续访问，我就是懒
// @author       zonahaha
// @match        https://link.juejin.cn/?target=http*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        none
// @run-at       document-end
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/521257/%E6%8E%98%E9%87%91%E5%A4%96%E9%93%BE%E5%85%8D%E7%82%B9%E5%87%BB%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/521257/%E6%8E%98%E9%87%91%E5%A4%96%E9%93%BE%E5%85%8D%E7%82%B9%E5%87%BB%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const intervalId = setInterval(()=>{
        const btn = document.querySelector('.middle-page .content .btn')
        if(btn){
            btn.click();
            btn.innerText = '自动跳转中...';
            btn.style.backgroundColor=getRandomColor();
            clearInterval(intervalId)
        }
    },100)
})();


function getRandomColor() {
    // 生成随机RGB颜色
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
}