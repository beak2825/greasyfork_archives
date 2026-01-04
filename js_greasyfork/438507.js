// ==UserScript==
// @name        2022my
// @namespace    http://tampermonkey.net/
// @version      20120114ws
// @description  自用视频播放
// @author       rubysiu
// @match        *://m.v.qq.com
// @match        *://v.youku.com/v_show/*
// @match        *://www.iqiyi.com/*
// @match        *://www.mgtv.com/*
// @exclude      *://m.iqiyi.com/
// @exclude      *://www.mgtv.com/
// @icon         https://s3.bmp.ovh/imgs/2021/12/ab22ca08387d82f2.jpg
// @grant        none
// @license      rubysiu
// @downloadURL https://update.greasyfork.org/scripts/438507/2022my.user.js
// @updateURL https://update.greasyfork.org/scripts/438507/2022my.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    // Your code here...
     let videoUrl = location.href;
    let dom = document.createElement("ruby");
    let apiList = [{"name":"解析啦","url":"https://parsing.23at.cn/api/?type=app&key=Drm6fGECnTkXuKzGRl&url="},{"name":"OK解析","url":"https://okjx.cc/?url="}]
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
        apiListDoma += `<div style="padding:4px;font-weight: bold;"><a target="_blank" href="`+apiList[key].url+videoUrl+`" >`+apiList[key].name+`</a></div>`
        }
    dom.innerHTML = apiListDoma
})();