// ==UserScript==
// @license MIT
// @name         Schedule to ICS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Convert schedule to ICS
// @author       Nwakey
// @match        https://dutgs.dlut.edu.cn/pyxx/pygl/kbcx_xs.aspx?xh=*
// @match        https://dutgs.dlut.edu.cn/pyxx/default.aspx?u=cas
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527942/Schedule%20to%20ICS.user.js
// @updateURL https://update.greasyfork.org/scripts/527942/Schedule%20to%20ICS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const startDate = new Date('2025-02-24'); // 第一周的开始日期

    const timeMap = {
        '1': { start: '08:00', end: '08:45' },
        '2': { start: '08:50', end: '09:35' },
        '3': { start: '10:05', end: '10:50' },
        '4': { start: '10:55', end: '11:40' },
        '5': { start: '13:30', end: '14:15' },
        '6': { start: '14:20', end: '15:05' },
        '7': { start: '15:35', end: '16:20' },
        '8': { start: '16:25', end: '17:10' },
        '9': { start: '18:00', end: '18:45' },
        '10': { start: '18:55', end: '19:40' },
        '11': { start: '19:50', end: '20:35' },
        '12': { start: '20:45', end: '21:30' }
    };

    function getWeekdayOffset(day) {
        const dayMap = {
            '星期一': 0,
            '星期二': 1,
            '星期三': 2,
            '星期四': 3,
            '星期五': 4,
            '星期六': 5,
            '星期日': 6
        };
        return dayMap[day];
    }

    function getEventDate(week, day) {
        const offset = (week - 1) * 7 + getWeekdayOffset(day);
        const eventDate = new Date(startDate);
        eventDate.setDate(startDate.getDate() + offset);
        return eventDate;
    }

    function formatDate(date, time) {
        return `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}T${time.replace(':', '')}00`;
    }

    function extractSchedule() {
        console.log('Extracting schedule...');
        const schedule = [];
        const courseSet = new Set(); // 用于存储已添加的课程信息
        const rows = document.querySelectorAll('#MainWork_DataGrid1 tr');
        rows.forEach((row, rowIndex) => {
            if (rowIndex === 0) return; // 跳过表头行
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, cellIndex) => {
                if (cellIndex < 2 || !cell.innerHTML.trim()) return; // 跳过非课表单元格
                const courseInfos = cell.innerHTML.split('<br><br>'); // 分割多个课程信息
                courseInfos.forEach(courseInfoStr => {
                    const courseInfo = courseInfoStr.split('<br>');
                    if (courseInfo.length < 5) return; // 确保包含足够的课程信息
                    const weeks = courseInfo[3].match(/(\d+)-(\d+)周/);
                    const dayTimeMatches = courseInfo[3].match(/星期(.) (上|下)(\d+),(\d+)/g);
                    const locationMatch = courseInfo[2].match(/\((.*)\)/);
                    if (!weeks || !dayTimeMatches || !locationMatch) return;
                    const startWeek = parseInt(weeks[1]);
                    const endWeek = parseInt(weeks[2]);
                    dayTimeMatches.forEach(dayTime => {
                        const dayTimeMatch = dayTime.match(/星期(.) (上|下)(\d+),(\d+)/);
                        const day = `星期${dayTimeMatch[1]}`;
                        const times = [dayTimeMatch[3], dayTimeMatch[4]];
                        const course = {
                            name: courseInfo[0].replace('课程:', '').trim(),
                            class: courseInfo[1].replace('班级:', '').trim(),
                            location: locationMatch[1].trim(),
                            teacher: courseInfo[4].replace('主讲教师:', '').trim(),
                            startWeek,
                            endWeek,
                            day,
                            times
                        };
                        const courseKey = `${course.name}-${course.class}-${course.location}-${course.teacher}-${course.startWeek}-${course.endWeek}-${course.day}-${course.times.join(',')}`;
                        if (!courseSet.has(courseKey)) {
                            console.log('Extracted course:', course);
                            schedule.push(course);
                            courseSet.add(courseKey);
                        }
                    });
                });
            });
        });
        console.log('Schedule extraction complete:', schedule);
        return schedule;
    }
    function convertToICS(schedule) {
        console.log('Converting schedule to ICS...');
        let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Nwakey//Schedule to ICS//EN\n';
        schedule.forEach(event => {
            let replacedLocation = event.location.replace(/研教楼/g, '研究生教育大楼');
            for (let week = event.startWeek; week <= event.endWeek; week++) {
                const eventDate = getEventDate(week, event.day);
                const startTime = timeMap[event.times[0]].start;
                const endTime = timeMap[event.times[event.times.length - 1]].end;
                icsContent += 'BEGIN:VEVENT\n';
                icsContent += `SUMMARY:${event.name}\n`;
                icsContent += `LOCATION:大连理工大学\\,${replacedLocation}\n`;
                icsContent += `DESCRIPTION:Class ${event.class} Teacher: ${event.teacher}\n`;
                icsContent += `DTSTART:${formatDate(eventDate, startTime)}\n`;
                icsContent += `DTEND:${formatDate(eventDate, endTime)}\n`;
                icsContent += 'END:VEVENT\n';
                console.log('Added event to ICS:', event);
            }
        });
        icsContent += 'END:VCALENDAR';
        console.log('ICS conversion complete.');
        return icsContent;
    }

    function downloadICS(icsContent) {
        console.log('Downloading ICS file...');
        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'schedule.ics';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        console.log('ICS file downloaded.');
    }

    function addButton() {
        const button = document.createElement('button');
        button.innerText = '下载 ICS 文件';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = 1000;
        button.onclick = () => {
            console.log('Button clicked. Extracting schedule...');
            const schedule = extractSchedule();
            console.log('Converting schedule to ICS...');
            const icsContent = convertToICS(schedule);
            console.log('Downloading ICS file...');
            downloadICS(icsContent);
        };
        document.body.appendChild(button);
        console.log('Button added to the page.');
    }

    addButton();
})();
