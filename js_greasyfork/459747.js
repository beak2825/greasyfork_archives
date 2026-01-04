// ==UserScript==
// @name         中建知学云_自动刷课
// @namespace    https://greasyfork.org/zh-CN/scripts/459747-%E4%B8%AD%E5%BB%BA%E7%9F%A5%E5%AD%A6%E4%BA%91-%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE
// @version      1.5
// @description  自动挂机观看中建知学云课程，自动切换未完成视频
// @author       Owen Yan
// @match        https://e-cscec.zhixueyun.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-cscec.zhixueyun.com
// @require      https://greasyfork.org/scripts/425166-elegant-alert-%E5%BA%93/code/elegant%20alert()%E5%BA%93.js?version=922763
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459747/%E4%B8%AD%E5%BB%BA%E7%9F%A5%E5%AD%A6%E4%BA%91_%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/459747/%E4%B8%AD%E5%BB%BA%E7%9F%A5%E5%AD%A6%E4%BA%91_%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

// *使用说明*
// 如果网速慢可以调整 reloadTimeStamp 的数值 1000表示1秒 默认5500 网速越慢数值越大 需要大于3000

(function() {
    'use strict';
    let listHerf = ""
    let href = ""
    const reloadTimeStamp = 5500 // 调整左侧数值

    // 列表目录页处理逻辑
    async function pageList() {
        // 获取当前页面父级列表
        console.log("进入pageList")
        let i = 0
        let j = 0
        let fatherList = document.getElementsByClassName("section-title pointer")
        for (i = 0; i < fatherList.length; i++) {
            // 展开父级菜单
            if (i !== 0 || document.getElementsByClassName("train-citem").length === 0) {
                fatherList[i].click()
            }

            console.log("fatherList" + i)
            const logStr = await sleepFun(i)

            // 检查是否有更多
            if (openMore()) {
                const logStr = await sleepFun(i)
                // 读取子列表（也就是课程列表）
                if (document.getElementsByClassName("n-content n-list").lenght === 0) {
                    return
                }
                let classUrlList = document.getElementsByClassName("n-content n-list")[0].getElementsByTagName("li")
                console.log("classUrlList", classUrlList)
                for (j = 0; j < classUrlList.length; j++) {
                    let classUrl = ""
                    console.log("classUrlList" + j)
                    // 拼接课程详情页url
                    classUrl = "https://e-cscec.zhixueyun.com/#/study/course/detail/11&" + classUrlList[j].id.substr(17) + "&0/5/1"

                    // 判断课程是否已经完成
                    if (classUrlList[j].getElementsByClassName("ms-train-state un-finish").length !== 0) {
                        // 未完成
                        console.log("课程未完成")
                        // window.location.href = classUrl
                        location.href = classUrl
                        return
                    }
                }
            }

            // 当前父级已完成

        }
        new ElegantAlertBox("所有课程已经学完>__<")

    }

    // 视频播放页处理逻辑
    function pageVideo() {
        let setIntervalId = 0

        setIntervalId = setInterval(function() {
            let state = document.querySelector("dl.focus > div.chapter-right > div.section-item.section-item11 > div:nth-child(3) > span")
            state = state ? state.innerText : null
            if (state == "已完成") {
                new ElegantAlertBox("准备播放下一个视频>__<")
                let courses = document.querySelectorAll("dl")
                for (let i of courses) {
                    if (i.querySelector("div.chapter-right > div.section-item.section-item11 > div:nth-child(3) > span").innerText != "已完成") {
                        i.click()
                        return
                    }
                }

                // 返回目录页面
                clearInterval(setIntervalId)
                // window.location.href = localStorage.getItem('listHerf')
                location.href = localStorage.getItem('listHerf')
                setTimeout(() => {
                    window.location.reload()
                }, reloadTimeStamp - 1000)
                return

            } else {

                // 修改页面提示
                if (document.getElementsByClassName("chapter-categary")) {
                    document.getElementsByClassName("chapter-categary")[0].getElementsByClassName("h3")[0].innerText = "[挂机中]目录[学习中]"
                }

                // 判断是否还在继续播放
                if (document.getElementsByClassName("vjs-playing").length === 0) {
                    console.log("vjs-playing-没有播放")
                    let video = document.getElementsByTagName("video")[0]
                    video.muted = true
                    // video.play()
                    setTimeout(() => {
                        document.getElementsByClassName("vjs-big-play-button")[0].click()
                    }, 1000)

                }
                if (document.getElementsByClassName("videojs-referse-btn vjs-hidden").length === 0) {
                    console.log("document.getElementsByClassName('videojs-referse-btn')[0].click()")
                    let video = document.getElementsByTagName("video")[0]
                    video.muted = true
                    // video.play()
                    setTimeout(() => {
                        document.getElementsByClassName("videojs-referse-btn")[0].click()
                    }, 1000)
                }
                // new ElegantAlertBox("还没有学习完 >__<")


                // 弹出服务器异常提示
                if (document.getElementsByClassName("alert-shadow speed-shadow speed-shadow4")[0].style.display !== "none") {
                    document.getElementById("D838btn-ok").click()
                    location.href = localStorage.getItem('listHerf')
                    setTimeout(() => {
                        window.location.reload()
                    }, reloadTimeStamp - 1000)
                }

                // 弹出不要走开提示
                if (document.getElementsByClassName("alert-shadow") && document.getElementsByClassName("alert-shadow")[0].style.display !== "none") {
                    document.getElementsByClassName("alert-shadow")[0].getElementsByClassName("btn")[0].click()
                }

                // 处理一些我也不知道是什么的弹窗
                if (document.querySelector(".register-mask-layer") && 'display: none;' != document.querySelector(".register-mask-layer").getAttribute("style")) {
                    document.querySelector("#D210registerMask").click()
                }
            }

        }, 5000)
    }


    // 展开更多
    async function openMore() {
        console.log("检测是否需要展开更多")
        while(document.getElementById("D219loadMore")){
            document.getElementById("D219loadMore").click()
            const logStr = await sleepFun("777")
        }
        return true
    }

    // 休眠方法
    function sleepFun(abc) {
        return new Promise((res) => {
            return setTimeout(() => {
                res(abc)
            }, 2000)
        })
    }

    function start() {
        if (reloadTimeStamp <= 3000) {
            new ElegantAlertBox("reloadTimeStamp需要大于3000")
        }
        href = window.location.href
        if (document.readyState == 'complete') {
            // 页面加载完毕
            let setIntervalId = 0
            setIntervalId = setInterval(() => {
                console.log("执行setInterval")
                // 加载完成
                if (href.indexOf("train-new") !== -1) {
                    // 在列表页
                    if (document.getElementsByClassName("dialog-overlay topLoading hidden").length !== 0) {
                        localStorage.setItem('listHerf', href)
                        pageList()
                    }
                } else if (href.indexOf("error-page") !== -1) {
                    // 在错误页面
                    location.href = localStorage.getItem('listHerf')
                } else if (href.indexOf("course") !== -1) {
                    // 在播放页
                    console.log("进入videoList")
                    pageVideo()
                }
                clearInterval(setIntervalId)


            }, reloadTimeStamp)

        }
    }

    window.onhashchange = function(e) {

        console.log('URL发生变化了', e);
        setTimeout(() => {
            start()

        }, 3000)

    };

    // 开始代码
    document.onreadystatechange = function() {
        console.log("页面加载完毕")
        new ElegantAlertBox("脚本已经开始运行")
        start()
    }

})()