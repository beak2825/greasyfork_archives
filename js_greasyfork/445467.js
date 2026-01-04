// ==UserScript==
// @name         解决掘金，简书，知乎直链跳转的问题
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.2
// @description  脱了裤子放屁一个道理，搞不懂为啥要做这个功能,之前看知乎没有今天又出现了，所以加了一下
// @author       xiaoxiami
// @match        https://link.juejin.cn/?target=*
// @match        https://www.jianshu.com/go-wild?*
// @match        http://link.zhihu.com/?target=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445467/%E8%A7%A3%E5%86%B3%E6%8E%98%E9%87%91%EF%BC%8C%E7%AE%80%E4%B9%A6%EF%BC%8C%E7%9F%A5%E4%B9%8E%E7%9B%B4%E9%93%BE%E8%B7%B3%E8%BD%AC%E7%9A%84%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/445467/%E8%A7%A3%E5%86%B3%E6%8E%98%E9%87%91%EF%BC%8C%E7%AE%80%E4%B9%A6%EF%BC%8C%E7%9F%A5%E4%B9%8E%E7%9B%B4%E9%93%BE%E8%B7%B3%E8%BD%AC%E7%9A%84%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
     setTimeout(()=>{
         let url = window.location.href;
         console.log(url)
         // 掘金的url
         // 不等于-1的时候才表示没有
         if(url.indexOf("link.juejin.cn") != -1){
           console.log(url)
           // 拿到目标地址
           let targetUrl = document.getElementsByClassName('link-content')[0].innerText;
           window.location.replace(targetUrl);
         } else if (url.indexOf("jianshu.com") != -1){
             // 简书的url
             let targetUrl = document.getElementsByClassName("_2VEbEOHfDtVWiQAJxSIrVi_0")[0].innerText;
             window.location.replace(targetUrl);
         } else if (url.indexOf("zhihu.com")){
             // 知乎的url
             let targetUrl = document.getElementsByClassName("link")[0].innerText;
             window.location.replace(targetUrl);
         }
     },2000)
})();