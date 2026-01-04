// ==UserScript==
// @name         jxzh自动播放视频
// @namespace    http://tampermonkey.net/
// @version      2024.7.23
// @description  技行珠海的视频自动播放插件!
// @author       cynen
// @license      AGPL License
// @match        *://jxzh.zh12333.com/zhskillWeb/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAIAAABMXPacAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyMTQxOUVGOEQ0QzcxMUVDOTBDMzlCRTAxMzcxQjQyMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyMTQxOUVGOUQ0QzcxMUVDOTBDMzlCRTAxMzcxQjQyMyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjIxNDE5RUY2RDRDNzExRUM5MEMzOUJFMDEzNzFCNDIzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjIxNDE5RUY3RDRDNzExRUM5MEMzOUJFMDEzNzFCNDIzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+HSuf7AAAM5VJREFUeNrsfQdgnVXZ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
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/501519/jxzh%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/501519/jxzh%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("作者: 瞎捣鼓")

    var itemList = [];
    var jxzh = getJxzh();
    //页面判别
    var urlInfos = window.location.href.split("/");
    var urlTip = urlInfos[urlInfos.length - 1].split("?")[0];

    if (urlTip == "index.html" || urlTip == "user_course_required_list.html") { // 首页或者列表页面.
        console.log("当前任务: 首页")
        jxzh.topPage()
    } else if (urlTip == "course_study.html") { //考试页面
        console.log("当前任务: 看视频")
        jxzh.seeVideo()
    } else if (urlTip == "course_detail.html") { //考试页面
        console.log("当前任务: 视频列表")
        jxzh.doPlay()
    } else {
        console.log("其它情况")
    }

    /**=======================================****/
    // 主逻辑.
    function getJxzh() {
        return {
            seeVideo: function () {
                localStorage.setItem("playerStatus", "playing")
                console.log("seeVideo");
                // 关闭页面的时候,触发这个函数.
                // 我也不知道是哪个,索性都监听一下.
                $(window).bind('beforeunload', function () {
                    localStorage.setItem("playerStatus", "finish")
                });
                $(window).bind('onunload', function () {
                    localStorage.setItem("playerStatus", "finish")
                });

                setInterval(function () {
                    // 获取当前页面的播放列表.
                    // 循环判断是否可以播放下一个.
                    try {
                        localStorage.setItem("playerStatus", "playing")
                        // 判断当前视屏是否已经放完.
                        // 当前的课程id
                        var courseId = window.location.href.split("=")[2].split("&")[0];
                        console.log("当前currentCurs课程id: ", courseId)
                        var coursewareId = window.location.href.split("=")[3].split("&")[0];
                        localStorage.setItem("courseId", courseId)
                        localStorage.setItem("coursewareId", coursewareId)

                        itemList = document.querySelectorAll(".list-block a")
                        // 判断当前看的课程是否已经看完.
                        for (let index = 0; index < itemList.length; index++) {
                            // element 就是a标签.
                            let element = itemList[index];
                            // 当前课程id
                            let currSubCurs = element.href.split("=")[3];
                            if (currSubCurs == coursewareId) {
                                // 当前遍历的是正在播放的视频.
                                let sub = element.querySelector(".item-title div")
                                // console.log(sub.innerHTML)
                                if (sub.innerHTML == '100%') {
                                    console.log("当前视屏已经看完,准备跳转下一个.")
                                    if (index == (itemList.length - 1)) {
                                        // 如果是最后一个.就直接关闭当前窗口.
                                        localStorage.setItem("playerStatus", "finish")
                                        window.close()
                                    } else {
                                        // 当前视屏是已经看过的.跳到下一个.
                                        element = itemList[index + 1]
                                        window.location = element.href
                                    }
                                }
                            }
                        }

                        // 判断是否暂停,如果暂停,就继续播放.
                        if ($("video")[0].player) {
                            console.log("player状态: ", $("video")[0].player._status)
                            // if ( $("video")[0].player.tag.paused ) {} 这个方法也可以.
                            if ("playing" != $("video")[0].player._status) {
                                console.log("未开始播放!")
                                // 点击继续播放.
                                // $("div .outter")[0].click() //可用.
                                $("video")[0].player.play()
                            }
                        }

                        // 判断验证码弹窗.
                        if( $("#processAnswerImg img").length && $("#processAnswerImg img").length > 0){
                            console.log("检测到验证码弹窗!")
                            // 填充结果.
                            // $(".kc-login .login-wrapper input")[0].value = valicode
                            // 点击验证
                            // $(".kc-login .login-wrapper button")[0].click()
                        }

                        // 判断是否弹窗已看完的.
                        if ($(".modal-buttons").length && $(".modal-buttons").length > 0) {
                            console.log("检测到确认框!")
                            // 直接看下一个视频.
                            for (let index = 0; index < itemList.length; index++) {
                                // element 就是a标签.
                                let element = itemList[index];
                                let currSubCurs = element.href.split("=")[3];

                                console.log(element)
                                // 判断当前课程是否最后一个,如果是最后一个,就关闭,不是最后一个,就继续下一个.
                                if (coursewareId == currSubCurs) {
                                    // 判断是否是最后一个子课程.
                                    if (index == (itemList.length - 1)) {
                                        // 最后一个课程,就关闭窗口,并设置状态,用于给首页使用.
                                        localStorage.setItem("playerStatus", "finish")
                                        window.close()
                                    } else {
                                        // 跳转.
                                        element = itemList[index + 1]
                                        window.location = element.href
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        console.log(err)
                    }
                }, 10000);
            },
            topPage: function () {
                console.log("topPage")
                var cursList = [];
                setInterval(function () { // 30秒轮转一次.
                    var playstatus = localStorage.playerStatus
                    console.log("playstatus: ", playstatus)
                    switch (playstatus) {
                        case "finish":
                            // 改变当前播放器状态.
                            localStorage.setItem("playerStatus", "flush")
                            // 刷新页面.
                            window.location = "https://jxzh.zh12333.com/zhskillWeb/user_course_required_list.html?isComplete=0"
                            break;
                        case "flush":
                            // 如果检测到状态变成finish,就刷新页面.
                            // 表示已经刷新过页面了,准备开始播放新的视频.
                            cursList = document.querySelectorAll("#courseList ul li a")
                            // 开始播放列表的第一个.
                            localStorage.setItem("playerStatus", "playing")
                            window.open(cursList[0].href)
                            break;
                        case "playing":
                            console.log("正在播放.", localStorage.courseId)
                            break;
                        default:
                            // 默认是已完成状态. 避免刚开始就出现异常.
                            localStorage.setItem("playerStatus", "finish")
                            break;
                    }
                }, 30000)
            },
            doPlay: function () {
                // 直接播放第一个.
                console.log("videoList");
                setInterval(function () {
                    if ($("#course_item a").length && $("#course_item a").length > 0) {
                        $('#course_item a')[0].click()
                    }
                }, 5000)
            }
        }
    }

    // Your code here...
    // 发送post请求的接口.因跨域问题,暂未解决.
    function getValiCodePost(url,headers,body){
        // fetch报跨域问题.
        // 获取所有未完成的列表.
         fetch(url,{
             method: "POST",
             headers: headers,
             body: body}).then(response => {
             if (!response.ok) {
                 throw new Error('Network response was not ok ' + response.statusText);
             }
             return response.json(); // 解析 JSON 响应体
         }).then(data => {
             // 请求成功，处理返回的数据
             console.log("请求结果: ",data);
             if( 10000 == data.code){
                // 结果
                valicode = data.data.data
                console.log("验证码结果: ",valicode)
             }
         }).catch(error => {
             // 请求失败或解析错误，处理异常
             console.error('Fetch error: ', error);
         });
     }
 


})();