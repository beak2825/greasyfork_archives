// ==UserScript==
// @name         时代光华课程学习自动脚本
// @namespace    https://github.com/zhengchuan
// @version      0.4
// @description  时代光华课程自动学习，自动进入学习，定时刷新课程页面，自动点击下一步，自动课程评价满分
// @author       zhengchuan
// @match        https://v4.21tb.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=21tb.com
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462760/%E6%97%B6%E4%BB%A3%E5%85%89%E5%8D%8E%E8%AF%BE%E7%A8%8B%E5%AD%A6%E4%B9%A0%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/462760/%E6%97%B6%E4%BB%A3%E5%85%89%E5%8D%8E%E8%AF%BE%E7%A8%8B%E5%AD%A6%E4%B9%A0%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let util = {
        url_course_info:'https://v4.21tb.com/els/html/course/course.courseInfo.do',
        url_course_learn:'https://v4.21tb.com/els/html/courseStudyItem/courseStudyItem.learn.do',
        url_course_eval:'https://v4.21tb.com/els/html/studyCourse/studyCourse.enterCourse.do',
        /**
         * 初始化加载，全局入口
         */
        init : function(){
            let url = location.href;
            // 自动点击“进入学习”
            if(url.startsWith(this.url_course_info)){
                util.autoCourseInfo();
            }
            // 自动完成学习
            if(url.startsWith(this.url_course_learn)){
                util.autoCourseLearn();
            }
            // 自动评分
            if(url.startsWith(this.url_course_eval)){
                util.autoCourseEval();
            }
        },
        /**
         * 课程信息页面自动点击“进入学习”
         */
        autoCourseInfo : function(){
            $("#goStudyBtn")[0].click();
        },
        /**
         * 自动学习课程 （监控进度自动点击下一步，定时刷新页面）
         */
        autoCourseLearn : function(){
            setInterval(function(){
                learnUtil.auto();
            },learnUtil.offset);
        },
        /**
         * 课程学习自动评分（默认满分）
         */
        autoCourseEval : function(){
            $("body > article > div > div.cs-test-head.cs-evaluate-head > div > p.cs-eval-score > input:nth-child(9)").click();
            $("#courseEvaluateForm > div:nth-child(2) > ul > li:nth-child(1) > div.cs-test-option.cs-test-radio.cs-test-radio-last").click();
            $("#courseEvaluateForm > div:nth-child(2) > ul > li:nth-child(2) > div.cs-test-option.cs-test-radio.cs-test-radio-last").click();
            $("#courseEvaluateForm > div:nth-child(2) > ul > li:nth-child(3) > div.cs-test-option.cs-test-radio.cs-test-radio-last").click();
            $("#courseEvaluateForm > div:nth-child(2) > ul > li:nth-child(4) > div.cs-test-option.cs-test-radio.cs-test-radio-last").click();
            $("#courseEvaluateSubmit").click();
            $("#layui-layer1 > div.layui-layer-btn > a.layui-layer-btn1")[0].click();
        }
    };

    /**
     * 自动学习相关方法参数
     */
    let learnUtil = {
        // 间隔次数计数
        count : 0,
        // 定时任务间隔
        offset : 10000,
        // 自动操作
        auto : function(){
            // 下一步按钮可见时自动点击下一步
            let nextBtn = $("#goNextStep");
            if(nextBtn.is(":visible")){
                $("#goNextStep").click();
                return;
            }
            // 630秒自动刷新页面
            learnUtil.count++;
            console.log(learnUtil.count);
            if(learnUtil.count * learnUtil.offset / 1000 > 630){
                location.reload();
            }
        }
    }

    // 执行方法
    util.init();

})();
