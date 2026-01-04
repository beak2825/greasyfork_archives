// ==UserScript==
// @name         Scrolling Assistant
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scrolling Assistanta
// @author       YouRan01
// @match        https://lms.ouchn.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ouchn.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454030/Scrolling%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/454030/Scrolling%20Assistant.meta.js
// ==/UserScript==

(function() {
    setInterval(function(){
        var doms = document.getElementsByTagName("video");
        if(doms.length>0){
            var click = document.getElementsByClassName("mvp-toggle-play mvp-first-btn-margin")[0];
            var clickEvent = document.createEvent('MouseEvents')
            clickEvent.initEvent('click', false, false)
            click.dispatchEvent(clickEvent)
            for(let dom of doms){
                dom.volume=0
                dom.playbackRate=8
                dom.currentTime=dom.duration-60
                dom.addEventListener('ended', function () {
                    setTimeout(function(){
                        var click = document.getElementsByClassName("next ng-binding ng-scope")[0];
                        var clickEvent = document.createEvent('MouseEvents')
                        clickEvent.initEvent('click', false, false)
                        click.dispatchEvent(clickEvent)
                    },1000)
                }, false);
            }
        }else{
            var a = document.getElementsByClassName("next ng-binding ng-scope")[0];
            var aa = document.createEvent('MouseEvents')
            aa.initEvent('click', false, false)
            a.dispatchEvent(aa)
        }
    },30000)
    // Your code here...
})();