// ==UserScript==
// @name        ptt imgur quick fix
// @namespace   https://blog.maple3142.net/
// @match       https://www.ptt.cc/bbs/*
// @description 暫時修好 ptt.cc 無法顯示 imgur 圖片的問題 (2021/08)
// @grant       none
// @version     1.0
// @author      maple3142
// @downloadURL https://update.greasyfork.org/scripts/430726/ptt%20imgur%20quick%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/430726/ptt%20imgur%20quick%20fix.meta.js
// ==/UserScript==

addEventListener('load',()=>{
  const els = Array.from(document.querySelectorAll('iframe')).filter(x=>x.src.includes('imgur.com'))
  for (const el of els){
    el.referrerPolicy='no-referrer'
    const cloned=el.cloneNode(true) // updating src will clobber browser's history
    cloned.src=cloned.src+'&t='+Math.random() // prevent caching
    el.parentNode.replaceChild(cloned,el)
  }
})
