// ==UserScript==
// @name         奥鹏自动点击空间-自动上课
// @namespace    https://greasyfork.org/zh-CN/users/785785-duanminkid
// @version      1.1
// @description  奥鹏教育视频
// @author       kid
// @match        *://learn.open.com.cn/StudentCenter/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428276/%E5%A5%A5%E9%B9%8F%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%A9%BA%E9%97%B4-%E8%87%AA%E5%8A%A8%E4%B8%8A%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/428276/%E5%A5%A5%E9%B9%8F%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%A9%BA%E9%97%B4-%E8%87%AA%E5%8A%A8%E4%B8%8A%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
	'use strict';
    var loop;
    var startTime
    startTime = new Date().getTime(); // 开始时间
    console.log(startTime);
    var checknow = setInterval(main, 1000);
    function main(){
        if(document.getElementById("points_detail")){
            clearInterval(checknow);
            console.log("找到空间");
            setTimeout(Course, 10000);
        } else if (window.require != null || window.jQuery != null){
            clearInterval(checknow);
            console.log("找到播放器");
            setTimeout(setVideooption, 10000);
            checkVideotime();
        }
    }
    function Course(){
        loop = setInterval(function () {
            if(document.getElementById("points_detail")){
        if(document.getElementsByClassName("item tab-homework")){
            setTimeout(homework,10000)
        }
    }
    },360000)
    }

    function checkVideotime() {
        console.log('视频时长---->');
        ////2分钟检查一次
        loop = setInterval(function () {
            //视频时长，视频时长和已播放时长
             var endTime = new Date().getTime(); // 结束时间
             console.log(endTime);
            var usetime = Math.floor((endTime - startTime) / 1000 / 60) // 计算相差多少分钟
            console.log(usetime);
            if(usetime<60){
            var durationObj = document.getElementsByClassName('duration');
            var currentObj = document.getElementsByClassName('current-time');
            var time = durationObj
            if (durationObj.length > 0 && currentObj.length > 0) {
                let duration = durationObj[0].textContent;
                let current = currentObj[0].textContent;
                console.log(duration);
                console.log(current);
                console.log(duration == current);
                console.log('-----------')
                if (duration == current) {
                    console.log('-->视屏已经播放完毕');
                    //重新加载课程
                    if(document.getElementsByClassName("nextlink")){
                           console.log('下一节');
                           document.getElementsByClassName("nextlink")[0].click();
                    } else {
                        reload();
                    }
                    //reload();
                    return true;
                } else {
                    ////只有在没有播放的状态下才会去播放
                    if(document.getElementsByClassName("prism-big-play-btn") && document.getElementsByClassName("prism-big-play-btn")[0].style.display == "block"){
                           console.log('找到播放按钮，且没有播放');
                           document.getElementsByClassName("prism-big-play-btn")[0].click();
                           console.log('执行完毕');
                    }

                }
            }
            }
            else{
                console.log('超过60分钟');
                window.opener=null;
                window.open('','_self');
                window.close();
            }
        }, 30000);
    }

    function setVideooption() {
        for (var i = 0; i < document.getElementsByTagName('video').length; i++) {
            var current_video = document.getElementsByTagName('video')[i]
            //静音
            current_video.volume = 0
            //倍速
            current_video.playbackRate = 2.0
        }
    }

    function homework() {
        document.getElementsByClassName("item tab-homework")[0].click()
        setTimeout(ware,20000)
    }

    function ware() {
        document.getElementsByClassName("item tab-ware")[0].click()
        setTimeout(anser,50000)
    }

   function anser() {
        document.getElementsByClassName("item tab-anser")[0].click()
        setTimeout(reload,360000)
    }

    function reload(){
        location.reload()
    }
})();