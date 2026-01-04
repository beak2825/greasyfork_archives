// ==UserScript==
// @name         UESTC 研究生课表ics导出
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  一键导出课表的ics文件，方便各系统加入原生日历应用
// @author       ygowill
// @match        https://yjsjy.uestc.edu.cn/pyxx/pygl/xskbcx/index/*
// @require      https://cdn.jsdelivr.net/npm/ics-browser-gen@0.1.3/ics.deps.min.js
// @require      https://cdn.jsdelivr.net/npm/pikaday@1.8.2/pikaday.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440489/UESTC%20%E7%A0%94%E7%A9%B6%E7%94%9F%E8%AF%BE%E8%A1%A8ics%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/440489/UESTC%20%E7%A0%94%E7%A9%B6%E7%94%9F%E8%AF%BE%E8%A1%A8ics%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addStyle(stylePath) {
        var container = document.getElementsByTagName("head")[0];
        var addStyle = document.createElement("link");
        addStyle.rel = "stylesheet";
        addStyle.type = "text/css";
        addStyle.media = "screen";
        addStyle.href = stylePath;
        container.appendChild(addStyle);
    }
    addStyle('https://cdn.jsdelivr.net/npm/pikaday@1.8.2/css/pikaday.css');

    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    let start_monday_date = new Date("2022-02-21");
    let week_date_table = []; // 本学期所有日期，默认到20周结束

    let timeTable = [ // 硬编码时间表
        ["08:30", "09:15"], // startTime, endTime
        ["09:20", "10:05"],
        ["10:20", "11:05"],
        ["11:10", "11:55"],
        ["14:30", "15:15"],
        ["15:20", "16:05"],
        ["16:20", "17:05"],
        ["17:10", "17:55"],
        ["19:30", "20:15"],
        ["20:20", "21:05"],
        ["21:10", "21:55"],
        ["22:00", "22:45"]
    ];

    function generate_button() { // 按钮生成
        let tool_bar = document.getElementsByClassName("widget-toolbar")[0];
        let headline = document.querySelector('#main-container > div > div > div.page-content > div > div.widget-header.widget-header-large');
        let description = document.createElement("description");
        description.innerHTML = "<h5>请在右侧选择本学期第一周周一的日期后再下载ics文件</h5>";
        headline.appendChild(description);
        let return_button = document.querySelector("#main-container > div > div > div.page-content > div > div.widget-header.widget-header-large > div > button:nth-child(2)");
        let download_ics = document.createElement("button");
        let datepicker = document.createElement("datepicker");
        download_ics.type = "button";
        download_ics.style = "margin-top: 5px; margin-right: 5px;";
        download_ics.className = "btn btn-xs btn-return ";
        download_ics.innerHTML = "<i class=\"icon-hdd  align-top bigger-150\"></i>导出ics文件";
        download_ics.addEventListener("click", parse_table, false);
        tool_bar.insertBefore(download_ics, return_button);
        var picker = new Pikaday({
            onSelect: function (date) {
                start_monday_date = date;
                week_date_table = [];
                for (let i = 0; i < 20; i++) {
                    let week_arr = []
                    for (let j = 0; j < 7; j++) {
                        let tmp_date = new Date(start_monday_date);
                        tmp_date.setDate(tmp_date.getDate() + 7 * i + j);
                        week_arr.push(tmp_date);
                    }
                    week_date_table.push(week_arr);
                }
            }
        });
        tool_bar.insertBefore(picker.el, download_ics);
    }

    function parse_table() {
        let cal = ics();
        let table = document.querySelector("#tbl > tbody");
        let table_line_list = table.getElementsByTagName("tr");
        let week_map = new Map();
        for (let no = 1; no < 7; no++) { // no==0 为表头
            for (let day = 0; day < 7; day++) { // day==0 为节标号
                if (typeof (table_line_list[no]) == "undefined") {
                    continue;
                }
                let course_info = table_line_list[no].getElementsByTagName("td")[day + 1].innerText;
                if (course_info.trim() === "") {
                    continue;
                }
                let course_map = new Map();
                let course_list = course_info.split(/， /);
                for (let course of course_list) { // info example: "0808126007/大数据分析与挖掘(全英文)/40/2/邵俊明/1-10周/(1~2)/品学楼B107"
                    let c_list = course.split("/");
                    let list_len = c_list.length
                    let course_id = c_list[0].trim();
                    let week_str = c_list[list_len - 3];
                    week_str = week_str.substring(0, week_str.length - 1);
                    let time_str = c_list[list_len - 2];
                    time_str = time_str.substring(1, time_str.length - 1);
                    let start_week = parseInt(week_str.split("-")[0]);
                    let end_week = parseInt(week_str.split("-")[1]);
                    if (!course_map.has(course_id)) {
                        course_map.set(course_id, new Map());
                        course_map.get(course_id).set("course_id", course_id);
                        let course_name = [];
                        for (let i = 1; i < list_len - 6; i++) {
                            course_name.push(c_list[i]);
                        }
                        let course_name_full = course_name.join('/')
                        course_map.get(course_id).set("name", course_name_full.replace(/(\([\S\s]+\))/g, ''));
                        course_map.get(course_id).set("teacher", c_list[list_len - 4]);
                        course_map.get(course_id).set("start_time", timeTable[parseInt(time_str.split("~")[0]) - 1][0]);
                        course_map.get(course_id).set("end_time", timeTable[parseInt(time_str.split("~")[1]) - 1][1]);
                        course_map.get(course_id).set("location", c_list[list_len - 1]);
                        course_map.get(course_id).set("info", course_name_full.match(/(\([\S\s]+\))/g)[0].replaceAll(/[\(\)]/g, ''));
                    }

                    if (week_map.has(course_id)) {
                        week_map.get(course_id).set("min", Math.min(start_week, week_map.get(course_id).get("min")));
                        week_map.get(course_id).set("max", Math.max(end_week, week_map.get(course_id).get("max")));
                    } else {
                        week_map.set(course_id, new Map());
                        week_map.get(course_id).set("min", start_week);
                        week_map.get(course_id).set("max", end_week);
                    }
                }


                for (let course of course_map.values()) {
                    const start_week = parseInt(week_map.get(course.get("course_id")).get("min"));
                    const end_week = parseInt(week_map.get(course.get("course_id")).get("max"));

                    let description = `任课教师：${course.get("teacher")}\\n周：${start_week}-${end_week}\\n信息：${course.get("info")}`;
                    // 起止时间
                    let start_time = new Date(start_monday_date);
                    start_time.setDate(start_time.getDate() + (start_week - 1) * 7 + day);
                    start_time.setHours(course.get("start_time").split(":")[0]);
                    start_time.setMinutes(course.get("start_time").split(":")[1]);

                    let end_time = new Date(start_monday_date);
                    end_time.setDate(end_time.getDate() + (start_week - 1) * 7 + day);
                    end_time.setHours(course.get("end_time").split(":")[0]);
                    end_time.setMinutes(course.get("end_time").split(":")[1]);
                    let rrule = new Object()
                    rrule.freq = "WEEKLY"
                    rrule.count = end_week - start_week + 1
                    cal.addEvent(course.get("name"), description, course.get("location"), start_time.toUTCString(), end_time.toUTCString(), rrule);
                }
            }
        }
        cal.download();
    }

    generate_button();
})();
