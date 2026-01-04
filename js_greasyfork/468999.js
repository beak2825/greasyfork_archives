// ==UserScript==
// @name         学习QG
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2.2.5
// @description  读文章,看视频，做习题。
// @author       荷包蛋。
// @icon         data:image/jpeg;base64,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AAClSSFJEAACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQARAAAAAAAAAAAAAAAAAAACO5JHcEJAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFKkkKSIAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEgAiAAAAAAAAAAAAAAAAAAAEdySO4ISAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKVJIUkQAAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJABEAAAAAAAAAAAAAAAAAAAI7kkdwQkABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUqSQpIgAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASACIAAAAAAAAAAAAAAAAAAAR3JI7ghIACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApUkhSRAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkAEQAAAAAAAAAAAAAAAAAAAjuSR3BCQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSpJCkiAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIAIgAAAAAAAAAAAAAAAAAABHckjuCEgAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAClSSFJEAACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/9k=
// @match        https://www.xuexi.cn
// @match        https://www.xuexi.cn/*
// @match        https://pc.xuexi.cn/points/login.html?ref=*
// @match        https://pc.xuexi.cn/points/exam-practice.html
// @match        https://pc.xuexi.cn/points/exam-weekly-detail.html?id=*
// @match        https://pc.xuexi.cn/points/exam-weekly-list.html
// @match        https://pc.xuexi.cn/points/exam-paper-detail.html?id=*
// @match        https://pc.xuexi.cn/points/exam-paper-list.html
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.9.0/js/md5.min.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/468999/%E5%AD%A6%E4%B9%A0QG.user.js
// @updateURL https://update.greasyfork.org/scripts/468999/%E5%AD%A6%E4%B9%A0QG.meta.js
// ==/UserScript==
var study_css = ".egg_study_btn{outline:0;border:0;position:fixed;top:5px;left:5px;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#fff;color:#d90609;font-size:18px;font-weight:bold;text-align:center;box-shadow:0 0 9px #666777}.egg_manual_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#e3484b;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_auto_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#666777;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_setting_box{position:fixed;top:70px;left:5px;padding:12px 20px;border-radius:10px;background-color:#fff;box-shadow:0 0 9px #666777}.egg_setting_item{margin-top:5px;height:30px;width:140px;font-size:16px;display:flex;justify-items:center;justify-content:space-between}input[type='checkbox'].egg_setting_switch{cursor:pointer;margin:0;outline:0;appearance:none;-webkit-appearance:none;-moz-appearance:none;position:relative;width:40px;height:22px;background:#ccc;border-radius:50px;transition:border-color .3s,background-color .3s}input[type='checkbox'].egg_setting_switch::after{content:'';display:inline-block;width:1rem;height:1rem;border-radius:50%;background:#fff;box-shadow:0,0,2px,#999;transition:.4s;top:3px;position:absolute;left:3px}input[type='checkbox'].egg_setting_switch:checked{background:#fd5052}input[type='checkbox'].egg_setting_switch:checked::after{content:'';position:absolute;left:55%;top:3px}.egg_qrcode_box{height:218px;width:218px;position: fixed;top: 400px;left: 5px;padding: 10px;border-radius: 10px;background-color: #fff;box-shadow: 0 0 9px #666777;}.egg_qrcode_title{padding: 5px 0 12px 0;font-size: 18px;text-align: center;color: #d90609;font-weight: bold;letter-spacing: 2px;}.egg_tip{position: fixed;z-index: 999;top: 5px;left: calc(50% - 120px);padding: 0px 20px; line-height: 44px;text-align: center; width: 200px; height: 44px;font-size: 18px;}.egg_tip_success{color: #67c23a; background-color: #f0f9eb;}.egg_tip_warning{color: #E6A23C; background-color: #fdf6ec;}.egg_tip_danger{color: #d90609; background-color: #fef0f0;}.egg_tip_info{color: #909399; background-color: #edf2fc;}";
GM_addStyle(study_css);
//https://www.xuexi.cn/lgdata/3uoe1tg20en0.json
//查询今日完成情况
const SearchSocreUrl = "https://pc-proxy-api.xuexi.cn/delegate/score/days/listScoreProgress?sence=score&deviceType=2";
//重要新闻列表（主）
const NewsUrl1 = "https://www.xuexi.cn/lgdata/1jscb6pu1n2.json";
//学习时评新闻列表
const NewsUrl2 = "https://www.xuexi.cn/lgdata/1ap1igfgdn2.json";
//新闻视频列表
const VideosUrl1 = "https://www.xuexi.cn/lgdata/3o3ufqgl8rsn.json";
//新闻视频列表
const VideosUrl2 = "https://www.xuexi.cn/lgdata/1742g60067k.json";
//每日答题页面
const ExamPracticeUrl = "https://pc.xuexi.cn/points/exam-practice.html";
//每周答题列表API
const ExamWeeklyListUrl = "https://pc-proxy-api.xuexi.cn/api/exam/service/practice/pc/weekly/more?pageNo={pageNo}&pageSize=50";
//专项答题列表API
const ExamPaperListUrl = "https://pc-proxy-api.xuexi.cn/api/exam/service/paper/pc/list?pageSize=50&pageNo={pageNo}";
//题目API（只有每周答题和专项练习）
//const ExamQueryUrl = "https://pc-proxy-api.xuexi.cn/api/exam/service/detail/queryV3?type={type}&id={id}&forced=true";//type=1专项练习，type=2每周答题
//每周答题页面
const ExamWeeklyUrl = "https://pc.xuexi.cn/points/exam-weekly-detail.html?id={id}";
//专项测试页面
const ExamPaperUrl = "https://pc.xuexi.cn/points/exam-paper-detail.html?id={id}";
//文本服务器保存API
const AnswerSaveUrl = "https://a6.qikekeji.com/txt/data/save/";
//文本服务器获取API
const AnswerDetailUrl = "https://a6.qikekeji.com/txt/data/detail/";
//获取强国二维码
const GetQRcodeUrl = "https://login.xuexi.cn/user/qrcode/generate";
//监听是否扫码登录成功Url   qrCode:  goto: https://oa.xuexi.cn  pdmToken:
const LisenScanQRcodeUrl = "https://login.xuexi.cn/login/login_with_qr";
//在线生成二维码
const GenerateQRcodeUrl = "https://tool.oschina.net/action/qrcode/generate?data={url}&output=image%2Fpng&error=L&type=0&margin=0&size=4&{time}";
//获取当前日期
var currDate = new Date().toISOString().split('T')[0];
var newsNum = 6;
var news = [];
var videoNum = 6;
var videos = [];
//配置
var settings = [];
var pause = false;//是否暂停答题
var hasSlideVerification = false;
//每周答题当前页码
var examWeeklyPageNo = 1;
//每周答题总页码
var examWeeklyTotalPageCount = null;
//专项答题当前页码
var examPaperPageNo = 1;
//专项答题总页码
var examPaperTotalPageCount = null;
//颜色配置
const Colors = {"primary" : "#409EFF","success" : "#67C23A","warning" : "#E6A23C","danger" : "#d90609","info" : "#909399"};
$(document).ready(function(){
    let url = window.location.href;
    if(url == "https://www.xuexi.cn" || url == "https://www.xuexi.cn/" || url == "https://www.xuexi.cn/index.html"){
        let ready = setInterval(function() {
            if(document.getElementsByClassName("text-wrap")[0]) {
                clearInterval(ready);//停止定时器
                //初始化设置
                initSetting();
                //初始化二维码
                initQRcode();
                //创建"开始学习"按钮
                createStartButton();

                var saveSettingbtn = document.querySelector("#saveSetting");
                //添加事件监听
                try{// Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
                    saveSettingbtn.addEventListener("click",saveSetting,false);
                }catch(e){
                    try{// IE8.0及其以下版本
                        saveSettingbtn.attachEvent('onclick',saveSetting);
                    }catch(e){// 早期浏览器
                        console.log("不学习何以强国error: 开始学习按钮绑定事件失败")
                    }
                }

                //获取完成日期
                //                 let finishDate = GM_getValue('finishDate');
                //                 if(finishDate && finishDate == new Date().getDate()){
                //                     //如果上一次完成的日期就是今天，那么不用学习了
                //                     //设置定时器，刷新页面以保持登录状态
                //                     setTimeout(function(){
                //                         location.reload();
                //                     },30*60*1000);//30分钟刷新一次
                //                 }else{
                //                     //否则，如果没有上一次完成的日期，或者不是今天，那么就开始学习
                //                     //start();
                //                 }
            }
        }, 800);
    }else if(url.indexOf("login.html") != -1){
        document.querySelector("#body-body").style.overflow = "hidden";
        document.querySelector(".layout-header").remove();
        document.querySelector(".layout-footer").remove();
        document.querySelector(".redflagbox").remove();
        document.querySelector(".oath").remove();
        document.querySelector("audio").remove();
        document.querySelector("iframe").remove();
        setTimeout(function(){
            let loginbox = document.querySelector(".loginbox-inner");
            console.log(loginbox)
            loginbox.style.position = "fixed";
            loginbox.style.top = "0";
            loginbox.style.left = "0";
            loginbox.style.zIndex = "999";
        },1000);
        let num = 0;
        GM_setValue("loginNum",num);
        setInterval(function(){
            num++;
            GM_setValue("loginNum",num);
        },400);

    }else if(url == GM_getValue("readingUrl")){
        try{
            let settingTemp = JSON.parse(GM_getValue('studySetting'));
            if(!settingTemp[7]){
                createTip();//创建学习提示
            }
            reading(0);
        }catch(e){
            createTip();//创建学习提示
            reading(0);
        }
    }else if(url == GM_getValue("watchingUrl")){
        try{
            let settingTemp = JSON.parse(GM_getValue('studySetting'));
            if(!settingTemp[7]){
                createTip();//创建学习提示
            }
        }catch(e){
            createTip();//创建学习提示
        }
        let randNum = 0;
        var checkVideoPlayingInterval = setInterval(function(){
            let temp = getVideoTag();
            if(temp.video){
                if(!temp.video.muted){
                    temp.video.muted = true;
                }
                if(temp.video.paused){
                    temp.video.paused = false;
                    console.log("正在尝试播放视频")
                    if(randNum == 0){//尝试使用js的方式播放
                        try{
                            temp.video.play();//尝试使用js的方式播放
                        }catch(e){}
                        randNum++;
                    }else{
                        try{
                            temp.pauseButton.click();//尝试点击播放按钮播放
                        }catch(e){}
                        randNum--;
                    }
                }else{
                    console.log("成功播放")
                    clearInterval(checkVideoPlayingInterval);
                    reading(1);
                }
            }else{
                console.log("等待加载")
            }
        },800);
    }else if(url.indexOf("exam") != -1 && url.indexOf("list") == -1){
        //答题页面
        let ready = setInterval(function() {
            if(document.getElementsByClassName("title")[0]) {
                clearInterval(ready);//停止定时器
                //创建“手动答题”按钮
                createManualButton();
                //开始答题
                doingExam();

                let examInterval = setInterval(function(){
                    if(hasSlideVerification){
                        clearInterval(examInterval)
                    }else{
                        slideVerification();
                    }
                },1000)
                }
        }, 500);
    }else{//否则直接全局静音

    }
});


//获取video标签
function getVideoTag(){
    let iframe = document.getElementsByTagName("iframe")[0];
    let video = null;
    let pauseButton = null;
    if(iframe){
        //如果有iframe,说明外面的video标签是假的
        video = iframe.contentWindow.document.getElementsByTagName("video")[0];
        pauseButton = iframe.contentWindow.document.getElementsByClassName("prism-play-btn")[0];
    }else{
        //否则这个video标签是真的
        video = document.getElementsByTagName("video")[0];
        pauseButton = document.getElementsByClassName("prism-play-btn")[0];
    }
    return {
        "video":video,
        "pauseButton":pauseButton
    }
}

//读新闻或者看视频
//type:0为新闻，1为视频
async function reading(type){
    //看文章或者视频
    let time = parseInt(Math.random()*(90-75+1)+75,10) ;//75-90秒后关闭页面
    let firstTime = time - 2;
    let secendTime = 12;
    let scrollLength = document.body.scrollHeight/2;
    var readingInterval = setInterval(function(){
        time--;
        $("#studyTip").text(time + " 秒后关闭页面");
        if(time <= firstTime){
            try{
                $("html,body").animate({scrollTop:394},1000);
            }catch(e){
                window.scrollTo(0,394);
            }
            firstTime = -1;
        }
        if(time <= secendTime){
            try{
                $("html,body").animate({scrollTop:scrollLength/3},1000);
            }catch(e){
                window.scrollTo(0,scrollLength/3);
            }
            secendTime = -1;
        }
        if(time <= 0){
            if(type == 0){
                GM_setValue('readingUrl',null);
            }else{
                GM_setValue('watchingUrl',null);
            }
            clearInterval(readingInterval);
            window.close();
        }
    },1000);
    //关闭文章或视频页面
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
//等待窗口关闭
function waitingClose(newPage){
    return new Promise(resolve => {
        let doing = setInterval(function() {
            if(newPage.closed) {
                clearInterval(doing);//停止定时器
                resolve('done');
            }
        }, 1000);
    });
}
//阅读文章
async function readNews(){
    await getNews();
    for(let i =0; i < news.length; i++){
        GM_setValue('readingUrl',news[i].url);
        console.log("正在看第" + (i+1) + "个新闻");
        let newPage = GM_openInTab(news[i].url,{active: true,insert: true, setParent :true});
        await waitingClose(newPage);
        await waitingTime(1500);
    }
}
//获取新闻列表
function getNews(){
    return new Promise(resolve => {
        news = new Array();
        let n = 6;
        if(newsNum < 6){//如果需要学习的新闻数量不到6，也就是已经学过了，但是积分不够，补的
            n = newsNum;
        }
        console.log("还需要看" + n + "个新闻")
        //新闻数量是否足够
        let enough = true;
        //获取重要新闻
        $.ajax({
            type: "GET",
            url: NewsUrl1,
            dataType: "json",
            success: function(data){
                let j = 0;
                if(n == 6){//如果今天还没学过，则优先找今天的新闻
                    for(let i = 0; i < n; i++){
                        //如果有当天日期的,则加入
                        if(data[j].auditTime.indexOf(currDate) != -1){
                            news.push(data[j]);
                            j++;
                        }else{//否则跳出循环
                            break;
                        }
                    }
                }
                for(j; j < n; j++){
                    let temp = parseInt(Math.random()*(data.length+1),10);
                    news.push(data[temp]);
                }
                resolve('done');
            },
            error: function(){
                news = null;
                resolve('done');
            }
        });
    });
}
//获取视频列表
function getVideos(){
    return new Promise(resolve => {
        videos = new Array();
        let n = 6;
        if(videoNum < 6){//如果需要学习的视频数量不到6，也就是已经学过了，但是积分不够，补的
            n = videoNum;
        }
        console.log("还需要看" + n + "个视频")
        $.ajax({
            type: "GET",
            url: VideosUrl1,
            dataType: "json",
            success: function(data){
                let j = 0;
                if(n == 6){
                    for(let i = 0; i < n; i++){
                        //如果有当天日期的,则加入
                        if(data[j].auditTime.indexOf(currDate) != -1){
                            videos.push(data[j]);
                            j++;
                        }else{//否则跳出循环
                            break;
                        }
                    }
                }
                for(j; j < n; j++){
                    let temp = parseInt(Math.random()*(data.length+1),10);
                    videos.push(data[temp]);
                }
                resolve('done');
            },
            error: function(){
                videos = [];
                resolve('done');
            }
        });
    });
}
//看学习视频
async function watchVideo(){
    await getVideos();
    for(let i =0; i < videos.length; i++){
        GM_setValue('watchingUrl',videos[i].url);
        console.log("正在观看第" + (i+1) + "个视频");
        let newPage = GM_openInTab(videos[i].url,{active: true,insert: true, setParent :true})
        await waitingClose(newPage);
        await waitingTime(1500);
    }
}
//做每日答题
function doExamPractice(){
    return new Promise(resolve => {
        console.log("正在完成每日答题")
        let newPage = GM_openInTab(ExamPracticeUrl,{active: true,insert: true, setParent :true});
        let doing = setInterval(function() {
            if(newPage.closed) {
                clearInterval(doing);//停止定时器
                resolve('done');
            }
        }, 1000);
    });
}
//获取专项答题列表
function getExamPaper(){
    return new Promise(function(resolve) {
        $.ajax({
            type: "GET",
            url: ExamPaperListUrl.replace("{pageNo}",examPaperPageNo),
            xhrFields: {
                withCredentials: true //如果没有这个请求失败
            },
            dataType: "json",
            success: function(data){
                console.log(data)
                data = data.data_str;
                if(data.indexOf("-") != -1){
                    data = data.replace(/-/g, "+");
                }
                if(data.indexOf("_") != -1){
                    data = data.replace(/_/g, "/");
                }
                data = decodeURIComponent(escape(window.atob(data)));
                //JSON格式化
                data = JSON.parse(data);
                resolve(data);
            },
            error: function(){
                resolve(new Array());
            }
        });
    })
}
//查询专项答题列表看看还有没有没做过的，有则返回id
async function findExamPaper(){
    var continueFind = true;
    var examPaperId = null;
    console.log("正在寻找未完成的专项答题")
    while(continueFind){
        await getExamPaper().then(data => {
            if(data){
                if(examPaperTotalPageCount == null){
                    //如果总页码没初始化，则初始化
                    examPaperTotalPageCount = data.totalPageCount;
                }
                let examPapers = data.list;//获取专项答题的列表
                for(let j = 0; j < examPapers.length; j++){
                    //遍历查询有没有没做过的
                    if(examPapers[j].status != 2){//status： 1为"开始答题" , 2为"重新答题"
                        //如果不是"重新答题"，则可以做
                        examPaperId = examPapers[j].id;
                        continueFind = false;
                        break;
                    }
                }
                if(!continueFind){
                }else{
                    //增加页码
                    examPaperPageNo++;
                    if(examPaperTotalPageCount == null || examPaperPageNo > examPaperTotalPageCount){
                        //已经找完所有页码，还是没找到，不再继续查找
                        continueFind = false;
                    }
                }
            }else{
                continueFind = false;
            }
        })
        //频繁请求可能导致出错，所以等一等
        await waitingTime(1000);
    }
    return examPaperId;
}
//做专项答题
function doExamPaper(){
    return new Promise(function(resolve) {
        //查找有没有没做过的专项答题，有则返回ID
        findExamPaper().then(examPaperId => {
            if(examPaperId != null){
                console.log("正在做专项答题")
                let newPage = GM_openInTab(ExamPaperUrl.replace("{id}",examPaperId),{active: true,insert: true, setParent :true});
                let doing = setInterval(function() {
                    if(newPage.closed) {
                        clearInterval(doing);//停止定时器
                        resolve('done');
                    }
                }, 1000);
            }else{
                console.log("没有找到未完成的专项答题，跳过")
                resolve('noTest');
            }
        });
    })
}
//获取每周答题列表
function getExamWeekly(){
    return new Promise(function(resolve) {
        $.ajax({
            type: "GET",
            url: ExamWeeklyListUrl.replace("{pageNo}",examWeeklyPageNo),
            xhrFields: {
                withCredentials: true //如果没有这个请求失败
            },
            dataType: "json",
            success: function(data){
                console.log(data)
                data = data.data_str;
                if(data.indexOf("-") != -1){
                    data = data.replace(/-/g, "+");
                }
                if(data.indexOf("_") != -1){
                    data = data.replace(/_/g, "/");
                }
                data = decodeURIComponent(escape(window.atob(data)));
                //JSON格式化
                data = JSON.parse(data);
                resolve(data);
            },
            error: function(){
                resolve(new Array());
            }
        });
    })
}
//查询每周答题列表看看还有没有没做过的，有则返回id
async function findExamWeekly(){
    var continueFind = true;
    var examWeeklyId = null;
    console.log("正在寻找未完成的每周答题")
    while(continueFind){
        await getExamWeekly().then(data => {
            if(data){
                if(examWeeklyTotalPageCount == null){
                    //如果总页码没初始化，则初始化
                    examWeeklyTotalPageCount = data.totalPageCount;
                }
                for(let i = 0; i< data.list.length; i++){
                    let examWeeks = data.list[i].practices;//获取每周的测试列表
                    for(let j = 0; j < examWeeks.length; j++){
                        //遍历查询有没有没做过的
                        if(examWeeks[j].status != 2){//status： 1为"开始答题" , 2为"重新答题"
                            //如果不是"重新答题"，则可以做
                            examWeeklyId = examWeeks[j].id;
                            continueFind = false;
                            break;
                        }
                    }
                    if(!continueFind){
                        //如果已经找到了，则退出循环
                        break;
                    }
                }
                if(!continueFind){
                }else{
                    //增加页码
                    examWeeklyPageNo++;
                    if(examWeeklyTotalPageCount == null || examWeeklyPageNo > examWeeklyTotalPageCount){
                        //已经找完所有页码，还是没找到，不再继续查找
                        continueFind = false;
                    }
                }
            }else{
                continueFind = false;
            }
        })
        //频繁请求可能导致出错，所以等一等
        await waitingTime(1000);
    }
    return examWeeklyId;
}
//做每周答题
function doExamWeekly(){
    return new Promise(function(resolve) {
        //查找有没有没做过的每周测试，有则返回ID
        //examWeeklyId = 147;//测试题目
        findExamWeekly().then(examWeeklyId => {
            if(examWeeklyId != null){
                console.log("正在做每周答题")
                let newPage = GM_openInTab(ExamWeeklyUrl.replace("{id}",examWeeklyId),{active: true,insert: true, setParent :true});
                let doing = setInterval(function() {
                    if(newPage.closed) {
                        clearInterval(doing);//停止定时器
                        resolve('done');
                    }
                }, 1000);
            }else{
                console.log("没有找到未完成的每周答题，跳过")
                resolve('noTest');
            }
        });
    })
}
//获取答题按钮
function getNextButton(){
    return new Promise(function(resolve) {
        let nextInterVal = setInterval(()=>{
            let nextAll=document.querySelectorAll(".ant-btn");
            let next = nextAll[0];
            if(nextAll.length==2) {
                next = nextAll[1];
            }
            if(next.textContent){
                clearInterval(nextInterVal);//停止定时器
                resolve(next);
            }
        },800);
    })
}
//暂停锁
function doingPause(){
    return new Promise(function(resolve) {
        let doing = setInterval(function() {
            if(!pause) {
                clearInterval(doing);//停止定时器
                resolve('done');
            }else{
                console.log("等待")
            }
        }, 500);
    })
}

//滑动验证
async function slideVerification(){
    let xc_window = document.querySelector("#nc_1_n1t");
    if(xc_window){
        pause = true;//先暂停
        hasSlideVerification = true;
        //先关掉
        document.querySelector("#J-risk-close-btn").click();
        await waitingTime(1000);
        //回到上一题
        document.querySelector(".pre-btn").click();
        await waitingTime(1000);
        //回到这题
        document.querySelector(".next-btn").click();
        await waitingTime(1000);
        //提交答题
        document.querySelector(".next-btn").click();
        await waitingTime(1000);

        console.log("滑动验证");
        let btn = document.querySelector(".btn_slide");
        let mousedown = document.createEvent("MouseEvents");
        let rect = btn.getBoundingClientRect();
        let x = rect.x||rect.left;
        let y = rect.y||rect.top;
        let w = 300;
        //点击滑块
        try{
            mousedown.initMouseEvent("mousedown",true,true,unsafeWindow,0,x, y, x, y,false,false,false,false,0,null);
        }catch(e){
            mousedown = new MouseEvent("mousedown",{
                bubbles: true,
                cancelable: true,
                view: unsafeWindow,//控制台用window,脚本要用unsafeWindow
                detail: 0,
                screenX: 0,
                screenY: 0,
                clientX: 0,
                clientY: 0,
                ctrlKey: false,
                altKey: false,
                shiftKey: false,
                metaKey: false,
                button:0,
                relatedTarget: null,
            });
        }
        console.log("点击滑块");
        btn.dispatchEvent(mousedown);

        let dx = 0;
        let dy = 0;

        //滑动滑块
        let intervaltimer = setInterval(function(){
            var mousemove = document.createEvent("MouseEvents");
            var _x = x + dx;
            var _y = y + dy;
            //滑动滑块
            try{
                mousemove.initMouseEvent("mousemove",true,true,unsafeWindow,0,_x, _y, _x, _y,false,false,false,false,0,null);
            }catch(e){
                mousemove = new MouseEvent("mousemove",{
                    bubbles: true,
                    cancelable: true,
                    view: unsafeWindow,//控制台用window,脚本要用unsafeWindow
                    detail: 0,
                    screenX: _x,
                    screenY: _y,
                    clientX: _x,
                    clientY: _y,
                    ctrlKey: false,
                    altKey: false,
                    shiftKey: false,
                    metaKey: false,
                    button:0,
                    relatedTarget: null,
                });
            }
            console.log("滑动滑块");
            btn.dispatchEvent(mousemove);

            if(_x - x >= w){
                clearInterval(intervaltimer);
                var mouseup = document.createEvent("MouseEvents");
                try{
                    mouseup.initMouseEvent("mouseup",true,true,unsafeWindow,0,_x, _y, _x, _y,false,false,false,false,0,null);
                }catch(e){
                    mouseup = new MouseEvent("mouseup",{
                        bubbles: true,
                        cancelable: true,
                        view: unsafeWindow,//控制台用window,脚本要用unsafeWindow
                        detail: 0,
                        screenX: _x,
                        screenY: _y,
                        clientX: _x,
                        clientY: _y,
                        ctrlKey: false,
                        altKey: false,
                        shiftKey: false,
                        metaKey: false,
                        button:0,
                        relatedTarget: null,
                    });
                }
                console.log("松开滑块");
                btn.dispatchEvent(mouseup);
                pause = false;
            }
            else{
                dx += parseInt(Math.random()*(209-199)+199)/33;
                console.log(x,y,_x,_y,dx);
            }
        }, 30);
    }
}

//答题过程(整合)
async function doingExam() {
    let nextButton = null;
    let qNum = 0;//题号,第一题从0开始算
    let shouldSaveAnswer = false;
    while(true){
        //先等等再开始做题
        await waitingTime(2500);
        await doingPause();
        nextButton = await getNextButton();
        if(nextButton.textContent == "再练一次" || nextButton.textContent == "再来一组" || nextButton.textContent == "查看解析"){
            break;
        }
        try {
            document.querySelector(".tips").click();
        } catch(e) {
            console.log(e);
        }
        //所有提示
        var allTips=document.querySelectorAll("font[color=red]");
        await waitingTime(1500);
        //选项按钮
        var allbuttons=document.querySelectorAll(".q-answer");
        //获取所有填空
        var blanks=document.querySelectorAll("input[type=text]");
        try {
            //获取问题类型
            var questionType= document.querySelector(".q-header").textContent;
            questionType=questionType.substr(0,3)
        } catch (e) {
        }
        var results = [];
        switch(questionType) {
            case"填空题":{
                //第几个填空
                var inputBubblesEvent= new Event('input',{bubbles:true});
                if(blanks.length>1) {//如果有多个填空
                    if(allTips.length == 0){//如果没有提示，先获取看看有没有答案
                        try{//尝试点击视频播放按钮,播不播都没关系
                            document.getElementsByClassName("outter")[0].click();
                        }catch(e){}
                        //生成秘钥
                        let key = getKey();
                        //尝试获取答案
                        let answerData = await getAnswer(key);
                        if(answerData.status == 0 || answerData == "error"){//没有答案
                            for(let i=0;i< blanks.length;i++) {//没答案，随便填点东西
                                blanks[i].setAttribute("value",i);
                                //必须要阻止事件，不然无效
                                blanks[i].dispatchEvent(inputBubblesEvent);
                            }
                            shouldSaveAnswer = true;//答完保存答案
                        }else{//获取到了答案
                            //格式化
                            answerData = JSON.parse(answerData.data.txt_content);
                            answerData = answerData[0].content;
                            //因为有多个空，所以有多个答案，先切割
                            answerData = answerData.split(";");
                            for(let i=0;i< answerData.length;i++) {//将答案填入
                                blanks[i].setAttribute("value",answerData[i]);
                                blanks[i].dispatchEvent(inputBubblesEvent);
                            }
                        }
                    }else if(allTips.length == blanks.length) {
                        //如果填空数量和提示数量一致
                        for(let i=0;i< allTips.length;i++) {
                            //将答案填写到对应的空中
                            let answer=allTips[i].textContent;
                            if(answer && answer.length>0) {
                                blanks[i].setAttribute("value",answer);
                                blanks[i].dispatchEvent(inputBubblesEvent);
                            }else{
                                //发生了错误，只好随便填一下
                                blanks[i].setAttribute("value",i);
                                blanks[i].dispatchEvent(inputBubblesEvent);
                            }
                        }
                    }else if(allTips.length > blanks.length) {
                        //若提示数量比填空的数量多
                        //直接将所有答案整合填进去
                        let answer = "";
                        for(let i = 0; i < allTips.length; allTips++){
                            answer += allTips[i].textContent();
                        }
                        for(let j = 0;j<blanks.length; j++) {
                            blanks[j].setAttribute("value",answer);
                            blanks[j].dispatchEvent(inputBubblesEvent);
                        }
                    }else{
                        //一般不会跑到这，如果到这了输出一下，表示惊讶
                        console.log("居然跑到了这里")
                    }
                }else if(blanks.length == 1) {//只有一个空，直接把所有tips合并。
                    let answer = "";
                    if(allTips.length != 0 ){//如果有提示
                        for(let i = 0; i< allTips.length; i++){
                            answer += allTips[i].textContent;
                        }
                    }else{
                        try{//尝试点击视频播放按钮,不过播不播都没关系
                            document.querySelector('video').play();
                        }catch(e){}
                        let key = getKey();
                        let answerData = await getAnswer(key);
                        if(answerData.status == 0 || answerData == "error"){
                            //没有获取到答案
                            answer = "不知道";
                            //没有其他人做过这道视频题，所以需要答完保存答案，这样其他人遇到就能做对
                            shouldSaveAnswer = true;
                        }else{
                            //有答案
                            answerData = JSON.parse(answerData.data.txt_content);
                            answer = answerData[0].content;
                        }
                    }
                    blanks[0].setAttribute("value",answer);
                    blanks[0].dispatchEvent(inputBubblesEvent);
                    break;
                }
                else
                {
                    //怕有没空白的情况。
                }
                break;
            }
            case "多选题":{
                results = [];
                let hasButton = false;
                for(let i=0;i< allTips.length;i++) {
                    let tip=allTips[i];
                    let answer = tip.textContent;
                    if(answer && answer.length>0) {
                        for(let j = 0; j < allbuttons.length; j++) {
                            //获取按钮
                            let selectButton = allbuttons[j];
                            //获取按钮的上的答案
                            let buttonAnswer = selectButton.textContent;
                            if(buttonAnswer == answer || buttonAnswer.indexOf(answer) != -1 || answer.indexOf(buttonAnswer) != -1){
                                hasButton = true;
                                if (!$(selectButton).hasClass("chosen")){
                                    selectButton.click();
                                }
                                break;
                            }
                        }
                    }
                }
                if(!hasButton){
                    //没找到按钮，随便选一个
                    allbuttons[0].click();
                }
                break;
            }
            case "单选题":{
                let results = [];
                let answer = "";
                for(let i=0;i< allTips.length;i++) {
                    answer += allTips[i].textContent;
                }
                if(answer && answer.length>0) {
                    let answerButton = null;
                    for(let i=0; i < allbuttons.length; i++) {
                        let buttonAnswer= allbuttons[i].textContent;
                        //对比答案,如果完全一样，那么肯定是
                        if(buttonAnswer == answer) {
                            answerButton = allbuttons[i];
                            break;
                        }else if(buttonAnswer.indexOf(answer) != -1 || answer.indexOf(buttonAnswer) != -1){
                            //如果只是包含答案的部分内容，则可能是，还需要继续找
                            answerButton = allbuttons[i];
                            continue;
                        }
                    }
                    if(answerButton){
                        answerButton.click();
                    }else{
                        //没找到按钮，随便选一个
                        allbuttons[0].click();
                    }
                } else {
                    //没答案，随便选一个
                    allbuttons[0].click();
                }
                break;
            }
            default:
                break;
        }
        qNum++;
        nextButton = await getNextButton();
        if(nextButton.textContent != "再练一次" && nextButton.textContent != "再来一组" && nextButton.textContent != "查看解析"){
            nextButton.click();
            if(shouldSaveAnswer){//如果应该保存答案
                let key = getKey();//获取key
                let answerTemp = document.getElementsByClassName("answer")[0].innerText;
                let reg = new RegExp(' ', "g")
                let answer = "";
                try{//从字符串中拿出答案
                    answer = answerTemp.split("：")[1];
                    answer = answer.replace(reg,";");
                }catch(e){
                    answer = answerTemp;
                }
                await saveAnswer(key,answer);
                shouldSaveAnswer = false;
            }
        } else {
            //已经做完，跳出循环
            break;
        }
    }
    window.close();
}
//获取关键字
function getKey(){
    //获取题目的文本内容
    let key = document.getElementsByClassName("q-body")[0].innerText;
    //外部引用md5加密
    key = md5(key);
    console.log(key)
    return key;
}
//保存答案
function saveAnswer(key,value){
    return new Promise(function(resolve) {
        value = [{"title":key,"content":value}];
        value = JSON.stringify(value);
        $.ajax({
            type: "POST",
            url: AnswerSaveUrl,
            data:{
                txt_name: key,
                txt_content:value,
                password:"",
                v_id: ""
            },
            dataType: "json",
            success: function(data){
                resolve(data);
            },
            error: function(){
                resolve("error");
            }
        });
    })
}
//获取答案
function getAnswer(key){
    return new Promise(function(resolve) {
        $.ajax({
            type: "POST",
            url: AnswerDetailUrl,
            data:{
                txt_name: key,
                password:""
            },
            dataType: "json",
            success: function(data){
                resolve(data);
            },
            error: function(){
                resolve("error");
            }
        });
    })
}
//等待时间工具函数
function waitingTime(time){
    if(!Number.isInteger(time)){
        time = 1000;
    }
    return new Promise(resolve => {
        setTimeout(function(){
            resolve('done');
        },time);
    });
}
//查询今日完成情况
function getToday(){
    return new Promise(function(resolve) {
        $.ajax({
            type: "GET",
            url: SearchSocreUrl,
            xhrFields: {
                withCredentials: true //如果没有这个请求失败
            },
            dataType: "json",
            success: function(temp){
                //console.log(temp);
                resolve(temp.data.taskProgress);
            },
            error: function(){
                resolve(new Array());
            }
        });
    })
}
//初始化配置
function initSetting(){
    try{
        let settingTemp = JSON.parse(GM_getValue('studySetting'));
        if(settingTemp != null){
            settings = settingTemp;
        }else{
            settings = [true,true,true,true,true,true,true,false];
        }
    }catch(e){
        //没有则直接初始化
        settings = [true,true,true,true,true,true,true,false];
    }
}
//创建“手动答题”按钮
function createManualButton(){
    let title = document.getElementsByClassName("title")[0];
    let manualButton = document.createElement("button");
    manualButton.setAttribute("id","manualButton");
    manualButton.innerText = "关闭自动答题";
    manualButton.className = "egg_auto_btn";
    //添加事件监听
    try{// Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
        manualButton.addEventListener("click",clickManualButton,false);
    }catch(e){
        try{// IE8.0及其以下版本
            manualButton.attachEvent('onclick',clickManualButton);
        }catch(e){// 早期浏览器
            console.log("不学习何以强国error: 手动答题按钮绑定事件失败")
        }
    }
    //插入节点
    title.parentNode.insertBefore(manualButton, title.nextSibling);
}
//点击手动学习按钮
function clickManualButton(){
    let manualButton = document.getElementById("manualButton");
    if(manualButton.innerText == "关闭自动答题"){
        manualButton.innerText = "开启自动答题";
        manualButton.className = "egg_manual_btn";
        pause = true;
    }else{
        manualButton.innerText = "关闭自动答题";
        manualButton.className = "egg_auto_btn";
        pause = false;
    }
}
//创建“开始学习”按钮和配置
function createStartButton(){
    let base = document.createElement("div");
    var baseInfo="";
    baseInfo += "<form id=\"settingData\" class=\"egg_menu\" action=\"\" target=\"_blank\" onsubmit=\"return false\"><div class=\"egg_setting_box\"><div class=\"egg_setting_item\"><label>新闻<\/label><input class=\"egg_setting_switch\" type=\"checkbox\" name=\"0\" " + (settings[0] ? 'checked': '') +"\/>				<\/div>				<div class=\"egg_setting_item\">					<label>视频<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"1\" " + (settings[1] ? 'checked': '') +"\/>				<\/div>				<div class=\"egg_setting_item\">					<label>每日答题<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"6\" "+ (settings[6] ? 'checked': '') +"\/>				<\/div>								<div class=\"egg_setting_item\">					<label>专项练习<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"5\" "+ (settings[5] ? 'checked': '') + "\/><\/div><hr \/><div title='Tip:开始学习后，隐藏相关页面和提示（不隐藏答题中的关闭自动答题按钮）' class=\"egg_setting_item\"> <label>运行隐藏<\/label> <input class=\"egg_setting_switch\" type=\"checkbox\" name=\"7\""+ (settings[7] ? 'checked': '') + "/></div><div id='saveSetting' style=\"color:#d90609;border: solid 2px;justify-content: center;align-items: center;border-radius: 20px;cursor: pointer;margin: 12px 0;font-size:14px;\" class=\"egg_setting_item\"><label style=\"cursor: pointer;\">保存配置<\/label><\/div><a style=\"text-decoration: none;\" title=\"视频不自动播放？点此查看解决办法\" target=\"blank\" href=\"https://docs.qq.com/doc/DZllGcGlJUG1qT3Vx\"><div style=\"color:#5F5F5F;font-size:14px;\" class=\"egg_setting_item\"><label style=\"cursor: pointer;\">视频不自动播放?<\/label><\/div><\/a><\/div><\/form>";
    base.innerHTML = baseInfo;
    let body = document.getElementsByTagName("body")[0];
    body.append(base)
    let startButton = document.createElement("button");
    startButton.setAttribute("id","startButton");

    startButton.innerText = "开始学习";
    startButton.className = "egg_study_btn egg_menu";

    //获取上一次学习完成的日期
    //     let finishDate = GM_getValue('finishDate');
    //     if(finishDate && finishDate == new Date().getDate()){
    //         //如果上一次完成的日期就是今天，那么不用学习了
    //         startButton.innerText = "已完成";
    //         startButton.className = "egg_study_btn egg_menu";
    //         startButton.style.color = "#c7c7c7";
    //         startButton.style.cursor = "default";
    //         startButton.setAttribute("disabled",true);
    //     }else{
    //         //否则需要学习
    //         startButton.innerText = "开始学习";
    //         startButton.className = "egg_study_btn egg_menu";
    //     }


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

//显示提示
function showTip(title,type = "success",time = 1000){
    let tipBox = document.createElement("div");
    let baseInfo="";
    if(type == null){
        type = "success";
    }
    baseInfo += "<div class='egg_tip egg_tip_" + type + "'>" + title + "</div>";
    tipBox.innerHTML = baseInfo;
    let body = document.getElementsByTagName("body")[0];
    body.append(tipBox);
    if(time == null){
        time = 1000;
    }
    //经过一定时间后，取消显示提示
    setTimeout(function(){
        tipBox.remove();
    },time);
}

//保存配置
function saveSetting(){
    let form = document.getElementById("settingData");
    let formData = new FormData(form);
    settings[0] = (formData.get('0') != null);
    settings[1] = (formData.get('1') != null);
    settings[6] = (formData.get('6') != null);
    settings[5] = (formData.get('5') != null);
    settings[7] = (formData.get('7') != null);//运行时是否要隐藏
    console.log("保存配置")
    GM_setValue('studySetting',JSON.stringify(settings));
    showTip("保存成功");
}


//是否显示目录
function showMenu(isShow = true){
    let items = document.getElementsByClassName("egg_menu");
    for(let i = 0;i < items.length; i++){
        items[i].style.display = isShow ? "block":"none";
    }
}

//获取二维码的ID
function getQRcodeId(){
    return new Promise(function(resolve) {
        $.ajax({
            type: "GET",
            url: GetQRcodeUrl,
            dataType: "json",
            success: function(temp){
                console.log(temp);
                if(temp.success){
                    resolve(temp.result);
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

//获取扫码登录状态
function getScanQRcodeStatus(qrcodeId){
    return new Promise(function(resolve) {
        $.ajax({
            type: "POST",
            url: LisenScanQRcodeUrl,
            xhrFields: {
                withCredentials: true //如果没有这个请求失败
            },
            dataType: "json",
            data:{
                qrCode:qrcodeId,
                goto:"https://oa.xuexi.cn",
                pdmToken:""
            },
            success: function(temp){
                resolve(temp);
            },
            error: function(){
                resolve(false);
            }
        });
    })
}

//初始化登录二维码
async function initQRcode(){
    let loggedBox = document.querySelectorAll("a[class='logged-link']")[0];
    if(loggedBox && loggedBox.innerText){
        //已经登录了
    }else{
        //没登录
        let qrcodeId = await getQRcodeId();
        if(qrcodeId){
            //生成登录二维码url
            //let url = encodeURIComponent("https://login.xuexi.cn/login/qrcommit?showmenu=false&code=" + qrcodeId + "&appId=dingoankubyrfkttorhpou");
            //let generateQRcodeUrl = GenerateQRcodeUrl.replace("{url}",url).replace("{time}",new Date().getTime());
            let qrcodeBox = document.createElement("div");
            qrcodeBox.setAttribute("id","qglogin");
            //console.log(generateQRcodeUrl)
            qrcodeBox.innerHTML = "<iframe class='egg_qrcode_box' src='https://pc.xuexi.cn/points/login.html?ref=https://www.xuexi.cn/'></iframe>";//"<div class=\"egg_qrcode_box\"><div class=\"egg_qrcode_title\">扫码登录</div><img src=\""+ generateQRcodeUrl +"\"></div>"
            let body = document.getElementsByTagName("body")[0];
            body.setAttribute("id","body-body");
            body.append(qrcodeBox);

            let lastNum = 0;
            //监听有没有扫码登录
            setInterval(function(){
                let nextNum = GM_getValue("loginNum");
                if(lastNum != 0 && lastNum == nextNum){
                    location.reload();
                }
                lastNum = nextNum;
            },1200);
        }else{
            alert("获取登录二维码失败，请手动打开登录页面登录")
        }
    }
}

//开始
async function start(){
    //保存配置
    console.log("初始化...");
    let loggedBox = document.querySelectorAll("a[class='logged-link']")[0];
    console.log("检查是否登录...")
    if(loggedBox && loggedBox.innerText){
        let startButton = document.getElementById("startButton");
        startButton.innerText = "正在学习";
        startButton.style.cursor = "default";
        startButton.setAttribute("disabled",true);
        if(settings[7]){
            showMenu(false);
        }
        let taskProgress = null;
        let continueToDo = true;
        let tasks = [false,false,false,false,false]
        while(continueToDo){
            //查询今天还有什么任务没做完
            console.log("检查今天还有什么任务没做完")
            taskProgress = await getToday();
            console.log(taskProgress)
            if(taskProgress != null){
                console.log("开始学习")

                //检查新闻
                if(settings[0] && taskProgress[0].currentScore != taskProgress[0].dayMaxScore){
                    tasks[0] = false;//只要还有要做的，就当做没完成
                    newsNum = taskProgress[0].dayMaxScore - taskProgress[0].currentScore;//还需要看多少个新闻
                    console.log("1.看新闻");
                    await readNews();
                }else{
                    tasks[0] = true;
                }

                //检查视频
                let temp = parseInt(taskProgress[1].dayMaxScore - taskProgress[1].currentScore);
                let temp2 = parseInt(taskProgress[2].dayMaxScore - taskProgress[2].currentScore);
                if(settings[1] && (temp != 0 || temp2 != 0)){
                    tasks[1] = false;//只要还有要做的，就当做没完成
                    videoNum = temp > temp2 ? temp : temp2;//还需要看多少个视频
                    console.log("2.看视频");
                    await watchVideo();
                }else{
                    tasks[1] = true;
                }

                //检查每日答题
                if(settings[6] && taskProgress[5].currentScore != taskProgress[5].dayMaxScore){
                    tasks[2] = false;//只要还有要做的，就当做没完成
                    console.log("3.做每日答题");
                    await doExamPractice();
                }else{
                    tasks[2] = true;
                }

                //检查每周答题（每周答题已取消）
                //                 if(settings[2] && taskProgress[2].currentScore == 0){
                //                     tasks[3] = false;//只要还有要做的，就当做没完成
                //                     console.log("4.做每周答题");
                //                     let result = await doExamWeekly();
                //                     if(result == "noTest"){
                //                         //如果是全都完成了，已经没有能做的了
                //                         tasks[3] = true;
                //                     }
                //                 }else{
                //                     tasks[3] = true;
                //                 }

                //检查专项练习
                if(settings[5] && taskProgress[4].currentScore == 0){
                    tasks[4] = false;//只要还有要做的，就当做没完成
                    console.log("5.做专项练习");
                    let result = await doExamPaper();
                    if(result == "noTest"){
                        //如果是全都完成了，已经没有能做的了
                        tasks[4] = true;
                    }
                }else{
                    tasks[4] = true;
                }

                if(tasks[0] && tasks[1] && tasks[2] && tasks[4]){
                    //如果检查都做完了，就不用继续了
                    continueToDo = false;
                }
            }else{
                alert("发生意外错误")
                continueToDo = false;
            }
            console.log("continueToDo : " + continueToDo)
        }
        console.log("已完成")
        startButton.innerText = "已完成";
        startButton.style.color = "#c7c7c7";
        if(settings[7]){
            showMenu()
        }
        //设置完成日期
        //         GM_setValue('finishDate',new Date().getDate());
        //         setTimeout(function(){
        //             location.reload();
        //         },5000);//5秒后刷新页面
    }else{
        //提醒登录
        alert("请先登录");
    }
    return false;
}