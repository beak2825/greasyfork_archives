// ==UserScript==
// @name         百度搜索去广告
// @namespace    gstsgy
// @version      0.0.2
// @description  百度搜索去广告,优化百度搜索,简单粗暴
// @author       You
// @match        https://www.baidu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470647/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/470647/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    console.log('百度,我来了')
setInterval(()=>{

    const spanAll = document.querySelectorAll("span")
    for (const span of spanAll) {
        if (span.textContent === "广告") {
            const div10 = span.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
      
            if(div10!==null){
                div10.remove();
            }

        }
    }
    //console.log("aaaaa")
    const aall = document.querySelectorAll("a")
    for (const a of aall) {
        if (a.textContent === "广告") {
            const div10 = a.parentNode.parentNode;
            if(div10!==null){
                div10.remove();
            }
        }
    }

    const divs = document.querySelectorAll("div")
    for(const div of divs){
        const preTextContent = div.textContent.substring(0,20);

        if(preTextContent.indexOf("本地惠生活")!==-1){
            div.remove()
        }
    }

    const right = document.querySelector("#content_right")
    if(right!==null){
        right.remove();
    }
},500)
})();