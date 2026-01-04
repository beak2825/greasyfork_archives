// ==UserScript==
// @name         微学苑
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  看视频
// @author       荷包蛋。
// @match        *://mooc.baosteel.com/*
// @icon         http://mooc.baosteel.com/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/459306/%E5%BE%AE%E5%AD%A6%E8%8B%91.user.js
// @updateURL https://update.greasyfork.org/scripts/459306/%E5%BE%AE%E5%AD%A6%E8%8B%91.meta.js
// ==/UserScript==
var study_css = ".egg_study_btn{outline:0;border:0;position:fixed;top:10px;left:10px;z-index:999;padding:10px 12px;border-radius:10px;cursor:pointer;background-color:#fff;color:#d90609;font-size:16px;font-weight:bold;text-align:center;box-shadow:0 0 9px #666777}.egg_study_btn2{top:80px;}";
GM_addStyle(study_css);

//课程是否要满分，1是,0则是及格就好
const IsFullScore = 0;

(function() {
    'use strict';
    $(document).ready(function(){
        let url = window.location.href;
        if(url.indexOf("/user/record/noteDetail") != -1){
            console.log("专区课程记录");
            if(GM_getValue("startTraining") == 1){
                //已经开始了学习
                lookTrainingInfo();
            }
        }else if(url.indexOf("/user/record") != -1){
            console.log("我的记录");
            if(GM_getValue("startCourse") == 1 || GM_getValue("startTraining") == 1){
                //创建停止学习的按钮
                createStopBtn();
                //已经开始了学习
                selectStudy();
            }
        }else if(url.indexOf("/course/business") != -1){
            console.log("公开课程选课页面");
        }else if(url.indexOf("/zone") != -1){
            console.log("学习专区选课页面");
        }else if(url.indexOf("/course") != -1 && url.indexOf("/play") != -1){
            console.log("课程播放");
            if(GM_getValue("startCourse") == 1 || GM_getValue("startTraining") == 1){
                //已经开始了学习
                study();
            }
        }else if(url.indexOf("/course") != -1 && url.indexOf("/detail") != -1){
            console.log("课程详情");
            if(GM_getValue("startCourse") == 1 || GM_getValue("startTraining") == 1){
                //已经开始了学习
                lookCourseInfo();
            }
        }else{//否则直接全局静音
            console.log("主页");
            console.log("清除缓存")
            createStartCourseButton();
            createStartTrainingButton();
            GM_setValue("startCourse",0);
            GM_setValue("startTraining",0);
        }
    });

    //学习视频
    function watchVideo(vid){
        return new Promise(resolve => {
            //vid.playbackRate = 15;
            setTimeout(function(){
                setInterval(function(){
                    if(!vid.muted){
                        vid.muted = true;
                    }
                    if(vid.paused){
                        console.log('尝试播放');
                        vid.play();
                    }
                },1000);
            },2000);
            vid.addEventListener('ended', function() {
                resolve('done');
            }, false);
        });
    }

    async function study(){
        await Sleep(3000);
        let remainStudyTime = GM_getValue("remainStudyTime");
        //监听弹窗
        setInterval(function(){
            let alertWindow = document.querySelector(".ant-modal-content");
            if(alertWindow){
                alertWindow.querySelector(".ant-btn-primary").click();
            }
        },5000);
        while(remainStudyTime > 0){
            let vid = document.querySelector("video");
            if(!vid){
                //这个视频需要手动学习
                remainStudyTime = -1;
            }else{
                //等待观看完视频
                await watchVideo(vid);
                console.log("播放完成")
                remainStudyTime -= vid.duration;
                GM_setValue("remainStudyTime",remainStudyTime);
                await Sleep(1500);
                let nextBtn = null;
                let nextBtns = document.querySelectorAll(".go-next");
                for(let i = 0 ; i<nextBtns.length; i++){
                    if(nextBtns[i].innerText.indexOf("学习下一节") != -1){
                        nextBtn = nextBtns[i];
                        break;
                    }
                }
                if(nextBtn != null){
                    nextBtn.click();
                    await Sleep(3000);
                }else{
                    remainStudyTime = -1;
                }
            }
        }
        //学完了(或者学不了,关闭窗口
        closeTab();
    }

    //获取学习时间
    function getStudyDuration(courseId){
        return new Promise(function(resolve) {
            $.ajax({
                type: "POST",
                url: "http://mooc.baosteel.com/qm/api/v5/strategy/mylist",
                xhrFields: {
                    withCredentials: true
                },
                dataType: "json",
                data:{
                    course_id:courseId
                },
                success: function(res){
                    if(res.isSuccess){
                        console.log(res.data)
                        //获得当前分数
                        let score = res.data.csVo.score;
                        //获得总学习时间
                        let sumStudyTime = res.data.csVo.duration;
                        //获得当前学习时间
                        let currStudyTime = res.data.list[0].compete_data;
                        //计算剩余时间
                        let remainStudyTime = sumStudyTime - currStudyTime;
                        resolve({
                            score:score,
                            remainStudyTime:remainStudyTime
                        });
                    }else{
                        resolve(null);
                    }
                },
                error: function(){
                    resolve(null);
                }
            });
        })
    }

    //查看课程信息
    async function lookCourseInfo(){
        await Sleep(1000);

        let remainStudyTime = 0;
        let score = 0;
        //通过请求的方式获得分数和学时
        let courseId = location.href.split("/")[5];
        let data = await getStudyDuration(courseId);
        if(data){
            console.log(data)
            score = data.score;
            remainStudyTime = data.remainStudyTime;
        }else{
            //如果获取请求失败，则通过DOM的方式获取
            await Sleep(1000);
            //点击"完成情况"按钮
            document.querySelector(".finished-btn").click();
            await Sleep(1000);
            let currStudyTime = Number.parseFloat(document.querySelector(".ant-table-tbody").querySelectorAll("td")[2].innerText);
            let sumStudyTime = Number.parseFloat(document.querySelector(".min").innerText);
            //获取分数
            score = Number.parseFloat(document.querySelector(".ant-table-tbody").querySelectorAll("td")[3].innerText);
            //计算剩余时间，换算成秒
            remainStudyTime = (sumStudyTime-currStudyTime)*60;
        }

        let needStudy = true;

        if(IsFullScore == 1){
            //需要满分
            if(score == 100){
                needStudy = false;
            }
        }else{
            //只需要及格
            if(score >= 60){
                needStudy = false;
            }
        }

        if(needStudy){
            //还需要继续学习
            if(remainStudyTime > 0){
                //剩余时长大于0，还没学完，则开始学习
                GM_setValue("remainStudyTime",remainStudyTime);
                let url = window.location.href.split("detail")[0] + "play?backUrl=" + window.location.href;
                let studyPage = GM_openInTab(url,{active: true,insert: true, setParent :true});
                let studying = setInterval(function() {
                    if(studyPage.closed) {
                        clearInterval(studying);
                        location.reload();//刷新页面，重新判断有没有
                    }
                }, 5000);
            }else{
                //学完了,关闭窗口
                closeTab();
            }
        }else{
            //学完了,关闭窗口
            closeTab();
        }
    };

    //查看专区课信息
    async function lookTrainingInfo(){
        await Sleep(3000);
        let courses = document.querySelectorAll(".course_list_cont");
        for(let i =0; i < courses.length; i++){
            //当前分数
            let score = courses[i].querySelector(".gobtn");
            if(score){
                //如果有分数
                score = Number.parseFloat(score.innerText);
                if(IsFullScore == 1 && score == 100){
                    //如果需要满分,且已经满分,则学完了
                }else if(IsFullScore != 1 && score >= 60){
                    //如果不需要满分,且已经及格,则学完了
                }else{
                    //否则没学完，继续学
                    await studyProject(courses[i]);
                }
            }else{
                //还没开始学过，开始学
                await studyProject(courses[i]);
            }
        }
    };

    function createStartCourseButton(){
        let body = document.getElementsByTagName("body")[0];
        let startButton = document.createElement("button");
        startButton.setAttribute("id","startButton");
        startButton.innerText = "学习公开课";
        startButton.className = "egg_study_btn";
        try{
            startButton.addEventListener("click",startCourse,false);
        }catch(e){
            try{
                startButton.attachEvent('onclick',startCourse);
            }catch(e){
                console.log("开始学习按钮绑定事件失败")
            }
        }
        body.append(startButton)
    }

    function createStartTrainingButton(){
        let body = document.getElementsByTagName("body")[0];
        let startButton = document.createElement("button");
        startButton.setAttribute("id","startButton");
        startButton.innerText = "学习专区课";
        startButton.className = "egg_study_btn egg_study_btn2";
        try{
            startButton.addEventListener("click",startTraining,false);
        }catch(e){
            try{
                startButton.attachEvent('onclick',startTraining);
            }catch(e){
                console.log("开始学习按钮绑定事件失败")
            }
        }
        body.append(startButton)
    }

    function createStopBtn(){
        let body = document.getElementsByTagName("body")[0];
        let stopButton = document.createElement("button");
        stopButton.setAttribute("id","stopButton");
        stopButton.innerText = "停止学习";
        stopButton.className = "egg_study_btn egg_study_btn";
        try{
            stopButton.addEventListener("click",stopTraining,false);
        }catch(e){
            try{
                stopButton.attachEvent('onclick',stopTraining);
            }catch(e){
                console.log("开始学习按钮绑定事件失败")
            }
        }
        body.append(stopButton)
    }

    //学习公开课的（专区课记录页面也用这个）
    function studyProject(course){
        return new Promise(resolve => {
            let courseInfo = course.querySelector("a");
            console.log("开始学习课程 " + courseInfo.innerText)
            let studyPage = GM_openInTab(courseInfo.href,{active: true,insert: true, setParent :true});
            let studying = setInterval(function() {
                if(studyPage.closed) {
                    clearInterval(studying);
                    resolve('done');
                }
            }, 5000);
        })
    }

    //学习专区课的
    function studyProject2(course){
        return new Promise(resolve => {
            let studyPage = GM_openInTab(course.href,{active: true,insert: true, setParent :true});
            let studying = setInterval(function() {
                if(studyPage.closed) {
                    clearInterval(studying);
                    resolve('done');
                }
            }, 5000);
        })
    }

    //选择公开课或专区课开始学习
    async function selectStudy(){
        await Sleep(3000);
        if(GM_getValue("startTraining") == 1){
            //学习专区课
            document.querySelectorAll(".ant-tabs-tab")[3].click();
            await Sleep(1500);
            let courses = document.querySelector(".ant-tabs-tabpane-active").querySelectorAll(".course_list_cont");
            for(let i =0; i < courses.length; i++){
                let course = courses[i].querySelector(".list_link").querySelector("a");
                if(course){
                    await studyProject2(course);
                }
            }
        }else{
            let courses = document.querySelector(".ant-tabs-tabpane-active").querySelectorAll(".course_list_cont");
            for(let i =0; i < courses.length; i++){
                //当前分数
                let score = courses[i].querySelector(".gobtn");
                if(score){
                    //如果有分数
                    score = Number.parseFloat(score.innerText);
                    if(IsFullScore == 1 && score == 100){
                        //如果需要满分,且已经满分,则学完了
                    }else if(IsFullScore != 1 && score >= 60){
                        //如果不需要满分,且已经及格,则学完了
                    }else{
                        //否则没学完，继续学
                        await studyProject(courses[i]);
                    }
                }else{
                    //还没开始学过，开始学
                    await studyProject(courses[i]);
                }
            }
        }
        //学完了
        alert("学完了");
        GM_setValue("startCourse",0);
        GM_setValue("startTraining",0);
    }

    function Sleep(time){
        if(!Number.isInteger(time)){
            time = 1000;
        }
        return new Promise(resolve => {
            setTimeout(function(){
                resolve('done');
            },time);
        });
    }

    function closeTab(){
        window.open('', '_self', '');
        window.close();
    }

    function startCourse(){
        console.log("开始学习公开课");
        GM_setValue("startCourse",1);
        GM_openInTab("http://mooc.baosteel.com/#/user/record",{active: true,insert: true, setParent :false});
        window.close();
    }

    function startTraining(){
        console.log("开始学习专区课");
        GM_setValue("startTraining",1);
        GM_openInTab("http://mooc.baosteel.com/#/user/record",{active: true,insert: true, setParent :false});
        window.close();
    }

    function stopTraining(){
        console.log("停止学习");
        GM_setValue("startCourse",0);
        GM_setValue("startTraining",0);
        window.location.reload();
    }
})();