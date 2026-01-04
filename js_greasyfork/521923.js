// ==UserScript==
// @name         亚马逊ABA数据自动下载
// @namespace    http://tampermonkey.net/
// @version      1.4.0
// @description  通过JS脚本 实现亚马逊ABA数据 在季度、月、周的自动下载   此版本只包括了2024-12-23时期的年、季度、月、周数据 不排除在未来某些数据亚马逊不提供
// @author       You
// @match        https://sellercentral.amazon.co.uk/*
// @match        https://sellercentral.amazon.com/*
// @match        https://sellercentral.amazon.ca/*
// @require      https://scriptcat.org/lib/513/2.0.1/ElementGetter.js#sha256=V0EUYIfbOrr63nT8+W7BP1xEmWcumTLWu2PXFJHh5dg=
// @icon         data:image/gifbase64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521923/%E4%BA%9A%E9%A9%AC%E9%80%8AABA%E6%95%B0%E6%8D%AE%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/521923/%E4%BA%9A%E9%A9%AC%E9%80%8AABA%E6%95%B0%E6%8D%AE%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
// 季度 > 月
(function () {
    'use strict';
    const timeRangeWeekStart = "2023-10-28"
    const config = {
        timeRange: ['quarterly', 'monthly', 'weekly', 'daily'],
        timeRangeYear: ['2024','2023'],
        timeRangeQuarter: ['03-31', '06-30', '09-30', '12-31'],
        timeRangeMonth: ['01-31', '02-28', '02-29', '03-31', '04-30', '05-31', '06-30', '07-31', '08-31', '09-30', '10-31', '11-30', '12-31'],
        timeRangeWeek: getSaturdaysUntilNow(timeRangeWeekStart),
        searchTerm: ['gloves', 'hair dryer']
    };

    // 获取从指定开始日期到当前日期之间的所有周六日期
    function getSaturdaysUntilNow(startDate) {
        const saturdays = [];
        let currentDate = new Date(startDate);
        const now = new Date();

        // 确保开始日期是周六
        while (currentDate.getDay() !== 6) {
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // 遍历从开始日期到当前日期之间的所有周六
        while (currentDate <= now) {
            saturdays.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 7);
        }

        return saturdays;
    }

    // 异步版 checkObj，返回 Promise
    function checkObjAsync(selector, timeInterval) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            // 设置超时时间 5 秒
            const timeout = 5000;
            let t = setInterval(() => {
                const targetElement = document.querySelector(selector);
                if (targetElement) {
                    clearInterval(t);
                    resolve(targetElement);
                } else if (Date.now() - start > timeout) {
                    clearInterval(t);
                    reject(new Error(`Timeout: Element not found for selector "${selector}"`));
                }
            }, timeInterval);
        });
    }

    // 修改属性 & 触发事件
    function setAttrAndDispatchEv(obj, attr, value, eventType = "change") {
        obj.setAttribute(attr, value);
        obj.dispatchEvent(new Event(eventType, { bubbles: true }));
    }

    // 模拟点击事件
    async function clickEvent() {
        try {
            // search await——同步执行
            const obj1 = await checkObjAsync(".css-1oy4rvw", 1000);
            // obj1.setAttribute("label", "点击1-应用");
            setTimeout(() => {
                obj1.dispatchEvent(new Event("click", { bubbles: true, cancelable: false }));
            }, 1000);

            // download-1 & download-2
            const downloadButtons = [
                ".css-1bvc4cc #GenerateDownloadButton",
                ".css-ivrut9 .css-ja60r3 .css-1nln1ln"
            ];
            for (const selector of downloadButtons) {
                const obj = await checkObjAsync(selector, 1000);
                // error
                if (selector === ".css-ivrut9 .css-ja60r3 .css-1nln1ln") {
                    const label = obj.getAttribute("label");
                    if (label === "请重试") {
                        alert("Label is '请重试', waiting for 10 minutes...");
                        await new Promise(resolve => setTimeout(resolve, 10 * 60 * 1000)); // Wait 10 minutes
                    }
                }
                // download click
                setTimeout(() => {
                    obj.dispatchEvent(new Event("click", { bubbles: true, cancelable: false }));
                }, 1000);
            }

            // close dialog
            const closeObj = await checkObjAsync(".css-ivrut9 .css-ja60r3 kat-button", 1000);
            setTimeout(() => {
                closeObj.dispatchEvent(new Event("click", { bubbles: true, cancelable: false }));
            }, 2000);
        } catch (error) {
            console.error("Error in clickEvent:", error.message);
        }
    }

    // 处理年份、月份、每周
    async function processYearsAndTimeRanges(yearsOrWeeks, timeRanges, timeRangeType, yearOrWeekSelector) {
        try {
            const timeRangeObj = await checkObjAsync(".css-cyf03k #reporting-range", 1000);
            // timeRangeType
            setAttrAndDispatchEv(timeRangeObj, 'value', timeRangeType);

            if (timeRanges) {
                for (const year of yearsOrWeeks) {
                    // 这个也需要修改 #quarterly-year
                    const yearObj = await checkObjAsync(yearOrWeekSelector, 1000);

                    setAttrAndDispatchEv(yearObj, 'value', year);

                    for (const timeRange of timeRanges) {
                        const timeRangeValue = `${year}-${timeRange}`;
                        // alert(timeRangeValue);

                        const timeRangeSelector = ".css-owk1mx .css-cyf03k .css-xccmpe";
                        const timeRangeObj = await checkObjAsync(timeRangeSelector, 1000);
                        setAttrAndDispatchEv(timeRangeObj, 'value', timeRangeValue);

                        // 每次循环独立执行 clickEvent
                        await clickEvent();
                    }
                }
            } else {
                // weekly不需要year、quarter、month筛选
                for (const week of yearsOrWeeks) {
                    const weekObj = await checkObjAsync(yearOrWeekSelector, 1000);
                    setAttrAndDispatchEv(weekObj, 'value', week);
                    // 每次循环独立执行 clickEvent
                    await clickEvent();
                }
            }

        } catch (error) {
            console.error("Error in processYearsAndMouths:", error.message);
        }
    }

    // 跳转至下载管理器
    function navigateToDownloadManager() {
        const currentUrl = window.location.href;
        const targetSubstring = "brand-analytics/dashboard/";
        if (currentUrl.includes(targetSubstring)) {
            window.open("/brand-analytics/download-manager", "_blank");
            console.log("已跳转到下载管理器");
        } else {
            console.log("当前页面不包含下载管理器链接，跳过跳转");
        }
    }

    // 下载页面 循环下载
    async function handleDownloadABA() {
        // 获取父元素
        const rowGroup = await checkObjAsync('div[role="rowgroup"]', 1000);

        if (!rowGroup) {
            console.error("未找到 role='rowgroup' 的父元素");
            return;
        }

        // 获取所有子元素 role="row"
        const rows = rowGroup.querySelectorAll('div[role="row"]');
        if (rows.length === 0) {
            console.error("未找到 role='row' 的子元素");
            return;
        }

        // 定义一个异步函数处理单个点击
        const clickRow = async (row) => {
            // 查找 class="css-p1ypz0" 的 div
            const actionDiv = row.querySelector('.css-p1ypz0');
            if (actionDiv) {
                // 查找 <span> 标签
                const downloadSpan = actionDiv.querySelector('span.css-1mwk1ex');
                if (downloadSpan) {
                    // 模拟点击
                    downloadSpan.click();
                    console.log(`已点击下载按钮:`, downloadSpan);
                    // 模拟等待，避免过快操作（根据需要调整时间）
                    await new Promise(resolve => setTimeout(resolve, 500));
                } else {
                    console.warn(`未找到下载按钮 span 标签于:`, row);
                }
            } else {
                console.warn(`未找到 class="css-p1ypz0" 的 div 于:`, row);
            }
        };

        // 按顺序遍历并执行点击操作
        for (const row of rows) {
            await clickRow(row);
        }

        console.log("所有下载按钮已按顺序点击完成");
    }

    // 主执行逻辑
    async function main() {
        // 处理季度
        // await processYearsAndTimeRanges(
        //     config.timeRangeYear,
        //     config.timeRangeQuarter,
        //     config.timeRange[0],
        //     ".css-cyf03k #quarterly-year"
        // );


        // 处理月份
        // await processYearsAndTimeRanges(
        //     config.timeRangeYear,
        //     config.timeRangeMonth,
        //     config.timeRange[1],
        //     ".css-cyf03k #monthly-year"
        // );

        // 处理每周
        await processYearsAndTimeRanges(
            config.timeRangeWeek,
            0,
            config.timeRange[2],
            ".css-cyf03k #weekly-week"
        );
        // 跳转至下载管理器
        // navigateToDownloadManager()
        // await handleDownloadABA()
    }
    main();

})();