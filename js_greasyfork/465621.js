// ==UserScript==
// @name         auto-study
// @namespace    https://greasyfork.org/zh-CN/scripts/465621-auto-study
// @version      3.1
// @description  仅限内部交流使用，请用户24小时内删除脚本，产生的后果由用户个人承担。
// @author       buzhanxian
// @match        https://wangda.chinamobile.com/
// @grant        none
// @icon         https://src.onlinedown.net/images/h_iphone_imges/book_3/171124_044606.jpg
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/465621/auto-study.user.js
// @updateURL https://update.greasyfork.org/scripts/465621/auto-study.meta.js
// ==/UserScript==
/*
再次声明：仅限内部交流使用，请用户24小时内删除脚本，产生的后果由用户个人承担。
功能：
自动继续播放，自动倍速播放，已完成课程的自动跳转下一个视频
*/
(function() {
    'use strict';
    setTimeout(start(), 5000)
})();
function start(){
    console.log('start')
    setInterval(() => {
        if(document.getElementsByClassName('required focus')[0].innerHTML.indexOf('<span>已完成</span>') > 0) {
            if(document.getElementsByTagName('video')[0].duration - document.getElementsByTagName('video')[0].currentTime > 5) {
                document.getElementsByTagName('video')[0].currentTime = document.getElementsByTagName('video')[0].duration - 1
                document.getElementsByTagName('video')[0].playbackRate = 1
            }
        } else {
            if(null != document.getElementsByTagName('video')[0]) {
                if(document.getElementsByTagName('video')[0].duration - document.getElementsByTagName('video')[0].currentTime < 33) {
                    document.getElementsByTagName('video')[0].playbackRate = 1
                } else {
                    document.getElementsByTagName('video')[0].playbackRate = 1.5
                }
                document.getElementsByTagName('video')[0].play()

                //if (document.getElementsByTagName('video')[0].duration / 60 > 600) {
                //    document.getElementsByTagName('video')[0].playbackRate = 16
                //} else {
                //    document.getElementsByTagName('video')[0].playbackRate = 1.5
                //}
            }
            if(null != document.getElementsByTagName('audio')[0]){
                if(document.getElementsByTagName('audio')[0].duration - document.getElementsByTagName('video')[0].currentTime < 33) {
                    document.getElementsByTagName('audio')[0].playbackRate = 1
                } else {
                    document.getElementsByTagName('audio')[0].playbackRate = 1.5
                }
                document.getElementsByTagName('audio')[0].play()
            }
        }

    }, 1000);

}
