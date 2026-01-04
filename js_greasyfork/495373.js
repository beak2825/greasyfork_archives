// ==UserScript==
// @name         解除img被跨源屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  部分网站使用的图床是类似于gitee等仓库，因为他们禁止把他们的产品作为图床使用，所以使用这个脚本解除跨源策略，可以在一定程度上解决浏览网站部分图片无法加载的问题。
// @author       pytdong
// @match  *://*/*
// @match  https://*/*
// @match http://*/*
// @icon         https://gitee.com/pyccer/picture-bed/raw/master/pytdong-icon.jpg
// @run-at document-start
// @grant        none
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/495373/%E8%A7%A3%E9%99%A4img%E8%A2%AB%E8%B7%A8%E6%BA%90%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/495373/%E8%A7%A3%E9%99%A4img%E8%A2%AB%E8%B7%A8%E6%BA%90%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // const imgList = document.querySelectorAll('img')
    // imgList.forEach((value) => {
    //   let src = value.getAttribute('src')
    //   if (!src.startsWith('data:')) {
    //     value.setAttribute('referrerpolicy', 'no-referrer')
    //     src += "/?aseed=1" // 将来可以考虑更改为aseed=Math.random();但是不如这样效率高。
    //     value.setAttribute('src',src) 
    //   }
      
    // });
    const metaEl  = document.createElement('meta')
    metaEl.setAttribute('name','referrerpolicy')
    metaEl.setAttribute('value','no-referrer')
    document.head.appendChild(metaEl)

})();