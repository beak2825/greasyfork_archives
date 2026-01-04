// ==UserScript==
// @name        哔哩哔哩修复到niconico外链
// @namespace   Violentmonkey Scripts alol
// @match       https://www.bilibili.com/video/*
// @grant       none
// @version     1.0.2
// @author      bilibili10633
// @description 2023/9/25 23:45:33
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476073/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%BF%AE%E5%A4%8D%E5%88%B0niconico%E5%A4%96%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/476073/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%BF%AE%E5%A4%8D%E5%88%B0niconico%E5%A4%96%E9%93%BE.meta.js
// ==/UserScript==
window.addEventListener('load',()=>{
  let c=0
  let x=setInterval(()=>{
        let aTags=document.querySelectorAll(".desc-info-text a")
        if(aTags==null||aTags.length===0){
            console.log("no a tag found")
            clearInterval(x)
            return
        }
        for(let i=0;i<aTags.length;i++){
            let cri='https://acg.tv/sm'
            if(aTags[i].href.startsWith(cri)){
                url=aTags[i].href.replace(cri,'https://www.nicovideo.jp/watch/sm')
                aTags[i].href=url
            }
        }
        if(c>=5){
          clearInterval(x)
        }
    },1000)
})
