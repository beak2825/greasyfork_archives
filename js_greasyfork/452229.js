// ==UserScript==
// @name         开刷啦
// @namespace    https://greasyfork.org/zh-CN
// @version      1.6
// @description  自动播放视频,视频播放完或当前章节没有视频会自动下一页,禁止手动点击下一页或从右侧边栏切换章节,可以先返回课程后选择要进入的章节
// @author       ccccq
// @match        https://mooc.istudy.szpt.edu.cn/mycourse/*
// @icon         https://greasyfork.org/packs/media/images/blacklogo96-b2384000fca45aa17e45eb417cbcbb59.png
// @grant        none
// @license      cq
// @downloadURL https://update.greasyfork.org/scripts/452229/%E5%BC%80%E5%88%B7%E5%95%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/452229/%E5%BC%80%E5%88%B7%E5%95%A6.meta.js
// ==/UserScript==

(function() {
    var list = [];
    main()
    function main(){
        // 视频列表
        list = [];
        var time = setInterval(function(){
            if(document.querySelector("#iframe")){
                // 获取ans-cc所在的iframe
                var iframe = document.querySelector("#iframe").contentWindow.document
                if(iframe.querySelector(".ans-cc")){
                    // 获取里面所有的p标签
                    var Plist = iframe.querySelector(".ans-cc").querySelectorAll("p")
                    for(var i = 0;i < Plist.length;i++){
                        // 获取视频所在的iframe
                        if(Plist[i].querySelector(".ans-insertvideo-online")){
                            var iframe2 = Plist[i].querySelector(".ans-insertvideo-online").contentWindow.document
                            // 将视频加入list
                            if(iframe2.querySelector("#video_html5_api")){
                                list.push(iframe2.querySelector("#video_html5_api"))
                                // 注册事件,防止视频被暂停
                                window.onmouseout = function(){
                                    iframe2.querySelector("#video_html5_api").play()
                                }
                            }
                        }
                    }
                    // 这个页面没有视频，点击下一页
                    if (list.length == 0){
                        document.querySelector(".orientationright ").click();
                        // 重新开始执行
                        main();
                        return;
                    }
                    clearInterval(time)
                    // 开始播放第一个视频
                    StartVideo(0)
                }
            }
        },1500)
    }
    function StartVideo(index){
        // 播放视频
        list[index].play()
        // 视频结束后递归播放下一个
        list[index].addEventListener('ended', function () {
            // 视频播放完了
            if(index == list.length-1){
                document.querySelector(".orientationright ").click();
                // 重新开始执行
                main();
                return;
            }
            StartVideo(index+1)
        }, false);
    }
})();