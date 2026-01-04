// ==UserScript==
// @name         这是我的测试代码
// @namespace 	 test-lansing
// @version      1.0.10
// @description  test
// @author       lansing
// @include      *://procurement*

// @downloadURL https://update.greasyfork.org/scripts/397658/%E8%BF%99%E6%98%AF%E6%88%91%E7%9A%84%E6%B5%8B%E8%AF%95%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/397658/%E8%BF%99%E6%98%AF%E6%88%91%E7%9A%84%E6%B5%8B%E8%AF%95%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==
window.onload = ()=>{
  const style =  document.createElement('style');
  style.innerHTML = '.navbar{background:linear-gradient(#666 10%,white)!important}';
  document.head.appendChild(style);
}
