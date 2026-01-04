// ==UserScript==
// @name         uooconline_killer.js
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  优课在线免受暂停的干扰 + 每天凌晨自动进入学习页面实现签到
// @author       wuuconix
// @match        http://www.uooconline.com/*
// @icon         http://www.uooconline.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444490/uooconline_killerjs.user.js
// @updateURL https://update.greasyfork.org/scripts/444490/uooconline_killerjs.meta.js
// ==/UserScript==

(function() {
    let video, start
    const observer = new MutationObserver(() => { //页面变化监听器
        let temp = document.querySelector("button[title='Play Video']")
        let backButton = document.querySelector("a.goback.fl_right.ng-scope")
        let enterButton = document.querySelector("a.btn.btn-danger.ng-binding.ng-scope")
        if (temp !== null && temp != start) { //开始按钮变化 说明页面改变了
            start = temp
            start.click() //自动点击播放按钮
            video = document.querySelector("video") //更新视频标签
            localStorage.setItem("url", window.location.href)
            video.addEventListener("pause", () => {
                video.play()
                    .then(() => console.log("视频重新播放成功"))
                    .catch(err => console.log(`视频重新播放失败: ${err}`))
            })
            video.addEventListener("ended", () => {
                backButton.click()
            })
        }
        if (enterButton) {
            let honor = new Date().getHours()
            let minute = new Date().getMinutes()
            let waitMin = 24 * 60 + 30 - (honor * 60 + minute)
            console.log(`现在的时间是: ${new Date()}`)
            console.log(`将会在24点30分，${waitMin}分钟后签到`)
            setTimeout(() => {
                window.location.replace(localStorage.getItem("url")) //切换页面为上次的视频页面 从而实现播放后自动签到
            }, waitMin * 60 * 1000)
            observer.disconnect()
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();