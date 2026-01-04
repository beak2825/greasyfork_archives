// ==UserScript==
// @name         《江苏教师教育平台》学习脚本-左手
// @namespace    http://tampermonkey.net/
// @version      23.05.11
// @description  打开视频播放页面课程
// @author       左手天才
// @match        https://www.jste.net.cn/lfv5/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464563/%E3%80%8A%E6%B1%9F%E8%8B%8F%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E3%80%8B%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC-%E5%B7%A6%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/464563/%E3%80%8A%E6%B1%9F%E8%8B%8F%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E3%80%8B%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC-%E5%B7%A6%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';
    infos()
    function infos(){
        var urlInfos = window.location.href.split("/");
        console.log("网址第一次处理后数据: "+urlInfos)
        var urlTip = urlInfos[urlInfos.length - 2].split("#")[1];
        if (window.location.href.indexOf("jste") != -1) {
            console.log("网址处理后数据: "+urlTip)
            if (urlTip == "item") {
                console.log("当前页面: 视频播放 ")
                Video()
            } else if (urlTip == "folder") {
                console.log("当前页面: 课程列表 ")
                Course ()
            } 
        }
    };


    function Course(){
        //主页面判断学习时长
        setTimeout(function () {
            if(document.getElementsByClassName("alert alert-info videoInfo")[0]){
                var time = document.getElementsByClassName("alert alert-info videoInfo")[0].innerText
                console.log(time)
                //获取已学时长
                time = time.slice(time.indexOf("了")+2,time.indexOf("分")-1)
                console.log("已学习时间"+time)
                if(time < "400") {
                    console.log("学习时长还没有达到标准，正在学习")
                    var t1=document.getElementsByClassName("videoRunning")[0].innerText
                    var t11=t1.split("，")[0].slice(t1.split("，")[0].indexOf("习")+1,t1.split("，")[0].indexOf("分"))
                    var t12=t1.split("，")[1].slice(t1.split("，")[1].indexOf("习")+1,t1.split("，")[1].indexOf("分"))

                    var t2=document.getElementsByClassName("videoRunning")[1].innerText
                    var t21=t2.split("，")[0].slice(t2.split("，")[0].indexOf("习")+1,t2.split("，")[0].indexOf("分"))
                    var t22=t2.split("，")[1].slice(t2.split("，")[1].indexOf("习")+1,t2.split("，")[1].indexOf("分"))

                    var t3=document.getElementsByClassName("videoRunning")[2].innerText
                    var t31=t3.split("，")[0].slice(t3.split("，")[0].indexOf("习")+1,t3.split("，")[0].indexOf("分"))
                    var t32=t3.split("，")[1].slice(t3.split("，")[1].indexOf("习")+1,t3.split("，")[1].indexOf("分"))

                    var t4=document.getElementsByClassName("videoRunning")[3].innerText
                    var t41=t4.split("，")[0].slice(t4.split("，")[0].indexOf("习")+1,t4.split("，")[0].indexOf("分"))
                    var t42=t4.split("，")[1].slice(t4.split("，")[1].indexOf("习")+1,t4.split("，")[1].indexOf("分"))

                    var t5=document.getElementsByClassName("videoRunning")[4].innerText
                    var t51=t5.split("，")[0].slice(t5.split("，")[0].indexOf("习")+1,t5.split("，")[0].indexOf("分"))
                    var t52=t5.split("，")[1].slice(t5.split("，")[1].indexOf("习")+1,t5.split("，")[1].indexOf("分"))

                    if(Number(t12) < Number(t11)) {
                        console.log("发现未学课程，正在学习")
                        location.href="https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#item/0081f3e4-79fb-4176-904a-a0711a36aee30"
                        Video()
                        return
                    } else if(Number(t22) < Number(t21)) {
                        console.log("发现未学课程，正在学习")
                        location.href="https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#item/0081f3e4-79fb-4176-904a-a0711a36aee31"
                        Video()
                        return
                    } else if(Number(t32) < Number(t31)) {
                        console.log("发现未学课程，正在学习")
                        location.href="https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#item/0081f3e4-79fb-4176-904a-a0711a36aee32"
                        Video()
                        return
                    } else if(Number(t42) < Number(t41)) {
                        console.log("发现未学课程，正在学习")
                        location.href="https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#item/0081f3e4-79fb-4176-904a-a0711a36aee33"
                        Video()
                        return
                    } else if(Number(t52) < Number(t51)) {
                        console.log("发现未学课程，正在学习")
                        location.href="https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#item/69673f6a-51a5-48dd-a1a3-0fb844ae5f920"
                        Video()
                        return
                    } else {
                        console.log("课程全部完成")
                        return
                    }
                }
            }
            Course()
        },5000);
    };

    function Video(){
        setTimeout(function () {
            console.log("已进入视频学习页面")

            var urlInfos = window.location.href.split("/");
            console.log("网址第一次处理后数据: "+urlInfos)
            var urlTip = urlInfos[urlInfos.length - 2].split("#")[1];
            if (window.location.href.indexOf("jste") != -1) {
                console.log("网址处理后数据: "+urlTip)
                if (urlTip == "folder") {
                    console.log("当前页面: 课程列表 ")
                    Course ()
                    return
                }
            }
            var txt=document.getElementsByClassName("alert alert-info videoInfo")[0].innerText
            '共需要学习400分钟，已经学了 25 分钟。 本项最少需要学习90分钟，最多记录90分钟，您已经学习25分钟。\n停止计时'
            '共需要学习400分钟，已经学了 31 分钟。 本项最少需要学习90分钟，最多记录90分钟，您已经学习31分钟。\n正在计时'
            '共需要学习400分钟，已经学了 31 分钟。 本项最少需要学习90分钟，最多记录90分钟，您已经学习31分钟。\n55秒后开始计时'
            'time = time.substr(time.indexOf("了")+2,time.indexOf("分")-6)'
            //获取已学习时长

            var txt1 = txt.split("。")[0]//通过“。”进行分割上面的数据，得到句号前的数据（共需要学习400分钟，已经学了 25 分钟。）
            var txt11 = txt1.split("，")[0].replace(/\D/g,"")//保留需要学习的分钟数（400）
            var txt12 = txt1.split("，")[1].replace(/\D/g,"")//保留已经学习的分钟数（25）

            console.log("已学习时长:"+txt12)
            //如果已学时长大于400分钟

            if(txt11>420){
                //返回主页面
                location.href="https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#folder/root"
            } else {
                // 获取第二段数据字符串，本项最少需要学习90分钟，最多记录90分钟，您已经学习25分钟。
                var txt2 = txt.split("。")[1]//通过“。”进行分割上面的数据，得到句号中间的数据（共需要学习400分钟，已经学了 25 分钟。）
                var txt21 = txt2.split("，")[0].replace(/\D/g,"")//最少需要学习的分钟数（91）
                //本项最少需要学习90分钟
                var txt22 = txt2.split("，")[1].replace(/\D/g,"")//最多记录的分钟数（91）
                // 最多记录90分钟
                var txt23 = txt2.split("，")[2].replace(/\D/g,"")//本节课已经学习的分钟数（25）
                //您已经学习25分钟                
                console.log("本课程已学时长: "+txt23)
                if(Number(txt23)>= Number(txt21)){//已经学习时长等于或超过需要学习时长，跳转到主页
                    location.href="https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#folder/root"
                    Course ()
                    return
                } else {
                    if(txt.split("。")[2].indexOf("止")>0){
                            location.href="https://www.jste.net.cn/lfv5/learnContentLib/studentMain.action#folder/root"
                            Course ()
                            return
                    }
                }
            }
        }, 5000);
        Vid()
    }
    function Vid(){
        setTimeout(function () {
            Video()
        }, 30000);
    }
})();