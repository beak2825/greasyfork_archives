// ==UserScript==
// @name         fb资料库工具x
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  x
// @author       You
// @match        https://www.facebook.com/ads/*
// @icon         https://www.google.com/s2/favicons?domain=facebook.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431255/fb%E8%B5%84%E6%96%99%E5%BA%93%E5%B7%A5%E5%85%B7x.user.js
// @updateURL https://update.greasyfork.org/scripts/431255/fb%E8%B5%84%E6%96%99%E5%BA%93%E5%B7%A5%E5%85%B7x.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //let ban = document.querySelector("._95vs._25b6")
    //console.log(ban)
    //ban.onclick = ()=>{removeDiv()}
    function removeDiv(){
        let d = document.querySelectorAll("._9ccv._9raa")
        d.forEach((i)=>{
            console.log("----------i:",i)
            if (i != d[0]) {
                console.log("remove",d[i])
                i.parentNode.removeChild(i)
            }
        })
    }

    //remove tabs
    function removeTabs(){
      removeDiv()
      let f = document.querySelector("._9cb_")
      let c = document.querySelectorAll("._9cb_ ._99s5");
      for(let i = 0; i<29; i++){
          f.removeChild(c[i])
      }
    }
    var cid2 = setInterval(getMain,2000)
    var div = document.createElement("div")
    var btn = document.createElement("button")
    let main;
    function getMain(){
        try{
            main = document.querySelector("#globalContainer")
            main.parentNode.insertBefore(div, main)
            //插入按钮
            main.parentNode.insertBefore(btn, main)
            if(main != null) clearInterval(cid2)
        }catch(e){}
    }
    //let main = document.querySelector("._7lca")
    //btn绑定点击事件
    btn.onclick = ()=>(removeTabs())
    //修改样式
    div.style.display = "none"
    div.style.position = "absolute"
    div.style.background = "white"
    div.style.paddingTop = "40px"
    div.style.zIndex = 999
    btn.innerText = "Toggle"
    btn.style.zIndex = 999999
    btn.style.position = "sticky"
})();