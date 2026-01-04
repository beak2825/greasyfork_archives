// ==UserScript==
// @name         学习，学习！
// @namespace    http://tampermonkey.net/
// @icon         data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAADeUlEQVRIie2WbWhWZRjH/5vnCaIPQSNMocYTjD70MjWWYumYQ2tiG1YoSkzLaVRQiLZyFUQfil6s5UgGg4Fkhhiuxd7SvTrcRDcjpfq4F9CtfGboBN15nnN+fbjceXp8XiYY2YfdcOBwn+u6fv/7uq/7uk+WK6HbMLJvB3QWPAtOGKFz5+X81+DQxs2S78m7BdCcG2GuRKaHkrXgurBhE66Er7thxZqMPgn+9y+Awz9AXz8MDQXzGcF8uhvG/zCnsvU2d/IUXLtG7AbbqATlFXgSMQnK1kNPL7S24SsLStdB/4nMYFaVQfGzxCQ8Cc6dh+XP2Lf6fbDn67htQRHU1sHoKABoPigH3tgBeQXXs3QHjI2DctKDfTmQuxAmJ6FoNeyuhj8vwJmzoAfhyhW8BHvB4hWwcDn8csbEPPYkaH5cXGc3vLglgZME5pPPLU1ffGWrvRABz7PVRCZg1/sJ4MBvxzvw3gf2/uZOuHTZ0l+6Dhoak+yTwW/tgsHT9t7aBnkF4OTFBVz8C1zX9rGyCrqPmcCfjgappaExEMfAYEqhKVItqK3Dnd7f5zdCRxd8/Blsfc3Aq8osaHmFiQk/DpOTRKeLLBaDRYWw+rkgCzOCg5UXlkBXD2x73YK99AoMDcGS4rjN3lrYsAkeWQqjo/F5zbOMHGkHzUsZP6mBOHIU+v6wtGyxvKJCqfW4nKZmKZwrLxxW9ERH3Dj3AWlRvnSyXYpMyJEUKq9QVGN2yS/IV1RjqTtKUAxLV8LmbVaB11XS1GxF9Y+DH6zqvkftCJ0asMx09VgcsC1SGLqPpe0RBu7rt32prEr46El2Hn/7HVpaoaeX6DR4STGMjIDutXO7shSmpuDtd20BV69C25EZwL4P7Z3JnWjZ09apXBe++RbWvJAyiCfB8DBsrzSB1TVW8fsPzACu3xfvTPlPwdEOU3zpsjWSkrVpA0QlaG6BL/fAxEU4eMji7D+Q1DQyVnVMgrp62PKqBT39cyAqZfXX7IWch2FgEHqPQ3OLzY+N46fxcSWSrlhfUvbWl+VJN/f7OTUldX4nNTZJjiOvqlKhg4ekSESxDG4p73ZfklNdI+XcI82dK911Z9oA/s7tyo7FpOER6eyvmpNXIPm+1PBjZsHpUuFKdln09cNDT6S1cSX48KOU/TjTk+XeZEb/7fH//9mbBd/q+BuapkzTsaP4XQAAAABJRU5ErkJggg==
// @version      1.0.1
// @description  学习，学习，还是TMD学习！！！
// @author       H
// @license      Apache Licence
// @match        https://www.xuexi.cn
// @match        https://www.xuexi.cn/*
// @match        https://pc.xuexi.cn/points/login.html*
// @match        https://pc.xuexi.cn/points/my-points.html
// @match        https://pc.xuexi.cn/points/exam-index.html
// @match        https://pc.xuexi.cn/points/my-study.html
// @match        https://pc.xuexi.cn/points/exam-practice.html
// @match        https://pc.xuexi.cn/points/exam-weekly-detail.html?id=*
// @match        https://pc.xuexi.cn/points/exam-weekly-list.html
// @match        https://pc.xuexi.cn/points/exam-paper-detail.html?id=*
// @match        https://pc.xuexi.cn/points/exam-paper-list.html
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        window.close
// @require      https://greasyfork.org/scripts/469918-%E5%AD%A6%E4%B9%A0%E5%82%A8%E5%AD%98%E5%BA%93/code/%E5%AD%A6%E4%B9%A0%E5%82%A8%E5%AD%98%E5%BA%93.js?version=1230705
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.7.0.min.js
// @resource     svg-logo https://cdn.bootcdn.net/ajax/libs/font-awesome/6.2.1/css/all.min.css
// @connect      www.xuexi.cn
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/471044/%E5%AD%A6%E4%B9%A0%EF%BC%8C%E5%AD%A6%E4%B9%A0%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/471044/%E5%AD%A6%E4%B9%A0%EF%BC%8C%E5%AD%A6%E4%B9%A0%EF%BC%81.meta.js
// ==/UserScript==


/*
更新日志
V0.0.1
新增：
1.控制面板初绘
2.阅读新闻

V0.1.0
新增：
1.日志窗口
2.toast通知
优化：
1.代码结构

V0.1.1  2023/2/16
优化：
1.代码结构
2.新闻阅读
3.各页面交互

V0.1.2  2023/2/18
新增：
1.视听学习

V0.1.3  2023/2/20
新增：
1.每日答题
优化：
1.页面滚动函数

V0.1.4  2023/2/22
进行了第一次整合运行测试
优化：
1.整体优化
修复：
1.答题最后出现滑块验证导致程序意外终止
2.阅读滚动速度太快导致无法判定阅读完毕

V0.1.5  2023/2/28
优化：
1.整体优化
修复：
1.弹出窗口阻止
*/


//==脚本系统操作==
function deleteAllVar(){
    while(GM_listValues().length > 0){
        GM_deleteValue(GM_listValues()[0]);
    }
    console.log("变量已清空！");
}
function deleteVar(varname){
    GM_deleteValue(varname);
    console.log("删除了一个变量：" + varname);
}
function setVar(varname, vardata){
    GM_setValue(varname, vardata);
    console.log("设置了一个变量：\n" + varname + " => " + vardata);
}
function showAllVar() {
    var all_value="";
    for (var i = -1; i <= GM_listValues().length; i++) {
        if (i == -1) {
            all_value += "\n=========这里是储存的变量=========\n\n";
        } else if (i == GM_listValues().length) {
            all_value += "\n=========/这里是储存的变量=========";
        } else {
            all_value += GM_listValues()[i]+"："+GM_getValue(GM_listValues()[i])+"\n";
        }
    }
    console.log(all_value);
}
//删除所有变量
//deleteAllVar();

//删除变量
//deleteVar("news_goals");

//设置变量
//setVar("date", "2022-12-25");

//输出所有储存的变量
showAllVar();

//绑定到控制台
unsafeWindow.deleteAllVar = deleteAllVar;
unsafeWindow.deleteVar = deleteVar;
unsafeWindow.setVar = setVar;
unsafeWindow.showAllVar = showAllVar;
unsafeWindow.window.close = window.close;
//==/脚本系统操作==


//==常量声明==
const currentUrl = window.location.href;
const currentPath = window.location.pathname;
const points_name = ["news_goal","video_goal1","video_goal2","exam_goal"];
const points_name_show = ["新闻阅读","视频个数","视频时长","每日答题"];
const points_more = ["12","6","6","5"];
var study_interval, doing;
//==/常量声明==

unsafeWindow.createToast = createToast;
unsafeWindow.removeToast = removeToast;

//开始
console.log("插件【学习，学习！】开始运行...");

//插入所需的css
GM_addStyle(csscontent);
GM_addStyle(GM_getResourceText("svg-logo").replace(/\.\.\/webfonts/g, "https://cdn.bootcdn.net/ajax/libs/font-awesome/6.2.1/webfonts"));

//变量声明
var currentPage, pointTitle = [], currentGoals, currentExam;

window.onload = () => {
    start();
}

async function start() {

    //插入toast列表
    var ul = document.createElement("ul");
    ul.className = "notifications";
    $("body").append(ul);
    //createToast("success", "测试消息", 1);

    //判断页面
    console.log("判断当前页面...");

    if (currentUrl == "https://www.xuexi.cn" || currentUrl == "https://www.xuexi.cn/" || currentUrl == "https://www.xuexi.cn/index.html"){
        console.log("主页");
        //等待登录div加载完成
        //while (true) {
        //    if ($("div.login") .length && $("div.login").html()) {
        //        break;
        //    }
        //    await justWait(1000, 0);
        //}
        home();
    } else if (currentUrl.indexOf("login.html") != -1) {
        console.log("登录页");
        login();
    } else if (currentPath == "/points/my-points.html") {
        console.log("积分页");
        //等待积分div加载完成
        while (!$("div.my-points").length) {
            await justWait(1000, 0);
        }
        points();
    } else if (currentPath == "/points/my-study.html") {
        console.log("学习页");
        (GM_getValue("start")) ? (location.href = "https://pc.xuexi.cn/points/my-points.html") : (null);
        return;
    } else if (currentUrl.indexOf("/lgpage") != -1) {
        while (true) {
            if ($("section").length && $("section").html()) {
                break;
            }
            await justWait(1000, 0);
        }
        if ($("button.voice-lang-switch").length) {
            console.log("新闻页");
            if (!GM_getValue("reading")) {
                return;
            }
            news();
        } else {
            console.log("视频页");
            if (!GM_getValue("watching")) {
                return;
            }
            video();
        }
    } else if (currentUrl.indexOf("exam-practice.html") != -1) {
        console.log("答题页");
        if (!GM_getValue("examing")) {
            return;
        }
        examination();
    } else if (currentUrl.indexOf("exam-index.html") != -1) {
        console.log("答题主页");
        (GM_getValue("start")) ? (location.href = "https://pc.xuexi.cn/points/exam-practice.html") : (null);
    }
    return;
}

async function home() {
    if (GM_getValue("start") == undefined) {
        //第一次使用
        console.log("首次使用");
        //生成开始学习面板
        createConsole("start");
        return;
    } else if (GM_getValue("start") == "false" && GM_getValue("auto") != "true") {
        //未开始学习
        console.log("未开始学习")
        //生成开始学习面板
        createConsole("start");
        return;
    } else {
        //已开始学习
        console.log("已开始学习");
        createToast("info", "开始学习", 2);
        await initialize();
        //检查是否登录
        console.log("检查是否登录...");
        if (document.querySelector('.icon.login-icon') != null) {
            //未登录
            createToast("error", "未登录<br>正在前往登录页...", 2);
            await justWait(500, 1300);
            location.href = "https://pc.xuexi.cn/points/login.html";
            return;
        } else {
            //已登录
            console.log("已登录");
            createToast("success", "已登录<br>正在前往积分页...", 2);
            await justWait(500, 1300);
            location.href = "https://pc.xuexi.cn/points/my-points.html";
            return;
        }
    }
}

async function login() {
    while (true) {
        if ($("audio").length && $("audio").volume!=0) {
            $("audio").volume=0;
            break;
        }
        await justWait(10, 0);
    }
    createToast("info", "请扫码登录", 10);
    try {
        $("html,body").animate({ scrollTop: 1200 }, 1000);
    } catch (e) {
        window.scrollTo(0, 1200);
    }
}

async function points() {
    console.log("正在获取积分...");
    createToast("info", "获取积分", 2);
    var message = "更新了积分：<br>";
    pointTitle = [];
    while (pointTitle.length == 0) {
        $(".my-points-card").each(function() {
            var div = $(this);
            var div_title = div.find("p.my-points-card-title").text();
            var div_value = div.find("div.my-points-card-text").text().match(/(\d+)分/)[1];
            var div_total = div.find("div.my-points-card-text").text().match(/\/(\d+)分/)[1];
            GM_setValue(div_title, parseInt(div_value));
            GM_setValue(div_title + "total", parseInt(div_total));
            pointTitle.push(div_title);
            message += div_title + " => " + div_value + "<br>";
        });
        await justWait(500,0)
    }
    createToast("success", message, 3);
    if (GM_getValue("end")) {
        GM_setValue("start", false);
        createToast("success", `今日任务已完成！`, 0);
        console.log(pointTitle)
        createToast("info", "完成报告：", 0);
        (GM_getValue(pointTitle[1]) != GM_getValue(pointTitle[1] + "total")) ? (createToast("error", `新闻阅读：未完成（${GM_getValue(pointTitle[1]) + " / " + GM_getValue(pointTitle[1] + "total")}）`, 0)) : (createToast("success", "新闻阅读：已完成", 0));
        (GM_getValue(pointTitle[2]) != GM_getValue(pointTitle[2] + "total")) ? (createToast("error", `视频观看：未完成（${GM_getValue(pointTitle[2]) + " / " + GM_getValue(pointTitle[2] + "total")}）`, 0)) : (createToast("success", "视频观看：已完成", 0));
        (GM_getValue(pointTitle[3]) != GM_getValue(pointTitle[3] + "total")) ? (createToast("error", `每日答题：未完成（${GM_getValue(pointTitle[3]) + " / " + GM_getValue(pointTitle[3] + "total")}）`, 0)) : (createToast("success", "每日答题：已完成", 0));
        return;
    }
    //开始阅读
    (GM_getValue(pointTitle[1]) != GM_getValue(pointTitle[1] + "total")) ? (await read()) : (null);
    (GM_getValue(pointTitle[2]) != GM_getValue(pointTitle[2] + "total")) ? (await watch()) : (null);
    (GM_getValue(pointTitle[3]) != GM_getValue(pointTitle[3] + "total")) ? (await exam()) : (null);
    GM_setValue("end", true);
    location.reload();
}

//初始化
function initialize() {
    return new Promise(async function (resolve, reject) {
        //设置默认变量
        var totalvarsarray = ["reading", "watching", "examing", "end", "start"];
        var totalvaluesarray = [false, false, false, false, true];
        var varsarray = ["news_num", "video_num"];
        var valuesarray = [0, 0];
        //开始初始化变量
        console.log("开始初始化...");
        createToast("info", "初始化数据", 2);
        for (let i = 0; i < totalvarsarray.length; i++) {
            GM_setValue(totalvarsarray[i], totalvaluesarray[i]);
        }
        //检查日期
        console.log("储存的日期：" + GM_getValue("date"));
        if (GM_getValue("date") != getStandardDate()) {
            GM_setValue("date", getStandardDate());
            for (let i = 0; i < varsarray.length; i++) {
                GM_setValue(varsarray[i], valuesarray[i]);
            }
            GM_setValue("end", false);
            if (GM_getValue("start") == "true") {
                //前一天未正常结束
                createToast("warning", "上一次的学习未正常结束，建议查看学习积分，确认是否满足要求", 0);
            }
        }
        return resolve();
    });
}

function getToday() {
    return new Promise(function (resolve) {
        $.ajax({
            type: "GET",
            url: "https://pc-proxy-api.xuexi.cn/delegate/score/days/listScoreProgress?sence=score&deviceType=2",
            xhrFields: {
                withCredentials: true //如果没有这个请求失败
            },
            dataType: "json",
            success: function (temp) {
                resolve(temp.data.taskProgress);
            },
            error: function () {
                resolve(new Array());
            }
        });
    })
}

function getUrl(type) {
    return new Promise(function (resolve) {
        if (type == 0) {
            type = "https://www.xuexi.cn/lgdata/1jscb6pu1n2.json";
        } else {
            type = "https://www.xuexi.cn/lgdata/1742g60067k.json";
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: type,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                resolve(JSON.parse(response.responseText));
            }
        });
    })
}

function read() {
    return new Promise(async function (resolve, reject) {
        console.log("阅读新闻...");
        createToast("info", "开始阅读新闻", 0);
        const need_goals = GM_getValue(pointTitle[1] + "total") - GM_getValue(pointTitle[1]);
        const need_times = Math.round(need_goals / 2)
        createToast("info", `还需获得的分数：${need_goals}<br>预计阅读的篇数：${need_times}`, 0);
        createToast("info", "获取新闻列表", 2);
        const news_array = await getUrl(0);
        GM_setValue("reading", true);
        var tab, i;
        for (i = GM_getValue("news_num"); i < need_times; i++) {
            GM_setValue("news_num", i);
            createToast("info", `前往第 ${i + 1} 篇`, 0);
            tab = GM_openInTab(news_array[i].url, {active: true});
            while (tab.closed == false) {
                await justWait(5000, 10000);
            }
        }
        while (true) {
            currentGoals = await getToday();
            var read_goals = currentGoals.find(function(obj) {
                return obj.title === pointTitle[1];
            });
            if (read_goals.currentScore == read_goals.dayMaxScore) {
                break;
            } else {
                GM_setValue("news_num", i);
                createToast("info", `前往第 ${i + 1} 篇`, 0);
                tab = GM_openInTab(news_array[i].url, {active: true});
                while (tab.closed == false) {
                    await justWait(5000, 10000);
                }
                i++;
                if (i > 12) {
                    break;
                }
            }
        }
        GM_setValue("reading", false);
        GM_setValue("news_num", GM_getValue("news_num") + 1);
        $(".notifications > li").each(function() {
            removeToast($(this)[0]);
        });
        return resolve();
    });
}

async function news() {
    var countdown = random(80, 120);
    createToast("info", "开始阅读", 0);
    createToast("info", `阅读剩余时间：<br><span id="study-countdown" style="font-weight: bold;">${countdown}s</span>`, 0);
    var scrollHeight;
    for (; countdown >= 0; countdown--) {
        $("#study-countdown").text(`${countdown}s`);
        scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (countdown % 3 == 0 && random(0, 2) == 0) {
            $("html,body").animate({ scrollTop: scrollHeight + random(100, 300) }, 1000);
        }
        await justWait(1000,0, false);
    }
    createToast("info", "等待", 0);
    $("html,body").animate({ scrollTop: $("body")[0].scrollHeight }, 1000);
    await justWait(5000,10000);
    window.close();
}

function watch() {
    return new Promise(async function (resolve, reject) {
        console.log("观看视频...");
        createToast("info", "开始观看视频", 0);
        const need_goals = GM_getValue(pointTitle[2] + "total") - GM_getValue(pointTitle[2]);
        const need_times = Math.round(need_goals / 2);
        createToast("info", `还需获得的分数：${need_goals}<br>预计观看的个数：${need_times}`, 0);
        createToast("info", "获取视频列表", 2);
        const video_array = await getUrl(1);
        GM_setValue("watching", true);
        var tab, i;
        for (i = GM_getValue("video_num"); i < need_times; i++) {
            GM_setValue("video_num", i);
            createToast("info", `前往第 ${i + 1} 个`, 0);
            tab = GM_openInTab(video_array[i].url, {active: true});
            console.log(tab)
            while (tab.closed == false) {
                await justWait(5000, 10000);
            }
        }
        while (true) {
            currentGoals = await getToday();
            console.log(currentGoals)
            var watch_goals = currentGoals.find(function(obj) {
                return obj.title == pointTitle[2];
            });
            if (watch_goals.currentScore == watch_goals.dayMaxScore) {
                console.log(currentGoals.data.totalScore)
                break;
            } else {
                console.log("预计外");
                GM_setValue("video_num", i);
                createToast("info", `前往第 ${i + 1} 个`, 0);
                tab = GM_openInTab(video_array[i].url, {active: true});
                while (tab.closed == false) {
                    await justWait(5000, 10000);
                }
                i++;
                if (i > 12) {
                    break;
                }
            }
        }
        GM_setValue("watching", false);
        GM_setValue("video_num", GM_getValue("video_num") + 1);
        $(".notifications > li").each(function() {
            removeToast($(this)[0]);
        });
        return resolve();
    });
}

async function video() {
    $("html,body").animate({ scrollTop: random(334, 337) }, 1000);
    var start_time = Date.now();
    while (!$("video").length) {
        await justWait(500, 0);
    }
    var video = $("video")[0];
    if (!video.muted) {
        video.muted = true;
    }
    let retry = 0;
    while (video.paused) {
        console.log("尝试播放");
        if (retry == 0) {
            try {
                $("div.outter").click();
            } catch {}
            retry++;
        } else if (retry == 1) {
            try {
                $("div.prism-play-btn").click();
            } catch {}
            retry++;
        } else if (retry == 2) {
            try {
                video.play();
            } catch {}
            retry++;
        } else {
            break;
        }
        await justWait(1000,0);
    }
    video.addEventListener('pause', async function () {
        if (video.currentTime > video.duration - 1) {
            await justWait(10000, 15000);
            window.close();
        } else {
            createToast("info", "被暂停，继续播放", 2);
            let retry = 1;
            while (video.paused) {
                if (retry == 1) {
                    try {
                        $("div.prism-play-btn").click();
                    } catch {}
                    retry++;
                } else if (retry == 2) {
                    try {
                        video.play();
                    } catch {}
                    retry++;
                } else {
                    break;
                }
                await justWait(1000,0);
            }
        }
    });
    var countdown = random(200, 230);
    createToast("info", "开始观看", 0);
    createToast("info", `观看剩余时间：<br><span id="study-countdown" style="font-weight: bold;">${countdown}s</span>`, 0);
    for (; countdown >= 0; countdown--) {
        $("#study-countdown").text(`${countdown}s`);
        await justWait(1000,0, false);
    }
    createToast("info", "等待", 0);
    if (video.duration - video.currentTime > 15) {
        video.currentTime = video.duration - 12;
    }
}

function exam() {
    return new Promise(async function (resolve, reject) {
        console.log("前往答题...");
        createToast("info", "开始答题", 0);
        GM_setValue("examing", true);
        var tab = GM_openInTab("https://pc.xuexi.cn/points/exam-practice.html", {active: true});
        console.log(tab);
        while (tab.closed == false) {
            await justWait(5000, 10000);
        }
        GM_setValue("examing", false);
        GM_setValue("video_num", GM_getValue("video_num") + 1);
        $(".notifications > li").each(function() {
            removeToast($(this)[0]);
        });
        return resolve();
    });
}

async function examination() {
    var observer = new MutationObserver(callback);
    var config = { characterData: true, subtree: true, childList: true };
    while (true) {
        try {
            observer.observe($("div.action-row")[0], config);
            break;
        } catch(e) {}
        await justWait(500, 0);
    }
    currentExam = $("div.pager > span.big").text();
    doExam();
}

async function callback(mutationList, observer) {
    //while (empty($("div.pager > span.big").text())) {
    //    await justWait(200, 0, false);
    //}
    console.log(currentExam)
    if (currentExam == "5") {
        if ($(".nc-lang-cnt").filter(function () {
            return this.innerHTML === "请按住滑块，拖动到最右边";
        }).length) {
            createToast("warning", "请完成手动验证", 0);
        }
        while (!$(".ant-tooltip-inner").length) {
            await justWait(1000, 0);
        }
        await justWait(1000, 2000);
        window.close();
    }
    if ($("div.pager > span.big").text() == currentExam) {
        return;
    }
    currentExam = $("div.pager > span.big").text();
    doExam();
}

function error_callback(mutationList, observer) {
    doExam();
}

async function doExam() {
    $(".notifications > li").each(function() {
        removeToast($(this)[0]);
    });
    if ($("div.explain").length) {
        //出现答案解析，说明答错了，退出重做
        $("a[href*=\"exam-index.html\"]").click();
        await justWait(500, 1000);
        $(".ant-modal-confirm-btns button.ant-btn").click();
        return;
    }
    await justWait(800, 1500);
    $("html,body").animate({ scrollTop: 450 }, 1000);
    await justWait(3000, 5000);
    var type = $("div.q-header").html().match(/多选题|单选题|填空题/)[0];
    createToast("info", type, 0);
    var result;
    if (type == "单选题") {
        result = await examSingleChoice();
    } else if (type == "多选题") {
        result = await examMultipleChoice();
    } else if (type == "填空题") {
        result = await examFillBlanks();
    }
    if (!result) {
        examError();
        return;
    }
    let check_button = $("button.ant-btn")[0];
    let check_button_location = check_button.getBoundingClientRect();
    if (check_button_location.y > window.innerHeight - check_button_location.height) {
        console.log("确认按钮不在视窗内");
        $("html,body").animate({ scrollTop: document.documentElement.scrollTop + check_button_location.y - window.innerHeight + 2 * check_button_location.height }, 1000);
    }
    createToast("success", `作答完毕，下一题`, 0);
    await justWait(2000,3000);
    check_button.click();
    await justWait(3000,0);
    if ($(".nc-lang-cnt").filter(function () {
        return this.innerHTML === "请按住滑块，拖动到最右边";
    }).length) {
        createToast("warning", "请完成手动验证", 0);
    }
}

function examSingleChoice() {
    return new Promise(async function (resolve, reject) {
        $("span.tips").click();
        await justWait(800, 1500, false);
        if (!$("font").length) {
            return resolve(false);
        }
        var option, tips, result;
        if ($("font").length == 1) {
            tips = $("font").text();
            createToast("info", `答案：${tips}`, 0);
            $("span.tips").click();
            await justWait(800, 1500,false);
            $("div.q-answer").each(function() {
                option = $(this).text().replace(/[A-Z]\.\s+/,"");
                if (option == tips) {
                    $(this).click();
                    return resolve(true);
                }
            });
            $("div.q-answer").each(function() {
                option = $(this).text().replace(/[A-Z]\.\s+/,"");
                if (option.indexOf(tips) != -1 || tips.indexOf(option) != -1) {
                    $(this).click();
                    return resolve(true);
                }
            });
        } else {
            tips = [];
            $("font").each(function() {
                tips.push($(this).text());
            });
            $("span.tips").click();
            await justWait(800, 1500, false);
            $("div.q-answer").each(function() {
                option = $(this).text().split(/[\s-]/);
                result = true;
                for (let j = 1; j < option.length; j++) {
                    if (tips[j-1].indexOf(option[j]) == -1 && option[j].indexOf(tips[j-1]) == -1) {
                        result = false;
                        break;
                    }
                }
                if (result) {
                    $(this).click();
                    return resolve(true);
                }
            });
            return resolve(false);
        }
    });
}

function examMultipleChoice() {
    return new Promise(async function (resolve, reject) {
        $("span.tips").click();
        await justWait(800, 1500,false);
        var options = $("div.q-answer"), option, tips;
        if ($("div.q-body > div").text().match(/（）/g).length == options.length) {
            createToast("info", `答案：全选`, 0);
            $("span.tips").click();
            await justWait(800, 1500,false);
            for (let i = 0; i < options.length; i++) {
                options[i].click();
                await justWait(300,500,false);
            }
            return resolve(true);
        }
        tips = [];
        let message = `答案：<br>`
        $("font").each(function() {
            tips.push($(this).text());
            message += `• ${$(this).text()}<br>`;
        });
        $("span.tips").click();
        await justWait(800, 1500,false);
        createToast("info", message, 0);
        for (let i = 0; i < options.length; i++) {
            option = options[i].text().replace(/[A-Z]\.\s+/,"");
            for (let j = 0; j < tips.length; j++) {
                if (tips[j].indexOf(option) != -1 || option.indexOf(tips[j]) != -1) {
                    options[i].click();
                    await justWait(300,500,false);
                }
            }
        }
        return resolve(true);
    });
}

function examFillBlanks() {
    return new Promise(async function (resolve, reject) {
        $("span.tips").click();
        await justWait(800, 1500, false);
        if (!$("font").length) {
            return resolve(false);
        }
        var tips = $("font").text();
        createToast("info", `答案：${tips}`, 0);
        $("span.tips").click();
        await justWait(800, 1500, false);
        var event = new Event('input', { bubbles: true });
        document.querySelector("input.blank").setAttribute("value", tips);
        document.querySelector("input.blank").dispatchEvent(event);
        return resolve(true);
    });
}

async function examError() {
    $("a[href*=\"exam-index.html\"]").click();
    await justWait(500, 1000);
    $(".ant-modal-confirm-btns > button.ant-btn")[0].click();
    return;
}




