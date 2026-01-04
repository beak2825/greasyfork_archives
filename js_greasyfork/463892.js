// ==UserScript==
// @name         科技楼空教室表
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  用于获取东秦科技楼空教室表的js脚本
// @author       Juns
// @match        *://jwxt.neuq.edu.cn*
// @match        http://jwxt.neuq.edu.cn/eams/homeExt.action
// @match        http://jwxt.neuq.edu.cn/eams/homeExt.action*
// @match        http://jwxt.neuq.edu.cn/eams/classroom/apply/free!search.action
// @match        http://jwxt.neuq.edu.cn/eams/classroom/apply/free.action
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neuq.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463892/%E7%A7%91%E6%8A%80%E6%A5%BC%E7%A9%BA%E6%95%99%E5%AE%A4%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/463892/%E7%A7%91%E6%8A%80%E6%A5%BC%E7%A9%BA%E6%95%99%E5%AE%A4%E8%A1%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 添加button,以及样式
  //#region
  const button = document.createElement("button");
  button.innerText = "1111";
  button.style.position = "absolute";
  button.style.bottom = "60px";
  button.style.right = "30px";
  button.innerText = "科技楼空教室表";
  button.style.setProperty("--color", "#560bad");
  button.style.fontFamily = "inherit";
  button.style.display = "inline-block";
  button.style.width = "9em";
  button.style.height = "2.6em";
  button.style.lineHeight = "2.5em";
  button.style.margin = "20px";
  button.style.overflow = "hidden";
  button.style.border = "2px solid var(--color)";
  button.style.transition = "color .5s";
  button.style.zIndex = "3";
  button.style.fontSize = "17px";
  button.style.borderRadius = "6px";
  button.style.fontWeight = "500";
  button.style.color = "var(--color)";
  button.style.backgroundColor = "#fff";
  const before = document.createElement("div");
  before.style.content = '""';
  before.style.position = "absolute";
  before.style.zIndex = "-1";
  before.style.background = "var(--color)";
  before.style.height = "150px";
  before.style.width = "200px";
  before.style.borderRadius = "50%";
  button.appendChild(before);
  before.style.top = "100%";
  before.style.left = "100%";
  before.style.transition = "all .7s";
  button.addEventListener("mouseover", () => {
    before.style.top = "-30px";
    before.style.left = "-30px";
    button.style.color = "#f2f5f7";
  });
  button.addEventListener("mouseout", () => {
    before.style.top = "100%";
    before.style.left = "100%";
    button.style.color = "var(--color)";
  });
  button.addEventListener("mousedown", () => {
    button.style.setProperty("--color", "#3a0ca3");
    before.style.background = "#3a0ca3";
    before.style.transition = "background 0s";
  });
  button.addEventListener("mouseup", () => {
    button.style.setProperty("--color", "#560bad");
    before.style.background = "var(--color)";
    before.style.transition = "background .7s";
  });
  document.body.appendChild(button);
  //#endregion

  let emptyClassroomString = ""; //空教室表的字符串
  let str = "";

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

  let timeStamp = Date.now(); //现在的时间戳
  let emptyClassroomTableExportTime = timestampToTime(timeStamp);
  // timeStamp += 8 * 60 * 60 * 1000; //东八区的时间戳
  timeStamp += 24 * 60 * 60 * 1000; // ! 下一天的时间戳
  // !如果要获取今天的空教室表就注释掉上面这一行
  let date = new Date(timeStamp); //对应的时间
  let yyy = date.getFullYear();
  let mmm = date.getMonth() + 1; //从0开始
  let ddd = date.getDate(); //几号
  let order = date.getDay(); //0是周日

  // 第一行显示年月日，周几
  emptyClassroomString += `${yyy}.${mmm}.${ddd}日   周`;
  let week = ["日", "一", "二", "三", "四", "五", "六"];
  emptyClassroomString += week[order];
  emptyClassroomString += "\n\n";

  // 补零函数
  function pad(time) {
    return (time < 10 ? "0" : "") + time;
  }

  // 设置楼，时间，以及一些选项
  function setOptions() {
    let trs = document.querySelector("#actionForm").querySelectorAll("tr");
    // console.log(trs[2]);
    let sel = trs[2].querySelector("select");
    sel.value = "9"; // 设置教学楼为科技楼
    // console.log(trs[4]);
    let tds = trs[4].querySelectorAll("td");
    // console.log(tds[1]);
    let ins = tds[1].querySelectorAll("input");

    ins[0].value = `${yyy}-${pad(mmm)}-${pad(ddd)}`;
    ins[1].value = `${yyy}-${pad(mmm)}-${pad(ddd)}`;
    // 2023.2.28日:好像格式改了，改成了03/01这样的
    // ins[0].value = `${yyy}-${mmm}-${ddd}`;
    // ins[1].value = `${yyy}-${mmm}-${ddd}`;
  }

  //点击查询按钮
  function btnClick() {
    let trs = document.querySelector("#actionForm").querySelectorAll("tr");
    // console.log(trs[5]);
    let btn = trs[5].querySelector("input");
    // console.log(btn);
    btn.click();
  }

  //替换汉字函数
  function RemoveChinese(strValue) {
    if (strValue != null && strValue != "") {
      let reg = /科[ ]*技[ ]*楼/;
      let reg2 = /具体安排以开课部门通知为准\s*/g;
      let reg3 = /自[ ]*主[ ]*学[ ]*习[ ]*室/;
      return strValue
        .replace(reg, "")
        .replace(reg2, "")
        .replace(reg3, "自习室");
    } else return "";
  }

  // 获取当前表格内的数据
  function getClassroomString() {
    let rows = document
      .querySelector("#grid15320024301_data")
      .querySelectorAll("td"); // 获取表格数据
    // console.log(rows);
    // console.log(rows[1]);
    let t = []; //存储数据
    for (let i = 1; i < rows.length; i += 6) {
      let x = RemoveChinese(rows[i].innerText);
      t.push(x);
      // t.push(rows[i].innerText);
    }

    t.sort(); //升序排序
    str = "";
    for (let i = 0; i < t.length; i++) {
      //对数据进行换行处理
      if (i >= 1) {
        if (t[i][0] != t[i - 1][0]) str += "\n";
      }
      str += t[i] + " ";
    }
    console.log(str);
    emptyClassroomString += str; //s是之后的总的字符串
  }

  // 查询a-b小节的空教室
  function emptyClassroomQuery(a, b) {
    let x = document
      .querySelector("#roomApplyTimeTypeTd")
      .querySelectorAll("input"); // 获取dom
    x[0].value = a;
    x[1].value = b;
    btnClick();
    console.log(a + "-" + b + "节：");
    setTimeout(getClassroomString, 1000); //设置延时1s
    emptyClassroomString = emptyClassroomString + a + "-" + b + "节：\n";
  }

  //todo 之后用异步重构一下，现在能跑就不管了吧😂
  function f(time) {
    setOptions();
    if (time > 6000) {
      return;
    } else {
      setTimeout(() => {
        time += 1000; //每次间隔1s
        // console.log(time);
        if (time == 1000) {
          emptyClassroomQuery(1, 2);
          button.innerText = "正在查询...";
          button.addEventListener("mouseover", () => {
            button.style.color = "#6f42c1";
          });
        }
        if (time == 2000) {
          emptyClassroomString = emptyClassroomString + "\n\n";
          emptyClassroomQuery(3, 4);
        }
        if (time == 3000) {
          emptyClassroomString = emptyClassroomString + "\n\n";
          emptyClassroomQuery(5, 6);
        }
        if (time == 4000) {
          emptyClassroomString = emptyClassroomString + "\n\n";
          emptyClassroomQuery(7, 8);
        }
        if (time == 5000) {
          emptyClassroomString = emptyClassroomString + "\n\n";
          emptyClassroomQuery(9, 10);
        }
        if (time == 6000) {
          emptyClassroomString = emptyClassroomString + "\n\n";
          emptyClassroomQuery(1, 8);
        }
        if (time == 7000) {
          const newS =
            emptyClassroomString +
            "\n\n——不洗碗工作室" +
            "\n\n导出时间:" +
            emptyClassroomTableExportTime;
          console.log(newS);
          button.innerText = "点击文本即复制";
          showText(newS);
          // console.log("——ACM技术部");
        }
        f(time);
      }, time);
    }
  }
  // f(0); //自动执行

  button.addEventListener("click", () => {
    if (
      window.location.href !==
      "http://jwxt.neuq.edu.cn/eams/classroom/apply/free.action"
    ) {
      window.location =
        "http://jwxt.neuq.edu.cn/eams/classroom/apply/free.action";
      f(0);
    } else {
      f(0);
    }
  });
  // 文本框
  function showText(emptyClassroomString) {
    const textDiv = document.createElement("div");
    textDiv.style.fontSize = "17px";
    textDiv.style.borderRadius = "20px";
    textDiv.style.background = "#f5f5f5";
    textDiv.style.padding = "1.8rem";
    textDiv.style.transition = "0.5s ease-out";
    textDiv.style.overflow = "visible";
    textDiv.style.position = "absolute";
    textDiv.style.top = "20px";
    textDiv.style.left = "20px";
    textDiv.style.cursor = "pointer";
    textDiv.style.backgroundColor = "rgba(255, 255, 255, 0.25)";
    textDiv.style.backdropFilter = "blur(6px)";
    textDiv.style.border = "1px solid rgba(255, 255, 255, 0.18)";
    textDiv.style.boxShadow = "rgba(142, 142, 142, 0.19) 0px 6px 15px 0px";
    textDiv.innerText = emptyClassroomString;
    textDiv.addEventListener("mouseover", () => {
      textDiv.style.borderColor = "#008bf8";
    });
    textDiv.addEventListener("mouseout", () => {
      textDiv.style.border = "1px solid rgba(255, 255, 255, 0.18)";
      textDiv.style.boxShadow = "rgba(142, 142, 142, 0.19) 0px 6px 15px 0px";
    });
    textDiv.addEventListener("click", () => {
      copyText(emptyClassroomString);
      alert("已经复制到剪切板！");
    });
    document.body.appendChild(textDiv);
  }

  function copyText(emptyClassroomString) {
    let tempInput = document.createElement("textarea");
    emptyClassroomString = emptyClassroomString.replace(/\n/g, "\r\n");
    tempInput.value = emptyClassroomString;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
  }
})();
