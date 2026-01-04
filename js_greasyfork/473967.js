// ==UserScript==
// @name         湖南人才市场公共教育网(专业课课堂练习专用)
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  脚本监控面板，自动播放、防挂机、课堂练习、微课、PPt...
// @author       Xiguayaodade
// @license      MIT
// @match        https://www.hnpxw.org/studyDetail*
// @match        https://www.hnpxw.org/userStudy
// @match        *://hnpxw.org/studyDetail*
// @match        *://hnpxw.org/userStudy
// @match        *://ua.peixunyun.cn/*
// @grant        GM_info
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @namespace    http://tampermonkey.net/
// @homepage     http://8.130.116.135/?article/
// @source       http://8.130.116.135/?article/
// @icon         https://picx.zhimg.com/v2-ce62b58ab2c7dc67d6cabc3508db5795_l.jpg?source=32738c0c
// @connect      icodef.com
// @connect      localhost
// @require      https://update.greasyfork.org/scripts/499395/1403559/jquery_360%E2%80%94%E2%80%94copy.js
// @downloadURL https://update.greasyfork.org/scripts/473967/%E6%B9%96%E5%8D%97%E4%BA%BA%E6%89%8D%E5%B8%82%E5%9C%BA%E5%85%AC%E5%85%B1%E6%95%99%E8%82%B2%E7%BD%91%28%E4%B8%93%E4%B8%9A%E8%AF%BE%E8%AF%BE%E5%A0%82%E7%BB%83%E4%B9%A0%E4%B8%93%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/473967/%E6%B9%96%E5%8D%97%E4%BA%BA%E6%89%8D%E5%B8%82%E5%9C%BA%E5%85%AC%E5%85%B1%E6%95%99%E8%82%B2%E7%BD%91%28%E4%B8%93%E4%B8%9A%E8%AF%BE%E8%AF%BE%E5%A0%82%E7%BB%83%E4%B9%A0%E4%B8%93%E7%94%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */


    var speedonoff = false;
    var speedIn = null;
    var ddds3 = null;
    var addMessage = null;

    let btn1=GM_registerMenuCommand ("\u4f5c\u8005\uff1a\ud83c\udf49\u897f\u74dc\u8981\u5927\u7684\ud83c\udf49", function(){
        confirm("Hello,\u611f\u8c22\u4f7f\u7528\ud83c\udf49\u897f\u74dc\u5237\u8bfe\u52a9\u624b\ud83c\udf49\uff01\u591a\u591a\u53cd\u9988\u54e6");
        GM_unregisterMenuCommand(btn1);
    }, "");
    let btn2=GM_registerMenuCommand ("\u4ed8\u8d39\u5185\u5bb9", function(){
        alert("\u9650\u65f6\u514d\u8d39\uff0c\u5168\u529b\u5f00\u53d1\u4e2d...");
    }, "p");


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


    //存储当前章节的小节数量
    var sectionCount = 0;
    //存储当前处于第几小节,默认第一节
    var sectionId = 1;
    //存储当前小节视频加习题总数
    var sectionAndVd = 0;
    //存储当前习题小题数量
    var questionCount = 0;
    //提交按钮
    var ind = 1;


    //进入下一节全局方法
    var sectionNext = null;
    //检索未满百分习题全局方法
    var search = null;
    //开始答题全局方法
    var answer = null;
    //每小节的单元索引
    var unitIndex =1;

    //单元微课索引
    var miniVds = 0;
    //微课类型多视频索引
    var progressIndex = 1;
    //存放视频组件索引
    var vdIndex = 0;
    //微课播放按钮索引
    var miniBtn = 0;

    //存放视频id
    var vd;

    //存放播放器组件
    var elevideo;

    //----解决重复监听start----
    //视频开始的公共方法
    var vdplay = null;
    //视频正在播放的公共方法
    var vdplaying = null;
    //视频暂停的公共方法
    var vdpause = null;
    //视频结束的公共方法
    var vdended = null;
    //----解决重复监听end----

    //-----添加监听start------
    var addLisenner = function(){

        //获取视频id
        try{
            vd = document.getElementsByTagName("video")[vdIndex].id;
        }catch(e){
            addMessage("视频加载中...");
            setTimeout(addLisenner,1000);
            return;
        }
        //获取播放器组件
        elevideo = document.getElementById(vd);

        vdplay = function(){
            let tm = 5 * 60 * 1000;
            console.log("xigua:\u5f00\u59cb\u64ad\u653e");
            addMessage("xigua:\u5f00\u59cb\u64ad\u653e");
            speedIn = setInterval(function(){
                speedff();
            },tm);
        };
        vdplaying = function(){
            console.log("xigua:\u6b63\u5728\u64ad\u653e");
            addMessage("xigua:\u6b63\u5728\u64ad\u653e");
        };
        vdpause = function(){
            clearInterval(speedIn);
            console.log("xigua:\u6682\u505c\u64ad\u653e");
            addMessage("xigua:\u6682\u505c\u64ad\u653e");
            setTimeout(function(){
                if(document.getElementsByClassName("btn-submit").length >= 1){
                    if(document.getElementsByClassName("btn-submit")[0].innerText === '提交'){
                        setTimeout(function(){
                            classRoomAnswer();
                        },1500);
                    }
                    if(document.getElementsByClassName("btn-submit")[0].innerText === '继续学习'){
                        setTimeout(function (){
                            console.log("\u7b49\u5f85\u54cd\u5e94\u6302\u673a\u76d1\u6d4b");
                            addMessage("\u7b49\u5f85\u54cd\u5e94\u6302\u673a\u76d1\u6d4b");
                            document.getElementsByClassName("btn-submit")[0].click();
                            setTimeout(function (){
                                document.getElementsByClassName("mejs__overlay-button")[miniBtn].click();
                            }, 2000);
                        }, 3000);
                    }
                    if(document.getElementsByClassName("btn-submit")[1] != null){
                        if(document.getElementsByClassName("btn-submit")[1].innerText === '继续学习'){
                            setTimeout(function (){
                                console.log("\u7b49\u5f85\u54cd\u5e94\u6302\u673a\u76d1\u6d4b");
                                addMessage("\u7b49\u5f85\u54cd\u5e94\u6302\u673a\u76d1\u6d4b");
                                document.getElementsByClassName("btn-submit")[1].click();
                                setTimeout(function (){
                                    document.getElementsByClassName("mejs__overlay-button")[miniBtn].click();
                                }, 2000);
                            }, 3000);
                        }
                    }
                }else{
                    //console.log("\u624b\u52a8\u6682\u505c\uff0c\u65e0\u9700\u64cd\u4f5c");
                    //addMessage("\u624b\u52a8\u6682\u505c\uff0c\u65e0\u9700\u64cd\u4f5c");
                    addMessage("不可暂停");
                    elevideo.play();
                }
            },2500);
        };
        vdended = function(){
            clearInterval(speedIn);
            console.log("xigua:\u7ed3\u675f\u64ad\u653e");
            addMessage("xigua:\u7ed3\u675f\u64ad\u653e");
            setTimeout(function (){
                removeLisenner();
                if(miniVds > 1){
                    progressIndex++;
                    vdIndex++;
                    miniBtn++;
                    setTimeout(unFinishWvd,1500);
                }else{
                    if(unitIndex <= sectionAndVd){
                        console.log("\u9879\u76ee"+sectionId+"\u5185\u7b2c"+unitIndex+"\u4e2a\u5355\u5143\u5df2\u5b8c\u6210\uff0c\u68c0\u7d22\u4e0b\u4e00\u5355\u5143\u3002");
                        addMessage("\u9879\u76ee"+sectionId+"\u5185\u7b2c"+unitIndex+"\u4e2a\u5355\u5143\u5df2\u5b8c\u6210\uff0c\u68c0\u7d22\u4e0b\u4e00\u5355\u5143\u3002");
                        progressIndex = 1;
                        unitIndex++;
                        search();
                    }else{
                        console.log("\u9879\u76ee"+sectionId+"\u5df2\u5b8c\u6210\uff0c\u68c0\u7d22\u9879\u76ee"+(sectionId+1)+"\u3002");
                        addMessage("\u9879\u76ee"+sectionId+"\u5df2\u5b8c\u6210\uff0c\u68c0\u7d22\u9879\u76ee"+(sectionId+1)+"\u3002");
                        unitIndex = 1;
                        sectionId++;
                        sectionAndVd = document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1].getElementsByClassName("page-name cursor").length;
                        search();
                    }
                }
            }, 3000);
        };

        elevideo.addEventListener('play',vdplay);
        elevideo.addEventListener('playing',vdplaying);
        elevideo.addEventListener('pause',vdpause);
        elevideo.addEventListener('ended',vdended);

        document.getElementsByClassName("mejs__overlay-button")[miniBtn].click();
        elevideo.volume = 0;
    }
    //-----添加监听end------

    //-----移除监听start---
    var removeLisenner = function(){
        if(vdplay != null){
            elevideo.removeEventListener("play", vdplay);
        }
        if(vdplaying != null){
            elevideo.removeEventListener("playing", vdplaying);
        }
        if(vdpause != null){
            elevideo.removeEventListener("pause", vdpause);
        }
        if(vdended != null){
            elevideo.removeEventListener("ended", vdended);
        }
    }
    //-----移除监听end---

    //-----倍速start-----
    var speedff = function(){
        if(speedonoff){
            let vdText = document.getElementsByClassName("video-progress clearfix not-start")[0].getElementsByClassName("text")[0].getElementsByTagName("span")[1].innerText;
            if(parseFloat(vdText) <= 70){
                setTimeout(function(){
                    document.querySelector("video").playbackRate=16;
                    console.log("X16");
                    setTimeout(function(){
                        document.querySelector("video").playbackRate=1;
                        console.log("X1");
                    },800);
                },1000);
            }
        }else{
            addMessage("断点倍速状态：关闭");
        }
    }
    //-----倍速end-----



    //-----微课视频类型再检索（普通微课/混合微课）start-----
    var unFinishWvd = function(){
        if(progressIndex <= miniVds){
            if(document.getElementsByClassName('page-element')[progressIndex-1] != null){
                if(document.getElementsByClassName('page-element')[progressIndex-1].getElementsByTagName("div")[0].innerText.substring(0,2) === '视频'){
                    console.log("第"+progressIndex+"个微课为视频");
                    addMessage("第"+progressIndex+"个微课为视频");
                    if(document.getElementsByClassName('page-element')[progressIndex-1].getElementsByClassName("water")[0] != null){
                        let progress = parseInt(document.getElementsByClassName('page-element')[progressIndex-1].getElementsByClassName("water")[0].getAttribute("style").substring(8));
                        if(progress >= 100){
                            console.log("第"+progressIndex+"个微课视频已看完");
                            addMessage("第"+progressIndex+"个微课视频已看完");
                            progressIndex++;
                            vdIndex++;
                            miniBtn++;
                            setTimeout(unFinishWvd,1500);
                        }else{
                            console.log("第"+progressIndex+"个微课视频未看完");
                            addMessage("第"+progressIndex+"个微课视频未看完");
                            setTimeout(removeLisenner,800);
                            setTimeout(addLisenner,1500);
                        }
                    }else{
                        setTimeout(removeLisenner,800);
                        setTimeout(addLisenner,1500);
                    }
                }else if(document.getElementsByClassName('page-element')[progressIndex-1].getElementsByTagName("div")[0].innerText.substring(1,3) === '练习'){
                    console.log("第"+progressIndex+"个微课为练习");
                    addMessage("第"+progressIndex+"个微课为练习");
                    setTimeout(function(){
                        if(document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("question-setting-panel")[0].getElementsByClassName("question-setting-list")[0].getElementsByClassName("question-setting-item")[1] == null){
                            console.log("当前习题未及格，需重做...");
                            //存储当前习题小题数量
                            questionCount = document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("correct-answer-area").length;
                            console.log("获取到题目数量，开始答题");
                            setTimeout(wkAnswer,2000);
                        }else{
                            let sor = parseInt(document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("question-setting-panel")[0].getElementsByClassName("question-setting-list")[0].getElementsByClassName("question-setting-item")[1].innerText);
                            if(sor < 100){
                                console.log("当前习题"+sor+"分，需重做...");
                                if(document.getElementsByClassName("question-type-tag")[0].innerText === '综合题'){
                                    console.log("综合题模板需更新");
                                    addMessage("综合题模板需更新");
                                }else{
                                    //存储当前习题小题数量
                                    questionCount = document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("correct-answer-area").length;
                                    document.getElementsByClassName("btn-hollow btn-redo")[document.getElementsByClassName("btn-hollow btn-redo").length - 1].click();
                                    console.log("获取到题目数量，开始答题");
                                    setTimeout(wkAnswer,2000);
                                }
                            }else{
                                console.log("当前习题满分，无需重做...");
                                addMessage("当前习题满分，无需重做...");
                                progressIndex++;
                                setTimeout(unFinishWvd,1500);
                            }
                        }
                    },2000);
                }else{
                    console.log("第"+progressIndex+"个微课为文章，检测下一个");
                    addMessage("第"+progressIndex+"个微课为文章，检测下一个");
                    progressIndex++;
                    setTimeout(unFinishWvd,1500);
                }
            }
        }else{
            console.log("\u9879\u76ee"+sectionId+"\u5185\u7b2c"+unitIndex+"\u4e2a\u5355完成");
            addMessage("\u9879\u76ee"+sectionId+"\u5185\u7b2c"+unitIndex+"\u4e2a\u5355完成");
            miniVds = 1;
            progressIndex = 1;
            vdIndex = 0;
            miniBtn = 0;
            unitIndex++;
            if(unitIndex > sectionAndVd){
                console.log("\u9879\u76ee"+sectionId+"\u5df2\u5b8c\u6210\uff0c\u68c0\u7d22\u9879\u76ee"+(sectionId+1)+"\u3002");
                addMessage("\u9879\u76ee"+sectionId+"\u5df2\u5b8c\u6210\uff0c\u68c0\u7d22\u9879\u76ee"+(sectionId+1)+"\u3002");
                unitIndex = 1;
                sectionId++;
                if(document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1] != null){
                    sectionAndVd = document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1].getElementsByClassName("page-name cursor").length;
                }
                document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1].getElementsByClassName("page-name cursor")[unitIndex-1].click();
                setTimeout(search,1500);
            }else{
                document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1].getElementsByClassName("page-name cursor")[unitIndex-1].click();
                setTimeout(search,1500);
            }
        }
    }
    //-----微课视频类型再检索（普通微课/混合微课）end-----

    //-----未完成视频类型（普通类型直接播放）start-----
    var unFinishVd = function(){
        console.log("\u9879\u76ee"+sectionId+"\u5185\u7b2c"+unitIndex+"\u4e2a\u5355\u5143\u672a\u5b8c\u6210\u3002\u7c7b\u578b\u4e3a\u89c6\u9891");
        addMessage("\u9879\u76ee"+sectionId+"\u5185\u7b2c"+unitIndex+"\u4e2a\u5355\u5143\u672a\u5b8c\u6210\u3002\u7c7b\u578b\u4e3a\u89c6\u9891");
        setTimeout(function(){
            miniVds = document.getElementsByClassName('page-element').length;
            setTimeout(function(){
                if(miniVds > 1){
                    if(progressIndex <= miniVds){
                        miniVds = document.getElementsByClassName('page-element').length;
                        unFinishWvd();
                    }else{
                        miniVds = 1;
                        progressIndex = 1;
                        vdIndex = 0;
                        miniBtn = 0;
                        unitIndex++;
                        setTimeout(search,1500);
                    }
                }else{
                    console.log("普通视频");
                    addMessage("普通视频");
                    setTimeout(removeLisenner,800);
                    setTimeout(addLisenner,3500);
                }
            },2000);
        },1500);
    }
    //-----未完成视频类型（普通类型直接播放）end-----

    //------检索未完成单元start------
    search = function(){
        if(sectionId <= sectionCount){
            if(unitIndex > sectionAndVd){
                console.log("\u9879\u76ee"+sectionId+"\u5df2\u5b8c\u6210\uff0c\u68c0\u7d22\u9879\u76ee"+(sectionId+1)+"\u3002");
                addMessage("\u9879\u76ee"+sectionId+"\u5df2\u5b8c\u6210\uff0c\u68c0\u7d22\u9879\u76ee"+(sectionId+1)+"\u3002");
                unitIndex = 1;
                sectionId++;
                if(document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1] != null){
                    sectionAndVd = document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1].getElementsByClassName("page-name cursor").length;
                }
                setTimeout(search,1500);
            }else{
                let cName = document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1].getElementsByClassName("page-name cursor")[unitIndex-1].getElementsByClassName("iconfont")[0].className;
                let iText = document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1].getElementsByClassName("page-name cursor")[unitIndex-1].getElementsByClassName("iconfont")[0].innerText;
                let tableText = document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1].getElementsByClassName("page-name cursor")[unitIndex-1].getElementsByTagName("span")[1].innerText;
                if(cName == 'iconfont finish'){
                    document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1].getElementsByClassName("page-name cursor")[unitIndex-1].click();
                    if(unitIndex <= sectionAndVd){
                        setTimeout(function(){
                            if(tableText === '习题小测' || tableText === '章节测试' || tableText === '牛刀小试' || tableText === '章测验' || tableText === '练习题' || tableText.substring(0,3) === '测验' || tableText.substring(3,7) === '综合测试' || tableText === '本章测验'){
                                //习题重做
                                setTimeout(function(){
                                    if(document.getElementsByClassName("question-view")[0].getElementsByClassName("question-setting-item")[1] == null){
                                        console.log("当前习题未及格，需重做...");
                                        //存储当前习题小题数量
                                        questionCount = document.getElementsByClassName("correct-answer-area").length;
                                        console.log("获取到题目数量，开始答题");
                                        setTimeout(wkAnswer,2000);
                                    }else{
                                        let sor = parseInt(document.getElementsByClassName("question-view")[0].getElementsByClassName("question-setting-item")[1].innerText);
                                        if(sor < 100){
                                            console.log("当前习题"+sor+"分，需重做...");
                                            //存储当前习题小题数量
                                            questionCount = document.getElementsByClassName("correct-answer-area").length;
                                            document.getElementsByClassName("btn-hollow btn-redo")[document.getElementsByClassName("btn-hollow btn-redo").length - 1].click();
                                            console.log("获取到题目数量，开始答题");
                                            setTimeout(wkAnswer,2000);
                                        }else{
                                            console.log("当前习题满分，无需重做...");
                                            unitIndex++;
                                            search();
                                        }
                                    }
                                },1000);
                            }else if(document.getElementsByClassName('page-element').length > 9999){
                                console.log("\u9879\u76ee"+sectionId+"\u5185\u7b2c"+unitIndex+"\u4e2a\u5355\u5143为微课类型");
                                addMessage("\u9879\u76ee"+sectionId+"\u5185\u7b2c"+unitIndex+"\u4e2a\u5355\u5143\微课类型");
                                miniVds = document.getElementsByClassName('page-element').length;
                                unFinishWvd();
                            }else{
                                console.log("\u9879\u76ee"+sectionId+"\u5185\u7b2c"+unitIndex+"\u4e2a\u5355\u5143\u5df2\u5b8c\u6210\uff0c\u68c0\u7d22\u4e0b\u4e00\u5355\u5143\u3002");
                                addMessage("\u9879\u76ee"+sectionId+"\u5185\u7b2c"+unitIndex+"\u4e2a\u5355\u5143\u5df2\u5b8c\u6210\uff0c\u68c0\u7d22\u4e0b\u4e00\u5355\u5143\u3002");
                                progressIndex = 1;
                                unitIndex++;
                                search();
                            }
                        },1500);
                    }else{
                        console.log("\u9879\u76ee"+sectionId+"\u5df2\u5b8c\u6210\uff0c\u68c0\u7d22\u9879\u76ee"+(sectionId+1)+"\u3002");
                        addMessage("\u9879\u76ee"+sectionId+"\u5df2\u5b8c\u6210\uff0c\u68c0\u7d22\u9879\u76ee"+(sectionId+1)+"\u3002");
                        unitIndex = 1;
                        sectionId++;
                        if(document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1] != null){
                            sectionAndVd = document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1].getElementsByClassName("page-name cursor").length;
                        }
                        setTimeout(search,1500);
                    }
                }else{
                    if(iText == ''){
                        document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1].getElementsByClassName("page-name cursor")[unitIndex-1].click();
                        setTimeout(function(){
                            unFinishVd();
                        },1500);
                    }else if(iText == ''){
                        console.log("\u9879\u76ee"+sectionId+"\u5185\u7b2c"+unitIndex+"\u4e2a\u5355\u5143\u672a\u5b8c\u6210\u3002\u7c7b\u578b\u4e3a\u6587\u7ae0");
                        addMessage("\u9879\u76ee"+sectionId+"\u5185\u7b2c"+unitIndex+"\u4e2a\u5355\u5143\u672a\u5b8c\u6210\u3002\u7c7b\u578b\u4e3a\u6587\u7ae0");
                        document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1].getElementsByClassName("page-name cursor")[unitIndex-1].click();
                        console.log("\u89c2\u770b\u4e86\u6587\u7ae0");
                        addMessage("\u89c2\u770b\u4e86\u6587\u7ae0");
                        setTimeout(function(){
                            if(unitIndex <= sectionAndVd){
                                console.log("\u9879\u76ee"+sectionId+"\u5185\u7b2c"+unitIndex+"\u4e2a\u5355\u5143\u5df2\u5b8c\u6210\uff0c\u68c0\u7d22\u4e0b\u4e00\u5355\u5143\u3002");
                                addMessage("\u9879\u76ee"+sectionId+"\u5185\u7b2c"+unitIndex+"\u4e2a\u5355\u5143\u5df2\u5b8c\u6210\uff0c\u68c0\u7d22\u4e0b\u4e00\u5355\u5143\u3002");
                                unitIndex++;
                                search();
                            }else{
                                console.log("\u9879\u76ee"+sectionId+"\u5df2\u5b8c\u6210\uff0c\u68c0\u7d22\u9879\u76ee"+(sectionId+1)+"\u3002");
                                addMessage("\u9879\u76ee"+sectionId+"\u5df2\u5b8c\u6210\uff0c\u68c0\u7d22\u9879\u76ee"+(sectionId+1)+"\u3002");
                                unitIndex = 1;
                                sectionId++;
                                if(document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1] != null){
                                    sectionAndVd = document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1].getElementsByClassName("page-name cursor").length;
                                }
                                setTimeout(search,1500);
                            }
                        },1500);
                    }else if(iText == ''){
                        console.log("\u9879\u76ee"+sectionId+"\u5185\u7b2c"+unitIndex+"\u4e2a\u5355\u5143\u672a\u5b8c\u6210\u3002\u7c7b\u578b\u4e3a\u4e60\u9898");
                        addMessage("\u9879\u76ee"+sectionId+"\u5185\u7b2c"+unitIndex+"\u4e2a\u5355\u5143\u672a\u5b8c\u6210\u3002\u7c7b\u578b\u4e3a\u4e60\u9898");
                        document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1].getElementsByClassName("page-name cursor")[unitIndex-1].click();
                        //存储当前习题小题数量
                        setTimeout(function(){
                            progressIndex = 1;
                            questionCount = document.getElementsByClassName("correct-answer-area").length;
                            console.log("\u83b7\u53d6\u5230\u9898\u76ee\u6570\u91cf\uff0c\u5f00\u59cb\u7b54\u9898");
                            addMessage("\u83b7\u53d6\u5230\u9898\u76ee\u6570\u91cf\uff0c\u5f00\u59cb\u7b54\u9898");
                            setTimeout(wkAnswer,5000);
                        },2500);
                    }else{
                        console.log("\u9879\u76ee"+sectionId+"\u5185\u7b2c"+unitIndex+"\u4e2a\u5355\u5143\u672a\u5b8c\u6210\u3002\u7c7b\u578b\u672a\u77e5\uff0c\u9700\u66f4\u65b0");
                        addMessage("\u9879\u76ee"+sectionId+"\u5185\u7b2c"+unitIndex+"\u4e2a\u5355\u5143\u672a\u5b8c\u6210\u3002\u7c7b\u578b\u672a\u77e5\uff0c\u9700\u66f4\u65b0");
                    }
                }
            }
        }else{
            console.log("\u5f53\u524d\u7ae0\u8282\u4e60\u9898\u5df2\u5b8c\u6210\uff0c\u7a0d\u540e\u8fdb\u5165\u4e0b\u4e00\u7ae0...");
            addMessage("\u5f53\u524d\u7ae0\u8282\u4e60\u9898\u5df2\u5b8c\u6210\uff0c\u7a0d\u540e\u8fdb\u5165\u4e0b\u4e00\u7ae0...");
            setTimeout(function(){
                document.getElementsByClassName("back-btn control-btn cursor return-url")[0].click();
            },1000);
        }
    }
    //------检索未完成单元end------

    //-----课堂练习答题方法start-----
    var classRoomAnswer = function(){
        try{
            questionCount = document.getElementsByClassName("modal-body")[0].getElementsByClassName("question-view")[0].getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node").length;
        }catch(e){
            addMessage("无课堂练习...");
        }
        // document.getElementsByClassName("modal-body")[0].getElementsByClassName("question-view")[0].getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node").length
        for(var i=0;i<questionCount;i++){
            console.log("题索引:"+ i);
            // addMessage("题索引:"+ i);
            let answerPrint = document.getElementsByClassName("modal-body")[0].getElementsByClassName("question-view")[0].getElementsByClassName("question-element-node-list")[0].getElementsByClassName("correct-answer-area")[i].getElementsByTagName("span")[1].innerText;
            if(document.getElementsByClassName("modal-body")[0].getElementsByClassName("question-view")[0].getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-type-tag")[i].innerText === '单选题'){
                console.log("\u9898\u7b54\u6848\u662f\uff1a"+answerPrint+"；\u5355\u9009\u9898");
                addMessage("\u9898\u7b54\u6848\u662f\uff1a"+answerPrint+"；\u5355\u9009\u9898");
                switch(answerPrint)
                {
                    case 'A':
                        document.getElementsByClassName("modal-body")[0].getElementsByClassName("question-view")[0].getElementsByClassName("question-element-node-list")[0].getElementsByClassName("choice-type")[0].getElementsByClassName("choice-item clearfix")[0].click();
                        break;
                    case 'B':
                        document.getElementsByClassName("modal-body")[0].getElementsByClassName("question-view")[0].getElementsByClassName("question-element-node-list")[0].getElementsByClassName("choice-type")[0].getElementsByClassName("choice-item clearfix")[1].click();
                        break;
                    case 'C':
                        document.getElementsByClassName("modal-body")[0].getElementsByClassName("question-view")[0].getElementsByClassName("question-element-node-list")[0].getElementsByClassName("choice-type")[0].getElementsByClassName("choice-item clearfix")[2].click();
                        break;
                    case 'D':
                        document.getElementsByClassName("modal-body")[0].getElementsByClassName("question-view")[0].getElementsByClassName("question-element-node-list")[0].getElementsByClassName("choice-type")[0].getElementsByClassName("choice-item clearfix")[3].click();
                        break;
                }
            }
            if(document.getElementsByClassName("modal-body")[0].getElementsByClassName("question-view")[0].getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-type-tag")[i].innerText === '多选题'){
                console.log("\u9898\u7b54\u6848\u662f\uff1a"+answerPrint+"；\u591a\u9009\u9898");
                addMessage("\u9898\u7b54\u6848\u662f\uff1a"+answerPrint+"；\u591a\u9009\u9898");
                let str1 = answerPrint;
                let array = str1.split(',');
                let str2 = array.join('');
                for(var j=0;j<str2.length;j++){
                    switch(str2[j])
                    {
                        case 'A':
                            document.getElementsByClassName("modal-body")[0].getElementsByClassName("question-view")[0].getElementsByClassName("question-element-node-list")[0].getElementsByClassName("choice-type")[0].getElementsByClassName("choice-item clearfix")[0].click();
                            console.log("点击A");
                            break;
                        case 'B':
                            document.getElementsByClassName("modal-body")[0].getElementsByClassName("question-view")[0].getElementsByClassName("question-element-node-list")[0].getElementsByClassName("choice-type")[0].getElementsByClassName("choice-item clearfix")[1].click();
                            console.log("点击B");
                            break;
                        case 'C':
                            document.getElementsByClassName("modal-body")[0].getElementsByClassName("question-view")[0].getElementsByClassName("question-element-node-list")[0].getElementsByClassName("choice-type")[0].getElementsByClassName("choice-item clearfix")[2].click();
                            console.log("点击C");
                            break;
                        case 'D':
                            document.getElementsByClassName("modal-body")[0].getElementsByClassName("question-view")[0].getElementsByClassName("question-element-node-list")[0].getElementsByClassName("choice-type")[0].getElementsByClassName("choice-item clearfix")[3].click();
                            console.log("点击D");
                            break;
                        case 'E':
                            document.getElementsByClassName("modal-body")[0].getElementsByClassName("question-view")[0].getElementsByClassName("question-element-node-list")[0].getElementsByClassName("choice-type")[0].getElementsByClassName("choice-item clearfix")[4].click();
                            console.log("点击E");
                            break;
                        case 'F':
                            document.getElementsByClassName("modal-body")[0].getElementsByClassName("question-view")[0].getElementsByClassName("question-element-node-list")[0].getElementsByClassName("choice-type")[0].getElementsByClassName("choice-item clearfix")[5].click();
                            console.log("点击F");
                            break;
                        case 'G':
                            document.getElementsByClassName("modal-body")[0].getElementsByClassName("question-view")[0].getElementsByClassName("question-element-node-list")[0].getElementsByClassName("choice-type")[0].getElementsByClassName("choice-item clearfix")[6].click();
                            console.log("点击G");
                            break;
                        default:
                            console.log("当前多选题选择过多，系统需更新！");
                    }
                }
            }
            if(document.getElementsByClassName("modal-body")[0].getElementsByClassName("question-view")[0].getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-type-tag")[i].innerText === '判断题'){
                console.log("\u9898\u7b54\u6848\u662f\uff1a"+answerPrint+"；判断题");
                addMessage("\u9898\u7b54\u6848\u662f\uff1a"+answerPrint+"；判断题");
                switch(answerPrint)
                {
                    case '正确':
                        console.log("\u5224\u65ad\u9898");
                        addMessage("\u5224\u65ad\u9898");
                        document.getElementsByClassName("modal-body")[0].getElementsByClassName("question-view")[0].getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-btn right-btn")[0].click();
                        break;
                    case '错误':
                        console.log("\u5224\u65ad\u9898");
                        addMessage("\u5224\u65ad\u9898");
                        document.getElementsByClassName("modal-body")[0].getElementsByClassName("question-view")[0].getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-btn wrong-btn")[0].click();
                        break;
                }
            }
            if(document.getElementsByClassName("modal-body")[0].getElementsByClassName("question-view")[0].getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-type-tag")[i].innerText === '简答题'){
                console.log("\u9898\u7b54\u6848\u662f\uff1a"+answerPrint+"；简答题，测试版");
                addMessage("\u9898\u7b54\u6848\u662f\uff1a"+answerPrint+"；简答题，测试版");
                document.getElementsByClassName("modal-body")[0].getElementsByClassName("question-view")[0].getElementsByClassName("question-element-node-list")[i].getElementsByClassName("form-control")[0].value = answerPrint;
            }
            if(document.getElementsByClassName("modal-body")[0].getElementsByClassName("question-view")[0].getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-type-tag")[i].innerText === '填空题'){
                console.log("\u9898\u7b54\u6848\u662f\uff1a"+answerPrint+"；填空题，测试版");
                addMessage("\u9898\u7b54\u6848\u662f\uff1a"+answerPrint+"；填空题，测试版");
                let str1 = answerPrint;
                let array = str1.split(';');
                for(let j=0;j<array.length;j++){
                    document.getElementsByClassName("modal-body")[0].getElementsByClassName("question-view")[0].getElementsByClassName("question-element-node-list")[i].getElementsByClassName("blank-input")[j].value = array[j];
                }
            }
        }
        setTimeout(function(){
            document.getElementsByClassName("question-view")[0].getElementsByClassName("question-operation-area")[0].getElementsByTagName("button")[0].click();

            setTimeout(function(){
                if(document.getElementsByClassName("btn-submit")[0].innerText === '继续播放'){
                    document.getElementsByClassName("btn-submit")[0].click();
                }
            },1000);
        },3500);
    }
    //-----课堂练习答题方法end-----

    //------全能答题方法start------
    var wkAnswer = function(){
        var er = false;
        console.log("\u5f00\u59cb\u7b54\u9898");
        addMessage("\u5f00\u59cb\u7b54\u9898");
        try{
            for(var i=0;i<questionCount;i++){
                console.log("题索引:"+ i);
                addMessage("请补充wkAnswer模板，|节点（questionCount:"+questionCount+",progressIndex-1:"+(progressIndex-1)+",i="+i+"）|");
                // addMessage("题索引:"+ i);
                let answerPrint = document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("correct-answer-area")[i].getElementsByTagName("span")[1].innerText;
                if(document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("question-element-node")[i].getElementsByClassName("split-screen-wrapper")[0].getElementsByClassName("question-type-tag")[0].innerText === '单选题'){
                    console.log("\u7b2c"+(i+1)+"\u9898\u7b54\u6848\u662f\uff1a"+answerPrint+"；\u5355\u9009\u9898");
                    addMessage("\u7b2c"+(i+1)+"\u9898\u7b54\u6848\u662f\uff1a"+answerPrint+"；\u5355\u9009\u9898");
                    switch(answerPrint)
                    {
                        case 'A':
                            document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("question-element-node")[i].getElementsByClassName("split-screen-wrapper")[0].getElementsByClassName("question-body-wrapper")[0].getElementsByTagName("a")[0].click();
                            break;
                        case 'B':
                            document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("question-element-node")[i].getElementsByClassName("split-screen-wrapper")[0].getElementsByClassName("question-body-wrapper")[0].getElementsByTagName("a")[1].click();
                            break;
                        case 'C':
                            document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("question-element-node")[i].getElementsByClassName("split-screen-wrapper")[0].getElementsByClassName("question-body-wrapper")[0].getElementsByTagName("a")[2].click();
                            break;
                        case 'D':
                            document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("question-element-node")[i].getElementsByClassName("split-screen-wrapper")[0].getElementsByClassName("question-body-wrapper")[0].getElementsByTagName("a")[3].click();
                            break;
                    }
                }
                if(document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("question-element-node")[i].getElementsByClassName("split-screen-wrapper")[0].getElementsByClassName("question-type-tag")[0].innerText === '多选题'){
                    console.log("\u7b2c"+(i+1)+"\u9898\u7b54\u6848\u662f\uff1a"+answerPrint+"；\u591a\u9009\u9898");
                    addMessage("\u7b2c"+(i+1)+"\u9898\u7b54\u6848\u662f\uff1a"+answerPrint+"；\u591a\u9009\u9898");
                    var redius = document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByTagName("a").length;
                    for(var a=0; a<redius; a++){
                        if(document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[a].getElementsByClassName("checkbox selected").length != 0){
                            document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[a].click();
                        }
                    }
                    let str1 = answerPrint;
                    let array = str1.split(',');
                    let str2 = array.join('');
                    for(var j=0;j<str2.length;j++){
                        switch(str2[j])
                        {
                            case 'A':
                                document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("question-element-node")[i].getElementsByClassName("split-screen-wrapper")[0].getElementsByClassName("question-body-wrapper")[0].getElementsByTagName("a")[0].click();
                                console.log("点击A");
                                break;
                            case 'B':
                                document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("question-element-node")[i].getElementsByClassName("split-screen-wrapper")[0].getElementsByClassName("question-body-wrapper")[0].getElementsByTagName("a")[1].click();
                                console.log("点击B");
                                break;
                            case 'C':
                                document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("question-element-node")[i].getElementsByClassName("split-screen-wrapper")[0].getElementsByClassName("question-body-wrapper")[0].getElementsByTagName("a")[2].click();
                                console.log("点击C");
                                break;
                            case 'D':
                                document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("question-element-node")[i].getElementsByClassName("split-screen-wrapper")[0].getElementsByClassName("question-body-wrapper")[0].getElementsByTagName("a")[3].click();
                                console.log("点击D");
                                break;
                            case 'E':
                                document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("question-element-node")[i].getElementsByClassName("split-screen-wrapper")[0].getElementsByClassName("question-body-wrapper")[0].getElementsByTagName("a")[4].click();
                                console.log("点击E");
                                break;
                            case 'F':
                                document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("question-element-node")[i].getElementsByClassName("split-screen-wrapper")[0].getElementsByClassName("question-body-wrapper")[0].getElementsByTagName("a")[5].click();
                                console.log("点击F");
                                break;
                            case 'G':
                                document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("question-element-node")[i].getElementsByClassName("split-screen-wrapper")[0].getElementsByClassName("question-body-wrapper")[0].getElementsByTagName("a")[6].click();
                                console.log("点击G");
                                break;
                            case 'H':
                                document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("question-element-node")[i].getElementsByClassName("split-screen-wrapper")[0].getElementsByClassName("question-body-wrapper")[0].getElementsByTagName("a")[7].click();
                                console.log("点击H");
                                break;
                            case 'I':
                                document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("question-element-node")[i].getElementsByClassName("split-screen-wrapper")[0].getElementsByClassName("question-body-wrapper")[0].getElementsByTagName("a")[8].click();
                                console.log("点击I");
                                break;
                            default:
                                er = true;
                                console.log("当前多选题选择过多，系统需更新！");
                                addMessage("当前多选题选择过多，系统需更新！");
                        }
                    }
                }
                if(document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("question-element-node")[i].getElementsByClassName("split-screen-wrapper")[0].getElementsByClassName("question-type-tag")[0].innerText === '判断题'){
                    console.log("\u7b2c"+(i+1)+"\u9898\u7b54\u6848\u662f\uff1a"+answerPrint+"；判断题");
                    addMessage("\u7b2c"+(i+1)+"\u9898\u7b54\u6848\u662f\uff1a"+answerPrint+"；判断题");
                    switch(answerPrint)
                    {
                        case '正确':
                            console.log("\u5224\u65ad\u9898");
                            addMessage("\u5224\u65ad\u9898");
                            document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("question-element-node")[i].getElementsByClassName("split-screen-wrapper")[0].getElementsByClassName("question-body-wrapper")[0].getElementsByClassName("choice-btn right-btn")[0].click();
                            break;
                        case '错误':
                            console.log("\u5224\u65ad\u9898");
                            addMessage("\u5224\u65ad\u9898");
                            document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("question-element-node")[i].getElementsByClassName("split-screen-wrapper")[0].getElementsByClassName("question-body-wrapper")[0].getElementsByClassName("choice-btn wrong-btn")[0].click();
                            break;
                    }
                }
                if(document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("question-element-node")[i].getElementsByClassName("split-screen-wrapper")[0].getElementsByClassName("question-type-tag")[0].innerText === '简答题'){
                    console.log("\u7b2c"+(i+1)+"\u9898\u7b54\u6848\u662f\uff1a"+answerPrint+"；简答题");
                    addMessage("\u7b2c"+(i+1)+"\u9898\u7b54\u6848\u662f\uff1a"+answerPrint+"；简答题");
                    document.getElementsByClassName("split-screen-wrapper")[i].getElementsByClassName("form-control")[0].value = answerPrint;
                }
                if(document.getElementsByClassName("page-wrapper text-default")[0].getElementsByClassName("page-element")[progressIndex-1].getElementsByClassName("question-element-node")[i].getElementsByClassName("split-screen-wrapper")[0].getElementsByClassName("question-type-tag")[0].innerText === '填空题'){
                    console.log("\u7b2c"+(i+1)+"\u9898\u7b54\u6848\u662f\uff1a"+answerPrint+"；填空题");
                    addMessage("\u7b2c"+(i+1)+"\u9898\u7b54\u6848\u662f\uff1a"+answerPrint+"；填空题");
                    let str1 = answerPrint;
                    let array = str1.split(';');
                    for(let j=0;j<array.length;j++){
                        document.getElementsByClassName("split-screen-wrapper")[i].getElementsByClassName("blank-input")[j].value = array[j];
                    }
                }
            }
        }catch(e){
            addMessage("请补充wkAnswer模板，"+e+"|节点（questionCount:"+questionCount+",progressIndex-1:"+(progressIndex-1)+"）|");
            return;
        }

        console.log("\u7b54\u9898\u7ed3\u675f");
        addMessage("\u7b54\u9898\u7ed3\u675f");
        if(er){
            console.log("\u9000\u51fa");
            addMessage("\u9000\u51fa");
            return;
        }
        //继续答题
        var btn = document.getElementsByClassName("btn-submit").length;
        addMessage("\u63d0\u4ea4");
        console.log("\u63d0\u4ea4");
        setTimeout(function(){
            if(document.getElementsByClassName("btn-submit")[btn-1].innerText === '留在本页'){
                // document.getElementsByClassName("btn-submit")[btn-2].click();
                // document.getElementsByClassName("question-operation-area")[0].getElementsByTagName("button")[0].click();
                document.getElementsByClassName("question-view")[0].getElementsByClassName("question-operation-area")[0].getElementsByTagName("button")[0].click();
            }else{
                // document.getElementsByClassName("btn-submit")[btn-1].click();
                // document.getElementsByClassName("question-operation-area")[0].getElementsByTagName("button")[0].click();
                document.getElementsByClassName("question-view")[0].getElementsByClassName("question-operation-area")[0].getElementsByTagName("button")[0].click();
            }
            setTimeout(function(){
                addMessage("\u63d0\u4ea4\u6210\u529f");
                console.log("\u63d0\u4ea4\u6210\u529f");
                progressIndex++;
                setTimeout(search,3000);
            },2000);
        },1500);
    }
    //------全能答题方法end------


    function timerChapter(){
        // window.location.reload();
        addMessage("公需课数量："+ gxCount);
        if(gxIndex <= gxCount){
            let statusStr = document.querySelector("#pane-first").getElementsByClassName('study-list-item flex')[gxIndex-1].getElementsByClassName('margin-top-sm study-list-precent flex align-center')[0].innerText;
            if(statusStr != '您已学完并考试合格，请进行证书申请。 去申请证书' && statusStr != '您已学完，请进行考试。 去考试'){
                if(parseInt(document.querySelector("#pane-first").getElementsByClassName('study-list-item flex')[gxIndex-1].getElementsByClassName('margin-top-sm study-list-precent flex align-center')[0].innerText.split('已学')[1]) < 90){
                    addMessage("公需课第"+gxIndex+"科未完成。即将进入学习...");
                    setTimeout(function(){
                        document.querySelector("#pane-first").getElementsByClassName('study-list-item flex')[gxIndex-1].getElementsByClassName('enter-btn')[0].click();
                        setTimeout(function(){
                            window.location.reload();
                        },1000);
                    },1000);
                }else{
                    addMessage("公需课第"+gxIndex+"科进度合格。检索下一科...");
                    gxIndex++;
                    timerChapter();
                }
            }else{
                addMessage("公需课第"+gxIndex+"科完成。检索下一科...");
                gxIndex++;
                timerChapter();
            }
        }else{
            console.log("公需课检索完毕，继续检索专业课...");
            addMessage("公需课检索完毕，继续检索专业课...");
            document.getElementById("tab-third").click();
            setTimeout(function(){
                zyCount = document.getElementsByClassName("margin-top-xs el-tabs el-tabs--top")[0].getElementsByClassName("el-tabs__content")[0].getElementsByClassName('study-list-card')[2].childElementCount;
                console.log("专业课数量："+ zyCount);
                if(zyIndex <= zyCount){
                    var zyText = document.getElementsByClassName("margin-top-xs el-tabs el-tabs--top")[0].getElementsByClassName("el-tabs__content")[0].getElementsByClassName('study-list-card')[2].children[zyIndex-1].getElementsByClassName("margin-top-sm study-list-precent flex align-center")[0].getElementsByTagName("div")[0].innerText.substring(2);
                    if(parseInt(zyText) > 80){
                        console.log("专业课第"+zyIndex+"科完成。检索下一科...");
                        addMessage("专业课第"+zyIndex+"科完成。检索下一科...");
                        zyIndex++;
                        timerChapter();
                    }else{
                        console.log("专业课第"+zyIndex+"科未完成。即将进入学习...");
                        addMessage("专业课第"+zyIndex+"科未完成。即将进入学习...");
                        setTimeout(function(){
                            document.getElementsByClassName("margin-top-xs el-tabs el-tabs--top")[0].getElementsByClassName("el-tabs__content")[0].getElementsByTagName("div")[260].getElementsByClassName("study-list-item flex")[zyIndex-1].getElementsByClassName("enter-btn")[0].click();
                            setTimeout(function(){
                                window.location.reload();
                            },1000);
                        },1000);
                    }
                }else{
                    addMessage("所有课程已完成，退出！");
                }
            },1000);
        }
    }

    function timer(){
        chapterList = document.getElementsByClassName("el-table__row").length;
        truncation = document.getElementsByClassName("cell").length;
        if(chapterId <= chapterList && scoreIndex <= truncation){
            var score = parseInt(document.getElementsByClassName("cell")[scoreIndex].innerText);
            if(score >= 70){
                addMessage("第"+chapterId+"章"+score+"分！检测下一章。");
                scoreIndex+=5;
                chapterId+=1;
                timer();
            }else{
                addMessage("第"+chapterId+"章"+score+"分，需重刷。");
                setTimeout(function(){
                    document.getElementsByClassName("cell")[scoreIndex+3].getElementsByTagName("button")[0].click();
                },2000)
            }
        }else{
            addMessage("当前科目完成，退出！");
            document.getElementsByClassName("app-head")[0].getElementsByClassName("el-menu-item is-active")[0].click();
            clearInterval(timer);
            setTimeout(function(){
                window.location.reload();
            },1500);
        }
    }


    const panel = function(){
        var container = $('<div id="gm-interface"></div>');
        var titleBar = $('<div id="gm-title-bar">\ud83c\udf49\u897f\u74dc\u7f51\u8bfe\u52a9\u624b\ud83c\udf49</div>');
        var minimizeButton = $('<div title="\u6536\u8d77" style="display:black"><svg id="gm-minimize-button" class="bi bi-dash-square" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path fill-rule="evenodd" d="M3.5 8a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5z"/></svg></div>');
        var maxButton = $('<div title="\u5c55\u5f00" style="display:none"><svg id="gm-minimize-button" class="bi bi-plus-square" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/><path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/><path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/></svg></div>');
        var content = $('<div id="gm-content"></div>');
        var tips = $('<div class="tip" style="display:none;">\u957f\u6309\u62d6\u62fd</div>');
        var scrollText = $('<marquee>').text('\u4e7e\u5764\u672a\u5b9a\uff0c\u4f60\u6211\u7686\u662f\u9ed1\u9a6c----\u4f5c\u8005\uff1a\u897f\u74dc\u8981\u5927\u7684\uff08\u611f\u8c22\u652f\u6301\uff01\uff09').css({
            'position': 'absolute',
            'top': '15%',
            'left': '50%',
            'transform': 'translate(-50%, -50%)',
            'width': '90%',
            'height': '25px',
            'font-size': '16px',
            'line-height': '1.5',
            'white-space': 'nowrap'
        }).appendTo(content);
        //var ddds1 = $('<div style="position: absolute;top: 20%;width:90%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u70b9\u51fb\u542f\u52a8\uff1a<button id="startxg" style="position: absolute;width:48px;right: 10px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">\u542f\u52a8</button></div>');
        //var ddds5 = $('<div style="position: absolute;top: 35%;width:90%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u70b9\u51fb\u542f\u52a8\uff1a<button id="stopxg" style="position: absolute;width:48px;right: 10px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">暂停</button></div>');
        var ddds2 = $('<div style="position: absolute;top: 73%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u65ad\u70b9\u500d\u901f\uff1a<button id="switchButton" style="position: absolute;width:88px;right: 180px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">当前：关闭</button><button id="speedxgone" style="position: absolute;width:48px;right: 80px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">X1</button><button id="speedxgsex" style="position: absolute;width:48px;right: 10px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">X1</button></div>');
        ddds3 = $('<div id="message-container" style="position: absolute;display: grid;align-content: baseline;justify-content: center;top: 20%;width:94%;height:52%;max-height:62%;overflow-y:auto;padding: 3px;background: #ffffff;border-radius: 5px;"></div>');
        var ddds4 = $('<div style="position: absolute;top: 85%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;"><a href="http://8.130.116.135/?article/" style="position: absolute;right: 10px;text-decoration: none;color: pink;">\u003e\u003e\u003e\u8054\u7cfb\u003a\u0031\u0039\u0030\u0038\u0032\u0034\u0035\u0033\u0030\u0032\u0040\u0071\u0071\u002e\u0063\u006f\u006d</a></div>');

        container.append(titleBar);
        //content.append(ddds1);
        //content.append(ddds5);
        content.append(ddds2);
        content.append(ddds3);
        content.append(ddds4);
        container.append(content);
        container.append(maxButton);
        container.append(minimizeButton);
        $('body').append(container);
        $('body').append(tips);

        GM_addStyle(`
        #gm-interface {
            position: fixed;
            top: 50%;
            left: 50%;
            border-radius: 5px;
            background-color: white;
            z-index: 9999;
        }

        #gm-title-bar {
            padding: 5px;
            background-color: #ffc0c0;
            border: 1px solid black;
            border-radius: 5px;
            cursor: grab;
        }

        #gm-minimize-button {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 30px;
            height: 30px;
            border-radius: 5px;
            padding: 0;
            font-weight: bold;
            background-color: #ffc0c0;
            cursor: pointer;
        }

        #gm-content {
            padding: 10px;
            border: 1px solid black;
            border-radius: 2px 2px 5px 5px;
            background-color: #ffe5e5;
            width: 400px;
            height: 300px;
        }
        .tip{
            font-family: "黑体";
            color: black;
            -webkit-transform: scale(0.8);
            position:absolute;
            padding: 6px 5px;
            background-color:#ffe8f0;
            border-radius: 4px;
            z-index: 9999;
        }
    `);

        titleBar.on('mousemove',function(e){
            tips.attr("style", "display:black;");
            var top = e.pageY+5;
            var left = e.pageX+5;
            tips.css({
                'top' : top + 'px',
                'left': left+ 'px'
            });
        });

        titleBar.on('mouseout',function(){
            tips.hide();
        });

        titleBar.on('mousedown', function(e) {
            var startX = e.pageX - container.offset().left + window.scrollX;
            var startY = e.pageY - container.offset().top + window.scrollY;

            $(document).on('mousemove', function(e) {
                e.preventDefault();
                var newX = e.pageX - startX;
                var newY = e.pageY - startY;
                container.css({ left: newX, top: newY });
            });

            $(document).on('mouseup', function() {
                $(document).off('mousemove');
                $(document).off('mouseup');
            });
        });


        minimizeButton.on('click', function() {
            minimizeButton.attr("style", "display:none;");
            maxButton.attr("style", "display:black;");
            content.slideToggle(0);
            container.css({ width: 200 });
        });

        maxButton.on('click', function() {
            minimizeButton.attr("style", "display:black;");
            maxButton.attr("style", "display:none;");
            content.slideToggle(0);
            container.css({ width: 400 });
        });

        $("#speedxgsex").on('click',function(){
            document.querySelector("video").playbackRate=1;
            addMessage("\u500d\u901f\uff1a\u0058\u0031");
        });

        $("#speedxgone").on('click',function(){
            document.querySelector("video").playbackRate=1;
            addMessage("\u500d\u901f\uff1a\u0058\u0031");
        });

        $("#switchButton").on('click',function(){
            if (speedonoff) {
                speedonoff = false;
                addMessage("\u500d\u901f\uff1a\u5173\u95ed");
                $("#switchButton").text("当前：关闭");
            } else {
                speedonoff = true;
                addMessage("\u500d\u901f\uff1a\u5f00\u542f");
                $("#switchButton").text("当前：开启");
            }
        });

        // 监听鼠标滚轮事件，实现消息框滚动
        ddds3.on('mousewheel', function(event) {
            event.preventDefault();
            var scrollTop = ddds3.scrollTop();
            ddds3.scrollTop(scrollTop + event.originalEvent.deltaY);
        });

        // 添加新消息
        addMessage = function(message){
            // 检查消息数量，移除最早的一条消息
            if (ddds3.children().length >= 288) {
                ddds3.children().first().remove();
            }
            // 创建消息元素并添加到消息框容器
            var messageElement = $('<div class="message"></div>').text(message).css({
                'margin-bottom': '10px'
            }).appendTo(ddds3);
        }

    }

    panel();

    addMessage('\u002d\u002d\u002d\u002d\u6b63\u5728\u542f\u52a8\uff0c\u8bf7\u7a0d\u540e\u002e\u002e\u002e\u002d\u002d\u002d\u002d');
    //------等待网页加载完成start-----
    var wait = setInterval(function (){
        ddds3.children().remove();
        if(window.location.href === 'https://www.hnpxw.org/userStudy' || window.location.href === 'https://hnpxw.org/userStudy'){
            console.log("当前在："+window.location.href);
            addMessage("检索未完成课程");
            gxCount = document.querySelector("#pane-first").getElementsByClassName('study-list-item flex').length;
            timerChapter();
        }else if(window.location.href.substring(0,29) === 'https://hnpxw.org/studyDetail' || window.location.href.substring(0,29) === 'https://www.hnpxw.org/studyDe'){
            console.log("当前在：https://www.hnpxw.org/studyDetail");
            timer();
        }
        else if(window.location.host === 'ua.peixunyun.cn'){
            sectionCount = document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item").length;
            sectionAndVd = document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1].getElementsByClassName("page-name cursor").length;
            addMessage("xigua\uff1a\u9996\u6b21\u83b7\u53d6\u6570\u636e\uff0c\u5171"+sectionCount+"\u4e2a\u9879\u76ee,\u5f53\u524d\u9879\u76ee"+sectionId+"\uff0c\u5305\u542b"+sectionAndVd+"\u4e2a\u5355\u5143");
            console.log("xigua\uff1a\u9996\u6b21\u83b7\u53d6\u6570\u636e\uff0c\u5171"+sectionCount+"\u4e2a\u9879\u76ee,\u5f53\u524d\u9879\u76ee"+sectionId+"\uff0c\u5305\u542b"+sectionAndVd+"\u4e2a\u5355\u5143");
            setTimeout(search,2500);
        }
        clearInterval(wait);
    }, 5000);
    //------等待网页加载完成end-----

})();