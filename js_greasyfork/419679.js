// ==UserScript==
// @name         学习强国辅助工具（freeman99sd）
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  学习强国自动看文章、看视频、测试每题，每周，专项答题。
// @author       freeman99sd
// @match        https://*.xuexi.cn/
// @match        https://xuexi.cn
// @match        https://pc.xuexi.cn/points/exam-practice.html
// @match        https://pc.xuexi.cn/points/exam-weekly-detail.html?id=*
// @match        https://pc.xuexi.cn/points/exam-weekly-list.html
// @match        https://pc.xuexi.cn/points/exam-paper-detail.html?id=*
// @match        https://pc.xuexi.cn/points/exam-paper-list.html
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419679/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7%EF%BC%88freeman99sd%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/419679/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7%EF%BC%88freeman99sd%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const dati="开始答题"

    var timers = [];

    async function doStudy() {
        await doArticleStudy();
        await doVideoStudy();

        await doAllExam();

    }

    async function doAllExam() {
        var scores = await getScores();
        if (scores.daily.dayScore < scores.daily.dayMaxScore) {
            await openDailyExam();
        } else if (scores.weekly.dayScore === 0) {
            await openWeeklyExam();
        } else if(scores.zhuanxiang.dayScore === 0) {
            await openZhuanxiangExam();
        }
    }

    async function openDailyExam() {
        console.log("openDailyExam() start")
        var scores = await getScores();

        if (scores.daily.dayScore < scores.daily.dayMaxScore) {
            var win = window.open("https://pc.xuexi.cn/points/exam-practice.html");
            var timer = setInterval(async function() {
                if(win.closed) {
                    var scores = await getScores();
                    if (scores.daily.dayScore < scores.daily.dayMaxScore) {
                        clearInterval(timer);
                        openDailyExam();
                    } else {
                        openWeeklyExam();
                        clearInterval(timer);
                        console.log('DailyExam closed');
                    }
                }
            },10000);

            async function test(win2) {

            }
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
                    openZhuanxiangExam();
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
            window.open("https://pc.xuexi.cn/points/exam-paper-list.html");

        }
        console.log("openZhuanxiangExam() end")
    }

    async function doDailyExam() {
        var scores = await getScores();
        while (scores.daily.dayScore < scores.daily.dayMaxScore) {
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

    async function doWeeklyExam() {
        var scores = await getScores();
        while (scores.weekly.dayScore === 0) {
            console.log("===================================");
            await delay();
            var end = await doExam();
            if (end) {
                window.close();
                break;
            }
            //scores = await getScores();
        }

    }

    async function doZhuanXiangExam() {
        var scores = await getScores();
        while (scores.zhuanxiang.dayScore >= 0) {
            console.log("===================================");
            await delay();
            var end = await doExam();
            if (end) {
                window.close();
                break;
            }
            //scores = await getScores();
        }

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
                openZhuanxiangExam();
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
            exams[exams.length-1].click();
        });
    } else if (window.location.href.startsWith("https://pc.xuexi.cn/points/exam-weekly-detail.html")) {
        doWeeklyExam();
    } else if (window.location.href.startsWith("https://pc.xuexi.cn/points/exam-paper-detail.html")) {
        doZhuanXiangExam();
    } else {
        $.when(getDayScore()).then(data => {
            if (data.ok === false) {
                alert("请先登录学习强国，然后才能自动学习！！");
            } else {
                doStudy();
            }
        })
    }

    function openExamPage() {

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

        var end = false;
        var nextAll=document.querySelectorAll(".ant-btn");

        console.log(nextAll);
        var next=nextAll[0];

        if(nextAll.length==2)//俩按钮，说明有个按钮是交卷。
        {
            next=nextAll[1];
        }

        if(next.textContent!="再练一次"&&next.textContent!="再来一组"&&next.textContent!="查看解析"){

        } else {
            return true;
        }

        try {
            document.querySelector(".tips").click();
        }catch(e){}

        //所有提示
        var allTips=document.querySelectorAll("font[color=red]");
        console.log(allTips);
        await delay();

        //单选多选时候的按钮
        var buttons=document.querySelectorAll(".q-answer");

        //填空时候的那个textbox，这里假设只有一个填空
        var textboxs=document.querySelectorAll("input");
        //问题类型
        try {
            var qType= document.querySelector(".q-header").textContent;
            qType=qType.substr(0,3)
        }catch (e){}



        var results = [];
        switch(qType)
        {
            case"填空题":
                //第几个填空
                var mevent=new Event('input',{bubbles:true});
                if( textboxs.length>1)//若不止是一个空
                {
                    //填空数量和提示数量是否一致
                    if(allTips.length==textboxs.length)
                    {
                        for(let i=0;i< allTips.length;i++)//数量一致，则一一对应。
                        {
                            let tip=allTips[i];
                            let tipText=tip.textContent;
                            if(tipText.length>0)
                            {
                                //通过设置属性,然后立即让他冒泡这个input事件.
                                //否则1,setattr后,内容消失.
                                //否则2,element.value=124后,属性值value不会改变,所以冒泡也不管用.
                                textboxs[i].setAttribute("value",tipText);
                                textboxs[i] .dispatchEvent(mevent);
                                //  break;
                            }
                        }
                    }
                    else
                    {
                        //若填空数量和提示数量不一致，那么，应该都是提示数量多。

                        if(allTips.length>textboxs.length)
                        {
                            var lineFeed=document.querySelector('.line-feed').textContent;//这个是提示的所有内容，不仅包含红色答案部分。
                            let n=0;//计数，第几个tip。
                            for(let j=0;j<textboxs.length;j++)//多个填空
                            {

                                let tipText=allTips[n].textContent;
                                let nextTipText="";
                                do{
                                    tipText+=nextTipText;
                                    if(n<textboxs.length-1)
                                    {
                                        n++;
                                        nextTipText=allTips[n].textContent;
                                    }
                                    else
                                    {
                                        nextTipText="结束了，没有了。";
                                    }
                                }
                                while(lineFeed.indexOf(tipText+nextTipText));

                                textboxs[j].setAttribute("value",tipText);
                                textboxs[j] .dispatchEvent(mevent);
                            }

                        }
                        else
                        {
                            //提示数量少于填空数量，则我无法分析
                            //你人工操作吧。不易拆分出答案。
                        }

                    }
                }
                else if(textboxs.length==1)
                {//只有一个空，直接把所有tips合并。
                    let tipText="";
                    for(let i=0;i< allTips.length;i++)
                    {
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
                for(let i=0;i< allTips.length;i++)//循环提示列表。
                {
                    let tip=allTips[i];
                    let tipText=tip.textContent;
                    console.log(tipText);
                    if(tipText.length>0)//提示内容长度大于0
                    {
                        for(let js=0;js<buttons.length;js++)//循环选项列表。用来点击
                        {
                            let cButton=buttons[js];
                            let cButtonText=cButton.textContent;//选项按钮的内容
                            results[js] = xiangshidu(cButtonText, tipText)
                        }
                    }

                    let max = 0;
                    let index = 0;
                    console.log(results);
                    results.forEach((item, i) => {
                        if (item > max) {
                            max = item;
                            index = i;
                        }
                    });

                    console.log("max = " + max)
                    console.log("index = " + index)
                    console.log($(buttons[index]).hasClass("chosen"));
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
                    for(let i=0;i< allTips.length;i++)
                    {
                        tipText += allTips[i].textContent;
                    }

                    console.log(tipText)
                    let clicked = false;
                    if(tipText.length>0)
                    {
                        //循环对比后点击
                        for(let js=0;js<buttons.length;js++)
                        {
                            results[js] = 0;
                            let cButton=buttons[js];
                            let cButtonText=cButton.textContent;
                            console.log(cButtonText);
                            //通过判断是否相互包含，来确认是不是此选项
                            if(cButtonText.indexOf(tipText)>-1||tipText.indexOf(cButtonText)>-1)
                            {
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
                            console.log(results);
                            results.forEach((item, i) => {
                                if (item > max) {
                                    max = item;
                                    index = i;
                                }
                            });

                            console.log("max = " + max)
                            console.log("index = " + index)
                            buttons[index].click();
                        }

                    }
                }
                break;
            default:
                break;
        }
        try{
            document.querySelector(".tips").click();

        }catch(e){}

        nextAll=document.querySelectorAll(".ant-btn");

        console.log(nextAll);
        // next=nextAll[0];

        if(nextAll.length==2)//俩按钮，说明有个按钮是交卷。
        {
            next=nextAll[1];
        }

        if(next.textContent!="再练一次"&&next.textContent!="再来一组"&&next.textContent!="查看解析"){
            end = false
            next.click();
        } else {
            end = true;
        }
        console.log("end = " + end)
        return end;

    }



    async function doVideoStudy() {
        var videos = await getVideos();
        // console.log(videos);
        var i = 0;
        var scores
        var closed = true;
        while (true) {
            closed = false;
            scores = await getScores();
            console.log(scores.video_num.dayScore);
            console.log(scores.video_num.dayMaxScore);
            console.log(scores.video_time.dayScore);
            console.log(scores.video_time.dayMaxScore);
            var k = 0;
            if (scores.video_num.dayScore < scores.video_num.dayMaxScore || scores.video_time.dayScore < scores.video_time.dayMaxScore) {
                var readarticle_time = 40 + (Math.ceil(Math.random()*10) + 5);
                console.log(readarticle_time);
                var win = window.open(videos[i].url, videos[i].title);
                //for (var j = 0; j < 2; j++) {
                    /*if (Math.random() > 0.3) {

                    }*/
                await delay();
                var height = win.document.body.clientHeight/2;
                win.window.scrollTo(0, height);
                console.log(new Date());
                await sleep(readarticle_time * 1000);
                console.log(new Date());
                    //console.log(j);
                //}

                win.close();

                i++
            } else {
                break;
            }
        }

    }

    async function getVideos() {
        var videos = []
        await $.when(getVideos1(), getVideos2(), getVideos3()).done(function(videos1, videos2, videos3) {
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
    }

    function getVideos1() {
        return $.ajax({
            type: "GET",
            url: "https://www.xuexi.cn/lgdata/3m1erqf28h0r.json?_st=26814661",
            dataType: 'json',
            xhrFields: {
                withCredentials: true //允许跨域带Cookie
            }
        });
    }

    function getVideos2() {
        return $.ajax({
            type: "GET",
            url: "https://www.xuexi.cn/lgdata/41gt3rsjd6l8.json?_st=26814661",
            dataType: 'json',
            xhrFields: {
                withCredentials: true //允许跨域带Cookie
            }
        });
    }

    function getVideos3() {
        return $.ajax({
            type: "GET",
            url: "https://www.xuexi.cn/lgdata/48cdilh72vp4.json?_st=26814661",
            dataType: 'json',
            xhrFields: {
                withCredentials: true //允许跨域带Cookie
            }
        });
    }

    async function doArticleStudy() {
        var articles = await getArticles();
        articles.sort(function(){
            return Math.random() - 0.5
        })
        var i = 0;
        var scores
        while (true) {
            scores = await getScores();
            console.log(scores.article_num.dayScore);
            console.log(scores.article_num.dayMaxScore);
            console.log(scores.article_time.dayScore);
            console.log(scores.article_time.dayMaxScore);
            if (scores.article_num.dayScore < scores.article_num.dayMaxScore || scores.article_time.dayScore < scores.article_time.dayMaxScore) {
                var readarticle_time = 50 + (Math.ceil(Math.random()*10) + 5);
                console.log(readarticle_time);
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
                i++
            } else {
                break;
            }
        }
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

    function getArticles() {
        return $.ajax({
            type: "GET",
            url: "https://www.xuexi.cn/lgdata/35il6fpn0ohq.json?_st=26814368",
            dataType: 'json',
            xhrFields: {
                withCredentials: true //允许跨域带Cookie
            }
        });
    }


    async function getScores() {
       var scores = {}
       await $.when(getDayScore(), getTotalScore()).done(function(dayScoreResult, totalScoreResult) {
            //console.log(dayScoreResult);

            var dayScoreDtos = dayScoreResult[0].data.dayScoreDtos;
            dayScoreDtos.forEach(function(scoreDto) {
                if (scoreDto.ruleId === 1) {
                    scores["article_num"]  = {dayScore:scoreDto.currentScore, dayMaxScore:scoreDto.dayMaxScore} // 0阅读文章
                }
                if (scoreDto.ruleId === 2) {
                    scores["video_num"]  = {dayScore:scoreDto.currentScore, dayMaxScore:scoreDto.dayMaxScore} // 1视听学习
                }
                if (scoreDto.ruleId === 9) {
                    scores["login"]  = {dayScore:scoreDto.currentScore, dayMaxScore:scoreDto.dayMaxScore} // 登陆
                }
                if (scoreDto.ruleId === 1002) {
                    scores["article_time"]  = {dayScore:scoreDto.currentScore, dayMaxScore:scoreDto.dayMaxScore} // 文章时长
                }
                if (scoreDto.ruleId === 1003) {
                    scores["video_time"]  = {dayScore:scoreDto.currentScore, dayMaxScore:scoreDto.dayMaxScore} // 视听学习时长
                }
                if (scoreDto.ruleId === 6) {
                    scores["daily"]  = {dayScore:scoreDto.currentScore, dayMaxScore:scoreDto.dayMaxScore} // 每日答题
                }
                if (scoreDto.ruleId === 5) {
                    scores["weekly"]  = {dayScore:scoreDto.currentScore, dayMaxScore:scoreDto.dayMaxScore} // 每周答题
                }
                if (scoreDto.ruleId === 4) {
                    scores["zhuanxiang"]  = {dayScore:scoreDto.currentScore, dayMaxScore:scoreDto.dayMaxScore} // 专项答题
                }

            });
            scores.totalScore = totalScoreResult[0].data.score;
            //console.log(scores);

        })
        return scores;
    }


    function getTotalScore() {
        return $.ajax({
            type: "GET",
            url: "https://pc-api.xuexi.cn/open/api/score/get",
            dataType: 'json',
            xhrFields: {
                withCredentials: true //允许跨域带Cookie
            }
        });
    }


    function getDayScore() {
        return $.ajax({
            type: "GET",
            url: "https://pc-api.xuexi.cn/open/api/score/today/queryrate",
            dataType: 'json',
            xhrFields: {
                withCredentials: true //允许跨域带Cookie
            }
        });
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

})();

