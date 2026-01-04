// ==UserScript==
// @name         安大教务四分制绩点转换
// @namespace    https://www.skymkmk.com/AHUGPAConverter
// @homepage     https://greasyfork.org/zh-CN/scripts/447311-%E5%AE%89%E5%A4%A7%E6%95%99%E5%8A%A1%E5%9B%9B%E5%88%86%E5%88%B6%E7%BB%A9%E7%82%B9%E8%BD%AC%E6%8D%A2
// @supportURL   https://github.com/skymkmk/AHUGPAConverter/issues
// @supportURL   mailto:admin@skymkmk.com
// @version      1.3.0
// @description  将你的平均绩点从五分制转换为四分制，方便你比对心仪海外高校
// @author       skymkmk
// @match        *://jwxt0.ahu.edu.cn/*
// @match        *://jwxt1.ahu.edu.cn/*
// @match        *://jwxt2.ahu.edu.cn/*
// @match        *://jwxt3.ahu.edu.cn/*
// @match        *://jwxt4.ahu.edu.cn/*
// @match        *://wvpn.ahu.edu.cn/https/77726476706e69737468656265737421fae05988777e69586b468ca88d1b203b/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447311/%E5%AE%89%E5%A4%A7%E6%95%99%E5%8A%A1%E5%9B%9B%E5%88%86%E5%88%B6%E7%BB%A9%E7%82%B9%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/447311/%E5%AE%89%E5%A4%A7%E6%95%99%E5%8A%A1%E5%9B%9B%E5%88%86%E5%88%B6%E7%BB%A9%E7%82%B9%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const excludeCode = /T[Y,X]/;
  const excludeCourse = /军事|心理健康|职业|形式与政策/;
  const oneCreditCourse = /毛泽东|马克思|思想|史|习近平/;
  const twoCreditCourse = /大学英语/;
  let sumPKU = 0;
  let sumWES = 0;
  let creditPKU = 0;
  let creditWES = 0;
  let avgPKU = 0;
  let avgWES = 0;
  let WESExcludedCourse = new Array();
  let WESDecreasedCredit = new Map();
  const table = document.getElementById("Datagrid3").firstElementChild.children;
  const board = document.createElement("div");
  document
    .getElementById("divWtgkc")
    .parentElement.insertBefore(
      board,
      document.getElementById("Datagrid3").parentElement
    );
  function WESPointCalculator(point) {
    if (point === "优秀" || point === "良好") return 4;
    if (point === "中等") return 3;
    if (point === "合格") return 2;
    if (parseInt(point) > 84) return 4;
    if (parseInt(point) > 74) return 3;
    if (parseInt(point) >= 60) return 2;
    return 0;
  }
  function nodeGen(msg, color = "black") {
    const node = document.createElement("p");
    node.innerHTML = msg;
    node.style = "margin: 0; color:" + color + ";";
    return node;
  }
  function formGen(msg) {
    const node = document.createElement("td");
    node.innerHTML = msg;
    return node;
  }
  if (table !== null) {
    for (const i of table) {
      if (i.children[6].innerHTML !== "最高成绩值") {
        const code = i.children[2].innerHTML;
        const courseName = i.children[3].innerHTML;
        const credit = parseFloat(i.children[4].innerHTML);
        const point = i.children[6].innerHTML;
        creditPKU += parseFloat(i.children[4].innerHTML);
        if (point === "优秀") {
          sumPKU += credit * 3.95;
          i.insertBefore(formGen("4.5"), i.children[7]);
          i.insertBefore(formGen("3.95"), i.children[8]);
        } else if (point === "良好") {
          sumPKU += credit * 3.58;
          i.insertBefore(formGen("3.5"), i.children[7]);
          i.insertBefore(formGen("3.58"), i.children[8]);
        } else if (point === "中等") {
          sumPKU += credit * 2.83;
          i.insertBefore(formGen("2.5"), i.children[7]);
          i.insertBefore(formGen("2.83"), i.children[8]);
        } else if (point === "合格") {
          sumPKU += credit * 1.7;
          i.insertBefore(formGen("1.5"), i.children[7]);
          i.insertBefore(formGen("1.7"), i.children[8]);
        } else {
          const pointNum = parseInt(point);
          if (pointNum >= 60) {
            sumPKU += credit * (4 - (3 * (100 - pointNum) ** 2) / 1600);
            i.insertBefore(
              formGen(((pointNum - 50) / 10).toString()),
              i.children[7]
            );
            i.insertBefore(
              formGen(
                (
                  Math.round((4 - (3 * (100 - pointNum) ** 2) / 1600) * 100) /
                  100
                ).toString()
              ),
              i.children[8]
            );
          } else {
            i.insertBefore(formGen("0"), i.children[7]);
            i.insertBefore(formGen("0"), i.children[8]);
          }
        }
        if (!excludeCode.test(code)) {
          if (excludeCourse.test(courseName)) {
            WESExcludedCourse.push(courseName);
            i.children[4].innerHTML =
              i.children[4].innerHTML +
              '<div style="color: red;">WES 排除计算</div>';
            i.insertBefore(formGen("排除"), i.children[9]);
          } else if (oneCreditCourse.test(courseName)) {
            WESDecreasedCredit.set(courseName, 1);
            creditWES += 1;
            sumWES += WESPointCalculator(point);
            i.children[4].innerHTML =
              i.children[4].innerHTML +
              '<div style="color: red;">WES 降重为 1</div>';
            i.insertBefore(
              formGen(WESPointCalculator(point).toString()),
              i.children[9]
            );
          } else if (twoCreditCourse.test(courseName)) {
            WESDecreasedCredit.set(courseName, 2);
            creditWES += 2;
            sumWES += 2 * WESPointCalculator(point);
            i.children[4].innerHTML =
              i.children[4].innerHTML +
              '<div style="color: red;">WES 降重为 2</div>';
            i.insertBefore(
              formGen(WESPointCalculator(point).toString()),
              i.children[9]
            );
          } else {
            creditWES += credit;
            sumWES += credit * WESPointCalculator(point);
            i.insertBefore(
              formGen(WESPointCalculator(point).toString()),
              i.children[9]
            );
          }
        } else {
          WESExcludedCourse.push(courseName);
          i.children[4].innerHTML =
            i.children[4].innerHTML +
            '<div style="color: red;">WES 排除计算</div>';
          i.insertBefore(formGen("排除"), i.children[9]);
        }
      } else {
        i.insertBefore(formGen("安大绩点"), i.children[7]);
        i.insertBefore(formGen("北大绩点"), i.children[8]);
        i.insertBefore(formGen("WES 绩点"), i.children[9]);
      }
    }
    avgPKU = Math.round((sumPKU / creditPKU) * 100) / 100;
    avgWES = Math.round((sumWES / creditWES) * 100) / 100;
    board.appendChild(nodeGen("四分制绩点&emsp;版本 " + GM_info.script.version.toString(), "blue"));
    board.appendChild(nodeGen("作者&emsp;<a target=\"_blank\" href=\"https://www.skymkmk.com\">天空skymkmk</a>"));
    board.appendChild(nodeGen("联系我：<a target=\"_blank\" href=\"https://github.com/skymkmk/AHUGPAConverter/issues\">Github Issues</a>（大陆可能无法访问）"));
    board.appendChild(nodeGen("邮箱&emsp;<a target=\"_blank\" href=\"mailto:admin@skymkmk.com\">admin@skymkmk.com</a>"));
    board.appendChild(nodeGen("北大算法：" + avgPKU.toString(), "red"));
    board.appendChild(nodeGen("WES 算法：" + avgWES.toString(), "red"));
    board.appendChild(nodeGen("WES 算法排除的课程：", "red"));
    for (const i of WESExcludedCourse) board.appendChild(nodeGen(i));
    board.appendChild(nodeGen("WES 算法降重的课程：", "red"));
    for (const [key, value] of WESDecreasedCredit)
      board.appendChild(nodeGen(key + "，降重后的学分为" + value));
  }
  window.parent.document.getElementById("iframeautoheight").setAttribute("height", "");
})();
