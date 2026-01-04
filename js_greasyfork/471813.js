// ==UserScript==
// @name         湖南人才市场公共教育网（答题系统）
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  为定制脚本做功能增强
// @author       西瓜要大的
// @license      MIT
// @match        *://ua.peixunyun.cn/*
// @icon         https://www.hnpxw.org/favicon.ico
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/471813/%E6%B9%96%E5%8D%97%E4%BA%BA%E6%89%8D%E5%B8%82%E5%9C%BA%E5%85%AC%E5%85%B1%E6%95%99%E8%82%B2%E7%BD%91%EF%BC%88%E7%AD%94%E9%A2%98%E7%B3%BB%E7%BB%9F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/471813/%E6%B9%96%E5%8D%97%E4%BA%BA%E6%89%8D%E5%B8%82%E5%9C%BA%E5%85%AC%E5%85%B1%E6%95%99%E8%82%B2%E7%BD%91%EF%BC%88%E7%AD%94%E9%A2%98%E7%B3%BB%E7%BB%9F%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //已经(学完/做完)的(视频/习题)
    //document.getElementsByClassName("page-item")[1].getElementsByClassName("page-name cursor complete")[0].click();
    //暂未(学完/做完)的(视频/习题)
    //document.getElementsByClassName("page-item")[5].getElementsByClassName("page-name cursor")[0].click();
    //定位学习列表
    //document.getElementsByClassName("section-list")[0];
    //当前章节小节数量
    //document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item").length;
    //定位第一小节
    //document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[0];
    //第一小节视频加习题总数
    //document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[0].getElementsByClassName("page-name cursor").length;
    //习题页
    //document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[0].getElementsByClassName("page-name cursor")[3].click();

    //存储当前章节的小节数量
    var sectionCount = 0;
    //存储当前处于第几小节,默认第一节
    var sectionId = 1;
    //存储当前小节视频加习题总数
    var sectionAndVd = 0;
    //存储当前习题小题数量
    var questionCount = 0;
    //提交按钮
    var ind = 2;


    //进入下一节全局方法
    var sectionNext = null;
    //检索未满百分习题全局方法
    var search = null;
    //开始答题全局方法
    var answer = null;



    //------进入下一节start------
    sectionNext = function(){
        if(sectionId <= sectionCount){
            //获取当前小节视频加习题总数
            sectionAndVd = document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1].getElementsByClassName("page-name cursor").length;
            console.log("xigua：共"+sectionCount+"节,当前第"+sectionId+"节，视频加习题总数"+sectionAndVd+"个。");
            setTimeout(search,3000);
        }else{
            console.log("当前章节习题已完成，稍后进入下一章...");
            setTimeout(function(){
                document.getElementsByClassName("back-btn control-btn cursor return-url")[0].click();
            },1000);
        }
    }
    //------进入下一节end------

    //------检索未满百分习题start------
    search = function(){
        //进入当前小节习题页
        document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1].getElementsByClassName("page-name cursor")[sectionAndVd-1].click();
        setTimeout(function(){
            if(document.getElementsByTagName("video")[1] == null){
            setTimeout(function(){
                if(document.getElementsByClassName("question-view")[0].getElementsByClassName("question-setting-item")[1] == null){
                    console.log("当前习题未满分，需重做...");
                    ind = 1;
                    //存储当前习题小题数量
                    questionCount = document.getElementsByClassName("correct-answer-area").length;
                    console.log("获取到题目数量，开始答题");
                    setTimeout(answer,1000);
                }else{
                    var sor = parseInt(document.getElementsByClassName("question-view")[0].getElementsByClassName("question-setting-item")[1].innerText);
                    if(sor < 100){
                        console.log("当前习题"+sor+"分，需重做...");
                        ind = 1;
                        //存储当前习题小题数量
                        questionCount = document.getElementsByClassName("correct-answer-area").length;
                        document.getElementsByClassName("btn-hollow btn-redo")[document.getElementsByClassName("btn-hollow btn-redo").length - 1].click();
                        console.log("获取到题目数量，开始答题");
                        setTimeout(answer,1000);
                    }else{
                        console.log("当前习题满分，无需重做...");
                        ind = 2;
                        sectionId+=1;
                        setTimeout(sectionNext,1000);
                    }
                }
            },2000);
            }else{
                console.log("当前小节无习题，进入下一节");
                ind = 2;
                sectionId+=1;
                setTimeout(sectionNext,1000);
            }
        },1000);
    }
    //------检索未满百分习题end------


    //------答题方法start------
    answer = function(){
        var er = false;
        console.log("开始答题");
        for(var i=0;i<questionCount;i++){
            var answerPrint = document.getElementsByClassName("correct-answer-area")[i].getElementsByTagName("span")[1].innerText;
            console.log("第"+(i+1)+"题答案是："+answerPrint);
            if(answerPrint.length == 1){
                console.log("单选题");
                switch(answerPrint)
                {
                    case 'A':
                        document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[0].click();
                        break;
                    case 'B':
                        document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[1].click();
                        break;
                    case 'C':
                        document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[2].click();
                        break;
                    case 'D':
                        document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[3].click();
                        break;
                }
            }else{
                switch(answerPrint)
                {
                    case '正确':
                        console.log("判断题");
                        document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("checking-type")[0].getElementsByClassName("choice-btn right-btn")[0].click();
                        break;
                    case '错误':
                        console.log("判断题");
                        document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("checking-type")[0].getElementsByClassName("choice-btn wrong-btn")[0].click();
                        break;
                    default:
                        console.log("多选题");
                        var str1 = answerPrint;
                        var array = str1.split(',');
                        var str2 = array.join('');

                        for(var j=0;j<str2.length;j++){
                            switch(str2[j])
                            {
                                case 'A':
                                    document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[0].click();
                                    console.log("点击A");
                                    break;
                                case 'B':
                                    document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[1].click();
                                    console.log("点击B");
                                    break;
                                case 'C':
                                    document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[2].click();
                                    console.log("点击C");
                                    break;
                                case 'D':
                                    document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[3].click();
                                    console.log("点击D");
                                    break;
                                case 'E':
                                    document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[4].click();
                                    console.log("点击E");
                                    break;
                                case 'F':
                                    document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[5].click();
                                    console.log("点击F");
                                    break;
                                case 'G':
                                    document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[6].click();
                                    console.log("点击G");
                                    break;
                                default:
                                    er = true;
                                    console.log("当前多选题选择过多，系统需更新！");
                            }
                        }
                }
            }
            //单选、多选通用
            //document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("choice-list clearfix")[0].getElementsByClassName("choice-item clearfix")[3].click()
            //正确专用
            //document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("checking-type")[0].getElementsByClassName("choice-btn right-btn")[0].click()
            //错误专用
            //document.getElementsByClassName("question-element-node-list")[0].getElementsByClassName("question-element-node")[i].getElementsByClassName("checking-type")[0].getElementsByClassName("choice-btn wrong-btn")[0].click()
        }
        console.log("答题结束");
        if(er){
            console.log("退出");
            return;
        }
        //继续答题
        var btn = document.getElementsByClassName("btn-submit").length-ind;
        console.log("提交");
        setTimeout(function(){
            document.getElementsByClassName("btn-submit")[btn].click();
            console.log("提交成功");
            sectionId+=1;
            setTimeout(sectionNext,10000);
        },1500);
    }
    //------答题方法end------


    //------等待网页加载完成start-----
    var wait = setInterval(function (){
        if(document.getElementsByTagName("video")[1] == null){
            console.log("xigua：等待视频加载！");
        }else{
            console.log("xigua：视频加载完成！进入下一步...");
            //获取当前章节的小节数量
            sectionCount = document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item").length;
            //获取当前小节视频加习题总数
            sectionAndVd = document.getElementsByClassName("section-list")[0].getElementsByClassName("section-item")[sectionId-1].getElementsByClassName("page-name cursor").length;
            console.log("xigua：首次获取数据，共"+sectionCount+"节,当前第"+sectionId+"节，视频加习题总数"+sectionAndVd+"个");
            setTimeout(search,1000);
            clearInterval(wait);
        }
    }, 5000);
    //------等待网页加载完成end-----


})();