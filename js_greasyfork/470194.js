// ==UserScript==
// @name        CMAKE文档左边栏折叠 - cmake.org
// @namespace   Violentmonkey Scripts
// @match       https://cmake.org/cmake/help/*.html
// @grant       none
// @version     1.0.1
// @author      -
// @description CMAKE official documentation left side bar collapse
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/470194/CMAKE%E6%96%87%E6%A1%A3%E5%B7%A6%E8%BE%B9%E6%A0%8F%E6%8A%98%E5%8F%A0%20-%20cmakeorg.user.js
// @updateURL https://update.greasyfork.org/scripts/470194/CMAKE%E6%96%87%E6%A1%A3%E5%B7%A6%E8%BE%B9%E6%A0%8F%E6%8A%98%E5%8F%A0%20-%20cmakeorg.meta.js
// ==/UserScript==

const bodywrapper = document.querySelector('.bodywrapper');
const sphinxsidebar= document.querySelector('.sphinxsidebar')
const btn_collapse = document.createElement('button');
const body = document.querySelector('.body');
body.style.maxWidth='10000px'
btn_collapse.innerHTML = '左边栏折叠';
btn_collapse.style.position = 'fixed';
btn_collapse.style.top = '0vh';
btn_collapse.style.left = '0';
btn_collapse.addEventListener('click', function(e){
  if(bodywrapper.style.marginLeft!=='0px'){
    bodywrapper.style.marginLeft = '0px';
    sphinxsidebar.style.visibility = 'collapse';
  }else{
    bodywrapper.style.marginLeft = '230px';
    sphinxsidebar.style.visibility = 'visible';
  }
});
document.body.appendChild(btn_collapse)