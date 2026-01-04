// ==UserScript==
// @name         武汉理工课表导出 
// @namespace    https://github.com/ooohy/course2calendar
// @version      0.5
// @description  从教务处导出课表为ics文件
// @author       榆 
// @match        http://sso.jwc.whut.edu.cn/Certification/toIndex.do
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450104/%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E8%AF%BE%E8%A1%A8%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/450104/%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E8%AF%BE%E8%A1%A8%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

// TODO:
//  模拟点击课表
//  提取所有课表文本
//  将文本整理放入Course类的数组中
//  将文本填入ics格式的文件中

/**/


(function() {
  'use strict';
  const base_day = new Date(2023, 1, 19, 0, 0, 0);
  const school_timetabel = [
    new Date(2022, 9, 1, 8, 0, 0),
    new Date(2022, 9, 1, 8, 50, 0),
    new Date(2022, 9, 1, 9, 55, 0),
    new Date(2022, 9, 1, 10, 45, 0),
    new Date(2022, 9, 1, 11, 35, 0),

    new Date(2022, 9, 1, 14, 0, 0),
    new Date(2022, 9, 1, 14, 50, 0),
    new Date(2022, 9, 1, 15, 40, 0),
    new Date(2022, 9, 1, 16, 45, 0),
    new Date(2022, 9, 1, 17, 35, 0),


    new Date(2022, 9, 1, 19, 0, 0),
    new Date(2022, 9, 1, 19, 50, 0),
    new Date(2022, 9, 1, 20, 50, 0),
  ]

  function get_course() {
    // 获取课表
    const tb = document.getElementById("xqkb").getElementsByClassName("table-box").item(0)
      .getElementsByTagName("table").item(0)
      .getElementsByClassName("table-class-even").item(0)
    return tb.getElementsByTagName("tr");
  }

  function text_splite(str) {
    // 拆分每个课程的字符串,转化为数组
    let str_splite = str.split("\n");
    let name = str_splite[0];
    let location = str_splite[2];
    let time = str_splite[4];

    let week_start = Number(/[0-9].*?[0-9]/.exec(time));
    let week_end_str = /-[0-9].*?[0-9]/.exec(time);
    let week_end = Number(/[0-9][0-9]/.exec(week_end_str));
    let period_str = /\([0-9]+-[0-9]+/.exec(time);
    let period_start = Number(/[0-9]+/.exec(period_str))
    let period_end_str = /-[0-9]+/.exec(period_str);
    let period_end = Number(/[0-9]+/.exec(period_end_str));

    return [name, location, week_start, week_end, period_start, period_end];
  }

  class Course {
    constructor(name, location, start, end) {
      this.name = name;
      this.location = location;
      this.start = start;
      this.end = end;
    }
  }

  function time_format(period_start, period_end, date, school_timetabel) {
    // 格式化时间
    let start_time = new Date(date.getFullYear(), date.getUTCMonth(), date.getUTCDate(),
      school_timetabel[period_start - 1].getHours(), school_timetabel[period_start - 1].getMinutes());
    let end_time = new Date(date.getFullYear(), date.getUTCMonth(), date.getUTCDate(),
      school_timetabel[period_end - 1].getHours(),
      school_timetabel[period_end - 1].getMinutes() + 45);
    return [start_time, end_time];
  }

  function generate_course_list() {
    // 生成课程列表

    // 获取课程信息
    const course_html = get_course();
    let course_info_list = [];

    // 拆分课表信息，并记录星期信息
    for (let period = 0; period < 5; period++) {
      for (let day = 0; day < 7; day++) {
        try {
          let course_html_list = [];
          if (period === 0 || period === 2 || period === 4) {
            course_html_list = course_html.item(period).getElementsByTagName("td").item(2 + day).getElementsByTagName("div");
          }
          else {
            course_html_list = course_html.item(period).getElementsByTagName("td").item(1 + day).getElementsByTagName("div");
          }


          for (let course_num = 0; course_num < course_html_list.length; course_num++) {
            let course_text = course_html_list[course_num].innerText;
            // course_info [name, location, week_start, week_end, period_start, period_end, day] 
            let course_info = text_splite(course_text);
            course_info.push(day + 1);
            console.log(course_info);
            course_info_list.push(course_info);
          }
        }
        catch (e) {
          console.log('no course');
        }
      }
    }

    let course_list = [];
    for (let i = 0; i < course_info_list.length; i++) {
      const course_info = course_info_list[i];
      for (let j = course_info[2]; j <= course_info[3]; j++) {
        let date = new Date(base_day.getFullYear(), base_day.getUTCMonth(), base_day.getUTCDate() + 7 * (j - 1) + course_info[6] + 2);
        let time_format_list = time_format(course_info[4], course_info[5], date, school_timetabel);
        let start_time = time_format_list[0];
        let end_time = time_format_list[1];
        let course = new Course(course_info[0], course_info[1], start_time, end_time);
        course_list.push(course);
      }
    }
    return course_list;
  }

  function ics_time_format(date) {
    // icalendar时间格式转换
    let y = date.getFullYear();
    let m = date.getUTCMonth() + 1;
    let d = date.getUTCDate();
    let hour = date.getHours();
    let minute = date.getMinutes();

    let time_string = '' + y + (m < 10 ? '0' + m : m) + (d < 10 ? '0' + d : d) + 'T' + (hour < 10 ? '0' + hour : hour) + (minute < 10 ? '0' + minute + '00' : minute + '00');
    console.log(y, m, d, hour, minute, time_string);
    // console.log(y, m, d, hour, minute);
    return time_string;
  }


  const CRLF = "\n";
  const SPACE = " ";
  class ICS {
    // https://github.com/31415926535x/CollegeProjectBackup/blob/master/ZhengfangClassScheduleToICS/Readme.md

    Calendar;       // 日历参数
    ics;            // ics格式的日历，
    res;            // 最后格式化的结果

    constructor() {

      // 日历的一些主要参数，如PRODID、VERSION、CALSCALE、是否提醒以及提醒的时间
      (function(Calendar) {
        Calendar.PRODID = "-//31415926535x//ICalendar Exporter v1.0//CN";
        Calendar.VERSION = "2.0";
        Calendar.CALSCALE = "GREGORIAN";        // 历法，默认是公历
        Calendar.TIMEZONE = "Asia/Shanghai"     // 时区，默认是上海
        Calendar.ISVALARM = false;               // 提醒，默认是关闭

      })(this.Calendar || (this.Calendar = {}));

      this.ics = [];
      this.ics.push("BEGIN:VCALENDAR");
      this.ics.push("X-WR-CALNAME:课表");
      this.ics.push("VERSION:" + this.Calendar.VERSION);
      this.ics.push("PRODID:" + this.Calendar.PRODID);
      this.ics.push("CALSCALE:" + this.Calendar.CALSCALE);
      this.ics.push("X-WR-TIMEZONE:" + this.Calendar.TIMEZONE);
    }

    // 添加事件
    pushEvent(e) {
      this.ics.push("BEGIN:VEVENT");
      this.ics.push(e.getDTSTART());
      this.ics.push(e.getDTEND());
      if (e.isrrule === true) this.ics.push(e.getRRULE());
      this.ics.push(e.getSUMMARY());
      this.ics.push(e.getLOCATION());
      if (this.Calendar.ISVALARM === true) this.pushAlarm();
      this.ics.push("END:VEVENT");
      this.ics.push(CRLF);
    }

    // 添加提醒
    pushAlarm() {
      this.ics.push("BEGIN:VALARM");
      this.ics.push("ACTION:DISPLAY");
      this.ics.push("DESCRIPTION:This is an event reminder");
      this.ics.push("TRIGGER:" + this.Calendar.VALARM);
      this.ics.push("END:VALARM");
    }

    // 添加日历末
    pushCalendarEnd() {
      this.ics.push("END:VCALENDAR");
    }

    // 对ics进行格式的处理，每行不超过75个字节，换行用CRLF，对于超出的进行换行，下一行行首用空格
    getFixedIcs() {
      this.res = "";
      this.ics.forEach(line => {
        if (line.length > 60) {
          let len = line.length;
          let index = 0;
          while (len > 0) {
            for (let i = 0; i < index; ++i) {
              this.res += SPACE;
            }
            this.res += line.slice(0, 60) + CRLF;
            line = line.slice(61);
            len -= 60;
            ++index;
          }
          line = line.slice(0, 60);
        }
        this.res += line + CRLF;
      });
      return this.res;
    }


    // 导出ics
    exportIcs() {
      this.getFixedIcs();
      // 使用a标签模拟下载，blob实现流文件的下载链接转化
      let link = window.URL.createObjectURL(new Blob([this.res], {
        type: "text/x-vCalendar"
      }));
      let a = document.createElement("a");
      a.setAttribute("href", link);
      a.setAttribute("download", "courses.ics");
      a.click();  // 模拟下载
    }


  }

  class ICSEvent
  // https://github.com/31415926535x/CollegeProjectBackup/blob/master/ZhengfangClassScheduleToICS/Readme.md

  {
    constructor(DTSTART, DTEND, SUMMARY, LOCATION) {
      this.DTSTART = DTSTART;
      this.DTEND = DTEND;
      this.SUMMARY = SUMMARY;
      this.LOCATION = LOCATION;
    }
    isrrule = false;
    RRULE;
    setRRULE(FREQ, WKST, COUNT, INTERVAL, BYDAY) {
      this.isrrule = true;
      this.RRULE = "RRULE:FREQ=" + FREQ + ";WKST=" + WKST + ";COUNT=" + COUNT + ";INTERVAL=" + INTERVAL + ";BYDAY=" + BYDAY;
    }
    getRRULE() {
      return "" + this.RRULE;
    }
    getDTSTART() {
      return "DTSTART:" + this.DTSTART;
    }
    getDTEND() {
      return "DTEND:" + this.DTEND;
    }
    getSUMMARY() {
      return "SUMMARY:" + this.SUMMARY;
    }
    getLOCATION() {
      return "LOCATION:" + this.LOCATION;
    }
  }

  function main() {
    // add button
    var btn_area = document.querySelector(".table-p");
    var btn = document.createElement("button");
    btn.id = "btn_export";
    btn.textContent = "导出课表";
    btn.onclick = function() {
      //点击学期课表
      console.log("click");
      document.querySelector("button").click()

      //
      const course_list = generate_course_list();
      let res = new ICS();

      for (let i = 0; i < course_list.length; i++) {
        let e = new ICSEvent(ics_time_format(course_list[i].start), ics_time_format(course_list[i].end), course_list[i].name, course_list[i].location);
        res.pushEvent(e);
      }
      res.pushCalendarEnd();
      res.exportIcs();
    }
    btn_area.appendChild(btn);
  }

  main();

})();

