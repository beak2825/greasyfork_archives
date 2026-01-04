// ==UserScript==
// @name         云学堂视频辅助
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description 云学堂视频自动刷课
// @author       兜里有糖
// @match        http://*.yunxuetang.cn/kng/trn/mybuyedcourse.htm
// @match        http://*.yunxuetang.cn/kng/view/package/*
// @match        http://*.yunxuetang.cn/kng/course/package/video/*
// @match        http://*.yunxuetang.cn/kng/course/package/scorm/*
// @match        http://*.yunxuetang.cn/kng/view/*
// @match        http://*.yunxuetang.cn/kng/course/package/document/*
// @match        http://*.yunxuetang.cn/kng/knowledgecatalogsearch.*
// @match        http://sunmei.yunxuetang.cn/exam/*
// @icon         https://picobd.yunxuetang.cn/media/userfiles/userphotos/default/78.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443385/%E4%BA%91%E5%AD%A6%E5%A0%82%E8%A7%86%E9%A2%91%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/443385/%E4%BA%91%E5%AD%A6%E5%A0%82%E8%A7%86%E9%A2%91%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
const titleMap={};
const beginHour=0;
const endHour=24;
const ignoreTitles=["插上创新的翅膀，为业主服务之心飞翔","铸爱物业人，修行精品路"];
const ignoreSMTitles=[];//"绩效考核与奖金发放法律风险与防控","八招成为薪酬核算高手","店长认证项目全解","CJ008-酒店门锁篇"
(function() {
    'use strict';
    //点击【继续学习】的方法
    function autoContinue(continueBtn) {
        if (continueBtn && continueBtn.click) {
            var imitateMousedown = document.createEvent("MouseEvents");
            imitateMousedown.initEvent("mousedown", true, true);
            continueBtn.dispatchEvent(imitateMousedown);
            continueBtn.click();
            if (console && console.log) {
                console.log('找到并点击了[继续学习]');
            }
        }
    }

    //判断当前是否在学习时间段内
    function isTimeAvailable(){
        let date=new Date()
        let hour=date.getHours()
        if(Number(hour) >= endHour || Number(hour) < beginHour ){
            console.log('已经超过播放区间：【'+beginHour+'--'+endHour+'】','当前时间为：'+date)
            return false;
        }
        return true;
    }
    //判断一个元素是否在一个数组中
    function isInArray(arr,value){
        if(arr ==null || arr.length ==0 || value==null || value ==''){
            return false
        }
        for(var ini=0;ini< arr.length; ini++){
            if(value == arr[ini]){
                return true
            }
        }
        return false
    }
    //根据视频时长设置播放速度
    function getSpeedRate(d){
        if(d<200){
            return 1
        }else if(d<300){
            return 1.25
        }else if(d<420){
            return 1.5
        }else if(d<600){
            return 1.75
        }else {
            return 2
        }
    }
    //存放有考试的标题,用|分割
    function saveExamTitle(title){
        var temptitles=localStorage.getItem('examTitles')
        if(temptitles==null){
            localStorage.setItem('examTitles',title)
            return
        }
        if(temptitles.indexOf(title) ==-1){
            temptitles+=('|'+title)
            localStorage.setItem('examTitles',temptitles)
        }
    }
    //检查当前标题是否被记录在examTitles中
    function isExamTitle(title){
        var temptitles=localStorage.getItem('examTitles')
        if(temptitles==null)return false
        let indexOf= temptitles.indexOf(title)
        if(indexOf==-1)return false
        return true
    }

    setInterval(()=>{
        try{
            //去掉弹窗
            var dialogNode=document.getElementById('dvWarningView');
            if(dialogNode!=null){
                var continueBtn = document.querySelector("#reStartStudy");
                autoContinue(continueBtn)
            }else if(player!=null && player.bdPlayer.getState()=='paused'){
                player.bdPlayer.setMute(true);//静音
                player.bdPlayer.play();
            }

        }catch(e){
            console.log(e)
        }
        //检查进度是否到100%
        try{
            var currentProgress=document.getElementById('ScheduleText').innerText
            if(currentProgress == '100%'){
                if(location.href.indexOf('document') > -1){//刷的是文档部分
                    localStorage.setItem('nextVideo',true)
                    window.close()
                }
                if(player!=null && (player.bdPlayer.getState()=='complete' || player.bdPlayer.getState()=='buffering')){//防止一到100%就关闭视频，导致后台没有达到100%(不能随便拖动进度条)
                    localStorage.setItem('nextVideo',true)
                    window.close()
                }
                //临时功能
                setTimeout(()=>{
                    localStorage.setItem('nextVideo',true)
                    window.close()
                },5000)
            }else if(player!=null && (player.bdPlayer.getState()=='complete' || player.bdPlayer.getState()=='buffering')){//如果没有到100%且视频播放完了 或者 视频一直缓冲中，那么再重新播放一遍
                document.location.reload();
            }
        }catch(e){
            console.log(e)
        }
        //如果当前是考试，则直接记录，然后关闭
        try{
            let btnTestNode= document.getElementById('btnTest')
            if(btnTestNode!=null){
                let examTitle= document.getElementById('lblExamName').innerText
                saveExamTitle(examTitle)
                localStorage.setItem('nextVideo',true)
                window.close()
            }
        }catch(e){
            console.log(e)
        }

        //设置播放器倍速和静音
        try{
            var SPEAD=2
            //if(player!=null){
            //    let allDuration=player.bdPlayer.getDuration()
            //    SPEAD=getSpeedRate(allDuration)
            //}
            if(player!=null && player.bdPlayer.getPlaybackRate() != SPEAD){
                let allDuration=player.bdPlayer.getDuration()
                SPEAD=getSpeedRate(allDuration)
                player.bdPlayer.setPlaybackRate(SPEAD)
            }
            if(player!=null && player.bdPlayer.getMute() == false){
                player.bdPlayer.setMute(true)
            }

        }catch(e){
            console.log(e)
        }
        //如果有关闭此学习卡或继续的弹窗，则点击继续学习
        try{
            var continueButtons=document.getElementsByClassName('btnok')
            for(let cIndex=0;cIndex<continueButtons.length;cIndex++){
                let cButton=continueButtons[cIndex]
                if(cButton.value == '继续学习'){
                    autoContinue(cButton)
                }
            }
        }catch(e){
            console.log(e)
        }
    },1000*10);

    //我的课程页面，并跳转到课程详情
    // titleMap={}
    try{
        console.log('isTimeAvailable',isTimeAvailable())
        var courseListNode=document.getElementsByClassName('el-my-course-list clearfix')[0];
        for(var courseIndex=(courseListNode.children.length - 1);courseIndex >= 0;courseIndex--){
            var courseNode=courseListNode.children[courseIndex];
            var buttonNode= courseNode.children[0].children[1].children[0];
            var title=courseNode.children[1].children[0].innerText;
            var progressNode=courseNode.children[1].children[1].innerText;
            var progress=progressNode.match(/\d+\%/)[0]
            titleMap[title]=progress;
            if((progress !='100%') && !isInArray(ignoreTitles,title)){
                if(isTimeAvailable()){
                    buttonNode.click()
                }
                break;
            }
        }
        //  console.log(titleMap)
        setInterval(()=>{
            var nextVideo=localStorage.getItem('nextVideo')
            console.log('nextVideo',nextVideo)
            if(!isTimeAvailable()){
                //在不可用的时间段内，再重新初始化一下开始的开关
                localStorage.setItem('nextVideo',true)
                return
            }
            if(nextVideo == 'true'){
                localStorage.setItem('nextVideo',false)
                document.location.reload();
            }
        },20000)
    }catch(e){
        console.log(e)
    }

    //尚美生活学知识列表
    try{
        var courseNodelist=document.getElementsByClassName('el-kng-img-list clearfix')[0]
        var nextPageNode=document.getElementsByClassName('pagetext')[1]
        for(let smIndex=0; smIndex < courseNodelist.children.length;smIndex++){
            let smCourseNode=courseNodelist.children[smIndex]
            let imgNode= smCourseNode.children[1].firstElementChild.firstElementChild
            if(imgNode==null){
                imgNode=smCourseNode.children[1].firstElementChild
            }
            let tagTitle=smCourseNode.lastElementChild.firstElementChild.innerText
            let tagProgress= smCourseNode.children[0].children[0].innerText
            console.log('当前课程的状态',tagProgress)
            if(tagProgress !='已完成'&& !isInArray(ignoreSMTitles,tagTitle) && !isExamTitle(tagTitle)){
                console.log(tagTitle,imgNode)
                imgNode.click()
                break
            }
            if(smIndex == courseNodelist.children.length-1){
                nextPageNode.click()
            }
        }
        setInterval(()=>{
            var nextVideo=localStorage.getItem('nextVideo')
            console.log('nextVideo',nextVideo)
            if(!isTimeAvailable()){
                //在不可用的时间段内，再重新初始化一下开始的开关
                localStorage.setItem('nextVideo',true)
                return
            }
            if(nextVideo == 'true'){
                localStorage.setItem('nextVideo',false)
                document.location.reload();
            }
        },20000)
    }catch(e){
        console.log(e)
    }

    //进入课程介绍页面
    try{
        var titleNodes=document.getElementsByClassName('clearfix pr')
        if(titleNodes!=null && titleNodes.length>0){
            var detailTitle=document.getElementsByClassName('clearfix pr')[1].children[1].children[0].innerText
            console.log(detailTitle)
        }
    }catch(e){
        console.log(e)
    }

    try{
        var btnStartStudy= document.getElementById('btnStartStudy')
        if(btnStartStudy!=null){
            btnStartStudy.click()
            console.log('开始学习')
        }
    }catch(e){
        console.log(e)
    }

    console.log('在运行中...')

})();
