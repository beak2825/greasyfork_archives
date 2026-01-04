// ==UserScript==
// @name         思纽教育（自动播放 | 自动换课 | 视频倍速）
// @version      1.2
// @description  遵义医科大、广西医科大、广西科技大等使用思纽系统的基本都适用！
// @author       白衬（微信：XLTK-88）
// @match        *://*.edueva.org/*
// @icon         http://www.isiniu.com/img/logo/logo.png
// @grant        none
// @namespace    https://greasyfork.org/users/973431
// @downloadURL https://update.greasyfork.org/scripts/515884/%E6%80%9D%E7%BA%BD%E6%95%99%E8%82%B2%EF%BC%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%20%7C%20%E8%87%AA%E5%8A%A8%E6%8D%A2%E8%AF%BE%20%7C%20%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/515884/%E6%80%9D%E7%BA%BD%E6%95%99%E8%82%B2%EF%BC%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%20%7C%20%E8%87%AA%E5%8A%A8%E6%8D%A2%E8%AF%BE%20%7C%20%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const createStatusUI = () => {
        const statusPanel = document.createElement('div');
        statusPanel.id = 'autoPlayStatus';
        statusPanel.style.position = 'fixed';
        statusPanel.style.top = '10px';
        statusPanel.style.left = '10px';
        statusPanel.style.zIndex = '999999';
        statusPanel.style.padding = '10px';
        statusPanel.style.backgroundColor = '#D3D3D3';
        statusPanel.style.color = 'black';
        statusPanel.style.borderRadius = '5px';
        statusPanel.style.fontFamily = 'Arial, sans-serif';
        statusPanel.style.fontSize = '14px';
        statusPanel.style.display = 'none';
        statusPanel.style.lineHeight = '1.5';
        document.body.appendChild(statusPanel);
    };

    const getCourseTitle = () => {
        const courseTitleElement = document.querySelector('.play_title h2');
        return courseTitleElement ? courseTitleElement.textContent.trim() : '未知课程';
    };

    const updateStatusUI = (courseTitle) => {
        const statusPanel = document.getElementById('autoPlayStatus');
        if (statusPanel) {
            statusPanel.style.display = 'block';
            statusPanel.innerHTML = `
                <strong>当前课程为:</strong><span style="color: black;">《${courseTitle}》</span>
                <strong>当前状态:</strong><span style="color: green;">自动播放 | 自动换课</span>
                 <div id="speedControl">
                    <strong><label for="speedInput">倍速控制:</label></strong><span style="color: red;">谨用！</span>
                    <input type="number" id="speedInput" value="2" min="2" max="8">
                    <button id="confirmSpeed">确定</button>
                </div>
                <strong>公告：</strong><span style="color: black; font-weight: normal;">未自动播放的请手动点击下一个视频！各大高校继续教育网课请加微信：XLTK-88（承诺：挂科包赔！完美售后！视频、作业、考试等全包！）</span>
            `;
        }
    };

    const autoPlayVideo = () => {
        const video = document.querySelector('video');
        if (video && video.paused) {
            video.play();
        }

        const modal = document.querySelector('.layui-layer-btn0');
        if (modal) {
            modal.click();
        }
    };

    const initSpeedControl = () => {
        const speedInput = document.getElementById('speedInput');
        const confirmSpeed = document.getElementById('confirmSpeed');
        const video = document.querySelector('video');

        confirmSpeed.addEventListener('click', () => {
            let speed = parseInt(speedInput.value, 10);
            if (isNaN(speed) || speed < 1 || speed > 8) {
                alert("最高倍数为：8倍");
                return;
            }
            if (video && typeof video.playbackRate !== 'undefined') {
                video.playbackRate = speed;
            } else {
                alert("倍速设置失败，该平台限制倍数播放。");
            }
        });
    };

    createStatusUI();

    const courseTitle = getCourseTitle();

    updateStatusUI(courseTitle);

    initSpeedControl();

    setInterval(() => {
        autoPlayVideo();
    }, 1000);
})();