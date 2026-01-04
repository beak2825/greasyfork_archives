// ==UserScript==
// @name         SCAU教务系统——课表导出ICS文件支持
// @namespace    https://scau.yellowblue.top/ICS
// @version      0.2.11(20230818)
// @description  可将教务系统内的个人课表直接导出为ICS文件，方便导入到各种日历软件中。目前已全面兼容RFC 5545(icalendar)协议，适配更多设备。核心库版本V2.1
// @author       YelloooBlue
// @match        *://jwxt.scau.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473342/SCAU%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E2%80%94%E2%80%94%E8%AF%BE%E8%A1%A8%E5%AF%BC%E5%87%BAICS%E6%96%87%E4%BB%B6%E6%94%AF%E6%8C%81.user.js
// @updateURL https://update.greasyfork.org/scripts/473342/SCAU%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E2%80%94%E2%80%94%E8%AF%BE%E8%A1%A8%E5%AF%BC%E5%87%BAICS%E6%96%87%E4%BB%B6%E6%94%AF%E6%8C%81.meta.js
// ==/UserScript==

(function () {
    'use strict';
    class Event {
        constructor() {
            this.title = '';
            this.startTime = '';
            this.endTime = '';
            this.description = '';
            this.location = '';
            this.repeat = false;
            this.repeatRule = '';
            this.uid = '';
        }
        getStr() {
            const kwargs = {
                'SUMMARY': this.title,
                'DTSTART': this.startTime,
                'DTEND': this.endTime,
                'DESCRIPTION': this.description,
                'LOCATION': this.location,
                'UID': this.uid,
                'DTSTAMP': this.startTime,
            };
            if (this.repeat) {
                kwargs.RRULE = this.repeatRule;
            }
            let str = 'BEGIN:VEVENT\r\n';
            for (const [name, key] of Object.entries(kwargs)) {
                if (['DTSTART', 'DTEND', 'DTSTAMP'].includes(name)) {
                    str += `${name};${key}\r\n`;
                } else {
                    str += `${name}:${key}\r\n`;
                }
            }
            str += 'END:VEVENT\r\n';
            return str;
        }
    }
    class Calendar {
        constructor(calendarName) {
            this.textName = calendarName;
            this.eventList = [];
        }
        makeICSText() {
            let ICSText = 'BEGIN:VCALENDAR\r\n';
            ICSText += `PRODID:-//yellowblue.top//SCAUTools//${this.textName}\r\n`;
            ICSText += 'VERSION:2.0\r\n';
            ICSText += 'DESCRIPTION:YeloooBlue Converter [yellowblue.top] v2.1(Lite)\r\n';
            ICSText += `X-WR-CALNAME:${this.textName}\r\n`;
            ICSText += 'BEGIN:VTIMEZONE\r\n';
            ICSText += 'TZID:Asia/Shanghai\r\n';
            ICSText += 'BEGIN:STANDARD\r\n';
            ICSText += 'TZOFFSETFROM:+0800\r\n';
            ICSText += 'TZOFFSETTO:+0800\r\n';
            ICSText += 'END:STANDARD\r\n';
            ICSText += 'END:VTIMEZONE\r\n';
            for (const aEvent of this.eventList) {
                ICSText += aEvent.getStr();
            }
            ICSText += 'END:VCALENDAR';
            return ICSText;
        }
    }
    function classJSON2ICS(classInfo, startTime, calendarName) {
        const aCalendar = new Calendar(calendarName);
        for (const [x, aClass] of Object.entries(classInfo)) {
            let newClassName = aClass.kc_name;
            if (aClass.arrange_num !== 1) {
                newClassName += `(${aClass.xslx_name1})`;
            }
            if (aClass.fzmc_name) {
                newClassName += `[${aClass.fzmc_name}]`;
            }
            const weekRangeList = aClass.pkzc.split(',');
            for (const [n, aRange] of Object.entries(weekRangeList)) {
                const tmp = new Event();
                tmp.title = newClassName;
                tmp.description = `${aClass.teachernames} | ${aClass.ktmc_name}`;
                tmp.location = aClass.js_name;
                tmp.uid = `${aClass.id}-${n}`;
                let weekStartTime = null;
                if (aRange.includes('-')) {
                    tmp.repeat = true;
                    const [startWeek, endWeek] = aRange.split('-').map(Number);
                    let repeatRule = '';
                    if (aClass.sjbzcode == 1) {
                        repeatRule = `FREQ=WEEKLY;COUNT=${endWeek - startWeek + 1};INTERVAL=1`;
                    }
                    else if (aClass.sjbzcode == 2) {
                        const adjustedStartWeek = startWeek % 2 !== 1 ? startWeek + 1 : startWeek;
                        const adjustedEndWeek = endWeek % 2 !== 1 ? endWeek - 1 : endWeek;
                        repeatRule = `FREQ=WEEKLY;COUNT=${((adjustedEndWeek - adjustedStartWeek) / 2) + 1};INTERVAL=2`;
                    }
                    else if (aClass.sjbzcode == 3) {
                        const adjustedStartWeek = startWeek % 2 !== 0 ? startWeek + 1 : startWeek;
                        const adjustedEndWeek = endWeek % 2 !== 0 ? endWeek - 1 : endWeek;
                        repeatRule = `FREQ=WEEKLY;COUNT=${((adjustedEndWeek - adjustedStartWeek) / 2) + 1};INTERVAL=2`;
                    }
                    tmp.repeatRule = repeatRule;
                    weekStartTime = startTime + (startWeek - 1) * 7 * 24 * 3600;
                } else {
                    weekStartTime = startTime + (aRange - 1) * 7 * 24 * 3600;
                }
                const weekDay = aClass.pksj.charAt(0);
                const firstClass = weekStartTime + (weekDay - 1) * 24 * 3600;
                const startTime4Num = aClass.djkssj ? aClass.djkssj.replace(":", "") : aClass.idjkssj.toString().padStart(4, '0');
                const endTime4Num = aClass.djjssj ? aClass.djjssj.replace(":", "") : aClass.idjjssj.toString().padStart(4, '0');
                tmp.startTime = `TZID=Asia/Shanghai:${formatDate(new Date(firstClass * 1000))}T${startTime4Num}00`;
                tmp.endTime = `TZID=Asia/Shanghai:${formatDate(new Date(firstClass * 1000))}T${endTime4Num}00`;
                aCalendar.eventList.push(tmp);
            }
        }
        return aCalendar.makeICSText();
    }
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }
    let studentName = null;
    let startTime = null;
    let xnxq = null;
    let classInfo = null;
    let addButtonInterval;
    const targetKeywords = ['findWeekCalendarList', 'searchOneXskbList'];
    const originalSend = window.XMLHttpRequest.prototype.send;
    window.XMLHttpRequest.prototype.send = function (data) {
        const xhr = this;
        const originalOnReadyStateChange = xhr.onreadystatechange;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                for (const keyword of targetKeywords) {
                    if (xhr.responseURL.includes(keyword)) {
                        try {
                            const jsonResponse = JSON.parse(xhr.responseText);
                            if (keyword === 'findWeekCalendarList' && jsonResponse.data && jsonResponse.data.jxzllist && jsonResponse.data.jxzllist[0]) {
                                startTime = jsonResponse.data.jxzllist[0].rq;
                                xnxq = jsonResponse.data.jxzllist[0].xnxq;
                                console.log('【日历工具】拦截到请求 "findWeekCalendarList"，学期开始时间已储存');
                                console.log(xnxq, '学期开始时间：', startTime);
                            }
                            else if (keyword === 'searchOneXskbList' && startTime !== null) {
                                classInfo = jsonResponse;
                                console.log('【日历工具】拦截到请求 "searchOneXskbList"，课程JSON已储存');
                                console.log('JSON 数据：', classInfo);
                            }
                        } catch (error) {
                            console.error('【日历工具】JSON 解析错误:', error);
                        }
                    }
                }
            }
            if (originalOnReadyStateChange) {
                originalOnReadyStateChange.apply(xhr, arguments);
            }
        };
        originalSend.apply(xhr, arguments);
    };
    function checkMenu() {
        const activeTab = document.querySelector("#app > div.frame-container > div.content-tabs > div.menu-tabs > div.tabs-cnt > div > div.el-tabs__header > div > div.el-tabs__nav-scroll > div > div.el-tabs__item.is-active.is-closable");
        if (activeTab && activeTab.textContent.includes("个人课表")) {
            studentName = document.querySelector("#app > div.frame-header.el-row > div.el-col.el-col-14 > ul > li:nth-child(6)").textContent
            console.log("【日历工具】检测到 个人课表 页面");
            addButton();
        }
    }
    function downloadICSFile(icsContent, filename) {
        const blob = new Blob([icsContent], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.endsWith('.ics') ? filename : filename + '.ics';
        a.click();
        window.URL.revokeObjectURL(url);
    }
    function showAppreciationModal() {
        // Create an overlay element
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(255, 255, 255, 0.8)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';

        // Create an image element for the QR code
        const qrCodeImage = document.createElement('img');
        qrCodeImage.src = 'https://scau.yellowblue.top/good.png';
        qrCodeImage.alt = 'Appreciation QR Code';
        qrCodeImage.style.maxWidth = '60%';
        overlay.appendChild(qrCodeImage);

        // Create an image element for the QR code
        const qrCodeImage1 = document.createElement('img');
        qrCodeImage1.src = 'https://scau.yellowblue.top/mp.jpg';
        qrCodeImage1.alt = 'Appreciation QR Code';
        qrCodeImage1.style.maxWidth = '90%';
        overlay.appendChild(qrCodeImage1);

        // Create a text element
        const textElement = document.createElement('h3');
        textElement.textContent = '扫码可支持作者！留意版本更新！\nYelloooBlue@qq.com';
        textElement.style.color = '#000';
        textElement.style.textAlign = 'center';
        overlay.appendChild(textElement);

        // Append the overlay to the document
        document.body.appendChild(overlay);

        // Add a click event listener to the overlay to close it
        overlay.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
    }
    function addButton() {
        const targetButton = document.querySelector("#app > div.frame-container > div.content-tabs > div.el-scrollbar > div.el-scrollbar__wrap > div > div.view-content > form > div > div.el-col.el-col-6 > div > div > button.el-button.el-button--default");
        if (targetButton) {
            const newButton = document.createElement('button');
            newButton.className = 'el-button el-button--primary';
            newButton.innerHTML = '<i class="fa-calendar"/> 导出日历文件(Beta)';
            targetButton.parentNode.insertBefore(newButton, targetButton.nextSibling);
            newButton.addEventListener('click', function () {
                if (startTime !== null && xnxq !== null && classInfo != null) {
                    showAppreciationModal()
                    let docName=`${studentName}_${xnxq}课表`
                    downloadICSFile(classJSON2ICS(classInfo.data, startTime/1000, docName), docName)
                } else {
                    alert("插件未获取到完整课程信息，请尝试刷新页面。反馈邮箱YelloooBlue@qq.com")
                }
            });
            const targetElement = targetButton.closest('.el-col-6');
            if (targetElement) {
                targetElement.className = 'el-col-10';
            }
        }
        clearInterval(addButtonInterval);
    }
    window.addEventListener('load', function () {
        addButtonInterval = setInterval(checkMenu, 1000);
    });
})();