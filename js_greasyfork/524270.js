// ==UserScript==
// @name 灯塔在线-dy网络学院
// @namespace    **************
// @version      1.2
// @match        *.dtdjzx.gov.cn/course/special/*
// @match        *.dtdjzx.gov.cn/*
// @author      xigua
// @description sddy网络学院在线挂机学习脚本
// @run-at       document-start
// @grant        none
// @license MIT

// @downloadURL
// @updateURL


// @downloadURL https://update.greasyfork.org/scripts/524270/%E7%81%AF%E5%A1%94%E5%9C%A8%E7%BA%BF-dy%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/524270/%E7%81%AF%E5%A1%94%E5%9C%A8%E7%BA%BF-dy%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2.meta.js
// ==/UserScript==
/*---------------------------------------------------------
描述:   灯塔党员网络学院学习
根据郭和lute的脚本改写，重点解决课程页面不自动播放的问题
安装脚本进入课程资源页面后，刷新页面脚本自动执行
----------------------------------------------------------*/
(function() {
    'use strict';

    /***********************  公共  ***************************/
    const Env = {
        app: document.querySelector('.resource')?.__vue__ || document.querySelector('.main_main')?.__vue__,
        timeTable: undefined,
        handler: null,
        autoExam: true,

        get name() {
            return this.app?.$route?.name;
        },

        get courseCount() {
            return this.fit({
                'course-resources': this.app?.holdList.length
            });
        },

        get courseList() {
            return this.app?.holdList;
        },

        fit(obj) {
            var result = obj[this.name];
            this.validate(result);
            return result;
        },

        validate(result) {
            if (result === undefined) console.warn("读取值失败,可能本页无该值,页面--", this.name);
        },

        update() {
            this.app = document.querySelector('.resource')?.__vue__ || document.querySelector('.main_main')?.__vue__;
            this.timeTable = undefined;
            clearInterval(this?.timerId);
        }
    };

    /***********************  初始化 *****************************/
    function initEnv() {
        let panelNode = document.querySelector('.bottom') || document.querySelector('.title-r');
        if (!panelNode) {
            setTimeout(initEnv, 1000);
            return;
        }

        panelNode.style.cssText += "width:250px";
        panelNode.outerHTML = `
            <ul x-data="{message:'hh',tip:''}" x-init="window.monkeydata=$data">
            <li x-text="message" style="font-size:14px"></li>
            <li x-text="tip" style="font-size:18px"></li>
            </ul>`;

        let scriptNode = document.createElement('script');
        scriptNode.src = "https://unpkg.com/alpinejs@3.10.3/dist/cdn.min.js";
        scriptNode.defer = true;
        document.head.appendChild(scriptNode);

        document.addEventListener('alpine:initialized', () => {
            showMsg('脚本.....ok');
            routerHook();
        });
    }

    /***********************  显示消息 *****************************/
    function showMsg(msg, type = 'msg') {
        if (window.monkeydata == undefined) {
            console.error('Alpinejs存在错误');
            return;
        }
        if (type == 'msg') {
            window.monkeydata.message = msg;
        } else {
            window.monkeydata.tip = msg;
        }
    }

    /***********************  调度  *****************************/
    function strategies() {
        Env.update();
        switch (Env.name) {
            case 'projectDetail':
                break;
            case 'course-resources':
                showMsg('course-resources');
                timeTableHook();
                getCourseList().then(makeTable);
                break;
            case 'course-detail':
                xq();
                break;
            default:
                showMsg('课程资源目录');
        }
    }

    function routerHook() {
        setTimeout(strategies, 5000);
    }

    function timeTableHook() {
        Env.timerId = setInterval(() => {
            if (!Env.timeTable) return;
            if (Env.handler?.closed == false) return;

            var c = Env.timeTable.next();
            if (c.done) {
                console.log('全学完 点击下一页');
                document.querySelector('.btn-next').click();
                Env.update();
                routerHook();
                return;
            }
            Env.handler = window.open(c.value);
        }, 2000);
    }

    /***********************  课程  *****************************/
    function getCourseList() {
        showMsg('获取课表......');
        return new Promise((resolve, reject) => {
            try {
                resolve(Env.courseList);
            } catch (error) {
                reject(error);
            }
        });
    }

    function makeTable(res) {
        console.log('课表.......ok', res);
        showMsg('课表......ok');
        Env.timeTable = {
            courseList: res,
            index: 0,
            next() {
                var done = this.index >= this.courseList.length;
                showMsg(`第${this.index + 1}课...共${this.courseList.length}课`, 'info');
                if (done) {
                    console.warn('没有下一课了');
                    return { done: true, value: undefined };
                }
                var course = this.courseList[this.index++];
                console.log('准备......', course.courseName);
                showMsg(course.courseName);
                if (course.studyStatus == 2) { return this.next(); }
                else return { done: false, value: `https://dywlxy.dtdjzx.gov.cn/course-resources/course/course-detail?id=${course.id}` };
            }
        };
    }

 /***********************  播放  *****************************/
    let sleep = function(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    };

    function autoPlayVideo() {
        var videoElement = document.querySelector('video');

        if (videoElement) {
            videoElement.muted = true;
            videoElement.play().then(() => {
                console.log("Video played successfully");
                addPauseListener(videoElement);
                addEndedListener(videoElement);
            }).catch(error => {
                console.error("Error playing video:", error);
            });
        } else {
            console.log("No video element found on the page.");
        }
    }

    function addPauseListener(videoElement) {
        videoElement.addEventListener('pause', () => {
            console.log("Video paused, attempting to play...");
            videoElement.play().catch(error => {
                console.error("Failed to resume video:", error);
            });
        });
    }

    function addEndedListener(videoElement) {
        videoElement.addEventListener('ended', async () => {
            console.log("Video ended, waiting for 10 seconds before closing...");
            await sleep(10000); // Wait for 10 seconds
            console.log("Closing page...");
            window.close();
        });
    }

    window.addEventListener('load', () => {
        autoPlayVideo();
        var intervalId = setInterval(() => {
            var videoElement = document.querySelector('video');
            if (videoElement && !videoElement.paused) {
                clearInterval(intervalId);
            } else if (videoElement) {
                autoPlayVideo();
            }
        }, 500);
    });

    initEnv();
})();

