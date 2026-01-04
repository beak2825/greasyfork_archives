// ==UserScript==
// @name         auto oa fill
// @license      MIT
// @namespace    linghao.su
// @version      0.3
// @description  maybe you dont want to fill this form manually
// @author       slh001@live.cn
// @match        https://oa.daocloud.io/spa/workflow/static4form/index.html?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/455642/auto%20oa%20fill.user.js
// @updateURL https://update.greasyfork.org/scripts/455642/auto%20oa%20fill.meta.js
// ==/UserScript==

const DayWorkHour = 9;

const parseDate = (date) => {
  const originDateStr = `${date}`;
  const dateStr = `${originDateStr.slice(0, 4)}-${originDateStr.slice(
    4,
    6
  )}-${originDateStr.slice(6, 8)}`;

  return dateStr;
};

function promisify(fn, timeout) {
  return () =>
    new Promise((resolve) => {
      setTimeout(async () => {
        await fn();
        resolve();
      }, timeout);
    });
}

function sleep(timeout) {
  return new Promise((resolve) => {
    setTimeout(async () => {
      resolve();
    }, timeout);
  });
}

const project = [
  "应用工作台",
  "微服务引擎",
  "全局管理",
  "可观测性",
  "微服务管理",
  "服务网格",
];

const comp = [
  "镜像仓库",
  " Helm 应用",
  "服务与路由",
  "拓扑图",
  "流量监控",
  "灰度发布",
];

const action = ["开发", " bugfix", "性能优化", "重构"];

function getRandom(arr) {
  const count = arr.length;
  const idx = Math.floor(Math.random() * count);

  return arr[idx];
}

function getRandomJob() {
  return `${getRandom(project)}${getRandom(comp)}${getRandom(action)}`;
}

let startPosition = 0;

(async function () {


  const $ = document.querySelectorAll.bind(document);



  function getTime(offset) {
    const date = new Date(Date.now() - 60 * 1000 * 60 * 24 * offset);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  function parseSingleDate(date) {
    return `${Number(date.slice(0, 4))}-${Number(date.slice(4, 6))}-${Number(
      date.slice(6, 8)
    )}`;
  }

  let isInit = false;

  const init = async () => {
    await sleep(1000);
    if (isInit) {
      return;
    }

    if ($(".etype_1_swapDiv")[0].children[0].innerText !== "项目周报") {
      return;
    }
    isInit = true;
    const baseMonth = window.prompt(
      "请输入希望填写的月份",
      new Date().getMonth() + 1
    );
    const baseYear = new Date().getFullYear();

    startPosition = $(".icon-coms-New-schedule").length > 0 ? 1 : 0;

    let targetMonth = `${baseYear}`;

    if (baseMonth.length === 1) {
      targetMonth += "0";
    }

    targetMonth += baseMonth;

    const response = await (
      await fetch(
        `https://api.apihubs.cn/holiday/get?size=500&year=${baseYear}&month=${targetMonth}&workday=1`
      )
    ).json();

    const {
      data: { list: dataList },
    } = response;

    const lastDate = dataList[0];

    const data = [...dataList].reverse();

    const lastDateStr = parseDate(lastDate.date);

    const clickCurrentDate = promisify(async () => {
      $(".icon-coms-New-schedule")[0].click();
      const key = `td[title="${lastDateStr}"]`;

      await sleep(1000);
      $(key)[0].click();
    }, 1000);

    // await clickCurrentDate();

    const addBtn = document.getElementById("addbutton2");

    const weekGroup = {};

    for (let i = 0; i < data.length; i++) {
      const singleDay = data[i];
      const week = weekGroup[singleDay.yearweek] || [];

      week.push(singleDay);
      weekGroup[singleDay.yearweek] = week;
    }

    const weekCount = Object.keys(weekGroup).length;

    for (let i = 0; i < weekCount; i++) {
      addBtn.click();
    }
    const weekGroupArr = Object.values(weekGroup);
    await sleep(1000);
    for (const week of weekGroupArr) {
      const index = weekGroupArr.indexOf(week);
      const weekDayCount = week.length;
      const weekWorkHour = weekDayCount * DayWorkHour;

      $(".ant-btn-icon-only")[index].click();
      await sleep(2000);
      $(".ant-table-row-level-0")[0].click();

      const timeInput = $(".wf-input-detail")[index];

      timeInput.focus();

      timeInput.setAttribute("value", 8);
      timeInput.value = weekWorkHour;

      const firstDay = String(week.at(0).date);
      const lastDay = String(week.at(-1).date);

      const firstDayParsed = parseSingleDate(firstDay);
      const lastDayParsed = parseSingleDate(lastDay);
      let timeOffset = firstDayParsed;

      if (firstDayParsed !== lastDayParsed) {
        timeOffset += `~${lastDayParsed}`;
      }
      timeOffset += `\n${getRandomJob()}`;

      $(".ant-input")[index].focus();
      $(".ant-input")[index].value = timeOffset;

      $(".icon-coms-New-schedule")[index + startPosition].click();
      await sleep(500);
      const key = `td[title="${lastDayParsed}"]`;

      $(key)[0].click();
      await sleep(500);
    }
  };

  window.onload = async function () {

    await init();
  };

  window.autoReportInit = () => {
    init();
  };

    await sleep(5000);
    init();
  // Your code here...
})();

