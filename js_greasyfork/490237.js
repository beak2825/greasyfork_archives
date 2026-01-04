// ==UserScript==
// @name         linux.do弹幕
// @namespace    linux.do弹幕氛围   
// @version      0.6.2
// @description  快来填满我吧
// @author       nulluser
// @match        https://linux.do/*
// @icon         https://linux.do/uploads/default/optimized/1X/3a18b4b0da3e8cf96f7eea15241c3d251f28a39b_2_180x180.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490237/linuxdo%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/490237/linuxdo%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建弹幕容器
    const danmuContainer = document.createElement('div');
    danmuContainer.id = 'danmu-container';
    danmuContainer.style.position = 'fixed';
    danmuContainer.style.left = '0';
    danmuContainer.style.bottom = '0';
    danmuContainer.style.width = '260px'; // 容器宽度
    danmuContainer.style.height = '100%';
    danmuContainer.style.zIndex = '9999';
    danmuContainer.style.overflow = 'hidden';
    document.body.appendChild(danmuContainer);

    // 弹幕数组
    let danmus = [];

    // 添加弹幕
    function addDanmu(text) {
        const danmu = document.createElement('div');
        danmu.className = 'danmu';
        danmu.textContent = text;
        danmu.style.position = 'absolute';
        danmu.style.whiteSpace = 'nowrap';
        danmu.style.color = getRandomColor(); // 随机颜色
        danmu.style.fontSize = '20px';
        danmu.style.fontWeight = 'bold';
        danmu.style.left = getRandomPx();
        danmu.style.bottom = '0'; // 弹幕从底部进入
        danmu.style.writingMode = 'vertical-lr'; // 文字竖直显示
        danmu.style.transform = 'translateX(-100%)'; // 初始位置在容器外
        danmuContainer.appendChild(danmu);

        // 弹幕动画
        const pageHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const duration = Math.random() * (pageHeight * 10) + pageHeight * 15; // 随机动画持续时间，基于页面高度
        danmu.animate([
            { transform: `translateY(-${pageHeight}px)` } // 向上移动直到消失
        ], {
            duration: duration,
            iterations: 1,
            easing: 'linear'
        }).finished.then(() => danmu.remove());

        // 更新弹幕位置
        updateDanmuPositions();
    }

    // 更新弹幕位置，防止重叠
    function updateDanmuPositions() {
        let lastBottom = 0; // 初始化上一个弹幕的底部位置
        danmus.forEach(danmu => {
            danmu.style.bottom = `${lastBottom}px`;
            lastBottom = parseFloat(danmu.style.bottom) + danmu.offsetHeight + 20; // 更新下一个弹幕的位置
        });
    }

    // 生成随机颜色
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    // 获取弹幕数据
function fetchDanmuData() {
    const currentUrl = window.location.href;
    const jsonUrl = currentUrl.endsWith('.json') ? currentUrl : currentUrl + '.json';
    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.post_stream && data.post_stream.posts) {
                const posts = data.post_stream.posts;
                let postIndex = 1; // 从第二条开始
                function addDanmuWithDelay() {
                    if (postIndex < posts.length) {
                        const post = posts[postIndex++];
                        const cookedContent = post.cooked.replace(/<[^>]*>?/gm, ''); // 移除HTML标签
                        addDanmu(cookedContent);
                        setTimeout(addDanmuWithDelay, 1000); // 每次添加后间隔0.2秒
                    }
                }
                addDanmuWithDelay(); // 开始添加弹幕
            }
        })
        .catch(error => {
            console.error('Error fetching danmu data:', error);
        });
}

// 假设 addDanmu 函数已经定义，它负责添加弹幕到页面上

    // 生成随机位置
    function getRandomPx() {
        const randomNumber = Math.floor(Math.random() * 10) + 1; // 生成1到5的随机数
        return randomNumber * 20 + 'px'; // 添加单位px并返回
    }



    // 每隔一段时间添加一个新的弹幕
    setInterval(() => {
        addDanmu('吾皇万岁!');
        addDanmu('欢迎来到Linux.do!');
        addDanmu('始皇牛牛牛！');
        addDanmu('快来填满我吧！');
        addDanmu('吾皇万睡！');
    }, 10000);
    fetchDanmuData();
setInterval(() => {fetchDanmuData(); }, 20000);

    function monitorTopicURLChange(callback) {
        const urlPattern = /^(https:\/\/linux\.do\/t\/topic\/\d+).*$/; // 正则表达式匹配基本URL
        let lastMatch = location.href.match(urlPattern);
        new MutationObserver(() => {
            const currentMatch = location.href.match(urlPattern);
            if (currentMatch && (!lastMatch || currentMatch[1] !== lastMatch[1])) {
                lastMatch = currentMatch;
                callback(currentMatch[1]);
            }
        }).observe(document, { subtree: true, childList: true });
    }

    // 使用示例
    monitorTopicURLChange(newBaseURL => {
        fetchDanmuData();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('load', fetchDanmuData);
    // 监听弹幕容器的大小变化，更新弹幕位置
    new ResizeObserver(updateDanmuPositions).observe(danmuContainer);
})();
