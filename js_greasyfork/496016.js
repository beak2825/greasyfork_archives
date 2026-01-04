// ==UserScript==
// @name        Task Bar
// @namespace   CCAU
// @description Automate course copies
// @match       https://*.instructure.com/courses/*
// @version     0.1.0
// @author      CIDT
// @grant       none
// @license     BSD-3-Clause
// @downloadURL https://update.greasyfork.org/scripts/496016/Task%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/496016/Task%20Bar.meta.js
// ==/UserScript==
"use strict";
(() => {
  // out/env.js
  var CORS_PROXY = "https://api.allorigins.win/get?url=";
  var DATA_URL = "https://text.is/ccau_tasks/raw";
  var ROOT_URL = "https://se.instructure.com";

  // out/utils.js
  function log(msg) {
    console.log("[CCAU] " + msg);
  }
  function addCurrentButton(task) {
    const bar = document.querySelector(".right-of-crumbs");
    const btn = document.createElement("a");
    btn.id = "ccau_current_task";
    btn.textContent = task.name;
    btn.setAttribute("title", task.help);
    btn.classList.add("btn");
    btn.setAttribute("tabindex", "0");
    bar?.insertAdjacentElement("beforebegin", btn);
  }
  function addPrevNextButton(task, fn, id) {
    const bar = document.querySelector(".right-of-crumbs");
    const btn = document.createElement("a");
    btn.id = id;
    btn.textContent = id === "ccau_prev_task" ? "<--" : "-->";
    btn.setAttribute("title", task.help);
    btn.classList.add("btn");
    btn.setAttribute("tabindex", "0");
    btn.addEventListener("click", fn);
    bar?.insertAdjacentElement("beforebegin", btn);
  }
  function getCourseID() {
    return window.location.href.match(/courses\/(\d+)/)?.[1] ?? "NO_COURSE_ID";
  }
  function goto(path) {
    const id = getCourseID();
    window.location.href = `${ROOT_URL}/courses/${id}/${path}`;
  }
  function curTask() {
    const id = getCourseID();
    const str = localStorage.getItem(`ccau_${id}_task`);
    return Number(str);
  }
  function setTask(task) {
    const id = getCourseID();
    localStorage.setItem(`ccau_${id}_task`, task.toString());
  }

  // out/task.js
  function update() {
    const day = 1e3 * 60 * 60 * 24;
    const now = Date.now();
    const last = Number(localStorage.getItem("ccau_task_ts")) ?? 0;
    if (now - last < day) {
      return;
    }
    fetch(CORS_PROXY + encodeURIComponent(DATA_URL)).then((response) => response.json()).then((data) => {
      localStorage.setItem("ccau_task", data["contents"]);
      localStorage.setItem("ccau_task_ts", now.toString());
    });
  }
  function getTasks() {
    update();
    const tasks = localStorage.getItem("ccau_task") ?? "[]";
    const parsed = JSON.parse(tasks);
    return parsed.tasks;
  }

  // out/index.js
  function main() {
    if (!document.querySelector("#global_nav_accounts_link")) {
      throw new Error("Only admins can use this script");
    }
    const tasks = getTasks();
    const taskNum = curTask() ?? 0;
    const task = tasks[taskNum];
    const prevNum = Math.max(0, taskNum - 1);
    const prev = tasks[prevNum];
    const nextNum = (taskNum + 1) % tasks.length;
    const next = tasks[nextNum];
    addPrevNextButton(prev, () => prevTask(tasks), "ccau_prev_task");
    addCurrentButton(task);
    addPrevNextButton(next, () => nextTask(tasks), "ccau_next_task");
  }
  function prevTask(tasks) {
    const taskNum = curTask() ?? 0;
    const prevNum = Math.max(0, taskNum - 1);
    const prev = tasks[prevNum];
    setTask(prevNum);
    goto(prev.path);
  }
  function nextTask(tasks) {
    const taskNum = curTask() ?? 0;
    const nextNum = (taskNum + 1) % tasks.length;
    const next = tasks[nextNum];
    if (nextNum === 0) {
      log("No more tasks");
      return;
    }
    setTask(nextNum);
    goto(next.path);
  }
  main();
})();
