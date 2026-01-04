// ==UserScript==
// @name FDU_Class_Schedule_Generator
// @name:zh 复旦大学课表生成器
// @description Generate an .ics format document from eHall(https://my.fudan.edu.cn/list/bks_xx_kcb)
// @description:zh 从eHall个人信息（https://my.fudan.edu.cn/list/bks_xx_kcb）生成ics格式的课表
// @version 1.0.0
// @include https://my.fudan.edu.cn/list/bks_xx_kcb
// @supportURL qsliu2017@outlook.com
// @namespace https://greasyfork.org/users/666994
// @downloadURL https://update.greasyfork.org/scripts/407104/FDU_Class_Schedule_Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/407104/FDU_Class_Schedule_Generator.meta.js
// ==/UserScript==


function chooseSemester() {
    //get semesters id
    const nav = document.getElementsByClassName("nav")[0];
    semesters = {};
    for (const child of nav.children) {
        const semesterNavReg = /nav-(\d{10})/;
        if (semesterNavReg.test(child.id))
            semesters[RegExp.$1] = child.firstElementChild.innerHTML;
    }

    //generate choose form
    let formHTML = "";
    for (const semestersId in semesters) {
        formHTML += `
    <div class="radio">
    <label>
    <input type="radio" name="semesterOption" id="${semestersId}" value="${semestersId}">
    ${semesters[semestersId]}
    </label>
    </div>
`
    }

    //include bootstrap
    let headElement = document.getElementsByTagName('head')[0];
    headElement.innerHTML += `
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/jquery@1.12.4/dist/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js"></script>
    `;

    //generate choose modal
    let bodyElement = document.getElementsByTagName('body')[0];
    bodyElement.innerHTML += `
    <!-- Modal -->
    <div class="modal fade" id="chooseModal" tabindex="-1" role="dialog" aria-labelledby="chooseModalLabel">
    <div class="modal-dialog" role="document">
    <div class="modal-content">
    <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    <h4 class="modal-title" id="chooseModalLabel">选择学期</h4>
    </div>
    <form name="chooseForm" class="modal-body">
    ${formHTML}
    <h5>请从<a href="http://www.jwc.fudan.edu.cn/">教务处</a>找到这个学期的起始，即第0周的星期日</h5>
    <h6>如果是暑假学期，第0周应该是教务处公布的开始上课时间的前一周</h6>
    <input type="datetime-local" name="fisrtDate" id="firstDate">
    </form>
    <div class="modal-footer">
    <button class="btn btn-primary" id="chooseModalSubmit" data-dismiss="modal">生成课表</button>
    </div>
    </div>
    </div>
    </div>
    `;
    document.getElementById("chooseModalSubmit")
        .addEventListener("click", generateClassSchedule);
    $('#chooseModal').modal('show');
}

function generateClassSchedule() {
    const semesterId = document.chooseForm.semesterOption.value,
        firstDate = document.chooseForm.fisrtDate.value;
    FirstdateOfSemester = firstDate.slice(0, 10);
    PublicClassTime = getPublicClassTime(semesterId);
    includeFileSaver();
    let blob = new Blob([iCalendarFormatter.ClassesCalendar(getClasses(semesterId))], { type: "text/plain;charset=utf-8" });
    saveAs(blob, semesters[semesterId] + ".ics");
}

class ClassTimeAndPlace {

    //教室、上课时间、上课周
    constructor(classroom, time, weeks) {
        this.classroom = classroom;
        this.parseTime(time);
        this.parseWeeks(weeks);
    }

    //把上课时间转化为Datetime格式
    parseTime(time) {
        const timeReg = /星期(.) 第(\d*)-(\d*)节/;
        if (timeReg.exec(time)) {
            this.weekday = ClassTimeAndPlace.WEEKDAYS()[RegExp.$1];
            this.starttime = PublicClassTime[parseInt(RegExp.$2) - 1][0];
            this.endtime = PublicClassTime[parseInt(RegExp.$3) - 1][1];
        }
    }

    //把上课周转化为数组
    parseWeeks(weeks) {
        const weeksReg = /(\d+-\d+|\d)/g,
            weekReg = /(\d+)/,
            durationReg = /(\d+)-(\d+)/;
        this.weeks = [];
        let weekDurations = [];
        while (weeksReg.test(weeks)) {
            weekDurations.push(RegExp.$1);
        }
        for (const duration of weekDurations) {
            if (durationReg.test(duration)) {
                this.weeks.push(
                    [firstDatetimeOfWeek(parseInt(RegExp.$1)),
                    lastDatetimeOfWeek(parseInt(RegExp.$2))]);
            }
            else if (weekReg.test(duration)) {
                this.weeks.push(
                    [firstDatetimeOfWeek(parseInt(RegExp.$1)),
                    lastDatetimeOfWeek(parseInt(RegExp.$1))])
            }
        }
    }

    //获取第一次课的开始时间
    getFirstStartDatetime() {
        const firstWeek = this.weeks[0][0],
            firstDate = dateToDatetime(new Date(datetimeToDate(firstWeek).getTime() + ClassTimeAndPlace.WEEKDAYS_TO_NUM()[this.weekday] * 24 * 60 * 60 * 1000));
        return firstDate.slice(0, -6) + this.starttime;
    }

    //获取第一次课的结束时间
    getFirstEndDatetime() {
        const firstWeek = this.weeks[0][0],
            firstDate = dateToDatetime(new Date(datetimeToDate(firstWeek).getTime() + ClassTimeAndPlace.WEEKDAYS_TO_NUM()[this.weekday] * 24 * 60 * 60 * 1000));
        return firstDate.slice(0, -6) + this.endtime;
    }
    static WEEKDAYS() {
        return {
            "日": "SU",
            "一": "MO",
            "二": "TU",
            "三": "WE",
            "四": "TH",
            "五": "FR",
            "六": "SA"
        }
    }
    static WEEKDAYS_TO_NUM() {
        return {
            "SU": 0,
            "MO": 1,
            "TU": 2,
            "WE": 3,
            "TH": 4,
            "FR": 5,
            "SA": 6
        }
    }
}

class Class {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.timeAndPlace = [];
    }
    AddTimeAndPlace(classroom, time, weeks) {
        this.timeAndPlace.push(new ClassTimeAndPlace(classroom, time, weeks));
    }
}

function getClasses(semesterId) {
    let listId = "list-" + semesterId,
        list = document.getElementById(listId),
        table = list
            .getElementsByTagName("table")[0]
            .getElementsByTagName("tbody")[0],
        rowSpan = 0,
        currentClass,
        Classes = [];
    for (const record of table.children) {
        if (rowSpan <= 0) {
            rowSpan = record.children[0].rowSpan;
            currentClass = new Class(
                record.children[0].innerHTML,
                record.children[1].innerHTML);
            currentClass.AddTimeAndPlace(
                record.children[2].innerHTML,
                record.children[3].innerHTML,
                record.children[4].innerHTML);
        }
        else {
            currentClass.AddTimeAndPlace(
                record.children[0].innerHTML,
                record.children[1].innerHTML,
                record.children[2].innerHTML);
        }
        rowSpan--;
        if (rowSpan <= 0) {
            Classes.push(currentClass);
        }
    }
    return Classes;
}

function getPublicClassTime(semesterId) {
    const tableId = "table-" + semesterId + "-1",
        table = document.getElementById(tableId).getElementsByTagName("tbody")[0],
        timeReg = /(\d+):(\d+)-(\d+):(\d+)/;
    let times = [];
    for (const row of table.children) {
        const record = row.firstElementChild.rowSpan == 1 ? row.firstElementChild : row.firstElementChild.nextElementSibling;
        if (timeReg.exec(record.innerHTML)) {
            let begintime = (RegExp.$1.length == 1 ? "0" : "") + RegExp.$1 + RegExp.$2 + "00",
                endtime = (RegExp.$3.length == 1 ? "0" : "") + RegExp.$3 + RegExp.$4 + "00";
            times.push([begintime, endtime]);
        }
    }
    return times;
}

function firstDatetimeOfWeek(week) {
    const FirstDateOfSemester = new Date(FirstdateOfSemester),
        FirstDateOfWeek = new Date(FirstDateOfSemester.getTime() + week * 7 * 24 * 60 * 60 * 1000);
    return dateToDatetime(FirstDateOfWeek);
}

function lastDatetimeOfWeek(week) {
    const FirstDatetimeOfSemester = new Date(FirstdateOfSemester),
        LastDatetimeOfWeek = new Date(FirstDatetimeOfSemester.getTime() + (week + 1) * 7 * 24 * 60 * 60 * 1000 - 1);
    return dateToDatetime(LastDatetimeOfWeek)
}

function dateToDatetime(date) {
    return ""
        + date.getFullYear()
        + ("0" + (date.getMonth() + 1)).slice(-2)
        + ("0" + date.getDate()).slice(-2)
        + "T"
        + ("0" + date.getHours()).slice(-2)
        + ("0" + date.getMinutes()).slice(-2)
        + ("0" + date.getSeconds()).slice(-2);
}

function datetimeToDate(datetime) {
    let date = datetime.slice(0, 4) + "/";
    date += datetime.slice(4, 6) + "/";
    date += datetime.slice(6, 8) + " ";
    date += datetime.slice(9, 11) + ":";
    date += datetime.slice(11, 13) + ":";
    date += datetime.slice(13, 15);
    return new Date(date);
}

class iCalendarFormatter {
    static ClassEvent(ClassRecord) {
        let event = "";
        for (const Class of ClassRecord.timeAndPlace) {
            event += "BEGIN:VEVENT\n";
            event += "SUMMARY:" + ClassRecord.name + "\n";
            event += "LOCATION:" + Class.classroom + "\n";
            event += "DTSTART:" + Class.getFirstStartDatetime() + "\n";
            event += "DTEND:" + Class.getFirstEndDatetime() + "\n";
            event += "RRULE:FREQ=WEEKLY;"
                + "BYDAY=" + Class.weekday + "\n";
            event += "RDATE;VALUE=PERIOD:"
            for (const week of Class.weeks) {
                event += week[0] + "/" + week[1] + ",";
            } event = event.slice(0, -1) + "\n";
            event += "END:VEVENT\n";
        }
        return event;
    }
    static ClassesCalendar(Classes) {
        let calendar = "BEGIN:VCALENDAR\nVERSION:2.0\n";
        for (const Class of Classes) {
            calendar += iCalendarFormatter.ClassEvent(Class);
        }
        calendar += "END:VCALENDAR\n";
        return calendar;
    }
}

function includeFileSaver() {
    (function (global, factory) {
        if (typeof define === "function" && define.amd) {
            define([], factory);
        } else if (typeof exports !== "undefined") {
            factory();
        } else {
            var mod = {
                exports: {}
            };
            factory();
            global.FileSaver = mod.exports;
        }
    })(this, function () {
        "use strict";

        /*
        * FileSaver.js
        * A saveAs() FileSaver implementation.
        *
        * By Eli Grey, http://eligrey.com
        *
        * License : https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md (MIT)
        * source  : http://purl.eligrey.com/github/FileSaver.js
        */
        // The one and only way of getting global scope in all environments
        // https://stackoverflow.com/q/3277182/1008999
        var _global = typeof window === 'object' && window.window === window ? window : typeof self === 'object' && self.self === self ? self : typeof global === 'object' && global.global === global ? global : void 0;

        function bom(blob, opts) {
            if (typeof opts === 'undefined') opts = {
                autoBom: false
            }; else if (typeof opts !== 'object') {
                console.warn('Deprecated: Expected third argument to be a object');
                opts = {
                    autoBom: !opts
                };
            } // prepend BOM for UTF-8 XML and text/* types (including HTML)
            // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF

            if (opts.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
                return new Blob([String.fromCharCode(0xFEFF), blob], {
                    type: blob.type
                });
            }

            return blob;
        }

        function download(url, name, opts) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.responseType = 'blob';

            xhr.onload = function () {
                saveAs(xhr.response, name, opts);
            };

            xhr.onerror = function () {
                console.error('could not download file');
            };

            xhr.send();
        }

        function corsEnabled(url) {
            var xhr = new XMLHttpRequest(); // use sync to avoid popup blocker

            xhr.open('HEAD', url, false);

            try {
                xhr.send();
            } catch (e) { }

            return xhr.status >= 200 && xhr.status <= 299;
        } // `a.click()` doesn't work for all browsers (#465)


        function click(node) {
            try {
                node.dispatchEvent(new MouseEvent('click'));
            } catch (e) {
                var evt = document.createEvent('MouseEvents');
                evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
                node.dispatchEvent(evt);
            }
        }

        var saveAs = _global.saveAs || ( // probably in some web worker
            typeof window !== 'object' || window !== _global ? function saveAs() { }
                /* noop */
                // Use download attribute first if possible (#193 Lumia mobile)
                : 'download' in HTMLAnchorElement.prototype ? function saveAs(blob, name, opts) {
                    var URL = _global.URL || _global.webkitURL;
                    var a = document.createElement('a');
                    name = name || blob.name || 'download';
                    a.download = name;
                    a.rel = 'noopener'; // tabnabbing
                    // TODO: detect chrome extensions & packaged apps
                    // a.target = '_blank'

                    if (typeof blob === 'string') {
                        // Support regular links
                        a.href = blob;

                        if (a.origin !== location.origin) {
                            corsEnabled(a.href) ? download(blob, name, opts) : click(a, a.target = '_blank');
                        } else {
                            click(a);
                        }
                    } else {
                        // Support blobs
                        a.href = URL.createObjectURL(blob);
                        setTimeout(function () {
                            URL.revokeObjectURL(a.href);
                        }, 4E4); // 40s

                        setTimeout(function () {
                            click(a);
                        }, 0);
                    }
                } // Use msSaveOrOpenBlob as a second approach
                    : 'msSaveOrOpenBlob' in navigator ? function saveAs(blob, name, opts) {
                        name = name || blob.name || 'download';

                        if (typeof blob === 'string') {
                            if (corsEnabled(blob)) {
                                download(blob, name, opts);
                            } else {
                                var a = document.createElement('a');
                                a.href = blob;
                                a.target = '_blank';
                                setTimeout(function () {
                                    click(a);
                                });
                            }
                        } else {
                            navigator.msSaveOrOpenBlob(bom(blob, opts), name);
                        }
                    } // Fallback to using FileReader and a popup
                        : function saveAs(blob, name, opts, popup) {
                            // Open a popup immediately do go around popup blocker
                            // Mostly only available on user interaction and the fileReader is async so...
                            popup = popup || open('', '_blank');

                            if (popup) {
                                popup.document.title = popup.document.body.innerText = 'downloading...';
                            }

                            if (typeof blob === 'string') return download(blob, name, opts);
                            var force = blob.type === 'application/octet-stream';

                            var isSafari = /constructor/i.test(_global.HTMLElement) || _global.safari;

                            var isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);

                            if ((isChromeIOS || force && isSafari) && typeof FileReader === 'object') {
                                // Safari doesn't allow downloading of blob URLs
                                var reader = new FileReader();

                                reader.onloadend = function () {
                                    var url = reader.result;
                                    url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, 'data:attachment/file;');
                                    if (popup) popup.location.href = url; else location = url;
                                    popup = null; // reverse-tabnabbing #460
                                };

                                reader.readAsDataURL(blob);
                            } else {
                                var URL = _global.URL || _global.webkitURL;
                                var url = URL.createObjectURL(blob);
                                if (popup) popup.location = url; else location.href = url;
                                popup = null; // reverse-tabnabbing #460

                                setTimeout(function () {
                                    URL.revokeObjectURL(url);
                                }, 4E4); // 40s
                            }
                        });
        _global.saveAs = saveAs.saveAs = saveAs;

        if (typeof module !== 'undefined') {
            module.exports = saveAs;
        }
    });
}

chooseSemester()