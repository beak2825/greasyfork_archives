// ==UserScript==
// @name         （改）国家中小学智慧教育平台_挂机
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  挂机看 国家中小学智慧教育平台的视频，自动点击“我知道了”
// @author       kakasearch
// @match        https://www.zxx.edu.cn/teacherTraining/courseDetail*
// @match        https://basic.smartedu.cn/teacherTraining/courseDetail*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zxx.edu.cn
// @require      https://greasyfork.org/scripts/425166-elegant-alert-%E5%BA%93/code/elegant%20alert()%E5%BA%93.js?version=922763
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524805/%EF%BC%88%E6%94%B9%EF%BC%89%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0_%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/524805/%EF%BC%88%E6%94%B9%EF%BC%89%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0_%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
    let alertButton = document.querySelector("button.fish-btn.fish-btn-primary");
    if (alertButton && alertButton.innerText.trim() === "我知道了") {
        alertButton.click();
        console.log('自动点击了“我知道了”按钮');
    }
    if(document.querySelector("div.resource-item-active").querySelector("i").title == "已学完"){
        new ElegantAlertBox("准备播放下一个视频>__<")
        for(let item of document.querySelectorAll(".resource-item")){
         if (item.querySelector("i").title != "已学完"){
            item.click()
             return
         }
        }
        setTimeout(function(){
            new ElegantAlertBox("马上开始播放>__<");
            document.querySelector(".vjs-big-play-button").click()},3000)
    }else{
        document.querySelector("video").muted = true
        document.querySelector("video").play()
        document.querySelector(".vjs-big-play-button").click()
    new ElegantAlertBox("还在播放中")

    }

    },3000)
     setTimeout(function(){
         //展开目录以获取全部章节
            for(let item of document.querySelectorAll(".fish-collapse-header")){
                 item.click()
            }
     },60000)
    // Your code here...
})();