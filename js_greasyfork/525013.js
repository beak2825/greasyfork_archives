// ==UserScript==
// @name         Remaining_Work_Hours_For_AIO
// @namespace    http://nicebro.fun/
// @version      V1.2
// @description  Remaining_Work_Hours_for_AIO
// @author       flower
// @match        https://eip.h3c.com/myCenter/kaoqin
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525013/Remaining_Work_Hours_For_AIO.user.js
// @updateURL https://update.greasyfork.org/scripts/525013/Remaining_Work_Hours_For_AIO.meta.js
// ==/UserScript==


//20250208 V1.2版本
//休息日判断：增强了元素存在性的检查，防止对空元素调用 .textContent 导致错误。
//负工时计算逻辑调整。
//扫描间隔调整：将扫描间隔增加到 5000ms，以减少对性能的影响。
//全局变量调整，部分return逻辑跳空调整。

//20250127 V1.1版本
//更新说明：
//对请假时长小于8小时场景，进行更新。

//20250126 V1.0版本
//计算逻辑：查看.absolute中的打卡时间，计算当日工作时间，减去午休时间12:00-1:00，及当日正常8小时工作时间，计算当日剩余工时
//当有外出公干逻辑时，取.ant-fullcalendar-content中的外出公干时间，与当日出勤时间合计后，减去午休及当日8小时工时，计算剩余工时
//考虑请假情况，请假情况不做处理，直接计算为0剩余工时。
//忽略上、下班未打卡提示
//考虑外出公干中0:00-0:00情况，直接计算为0剩余工时。

(function() {
    'use strict';
    let isInsertDiv = false;
    let totalMinutesWorkOvertime = 0;

    const timeToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return isNaN(hours) || isNaN(minutes) ? 0 : hours * 60 + minutes;
    };

    const delayInterval = 5000;
    const scanInterval = 5000; // 增加扫描间隔，减少对性能的影响
    const standardWorkMinutes = 8 * 60; // 标准工作时间为8小时，单位为分钟
    const siestaMinutes = timeToMinutes('13:00') - timeToMinutes('12:00'); // 午休时间，单位为分钟

    const createDisplayElement = () => {
        const fullscreenElement = document.querySelector('.ant-fullcalendar-fullscreen');
        if (fullscreenElement) {
            const displayDiv = document.createElement('div');
            displayDiv.id = 'total-time-display';
            displayDiv.style.backgroundColor = '#f0f0f0';
            displayDiv.style.padding = '16px';
            displayDiv.style.textAlign = 'left';
            displayDiv.style.zIndex = '1000';
            displayDiv.style.fontSize = '16px';
            displayDiv.style.fontWeight = 'bold';
            displayDiv.style.color = '#333';
            displayDiv.textContent = "剩余工时： ";
            fullscreenElement.parentNode.insertBefore(displayDiv, fullscreenElement);
        }
    };

    const updateDisplay = (totalMinutesWorkOvertime, totalHours) => {
        const displayDiv = document.getElementById('total-time-display');
        if (displayDiv) {
           displayDiv.textContent = `剩余工时： ${totalHours} 小时（ ${totalMinutesWorkOvertime} 分钟 ）`;
        } else {
            console.log("无法找到指定displayDiv");
        }
    };

    const scanElements = () => {
        try {
            console.clear();
            totalMinutesWorkOvertime = 0;

            const element1 = document.querySelector('.ant-calendar-picker');
            if (element1) {
                const textContent = element1.textContent.trim();
                const elements2 = document.querySelectorAll('.ant-fullcalendar-cell');
                elements2.forEach((element2) => {
                    if (element2.title.includes(textContent)) {
                        let currentDate = 0;
                        const currentDateElements = element2.querySelector('.ant-fullcalendar-value');
                        if (currentDateElements) {
                            const tmpDate = currentDateElements.textContent.trim();
                            if (!isNaN(tmpDate)) {
                                currentDate = tmpDate;
                            }
                        }

                        console.log(`正在处理本月 ${currentDate} 日的数据...`);
                        let totalDailyMinutes = 0;
                        let hasLeave = false; // 用于判断是否有全日假期

                        // 检查是否为休息日
                        const absoluteElement = element2.querySelector('.absolute');
                        const statusTextElement = element2.querySelector('.ant-fullcalendar-content');
                        const hasTimePattern = /\d{1,2}:\d{2}/; // 时间格式匹配

                        // 如果没有时间信息，视为休息日
                        if ((!absoluteElement || !absoluteElement.textContent.trim()) &&
                            (!statusTextElement || !statusTextElement.textContent.trim() || !hasTimePattern.test(statusTextElement.textContent))) {
                            console.log(`本月 ${currentDate} 日没有任何出勤记录，不计算剩余工时`);
                            return; // 当前日期为休息日，跳过计算
                        }

                        // 处理外出公干和假期时间段
                        if (statusTextElement) {
                            const statusText = statusTextElement.textContent.trim();
                            const publicBusinessPattern = /外出公干（(\d{1,2}:\d{2})-(\d{1,2}:\d{2})）/g;
                            const leavePattern = /[\u4e00-\u9fa5]*假（(\d{1,2}:\d{2})-(\d{1,2}:\d{2})）/g;
                            let match;

                            // 处理外出公干
                            while ((match = publicBusinessPattern.exec(statusText)) !== null) {
                                const startTime = timeToMinutes(match[1]);
                                const endTime = timeToMinutes(match[2]);
                                if (startTime && endTime && endTime > startTime) {
                                    const duration = endTime - startTime;
                                    totalDailyMinutes += duration;
                                    console.log(`外出公干时间段：${match[1]} - ${match[2]}，时长：${duration} 分钟`);
                                }
                            }

                            // 处理假期
                            while ((match = leavePattern.exec(statusText)) !== null) {
                                const startTime = timeToMinutes(match[1]);
                                const endTime = timeToMinutes(match[2]);
                                if (startTime === 0 && endTime === 0) {
                                    console.log(`全日假期：${match[1]} - ${match[2]}`);
                                    hasLeave = true;
                                } else if (startTime && endTime && endTime > startTime) {
                                    const duration = endTime - startTime;
                                    totalDailyMinutes += duration;
                                    console.log(`假期时间段：${match[1]} - ${match[2]}，时长：${duration} 分钟`);
                                }
                            }
                        }

                        // 处理打卡时间段
                        if (absoluteElement) {
                            const timeRange = absoluteElement.textContent.trim();
                            const timePattern = /(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/g;
                            let match;
                            while ((match = timePattern.exec(timeRange)) !== null) {
                                const startTime = timeToMinutes(match[1]);
                                const endTime = timeToMinutes(match[2]);
                                if (startTime && endTime && endTime > startTime) {
                                    const duration = endTime - startTime;
                                    totalDailyMinutes += duration;
                                    console.log(`打卡时间段：${match[1]} - ${match[2]}，时长：${duration} 分钟`);
                                }
                            }
                        }

                        console.log(`本月 ${currentDate} 日总工作时间（含午休）：${totalDailyMinutes} 分钟`);

                        // 计算当天剩余工时
                        if (totalDailyMinutes > 0) {
                            let dailyOvertimeMinutes = totalDailyMinutes - siestaMinutes - standardWorkMinutes;
                            console.log(`扣除标准工时和午休后，本月 ${currentDate} 日剩余工时：${dailyOvertimeMinutes} 分钟`);
                            totalMinutesWorkOvertime += dailyOvertimeMinutes;
                        } else if (hasLeave) {
                            console.log(`本月 ${currentDate} 日为全日假期，不计算剩余工时。`);
                        }

                        console.log(`本月 ${currentDate} 日处理完成。`);
                    }
                });

                // 输出累计结果
                console.log(`总剩余分钟数: ${totalMinutesWorkOvertime}`);
                const totalHours = (totalMinutesWorkOvertime / 60).toFixed(2);
                console.log(`总剩余小时数: ${totalHours}`);

                if (!isInsertDiv) {
                    createDisplayElement();
                    isInsertDiv = true;
                }

                updateDisplay(totalMinutesWorkOvertime, totalHours);
            }
        } catch (error) {
            console.error("An error occurred during the scan:", error);
        }
    };

    setTimeout(() => {
        scanElements();
        setInterval(scanElements, scanInterval);
    }, delayInterval);
})();