// ==UserScript==
// @name         传智自动播放视频
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动播放传智播客课程视频, 开发者博客:http://www.nothamor.cn
// @author       nothamor
// @match        *.ityxb.com/*
// @homepage     https://www.nothamor.cn/
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/405920/%E4%BC%A0%E6%99%BA%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/405920/%E4%BC%A0%E6%99%BA%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.meta.js
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
            auto_play();
            console.log("检测到为视频播放页面, 开始自动播放视频");
        }
    }, 5000);

    function auto_play() {
        const CLASS_LIST = document.getElementsByClassName("point-progress-box");
        const CLASS_NAME = document.getElementsByClassName("point-text ellipsis");
        let question_text = document.getElementsByTagName("pre")[0];
        let player = document.getElementsByTagName("video")[0].id;
        let question_text_value;
        document.getElementById(player).click();
        let counter = 0;
        const TIMER = setInterval(function () {
            let percent = CLASS_LIST[counter].innerHTML.replace(/\ +/g, "").replace(/[\r\n]/g, "");
            let title_name = CLASS_NAME[counter].innerHTML.replace(/\ +/g, "").replace(/[\r\n]/g, "");
            if (percent.includes("100%") && counter == (CLASS_LIST.length - 1)) {
                clearInterval(TIMER);
                alert("当前页面所有视频播放完成");
            } else if (percent.includes("100%")) {
                CLASS_LIST[counter + 1].click();
                player = document.getElementsByTagName("video")[0].id;
                document.getElementById(player).click();
                counter++;
            }
            if (title_name.includes("习题")) {
                question_text = document.getElementsByTagName("pre")[0];
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
                            console.log("题目:" + question_text_value + "的答案为:" + obj.data);
                        }
                    }
                });
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