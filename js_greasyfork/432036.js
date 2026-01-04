// ==UserScript==
// @name         不学习何以提升信息技术应用能力
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  看看视频，看看文章。
// @author       荷包蛋。
// @match        https://jstsgc.gdedu.gov.cn/info2/pinfo/teacherSpace/home.action
// @match        https://scnu.djtedu.cn/student.html
// @match        https://preview.dccloud.com.cn/?ssl=*&furl=*
// @icon         https://dckj.ks3-cn-guangzhou.ksyun.com/ltedu3/20210410/807d6bbf-80f8-44d6-82ab-44b0b8a5a3fc.png
// @require      https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.9.0/js/md5.min.js
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/432036/%E4%B8%8D%E5%AD%A6%E4%B9%A0%E4%BD%95%E4%BB%A5%E6%8F%90%E5%8D%87%E4%BF%A1%E6%81%AF%E6%8A%80%E6%9C%AF%E5%BA%94%E7%94%A8%E8%83%BD%E5%8A%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/432036/%E4%B8%8D%E5%AD%A6%E4%B9%A0%E4%BD%95%E4%BB%A5%E6%8F%90%E5%8D%87%E4%BF%A1%E6%81%AF%E6%8A%80%E6%9C%AF%E5%BA%94%E7%94%A8%E8%83%BD%E5%8A%9B.meta.js
// ==/UserScript==

var study_css = ".egg_study_btn{outline:0;border:0;position:fixed;top:5px;left:5px;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#fff;color:#d90609;font-size:18px;font-weight:bold;text-align:center;box-shadow:0 0 9px #666777;z-index: 999;}";
GM_addStyle(study_css);

const homePageUrl = "https://jstsgc.gdedu.gov.cn/info2/pinfo/teacherSpace/home.action";
const studyPageUrl = "https://scnu.djtedu.cn/student.html";
const articlePageUrl = "https://preview.dccloud.com.cn"
var currUrl = window.location.href;

var currArticle = -1;

(function() {
    'use strict';
    if(currUrl.indexOf(homePageUrl) != -1){
        //如果是首页
        createStartButton();
    }else if(currUrl.indexOf(studyPageUrl) != -1){
        //如果是学习页面
        console.log("学习")
        study();
    }else if(currUrl.indexOf(articlePageUrl) != -1){
        console.log("阅读文章")
        readAtricle();
    }

    //获取video标签
    function getVideoTag(){
        let iframe = document.getElementsByTagName("iframe")[0];
        let video = null;
        let pauseButton = null;
        if(iframe){
            //如果有iframe,说明外面的video标签是假的
            video = iframe.contentWindow.document.getElementsByTagName("video")[0];
        }else{
            //否则这个video标签是真的
            video = document.getElementsByTagName("video")[0];
        }
        return video;
    }

    //看视频
    function watchVideo(){
        return new Promise(resolve => {
            let playTime = 0;
            let video = getVideoTag();
            if(video){
                if(!video.muted){
                    video.muted = true;
                }
                if(playTime == 0){
                    playTime = video.currentTime;
                }
                let checkMideaInterval = setInterval(function(){
                    if(video.paused){
                        if(video.duration > playTime){
                            try{
                                video.play();
                            }catch(e){}
                        }else{
                            console.log("播放完了")
                            clearInterval(checkMideaInterval);
                            resolve('done');
                        }
                    }else{
                        console.log("正在播放视频")
                        playTime += 2.5;
                        if(playTime == video.duration || playTime > video.duration){
                            console.log("播放完了")
                            clearInterval(checkMideaInterval);
                            resolve('done');
                        }
                    }
                },2500);
            }
        })
    }

    //获取未完成的视频
    function getVideo(){
        let video = null;
        let videos = document.querySelectorAll(".public-articleSlideList");
        let key = md5(document.querySelector(".left-content h3").innerText);
        let currVideo = getCookie("currVideo");
        console.log(key)
        console.log(currVideo)
        if(videos && videos.length != 0){
            //有一组视频
            for(let i = 0; i < videos.length; i++){
                let status = videos[i].querySelector(".video-status");
                status = status.innerText;
                if(status != "已学习"){
                    if(key == currVideo){
                        //已经播放完了，但是还没更新状态
                        //跳过
                        video = null;
                    }else{
                        //还没学过
                        setCookie("currVideo",key);
                        video = document.querySelectorAll(".public-articleSlideList");
                        video = {
                            btn:videos[i].querySelector(".el-icon-video-play"),
                            status:status
                        }
                        break;
                    }
                }
            }
        }else{
            //只有一个视频,或者没有视频
            let temp = document.querySelector("video");
            if(temp){
                //用笨办法，自己检测
                if(key == currVideo){
                    //已经播放完了，但是还没更新状态
                    //跳过
                    video = null;
                }else{
                    //还没学过
                    setCookie("currVideo",key);
                    video = {
                        btn:null,
                        status:"未完成"
                    }
                }
            }else{
                //没有视频
                video = null;
            }
        }
        return video;
    }

    //看文章（PPT）
    async function readAtricle(){
        await Sleep(7000);
        // let pageCount = document.getElementById("PageCount");
        // let nextBtn = document.getElementById("pageNext");
        // if(pageCount && nextBtn){
        //     console.log("PPT")
        //     //获取总共有多少页
        //     pageCount = Number.parseInt(pageCount.innerText);
        //     let i = 0;
        //     while(i < pageCount){
        //         await Sleep(2500);
        //         nextBtn.click();
        //         i++;
        //     }
        // }else{
        //     console.log("文章")
        //     let scrollItem = document.getElementById("ctn");
        //     let scrollLength = scrollItem.scrollHeight;
        //     let part = scrollLength/40;
        //     if(scrollItem){
        //         let num = scrollLength - part;
        //         while(num > 0){
        //             scrollItem.scrollTo(0,scrollLength - num);
        //             num -= part;
        //             await Sleep(1000);
        //         }
        //     }else{
        //         await Sleep(scrollLength * 10);
        //     }
        // }
        window.close();
    }

    //查询是否需要阅读文章，如果需要则返回立即阅读按钮
    function getArticle(){
        let article = null;
        let articles = document.querySelectorAll(".file-box-content");
        if(articles && articles.length != 0){
            for(let i = 0; i< articles.length; i++){
                let isFinish = articles[i].querySelector(".fs12");
                if(isFinish.innerText.indexOf("未完成") != -1){
                    let title = articles[i].querySelector(".fs15");
                    title = md5(title.innerText);
                    if(title == getCookie("currArticle")){
                        //不是第一次看了，跳过，不看了
                    }else{
                        setCookie("currArticle",title);
                        article = articles[i].querySelector("button");
                        break;
                    }
                }
            }
        }
        return article;
    }

    //打开并监听页面关闭
    function openArticle(articleUrl){
        return new Promise(resolve => {
            let studyPage = GM_openInTab(articleUrl,{active: true,insert: true, setParent :true});
            let studying = setInterval(function() {
                if(studyPage.closed) {
                    clearInterval(studying);
                    resolve('done');
                }
            }, 2500);
        })
    }

    //监听等待主题出现
    function getAllSubjects(){
        return new Promise(resolve => {
            let checkInterval = setInterval(function(){
                var subjects = document.querySelectorAll(".el-tree-node__content");
                if(subjects && subjects.length != 0){
                    clearInterval(checkInterval);
                    resolve(subjects);
                }
            },800)
            })
    }

    //学习
    async function study(){
        let subjects = await getAllSubjects();
        //初始化当前看的视频
        setCookie("currVideo",null);
        //初始化当前看的文章
        setCookie("currArticle",null);
        for(let i = 0; i < subjects.length; i++){
            let isFinish = subjects[i].querySelector("i");
            if(isFinish.title != "已学习"){
                if(!subjects[i].querySelector(".active")){
                    //如果不是当前选中的，就去点击
                    subjects[i].querySelector(".nav_menu").click();
                }
                await Sleep(2000);
                let video = getVideo();
                console.log(video);
                while(video != null){
                    if(video.status == "未学习" || video.status == "学习中"){
                        if(video.btn){
                            video.btn.click();
                        }
                        await Sleep(2000);
                    }
                    await watchVideo();
                    video = getVideo();
                }
                console.log("播放完视频了，看看有没有文章")
                let article = null;
                while((article = getArticle()) != null){
                    article.click();//这里必须要按按钮，文章才算读了，如果用GM打开页面不算
                    await Sleep(10000);
                }
            }
        }
        console.log("该课程都学完了");
        await Sleep(1500);
        window.close();
    }


    //创建“开始学习”按钮和配置
    function createStartButton(){
        let body = document.getElementsByTagName("body")[0];
        let startButton = document.createElement("button");
        startButton.setAttribute("id","startButton");
        startButton.innerText = "开始学习";
        startButton.className = "egg_study_btn";
        //添加事件监听
        try{// Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
            startButton.addEventListener("click",start,false);
        }catch(e){
            try{// IE8.0及其以下版本
                startButton.attachEvent('onclick',start);
            }catch(e){// 早期浏览器
                console.log("不学习何以强国error: 开始学习按钮绑定事件失败")
            }
        }
        //插入节点
        body.append(startButton)
    }

    //阻塞
    function Sleep(time = 1000){
        return new Promise(resolve => {
            setTimeout(function(){
                resolve('done');
            },time);
        });
    }

    //学习课程
    function studyCourse(courseUrl){
        return new Promise(resolve => {
            let studyPage = GM_openInTab(courseUrl,{active: true,insert: true, setParent :true});
            let studying = setInterval(function() {
                if(studyPage.closed) {
                    clearInterval(studying);
                    resolve('done');
                }
            }, 2500);
        })
    }

    //开始
    async function start(){
        let courses = document.querySelectorAll(".training-item");
        for(let i = 0; i< courses.length; i++){
            let state = courses[i].querySelector(".training-state img");
            if(state.src.indexOf("un-finish") == -1){
                //如果不是显示未完成，那直接跳过
                //因为更新有延迟，所以检测有没有显示未完成，而不是检测有没有显示已完成
                continue;
            }
            let title = courses[i].querySelector(".training-info a");
            console.log("正在学习第" + (i+1) + "个课程" + title.innerText);
            let button = courses[i].querySelector(".training-btn a");
            await studyCourse(button.href);
        }
        console.log("已完成")
    }

    //保存cookies
    function setCookie(name,value,expiredays = 1){
        var exp = new Date();
        exp.setTime(exp.getTime() + expiredays*24*60*60*1000);
        document.cookie = name + "="+ escape(value) + ";expires=" + exp.toGMTString();
    }

    //读cookies
    function getCookie(name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)){
            return arr[2];
        }else{
            return null;
        }
    }

    setInterval(function(){
        let messageBox = document.querySelector(".el-message-box__wrapper");
        if(messageBox){
            let message = messageBox.querySelector(".el-message-box__message").innerText;
            if(message && (message.indexOf("确定要切换到其他章节学习吗") != -1 || message.indexOf("将切换到此视频") != -1)){
                let confirnBtn = messageBox.querySelector(".el-button--primary");
                confirnBtn.click();
            }
        }
    },2000);
})();