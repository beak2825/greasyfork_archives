// ==UserScript==
// @name         湖南人才市场公共教育网（辅助脚本）
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  私人定制，仅凭链接访问!
// @author       xiguayaodade
// @license      MIT
// @match        https://www.hnpxw.org/studyDetail*
// @match        https://www.hnpxw.org/userStudy
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant        GM_setValue
// @grant        GM_getValue
// @homepage     http://8.130.116.135/?article/
// @source       http://8.130.116.135/?article/
// @icon         https://www.hnpxw.org/favicon.ico
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/471416/%E6%B9%96%E5%8D%97%E4%BA%BA%E6%89%8D%E5%B8%82%E5%9C%BA%E5%85%AC%E5%85%B1%E6%95%99%E8%82%B2%E7%BD%91%EF%BC%88%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/471416/%E6%B9%96%E5%8D%97%E4%BA%BA%E6%89%8D%E5%B8%82%E5%9C%BA%E5%85%AC%E5%85%B1%E6%95%99%E8%82%B2%E7%BD%91%EF%BC%88%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';


    console.log("辅助程序开始执行");


    //存储章节列表长度
    var chapterList = 0;
    //记录列表截断阈值
    var truncation = 0;
    //存储当前检测成绩索引值
    var scoreIndex = 6;
    //记录当前章节
    var chapterId = 1;
    //公需课总数
    var gxCount = 0;
    //公需课当前索引
    var gxIndex = 1;
    //专业课总数
    var zyCount = 0;
    //专业课当前索引
    var zyIndex = 1;

    var timerChapter = function(){
         window.location.reload();
         console.log("公需课数量："+ gxCount);
         if(gxIndex <= gxCount){
             document.getElementsByClassName("margin-top-xs el-tabs el-tabs--top")[0].getElementsByClassName("el-tabs__content")[0].getElementsByTagName("div")[0].getElementsByClassName("study-list-card")[gxIndex-1].getElementsByClassName("margin-top-sm study-list-precent flex align-center")[0].getElementsByTagName("p")[0] == null
             if(parseInt(document.getElementsByClassName("study-list-card")[gxIndex-1].getElementsByClassName("margin-top-sm study-list-precent flex align-center")[0].innerText.substring(2,4)) < 90){
                 console.log("公需课第"+gxIndex+"科未完成。即将进入学习...");
                 setTimeout(function(){
                     document.getElementsByClassName("margin-top-xs el-tabs el-tabs--top")[0].getElementsByClassName("el-tabs__content")[0].getElementsByTagName("div")[0].getElementsByClassName("study-list-card")[gxIndex-1].getElementsByClassName("enter-btn")[0].click();
                     setTimeout(function(){
                         window.location.reload();
                     },1000);
                 },1000);
             }else{
                 var gxText = document.getElementsByClassName("margin-top-xs el-tabs el-tabs--top")[0].getElementsByClassName("el-tabs__content")[0].getElementsByTagName("div")[0].getElementsByClassName("study-list-card")[gxIndex-1].getElementsByClassName("margin-top-sm study-list-precent flex align-center")[0].getElementsByTagName("p")[0].innerText;
                 if(gxText.substring(0,4) === "您已学完" || gxText != null){
                     console.log("公需课第"+gxIndex+"科完成。检索下一科...");
                     gxIndex++;
                     timerChapter();
                 }else{
                     console.log("公需课第"+gxIndex+"科未完成。即将进入学习...");
                     setTimeout(function(){
                         document.getElementsByClassName("margin-top-xs el-tabs el-tabs--top")[0].getElementsByClassName("el-tabs__content")[0].getElementsByTagName("div")[0].getElementsByClassName("study-list-card")[gxIndex-1].getElementsByClassName("enter-btn")[0].click();
                         setTimeout(function(){
                             window.location.reload();
                         },1000);
                     },1000);
                 }
             }
         }else{
            console.log("公需课检索完毕，继续检索专业课...");
            document.getElementById("tab-third").click();
            setTimeout(function(){
                zyCount = document.getElementsByClassName("margin-top-xs el-tabs el-tabs--top")[0].getElementsByClassName("el-tabs__content")[0].getElementsByTagName("div")[260].getElementsByClassName("study-list-item flex").length;
                console.log("专业课数量："+ zyCount);
                if(zyIndex <= zyCount){
                    var zyText = document.getElementsByClassName("margin-top-xs el-tabs el-tabs--top")[0].getElementsByClassName("el-tabs__content")[0].getElementsByTagName("div")[260].getElementsByClassName("study-list-item flex")[zyIndex-1].getElementsByClassName("margin-top-sm study-list-precent flex align-center")[0].getElementsByTagName("div")[0].innerText;
                    if(zyText.substring(2,3) > 8){
                        console.log("专业课第"+zyIndex+"科完成。检索下一科...");
                        zyIndex++;
                        timerChapter();
                    }else{
                        console.log("专业课第"+zyIndex+"科未完成。即将进入学习...");
                        setTimeout(function(){
                            document.getElementsByClassName("margin-top-xs el-tabs el-tabs--top")[0].getElementsByClassName("el-tabs__content")[0].getElementsByTagName("div")[260].getElementsByClassName("study-list-item flex")[zyIndex-1].getElementsByClassName("enter-btn")[0].click();
                            setTimeout(function(){
                                window.location.reload();
                            },1000);
                        },1000);
                    }
                }else{
                    console.log("所有课程已完成，退出！");
                }
            },1000);
         }
    }

    var timer = function(){
        chapterList = document.getElementsByClassName("el-table__row").length;
        truncation = document.getElementsByClassName("cell").length;
        if(chapterId <= chapterList && scoreIndex <= truncation){
            var score = parseInt(document.getElementsByClassName("cell")[scoreIndex].innerText);
            if(score >= 70){
                console.log("第"+chapterId+"章"+score+"分！检测下一章。");
                scoreIndex+=5;
                chapterId+=1;
                timer();
            }else{
                console.log("第"+chapterId+"章"+score+"分，需重刷。");
                setTimeout(function(){
                    document.getElementsByClassName("cell")[scoreIndex+3].getElementsByTagName("button")[0].click();
                },2000)
            }
        }else{
            console.log("当前科目完成，退出！");
            document.getElementsByClassName("app-head")[0].getElementsByClassName("el-menu-item is-active")[0].click();
            clearInterval(timer);
            setTimeout(function(){
                window.location.reload();
            },1500);
        }
    }

   var timer2 = setTimeout(function(){
        if(window.location.href === 'https://www.hnpxw.org/userStudy'){
            console.log("当前在：https://www.hnpxw.org/userStudy");
            console.log("检索未完成课程");
            gxCount = document.getElementsByClassName("margin-top-xs el-tabs el-tabs--top")[0].getElementsByClassName("el-tabs__content")[0].getElementsByTagName("div")[0].getElementsByClassName("study-list-card").length;
            timerChapter();
        }else if(window.location.href.substring(0,33) === 'https://www.hnpxw.org/studyDetail'){
            console.log("当前在：https://www.hnpxw.org/studyDetail");
            timer();
        }
    },5000);
})();