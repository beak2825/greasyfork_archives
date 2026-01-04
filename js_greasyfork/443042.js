// ==UserScript==
// @name 东奥会计人员在线继续教育刷课脚本
// @namespace https://blog.mcraft.cn/s/DongaoStudy.html
// @version 0.1
// @description 东奥会计人员在线继续教育
// @author 7
// @match *://*.dongao.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/443042/%E4%B8%9C%E5%A5%A5%E4%BC%9A%E8%AE%A1%E4%BA%BA%E5%91%98%E5%9C%A8%E7%BA%BF%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/443042/%E4%B8%9C%E5%A5%A5%E4%BC%9A%E8%AE%A1%E4%BA%BA%E5%91%98%E5%9C%A8%E7%BA%BF%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    var href = location.href;
    var text;
    var i;

    if(href.indexOf("study/u/myCourse")!=-1){
        if(href.indexOf("auto=true")!=-1){
            //我的课程页面
            for(i=0;i<document.getElementsByClassName("operate-a active").length;i++){
                //进入第一门未完成课程
                text = document.getElementsByClassName("operate-a active")[i].innerText;
                if(text=="继续学习" || text=="开始学习"){
                    //自动开始学习
                    document.getElementsByClassName("operate-a active")[i].click();
                    break;
                }
            }
            //关闭页面
            window.close();
        }else{
            setInterval(function(){
                location.reload();
            },300000);

            //GM_setValue("accountId", href.match(/(\d+)/)[1]);
            var tb = document.getElementsByClassName("table all")[0];
            var rows = tb.rows;
            var rowNum = tb.rows.length;

            for (i = (rowNum-1); i >= 1; i--){
                if(rows[i].cells[6].innerText.indexOf("已完成") != -1){
                    tb.deleteRow(i);
                }
            }
        }
    }else if(href.indexOf("lecture/lectureList")!=-1){
        //课程目录页面
        //是否有下一节课
        var findNextCourseID = false;
        var courseID;
        for(i=0;i < document.getElementsByClassName("item-button1").length;i++){
            text=document.getElementsByClassName("item-button1")[i].innerText;
            if(text=="继续学习" || text=="开始学习"){
                var onclickValue = document.getElementsByClassName("item-button1")[i].getAttributeNode("onclick").nodeValue;
                courseID = onclickValue.match(/(\d+),(\d+)/);
                var endhref=href.indexOf("/lecture");
                var prefix=href.substring(endhref);
                findNextCourseID = true;
                break;
                //document.getElementsByClassName("item-button1")[i].click();
                //break;
            }
        }
        //尝试学习下一节课
        if(findNextCourseID == true){
            location.href="http://"+location.host+"/cwweb/videoShow/video/videoPlay?lectureID="+courseID[2]+"&cwID="+courseID[1];
        }else{
            //否则打开主页，并自动学习下一门课
            //location.href = "http://study.dongao.com/study/u/myCourse?accountId=" + GM_getValue("accountId") + "&auto=true";
            jumpToMainPage();
        }
    }else if(href.indexOf("video/videoPlay")!=-1){
        //视频结束后回到主目录
        var currentTime = (new Date()).getTime();
        setInterval(function(){
            //如果90分钟没有
            if((new Date()).getTime() - currentTime > 5400000){
                //checkVideoShow();
                jumpToMainPage();
            }
        },300000);

        document.getElementById('syno-nsc-ext-gen3').click();
        timerReopenMainPage();

        var paused = false;
        //自动点击弹窗
        setInterval(function(){
            var clickSure = document.querySelector(".box-sure");
            if(clickSure != null) clickSure.click();

            //如果视频暂停超过10秒，返回主页/课程目录
            if(isVideoPaused() == true){
                if(paused == true){
                    //checkVideoShow();
                    jumpToMainPage();
                }
                paused = true;
            }else{
                paused = false;
            }
        },10000);
    }
    function checkVideoShow(){
        var endhref=href.indexOf("/videoShow");
        var prefix=href.substring(endhref);
        var cwId=href.substring(href.indexOf("cwID="),href.indexOf("&lectureID"));
        cwId=cwId.substring(5);
        location.href="http://"+location.host+"/cwweb/lecture/lectureList?cwID="+cwId;
    }
    function jumpToMainPage(){
        location.href = "http://study.dongao.com/study/u/myCourse?auto=true";
    }
    function isVideoPaused(){
        return window.video.paused();
    }
    function getVideoTotalTime(){
        return window.video.getTotalTime();
    }
    function timerReopenMainPage(){
        setTimeout(function(){
            if(isVideoPaused()){
                window.video.play();
            }
            setTimeout(function(){
                jumpToMainPage();
            },parseInt(getVideoTotalTime()*1000/2+10000));
        },5000);
    }
})();