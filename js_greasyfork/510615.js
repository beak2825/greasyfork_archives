// ==UserScript==
// @name         重庆公需新版本
// @namespace    http://tampermonkey.net/
// @version      0.11
// @license      MIT
// @description  重庆公需新版本，自动学习
// @author       Junyi
// @match        https://cqrl.21tb.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510615/%E9%87%8D%E5%BA%86%E5%85%AC%E9%9C%80%E6%96%B0%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/510615/%E9%87%8D%E5%BA%86%E5%85%AC%E9%9C%80%E6%96%B0%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

//延时函数
const wait = (time) => {
    return new Promise(resolve => setTimeout(resolve, time))
}

window.onload=function(){
    Entry();
}

function Entry(){
    //视频学习页面
    if (window.location.href.includes('https://cqrl.21tb.com/els/html/courseStudyItem')){
        ChapterStudy();
    }
    //课程目录页面
    if (window.location.href.includes('https://cqrl.21tb.com/nms-frontend/index.html#/org/courseDetail')){
        let CourseTimer=setInterval(()=>{
            let StartStudy=idoc.getElementsByClassName('CourseIndex-module_course-btn_4TCHV');
            if (StartStudy.length>=1){
                clearInterval(CourseTimer);
                wait(2000).then(()=>{
                    StartStudy[0].click();
                    ChapterStudy();
                })
            }
        },500);
    }
    //培训目录页面
    if (window.location.href.includes('https://basic.smartedu.cn/training/')){
        window.addEventListener("storage", function (e){
            if((e.key == 'CourseFinished') && (e.newValue=='True')) {
                localStorage.CourseTime="0";
                window.location.reload();
            }
        })
        localStorage.CourseFinished="False";
        let StartTimer=setInterval(()=>{
            let StudyDuration=document.getElementsByClassName('index-module_topprocessCMy_FZxET');
            if (StudyDuration.length>=2){
                localStorage.TotalDuration=StudyDuration[1].nextSibling.nextSibling.textContent;
                localStorage.CourseTime="0";
                clearInterval(StartTimer);
                wait(1000).then(()=>{
                    if (parseInt(StudyDuration[1].textContent)>=parseInt(localStorage.TotalDuration)){
                        localStorage.CourseDuration=0;
                        FinishedMsg();
                        return;
                    }
                    localStorage.CourseDuration=(parseFloat(localStorage.TotalDuration)-parseFloat(StudyDuration[1].textContent))*45*60;
                    let CourseDuration=document.getElementsByClassName('index-module_processCMy_kp+Ww');
                    let i=1;
                    while (parseInt(CourseDuration[i].textContent)>=parseInt(CourseDuration[i].nextSibling.nextSibling.textContent)){
                        i+=2;
                        if(!CourseDuration[i].nextElementSibling){
                            i+=-1;
                            break;}
                    }
                    if(CourseDuration[i].nextElementSibling!=null){
                        localStorage.CourseTime=parseFloat(CourseDuration[i-1].textContent)*45*60;
                        localStorage.CourseDuration=parseFloat(CourseDuration[i].nextSibling.nextSibling.textContent)*45*60;
                    }
                    CourseDuration[i].click();
                })
            }
        },500);
    }
}

function ChapterStudy(){
    //章节选择
    let cencer=0;
    let iframe = document.getElementById('aliPlayerFrame');
    let iwindow = iframe.contentWindow;
    let idoc = iwindow.document;
    let ChapterTimer=setInterval(()=>{
        if (!idoc){
            this.reload();
        }
        let chapter=idoc.querySelectorAll(".section-item:not(.finish)");
        if(document.getElementsByClassName("fish-checkbox")[0] && !document.getElementsByClassName("fish-checkbox-checked")[0]){
            document.getElementsByClassName("fish-checkbox")[0].click();
        }
        if(document.getElementsByClassName("index-module_btn_37l+m")[0]){
            document.getElementsByClassName("index-module_btn_37l+m")[0].click();
        }
        if (chapter.length<1){
            chapter=document.getElementsByClassName('icon_checkbox_linear');
        }
        if(chapter.length>=1){
            clearInterval(ChapterTimer);
            chapter[0].click();
            //视频播放
            VideoStudy(idoc);
        }else{
            chapter=document.getElementsByClassName('icon_checkbox_fill');
            if(chapter.length>=1){
                cencer+=1;
                document.getElementsByClassName('fish-collapse-arrow')[cencer].click();
            }
        }
    },500);
}

function VideoStudy(idoc){
    let VideoTimer=setInterval(()=>{
        let VideoStart=idoc.getElementsByClassName('prism-big-play-btn');
        if (VideoStart.length>=1){
            localStorage.CurrentChapter=idoc.getElementsByClassName("first-line active")[0].getElementsByClassName('icon-box')[0].title;
            clearInterval(VideoTimer)
            let player=idoc.getElementsByTagName('video')[0];
            if (player.playbackRate>1){
                player.playbackRate=1
            }
            localStorage.StartPlayTime=player.currentTime
            let PlaySpeed=12
            let VideoTimerReload=setInterval(()=>{
                clearInterval(VideoTimerReload)
                location.reload();
            },800*1000/PlaySpeed)
            // player.addEventListener('timeupdate', function () {
            //     if (player.currentTime >= localStorage.StartPlayTime + 300) {
            //         location.reload();
            //     }
            // });
            let PlayTimer=setInterval(()=>{
                //当前视频播放完毕
                if (idoc.getElementsByClassName('first-line active')[0].getElementsByClassName('finish-tig').length>0 &&
                    idoc.getElementsByClassName('first-line active')[0].getElementsByClassName('finish-tig')[0].textContent=='已完成'){
                    clearInterval(PlayTimer);
                    localStorage.CourseTime=parseFloat(localStorage.CourseTime)+(player.duration||0);
                    ChapterFinish();
                    return;
                }
                if(localStorage.CurrentChapter!=idoc.getElementsByClassName('first-line active')[0].textContent){
                    clearInterval(PlayTimer);
                    VideoStudy(idoc);
                }
                if (idoc.getElementsByClassName('fish-btn-primary').length>=2){
                    idoc.getElementsByClassName('fish-btn-primary')[1].click();
                }
                if (!player.muted){
                    player.muted=true;
                }
                if (player.paused){
                    player.playbackRate=1;
                    player.play();
                    player.playbackRate=PlaySpeed;
                }
            },1000);
        }
    },500);
}

function ChapterFinish(){
    if(parseFloat(localStorage.CourseTime)>=parseFloat(localStorage.CourseDuration)){
        localStorage.setItem("CourseFinished","True");
        this.close();
    }else{
        ChapterStudy()
    }
}

function FinishedMsg(){
    wait(1000).then(()=>{
        alert('您已经达到规定的学时要求，接下来可以继续观看／学习。但您继续学习的时长将不再被计入认定学时。');})
    return;
}