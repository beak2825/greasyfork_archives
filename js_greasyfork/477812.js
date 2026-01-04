// ==UserScript==
// @name         稿定设计去水印
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  这是一个搞定设计去水印的功能插件
// @author       zyt
// @match        https://www.focodesign.com/editor/design?id=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477812/%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/477812/%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
   window.onload = function() {
       var removeWater = document.createElement("div");
       removeWater.id = 'removeWater';
       removeWater.style.zIndex = '9999';
       removeWater.style.width = '80px';
       removeWater.style.height = '30px';
       removeWater.style.lineHeight = '30px';
       removeWater.style.textAlign = 'center';
       removeWater.style.borderRadius = '10px';
       removeWater.style.background = 'rgb(249 235 183)';
       removeWater.style.color = '#68afe3';
       removeWater.style.position = 'fixed';
       removeWater.style.top = '20px';
       removeWater.style.left = '1070px';
       removeWater.style.cursor = 'pointer';
       removeWater.innerHTML = '去除水印';
       document.body.appendChild(removeWater);
       removeWater.addEventListener('click', function() {
           // 获取要监听的元素
             const elements = document.querySelectorAll('.editor-watermark');
             for (let i = 0; i < elements.length - 1; i++) {
                 let element = elements[i]
                 // 创建一个观察器实例，并传入回调函数
                 const observer = new MutationObserver(function(mutations) {
                     // 遍历每个变化
                     for (const mutation of mutations) {
                         // 如果变化是属性变化，并且是背景色属性
                         if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                             // 获取新的背景色值
                             const backgroundImage = element.style.backgroundImage;
                             //console.log(i, backgroundImage)
                             if (backgroundImage) {
                                 element.style.backgroundImage = ''
                             }
                         }
                     }
                 });

                 // 开始观察，传入选择器和一个配置对象
                 observer.observe(element, { attributes: true, attributeFilter: ['style'] });
                 element.style.backgroundImage = ''
             }
       });
   };
})();