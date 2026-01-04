// ==UserScript==
// @name         偷偷学习彩色按钮版
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在网课界面点击"偷偷学习"。脚本自动检测课程页面和学习页面，自动点击未完成课程，自动学习，自动返回课程页面。
// @match        https://htedu.yunxuetang.cn/kng/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545919/%E5%81%B7%E5%81%B7%E5%AD%A6%E4%B9%A0%E5%BD%A9%E8%89%B2%E6%8C%89%E9%92%AE%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/545919/%E5%81%B7%E5%81%B7%E5%AD%A6%E4%B9%A0%E5%BD%A9%E8%89%B2%E6%8C%89%E9%92%AE%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储已完成课程的数据
    const STORAGE_KEY = 'ht_completed_courses';

    // 页面类型枚举
    const PageType = {
        COURSE_LIST: 'course_list',
        LEARNING: 'learning',
        UNKNOWN: 'unknown'
    };

    // 创建控制按钮
    let button = document.createElement('button');
    button.innerHTML = '偷偷学习';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '350px';
    button.style.zIndex = 1000;
    button.style.padding = '10px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    document.body.appendChild(button);

    // 创建状态显示
    let statusDiv = document.createElement('div');
    statusDiv.style.position = 'fixed';
    statusDiv.style.top = '50px';
    statusDiv.style.right = '350px';
    statusDiv.style.zIndex = 1000;
    statusDiv.style.padding = '10px';
    statusDiv.style.backgroundColor = '#f8f9fa';
    statusDiv.style.border = '1px solid #ddd';
    statusDiv.style.borderRadius = '5px';
    statusDiv.style.maxWidth = '300px';
    statusDiv.style.display = 'none';
    document.body.appendChild(statusDiv);

    let running = false;
    let goID;
    let currentPageType = PageType.UNKNOWN;
    let completedCourses = loadCompletedCourses();
    let courseCheckInterval = 3000; // 检查课程间隔时间（毫秒）
    let debugMode = true; // 调试模式，显示更多信息

    // 加载已完成课程数据
    function loadCompletedCourses() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error('加载已完成课程数据失败:', e);
            return {};
        }
    }

    // 保存已完成课程数据
    function saveCompletedCourses() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(completedCourses));
        } catch (e) {
            console.error('保存已完成课程数据失败:', e);
        }
    }

    // 更新状态显示
    function updateStatus(message) {
        statusDiv.innerHTML = message;
        statusDiv.style.display = 'block';
        console.log(message);
    }

    // 检测当前页面类型
    function detectPageType() {
        const url = window.location.href;
        if (url.includes('/list?')) {
            return PageType.COURSE_LIST;
        } else if (url.includes('/course/play?')) {
            return PageType.LEARNING;
        }
        return PageType.UNKNOWN;
    }

    // 获取课程ID
    function getCourseId(courseElement) {
        // 尝试从课程元素中提取唯一标识符
        try {
            // 这里需要根据实际DOM结构调整
            const imgElement = courseElement.querySelector('.yxtf-image img');
            if (imgElement && imgElement.src) {
                return imgElement.src.split('/').pop().split('.')[0];
            }

            // 如果无法从图片获取，尝试从其他属性获取
            const titleElement = courseElement.querySelector('.kng-list-new__title');
            if (titleElement) {
                return titleElement.textContent.trim();
            }
        } catch (e) {
            console.error('获取课程ID失败:', e);
        }

        // 如果无法获取唯一ID，使用随机ID（不推荐，但作为后备方案）
        return 'course_' + Math.random().toString(36).substr(2, 9);
    }

    // 标记课程为已完成
    function markCourseCompleted(courseElement) {
        const courseId = getCourseId(courseElement);
        completedCourses[courseId] = {
            completed: true,
            timestamp: Date.now()
        };
        saveCompletedCourses();
    }

    // 检查课程是否已完成
    function isCourseCompleted(courseElement) {
        const courseId = getCourseId(courseElement);
        return completedCourses[courseId] && completedCourses[courseId].completed;
    }

    // 处理课程列表页面
    function handleCourseListPage() {
        updateStatus('正在处理课程列表页面...');

        // 获取所有课程元素
        const courseElements = document.querySelectorAll('.kng-list-new__item');
        if (courseElements.length === 0) {
            updateStatus('未找到课程元素，等待页面加载...');
            return;
        }

        let totalCourses = courseElements.length;
        let completedCount = 0;
        let foundUncompletedCourse = false;

        // 为每个课程添加编号
        courseElements.forEach((courseElement, index) => {
            // 检查是否已经有编号标签
            if (!courseElement.querySelector('.course-number')) {
                const numberLabel = document.createElement('div');
                numberLabel.className = 'course-number';
                numberLabel.style.position = 'absolute';
                numberLabel.style.top = '5px';
                numberLabel.style.left = '5px';
                numberLabel.style.backgroundColor = '#ff9800';
                numberLabel.style.color = 'white';
                numberLabel.style.padding = '2px 6px';
                numberLabel.style.borderRadius = '10px';
                numberLabel.style.fontSize = '12px';
                numberLabel.style.zIndex = '10';
                numberLabel.textContent = (index + 1).toString();

                // 确保课程元素有相对定位，以便正确放置编号
                if (window.getComputedStyle(courseElement).position === 'static') {
                    courseElement.style.position = 'relative';
                }

                courseElement.appendChild(numberLabel);
            }

            // 检查课程是否已完成
            const tagsElement = courseElement.querySelector('.kng-list-new__tags');
            const isMarkedCompleted = tagsElement && tagsElement.textContent.includes('已学完');

            if (isMarkedCompleted) {
                completedCount++;
                // 如果网站标记为已完成，也在我们的缓存中标记
                markCourseCompleted(courseElement);
            } else if (isCourseCompleted(courseElement)) {
                // 如果我们的缓存中标记为已完成，但网站未标记，添加自定义标记
                if (!courseElement.querySelector('.custom-completed-mark')) {
                    const completedMark = document.createElement('div');
                    completedMark.className = 'custom-completed-mark';
                    completedMark.style.position = 'absolute';
                    completedMark.style.top = '5px';
                    completedMark.style.right = '5px';
                    completedMark.style.backgroundColor = '#4CAF50';
                    completedMark.style.color = 'white';
                    completedMark.style.padding = '2px 6px';
                    completedMark.style.borderRadius = '10px';
                    completedMark.style.fontSize = '12px';
                    completedMark.style.zIndex = '10';
                    completedMark.textContent = '已检查';

                    // 确保课程元素有相对定位
                    if (window.getComputedStyle(courseElement).position === 'static') {
                        courseElement.style.position = 'relative';
                    }

                    courseElement.appendChild(completedMark);
                }
                completedCount++;
            } else if (!foundUncompletedCourse) {
                // 找到第一个未完成的课程，点击进入
                foundUncompletedCourse = true;
                updateStatus(`找到未完成课程 #${index + 1}，准备学习...`);

                // 延迟点击，确保UI更新完成
                setTimeout(() => {
                    // 点击课程封面进入学习页面
                    const coverElement = courseElement.querySelector('.kng-list-new__cover');
                    if (coverElement) {
                        coverElement.click();
                        updateStatus('正在进入学习页面...');
                    } else {
                        updateStatus('无法找到课程封面元素');
                    }
                }, 1000);
            }
        });

        updateStatus(`当前页面共有 ${totalCourses} 个课程，其中 ${completedCount} 个已完成`);

        // 如果所有课程都已完成，点击下一页
        if (!foundUncompletedCourse && completedCount === totalCourses) {
            updateStatus('当前页面所有课程已完成，准备进入下一页...');

            // 延迟点击下一页按钮
            setTimeout(() => {
                const nextPageButton = document.querySelector('.btn-next');
                if (nextPageButton) {
                    nextPageButton.click();
                    updateStatus('已点击下一页按钮');
                } else {
                    updateStatus('未找到下一页按钮，可能已是最后一页');
                }
            }, 2000);
        }
    }

    // 处理学习页面
    function handleLearningPage() {
        updateStatus('正在处理学习页面...');

        // 更精确地检查是否有"开始考试"按钮，如果有则返回课程列表
        // 查找具有明确考试特征的元素，而不是简单地检查页面文本
        const examButtons = Array.from(document.querySelectorAll('button')).filter(btn =>
            btn.textContent &&
            btn.textContent.trim() === '开始考试' &&
            btn.offsetParent !== null
        );

        // 查找评论区域
        const commentSections = document.querySelectorAll('.course-comment-section, .course-comment-container');
        const visibleCommentSection = Array.from(commentSections).find(section =>
            section && section.offsetParent !== null
        );

        if (debugMode) {
            console.log('考试按钮数量:', examButtons.length);
            console.log('评论区域:', visibleCommentSection ? '找到' : '未找到');
        }

        // 只有当考试按钮是可见的，或者评论区域是可见的，才认为是考试或评论页面
        if (examButtons.length > 0 || visibleCommentSection) {
            updateStatus('检测到考试或评论页面，准备返回课程列表...');

            // 延迟返回，确保状态更新
            setTimeout(() => {
                // 尝试找到返回按钮
                const backButton = document.querySelector('.back-btn') ||
                                  document.querySelector('.yxtf-button--text');

                if (backButton) {
                    backButton.click();
                    updateStatus('已点击返回按钮');
                } else {
                    // 如果找不到返回按钮，尝试通过URL返回
                    window.location.href = 'https://htedu.yunxuetang.cn/kng/#/list?catalogId=&cid=b65ec203-3955-436c-9681-5f297902b211&order=0&sort=0&type=';
                    updateStatus('通过URL返回课程列表');
                }
            }, 1500);

            return;
        }

        // 处理学习按钮
        var button1 = document.querySelectorAll('.yxtf-button.yxtf-button--primary.yxtf-button--larger');
        button1.forEach(function(按钮) {
            var spanText = 按钮.querySelector('span') ? 按钮.querySelector('span').textContent : '';
            if (spanText.includes('继续学习') || spanText.includes('开始学习')) {
                updateStatus(`点击按钮: ${spanText}`);
                按钮.click();
            }
        });

        var button2 = document.querySelectorAll('.yxtf-button.yxtf-button--primary.yxtf-button--large');
        button2.forEach(function(按钮) {
            var spans = 按钮.querySelectorAll('span');
            spans.forEach(function(span) {
                if (span.textContent.includes('继续学习')) {
                    updateStatus(`点击按钮: ${span.textContent}`);
                    按钮.click();
                }
            });
        });

        var button3 = document.querySelectorAll('.ulcdsdk-nextchapterbutton');
        button3.forEach(function(按钮) {
            var spans = 按钮.querySelectorAll('span');
            spans.forEach(function(span) {
                if (span.textContent.includes('继续学习下一章节')) {
                    updateStatus(`点击按钮: ${span.textContent}`);
                    按钮.click();
                }
            });
        });

        // 处理视频播放
        var video = document.querySelector('video');
        if (video && video.paused) {
            video.play();
            updateStatus('已开始播放视频');
        }

        // 检查是否有"完成"或"已完成"标记
        const completionIndicators = [
            '.course-complete-status',
            '.course-status-completed',
            '.chapter-completed'
        ];

        for (const selector of completionIndicators) {
            const element = document.querySelector(selector);
            if (element && element.textContent.includes('完成')) {
                updateStatus('检测到课程已完成，准备返回课程列表...');

                // 延迟返回，确保状态更新
                setTimeout(() => {
                    // 尝试找到返回按钮
                    const backButton = document.querySelector('.back-btn') ||
                                      document.querySelector('.yxtf-button--text');

                    if (backButton) {
                        backButton.click();
                        updateStatus('已点击返回按钮');
                    } else {
                        // 如果找不到返回按钮，尝试通过URL返回
                        window.location.href = 'https://htedu.yunxuetang.cn/kng/#/list?catalogId=&cid=b65ec203-3955-436c-9681-5f297902b211&order=0&sort=0&type=';
                        updateStatus('通过URL返回课程列表');
                    }
                }, 1500);

                break;
            }
        }
    }

    // 主处理函数
    function go() {
        // 检测当前页面类型
        const pageType = detectPageType();

        // 如果页面类型发生变化，更新状态
        if (pageType !== currentPageType) {
            currentPageType = pageType;
            updateStatus(`页面类型变更为: ${pageType}`);
        }

        // 根据页面类型执行相应处理
        switch (pageType) {
            case PageType.COURSE_LIST:
                handleCourseListPage();
                break;
            case PageType.LEARNING:
                handleLearningPage();
                break;
            default:
                updateStatus('未知页面类型，等待页面加载...');
                break;
        }
    }

    // 按钮点击事件
    button.addEventListener('click', () => {
        if (!running) {
            button.innerHTML = '我不学了';
            button.style.backgroundColor = '#f44336';
            running = true;
            statusDiv.style.display = 'block';
            updateStatus('开始自动学习...');
            goID = setInterval(go, courseCheckInterval);
        } else {
            button.innerHTML = '偷偷学习';
            button.style.backgroundColor = '#4CAF50';
            running = false;
            updateStatus('已停止自动学习');
            clearInterval(goID);
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 3000);
        }
    });

    // 清除缓存按钮
    let clearCacheButton = document.createElement('button');
    clearCacheButton.innerHTML = '清除缓存';
    clearCacheButton.style.position = 'fixed';
    clearCacheButton.style.top = '10px';
    clearCacheButton.style.right = '450px';
    clearCacheButton.style.zIndex = 1000;
    clearCacheButton.style.padding = '10px';
    clearCacheButton.style.backgroundColor = '#ff9800';
    clearCacheButton.style.color = 'white';
    clearCacheButton.style.border = 'none';
    clearCacheButton.style.borderRadius = '5px';
    document.body.appendChild(clearCacheButton);

    clearCacheButton.addEventListener('click', () => {
        if (confirm('确定要清除所有已完成课程的缓存吗？')) {
            completedCourses = {};
            localStorage.removeItem(STORAGE_KEY);
            updateStatus('已清除所有缓存');
            // 刷新页面以更新UI
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    });

    // 调试按钮
    let debugButton = document.createElement('button');
    debugButton.innerHTML = '调试模式: ' + (debugMode ? '开' : '关');
    debugButton.style.position = 'fixed';
    debugButton.style.top = '10px';
    debugButton.style.right = '550px';
    debugButton.style.zIndex = 1000;
    debugButton.style.padding = '10px';
    debugButton.style.backgroundColor = debugMode ? '#9c27b0' : '#607d8b';
    debugButton.style.color = 'white';
    debugButton.style.border = 'none';
    debugButton.style.borderRadius = '5px';
    document.body.appendChild(debugButton);

    debugButton.addEventListener('click', () => {
        debugMode = !debugMode;
        debugButton.innerHTML = '调试模式: ' + (debugMode ? '开' : '关');
        debugButton.style.backgroundColor = debugMode ? '#9c27b0' : '#607d8b';
        updateStatus('调试模式: ' + (debugMode ? '开启' : '关闭'));
    });

    // 初始化
    updateStatus('脚本已加载，点击"偷偷学习"开始自动学习');
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 3000);
})();
