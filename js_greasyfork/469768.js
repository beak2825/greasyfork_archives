// ==UserScript==
// @name         杭师大新版教务系统导出课表
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将杭师大新版教务系统中的课表导出为 ICS 格式方便导入日历中。
// @author       Juskinbo
// @supportURL   https://github.com/Juskinbo/HZNU2ICS
// @include      *://jwxt.hznu.edu.cn/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469768/%E6%9D%AD%E5%B8%88%E5%A4%A7%E6%96%B0%E7%89%88%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%AF%BC%E5%87%BA%E8%AF%BE%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/469768/%E6%9D%AD%E5%B8%88%E5%A4%A7%E6%96%B0%E7%89%88%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%AF%BC%E5%87%BA%E8%AF%BE%E8%A1%A8.meta.js
// ==/UserScript==

// 网站后缀
var ClassScheduleURL = "kbcx/xskbcx_cxXskbcxIndex.html"; // 学生课表查询页面
var ExamScheduleURL = "kwgl/kscx_cxXsksxxIndex.html"; // 考试信息查询页面
var StudentEvalutionURL = "xspjgl/xspj_cxXspjIndex.html"; // 学生评教页面

var setTimeout_ = 4000; // 设置脚本实际运行的开始时间，网络不好建议时间稍长，1000等于1s
(function () {
  "use strict";
  unsafeWindow.addEventListener("load", main); // 等待页面加载完成后运行
})();

function main() {
  var windowURL = window.location.href; // 获取当前页面的URL
  if (windowURL.indexOf(ClassScheduleURL) != -1) {
    // 如果当前页面的URL中包含课表查询页面的URL
    ClassSchedule2ICS();
  } else if (windowURL.indexOf(ExamScheduleURL) != -1) {
    // 如果当前页面的URL中包含考试信息查询页面的URL
    ExamSchedule2ICS();
  } else if (windowURL.indexOf(StudentEvalutionURL) != -1) {
    // StudentEvalution();
    // unsafeWindow.addEventListener("load", StudentEvalution);
    document.getElementById("btn_yd").onclick = function () {
      window.setTimeout(StudentEvalution, setTimeout_);
    };
  }
}

// 导出考试信息
function ExamSchedule2ICS() {
  console.log("ExamSchedule2ICS");
  pageLoaded();
  function pageLoaded() {
    let div = document.getElementById("but_ancd");
    let btn = document.createElement("button");
    btn.className = "btn btn-default btn-dc";
    btn.id = "exportbtn";
    btn.innerText = "导出 ICS 文件";
    div.appendChild(btn);
    btn.onclick = function () {
      generateCalendar();
      alert("已自动下载 ICS 文件");
    };
  }
  function generateCalendar() {
    let table = document.getElementById("tabGrid");
    // 课程
    // 考试时间
    // 考试地点
    // 考试校区
    // 考试座号
    class EXAM {
      constructor(e) {
        if (e) {
          this.course = e.course; // 课程名
          this.timeS = e.timeS; // 考试开始时间
          this.timeE = e.timeE; // 考试结束时间
          this.location = e.location; // 考试地点组成： 考试地点、考试校区、座位号
        }
      }
    }
    let exams = new Array();
    table.querySelectorAll("tr").forEach((tr) => {
      let exam = new EXAM();
      tr.querySelectorAll("td").forEach((td) => {
        let attr = td.getAttribute("aria-describedby");
        if (attr == "tabGrid_kcmc") {
          // 课程
          exam.course = td.innerText;
        } else if (attr == "tabGrid_kssj") {
          // 考试时间
          let time = td.innerText;
          let date =
            "" +
            time[0] +
            time[1] +
            time[2] +
            time[3] +
            time[5] +
            time[6] +
            time[8] +
            time[9] +
            "T";
          exam.timeS = date + time[11] + time[12] + time[14] + time[15] + "00";
          exam.timeE = date + time[17] + time[18] + time[20] + time[21] + "00";
        } else if (attr == "tabGrid_cdmc") {
          // 考试地点
          exam.location = td.innerText;
        } else if (attr == "tabGrid_cdxqmc") {
          // 考试校区
          exam.location = td.innerText + exam.location;
        } else if (attr == "tabGrid_zwh") {
          // 考试座号
          exam.location += " 座位号" + td.innerText;
        }
      });
      exams.push(exam);
    });
    let ics = new ICS();
    exams.forEach((ex) => {
      let e = new ICSEvent(
        "" + ex.timeS,
        "" + ex.timeE,
        "" + ex.course + " " + ex.location
      );
      ics.pushEvent(e);
    });
    ics.pushCalendarEnd();
    ics.exportIcs();
  }
}

var CRLF = "\n";
var SPACE = " ";

class ICS {
  Calendar; // 日历参数
  ics; // ics格式的日历
  res; // 最后格式化的结果
  constructor() {
    (function (Calendar) {
      Calendar.PRODID = "-//Juskinbo//ICalendar Exporter v1.0//CN";
      Calendar.VERSION = "2.0";
      Calendar.CALSCALE = "GREGORIAN"; // 历法，默认是公历
      Calendar.TIMEZONE = "Asia/Shanghai"; // 时区，默认是上海
      Calendar.ISVALARM = true; // 提醒，默认是开启
      Calendar.VALARM = "-P0DT0H30M0S"; // 提醒，默认半小时
      Calendar.WKST = "SU"; // 一周开始，默认是周日
    })(this.Calendar || (this.Calendar = {}));
    this.ics = new Array();
    this.ics.push("BEGIN:VCALENDAR");
    this.ics.push("VERSION:" + this.Calendar.VERSION);
    this.ics.push("PRODID:" + this.Calendar.PRODID);
    this.ics.push("CALSCALE:" + this.Calendar.CALSCALE);
  }
  // 添加事件
  pushEvent(e) {
    this.ics.push("BEGIN:VEVENT");
    this.ics.push(e.getDTSTART());
    this.ics.push(e.getDTEND());
    if (e.isrrule == true) this.ics.push(e.getRRULE());
    this.ics.push(e.getSUMMARY());
    if (this.Calendar.ISVALARM == true) this.pushAlarm();
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
  // 结束日历
  pushCalendarEnd() {
    this.ics.push("END:VCALENDAR");
  }
  // 格式化ics文件
  getFixedIcs() {
    this.res = "";
    this.ics.forEach((line) => {
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
  // 导出ics文件并下载
  exportIcs() {
    this.getFixedIcs();
    // 使用a标签模拟下载，blob实现流文件的下载链接转化
    let link = window.URL.createObjectURL(
      new Blob([this.res], {
        type: "text/x-vCalendar",
      })
    );
    let a = document.createElement("a");
    a.setAttribute("href", link);
    a.setAttribute("download", "courses.ics");
    a.click();
  }
}

class ICSEvent {
  constructor(DTSTART, DTEND, SUMMARY) {
    this.DTSTART = DTSTART;
    this.DTEND = DTEND;
    this.SUMMARY = SUMMARY;
  }
  isrrule = false;
  RRULE;
  setRRULE(FREQ, WKST, COUNT, INTERVAL, BYDAY) {
    this.isrrule = true;
    this.RRULE =
      "RRULE:FREQ=" +
      FREQ +
      ";WKST=" +
      WKST +
      ";COUNT=" +
      COUNT +
      ";INTERVAL=" +
      INTERVAL +
      ";BYDAY=" +
      BYDAY;
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
}
