// ==UserScript==
// @name     	【个人】Github 作为首页的处理
// @description 去除 Github 上多余的元素，链接在新窗口打开。
// @version  	0.1.2
// @namespace   eezTool
// @match    	https://github.com/eezTool/generalPrivare/blob/main/archives/useful/startPage.md
// @include  	https://github.com/eezTool/generalPrivate/blob/main/archives/useful/startPage.md
// @grant    	none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/442469/%E3%80%90%E4%B8%AA%E4%BA%BA%E3%80%91Github%20%E4%BD%9C%E4%B8%BA%E9%A6%96%E9%A1%B5%E7%9A%84%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/442469/%E3%80%90%E4%B8%AA%E4%BA%BA%E3%80%91Github%20%E4%BD%9C%E4%B8%BA%E9%A6%96%E9%A1%B5%E7%9A%84%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

(function() {
  var a = document.getElementById('readme').parentNode.innerHTML;
  document.getElementsByTagName('body')[0].innerHTML = a;
  a = document.getElementsByTagName('a');
  for(var i=0;i<a.length;i++){
    a[i].setAttribute('target','_blank'); 
  }
})();

// window.onload=function(){
//   clear();
// }