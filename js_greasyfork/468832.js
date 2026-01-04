// ==UserScript==
// @name         妖火免密登陆
// @namespace    https://yaohuo.me
// @version      2.22
// @description  免密登陆妖火论坛
// @author       赤松子
// @run-at       document-start
// @match        *://yaohuo.me/waplogin.aspx
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468832/%E5%A6%96%E7%81%AB%E5%85%8D%E5%AF%86%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/468832/%E5%A6%96%E7%81%AB%E5%85%8D%E5%AF%86%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==

(function() {
    let sid="         sidyaohuo=xxxxxxx";
   sid=sid.trim()
  if(sid.indexOf('sidyaohuo')>=0){
      document.cookie = sid +"  secure;";
      alert("注入cookie完成")
   }else{
      document.cookie = "sidyaohuo="+sid+"  secure;";
      alert("注入cookie完成")
   }
//alert(sid)
})();