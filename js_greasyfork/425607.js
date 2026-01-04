// ==UserScript==
// @name         Kaikeba Wiki Helper
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Wiki Helper
// @author       WumaCoder
// @match        http://wiki.kaikeba.com/pages/*
// @match        https://wiki.kaikeba.com/pages/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/425607/Kaikeba%20Wiki%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/425607/Kaikeba%20Wiki%20Helper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const config = {
    isAutoWrite: true, // 自动写表单
    isAutoUpdate: true, // 自动更新标题
  };

  const formData = defineState({
    title: (self) =>
      `gk-${xk}-${self.table_num}-${TYPE[self.table_type]}-${toShortDate(
        self.table_date
      )}`,
    tags: (self) => [
      self.table_teacher,
      xk,
      `${xk}-${self.table_num}`,
      "跟课课时",
      `${xk}学科`,
    ],

    table_date: "2021-04-28",
    table_name: "web全栈架构师", // 课程
    table_num: 29, // 班次
    table_type: "大班课", // 类型
    table_knob: "课节", // 课节
    table_teacher: "讲师", // 讲师
    table_group: "教研", // 教研
    table_helpTeacher: "助教", // 助教
    table_subTeacher: "班主任", // 班班
    table_startDate: "20:30", // 开始
    table_endDate: "22:30", // 结束
    table_totalTime: 2, // 总时长
    table_resultTime: "2:00", // 结算时长
    table_manNum: 90, // 峰值人数
    table_manActive: (self) => random(10, +self.table_manNum / 2), //课程互动
    table_messageActive: (self) => random(10, +self.table_manNum / 2), // 公屏互动
    table_to24h: "/",
    table_to48h: "/",
    table_liveErr: "/",
    table_note: "/",
  });

  console.log(formData);

  setTimeout(() => {
    const publish = document.querySelector("#rte-button-publish");
    publish.addEventListener("click", () => {
      save();
      writeTags();
      nextBaseDate();
    });
    publish.style["background"] = "purple";

    if (config.isAutoWrite) {
      writeTitle();
      writeTable();
    }
    if (config.isAutoUpdate) {
      setInterval(() => {
        save(false);
        writeTitle();
      }, 500);
    }
  }, 1000);

  buildUI();

  var ADAY = 24 * 1000 * 60 * 60;
  var TYPE = {
    公开课: "gkk",
    大班课: "dbk",
    点评课: "dpk",
    答疑课: "dyk",
  };
  var xk = "web";

  function buildUI() {
    const ui = `
      <button @click="add">Add Day</button>
      <button @click="dec">Dec Day</button>
      <button @click="reset">Reset</button>
      <button @click="state">State</button>
      <button @click="setting">Setting</button>
      <button @click="writeForm">Write</button>
      <button @click="save">Save</button>
    `;
    UI(ui, {
      add() {
        const { date } = dateOpe(formData.table_date, 1);
        formData.table_date = date;
        writeTitle();
        writeTable();
      },
      dec() {
        const { date } = dateOpe(formData.table_date, -1);
        formData.table_date = date;
        writeTitle();
        writeTable();
      },
      reset() {
        formData.reset();
        writeTitle();
        writeTable();
      },
      state() {
        alert("请查看控制台");
        console.log(formData);
      },
      setting() {
        xk = prompt("请输入你们部门的英文，比如: web", xk);
        writeTitle();
        writeTable();
      },
      writeForm() {
        writeTitle();
        writeTable();
      },
      save() {
        save();
      },
    });
  }

  function save(isKeep = true) {
    formData.isKeep = isKeep;
    let i = 0;
    const els = document
      .querySelector("iframe")
      .contentWindow.document.querySelectorAll(".confluenceTd");
    for (const key in formData.state) {
      if (key.startsWith("table_")) {
        const el = els[i];
        formData.state[key] = el.innerText;
        i++;
      }
    }
  }

  function nextBaseDate() {
    let f = 2;
    while (1) {
      const { datetime, date } = dateOpe(formData.table_date, f);
      formData.table_date = date;
      const week = datetime.getDay();
      if (week >= 1 && week <= 6) {
        break;
      } else {
        f = 1;
      }
    }
  }

  function writeTitle() {
    const el = document.querySelector("#content-title");
    el.value = formData.title;
  }

  function writeTable() {
    let i = 0;
    const els = document
      .querySelector("iframe")
      .contentWindow.document.querySelectorAll(".confluenceTd");
    for (const key in formData.state) {
      if (key.startsWith("table_")) {
        const el = els[i];
        el.innerHTML = formData.state[key];
        i++;
      }
    }
  }

  async function writeTags() {
    await addTags(formData.tags);
  }

  function UI(ui, handlers = {}) {
    const plan = document.createElement("div");
    plan.id = "Wiki Helper";
    plan.style["position"] = "fixed";
    plan.style["top"] = "0";
    plan.style["left"] = "40%";
    plan.style["z-index"] = "10000";
    // plan.style["background"] = "#EEE";
    plan.style["padding"] = "10px";
    plan.innerHTML = ui;
    plan.addEventListener("click", (e) => {
      const methodName = e.target.attributes["@click"].value;
      handlers[methodName]();
    });
    handlers.query = plan.querySelector.bind(plan);
    handlers.queryAll = plan.querySelectorAll.bind(plan);
    document.body.append(plan);
  }

  function defineState(data = {}, { keep = "@State" } = {}) {
    const _data = Object.assign({}, data);
    Object.assign(data, readState());
    const state = new Proxy(data, {
      get(target, key, rec) {
        const val = Reflect.get(target, key, rec);
        return typeof val === "function" ? val(state) : val;
      },
      set(target, key, val, rec) {
        if (typeof target[key] === "function") {
          return true;
        }
        const res = Reflect.set(target, key, val, rec);
        writeState();
        return res;
      },
    });
    const result = {
      state,
      reset,
      readState,
      writeState,
      isKeep: true,
    };

    for (const key in state) {
      proxyState(result, key);
    }

    return result;

    function readState() {
      let state = GM_getValue(keep);
      return state;
    }

    function writeState() {
      if (!result.isKeep) return data;
      return GM_setValue(keep, data);
    }

    function reset() {
      data = _data;
      return writeState();
    }

    function proxyState(target, key) {
      Object.defineProperty(target, key, {
        get() {
          return target.state[key];
        },
        set(v) {
          return (target.state[key] = v);
        },
      });
    }
  }

  function request(url, data = {}, opts = {}) {
    return fetch(url, {
      body: JSON.stringify(data), // must match 'Content-Type' header
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
        "user-agent": "Mozilla/4.0 MDN Example",
        "content-type": "application/json",
      },
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // *client, no-referrer
      ...opts,
    });
  }

  function addTags(tags) {
    return request(
      `http://wiki.kaikeba.com/rest/ui/1.0/content/${getWikiId()}/labels`,
      tags.map((tag) => ({ name: tag, id: timestamps() })),
      {
        method: "POST",
      }
    );
  }

  function getTags() {
    return request(
      `http://wiki.kaikeba.com/rest/ui/1.0/content/${getWikiId()}/labels?_=${Date.now()}`
    );
  }

  function timestamps() {
    return parseInt(Date.now() / 1000);
  }

  function getWikiId() {
    return location.href.match(/draftId=(\d+)/)[1];
  }

  function dateOpe(date, n = 1) {
    let ms = Date.parse(date + " 00:00:00");
    ms += ADAY * n;
    const d = new Date(ms);
    return {
      datetime: d,
      date: d
        .toLocaleDateString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//gim, "-"),
    };
  }

  function random(start, end) {
    return parseInt(Math.random() * (end - start)) + start;
  }

  function toShortDate(s) {
    return s.replace(/-/gim, "");
  }
  // Your code here...
})();
