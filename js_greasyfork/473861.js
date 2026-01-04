// ==UserScript==
// @name         万能去广告
// @namespace    http://gstsgy.com/
// @version      0.1
// @description  万能去广告：可去除大部分网页广告，经典w3c。网站添加请联系微信gstsgy
// @author       guyue
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473861/%E4%B8%87%E8%83%BD%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/473861/%E4%B8%87%E8%83%BD%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 定时清
    setInterval(()=>{
    const minads = document.querySelectorAll(".popwindow")
    for(let ad of minads){
        ad.remove();
    }


    },500)


    // 谷歌广告
    setTimeout(function(){
    let ads = document.querySelectorAll(".adsbygoogle")
    //console.log(ads)
    for(let ad of ads){
        ad.remove()
    }
        // 新浪广告
     ads = document.querySelectorAll(".sinaads")
    //console.log(ads)
    for(let ad of ads){
        ad.remove()
    }


    const w3c = document.querySelector("#header_gg")
    if(w3c!==null){
        w3c.remove()
    }

          const divad5 = document.querySelector("#divad5")
    if(divad5!==null){
        divad5.remove()
    }
            const Pccard = document.querySelector(".Pc-card")
    if(Pccard!==null){
        Pccard.remove()
    }
          const GoogleActiveViewInnerContainer = document.querySelector(".GoogleActiveViewInnerContainer")
    if(GoogleActiveViewInnerContainer!==null){
        GoogleActiveViewInnerContainer.remove()
    }
  const unionAd = document.querySelector(".unionAd")
    if(unionAd!==null){
        unionAd.remove()
    }

          ads = document.querySelectorAll(".zeus_39class")
    //console.log(ads)
    for(let ad of ads){
        ad.remove()
    }
        ads = document.querySelectorAll(".left-bottom-float")
    //console.log(ads)
    for(let ad of ads){
        ad.remove()
    }
               ads = document.querySelectorAll("#right-side-bar")
    //console.log(ads)
    for(let ad of ads){
        ad.remove()
    }
                       ads = document.querySelectorAll(".allsee-list")
    //console.log(ads)
    for(let ad of ads){
        ad.remove()
    }
                  ads = document.querySelectorAll(".god-article-bottom")
    //console.log(ads)
    for(let ad of ads){
        ad.remove()
    }
    ads = document.querySelectorAll(".groom-read")
    //console.log(ads)
    for(let ad of ads){
        ad.remove()
    }

    //removeEventListener(document,"copy",xn)

}, 500)
    // Your code here...
})();