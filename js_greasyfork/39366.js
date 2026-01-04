// ==UserScript==
// @name         重庆理工大学课程表导出
// @namespace    https://github.com/crazymousethief
// @version      0.0.2
// @description  导出重庆理工大学课程表
// @author       crazymousethief
// @match        *://jwxt.i.cqut.edu.cn/*/xs_main.aspx*
// @connect      cale.dc.cqut.edu.cn
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/39366/%E9%87%8D%E5%BA%86%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E8%A1%A8%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/39366/%E9%87%8D%E5%BA%86%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E8%A1%A8%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
  "use strict";
  class ClassTable {
    constructor(lessones, opts) {
      this.lessones = lessones;
      this.opts = {
        CALNAME: "课程表",
        CALDESC: "重庆理工大学",
        COLOR: "#63DA48",
        TIMEZONE: "Asia/Shanghai",
        TRIGGER: "-PT45M",
        BEGINTIME: new Date("2018-01-01"),
        TIMETABLE: [
          ["0820", "0905"],
          ["0915", "1000"],
          ["1020", "1105"],
          ["1115", "1200"],
          ["1400", "1445"],
          ["1455", "1540"],
          ["1600", "1645"],
          ["1655", "1740"],
          ["1900", "1945"],
          ["1955", "2035"]
        ]
      };
      this.opts = Object.assign(this.opts, opts);
      this.opts.BEGINTIME = this.getCleanDate(this.opts.BEGINTIME);
      const { CALNAME, CALDESC, COLOR, TIMEZONE, TRIGGER } = this.opts;
      this.template = {
        head: `BEGIN:VCALENDAR
METHOD:PUBLISH
VERSION:2.0
X-WR-CALNAME:${CALNAME}
X-WR-CALDESC:${CALDESC}
PRODID:-//Apple Inc.//Mac OS X 10.11.6//EN
X-APPLE-CALENDAR-COLOR:${COLOR}
X-WR-TIMEZONE:${TIMEZONE}
CALSCALE:GREGORIA`,
        foot: "END:VCALENDAR"
      };
    }

    getCleanDate(d) {
      const date = new Date(d);
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      date.setDate(date.getDate() - date.getDay() + 1);
      return date;
    }

    getFormatDate(d) {
      const _ = num => (num + "").padStart(2, "0");
      return `${d.getFullYear()}${_(d.getMonth() + 1)}${_(d.getDate())}T${_(
        d.getHours()
      )}${_(d.getMinutes())}${_(d.getSeconds())}`;
    }

    timeToMS(t) {
      return (t.substring(0, 2) * 60 + parseInt(t.substring(2, 4))) * 1000 * 60;
    }

    export() {
      const {
        lessones,
        template,
        opts: { TIMEZONE, TRIGGER, BEGINTIME, TIMETABLE },
        getFormatDate,
        timeToMS
      } = this;
      const STAMP = getFormatDate(BEGINTIME) + "Z";
      let body = "";
      lessones.forEach(item => {
        const SUMMARY = item.name;
        const DTSTART = (d => {
          const date = new Date(d);
          date.setDate(
            date.getDate() + (item.startWeek - 1) * 7 + item.weekday
          );
          date.setTime(
            date.getTime() + timeToMS(TIMETABLE[item.startSection][0])
          );
          return getFormatDate(date);
        })(BEGINTIME);
        const DTEND = (d => {
          const date = new Date(d);
          date.setDate(
            date.getDate() + (item.startWeek - 1) * 7 + item.weekday
          );
          date.setTime(
            date.getTime() + timeToMS(TIMETABLE[item.endSection][1])
          );
          return getFormatDate(date);
        })(BEGINTIME);
        const INTERVAL = item.isDouble ? 2 : 1;
        const COUNT =
          (item.endWeek - item.startWeek) / (item.isDouble ? 2 : 1) + 1;
        const DESCRIPTION = `${item.name} ${item.teacher}`;
        const LOCATION = item.location;

        body += `
BEGIN:VEVENT
${SUMMARY}
DTSTAMP:${STAMP}
CREATED:${STAMP}
DTSTART;TZID=${TIMEZONE}:${DTSTART}
DTEND;TZID=${TIMEZONE}:${DTEND}
RRULE:FREQ=WEEKLY;INTERVAL=${INTERVAL};COUNT=${COUNT}
DESCRIPTION:${DESCRIPTION}
LOCATION:${LOCATION}
SUMMARY:${SUMMARY}
SEQUENCE:0
STATUS:CONFIRMED
TRANSP:OPAQUE
BEGIN:VALARM
TRIGGER:${TRIGGER}
DESCRIPTION:Event reminder
ACTION:DISPLAY
END:VALARM
END:VEVENT
`;
      });
      return template.head + body + template.foot;
    }
  }

  const getFirstWeekDate = new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: "http://cale.dc.cqut.edu.cn/Index.aspx",
      onload: function(response) {
        if (response.status >= 200 && response.status < 400) {
          const text = response.responseText;
          const yearP = /重庆理工大学(\d+)-(\d+)年度校历/g;
          const dateP = /注册时间(\d+)月(\d+)日/g;
          const yearMatch = yearP.exec(text);
          let termMatch = dateP.exec(text);
          let year = yearMatch[1];
          if (yearMatch[1] != new Date().getFullYear().toString()) {
            termMatch = dateP.exec(text);
            year = yearMatch[2];
          }

          resolve(new Date(`${year}-${termMatch[1]}-${termMatch[2]}`));
        } else {
          reject();
        }
      }
    });
  });
  const frame = document.getElementById("iframeautoheight");
  function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName("head")[0];
    if (!head) {
      return;
    }
    style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = css;
    head.appendChild(style);
  }
  addGlobalStyle(`
.bubbly-button {
font-family: 'Helvetica', 'Arial', sans-serif;
right:10px;
bottom: -30px;
position: fixed;
z-index: 999;
display: inline-block;
font-size: 1em;
padding: 1em 2em;
margin-top: 100px;
margin-bottom: 60px;
-webkit-appearance: none;
appearance: none;
background-color: #ff0081;
color: #fff;
border-radius: 4px;
border: none;
cursor: pointer;
position: relative;
transition: transform ease-in 0.1s, box-shadow ease-in 0.25s;
box-shadow: 0 2px 25px rgba(255, 0, 130, 0.5);
}
.bubbly-button:focus {
outline: 0;
}
.bubbly-button:before, .bubbly-button:after {
position: absolute;
content: '';
display: block;
width: 140%;
height: 100%;
left: -20%;
z-index: -1000;
transition: all ease-in-out 0.5s;
background-repeat: no-repeat;
}
.bubbly-button:before {
display: none;
top: -75%;
background-image: radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, transparent 20%, #ff0081 20%, transparent 30%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, transparent 10%, #ff0081 15%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%);
background-size: 10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%, 15% 15%, 10% 10%, 18% 18%;
}
.bubbly-button:after {
display: none;
bottom: -75%;
background-image: radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, transparent 10%, #ff0081 15%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%);
background-size: 15% 15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 10% 10%, 20% 20%;
}
.bubbly-button:active {
transform: scale(0.9);
background-color: #e60074;
box-shadow: 0 2px 25px rgba(255, 0, 130, 0.2);
}
.bubbly-button.animate:before {
display: block;
animation: topBubbles ease-in-out 0.75s forwards;
}
.bubbly-button.animate:after {
display: block;
animation: bottomBubbles ease-in-out 0.75s forwards;
}

@keyframes topBubbles {
0% {
  background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%, 40% 90%, 55% 90%, 70% 90%;
}
50% {
  background-position: 0% 80%, 0% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%, 50% 50%, 65% 20%, 90% 30%;
}
100% {
  background-position: 0% 70%, 0% 10%, 10% 30%, 20% -10%, 30% 20%, 22% 40%, 50% 40%, 65% 10%, 90% 20%;
  background-size: 0% 0%, 0% 0%,  0% 0%,  0% 0%,  0% 0%,  0% 0%;
}
}
@keyframes bottomBubbles {
0% {
  background-position: 10% -10%, 30% 10%, 55% -10%, 70% -10%, 85% -10%, 70% -10%, 70% 0%;
}
50% {
  background-position: 0% 80%, 20% 80%, 45% 60%, 60% 100%, 75% 70%, 95% 60%, 105% 0%;
}
100% {
  background-position: 0% 90%, 20% 90%, 45% 70%, 60% 110%, 75% 80%, 95% 70%, 110% 10%;
  background-size: 0% 0%, 0% 0%,  0% 0%,  0% 0%,  0% 0%,  0% 0%;
}
}
`);
  frame.onload = function() {
    const navText = document.getElementById("dqwz").textContent;
    if (navText == "学生个人课表") {
      const btn = document.createElement("div");
      const animateButton = function(e) {
        e.preventDefault();
        e.target.classList.remove("animate");
        e.target.classList.add("animate");
        setTimeout(function() {
          e.target.classList.remove("animate");
        }, 700);
      };
      const handleClick = function() {
        const lessones = [
          ...frame.contentWindow.document.querySelectorAll(
            `[rowspan="2"][align="Center"]`
          )
        ]
          .reduce((cur, item) => {
            const sectionNodes = item.parentElement.querySelectorAll("td");
            const match = /第(.*)节/g.exec(sectionNodes[0].textContent);
            const section = parseInt(
              match
                ? match[1]
                : /第(.*)节/g.exec(sectionNodes[1].textContent)[1]
            );
            const week = item.cellIndex - (match ? 0 : 1);
            item.className = "lesson";
            item.innerHTML
              .split("<br><br>")
              .forEach(item =>
                cur.push(`周${week}第${section}-${section + 1}节\n${item}`)
              );
            return cur;
          }, [])
          .map(item => item.replace(/<br>/g, "\n").replace(/ /g, "\n"))
          .map(item => {
            const pattern = /周(.*)第(.*)-(.*)节\n+(.*)\n+.*?\{第(\d*)\-(\d*)周\|*(.*?)\}\n+\d*\|?(.*?)\n+(.*)/g;
            const match = pattern.exec(item);
            return {
              weekday: parseInt(match[1]) - 1,
              startSection: parseInt(match[2]) - 1,
              endSection: parseInt(match[3]) - 1,
              name: match[4],
              startWeek: parseInt(match[5]),
              endWeek: parseInt(match[6]),
              isDouble: match[7] !== "",
              teacher: match[8],
              location: match[9]
            };
          });
        getFirstWeekDate.then(date => {
          const classTable = new ClassTable(lessones, {
            BEGINTIME: date
          });
          const aTag = frame.contentWindow.document.createElement("a");
          const blob = new Blob([classTable.export()]);
          aTag.download = "classTable.ics";
          aTag.href = URL.createObjectURL(blob);
          aTag.dispatchEvent(new MouseEvent("click"));
          URL.revokeObjectURL(blob);
        });
      };
      btn.textContent = "导出";
      btn.className = "bubbly-button";
      btn.style.position = "fixed";
      btn.addEventListener("click", animateButton, false);
      btn.addEventListener("click", handleClick, false);
      document.body.appendChild(btn);
    }
  };
})();
