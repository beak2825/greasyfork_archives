// ==UserScript==
// @name         百度文库自动阅读全文[202206最新版]
// @namespace    https://greasyfork.org
// @version      0.2
// @author       Lyn
// @match        *://wenku.baidu.com/view/*
// @grant        none
// @description  自动展开全部文章内容
// @downloadURL https://update.greasyfork.org/scripts/446842/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87%5B202206%E6%9C%80%E6%96%B0%E7%89%88%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/446842/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87%5B202206%E6%9C%80%E6%96%B0%E7%89%88%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

     window.setInterval(function(){
         if(document.querySelectorAll('.read-all').length==1){
        document.querySelectorAll('.read-all')[0].click()
        console.log('/////////  read-all ///////////')
             }
    },3000);

})();