// ==UserScript==
// @name         视频单P总时长
// @namespace    https://www.bilibili.com/video
// @version      1.3
// @description  多分P视频的每一P，在单P时长后面加上当P及当P之前所有视频的总时长
// @author       bird blue
// @author       azwcl
// @match        https://www.bilibili.com/video/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475246/%E8%A7%86%E9%A2%91%E5%8D%95P%E6%80%BB%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/475246/%E8%A7%86%E9%A2%91%E5%8D%95P%E6%80%BB%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let functionUpdating = false;

    /**
     * 获取持续时间
     * @param durationString 每个 video 标签后面的时间
     * @returns {*} 返回时间 单位：s
     */
    const getDurationInSeconds = (durationString) => {
        const timeParts = durationString.split(':').map(Number);
        const hours = timeParts.length >= 3 ? timeParts[timeParts.length - 3] : 0;
        const minutes = timeParts.length >= 2 ? timeParts[timeParts.length - 2] : 0;
        const seconds = timeParts.length >= 1 ? timeParts[timeParts.length - 1] : 0;
        return hours * 3600 + minutes * 60 + seconds;
    };

    /**
     * 刷新时间方法
     */
    const refreshTime = () => {
        let percentageShowEnable = GM_getValue('percentageShowEnable') === null ? false : GM_getValue('percentageShowEnable');

        if (functionUpdating) {
            return;
        }
        functionUpdating = true;

        const videos = document.querySelectorAll('#multi_page > .cur-list > ul.list-box > li');
        let cumulativeDuration = 0;
        let sumSeconds = 0;
        if (percentageShowEnable) {
            videos.forEach((v) => {
                sumSeconds += getDurationInSeconds(v.querySelector('.duration').innerText);
            });
        }

        videos.forEach((v) => {
            const singleDurationEl = v.querySelector('.duration');

            cumulativeDuration += getDurationInSeconds(singleDurationEl.innerText);

            const cumulativeHours = Math.floor(cumulativeDuration / 3600);
            const cumulativeMinutes = Math.floor((cumulativeDuration % 3600) / 60);
            const cumulativeSeconds = cumulativeDuration % 60;
            const formattedAllDuration = `${String(cumulativeHours).padStart(2, '0')}:${String(cumulativeMinutes).padStart(2, '0')}:${String(cumulativeSeconds).padStart(2, '0')}`;

            if (percentageShowEnable) {
                const percentage = sumSeconds !== 0 ? ((cumulativeDuration / sumSeconds) * 100).toFixed(2) : 0;
                singleDurationEl.innerText += ` | ${formattedAllDuration} | ${percentage}%`;
            } else {
                singleDurationEl.innerText += ` | ${formattedAllDuration}`;
            }
        });
    };

// 创建全局弹窗的函数
    function createGlobalPopup() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '9998';

        // 创建弹窗容器
        const popupContainer = document.createElement('div');
        popupContainer.style.position = 'fixed';
        popupContainer.style.top = '50%';
        popupContainer.style.left = '50%';
        popupContainer.style.transform = 'translate(-50%, -50%)';
        popupContainer.style.backgroundColor = '#fff';
        popupContainer.style.borderRadius = '8px';
        popupContainer.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
        popupContainer.style.padding = '20px';
        popupContainer.style.maxWidth = '80%';
        popupContainer.style.width = '500px';
        popupContainer.style.textAlign = 'center';
        popupContainer.style.zIndex = '9999';

        // 创建标题
        const titleElement = document.createElement('h2');
        titleElement.textContent = '功能开关';
        titleElement.style.color = '#333';
        titleElement.style.fontSize = '1.5em';
        titleElement.style.marginBottom = '20px';


        // 创建进度显示区域
        const progressContainer = document.createElement('div');
        const progressBar = document.createElement('div');
        progressBar.style.width = '0%';
        progressBar.style.height = '20px';
        progressBar.style.backgroundColor = '#007bff';
        progressBar.style.borderRadius = '4px';
        progressContainer.appendChild(progressBar);
        progressContainer.style.marginBottom = '20px';
        progressContainer.style.display = 'none';

        // 创建显示/隐藏进度按钮
        const toggleProgressButton = document.createElement('div');
        toggleProgressButton.textContent = GM_getValue('percentageShowEnable') ? '关闭百分比进度(刷新生效)' : '开启百分比进度(刷新生效)';
        toggleProgressButton.style.padding = '10px 20px';
        toggleProgressButton.style.backgroundColor = GM_getValue('percentageShowEnable') ? '#F56C6C' : '#28a745';
        toggleProgressButton.style.color = '#fff';
        toggleProgressButton.style.border = 'none';
        toggleProgressButton.style.borderRadius = '4px';
        toggleProgressButton.style.cursor = 'pointer';
        toggleProgressButton.addEventListener('click', () => {
            let percentageShowEnable = !GM_getValue('percentageShowEnable');
            GM_setValue('percentageShowEnable', percentageShowEnable);
            if (percentageShowEnable) {
                toggleProgressButton.style.backgroundColor = GM_getValue('percentageShowEnable') ? '#F56C6C' : '#28a745';
                progressContainer.style.display = 'none';
                toggleProgressButton.textContent = '关闭百分比进度(刷新生效)';
            } else {
                toggleProgressButton.style.backgroundColor = GM_getValue('percentageShowEnable') ? '#F56C6C' : '#28a745';
                progressContainer.style.display = 'none';
                toggleProgressButton.textContent = '开启百分比进度(刷新生效)';
            }

        });

        // 创建开关按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.padding = '10px 20px';
        closeButton.style.backgroundColor = '#007bff';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.marginTop = '10px';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay); // 移除遮罩层
        });

        // 将标题、文件内容、进度显示区域和按钮添加到弹窗容器中
        popupContainer.appendChild(titleElement);
        popupContainer.appendChild(progressContainer);
        popupContainer.appendChild(toggleProgressButton);
        popupContainer.appendChild(closeButton);
        // 将弹窗容器添加到遮罩层中
        overlay.appendChild(popupContainer);

        // 将遮罩层添加到页面中
        document.body.appendChild(overlay);
    }

    const observer = new MutationObserver(refreshTime);
    observer.observe(document.querySelector('#multi_page'), {childList: true, subtree: true});

    document.querySelector('#multi_page > div.head-con > div.head-left > div').addEventListener('click', () => {
        if (document.querySelector('#multi_page')) {
            functionUpdating = false;
            refreshTime();
        }
    });

    GM_registerMenuCommand('打开功能开关面板', createGlobalPopup, {});

})();