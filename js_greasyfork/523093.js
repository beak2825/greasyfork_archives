// ==UserScript==
// @name         BUPT Course Grabber
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  BUPT抢课脚本
// @author       Shxuuer
// @match        *://*/jsxsd/xsxk/xsxk_index*
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523093/BUPT%20Course%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/523093/BUPT%20Course%20Grabber.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var courses = GM_getValue('courses', []);
    var interval = GM_getValue('interval', 3000);
    var targets = [];
    var running = false;
    var intervalId;

    let startButton, stopButton, statusLabel;

    function getCourses() {
        let params = {
            sEcho: 1,
            iColumns: 11,
            iDisplayStart: 0,
            iDisplayLength: 99999,
        };
        let paths = [
            '/jsxsd/xsxkkc/xsxkBxxk',
            '/jsxsd/xsxkkc/xsxkXxxk',
            '/jsxsd/xsxkkc/xsxkGgxxkxk',
        ];
        for (let path of paths) {
            $.post(path, params, processData);
        }
    }

    function processData(resp) {
        let data = $.parseJSON(resp).aaData;
        for (let course of data) {
            if (courses.includes(course.kcmc)) {
                targets.push([course.kch, course.jx0404id]);
            }
        }
    }

    function takeCourses() {
        if (!targets.length) getCourses();
        for (let target of targets) {
            $.ajax({
                url: "/jsxsd/xsxkkc/xxxkOper",
                data: {
                    kcid: target[0],
                    jx0404id: target[1]
                }
            });
        }
    }

    function start() {
        if (running) return;
        running = true;
        intervalId = setInterval(takeCourses, interval);
        updateUI();
    }

    function stop() {
        if (!running) return;
        running = false;
        clearInterval(intervalId);
        updateUI();
    }

    function saveData() {
        GM_setValue('courses', courses);
        GM_setValue('interval', interval);
    }

    function updateUI() {
        startButton.style.display = running ? 'none' : 'inline-block';
        stopButton.style.display = running ? 'inline-block' : 'none';
        statusLabel.textContent = running ? '状态: 正在运行' : '状态: 未运行';
    }

    function createUI() {
        const container = document.createElement('div');
        container.style = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 20px;
            background: #fff;
            border: 1px solid #ddd;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;

        const title = document.createElement('h4');
        title.textContent = '抢课工具';
        title.style.marginBottom = '10px';
        container.appendChild(title);

        const intervalLabel = document.createElement('label');
        intervalLabel.textContent = '时间间隔 (ms):';
        intervalLabel.style.marginRight = '8px';

        const intervalInput = document.createElement('input');
        intervalInput.type = 'number';
        intervalInput.value = interval;
        intervalInput.style = 'width: 60px; padding: 4px; margin-bottom: 10px;';
        intervalInput.onchange = () => {
            interval = parseInt(intervalInput.value) || 300;
            saveData();
        };

        container.appendChild(intervalLabel);
        container.appendChild(intervalInput);

        const courseInput = document.createElement('input');
        courseInput.type = 'text';
        courseInput.placeholder = '输入课程名称';
        courseInput.style = 'width: calc(100% - 90px); padding: 6px; margin-bottom: 10px;';

        const addButton = document.createElement('button');
        addButton.textContent = '添加';
        addButton.style = 'padding: 6px 12px; margin-left: 8px;';
        addButton.onclick = () => {
            const courseName = courseInput.value.trim();
            if (courseName && !courses.includes(courseName)) {
                courses.push(courseName);
                updateCourseList();
                saveData();
            }
            courseInput.value = '';
        };

        container.appendChild(courseInput);
        container.appendChild(addButton);

        const courseList = document.createElement('ul');
        courseList.style = 'list-style: none; padding: 0; margin-top: 10px;';

        function updateCourseList() {
            courseList.innerHTML = '';
            courses.forEach((course, index) => {
                const li = document.createElement('li');
                li.style = 'margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;';

                const courseText = document.createElement('span');
                courseText.textContent = course;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = '删除';
                deleteButton.style = 'padding: 4px 8px;';
                deleteButton.onclick = () => {
                    courses.splice(index, 1);
                    updateCourseList();
                    saveData();
                };

                li.appendChild(courseText);
                li.appendChild(deleteButton);
                courseList.appendChild(li);
            });
        }

        container.appendChild(courseList);
        updateCourseList();

        startButton = document.createElement('button');
        startButton.textContent = '开始';
        startButton.style = 'padding: 8px 16px; margin-right: 10px;';
        startButton.onclick = start;

        stopButton = document.createElement('button');
        stopButton.textContent = '暂停';
        stopButton.style = 'padding: 8px 16px; display: none;';
        stopButton.onclick = stop;

        statusLabel = document.createElement('span');
        statusLabel.textContent = '状态: 未运行';
        statusLabel.style = 'margin-left: 10px; font-weight: bold;';

        container.appendChild(startButton);
        container.appendChild(stopButton);
        container.appendChild(statusLabel);

        document.body.appendChild(container);
    }

    createUI();
})();
