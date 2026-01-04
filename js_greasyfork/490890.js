// ==UserScript==
// @name         linux.do楼层号显示
// @namespace
// @version      0.1.0
// @description  linux.do显示楼层号!
// @author       nulluser
// @match        https://linux.do/*
// @icon         https://linux.do/uploads/default/optimized/1X/3a18b4b0da3e8cf96f7eea15241c3d251f28a39b_2_180x180.png
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1268706
// @downloadURL https://update.greasyfork.org/scripts/490890/linuxdo%E6%A5%BC%E5%B1%82%E5%8F%B7%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/490890/linuxdo%E6%A5%BC%E5%B1%82%E5%8F%B7%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 为所有帖子添加楼层号，改进以避免重复添加
    function addFloorNumbers() {
        document.querySelectorAll('.boxed.onscreen-post').forEach(function (post) {
            if (!post.querySelector('.floor-number')) { // 检查是否已经添加了楼层号
                var floorNumber = document.createElement('div');
                floorNumber.className = 'floor-number';
                floorNumber.textContent = '楼层: ' + post.id.split("_")[1];
                floorNumber.style.cssText = 'color: grey; margin-left: 10px;';
                post.querySelector('.topic-meta-data').appendChild(floorNumber);
            }
        });
    }

    // 简化MutationObserver初始化
    function initMutationObserver() {
        var observer = new MutationObserver(function () {
            addFloorNumbers(); // 只需在DOM变化时尝试添加楼层号
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 简化随机跳转逻辑
    function randomJump() {
        fetch(window.location.href + '.json')
            .then(response => response.json())
            .then(data => {

                if (data && data.posts_count) {
                    const postId = 1 + Math.floor(Math.random() * data.posts_count);
                    const currentUrl = new URL(window.location.href);
                    const list1 = currentUrl.pathname.split("/");
                    if (list1[list1.length - 2] == "topic") { list1.push(postId); }else if (list1[list1.length - 3] == "topic") { list1[list1.length - 1] = postId; };
                    const newUrl = list1.join("/");
                    window.location.href = newUrl;
                    alert('恭喜楼层【' + postId + '】的用户被抽中！');
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // 页面URL变化监测和按钮状态更新
    function monitorURLChangeAndUpdateButton() {
        let lastURL = location.href;
        setInterval(() => {
            const currentURL = location.href;
            if (currentURL !== lastURL) {
                lastURL = currentURL;
                updateButtonVisibility();
            }
        }, 1000); // 每秒检查一次URL变化
    }

    // 更新随机楼层按钮显示状态
    function updateButtonVisibility() {
        const isTopicPage = /^https:\/\/linux\.do\/t\/topic\//.test(location.href);
        const randomButton = document.getElementById('randomButton1');
        randomButton.style.display = isTopicPage ? 'block' : 'none';
    }

    // 初始化
    function init() {
        const randomButton = document.createElement('button');
        randomButton.id = "randomButton1";
        randomButton.textContent = '随机楼层';
        randomButton.style.cssText = `
            position: fixed;
            bottom: 90%;
            right: 10px;
            width: 80px;
            height: 30px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 15px;
            cursor: pointer;
            z-index: 9999;
            display: block; // 默认不显示
        `;
        randomButton.onclick = randomJump;
        document.body.appendChild(randomButton);

        addFloorNumbers(); // 初始时添加楼层号
        initMutationObserver(); // 监听DOM变化
        monitorURLChangeAndUpdateButton(); // 监听URL变化并更新按钮显示状态
    }

    window.addEventListener('load', init);
})();
