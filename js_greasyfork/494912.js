// ==UserScript==
// @name        inlineWidthTo100%;
// @namespace   leizingyiu.net
// @include     http*://www.coze.com/home*
// @include     http*://www.coze.cn/home*

// @grant       none
// @version     2024.0514.1855

// @author      leizingyiu
// @license     GNU AGPLv3

// @description 宽度都给我撑满！
// @downloadURL https://update.greasyfork.org/scripts/494912/inlineWidthTo100%25%3B.user.js
// @updateURL https://update.greasyfork.org/scripts/494912/inlineWidthTo100%25%3B.meta.js
// ==/UserScript==


const main=()=>{

  let s=document.createElement('style');
  s.innerHTML='.yiu_coze_width{width:100%!important;transition:width 1s ease;}';

  let classlist=[];
  [...document.querySelectorAll('[style*="width"]')].map(d=> {    classlist=[...new Set([...classlist,...Array.from(d.classList)])];  } );

  s.innerHTML+=classlist.map(d=>'.'+d).join(',')+'{width:100%!important;transition:width 1s ease;}';
  document.body.appendChild(s);

};

window.addEventListener('load',()=>{
  setTimeout(main,1000);
})