// ==UserScript==
// @name         Vibrate Simulator
// @namespace    https://qinlili.bid
// @version      0.1
// @description  让没有震动的设备模拟震动效果
// @author       琴梨梨
// @match        *://*/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/439319/Vibrate%20Simulator.user.js
// @updateURL https://update.greasyfork.org/scripts/439319/Vibrate%20Simulator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sleep = delay => new Promise((resolve) => setTimeout(resolve, delay))
    var css = "@keyframes shake {  10%, 90% { transform: translate3d(-1px, 0, 0); }   20%, 80% { transform: translate3d(+2px, 0, 0); }  30%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(+4px, 0, 0); }50% { transform: translate3d(-4px, 0, 0); }}";
    var style = document.createElement('style');
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    document.getElementsByTagName('head')[0].appendChild(style);
    let needBreak=false
    navigator.vibrate=async time=>{
        if(time==0){
            document.body.style.animation=""
            needBreak=true
        }else{
            if(time.length){
                for(let num=0;time[num];num=num+2){
                    if(needBreak){
                        needBreak=false;
                        break;
                    }
                    document.body.style.animation="shake "+time[num]+"ms ease-in-out"
                    await sleep(time[num])
                    document.body.style.animation=""
                    await sleep(time[num+1])
                }
            }else{
                document.body.style.animation="shake "+time+"ms ease-in-out"
                setTimeout(()=>{document.body.style.animation=""},time)
            }
        }
    }
})();