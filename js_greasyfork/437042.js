// ==UserScript==
// @name        视频播放
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  自用视频播放
// @author       rubysiu
// @match        *://*.v.qq.com/x/*
// @match        *://*.v.youku.com/v_show/*
// @match        *://*.iqiyi.com/*
// @match        *://*.mgtv.com/*
// @exclude      *://www.iqiyi.com/
// @exclude      *://www.mgtv.com/
// @icon         https://s3.bmp.ovh/imgs/2021/12/ab22ca08387d82f2.jpg
// @grant        none
// @license      rubysiu
// @downloadURL https://update.greasyfork.org/scripts/437042/%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/437042/%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
     function toNext(api){
        let videoUrl = location.href;
         console.log(api)
        window.open(`${api}${videoUrl}`,'_blank');
    }
    let dom = document.createElement("ruby");
    let apiList = [{"name":"解析啦","url":"https://api.jiexi.la/?url="},{"name":"OK解析","url":"https://okjx.cc/?url="}]
    dom.style.background = "rgb(84 220 140 / 100%)";
    dom.style.position = "fixed";
    dom.style.padding = "5px";
    dom.style.color = "#fff";
    dom.style.top = "50%";
    dom.style.zIndex = "9999";
    dom.style.borderRadius = "0 5px 5px 0";
    document.body.appendChild(dom);
    let apiListDoma = "";
    for (const key in apiList) {
        let domDv = document.createElement("div");
        domDv.innerText = apiList[key].name
        domDv.addEventListener("click",function(){
          toNext(`${apiList[key].url}`)
        })
        dom.appendChild(domDv)
    }
})();