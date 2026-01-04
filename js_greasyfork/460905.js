// ==UserScript==
// @name        复制超链接文字增强
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       GM_addStyle
// @version     1.0
// @author      Docase
// @description 2023/2/28 16:09:38
// @downloadURL https://update.greasyfork.org/scripts/460905/%E5%A4%8D%E5%88%B6%E8%B6%85%E9%93%BE%E6%8E%A5%E6%96%87%E5%AD%97%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/460905/%E5%A4%8D%E5%88%B6%E8%B6%85%E9%93%BE%E6%8E%A5%E6%96%87%E5%AD%97%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==


GM_addStyle(`a {pointer-events: var(--disable-link,auto);}`)
window.disableLinkTimer = null;


window.addEventListener("keydown",(e)=>{

  if(e.altKey){
    document.documentElement.style.setProperty("--disable-link","none")
    if(window.disableLinkTimer) clearTimeout(window.disableLinkTimer)
    window.disableLinkTimer = setTimeout(()=>{
      document.documentElement.style.setProperty("--disable-link","auto")
    },100)
  }

})