// ==UserScript==
// @name          四川干部学院学习助手
// @namespace     http://tampermonkey.net/
// @version       0.1.9
// @description   Automatically play and close video pages on a learning website
// @author        grok
// @match         https://web.scgb.gov.cn/*
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAUCAYAAABSx2cSAAACQElEQVQ4jX2TvWtVQRDFf7N370tyAwkPBQsNzzSmUCwUtFAEQ1IpQWxEIY0fCJJaG0WFaOFfYCGibVBE0cJKERRsDNqmSMAmgoJFkkd4uTsyuzcvNx+4MHB395w5Z3bmio6P012qINIH3AZeUJazZBmsrqYQgd5eyHMIAUd92aVIG9URVL8BZ/jPcpQlMUJIyvatOh0pzr0FrsSkPT0pzInhIjmppbBD5yx+AH8jwvsndDoTLCzA/DwsLSXbkby+RBxra6k2CMBCvDFHef6aZnOIZjMRzd0W5VOI3I1g722/HJ1YwkYDWq3nDA9DUaQzMxUBqYY58vwDzs0SwhtEmhGxXs7Kymmc24dqG+cK4Kejvx8GBkxtLdrJsuMRHMJIJNZXCCeB/ag+M4yjr4+YIM8fRssiBSL3UM22tTGEA7TbgnOjOLfbs7hotg7j/eWq+VOo+krV6kny5sZ7JcsOVWVecrF3jcZMbFE69DW79vEyJkl3R8iyqeqdJqxVo8DItjlKNi0uIvIu7svyHJ3O0ao7QzZhkzsOoBGL4hFF0SGEp92EG676rc97dySX5StUb1X1vgeWtkLMdnsb0bnv5Pl5lpeJ4dwK8HUTRvWXkb/sYPlGtGeTlXU7tlnZ+xnRsbFdwO96TlQ3Zt66kJQWgT1VSSZQWM1/gDs1sr3I9U0PF8KDLjE5ukCj0U6zDfb/toCrFeAxcALVOUSOAWcrdYubDA7O2ED5muI1RD7GSzgITNbasorqZ1TvI/IpugmBf1/u5Q8Br3fMAAAAAElFTkSuQmCC
// @grant         GM_setValue
// @grant         GM_getValue
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/543516/%E5%9B%9B%E5%B7%9D%E5%B9%B2%E9%83%A8%E5%AD%A6%E9%99%A2%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/543516/%E5%9B%9B%E5%B7%9D%E5%B9%B2%E9%83%A8%E5%AD%A6%E9%99%A2%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 日志内容
    let LOGS = ``;
    // 课程页面显示信息
    function showLogs() {
        if (!document.body) {
            console.log("加载信息框失败, 1秒后重试");
            setTimeout(showLogs, 1000);
        }
        // 信息框
        const noticeDiv = document.createElement('div');
        noticeDiv.textContent = "脚本加载完成";
        noticeDiv.id = "noticeDiv";
        // 日志框
        const logsDiv = document.createElement('div');
        logsDiv.id = 'logsDiv';
        LOGS = `如果只学习"必修/选修"\n点击[课程表-课程类型]中对应选项再点击[开始学习]按钮`;
        logsDiv.innerText = LOGS;
        // 开始按钮
        const startBtn = document.createElement('button');
        startBtn.id = "startBtn";
        startBtn.textContent = "开始学习"
        startBtn.addEventListener("click", () => {
            startBtn.textContent = "重置学习状态"
            GM_setValue("isPlaying", false);
            setTimeout(goToNextVideo, 2000);
        })
        // logsDiv startBtn加入noticeDiv
        noticeDiv.appendChild(logsDiv);
        noticeDiv.appendChild(startBtn);
        // noticeDiv 加入 body
        document.body.appendChild(noticeDiv);
        // 设置信息框样式
        const style = document.createElement('style');
        style.textContent = `
            #startBtn {
                font-weight: bold;
                background-color: white;
                color: #5209c794;
                border: none;
                cursor: pointer;
                transition: background-color 0.3s ease;
                border-radius: 8px;
                padding: 5px 10px;
                position: absolute;
                bottom: 5px;
            }
            #startBtn:hover {
                background-color: #5209c794;
                color: white;
            }
            #noticeDiv{
                position: fixed;
                bottom: 60%;
                left: 50%;
                background-color: rgba(0, 0, 0, 0.4);
                color: #fff;
                padding: 6px 10px;
                border-radius: 4px;
                font-size: 14px;
                z-index: 99999;
                min-width: 25%;
                min-height: 30%;
                box-shadow: 0 2px 6px rgba(0,0,0,.3);
            }
        `;
        document.head.appendChild(style);
    }

    // 更新日志显示
    function updateLogs(log) {
        const logsDiv = document.querySelector("#logsDiv");
        if (!logsDiv) {
            console.log("更新日志失败");
            return;
        }
        LOGS += `\n${new Date().toLocaleTimeString()} ${log}`;
        LOGS = LOGS.split('\n').slice(-8).join('\n');
        logsDiv.innerText = `\n${LOGS}`;
    }

    // 课程列表已激活页码
    function getPageNumber() {
        const activePage = document.querySelector(".ivu-page-item-active");
        return activePage ? activePage.title : "未知";
    }

    // 当前页面未学习完成的课程
    function getVideoDivs() {
        const divs = Array.from(document.querySelectorAll('.hover-shadow')).filter((div) => {
            const timesElement = div.querySelector('.fs_16.c_999');
            if (!timesElement) {
                console.log('未找到学时元素，跳过此 div:', div);
                return false;
            }
            const times = timesElement.innerText.match(/(\d+(\.\d+)?)\s*学时/g)?.map(h => parseFloat(h)) || [0, 0];
            console.log('视频学时:', timesElement.innerText, '解析结果:', times);
            return times[0] < times[1];
        });
        console.log('找到视频列表，长度:', divs.length);
        updateLogs("当前页未学习完成课程 " + divs.length + " 个")
        return divs;
    }

    // 标记当前页面点击过的序号
    function markAsLearned(index) {
        const learnedVideos = GM_getValue('learnedVideos', []);
        if (!learnedVideos.includes(index)) {
            learnedVideos.push(index);
            GM_setValue('learnedVideos', learnedVideos);
        }
    }

    // 查找下一个课程,开始学习
    function goToNextVideo() {
        console.log('检查下一个视频:', new Date().toLocaleTimeString(), 'isPlaying:', GM_getValue('isPlaying', false));
        // 正在播放视频, 2秒后重试
        if (GM_getValue('isPlaying', false)) {
            setTimeout(goToNextVideo, 2000);
            return;
        }
        // 当前页面未完成学习的课程
        const videoDivs = getVideoDivs();
        console.log('videoDivs 长度:', videoDivs.length);
        // 当前页面已点击过的课程序号
        const learnedVideos = GM_getValue('learnedVideos', []);
        // 下一个未点击的课程序号
        let nextIndex = videoDivs.findIndex((_, index) => !learnedVideos.includes(index));

        // 当前页面学习完成
        if (videoDivs.length === 0 || nextIndex === -1) {
            // 下一页按钮
            const nextPageButton = document.querySelector('.ivu-page-next');
            console.log('下一页按钮:', nextPageButton, '是否禁用:', nextPageButton?.classList.contains('ivu-page-disabled'));
            if (nextPageButton && !nextPageButton.classList.contains('ivu-page-disabled')) {
                console.log('本页视频已学习完成，跳转到下一页');
                updateLogs('本页视频已学习完成,跳转到下一页');
                GM_setValue('learnedVideos', []);
                nextPageButton.click();
                setTimeout(goToNextVideo, 2000);
            } else {
                console.log('所有视频学习完成！');
                updateLogs('所有视频学习完成！');
                GM_setValue('learnedVideos', []);
                GM_setValue('isPlaying', false);
            }
            return;
        }
        // 要学习的视频课程
        const videoDiv = videoDivs[nextIndex];
        GM_setValue('isPlaying', true);
        // 标记该序号已点击
        markAsLearned(nextIndex);
        console.log(`播放视频：索引 ${nextIndex}, 时间: ${new Date().toLocaleTimeString()}`);
        updateLogs(`播放视频：索引 ${nextIndex}`);
        try {
            videoDiv.click();
            setTimeout(goToNextVideo, 10000);
        } catch (err) {
            console.log('点击视频失败:', err);
            GM_setValue('isPlaying', false);
            setTimeout(goToNextVideo, 2000);
        }
    }

    // 检查视频播放页正在播放的视频序号
    function courseID() {
        // 左侧视频清单, 一个视频课程可能有多个视频, 清单在此div显示
        const tabList = document.querySelectorAll('.tab-list > .item');
        // 清单中正在播放序列号
        let i = 0;
        for (i = 0; i < tabList.length; i++) {
            if (tabList[i].classList.contains("active")) {
                // 找到正在播放的序号
                break;
            }
        }
        return i;
    }
    // 检查视频播放状态,服务端错误返回false
    function checkVideoStat() {
        // 视频播放控件
        const video = document.querySelector('video');
        // 服务端错误,无法播放
        if (video.currentTime == 0) {
            return false;
        }
        return true;
    }
    // 视频播放页面,检查最后一个视频是否完成播放,完成播放->关闭页面
    function checkVideoEnd() {
        // 左侧视频清单, 一个视频课程可能有多个视频
        const tabList = document.querySelectorAll('.tab-list > .item');
        // 视频播放控件
        const video = document.querySelector('video');
        // 没有找到视频清单的div,2秒后重试
        if (!tabList) {
            console.log('未找到 tab-list，稍后重试');
            setTimeout(checkVideoEnd, 2000);
            return;
        }
        // 没有找到视频控件,2秒后重试
        if (!video) {
            console.log('未找到视频元素，稍后重试');
            setTimeout(checkVideoEnd, 2000);
            return;
        }
        // 视频暂停,尝试播放
        if (video.paused) {
            try {
                video.play();
            } catch (err) {
                console.log('自动播放失败：', err)
            }
        }
        // 清单中正在播放序列号
        let i = courseID();
        console.log("courseID: ", i);
        // 2秒后检查是否为服务端错误,视频不能正常播放,尝试播放清单中的下一个
        // 如果是列表中最后一个播放失败,关闭标签页
        setTimeout(() => {
            // 服务端异常
            if (!checkVideoStat()) {
                // 序号i不是列表中最后一个,播放下一个,20秒后重新检查
                if (i < tabList.length - 1) {
                    tabList[i + 1].click();
                    setTimeout(checkVideoEnd, 20000);
                    return;
                } else {
                    GM_setValue('isPlaying', false);
                    window.close();
                }
            }
        }, 2000);
        // 不是正在播放最后一个视频,20秒后重新检查
        if (i != tabList.length - 1) {
            console.log('未到最后一个 tab,20秒后重试');
            setTimeout(checkVideoEnd, 20000);
            return;
        }
        // 播放的是最后一个视频,结束后关闭页面,设置播放状态为未播放
        video.onended = () => {
            console.log('视频播放结束，关闭页面');
            GM_setValue('isPlaying', false);
            try {
                window.close();
            } catch (err) {
                console.log('关闭页面失败：', err);
            }
        };
    }

    window.addEventListener('load', () => {
        // 课程列表页
        const isClassPage = window.location.href.includes('/myClass?id=');
        // 视频播放页
        const isCoursePage = window.location.href.includes('/course?id=');
        if (isClassPage) {
            setTimeout(showLogs, 2000);
            updateLogs(`正在学习第 ${getPageNumber()} 页`);
            const options = document.querySelector(".ivu-page-options");
            if (options) {
                options.remove();
                updateLogs("删除显示数量选项标签");
            }
            GM_setValue('learnedVideos', []);
            updateLogs("清空已学习记录");
            GM_setValue('isPlaying', false);
            updateLogs("重置播放状态，请手动关闭已打开的播放网页");
            return;
        }
        // 视频播放页面
        if (isCoursePage) {
            checkVideoEnd();
        }
    });
    window.onbeforeunload = () => {
        GM_setValue('isPlaying', false);
    };
})();
