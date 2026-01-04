// ==UserScript==
// @name         导出课程为ics日历
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  从课程页面提取课程信息并导出为.ics文件，并添加学年学期选择功能
// @author       YUAN
// @match        https://yjsxk.xidian.edu.cn/yjsxkapp/sys/xsxkapp/course.html
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/507813/%E5%AF%BC%E5%87%BA%E8%AF%BE%E7%A8%8B%E4%B8%BAics%E6%97%A5%E5%8E%86.user.js
// @updateURL https://update.greasyfork.org/scripts/507813/%E5%AF%BC%E5%87%BA%E8%AF%BE%E7%A8%8B%E4%B8%BAics%E6%97%A5%E5%8E%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建导出按钮
    let exportBtn = document.createElement('button');
    exportBtn.innerText = '导出为日历文件';
    exportBtn.style.position = 'fixed';
    exportBtn.style.top = '20px';
    exportBtn.style.right = '500px';
    exportBtn.style.zIndex = '1000';
    document.body.appendChild(exportBtn);

    // 创建学年学期下拉框
    let semesterSelect = document.createElement('select');
    semesterSelect.style.position = 'fixed';
    semesterSelect.style.top = '20px';
    semesterSelect.style.right = '600px';
    semesterSelect.style.zIndex = '1000';
    document.body.appendChild(semesterSelect);

    // 填充下拉框选项（从2024春到2027秋）
    let semesters = [];
    let startYear = 2023;
    let endYear = 2027;
    let seasons = ['春', '秋'];

    for (let year = startYear; year <= endYear; year++) {
        seasons.forEach(season => {
            let sem = `${year}${season}`;
            semesters.push(sem);
        });
    }

    semesters.forEach(sem => {
        let option = document.createElement('option');
        option.value = sem;
        option.text = sem;
        semesterSelect.appendChild(option);
    });

    // 点击导出按钮时，读取学年学期并弹出日期选择框
    exportBtn.addEventListener('click', function() {
        let selectedSemester = semesterSelect.value;
        if (!selectedSemester) {
            alert("请选择学年学期！");
            return;
        }

        let startDate = prompt("请输入第一周的起始日期 (格式：YYYY-MM-DD)", "2024-09-02");
        if (!startDate) {
            alert("起始日期不能为空");
            return;
        }
        startDate = new Date(startDate);

        let courses = [];
        let rows = document.querySelectorAll('table tbody tr');

        rows.forEach((row) => {
            let cells = row.querySelectorAll('td');
            if (cells.length > 0) {
                let semesterField = cells[0]?.innerText.trim();
                if (semesterField === selectedSemester) {
                    let courseName = cells[1]?.innerText.trim();
                    let campus = cells[3]?.innerText.trim();
                    let teacher = cells[4]?.innerText.trim();
                    let category = cells[6]?.innerText.trim();
                    let timePlace = cells[8]?.innerHTML.trim(); 




                    let cleanedCourseName =extractLastParenthesisContent( courseName)

                    function extractLastParenthesisContent(text) {
                        let stack = [];
                        let lastContent = "";

                        // 遍历字符串以找到所有括号
                        for (let i = 0; i < text.length; i++) {
                            if (text[i] === '(' || text[i] === '（') {
                                stack.push(i);
                            } else if (text[i] === ')' || text[i] === '）') {
                                if (stack.length > 0) {
                                    let openIndex = stack.pop();
                                    if (stack.length === 0) {
                                        // 栈为空，表示找到了一对匹配的括号
                                        lastContent = text.substring(openIndex + 1, i);
                                    }
                                }
                            }
                        }
                        return lastContent;
                    }




                    if (timePlace) {
                        let weekAndDay = parseTimePlace(timePlace);
                        if (weekAndDay) {
                            courses.push({ cleanedCourseName, campus, teacher, category, weekAndDay });
                        } else {
                            console.warn(`无法解析时间地点信息: ${timePlace}`);
                        }
                    } else {
                        console.warn("未找到上课时间地点信息");
                    }
                }
            }
        });

        if (courses.length === 0) {
            alert("未找到课程信息！");
            return;
        }

        // 生成ICS文件内容
        let icsContent = createICS(courses, startDate);
        let blob = new Blob([icsContent], { type: 'text/calendar' });
        let link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = '课程表.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

function parseTimePlace(timePlace) {
    // 以 <br> 标签分隔时间地点信息
    let timePlaceParts = timePlace.split(/<br\s*\/?>/i).map(part => part.trim()).filter(part => part.length > 0);

    // 存储解析结果
    let results = [];

    // 正则表达式用于解析周次、星期几、节次和地点
    const regex = /(\d+(?:-\d+)?(?:双周)?(?:,\d+(?:-\d+)?(?:双周)?)*)周\s*星期([一二三四五六日])(?:\[(\d+-\d+|\d+)(?:节)?\])?\s*(.*)?/;

    timePlaceParts.forEach(part => {
        let match = part.match(regex);

        if (match) {
            // 解析周次
            let weeks = match[1].split(',').flatMap(range => {
                let isEvenWeek = range.includes('双周');
                let cleanRange = range.replace('双周', ''); // 去掉 "双周" 字符串

                let [start, end] = cleanRange.split('-').map(Number);
                if (end) {
                    // 如果是双周，则只取双数周
                    return isEvenWeek
                        ? Array.from({ length: Math.floor((end - start) / 2) + 1 }, (_, i) => start + i * 2)
                        : Array.from({ length: end - start + 1 }, (_, i) => start + i);
                } else {
                    return [start];
                }
            });

            // 解析星期几
            let day = match[2];

            // 解析节次范围
            let timeRange = match[3] ? match[3].split('-').map(Number) : null;

            // 解析地点
            let place = match[4] ? match[4].trim() : '';

            // 如果节次为空且地点包含节次信息
            if (!timeRange && place.includes('节')) {
                let timePlaceMatch = place.match(/(\d+-\d+|\d+)(?:节)?\s*(.*)?/);
                if (timePlaceMatch) {
                    timeRange = timePlaceMatch[1].split('-').map(Number);
                    place = timePlaceMatch[2] ? timePlaceMatch[2].trim() : '';
                }
            }

            // 如果timeRange为空，默认值为 [1, 2]
            if (!timeRange) {
                timeRange = [1, 2];
            }

            // 确保起始节次和结束节次合理
            let startClass = timeRange[0];
            let endClass = timeRange[1] || startClass;

            // 将解析的周次、节次、地点添加到结果数组中
            weeks.forEach(week => {
                results.push({
                    week: week,
                    day: day,
                    startClass: startClass,
                    endClass: endClass,
                    place: place
                });
            });
        } else {
            console.error("无法解析时间地点信息:", part);
        }
    });

    return results.length > 0 ? results : null;
}













    function createICS(courses, startDate) {
        let icsLines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//XDU_JW//NONSGML v2.0//zh-CN'
        ];

        courses.forEach(course => {
            course.weekAndDay.forEach(weekAndDay => {
                let courseStart = calculateDate(startDate, weekAndDay.week, weekAndDay.day, weekAndDay.startClass);
                let courseEnd = calculateEndTime(courseStart, weekAndDay.startClass, weekAndDay.endClass);

                icsLines.push(
                    'BEGIN:VEVENT',
                    'SUMMARY:' +weekAndDay.place+ ' '+course.cleanedCourseName,
                    'DTSTART:' + formatDateTime(courseStart),
                    'DTEND:' + formatDateTime(courseEnd),
                    'LOCATION:' + weekAndDay.place,
                    'DESCRIPTION:教师:' + course.teacher + ', 类别:' + course.category,
                    'END:VEVENT'
                );
            });
        });

        icsLines.push('END:VCALENDAR');
        return icsLines.join('\r\n');
    }

    function calculateDate(startDate, week, day, startClass) {
        let dayMap = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '日': 7 };
        let date = new Date(startDate);
        date.setDate(date.getDate() + (week - 1) * 7 + (dayMap[day] - 1));

        let startTime;
        switch (startClass) {
            case 1: startTime = new Date(date.setHours(8, 30, 0, 0)); break;
            case 2: startTime = new Date(date.setHours(9, 20, 0, 0)); break;
            case 3: startTime = new Date(date.setHours(10, 25, 0, 0)); break;
            case 4: startTime = new Date(date.setHours(11, 15, 0, 0)); break;
            case 5: startTime = new Date(date.setHours(14, 0, 0, 0)); break;
            case 6: startTime = new Date(date.setHours(14, 50, 0, 0)); break;
            case 7: startTime = new Date(date.setHours(15, 55, 0, 0)); break;
            case 8: startTime = new Date(date.setHours(16, 45, 0, 0)); break;
            case 9: startTime = new Date(date.setHours(19, 0, 0, 0)); break;
            case 10: startTime = new Date(date.setHours(19, 50, 0, 0)); break;
            case 11: startTime = new Date(date.setHours(20, 40, 0, 0)); break;
            default: startTime = new Date(date.setHours(0, 0, 0, 0)); break;
        }
        return startTime;
    }

    function calculateEndTime(startTime, startClass, endClass) {
        const classStartTimes = {
            1: [8, 30],
            2: [9, 20],
            3: [10, 25],
            4: [11, 15],
            5: [14, 0],
            6: [14, 50],
            7: [15, 55],
            8: [16, 45],
            9: [19, 0],
            10: [19, 50],
            11: [20, 40]
        };

        let endTime = new Date(startTime);
        endTime.setHours(classStartTimes[endClass][0], classStartTimes[endClass][1], 0, 0);
        endTime.setMinutes(endTime.getMinutes() + 45); // 每节课 45 分钟
        return endTime;
    }

    function formatDateTime(date) {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    }
})();
