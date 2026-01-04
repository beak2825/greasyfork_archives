// ==UserScript==
// @name         zt防360广告
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  防辣鸡360的广告
// @author       freeman99sd
// require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @match        https://*.xuexi.cn/
// @match        https://xuexi.cn
// @match        https://xuexi.cn/index.html
// @match        https://www.xuexi.cn/index.html
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
// @downloadURL https://update.greasyfork.org/scripts/421704/zt%E9%98%B2360%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/421704/zt%E9%98%B2360%E5%B9%BF%E5%91%8A.meta.js
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
    ////console.log(articles)

    var date = datev .getFullYear() + "/" + datev .getMonth() + "/" + datev .getDate();
    var examData = GMgetValue(date, {weeklyExamDone:false, zhuanxiangExamDone:false})
    var settings = GMgetValue("Settings");


    if (!settings) {
        msg = "请通过左边按钮设定自动学习项目，默认为全部自动学习！！";
        settings={
                    daily: { value: true, name: "每日答题" },
                    weekly: { value: true, name: "每周答题" },
                    zhuanxiang: { value: true, name: "专项答题" },
                }
    } else {
        msg = "如需修改自动学习项目，请通过左边按钮修改！！";
    }

    if (debug) {
        //console.log(settings);
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
        //console.log("openDailyExam() start")
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
                        //console.log('DailyExam closed');
                    //}
                }
            },10000);
        }
        //console.log("openDailyExam() end")
    }

    async function openWeeklyExam() {
        //console.log("openWeeklyExam() start")
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
                    //console.log('WeeklyExam closed');
                }
            },10000);

        }
        //console.log("openWeeklyExam() end")
    }

    async function openZhuanxiangExam() {
        //console.log("openZhuanxiangExam() start")
        var scores = await getScores();

        if (scores.zhuanxiang.dayScore === 0) {
            var win = window.open("https://pc.xuexi.cn/points/exam-paper-list.html");

            var timer = setInterval(function() {
                if(win.closed) {
                    location.reload();
                    clearInterval(timer);
                    //console.log('ZhuanxiangExam closed');
                }
            },10000);
        }
        //console.log("openZhuanxiangExam() end")
    }



    if (window.location.href === "https://pc.xuexi.cn/points/exam-practice.html") {
        //doDailyExam();
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
        //doWeeklyExam();
    } else if (window.location.href.startsWith("https://pc.xuexi.cn/points/exam-paper-detail.html")) {
        //doZhuanXiangExam();
    } else if (window.location.href.startsWith("https://pc.xuexi.cn/points/my-points.html")) {
        /*$(document).ready(async function() {

            await parseScoreDocument();
            window.close();
        })*/

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
                //console.log(login);
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
                //alert("请先登录学习强国，然后才能自动学习！！\n" + msg);
            }

            if (logined != null && logined != undefined) {
                /*var win = window.open("https://pc.xuexi.cn/points/my-points.html");
                var timer = setInterval(function() {
                    if(win.closed) {
                        //doStudy();
                        clearInterval(timer);
                        //console.log('score page closed');
                    }
                },10000);*/

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






    function sleep(ms) {
        ////console.log(timers)
        timers.map(timer => {clearTimeout(timer)})
        timers = []
        return new Promise((resolve) => {
            var timer = setTimeout(resolve, ms)
            ////console.log(timers)
            });
    }


    async function getScores() {
        //console.log("getScores() start")
        var scores = GMgetValue("scores", {})
         if (debug) {
        //console.log(scores);
         }
        //console.log("getScores() end")
        return scores;
    }


    /*function getTotalScore() {
        var scores = GMgetValue("scores", {})
        return scores;
    }*/


    function getDayScore() {
        //console.log("getDayScore() start")
        var scores = GMgetValue("scores", {})
        //console.log("getDayScore() end")
        return scores;
    }

    async function  parseScoreDocument() {
//console.log("parseScoreDocument() start")
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
            //console.log(length)
            }
            await sleep(5000)
            retryNum--;
        }

        /*for (var i = 0; i < length; i++) {
            //console.log($(cards[i]).text());
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
        //console.log(scores)
        }
        //console.log("parseScoreDocument() end")

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

    /*let crackApp = document.createElement("div");
    crackApp.id = "crackVIPSet";
    document.body.appendChild(crackApp);*/

    new Vue({
        el: "#crackVIPSet",
        render: h => h(comMain)
    });

})();

