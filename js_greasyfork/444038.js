// ==UserScript==
// @name 今日热榜优化
// @namespace https://www.runningcheese.com
// @version 0.2
// @description 今日热榜优化，宽度减少，去除广告等。
// @author RunningCheese
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.tophub.today/*
// @downloadURL https://update.greasyfork.org/scripts/444038/%E4%BB%8A%E6%97%A5%E7%83%AD%E6%A6%9C%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/444038/%E4%BB%8A%E6%97%A5%E7%83%AD%E6%A6%9C%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
let css = `
    
/*内容隐藏*/
.cq,
.alert-warning,
.bb-TT {display:none;}
   
/*宽度调整*/
body {max-width:80%;margin:auto;}
    
/*字体调整*/    
.mp .aa .tt,
.cc-cd-cb .cc-cd-cb-l .cc-cd-cb-ll {font-size:14px;}
 
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
