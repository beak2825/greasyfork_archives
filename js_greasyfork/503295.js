// ==UserScript==
// @name         洛谷题单排名去除器
// @namespace    http://tampermonkey.net/
// @version      2024-08-12
// @description  阻止洛谷题单的排行榜（同学提的需求）
// @author       haozexu
// @match        https://www.luogu.com.cn/*
// @icon         https://cdn.luogu.com.cn/upload/usericon/555833.png
// @grant        none
// @license MIT
// @name:en Remove luogu ranking
// @description:en Remove trainings' ranking list from luogu.com
// @downloadURL https://update.greasyfork.org/scripts/503295/%E6%B4%9B%E8%B0%B7%E9%A2%98%E5%8D%95%E6%8E%92%E5%90%8D%E5%8E%BB%E9%99%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/503295/%E6%B4%9B%E8%B0%B7%E9%A2%98%E5%8D%95%E6%8E%92%E5%90%8D%E5%8E%BB%E9%99%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    console.log("[hzxScript]ranking list is removed.")
  //  while(document.querySelector("ul.items[data-v-0e1ae304]>li:nth-child(3)")==null);
    var special=function(){
       var obs=new MutationObserver(function(){

            var lt=document.querySelector("div.full-container div.card.padding-default")
            if(lt!=null && /training\/[0-9]+/.test(window.location.href.toString())){
                lt.remove()
                document.querySelector("h1[data-v-2dfcfd35]").innerHTML="不是，这都还要看排名吗？我可是特判过的"
                document.querySelector("h1[data-v-2dfcfd35]").onclick=function(e){
                         window.location.href=window.location.href.toString().replace("rank","problems")
                    window.location.reload()
                }
                console.log("removed")
            }else{console.log("not found")}

        })
        obs.observe(document.querySelector("html"),{subtree:true,childList:true})
    }
    if(window.location.href.toString().includes("#rank")){
         special()
    }else{
        var obs=new MutationObserver(function(){
            if(window.location.href.toString().includes("#rank")){
                  special()
                  obs.disconnect()
            }
            var lt=document.querySelector("ul.items[data-v-0e1ae304]>li:nth-child(3)")
            if(lt!=null && /training\/[0-9]+/.test(window.location.href.toString())){
                lt.remove()
                console.log("removed")
            }else{console.log("not found")}

        })
        obs.observe(document.querySelector("html"),{subtree:true,childList:true})
    }
    
    

    // Your code here...
})();