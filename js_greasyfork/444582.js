// ==UserScript==
// @name         课表助手 - SDJZU
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键导出课表为ics文件
// @author       Qingao Chai
// @match        */jsxsd/xskb/xskb_list*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.1
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444582/%E8%AF%BE%E8%A1%A8%E5%8A%A9%E6%89%8B%20-%20SDJZU.user.js
// @updateURL https://update.greasyfork.org/scripts/444582/%E8%AF%BE%E8%A1%A8%E5%8A%A9%E6%89%8B%20-%20SDJZU.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 设置上课时间及下课时间
    window.class_start = [[], [7, 50], [8, 40], [9, 40], [10, 30], [11, 20], [13, 40], [14, 30], [15, 30], [16, 20], [18, 40], [19, 30], [20, 20]];
    window.class_time = 45;
    // 窗口加载完成调用函数
    window.onload = function () {
        try {
            // 获取main-->page_iframe-->iframe0
            // 添加按钮"保存ics"
            if(document.getElementById("saveics")!==null) return;
            let search_form = document.getElementById("search-form-content");
            if(search_form===null) return;
            search_form.innerHTML += '&nbsp;&nbsp;<input type="button" value="保存ics" id="saveics" class="button el-button" onclick="window.saveics()">';
            if(typeof window.saveics === "function") return;
            // 添加按钮操作，核心部分
            window.saveics = function () {
                if (navigator.userAgent.indexOf('MISE') > -1 && navigator.userAgent.indexOf('MSIE 10') == -1) {
                    alert('浏览器不支持哦~😆');
                    return;
                }
                let SEPARATOR = (navigator.appVersion.indexOf('Win') !== -1) ? '\r\n' : '\n';
                let calendar_start = [
                    'BEGIN:VCALENDAR',
                    'VERSION:2.0',
                    'PRODID:Curriculum-to-iCalendar'
                ].join(SEPARATOR);
                let calendar_end = SEPARATOR + 'END:VCALENDAR' + SEPARATOR;
                let calendarEvents = [];
                let eventSet = new Set();
                // 获取到课程表
                try {
                    let weekRes = window.prompt("当前是第几周？",1);
                    if(weekRes===null){
                        return;
                    }
                    let currentWeek = parseInt(weekRes);
                    let table = document.getElementById("timetable");
                    let yearTerm = document.querySelector("select#xnxq01id > option[selected]").text;
                    let toString = function (date) {
                        return date.toISOString().split(/-|:|[.]/).slice(0, 4).join("") + "00Z";
                    }
                    // 逐行添加event至cal
                    for (let i = 1; i <=7; i++) {//cols
                        let weekDay = i%7;
                        for (let j=1; j<=5; j++){
                            let courseInfo = table.rows[j].cells[i].children[4].childNodes;
                            let course = {
                                name: "",
                                teacher: "",
                                time: "",
                                address: ""
                            }
                            for (let k=0;k<courseInfo.length;k++) {
                                if(courseInfo[k].nodeType==3) {
                                    course.name += courseInfo[k].textContent;
                                } else {
                                    switch(courseInfo[k].getAttribute('title')) {
                                        case "教师":
                                            course.teacher = courseInfo[k].textContent;
                                            break;
                                        case "周次(节次)":
                                            course.time = courseInfo[k].textContent;
                                            break;
                                        case "教室":
                                            course.address = courseInfo[k].textContent;
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            }
                            if (course.name !== "" && course.time !== "") {
                                let weekInfo = course.time.split("(周)")[0];
                                let startWeek = parseInt(weekInfo.split(/-|,/)[0]);
                                let endWeek = parseInt(weekInfo.split(/-|,/).slice(-1)[0]);
                                let interval = weekInfo.includes(',')?2:1;
                                let timeInfo = course.time.split("(周)")[1].slice(1,-2).split('-');
                                let startTime = window.class_start[parseInt(timeInfo[0])];
                                let endTime = window.class_start[parseInt(timeInfo.slice(-1)[0])];
                                // push
                                var startDate = new Date(),endDate=new Date(),untilDate=new Date();
                                startDate.setDate(startDate.getDate() - startDate.getDay() - (currentWeek - startWeek) * 7 + weekDay);
                                startDate.setHours(startTime[0], startTime[1], 0, 0);
                                endDate.setDate(endDate.getDate() - endDate.getDay() - (currentWeek - startWeek) * 7 + weekDay);
                                endDate.setHours(endTime[0],endTime[1]+window.class_time);
                                untilDate.setDate(untilDate.getDate() - untilDate.getDay() + (endWeek - currentWeek) * 7 + weekDay + 1);
                                untilDate.setHours(endTime[0],endTime[1]+window.class_time);
                                let uid = course.name + toString(startDate) + toString(endDate) + toString(untilDate) + interval;
                                if (eventSet.has(uid)){
                                    continue;
                                }
                                eventSet.add(uid);
                                calendarEvents.push([
                                    'BEGIN:VEVENT',
                                    'DTSTAMP:' + toString(new Date()),
                                    'UID:' + calendarEvents.length + '@https://chaiqingao.github.io/',
                                    'SUMMARY:' + course.name,
                                    'DTSTART:' + toString(startDate),
                                    'DTEND:' + toString(endDate),
                                    'RRULE:FREQ=WEEKLY;UNTIL=' + toString(untilDate) + ';INTERVAL=' + interval,
                                    'LOCATION:' + course.address + '@' + course.teacher,
                                    'DESCRIPTION:' + course.time,
                                    'END:VEVENT'
                                ].join(SEPARATOR));
                            }
                        }
                    }
                    //保存
                    if (calendarEvents.length < 1) {
                        alert('课表里没课哦~😆');
                        return;
                    }
                    var fileName = yearTerm + ".ics";
                    var calendar = calendar_start + SEPARATOR + calendarEvents.join(SEPARATOR) + calendar_end;
                    var blob;
                    if (navigator.userAgent.indexOf('MSIE 10') === -1) { // chrome or firefox
                        blob = new Blob([calendar]);
                    } else { // ie
                        var bb = new BlobBuilder();
                        bb.append(calendar);
                        blob = bb.getBlob('text/x-vCalendar;charset=' + document.characterSet);
                    }
                    saveAs(blob, fileName);
                } catch(error) {
                    console.log(error);
                    alert("出错啦！/(ㄒoㄒ)/~~");
                }
            }
        } catch (error) {
            if(error.message !== window.error_message) {
                window.error_message = error.message;
                console.log(error);
            }
            return;
        }
    };
    // 保证页面刷新后重新执行
    // setInterval(onload, 50);
})();