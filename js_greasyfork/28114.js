// ==UserScript==
// @name         v2ex-custom-search-to-baidu
// @namespace    http://hktkdy.com/
// @version      0.1
// @description  改变V2EX网站内置自定义搜索为百度
// @author       zhangolve
// @match        https://www.v2ex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28114/v2ex-custom-search-to-baidu.user.js
// @updateURL https://update.greasyfork.org/scripts/28114/v2ex-custom-search-to-baidu.meta.js
// ==/UserScript==

(function() {
    'use strict';
   window.onload=function()
   {
   
   var form=document.getElementsByTagName('form');
    form[0].removeAttribute('action');
    form[0].removeAttribute('target');
    form[0].onsubmit=null;
    form[0].onsubmit=function()
    {
       
       var value=form[0].firstChild.firstChild.value;
       var url="https://www.baidu.com/s?wd=site%3Av2ex.com+"+value;
       window.open(url,'_blank'); 
    };
    
  
};
})();