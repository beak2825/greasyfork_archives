// ==UserScript==
// @name         倍速播放视频（最高16倍）。支持国家中小学智慧教育平台、国家职业教育智慧平台
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  倍速播放看 国家中小学智慧教育平台的视频、国家职业教育智慧平台
// @author       sunsikai
// @match        *://*.zxx.edu.cn/*
// @match        *://*.smartedu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zxx.edu.cn
// @require      https://greasyfork.org/scripts/425166-elegant-alert-%E5%BA%93/code/elegant%20alert()%E5%BA%93.js?version=922763
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457892/%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%EF%BC%88%E6%9C%80%E9%AB%9816%E5%80%8D%EF%BC%89%E3%80%82%E6%94%AF%E6%8C%81%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E3%80%81%E5%9B%BD%E5%AE%B6%E8%81%8C%E4%B8%9A%E6%95%99%E8%82%B2%E6%99%BA%E6%85%A7%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/457892/%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%EF%BC%88%E6%9C%80%E9%AB%9816%E5%80%8D%EF%BC%89%E3%80%82%E6%94%AF%E6%8C%81%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E3%80%81%E5%9B%BD%E5%AE%B6%E8%81%8C%E4%B8%9A%E6%95%99%E8%82%B2%E6%99%BA%E6%85%A7%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    let Container = document.createElement('div');
    Container.id = "sp-ac-container";
    Container.style.position="fixed"
    Container.style.left="20px"
    Container.style.top="20px"
    Container.style['z-index']="999999"
    Container.innerHTML =`<button id="one" style="position:absolute; left:10x; top:10">
  播放速度调节
</button>
`
    //绑定按键点击功能
	Container.onclick = function (){
        //为所欲为 功能实现处
        if(document.querySelector('video').playbackRate==1){
            document.querySelector('video').playbackRate = 2;
            new ElegantAlertBox("播放速度2倍")
            return;
        }else if(document.querySelector('video').playbackRate==2){
            document.querySelector('video').playbackRate = 4;
            new ElegantAlertBox("播放速度4倍")
            return;
        }else if(document.querySelector('video').playbackRate==4){
            document.querySelector('video').playbackRate = 8;
            new ElegantAlertBox("播放速度8倍")
            return;
        }else if(document.querySelector('video').playbackRate==8){
            document.querySelector('video').playbackRate = 16;
            new ElegantAlertBox("播放速度16倍")
            return;
        }else if(document.querySelector('video').playbackRate==16){
            document.querySelector('video').playbackRate = 32;
            new ElegantAlertBox("播放速度16倍")
            return; 
        }else if(document.querySelector('video').playbackRate==32){
            document.querySelector('video').playbackRate = 64;
            new ElegantAlertBox("播放速度16倍")
            return;
        }else {
            document.querySelector('video').playbackRate = 1;
            new ElegantAlertBox("播放速度1倍")
            return;
        }
	};
    document.body.appendChild(Container);
    // Your code here...
})();