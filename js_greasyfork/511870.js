// ==UserScript==
// @name         BOSS 直聘助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  （1）搜索页面增加按钮：只显示当前 HR 在线的职位。（2）职位详情页面增加浮窗显示：HR 是否最近活跃；是否接受应届生。
// @author       Rostal
// @license      MIT
// @icon         https://www.zhipin.com/favicon.ico
// @match        https://www.zhipin.com/job_detail/*
// @match        https://www.zhipin.com/web/geek/job?query=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511870/BOSS%20%E7%9B%B4%E8%81%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/511870/BOSS%20%E7%9B%B4%E8%81%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';


    // 创建置于最顶层的悬浮弹窗
    function createFloatingPopup(text, textColor) {
        var style = `
                #floatingPopup {
                    position: fixed;
                    top: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 25%;
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    padding: 20px;
                    box-sizing: border-box;
                    text-align: center;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.5);
                    z-index: 2147483647;
                    transition: opacity 0.3s ease-in-out;
                }
                #closePopup {
                    position: absolute;
                    top: 5px;
                    right: 10px;
                    cursor: pointer;
                    font-size: 1.5em;
                    font-weight: bold;
                }
                #closePopup:hover {
                    color: #ddd;
                }
            `;

        var popupHTML = `
                <div id="floatingPopup">
                    <span id="closePopup">X</span>
                    <div style="margin-top: 20px; font-size: 2.0em; color: ${textColor};">${text}</div>
                </div>
            `;

        // 添加样式
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.innerHTML = style;
        document.head.appendChild(styleElement);

        // 将弹窗添加到页面中
        document.body.insertAdjacentHTML('afterbegin', popupHTML);

        // 关闭弹窗的事件处理
        document.getElementById('closePopup').addEventListener('click', function () {
            var popup = document.getElementById('floatingPopup');
            popup.style.opacity = '0';
            setTimeout(function () {
                popup.style.display = 'none';
            }, 300);
        });
    }


    function runJobDetail() {
        // ======== HR 是否最近活跃 ========

        let hrDeadTexts = ["在线", "刚刚活跃", "今日活跃", "3日内活跃", "本周活跃"];

        let bossActiveTime = document.querySelector('div.job-boss-info span.boss-active-time');
        if (bossActiveTime) {
            let bossActiveTimeText = bossActiveTime.textContent;
            if (!hrDeadTexts.includes(bossActiveTimeText)) {
                createFloatingPopup("该 HR 已去世", "red");
                return;
            }
        }


        // ======== 是否接受应届生 ========

        let jobName = document.querySelector('div.info-primary > div.name');
        if (jobName) {
            let jobNameText = jobName.textContent;

            let regex = /应届.*生?/;
            if (regex.test(jobNameText)) {
                createFloatingPopup("接受应届生", "green");
                return;
            }
        }

        let jobDetail = document.querySelector('div.job-detail div.job-sec-text');
        if (jobDetail) {
            let jobDetailText = jobDetail.textContent;

            let regex = /接受.*应届.*生/;
            let regex2 = /应届.*生.*可/;
            let regex3 = /欢迎.*应届.*生/;
            let regex4 = /应届.*生.*优先/;
            if (regex.test(jobDetailText) || regex2.test(jobDetailText) || regex3.test(jobDetailText) || regex4.test(jobDetailText)) {
                createFloatingPopup("接受应届生", "green");
                return;
            }
        }
    }


    function runGeekJob() {
        // 创建按钮元素
        let button = document.createElement('button');
        button.innerHTML = '只显示当前 HR 在线'; // 设置按钮显示的文本
        button.style.position = 'fixed'; // 设置按钮位置为固定
        button.style.left = '0'; // 将按钮放置在页面的最左侧
        button.style.top = '50%'; // 将按钮垂直居中
        button.style.transform = 'translateY(-50%)'; // 垂直居中的偏移量
        button.style.zIndex = '2147483647'; // 设置按钮的z-index为最大值，确保其在最高层级
        button.style.padding = '10px'; // 设置按钮的内边距
        button.style.cursor = 'pointer'; // 设置鼠标悬停时的光标样式
        button.style.fontSize = '12px'; // 设置按钮字体大小

        // 添加点击事件监听器
        button.addEventListener('click', function () {
            // 获取所有的 <li> 元素
            let listItems = document.querySelectorAll('ul.job-list-box > li');

            // 遍历每个 <li> 元素
            listItems.forEach(function (item) {
                let bossOnlineTag = item.querySelector('span.boss-online-tag');

                // 获取当前元素的样式
                let style = window.getComputedStyle(item);

                // 如果没有找到 boss-online-tag 并且元素是可见的，则隐藏该 <li> 元素
                // 如果元素是隐藏的，则显示它
                if (!bossOnlineTag && style.display !== 'none') {
                    item.style.display = 'none';
                } else if (style.display === 'none') {
                    item.style.display = ''; // 使用空字符串将元素的display属性恢复到默认值
                }
            });
        });

        // 将按钮添加到页面中
        document.body.appendChild(button);
    }


    let currentUrl = window.location.href;
    if (currentUrl.includes("/job_detail/")) {
        runJobDetail();
    } else if (currentUrl.includes("/geek/job")) {
        runGeekJob();
    }


})();
