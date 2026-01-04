// ==UserScript==
// @name         4K影视优化
// @namespace    http://tampermonkey.net/
// @version      v1.0
// @description  优化使用体验
// @author       夏天的清晨
// @match        https://www.4kvm.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=4kvm.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537736/4K%E5%BD%B1%E8%A7%86%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/537736/4K%E5%BD%B1%E8%A7%86%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  'use strict'

  const observer = new MutationObserver(() => {
    closeADS()
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })


  function closeADS() {
    observer.disconnect()
    // 移除滚屏广告
    const ad_1 = document.querySelector('#post-999999')
    if (ad_1) {
      ad_1.remove()
      console.log('已移除 ad_1')
    }

    // 移除播放页面热门列表广告
    const bar = document.querySelector('.sidebar.right')
    if (bar) {
       const ad = bar.children[0].children[0].children[0]
       if(ad){
         ad.remove()
         console.log('已移除 播放页热门播放广告')
       }

    }

   // 删除首页内嵌广告
   const contenedor = document.querySelector('#contenedor')
   if (contenedor) {
       if(contenedor.children[1].className=='dooplay_player'){// 播放页面时
           const ad = contenedor.querySelector('.content.right').children[3]
           if(ad){
             ad.remove()
             console.log('已移除 播放页内嵌广告(#1)')
           }
       }else if(contenedor.children[1].className=='letter_home'){// 首页时
         const ad = contenedor.querySelector('.content.right').children[1]
         if(ad){
            ad.remove()
            console.log('已移除 首页内嵌广告(#2)')
          }
       }
    }

    // 移除通知
    const letter = document.querySelector('.letter_home')
    if (letter) {
      letter.remove()
      console.log('已移除 letterHome')
    }


   // 删除影片信息区域广告
   const content = document.querySelector('.content.right')
   if(content){
     if(content.children[1].className=='dooplay_player'){
       const ad = content.children[3]
       ad.remove()
       console.log('已移除 影片信息区域广告(#1)')
     }
   }
  }
})()

