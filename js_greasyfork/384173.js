// ==UserScript==
// @name         斗鱼默认最高画质
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  切换斗鱼最高画质
// @author       lemon
// @match        http*://www.douyu.com/*
// @icon         https://www.douyu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384173/%E6%96%97%E9%B1%BC%E9%BB%98%E8%AE%A4%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/384173/%E6%96%97%E9%B1%BC%E9%BB%98%E8%AE%A4%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
        const startTime = new Date().getTime()
        let count = 1
        function autoClick(){
            let dom = Array.from(document.querySelectorAll('input')).find((item,index)=>{return item.value.includes('画质')})
            if(dom){
                const ul_dom = Array.from(dom.parentNode.childNodes).find((item)=>item.tagName=='UL')
                const li_dom = Array.from(ul_dom.childNodes)
                let seleteIndex = 0
                li_dom.forEach((item,index)=>{
                    if(item.className!=''){
                        seleteIndex = index
                    }
                })
                if(seleteIndex==0){
                    const endTime = new Date().getTime()
                    console.log('默认为最高画质，无需切换')
                    console.log(`脚本结束，耗时：${(endTime-startTime)/1000}秒`)
                }else{
                    const endTime = new Date().getTime()
                    const old_quality = li_dom[seleteIndex].innerText
                    const new_quelity = li_dom[0].innerText
                    li_dom[0].click()
                    console.log(`已从${old_quality}切换到${new_quelity}`)
                    console.log(`脚本结束，耗时：${(endTime-startTime)/1000}秒`)
                }
            }else{
                if(count++<20){
                    setTimeout(()=>{
                        autoClick()
                    },1000)
                }else{
                    console.log('脚本结束，可能此网站不是直播间')
                }
            }
        }
        autoClick()
    }
})();