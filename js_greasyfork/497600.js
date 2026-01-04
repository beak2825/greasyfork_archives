// ==UserScript==

// @name         huang广
// @namespace    http://sonothing.top/
// @version      2.0
// @description  密
// @author       林
// @match        https://www.mado17.xyz/
// @match        https://www.mado17.xyz/*
// @icon         https://www.mado17.xyz/favicon.ico
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/497600/huang%E5%B9%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/497600/huang%E5%B9%BF.meta.js
// ==/UserScript==

(function() {
   'use strict';

   function removeFirstSectionDiv() {
       const firstSection = document.querySelector('section');
       if (firstSection) {
           const firstDiv = firstSection.querySelector('div');
           if (firstDiv) {
               firstDiv.remove();
           }
       }
   }

   function removeElementsByClassName(classNames) {
       classNames.forEach(className => {
           const element = document.getElementsByClassName(className)[0];
           if (element) {
               element.remove();
           }
       });
   }

   // 提取要移除的类名列表
   const classNamesToRemove = ['topic', 'lfimg', 'rtimg', 'bdpic'];

   // 确保URL的完整比较
   const hostname = new URL(window.location.href).hostname;
   if (hostname === 'www.mado17.xyz') {
       // 移除指定类名的元素
       removeElementsByClassName(classNamesToRemove);
       // 移除第一个section内的div
       removeFirstSectionDiv();
   } else {
       // 在其他情况下，也移除第一个section内的div
       removeFirstSectionDiv();
       // 这里可以添加其他特定逻辑，如果需要的话
   }
})();