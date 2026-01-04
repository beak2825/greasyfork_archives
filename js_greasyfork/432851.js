// ==UserScript==
// @name         不学习何以完成公需课
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  就看看视频
// @author       荷包蛋。
// @match        https://jsxx.gdedu.gov.cn/*
// @icon         https://jsxx.gdedu.gov.cn/ncts/custom/gongxu/images/favicon.ico
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/432851/%E4%B8%8D%E5%AD%A6%E4%B9%A0%E4%BD%95%E4%BB%A5%E5%AE%8C%E6%88%90%E5%85%AC%E9%9C%80%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/432851/%E4%B8%8D%E5%AD%A6%E4%B9%A0%E4%BD%95%E4%BB%A5%E5%AE%8C%E6%88%90%E5%85%AC%E9%9C%80%E8%AF%BE.meta.js
// ==/UserScript==

var study_css = ".egg_study_btn{outline:0;border:0;position:fixed;top:5px;left:5px;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#fff;color:#d90609;font-size:18px;font-weight:bold;text-align:center;box-shadow:0 0 9px #666777}.egg_manual_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#e3484b;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_auto_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#666777;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_setting_box{position:fixed;top:70px;left:5px;padding:12px 20px;border-radius:10px;background-color:#fff;box-shadow:0 0 9px #666777}.egg_setting_item{margin-top:5px;height:30px;width:140px;font-size:16px;display:flex;justify-items:center;justify-content:space-between}input[type='checkbox'].egg_setting_switch{cursor:pointer;margin:0;outline:0;appearance:none;-webkit-appearance:none;-moz-appearance:none;position:relative;width:40px;height:22px;background:#ccc;border-radius:50px;transition:border-color .3s,background-color .3s}input[type='checkbox'].egg_setting_switch::after{content:'';display:inline-block;width:1rem;height:1rem;border-radius:50%;background:#fff;box-shadow:0,0,2px,#999;transition:.4s;top:3px;position:absolute;left:3px}input[type='checkbox'].egg_setting_switch:checked{background:#fd5052}input[type='checkbox'].egg_setting_switch:checked::after{content:'';position:absolute;left:55%;top:3px}";
GM_addStyle(study_css);

//课程页
const coursePageUrl = "https://jsxx.gdedu.gov.cn/study/course/";

var currUrl = window.location.href;

(function() {
    'use strict';

    //阻塞
    function Sleep(time = 1000){
        return new Promise(resolve => {
            setTimeout(function(){
                resolve('done');
            },time);
        });
    }

    //创建学习提示
    function createTip(){
        let tipInfo = document.createElement("div");
        //添加样式
        tipInfo.setAttribute("id","studyTip");
        tipInfo.innerText = "正在初始化....";
        tipInfo.style.position = "fixed";
        tipInfo.style.bottom = "15px";
        tipInfo.style.left = "5px";
        tipInfo.style.padding = "12px 14px";
        tipInfo.style.border = "none";
        tipInfo.style.borderRadius = "10px";
        tipInfo.style.backgroundColor = "#222222";
        tipInfo.style.color = "#ffffff";
        tipInfo.style.fontSize = "14px";
        tipInfo.style.fontWeight = "bold";
        //插入节点
        let body = document.getElementsByTagName("body")[0];
        body.append(tipInfo)
    }

    //修改学习提示
    function setStudyTip(info,isError = false){
        let studyTip = document.getElementById("studyTip");
        studyTip.innerText = info;
        if(isError){
            studyTip.style.backgroundColor = "#ff4f4f";
        }else{
            studyTip.style.backgroundColor = "#222222";
        }
    }

    //等待页面加载完成
    function waitOnload(){
        return new Promise(resolve => {
            let onloadInterval = setInterval(function(){
                let video = getVideoTag();
                if(video){
                    clearInterval(onloadInterval);
                    resolve('done');
                }
            },500);
        })
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

    //考核
    async function doTest(){
        console.log("考核页");
        await Sleep(5000);
        window.close();
    }

    //获取下一个活动的按钮
    function getNextBtn(){
        let courseInfo = document.querySelector("#studySelectAct");
        if(courseInfo){
            let nextBtn = courseInfo.querySelector(".next");
            if(nextBtn && nextBtn.className.indexOf("disable") == -1){
                return nextBtn;
            }
            return null;
        }
        return null;
    }

    //开始
    async function start(){
        setStudyTip("等待页面加载完成");
        await waitOnload();
        try{
            $("html,body").animate({scrollTop:400},1000);
        }catch(e){
            window.scrollTo(0,400);
        }
        setStudyTip("检查视频时长是否足够");
        let courseInfo = document.querySelector(".g-study-prompt").querySelectorAll("span");
        if(courseInfo && courseInfo.length != 0){
            if(courseInfo.length > 1){
                let needTime = Number.parseInt(courseInfo[0].innerText);
                let currTime = Number.parseInt(courseInfo[1].innerText);
                if(needTime != null && currTime != null){
                    //如果需要的时间比看过的时间多，则需要看视频
                    if(needTime > currTime){
                        setStudyTip("正在观看视频");
                        //监听测试
                        listenTest();
                        await watchVideo();
                    }
                }else{
                    setStudyTip("发生意外错误，请刷新重试",true);
                }
            }
            setStudyTip("已看完，准备切换下一个活动");
            await Sleep(2000);
            //点击下一个活动
            let nextBtn = getNextBtn();
            if(nextBtn){
                nextBtn.click();
            }else{
                setStudyTip("获取下一个活动失败",true);
            }
        }else{
            setStudyTip("发生意外错误，请刷新重试",true);
        }
    }

    //检测弹窗
    function listenTest(){
        setInterval(function(){
            let testBox = document.querySelector(".mylayer-layer");
            if(testBox){
                console.log("有弹窗")
                let option = testBox.querySelector("input");
                if(option){//选择题，随便选一个
                    option.click();
                }

            }
        },2000);
    }

    createTip();
    start();
})();