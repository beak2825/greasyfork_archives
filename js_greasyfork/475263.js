// ==UserScript==
// @name         SJTU Grad student classtable to iCalendar
// @name:zh-CN   SJTU研究生课表导出到iCalendar
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Export the SJTU graduate school schedule to an iCalendar file. Initial support for iOS calendar locations is currently available.
// @description:zh-CN  将研究生课表导出到iCalendar文件。目前初步支持iOS日历位置。
// @author       Victrid
// @match        http://yjs.sjtu.edu.cn/gsapp/sys/wdkbapp*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @run-at       document-end
// @license      GPL-3.0
// @grant        GM_xmlhttpRequest
// @connect      plus.sjtu.edu.cn
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/475263/SJTU%20Grad%20student%20classtable%20to%20iCalendar.user.js
// @updateURL https://update.greasyfork.org/scripts/475263/SJTU%20Grad%20student%20classtable%20to%20iCalendar.meta.js
// ==/UserScript==

/*jshint esversion: 8 */
(function () {
    'use strict';

    // This part is modified from https://github.com/nwcell/ics.js, licensed under MIT.
    // MIT License

    // Copyright (c) 2018 Travis Krause

    // Permission is hereby granted, free of charge, to any person obtaining a copy
    // of this software and associated documentation files (the "Software"), to deal
    // in the Software without restriction, including without limitation the rights
    // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    // copies of the Software, and to permit persons to whom the Software is
    // furnished to do so, subject to the following conditions:

    // The above copyright notice and this permission notice shall be included in all
    // copies or substantial portions of the Software.

    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    // SOFTWARE.
    // -------------------------------ICS.js start-----------------------------------
    const ics = function (prodId, uidDomain) {
        var SEPARATOR = '\n';
        var calendarEvents = [];
        var calendarStart = [
            'BEGIN:VCALENDAR',
            'PRODID:' + prodId,
            'VERSION:2.0'
        ].join(SEPARATOR);
        var calendarEnd = SEPARATOR + 'END:VCALENDAR';

        function GetTimeDate(date_object) {
            // Return the UTC ICS compatible TIME-DATE of a Date object. UTC part here is critical
            const yy = ("0000" + (date_object.getUTCFullYear().toString())).slice(-4);
            const MM = ("00" + ((date_object.getUTCMonth() + 1).toString())).slice(-2);
            const dd = ("00" + ((date_object.getUTCDate()).toString())).slice(-2);
            const hh = ("00" + (date_object.getUTCHours().toString())).slice(-2);
            const mm = ("00" + (date_object.getUTCMinutes().toString())).slice(-2);
            const ss = ("00" + (date_object.getUTCSeconds().toString())).slice(-2);
            return `${yy}${MM}${dd}T${hh}${mm}${ss}Z`;
        }

        // DTSTAMP
        const now = GetTimeDate(new Date());

        const geolocation = {
            // ios map related private annotations
            "东上院": {
                handle: `CAES8AIIl8QDEK/e9djnpP4BGhIJnrRwWYUFP0ARTaCIRQxc
            XkAiogEKBuS4reWbvRICQ04yCeS4iua1t+W4gkIJ6Ze16KGM5Yy6Uj7kuJzlt53ot684MDDl
            j7fkuIrmtbfkuqTpgJrlpKflrabpl7XooYzmoKHljLrlhoUo6L+R5Lic5LiL6ZmiKWI+5Lic
            5bed6LevODAw5Y+35LiK5rW35Lqk6YCa5aSn5a2m6Ze16KGM5qCh5Yy65YaFKOi/keS4nOS4
            i+mZoikqJ+S4iua1t+S6pOmAmuWkp+WtpumXteihjOagoeWMuuS4nOS4iumZojJW5Lit5Zu9
            5LiK5rW35biC6Ze16KGM5Yy65Lic5bed6LevODAw5Y+35LiK5rW35Lqk6YCa5aSn5a2m6Ze1
            6KGM5qCh5Yy65YaFKOi/keS4nOS4i+mZoik4L1ABWiMKIQiv3vXY56T+ARISCZ60cFmFBT9A
            EU2giEUMXF5AGJfEAw==`.replace(/\s/g, ""),
                radius: "95.46661055183932",
                geo: "31.021566,121.438249"
            },
            "东中院": {
                handle: `CAESvQIIl8QDEKuT1MbnpP4BGhIJpkboZ+oFP0ARO/4LBAFcXkAigAE
            KBuS4reWbvRICQ04yCeS4iua1t+W4gkIJ6Ze16KGM5Yy6Ui3kuJzlt53ot684MDDlj7fkuIr
            mtbfkuqTpgJrlpKflrabpl7XooYzmoKHljLpiLeS4nOW3nei3rzgwMOWPt+S4iua1t+S6pOm
            AmuWkp+WtpumXteihjOagoeWMuion5LiK5rW35Lqk6YCa5aSn5a2m6Ze16KGM5qCh5Yy65Li
            c5Lit6ZmiMkXkuK3lm73kuIrmtbfluILpl7XooYzljLrkuJzlt53ot684MDDlj7fkuIrmtbf
            kuqTpgJrlpKflrabpl7XooYzmoKHljLo4L1ABWiMKIQirk9TG56T+ARISCaZG6GfqBT9AETv
            +CwQBXF5AGJfEAw==`.replace(/\s/g, ""),
                radius: "116.1443983019585",
                geo: "31.023108,121.437562"
            },
            "东下院": {
                handle: `CAESzAIIl8QDEOvX+8HnpP4BGhIJjx1U4joGP0ARFokJavhbXkAi
            igEKBuS4reWbvRICQ04yCeS4iua1t+W4gkIJ6Ze16KGM5Yy6UjLkuJzlt53ot684MDDlj7fk
            uqTpgJrlpKflrablhoUo6L+R5Lqk5aSn5Zu+5Lmm6aaGKWIy5Lic5bed6LevODAw5Y+35Lqk
            6YCa5aSn5a2m5YaFKOi/keS6pOWkp+WbvuS5pummhikqJ+S4iua1t+S6pOmAmuWkp+WtpumX
            teihjOagoeWMuuS4nOS4i+mZojJK5Lit5Zu95LiK5rW35biC6Ze16KGM5Yy65Lic5bed6Lev
            ODAw5Y+35Lqk6YCa5aSn5a2m5YaFKOi/keS6pOWkp+WbvuS5pummhik4L1ABWiMKIQjr1/vB
            56T+ARISCY8dVOI6Bj9AERaJCWr4W15AGJfEAw==`.replace(/\s/g, ""),
                radius: "86.83563332157695",
                geo: "31.024336,121.437"
            },
            "上院": {
                handle: `CAESwwIIl8QDEJfTiujYgf4BGhIJokW28/0EP0ARDHVY4ZZbXkAihg
            EKBuS4reWbvRICQ04yCeS4iua1t+W4gkIJ6Ze16KGM5Yy6UjDkuJzlt53ot684MDDlj7fkuI
            rmtbfkuqTpgJrlpKflrabpl7XooYzmoKHljLrlhoViMOS4nOW3nei3rzgwMOWPt+S4iua1t+
            S6pOmAmuWkp+WtpumXteihjOagoeWMuuWGhSok5LiK5rW35Lqk6YCa5aSn5a2m6Ze16KGM5q
            Ch5Yy65LiK6ZmiMkjkuK3lm73kuIrmtbfluILpl7XooYzljLrkuJzlt53ot684MDDlj7fkuI
            rmtbfkuqTpgJrlpKflrabpl7XooYzmoKHljLrlhoU4L1ABWiMKIQiX04ro2IH+ARISCaJFtv
            P9BD9AEQx1WOGWW15AGJfEAw==`.replace(/\s/g, ""),
                radius: "79.62744974845103",
                geo: "31.019500,121.431084"
            },
            "中院": {
                handle: `CAESsAIIl8QDELDRiujYgf4BGhIJ8pTVdD0FP0ARgSOBBptbXkAiegoG
            5Lit5Zu9EgJDTjIJ5LiK5rW35biCQgnpl7XooYzljLpSKuS4nOW3nei3rzgwMOS4iua1t+S6
            pOmAmuWkp+WtpumXteihjOagoeWMumIq5Lic5bed6LevODAw5LiK5rW35Lqk6YCa5aSn5a2m
            6Ze16KGM5qCh5Yy6KiTkuIrmtbfkuqTpgJrlpKflrabpl7XooYzmoKHljLrkuK3pmaIyQuS4
            reWbveS4iua1t+W4gumXteihjOWMuuS4nOW3nei3rzgwMOS4iua1t+S6pOmAmuWkp+WtpumX
            teihjOagoeWMujgvUAFaIwohCLDRiujYgf4BEhIJ8pTVdD0FP0ARgSOBBptbXkAYl8QD`.replace(/\s/g, ""),
                radius: "389.6329066623545",
                geo: "31.020469,121.431337"
            },
            "下院": {
                handle: `CAESsAIIl8QDEJrTiujYgf4BGhIJ7rPKTGkFP0ARdxGmKJdbXkAiegoG
            5Lit5Zu9EgJDTjIJ5LiK5rW35biCQgnpl7XooYzljLpSKuS4nOW3nei3rzgwMOS4iua1t+S6
            pOmAmuWkp+WtpumXteihjOagoeWMumIq5Lic5bed6LevODAw5LiK5rW35Lqk6YCa5aSn5a2m
            6Ze16KGM5qCh5Yy6KiTkuIrmtbfkuqTpgJrlpKflrabpl7XooYzmoKHljLrkuIvpmaIyQuS4
            reWbveS4iua1t+W4gumXteihjOWMuuS4nOW3nei3rzgwMOS4iua1t+S6pOmAmuWkp+WtpumX
            teihjOagoeWMujgvUAFaIwohCJrTiujYgf4BEhIJ7rPKTGkFP0ARdxGmKJdbXkAYl8QD`.replace(/\s/g, ""),
                radius: "371.4202884635783",
                geo: "31.021138,121.431101"
            },
            "陈瑞球楼": {
                handle: `CAEStgIIl8QDEOCelMTnpP4BGhIJ6e3PRUMGP0ARjnVxGw1cXkAiegoG5Lit5Zu9E
            gJDTjIJ5LiK5rW35biCQgnpl7XooYzljLpSKuS4iua1t+S6pOmAmuWkp+WtpumXteihjOago
            eWMuumZiOeRnueQg+alvGIq5LiK5rW35Lqk6YCa5aSn5a2m6Ze16KGM5qCh5Yy66ZmI55Ge5
            5CD5qW8KirkuIrmtbfkuqTpgJrlpKflrabpl7XooYzmoKHljLrpmYjnkZ7nkIPmpbwyQuS4r
            eWbveS4iua1t+W4gumXteihjOWMuuS4iua1t+S6pOmAmuWkp+WtpumXteihjOagoeWMuumZi
            OeRnueQg+alvDgvUAFaIwohCOCelMTnpP4BEhIJ6e3PRUMGP0ARjnVxGw1cXkAYl8QD`.replace(/\s/g, ""),
                radius: "371.4202884635783",
                geo: "31.021138,121.431101"
            },

        };

        function FormatXAppleStructuredLocation(building, room) {
            function fxa(str, len) {
                const size = Math.ceil(str.length / len);
                const r = Array(size);
                let offset = 0;

                for (let i = 0; i < size; i++) {
                    r[i] = str.substr(offset, len);
                    offset += len;
                }

                return r;
            }

            var t;
            if (building in geolocation) {
                t = `-APPLE-STRUCTURED-LOCATION;VALUE=URI;X-ADDRESS="闵行校区${building}";
                X-APPLE-MAPKIT-HANDLE=${geolocation[building].handle};X-APPLE-RADIUS=${geolocation[building].radius};
                X-APPLE-REFERENCEFRAME=2;X-TITLE="${room}":geo:${geolocation[building].geo}`.replace(/\s/g, "");
            } else {
                // default to 陈瑞球楼
                t = `-APPLE-STRUCTURED-LOCATION;VALUE=URI;X-ADDRESS="闵行校区${building}";
                X-APPLE-MAPKIT-HANDLE=${geolocation["陈瑞球楼"].handle};X-APPLE-RADIUS=${geolocation["陈瑞球楼"].radius};
                X-APPLE-REFERENCEFRAME=2;X-TITLE="${room}":geo:${geolocation["陈瑞球楼"].geo}`.replace(/\s/g, "");
            }

            // icloud exported calendar have them.
            var chunk = fxa(t, 72);
            chunk[0] = "X" + chunk[0];
            for (var i = 1; i < chunk.length; i++) {
                chunk[i] = " " + chunk[i];
            }

            return chunk.join(SEPARATOR);
        }

        function FormatGEO(building, room) {
            var geo;
            if (building in geolocation) {
                geo = geolocation[building].geo.split(",")
            } else {
                geo = geolocation["陈瑞球楼"].geo.split(",")
            }
            return `GEO:${geo[0]};${geo[1]}`
        }

        return {
            'addPeriods': function (subject, description, building, room, location, start_date, period_list, ios) {
                // Utilize RDATE periods. Best option if your calendar supports this.
                // Note: Apple calendar cannot understand RDATE.

                if (ios) {
                    console.error("iOS calendar does not support RDATE");
                    return;
                }

                const start = GetTimeDate(new Date(start_date.getTime() + period_list[0].start));
                const end = GetTimeDate(new Date(start_date.getTime() + period_list[0].end));

                var period_strings = [];
                for (const period of period_list) {
                    const start_time = GetTimeDate(new Date(start_date.getTime() + period.start));
                    const end_time = GetTimeDate(new Date(start_date.getTime() + period.end));

                    period_strings.push(`${start_time}/${end_time}`);
                }

                const RDATE_PERIOD = period_strings.join(",");

                var calendarEvent = [
                    'BEGIN:VEVENT',
                    'UID:' + calendarEvents.length + "@" + uidDomain,
                    'CLASS:PUBLIC',
                    'DESCRIPTION:' + description,
                    'DTSTAMP;VALUE=DATE-TIME:' + now,
                    'DTSTART;VALUE=DATE-TIME:' + start,
                    'DTEND;VALUE=DATE-TIME:' + end,
                    'LOCATION:' + location,
                    FormatGEO(building, room),
                    "RDATE;VALUE=PERIOD:" + RDATE_PERIOD,
                    'SUMMARY;LANGUAGE=zh-CN:' + subject,
                    'TRANSP:OPAQUE',
                    'END:VEVENT'
                ];

                calendarEvent = calendarEvent.join(SEPARATOR);

                calendarEvents.push(calendarEvent);
                return;
            },

            'addSingle': function (subject, description, building, room, location, start_date, period, ios) {
                // Compatible option

                const start = GetTimeDate(new Date(start_date.getTime() + period.start));
                const end = GetTimeDate(new Date(start_date.getTime() + period.end));

                var calendarEvent = [
                    'BEGIN:VEVENT',
                    'UID:' + calendarEvents.length + "@" + uidDomain,
                    'CLASS:PUBLIC',
                    'DESCRIPTION:' + description,
                    'DTSTAMP;VALUE=DATE-TIME:' + now,
                    'DTSTART;VALUE=DATE-TIME:' + start,
                    'DTEND;VALUE=DATE-TIME:' + end,
                    'LOCATION:' + location + (ios ? SEPARATOR + FormatXAppleStructuredLocation(building, room) : SEPARATOR + FormatGEO(building, room)),
                    'SUMMARY;LANGUAGE=zh-CN:' + subject,
                    'TRANSP:OPAQUE',
                    'END:VEVENT'
                ];

                calendarEvent = calendarEvent.join(SEPARATOR);

                calendarEvents.push(calendarEvent);
                return calendarEvent;
            },

            'download': function (filename) {
                if (calendarEvents.length < 1) {
                    return;
                }

                var calendar = calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd;

                var blob = new Blob([calendar]);
                saveAs(blob, filename + ".ics");
                // clear after saving
                calendarEvents = [];
            },
        };
    }(`SJTUGraduateiCalendar ${GM_info.script.version}`, `SGics${GM_info.script.version}`);

    // -------------------------------ICS.js end-----------------------------------


    function ParseWeek(week_notation) {
        var weeks = [];
        for (var i = 0; i < week_notation.length; i++) {
            weeks.push(week_notation.charAt(i) == "1");
        }

        return weeks;
    }

    async function GetStartDay(semester) {
        // get the start date from sjtu plus
        const sjtu_plus_url = "https://plus.sjtu.edu.cn/course-plus-data/lessonData_index.json";
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: sjtu_plus_url,
                headers: { "Content-Type": "application/application/json" },
                onload: function (req) {
                    var result = new Date(0);
                    if (req.status != 200) {
                        console.log(req.status);
                        return new Date(0);
                    }
                    const data = JSON.parse(req.responseText);
                    const semester_start_month = parseInt(semester) % 100;
                    var semester_year = ((parseInt(semester) - semester_start_month) / 100) | 0;
                    var year_json, semester_json;
                    switch (semester_start_month) {
                        case 8:
                        case 9:
                        case 10:
                            year_json = semester_year.toString() + "-" + (semester_year + 1).toString();
                            semester_json = 1;
                            break;
                        case 1:
                        case 2:
                        case 3:
                            year_json = (semester_year - 1).toString() + "-" + semester_year.toString();
                            semester_json = 2;
                            break;
                        case 5:
                        case 6:
                        case 7:
                            year_json = (semester_year - 1).toString() + "-" + semester_year.toString();
                            semester_json = 3;
                            break;
                        default:
                            console.log(`Error finding semester: how can a semester starts in ${semester_start_month}?`);
                            result = new Date(0);
                    }

                    for (const item of data) {
                        if (item.year == year_json && item.semester == semester_json) {
                            if ("first_day" in item) {
                                result = new Date(Date.parse(item.first_day + " 00:00:00 GMT+0800"));
                                resolve(result);
                                return;
                            } else {
                                console.log("Error finding semester: first_day not defined by SJTU-plus, maybe too old or too new?");
                                result = new Date(0);
                                resolve(result);
                                return;
                            }
                        }
                    }

                    console.log("Error finding semester: semester not defined by SJTU-plus, maybe too old or too new?");
                    result = new Date(0);

                    resolve(result);
                }
            });
        });

    }

    function ExpandSchedInfoAndCombine(schedinfo, start_date) {
        var full_timetable = [];
        for (const sched of schedinfo) {
            for (var week = 0; week < sched.weeks.length; week++) {
                if (sched.weeks[week]) {
                    const si = {
                        week: week,
                        day: sched.weekday,
                        start: sched.timeslot,
                        end: sched.timeslot + 1,
                        building: sched.building,
                        room: sched.room,
                        // Content shown at iCalendar
                        locatable_loc: `${sched.room}\\n闵行校区${sched.building}`,

                        // Unique location stored in course scheduling system
                        _location_cmp: sched._location_cmp,
                        // Days after Day 0 (1st week's monday)
                        _daydelta: week * 7 + sched.weekday,
                        // Comparable value to check whether two time slot are continuous
                        _tsstart: (week * 7 + sched.weekday) * 24 + sched.timeslot,
                        _tsend: (week * 7 + sched.weekday) * 24 + sched.timeslot + 1,
                    };

                    full_timetable.push(si);
                }
            }
        }

        // Sort the table, make sure continuous slot finds themselves

        function cont(si1, si2) {
            return si1._tsstart - si2._tsstart;
        }

        full_timetable.sort(cont);

        //condensed timetable groups continuous slot together

        var condensed_timetable = [];
        var current;
        for (const si of full_timetable) {
            if (current != undefined && current._tsend == si._tsstart && current._location_cmp == si._location_cmp) {
                current._tsend = si._tsend;
                current.end = si.end;
            } else {
                if (current != undefined) {
                    condensed_timetable.push(current);
                }

                current = si;
            }
        }
        if (current != undefined) {
            condensed_timetable.push(current);
        }

        // vevent dict groups them by location
        var vevent_dict = {};
        for (const si of condensed_timetable) {
            if (!(si._location_cmp in vevent_dict)) {
                vevent_dict[si._location_cmp] = {
                    locatable_loc: si.locatable_loc,
                    building: si.building,
                    room: si.room,
                    timeslots: []
                };
            }
            const absolute_days = si.week * 7 + si.day;
            const timeslot = GetHM(si.start, si.end);

            vevent_dict[si._location_cmp].timeslots.push({
                start: absolute_days * 24 * 60 * 60 * 1000 + timeslot.start * 60 * 1000,
                end: absolute_days * 24 * 60 * 60 * 1000 + timeslot.end * 60 * 1000
            });
        }

        var vevent_list = [];
        for (const key in vevent_dict) {
            vevent_list.push(vevent_dict[key]);
        }

        return vevent_list;
    }

    const timeStart = [
        '08:00',
        '08:55',
        '10:00',
        '10:55',
        '12:00',
        '12:55',
        '14:00',
        '14:55',
        '16:00',
        '16:55',
        '18:00',
        '18:55',
        '19:41',
        '20:25',
        "21:15"
    ];


    const timeEnd = [
        '08:45',
        "09:40",
        "10:45",
        "11:40",
        "12:45",
        "13:40",
        "14:45",
        "15:40",
        "16:45",
        "17:40",
        "18:45",
        "19:40",
        "20:20",
        "21:10",
        "22:00"
    ];


    function GetHM(start, end) {
        var start_info = timeStart[start - 1].split(":");
        var start_m = parseInt(start_info[0]) * 60 + parseInt(start_info[1]);

        var end_info = timeEnd[end - 2].split(":");
        var end_m = parseInt(end_info[0]) * 60 + parseInt(end_info[1]);

        return {
            start: start_m,
            end: end_m,
        };
    }

    async function GetCourseInfo() {
        // Dirty thingy, use their JS to do
        var course_info = {};
        const bld_regex = /[-0-9]*$/i;
        const semester = $('#myXnxqSelect').val();
        return new Promise((resolve, reject) => {
            requirejs(["/gsapp/sys/wdkbapp/*default/modules/xskcb/xskcbBS.js"], function (bs) {
                bs.getXspkjgList(semester, "").done(function (pkjgList) {
                    //console.log(pkjgList);
                    for (const course_raw of pkjgList) {
                        //console.log(course_raw);
                        if (course_raw["XNXQDM"] != semester) {
                            console.info("Received erranous value", course_raw["XNXQDM"], semester);
                            continue;
                        }

                        const schedinfo = {
                            weeks: ParseWeek(course_raw["ZCBH"]),
                            weekday: course_raw["XQ"] - 1,
                            timeslot: course_raw["JSJCDM"],
                            building: course_raw["JASMC"].replace(bld_regex, ""),
                            room: course_raw["JASMC"],
                            _location_cmp: course_raw["JASDM"],
                        };

                        if (!(course_raw["BJDM"] in course_info)) {
                            course_info[course_raw["BJDM"]] = {
                                name: course_raw["KCMC"],
                                course_code: course_raw["KCDM"],
                                class_code: course_raw["BJMC"],
                                teacher: course_raw["JSXM"],
                                scheds: []
                            };
                        }

                        course_info[course_raw["BJDM"]]["scheds"].push(schedinfo);

                    }

                    for (let idx in course_info) {
                        let ci = course_info[idx];
                        let newscheds = ExpandSchedInfoAndCombine(ci.scheds);
                        ci.scheds = newscheds;
                    }
                    resolve(course_info);
                });
            });
        });
    }

    function RDATE_method(info, start_date, ios) {
        for (const key in info) {
            const course = info[key];
            for (const sched of course.scheds) {
                ics.addPeriods(course.name, `${course.course_code} ${course.name}\\n教师：${course.teacher}\\n班级号：${course.class_code}`, sched.building, sched.room, sched.locatable_loc, start_date, sched.timeslots, ios);
            }
        }
    }

    function SINGLE_method(info, start_date, ios) {
        for (const key in info) {
            const course = info[key];
            for (const sched of course.scheds) {
                for (const time of sched.timeslots) {
                    ics.addSingle(course.name, `${course.course_code} ${course.name}\\n教师：${course.teacher}\\n班级号：${course.class_code}`, sched.building, sched.room, sched.locatable_loc, start_date, time, ios);
                }

            }
        }
    }

    async function GenerateIOS() {
        // This function generates calendar
        const info = await GetCourseInfo();
        const semester = $('#myXnxqSelect').val();
        const start_date = await GetStartDay(semester);
        SINGLE_method(info, start_date, true);
        ics.download("iOS");
    }

    async function GenerateNormal() {
        // This function generates calendar
        const info = await GetCourseInfo();
        const semester = $('#myXnxqSelect').val();
        const start_date = await GetStartDay(semester);
        SINGLE_method(info, start_date, false);
        ics.download("Normal");
    }

    async function GenerateRDATE() {
        // This function generates calendar
        const info = await GetCourseInfo();
        const semester = $('#myXnxqSelect').val();
        const start_date = await GetStartDay(semester);
        RDATE_method(info, start_date, false);
        ics.download("RDATE");
    }

    function delayedRegistration() {
        $(`<a href="javascript:void(0);" class="bh-btn bh-btn-default" id="genios" title="iOS日历，含苹果特定地图信息。每次课均作为单独事件。">导出含iOS位置日历
           </a>
           <a href="javascript:void(0);" class="bh-btn bh-btn-default" id="gennormal" title="常规日历，含GPS信息。每次课均作为单独事件。">导出常规日历
           </a>
           <a href="javascript:void(0);" class="bh-btn bh-btn-default" id="genrdate" title="日历条目设置为重复项，支持关联批量编辑，含GPS信息。大多数日历程序无法正确解析RDATE，请测试后使用。">导出RDATE日历
           </a>`).insertAfter($("#xsXx").children().find("a"));
        $("#genios").click(GenerateIOS);
        $("#gennormal").click(GenerateNormal);
        $("#genrdate").click(GenerateRDATE);
    }

    let retries = 50;

    const intervalID = setInterval(_ => {
        // TODO: Try to check if the label is loaded, not very effective
        const match = ($("#myXnxqSelect").length != 0);
        if (match != 0) {
            delayedRegistration();
        }
        retries--;
        if (retries == 0 || (match != 0)) clearInterval(intervalID);
    }, 100);

})();