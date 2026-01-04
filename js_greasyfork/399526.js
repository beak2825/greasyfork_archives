// ==UserScript==
// @name         浙江网校刷课助手
// @namespace    www.hsmyldk.top
// @version      0.3
// @description  自动播放，有文档自动点击完成,自动倍速播放(这个需要在不开脚本情况下可以倍速才可以用)
// @author       浑水摸鱼ldk
// @match        *.zjooc.cn/ucenter/student/course/study/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399526/%E6%B5%99%E6%B1%9F%E7%BD%91%E6%A0%A1%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/399526/%E6%B5%99%E6%B1%9F%E7%BD%91%E6%A0%A1%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


var TIME = 5000; //5秒后开始脚本，主要是为了等网页加载完,打开网页第一次运行会等10秒
var kaiqibeisu = 0; //这个是0则自动倍速播放，为1则关闭倍速
var beisu = 0; //选项为0是4倍速，为1是2倍速，为2是1.5倍速，为3是1.25倍速，
setTimeout(function() {
    findWord();
}, TIME);
//检测当前页是不是文档
function findWord() {
    var word = document.getElementsByClassName('contain-item cleartop');
    //如果这一章有文档
    if (word.length > 0) {
        for (var p = 0; p < word.length; p++) {
            //当前页是文档
            if (word[p].parentElement.parentElement.style.display != 'none') {
                word[p].children[1].children[0].click(); //点击确定
                //等待5秒下一个
                setTimeout(function() {
                    next();
                }, TIME);
                break;
            } else {
                //当前页是视频
                if (p == (word.length - 1)) {
                    playideo();
                    break;
                }
            }
        }
    } else {
        //没有文档
        playideo();
    }
}
//播放视频
function playideo() {
    setTimeout(function() {
        var videoplyer = document.getElementById('video-show');
        // 没找到视频播放器
        if (videoplyer == null) {
            //重新搜寻
            setTimeout(() => {
                findWord();
            }, TIME);
        } else {
            //静音播放
            try {

                videoplyer.firstChild.children[2].children[18].click();
                videoplyer.firstChild.children[2].children[0].click();
            } catch {
                console.log('页面没加载出来，可能是网速不好。。');
            }
            try {
                if (kaiqibeisu == 0)
                    videoplyer.firstChild.children[8].children[beisu].click();
            } catch {
                console.log("倍速失败。。");
            }
            //探测视频啥时候播放完
            playEnded();
        }
    }, TIME)
}
// 下一页
function next() {
    var nowSmile = document.getElementsByClassName('el-tabs__item is-top is-active')[1];
    var border = nowSmile.parentElement.children;
    for (var i = 0; i < border.length; i++) {
        if (border[i].id == nowSmile.id) {
            if ((i + 1) == border.length) {
                //播放下一大节
                var nowBig = document.getElementsByClassName('el-container plan-detail ucenter-student is-vertical')[0].children[0].children[1].children[1];
                var AllBig = document.getElementsByClassName('el-menu-item');
                for (var o = 3; o < AllBig.length; o++) {
                    if (AllBig[o].children[0].textContent === nowBig.textContent) {
                        AllBig[(o + 1)].click();
                        setTimeout(function() {
                            findWord();
                        }, TIME);
                        break;
                    }
                }
            } else {
                //播放下一小节
                border[(i + 1)].click();
                setTimeout(function() {
                    findWord();
                }, TIME);
                break;
            }
        }
    }
}
//检测是否播放完成
function playEnded() {
    var timeBar = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    var nowBar = 0;
    var play = setInterval(() => {
        var videoplyer = document.getElementById('video-show');
        if (videoplyer == null) {
            setTimeout(function() {
                findWord();
            }, TIME);
            clearInterval(play);
            return;
        }
        var Arr = videoplyer.firstChild.children[2].children[7].textContent.split(' / ')
        if (timeBar[nowBar] == Arr[0]) {
            clearInterval(play);
            playideo();
            return;
        } else {
            timeBar[nowBar] = Arr[0];
            if (nowBar < 7) {
                nowBar++;
            } else {
                nowBar = 0;
            }
        }
        if (videoplyer.firstChild.children[2].children[18].style.display != null) {
            videoplyer.firstChild.children[2].children[18].click();
        }
        if ((Arr[0] == Arr[1]) && (Arr[0] != "00:00")) {
            clearInterval(play);
            next();
        }
    }, 250);
}