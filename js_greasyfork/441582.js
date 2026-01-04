// ==UserScript==
// @name         cesium 中文网 交换评论和导航
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  cesium中文网交换评论和下一篇
// @author       wei
// @match        cesium.xin/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cesium.xin
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441582/cesium%20%E4%B8%AD%E6%96%87%E7%BD%91%20%E4%BA%A4%E6%8D%A2%E8%AF%84%E8%AE%BA%E5%92%8C%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/441582/cesium%20%E4%B8%AD%E6%96%87%E7%BD%91%20%E4%BA%A4%E6%8D%A2%E8%AF%84%E8%AE%BA%E5%92%8C%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==

(function() {   
    var t = document.querySelector("#main > nav");
    var com = document.querySelector("#comments")
    swapElements(t,com)
})();

function swapElements(a, b) {
  if (a == b) return
  //记录父元素
  var bp = b.parentNode,
    ap = a.parentNode
  //记录下一个同级元素
  var an = a.nextElementSibling,
    bn = b.nextElementSibling
  //如果参照物是邻近元素则直接调整位置
  if (an == b) return bp.insertBefore(b, a)
  if (bn == a) return ap.insertBefore(a, b)
  if (a.contains(b))
    //如果a包含了b
    return ap.insertBefore(b, a), bp.insertBefore(a, bn)
  else return bp.insertBefore(a, b), ap.insertBefore(b, an)
}