// ==UserScript==
// @name        屏蔽所有网站的ctrl+s操作 close_ctrl_s
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      ludengke95@gmail.com
// @description 2020/5/13 下午5:28:13
// @downloadURL https://update.greasyfork.org/scripts/403223/%E5%B1%8F%E8%94%BD%E6%89%80%E6%9C%89%E7%BD%91%E7%AB%99%E7%9A%84ctrl%2Bs%E6%93%8D%E4%BD%9C%20close_ctrl_s.user.js
// @updateURL https://update.greasyfork.org/scripts/403223/%E5%B1%8F%E8%94%BD%E6%89%80%E6%9C%89%E7%BD%91%E7%AB%99%E7%9A%84ctrl%2Bs%E6%93%8D%E4%BD%9C%20close_ctrl_s.meta.js
// ==/UserScript==
document.onkeydown = function(e){
      var keyCode = e.keyCode || e.which || e.charCode;
      var ctrlKey = e.ctrlKey || e.metaKey;
      if(ctrlKey && keyCode == 83) {
        console.log("stop ctrl+s")
        e.preventDefault();
        return false;
      }
}