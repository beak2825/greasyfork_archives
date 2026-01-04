// ==UserScript==
// @name        交易猫自动刷新
// @namespace   Violentmonkey Scripts
// @match       https://m.jiaoyimao.com/seller/goodslist*
// @grant       none
// @version     1.0
// @author      FG
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@1
// @description 2022/1/17 下午2:33:43
// @downloadURL https://update.greasyfork.org/scripts/438659/%E4%BA%A4%E6%98%93%E7%8C%AB%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/438659/%E4%BA%A4%E6%98%93%E7%8C%AB%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

var refsh=function(){
  window.location.reload()
}
setInterval(refsh,1000*60*10)

document.querySelectorAll(".goods-card-footer").forEach(item => item.style.display="block")
  document.querySelectorAll(".J-refresh-goods").forEach(
   item=>{ 
    item.classList.remove("disabled"); 
})
setTimeout(function(){
  document.querySelectorAll(".J-refresh-goods").forEach(
    item=>{ 
      item.classList.remove("disabled"); 
      item.click(); 
      console.log(item); 
  })
},5000)
