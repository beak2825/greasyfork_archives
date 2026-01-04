// ==UserScript==
// @name         [江苏教师教育]2023暑期师德师风学习-左手
// @namespace    http://tampermonkey.net/
// @version      23.08.26
// @description  打开视频播放页面课程
// @author       左手天才
// @match        https://www.jste.net.cn/lfv5/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473932/%5B%E6%B1%9F%E8%8B%8F%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%5D2023%E6%9A%91%E6%9C%9F%E5%B8%88%E5%BE%B7%E5%B8%88%E9%A3%8E%E5%AD%A6%E4%B9%A0-%E5%B7%A6%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/473932/%5B%E6%B1%9F%E8%8B%8F%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%5D2023%E6%9A%91%E6%9C%9F%E5%B8%88%E5%BE%B7%E5%B8%88%E9%A3%8E%E5%AD%A6%E4%B9%A0-%E5%B7%A6%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';
    infos()
    function infos() {
        //分割网页网址
        var urlInfos = window.location.href.split("/");
        console.log("网址第一次处理后数据: " + urlInfos)
        //倒数第二段再次分割
        var urlTip = urlInfos[urlInfos.length - 2].split("#")[1];
        // 最后一段网址
        var urlEnd = urlInfos[urlInfos.length - 1]
        //网址中是否包含"jste"
        if (window.location.href.indexOf("jste") != -1) {
            //二次分割后面是"item"就是在视频页面
            if (urlTip == "item") {
                console.log("当前页面: 视频播放 ")
                Video()
            } else if (urlTip == "folder") {
                //如果是“folder”,则在各个列表页面，可能是根目录，也可能是分目录
                //根目录最后一段应该是“root”，其它页面是一段代码，
                //因为是学习400分钟或1200分钟，就不考虑了
                //直接进入
                console.log("当前页面: 课程目录 ")
                location.href = "https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#folder/F980DE59-D5FF-4852-9E84-AFA4E2E770A6"
                setTimeout(function () {
                    Course()
                }, 5000)
            }
        }
    };

    function Course() {
        //主页面判断学习时长
        setTimeout(function () {
            //获取分目录的总时间与总已学时间con[共需要学习400分钟，已经学了 58 分钟。]
            var con = $("#totalProgress").text()
            //获取分目录的总时间（精确分钟数）
            var con11 = $("#totalProgress").text().split("，")[0].replace(/\D/g, "")//保留需要学习的分钟数（400）
            //获取分目录的总时间（精确分钟数）
            var con12 = $("#totalProgress").text().split("，")[1].replace(/\D/g, "")//保留已经学习的分钟数（58）
            console.log("学习情况： " + con)
            console.log("学习情况1： " + con11)
            console.log("学习情况2： " + con12)
            var m = Number(document.getElementsByClassName("videoRunning").length)
            if (Number(con11) > Number(con12) - 5) {
                var n = 0
                //循环查找
                console.log("当前页面: 选择学习课程页面 ")

                for (n = 0; n < m; n++) {
                    console.log("当前程序：进入循环 ")
                    var a = document.getElementsByClassName("videoRunning")[n].innerText.split("，")[0].replace(/\D/g, "")
                    var b = document.getElementsByClassName("videoRunning")[n].innerText.split("，")[1].split("\n")[0].replace(/\D/g, "")
                    console.log("a= " + a)
                    console.log("b= " + b)
                    console.log("n= " + n)
                    if (b < a - 4) {
                        if (n == 0) {
                            location.href = "https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#item/655056E1-1056-4D22-B198-73852443C87C"
                            Video()
                            return
                        } else if (n == 1) {
                            location.href = "https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#item/169ADF90-E1B0-479D-9FE4-01C23FB66565"
                            Video()
                            return
                        } else if (n == 2) {
                            location.href = "https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#item/1866B552-4C37-4BDC-9CF5-FEBDA8EFDF14"
                            Video()
                            return
                        } else if (n == 3) {
                            location.href = "https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#item/14584D74-B9AB-459D-B768-9D4E15A87898"
                            Video()
                            return
                        } else if (n == 4) {
                            location.href = "https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#item/E54BEA2E-F80E-4EF1-B3DC-3F650835259D"
                            Video()
                            return
                        } else if (n >= 5) {
                            console.log("课程全部完成")
                            return
                        }
                    }
                }

            }
            Course()
        }, 5000);

    };

    function Video() {
        setTimeout(function () {
            console.log("已进入视频学习页面")
            //获取分目录的总时间与总已学时间con[共需要学习400分钟，已经学了 58 分钟。]
            var con = $("#totalProgress").text()
            //获取分目录的总时间（精确分钟数）
            var conOne = $("#totalProgress").text().split("，")[0].replace(/\D/g, "")//保留需要学习的分钟数（400）
            //获取分目录的总时间（精确分钟数）
            var conTwo = $("#totalProgress").text().split("，")[1].replace(/\D/g, "")//保留已经学习的分钟数（58）

            //获取视频学习总数据
            //'本项最少需要学习90分钟，最多记录90分钟，您已经学习53分钟。'
            var item = $("#itemProgress").text()
            //获取视频学习总时间（精确分钟数）
            var item1 = $("#itemProgress").text().split("，")[0].replace(/\D/g, "")//需要学习90分钟[90]
            //获取视频记录总时间（精确分钟数）
            var item2 = $("#itemProgress").text().split("，")[1].replace(/\D/g, "")//最多记录90分钟[90]
            //获取视频已学习时间（精确分钟数）
            var item3 = $("#itemProgress").text().split("，")[2].replace(/\D/g, "")//您已经学习53分钟[53]

            if (Number(conTwo) > 420) {
                //返回视频目录主页面
                location.href = "https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#folder/F980DE59-D5FF-4852-9E84-AFA4E2E770A6"
                return
            } else {
                console.log("判断学习时间是否已到")
                if (Number(item3) + 4 >= Number(item1)) {//已经学习时长等于或超过需要学习时长，跳转到视频目录主页
                    location.href = "https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#folder/F980DE59-D5FF-4852-9E84-AFA4E2E770A6"
                    Course()
                    return
                }
            }

        }, 10000);
        Vid()
    };

    function Vid() {
        setTimeout(function () {
            Video()
        }, 30000);
    }

})();