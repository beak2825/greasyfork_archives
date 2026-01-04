// ==UserScript==
// @name         智慧职教
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动切换下一个视频,手动切换章节可能导致失效,切换后需要刷新
// @author       ccccq
// @match        *://course.icve.com.cn/learnspace/learn/learn/templateeight/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=icve.com.cn
// @grant        none
// @license      ccccq
// @downloadURL https://update.greasyfork.org/scripts/462936/%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/462936/%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99.meta.js
// ==/UserScript==

(function() {
    setTimeout(main,3000)
    function main(){
        // 获取必备元素
        var mainContent = document.getElementsByTagName("iframe")["mainContent"]
        var mainFrame = mainContent.contentWindow.document.querySelector("#mainFrame")
        var video = mainFrame.contentWindow.document.querySelector("video")
        // 当前播放的视频
        var now = mainContent.contentWindow.document.querySelector(".s_pointerct")
        var nowIndex
        // 当前视频所在的节
        var node = now.parentNode
        var nodeIndex
        for(var i = 0;i < node.children.length;i++){
            if(node.children[i] == now){
                // 记录视频是这一节的第几个
                nowIndex = i
            }
        }
        // 当前视频所在的章节
        var section = node.parentNode
        var sectionIndex
        for(var j = 0;j < section.children.length;j++){
            if(section.children[j] == node){
                // 记录节是这一章的第几个
                nodeIndex = j
            }
        }
        if(now.children[2].innerText.indexOf("文档：") != -1){
            // 延迟2秒再跳转
            setTimeout(function(){
                clearInterval(time)
                nextVideo(node,nowIndex,nodeIndex,section,sectionIndex)
            },2000)
        }else if(now.children[2].innerText.indexOf("视频：") == -1 || now.querySelector(".done_icon_show")){
            clearInterval(time)
            // 当前不是视频也不是文档,或者当前视频已经完成则下一个视频
            nextVideo(node,nowIndex,nodeIndex,section,sectionIndex)
        }
        var time = setInterval(function(){
            if(video.duration - video.currentTime <= 3){
                clearInterval(time)
                nextVideo(node,nowIndex,nodeIndex,section,sectionIndex)
            }
        },1000)
    }
    function nextVideo(node,nowIndex,nodeIndex,section,sectionIndex){
        setTimeout(main,3000)
        if(sectionIndex == section.children.length-1){
            // 到了当前章节的最后一个视频
            section.nextElementSibling.nextElementSibling.children[1].children[0].click()
        }
        else if(nodeIndex == node.children.length-1){
            // 到了当前节的最后一个视频
            node.nextElementSibling.nextElementSibling.children[0].click()
        }else{
            // 点击下一个视频
            node.children[nowIndex+1].click()
        }
    }
})();