// ==UserScript==
// @name         航天云课堂辅助工具
// @namespace    HangtianTrain Scripts
// @match        https://train.casicloud.com/*
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @version      0.0.4
// @author       gtjl12
// @description  2022/09/02, 14:28:22 PM
// @downloadURL https://update.greasyfork.org/scripts/450298/%E8%88%AA%E5%A4%A9%E4%BA%91%E8%AF%BE%E5%A0%82%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/450298/%E8%88%AA%E5%A4%A9%E4%BA%91%E8%AF%BE%E5%A0%82%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==


//创建“开始学习”按钮和配置
function createStartButton() {
    let startButton = document.createElement("button");
    startButton.setAttribute("id", "startButton");
    startButton.innerText = "开始学习";
    startButton.className = "btn egg_study_btn";
    $(startButton).css({'font-size':'15px','border-radius': '6px'});
    //添加事件监听
    try {// Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
        startButton.addEventListener("click", preWatchCourse, false);
    } catch (e) {
        try {// IE8.0及其以下版本
            startButton.attachEvent('onclick', preWatchCourse);
        } catch (e) {// 早期浏览器
            console.log("航天云课堂辅助工具：Error：开始学习按钮绑定事件失败")
        }
    }
    //插入节点
    $(".clsCourseDiv").before(startButton);

}

//创建课程信息,获取待学习课程链接
function creatCourseInfo(){
    let totalCourseNum = 0;
    let todoCourseNum = 0;
    let courseInfo = document.getElementsByClassName("item current-hover");
    if( courseFlag == 0 && courseInfo.length > 0)
    {
        totalCourseNum = courseInfo.length
        Array.prototype.forEach.call(courseInfo, function (element) {
            if(element.getElementsByClassName('small inline-block')[0].textContent == '开始学习' || element.getElementsByClassName('small inline-block')[0].textContent == '继续学习')
            {
                courseLink.push(linkHeader+$(element).attr("data-resource-id")+linkTail);
                todoCourseNum++;
            }
        });
        let courseDiv = document.createElement("div");
        courseDiv.setAttribute("id", "courseDiv");
        courseDiv.innerText = "本专题共有 " + totalCourseNum +" 节课，还需学习 "+ todoCourseNum + " 节课。";
        courseDiv.className = "clsCourseDiv";
        $(".subject-catalog-wrapper").before(courseDiv)

        $(".clsCourseDiv").css({'background-color':'rgb(203 234 255)','font-size':'15px','border-radius': '6px','padding': '5px'});
        courseFlag = 1;
    }
}
//创建学习提示框
function creatTips()
{
    let tipInfo = document.createElement("div");
    tipInfo.setAttribute("id", "studyTip");
    tipInfo.innerText = "正在学习....";
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

    $('.new-course-top').after(tipInfo)
}
//改变学习提示
function changeTips()
{
    document.getElementById('studyTip').innerText = "学习完成";

}
//看课程序
async function preWatchCourse(){
    startFlag = 1;
    let startButton = document.getElementById("startButton");
    startButton.innerText = "正在学习";
    startButton.style.cursor = "default";
    startButton.setAttribute("disabled", true);
    for (let i = 0; i < courseLink.length; i++) {
        GM_setValue('watchingUrl', courseLink[i]);
        console.log("正在学习第" + (i + 1) + "节课");
        let newPage = GM_openInTab(courseLink[i], { active: true, insert: true, setParent: true })
        await waitingClose(newPage);
    }
    finishFlag = 1;
    //看完一个专题全部课程，停止循环
    if( finishFlag == 1 && loadFlag == 1 && courseFlag == 1)
    {
        console.log('本专题学习已全部完成');
        startButton.innerText = "已完成本专题学习";
        startButton.style.cursor = "default";
        startButton.setAttribute("disabled", true);
        clearInterval(watchCourseCyc_i );
    }
    return;

}

//等待窗口关闭
function waitingClose(newPage) {
    return new Promise(resolve => {
        let doing = setInterval(function () {
            if (newPage.closed) {
                clearInterval(doing);//停止定时器
                resolve('done');
            }
        }, 1000);
    });
}

//默认情况下, chrome 只允许 window.close 关闭 window.open 打开的窗口,所以我们就要用window.open命令,在原地网页打开自身窗口再关上,就可以成功关闭了
function closeWin() {
    try {
        window.opener = window;
        var win = window.open("","_self");
        win.close();
        top.close();
    } catch (e) {
    }
}
//模拟看课
function controlPlayer()
{
    let referseBtns = document.getElementsByClassName('videojs-referse-btn');
    let pauseBtns = document.getElementsByClassName('vjs-paused');
    let playingBtns = document.getElementsByClassName('vjs-playing');
    let videoPlayer = document.getElementsByTagName('video');
    if(videoPlayer.length > 0 && ($('.alert-shadow').length == 0 || $('.alert-shadow').css('display') == 'none') && referseBtns.length > 0 && videoPlayer[0].paused == true ){
        referseBtns[0].click();
        setTimeout(() => console.log("视频已暂停，等待重新播放"), 3000);
        videoPlayer[0].play();
        //因浏览器策略（ play() failed because the user didn‘t interact）无法自动播放，静音后才可播放
        if( videoPlayer[0].paused == true )
        {
            videoPlayer[0].muted = true;
            videoPlayer[0].play();
            pauseBtns[1].click();
        }
    }
    let alertText = document.getElementsByClassName('alert-text');
    if( alertText.length > 0 && alertText[0].innerHTML == "亲爱的学员，目前学习正在计时中，请不要走开哦!" )
    {
        alertText[0].nextElementSibling.click()
    }
    scroN++;
    window.scrollTo(0, scroN%2);
}

var loadFlag = 0;
var courseFlag = 0;
var startFlag = 0;
var testFlag = 0;
var finishFlag = 0;

var reloadTime = 2500;
var linkHeader = "https://train.casicloud.com/#/study/course/detail/10&";
var linkTail = "/6/1";
var courseLink = [];
var scroN = 0;

//循环计数器
var genStartDivCyc_i = 0;
var watchCourseCyc_i = 0;

var genStartDivCyc = setInterval(function () {

    //如果本页是专题页面，创建学习按钮
    let subjectDiv = document.getElementsByClassName("subject-catalog-wrapper");
    if( subjectDiv.length > 0 )
    {
        if(document.getElementById('courseDiv') == null )
        {
            creatCourseInfo();
        }
        if(document.getElementById('courseDiv') != null && document.getElementById('startButton') == null )
        {
            createStartButton();
            loadFlag = 1;
            console.log("学习按钮创建成功!");
            clearInterval(genStartDivCyc);
        }
    }
    else
    {
        genStartDivCyc_i++;
        console.log("genStartDivCyc_i = " + genStartDivCyc_i);

    }
    //一分钟还没创建学习按钮，停止循环
    if(genStartDivCyc_i > 9)
    {
        console.log("学习按钮创建失败!");
        clearInterval(genStartDivCyc);
    }
}, 1000);

var watchCourseCyc =  setInterval(function () {
    let url = window.location.href;
    let videoPlayer = document.getElementsByTagName('video');

    //如果是从专题进入课程
    if( typeof GM_getValue("watchingUrl") != 'object' && url == GM_getValue("watchingUrl") )
    {
        if( document.getElementById('studyTip') == null )
        {
            creatTips();
        }
        let currentCourse = document.getElementsByClassName('chapter-list-box required focus');
        let nextCourse = $(currentCourse).next();
        let subFinishDiv = document.getElementsByClassName('anew-text');
        let alertMsg = document.getElementsByClassName('alert-msg');
        let alertShadow = document.getElementsByClassName('alert-shadow');
        let videoPlayer = document.getElementsByTagName('video');
        if( nextCourse.length == 0 && (( videoPlayer[0].currentTime == videoPlayer[0].duration ) || ( subFinishDiv.length > 0 && subFinishDiv[0].textContent == '您已完成该课程的学习')))
        {
            changeTips();
            clearInterval(watchCourseCyc);
            closeWin();
        }
        else if( nextCourse.length > 0 && videoPlayer[0].currentTime == videoPlayer[0].duration && alertMsg.length == 0 )
        {
            // nextCourse.click();
        }

        else{
            controlPlayer();
        }
    }
    //如果不是从专题进入课程，而是直接观看课程，只控制播放，看完停止循环
    else if( videoPlayer.length > 0 && finishFlag == 0 && loadFlag == 0 && courseFlag == 0 )
    {
        if( document.getElementById('studyTip') == null )
        {
            creatTips();
        }
        let currentCourse = document.getElementsByClassName('chapter-list-box required focus');
        let nextCourse = $(currentCourse).next();
        let CoursefinishDiv = document.getElementsByClassName('anew-text');
        let alertMsg = document.getElementsByClassName('alert-msg');
        if( nextCourse.length == 0 && (( videoPlayer[0].currentTime == videoPlayer[0].duration ) || ( CoursefinishDiv.length > 0 && CoursefinishDiv[0].textContent == '您已完成该课程的学习')))
        {
            changeTips();
            console.log("单个课程学习完毕！");
            clearInterval(watchCourseCyc);
        }
        // 没有重看提示，正常播放完，系统自动播放下一节
        else if( nextCourse.length > 0 && videoPlayer[0].currentTime == videoPlayer[0].duration && alertMsg.length == 0 )
        {
            // nextCourse.click();
            console.log("自动播放下一节课程！");
        }
        // 有重看提示，重播
        else if( nextCourse.length > 0 && $('.alert-shadow').css('display') != 'none' && alertMsg.length > 0 && alertMsg[0].innerHTML == "本节课件还未完成学习，是否重新播放?" )
        {
            document.getElementsByClassName('btn-repeat btn-ok')[0].click();
            console.log("重播本课程！");
        }
        else{
            controlPlayer();
        }
    }
    //不是课程播放页面
    else
    {
        watchCourseCyc_i++;
        console.log("watchCourseCyc_i = " + watchCourseCyc_i);
    }
    //确定不是课程播放页面，停止循环
    if(watchCourseCyc_i > 2)
    {
        console.log("不是通过学习按钮进入!");
        clearInterval(watchCourseCyc);
    }
},10000);
