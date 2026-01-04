// ==UserScript==
// @name         课表助手
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  一键导出课表为ics文件
// @author       Qingao Chai
// @match        http://bkjw.whu.edu.cn/stu/stu_index.jsp
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397788/%E8%AF%BE%E8%A1%A8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/397788/%E8%AF%BE%E8%A1%A8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 设置上课时间及下课时间
    window.class_start = [[], [8, 0], [8, 50], [9, 50], [10, 40], [11, 30], [14, 5], [14, 55], [15, 45], [16, 40], [17, 30], [18, 30], [19, 20], [20, 10]];
    window.class_time = 45;
    window.weekToNum = { "日": 0, "一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6 }
    // 窗口加载完成调用函数
    window.onload = function () {
        try {
            // 获取main-->page_iframe-->iframe0
            var iframe0 = document.getElementById("page_iframe").contentDocument.getElementById("iframe0");
            if (iframe0.getAttribute("src").search("/servlet/Svlt_QueryStuLsn") === -1) return;
            // 添加按钮"保存ics"
            var buttons = iframe0.contentDocument.getElementsByName("submit");
            if(buttons.length !== 1) return;
            buttons[0].outerHTML += '<input type="button" onclick="saveics()" style="color: #FFF;width: 63px;height: 23px;padding: 0 10px;border: 0;cursor: pointer;margin-left: 10px;border: 1px solid lightgrey;border-radius: 4px;background-image: linear-gradient(#008CDD, #1A55A2);" name="submit" value="保存ics">';
            if(typeof iframe0.contentWindow.saveics === "function") return;
            // 添加按钮操作，核心部分
            iframe0.contentWindow.saveics = function () {
                if (navigator.userAgent.indexOf('MISE') > -1 && navigator.userAgent.indexOf('MSIE 10') == -1) {
                    alert('浏览器不支持哦~😆');
                    return;
                }
                var SEPARATOR = (navigator.appVersion.indexOf('Win') !== -1) ? '\r\n' : '\n';
                var calendar_start = [
                    'BEGIN:VCALENDAR',
                    'VERSION:2.0',
                    'PRODID:Curriculum-to-iCalendar'
                ].join(SEPARATOR);
                var calendar_end = SEPARATOR + 'END:VCALENDAR' + SEPARATOR;
                var calendarEvents = [];
                // 获取到课程表
                try {
                    var iframe0 = document.getElementById("page_iframe").contentDocument.getElementById("iframe0");
                    var table = iframe0.contentDocument.getElementsByTagName("table")[0];
                    var yearTerm = document.getElementsByName("indexYearTerm")[0].getAttribute("data-lang-args").split("~");
                    var year = yearTerm[0] + "-" + yearTerm[1];
                    var term = yearTerm[2];
                    var currentWeek = parseInt(document.getElementsByName("indexWeek")[0].getAttribute("data-lang-args"));
                    var toString = function (date) {
                        return date.toISOString().split(/-|:|[.]/).slice(0, 4).join("") + "00Z";
                    }
                    // 逐行添加event至cal
                    for (let i = 1; i < table.rows.length; i++) {
                        var courseName = table.rows[i].cells[1].innerText;
                        var teacherName = table.rows[i].cells[5].innerText;
                        var timeAddress = table.rows[i].cells[9].innerText;
                        if (courseName !== "" && timeAddress !== "") {
                            var events = timeAddress.split(' ').filter(n => n != "");
                            for (let j = 0; j < events.length; j++) {
                                //周一:1-11周,每1周;1-2节,3区,附3-401 ==> [一,1-11,1,1-2,3区,附3-401]
                                var informations = events[j].split(/周,每|周|节,|:|,|;/).filter(n => n != "");
                                var description = "第" + events[j].split(";")[1] + " " + teacherName;
                                var weekDay = weekToNum[informations[0]];
                                var startWeek = parseInt(informations[1].split("-")[0]);
                                var endWeek = parseInt(informations[1].split("-")[1]);
                                var interval = parseInt(informations[2]);
                                var startTime = class_start[parseInt(informations[3].split('-')[0])];
                                var endTime = class_start[parseInt(informations[3].split('-')[1])];
                                var address = [informations[4], informations[5], teacherName].join(" ");
                                var startDate = new Date(),endDate=new Date(),untilDate=new Date();
                                startDate.setDate(startDate.getDate() - startDate.getDay() - (currentWeek - startWeek) * 7 + weekDay);
                                startDate.setHours(startTime[0], startTime[1], 0, 0);
                                endDate.setDate(endDate.getDate() - endDate.getDay() - (currentWeek - startWeek) * 7 + weekDay);
                                endDate.setHours(endTime[0],endTime[1]+class_time);
                                untilDate.setDate(untilDate.getDate() - untilDate.getDay() + (endWeek - currentWeek) * 7 + weekDay + 1);
                                untilDate.setHours(endTime[0],endTime[1]+class_time);
                                calendarEvents.push([
                                    'BEGIN:VEVENT',
                                    'DTSTAMP:' + toString(new Date()),
                                    'UID:' + calendarEvents.length + '@' + 'https://chaiqingao.github.io/',
                                    'SUMMARY:' + courseName,
                                    'DTSTART:' + toString(startDate),
                                    'DTEND:' + toString(endDate),
                                    'RRULE:FREQ=WEEKLY;UNTIL=' + toString(untilDate) + ';INTERVAL=' + interval,
                                    'LOCATION:' + address,
                                    'DESCRIPTION:' + description,
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
                    var fileName = year + "学年第" + term + "学期.ics";
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
    setInterval(onload, 50);
})();