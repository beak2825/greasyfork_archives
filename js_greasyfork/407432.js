// ==UserScript==
// @name        知乎外链跳转取消
// @namespace   Violentmonkey Scripts
// @match       https://*.zhihu.com/*
// @grant       unsafeWindow
// @version     1.1
// @author      -
// @description 取消知乎外链跳转
// @downloadURL https://update.greasyfork.org/scripts/407432/%E7%9F%A5%E4%B9%8E%E5%A4%96%E9%93%BE%E8%B7%B3%E8%BD%AC%E5%8F%96%E6%B6%88.user.js
// @updateURL https://update.greasyfork.org/scripts/407432/%E7%9F%A5%E4%B9%8E%E5%A4%96%E9%93%BE%E8%B7%B3%E8%BD%AC%E5%8F%96%E6%B6%88.meta.js
// ==/UserScript==

(window.onload = function(){
var a = document.getElementsByTagName('a')
for(item of a){
  if(item.href.includes("target=")){
    item.href = unescape(item.href).split("target=")[1]
  }
}
})()