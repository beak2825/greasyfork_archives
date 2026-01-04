// ==UserScript==
// @name         Bilibili 视频截图按钮
// @namespace    http://tampermonkey.net/
// @version      0.8.0.8.0.8
// @description  在投稿时间之后显示一个截屏按钮，点击后复制到粘贴板
// @author       0808
// @match        http*://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522597/Bilibili%20%E8%A7%86%E9%A2%91%E6%88%AA%E5%9B%BE%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/522597/Bilibili%20%E8%A7%86%E9%A2%91%E6%88%AA%E5%9B%BE%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    "use strict";

    /** 配置选项 **/
    const CONFIG = {
        logPrefix: "[视频截图按钮]", // 日志前缀
        buttonText: "截屏",
        buttonClass: "screenshotBtn08",
        buttonStyle: {
            backgroundColor: 'rgba(0,174,236, 0.5)',
            transition: 'background-color 0.3s',
            color: '#ffffff',
            fontSize: '15px',
            cursor: 'pointer',
            borderRadius: '10px',
            border: '0px solid #ffffff',
            paddingLeft: '10px',
            paddingRight: '10px',
            marginBottom: '2px'
        },
        hoverStyle: {
            backgroundColor: 'rgba(0,174,236, 1)'
        },
        pubDateSelector: '.pubdate-ip',
        checkInterval: 3000,
        buttonAdded: false // 标记按钮是否已添加
    };

    /** 封装 console.log，自动添加前缀 **/
    function log(message) {
        console.log(`${CONFIG.logPrefix} ${message}`);
    }

    /** 主初始化函数 **/
    function init() {
        log("脚本初始化");
        FindvideoEle();
    }

    /** 查找视频元素并添加截图按钮 **/
    function FindvideoEle() {
        function f() {
            let videos = document.getElementsByTagName('video');
            if (videos.length > 0 && !CONFIG.buttonAdded) {
                addScreenShotEle(videos[0]); // 只处理第一个视频元素
                CONFIG.buttonAdded = true; // 标记按钮已添加
                clearInterval(interval); // 停止定时器
            }
        }
        const interval = setInterval(f, CONFIG.checkInterval);
    }

    /** 添加截图按钮 **/
    function addScreenShotEle(videoElement) {
        let SsIDname = videoElement.id + "_Sshot";
        if (document.getElementById(SsIDname) === null) {
            let SsHtml = document.createElement("button");
            SsHtml.textContent = CONFIG.buttonText;
            SsHtml.className = CONFIG.buttonClass;

            // 设置按钮样式
            Object.assign(SsHtml.style, CONFIG.buttonStyle);

            // 添加悬停效果
            SsHtml.addEventListener("mouseover", function (event) {
                SsHtml.style.backgroundColor = CONFIG.hoverStyle.backgroundColor;
            });
            SsHtml.addEventListener("mouseout", function (event) {
                SsHtml.style.backgroundColor = CONFIG.buttonStyle.backgroundColor;
            });

            // 找到投稿时间的元素
            let pubDateElement = document.querySelector(CONFIG.pubDateSelector);
            if (pubDateElement) {
                SsHtml.setAttribute("id", SsIDname);
                pubDateElement.insertAdjacentElement('afterend', SsHtml); // 在投稿时间元素后插入按钮
                log("截图按钮已添加");
            }

            // 添加点击事件
            SsHtml.addEventListener("click", function (event) {
                event.stopPropagation();
                takeScreenshot(videoElement);
            });
        } else {
            log("截图按钮已存在，跳过添加");
        }
    }

    /** 截图并复制到剪贴板 **/
    function takeScreenshot(videoElement) {
        var myCanvas = document.createElement('canvas');
        myCanvas.width = videoElement.videoWidth;
        myCanvas.height = videoElement.videoHeight;
        var ctx = myCanvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, videoElement.videoWidth, videoElement.videoHeight);
        myCanvas.toBlob(function (blob) {
            navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]).then(function () {
                log('截图已复制到剪贴板');
            }).catch(function (err) {
                log('截图复制失败: ' + err);
            });
        });
    }

    // 执行初始化
    init();
})();