// ==UserScript==
// @name         coze扩大输入AI输入栏
// @namespace    http://tampermonkey.net/
// @description  修改扩大国服版本coze的输入栏
// @author       WebRookie
// @match        https://www.coze.cn/space/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coze.cn
// @license     MIT
// @version     0.1.1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497679/coze%E6%89%A9%E5%A4%A7%E8%BE%93%E5%85%A5AI%E8%BE%93%E5%85%A5%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/497679/coze%E6%89%A9%E5%A4%A7%E8%BE%93%E5%85%A5AI%E8%BE%93%E5%85%A5%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

  
  setInterval(() => {
    let list = document.getElementsByClassName("wrapper-single--UMf9npeM8cVkDi0CDqZ0");
    Array.from(list).forEach(e =>{
        e.style.gridTemplateColumns = "1fr 2fr";
        e.style.display = 'flex';
   });
    let list2 = document.getElementsByClassName("wrapper-single-with-tool-area-hidden--CNtAuRPgCc_6_xwy8X9T");
    Array.from(list2).forEach(e =>{
        e.style.removeProperty('grid-template-columns');

        e.setAttribute('style', 'grid-template-columns: 10fr 34fr !important;');
    
   });
    let leftList = document.getElementsByClassName("card--IoQhh3vVUhwDTJi9EIDK");
    Array.from(leftList).forEach(e => {
        e.style.display = 'none';
    })
  }, 1000)
})();