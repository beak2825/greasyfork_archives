// ==UserScript==
// @name         自主学习
// @namespace    https://www.jsu.edu.cn/
// @version      1.0
// @description  自主学习 天天进步
// @author       JSU
// @match        https://dangjian.jsu.edu.cn/web/pschool/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=254.17
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/466591/%E8%87%AA%E4%B8%BB%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/466591/%E8%87%AA%E4%B8%BB%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.warn("智慧党建 自动学习 自主学习脚本 做新时代的好青年应该要自主学习")
    console.warn("请将控制台模式改为‘警告‘及以上级别，本插件会使用警告发布信息")
    // 判断当前是否在dangjian.jsu.edu.cn
    if (window.location.host !== 'dangjian.jsu.edu.cn') {
        console.warn('当前不在dangjian.jsu.edu.cn')
        return;
    }
    // 循环检测是否跳出窗口
    let timer = setInterval(() => {
        if (document.querySelector('.el-message-box')) {
            document.querySelector('.el-message-box').querySelector('.el-message-box__btns').querySelector('button').click()

        }
    }, 1000)

    // 将nodeList转换为数组
    let sleepTime = 3
    let isCheck = 0
    let now = 0
    let videoList = []
    let checkList = setInterval(() => {
        if (sleepTime > 0) {
            console.error(1)
            sleepTime--
            return
        }
        if (isCheck == 0) {
            videoList = Array.prototype.slice.call(
                document.querySelectorAll("#pane-1 > div.catalogue-wrapper > div.chapter-box > div.children-box > div.node-box")
            )
            let now = 0;
            for (let j = 0; j < videoList.length; j++) {
                // let name = document.querySelector('div.name').innerText
                if (videoList[j].querySelector('div.status-box.start')) {
                    now = j
                    break
                }
            }
            console.warn(now)
            console.warn(videoList)
            console.warn("Chrome 要求使用用户脚本播放视频时必须Mute")
            document.querySelector("#mplayer-media-wrapper > div.video-wrapper > video").setAttribute("mute",true)
            videoList[now].click()
            isCheck = 1
            return
        }
        if(document.querySelector("#app > div > div.main-box > div > div > div.resource-box > div.video-box > div > div.control-box > div.top-box > div.left-box > div.player-btn.button-box > div:nth-child(1)")){
            let noPlayBtn = document.querySelector("#app > div > div.main-box > div > div > div.resource-box > div.video-box > div > div.control-box > div.top-box > div.left-box > div.player-btn.button-box > div:nth-child(1)")
            if(noPlayBtn.style.display === ""){
                console.warn("视频已经停止播放了，继续播放！")
                noPlayBtn.click()
            }
        }
        while (now < videoList.length) {

            console.warn(`当前任务列表 ${now+1} / ${videoList.length}`)
            if (videoList[now].querySelector('div.status-box.start')) {
                let name = videoList[now].querySelector('div.name').innerText
                console.warn("正在播放" + name)
                break;
            } else if (videoList[now].querySelector('div.status-box.finish')) {
                let name = videoList[now].querySelector('div.name').innerText
                console.warn("已播放完成：" + name + "等待五秒")
                if(now < videoList.length){
                    now++
                    console.warn("Chrome 要求使用用户脚本播放视频时必须Mute")
                    document.querySelector("#mplayer-media-wrapper > div.video-wrapper > video").setAttribute("mute",true)
                    videoList[now].click()
                    sleepTime = 3
                }else{
                    console.warn("当前任务已完成！")
                    clearInterval(checkList)
                    break
                }
            } else if (videoList[now].querySelector('div.status-box')) {
                let name = videoList[now].querySelector('div.name').innerText
                console.warn("未播放：" + name + "等待五秒")
                console.warn("Chrome 要求使用用户脚本播放视频时必须Mute")
                document.querySelector("#mplayer-media-wrapper > div.video-wrapper > video").setAttribute("mute",true)
                videoList[now].click()
                sleepTime = 3
            }
        }

    }, 1000)
})();