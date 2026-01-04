// ==UserScript==
// @name              WHU Schedule Export as iCS Calendar
// @name:zh           武大课程表导出为 iCS
// @name:zh-CN        武大课程表导出为 iCS
// @name:zh-TW        武大課程表匯出為 iCS
// @namespace         https://github.com/Ostrichbeta/WHU-class-schedule-export-ics/raw/main/schedule_export.js
// @version           0.91
// @description       Export your timetable as ics format.
// @description:zh-CN 导出课表为 ics 格式
// @description:zh-TW 匯出課表為 ics 格式
// @author            Ostrichbeta Chan
// @license           GPL-3.0
// @match             https://jwgl.whu.edu.cn/kbcx/xskbcx_cxXskbcxIndex.html*
// @icon              data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require           https://code.jquery.com/jquery-3.6.1.min.js
// @require           https://cdn.jsdelivr.net/npm/opencc-js@1.0.4/data.min.js
// @require           https://cdn.jsdelivr.net/npm/opencc-js@1.0.4/data.cn2t.min.js
// @require           https://cdn.jsdelivr.net/npm/opencc-js@1.0.4/bundle-browser.min.js
// @require           https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js
// @grant             none
// @run-at            document-end
// @downloadURL https://update.greasyfork.org/scripts/450318/WHU%20Schedule%20Export%20as%20iCS%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/450318/WHU%20Schedule%20Export%20as%20iCS%20Calendar.meta.js
// ==/UserScript==

(function () {
    window.jQuery361 = $.noConflict(true); // Avoid the confliction with the original page

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
    var _global =
        typeof window === "object" && window.window === window
            ? window
            : typeof self === "object" && self.self === self
                ? self
                : typeof global === "object" && global.global === global
                    ? global
                    : this;

    function bom(blob, opts) {
        if (typeof opts === "undefined") opts = { autoBom: false };
        else if (typeof opts !== "object") {
            console.warn("Deprecated: Expected third argument to be a object");
            opts = { autoBom: !opts };
        }

        // prepend BOM for UTF-8 XML and text/* types (including HTML)
        // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
        if (
            opts.autoBom &&
            /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(
                blob.type
            )
        ) {
            return new Blob([String.fromCharCode(0xfeff), blob], { type: blob.type });
        }
        return blob;
    }

    function download(url, name, opts) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.onload = function () {
            saveAs(xhr.response, name, opts);
        };
        xhr.onerror = function () {
            console.error("could not download file");
        };
        xhr.send();
    }

    function corsEnabled(url) {
        var xhr = new XMLHttpRequest();
        // use sync to avoid popup blocker
        xhr.open("HEAD", url, false);
        try {
            xhr.send();
        } catch (e) { }
        return xhr.status >= 200 && xhr.status <= 299;
    }

    // `a.click()` doesn't work for all browsers (#465)
    function click(node) {
        try {
            node.dispatchEvent(new MouseEvent("click"));
        } catch (e) {
            var evt = document.createEvent("MouseEvents");
            evt.initMouseEvent(
                "click",
                true,
                true,
                window,
                0,
                0,
                0,
                80,
                20,
                false,
                false,
                false,
                false,
                0,
                null
            );
            node.dispatchEvent(evt);
        }
    }

    var saveAs =
        _global.saveAs ||
        // probably in some web worker
        (typeof window !== "object" || window !== _global
            ? function saveAs() {
                /* noop */
            }
            : // Use download attribute first if possible (#193 Lumia mobile)
            "download" in HTMLAnchorElement.prototype
                ? function saveAs(blob, name, opts) {
                    var URL = _global.URL || _global.webkitURL;
                    var a = document.createElement("a");
                    name = name || blob.name || "download";

                    a.download = name;
                    a.rel = "noopener"; // tabnabbing

                    // TODO: detect chrome extensions & packaged apps
                    // a.target = '_blank'

                    if (typeof blob === "string") {
                        // Support regular links
                        a.href = blob;
                        if (a.origin !== location.origin) {
                            corsEnabled(a.href)
                                ? download(blob, name, opts)
                                : click(a, (a.target = "_blank"));
                        } else {
                            click(a);
                        }
                    } else {
                        // Support blobs
                        a.href = URL.createObjectURL(blob);
                        setTimeout(function () {
                            URL.revokeObjectURL(a.href);
                        }, 4e4); // 40s
                        setTimeout(function () {
                            click(a);
                        }, 0);
                    }
                }
                : // Use msSaveOrOpenBlob as a second approach
                "msSaveOrOpenBlob" in navigator
                    ? function saveAs(blob, name, opts) {
                        name = name || blob.name || "download";

                        if (typeof blob === "string") {
                            if (corsEnabled(blob)) {
                                download(blob, name, opts);
                            } else {
                                var a = document.createElement("a");
                                a.href = blob;
                                a.target = "_blank";
                                setTimeout(function () {
                                    click(a);
                                });
                            }
                        } else {
                            navigator.msSaveOrOpenBlob(bom(blob, opts), name);
                        }
                    }
                    : // Fallback to using FileReader and a popup
                    function saveAs(blob, name, opts, popup) {
                        // Open a popup immediately do go around popup blocker
                        // Mostly only available on user interaction and the fileReader is async so...
                        popup = popup || open("", "_blank");
                        if (popup) {
                            popup.document.title = popup.document.body.innerText =
                                "downloading...";
                        }

                        if (typeof blob === "string") return download(blob, name, opts);

                        var force = blob.type === "application/octet-stream";
                        var isSafari =
                            /constructor/i.test(_global.HTMLElement) || _global.safari;
                        var isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);

                        if (
                            (isChromeIOS || (force && isSafari)) &&
                            typeof FileReader !== "undefined"
                        ) {
                            // Safari doesn't allow downloading of blob URLs
                            var reader = new FileReader();
                            reader.onloadend = function () {
                                var url = reader.result;
                                url = isChromeIOS
                                    ? url
                                    : url.replace(/^data:[^;]*;/, "data:attachment/file;");
                                if (popup) popup.location.href = url;
                                else location = url;
                                popup = null; // reverse-tabnabbing #460
                            };
                            reader.readAsDataURL(blob);
                        } else {
                            var URL = _global.URL || _global.webkitURL;
                            var url = URL.createObjectURL(blob);
                            if (popup) popup.location = url;
                            else location.href = url;
                            popup = null; // reverse-tabnabbing #460
                            setTimeout(function () {
                                URL.revokeObjectURL(url);
                            }, 4e4); // 40s
                        }
                    });

    _global.saveAs = saveAs.saveAs = saveAs;

    if (typeof module !== "undefined") {
        module.exports = saveAs;
    }

    /* UUID genertor from https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid */

    function uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
            (
                c ^
                (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
            ).toString(16)
        );
    }

    /* global saveAs, Blob, BlobBuilder, console */
    /* exported ics */
    /* https://github.com/nwcell/ics.js */

    var ics = function (uidDomain, prodId) {
        "use strict";

        if (
            navigator.userAgent.indexOf("MSIE") > -1 &&
            navigator.userAgent.indexOf("MSIE 10") == -1
        ) {
            console.log("Unsupported Browser");
            return;
        }

        if (typeof uidDomain === "undefined") {
            uidDomain = "default";
        }
        if (typeof prodId === "undefined") {
            prodId = "Calendar";
        }

        var SEPARATOR = navigator.appVersion.indexOf("Win") !== -1 ? "\r\n" : "\n";
        var calendarEvents = [];
        var calendarStart = [
            "BEGIN:VCALENDAR",
            "PRODID:" + prodId,
            "VERSION:2.0",
        ].join(SEPARATOR);
        var calendarEnd = SEPARATOR + "END:VCALENDAR";
        var BYDAY_VALUES = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

        return {
            /**
             * Returns events array
             * @return {array} Events
             */
            events: function () {
                return calendarEvents;
            },

            /**
             * Returns calendar
             * @return {string} Calendar in iCalendar format
             */
            calendar: function () {
                return (
                    calendarStart +
                    SEPARATOR +
                    calendarEvents.join(SEPARATOR) +
                    calendarEnd
                );
            },

            /**
             * Add event to the calendar
             * @param  {string} subject     Subject/Title of event
             * @param  {string} description Description of event
             * @param  {string} location    Location of event
             * @param  {string} begin       Beginning date of event
             * @param  {string} stop        Ending date of event
             */
            addEvent: function (
                subject,
                description,
                location,
                begin,
                stop,
                rrule,
                valarm
            ) {
                // I'm not in the mood to make these optional... So they are all required
                if (
                    typeof subject === "undefined" ||
                    typeof description === "undefined" ||
                    typeof location === "undefined" ||
                    typeof begin === "undefined" ||
                    typeof stop === "undefined"
                ) {
                    return false;
                }

                // validate rrule
                if (rrule) {
                    if (!rrule.rrule) {
                        if (
                            rrule.freq !== "YEARLY" &&
                            rrule.freq !== "MONTHLY" &&
                            rrule.freq !== "WEEKLY" &&
                            rrule.freq !== "DAILY"
                        ) {
                            throw "Recurrence rrule frequency must be provided and be one of the following: 'YEARLY', 'MONTHLY', 'WEEKLY', or 'DAILY'";
                        }

                        if (rrule.until) {
                            if (
                                isNaN(Date.parse(rrule.until)) &&
                                isNaN(Date.parse(rrule.until.toISOString()))
                            ) {
                                throw "Recurrence rrule 'until' must be a valid date string";
                            }
                        }

                        if (rrule.interval) {
                            if (isNaN(parseInt(rrule.interval))) {
                                throw "Recurrence rrule 'interval' must be an integer";
                            }
                        }

                        if (rrule.count) {
                            if (isNaN(parseInt(rrule.count))) {
                                throw "Recurrence rrule 'count' must be an integer";
                            }
                        }

                        if (typeof rrule.byday !== "undefined") {
                            if (
                                Object.prototype.toString.call(rrule.byday) !== "[object Array]"
                            ) {
                                throw "Recurrence rrule 'byday' must be an array";
                            }

                            if (rrule.byday.length > 7) {
                                throw "Recurrence rrule 'byday' array must not be longer than the 7 days in a week";
                            }

                            // Filter any possible repeats
                            rrule.byday = rrule.byday.filter(function (elem, pos) {
                                return rrule.byday.indexOf(elem) == pos;
                            });

                            for (var d in rrule.byday) {
                                if (BYDAY_VALUES.indexOf(rrule.byday[d]) < 0) {
                                    throw "Recurrence rrule 'byday' values must include only the following: 'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'";
                                }
                            }
                        }
                    }
                }

                // validate valarm
                if (valarm && Object.keys(valarm).length != 0) {
                    if (valarm.trigger) {
                        if (
                            isNaN(valarm.trigger) ||
                            !(typeof valarm.trigger === "number")
                        ) {
                            throw "Trigger time must be an integer!";
                        }
                    }
                    if (valarm.description) {
                        if (!(typeof valarm.description === "string")) {
                            throw "The description of valarm must be a string!";
                        }
                    }
                }

                //TODO add time and time zone? use moment to format?
                var start_date = new Date(begin);
                var end_date = new Date(stop);
                var now_date = new Date();

                var start_year = ("0000" + start_date.getFullYear().toString()).slice(
                    -4
                );
                var start_month = ("00" + (start_date.getMonth() + 1).toString()).slice(
                    -2
                );
                var start_day = ("00" + start_date.getDate().toString()).slice(-2);
                var start_hours = ("00" + start_date.getHours().toString()).slice(-2);
                var start_minutes = ("00" + start_date.getMinutes().toString()).slice(
                    -2
                );
                var start_seconds = ("00" + start_date.getSeconds().toString()).slice(
                    -2
                );

                var end_year = ("0000" + end_date.getFullYear().toString()).slice(-4);
                var end_month = ("00" + (end_date.getMonth() + 1).toString()).slice(-2);
                var end_day = ("00" + end_date.getDate().toString()).slice(-2);
                var end_hours = ("00" + end_date.getHours().toString()).slice(-2);
                var end_minutes = ("00" + end_date.getMinutes().toString()).slice(-2);
                var end_seconds = ("00" + end_date.getSeconds().toString()).slice(-2);

                var now_year = ("0000" + now_date.getFullYear().toString()).slice(-4);
                var now_month = ("00" + (now_date.getMonth() + 1).toString()).slice(-2);
                var now_day = ("00" + now_date.getDate().toString()).slice(-2);
                var now_hours = ("00" + now_date.getHours().toString()).slice(-2);
                var now_minutes = ("00" + now_date.getMinutes().toString()).slice(-2);
                var now_seconds = ("00" + now_date.getSeconds().toString()).slice(-2);

                // Since some calendars don't add 0 second events, we need to remove time if there is none...
                var start_time = "";
                var end_time = "";
                if (
                    start_hours +
                    start_minutes +
                    start_seconds +
                    end_hours +
                    end_minutes +
                    end_seconds !=
                    0
                ) {
                    start_time = "T" + start_hours + start_minutes + start_seconds;
                    end_time = "T" + end_hours + end_minutes + end_seconds;
                }
                var now_time = "T" + now_hours + now_minutes + now_seconds;

                var start = start_year + start_month + start_day + start_time;
                var end = end_year + end_month + end_day + end_time;
                var now = now_year + now_month + now_day + now_time;

                // recurrence rrule vars
                var rruleString;
                if (rrule) {
                    if (rrule.rrule) {
                        rruleString = rrule.rrule;
                    } else {
                        rruleString = "RRULE:FREQ=" + rrule.freq;

                        if (rrule.until) {
                            var uDate = new Date(
                                Date.parse(rrule.until.toISOString())
                            ).toISOString();
                            rruleString +=
                                ";UNTIL=" +
                                uDate.substring(0, uDate.length - 13).replace(/[-]/g, "") +
                                "000000Z";
                        }

                        if (rrule.interval) {
                            rruleString += ";INTERVAL=" + rrule.interval;
                        }

                        if (rrule.count) {
                            rruleString += ";COUNT=" + rrule.count;
                        }

                        if (rrule.byday && rrule.byday.length > 0) {
                            rruleString += ";BYDAY=" + rrule.byday.join(",");
                        }
                    }
                }

                var valarmArray = [];
                var valarmString;
                if (valarm && Object.keys(valarm).length != 0) {
                    let uuid = uuidv4();
                    valarmArray.push("BEGIN:VALARM");
                    valarmArray.push("X-WR-ALARMUID:" + uuid);
                    valarmArray.push("UID:" + uuid);
                    valarmArray.push(
                        "TRIGGER:-PT" + Math.floor(valarm.trigger).toString() + "M"
                    );
                    valarmArray.push("ACTION:DISPLAY");
                    if (valarm.description) {
                        valarmArray.push("DESCRIPTION:" + valarm.description);
                    }
                    valarmArray.push("END:VALARM");
                    valarmString = valarmArray.join(SEPARATOR);
                }

                var stamp = new Date().toISOString();

                var calendarEvent = [
                    "BEGIN:VEVENT",
                    "UID:" + calendarEvents.length + "@" + uidDomain,
                    "CLASS:PUBLIC",
                    "DESCRIPTION:" + description,
                    "DTSTAMP;VALUE=DATE-TIME:" + now,
                    "DTSTART;VALUE=DATE-TIME:" + start,
                    "DTEND;VALUE=DATE-TIME:" + end,
                    "LOCATION:" + location,
                    "SUMMARY:" + subject,
                    "TRANSP:TRANSPARENT",
                    "END:VEVENT",
                ];

                if (rruleString) {
                    calendarEvent.splice(4, 0, rruleString);
                }

                if (valarm && Object.keys(valarm).length != 0) {
                    calendarEvent.splice(calendarEvent.length - 1, 0, valarmString);
                }

                calendarEvent = calendarEvent.join(SEPARATOR);

                calendarEvents.push(calendarEvent);
                return calendarEvent;
            },

            /**
             * Download calendar using the saveAs function from filesave.js
             * @param  {string} filename Filename
             * @param  {string} ext      Extention
             */
            download: function (filename, ext) {
                if (calendarEvents.length < 1) {
                    return false;
                }

                ext = typeof ext !== "undefined" ? ext : ".ics";
                filename = typeof filename !== "undefined" ? filename : "calendar";
                var calendar =
                    calendarStart +
                    SEPARATOR +
                    calendarEvents.join(SEPARATOR) +
                    calendarEnd;

                var blob;
                if (navigator.userAgent.indexOf("MSIE 10") === -1) {
                    // chrome or firefox
                    blob = new Blob([calendar]);
                } else {
                    // ie
                    var bb = new BlobBuilder();
                    bb.append(calendar);
                    blob = bb.getBlob(
                        "text/x-vCalendar;charset=" + document.characterSet
                    );
                }
                saveAs(blob, filename + ext);
                return calendar;
            },

            /**
             * Build and return the ical contents
             */
            build: function () {
                if (calendarEvents.length < 1) {
                    return false;
                }

                var calendar =
                    calendarStart +
                    SEPARATOR +
                    calendarEvents.join(SEPARATOR) +
                    calendarEnd;

                return calendar;
            },
        };
    };

    let _dayschedule = [
        { start: "00:00", end: "00:00", "🤔": ":thinking:" },
        { start: "08:00", end: "08:45" },
        { start: "08:50", end: "09:35" },
        { start: "09:50", end: "10:35" },
        { start: "10:40", end: "11:25" },
        { start: "11:30", end: "12:15" },
        { start: "14:05", end: "14:50" },
        { start: "14:55", end: "15:40" },
        { start: "15:45", end: "16:30" },
        { start: "16:40", end: "17:25" },
        { start: "17:30", end: "18:15" },
        { start: "18:30", end: "19:15" },
        { start: "19:20", end: "20:05" },
        { start: "20:10", end: "20:55" },
    ];

    let _termschedule_start; // 学期开始的时间

    function get_start_time(week, day, no) {
        // Set the initial day to Sunday no matter whay day the start day is
        let date = new Date(); // Get current timezone offset
        let start_time = _termschedule_start + date.getTimezoneOffset() * 60 * 1000;
        start_time -= new Date(_termschedule_start).getDay() * 86400 * 1000;
        start_time += (week - 1) * 7 * 86400 * 1000;
        start_time += day * 86400 * 1000;
        let start_time_hhmm = _dayschedule[no]["start"].split(":");
        start_time +=
            parseInt(start_time_hhmm[0]) * 3600 * 1000 +
            parseInt(start_time_hhmm[1]) * 60 * 1000;
        return new Date(
            start_time - 8 * 3600 * 1000 - date.getTimezoneOffset() * 60 * 1000
        );
    }

    function get_end_time(week, day, no) {
        let date = new Date();
        let end_time = _termschedule_start + date.getTimezoneOffset() * 60 * 1000;
        end_time -= new Date(_termschedule_start).getDay() * 86400 * 1000;
        end_time += (week - 1) * 7 * 86400 * 1000;
        end_time += day * 86400 * 1000;
        let end_time_hhmm = _dayschedule[no]["end"].split(":");
        end_time +=
            parseInt(end_time_hhmm[0]) * 3600 * 1000 +
            parseInt(end_time_hhmm[1]) * 60 * 1000;
        return new Date(
            end_time - 8 * 3600 * 1000 - date.getTimezoneOffset() * 60 * 1000
        );
    }

    function get_end_of_week(week) {
        let date = new Date();
        return new Date(
            _termschedule_start +
            date.getTimezoneOffset() * 60 * 1000 -
            new Date(_termschedule_start).getDay() * 86400 * 1000 +
            week * 7 * 86400 * 1000 -
            1 -
            8 * 3600 * 1000 -
            date.getTimezoneOffset() * 60 * 1000
        );
    }

    // Language Check
    let language_list = navigator.languages;
    let tcindex = -1;
    let scindex = -1;
    for (let i = 0; i < language_list.length; i++) {
        if (
            language_list[i] == "zh" ||
            language_list[i] == "zh-CN" ||
            language_list[i] == "zh-SG" ||
            language_list[i] == "zh-Hans"
        )
            scindex = i;
        if (
            language_list[i] == "zh-TW" ||
            language_list[i] == "zh-HK" ||
            language_list[i] == "zh-Hant"
        )
            tcindex = i;
    }
    if (tcindex < 0) tcindex = language_list.length;
    if (scindex < 0) scindex = language_list.length;

    function export_ics() {
        var cal = ics();
        let is_convert_to_tc = false;

        var conf_form = $(
            '<div class="form-content" style="display:none;">' +
            '  <form class="form" role="form" lang="' +
            (scindex <= tcindex ? "zh-CN" : "zh-TW") +
            '">' +
            '    <div class="form-group">' +
            '      <label for="start_date">' +
            (scindex <= tcindex ? "开学日期" : "開學日期") +
            "</label>" +
            '      <input type="date" class="bootbox-input-date form-control" id="start_date" name="start_date" value="' +
            new Date().toISOString().slice(0, 10) +
            '"></input>' +
            "    </div>" +
            '    <div class="form-group">' +
            '      <label for="lang_sel">' +
            (scindex <= tcindex ? "课表语言" : "課表語言") +
            "</label>" +
            '      <select class="bootbox-input bootbox-input-select form-control" id="lang_sel" name="lang_sel">' +
            '        <option value="zh-sc"' +
            (scindex <= tcindex ? " selected" : "") +
            ">" +
            (scindex <= tcindex ? "简体中文" : "簡體中文") +
            "</option>" +
            '        <option value="zh-tc"' +
            (scindex <= tcindex ? "" : " selected") +
            ">" +
            (scindex <= tcindex ? "繁体中文" : "繁體中文") +
            "</option>" +
            "      </select>" +
            "    </div>" +
            '    <div class="form-group">' +
            '      <div class="checkbox" id="hasAlarmSwitchDiv">' +
            "          <label>" +
            '              <input class="bootbox-input bootbox-input-checkbox" type="checkbox" id="hasAlarmSwitch">' +
            "              " +
            (scindex <= tcindex ? "设定上课前提醒" : "設定上課前提醒") +
            "          </label>" +
            "      </div>" +
            '      <div id="alarm-panel" hidden>' +
            '        <div class="checkbox" id="hasAlarmSwitchDiv" hidden>' +
            "            <label>" +
            '                <input class="bootbox-input bootbox-input-checkbox" type="checkbox" id="hasOtherIntervalForFirstClass">' +
            "                " +
            (scindex <= tcindex
                ? "第一节课另设提醒时间间隔"
                : "第一節課另設提醒時間間隔") +
            "            </label>" +
            "        </div>" +
            '        <div class="row">' +
            '            <div class="col-sm-3">' +
            '                <div class="form-group">' +
            '                    <label for="normal_trigger">' +
            (scindex <= tcindex ? "课前提醒" : "課前提醒") +
            "</label>" +
            '                    <input type="number" class="bootbox-input-number form-control" id="normal_trigger" name="normal_trigger" value="15" min="0" max="1440"></input>' +
            "                </div>" +
            "            </div>" +
            '            <div class="col-sm-3">' +
            '                <div class="form-group">' +
            '                    <label for="morning_first_class_trigger">' +
            (scindex <= tcindex ? "早上首节前提醒" : "早上首節前提醒") +
            "</label>" +
            '                    <input type="number" disabled="true" class="bootbox-input-number form-control" id="morning_first_class_trigger" name="morning_first_class_trigger" value="15" min="0" max="1440"></input>' +
            "                </div>" +
            "            </div>" +
            '            <div class="col-sm-3">' +
            '                <div class="form-group">' +
            '                    <label for="afternoon_first_class_trigger">' +
            (scindex <= tcindex ? "下午首节前提醒" : "下午首節前提醒") +
            "</label>" +
            '                    <input type="number" disabled="true" class="bootbox-input-number form-control" id="afternoon_first_class_trigger" name="afternoon_first_class_trigger" value="15" min="0" max="1440"></input>' +
            "                </div>" +
            "            </div>" +
            '            <div class="col-sm-3">' +
            '                <div class="form-group">' +
            '                    <label for="evening_first_class_trigger">' +
            (scindex <= tcindex ? "晚上首节前提醒" : "晚上首節前提醒") +
            "</label>" +
            '                    <input type="number" disabled="true" class="bootbox-input-number form-control" id="evening_first_class_trigger" name="evening_first_class_trigger" value="15" min="0" max="1440"></input>' +
            "                </div>" +
            "            </div>" +
            "        </div>" +
            '        <div class="form-group" style="padding-top: 1px;">' +
            '          <p for="none">' +
            (scindex <= tcindex
                ? "提醒时间单位为分钟，范围 0~1440 ，如果设定为 0 则不提醒。"
                : "提醒時間單位為分鐘，範圍 0~1440 ，如果設定為 0 則不提醒。") +
            "      </p>" +
            "        </div>" +
            "      </div>" +
            "    </div>" +
            '    <div class="form-group" style="padding-top: 1px;">' +
            '      <p for="none">' +
            (scindex <= tcindex
                ? '运行说明：在上面选择开学第一周的任意日期（由周日开始周六结束算一周），然后在下方选择课表导出的语言，再按下「导出」即可将课表存为 .ics 的日历格式。繁体中文的课表由原始表经过 <a href="https://github.com/BYVoid/OpenCC">OpenCC</a> 程序转换得出，可能会有字符错误，请谅解。<br>本程序免费并在 <a href="https://github.com/Ostrichbeta/WHU-class-schedule-export-ics">GitHub</a> 开放源代码。'
                : '運行說明：在上面選擇開學第一週的任意日期（由週日開始週六結束為一週），然後在下方選擇課表匯出的語言，再按下「匯出」即可將課表存為 .ics 的日曆格式。繁體中文的課表由原始表經過 <a href="https://github.com/BYVoid/OpenCC">OpenCC</a> 程式轉換得出，可能會有字元錯誤，請諒解。<br>本程式免費並在 <a href="https://github.com/Ostrichbeta/WHU-class-schedule-export-ics">GitHub</a> 開放原始碼。') +
            "</p>" +
            "    </div>" +
            "  </form>" +
            "</div>"
        );

        // Control the toggle of alarm panel
        $("body").on("change", "#hasAlarmSwitch", function () {
            if ($("#hasAlarmSwitch") && $("#alarm-panel")) {
                if ($("#hasAlarmSwitch").is(":checked")) {
                    $("#alarm-panel").show();
                } else {
                    $("#alarm-panel").hide();
                }
            }
        });

        // Contol the toggle of unique interval for the first class
        $("body").on("change", "#hasOtherIntervalForFirstClass", function () {
            if ($("#hasOtherIntervalForFirstClass")) {
                if ($("#hasOtherIntervalForFirstClass").is(":checked")) {
                    // Remove all the disability to edit other editboxes
                    if ($("#morning_first_class_trigger"))
                        $("#morning_first_class_trigger").prop("disabled", false);
                    if ($("#afternoon_first_class_trigger"))
                        $("#afternoon_first_class_trigger").prop("disabled", false);
                    if ($("#evening_first_class_trigger"))
                        $("#evening_first_class_trigger").prop("disabled", false);
                } else {
                    if ($("#morning_first_class_trigger"))
                        $("#morning_first_class_trigger").prop("disabled", true);
                    if ($("#afternoon_first_class_trigger"))
                        $("#afternoon_first_class_trigger").prop("disabled", true);
                    if ($("#evening_first_class_trigger"))
                        $("#evening_first_class_trigger").prop("disabled", true);
                    // Reset all the values to the same as the first one
                    if ($("#morning_first_class_trigger"))
                        $("#morning_first_class_trigger").val($("#normal_trigger").val());
                    if ($("#afternoon_first_class_trigger"))
                        $("#afternoon_first_class_trigger").val($("#normal_trigger").val());
                    if ($("#evening_first_class_trigger"))
                        $("#evening_first_class_trigger").val($("#normal_trigger").val());
                }
            }
        });

        // Control the sync of the edit box
        $("body").on("change", "#normal_trigger", function () {
            if ($("#normal_trigger")) {
                if (parseInt($("#normal_trigger").val()) > 1440) {
                    $("#normal_trigger").val("1440");
                }
                if (
                    parseInt($("#normal_trigger").val()) < 0 ||
                    $("#normal_trigger").val() == ""
                ) {
                    $("#normal_trigger").val("0");
                }
                if (!$("#hasOtherIntervalForFirstClass").is(":checked")) {
                    if ($("#morning_first_class_trigger"))
                        $("#morning_first_class_trigger").val($("#normal_trigger").val());
                    if ($("#afternoon_first_class_trigger"))
                        $("#afternoon_first_class_trigger").val($("#normal_trigger").val());
                    if ($("#evening_first_class_trigger"))
                        $("#evening_first_class_trigger").val($("#normal_trigger").val());
                }
            }
        });

        // Ensure all the inputs are in the correct range
        $("body").on("change", "#morning_first_class_trigger", function () {
            if ($("#morning_first_class_trigger")) {
                if (parseInt($("#morning_first_class_trigger").val()) > 1440) {
                    $("#morning_first_class_trigger").val("1440");
                }
                if (
                    parseInt($("#morning_first_class_trigger").val()) < 0 ||
                    $("#morning_first_class_trigger").val() == ""
                ) {
                    $("#morning_first_class_trigger").val("0");
                }
            }
        });

        $("body").on("change", "#afternoon_first_class_trigger", function () {
            if ($("#afternoon_first_class_trigger")) {
                if (parseInt($("#afternoon_first_class_trigger").val()) > 1440) {
                    $("#afternoon_first_class_trigger").val("1440");
                }
                if (
                    parseInt($("#afternoon_first_class_trigger").val()) < 0 ||
                    $("#afternoon_first_class_trigger").val() == ""
                ) {
                    $("#afternoon_first_class_trigger").val("0");
                }
            }
        });

        $("body").on("change", "#evening_first_class_trigger", function () {
            if ($("#evening_first_class_trigger")) {
                if (parseInt($("#evening_first_class_trigger").val()) > 1440) {
                    $("#evening_first_class_trigger").val("1440");
                }
                if (
                    parseInt($("#evening_first_class_trigger").val()) < 0 ||
                    $("#evening_first_class_trigger").val() == ""
                ) {
                    $("#evening_first_class_trigger").val("0");
                }
            }
        });

        bootbox.confirm({
            title: scindex <= tcindex ? "导出设置" : "匯出設定",
            message: conf_form.html(),
            size: "small",
            buttons: {
                cancel: {
                    label: scindex <= tcindex ? "取消" : "取消",
                },
                confirm: {
                    label: scindex <= tcindex ? "导出" : "匯出",
                },
            },
            callback: function (result) {
                if (!result) return;
                else {
                    _termschedule_start = Date.parse($("#start_date").attr("value"));
                    is_convert_to_tc = $("#lang_sel").val() == "zh-tc";
                    // Fetch the vertical list
                    for (let i of $("#table2").children().eq(0).children()) {
                        if ($("#table2").children().eq(0).children().eq(0).is(i)) continue; // Skip the first element
                        if (typeof $(i).attr("id") == "undefined") continue;
                        let day_in_week =
                            parseInt($(i).attr("id").split("_")[1]) == 7
                                ? 0
                                : parseInt($(i).attr("id").split("_")[1]);
                        let is_first_morning_class_set = false;
                        let is_first_afternoon_class_set = false;
                        let is_first_evening_class_set = false;
                        for (let j of $(i).children()) {
                            if ($(i).children().eq(0).is(j)) continue; // Skip the first element which is an indicator

                            let Tsubject = "";
                            let Tdescription = "";
                            let Tlocation = "";
                            let Tbegin = "";
                            let Tend = "";
                            let TbeginList = [];
                            let TendList = [];
                            let TuntilList = [];
                            let TrruleList = [];
                            let Tvalarm = {};

                            let single_class_obj = $(j)
                                .children()
                                .eq(
                                    $(j).children().filter(":nth-child(1)").attr("rowspan") ==
                                        undefined
                                        ? 0
                                        : 1
                                )
                                .children()
                                .eq(0);

                            // Detects title, if a class has been modified, the span tag will be changed to u
                            if (
                                $(single_class_obj).children().filter("span.title").size() == 0
                            ) {
                                Tsubject = $(single_class_obj)
                                    .children()
                                    .filter("u.title")
                                    .text();
                            } else {
                                Tsubject = $(single_class_obj)
                                    .children()
                                    .filter("span.title")
                                    .text();
                            }

                            let class_duration_obj = $(j).children().filter(":nth-child(1)");
                            while (class_duration_obj.attr("rowspan") == undefined) {
                                // If a single class' rowspan is not equal to 1, it means there are modifications for this class
                                class_duration_obj = class_duration_obj
                                    .parent()
                                    .prev()
                                    .children()
                                    .filter(":nth-child(1)");
                            }
                            let class_duration_list = class_duration_obj.text().match(/\d+/g); // e.g.: [1, 2]

                            for (let k of $(single_class_obj)
                                .children()
                                .filter(":nth-child(2)")
                                .children()) {
                                let class_information_child_text_raw = $(k).text().trim(); // Remove the edge spaces here.
                                let class_information_list =
                                    class_information_child_text_raw.split("：");

                                switch (class_information_list[0]) {
                                    case "周数":
                                        let week_range_list =
                                            class_information_list[1].match(/\d+(-\d+)?周(?:\([单双]\))?/g);
                                        let week_duration_list = [];
                                        week_range_list.forEach((item, index, arr) => {
                                            let week_duration_item = item.match(/\d+/g);
                                            let single_double = item.match(/\([单双]\)/);

                                            let double_interval = false;
                                            if (week_duration_item.length == 0) {
                                                bootbox.alert({
                                                    title: scindex <= tcindex ? "错误" : "錯誤",
                                                    message:
                                                        scindex <= tcindex
                                                            ? "周数未显示，无法生成！\n脚本只能取得屏幕上所显示的信息，请通过点按左侧齿轮，在菜单中选中「时间」项开启。"
                                                            : "週數未顯示，無法匯出！\n腳本只能取得螢幕上所顯示的資訊，請通過點按左側齒輪，在彈出選單中選中「時間」項開啟。",
                                                    size: "small",
                                                });
                                                return;
                                            }
                                            if (single_double) {
                                                double_interval = true;
                                            }
                                            let startWeek = week_duration_item[0];
                                            let endWeek = "";
                                            if (week_duration_item.length == 1) {
                                                endWeek = week_duration_item[0];
                                            } else {
                                                endWeek = week_duration_item[1];
                                            }
                                            week_duration_list.push([
                                                parseInt(startWeek),
                                                parseInt(endWeek),
                                                double_interval
                                            ]);
                                        });
                                        for (let item of week_duration_list) {
                                            TbeginList.push(
                                                get_start_time(
                                                    item[0],
                                                    day_in_week,
                                                    parseInt(class_duration_list[0])
                                                )
                                            );
                                            TendList.push(
                                                get_end_time(
                                                    item[0],
                                                    day_in_week,
                                                    parseInt(
                                                        class_duration_list.length == 1
                                                            ? class_duration_list[0]
                                                            : class_duration_list[1]
                                                    )
                                                )
                                            );
                                            TuntilList.push(get_end_of_week(parseInt(item[1])));
                                            let Trrule = {};
                                            Trrule.freq = "WEEKLY";
                                            Trrule.interval = item[2] ? 2 : 1;
                                            TrruleList.push(Trrule);
                                        }
                                        break;

                                    case "上课地点":
                                        Tlocation = "武汉大学" + class_information_list[1];
                                        break;

                                    default:
                                        Tdescription +=
                                            (Tdescription == "" ? "" : "\\n") +
                                            class_information_list[0] +
                                            "：" +
                                            class_information_list[1];
                                }
                            }

                            // Check if the alarm switch is on, and check if this is the first class
                            if ($("#hasAlarmSwitch") && $("#hasAlarmSwitch").is(":checked")) {
                                if (
                                    parseInt(class_duration_list[0]) >= 1 &&
                                    parseInt(class_duration_list[0]) <= 5 &&
                                    !is_first_morning_class_set
                                ) {
                                    // Class started in the morning
                                    is_first_morning_class_set = true;
                                    if (parseInt($("#morning_first_class_trigger").val()) != 0) {
                                        // Ignore the alarm if the trigger time is zero
                                        Tvalarm = {
                                            trigger: parseInt(
                                                $("#morning_first_class_trigger").val()
                                            ),
                                            description: "alarm-morning-first-class",
                                        };
                                    }
                                } else if (
                                    parseInt(class_duration_list[0]) >= 6 &&
                                    parseInt(class_duration_list[0]) <= 10 &&
                                    !is_first_afternoon_class_set
                                ) {
                                    // Class started in the afternoon
                                    is_first_afternoon_class_set = true;
                                    if (
                                        parseInt($("#afternoon_first_class_trigger").val()) != 0
                                    ) {
                                        Tvalarm = {
                                            trigger: parseInt(
                                                $("#afternoon_first_class_trigger").val()
                                            ),
                                            description: "alarm-afternoon-first-class",
                                        };
                                    }
                                } else if (
                                    parseInt(class_duration_list[0]) >= 11 &&
                                    parseInt(class_duration_list[0]) <= 13 &&
                                    !is_first_evening_class_set
                                ) {
                                    // Class started in the evening
                                    is_first_evening_class_set = true;
                                    if (
                                        parseInt($("#afternoon_first_class_trigger").val()) != 0
                                    ) {
                                        Tvalarm = {
                                            trigger: parseInt(
                                                $("#evening_first_class_trigger").val()
                                            ),
                                            description: "alarm-evening-first-class",
                                        };
                                    }
                                } else {
                                    // Normal class
                                    if (parseInt($("#normal_trigger").val()) != 0) {
                                        Tvalarm = {
                                            trigger: parseInt($("#normal_trigger").val()),
                                            description: "alarm-normal-class",
                                        };
                                    }
                                }
                            }

                            if (is_convert_to_tc) {
                                // Chinese Conversion
                                let converter = OpenCC.Converter({ from: "cn", to: "twp" });
                                Tsubject = converter(Tsubject);
                                Tdescription = converter(Tdescription);
                                Tlocation = converter(Tlocation);
                            }


                            for (let index = 0; index < TbeginList.length; index++) {
                                TrruleList[index].until = TuntilList[index];
                                console.log({
                                    "tsubject": Tsubject,
                                    "tdescription": Tdescription,
                                    "tlocation": Tlocation,
                                    "tbegin": TbeginList[index],
                                    "tend": TendList[index],
                                    "trrule": TrruleList[index],
                                    "tvalarm": Tvalarm
                                });
                                cal.addEvent(
                                    Tsubject,
                                    Tdescription,
                                    Tlocation,
                                    TbeginList[index],
                                    TendList[index],
                                    TrruleList[index],
                                    Tvalarm
                                );
                            }
                        }
                    }
                    let converter = OpenCC.Converter({ from: "cn", to: "twp" });
                    cal.download(
                        is_convert_to_tc
                            ? converter($(".timetable_title").eq(0).text())
                            : $(".timetable_title").eq(0).text()
                    );
                }
            },
        });
    }

    var export_button = $(
        '<button type="button" class="btn btn-default" id="exportICS" data-type="list"><span class="bigger-120 glyphicon glyphicon-calendar"> ' +
        (scindex <= tcindex ? "导出iCS" : "匯出iCS") +
        "</span></button>"
    );
    export_button.click(export_ics);
    $("#tb").prepend(export_button);
})();
