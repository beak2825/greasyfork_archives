// ==UserScript==
// @name         leetcode 题目竞赛分数查看
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  基于零神的https://zerotrac.github.io/leetcode_problem_rating/项目的竞赛分数
// @author       mangwu
// @match        *://leetcode.cn/problemset/all/*
// @icon         https://assets.leetcode.cn/aliyun-lc-upload/uploaded_files/2021/03/73c9f099-abbe-4d94-853f-f8abffd459cd/leetcode.png?x-oss-process=image%2Fformat%2Cwebp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454344/leetcode%20%E9%A2%98%E7%9B%AE%E7%AB%9E%E8%B5%9B%E5%88%86%E6%95%B0%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/454344/leetcode%20%E9%A2%98%E7%9B%AE%E7%AB%9E%E8%B5%9B%E5%88%86%E6%95%B0%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==
(function () {
  function getCurTableTitlesID() {
    return [
      ...document
        .querySelectorAll("div[role=table] div[role=rowgroup] div[role=row]")
        .values(),
    ];
  }
  async function getZerotracData() {
    return fetch("https://zerotrac.github.io/leetcode_problem_rating/data.json")
      .then((res) => res.json())
      .then((data) => {
        const m = [];
        for (const item of data) {
          const { ContestID_zh, ID, Rating } = item;
          m[ID] = [ContestID_zh, Rating];
        }
        return m;
      });
  }
  function addTableTitle() {
    const fuben = document
      .querySelector(
        "div[role=table] div.border-b div[role=row] div:nth-child(2)"
      )
      .cloneNode(true);

    const tableHeader = document.querySelector(
      "div[role=table] div.border-b div[role=row]"
    );
    const sortedIcon = fuben.querySelector("span");
    sortedIcon.style.display = "none";
    fuben.children[0].removeChild(sortedIcon);
    fuben.textContent = "周赛分数";
    tableHeader.appendChild(fuben);
  }
  // 获取一个复制的表格单元
  let origin = null;
  function getAColumn() {
    return document
      .querySelector(
        "div[role=table] div[role=rowgroup] div[role=row] div[role=cell]:nth-child(2)"
      )
      .cloneNode(true);
  }
  // 数据
  let p = getZerotracData();
  // 保存添加的单元格
  let cells = [];
  function addColumns() {
    // 增加一行
    const curIds = getCurTableTitlesID();
    if (cells.length > 0) {
      cells.forEach((v) => v.remove());
      cells = [];
    }
    p.then((res) => {
      curIds.forEach((v, i) => {
        let id = parseInt(
          v.querySelector("div[role=cell]:nth-child(2)").textContent
        );
        let cell = origin.cloneNode(true);
        cells.push(cell);
        cell.textContent = "-";
        v.append(cell);
        if (res[id]) {
          cell.textContent = `${res[id][1].toFixed(2)}(${res[id][0]})`;
        }
      });
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    origin = getAColumn();
    addTableTitle();
    // 网络请求
    function perfObserver(list, observer) {
      let k = getNetworkRequest(
        list.getEntriesByName("https://leetcode.cn/graphql/")
      );
      console.log(k);
      addColumns();
    }
    // 得到满足条件的网络请求
    function getNetworkRequest(
      entries = performance.getEntriesByType("resource")
    ) {
      return entries;
    }
    // 监测网络变化
    var observer = new PerformanceObserver(perfObserver);
    observer.observe({ entryTypes: ["resource"] });
  });
})();


