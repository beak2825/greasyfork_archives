// ==UserScript==
// @name         USTC中国科大网上党校
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  USTC网上党校
// @author       haowanji
// @match        *://wsdx.ustc.edu.cn/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/437237/USTC%E4%B8%AD%E5%9B%BD%E7%A7%91%E5%A4%A7%E7%BD%91%E4%B8%8A%E5%85%9A%E6%A0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/437237/USTC%E4%B8%AD%E5%9B%BD%E7%A7%91%E5%A4%A7%E7%BD%91%E4%B8%8A%E5%85%9A%E6%A0%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('It\'s runing Now');
    var i = 0;
    var j = 0;
    var colors = "red";
    var time = getTimes();
    var pa = document.createElement('p');
    var n = 130;//最大等待响应时长：n*3s
    var k = 0;
    var a=0;
    var url=window.location.href;
    if (url == "http://wsdx.ustc.edu.cn/login/#/guide") {
        console.log("登录");
        document.getElementsByClassName("guide_item")[0].children[0].click();
        document.getElementsByClassName("bottom-box")[0].children[2].click();
        //window.location.href = "http://wsdx.ustc.edu.cn/user/lesson";
    }
    //url=window.location.href;
    if(url=="http://wsdx.ustc.edu.cn/user/account/info"){
        window.location.href = "http://wsdx.ustc.edu.cn/user/lesson";
    }
    if (url == "http://wsdx.ustc.edu.cn/user/lesson") {
        console.log("在主界面");
        for (a; a < 10; a++) {
            console.log("进入循环");
            if (document.getElementsByClassName("study_plan2")[a].children[2].children[2].style.color == "red") {
                console.log(a);
                document.getElementsByClassName("study_plan2")[a].children[2].children[1].children[0].click();
                break;
            }
        }
    }
    if(url.slice(0,33)=="http://wsdx.ustc.edu.cn/ybdy/play"){
        console.log("在课程界面");
        console.log('开始工作');
        document.getElementsByClassName("video_cont")[0].appendChild(pa);
        var tm = setInterval(function () {
            //console.log("进入循环");
            if (document.getElementsByClassName("video_head").length == 0 && document.getElementsByClassName("video_cont").length == 0) {
            console.log("视频出错，即将刷新");
            location.reload();
        }
            else {
            if (document.getElementsByClassName("video_red1")[0].children[0].style.color == colors) {//如果当前已经看完
                console.log("当前视频已看完，将点击下一视频");
                if (document.getElementsByClassName("video_red1")[0].nextSibling.nextSibling === null) {
                    window.clearInterval(time);
                    console.log('当前课程没有需要学习的内容了！');
                    window.location.href = "http://wsdx.ustc.edu.cn/user/lesson";
                }
                else {
                    document.getElementsByClassName("video_red1")[0].nextSibling.nextSibling.children[0].click();//点击下一视频
                }
            }
            else {
                //进行弹窗点击操作
                //console.log(document.getElementsByClassName("public_submit")[0]);
                if (document.getElementsByClassName("public_cancel")[0] === undefined) {
                    if (document.getElementsByClassName("public_submit")[0] === undefined) {
                        i = i + 1;
                        showInfo('共点击' + j + '次弹窗！预计下次弹窗' + (i / n * 100).toFixed(2) + '%。已过' + (i * time / 60 / 1000).toFixed(2) + '分钟');
                        if (document.getElementsByClassName("plyr__controls__item plyr__control plyr__control--pressed")[0] === undefined) {
                            k+=1;
                           if(k>2){
                                document.getElementsByClassName("plyr__control plyr__control--overlaid")[0].click();
                            }
                        }
                        else {
                            k=0;

                            /*
                            if (k >= n / 10 - 5) {
                                showInfo('视频暂停中，将在' + ((n / 10 - k) * time / 60 / 1000).toFixed(2) + '分钟后刷新');
                            }
                            if (k >= n / 10) {
                                showInfo('视频暂停中,可能已播完，刷新');
                                location.reload();
                            }
                            */
                        }
                    }
                    else {
                        document.getElementsByClassName("public_submit")[0].click();
                        i = 0;
                        j = j + 1;
                        showInfo('第' + j + '次点击弹窗！开始学习');
                    }
                }
                else {
                    document.getElementsByClassName("public_cancel")[0].click();
                    i = 0;
                    j = j + 1;
                    showInfo('第' + j + '次点击弹窗！继续学习');
                }
            }
        }

        //alert(document.getElementsByClassName("public_submit")[1]);
    }, time);
    }
})();

function getTimes() {
    var times = Math.random() * 8 + 1;//1-9
    times = 3 * 1000 * 1;//+times*10
    return times
}

function showInfo(str) {
    console.log(str);
    document.getElementsByClassName("video_cont")[0].children[2].innerText = str;
}