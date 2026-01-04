// ==UserScript==
// @name         喜马拉雅倍速快捷键
// @description  通过shift+上下方向键控制喜马拉雅播放器倍速。
// @namespace    akari
// @version      0.1
// @author       Pikaqian
// @match        https://www.ximalaya.com/*
// @icon         https://www.ximalaya.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429302/%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%E5%80%8D%E9%80%9F%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/429302/%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%E5%80%8D%E9%80%9F%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function change(num){
        var now=document.getElementsByClassName("btn play-rate")[0]
        var now_speed=now.childNodes[1]
        var new_speed=now.previousSibling
        for(var i=0;i<new_speed.childNodes.length;i++){
            var new_click=new_speed.childNodes[i]
            if(new_click.innerText==3&&now_speed.data==2&&event.keyCode=="38"){
                new_click.click()
                break
            }
            else if(new_click.innerText==2&&now_speed.data==3&&event.keyCode=="40"){
                new_click.click()
                break
            }
            else if(new_click.innerText==parseFloat(now_speed.data)+parseFloat(num)){
                new_click.click()
                break
            }
        }
    }
    window.addEventListener('keydown',function(event){
        if(event.shiftKey==true){
            var num=0.25
            if(event.keyCode=="38"){
                num=0.25
                change(num)
            }
            else if(event.keyCode=="40"){
                num=-0.25
                change(num)
            }
        }
    })
})();