// ==UserScript==
// @name         2024国家智慧教育职教平台暑期研修
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  适用于国家智慧教育职教平台2024年暑期教师研修。
// @author       My.G  ET.S@DG
// @match        https://teacher.vocational.smartedu.cn/*
// @match        https://core.teacher.vocational.smartedu.cn/*
// @icon         https://teacher.vocational.smartedu.cn/statics/images/logo_img3.png
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @run-at       document-end
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507629/2024%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E8%81%8C%E6%95%99%E5%B9%B3%E5%8F%B0%E6%9A%91%E6%9C%9F%E7%A0%94%E4%BF%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/507629/2024%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E8%81%8C%E6%95%99%E5%B9%B3%E5%8F%B0%E6%9A%91%E6%9C%9F%E7%A0%94%E4%BF%AE.meta.js
// ==/UserScript==

//延时函数
const wait = (time) => {
    return new Promise(resolve => setTimeout(resolve, time))
}

(function(){
    window.onload=Entry();
})();

function Entry(){
    //视频学习页面
    if (window.location.href.includes('https://core.teacher.vocational.smartedu.cn/p/course/vocational/v')){
        if(localStorage.CurrentCourse!=this.name){
            localStorage.CurrentCourse=this.name;
            localStorage.CourseDuration=parseFloat(this.name.split('_')[1])*45*60;
            localStorage.CourseTime='0';
        }
        VideoStudy();
        let ChapterTimer=setInterval(()=>{
            if(parseFloat(localStorage.CourseTime)>=parseFloat(localStorage.CourseDuration)){
                clearInterval(ChapterTimer)
                this.opener.postMessage("CourseFinished","*");
                this.close();
            }
        },1000);
    }

    //培训目录页面
    if (window.location.href.includes('https://teacher.vocational.smartedu.cn/h/subject')){
        window.addEventListener('message', function (e) {
            if(e.data == 'CourseFinished'){
                window.location.reload();
            }
        })
        let StartTimer=setInterval(()=>{
            let CoursesTime=document.getElementsByClassName('news_time');
            if (CoursesTime.length>=1 && CoursesTime[0].style.display!="none"){
                clearInterval(StartTimer);
                wait(1000).then(()=>{
                    if(!FindCourse(CoursesTime)){
                        FinishedMsg();
                        return;
                    }
                })
            }
        },1000);
    }
}


function FindCourse(coursestime){
    for (let i=0;i<coursestime.length;i++){
        let coursetime=parseFloat(coursestime[i].getElementsByTagName('span')[1].nextSibling.textContent.substr(-3,1))-parseFloat(coursestime[i].getElementsByTagName('span')[0].textContent)
        if (coursetime>0){
            let src=document.getElementsByClassName('news_content')[i].getElementsByTagName('a')[0].href.replace('i_','v_');
            let name=i+"_"+coursetime;
            window.open(src,name);
            return(true);
        }
    }
    return(false);
}

function VideoStudy(){
    let ChapterTimer=setInterval(()=>{
        let currentchapter=document.getElementsByClassName('video-title on')[0];
        if(currentchapter){
            clearInterval(ChapterTimer);
            localStorage.CurrentChapter=currentchapter.getAttribute('data-id');
            CourseUpdate(localStorage.CurrentChapter);
        }
    },500);
}

function CourseUpdate(videoId){
    let CheckTimer=setInterval(()=>{
        let currentchapter=document.getElementsByClassName('video-title on')[0];
        if(currentchapter && currentchapter.getElementsByClassName('four')[0].textContent=="100%"){
            clearInterval(CheckTimer);
            if(UpdateTimer){clearInterval(UpdateTimer);}
            let currentchapter=Array.from(document.getElementsByClassName('video-title')).find((item)=>item.getElementsByClassName('four')[0].textContent!="100%");
            if(currentchapter){
                localStorage.CurrentChapter=currentchapter.getAttribute('data-id');
                currentchapter.click();
                CourseUpdate(localStorage.CurrentChapter);
                return;
            }
            else{
                this.close();
                return;
            }
        }
        if (currentchapter && currentchapter.getAttribute('data-id')!=videoId){
            if(UpdateTimer){clearInterval(UpdateTimer);}
            clearInterval(CheckTimer);
            localStorage.CurrentChapter=currentchapter.getAttribute('data-id');
            CourseUpdate(localStorage.CurrentChapter);
            return;
        }
        let player=document.getElementsByTagName('video')[0];
        if(player){
            player.muted=true;
            player.currentTime=0.0;
            player.pause();
        }
    },1000);
    let courseId=window.location.href.split('v_')[1].split('?')[0];
    let postdata=window.location.href.split('v_')[1].split('?')[1].split('&');
    let playProgress='60';
    let clockInDot='60'
    let UpdateTimer=setInterval(()=>{
        let UpdateRequest=new Request("https://core.teacher.vocational.smartedu.cn/p/course/services/member/study/progress?"+postdata[3], {
            headers: {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "u-platformid":"13145854983311",
                "x-requested-with": "XMLHttpRequest",
                "cookie":document.cookie,
                "Referer": window.location.href,
            },
            body: "courseId="+courseId+"&"+postdata[0]+"&videoId="+videoId+"&playProgress="+playProgress+"&"+postdata[1]+"&type=1&tjzj=1&clockInDot="+clockInDot+"&"+postdata[2].replace('project','source')+"&timeLimit=-1&originP=1",
            method: "POST"
        });
        fetch(UpdateRequest).then(response => {
            let result = response.json();
            result.then(res => {
                if(res.data.videoProgress!="-1"){
                    playProgress=res.data.videoProgress;
                    clockInDot=res.data.videoProgress;
                    document.getElementsByClassName('video-title on')[0].getElementsByClassName('four')[0].textContent=parseInt(parseFloat(res.data.progress)*100)+"%";
                }
                if(parseFloat(res.data.progress)>=1){
                    localStorage.CourseTime=parseFloat(localStorage.CourseTime)+(document.getElementsByTagName('video')[0].duration||0);
                }
            })
        })
    },21000);
}

function FinishedMsg(){
    wait(1000).then(()=>{
        alert('您已经达到规定的学时要求，接下来可以继续观看／学习。但您继续学习的时长将不再被计入认定学时。');})
    return;
}