// ==UserScript==
// @name         学习强国私有库
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  本脚本免费使用，长期更新，无需关注、订阅、加入或者额外注册。进入https://www.xuexi.cn/登陆后自动看文章、看视频、测试每日、每周和专项答题。可根据需要选择自动学习项目。如果大家用的还可以，帮忙给个好评，谢谢！鉴于大家提出怕被学习强国检测而封号的问题，我已经搭建了第三方服务器（国外），并通过第三方服务器取得文章和视频，学分取得情况也已经通过解析网页的形式取得，完全脱离了与学习强国服务器的交互，降低了被检测到的风险，当然在性能上也会有所下降，望大家多多支持！！该版本查看积分页面将无法打开，请在手机上查看学习积分！在本机chrome和firefox上测试没有问题，如果个别朋友0.3.2版本不能正常使用的话，请先退回到0.2.6版本使用。专业人士请在www.xuexi.cn页面按12打开控制台，把控制台log贴上来反馈给我。
// @author       freeman99sd
// require       https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @match        https://*.xuexi.cn/
// @match        https://xuexi.cn
// @match        https://xuexi.cn/index.html
// @match        https://www.xuexi.cn/index.html
// @match        https://www.xuexi.cn/lgpage/detail/index.html
// @match        https://www.xuexi.cn/72ac54163d26d6677a80b8e21a776cfa/9a3668c13f6e303932b5e0e100fc248b.html
// @match        https://www.xuexi.cn/0809b8b6ab8a81a4f55ce9cbefa16eff/ae60b027cb83715fd0eeb7bb2527e88b.html
// @match        https://pc.xuexi.cn/points/my-points.html
// @match        https://pc.xuexi.cn/points/exam-practice.html
// @match        https://pc.xuexi.cn/points/exam-weekly-detail.html?id=*
// @match        https://pc.xuexi.cn/points/exam-weekly-list.html
// @match        https://pc.xuexi.cn/points/exam-paper-detail.html?id=*
// @match        https://pc.xuexi.cn/points/exam-paper-list.html
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js
// @require      https://cdn.jsdelivr.net/npm/@supabase/supabase-js@1.0.3/dist/umd/supabase.min.js
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/425596/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD%E7%A7%81%E6%9C%89%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/425596/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD%E7%A7%81%E6%9C%89%E5%BA%93.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const dati="开始答题"

    var needReload;
    var timers = [];
    var debug = true; // 调试开关，有问题打开这个开关，在www.xuexi.cn页面按12打开控制台，把log贴上来反馈给我。

    var msg = "";
    var datev = new Date();
    const supa = supabase.createClient("https://vsxqsnogzhrykowqdloi.supabase.co", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMTI3NTU1NywiZXhwIjoxOTI2ODUxNTU3fQ.DWxw-rBJSqM6oShe3WI55j9nuJ5Zzo4x3ISzROA90aU')

    //var articles = await getArticles();
    //console.log(articles)

    var date = datev .getFullYear() + "/" + datev .getMonth() + "/" + datev .getDate();
    var examData = GMgetValue(date, {weeklyExamDone:false, zhuanxiangExamDone:false})
    var settings = GMgetValue("Settings");
    if (debug) {
        console.log("examData-----------------", examData);
        console.log(settings);
    }


    if (!settings) {
        msg = "请通过左边按钮设定自动学习项目，默认为全部自动学习！！";
        settings={
                    article: { value: true, name: "文章学习" },
                    video: { value: true, name: "视频学习" },
                    daily: { value: true, name: "每日答题" },
                    weekly: { value: true, name: "每周答题" },
                    zhuanxiang: { value: true, name: "专项答题" },
                }
    } else {
        msg = "如需修改自动学习项目，请通过左边按钮修改！！";
    }

    if (debug) {
        console.log(settings);
    }

    async function doStudy() {
        console.log("doStudy() start")

        var scores = await getScores();
        if (debug) {
            console.log(scores);

            console.log(checkAriticle(scores))
            console.log(checkVideo(scores))
            console.log(checkDaily(scores))
            console.log(checkWeekly(scores))
            console.log(checkZhuanxiang(scores))
        }

        if (!(checkAriticle(scores) ||
              checkVideo(scores) ||
              checkDaily(scores) ||
              checkWeekly(scores) ||
              checkZhuanxiang(scores))) {
            console.log("return");
            return;
        }
        if (checkAriticle(scores)) {
             await doArticleStudy();
        }

        if (checkVideo(scores)) {
            await doVideoStudy();
        }

        if (settings.daily.value || settings.weekly.value || settings.zhuanxiang.value) {
            if (checkDaily(scores)) {
                await openDailyExam();
            } else if (checkWeekly(scores)) {
                await openWeeklyExam();
            } else if(checkZhuanxiang(scores)) {
                await openZhuanxiangExam();
            }
        }

        console.log("doStudy() end")

    }

    function checkAriticle(scores) {
        return (settings.article.value && scores.article.dayScore < scores.article.dayMaxScore);
    }

    function checkVideo(scores) {
        return (settings.video.value && (scores.video_num.dayScore < scores.video_num.dayMaxScore || scores.video_time.dayScore < scores.video_time.dayMaxScore));
    }

    function checkDaily(scores) {
        return (scores.daily.dayScore < scores.daily.dayMaxScore && settings.daily.value);
    }

    function checkWeekly(scores) {
        return (scores.weekly.dayScore === 0 && settings.weekly.value && !examData.weeklyExamDone);
    }

    function checkZhuanxiang(scores) {
        return (scores.zhuanxiang.dayScore === 0 && settings.zhuanxiang.value && !examData.zhuanxiangExamDone);
    }

    async function openDailyExam() {
        console.log("openDailyExam() start")
        var scores = await getScores();

        if (scores.daily.dayScore < scores.daily.dayMaxScore) {
            var win = window.open("https://pc.xuexi.cn/points/exam-practice.html");
            var timer = setInterval(async function() {
                if(win.closed) {
                    /*var scores = await getScores();
                    if (scores.daily.dayScore < scores.daily.dayMaxScore && settings.daily.value) {
                        clearInterval(timer);
                        openDailyExam();
                    } else {*/
                        if (checkWeekly(scores)){
                            openWeeklyExam();
                        } else if(checkZhuanxiang(scores)) {
                            openZhuanxiangExam();
                        } else {
                            location.reload();
                        }
                        clearInterval(timer);
                        console.log('DailyExam closed');
                    //}
                }
            },10000);
        }
        console.log("openDailyExam() end")
    }

    async function openWeeklyExam() {
        console.log("openWeeklyExam() start")
        var scores = await getScores();

        if (scores.weekly.dayScore === 0) {
            var win = window.open("https://pc.xuexi.cn/points/exam-weekly-list.html");
            var timer = setInterval(function() {
                if(win.closed) {
                    if(checkZhuanxiang(scores)) {
                        openZhuanxiangExam();
                    } else {
                        location.reload();
                    }
                    clearInterval(timer);
                    console.log('WeeklyExam closed');
                }
            },10000);

        }
        console.log("openWeeklyExam() end")
    }

    async function openZhuanxiangExam() {
        console.log("openZhuanxiangExam() start")
        var scores = await getScores();

        if (scores.zhuanxiang.dayScore === 0) {
            var win = window.open("https://pc.xuexi.cn/points/exam-paper-list.html");

            var timer = setInterval(function() {
                if(win.closed) {
                    location.reload();
                    clearInterval(timer);
                    console.log('ZhuanxiangExam closed');
                }
            },10000);
        }
        console.log("openZhuanxiangExam() end")
    }

    async function doDailyExam() {
        console.log("doDailyExam() start")
        if (settings.daily.value) {
            var scores = await getScores();
            while (scores.daily.dayScore < scores.daily.dayMaxScore ) {
                console.log("===================================");
                await delay();
                var end = await doExam();
                if (end) {
                    //await openDailyExam();
                    window.close();
                    break;
                }
            }
        }
        console.log("doDailyExam() end")

    }

    async function doWeeklyExam() {
        console.log("doWeeklyExam() start")
        if (settings.weekly.value) {
            var scores = await getScores();
            while (scores.weekly.dayScore === 0) {
                console.log("===================================");
                await delay();
                var end = await doExam();
                if (end) {
                    examData.weeklyExamDone = true;
                    GMsetValue(date, examData);
                    window.close();
                    break;
                }
                //scores = await getScores();
            }
        }
        console.log("doWeeklyExam() end")

    }

    async function doZhuanXiangExam() {
        console.log("doZhuanXiangExam() start")
        if (settings.zhuanxiang.value) {
            var scores = await getScores();
            while (scores.zhuanxiang.dayScore >= 0) {
                console.log("===================================");
                await delay();
                var end = await doExam();
                if (end) {
                    examData.zhuanxiangExamDone = true;
                    GMsetValue(date, examData);
                    window.close();
                    break;
                }
                //scores = await getScores();
            }
        }

        console.log("doZhuanXiangExam() end")
    }

    if (window.location.href === "https://pc.xuexi.cn/points/exam-practice.html") {
        doDailyExam();
    } else if (window.location.href==="https://pc.xuexi.cn/points/exam-weekly-list.html" ) {
        getExams().then(buttons => {
            var exams = Array.prototype.slice.call(buttons);
            exams = exams.filter(exams => {
                return exams.innerText === dati
            })
            if (exams.length == 0) {
                examData.weeklyExamDone = true;
                GMsetValue(date, examData);
                //openZhuanxiangExam();
                window.close();
            } else {
                exams[exams.length-1].click();
            }
        });
    } else if (window.location.href==="https://pc.xuexi.cn/points/exam-paper-list.html" ) {
        getExams().then(buttons => {
            var exams = Array.prototype.slice.call(buttons);
            exams = exams.filter(exams => {
                return exams.innerText === dati
            })
            if (exams.length == 0) {
                examData.zhuanxiangExamDone = true;
                GMsetValue(date, examData);
                window.close();
            } else {
                exams[exams.length-1].click();
            }

        });
    } else if (window.location.href.startsWith("https://pc.xuexi.cn/points/exam-weekly-detail.html")) {
        doWeeklyExam();
    } else if (window.location.href.startsWith("https://pc.xuexi.cn/points/exam-paper-detail.html")) {
        doZhuanXiangExam();
    } else if (window.location.href.startsWith("https://pc.xuexi.cn/points/my-points.html")) {
        $(document).ready(async function() {

            await parseScoreDocument();
            window.close();
        })

        /*setInterval(() => {
            needReload = GMgetValue("needReload");
            if (needReload == "1") {
                location.reload();
            }
        }, 60000);*/

    } else {
        $(document).ready(async function() {
            var retryNum = 20;
            var login;
            var logined;
            while (retryNum >= 0) { // 不知道什么原因，有时候就是取不到，所以多循环几次取
                login = document.querySelector("a.icon.login-icon");
                logined = document.querySelector("span.logged-text");
                if (debug) {
                console.log(login);
                }
                if (login != null && login != undefined) {
                    break;
                }

                if (logined != null && logined != undefined) {
                    break;
                }

                await sleep(2000);
                retryNum--;
                continue;
            }


            if (login != null && login != undefined) {
                alert("请先登录学习强国，然后才能自动学习！！\n" + msg);
            }

            if (logined != null && logined != undefined) {
                var win = window.open("https://pc.xuexi.cn/points/my-points.html");
                var timer = setInterval(function() {
                    if(win.closed) {
                        doStudy();
                        clearInterval(timer);
                        console.log('score page closed');
                    }
                },10000);

            }
        })
    }

    async function getExams() {
        var buttons = [];
        while (buttons.length == 0) {
            await delay();
            buttons=document.querySelectorAll(".ant-btn");
        }
        return buttons
    }

    async function delay() {
        await sleep((Math.random() * 5 + 2)*1000);
    }

    async function doExam() {
        console.log("doExam() start")
        var end = false;
        var nextAll=document.querySelectorAll(".ant-btn");

        if (debug) {
        console.log(nextAll);
        }
        var next=nextAll[0];

        if(nextAll.length==2) {
            next=nextAll[1];
        }

        if(next.textContent!="再练一次"&&next.textContent!="再来一组"&&next.textContent!="查看解析"){

        } else {
            return true;
        }

        try {
            document.querySelector(".tips").click();
        } catch(e) {
            console.log(e);
        }

        //所有提示
        var allTips=document.querySelectorAll("font[color=red]");
        if (debug) {
        console.log(allTips);
        }
        await delay();

        //选项按钮
        var buttons=document.querySelectorAll(".q-answer");

        var textboxs=document.querySelectorAll("input[type=text]");
        if (debug) {
        console.log(textboxs);
        }
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
                if( textboxs.length>1) {
                    //填空数量和提示数量一致
                    if(allTips.length==textboxs.length) {
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
                    }
                    else {
                        //若填空数量和提示数量不一致，那么，应该都是提示数量多。
                        if(allTips.length>textboxs.length) {
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

                        }

                    }
                }
                else if(textboxs.length==1) {//只有一个空，直接把所有tips合并。
                    let tipText="";
                    for(let i=0;i< allTips.length;i++)  {
                        tipText += allTips[i].textContent;
                    }
                    if (tipText === "") {
                        tipText = "不知道";
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
                    if (debug) {
                    console.log(tipText);
                    }
                    if(tipText.length>0) {
                        for(let js=0;js<buttons.length;js++) {
                            let cButton=buttons[js];
                            let cButtonText=cButton.textContent;
                            results[js] = xiangshidu(cButtonText, tipText)
                        }
                    }

                    let max = 0;
                    let index = 0;
                    if (debug) {
                    console.log(results);
                    }
                    results.forEach((item, i) => {
                        if (item > max) {
                            max = item;
                            index = i;
                        }
                    });

                    if (debug) {
                    console.log("max = " + max)
                    console.log("index = " + index)
                    console.log($(buttons[index]).hasClass("chosen"));
                    }
                    if (!$(buttons[index]).hasClass("chosen")) {
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

                    if (debug) {
                    console.log(tipText)
                    }
                    let clicked = false;
                    if(tipText.length>0) {
                        //循环对比后点击
                        for(let js=0;js<buttons.length;js++) {
                            results[js] = 0;
                            let cButton=buttons[js];
                            let cButtonText=cButton.textContent;
                            if (debug) {
                            console.log(cButtonText);
                            }
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
                            if (debug) {
                            console.log(results);
                            }
                            results.forEach((item, i) => {
                                if (item > max) {
                                    max = item;
                                    index = i;
                                }
                            });

                            if (debug) {
                            console.log("max = " + max)
                            console.log("index = " + index)
                            }
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
        try{
            document.querySelector(".tips").click();

        } catch(e){
            console.log(e);
        }

        nextAll=document.querySelectorAll(".ant-btn");

        if (debug) {
        console.log(nextAll);
        }

        if(nextAll.length==2) {
            next=nextAll[1];
        }

        if(next.textContent!="再练一次"&&next.textContent!="再来一组"&&next.textContent!="查看解析"){
            end = false
            next.click();
        } else {
            end = true;
        }
        if (debug) {
        console.log("end = " + end)
        }
        console.log("doExam() end")
        return end;

    }



    async function doVideoStudy() {
        console.log("doVideoStudy() start")
        var videos = await getVideos();
        // console.log(videos);
        var i = 0;
        var closed = true;
        var scores = await getScores();
        if (debug) {
        console.log(scores);
        }
        var num = Math.max((scores.video_num.dayMaxScore - scores.video_num.dayScore),(scores.video_time.dayMaxScore - scores.video_time.dayScore)) + 1
        while (num >= 0) {
            closed = false;
            //scores = await getScores();
            //console.log(scores.video_num.dayScore);
            //console.log(scores.video_num.dayMaxScore);
            //console.log(scores.video_time.dayScore);
            //console.log(scores.video_time.dayMaxScore);
            var k = 0;
            //if (scores.video_num.dayScore < scores.video_num.dayMaxScore || scores.video_time.dayScore < scores.video_time.dayMaxScore) {
                var readarticle_time = 40 + (Math.ceil(Math.random()*10) + 5);
            if (debug) {
                console.log(readarticle_time);
            }
                var win = window.open(videos[i].url, videos[i].title);
                //for (var j = 0; j < 2; j++) {
                /*if (Math.random() > 0.3) {

                    }*/
                await delay();
                var height = win.document.body.clientHeight/2;
                win.window.scrollTo(0, height);

                await sleep(readarticle_time * 1000);

                win.close();

                i++;
                num--;
            //} else {
              //  break;
            //}
        }
        console.log("doVideoStudy() end")

    }


    /*async function getVideos() {
        var videos = []
        await $.when(getVideos1(), getVideos2(), getVideos3()).done(function(videos1, videos2, videos3) {
            console.log(videos1)
            console.log(videos2)
            console.log(videos3)
            videos = videos.concat(videos1[0].map(video => {
                return {itemId:video.itemId, title:video.title, url:video.url}
            }))
            videos = videos.concat(videos2[0].map(video => {
                return {itemId:video.itemId, title:video.title, url:video.url}
            }))
            videos = videos.concat(videos3[0].map(video => {
                return {itemId:video.itemId, title:video.title, url:video.url}
            }))

            videos.sort(video => {
                return Math.random() - 0.5;
            })

        })
        return videos;
    }*/

    async function getVideos() {
        console.log("getVideos() start")
        let {data, error} = await supa
        .from('xuexi-videos-test')
        .select('id')

        let ids = data.sort(function(){
            return Math.random() - 0.5
        }).slice(0, 20).map(id => {
            return id.id
        })

        let response = await supa
        .from('xuexi-videos-test')
        .select('video')
        .in('id', ids)

        let result = response.data.map(video => {
            return video.video
        })

        if (debug) {
        console.log(result)
        }
        console.log("getVideos() end")

        return result

    }


    async function doArticleStudy() {
        console.log("doArticleStudy() start")
        var articles = await getArticles();
        /*articles.sort(function(){
            return Math.random() - 0.5
        })*/
        var i = 0;
        var scores = await getScores();
        if (debug) {
        console.log(scores);
        }
        var num = Math.ceil((scores.article.dayMaxScore - scores.article.dayScore)/2) + 1
        while (num >= 0) {

            //console.log(scores.article_num.dayScore);
            //console.log(scores.article_num.dayMaxScore);
            //console.log(scores.article_time.dayScore);
            //console.log(scores.article_time.dayMaxScore);
            //if (scores.article.dayScore < scores.article.dayMaxScore) {
                var readarticle_time = 50 + (Math.ceil(Math.random()*10) + 5);
            if (debug) {
                console.log(readarticle_time);
            }
                var win = window.open(articles[i].url, articles[i].title);
                //for (var j = 0; j < 2; j++) {
                //if (Math.random() > 0.3) {
                await delay()
                var height = win.document.body.clientHeight/2;
                win.window.scrollTo(0, height);
                //}
                await sleep(readarticle_time * 1000);
                //console.log(j);
                //}

                win.close();
                num--;
            i++;
            //} else {
              //  break;
            //}
        }
        console.log("doArticleStudy() end")
    }


    function sleep(ms) {
        //console.log(timers)
        timers.map(timer => {clearTimeout(timer)})
        timers = []
        return new Promise((resolve) => {
            var timer = setTimeout(resolve, ms)
            //console.log(timers)
            });
    }

    async function getArticles() {
        console.log("getArticles() start")
        let {data, error} = await supa
        .from('xuexi-articles-test')
        .select('id')

        let ids = data.sort(function(){
            return Math.random() - 0.5
        }).slice(0, 20).map(id => {
            return id.id
        })

        let response = await supa
        .from('xuexi-articles-test')
        .select('article')
        .in('id', ids)

        let result = response.data.map(article => {
            return article.article
        })

        if (debug) {
        console.log(result)
        }
        console.log("getArticles() end")

        return result
    }


    async function getScores() {
        console.log("getScores() start")
        var scores = GMgetValue("scores", {})
         if (debug) {
        console.log(scores);
         }
        console.log("getScores() end")
        return scores;
    }


    /*function getTotalScore() {
        var scores = GMgetValue("scores", {})
        return scores;
    }*/


    function getDayScore() {
        console.log("getDayScore() start")
        var scores = GMgetValue("scores", {})
        console.log("getDayScore() end")
        return scores;
    }

    async function  parseScoreDocument() {
console.log("parseScoreDocument() start")
        var scores = {};
        scores.totalScore = $("span.my-points-points.my-points-red").text();
        var cards = $("div.my-points-card-text");
        var length = cards.length;
        var retryNum = 20
        while (retryNum>0 && length == 0) {
            cards = $("div.my-points-card-text");
            length = cards.length;
            if (length > 0) {
                break;
            }
            if (debug) {
            console.log(length)
            }
            await sleep(5000)
            retryNum--;
        }

        /*for (var i = 0; i < length; i++) {
            console.log($(cards[i]).text());
        }*/
        var loginScoreText = $(cards[0]).text();
        var dayScore_login = parseInt(loginScoreText.split("/")[0].substring(0,1));
        var dayMaxScore_login = parseInt(loginScoreText.split("/")[1].substring(0,1));

        var articleScoreText = $(cards[1]).text();
        var dayScore_article = parseInt(articleScoreText.split("/")[0].substring(0,articleScoreText.split("/")[0].indexOf("分")));
        var dayMaxScore_article = parseInt(articleScoreText.split("/")[1].substring(0,articleScoreText.split("/")[1].indexOf("分")));

        var videoNumScoreText = $(cards[2]).text();
        var dayScore_videoNum = parseInt(videoNumScoreText.split("/")[0].substring(0,1));
        var dayMaxScore_videoNum = parseInt(videoNumScoreText.split("/")[1].substring(0,1));

        var videoTimeScoreText = $(cards[3]).text();
        var dayScore_videoTime = parseInt(videoTimeScoreText.split("/")[0].substring(0,1));
        var dayMaxScore_videoTime = parseInt(videoTimeScoreText.split("/")[1].substring(0,1));

        var dailyScoreText = $(cards[4]).text();
        var dayScore_daily = parseInt(dailyScoreText.split("/")[0].substring(0,1));
        var dayMaxScore_daily = parseInt(dailyScoreText.split("/")[1].substring(0,1));

        var weeklyScoreText = $(cards[5]).text();
        var dayScore_weekly = parseInt(weeklyScoreText.split("/")[0].substring(0,1));
        var dayMaxScore_weekly = parseInt(weeklyScoreText.split("/")[1].substring(0,1));

        var zhuanxiangScoreText = $(cards[6]).text();
        var dayScore_zhuanxiang = parseInt(zhuanxiangScoreText.split("/")[0].substring(0,zhuanxiangScoreText.split("/")[0].indexOf("分")));
        var dayMaxScore_zhuanxiang = parseInt(zhuanxiangScoreText.split("/")[1].substring(0,zhuanxiangScoreText.split("/")[1].indexOf("分")));


        scores.login  = {dayScore:dayScore_login, dayMaxScore:dayMaxScore_login} // 登陆
        scores.article  = {dayScore:dayScore_article, dayMaxScore:dayMaxScore_article}
        scores.video_num  = {dayScore:dayScore_videoNum, dayMaxScore:dayMaxScore_videoNum}

        scores.video_time  = {dayScore:dayScore_videoTime, dayMaxScore:dayMaxScore_videoTime} // 视听学习时长
        scores.daily  = {dayScore:dayScore_daily, dayMaxScore:dayMaxScore_daily} // 每日答题
        scores.weekly  = {dayScore:dayScore_weekly, dayMaxScore:dayMaxScore_weekly} // 每周答题
        scores.zhuanxiang  = {dayScore:dayScore_zhuanxiang, dayMaxScore:dayMaxScore_zhuanxiang} // 专项答题
        GMsetValue("scores", scores);
                if (debug) {
        console.log(scores)
        }
        console.log("parseScoreDocument() end")

    }

    function xiangshidu(str1,str2) {
        var len1 = str1.length;
        var len2 = str2.length;
        var arr = [];
        for (var y = 0; y <= len1; y++)
            arr[y] = [y];
        for (var x = 1; x <= len2; x++)
            arr[0][x] = x;
        for (var y = 1; y <= len1; y++) {
            for (var x = 1; x <= len2; x++) {
                arr[y][x] = Math.min(
                    arr[y-1][x]+1,
                    arr[y][x-1]+1,
                    arr[y-1][x-1]+(str1[y-1]==str2[x-1]?0:1)
                );
            }
        }
        return 1 - arr[len1][len2] / Math.max(len1,len2);
    }



    // 加菜单====================================================================
    function addStyle(cssText) {
        let a = document.createElement('style');
        a.textContent = cssText;
        let doc = document.head || document.documentElement;
        doc.appendChild(a);
    }

    function GMgetValue(name, defaultValue) {
        return GM_getValue(name, defaultValue)
    }

    function GMsetValue(name, value) {
        GM_setValue(name, value)
    }


    /**
 * 主界面 组件
 */
    const comMain = {
        template: `<div id="crackVIPSet" ref="crackVIPSet" :style="styleTop">
<div id="nav">
<button >☑</button>
</div>
<div id="list">
<div style="position:relative;top:0px;">
<b v-for="(key,index) in Object.keys(settings)" :key="index">
<label>
<input v-model="settings[key].value" @change="changeSetting(key)" type="checkbox">
<span>{{settings[key].name}}</span>
</label>
</b>
</div>
</div>

</div>`,
        data() {
            return {
                settings:settings,
                nav: 'settings',
                topOffset: 50,
            }
        },
        components: {
        },
        methods: {
            changeSetting(name) {
                GMsetValue("Settings", this.settings);
                console.log(this.settings);
            },

        },
        computed: {
            styleTop() {
                return `top:${this.topOffset}px;`;
            }
        },
        mounted: function() {

        }
    };

    /**
 * 主界面 CSS
 */
    addStyle(`
body{padding:0;margin:0}
/*
#crackVIPSet input[type=checkbox], input[type=checkbox]{display:none}
#crackVIPSet input[type=checkbox] + span:before,input[type=checkbox] + span:before{content:'☒';margin-right:5px}
#crackVIPSet input[type=checkbox]:checked + span:before, input[type=checkbox]:checked + span:before{content:'☑';margin-right:5px}
*/
#crackVIPSet{z-index:999999;position:fixed;display:grid;grid-template-columns:30px 150px;width:30px;height:150px;overflow:hidden;padding:5px 0 5px 0;opacity:0.4;font-size:12px}
#crackVIPSet button{cursor:pointer}
#crackVIPSet:hover{width:180px;height:450px;padding:5px 5px 5px 0;opacity:1}
#crackVIPSet #nav {display:grid;grid-auto-rows:50px 50px 200px;grid-row-gap:5px}
#crackVIPSet #nav [name=startStudy]:active{cursor:move}
#crackVIPSet #nav button{background:yellow;color:red;font-size:20px;padding:0;border:0;cursor:pointer;border-radius:0 5px 5px 0}
#crackVIPSet #list{overflow:auto;margin-left:2px}
#crackVIPSet #list b{display:block;cursor:pointer;color:#3a3a3a;font-weight:normal;font-size:14px;padding:5px;background-color:#ffff00cc;border-bottom:1px dashed #3a3a3a}
#crackVIPSet #list b:before{content:attr(data-icon);padding-right:5px}
#crackVIPSet #list b:first-child{border-radius:5px 5px 0 0}
#crackVIPSet #list b:last-child{border-radius:0 0 5px 5px}
#crackVIPSet #list b:hover{background-color:#3a3a3a;color:white}
`);


    Vue.prototype.$tele = new Vue();

    let crackApp = document.createElement("div");
    crackApp.id = "crackVIPSet";
    document.body.appendChild(crackApp);

    new Vue({
        el: "#crackVIPSet",
        render: h => h(comMain)
    });

})();

