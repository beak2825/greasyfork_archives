// ==UserScript==
// @name         陕西继续教育刷课插件
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  自用学习测试
// @author       紫菜苔
// @match        http://jxjy01.xidian.edu.cn/learnspace/learn/learn/templatethree/courseware_index.action*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416536/%E9%99%95%E8%A5%BF%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%88%B7%E8%AF%BE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/416536/%E9%99%95%E8%A5%BF%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%88%B7%E8%AF%BE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var current = -1

    var playVideo = function(){
        const iframe = document.querySelector('#mainFrame').contentWindow.document
        const classes = document.getElementsByClassName('s_point')
        current = current===-1 ?Array.from(document.getElementsByClassName('s_point')).findIndex(x=>x.classList.contains('s_pointerct')): current + 1
        const next = current < classes.length - 1 && classes[current + 1]
        const video = iframe.querySelector('video')
        const track = iframe.querySelector('.trace_btn')

        if(!video){
            setTimeout(playVideo, 1000)
            return
        }

        video.playbackRate = 16

        var trackId = setInterval(()=>{
            track.click()
        },1000)

        var timeId = setInterval(() => {
            if (video.ended && timeId) {
                clearInterval(timeId)
                timeId = null

                video.playbackRate = 1

                setTimeout(function(){
                    clearInterval(trackId)
                    next && next.click()
                },10 * 1000)

                setTimeout(playVideo, 20 * 1000)
            }
        }, 1000);

    }

    var result = confirm("是否开始自动刷课");

    if(result){
       setTimeout(playVideo, 5000)
    }

})();