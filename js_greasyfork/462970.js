// ==UserScript==
// @name         空教室表
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  用于获取东秦空教室表的js脚本
// @author       Juns
// @match        *://jwxt.neuq.edu.cn*
// @match        http://jwxt.neuq.edu.cn/eams/homeExt.action
// @match        https://jwxt.neuq.edu.cn/eams/homeExt.action
// @match        http://jwxt.neuq.edu.cn/eams/homeExt.action*
// @match        https://jwxt.neuq.edu.cn/eams/homeExt.action*
// @match        http://jwxt.neuq.edu.cn/eams/classroom/apply/free!search.action
// @match        https://jwxt.neuq.edu.cn/eams/classroom/apply/free!search.action
// @match        http://jwxt.neuq.edu.cn/eams/classroom/apply/free.action
// @match        https://jwxt.neuq.edu.cn/eams/classroom/apply/free.action
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neuq.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462970/%E7%A9%BA%E6%95%99%E5%AE%A4%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/462970/%E7%A9%BA%E6%95%99%E5%AE%A4%E8%A1%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 设置查询参数
  const options = [
    { start: 1, end: 2 },
    { start: 3, end: 4 },
    { start: 5, end: 6 },
    { start: 7, end: 8 },
    { start: 9, end: 10 },
    { start: 1, end: 8 },
  ];

  const weekNameArr = ["日", "一", "二", "三", "四", "五", "六"];

  const pageUrl = "https://jwxt.neuq.edu.cn/eams/classroom/apply/free.action";

  // 定义样式
  const boxStyles = {
    position: "absolute",
    bottom: "20px",
    right: "20px",
    display: "flex",
    gap: "10px",
  };

  const buttonStyles = {
    border: "none",
    borderRadius: "20px",
    background: "linear-gradient(32deg,#03a9f4,#f441a5,#ffeb3b,#03a9f4)",
    transition: "all 1.5s ease",
    fontWeight: "bold",
    letterSpacing: "0.05rem",
    padding: "0",
    cursor: "pointer",
    height: "40px",
  };

  const spanStyles = {
    padding: "15px 18px",
    fontSize: "17px",
    borderRadius: "20px",
    background: "#ffffff10",
    color: "#ffffff",
    transition: "0.4s ease-in-out",
    transitionProperty: "color",
    height: "100%",
    width: "100%",
  };

  const textStyles = {
    fontSize: "17px",
    borderRadius: "20px",
    background: "#f5f5f5",
    padding: "1.8rem",
    transition: "0.5s ease-out",
    overflow: "visible",
    position: "absolute",
    top: "20px",
    left: "20px",
    cursor: "pointer",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    backdropFilter: "blur(6px)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "rgba(142, 142, 142, 0.19) 0px 6px 15px 0px",
  };

  // 补零
  function pad(time) {
    return time < 10 ? `0${time}` : time;
  }

  // 时间戳转时间函数
  function timestampToTime(timestamp) {
    let date = new Date(timestamp);
    let Y = date.getFullYear() + "-";
    let M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) + "-";
    let D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
    let h =
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
    let m =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return Y + M + D + h + m;
  }

  function getToday() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const week = weekNameArr[date.getDay()];

    return { date: `${year}-${pad(month)}-${pad(day)}`, week };
  }

  function getTomorrow() {
    const timeStamp = Date.now();
    const tomorrow = new Date(timeStamp + 24 * 60 * 60 * 1000);
    const year = tomorrow.getFullYear();
    const month = tomorrow.getMonth() + 1;
    const day = tomorrow.getDate();
    const week = weekNameArr[tomorrow.getDay()];

    return { date: `${year}-${pad(month)}-${pad(day)}`, week };
  }

  // 设置选项
  // type: 0 今天, 1 明天
  function setOptions(type) {
    let trs = document.querySelector("#actionForm").querySelectorAll("tr");
    let sel = trs[2].querySelector("select");
    sel.value = "1"; // 设置教学楼为工学馆
    let tds = trs[4].querySelectorAll("td");
    let [startDate, endDate] = tds[1].querySelectorAll("input");
    startDate.value = type === 0 ? getToday().date : getTomorrow().date;
    endDate.value = type === 0 ? getToday().date : getTomorrow().date;
  }

  // 点击查询按钮
  function query() {
    let trs = document.querySelector("#actionForm").querySelectorAll("tr");
    let queryButton = trs[5].querySelector("input");
    queryButton.click();
  }

  // 替换的函数
  function formatData(str) {
    if (str != null && str != "") {
      let reg = /工[ ]*学[ ]*馆/;
      let reg2 = /具体安排以开课部门通知为准\s*/g;
      return str.replace(reg, "G").replace(reg2, "");
      //把工学馆三个字替换成G
    }
    return "";
  }

  // 根据rooms数组获得string
  function roomsToString(rooms) {
    let str = "";

    rooms.forEach((item, index) => {
      // 形式类似于104-1的直接省略了
      if (index < 1 || rooms[index][4] === "-") return;
      if (rooms[index][1] != rooms[index - 1][1]) str += "\n";
      str += rooms[index] + " ";
    });
    return str;
  }

  // 获取当前表格内的数据
  function getClassroomString() {
    const rows = document
      .querySelector("#grid15320024301_data")
      .querySelectorAll("td"); // 获取表格数据
    let rooms = []; //存储数据
    for (let i = 1; i < rows.length; i += 6) {
      rooms.push(formatData(rows[i].innerText));
    }

    // 升序排序并去空
    rooms = rooms.filter((item) => item !== "");
    rooms.sort();

    return roomsToString(rooms);
  }

  // 设置a-b小节
  function queryClassroom(a, b) {
    let [start, end] = document
      .querySelector("#roomApplyTimeTypeTd")
      .querySelectorAll("input"); // 获取dom
    start.value = a;
    end.value = b;
  }

  function delayMs(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // 获取标题
  // type 0 今天, 1 明天
  function getTitle(type) {
    const { date, week } = type === 0 ? getToday() : getTomorrow();
    const titleDate = date.replace(/-/g, ".");
    return `${titleDate} 周${week}`;
  }

  // 不在页面的话就跳转
  function jumpToPage() {
    if (window.location.href !== pageUrl) {
      window.location = pageUrl;
    }
  }

  // type 0 今天, 1 明天
  async function autoGetClassroomTable(type = 1) {
    jumpToPage();
    setOptions(type);
    let exportString = "";
    exportString += getTitle(type);
    exportString += "\n\n";
    for (let i = 0; i < options.length; i++) {
      const { start, end } = options[i];
      queryClassroom(start, end);
      query();
      await delayMs(1000);
      exportString += `${start}-${end}节：\n\n`;
      exportString += getClassroomString();
      exportString += "\n\n";
    }
    exportString += "\n\n ——不洗碗工作室";
    exportString += `\n\n 导出时间: ${timestampToTime(Date.now())}`;
    exportString += "\n\n code by Juns";
    console.log(exportString);
    showText(exportString);
  }

  // 添加button,以及样式
  function addButtons() {
    const todayButton = document.createElement("button");
    const tomorrowButton = document.createElement("button");

    const todaySpan = document.createElement("span");
    const tomorrowSpan = document.createElement("span");
    todaySpan.innerText = "今天";
    tomorrowSpan.innerText = "明天";
    todayButton.appendChild(todaySpan);
    tomorrowButton.appendChild(tomorrowSpan);

    Object.entries(spanStyles).forEach(([name, value]) => {
      todaySpan.style[name] = value;
      tomorrowSpan.style[name] = value;
    });
    Object.entries(buttonStyles).forEach(([name, value]) => {
      todayButton.style[name] = value;
      tomorrowButton.style[name] = value;
    });

    todayButton.addEventListener("click", () => {
      autoGetClassroomTable(0);
    });

    tomorrowButton.addEventListener("click", () => {
      autoGetClassroomTable(1);
    });

    const box = document.createElement("div");
    box.appendChild(todayButton);
    box.appendChild(tomorrowButton);
    Object.entries(boxStyles).forEach(([name, value]) => {
      box.style[name] = value;
    });

    document.body.appendChild(box);
  }

  // 展示结果的文本框
  function showText(text) {
    const textDiv = document.createElement("div");
    Object.entries(textStyles).forEach(([name, value]) => {
      textDiv.style[name] = value;
    });
    textDiv.addEventListener("mouseover", () => {
      textDiv.style.borderColor = "#008bf8";
    });
    textDiv.addEventListener("mouseout", () => {
      textDiv.style.border = textStyles.border;
    });

    textDiv.innerText = text;
    textDiv.addEventListener("click", () => {
      copyText(text);
      alert("已经复制到剪切板！");
    });
    document.body.appendChild(textDiv);
  }

  function copyText(text) {
    let output = document.createElement("textarea");
    const outputText = text.replace(/\n/g, "\r\n");
    output.value = outputText;
    document.body.appendChild(output);
    output.select();
    document.execCommand("copy");
    document.body.removeChild(output);
  }

  addButtons();
})();
