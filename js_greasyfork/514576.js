// ==UserScript==
// @name         yuncourse
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  屏蔽云课堂挂机检测脚本
// @author       Vstay
// @match        *://*.yunxuetang.cn/*
// @icon         https://yunketang.cn/static/images/xsct-icon-5@2x-87dbb0b9f0.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514576/yuncourse.user.js
// @updateURL https://update.greasyfork.org/scripts/514576/yuncourse.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 添加错误计数器
    let errorCount = 0;
    const MAX_ERRORS = 5;

    var time = getTimes();
    var str = "display: none;";
    var str2 = "dialog-fade-leave";
    var play_btn = 0; var continue_to_learn = 0; var elem = 0; var congratulate_str = 0;
    let obj = { 'autoplay': true, 'muted': true };
    console.log('It\'s running Now');

    // 主要检测函数
    const mainCheck = async () => {
        try {
            var i = 0; var j = 0; var RootNode = 0; var finishsign = 0; var next_course = 0; var next_course2 = 0; var begin_to_learn = 0; var lesson_finish = 0; var courses = 0; var courses_length = 0; var lesson_num = 0;
            // 开始学习按钮
            // v1.0旧版
            // begin_to_learn = document.getElementsByClassName("kngpc-playbutton kngpc-playbutton__primary");
            // v2.0新版
            begin_to_learn = document.getElementsByClassName("yxtf-button yxtf-button--primary yxtf-button--larger");
            if (begin_to_learn != 0) {
                if (begin_to_learn.length != 0) {
                    begin_to_learn[0].click();
                }
            }
            play_btn = document.querySelector('video');
            finishsign = document.getElementsByClassName("yxtulcdsdk-course-player__countdown standard-size-12 yxtulcdsdk-flex-center");
            // 旧版需要判断当前任务完成，关闭评价，点击下一任务
            // v2.0新版直接判断剩余时间，学习时间结束，点击下一任务
            if (finishsign.length == 0) {
                next_course = document.getElementsByClassName("yxtf-button ml12 yxtf-button--default is-plain is-icon")[0];
                next_course2 = document.getElementsByClassName("ulcdsdk-nextchapterbutton")[0];
                sleep(1000);
                next_course.click();
                sleep(1000);
                next_course2.click();
                sleep(1000);
                // 发现点击之后需要刷新，v1.1修复bug
                location.reload();
            }
            // 判断当前小节已完成，跳转到下一小节
            lesson_finish = document.getElementsByClassName("yxtbiz-language-slot");
            // 重新学习按钮不点击，不会显示完成进度。v1.4修复bug
            try {
                congratulate_str = document.getElementsByClassName("font-size-16 text-bf")[0].innerText;
            }
            catch (e) { }
            // 获取所有小节元素
            courses = document.getElementsByClassName("d-in-block ellipsis-2 kng-chapter-title");
            courses_length = courses.length;
            if (lesson_finish.length === 0) {
                // 修复对课程完成的判断，小版本更新v1.3
                if (congratulate_str === '恭喜您已完成本课程的学习。') {
                    console.log("lesson finished");
                    lesson_num = get_current_lesson_num(courses);
                    if (lesson_num + 1 < courses_length) {
                        courses[lesson_num + 1].click();
                    }
                    else {
                        //如果小节看完自动跳转到下一任务，小版本更新v1.2
                        next_course = document.getElementsByClassName("yxtf-button yxtf-button--primary")[0];
                        next_course.click();
                    }
                }
            }
            elem = document.getElementsByClassName("yxt-dialog__wrapper");
            // v1.0旧版判断是否有“继续学习”按钮，点击后判断视频是否在播放状态，使视频播放
            // continue_to_learn = document.getElementsByClassName("yxtf-button mr8 yxtf-button--primary yxtf-button--larger2");
            // v2.0新版
            continue_to_learn = document.getElementsByClassName("yxtf-button yxtf-button--primary yxtf-button--large");
            // 点击“继续学习”按钮
            if (continue_to_learn[0] != undefined) {
                continue_to_learn[0].click();
            }
            // 使视频播放（添加属性，防止chrome报错），使用try...catch丢弃报错
            try {
                play_btn.setAttribute('autoplay', 'true');
                play_btn.setAttribute('muted', 'true');
                if (play_btn.paused) {
                    play_btn.play();
                }
            }
            catch (e) { }

            // 循环找到挂机检测弹窗节点
            for (i = 0; i < elem.length; i++) {
                if (elem[i].attributes[2] != undefined) {
                    if (elem[i].attributes[2].nodeValue.indexOf(str) == -1) {
                        // 发现bug，添加一个判断
                        if (elem[i].attributes[1].nodeValue.indexOf(str2) == -1) {
                            RootNode = elem[i];
                            console.log(RootNode);
                        }
                    }
                }
            }
            if (RootNode === 0) {
                console.log("no alert. dialog-center display none.");
                return;
            }
            var btn = RootNode.getElementsByClassName("dialog-footer")[0];
            var center = document.getElementsByClassName("dialog-center");
            console.log("触发挂机弹窗");
            if (!btn) {
                console.log("dialog-footer classname elements not found.");
                return;
            }
            var res = btn.innerText;
            console.log(res);
            if (res != "继续学习") {
                btn = document.getElementsByClassName("dialog-footer")[2];
            }
            console.log("点击继续学习");
            // 点击继续学习按钮
            btn.getElementsByClassName("yxtf-button yxtf-button--primary yxtf-button--large")[0].click();

            // 重置错误计数
            errorCount = 0;

        } catch (error) {
            console.error('检测过程出错:', error);
            errorCount++;

            // 如果错误次数过多，重新加载页面
            if (errorCount >= MAX_ERRORS) {
                console.log('错误次数过多，准备重新加载页面...');
                location.reload();
                return;
            }
        }
    };

    // 使用防抖包装主检测函数
    const debouncedCheck = debounce(mainCheck, 1000);

    // 修改interval的调用方式
    var tm = setInterval(debouncedCheck, time);

    // 添加清理函数
    window.addEventListener('beforeunload', () => {
        clearInterval(tm);
    });
})();

function getTimes() {
    var times = Math.random() * 8 + 1;//1-9
    times = 5 * 1000 * 1;//+times*10
    return times
}

function get_current_lesson_num(courses) {
    var courses_length = 0;
    courses_length = courses.length;
    if (courses_length > 0) {
        for (var i = 0; i < courses_length; i++) {
            if (courses[i].className.indexOf("color-primary-6") != -1) {
                return i;
            }
        }
    }
    else {
        return 0;
    }
}

// 修改sleep函数
function sleep(time) {
    return new Promise((resolve) => {
        const timeout = setTimeout(resolve, time);
        // 添加清理机制
        window.addEventListener('beforeunload', () => {
            clearTimeout(timeout);
        });
    });
}
