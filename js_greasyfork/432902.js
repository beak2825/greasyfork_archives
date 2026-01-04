// ==UserScript==
// @name         不学习何以强国
// @namespace    http://tampermonkey.net/
// @version      1.8.4
// @description  不学习何以强国，解放双手自动读文章,看视频，做习题。
// @author       荷包蛋。
// @match        https://www.xuexi.cn
// @match        https://www.xuexi.cn/*
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
// @downloadURL https://update.greasyfork.org/scripts/432902/%E4%B8%8D%E5%AD%A6%E4%B9%A0%E4%BD%95%E4%BB%A5%E5%BC%BA%E5%9B%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/432902/%E4%B8%8D%E5%AD%A6%E4%B9%A0%E4%BD%95%E4%BB%A5%E5%BC%BA%E5%9B%BD.meta.js
// ==/UserScript==
var study_css = ".egg_study_btn{outline:0;border:0;position:fixed;top:5px;left:5px;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#fff;color:#d90609;font-size:18px;font-weight:bold;text-align:center;box-shadow:0 0 9px #666777}.egg_manual_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#e3484b;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_auto_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#666777;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_setting_box{position:fixed;top:70px;left:5px;padding:12px 20px;border-radius:10px;background-color:#fff;box-shadow:0 0 9px #666777}.egg_setting_item{margin-top:5px;height:30px;width:140px;font-size:16px;display:flex;justify-items:center;justify-content:space-between}input[type='checkbox'].egg_setting_switch{cursor:pointer;margin:0;outline:0;appearance:none;-webkit-appearance:none;-moz-appearance:none;position:relative;width:40px;height:22px;background:#ccc;border-radius:50px;transition:border-color .3s,background-color .3s}input[type='checkbox'].egg_setting_switch::after{content:'';display:inline-block;width:1rem;height:1rem;border-radius:50%;background:#fff;box-shadow:0,0,2px,#999;transition:.4s;top:3px;position:absolute;left:3px}input[type='checkbox'].egg_setting_switch:checked{background:#fd5052}input[type='checkbox'].egg_setting_switch:checked::after{content:'';position:absolute;left:55%;top:3px}";
GM_addStyle(study_css);
//https://www.xuexi.cn/lgdata/3uoe1tg20en0.json
//查询今日完成情况
const SearchSocreUrl = "https://pc-proxy-api.xuexi.cn/api/score/days/listScoreProgress?sence=score&deviceType=2";
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
//获取当前日期
var currDate = new Date().toISOString().split('T')[0];
var newsNum = 6;
var news = [];
var videoNum = 6;
var videos = [];
var settings = [];
var pause = false;//是否暂停答题
//每周答题当前页码
var examWeeklyPageNo = 1;
//每周答题总页码
var examWeeklyTotalPageCount = null;
//专项答题当前页码
var examPaperPageNo = 1;
//专项答题总页码
var examPaperTotalPageCount = null;
$(document).ready(function(){
    let url = window.location.href;
    if(url == "https://www.xuexi.cn" || url == "https://www.xuexi.cn/" || url == "https://www.xuexi.cn/index.html"){
        let ready = setInterval(function() {
            if(document.getElementsByClassName("text-wrap")[0]) {
                clearInterval(ready);//停止定时器
                //初始化设置
                initSetting();
                //创建"开始学习"按钮
                createStartButton();
            }
        }, 800);
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
                //去除答题验证
                cancelVerify();
                //开始答题
                doingExam();
            }
        }, 500);
    }else{
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
    try{
        document.querySelector('video').play();
    }catch(e){}
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
                data = decodeURIComponent(escape(window.atob(data.data_str.replace(/-/g, "+").replace(/_/g, "/"))));
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
                data = decodeURIComponent(escape(window.atob(data.data_str.replace(/-/g, "+").replace(/_/g, "/"))));
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
            }
            console.log("等待")
        }, 500);
    })
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
        var buttons=document.querySelectorAll(".q-answer");
        var textboxs=document.querySelectorAll("input[type=text]");
        //问题类型
        try {
            var qType= document.querySelector(".q-header").textContent;
            qType=qType.substr(0,3)
        } catch (e) {
            console.log(e);
        }
        var results = [];
        switch(qType) {
            case"填空题":
                //第几个填空
                var mevent=new Event('input',{bubbles:true});
                if(textboxs.length>1) {//如果有多个空
                    if(allTips.length == 0){//如果没有提示
                        try{//尝试点击视频播放按钮,播不播都没关系
                            document.getElementsByClassName("outter")[0].click();
                        }catch(e){}
                        let key = getKey();
                        let answerData = await getAnswer(key);
                        if(answerData.status == 0 || answerData == "error"){//没有答案
                            for(let i=0;i< textboxs.length;i++) {
                                textboxs[i].setAttribute("value",i);
                                textboxs[i].dispatchEvent(mevent);
                            }
                            shouldSaveAnswer = true;//答完保存答案
                        }else{
                            answerData = JSON.parse(answerData.data.txt_content);
                            answerData = answerData[0].content;
                            answerData = answerData.split(";");
                            for(let i=0;i< answerData.length;i++) {
                                textboxs[i].setAttribute("value",answerData[i]);
                                textboxs[i].dispatchEvent(mevent);
                            }
                        }
                    }else if(allTips.length==textboxs.length) {//填空数量和提示数量一致
                        for(let i=0;i< allTips.length;i++) {
                            let tip=allTips[i];
                            let tipText=tip.textContent;
                            if(tipText.length>0) {
                                //通过设置属性,然后立即让他冒泡这个input事件.
                                //否则1,setattr后,内容消失.
                                //否则2,element.value=124后,属性值value不会改变,所以冒泡也不管用.
                                textboxs[i].setAttribute("value",tipText);
                                textboxs[i].dispatchEvent(mevent);
                            }
                        }
                    }else if(allTips.length>textboxs.length) {//若提示数量比填空的数量多。
                        var lineFeed=document.querySelector('.line-feed').textContent;//这个是提示的所有内容，不仅包含红色答案部分。
                        let n=0;//计数，第几个tip。
                        for(let j=0;j<textboxs.length;j++) {
                            let tipText=allTips[n].textContent;
                            let nextTipText="";
                            do {
                                tipText+=nextTipText;
                                if(n<textboxs.length-1) {
                                    n++;
                                    nextTipText=allTips[n].textContent;
                                } else {
                                    nextTipText="结束了，没有了。";
                                }
                            }
                            while(lineFeed.indexOf(tipText+nextTipText));
                            textboxs[j].setAttribute("value",tipText);
                            textboxs[j].dispatchEvent(mevent);
                        }
                    }else
                    {
                        //一般不会跑到这，如果到这了输出一下，表示惊讶
                        console.log("居然跑到了这里")
                    }
                }else if(textboxs.length==1) {//只有一个空，直接把所有tips合并。
                    let tipText="";
                    if(allTips.length !=0 ){//如果有提示
                        for(let i=0;i< allTips.length;i++){
                            tipText += allTips[i].textContent;
                        }
                    }else{
                        try{//尝试点击视频播放按钮,播不播都没关系
                            document.querySelector('video').play();
                        }catch(e){}
                        let key = getKey();
                        let answerData = await getAnswer(key);
                        if(answerData.status == 0 || answerData == "error"){//没有答案
                            tipText = "不知道";
                            shouldSaveAnswer = true;//答完保存答案
                        }else{
                            answerData = JSON.parse(answerData.data.txt_content);
                            tipText = answerData[0].content;
                        }
                    }
                    textboxs[0].setAttribute("value",tipText);
                    textboxs[0].dispatchEvent(mevent);
                    break;
                }
                else
                {
                    //怕有没空白的情况。
                }
                break;
            case "多选题":
                results = [];
                for(let i=0;i< allTips.length;i++) {
                    let tip=allTips[i];
                    let tipText=tip.textContent;
                    if(tipText.length>0) {
                        for(let js=0;js<buttons.length;js++) {
                            let cButton=buttons[js];
                            let cButtonText=cButton.textContent;
                            results[js] = xiangshidu(cButtonText, tipText)
                        }
                    }
                    let max = 0;
                    let index = 0;
                    results.forEach((item, i) => {
                        if (item > max) {
                            max = item;
                            index = i;
                        }
                    });
                    if (!$(buttons[index]).hasClass("chosen")){
                        buttons[index].click();
                    }
                }
                break;
            case "单选题":
                //单选，所以所有的提示，其实是同一个。有时候，对方提示会分成多个部分。
                //比如2018年10月第一周答题第二题。
                //case 块里不能直接用let。所以增加了个if。
                results = [];
                if(true)
                {
                    //把红色提示组合为一条
                    let tipText="";
                    for(let i=0;i< allTips.length;i++) {
                        tipText += allTips[i].textContent;
                    }
                    let clicked = false;
                    if(tipText.length>0) {
                        //循环对比后点击
                        for(let js=0;js<buttons.length;js++) {
                            results[js] = 0;
                            let cButton=buttons[js];
                            let cButtonText=cButton.textContent;
                            //通过判断是否相互包含，来确认是不是此选项
                            if(cButtonText.indexOf(tipText)>-1||tipText.indexOf(cButtonText)>-1) {
                                clicked = true;
                                cButton.click();
                                break;
                            } else {
                                results[js] = xiangshidu(cButtonText, tipText)
                            }
                        }
                        if (!clicked) {
                            let max = 0;
                            let index = 0;
                            results.forEach((item, i) => {
                                if (item > max) {
                                    max = item;
                                    index = i;
                                }
                            });
                            buttons[index].click();
                        }
                    } else {
                        buttons[0].click();
                    }
                }
                break;
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
//对比两个字符串相似度
function xiangshidu(str1,str2) {
    var len1 = str1.length;
    var len2 = str2.length;
    var arr = [];
    for (let y = 0; y <= len1; y++)
        arr[y] = [y];
    for (let x = 1; x <= len2; x++)
        arr[0][x] = x;
    for (let y = 1; y <= len1; y++) {
        for (let x = 1; x <= len2; x++) {
            arr[y][x] = Math.min(
                arr[y-1][x]+1,
                arr[y][x-1]+1,
                arr[y-1][x-1]+(str1[y-1]==str2[x-1]?0:1)
            );
        }
    }
    return 1 - arr[len1][len2] / Math.max(len1,len2);
}
//去除答题验证
function cancelVerify(){
    try{
        let verifyBox = document.getElementById("nc_mask");
        verifyBox.id = "egg_nc_mask";
        verifyBox.innerHTML = "";
        verifyBox.remove();
    }catch(e){
        console.log("去除验证失败");
    }
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
    baseInfo += "<form id=\"settingData\" class=\"egg_menu\" action=\"\" target=\"_blank\" onsubmit=\"return false\"><div class=\"egg_setting_box\"><div class=\"egg_setting_item\"><label>新闻<\/label><input class=\"egg_setting_switch\" type=\"checkbox\" name=\"0\" " + (settings[0] ? 'checked': '') +"\/>				<\/div>				<div class=\"egg_setting_item\">					<label>视频<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"1\" " + (settings[1] ? 'checked': '') +"\/>				<\/div>				<div class=\"egg_setting_item\">					<label>每日答题<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"6\" "+ (settings[6] ? 'checked': '') +"\/>				<\/div>				<div class=\"egg_setting_item\">					<label>每周答题<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"2\" "+ (settings[2] ? 'checked': '') +"\/>				<\/div>				<div class=\"egg_setting_item\">					<label>专项练习<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"5\" "+ (settings[5] ? 'checked': '') + "\/><\/div><hr \/><div title='Tip:开始学习后，隐藏相关页面和提示（不隐藏答题中的关闭自动答题按钮）' class=\"egg_setting_item\"> <label>运行隐藏<\/label> <input class=\"egg_setting_switch\" type=\"checkbox\" name=\"7\""+ (settings[7] ? 'checked': '') + "/></div><a style=\"text-decoration: none;\" title=\"视频不自动播放？点此查看解决办法\" target=\"blank\" href=\"https://docs.qq.com/doc/DZllGcGlJUG1qT3Vx\"><div style=\"color:#5F5F5F;font-size:14px;\" class=\"egg_setting_item\"><label style=\"cursor: pointer;\">视频不自动播放?<\/label><\/div><\/a><\/div><\/form>";
    base.innerHTML = baseInfo;
    let body = document.getElementsByTagName("body")[0];
    body.append(base)
    let startButton = document.createElement("button");
    startButton.setAttribute("id","startButton");
    startButton.innerText = "开始学习";
    startButton.className = "egg_study_btn egg_menu";
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
//保存配置
function saveSetting(){
    let form = document.getElementById("settingData");
    let formData = new FormData(form);
    settings[0] = (formData.get('0') != null);
    settings[1] = (formData.get('1') != null);
    settings[6] = (formData.get('6') != null);
    settings[2] = (formData.get('2') != null);
    settings[5] = (formData.get('5') != null);
    settings[7] = (formData.get('7') != null);//运行时是否要隐藏
    GM_setValue('studySetting',JSON.stringify(settings));
}
//是否显示目录
function showMenu(isShow = true){
    let items = document.getElementsByClassName("egg_menu");
    for(let i = 0;i < items.length; i++){
        items[i].style.display = isShow ? "block":"none";
    }
}
//开始
async function start(){
    //保存配置
    console.log("初始化...")
    saveSetting();
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
                let temp2 = parseInt(taskProgress[3].dayMaxScore - taskProgress[3].currentScore);
                if(settings[1] && (temp != 0 || temp2 != 0)){
                    tasks[1] = false;//只要还有要做的，就当做没完成
                    videoNum = temp > temp2 ? temp : temp2;//还需要看多少个视频
                    console.log("2.看视频");
                    await watchVideo();
                }else{
                    tasks[1] = true;
                }

                //检查每日答题
                if(settings[6] && taskProgress[6].currentScore != taskProgress[6].dayMaxScore){
                    tasks[2] = false;//只要还有要做的，就当做没完成
                    console.log("3.做每日答题");
                    await doExamPractice();
                }else{
                    tasks[2] = true;
                }

                //检查每周答题
                if(settings[2] && taskProgress[2].currentScore == 0){
                    tasks[3] = false;//只要还有要做的，就当做没完成
                    console.log("4.做每周答题");
                    let result = await doExamWeekly();
                    if(result == "noTest"){
                        //如果是全都完成了，已经没有能做的了
                        tasks[3] = true;
                    }
                }else{
                    tasks[3] = true;
                }

                //检查专项练习
                if(settings[5] && taskProgress[5].currentScore == 0){
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

                if(tasks[0] && tasks[1] && tasks[2] && tasks[3] && tasks[4]){
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
    }else{
        //提醒登录
        alert("请先登录");
    }
    return false;
}