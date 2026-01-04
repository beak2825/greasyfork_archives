// ==UserScript==
// @name        华博1 59iedu.com
// @namespace   Violentmonkey Scripts
// @match       https://fjysxhpx.59iedu.com/*
// @version     1.2
// @author      -
// @description 自动处理课程学习跳转、进度检查和 href 改变功能
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521727/%E5%8D%8E%E5%8D%9A1%2059ieducom.user.js
// @updateURL https://update.greasyfork.org/scripts/521727/%E5%8D%8E%E5%8D%9A1%2059ieducom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 将所有 href="javascript:void(0);" 改为 href="javascript:void(#);"
    function changeHref() {
        const links = document.querySelectorAll('a[href="javascript:void(0);"]');
        links.forEach(link => {
            link.setAttribute('href', 'javascript:void(#);');
        });
        console.log("已更改所有 href='javascript:void(0);' 为 href='javascript:void(#);'");
    }

    // 验证用户课程访问权限（模拟实现，替换为真实API调用）
    function validateUserClassAccess(courseId) {
        return new Promise(function(resolve) {
            // 在这里实现实际的API请求
            setTimeout(() => {
                resolve({ status: true }); // 假设成功
            }, 1000);
        });
    }

    // 打开课程学习页面处理函数
    function tryListen(e, courseId) {
        e.preventDefault(); // 防止默认行为

        // 验证用户权限
        validateUserClassAccess(courseId).then(function(response) {
            if (response.status) {
                // 跳转到课程学习页面
                const params = encodeURIComponent(JSON.stringify({
                    learnType: "TRAINING_CLASS"
                }));
                window.location.href = "/play/#/learn/" + courseId + "/courseware?exts=" + params;
            } else {
                alert(response.info || "无访问权限，请联系管理员.");
            }
        }).catch(function(err) {
            console.error("调用接口失败:", err);
            alert("课程访问验证失败，请稍后重试。");
        });
    }

    // 点击课程学习按钮
    function clickCourseLearnButton(index) {
        const courseLearnButtons = document.querySelectorAll('.ui-btn.btn-gr.ui-btn-2.ml10:nth-child(3)');

        // 检查索引是否在按钮范围内
        if (index < courseLearnButtons.length) {
            const button = courseLearnButtons[index];
            console.log('点击第 ' + (index + 1) + ' 个进度对应的课程学习按钮：', button);
            button.click(); // 这里直接使用button.click()会触发ng-click
        } else {
            console.log('没有更多的进度对应的课程学习按钮可以点击');
        }
    }

    // 检测进度并点击对应的课程学习按钮
    function checkProgressAndClick() {
        const progresses = document.querySelectorAll('.process .current');
        const progressNums = document.querySelectorAll('.process-num');

        for (let i = 0; i < progresses.length; i++) {
            const progressValue = progressNums[i].textContent.trim();
            console.log('进度条 ' + (i + 1) + ' 的数值: ' + progressValue);

            if (progressValue !== '100%') {
                clickCourseLearnButton(i);
                return; // 如果当前进度不等于100%，则点击对应按钮并退出
            }
        }

        console.log('所有进度都已完成');
    }

    // 为课程学习按钮添加事件监听器
    document.querySelectorAll('.ui-btn.btn-gr.ui-btn-2.ml10').forEach(button => {
        button.addEventListener('click', function(e) {
            const courseIdMatch = this.getAttribute('ng-click').match(/item.courseId\s*=>\s*([^\)]+)/); // 提取课程 ID
            const courseId = courseIdMatch ? courseIdMatch[1] : null; // 获取课程ID

            if (courseId) {
                tryListen(e, courseId); // 调用处理函数
            } else {
                console.error("未找到课程ID");
            }
        });
    });

    // 检查是否在指定的页面上并启动进度检查
    if (window.location.href.indexOf("https://fjysxhpx.59iedu.com/center/myRealClass/") !== -1) {
        console.log("已加载课程学习页面，添加 href 更改和进度检查。");
        changeHref(); // 更改所有链接的 href
         setTimeout(checkProgressAndClick, 15000);// 15秒检查并点击一次
        setInterval(checkProgressAndClick, 500000); // 每5秒检查并点击一次
    }
})();
