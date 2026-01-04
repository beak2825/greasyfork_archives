// ==UserScript==
// @name         2.自动选课脚本11-6
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  自动选择公需课，按年份处理课程，显示和重置累计学时。
// @match        https://m.mynj.cn:11188/zxpx/hyper/search/courselist*
// @match        https://m.mynj.cn:11188/zxpx/hyper/courseDetail*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513857/2%E8%87%AA%E5%8A%A8%E9%80%89%E8%AF%BE%E8%84%9A%E6%9C%AC11-6.user.js
// @updateURL https://update.greasyfork.org/scripts/513857/2%E8%87%AA%E5%8A%A8%E9%80%89%E8%AF%BE%E8%84%9A%E6%9C%AC11-6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const maxHours = 30;
    let selectedYear = localStorage.getItem('selectedYear') || "2024";
    let courseQueue = [];
    let completedHours = parseFloat(localStorage.getItem('totalCompletedHours')) || 0;
    let remainingHours = maxHours - completedHours;

    function createDebugWindow() {
        let debugWindow = document.getElementById('debugWindow');
        if (!debugWindow) {
            debugWindow = document.createElement('div');
            debugWindow.id = 'debugWindow';
            debugWindow.style.position = 'fixed';
            debugWindow.style.bottom = '0';
            debugWindow.style.left = '0';
            debugWindow.style.width = '100%';
            debugWindow.style.backgroundColor = 'rgba(0,0,0,0.7)';
            debugWindow.style.color = 'white';
            debugWindow.style.maxHeight = '200px';
            debugWindow.style.overflowY = 'scroll';
            debugWindow.style.zIndex = '9999';
            debugWindow.style.padding = '10px';
            debugWindow.style.boxSizing = 'border-box';
            document.body.appendChild(debugWindow);

            let debugLog = document.createElement('pre');
            debugLog.id = 'debugLog';
            debugLog.style.margin = '0';
            debugLog.style.padding = '0';
            debugWindow.appendChild(debugLog);
        }
    }

    createDebugWindow();

    function logMessage(message) {
        const debugLog = document.getElementById('debugLog');
        if (debugLog) {
            debugLog.innerText += message + "\n";
            debugLog.scrollTop = debugLog.scrollHeight;
        }
        console.log(message);
    }

    logMessage("脚本初始化完成，等待用户操作...");

    function createControlPanel() {
        let controlPanel = document.getElementById('controlPanel');
        if (!controlPanel) {
            controlPanel = document.createElement('div');
            controlPanel.id = 'controlPanel';
            controlPanel.style.position = 'fixed';
            controlPanel.style.top = '10px';
            controlPanel.style.right = '10px';
            controlPanel.style.zIndex = '10000';
            controlPanel.style.backgroundColor = 'rgba(255,255,255,0.8)';
            controlPanel.style.padding = '10px';
            controlPanel.style.border = '1px solid #ccc';
            controlPanel.style.borderRadius = '5px';
            document.body.appendChild(controlPanel);

            let yearLabel = document.createElement('label');
            yearLabel.innerText = "选择年份：";
            controlPanel.appendChild(yearLabel);

            let yearSelect = document.createElement('select');
            yearSelect.id = 'yearSelect';

            const yearOptions = document.querySelectorAll('#selection-year li a');
            yearOptions.forEach(option => {
                let year = option.getAttribute('year');
                let optionElement = document.createElement('option');
                optionElement.value = year;
                optionElement.text = `${year}年度`;
                if (year === selectedYear) {
                    optionElement.selected = true;
                }
                yearSelect.appendChild(optionElement);
            });

            yearSelect.onchange = function() {
                selectedYear = this.value;
                localStorage.setItem('selectedYear', selectedYear);
                const yearLink = document.querySelector(`#selection-year a[year="${selectedYear}"]`);
                if (yearLink) {
                    logMessage(`选择${selectedYear}年度,准备点击对应链接...`);
                    yearLink.click();
                    logMessage(`已点击${selectedYear}年度的链接。`);
                } else {
                    logMessage(`未找到${selectedYear}年度的链接,请检查年份选项。`);
                }
            };

            controlPanel.appendChild(yearSelect);

            let hoursLabel = document.createElement('label');
            hoursLabel.innerText = `累计学时：`;
            hoursLabel.style.marginLeft = '10px';
            controlPanel.appendChild(hoursLabel);

            let hoursInput = document.createElement('input');
            hoursInput.type = 'number';
            hoursInput.id = 'hoursInput';
            hoursInput.value = completedHours;
            hoursInput.style.width = '50px';
            hoursInput.onchange = function() {
                completedHours = parseFloat(hoursInput.value) || 0;
                remainingHours = maxHours - completedHours;
                localStorage.setItem('totalCompletedHours', completedHours);
                logMessage(`手动更新累计学时为：${completedHours} 学时，剩余学时：${remainingHours} 学时`);
            };
            controlPanel.appendChild(hoursInput);

            let resetButton = document.createElement('button');
            resetButton.innerText = "清除累计学时";
            resetButton.style.marginLeft = '10px';
            resetButton.onclick = resetCompletedHours;
            controlPanel.appendChild(resetButton);

            let startButton = document.createElement('button');
            startButton.innerText = "开始选课";
            startButton.style.marginLeft = '10px';
            startButton.onclick = startSelection;
            controlPanel.appendChild(startButton);

            // Add checkbox for 3学时 selection with default checked
            let selectThreeHoursCheckbox = document.createElement('input');
            selectThreeHoursCheckbox.type = 'checkbox';
            selectThreeHoursCheckbox.id = 'selectThreeHours';
            selectThreeHoursCheckbox.checked = true; // Default to checked
            controlPanel.appendChild(selectThreeHoursCheckbox);

            let checkboxLabel = document.createElement('label');
            checkboxLabel.htmlFor = 'selectThreeHours';
            checkboxLabel.innerText = '只选择3学时课程';
            controlPanel.appendChild(checkboxLabel);
        }
    }

    function startSelection() {
        selectedYear = localStorage.getItem('selectedYear') || document.getElementById('yearSelect').value;
        logMessage(`开始选课流程,选择的年份为：${selectedYear}`);
        if (window.location.href.includes(`ys=${selectedYear}`)) {
            processCourses();
        } else {
            logMessage(`当前页面不符合选择的年份 ${selectedYear}，请先选择正确的年份。`);
        }
    }

    function addCompletedHours(hours) {
        completedHours += hours;
        remainingHours = maxHours - completedHours;
        localStorage.setItem('totalCompletedHours', completedHours); // Save to localStorage
        document.getElementById('hoursInput').value = completedHours;
        logMessage(`课程选择成功，累计学时：${completedHours} 学时，剩余学时：${remainingHours} 学时`);
    }

    function resetCompletedHours() {
        completedHours = 0;
        remainingHours = maxHours;
        localStorage.setItem('totalCompletedHours', completedHours);
        document.getElementById('hoursInput').value = completedHours;
        logMessage("累计学时已清除。");
    }

    function processCourses() {
        const courseItems = document.querySelectorAll('ul.list-courses li');
        logMessage(`找到 ${courseItems.length} 门课程。`);

        if (courseItems.length === 0) {
            logMessage('未找到课程列表，请检查页面结构。');
            return;
        }

        remainingHours = maxHours - completedHours;
        const selectThreeHoursOnly = document.getElementById('selectThreeHours').checked;

        courseItems.forEach((course, index) => {
            const courseTypeElement = course.querySelector('.course-other .course-type');
            const courseHoursElement = course.querySelector('.course-hour span');
            const courseHours = parseFloat(courseHoursElement ? courseHoursElement.innerText : "0");
            const selectButton = course.querySelector('.course-detail-btn a');

            if (courseTypeElement) {
                const courseType = courseTypeElement.innerText.trim();

                logMessage(`检测到课程类型：${courseType}，学时：${courseHours}`);

                if (courseType.includes('公需')) {
                    if (completedHours >= maxHours) {
                        logMessage(`累计学时已达标（${completedHours} 学时），停止操作。`);
                        return;
                    }

                    if (selectButton.classList.contains('hasbuy')) {
                        logMessage(`该课程已学习，仍然将其学时加入累计。`);
                        addCompletedHours(courseHours);
                        return;
                    }

                    if (selectThreeHoursOnly && courseHours !== 3) {
                        logMessage(`选择的选项为只选择3学时课程，跳过此课程。`);
                        return;
                    }

                    if (courseHours <= remainingHours) {
                        courseQueue.push({ selectButton, courseHours });
                        logMessage(`将课程加入队列，学时：${courseHours}`);
                    } else {
                        logMessage(`剩余学时不足，跳过此课程。`);
                    }
                } else {
                    logMessage(`跳过非公需课的课程。`);
                }
            } else {
                logMessage('未能检测到课程类型信息。');
            }
        });

        if (courseQueue.length > 0) {
            processNextCourse();
        } else if (remainingHours > 0) {
            goToNextPage();
        } else {
            logMessage('已达到目标学时，停止操作。');
        }
    }

    function processNextCourse() {
        if (courseQueue.length === 0) {
            logMessage('课程队列处理完毕。');
            if (remainingHours > 0) {
                goToNextPage();
            } else {
                logMessage('已达到目标学时，停止操作。');
            }
            return;
        }

        const { selectButton, courseHours } = courseQueue.shift();

        logMessage(`开始处理选课，学时：${courseHours} 学时`);

        try {
            selectButton.click();
            logMessage('成功点击了选择按钮');

            setTimeout(() => {
                logMessage('等待课程页面操作完成...');
                setTimeout(() => {
                    addCompletedHours(courseHours);
                    if (remainingHours > 0) {
                        processNextCourse();
                    } else {
                        logMessage('已达到目标学时，停止操作。');
                    }
                }, 2000);
            }, 1000);
        } catch (error) {
            logMessage(`点击选择按钮时出错: ${error}`);
            processNextCourse();
        }
    }

    function goToNextPage() {
        const nextPageButton = Array.from(document.querySelectorAll('.ui-pagination-page-item'))
                                    .find(el => el.textContent.trim() === '下一页');
        if (nextPageButton) {
            logMessage(`检测到"下一页"按钮，按钮状态：${nextPageButton.className}`);
            if (!nextPageButton.classList.contains('disabled')) {
                logMessage('翻页到下一页...');
                try {
                    nextPageButton.click();
                    setTimeout(() => {
                        processCourses();
                    }, 2000);
                } catch (error) {
                    logMessage(`翻页时出错: ${error}`);
                }
            } else {
                logMessage('"下一页"按钮不可用，无法翻页。');
            }
        } else {
            logMessage('未检测到"下一页"按钮，可能没有更多页面。');
        }
    }

    function handleCourseSelection() {
        const courseButton = document.querySelector('#btn-addToShopcart.active');
        if (courseButton) {
            logMessage('找到"选择课程"按钮，准备点击...');
            courseButton.click();

            setTimeout(() => {
                const confirmButton = document.querySelector('a.l-btn.l-btn-small');
                if (confirmButton) {
                    logMessage('点击确认选择的"是"按钮...');
                    confirmButton.click();
                    logMessage('关闭课程详情页面...');
                    setTimeout(() => {
                        window.close();
                    }, 500);
                } else {
                    logMessage('未找到确认对话框中的"是"按钮。');
                }
            }, 500);
        } else {
            logMessage('未找到启用状态的"选择课程"按钮。');
        }
    }

    window.addEventListener('load', function() {
        createDebugWindow();
        createControlPanel();

        if (window.location.href.includes('courselist')) {
            logMessage('已加载课程列表页面，等待用户操作...');
            const urlParams = new URLSearchParams(window.location.search);
            const urlYear = urlParams.get('ys');
            if (urlYear) {
                selectedYear = urlYear;
                localStorage.setItem('selectedYear', selectedYear);
                document.getElementById('yearSelect').value = selectedYear;
            }
        } else if (window.location.href.includes('courseDetail')) {
            handleCourseSelection();
        }
    });

})();