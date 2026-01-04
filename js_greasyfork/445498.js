// ==UserScript==
// @name         传智自动跳过视频
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  此脚本是在NothAmor作者的脚本上进行适当修改，自动跳过传智播客课程视频并支持视频中习题的随机答题（目前只支持单选题，随机是因为NothAmor作者提供的脚本中的寻找答案网址基本没用了）
// @author       nothamor
// @match        *.ityxb.com/*
// @homepage     https://www.nothamor.cn/
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445498/%E4%BC%A0%E6%99%BA%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/445498/%E4%BC%A0%E6%99%BA%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("欢迎使用传智自动播放插件, 作者博客:https://www.nothamor.cn");
    setTimeout(function() {
        let url = window.location.href;
        if(url.includes("http://stu.ityxb.com/writePaper/")) {
            auto_search();
            console.log("检测到为测试页面, 开始自动查询题目");
        }else if(url.includes("lookPaper")){
            auto_search();
        }else if(url.includes("http://stu.ityxb.com/preview/detail/")) {
            //确定开始位置
            let counter = 0;
            for( ; counter < document.getElementsByClassName("point-progress-box").length; counter++){
                if(!document.getElementsByClassName("point-progress-box")[counter].innerHTML.includes("100%")){
                    break;
                }
            }

            if(counter == document.getElementsByClassName("point-progress-box").length){
                alert("刷完了");
            }else{
                auto_play(counter);
                console.log("检测到为视频播放页面, 开始自动播放视频");
            }
        }
    }, 5000);

    function auto_play(counter) {
        const CLASS_LIST = document.getElementsByClassName("point-progress-box");
        const CLASS_NAME = document.getElementsByClassName("point-text ellipsis");
        let question_text = document.getElementsByTagName("pre")[0];
        let player = document.getElementsByTagName("video")[0].id;
        let question_text_value;
        CLASS_LIST[counter].click();
        const TIMER = setInterval(function () {
            let percent = CLASS_LIST[counter].innerHTML.replace(/\ +/g, "").replace(/[\r\n]/g, "");
            let title_name = CLASS_NAME[counter].innerHTML.replace(/\ +/g, "").replace(/[\r\n]/g, "");
            //暂停视频
            if(document.getElementsByTagName("video")[0] != null){
                player = document.getElementsByTagName("video")[0].id;
                document.getElementById(player).pause();
            }
            if (percent.includes("100%") && counter == (CLASS_LIST.length - 1)) {
                clearInterval(TIMER);
                alert("当前页面所有视频播放完成");
            } else if (percent.includes("100%")) {
                CLASS_LIST[counter + 1].click();
                counter++;
            }
            if (title_name.includes("习题")) {
                question_text = document.getElementsByClassName("question-title-text")[0];
                //题目类型
                let question_type_value = document.getElementsByClassName("questions-type-title")[0].innerHTML;
                //题目内容
                question_text_value = question_text.innerHTML;
                console.log(" ");
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'http://cx.icodef.com/wyn-nb',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded',
                        'Authorization': '',
                    },
                    data: 'question=' + encodeURIComponent(question_text_value),
                    onload: function (response) {
                        if (response.status == 200) {
                            let obj = $.parseJSON(response.responseText.replace(/^操作数据失败！/, '')) || {};
                            let flag = false; //是否查找到答案
                            console.log("题目:" + question_text_value + "的答案为:" + obj.data);
                            if(question_type_value.includes("单选题")){
                               let question_item =  document.querySelectorAll(".el-radio-group > .question-option-item > .el-radio > .el-radio__label");
                                for (let i = 0; i < question_item.length; i++) {
                                    //如果没有答案则随机选择答案
                                    if(obj.data.includes("未搜索到答案")){
                                        let j = Math.floor(Math.random()*question_item.length);
                                        question_item[j].click();
                                        break;
                                    }
                                    else if(question_item[i].innerText.includes(obj.data)){
                                        flag = true;
                                        question_item[i].click();
                                        break;
                                    }
                                }
                                //如果答案不匹配则随机选择答案
                                if(flag == false){
                                    let j = Math.floor(Math.random()*question_item.length);
                                    question_item[j].click();
                                }

                                //点击提交按钮
                                document.getElementsByClassName("el-button el-button--primary el-button--big")[0].click();
                            }
                            }
                        }
                    }
                );
            }else{
                //跳过视频
                document.getElementsByTagName("video")[0].currentTime = document.getElementsByTagName("video")[0].duration
            }
        }, 1000);
    }
    function auto_search() {
        const QUESTION = document.getElementsByTagName("pre");
        let counter = 0;
        const SEARCH = setInterval(function() {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'http://cx.icodef.com/wyn-nb',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded',
                    'Authorization': '',
                },
                data: 'question=' + encodeURIComponent(QUESTION[counter].innerHTML),
                onload: function (response) {
                    if (response.status == 200) {
                        let obj = $.parseJSON(response.responseText.replace(/^操作数据失败！/, '')) || {};
                        console.log(QUESTION[counter].innerHTML + "的答案为:" + obj.data);
                        counter++;
                    }
                }
            });

            if(counter == (QUESTION.length - 1)) {
                clearInterval(SEARCH);
                console.log("题目搜索完成");
            }
        }, 1000);
    }
})();