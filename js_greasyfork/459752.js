// ==UserScript==
// @name        魔学院自动播放脚本
// @namespace    https://gitee.com/readpage
// @version      0.7
// @description  魔学院视频自动播放（适配Microsoft Edge浏览器）
// @author       readpage
// @match        https://*.study.moxueyuan.com/**
// @icon         https://wechat.moxueyuan.net/static/common/images/titleIcon/16.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459752/%E9%AD%94%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/459752/%E9%AD%94%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
const autoplay = ()=> {
    const url = window.location.href;
    if(url.indexOf("/course") != -1) {
        let video = document.querySelector('#player_html5_api')
        let timeNow = new Date();
        let hours = timeNow.getHours();
        //点击开始按钮
        document.querySelector('#player > button')?.click()
        //关闭提示
        document.querySelector('.dialog-footer-cancel.theme-bg-h-hover')?.click()
        //关闭播放结束提示
        document.querySelector('#app > div > section > main > div > div:nth-child(7) > div > div.el-dialog__footer > div > div > div.dialog-footer-cancel')?.click()
        if (video) {
           let next = document.querySelector('.course_list_progress_item.dis-flex.active + div')
           if(video.duration && video.duration - video.currentTime >= 30) {
              video.play()
           }
        }
    }
}

setInterval(() => {
    autoplay()
}, 2000)
