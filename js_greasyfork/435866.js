// ==UserScript==
// @name         职培云刷课-学习中心的未完成课程
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  可以将学习中心中的所有未完成课程的课时刷满(个人仅有此需求，如有其他需求者可自行修改代码)
// @author       攸泠
// @match        https://px.class.com.cn/player/*
// @match        https://px.class.com.cn/study/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435866/%E8%81%8C%E5%9F%B9%E4%BA%91%E5%88%B7%E8%AF%BE-%E5%AD%A6%E4%B9%A0%E4%B8%AD%E5%BF%83%E7%9A%84%E6%9C%AA%E5%AE%8C%E6%88%90%E8%AF%BE%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/435866/%E8%81%8C%E5%9F%B9%E4%BA%91%E5%88%B7%E8%AF%BE-%E5%AD%A6%E4%B9%A0%E4%B8%AD%E5%BF%83%E7%9A%84%E6%9C%AA%E5%AE%8C%E6%88%90%E8%AF%BE%E7%A8%8B.meta.js
// ==/UserScript==

(function() {
    /*获取当前页面的url，用以判断执行哪一部分脚本*/
    var url = window.location.href;
    /*如果含有未完成的课程，则自动进入课程中*/
    if(url.indexOf('study/myclass/index')!=-1){
        var unfinished = document.getElementsByClassName('class-list-box')[0].getElementsByClassName('unfinished');
        if(unfinished.length>0){
            /*进入课程*/
            unfinished[0].getElementsByClassName('title')[0].click();
        }
        /*如果课程中含有未完成视频，则自动进入该课程,否则返回班级*/
    }else if(url.indexOf('study/myclass/course')!=-1){
        var finish_no = document.getElementsByClassName('list-box')[0].getElementsByClassName('finish-no');
        if(finish_no.length>0){
            /*进入视频*/
            finish_no[1].getElementsByTagName('button')[0].click();
        }else{
            /*返回班级*/
            document.getElementsByClassName('text-header')[0].getElementsByTagName('a')[0].click();
        }
    }else{
        /*当前观看的课程*/
        var current;
        /*课程中的所有课程*/
        var list;
        /*观看状态：1表示当前视频未看完，0表示当前视频已看完(已完成课程重刷)*/
        var lessonstatus = 1;
        /*查看模式：0代表未看完的方式，1代表已看完重刷一次，默认1即可刷所有视频，0只能刷未看完的视频*/
        var watchmode = 0;
        /*开始统计视频总时长(5秒内可自行选择起始视频)*/
        setTimeout(function() {
            /*分*/
            var minute = -1;
            /*秒*/
            var second = 0;
            /*课程内所有视频*/
            list = document.getElementById("list_chapter").getElementsByClassName("section");
            /*时间累加*/
            for(var i = 0; i < list.length; i++) {
                //定位到当前视频
                if(list[i].className.indexOf("active")!=-1) {
                    current = i;
                    minute = 0;
                }
                if(minute >= 0){
                    minute += parseInt(list[i].getElementsByClassName("time")[0].innerHTML.split(":")[0]);
                    second += parseInt(list[i].getElementsByClassName("time")[0].innerHTML.split(":")[1]);
                }
            }
            minute += parseInt(second/60);
            var time = document.createElement('div');
            time.style = "position:fixed;;top:20px;left:30%;background-color: pink;";
            time.innerText = '视频总长'+minute+'分'+second%60+'秒，已开启自动播放，感谢使用攸泠脚本！';
            document.body.append(time);
        }, 5000);

        /*刷已完成课程*/
        /*因为是iframe标签，所以使用监听非常麻烦，这里采用计时的方式*/
        /*考虑到网络延时，多增加了10秒延迟*/
        function watchover(){
            lessonstatus = 0;
            var minute = parseInt(list[current].getElementsByClassName("time")[0].innerHTML.split(":")[0]);
            /*随机时间，10代表0-10，5代表0-10加了5秒，即5-15秒*/
            var second = parseInt(list[current].getElementsByClassName("time")[0].innerHTML.split(":")[1]) + (Math.random() * 10) + 5;
            if(second>=60){
                minute ++;
                second -= 60;
            }
            document.getElementById('list_chapter').getElementsByClassName("active")[0].innerHTML += "-"+minute+":"+second;
            console.log(current);
            setTimeout(function() {
                current ++;
                list[current].click();
                lessonstatus = 1;
            }, (minute * 60 + second) * 1000);
        }
        /*刷未完成课程*/
        function watchnew(){
            var test = list[current].getElementsByClassName("status-done")[0].innerText;
            //判断是否播放完成
            if(current >= list.length-1){
                document.getElementsByClassName('btn-back')[0].getElementsByTagName('a')[0].click();
            }else{
                if(typeof(test) != "undefined") {
                    console.log("视频已播放完成:" + test);
                    current ++;
                    list[current].click();
                }
            }
        }
        /*定时启动判断程序*/
        setInterval(function() {
            if (watchmode == 1){
                if (lessonstatus == 1){
                    watchover();
                }
            }else{
                watchnew();
            }
        },10000)
    }
})();