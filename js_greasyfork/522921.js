// ==UserScript==
// @name         H3C剩余工时计算
// @namespace    H3C剩余工时计算
// @version      2025-01-02
// @description  收集H3C内部考勤日历页面的打卡数据并计算剩余工时
// @author       H3Cer
// @match        https://eip.h3c.com/myCenter/kaoqin
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522921/H3C%E5%89%A9%E4%BD%99%E5%B7%A5%E6%97%B6%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/522921/H3C%E5%89%A9%E4%BD%99%E5%B7%A5%E6%97%B6%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==
// 说明：
// 1、 使用前请将上下班时间、午休时间、是否是弹性工作制等等内容修改为自己的班次内容（下方两行/****/中间的内容）
// 2、 为了适应2025年开始实施的新考勤制度，特意将非工作日的打卡也统计在内（但是当天有加班记录的不统计）
// 3、 工作日只统计早晚剩余工时（工作日包括正常工作日和调休后上班的周末），非工作日全天统计（但是不包括午休时间）
// 4、 脚本考虑到的各种异常情况可能不太全面，如果发生统计错误或者无法统计的情况，请谅解（尤其是存在考勤异常时，暂时忘了考勤异常时是如何显示的了）

(function() {
    'use strict';
    let isInsertDiv = false;
    // 累计总分钟数
    let totalMinutesWorkOvertime = 0;

    // 辅助函数：将时间字符串转换为分钟数
    const timeToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return isNaN(hours) || isNaN(minutes) ? 0 : hours * 60 + minutes; // 防止出现 NaN
    };

    /************************************************************************************************/
    const delayInterval = 5000; // 延时运行时间，打开考勤日历页面后延时一段时间再进行统计（毫秒），避免页面加载未完成导致显示块插入位置不正确
    const scanInterval = 1000; // 扫描更新间隔，开始统计之后，以此时间为间隔，持续进行扫描、统计（毫秒）
    const morningLimit = timeToMinutes('09:30'); //上班时间（有弹性工作制的，此处请填写弹性上班时间）
    const eveningLimit = timeToMinutes('18:00'); //下班时间
    const flexibleTime = 60; //弹性工作制时间（分钟），非弹性工作制的写0
    const siestaLimit1 = timeToMinutes('12:00'); //午休开始时间
    const siestaLimit2 = timeToMinutes('13:30'); //午休结束时间
    /************************************************************************************************/

    // 在页面顶部创建一个显示总分钟数和总小时数的 div// 在页面顶部插入显示总分钟数和总小时数的 div，插入在 .ant-fullcalendar-fullscreen 上方
    const createDisplayElement = () => {
        // 查找 .ant-fullcalendar-fullscreen 元素
        const fullscreenElement = document.querySelector('.ant-fullcalendar-fullscreen');

        // 如果找到了该元素，则创建并插入新的显示 div
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

            // 初始化文字为 "剩余工时： "
            displayDiv.textContent = "剩余工时： ";

            // 将新元素插入到 .ant-fullcalendar-fullscreen 上方
            fullscreenElement.parentNode.insertBefore(displayDiv, fullscreenElement);
        }
    };

    // 更新显示的总分钟数和总小时数
    const updateDisplay = (totalMinutesWorkOvertime, totalHours) => {
        const displayDiv = document.getElementById('total-time-display');
        console.log(`displayDiv: ${displayDiv}`);
        if (displayDiv) {
            displayDiv.textContent = `剩余工时： ${totalHours} 小时（ ${totalMinutesWorkOvertime} 分钟 ）`;
        } else {
            console.log("无法找到指定displayDiv");
        }
    };

    const scanElements = () => {
        try {
            console.clear(); // 清空控制台

            totalMinutesWorkOvertime = 0;

            // 查找 .ant-calendar-picker 元素（用于获取当前月份，排除非本月的日期）
            const element1 = document.querySelector('.ant-calendar-picker');
            if (element1) {
                const textContent = element1.textContent.trim();
                // console.log('找到的文字内容:', textContent);

                // 查找所有 .ant-fullcalendar-cell 元素（此元素就是每一天的信息）
                const elements2 = document.querySelectorAll('.ant-fullcalendar-cell');
                console.log(`共找到 ${elements2.length} 个元素：`);
                elements2.forEach((element2, index) => {
                    if (element2.title.includes(textContent)) {

                        let currentDate = 0;

                        // 查找 element2 内部的 class="ant-fullcalendar-value" 元素（确定当天是哪一天(1~31的天数序号)）
                        const currentDateElements = element2.querySelector('.ant-fullcalendar-value');
                        if (currentDateElements) {
                            const tmpDate = currentDateElements.textContent.trim()
                            if (!isNaN(currentDate)) {
                                currentDate = tmpDate;
                            }
                        }


                        // 检查 element2 的子元素是否包含 "加班"
                        const childElements = element2.querySelectorAll('*');
                        const containsOvertime = Array.from(childElements).some(child =>
                            child.textContent.trim().includes('加班')
                        );

                        if (containsOvertime) {
                            console.log(`本月 ${currentDate} 日内容包含 "加班"，不统计`);
                            return; // 跳过当前元素的处理
                        }

                        // 查找 element2 内部的 class="absolute" 的子元素（打卡时间，格式是：上班打开时间(时：分) - 下班打卡时间(时：分)）
                        const absoluteElement = element2.querySelector('.absolute');
                        if (absoluteElement) {
                            const timeRange = absoluteElement.textContent.trim();

                            // 如果 .absolute 元素为空，则跳过
                            if (!timeRange) {
                                //console.log(`本月 ${currentDate} 日内容为空，不统计`);
                                return;
                            }

                            //console.log(`第 ${index + 1} 个元素中的 .absolute 值: ${timeRange}`);

                            let minutesWorkOvertimeBefore = 0;
                            let minutesWorkOvertimeAfter = 0;

                            // 检查是否是节假日
                            const isHoliday = element2.querySelector('.ant-fullcalendar-holiday');
                            // const isHoliday = false //debug使用
                            if (isHoliday) {
                                //如果是节假日，则全天统计,并且不考虑弹性工作制(但是要减去午休时间)；

                                const [startTimeTmp, endTimeTmp] = timeRange.split(' - ').map(timeToMinutes);
                                const startTime = isNaN(startTimeTmp) ? siestaLimit1 : startTimeTmp; // 防止出现 NaN
                                const endTime = isNaN(endTimeTmp) ? siestaLimit2 : endTimeTmp; // 防止出现 NaN

                                if (siestaLimit1 > endTime) { // 如果整个工作时间段都在上午
                                    // 计算上午的剩余工时
                                    minutesWorkOvertimeBefore = endTime - startTime;

                                    // 计算下午的剩余工时
                                    minutesWorkOvertimeAfter = 0;
                                } else if (startTime > siestaLimit2) { // 如果整个工作时间段都在下午
                                    // 计算上午的剩余工时
                                    minutesWorkOvertimeBefore = 0;

                                    // 计算下午的剩余工时
                                    minutesWorkOvertimeAfter = endTime - startTime;
                                } else {
                                    // 计算上午的剩余工时
                                    minutesWorkOvertimeBefore = Math.max(0, siestaLimit1 - startTime);

                                    // 计算下午的剩余工时
                                    minutesWorkOvertimeAfter = Math.max(0, endTime - siestaLimit2);
                                }
                            } else {
                                const [startTimeTmp, endTimeTmp] = timeRange.split(' - ').map(timeToMinutes);
                                const startTime = isNaN(startTimeTmp) ? morningLimit : startTimeTmp; // 防止出现 NaN
                                const endTime = isNaN(endTimeTmp) ? eveningLimit : endTimeTmp; // 防止出现 NaN

                                // 计算上午的剩余工时
                                minutesWorkOvertimeBefore = Math.max(0, morningLimit - startTime) - flexibleTime;

                                // 计算下午的剩余工时
                                minutesWorkOvertimeAfter = Math.max(0, endTime - eveningLimit);

                            }

                            //console.log(`本月 ${currentDate} 日早于 09:30 的分钟数: ${minutesWorkOvertimeBefore}`);
                            //console.log(`本月 ${currentDate} 日晚于 18:00 的分钟数: ${minutesWorkOvertimeAfter}`);
                            const minutesCurrentDate = minutesWorkOvertimeBefore + minutesWorkOvertimeAfter;
                            console.log(`本月 ${currentDate} 日剩余工时: ${minutesCurrentDate}`);

                            // 求和
                            totalMinutesWorkOvertime += minutesWorkOvertimeBefore;
                            totalMinutesWorkOvertime += minutesWorkOvertimeAfter;
                        }
                    }
                });

                // 输出累计结果
                console.log(`总分钟数: ${totalMinutesWorkOvertime}`);

                // 计算小时数
                const totalHours = ((totalMinutesWorkOvertime) / 60).toFixed(2);
                console.log(`总小时数: ${totalHours}`);

                // 确认显示元素是否已经增加
                console.log(`isInsertDiv: ${isInsertDiv}`);
                if (!isInsertDiv) {
                    // 初始化创建显示元素
                    createDisplayElement();
                    isInsertDiv = true;
                }

                // 更新显示的总分钟数和总小时数
                updateDisplay(totalMinutesWorkOvertime, totalHours);

            } else {
                // console.log('未找到 .ant-calendar-picker 元素');
            }
        } catch (error) {
            // 什么都不做，直接忽略异常
        }
    };

    //延时运行
    setTimeout(() => {
        scanElements(); //最开始运行一次
        setInterval(scanElements, scanInterval); // 设置定时器，循环运行
    }, delayInterval);

})();
