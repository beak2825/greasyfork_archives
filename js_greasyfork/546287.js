// ==UserScript==
// @name         Edupage 文件拦截并下载 + 课表生成器
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  拦截 currenttt.js 与 maindbi.js 请求，每次拦截后弹窗询问用户是否下载，并提供生成课表的功能
// @author       schweigen
// @license      GPL-3.0
// @match        https://freshman.edupage.org/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/546287/Edupage%20%E6%96%87%E4%BB%B6%E6%8B%A6%E6%88%AA%E5%B9%B6%E4%B8%8B%E8%BD%BD%20%2B%20%E8%AF%BE%E8%A1%A8%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/546287/Edupage%20%E6%96%87%E4%BB%B6%E6%8B%A6%E6%88%AA%E5%B9%B6%E4%B8%8B%E8%BD%BD%20%2B%20%E8%AF%BE%E8%A1%A8%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 用于避免重复下载（如果你希望每次拦截都询问，可以移除此重复检查）
    const downloadedFiles = {};

    // 初始化拦截模式状态，默认为关闭
    let interceptEnabled = GM_getValue('interceptEnabled', false);

    // 生成课表的 HTML（已经更新为你给出的最新版本）
    const timetableHTML = `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>课表生成器</title>
    <style>
        /* 引入苹果风格的字体 */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

        body {
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
            color: #333;
        }

        h1 {
            text-align: center;
            color: #00C8FF; /* 蓝色标题 */
            margin-top: 30px;
            font-weight: 600;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 20px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            margin-top: 30px;
        }

        /* 调整后的textarea样式 */
        .code-block {
            position: relative;
            background-color: #f0f8ff;
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
            overflow-x: auto;
        }

        .code-block textarea {
            width: 100%;
            height: 200px; /* 将高度调整为200px */
            border: none;
            background: transparent;
            resize: vertical;
            font-size: 14px;
            line-height: 1.5;
            font-family: 'SF Mono', 'Roboto Mono', 'Courier New', monospace;
            color: #555;
            padding: 0;
            margin: 0;
            outline: none;
        }

        button {
            display: block;
            width: 100%;
            padding: 15px;
            background-color: #00C8FF; /* 蓝色按钮 */
            color: #fff;
            border: none;
            border-radius: 15px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.3s ease;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
        }

        button:hover {
            background-color: #00AEEF; /* 悬停时颜色变浅 */
            transform: translateY(-2px);
        }

        .button-text {
            position: relative;
            z-index: 1;
        }

        .bubble {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 105, 180, 0.6);
            animation: bubbleAnimation 1s ease-out;
            pointer-events: none;
        }

        @keyframes bubbleAnimation {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(1);
                opacity: 0;
            }
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background-color: #fff;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
        }

        th, td {
            padding: 15px;
            text-align: center;
            font-size: 16px;
            color: #555;
        }

        th {
            background-color: #00C8FF;
            color: #fff;
            font-weight: 600;
        }

        tr:nth-child(even) {
            background-color: #fafafa;
        }

        .copy-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: #00C8FF;
            color: #fff;
            border: none;
            cursor: pointer;
            padding: 6px 10px;
            font-size: 14px;
            border-radius: 12px;
            transition: background-color 0.3s ease, transform 0.3s ease;
            display: inline-block;
            width: auto;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .copy-button:hover {
            background-color: #00AEEF;
            transform: translateY(-2px);
        }

        .toast {
            position: fixed;
            bottom: -100px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 16px;
            transition: bottom 0.5s ease;
            z-index: 1000;
        }

        .toast.show {
            bottom: 50px;
        }

        @keyframes bounceIn {
            0% {
                transform: scale(0.3);
                opacity: 0;
            }
            50% {
                transform: scale(1.05);
                opacity: 0.7;
            }
            70% {
                transform: scale(0.9);
                opacity: 0.9;
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }

        .animated {
            animation: bounceIn 0.8s both;
        }

        .icon {
            width: 24px;
            height: 24px;
            vertical-align: middle;
            margin-right: 10px;
        }

        .message {
            font-style: italic;
            background: linear-gradient(45deg, #ff7e5f, #feb47b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: 1.2em;
            margin-top: 10px;
        }
    </style>
    <!-- 引入 anime.js 库 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>
</head>
<body>
    <!-- 添加烟花特效的 canvas 元素 -->
    <canvas class="fireworks" style="position: fixed; left: 0; top: 0; z-index: 99999999; pointer-events: none;"></canvas>

    <div class="container">
        <h1>🌟 课表生成器 🌟</h1>

        <!-- 添加输入数据的标题 -->
        <h2>🔢 输入数据</h2>

        <!-- currenttt.js 拖拽或手动输入 -->
        <div class="code-block">
            <textarea id="jsonInput" placeholder="请输入或拖拽 currenttt.js 数据"></textarea>
        </div>
        <!-- maindbi.js 拖拽或手动输入 -->
        <div class="code-block">
            <textarea id="maindbiInput" placeholder="请输入或拖拽 maindbi.js 数据"></textarea>
        </div>

        <div class="code-block">
            <textarea id="subjectMapInput" placeholder="请输入科目对应关系">
# 请按照以下格式添加科目对应关系：
# 科目ID=科目名称
# 例如：
FeP-VWL=经济
FeP-W-Mathe=数学
FeP-Deutsch=德语
FeP-Englisch=英语
noteninfo=Noteninfo
Fep-Tutorium Mathe=数学辅导
            </textarea>
        </div>

        <button onclick="generateTimetable()">
            <span class="button-text">生成课表</span>
        </button>

        <h2>📅 课表</h2>
        <table id="timetable">
            <tr>
                <th>日期</th>
                <th>时间</th>
                <th>科目</th>
                <th>教师</th>
                <th>教室</th>
            </tr>
        </table>

        <h2>📊 课程统计</h2>
        <div id="statistics"></div>

        <h2>📝 Markdown格式</h2>
        <div class="code-block" id="markdownOutputContainer">
            <button class="copy-button" onclick="copyToClipboard('markdownOutput', 'markdown')">复制</button>
            <pre id="markdownOutput"></pre>
        </div>

        <h2>📆 ICS格式</h2>
        <div class="code-block" id="icsOutputContainer">
            <button class="copy-button" onclick="copyToClipboard('icsOutput', 'ics')">复制</button>
            <pre id="icsOutput"></pre>
        </div>
    </div>

    <div id="toast" class="toast">已复制到剪贴板</div>

    <script>
        function generateTimetable() {
            const jsonInput = document.getElementById('jsonInput').value;
            const maindbiInput = document.getElementById('maindbiInput').value;
            const subjectMapInput = document.getElementById('subjectMapInput').value;

            try {
                const timetableData = JSON.parse(jsonInput);
                const maindbiData = JSON.parse(maindbiInput);

                const timetable = document.getElementById('timetable');
                // 清空表格内容
                timetable.innerHTML = '';
                timetable.innerHTML = '<tr><th>日期</th><th>时间</th><th>科目</th><th>教师</th><th>教室</th></tr>';

                const courses = timetableData.r.ttitems.filter(item => item.type === 'card' && !item.removed);
                const teachers = maindbiData.r.tables.find(table => table.id === 'teachers').data_rows;
                const subjects = maindbiData.r.tables.find(table => table.id === 'subjects').data_rows;
                const classrooms = maindbiData.r.tables.find(table => table.id === 'classrooms').data_rows;

                // 创建教师、科目和教室的映射表
                const teacherMap = new Map(teachers.map(teacher => [teacher.id, teacher.short]));
                const subjectMap = new Map(subjects.map(subject => [subject.id, subject.name]));
                const classroomMap = new Map(classrooms.map(classroom => [classroom.id, classroom.name]));

                // 创建自定义科目映射表
                const customSubjectMap = new Map();
                const lines = subjectMapInput.split('\\n');
                lines.forEach(line => {
                    const [key, value] = line.split('=');
                    if (key && value) {
                        customSubjectMap.set(key.trim().toLowerCase(), value.trim());
                    }
                });

                // 定义左、右教室列表
                const leftClassrooms = ['105','106','107','108','109','203','204','205','206','207','223','311','307','310','308','309'];
                const rightClassrooms = ['202', '222a', '212', '201', '305', '304', '303', '302', '301'];

                const lunchBreakStart = '11:45';
                const lunchBreakEnd = '12:45';

                let finalCourses = [];

                function timeToMinutes(timeStr) {
                    const [hours, minutes] = timeStr.split(':').map(Number);
                    return hours * 60 + minutes;
                }

                courses.forEach(course => {
                    const startTimeMinutes = timeToMinutes(course.starttime);
                    const endTimeMinutes = timeToMinutes(course.endtime);
                    const lunchStartMinutes = timeToMinutes(lunchBreakStart);
                    const lunchEndMinutes = timeToMinutes(lunchBreakEnd);

                    // 如果课程跨越午休时间段，我们将其拆分
                    if (startTimeMinutes < lunchEndMinutes && endTimeMinutes > lunchStartMinutes) {
                        // 午休前
                        if (startTimeMinutes < lunchStartMinutes) {
                            finalCourses.push({
                                date: course.date,
                                starttime: course.starttime,
                                endtime: lunchBreakStart,
                                subjectid: course.subjectid,
                                teacherids: course.teacherids,
                                classroomid: course.classroomids[0]
                            });
                        }
                        // 午休后
                        if (endTimeMinutes > lunchEndMinutes) {
                            finalCourses.push({
                                date: course.date,
                                starttime: lunchBreakEnd,
                                endtime: course.endtime,
                                subjectid: course.subjectid,
                                teacherids: course.teacherids,
                                classroomid: course.classroomids[0]
                            });
                        }
                    } else {
                        finalCourses.push({
                            date: course.date,
                            starttime: course.starttime,
                            endtime: course.endtime,
                            subjectid: course.subjectid,
                            teacherids: course.teacherids,
                            classroomid: course.classroomids[0]
                        });
                    }
                });

                // 排序 finalCourses
                finalCourses.sort((a, b) => {
                    if (a.date === b.date) {
                        return a.starttime.localeCompare(b.starttime);
                    }
                    return a.date.localeCompare(b.date);
                });

                // 合并相邻、相同课程
                const mergedCourses = [];
                for (let i = 0; i < finalCourses.length; i++) {
                    const current = finalCourses[i];
                    if (mergedCourses.length === 0) {
                        mergedCourses.push({ ...current });
                        continue;
                    }

                    const last = mergedCourses[mergedCourses.length - 1];

                    // 检查是否可以合并
                    if (
                        last.date === current.date &&
                        last.endtime === current.starttime &&
                        last.subjectid === current.subjectid &&
                        JSON.stringify(last.teacherids) === JSON.stringify(current.teacherids) &&
                        last.classroomid === current.classroomid
                    ) {
                        // 合并时间
                        last.endtime = current.endtime;
                    } else {
                        mergedCourses.push({ ...current });
                    }
                }

                let markdownOutput = '| 日期 | 时间 | 科目 | 教师 | 教室 |\\n| ---- | ---- | ---- | ---- | ---- |\\n';
                let icsOutput = 'BEGIN:VCALENDAR\\nVERSION:2.0\\nPRODID:-//Example Corp.//CalDAV Client//EN\\nCALSCALE:GREGORIAN\\n';

                // 定义节次时间段
                const periods = [
                    { start: '08:30', end: '09:15' },
                    { start: '09:15', end: '10:00' },
                    { start: '10:15', end: '11:00' },
                    { start: '11:00', end: '11:45' },
                    { start: '12:45', end: '13:30' },
                    { start: '13:30', end: '14:15' },
                    { start: '14:30', end: '15:15' },
                    { start: '15:15', end: '16:00' },
                    { start: '16:15', end: '17:00' },
                    { start: '17:00', end: '17:45' },
                    { start: '18:00', end: '18:45' },
                    { start: '18:45', end: '19:30' },
                ];

                // 统计科目节次数
                const subjectPeriodCounts = {};
                let totalPeriods = 0;

                mergedCourses.forEach(course => {
                    let subjectName = subjectMap.get(course.subjectid) || '';
                    subjectName = subjectName.trim().toLowerCase();
                    if (customSubjectMap.has(subjectName)) {
                        subjectName = customSubjectMap.get(subjectName);
                    }

                    const teacherNames = course.teacherids.map(id => teacherMap.get(id) || '').join(', ');
                    let classroomName = classroomMap.get(course.classroomid) || '无教室';

                    // 根据左、右教室来确定后缀
                    let classroomSide = '';
                    if (classroomName === '306') {
                        classroomSide = '前';
                    } else {
                        const leftClassrooms = ['105','106','107','108','109','203','204','205','206','207','223','311','307','310','308','309'];
                        const rightClassrooms = ['202', '222a', '212', '201', '305', '304', '303', '302', '301'];
                        if (leftClassrooms.includes(classroomName)) {
                            classroomSide = '左';
                        } else if (rightClassrooms.includes(classroomName)) {
                            classroomSide = '右';
                        } else if (classroomName.startsWith('0') || classroomName.startsWith('1')) {
                            // 你可以根据需求再细化规则
                            classroomSide = '右';
                        }
                    }

                    if (classroomSide) {
                        classroomName += classroomSide;
                    }

                    // 计算课程覆盖了多少节次
                    const courseStart = timeToMinutes(course.starttime);
                    const courseEnd = timeToMinutes(course.endtime);
                    let periodsCovered = 0;
                    for (let i = 0; i < periods.length; i++) {
                        const periodStart = timeToMinutes(periods[i].start);
                        const periodEnd = timeToMinutes(periods[i].end);
                        if (courseEnd > periodStart && courseStart < periodEnd) {
                            periodsCovered++;
                        }
                    }

                    if (!subjectPeriodCounts[subjectName]) {
                        subjectPeriodCounts[subjectName] = 0;
                    }
                    subjectPeriodCounts[subjectName] += periodsCovered;
                    totalPeriods += periodsCovered;

                    const row = timetable.insertRow();
                    row.insertCell().textContent = course.date;
                    row.insertCell().textContent = \`\${course.starttime}-\${course.endtime}\`;
                    row.insertCell().textContent = subjectName;
                    row.insertCell().textContent = teacherNames;
                    row.insertCell().textContent = classroomName;

                    markdownOutput += \`| \${course.date} | \${course.starttime}-\${course.endtime} | \${subjectName} | \${teacherNames} | \${classroomName} |\\n\`;

                    const startDateTime = \`\${course.date.replace(/-/g, '')}T\${course.starttime.replace(':', '')}00\`;
                    const endDateTime = \`\${course.date.replace(/-/g, '')}T\${course.endtime.replace(':', '')}00\`;
                    icsOutput += 'BEGIN:VEVENT\\n';
                    icsOutput += \`DTSTART;TZID=Europe/Berlin:\${startDateTime}\\n\`;
                    icsOutput += \`DTEND;TZID=Europe/Berlin:\${endDateTime}\\n\`;
                    icsOutput += \`SUMMARY:\${subjectName} \${teacherNames}\\n\`;
                    icsOutput += \`LOCATION:\${classroomName || '网课'}\\n\`;
                    icsOutput += 'DESCRIPTION:\\n';
                    icsOutput += 'END:VEVENT\\n';
                });

                icsOutput += 'END:VCALENDAR\\n';

                document.getElementById('markdownOutput').textContent = markdownOutput;
                document.getElementById('icsOutput').textContent = icsOutput;

                timetable.classList.add('animated');

                let statisticsHtml = '<ul>';
                const sortedSubjects = Object.keys(subjectPeriodCounts).sort((a, b) => subjectPeriodCounts[b] - subjectPeriodCounts[a]);
                sortedSubjects.forEach(subject => {
                    statisticsHtml += \`<li>\${subject}: \${subjectPeriodCounts[subject]} 节课</li>\`;
                });
                statisticsHtml += \`<li><strong>总共: \${totalPeriods} 节课</strong></li>\`;
                statisticsHtml += '</ul>';

                let message = '';
                if (totalPeriods <= 25) {
                    message = "尊嘟假嘟，这么少！你是想退休吗？";
                } else if (totalPeriods >= 40) {
                    message = "恭喜您，您的课程数已经突破天际！是不是在训练成为课程超人？";
                } else if (totalPeriods >= 25 && totalPeriods < 40) {
                    message = "接招吧！半径为2.5格的课程表水花！";
                }
                statisticsHtml += \`<div class="message">\${message}</div>\`;
                document.getElementById('statistics').innerHTML = statisticsHtml;
            } catch (error) {
                alert(\`错误: \${error.message}\`);
                console.error(error);
            }
        }

        function copyToClipboard(elementId, format) {
            const element = document.getElementById(elementId);
            const textArea = document.createElement("textarea");
            textArea.value = element.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);

            const toast = document.getElementById('toast');
            toast.textContent = \`\${format.toUpperCase()} 格式已复制到剪贴板\`;
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // 全局拖拽
        document.addEventListener('dragover', function(e) {
            e.preventDefault();
        });

        document.addEventListener('drop', function(e) {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (!files || !files.length) return;

            // 处理多个文件
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();

                reader.onload = function(event) {
                    // 根据文件名或内容，判断该放哪一个输入框
                    const content = event.target.result;

                    // ① 根据文件名判断
                    const lowerName = file.name.toLowerCase();
                    if (lowerName.includes('maindbi')) {
                        document.getElementById('maindbiInput').value = content;
                    } else if (lowerName.includes('currenttt')) {
                        document.getElementById('jsonInput').value = content;
                    } else {
                        // ② 若文件名不含 maindbi 或 currenttt，尝试判断内容
                        try {
                            const jsonObj = JSON.parse(content);
                            // 如果包含 tables 则认为是maindbi.js
                            if (jsonObj?.r?.tables) {
                                document.getElementById('maindbiInput').value = content;
                            }
                            // 如果包含 ttitems 则认为是currenttt.js
                            else if (jsonObj?.r?.ttitems) {
                                document.getElementById('jsonInput').value = content;
                            } else {
                                // 可能是未知文件，或者结构不一样
                                alert('无法识别文件类型: ' + file.name);
                            }
                        } catch (ex) {
                            alert('文件不是合法的JSON，无法解析: ' + file.name);
                        }
                    }
                };
                reader.readAsText(file);
            }
        });

        document.querySelector('button').addEventListener('click', function(event) {
            const button = event.currentTarget;
            const rect = button.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const bubbleSize = Math.random() * 50 + 20;
            const bubble = document.createElement('span');
            bubble.classList.add('bubble');
            bubble.style.left = \`\${x - bubbleSize / 2}px\`;
            bubble.style.top = \`\${y - bubbleSize / 2}px\`;
            bubble.style.width = \`\${bubbleSize}px\`;
            bubble.style.height = \`\${bubbleSize}px\`;
            button.appendChild(bubble);
            bubble.addEventListener('animationend', () => {
                bubble.remove();
            });
        });
    </script>

    <!-- 烟花特效代码（删除了圆圈效果，仅保留颗粒效果） -->
    <script>
        function updateCoords(e) {
            pointerX = (e.clientX || e.touches[0].clientX) - canvasEl.getBoundingClientRect().left;
            pointerY = (e.clientY || e.touches[0].clientY) - canvasEl.getBoundingClientRect().top;
        }
        function setParticuleDirection(e) {
            var t = anime.random(0, 360) * Math.PI / 180,
                a = anime.random(50, 180),
                n = [-1, 1][anime.random(0, 1)] * a;
            return {
                x: e.x + n * Math.cos(t),
                y: e.y + n * Math.sin(t)
            };
        }
        function createParticule(e, t) {
            var a = {};
            a.x = e;
            a.y = t;
            a.color = colors[anime.random(0, colors.length - 1)];
            a.radius = anime.random(16, 32);
            a.endPos = setParticuleDirection(a);
            a.draw = function() {
                ctx.beginPath();
                ctx.arc(a.x, a.y, a.radius, 0, 2 * Math.PI, true);
                ctx.fillStyle = a.color;
                ctx.fill();
            };
            return a;
        }
        function renderParticule(e) {
            for (var t = 0; t < e.animatables.length; t++)
                e.animatables[t].target.draw();
        }
        function animateParticules(e, t) {
            var particules = [];
            for (var i = 0; i < numberOfParticules; i++)
                particules.push(createParticule(e, t));
            anime.timeline().add({
                targets: particules,
                x: function(e) {
                    return e.endPos.x;
                },
                y: function(e) {
                    return e.endPos.y;
                },
                radius: 0.1,
                duration: anime.random(1200, 1800),
                easing: "easeOutExpo",
                update: renderParticule
            });
        }
        function debounce(fn, delay) {
            var timer;
            return function () {
                var context = this;
                var args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fn.apply(context, args);
                }, delay);
            }
        }

        var canvasEl = document.querySelector(".fireworks");
        if (canvasEl) {
            var ctx = canvasEl.getContext("2d"),
                numberOfParticules = 30,
                pointerX = 0,
                pointerY = 0,
                tap = "mousedown",
                colors = ["#FF1461", "#18FF92", "#5A87FF", "#FBF38C"],
                setCanvasSize = debounce(function() {
                    canvasEl.width = 2 * window.innerWidth;
                    canvasEl.height = 2 * window.innerHeight;
                    canvasEl.style.width = window.innerWidth + "px";
                    canvasEl.style.height = window.innerHeight + "px";
                    canvasEl.getContext("2d").scale(2, 2);
                }, 500),
                render = anime({
                    duration: Infinity,
                    update: function() {
                        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
                    }
                });
            document.addEventListener(tap, function(e) {
                if (e.target.id !== "sidebar" && e.target.id !== "toggle-sidebar" && e.target.nodeName !== "A" && e.target.nodeName !== "IMG") {
                    render.play();
                    updateCoords(e);
                    animateParticules(pointerX, pointerY);
                }
            }, false);
            setCanvasSize();
            window.addEventListener("resize", setCanvasSize, false);
        }
    </script>
</body>
</html>`;

    // 注册菜单命令
    function updateMenu() {
        GM_registerMenuCommand(
            interceptEnabled ? "关闭拦截模式" : "开启拦截模式",
            toggleInterceptMode
        );

        // 新增“生成课表”菜单项
        GM_registerMenuCommand("生成课表", openTimetablePage);
    }

    // 切换拦截模式
    function toggleInterceptMode() {
        interceptEnabled = !interceptEnabled;
        GM_setValue('interceptEnabled', interceptEnabled);
        alert(interceptEnabled ? "拦截模式已开启" : "拦截模式已关闭");
        updateMenu();
    }

    // 打开课表生成器页面
    function openTimetablePage() {
        const blob = new Blob([timetableHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }

    // 初始化菜单
    updateMenu();

    // 根据 URL 固定重命名文件
    function getFixedFilename(url) {
        if (url.includes("currenttt.js")) {
            return "currenttt.js";
        }
        if (url.includes("maindbi.js")) {
            return "maindbi.js";
        }
        return url.split("/").pop();
    }

    // 弹窗询问后下载文件
    function promptAndDownload(url, text) {
        // 如果拦截模式关闭，则不执行任何操作
        if (!interceptEnabled) {
            return;
        }

        const filename = getFixedFilename(url);
        // 如果已经下载过，就不再重复提示（如果希望每次都提示，可以将这段判断删除）
        if (downloadedFiles[filename]) {
            return;
        }
        if (confirm("是否下载文件 " + filename + " ?")) {
            const blob = new Blob([text], { type: "application/javascript" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            downloadedFiles[filename] = true;
        }
    }

    // 拦截 XMLHttpRequest 请求
    const originalXHRopen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        this._interceptUrl = url;
        return originalXHRopen.apply(this, arguments);
    };

    const originalXHRsend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
        this.addEventListener("load", function () {
            if (
                this._interceptUrl &&
                (this._interceptUrl.includes("currenttt.js") || this._interceptUrl.includes("maindbi.js"))
            ) {
                promptAndDownload(this._interceptUrl, this.responseText);
            }
        });
        return originalXHRsend.apply(this, arguments);
    };

    // 拦截 fetch 请求
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
        return originalFetch.apply(this, args).then(response => {
            if (
                response.url &&
                (response.url.includes("currenttt.js") || response.url.includes("maindbi.js"))
            ) {
                response.clone().text().then(text => {
                    promptAndDownload(response.url, text);
                });
            }
            return response;
        });
    };
})();
