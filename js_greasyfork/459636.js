// ==UserScript==
// @name         niunep网课 自动切换课程 不暂停
// @namespace    https://greasyfork.org/
// @version      0.3.5
// @description  https://www.niunep.com/的网课定时切换课程 不暂停
// @author       test
// @match        *.niunep.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459636/niunep%E7%BD%91%E8%AF%BE%20%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E8%AF%BE%E7%A8%8B%20%E4%B8%8D%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/459636/niunep%E7%BD%91%E8%AF%BE%20%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E8%AF%BE%E7%A8%8B%20%E4%B8%8D%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

//判断网页中视频是否学习完成
(function () {
    'use strict';
    if (window.location.href.includes('study/course/')) {
        console.log('课程学习页面');
        var timer_wk = setInterval(function () {
            if (document.querySelector("#content > div:nth-child(1) > div.content.drizzle-content > div > div.top.new-course-top > div > div > div.player-content.relative.new-play-content > div.anew-study-wrapper > div > div > div > div.anew-top > div.inline-block > div.anew-text") != null) {
                if (document.querySelector("#content > div:nth-child(1) > div.content.drizzle-content > div > div.top.new-course-top > div > div > div.player-content.relative.new-play-content > div.anew-study-wrapper > div > div > div > div.anew-top > div.inline-block > div.anew-text").textContent == '您已完成该课程的学习') {
                    console.log('关闭当前页面');
                    //GM_setValue("niunepniunepniunep1122niunep", "finish");
                    setCookie("niunepniunepniunep1122niunep", "finish", 7);
                    window.opener = null; window.open('', '_self'); window.close();
                }
            }
            if (getCookie("niunepniunepniunep1122niunep") == "termi") {
                setCookie("niunepniunepniunep1122niunep", "", 0);
                window.opener = null; window.open('', '_self'); window.close();
            }
        }, 10000);
    }
})();

function findStartLearn() {
    var bts = document.getElementsByClassName('item current-hover');
    var startLearn = [];
    for (var i = 0; i < bts.length; i++) {
        if (bts[i].attributes['data-section-type'].value == '10') {
            if (bts[i].children[2].children[2].children[0].textContent == '开始学习' || bts[i].children[2].children[2].children[0].textContent == '继续学习') {
                startLearn.push(bts[i]);
            }
        }
    }
    return startLearn;
}

function insertButton() {
    var d = document.createElement('div');
    d.setAttribute('type', 'text/css');
    d.innerHTML = '  ';
    document.getElementsByTagName('body')[0].appendChild(d);
    d.style.display = "flex"
    var timeT = document.createElement('div');
    var stateT = document.createElement('div');
    var testT = document.createElement('div');
    var startBut = document.createElement('button');
    d.appendChild(timeT);
    d.appendChild(stateT);
    d.appendChild(testT);
    d.appendChild(startBut);
    startBut.textContent = "开始刷";
    var learnlist = findStartLearn();
    var learnlistid = [];
    for (var i = 0; i < learnlist.length; i++) {
        learnlistid.push(learnlist[i].attributes["id"].value);
    }
    stateT.textContent = '找到了' + learnlist.length + '个学习条目' + '点击右侧按钮将每100分钟或播放完成自动点击下一条视频';
    var inglearnNum = 0;
    startBut.addEventListener('click', function () {
        this.disabled = true;
        learnlist = findStartLearn();
        //learnlist[inglearnNum].click();
        document.querySelector('#' + learnlistid[inglearnNum]).click();
        inglearnNum++;
        stateT.textContent = '<------正在的等待  ' + learnlist[inglearnNum - 1].children[1].children[0].textContent + ' ' + inglearnNum + '/' + learnlist.length + ' 完成。'
        var timett = 100 * 60;
        var lasTime = parseInt(Date.parse(new Date()) / 1000);
        // ==/UserScript==     每次上网课的时间
        var timer_sec = setInterval(function () {
            var someKey = getCookie("niunepniunepniunep1122niunep");//GM_getValue("niunepniunepniunep1122niunep", null);
            if (((parseInt(Date.parse(new Date()) / 1000) - lasTime) > timett) || (someKey == "finish")) {
                //GM_setValue("niunepniunepniunep1122niunep", "0");
                setCookie("niunepniunepniunep1122niunep", "", 0);
                //learnlist[inglearnNum].click();
                document.querySelector('#' + learnlistid[inglearnNum]).click();
                inglearnNum++;
                stateT.textContent = '<--剩余时间..  正在的等待第' + inglearnNum + learnlist[inglearnNum - 1].children[1].children[0].textContent + '  完成。'
                lasTime = parseInt(Date.parse(new Date()) / 1000);
            }
            timeT.innerHTML = 's' + (timett - (parseInt(Date.parse(new Date()) / 1000) - lasTime)) + 's';

            if (inglearnNum == learnlist.length) {
                clearInterval(interval);
                stateT.textContent = '学习完毕';
            }
        }, 2000);
    })
}

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
    setTimeout(() => insertButton(), 3000);
} else {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(() => insertButton(), 3000) });
}


(function () {
    'use strict';
    //判断网页中视频是否暂停，如果已经暂停，就重新播放
    var timer_wk = setInterval(function () {
        if (
            document.getElementsByClassName(
                "vjs-play-control vjs-control vjs-button vjs-paused"
            ).length == 1
        ) {
            document
                .getElementsByClassName(
                    "vjs-play-control vjs-control vjs-button vjs-paused"
                )[0]
                .click();
        }
        //判断网页中是否出现了暂停学习的警告，如果有警告就关闭
        if (document.getElementsByClassName("alert-wrapper").lenght > 0) {
            if (document.getElementsByClassName("alert-wrapper")[0].children[2] != 0) {
                document.getElementsByClassName("alert-wrapper")[0].children[2].click();
            }
        }
    }, 15123);
})();

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
