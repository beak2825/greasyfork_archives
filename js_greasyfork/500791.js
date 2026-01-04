// ==UserScript==
// @name         酷学院自动播放
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  酷学院实现自动播放
// @author       qiuqiu_xqy
// @match        *://pro.coolcollege.cn/*
// @icon         https://s21.ax1x.com/2024/06/06/pkYKwxx.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500791/%E9%85%B7%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/500791/%E9%85%B7%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==


const event = document.createEvent("Events");
event.initEvent("click", true, false);

(function () {
    'use strict';
    // Your code here...

    setInterval(task, 2000);

})();

function task() {
    let currentUrl = window.location.href;
    if (currentUrl.indexOf("home") > -1) {
        //首页
        isHome();
    } else if (currentUrl.indexOf("personal/profile") > -1) {
        //个人中心
        isPersonalCenter();
    } else if (currentUrl.indexOf("trainingProject/traineeView") > -1) {
        //视频列表-学习项目
        isViewList1();
    } else if (currentUrl.indexOf("myObligatoryTaskView") > -1) {
        //视频列表-学习任务
        isViewList2();
    } else if (currentUrl.indexOf("task/learningProject") > -1) {
        //视频播放-学习项目
        isViewVideo1();
    } else if (currentUrl.indexOf("watchTask") > -1) {
        //视频播放-学习任务
        isViewVideo2();
    }
}

function isHome() {
    let personal = document.querySelector("#guide-personal");
    if (!personal) {
        return;
    }
    personal.dispatchEvent(event);
}

function isPersonalCenter() {
    let learningTaskList = document.querySelector(".ant-tabs-nav-list");
    if (!learningTaskList) {
        return;
    }
    //学习项目
    let learningProject = learningTaskList.children[0];
    if (!learningProject) {
        return;
    }
    learningProject.dispatchEvent(event);

    let taskCardList1 = document.querySelectorAll("[class*='taskCard___']");
    if (!taskCardList1) {
        return;
    }
    let i = 0;
    while (i < taskCardList1.length) {
        let taskCard1 = taskCardList1[i];
        if (!taskCard1) {
            return;
        }
        let spans = taskCard1.querySelectorAll("[class*='taskCard-footer___'] span");
        if (!spans) {
            return;
        }
        if (spans.length >= 2) {
            if (spans[1].textContent === "进行中") {
                taskCard1.dispatchEvent(event);
                return;
            }
        }
        i++;
    }


    //学习任务
    let learningTask = learningTaskList.children[1];
    if (!learningTask) {
        return;
    }
    learningTask.dispatchEvent(event);

    let taskCardList = document.querySelectorAll(".obligatory_taskCard");
    if (!taskCardList) {
        return;
    }
    let taskCard = taskCardList[0];
    if (!taskCard) {
        return;
    }
    let taskCardFooter = taskCard.querySelector(".obligatory_taskCard__footer");
    if (!taskCardFooter) {
        return;
    }
    if (taskCardFooter.children.length < 2) {
        let taskCardBody = taskCard.querySelector(".obligatory_taskCard__body");
        if (!taskCardBody) {
            return;
        }
        taskCardBody.dispatchEvent(event);
    }
}

function isViewList1() {
    let list = document.querySelectorAll("[class*='child-panel-content___']");
    if (!list) {
        return;
    }
    for (let i = 0; i < list.length; i++) {

        let svgElement = list[i].querySelector("svg");

        // 获取第二个路径元素（进度路径）
        const path = svgElement.querySelector('.ant-progress-circle-path');

        if (!path) {
            return false;
        }

        // 获取 stroke-dasharray 属性值
        const dasharray = path.style.strokeDasharray;

        if (!dasharray) {
            return false;
        }

        // 分割成两个数值
        const [dash, gap] = dasharray.split('px,').map(str => parseFloat(str));

        // 如果第一个值等于第二个值，说明进度是100%
        let isProgress100 = Math.abs(dash - gap) < 0.001; // 使用容差处理浮点数精度问题

        if (!isProgress100) {
            list[i].querySelector("[class*='action___'] span").dispatchEvent(event);
            return;
        }
    }
    isHome();
}

function isViewList2() {
    let list = document.querySelectorAll("tr.expand-list tr");
    if (!list) {
        return;
    }
    for (let i = 0; i < list.length; i++) {
        let row = list[i];
        let rowProgress = row.children[2];
        let rowOperation = row.children[3];
        if (!rowProgress) {
            return;
        }
        let rowProgressLabel = rowProgress.querySelector(".ant-progress-text");
        if (!rowProgressLabel) {
            return;
        }
        let rowProgressLabelTitle = rowProgressLabel.getAttribute("title");
        if (typeof (rowProgressLabelTitle) == 'object') {
            continue;
        }

        if (!rowOperation) {
            return;
        }
        //当前视频未学习完
        let startStudy = rowOperation.children[0];
        if (!startStudy) {
            return;
        }
        startStudy.dispatchEvent(event);
        return;
    }
    isHome();
}

function isViewVideo1() {
    let video = document.querySelector("video");
    if (!video) {
        return;
    }
    if (video.currentTime === video.duration) {
        //判断是否为最后一个视频播放完
        let listBox = document.querySelector(".ant-collapse-content .ant-collapse-content-box");
        if (!listBox) {
            return;
        }
        let items = listBox.querySelectorAll("[class*='resource_box___']");
        if (!items) {
            return;
        }
        if (items.length === 0) {
            return;
        }
        let lastItem = items[items.length - 1];
        let isActive = Array.from(lastItem.classList).some(className =>
            className.startsWith('is_active___')
        );

        if (!isActive) {
            return;
        }
        history.go(-2);
    } else {
        let antModal = document.querySelector(".ant-modal");
        if (!antModal) {
            return;
        }
        if (antModal.style.display !== "none") {
            //有弹窗
            let btn = antModal.querySelector(".ant-btn-primary");
            if (btn) {
                btn.dispatchEvent(event);
            }
        } else {
            //无弹窗
            let playBtn = document.querySelector(".prism-big-play-btn");
            if (!playBtn) {
                return;
            }
            if (playBtn.style.display === "block") {
                playBtn.dispatchEvent(event);
                video.play();
            }
        }
    }
}

function isViewVideo2() {
    let video = document.querySelector("video");
    if (!video) {
        return;
    }
    if (video.currentTime === video.duration) {
        let returnBtn = document.querySelector(".ant-btn-link");
        if (!returnBtn) {
            return;
        }
        returnBtn.dispatchEvent(event);
    } else {
        let antModal = document.querySelector(".ant-modal");
        if (!antModal) {
            return;
        }
        if (antModal.style.display !== "none") {
            //有弹窗
            let btn = antModal.querySelector(".ant-btn-primary");
            if (btn) {
                btn.dispatchEvent(event);
            }
        } else {
            //无弹窗
            let playBtn = document.querySelector(".prism-big-play-btn");
            if (!playBtn) {
                return;
            }
            if (playBtn.style.display === "block") {
                playBtn.dispatchEvent(event);
                video.play();
            }
        }
    }
}