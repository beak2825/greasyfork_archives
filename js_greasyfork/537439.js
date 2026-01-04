// ==UserScript==
// @name              惠州学院 HZU | 教务系统课程表导出助手
// @namespace    http://tampermonkey.net/
// @version           0.7.3
// @description    解析惠州学院教务系统（正方教务系统）的课程表页面，导出为标准 .ics 日历文件，供第三方日历使用。核心代码改自 31415926535x 。
// @author            ruixuan2025@icloud.com, 31415926535x
// @homepage     https://greasyfork.org/en/scripts/537439
// @homepage     https://github.com/Ckrvxr
// @compatible   chrome
// @license           Apache-2.0 license
// @include          *://jwxt.hzu.edu.cn/*
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/537439/%E6%83%A0%E5%B7%9E%E5%AD%A6%E9%99%A2%20HZU%20%7C%20%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%BE%E7%A8%8B%E8%A1%A8%E5%AF%BC%E5%87%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/537439/%E6%83%A0%E5%B7%9E%E5%AD%A6%E9%99%A2%20HZU%20%7C%20%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%BE%E7%A8%8B%E8%A1%A8%E5%AF%BC%E5%87%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ClassScheduleURL = "kbcx/xskbcx_cxXskbcxIndex.html";
    unsafeWindow.addEventListener("load", main);
    function main() {
        const windowURL = window.location.href;
        if (windowURL.indexOf(ClassScheduleURL) !== -1) {
            ClassScheduleToICS();
        }
    }

    function ClassScheduleToICS() {

        function pageFullyLoaded() {
            let div = document.getElementsByClassName("btn-toolbar pull-right")[0];
            if (!div) return;

            let btn = document.createElement("button");
            btn.className = "btn btn-default";
            btn.id = "exportbtn";

            let sp = document.createElement("span");
            sp.innerText = "将导出课表为.ics";
            sp.className = "bigger-120 glyphicon glyphicon-file";
            btn.appendChild(sp);

            div.appendChild(btn);

            btn.onclick = function () {
                let input = document.createElement("input");
                input.type = "date";
                input.value = "2025-09-08";

                let dialog = document.createElement("div");
                dialog.style.position = "fixed";
                dialog.style.top = "40%";
                dialog.style.left = "50%";
                dialog.style.transform = "translate(-50%, -50%)";
                dialog.style.padding = "20px";
                dialog.style.backgroundColor = "#fff";
                dialog.style.border = "1px solid #ccc";
                dialog.style.zIndex = "9999";
                dialog.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
                dialog.innerHTML = "<p>请选择要导出的学期第一个星期一：</p>";

                dialog.appendChild(input);

                let confirmBtn = document.createElement("button");
                confirmBtn.textContent = "确定";
                confirmBtn.style.marginLeft = "10px";
                confirmBtn.className = "btn btn-primary btn-sm";
                confirmBtn.onclick = function () {
                    startDate = input.value;
                    document.body.removeChild(dialog);
                    generateCalendar(parseCourses(parseTable(startDate)));
                    alert("请自行一一核对，以免漏课旷课！\n出现以上问题，概不负责！");
                };

                let cancelBtn = document.createElement("button");
                cancelBtn.textContent = "取消";
                cancelBtn.className = "btn btn-secondary btn-sm";
                cancelBtn.onclick = function () {
                    document.body.removeChild(dialog);
                };

                dialog.appendChild(confirmBtn);
                dialog.appendChild(cancelBtn);

                document.body.appendChild(dialog);
            };
        }

        var startDate;
        var Week;

        (function (Week) {
            Week[Week["Monday"] = 1] = "Monday";
            Week[Week["TuesDay"] = 2] = "TuesDay";
            Week[Week["Wednesday"] = 3] = "Wednesday";
            Week[Week["ThursDay"] = 4] = "ThursDay";
            Week[Week["Friday"] = 5] = "Friday";
            Week[Week["Saturday"] = 6] = "Saturday";
            Week[Week["Sunday"] = 7] = "Sunday";
        })(Week || (Week = {}));

        function parseTable() {
            let table = document.getElementById("kbgrid_table_0");
            let tds = table.querySelectorAll("td");
            let week = [];
            let divs = [];
            tds.forEach(element => {
                if (element.hasAttribute("id")) {
                    if (element.hasChildNodes()) {
                        let div = Array.from(element.getElementsByTagName("div"));
                        divs = divs.concat(div);
                        let wk = Week[element.getAttribute("id")[0]];
                        for (let i = 0; i < div.length; ++i) {
                            week.push(wk);
                        }
                    }
                }
            });
            return { week: week, divs: divs };
        }

        class Course {
            constructor(course) {
                if (course) {
                    this.name = course.name;
                    this.week = course.week;
                    this.info = course.info;
                    this.startTime = course.startTime;
                    this.endTime = course.endTime;
                    this.startWeek = course.startWeek;
                    this.endWeek = course.endWeek;
                    this.isSingleOrDouble = course.isSingleOrDouble;
                    this.location = course.location;
                    this.teacher = course.teacher;
                    this.exam = course.exam;
                }
            }
        }

        function parseCourses(data) {
            var courses = [];
            for (let i = 0; i < data.divs.length; ++i) {
                let course = new Course();
                course.week = data.week[i];
                course.name = data.divs[i].getElementsByTagName("span")[0]
                                          .getElementsByTagName("font")[0]
                                          .innerText;
                data.divs[i].querySelectorAll("p").forEach(p => {
                    if (p.getElementsByTagName("span")[0]?.getAttribute("title") === "节/周") {
                        (function (str = p.getElementsByTagName("font")[1]?.innerText || "") {
                            course.info = str;
                            let time = str.substring(str.indexOf("(") + 1, str.indexOf(")") + 1 - 1);
                            let wk = str.substring(str.indexOf(")") + 1, str.length).split(",");
                            course.startTime = parseInt(time.substring(0, time.indexOf("-")));
                            course.endTime = parseInt(time.substring(time.indexOf("-") + 1, time.indexOf("节")));
                            course.isSingleOrDouble = [];
                            course.startWeek = [];
                            course.endWeek = [];
                            wk.forEach(w => {
                                if (w.indexOf("单") !== -1 || w.indexOf("双") !== -1) {
                                    course.isSingleOrDouble.push(2);
                                } else {
                                    course.isSingleOrDouble.push(1);
                                }
                                let startWeek, endWeek;
                                if (w.indexOf("-") === -1) {
                                    startWeek = endWeek = parseInt(w.substring(0, w.indexOf("周")));
                                } else {
                                    startWeek = parseInt(w.substring(0, w.indexOf("-")));
                                    endWeek = parseInt(w.substring(w.indexOf("-") + 1, w.indexOf("周")));
                                }
                                course.startWeek.push(startWeek);
                                course.endWeek.push(endWeek);
                            });
                        })();
                    } else if (p.getElementsByTagName("span")[0]?.getAttribute("title") === "上课地点") {
                        course.location = (p.getElementsByTagName("font")[1]?.innerText || "").replace(/\s*本校区\s*/g, '');
                    } else if (p.getElementsByTagName("span")[0]?.getAttribute("title") === "教师 ") {
                        course.teacher = p.getElementsByTagName("font")[1]?.innerText || "";
                    } else if (p.getElementsByTagName("span")[0]?.getAttribute("title") === "考核方式") {
                        course.exam = p.getElementsByTagName("font")[1]?.innerText || "";
                    }
                });
                courses.push(course);
            }
            return courses;
        }

        function getTime(num, StartOrEnd) {
            const periodMap = [
                { start: "080000", end: "084000" }, // 1
                { start: "084500", end: "092500" }, // 2
                { start: "093000", end: "101000" }, // 3
                { start: "103000", end: "111000" }, // 4
                { start: "111500", end: "115500" }, // 5
                { start: "143000", end: "151000" }, // 6
                { start: "151500", end: "155500" }, // 7
                { start: "161500", end: "165500" }, // 8
                { start: "170000", end: "174000" }, // 9
                { start: "193000", end: "201000" }, // 10
                { start: "201500", end: "205500" }, // 11
                { start: "210000", end: "214000" }, // 12
            ];
            if (num < 1 || num > periodMap.length) {
                console.error("无效的节次编号：" + num);
                return "000000";
            }
            const period = periodMap[num - 1];
            return StartOrEnd === 0 ? period.start : period.end;
        }

        function getFixedLen(s, len) {
            if (s.length < len) {
                return getFixedLen("0" + s, len);
            } else if (s.length > len) {
                return s.slice(0, len);
            } else {
                return s;
            }
        }

        function getDate(num, wk) {
            let date = new Date(startDate.toString());
            date.setDate(date.getDate() + (num - 1) * 7 + Week[wk] - 1);
            let res = "";
            res += getFixedLen(date.getUTCFullYear().toString(), 4);
            res += getFixedLen((date.getUTCMonth() + 1).toString(), 2);
            res += getFixedLen(date.getUTCDate().toString(), 2);
            res += "T";
            return res;
        }

        function generateCalendar(courses) {
            let res = new ICS();
            courses.forEach(course => {
                for (let i = 0; i < course.isSingleOrDouble.length; ++i) {
                    let e = new ICSEvent(
                        getDate(course.startWeek[i], course.week) + getTime(course.startTime, 0),
                        getDate(course.startWeek[i], course.week) + getTime(course.endTime, 1),
                        course.name,
                        course.location
                    );
                    e.setDescription(course.name, course.teacher, course.info, course.location, course.exam);
                    e.setRRULE("WEEKLY", res.Calendar.WKST,
                        "" + (course.endWeek[i] - course.startWeek[i] + course.isSingleOrDouble[i]) / course.isSingleOrDouble[i],
                        "" + course.isSingleOrDouble[i],
                        "" + course.week.substr(0, 2).toUpperCase()
                    );
                    res.pushEvent(e);
                }
            });

            // 建立一个周数事件，持续 20 周
            (function () {
                for (let i = 1; i < 20; ++i) {
                    let e = new ICSEvent("" + getDate(i, Week[1]) + "060000",
                        "" + getDate(i, Week[1]) + "070000",
                        "" + "第" + i + "周",
                        ""
                    );
                    res.pushEvent(e);
                }
            })();

            res.pushCalendarEnd();
            res.exportIcs(startDate);
        }

        const CRLF = "\n";
        const SPACE = " ";

        class ICS {
            constructor() {
                this.Calendar = {
                    PRODID: "-//ckrvxr//HZU Calendar Exporter v0.7.3//CN",
                    VERSION: "2.0",
                    CALSCALE: "GREGORIAN",
                    TIMEZONE: "Asia/Shanghai",
                    ISVALARM: true,
                    VALARM: "-P0DT0H15M0S", //提醒时间
                    WKST: "SU"
                };
                this.ics = [
                    "BEGIN:VCALENDAR",
                    "VERSION:" + this.Calendar.VERSION,
                    "PRODID:" + this.Calendar.PRODID,
                    "CALSCALE:" + this.Calendar.CALSCALE
                ];
            }

            pushEvent(e) {
                this.ics.push("BEGIN:VEVENT");
                this.ics.push(e.getDTSTART());
                this.ics.push(e.getDTEND());
                if (e.isrrule) this.ics.push(e.getRRULE());
                this.ics.push(e.getSUMMARY());
                this.ics.push(e.getDESCRIPTION());
                if (e.LOCATION) this.ics.push(e.getLOCATION());
                if (this.Calendar.ISVALARM) this.pushAlarm();
                this.ics.push("END:VEVENT");
                this.ics.push(CRLF);
            }

            pushAlarm() {
                this.ics.push("BEGIN:VALARM");
                this.ics.push("ACTION:DISPLAY");
                this.ics.push("DESCRIPTION:This is an event reminder");
                this.ics.push("TRIGGER:" + this.Calendar.VALARM);
                this.ics.push("END:VALARM");
            }

            pushCalendarEnd() {
                this.ics.push("END:VCALENDAR");
            }

            getFixedIcs() {
                const MAX_LINE_LENGTH = 75;
                const FOLD_SPACE = " ";
                this.res = "";

                this.ics.forEach(line => {
                    let pos = 0;
                    while (pos < line.length) {
                        let end = Math.min(pos + MAX_LINE_LENGTH, line.length);
                        this.res += line.substring(pos, end) + CRLF;
                        pos = end;
                        if (pos < line.length) {
                            this.res += FOLD_SPACE;
                        }
                    }
                });

                return this.res;
            }

            exportIcs(startDate) {
                this.getFixedIcs();
                let link = window.URL.createObjectURL(new Blob([this.res], {
                    type: "text/x-vCalendar"
                }));
                const fileName = startDate + ".ics";
                let a = document.createElement("a");
                a.setAttribute("href", link);
                a.setAttribute("download", fileName);
                a.click();
            }
        }

        class ICSEvent {
            constructor(DTSTART, DTEND, SUMMARY, LOCATION) {
                this.DTSTART = DTSTART;
                this.DTEND = DTEND;
                this.SUMMARY = SUMMARY;
                this.LOCATION = LOCATION || null;
                this.DESCRIPTION = "";
            }

            isrrule = false;
            RRULE;
            LOCATION;

            setRRULE(FREQ, WKST, COUNT, INTERVAL, BYDAY) {
                this.isrrule = true;
                this.RRULE = "RRULE:FREQ=" + FREQ + ";WKST=" + WKST + ";COUNT=" + COUNT + ";INTERVAL=" + INTERVAL + ";BYDAY=" + BYDAY;
            }

            getRRULE() { return this.RRULE; }
            getDTSTART() { return "DTSTART:" + this.DTSTART; }
            getDTEND() { return "DTEND:" + this.DTEND; }
            getSUMMARY() { return "SUMMARY:" + this.SUMMARY; }
            getDESCRIPTION() { return this.DESCRIPTION ? "DESCRIPTION:" + this.DESCRIPTION : ""; }

            setDescription(name, teacher, info, location, exam) {
                this.DESCRIPTION = `课程名称：${name.trim()}\\n时间安排：${info.trim()}\\n上课地点：${location.trim()}\\n授课教师：${teacher.trim()}\\n考核方式：${exam.trim()}`;
            }

            getLOCATION() { return this.LOCATION ? "LOCATION:" + this.LOCATION : ""; }
        }

        pageFullyLoaded();
    }
})();