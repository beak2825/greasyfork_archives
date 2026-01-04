// ==UserScript==
// @name         15倍智慧树
// @namespace    http://github.com/kakasearch
// @version      1.4
// @description  15倍播放视频，秒过文档，自动切换
// @author       kakasearch
// @match        https://studyh5.zhihuishu.com/videoStudy.html
// @match        https://lc.zhihuishu.com/live/vod_room.html*
// @match        https://hike.zhihuishu.com/*
// @match       https://hike.zhihuishu.com/aidedteaching/sourceLearning/sourceLearning*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/426171/15%E5%80%8D%E6%99%BA%E6%85%A7%E6%A0%91.user.js
// @updateURL https://update.greasyfork.org/scripts/426171/15%E5%80%8D%E6%99%BA%E6%85%A7%E6%A0%91.meta.js
// ==/UserScript==

let style = `/*.dialog-test {
    display: none;
}*/
.v-modal {
    display: none;
}
.stopAutoButton {
    display: block;
    position: fixed;
    left: 2rem;
    bottom: 1rem;
    padding: 0.5rem;
    color: #fff;
    background-color: #000;
    font-size: 2rem;
    cursor: pointer;
    z-index: 99999;
}`;

(function ($) {
    $(function () {
        let isAuto = localStorage.getItem("isAuto") == "true" ? true : false;
        $("<style/>").html(style).appendTo($("body"));
        let addDiv = function () {
            if ($(".video-js").length ||$(".icon-doc").length ) {
                $("<div/>").text(isAuto ? "关闭自动播放" : "开启自动播放").addClass("stopAutoButton").on("click", function () {
                    isAuto = !isAuto;
                    localStorage.setItem("isAuto", "" + isAuto);
                    $(this).text(isAuto ? "关闭自动播放" : "开启自动播放");
                    if (isAuto) {
                        window.repeatInterval = setInterval(repeat, 100);
                    } else {
                        clearInterval(window.repeatInterval);
                    }
                }).insertBefore($("body"));
            } else {
                setTimeout(addDiv, 100);
            }
        };
        let next = 0;
        addDiv();
        let course_class = 0
        if(/hike/.test(window.location.href)){
            course_class = '翻转课'
        }
        let repeat = function () {
            if (!$(".stopAutoButton").length) {
                addDiv();
            }
            let rate
            if(course_class =='翻转课'){
                rate = document.querySelector(".speedTab05")

            }else{
                rate = $(".speedList>div")[0]
            }
            if (rate) {
                rate.setAttribute("rate", "15.0");
                $(rate).click();
            }
            //document.querySelector("#vjs_mediaPlayer > div.controlsBar > div.definiBox > div > b.line1bq").click() 普通清晰度
            var current_play_video
            if(course_class =='翻转课'){
                current_play_video = document.querySelector(".file-item.active");//当前播放的视频单元

                let time_finish = current_play_video.querySelector(".status-box > i")
                if(time_finish && (new Date() - next) > 10000){//报错忽略...
                    console.log('下一条')
                    if(current_play_video.nextElementSibling != null){
                        current_play_video.nextElementSibling.click()
                    }else{
                        let a =Array.from(document.querySelectorAll(".file-item"))
                        for(let i of a){
                            if(i.querySelector('.icon-finish') == null){
                                i.click()
                                break
                            }
                        }
                        //刷完
                        //window.close()
                    }
                    next = new Date();
                }else{
                    if ($("video").prop("paused")) {
                        $("#playButton").click();}
                }

            }else{//共享课
                try{
                    var myPlayer = document.getElementById('vjs_container_html5_api')
                    // 视频暂停监听
                    myPlayer.onpause = function(){
                        setTimeout(function(){
                            var playVideo = document.getElementById('playButton');
                            playVideo.click();
                        }, 5000);
                        let tm = document.getElementsByClassName("el-scrollbar__view")[1];
                        let tm_opt_a = tm.getElementsByClassName("topic-item")[0];
                        tm_opt_a.click();//只选择第一个选项，对错不影响
                        setTimeout(function(){
                            let btn6 = document.getElementsByClassName('btn')[6];
                            btn6.click();
                        }, 3000);

                    };
                }catch{}
                var videoLists = document.getElementsByClassName('el-scrollbar__view')[0];//视频目录
                let current_play_video = videoLists.getElementsByClassName('current_play')[0];//当前播放的视频单元
                let time_finish = current_play_video.getElementsByClassName('time_icofinish')[0];
                if(time_finish.hasAttribute('hidden')){//报错忽略...
                }else{
                    if((new Date() - next) > 10000) {
                        /* 播放完毕后 10 秒内不重复点击，防止“禁止跳课”提示刷屏 */
                        document.querySelector("#nextBtn").click()
                        next = new Date();
                    } else if ($("video").prop("paused")) {
                        $("#playButton").click();
                    }
                }
            }

            if (!$(".stopAutoButton").length) {
                addDiv();
            }
        }
        if (isAuto) {
            window.repeatInterval = setInterval(repeat, 100);
        }
    });
})(jQuery);