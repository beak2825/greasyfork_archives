// ==UserScript==
// @name         USTC Courses to ICS
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Convert schedule to ICS file
// @match        https://jw.ustc.edu.cn/for-std/course-select/*/select
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511981/USTC%20Courses%20to%20ICS.user.js
// @updateURL https://update.greasyfork.org/scripts/511981/USTC%20Courses%20to%20ICS.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 提取页面信息的函数
    function extractPageInfo() {
        const pageHTML = document.body.innerHTML;
        const extractValue = (regex) => {
            const match = pageHTML.match(regex);
            return match && match[1];
        };

        return {
            studentId: extractValue(/studentId:\s*(\d+)/),
            turnId: extractValue(/turnId:\s*(\d+)/),
            fetchSelectedCoursesUrl: extractValue(/fetchSelectedCourses:\s*"([^"]*)"/)
        };
    }

    // 获取选项的函数
    async function getOptions() {
        const pageInfo = extractPageInfo();
        return {
            studentId: pageInfo.studentId,
            turnId: pageInfo.turnId,
            url: {
                fetchSelectedCourses: pageInfo.fetchSelectedCoursesUrl
            }
        };
    }

    // 获取已选课程的函数
    async function fetchSelectedLessons(options) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: options.url.fetchSelectedCourses,
                type: 'post',
                data: {
                    studentId: options.studentId,
                    turnId: options.turnId
                },
                success: resolve,
                error: reject
            });
        });
    }

    // 获取课程表的函数
    async function getSchedule() {
        try {
            const options = await getOptions();
            const selectedLessons = await fetchSelectedLessons(options);

            const data = {
                lessonIds: selectedLessons.map(lesson => lesson.id),
                studentId: options.studentId
            };

            return new Promise((resolve, reject) => {
                $.ajax({
                    url: `${window.CONTEXT_PATH}/ws/schedule-table/datum`,
                    type: 'post',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: (res) => resolve(res),
                    error: reject
                });
            });
        } catch (error) {
            console.error("Error fetching schedule:", error);
            throw error;
        }
    }

    function createICS(data) {
        let icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//zhou.xin@mail.ustc.edu.cn//Schedule to ICS Converter//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'X-WR-TIMEZONE:Asia/Shanghai'
        ];

        for (const schedule of data.result.scheduleList) {
            const event = ['BEGIN:VEVENT'];

            // Set event summary
            const lesson = data.result.lessonList.find(l => l.id === schedule.lessonId);
            if (lesson) {
                event.push(`SUMMARY:${lesson.courseName} - ${schedule.personName}`);
            } else {
                event.push(`SUMMARY:课程 - ${schedule.personName}`);
            }

            // Set event location
            if (schedule.room) { // Not online teaching
                const location = schedule.room.nameZh;
                const building = schedule.room.building.nameZh;
                const campus = schedule.room.building.campus.nameZh;
                event.push(`LOCATION:${campus} ${building} ${location}`);
            } else { // Online teaching
                event.push(`LOCATION:${schedule.customPlace}`);
            }

            // Set event start and end time
            const date = new Date(schedule.date);
            const startHour = Math.floor(parseInt(schedule.startTime) / 100);
            const startMinute = parseInt(schedule.startTime) % 100;
            const endHour = Math.floor(parseInt(schedule.endTime) / 100);
            const endMinute = parseInt(schedule.endTime) % 100;

            const startTime = new Date(date.setHours(startHour, startMinute));
            const endTime = new Date(date.setHours(endHour, endMinute));

            event.push(`DTSTART:${formatDate(startTime)}`);
            event.push(`DTEND:${formatDate(endTime)}`);

            // Add description
            const description = `教师: ${schedule.personName}\\n课程ID: ${schedule.lessonId}`;
            event.push(`DESCRIPTION:${description}`);

            event.push('END:VEVENT');
            icsContent = icsContent.concat(event);
        }

        icsContent.push('END:VCALENDAR');
        return icsContent.join('\r\n');
    }

    function formatDate(date) {
        const pad = (n) => n.toString().padStart(2, '0');
        return [
            date.getFullYear(),
            pad(date.getMonth() + 1),
            pad(date.getDate()),
            'T',
            pad(date.getHours()),
            pad(date.getMinutes()),
            pad(date.getSeconds()),
        ].join('');
    }

    async function generateICS() {
        try {
            const schedule = await getSchedule();
            const icsData = createICS(schedule);

            if (!icsData) {
                throw new Error("Failed to create ICS data");
            }

            const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'schedule.ics';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error generating ICS file:", error);
        }
    }

    // 创建一个按钮来触发 ICS 生成
    function createButton() {
        const button = document.createElement('button');
        button.textContent = '导出ICS';
        button.className = 'btn btn-primary'
        button.addEventListener('click', generateICS);

        // 创建一个观察器实例
        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    const container = document.querySelector('.col.col-sm-3.text-right');
                    if (container) {
                        container.appendChild(button);
                        observer.disconnect(); // 停止观察
                        return;
                    }
                }
            }
        });

        // 配置观察选项
        const config = { childList: true, subtree: true };

        // 开始观察目标节点的变化
        observer.observe(document.body, config);

        // 设置一个超时，以防容器never出现
        setTimeout(() => {
            observer.disconnect();
            if (!button.parentNode) {
                document.body.appendChild(button);
            }
        }, 10000); // 10秒后超时
    }

    window.addEventListener('load', createButton);

})();
