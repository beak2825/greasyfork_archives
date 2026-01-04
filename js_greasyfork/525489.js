// ==UserScript==
// @name         广西高等学校师资培训中心-自动学习课程
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  自动完成当前课程并跳转下一节
// @author       RrOrange
// @match        *://gxgs.study.gspxonline.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @icon         https://s2.loli.net/2025/02/01/mphjJoCDTgaYFLZ.png
// @icon64       https://s2.loli.net/2025/02/01/mphjJoCDTgaYFLZ.png
// @downloadURL https://update.greasyfork.org/scripts/525489/%E5%B9%BF%E8%A5%BF%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1%E5%B8%88%E8%B5%84%E5%9F%B9%E8%AE%AD%E4%B8%AD%E5%BF%83-%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%AF%BE%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/525489/%E5%B9%BF%E8%A5%BF%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1%E5%B8%88%E8%B5%84%E5%9F%B9%E8%AE%AD%E4%B8%AD%E5%BF%83-%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%AF%BE%E7%A8%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用户配置
    const config = {
        playbackSpeed: GM_getValue('playbackSpeed', 3), // 默认3倍速
        refreshInterval: GM_getValue('refreshInterval', 5) * 60 * 1000, // 默认5分钟刷新一次
        progressThreshold: 100, // 进度阈值改为100%
        maxCheckTimes: 5, // 最大检查次数
        autoClickStudy: GM_getValue('autoClickStudy', true), // 自动点击继续学习
        autoExpand: GM_getValue('autoExpand', false) // 自动展开所有小节
    };

    // 生成标签页唯一ID
    function generateTabId() {
        return 'tab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // 获取当前标签页ID
    function getTabId() {
        let tabId = sessionStorage.getItem('courseTabId');
        if (!tabId) {
            tabId = generateTabId();
            sessionStorage.setItem('courseTabId', tabId);
        }
        return tabId;
    }

    // 获取最后刷新时间
    function getLastRefresh() {
        const tabId = getTabId();
        const lastRefresh = GM_getValue(`lastRefresh_${tabId}`);
        // 如果没有上次刷新时间，设置为当前时间减去一个很小的值，确保倒计时立即开始
        return lastRefresh || (Date.now() - 1000);
    }

    // 设置最后刷新时间
    function setLastRefresh(time) {
        const tabId = getTabId();
        GM_setValue(`lastRefresh_${tabId}`, time);
    }

    // 清理过期的标签页刷新时间（可选）
    function cleanupOldTabs() {
        const now = Date.now();
        const allKeys = Object.keys(GM_getValue('', {}));
        allKeys.forEach(key => {
            if (key.startsWith('lastRefresh_')) {
                const lastRefresh = GM_getValue(key);
                if (now - lastRefresh > 24 * 60 * 60 * 1000) { // 24小时后清理
                    GM_deleteValue(key);
                }
            }
        });
    }

    // 修改添加设置界面函数
    function addSettingsUI() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            padding: 10px;
            border-radius: 5px;
            color: white;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
        `;

        // 播放速度设置区域
        const speedContainer = document.createElement('div');
        speedContainer.style.display = 'flex';
        speedContainer.style.alignItems = 'center';
        speedContainer.style.gap = '5px';

        const speedLabel = document.createElement('label');
        speedLabel.textContent = '播放速度:';

        const speedInput = document.createElement('input');
        speedInput.type = 'number';
        speedInput.min = '0.1';
        speedInput.max = '16';
        speedInput.step = '0.1';
        speedInput.value = config.playbackSpeed;
        speedInput.style.cssText = `
            width: 50px;
            padding: 2px 5px;
            border: 1px solid #ccc;
            border-radius: 3px;
            background: rgba(255, 255, 255, 0.9);
            color: #333;
        `;

        // 刷新时间设置区域
        const refreshContainer = document.createElement('div');
        refreshContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 5px;
            margin-left: 15px;
            padding-left: 15px;
            border-left: 1px solid rgba(255, 255, 255, 0.3);
        `;

        const refreshLabel = document.createElement('label');
        refreshLabel.textContent = '刷新间隔(分钟):';

        const refreshInput = document.createElement('input');
        refreshInput.type = 'number';
        refreshInput.min = '1';
        refreshInput.max = '60';
        refreshInput.step = '1';
        refreshInput.value = config.refreshInterval / (60 * 1000);
        refreshInput.style.cssText = `
            width: 50px;
            padding: 2px 5px;
            border: 1px solid #ccc;
            border-radius: 3px;
            background: rgba(255, 255, 255, 0.9);
            color: #333;
        `;

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存';
        saveBtn.style.cssText = `
            padding: 2px 8px;
            background: #4CAF50;
            border: none;
            border-radius: 3px;
            color: white;
            cursor: pointer;
        `;

        // 当前速度显示
        const currentSpeed = document.createElement('span');
        currentSpeed.style.marginLeft = '10px';
        currentSpeed.textContent = `当前: ${config.playbackSpeed}x`;

        // 倒计时显示
        const timeDisplay = document.createElement('span');
        timeDisplay.style.marginLeft = '15px';
        timeDisplay.style.borderLeft = '1px solid rgba(255, 255, 255, 0.3)';
        timeDisplay.style.paddingLeft = '15px';
        updateTimeDisplay(timeDisplay);

        saveBtn.onclick = () => {
            const newSpeed = parseFloat(speedInput.value);
            const newInterval = parseInt(refreshInput.value);
            
            if (newSpeed >= 0.1 && newSpeed <= 16 && newInterval >= 1 && newInterval <= 60) {
                const speedChanged = newSpeed !== config.playbackSpeed;
                const intervalChanged = newInterval !== config.refreshInterval / (60 * 1000);
                
                // 保存播放速度
                config.playbackSpeed = newSpeed;
                GM_setValue('playbackSpeed', newSpeed);
                setVideoSpeed(newSpeed);
                currentSpeed.textContent = `当前: ${newSpeed}x`;
                
                // 保存刷新间隔
                config.refreshInterval = newInterval * 60 * 1000;
                GM_setValue('refreshInterval', newInterval);
                setLastRefresh(Date.now()); // 重置刷新时间
                
                // 如果设置有改变，提示用户并刷新页面
                if (speedChanged || intervalChanged) {
                    alert('设置已保存，页面将自动刷新以应用新设置');
                    window.location.reload();
                } else {
                    alert('设置已保存');
                }
            } else {
                alert('请输入有效的数值\n播放速度: 0.1-16\n刷新间隔: 1-60分钟');
            }
        };

        speedContainer.appendChild(speedLabel);
        speedContainer.appendChild(speedInput);
        
        refreshContainer.appendChild(refreshLabel);
        refreshContainer.appendChild(refreshInput);
        
        container.appendChild(speedContainer);
        container.appendChild(refreshContainer);
        container.appendChild(saveBtn);
        container.appendChild(currentSpeed);
        container.appendChild(timeDisplay);
        
        document.body.appendChild(container);

        return timeDisplay;
    }

    // 更新倒计时显示并检查是否需要刷新
    function updateTimeDisplay(element) {
        const now = Date.now();
        const lastRefresh = getLastRefresh();
        const nextRefresh = lastRefresh + config.refreshInterval;
        const remaining = Math.max(0, nextRefresh - now);
        
        // 更新倒计时显示
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        element.textContent = `下次刷新: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // 如果剩余时间小于等于0，且当前页面没有在刷新中
        if (remaining <= 0 && !window.isRefreshing) {
            window.isRefreshing = true;
            console.log('倒计时结束，准备刷新页面...');
            setTimeout(() => {
                refreshPage();
            }, 100);
            return;
        }
    }

    // 设置视频播放速度
    function setVideoSpeed(speed) {
        const video = document.querySelector('video');
        if (video) {
            video.playbackRate = speed;
        }
    }

    // 刷新页面
    function refreshPage() {
        if (window.isRefreshing) {
            console.log('正在刷新页面...');
            setLastRefresh(Date.now());
            window.location.reload();
        }
    }

    // 等待播放器加载完成
    function waitForPlayer() {
        return new Promise(resolve => {
            const checkPlayer = setInterval(() => {
                const player = document.querySelector('#aliplayer');
                if (player) {
                    clearInterval(checkPlayer);
                    resolve(player);
                }
            }, 1000);
        });
    }

    // 展开所有章节
    function expandAllSections() {
        const expandIcons = document.querySelectorAll('.section .title.section-name i.icon-plus');
        expandIcons.forEach(icon => {
            icon.click();
        });
    }

    // 获取所有课程的进度信息
    function getAllCoursesProgress() {
        const courses = Array.from(document.querySelectorAll('.resource li'));
        return courses.map(course => {
            const progressIcon = course.querySelector('.learn-status');
            const progressText = progressIcon ? progressIcon.textContent : '0%';
            const progress = parseInt(progressText);
            return {
                element: course,
                progress: isNaN(progress) ? 0 : progress,
                title: course.getAttribute('title')
            };
        });
    }

    // 检查是否所有课程都已完成
    function checkAllCoursesCompleted() {
        // 先展开所有章节
        expandAllSections();
        
        // 等待一下确保章节都已展开
        return new Promise(resolve => {
            setTimeout(() => {
                const courses = getAllCoursesProgress();
                const totalCourses = courses.length;
                const completedCourses = courses.filter(c => c.progress >= 100).length;
                
                console.log(`课程完成情况: ${completedCourses}/${totalCourses}`);
                resolve(completedCourses === totalCourses);
            }, 500); // 等待500ms确保章节展开完成
        });
    }

    // 修改查找下一个需要学习的课程函数
    async function findNextCourseToLearn() {
        const courses = getAllCoursesProgress();
        const currentCourse = document.querySelector('.resource li.active');
        const currentIndex = courses.findIndex(c => c.element === currentCourse);

        // 统计完成情况
        const totalCourses = courses.length;
        const completedCourses = courses.filter(c => c.progress >= 100).length;
        console.log(`课程完成情况: ${completedCourses}/${totalCourses}`);

        // 检查是否真的所有课程都完成了
        const allCompleted = await checkAllCoursesCompleted();
        if (allCompleted) {
            alert('恭喜！所有课程已学习完成！');
            return null;
        }

        // 优先查找未完成的课程（进度小于100%）
        let nextUnfinished = courses.find((course, index) => 
            index > currentIndex && course.progress < 100
        );

        // 如果当前位置后面没有未完成的课程，从头开始查找
        if (!nextUnfinished) {
            nextUnfinished = courses.find(course => course.progress < 100);
        }

        // 如果找到未完成的课程
        if (nextUnfinished) {
            console.log(`跳转到未完成课程: ${nextUnfinished.title} (进度: ${nextUnfinished.progress}%)`);
            return nextUnfinished.element;
        }

        return null;
    }

    // 修改跳转到下一节的函数
    async function goToNextSection() {
        const nextCourse = await getNextCourseLink();
        if (nextCourse) {
            nextCourse.click();
            return true;
        } else {
            const allCompleted = await checkAllCoursesCompleted();
            if (allCompleted) {
                console.log('所有课程已学习完成');
                alert('恭喜！所有课程已学习完成！');
            } else {
                // 当前课程未完成，继续学习
                ensureVideoPlaying();
            }
            return false;
        }
    }

    // 修改原有的getNextCourseLink函数
    async function getNextCourseLink() {
        // 先展开所有章节
        expandAllSections();
        
        // 获取当前激活的课程
        const activeCourse = document.querySelector('.resource li.active');
        if (!activeCourse) return null;

        // 获取当前课程进度
        const currentProgress = checkProgress();
        
        // 如果当前课程未完成（进度小于100%），继续学习当前课程
        if (currentProgress < 100) {
            return null;
        }

        // 查找下一个需要学习的课程
        return await findNextCourseToLearn();
    }

    // 检查学习进度
    function checkProgress() {
        // 检查当前课程的进度标签
        const activeLesson = document.querySelector('.resource li.active');
        if (!activeLesson) return 0;

        const progressIcon = activeLesson.querySelector('.learn-status');
        if (progressIcon) {
            const progressText = progressIcon.textContent;
            // 提取百分比数字
            const progress = parseInt(progressText);
            return isNaN(progress) ? 0 : progress;
        }

        return 0;
    }

    // 检查并确保视频在播放
    function ensureVideoPlaying() {
        const video = document.querySelector('video');
        if (video) {
            if (video.paused) {
                clickPlayButton();
            }
            // 设置播放速度
            setVideoSpeed(config.playbackSpeed);
        }
    }

    // 点击播放按钮
    function clickPlayButton() {
        // 查找大播放按钮
        const bigPlayBtn = document.querySelector('.prism-big-play-btn');
        if (bigPlayBtn && bigPlayBtn.style.display !== 'none') {
            bigPlayBtn.click();
            return true;
        }
        
        // 查找控制栏播放按钮
        const playBtn = document.querySelector('.prism-play-btn');
        if (playBtn) {
            playBtn.click();
            return true;
        }
        
        return false;
    }

    // 添加开关按钮
    function addToggleButtons(container) {
        // 添加分隔线
        const divider = document.createElement('div');
        divider.style.cssText = `
            border-left: 1px solid rgba(255, 255, 255, 0.3);
            margin: 0 15px;
            height: 20px;
        `;

        // 自动点击开关
        const clickToggle = document.createElement('div');
        clickToggle.style.cssText = `
            display: flex;
            align-items: center;
            gap: 5px;
        `;
        
        const clickCheckbox = document.createElement('input');
        clickCheckbox.type = 'checkbox';
        clickCheckbox.checked = config.autoClickStudy;
        clickCheckbox.style.cursor = 'pointer';
        
        const clickLabel = document.createElement('label');
        clickLabel.textContent = '自动点击继续学习';
        clickLabel.style.cursor = 'pointer';
        
        clickCheckbox.onchange = (e) => {
            config.autoClickStudy = e.target.checked;
            GM_setValue('autoClickStudy', config.autoClickStudy);
        };

        // 展开/收缩开关
        const expandToggle = document.createElement('div');
        expandToggle.style.cssText = `
            display: flex;
            align-items: center;
            gap: 5px;
            margin-left: 15px;
        `;
        
        const expandBtn = document.createElement('button');
        expandBtn.textContent = config.autoExpand ? '收缩所有' : '展开所有';
        expandBtn.style.cssText = `
            padding: 2px 8px;
            background: #2196F3;
            border: none;
            border-radius: 3px;
            color: white;
            cursor: pointer;
        `;
        
        expandBtn.onclick = () => {
            config.autoExpand = !config.autoExpand;
            GM_setValue('autoExpand', config.autoExpand);
            expandBtn.textContent = config.autoExpand ? '收缩所有' : '展开所有';
            toggleAllSections(config.autoExpand);
        };

        clickToggle.appendChild(clickCheckbox);
        clickToggle.appendChild(clickLabel);
        expandToggle.appendChild(expandBtn);

        container.appendChild(divider);
        container.appendChild(clickToggle);
        container.appendChild(expandToggle);
    }

    // 展开/收缩所有小节
    function toggleAllSections(expand) {
        const sections = document.querySelectorAll('.section .title.section-name');
        sections.forEach(section => {
            const icon = section.querySelector('i.iconfont');
            if (icon) {
                const isExpanded = icon.classList.contains('icon-minus');
                if ((expand && !isExpanded) || (!expand && isExpanded)) {
                    section.click();
                }
            }
        });
    }

    // 修改检查并点击"继续学习"按钮函数
    function checkAndClickStudyButton() {
        // 如果自动点击已关闭，直接返回
        if (!config.autoClickStudy) {
            return;
        }

        let checkCount = 0;
        let hasClicked = false;
        const courseUrls = [
            'http://gxgs.study.gspxonline.com/resource/index?route=/study/course/1068',
            'http://gxgs.study.gspxonline.com/resource/index?route=/study/course/1065',
            'http://gxgs.study.gspxonline.com/resource/index?route=/study/course/1067',
            'http://gxgs.study.gspxonline.com/resource/index?route=/study/course/1066',
            'http://gxgs.study.gspxonline.com/resource/index?route=/study/course/1069',
            'http://gxgs.study.gspxonline.com/resource/index?route=/study/course/1070',
            'http://gxgs.study.gspxonline.com/resource/index?route=/study/course/1071',
        ];

        // 检查当前URL是否匹配课程URL
        if (!courseUrls.some(url => window.location.href.includes(url))) {
            return;
        }

        const checkInterval = setInterval(() => {
            if (hasClicked || checkCount >= config.maxCheckTimes) {
                clearInterval(checkInterval);
                return;
            }

            const studyButton = document.querySelector('a.btn.btn-primary.btn-study');
            if (studyButton && studyButton.textContent.trim() === '继续学习') {
                console.log('找到继续学习按钮，准备点击...');
                studyButton.click();
                hasClicked = true;
                clearInterval(checkInterval);
            }

            checkCount++;
            if (checkCount >= config.maxCheckTimes) {
                console.log('已达到最大检查次数，停止检查');
            }
        }, 1000); // 每秒检查一次
    }

    // 主要逻辑
    async function main() {
        // 重置刷新标记
        window.isRefreshing = false;

        // 清理过期标签页数据
        cleanupOldTabs();

        // 检查是否需要立即刷新
        const now = Date.now();
        const lastRefresh = getLastRefresh();
        if (now - lastRefresh >= config.refreshInterval) {
            console.log('检测到需要刷新...');
            refreshPage();
            return;
        }

        // 如果是首次加载，设置初始刷新时间
        if (!GM_getValue(`lastRefresh_${getTabId()}`)) {
            setLastRefresh(Date.now());
        }

        // 添加设置界面
        const timeDisplay = addSettingsUI();
        
        // 添加开关按钮
        addToggleButtons(timeDisplay.parentElement);

        // 检查并点击"继续学习"按钮
        checkAndClickStudyButton();
        
        // 等待播放器加载
        const player = await waitForPlayer();
        
        // 监听视频播放结束事件
        player.addEventListener('ended', goToNextSection);

        // 定期检查进度和播放状态
        setInterval(() => {
            const progress = checkProgress();
            console.log('当前进度:', progress + '%');
            
            if (progress >= config.progressThreshold) {
                goToNextSection();
            } else {
                // 如果进度小于100%,确保视频在播放
                ensureVideoPlaying();
            }
        }, 5000); // 每5秒检查一次进度

        // 定期更新倒计时并检查是否需要刷新
        setInterval(() => {
            updateTimeDisplay(timeDisplay);
        }, 1000);

        // 初始自动播放视频
        ensureVideoPlaying();
    }

    // 启动脚本
    main();
})();
