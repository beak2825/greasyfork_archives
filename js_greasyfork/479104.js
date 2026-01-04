// ==UserScript==
// @name         视频时间戳（支持everything和alist）
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  在视频链接后面加上后缀 ?t=30 ,那么进入视频链接就会自动跳转到30秒。(everthing默认端口80。alist默认端口5244)
// @author       openAI
// @match        http://localhost/*
// @match        http://127.0.0.1/*
// @match        http://localhost:5244/*
// @match        http://127.0.0.1:5244/*
// @icon         https://img.icons8.com/?size=160&id=BiA4DdLOEKBN&format=png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479104/%E8%A7%86%E9%A2%91%E6%97%B6%E9%97%B4%E6%88%B3%EF%BC%88%E6%94%AF%E6%8C%81everything%E5%92%8Calist%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/479104/%E8%A7%86%E9%A2%91%E6%97%B6%E9%97%B4%E6%88%B3%EF%BC%88%E6%94%AF%E6%8C%81everything%E5%92%8Calist%EF%BC%89.meta.js
// ==/UserScript==

class myclass{
    static start(){
        if(document.getElementsByTagName('video').length) {
            return myclass.modif_time()
        } else {
            return myclass.wait_video()
        }
    }

    // 等待播放器加载
    static wait_video() {
        'use strict';
        let wait_video_interval = setInterval(() => {
            if(document.getElementsByTagName('video').length) {
                clearInterval(wait_video_interval)
                return myclass.modif_time()
            }
        }, 500);
    }

    static modif_time() {
        'use strict';
        //获取url参数
        const paramsStr = window.location.search
        const params = new URLSearchParams(paramsStr)
        const seconds = parseInt(params.get('t'))

        //进度条跳转
        let myVideo = document.getElementsByTagName("video")[0]
        if(seconds){
            myVideo.currentTime = seconds
            myVideo.play()
        }
    }
}

// 相当于主函数
(function() {
    'use strict';
    myclass.start()
})();