// ==UserScript==
// @name         白鸽学堂
// @namespace    https://www.baidu.com/
// @version      1.2
// @description  白鸽来了
// @author       莫语
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @match        https://campus.chinaunicom.cn/*
// @license      MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/473657/%E7%99%BD%E9%B8%BD%E5%AD%A6%E5%A0%82.user.js
// @updateURL https://update.greasyfork.org/scripts/473657/%E7%99%BD%E9%B8%BD%E5%AD%A6%E5%A0%82.meta.js
// ==/UserScript==


localStorage.setItem('crsType', "全部");//课程分类，自行填写
localStorage.setItem('coursesState', "未学习");//课程状态，自行填写（全部，未学习，已完成，未完成）

//let hookSetInterval = unsafeWindow.setInterval;
//unsafeWindow.setInterval=function(a,b){
//    return hookSetInterval(a,b/10);
//}

(function() {
    'use strict';

     setTimeout(()=>{
         //
         let curUrl = document.URL;

         //专区页面
         if(curUrl.indexOf("ind_ThemeCourses")!=-1){
             localStorage.setItem('tarUrl', curUrl);//保存专区URL
             ThemeCoursesPage();
         }
         //课程播放页面
         if(curUrl.indexOf("course_courseDetails")!=-1){
             courseDetails();
         }
    },1500);
    // Your code here...
})();

//专区页面
function ThemeCoursesPage(){
        //console.log("专区页面",localStorage.getItem('tarUrl'))

        //选择分类
        let typesLi = Array.from(document.querySelectorAll('div[class="classification-item"] > ul > li'));
        let typ =localStorage.getItem('crsType')?localStorage.getItem('crsType').trim():"全部";
        let seleType = typesLi.filter(li => li.textContent.trim() === typ);
        setTimeout(()=>{
            if(seleType.length){//没有自选的分类就选择全部
                seleType[0].click();}
            //选择课程状态分类（全部，未学习，已完成，未完成） 默认先从未完成开始
            const States = ['全部','未学习','已完成','未完成'];
            let coursesStates = document.querySelectorAll('div[class=coursesState]>div>span>span');
            coursesStates[States.indexOf(localStorage.getItem('coursesState')?localStorage.getItem('coursesState'):"未学习")].click();//选择学习状态（未完成）
            //选择课程进入
            setTimeout(()=>{
                let courseList = document.querySelectorAll('div[class=course-List]>ul>li');//课程列表
                setTimeout(()=>{
                    if(courseList.length === 0){
                        coursesStates[1].click();//课程为0就选择未学习
                        setTimeout(()=>{
                            if(document.querySelectorAll('div[class=course-List]>ul>li').length===0){
                                //未学习也没有课程就选择全部分类
                                localStorage.setItem('crsType', "全部");//课程分类-全部
                                ThemeCoursesPage();
                           }else{
                               var Course =  document.querySelectorAll('div[class=course-List]>ul>li')[0];
                               Course.click();

                                 //打开视频播放页面后关闭专区页面
                               setTimeout(()=>{
                                  window.close();
                               },500);
                            }
                        },500);
                    }else{
                        var Course =  document.querySelectorAll('div[class=course-List]>ul>li')[0];
                        Course.click();
                           //打开视频播放页面后关闭专区页面
                        setTimeout(()=>{
                           window.close();
                        },500);
                    }
                },1000);
            },1000);
        },1500);
    }

//课程播放页面
function courseDetails(){
    //console.log("课程播放页面");
    // 创建一个新的音频上下文
    const audioContext = new AudioContext();
    // 静音标签页
    audioContext.suspend();
    ////打开控制条
    setTimeout(()=>{
        let video = document.querySelector('video');
        setInterval(()=>{
            //button.click();
            video = document.querySelector('video');
            if(video !=undefined){
            //console.log('检测播放暂停状态',video.paused)
            video.muted = true;//静音
            if(video.paused){
                video.play();
                localStorage.setItem('baiducyberplayer.playbackRate', "2");
            }}
            let cours = document.querySelectorAll('div[class="planList plan-list learn-sec"]');
            cours.forEach((item, index)=>{
                if( item.childNodes[1].getAttribute('class').length && item.childNodes[1].textContent==='100%'){
                    //当前播放已达100%
                    if(index === (cours.length-1)){
                       // console.log("最后一个课程播放完，关闭当前标签页");
                        window.location.href=localStorage.getItem('tarUrl');//最后一个课程播放完，关闭当前标签页。
                    }else{
                       // console.log("当前课程播放完，播放下一个");
                        cours[index+1].click();//播放下一个
                    }
                }else{
        
                   // console.log('播放进度：',item.childNodes[1].textContent);

                }
            });
        },3000)

    },1500)
}

