// ==UserScript==
// @name         自动滚动
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  腾讯文档日报自动滚动
// @author       You
// @match        https://docs.qq.com/sheet/DRkhkbmpLVWFnU2dk*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508272/%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/508272/%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let gundongstyle1
    let gundongstyle2
    let aele
    var times=0

    function start(){
        gundongstyle1 = document.getElementsByClassName("scroll-y-box-pc")[0].style.transform;
        times=0
        aele.dispatchEvent(new WheelEvent('wheel', {
            deltaX: 0,
            deltaY: -1000000, 
            deltaZ: 0   
        }))
        setTimeout(()=>{
            const bbbb = setInterval(() => {
                gundongstyle2 = document.getElementsByClassName("scroll-y-box-pc")[0].style.transform;
                if(gundongstyle2!=gundongstyle1){
                    gundongstyle1=gundongstyle2
                    times=0
                }else{
                    times++
                }
                if(times>=10){
                    clearInterval(bbbb)
                    start();
                }else{
                    aele.dispatchEvent(new WheelEvent('wheel', {
                        deltaX: 0,
                        deltaY: 1, 
                        deltaZ: 0   
                    }))
                }
            }, 50)
        },10000)// 等待10秒开始滚动
    }
    const aaa=setInterval(() => {
        aele = document.getElementsByClassName("main-board")[0];
        if(aele){
            clearInterval(aaa)
            start()
        }
    }, 500)
})();