// ==UserScript==
// @name         奥鹏教师教育网刷课2021
// @version      1.30
// @description  奥鹏教师教育网自动学习
// @author       why3303

// @match        *://*.ourteacher.com.cn/*
// @grant        none
// @namespace    https://greasyfork.org/users/728857
// @downloadURL https://update.greasyfork.org/scripts/420376/%E5%A5%A5%E9%B9%8F%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%91%E5%88%B7%E8%AF%BE2021.user.js
// @updateURL https://update.greasyfork.org/scripts/420376/%E5%A5%A5%E9%B9%8F%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%91%E5%88%B7%E8%AF%BE2021.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.alert = function(){}//魔法，禁止alert弹窗，希望有用

    var href = location.href
    var localUsername
    var localPassport



    if(document.cookie.indexOf("localUsername") == -1){//初次使用，将账号密码存入cookie。并读取账号密码供登录
        localUsername = prompt("请输入奥鹏账号（只有一次机会不要输错）","")
        localPassport = prompt("请输入密码","")
        document.cookie = "localUsername="+localUsername+";expires=Thu, 18 Dec 2043 12:00:00 GMT;domain=.ourteacher.com.cn;path=/"
        document.cookie = "localPassport="+localPassport+";expires=Thu, 18 Dec 2043 12:00:00 GMT;domain=.ourteacher.com.cn;path=/"
    }else{
        var tempStr = document.cookie;
        localUsername=tempStr.split("localUsername=")[1].split(";")[0];
        localPassport=tempStr.split("localPassport=")[1].split(";")[0];
    }





    if(href == "http://www.ourteacher.com.cn/" || href == "https://www.ourteacher.com.cn/"){//主页
        window.location.href = "https://passport.ourteacher.com.cn/Account/LoginIndex/"
    }




    else if(href.indexOf("passport.ourteacher.com.cn/Account/LoginIndex") != -1){//登录页面

        document.getElementById("aw-login-user-name").value = localUsername
        document.getElementById("aw-login-user-password").value = localPassport
        document.getElementById("login_submit").click();
    }




    else if(href.indexOf("WorkRoom/Index") != -1 || href == "https://activity.ourteacher.com.cn/"){//工作室页面
        setTimeout(function(){
            window.location.href = document.getElementById("goLearn").href
        },2000)
    }




    else if(href.indexOf("Activity/Index?ActivitiesID=")!=-1){//选择课程页面
        var temp1,temp2
        var courseList
        var chapterList = document.getElementsByClassName("news-list news-list1")[0].children

        for(temp1 = 0; temp1 < chapterList.length; temp1++){
            //遍历所有课程，找到第一门未完成课程并进入
            courseList = chapterList[temp1].getElementsByClassName("er")[0].getElementsByClassName("clearfix")
            for(temp2=0;temp2<courseList.length;temp2++){
                if(courseList[temp2].innerHTML.indexOf("a-bg-tip-orange")!=-1){
                    courseList[temp2].getElementsByTagName("a")[0].click()

                    setTimeout(function(){
                        window.location.href = document.getElementsByClassName("btnstyle sure btn-orange btn-Study")[0].href
                    },1500)//等待课程详情加载完成，自动点击学习按钮

                    setTimeout(function(){
                        location.reload(true);
                    },2000)//刷新页面，以跳过项目说明等没有视频的课程
                    return;
                }
            }
        }
    }




    else if(href.indexOf("StepLearn/StepLearn")!=-1){//视频播放页面
        var timeText
        var videoFlag = null
        var videoList = document.getElementsByClassName("a-border  CourseLeftmenu")[0].getElementsByTagName("a")


        function isTimeOut(){

            if(timeText == document.getElementById("learnTime").innerHTML){

                //时间条长时间未变动
                timeText = document.getElementById("learnTime").innerHTML
                if(timeText.indexOf("0/0") != -1){
                    //时间条一直显示0/0
                    location.reload(true);
                }else if(timeText.split("/")[0] == "0分0秒"){
                    //时间条一直显示0分0秒
                    location.reload(true);
                }else if(timeText.split("/")[0].split("分")[0] == timeText.split("/")[1].split("分")[0]){
                    //时间条已满
                    if(videoFlag == 0){document.getElementById("exit").click()}//看完一课后退出重新登录，防止超时掉线
                }
                else{
                    //时间条中途停止，一般为弹出题目
                    location.reload(true);
                }
            }else{

                //时间条有变动
                timeText = document.getElementById("learnTime").innerHTML
                document.getElementsByClassName("Left title")[0].innerHTML = timeText
                if(timeText.split("/")[0].split("分")[0] == timeText.split("/")[1].split("分")[0]){
                    //时间条已满
                    if(videoFlag == 0){location.reload(true);}//时间条走满后先刷新一次，防掉线
                }
            }
        }


        function isVideoFinish(){
            var temp;
            for(temp = 0;temp < videoList.length;temp++){
                if(videoList[temp].className == "listdot" || videoList[temp].className == "default"){//此处为未看视频标签的class标识
                    videoList[temp].click()
                    return
                }else if(videoList[temp].className.indexOf("go") != -1 || videoList[temp].className == "listdot listdot-y"){//此处为正在观看视频标签的class标识
                    var videoObj = document.getElementsByName("rightFrame")[0].contentWindow.document.getElementsByTagName('video')[0]
                    videoObj.autoplay = true
                    videoObj.play()
                    videoObj.currentTime = videoObj.duration - 1
                    return
                }
            }
            clearInterval(videoFlag)
            videoFlag = 0
        }

        //测试代码

        //测试代码结束

        setTimeout(function(){timeText = document.getElementById("learnTime").innerHTML;},2000)

        setInterval(function(){isTimeOut();},3000)
        videoFlag = setInterval(function(){isVideoFinish();},4000)

        setTimeout(function(){location.reload(true);},610000)//视频页面每十分钟刷新一次，防止掉线
    }



    else{
        //其余所有页面均跳转至个人工作室页面
        if(top == self) setTimeout(function(){window.location.href="https://activity.ourteacher.com.cn/"},1000)
    }
})();