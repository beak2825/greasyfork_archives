// ==UserScript==
// @name         Sandau-选课小助手
// @namespace    http://tampermonkey.net/
// @version      2024.1.0.0
// @description  用于自动选课时，用户可以通过输入课程ID、页数和时间来进行自动操作。这个脚本旨在简化用户的选课流程，提供了更便捷的选课体验。
// @author       Qili
// @match        https://jw.sandau.edu.cn/eams-shuju/stdElectCourse!defaultPage.action*
// @icon         https://www.sandau.edu.cn/_upload/tpl/00/65/101/template101/images/foot_l.png
// @grant        none
// @license none
// @downloadURL https://update.greasyfork.org/scripts/483278/Sandau-%E9%80%89%E8%AF%BE%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/483278/Sandau-%E9%80%89%E8%AF%BE%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';

 // Panel
    var panel = document.createElement('div');
    panel.style.background = '#f3f3f3';
    panel.style.border = '1px solid #ddd';
    panel.style.borderRadius = '8px';
    panel.style.padding = '10px';
    panel.style.position = 'fixed';
    panel.style.top = '10px';
    panel.style.right = '10px';
    panel.style.width = '220px';
    panel.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    document.body.appendChild(panel);

    var title = document.createElement('div');
    title.textContent = 'Qili选课小助手';
    title.style.textAlign = 'center';
    title.style.marginBottom = '12px';
    panel.appendChild(title);
    // Input for Course ID
    var input = document.createElement('input');
    input.placeholder = '输入课程ID';
    input.style.width = '100%';
    input.style.marginBottom = '10px';
    panel.appendChild(input);

    var pageNumberInput = document.createElement('input');
    pageNumberInput.placeholder = '输入页码(可以为空)';
    pageNumberInput.style.width = '100%';
    pageNumberInput.style.marginBottom = '10px';
    panel.appendChild(pageNumberInput);

    // Input for Time
    var timeInput = document.createElement('input');
    timeInput.type = 'time';
    timeInput.step = '1';
    timeInput.style.width = '100%';
    panel.appendChild(timeInput);

    var clearTimeButton = document.createElement('button');
    clearTimeButton.innerHTML = '清空所有';
    clearTimeButton.style.width = '100%';
    clearTimeButton.style.marginTop = '5px';
    panel.appendChild(clearTimeButton);

    // Button
    var button = document.createElement('button');
    button.innerHTML = '自动选课';
    button.style.width = '100%';
    button.style.marginTop = '10px';
    panel.appendChild(button);

    var countdownDisplay = document.createElement('div');
    countdownDisplay.style.marginTop = '10px';
    panel.appendChild(countdownDisplay);


    var timeToggleCheckbox = document.createElement('input');
    timeToggleCheckbox.type = 'checkbox';
    timeToggleCheckbox.checked = true;
    timeToggleCheckbox.style.marginTop = '5px';
    panel.appendChild(timeToggleCheckbox);

    var timeToggleLabel = document.createElement('label');
    timeToggleLabel.textContent = '启用定时';
    timeToggleLabel.style.marginLeft = '5px';
    panel.appendChild(timeToggleLabel);


    var timeToggleContainer = document.createElement('div');
    timeToggleContainer.style.display = 'flex';
    timeToggleContainer.style.justifyContent = 'center'; // Center horizontally
    timeToggleContainer.style.alignItems = 'center'; // Center vertically
    timeToggleContainer.style.marginBottom = '10px';

    timeToggleContainer.appendChild(timeToggleCheckbox);
    timeToggleContainer.appendChild(timeToggleLabel);
    panel.appendChild(timeToggleContainer);



    input.value = localStorage.getItem('savedCourseId') || '';
    timeInput.value = localStorage.getItem('savedTime') || '';

    var savedTimerTime = localStorage.getItem('savedTimerTime');
    if (savedTimerTime) {
        var savedDateTime = new Date(savedTimerTime);
        if (savedDateTime > new Date()) {
            startCountdown(savedDateTime, input.value.trim());
        }
    }

    var togglePanelButton = document.createElement('button');
    togglePanelButton.innerHTML = '👉🏻'; // Arrow symbol indicating collapse
    togglePanelButton.style.position = 'absolute';
    togglePanelButton.style.top = '0';
    togglePanelButton.style.right = '100%'; // Position to the left of the panel
    panel.appendChild(togglePanelButton);

    var isPanelCollapsed = false;
    var countdown;

    togglePanelButton.addEventListener('click', function() {
        if (isPanelCollapsed) {
            // Expand the panel
            panel.style.width = '220px';
            input.style.display = 'block';
            timeInput.style.display = timeToggleCheckbox.checked ? 'block' : 'none';
            clearTimeButton.style.display = timeToggleCheckbox.checked ? 'block' : 'none';
            button.style.display = 'block';
            countdownDisplay.style.display = 'block';
            timeToggleCheckbox.style.display = 'block';
            timeToggleLabel.style.display = 'block';
            pageNumberInput.style.display = 'block';
            togglePanelButton.innerHTML = '👉🏻';
        } else {
            // Collapse the panel
            panel.style.width = '20px';
            input.style.display = 'none';
            timeInput.style.display = 'none';
            clearTimeButton.style.display = 'none';
            button.style.display = 'none';
            countdownDisplay.style.display = 'none';
            timeToggleCheckbox.style.display = 'none';
            timeToggleLabel.style.display = 'none';
            pageNumberInput.style.display = 'none';
            togglePanelButton.innerHTML = '👈🏻';
        }
        isPanelCollapsed = !isPanelCollapsed;
    });

        // Toggle functionality
    timeToggleCheckbox.addEventListener('change', function() {
        if (timeToggleCheckbox.checked) {
            timeInput.style.display = 'block';
        } else {
            timeInput.style.display = 'none';
            timeInput.value = ''; // Clear the time input
            countdownDisplay.textContent = ''; // Clear countdown display
        }
    });

    button.addEventListener('click', function() {
        var courseId = input.value.trim();
        var startTime = timeInput.value;
        var pageNumber = pageNumberInput.value;
        localStorage.setItem('savedCourseId', courseId);
        localStorage.setItem('savedTime', startTime);
        localStorage.setItem('savedPageNumber', pageNumber);
        clearInterval(countdown);
        if (courseId) {
            if (startTime) {
                var startDateTime = new Date();
                var timeParts = startTime.split(':');
                startDateTime.setHours(timeParts[0], timeParts[1], timeParts[2] || 0);
                localStorage.setItem('savedTimerTime', startDateTime.toString());


                var now = new Date();
                var delay = startDateTime.getTime() - now.getTime();

                if (delay < 0) {
                    countdownDisplay.textContent = '所选时间已过，请选择未来的时间。';
                    return;
                }
                startCountdown(startDateTime, courseId);

            } else {
                localStorage.setItem('globalNumber', 3);
                localStorage.removeItem('savedTime');
                countdownDisplay.textContent = '';
                trySelectCourse(courseId);
            }
        }
    });
        // 在倒计时结束后执行抢课操作
    function startCountdown(startDateTime, courseId) {
        countdown = setInterval(function() {
            var now = new Date();
            var remaining = startDateTime.getTime() - now.getTime();

            if (remaining <= 1) {
                clearInterval(countdown);
                countdownDisplay.textContent = '启动成功...';
                // 等待一小段时间后刷新页面
                setTimeout(function() {
                    location.reload();
                }, 1000);
            } else {
                localStorage.setItem('globalNumber', 3);
                var seconds = Math.floor(remaining / 1000);
                countdownDisplay.textContent = '自动脚本还剩: ' + seconds + 's执行';
            }
        }, 1000);
    }
        window.addEventListener('load', function() {
            clearInterval(countdown);
            openEnterCourseSelection();
            if (window.location.href.startsWith('https://jw.sandau.edu.cn/eams-shuju/stdElectCourse!defaultPage.action?electionProfile.id=')) {
            var courseId = localStorage.getItem('savedCourseId');
            if (courseId) {
                trySelectCourse(courseId);
                localStorage.removeItem('savedTime');
            }
        }
        });

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function selectCourse(courseId) {
        var rows = document.querySelectorAll('#electableLessonList tr');
        var found = false;

        for (const row of rows) {
            var currentId = row.cells[1] ? row.cells[1].textContent.trim() : '';
            if (currentId === courseId) {
                found = true;
                var electLink = row.querySelector('a.lessonListOperator');
                if (electLink) {
                    electLink.click();
                    console.log('尝试选课');
                    await sleep(800);
                    var outerDiv = document.getElementById('cboxLoadedContent');
                    if (outerDiv) {
                        var errorText = outerDiv.textContent.trim();
                        console.log(errorText);
                        if (!errorText.includes('抢课成功')) {
                            var closeButton = document.getElementById('cboxClose');
                            if (closeButton) {
                                closeButton.click();
                            }
                        }
                    } else {
                        console.log('未找到特定 ID 元素');
                    }

                }
            }
        }

        return found;
    }

    function openEnterCourseSelection() {
        if (window.location.href === 'https://jw.sandau.edu.cn/eams-shuju/stdElectCourse.action') {
            var savedCourseId = localStorage.getItem('savedCourseId');
            if (savedCourseId) { // 检查 savedCourseId 是否存在且不为空
                var enterButtons = document.querySelectorAll("button[onclick*='/eams-shuju/stdElectCourse!defaultPage.action']");
                var lastEnterButton = enterButtons[enterButtons.length - 1];
                if (lastEnterButton && lastEnterButton.innerText === '进入选课') {
                    lastEnterButton.click();
                }
            }
        }
    }
    function clickPageNumber(pageNumber) {
    var paginationLinks = document.querySelectorAll('.pgButton');
    for (const link of paginationLinks) {
        if (link.getAttribute('pageno') === pageNumber) {
            link.click();
            break;
        }
    }
    }

    clearTimeButton.addEventListener('click', function() {
        // 清除原先设置的计时器
        clearInterval(countdown);

        // 清空 LocalStorage 中的数据
        localStorage.removeItem('savedCourseId');
        localStorage.removeItem('savedPageNumber');
        localStorage.removeItem('savedTime');
        input.value = '';
        timeInput.value = '';
        countdownDisplay.textContent = '';
        pageNumberInput.value = '';
    });

    async function trySelectCourse(courseId) {
        var savedPageNumber = localStorage.getItem('savedPageNumber');
        if (savedPageNumber) {
            clickPageNumber(savedPageNumber);
        }
        var found = await selectCourse(courseId);
        if (!found) {
            console.log('未找到该课程ID: ' + courseId);
            countdownDisplay.textContent = '未找到该课程ID: ' + courseId;
            return;
        }else{
            for (var i = 1; i < 3; i++) {
                await sleep(500);
                await selectCourse(courseId);
            }
            var outerDiv = document.getElementById('cboxLoadedContent');
            var errorText = outerDiv.textContent.trim();
            console.log(errorText);
            var savedGlobalNumber = localStorage.getItem('globalNumber');
            if (!errorText.includes('抢课成功')) {
                console.log('进入条件');
                console.log('savedGlobalNumber:', savedGlobalNumber);

                if (savedGlobalNumber !== '1') {
                    console.log('执行条件内部');
                    savedGlobalNumber--;
                    console.log('savedGlobalNumber after decrement:', savedGlobalNumber);
                    localStorage.setItem('globalNumber', savedGlobalNumber);
                    location.reload();
                    return;
                }
            }
            localStorage.removeItem('globalNumber');
            localStorage.removeItem('savedPageNumber');
            localStorage.removeItem('savedCourseId');
            timeInput.value = '';
            countdownDisplay.textContent = '';

        }

    }
})();
