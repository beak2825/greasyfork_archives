// ==UserScript==
// @name         |2025寒假研修|智慧中小学平台|自动1.98倍播放|自动静音自动播放自动下一个视频
// @namespace    http://tampermonkey.net/
// @version      0.5
// @license      V+Adxm0001
// @description  |自动1.98倍播放（2倍）|自动静音|自动播放自动下一个视频|
// @author       天道酬勤
// @match        https://basic.smartedu.cn/*
// @match        https://www.smartedu.cn/*
// @match        https://teacher.vocational.smartedu.cn/*
// @match        https://core.teacher.vocational.smartedu.cn/*
// @downloadURL https://update.greasyfork.org/scripts/486970/%7C2025%E5%AF%92%E5%81%87%E7%A0%94%E4%BF%AE%7C%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6%E5%B9%B3%E5%8F%B0%7C%E8%87%AA%E5%8A%A8198%E5%80%8D%E6%92%AD%E6%94%BE%7C%E8%87%AA%E5%8A%A8%E9%9D%99%E9%9F%B3%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E4%B8%AA%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/486970/%7C2025%E5%AF%92%E5%81%87%E7%A0%94%E4%BF%AE%7C%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6%E5%B9%B3%E5%8F%B0%7C%E8%87%AA%E5%8A%A8198%E5%80%8D%E6%92%AD%E6%94%BE%7C%E8%87%AA%E5%8A%A8%E9%9D%99%E9%9F%B3%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E4%B8%AA%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function runCodeInPage(code) {
        var script = document.createElement('script');
        script.textContent = code;
        (document.head || document.documentElement).appendChild(script);
    }

    document.addEventListener('click', function(event) {
        if (event.button === 0) { // 确保是左键点击
            setTimeout(function() {
                runCodeInPage(`
                    var videoElement = document.querySelector("video");
                    if (videoElement) {
                        videoElement.muted = true; // 自动静音
                        videoElement.playbackRate = 1.98; //
                        videoElement.play(); // 自动播放
                    }
                `);
            }, 200); // 延迟200毫秒执行
        }
    });
})();
(function () {
    'use strict';

    var log = console.log;

    function next() {
        // 假设每个页面都有一个“下一个”按钮或链接，这里需要根据实际情况调整
        var nextButton = document.querySelector("a.next, button.next");
        if (nextButton) {
            nextButton.click();
        } else {
            log("未找到下一课程的链接或按钮。");
        }
    }

    function click(auto_next = true) {
        // 查找未完成的视频或下一个视频
        var icon = document.querySelector(".iconfont.icon_processing_fill, .iconfont.icon_checkbox_linear");
        if (icon) {
            icon.click(); // 点击开始播放视频
        } else if (auto_next) {
            next(); // 如果没有未完成的视频，则尝试跳转到下一个课程
        } else {
            log("当前页面所有视频已经播放完！");
        }
    }

    function play(v = null) {
        if (!v) v = document.querySelector("video"); // 获取页面上的第一个视频元素
        if (v) {
            v.muted = true; // 静音播放
            v.play(); // 开始播放视频
        }
        let btn = document.querySelector(".fish-btn.fish-btn-primary"); // 关闭提示信息
        if (btn && btn.innerText.includes("知道了")) btn.click();
    }

    function main() {
        log("main...");
        var delay = 1000 * 5; // 延迟5秒以确保页面完全加载
        setTimeout(function () {
            click();
            play();
        }, delay);
    }

    main();
})();
(function() {
    'use strict';

    // 定义一个函数来查找包含特定文本的元素并刷新页面
    function autoRefreshOnText() {
        const buttonText = "再学一遍";
        const elements = document.querySelectorAll('button, a, input, span');

        for (let element of elements) {
            if (element.textContent.includes(buttonText)) {
                console.log("发现“再学一遍”，即将刷新页面");
                location.reload(); // 刷新当前页面
                return;
            }
        }
    }

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            autoRefreshOnText();
        });
    });

    // 配置观察选项
    const observerConfig = { attributes: true, childList: true, subtree: true };

    // 在页面加载完成时立即执行一次检查
    autoRefreshOnText();

    // 开始观察整个文档中的变化
    observer.observe(document.body, observerConfig);
})();
(function() {
    'use strict';

    // 函数：尝试找到所有视频元素并添加监听器
    function addListenersToVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.addEventListener('ended', refreshPage);
            video.addEventListener('pause', handlePause);
        });
    }

    // 视频暂停处理函数，用于区分是自然结束还是用户暂停
    function handlePause(e) {
        const video = e.target;
        if (video.ended || video.paused) {
            setTimeout(() => {
                if (video.paused && !video.ended) {
                    refreshPage();
                }
            }, 200); // 等待200毫秒以确定是否真的暂停了
        }
    }

    // 刷新页面函数
    function refreshPage() {
        location.reload();
    }

    // 主逻辑：开始监听视频元素
    addListenersToVideos();

    // 如果页面内容是动态加载的，可以使用MutationObserver来监控新的video元素
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'VIDEO') {
                        node.addEventListener('ended', refreshPage);
                        node.addEventListener('pause', handlePause);
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();