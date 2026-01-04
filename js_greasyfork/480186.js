// ==UserScript==
// @name         斗鱼删除占用CPU的元素
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在打开斗鱼任意直播间的10秒后，删除斗鱼直播间占用cpu的元素。包括顶部用户栏，一些广告，弹幕展示栏，礼物栏（但不包括背包按钮，确保能领和赠荧光棒）
// @author       飞洒克里夫
// @match        https://www.douyu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480186/%E6%96%97%E9%B1%BC%E5%88%A0%E9%99%A4%E5%8D%A0%E7%94%A8CPU%E7%9A%84%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/480186/%E6%96%97%E9%B1%BC%E5%88%A0%E9%99%A4%E5%8D%A0%E7%94%A8CPU%E7%9A%84%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let fun =function(){
        document.getElementById("js-player-toolbar").remove()
        document.getElementById("js-bottom").remove()
        document.getElementById("js-header").remove()
        document.getElementById("js-aside").remove()
        var a=document.getElementsByClassName("layout-Player-asideMainTop")
        for (var i = 0; i < a.length; i++) {
            a[i].remove();

            document.getElementById("js-room-activity").remove()
        }
    }
    let fun2=function(){
        var strId=["js-room-activity","js-header",]
        for(let i=0;i<strId.length;i++){
            document.getElementById(strId[i]).remove() ;
            //document.getElementById(strId[i]).innerHTML = "";
        }

        var a=document.getElementsByClassName("layout-Player-asideMainTop")
        for (let i = 0; i < a.length; i++) {
            a[i].remove();

            document.getElementById("js-room-activity").remove()
        }
    }
    let playerToolbarHaveBeibao=function(){
        var div=document.getElementById('js-player-toolbar')
        div.style.textAlign="right"
        var beibaoName='PlayerToolbar-backpackArea'
        var beibao=document.getElementsByClassName(beibaoName)
        beibao=beibao[0]
        //         var b=document.getElementsByClassName('Title-roomInfo')
        //         b=b[0]
        //         b.appendChild(beibao);
        div.appendChild(beibao)
        let children=div.children
        for(let i=0;i<children.length;i++){
            if(children[i].className!==beibaoName){
                children[i].remove()
            }
        }
    }
    let sleep = function(fun,time){
        setTimeout(()=>{
            fun();
        },time);
    }
    sleep(fun2,10000)
    sleep(playerToolbarHaveBeibao,10000)
    // Your code here...
})();