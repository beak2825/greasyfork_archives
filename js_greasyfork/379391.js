// ==UserScript==
// @name 杀死“麦欧兔”
// @namespace killer the mailto
// @version 0.0.4
// @author 稻米鼠
// @description 如题
// @run-at document-idle
// @homepage https://meta.appinn.com/t/9230
// @supportURL https://meta.appinn.com/t/9230
// @match *://*/*
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/379391/%E6%9D%80%E6%AD%BB%E2%80%9C%E9%BA%A6%E6%AC%A7%E5%85%94%E2%80%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/379391/%E6%9D%80%E6%AD%BB%E2%80%9C%E9%BA%A6%E6%AC%A7%E5%85%94%E2%80%9D.meta.js
// ==/UserScript==

const oldLoadFun = window.onload
window.onload=function(){
  oldLoadFun && oldLoadFun()
  document.querySelectorAll('p').forEach((el, index, thisArray)=>{
    el.innerText.match(/[A-Za-z0-9+/]*={0,2}(?=[^>]*(<[^\/script|^\/style]|$))/g).forEach((strMaybeBase64)=>{
      if(strMaybeBase64.length>0){
        try{
          const strText = window.atob(strMaybeBase64)
          if(strText.match(/^([A-Za-z0-9_\-.])+\@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,6})$/) !== null){
            const reg = new RegExp(strMaybeBase64+'(?=[^>]*(<(?!\/(script|style))|$))', 'gi')
            const newCode = '<a href="mailto:'+strText+'">'+strText+'</a>'
            el.innerHTML = el.innerHTML.replace(reg, newCode)
          }
        }
        catch(e){}
      }
    })
    if(index === thisArray.length-1){
      document.querySelectorAll('a[href^=mailto]').forEach((thelink)=>{
        const themail = thelink.href.replace(/^mailto:(.*?@[^?]*).*$/i, '$1')
        thelink.onclick = function(e){ e.preventDefault(e) }
        thelink.addEventListener('click', (e)=>{
          e.preventDefault(e)
          GM_setClipboard(themail)
          alert('这是一个没有什么必要的通知，\n只是想告诉你，邮件地址成功的复制到了你的剪切板中。\n（也许吧……')
          e.preventDefault()
        })
      })
    }
  })
}