// ==UserScript==
// @name         布局优化小助手
// @namespace    https://qinlili.bid
// @version      0.2
// @description  优化各种显示器的体验
// @author       琴梨梨
// @match        */*
// @grant        none
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/436150/%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/436150/%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var whiteList=["www.yuketang.cn","www.bilibili.com"]
    var useWhiteList=false
    //优化最小宽度导致显示不全
    var enableMinWidthRewrite=true
    // 解除最大宽度限制
    var enableMaxWidthRewrite=true
    //启用智能（呆子）预测固定宽度解除，不推荐启用
    var enableAutoWidthPredictRewrite=false
    if(!useWhiteList||whiteList.includes(document.location.host)){
        console.log("Process this page.")
        var divList=document.getElementsByTagName("div")
        var currentWidth=window.visualViewport.width
        var doFormat=function(){
            for(var i=0;divList[i];i++){
                    var divMinWidth=parseInt(window.getComputedStyle(divList[i]).minWidth)
                    var divMaxWidth=parseInt(window.getComputedStyle(divList[i]).maxWidth)
                if(enableMinWidthRewrite){
                    if(divMinWidth>150&&divMinWidth>(currentWidth-500)){
                        console.log("处理最小宽度")
                        console.log(divList[i])
                        divList[i].style.minWidth=0
                    }
                }
                if(enableMaxWidthRewrite){
                    if(divMaxWidth>500&&divMaxWidth<currentWidth){
                        console.log("处理最大宽度")
                        console.log(divList[i])
                        divList[i].style.maxWidth="99999px"
                    }
                }
                if(enableAutoWidthPredictRewrite){
                    if(((divList[i].parentElement.clientWidth-divList[i].clientWidth)>200)&&(divList[i].clientWidth>400)&&((divList[i].parentElement.clientWidth*0.9)>divList[i].clientWidth)){
                        console.log("解除宽度锁定")
                        console.log(divList[i])
                        divList[i].style.width="90%"
                    }
                }
            }
            actionBtn.innerText="优化完成"
        }
        var actionBtn=document.createElement("button")
        var first = document.body.firstElementChild
        actionBtn.style="z-index:2147483647;position:fixed"
        actionBtn.innerText="优化显示"
        actionBtn.onclick=doFormat
        actionBtn.oncontextmenu=function(){actionBtn.style.visibility="hidden";return false;}
        document.body.insertBefore(actionBtn, first);
    }

})();