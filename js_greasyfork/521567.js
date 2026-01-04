// ==UserScript==
// @name         齐齐哈尔大学抢课
// @namespace    
// @version      1.0
// @description  仅供学习交流使用，可同时匹配多个课程代码，课程码为纯数字，例如“体育4（1234-5）”就填“412345”
// @icon         https://xyh.qqhru.edu.cn/favicon.ico
// @author       忘忧
// @license MIT
// @match        http://111.43.36.164/student/courseSelect/courseSelect/index
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521567/%E9%BD%90%E9%BD%90%E5%93%88%E5%B0%94%E5%A4%A7%E5%AD%A6%E6%8A%A2%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/521567/%E9%BD%90%E9%BD%90%E5%93%88%E5%B0%94%E5%A4%A7%E5%AD%A6%E6%8A%A2%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let targetCourses = [];
    let matchedCourses = [];
    let timer = null;

    // 创建UI
    function createUI() {
        console.log('[初始化] 正在创建 UI...');
        const uiContainer = document.createElement('div');
        uiContainer.id = 'uiContainer';
        uiContainer.style.position = 'absolute';
        uiContainer.style.top = '10px';
        uiContainer.style.right = '10px';
        uiContainer.style.width = '300px';
        uiContainer.style.backgroundColor = '#f4f4f4';
        uiContainer.style.border = '1px solid #ccc';
        uiContainer.style.padding = '10px';
        uiContainer.style.zIndex = '9999';
        uiContainer.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';

        uiContainer.innerHTML = `
            <div id="dragBar" style="background-color: #007bff; color: white; padding: 5px; text-align: center; cursor: grab;">
                抢课工具
            </div>
            <div style="padding: 5px;">
                <label>课程代码: 
                    <textarea id="courseCode" style="width: 90%; height: 60px;" placeholder="输入多个课程代码，一行一个"></textarea>
                </label>
                <br />
                <button class="ui-button" id="addCourses">添加课程</button>
                <div id="courseList" style="margin: 5px 0; max-height: 100px; overflow-y: auto; border: 1px solid #ccc; padding: 5px;">
                    <p style="margin: 0;">暂无课程</p>
                </div>
                <button class="ui-button" id="startScript">启动抢课</button>
                <button class="ui-button" id="stopScript" disabled>停止抢课</button>
                <div id="matchedCourses" style="margin: 10px 0; max-height: 100px; overflow-y: auto; border: 1px solid #ccc; padding: 5px;">
                    <p style="margin: 0;">匹配成功的课程代码</p>
                </div>
            </div>
        `;

        document.body.appendChild(uiContainer);

        const style = document.createElement('style');
        style.innerHTML = `
            .ui-button {
                background: #007bff;
                color: white;
                border: none;
                padding: 10px;
                cursor: pointer;
                width: 100%;
                margin-bottom: 5px;
                transition: background 0.3s, transform 0.1s;
            }
            .ui-button:active {
                background: #0056b3;
                transform: scale(0.95);
            }
        `;
        document.head.appendChild(style);

        document.getElementById('addCourses').addEventListener('click', addCourses);
        document.getElementById('startScript').addEventListener('click', startScript);
        document.getElementById('stopScript').addEventListener('click', stopScript);

        // 调用拖动功能
        makeDraggable(uiContainer);
        console.log('[初始化] UI 创建完成');
    }

    // 实现拖动功能并防止 UI 超出页面
    function makeDraggable(element) {
        const dragBar = document.getElementById('dragBar');
        let offsetX = 0;
        let offsetY = 0;
        let isDragging = false;

        dragBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            dragBar.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none'; // 禁止文本选择
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                let newX = e.clientX - offsetX;
                let newY = e.clientY - offsetY;

                // 限制 UI 在页面内
                const maxX = window.innerWidth - element.offsetWidth;
                const maxY = window.innerHeight - element.offsetHeight;
                if (newX < 0) newX = 0;
                if (newY < 0) newY = 0;
                if (newX > maxX) newX = maxX;
                if (newY > maxY) newY = maxY;

                element.style.left = `${newX}px`;
                element.style.top = `${newY}px`;
                element.style.position = 'absolute';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            dragBar.style.cursor = 'grab';
            document.body.style.userSelect = ''; // 恢复文本选择
        });
    }

    // 添加课程（逐行输入）
    function addCourses() {
        console.log('[操作] 添加课程...');
        const courseCodesInput = document.getElementById('courseCode').value.trim();
        if (courseCodesInput) {
            const courses = courseCodesInput.split('\n').map(code => code.trim()); // 按行分隔并去除多余空格
            targetCourses = targetCourses.concat(courses.filter(code => !targetCourses.includes(code))); // 去重
            updateCourseList();
            document.getElementById('courseCode').value = '';
            console.log(`[操作成功] 已添加课程代码: ${courses.join(', ')}`);
        } else {
            console.warn('[操作失败] 请输入课程代码');
        }
    }

    // 更新课程列表
    function updateCourseList() {
        console.log('[操作] 更新课程列表...');
        const courseListDiv = document.getElementById('courseList');
        courseListDiv.innerHTML = '';

        if (targetCourses.length === 0) {
            courseListDiv.innerHTML = '<p style="margin: 0;">暂无课程</p>';
            console.log('[操作成功] 当前课程列表为空');
        } else {
            targetCourses.forEach((course, index) => {
                const courseItem = document.createElement('div');
                courseItem.style.display = 'flex';
                courseItem.style.justifyContent = 'space-between';
                courseItem.style.marginBottom = '5px';

                courseItem.innerHTML = `
                    <span>${course}</span>
                    <button style="color: white; background: red; border: none; cursor: pointer;" data-index="${index}">删除</button>
                `;

                courseItem.querySelector('button').addEventListener('click', (e) => {
                    const idx = e.target.getAttribute('data-index');
                    targetCourses.splice(idx, 1);
                    updateCourseList();
                    console.log(`[操作成功] 已删除课程代码: ${course}`);
                });

                courseListDiv.appendChild(courseItem);
            });
            console.log('[操作成功] 更新课程列表完成');
        }
    }

    // 更新匹配成功的课程列表
    function updateMatchedCourses() {
        console.log('[操作] 更新匹配成功的课程列表...');
        const matchedCoursesDiv = document.getElementById('matchedCourses');
        matchedCoursesDiv.innerHTML = '';

        if (matchedCourses.length === 0) {
            matchedCoursesDiv.innerHTML = '<p style="margin: 0;">匹配成功的课程代码</p>';
        } else {
            matchedCourses.forEach(course => {
                const courseItem = document.createElement('div');
                courseItem.textContent = course;
                matchedCoursesDiv.appendChild(courseItem);
            });
            console.log('[操作成功] 更新匹配成功的课程列表完成');
        }
    }

    // 点击提交按钮
    function clickSubmitButton() {
        const button = document.querySelector('#submitButton'); // 在主页面上下文查找提交按钮
        if (button) {
            console.log('[操作成功] 找到提交按钮，正在尝试使用 dispatchEvent 提交...');
            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            button.dispatchEvent(event); // 使用 dispatchEvent 触发事件
            console.log('[操作成功] 使用 dispatchEvent 提交课程');
        } else {
            console.warn('[警告] 未找到提交按钮，请检查选择器是否正确');
        }
    }

    // 检查并选中课程
    async function checkAndSelectCourses() {
        console.log('[操作] 开始检查课程...');
        const iframeDoc = document.querySelector('#ifra')?.contentDocument;
        if (!iframeDoc) {
            console.error('[错误] 无法获取 iframe 文档');
            return;
        }

        if (targetCourses.length === 0) {
            console.log('[操作完成] 所有课程已处理，尝试提交...');
            clickSubmitButton();
            stopScript();
            return;
        }

        const courseCode = targetCourses[0]; // 获取第一个课程码
        const rows = iframeDoc.querySelectorAll('tr');
        console.log(`[调试] 正在匹配课程代码: ${courseCode}，总共找到 ${rows.length} 行课程数据`);

        let matched = false;

        rows.forEach((row) => {
            const courseCells = row.querySelectorAll('td[rowspan]'); // 匹配所有具有 rowspan 属性的单元格
            courseCells.forEach((courseCell) => {
                const cellText = courseCell.textContent.trim();
                const cellNumber = cellText.match(/\d+/g)?.join('') || '';
                console.log(`[调试] 检查单元格内容: ${cellText}, 提取的数字: ${cellNumber}`);

                if (cellNumber === courseCode) {
                    matched = true;
                    console.log(`[匹配成功] 课程代码: ${courseCode}, 单元格内容: ${cellText}`);

                    const checkbox = row.querySelector(`input[type="checkbox"]`);
                    if (checkbox && !checkbox.checked) {
                        checkbox.click();
                        console.log(`[操作成功] 已勾选课程: ${courseCode}`);
                    }
                }
            });
        });

        if (matched) {
            console.log(`[操作完成] 已处理课程: ${courseCode}`);
            matchedCourses.push(courseCode);
            updateMatchedCourses();
            targetCourses.shift(); // 移除已处理的课程码
        } else {
            console.warn(`[警告] 未匹配到课程代码: ${courseCode}`);
        }
    }

    // 启动脚本
    function startScript() {
        console.log('[操作] 启动脚本...');
        if (targetCourses.length === 0) {
            alert('[错误] 请先添加课程');
            return;
        }

        timer = setInterval(checkAndSelectCourses, 1000);
        document.getElementById('startScript').disabled = true;
        document.getElementById('stopScript').disabled = false;
        console.log('[操作成功] 脚本已启动');
    }

    // 停止脚本
    function stopScript() {
        console.log('[操作] 停止脚本...');
        clearInterval(timer);
        timer = null;

        document.getElementById('startScript').disabled = false;
        document.getElementById('stopScript').disabled = true;
        console.log('[操作成功] 脚本已停止');
    }

    // 初始化脚本
    window.addEventListener('load', createUI);
})();
