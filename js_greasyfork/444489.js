// ==UserScript==
// @name        慕课讨论区显示完整姓名
// @namespace   Violentmonkey Scripts
// @match       https://www.icourse163.org/*
// @grant       none
// @version     1.0
// @author      -
// @description 2022/5/5 11:38:58
// @license MTT
// @downloadURL https://update.greasyfork.org/scripts/444489/%E6%85%95%E8%AF%BE%E8%AE%A8%E8%AE%BA%E5%8C%BA%E6%98%BE%E7%A4%BA%E5%AE%8C%E6%95%B4%E5%A7%93%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/444489/%E6%85%95%E8%AF%BE%E8%AE%A8%E8%AE%BA%E5%8C%BA%E6%98%BE%E7%A4%BA%E5%AE%8C%E6%95%B4%E5%A7%93%E5%90%8D.meta.js
// ==/UserScript==
window.onload=function(){
  a=document.getElementsByClassName('f-fcgreen')
  for (var i=0;i<a.length;i++){
    a[i].text=a[i].title
}
}
