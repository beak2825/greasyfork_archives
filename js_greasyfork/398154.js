// ==UserScript==
// @name         优酷自动选低清画质并全屏
// @namespace
// @version      1.1.3
// @description  a优酷自动选低清画质并全屏的插件
// @author       cw
// @license
// @namespace    http://tampermonkey.net/
// @match        https://v.youku.com/*
// @grant GM_addStyle
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/398154/%E4%BC%98%E9%85%B7%E8%87%AA%E5%8A%A8%E9%80%89%E4%BD%8E%E6%B8%85%E7%94%BB%E8%B4%A8%E5%B9%B6%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/398154/%E4%BC%98%E9%85%B7%E8%87%AA%E5%8A%A8%E9%80%89%E4%BD%8E%E6%B8%85%E7%94%BB%E8%B4%A8%E5%B9%B6%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load',function(){
        try{
            const el= document.querySelectorAll('.kui-quality-quality-item');
            const elLength=el.length
            let count =10
            if( ['智能','自动'].includes(el[elLength-1].textContent)){
                el[elLength-2].click()
            }else{
                el[elLength-1].click()
            }

            setTimeout(()=>{
                (function(){
                    const el=document.querySelector('.kui-fullscreen-icon-0')
                    count-=1
                    if(!!el){
                        el.click()
                    }else{
                        setTimeout(()=>{
                            !!count&&arguments?.callee()
                        },1000)
                    }
                })()
            },20000)
        } catch(error){
            console.log(error)
        }

    })
})();