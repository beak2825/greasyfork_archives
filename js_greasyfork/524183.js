// ==UserScript==
// @name         河北教师继续教育2024
// @namespace    http://tampermonkey.net/
// @version      4.3.3
// @description  自动过验证码、无人值守、学完主要课程自动开展20学时学习（测试中）。
// @author       沉默是金
// @match        *://*.stu.teacher.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license      MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/524183/%E6%B2%B3%E5%8C%97%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B22024.user.js
// @updateURL https://update.greasyfork.org/scripts/524183/%E6%B2%B3%E5%8C%97%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B22024.meta.js
// ==/UserScript==

/* global $ */ // 告诉 ESLint，$ 是全局变量

(function () {
    'use strict';

    // 通用工具函数
    const utils = {
        // 延迟执行函数
        delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
        // 随机延迟
        randomDelay: (min, max) => Math.floor(Math.random() * (max - min)) + min,
        // 检查元素是否存在
        elementExists: (selector) => document.querySelector(selector) !== null,
        // 点击元素
        clickElement: (selector) => {
            const element = document.querySelector(selector);
            if (element) {
                if (element.tagName === 'A' && (element.target === '_blank' || element.target === '_parent')) {
                    element.target = '_self'; // 强制在原窗口打开
                }
                element.click();
                console.log('已点击元素:', selector);
                return true;
            }
            console.log('未找到元素:', selector);
            return false;
        },
        // 检查页面内容
        checkPageContent: (content) => document.body.innerText.includes(content),
        // 记录上一次点击的时间
        lastClickTime: 0,
        // 确保在指定时间内只执行一次点击
        safeClick: (element, minInterval = 5000) => {
            const now = Date.now();
            if (now - utils.lastClickTime >= minInterval) {
                utils.lastClickTime = now;
                if (element && typeof element.click === 'function') {
                    // 强制在原窗口打开
                    if (element.tagName === 'A' && (element.target === '_blank' || element.target === '_parent')) {
                        element.target = '_self'; // 修改为在原窗口打开
                    }
                    element.click();
                    console.log('已安全点击元素:', element);
                    return true;
                }
            } else {
                console.log('点击过于频繁，跳过本次点击');
            }
            return false;
        },
        // 检测重复页面并关闭
        checkDuplicatePages: () => {
            const currentUrl = window.location.href;
            const allWindows = window.top.frames; // 获取所有子窗口
            const openedUrls = [];

            // 遍历所有窗口，检查是否有重复的URL
            for (let i = 0; i < allWindows.length; i++) {
                const win = allWindows[i];
                if (win.location.href === currentUrl && win !== window) {
                    console.log('检测到重复页面，关闭当前页面');
                    window.close(); // 关闭当前页面
                    return;
                }
            }
        },
        // 确保所有链接都在原窗口打开
        ensureLinksOpenInSelfWindow: () => {
            const links = document.querySelectorAll('a[target="_blank"], a[target="_parent"]');
            links.forEach(link => {
                link.target = '_self'; // 修改为在原窗口打开
            });
        },
        // 拦截通过 window.open 打开新窗口的行为
        interceptWindowOpen: () => {
            const originalWindowOpen = window.open;
            window.open = function (url, target, features) {
                // 强制在原窗口打开
                return originalWindowOpen.call(window, url, '_self', features);
            };
        },
        // 拦截通过事件监听器打开新窗口的行为
        interceptEventListeners: () => {
            document.addEventListener('click', (event) => {
                const target = event.target;
                if (target.tagName === 'A' && (target.target === '_blank' || target.target === '_parent')) {
                    event.preventDefault(); // 阻止默认行为
                    target.target = '_self'; // 修改为在原窗口打开
                    target.click(); // 重新触发点击
                }
            }, true); // 使用捕获阶段
        },
        // 监听 DOM 变化，确保动态生成的内容也能被正确处理
        observeDOMChanges: () => {
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        // 动态内容加载后，确保所有链接都在原窗口打开
                        utils.ensureLinksOpenInSelfWindow();
                    }
                }
            });

            // 监听整个文档的变化
            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }
    };

    // 新增功能：每隔15-20秒随机时间查找并点击“Ok，我知道了！”按钮
    const startRandomClickOkButton = () => {
        const getRandomInterval = () => Math.floor(Math.random() * (20000 - 15000 + 1)) + 15000;

        const clickOkButton = () => {
            const okButton = document.querySelector('a.layui-layer-btn0');
            if (okButton && okButton.innerText.trim() === 'Ok，我知道了！') {
                okButton.click();
                console.log('已点击“Ok，我知道了！”按钮');
            }
        };

        const run = () => {
            clickOkButton();
            setTimeout(run, getRandomInterval());
        };

        run(); // 启动
    };

    // 启动新增功能
    startRandomClickOkButton();

    // 原有脚本功能保持不变
    // 第一个脚本：验证信息提交、自动点击按钮等
    (function () {
        const checkAndSubmit = () => {
            if ($("div:contains('验证信息')").length > 1) {
                console.log("检测到学习验证");
                $("#code").attr("value", $("#codespan").text());
                $("a:contains('提交')")[0].click();
            }
        };

        const checkAndClickOk = () => {
            const okButton = $('a:contains("Ok，我知道了！")')[0];
            if (okButton) {
                utils.safeClick(okButton);
                $(".ccH5TogglePlay").click();
                console.log("rePlay success!!!");
            }
        };

        const checkCoursePage = () => {
            const href = location.href;
            if (href.includes("/course/showCourse/")) {
                const enterCourseButton = $(".button-hui")[0];
                if (enterCourseButton && enterCourseButton.innerText === "进入课程学习") {
                    utils.safeClick(enterCourseButton);
                }
            } else if (href.includes("/course/learn/")) {
                if (window.TimeNum >= 1200) {
                    alert("可以提交了");
                }
            }
        };

        const checkAndClickExpand = () => {
            const expandButton = $('span.step:contains("展开")')[0];
            if (expandButton) {
                utils.safeClick(expandButton);
                console.log('已点击“展开”按钮');
                // 展开操作完成后，延迟 20 秒执行第八个脚本
                setTimeout(() => {
                    console.log('展开操作完成，20秒后检查页面内容');
                    if (!utils.checkPageContent('未学习') && !utils.checkPageContent('学习中')) {
                        console.log('页面中不存在“未学习”或“学习中”，执行第八个脚本');
                        runEighthScript();
                    } else {
                        console.log('页面中存在“未学习”或“学习中”，不执行第八个脚本');
                    }
                }, 20000); // 20秒后执行
            }
        };

        setInterval(() => {
            checkAndSubmit();
            checkAndClickOk();
            checkCoursePage();
            checkAndClickExpand();
        }, 15000); // 调整为15秒
    })();

    // 合并后的脚本：检测“学习中”和“未学习”状态，并执行相应操作
    async function runLearningStatusCheck() {
        // 检测“学习中”状态
        const learningElements = document.querySelectorAll('li i.icon_2');
        for (const learningElement of learningElements) {
            if (learningElement.textContent.trim() === '学习中') {
                const learningButton = learningElement.closest('li').querySelector('a[onclick*="countLearn"]');
                if (learningButton) {
                    const delay = utils.randomDelay(15000, 20000); // 调整为15-20秒
                    await utils.delay(delay);

                    // 确保在原窗口打开
                    if (learningButton.tagName === 'A' && (learningButton.target === '_blank' || learningButton.target === '_parent')) {
                        learningButton.target = '_self'; // 修改为在原窗口打开
                    }
                    if (utils.safeClick(learningButton)) {
                        console.log('已点击“学习中”按钮');
                        utils.checkDuplicatePages(); // 检测重复页面
                        return true; // 找到“学习中”按钮并点击后，直接返回，不再执行“未学习”检测
                    }
                }
            }
        }

        // 如果未检测到“学习中”状态，则检测“未学习”状态
        const unlearnedElements = document.querySelectorAll('li i.icon_0');
        for (const unlearnedElement of unlearnedElements) {
            if (unlearnedElement.textContent.trim() === '未学习') {
                const unlearnedButton = unlearnedElement.closest('li').querySelector('a[onclick*="countLearn"]');
                if (unlearnedButton) {
                    const delay = utils.randomDelay(15000, 20000); // 调整为15-20秒
                    await utils.delay(delay);

                    // 确保在原窗口打开
                    if (unlearnedButton.tagName === 'A' && (unlearnedButton.target === '_blank' || unlearnedButton.target === '_parent')) {
                        unlearnedButton.target = '_self'; // 修改为在原窗口打开
                    }
                    if (utils.safeClick(unlearnedButton)) {
                        console.log('已点击“未学习”按钮');
                        utils.checkDuplicatePages(); // 检测重复页面
                        return true; // 找到“未学习”按钮并点击后，直接返回
                    }
                }
            }
        }

        // 如果既没有“学习中”也没有“未学习”状态，返回 false
        return false;
    }

    // 控制脚本执行顺序
    (async () => {
        try {
            // 先检测“学习中”状态，如果未检测到，再检测“未学习”状态
            const isLearningOrUnlearnedDetected = await runLearningStatusCheck();
            if (!isLearningOrUnlearnedDetected) {
                console.log('未检测到“学习中”或“未学习”状态，不执行后续操作');
            }
        } catch (error) {
            console.error('执行 runLearningStatusCheck 时出错:', error);
        } finally {
            // 其他脚本按顺序执行
            runFourthScript();
            runFifthScript();
        }
    })();

    // 第四个脚本：自动点击视频项
    function runFourthScript() {
        const autoClickVideoItem = () => {
            const videoItems = document.querySelectorAll('li[data-type="视频"], li[data-type="1"]');
            videoItems.forEach(item => {
                if (item.onclick || item.getAttribute('onclick')) {
                    if (utils.safeClick(item)) {
                        console.log('已点击视频项:', item);
                        utils.checkDuplicatePages(); // 检测重复页面
                    }
                }
            });
        };

        setTimeout(() => {
            autoClickVideoItem();
            setInterval(autoClickVideoItem, 1200000); // 大于15秒，不做调整
        }, 20000); // 调整为20秒
    }

    // 第五个脚本：自动点击replaybtn按钮
    function runFifthScript() {
        let clickCount = 0; // 计数器，限制点击次数
        const maxClicks = 10; // 最大点击次数

        const checkAndClickReplayBtn = () => {
            if (clickCount >= maxClicks) {
                console.log('已达到最大点击次数，停止点击replaybtn按钮');
                return;
            }

            const replayBtn = document.getElementById('replaybtn');
            if (replayBtn) {
                if (utils.safeClick(replayBtn)) {
                    console.log('已点击replaybtn按钮');
                    clickCount++; // 增加点击计数
                }
                const nextDelay = utils.randomDelay(15000, 20000); // 调整为15-20秒
                setTimeout(checkAndClickReplayBtn, nextDelay);
            } else {
                const nextDelay = utils.randomDelay(15000, 20000); // 调整为15-20秒
                setTimeout(checkAndClickReplayBtn, nextDelay);
            }
        };

        checkAndClickReplayBtn();
    }

    // 第六个脚本：自动刷新学习时间
    (function () {
        const refreshButton = document.querySelector('button.btn.studyCourseTimeRefresh');
        if (refreshButton) {
            const clickButton = () => {
                if (!utils.checkPageContent('最长可累计时间：')) {
                    if (utils.safeClick(refreshButton)) {
                        console.log('已触发“刷新学习时间”按钮点击。');
                    }
                }
            };
            clickButton(); // 立即执行一次
            setInterval(clickButton, 601000); // 每10分钟执行一次
        } else {
            console.error('未找到“刷新学习时间”按钮。');
        }
    })();

    // 第七个脚本：检测页面内容并执行相应操作
    (function () {
        const checkAndClickLearningPlan = () => {
            if (utils.checkPageContent('最长可累计时间：')) {
                console.log('检测到“最长可累计时间”，继续检测是否达到累计上限');

                if (utils.checkPageContent('已达到累计上限')) {
                    console.log('检测到“已达到累计上限”，查找“学习计划”元素');

                    const learningPlanItem = document.querySelector('li.cur a[data-type="学习计划"]');
                    if (learningPlanItem) {
                        console.log('找到“学习计划”元素，准备点击');

                        if (learningPlanItem.target === '_blank' || learningPlanItem.target === '_parent') {
                            learningPlanItem.target = '_self'; // 修改为在原窗口打开
                        }

                        if (utils.safeClick(learningPlanItem)) {
                            console.log('已点击“学习计划”超链接');
                        } else {
                            console.log('点击“学习计划”超链接失败');
                        }
                    } else {
                        console.log('未找到“学习计划”元素');
                    }
                } else {
                    console.log('未检测到“已达到累计上限”');
                }
            } else {
                console.log('未检测到“最长可累计时间”，不执行操作');
            }
        };

        // 每隔15秒检查一次
        setInterval(checkAndClickLearningPlan, 15000);
    })();

    // 第八个脚本：自动点击“20学时培训”并进入学习（在原窗口打开）
    function runEighthScript() {
        function checkLearningStatus() {
            const pageText = document.body.innerText;
            const keywords = ["未学习", "学习中"];
            return keywords.some(keyword => pageText.includes(keyword));
        }

        function click20HourTraining() {
            const trainingItems = document.querySelectorAll('.selectItemSecond li');
            for (const item of trainingItems) {
                if (item.innerText.includes("20学时培训")) {
                    item.click(); // 点击“20学时培训”
                    console.log("已点击：20学时培训");
                    break;
                }
            }
        }

        function clickCourse() {
            const learningCourse = document.querySelector('li i.icon_2');
            if (learningCourse) {
                const courseLink = learningCourse.closest('li').querySelector('a[onclick="countLearn(this)"]');
                if (courseLink) {
                    courseLink.target = '_self'; // 强制在原窗口打开
                    courseLink.click(); // 点击“进入学习”
                    console.log("已点击：学习中课程");
                    return;
                }
            }

            const unlearnedCourse = document.querySelector('li i.icon_0');
            if (unlearnedCourse) {
                const courseLink = unlearnedCourse.closest('li').querySelector('a[onclick="countLearn(this)"]');
                if (courseLink) {
                    courseLink.target = '_self'; // 强制在原窗口打开
                    courseLink.click(); // 点击“进入学习”
                    console.log("已点击：未学习课程");
                    return;
                }
            }

            console.log("未找到符合条件的课程");
        }

        function main() {
            if (!checkLearningStatus()) {
                console.log("未找到“未学习”或“学习中”字段，执行点击操作...");
                click20HourTraining();

                setTimeout(() => {
                    console.log("等待5秒后查找并点击课程...");
                    clickCourse();
                }, 5000); // 5秒后执行
            } else {
                console.log("页面中存在“未学习”或“学习中”字段，不执行点击操作。");
            }
        }

        main();
    }

    // 确保所有链接都在原窗口打开
    utils.ensureLinksOpenInSelfWindow();
    // 拦截通过 window.open 打开新窗口的行为
    utils.interceptWindowOpen();
    // 拦截通过事件监听器打开新窗口的行为
    utils.interceptEventListeners();
    // 监听 DOM 变化，确保动态生成的内容也能被正确处理
    utils.observeDOMChanges();
})();