// ==UserScript==
// @name         简陋的 居中 页面 对齐 按钮
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description   居中 页面 按钮 简陋的 center page web button rough
// @author        批小将
// @match         *://*/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/391601/%E7%AE%80%E9%99%8B%E7%9A%84%20%E5%B1%85%E4%B8%AD%20%E9%A1%B5%E9%9D%A2%20%E5%AF%B9%E9%BD%90%20%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/391601/%E7%AE%80%E9%99%8B%E7%9A%84%20%E5%B1%85%E4%B8%AD%20%E9%A1%B5%E9%9D%A2%20%E5%AF%B9%E9%BD%90%20%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.top === window.self){
        let btn = document.createElement('button');
        btn.style.cssText = 'position: absolute; right: 0; top: 0; font-size: 15px; padding: 2px; border: 1px solid black; z-index: 99999';
        let textnode = document.createTextNode('center');
        btn.appendChild(textnode);
        let body = document.getElementsByTagName('body')[0];
        body.prepend(btn);

        btn.addEventListener('click', function(){
            //这里修改宽度，720px;
            let centercss = 'width: fit-content; margin: 0 auto; max-width: 720px;';
            body.setAttribute('style', centercss);
        });
          //10秒钟后给我滚蛋
       setTimeout(()=>{
           btn.setAttribute('style', 'display:none; ');
       }, 10000);
    }
})();