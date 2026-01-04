// ==UserScript==
// @name         hello lzp
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world! lianxi!
// @author       You
// @match        *://*
// @match        *://*/*
// @match        *://*/*/*

// @icon         none
// @license      AGPL License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455867/hello%20lzp.user.js
// @updateURL https://update.greasyfork.org/scripts/455867/hello%20lzp.meta.js
// ==/UserScript==

// 匿名函数
(function() {
    // 启用严格模式
    'use strict';
    // console.log('第四次上传')
    var link1 = document.createElement('link');
    document.head.appendChild(link1);
    link1.rel="stylesheet"
    link1.href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"

    var img2=document.createElement('img');
    document.body.appendChild(img2);
    img2.src="https://pic.baike.soso.com/p/20120724/20120724100154-699505001.jpg";
    img2.style.cssText="width:75px;height:75px;position: absolute;z-index:99999999 !important"

    // 鼠标移动事件
    document.onmousemove =function(ev) {
        var Ev = ev || window.event;
        var mousePos = mouseCoords(Ev);

        img2.style.left=mousePos.x+2+'px';
        img2.style.top=mousePos.y+2+'px';
        // console.log(img2.style.left)
    }
    function mouseCoords(ev) {
        if (ev.pageX || ev.pageY) {
            return {x: ev.pageX, y: ev.pageY};
        }
        return {
            x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
            y: ev.clientY + document.body.scrollTop - document.body.clientTop
        };
    }

    var div1=document.createElement('div')
        document.body.appendChild(div1)
        div1.style="border-radius:50%;opacity:0;width:400px;height:400px;background-color: #f5f5f5;z-index:-1;position: absolute;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none"
    //鼠标点击事件
    document.onclick=function(ev){

        if(div1.classList.contains("animate__animated")){
            // div1.style.animationPlayState="paused"//暂停动画
            div1.classList.remove("animate__animated","animate__zoomIn")
            setTimeout(() => {
                div1.classList.add("animate__animated","animate__zoomIn")
            }, 0);
            
        }else{
            div1.classList.add("animate__animated","animate__zoomIn")
        }
                
                // div1.style.opacity="0.1";

                console.log('你点击了鼠标')

                var Ev = ev || window.event;
                var mousePos = mouseCoords(Ev);

                div1.style.left=mousePos.x-200+'px';
                div1.style.top=mousePos.y-200+'px';
                
                setTimeout(() => {
                    div1.classList.remove("animate__animated","animate__zoomIn")
                    // div1.style.opacity="0"
                }, 1000);
        }
    
})();