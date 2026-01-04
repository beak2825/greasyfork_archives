// ==UserScript==
// @name               ZenTao.utils for pharmaoryx
// @name:zh-CN         ZenTao
// @description        ZenTao.
// @description:zh-CN  ZenTao.
// @namespace          https://github.com/Luca0226
// @version            1.6.3
// @author             Luca
// @copyright          2022+, Luca (https://github.com/Luca0226)
// @license            AGPL-3.0-or-later
// @icon               https://www.zentao.net/file.php?f=201908/f_3e8c31b19a1779be6b90bd8b89aed967.ico&t=ico&o=&s=&v=1623389580
// @match              http://10.60.10.90/zentao/execution-task*
// @match              http://10.60.10.90/zentao/execution-grouptask*
// @match              http://10.60.10.90/zentao/execution-manageMembers*
// @match              http://10.60.10.90/zentao/task-batchCreate*
// @match              http://10.60.10.90/zentao/bug-browse*
// @match              http://10.60.10.90/zentao/execution-bug*
// @match              http://10.60.10.90/zentao/caselib-batchCreateCase*
// @compatible	       Chrome
// @grant              GM_addStyle
// @grant              GM_xmlhttpRequest
// @grant              GM_info
// @downloadURL https://update.greasyfork.org/scripts/434162/ZenTaoutils%20for%20pharmaoryx.user.js
// @updateURL https://update.greasyfork.org/scripts/434162/ZenTaoutils%20for%20pharmaoryx.meta.js
// ==/UserScript==
 
// ==OpenUserJS==
// @author             Luca
// @collaborator       Luca
// ==/OpenUserJS==
(function () {
  ("use strict");
 
  const classList = ["status-wait", "status-doing", "status-pause"];
  const taskUrlPref = "/zentao/execution-task";
  const groupTaskUrlPref = "/zentao/execution-grouptask";
  const memberUrlPref = "/zentao/execution-manageMembers";
  const batchCreateTask = "/zentao/task-batchCreate";
  const bugUrlPref = "/zentao/bug-browse";
  const bugExecutionUrlPref = "/zentao/execution-bug";
  const batchCreateCaseBibUrlPref = "/zentao/caselib-batchCreateCase";
  const dayConsumption = 6;//每天有效时长6个小时
  const memberCount = 5;
  let bugList = new Set();
  const styleStr = `
th.c-status {
  width: 88px !important;
}
 
.main-table tbody>tr>td, .main-table thead>tr>th {
  padding: 2px 5px !important;
}
 
table.consumptionTable {
  position: fixed;
  bottom: 0;
  color: #333333;
  border-width: 1px;
  border-color: #666666;
  border-collapse: collapse;
}
 
table.consumptionTable th {
  font-weight: bold;
}
 
table.consumptionTable th,
table.consumptionTable td {
  text-align: center;
  padding: 5px 2px;
  border-width: 1px;
  border-style: solid;
  border-color: #666666;
  background-color: rgba(255,255,255,0.8);
}
  `;
  const filterStyle = `
.filters {
  float: left;
}
 
.filters > button,
.filters > span {
  margin-right: 10px;
}
 
.filter.clicked {
  background-color: #23304d;
  color: #fff;
  border-radius: 3px;
  border-color: #23304d;
  padding: 1px 6px;
}
 
.filter.clicked:hover {
  background-color: #4c566e;
  border-color: #4c566e;
}
 
tr.hide {
  display: none;
}
  `;
  const bugDetailStyle = `
    .c-title.text-left .btn {
      display: inline-block;
      width: 26px;
      padding: 2px;
      overflow: hidden;
      line-height: 20px;
      color: #16a8f8;
      background: 0;
      border-color: transparent;
    }
 
    .bugDetail {
      position: fixed;
      top: 52px;
      display: none;
      background-color: white;
      box-shadow: rgb(0, 0, 0) 0px 0px 10px;
      z-index: 999;
      opacity: 0.9;
    }
 
    .bugDetail .header {
      height: 32px;
      padding: 5px 5px;
      background-color: #efefef;
      color: #23304d;
      font-weight: bold;
      overflow: hidden;
    }
 
    .bugDetail .header > button {
      width: 24px;
      height: 24px;
      padding: 0;
      position: absolute;
      right: 5px;
    }
 
    .bugDetail .header > button:hover {
      color: #253351;
    }
 
    .bugDetail .header > .id {
      min-width: 30px;
      padding: 0 5px;
      text-align: center;
      border: 1px solid #23304d;
      border-radius: 3px;
    }
 
    .bugDetail .header > span {
      margin-left: 10px;
      font-size: 14px;
    }
 
    .bugDetail .body {
      overflow: auto;
      max-width: 1146px;
    }
  `;
 
  main();
 
  function main() {
    logInfo(GM_info.script.name, GM_info.script.version);
    GM_addStyle(styleStr);
    const path = window.location.pathname;
    if (path.startsWith(taskUrlPref)) {
      GM_addStyle(filterStyle);
      let tasks = document.querySelectorAll("#taskList>tbody>tr");
      addConsumption(tasks);
      addFilter(tasks);
      addBatchConfirm();
      addEditTask(tasks);
    } else if (path.startsWith(groupTaskUrlPref)) {
      GM_addStyle(filterStyle);
      let tasks = document.querySelectorAll("div#tasksTable>table>tbody>tr");
      addGroupConsumption(tasks);
      addGroupFilter(tasks);
      addEditTask(tasks);
    } else if (path.startsWith(memberUrlPref)) {
      updateConsumption();
    } else if (path.startsWith(batchCreateTask)) {
      addBatchCreateTask();
    } else if (path.startsWith(bugUrlPref) || path.startsWith(bugExecutionUrlPref)) {
      GM_addStyle(bugDetailStyle);
      showBugDetail();
    } else if (path.startsWith(batchCreateCaseBibUrlPref)) {
      addBatchCreateCaseLib();
    }
  }
 
  function addConsumption(tasks) {
    let data = new Map();
    for (let i = 0; i < tasks.length; i++) {
      let taskSpan = tasks[i].querySelector("span.status-task");
      if (!taskSpan) {
        continue;
      }
      const className = taskSpan.classList[1];
      if (classList.indexOf(className) == -1) {
        continue;
      }
      const leftTime = new Number(tasks[i].querySelector("td.c-left").textContent.replace("h", ""));
      const user = tasks[i].querySelector("td.c-assignedTo>a>span").textContent;
      if (user.trim() == "") {
        continue;
      }
      data.get(user)
        ? data.set(user, parseFloat((new Number(data.get(user)) + new Number(leftTime)).toFixed(2)))
        : data.set(user, leftTime);
    }
    let parent = document.getElementById("main");
    addTable(data, parent);
  }
 
  function addGroupConsumption(tasks) {
    let groupData = new Map();
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].classList.contains("hidden")) {
        continue;
      }
      let taskSpan = tasks[i].querySelector("span.status-task");
      if (!taskSpan) {
        continue;
      }
      const className = taskSpan.classList[1];
      if (classList.indexOf(className) == -1) {
        continue;
      }
      const leftTime = new Number(
        tasks[i].querySelectorAll("td.c-hours")[2].textContent.replace("h", "")
      );
      const user = tasks[i].querySelector("td.c-assign>span").textContent;
      if (user.trim() == "") {
        continue;
      }
      groupData.get(user)
        ? groupData.set(
          user,
          parseFloat((new Number(groupData.get(user)) + new Number(leftTime)).toFixed(2))
        )
        : groupData.set(user, leftTime);
    }
    let parent = document.getElementById("main");
    addTable(groupData, parent);
  }
 
  function addTable(data, parent) {
    let table = getTable(data);
    if (table) {
      parent.append(table);
    }
  }
 
  function getTable(data) {
    let dataArr = Array.from(data);
    dataArr.sort(function (a, b) {
      return b[1] - a[1];
    });
    if (dataArr.length == 0) {
      return null;
    }
    let table = document.createElement("table");
    let tr = "<thead><th>姓名</th><th>工时</th><th>人天</th></thead><tbody>";
    for (let i = 0; i < dataArr.length; i++) {
      tr +=
        "<tr><td>" +
        dataArr[i][0] +
        "</td><td>" +
        dataArr[i][1] +
        "</td><td>" +
        parseFloat(new Number(dataArr[i][1] / dayConsumption).toFixed(1).toString()) +
        "</td></tr>";
    }
    tr += "</tbody>";
    table.innerHTML = tr;
    table.className = "consumptionTable";
    return table;
  }
 
  function updateConsumption() {
    let trs = document.querySelectorAll("#mainContent>form.main-form>table>tbody>tr");
    if (trs && trs[0]) {
      if (trs.length < 8) {
        const addBtn = trs[trs.length - 1].children[5].children[0];
        for (let i = 0; i < memberCount; i++) {
          addBtn.click();
        }
      }
      trs = document.querySelectorAll("#mainContent>form.main-form>table>tbody>tr");
      for (let i = 0; i < trs.length; i++) {
        trs[i].children[3].children[0].value = dayConsumption;
      }
    }
  }
 
  function addFilter(tasks) {
    let members = getMembers(tasks);
    addFilterButton(members);
    addFilterListener(tasks);
    if (members.size != 0) {
      addCleanFilterButton();
      addCleanListener(tasks);
    }
  }
 
  function addBatchConfirm() {
    const list = document.querySelectorAll("#taskList > tbody > tr > td.c-actions > a");
    for (let i = 0; i < list.length; i++) {
      var title = list[i].getAttribute("title");
      if ("确认研发需求变动" == title) {
        addBatchConfirmButton();
        break;
      }
    }
  }
 
  function addGroupFilter(tasks) {
    let members = getGroupMembers(tasks);
    let indexMap = getRowSpan(tasks);
    addFilterButton(members);
    addGroupFilterListener(tasks, indexMap);
    if (members.size != 0) {
      addCleanFilterButton();
      addGroupCleanListener(tasks, indexMap);
    }
    addCollectCheck();
    addCollectCheckListener();
  }
 
  function getMembers(tasks) {
    let members = new Set();
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].classList.contains("hidden") || tasks[i].classList.contains("group-summary")) {
        continue;
      }
      let taskSpan = tasks[i].querySelector("span.status-task");
      if (!taskSpan) {
        continue;
      }
      const className = taskSpan.classList[1];
      if (className == "status-cancel") {
        continue;
      }
      let user = "";
      if (className == "status-closed" || className == "status-done") {
        user = tasks[i].querySelector("td.c-finishedBy").textContent;
      } else {
        user = tasks[i].querySelector("td.c-assignedTo>a>span").textContent;
      }
      if (user.trim() == "") {
        continue;
      } else {
        members.add(user);
      }
    }
    return Array.from(members).sort((a, b) => {
      return a.localeCompare(b);
    });
  }
 
  function getGroupMembers(tasks) {
    let members = new Set();
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].classList.contains("hidden") || tasks[i].classList.contains("group-summary")) {
        continue;
      }
      let taskSpan = tasks[i].querySelector("span.status-task");
      if (!taskSpan) {
        continue;
      }
      const className = taskSpan.classList[1];
      if (className == "status-cancel") {
        continue;
      }
      let user = "";
      if (className == "status-closed" || className == "status-done") {
        user = tasks[i].querySelector("td.c-user").textContent;
      } else {
        user = tasks[i].querySelector("td.c-assign>span").textContent;
      }
      if (user.trim() == "") {
        continue;
      } else {
        members.add(user);
      }
    }
    return Array.from(members).sort((a, b) => {
      return a.localeCompare(b);
    });
  }
 
  function addFilterButton(members) {
    let parent = document.querySelector("#mainMenu > div.btn-toolbar.pull-left");
    let filters = document.createElement("div");
    filters.className = "filters";
    for (const member of members) {
      let filter = document.createElement("button");
      filter.className = "filter";
      filter.innerHTML = member;
      filters.append(filter);
    }
    parent.append(filters);
  }
 
  function addBatchConfirmButton() {
    const list = document.querySelectorAll("#taskList > tbody > tr > td.c-actions > a");
    let parent = document.querySelector("#mainMenu > div.btn-toolbar.pull-left");
    let confirmBtn = document.createElement("button");
    confirmBtn.className = "confirm";
    confirmBtn.innerHTML = "批量确认需求";
    parent.append(confirmBtn);
    confirmBtn.onclick = function () {
      for (let i = 0; i < list.length; i++) {
        var title = list[i].getAttribute("title");
        if ("确认研发需求变动" == title) {
          const url = list[i].getAttribute("href");
          doGet(url);
        }
      }
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    };
  }
 
  function getRowSpan(tasks) {
    let indexMap = new Map();
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].classList.contains("hidden")) {
        continue;
      }
      let rowspan = tasks[i].children[0].getAttribute("rowspan");
      if (rowspan) {
        indexMap.set(i, rowspan);
      }
    }
    return indexMap;
  }
 
  function addFilterListener(tasks) {
    let filters = document.querySelectorAll(
      "#mainMenu > div.btn-toolbar.pull-left > div.filters > button.filter"
    );
 
    for (let i = 0; i < filters.length; i++) {
      const member = filters[i].textContent;
      filters[i].onclick = function () {
        let current = document.querySelectorAll(
          "#mainMenu > div.btn-toolbar.pull-left > div.filters > button.filter"
        );
        for (let j = 0; j < current.length; j++) {
          removeClass(current[j], "clicked");
        }
        addClass(filters[i], "clicked");
 
        for (let k = 0; k < tasks.length; k++) {
          if (
            tasks[k].classList.contains("hidden") ||
            tasks[k].classList.contains("group-summary")
          ) {
            continue;
          }
          let assign = tasks[k].querySelector("td.c-assignedTo>a>span").textContent;
          let user = tasks[k].querySelector("td.c-finishedBy").textContent;
          if (assign == member || user == member) {
            removeClass(tasks[k], "hide");
            addClass(tasks[k], "filtered");
          } else {
            removeClass(tasks[k], "filtered");
            addClass(tasks[k], "hide");
          }
        }
      };
    }
  }
 
  function addGroupFilterListener(tasks, indexMap) {
    let filters = document.querySelectorAll(
      "#mainMenu > div.btn-toolbar.pull-left > div.filters > button.filter"
    );
 
    for (let i = 0; i < filters.length; i++) {
      const member = filters[i].textContent;
      filters[i].onclick = function () {
        let current = document.querySelectorAll(
          "#mainMenu > div.btn-toolbar.pull-left > div.filters > button.filter"
        );
        for (let j = 0; j < current.length; j++) {
          removeClass(current[j], "clicked");
        }
        addClass(filters[i], "clicked");
 
        for (let k = 0; k < tasks.length; k++) {
          if (
            tasks[k].classList.contains("hidden") ||
            tasks[k].classList.contains("group-summary")
          ) {
            continue;
          }
          let assign = tasks[k].querySelector("td.c-assign>span").textContent;
          let user = tasks[k].querySelector("td.c-user").textContent;
          if (assign == member || user == member) {
            removeClass(tasks[k], "hide");
            addClass(tasks[k], "filtered");
          } else {
            removeClass(tasks[k], "filtered");
            addClass(tasks[k], "hide");
          }
        }
 
        let indexList = Array.from(indexMap.keys());
        for (let l = 0; l < indexList.length; l++) {
          let index = indexList[l];
          let td = tasks[index].children[0];
          let end = tasks.length;
          if (l != indexList.length - 1) {
            end = indexList[l + 1];
          }
          let count = 0;
          for (let m = index; m < end; m++) {
            const className = tasks[m].className;
            if (className.indexOf("filtered") != -1) {
              count++;
            }
          }
          td.setAttribute("rowspan", count);
 
          let className = tasks[index].className;
          if (className.indexOf("hide") != -1 && count != 0) {
            removeClass(tasks[index], "hide");
            let tds = tasks[index].children;
            for (let n = 1; n < tds.length; n++) {
              addClass(tds[n], "hide");
            }
            td.setAttribute("rowspan", count + 1);
          }
          if (className.indexOf("filtered") != -1) {
            let tds = tasks[index].children;
            for (let n = 1; n < tds.length; n++) {
              removeClass(tds[n], "hide");
            }
          }
        }
      };
    }
  }
 
  function addCleanFilterButton() {
    let clean = document.createElement("button");
    clean.className = "filter clean clicked";
    clean.innerHTML = "重置";
    let filters = document.querySelector("#mainMenu > div.btn-toolbar.pull-left > div.filters");
    filters.append(clean);
  }
 
  function addCleanListener(tasks) {
    let clean = document.querySelector(
      "#mainMenu > div.btn-toolbar.pull-left > div.filters > button.filter.clean"
    );
    let filters = document.querySelectorAll(
      "#mainMenu > div.btn-toolbar.pull-left > div.filters > button.filter"
    );
    clean.onclick = function () {
      for (let i = 0; i < filters.length; i++) {
        removeClass(filters[i], "clicked");
      }
      addClass(clean, "clicked");
 
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].classList.contains("hidden")) {
          continue;
        }
        removeClass(tasks[i], "hide");
        removeClass(tasks[i], "filtered");
      }
    };
  }
 
  function addGroupCleanListener(tasks, indexMap) {
    let clean = document.querySelector(
      "#mainMenu > div.btn-toolbar.pull-left > div.filters > button.filter.clean"
    );
    let filters = document.querySelectorAll(
      "#mainMenu > div.btn-toolbar.pull-left > div.filters > button.filter"
    );
    clean.onclick = function () {
      for (let i = 0; i < filters.length; i++) {
        removeClass(filters[i], "clicked");
      }
      addClass(clean, "clicked");
 
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].classList.contains("hidden")) {
          continue;
        }
        removeClass(tasks[i], "hide");
        removeClass(tasks[i], "filtered");
        let tds = tasks[i].children;
        let rowspan = tds[0].getAttribute("rowspan");
        if (rowspan) {
          for (let j = 0; j < tds.length; j++) {
            removeClass(tds[j], "hide");
          }
        }
        tds[0].setAttribute("rowspan", indexMap.get(i));
      }
    };
  }
 
  function addCollectCheck() {
    let collectCheck = document.createElement("input");
    collectCheck.className = "check";
    collectCheck.setAttribute("type", "checkbox");
    let collectValue = document.createElement("span");
    collectValue.className = "checkValue";
    collectValue.innerText = "隐藏收集";
    let filters = document.querySelector("#mainMenu > div.btn-toolbar.pull-left > div.filters");
    filters.append(collectCheck);
    filters.append(collectValue);
  }
 
  function addCollectCheckListener() {
    let check = document.querySelector(
      "#mainMenu > div.btn-toolbar.pull-left > div.filters > input.check"
    );
    let checkValue = document.querySelector(
      "#mainMenu > div.btn-toolbar.pull-left > div.filters > span.checkValue"
    );
    check.onclick = function () {
      if (check.checked) {
        checkValue.innerHTML = "显示收集";
        const styleStr = `
        .groupSummary.small{
          display: block !important;
          line-height: 16px;
        }
        `;
        let headEle = document.getElementsByTagName("head")[0];
        if (headEle) {
          let styleEle = document.createElement("style");
          styleEle.setAttribute("type", "text/css");
          styleEle.setAttribute("id", "collectStyle");
          styleEle.innerHTML = styleStr;
          headEle.appendChild(styleEle);
        }
      } else {
        checkValue.innerHTML = "隐藏收集";
        if (document.getElementById("collectStyle")) {
          document.getElementById("collectStyle").remove();
        }
      }
    };
  }
 
  function addBatchCreateTask() {
    addBatchButton();
    addBatchModal();
    addBatchListener();
  }
 
  function addBatchButton() {
    const toolBar = document.querySelector(
      "#mainContent > div.main-header.clearfix > div.pull-right.btn-toolbar"
    );
    let batchButton = document.createElement("button");
    batchButton.textContent = "批量工时";
    batchButton.className = "btn btn-primary";
    batchButton.onclick = function () {
      const modal = document.getElementById("importConsumptionModal");
      modal.className = modal.className + " in";
      modal.setAttribute("aria-hidden", false);
      modal.style.display = "block";
      const modalCover = document.createElement("div");
      modalCover.className = "modal-backdrop fade in";
      modalCover.setAttribute("id", "modalCover");
      document.body.append(modalCover);
    };
    toolBar.prepend(batchButton);
  }
 
  function addBatchModal() {
    const parent = document.querySelector("#main > div.container");
    const modal = document.createElement("div");
    modal.innerHTML = `
        <div class="modal-dialog modal-lg modal-simple load-indicator" style="top: 54px;">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal"><i class="icon icon-close"></i></button>
              <h4 class="modal-title">批量工时、优先级</h4>
            </div>
            <div class="modal-body" style="max-height: 367px; overflow: visible;">
            <textarea name="importLines" id="importConsumptions" class="form-control mgb-10" rows="10" placeholder="工时。粘贴文本到文本域中，每行文字作为一条数据。" style="width:50%; float:left;"></textarea>
            <textarea name="importLines" id="importPriority" class="form-control mgb-10" rows="10" placeholder="优先级。粘贴文本到文本域中，每行文字作为一条数据。" style="width:50%;"></textarea>
            </div>
            <div class="modal-footer text-left">
              <button type="button" class="btn btn-primary btn-wide" id="importConsumptionBtn">保存</button>
            </div>
          </div>
        </div>
    `;
    modal.className = "modal fade modal-scroll-insid";
    modal.setAttribute("aria-hidden", true);
    modal.setAttribute("id", "importConsumptionModal");
    modal.style.display = "none";
    parent.append(modal);
  }
 
  function addBatchListener() {
    const modal = document.getElementById("importConsumptionModal");
    const closeBtn = modal.querySelector("button.close");
    closeBtn.onclick = function () {
      modal.className = "modal fade modal-scroll-insid";
      modal.setAttribute("aria-hidden", true);
      modal.style.display = "none";
      document.getElementById("modalCover").remove();
    };
    const saveBtn = document.getElementById("importConsumptionBtn");
    saveBtn.onclick = function () {
      modal.className = "modal fade modal-scroll-insid";
      modal.setAttribute("aria-hidden", true);
      modal.style.display = "none";
      const consumptions = document.getElementById("importConsumptions");
      const consumptionArr = consumptions.value
        .trim()
        .replace(new RegExp("\n+", "gm"), ",")
        .split(",");
      let inputs = document.querySelectorAll("#tableBody>tbody>tr>td:nth-child(7)>input");
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = consumptionArr[i] ? consumptionArr[i] : "";
      }
      consumptions.value = "";
 
      const priorities = document.getElementById("importPriority");
      const priorityArr = priorities.value.trim().replace(new RegExp("\n+", "gm"), ",").split(",");
      let selects = document.querySelectorAll("#tableBody>tbody>tr>td:nth-child(11)>select");
      for (let i = 0; i < selects.length; i++) {
        let value = 3;
        if (priorityArr[i] > 0 && priorityArr[i] < 5) {
          value = priorityArr[i];
        }
        for (let j = 0; j < selects[i].children.length; j++) {
          selects[i].children[j].removeAttribute("selected");
        }
        selects[i].children[value].setAttribute("selected", "selected");
      }
      priorities.value = "";
      document.getElementById("modalCover").remove();
    };
  }
 
  function showBugDetail() {
    const urlOrigin = window.location.origin;
    let trList = document.querySelectorAll("#bugList>tbody>tr");
    for (let i = 0; i < trList.length; i++) {
      let aEle = trList[i].querySelector("td.c-title.text-left>a");
      if (aEle) {
        const href = aEle.getAttribute("href");
        aEle.setAttribute("target", "_blank");
        let idEle = trList[i].querySelector("td.c-id.cell-id>a");
        idEle.setAttribute("target", "_blank");
        const url = urlOrigin + href;
        let bugId = trList[i].getAttribute("data-id");
        let preview = getBugPreviewButton(url);
        let actions = trList[i].querySelector("td.c-actions");
        actions.insertBefore(preview, actions.children[0]);
        const title = aEle.textContent;
        const user = trList[i].querySelector("td.c-assignedTo>a>span").textContent;
        addBugDetailDialog(url, bugId, title, user);
        addPreviewListener(preview, bugId);
      }
    }
  }
 
  /**
   * Create the bug preview button.
   * @param {String} url bug detail url.
   * @returns Bug preview button DOM object.
   */
  function getBugPreviewButton(url) {
    let preview = document.createElement("a");
    preview.setAttribute("class", "btn iframe");
    preview.setAttribute("title", "预览");
    preview.setAttribute("href", url);
    preview.setAttribute("target", "_blank");
    let icon = document.createElement("i");
    icon.setAttribute("class", "icon-eye");
    preview.append(icon);
    return preview;
  }
 
  /**
   * Add bug detail dialog.
   * @param {String} url bug detail url.
   * @param {String} bugId bug id.
   * @param {String} title bug title.
   * @param {String} user bug assigned to.
   */
  async function addBugDetailDialog(url, bugId, title, user) {
    const res = await doGet(url);
    let temp = document.createElement("div");
    temp.innerHTML = res;
    let bugDetail = temp.querySelector("#mainContent>div.main-col.col-8");
    bugDetail.children[2].remove();
    removeClass(bugDetail, "col-8");
    let bugDetailDialog = document.createElement("div");
    bugDetailDialog.setAttribute("id", "bugDetail" + bugId);
    bugDetailDialog.setAttribute("class", "bugDetail");
 
    let closeButton = document.createElement("button");
    closeButton.innerHTML = '<i class="icon-close"></i>';
    let id = document.createElement("span");
    id.textContent = bugId;
    id.setAttribute("class", "id");
    let dialogTitle = document.createElement("span");
    dialogTitle.innerText = user + " - " + title;
    dialogTitle.setAttribute("title", title);
    let dialogHeader = document.createElement("div");
    dialogHeader.setAttribute("class", "header");
    dialogHeader.append(id);
    dialogHeader.append(dialogTitle);
    dialogHeader.append(closeButton);
    let dialogBody = document.createElement("div");
    dialogBody.setAttribute("class", "body");
    dialogBody.append(bugDetail);
    bugDetailDialog.append(dialogHeader);
    bugDetailDialog.append(dialogBody);
 
    closeButton.addEventListener("click", function (e) {
      bugDetailDialog.style.display = "none";
    });
    bugList.add(bugDetailDialog);
    document.body.append(bugDetailDialog);
  }
 
  /**
   * Add preview button mouseover event listener.
   * @param {Object} element The preview button DOM object.
   * @param {String} bugId bug id.
   */
  function addPreviewListener(element, bugId) {
    element.addEventListener("mouseover", function (e) {
      let bugDetail = document.getElementById("bugDetail" + bugId);
      if (bugDetail) {
        for (let bug of bugList) {
          bug.style.display = "none";
        }
        bugDetail.style.display = "block";
        bugDetail.style.left = (window.innerWidth - bugDetail.offsetWidth) / 2 + "px";
        let bugBody = bugDetail.querySelector("div.body");
        const maxHeight = window.innerHeight - 55 - 32;
        bugBody.style.maxHeight = maxHeight + "px";
      }
    });
  }
 
  /**
   * Add batch creation button for case lib.
   */
  function addBatchCreateCaseLib() {
    addBatchButtonCaseLib();
    addBatchModalCaseLib();
    addBatchListenerCaseLib();
  }
 
  function addBatchButtonCaseLib() {
    const toolBar = document.querySelector(
      "#mainContent > div.main-header > div.pull-right.btn-toolbar"
    );
    let batchButton = document.createElement("button");
    batchButton.textContent = "批量优先级";
    batchButton.className = "btn btn-info";
    batchButton.onclick = function () {
      const modal = document.getElementById("importCaseLibPriorityModal");
      modal.className = modal.className + " in";
      modal.setAttribute("aria-hidden", false);
      modal.style.display = "block";
      const modalCoverCaseLib = document.createElement("div");
      modalCoverCaseLib.className = "modal-backdrop fade in";
      modalCoverCaseLib.setAttribute("id", "modalCoverCaseLib");
      document.body.append(modalCoverCaseLib);
    };
    toolBar.prepend(batchButton);
  }
 
  function addBatchModalCaseLib() {
    const parent = document.querySelector("#main > div.container");
    const modal = document.createElement("div");
    modal.innerHTML = `
        <div class="modal-dialog modal-lg modal-simple load-indicator" style="top: 54px;">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal"><i class="icon icon-close"></i></button>
              <h4 class="modal-title">批量优先级</h4>
            </div>
            <div class="modal-body" style="max-height: 367px; overflow: visible;">
            <textarea name="importLines" id="importPriorityCaseLib" class="form-control mgb-10" rows="10" placeholder="优先级。粘贴文本到文本域中，每行文字作为一条数据。" style="width:100%;"></textarea>
            </div>
            <div class="modal-footer text-left">
              <button type="button" class="btn btn-primary btn-wide" id="importCaseLibPriorityBtn">保存</button>
            </div>
          </div>
        </div>
    `;
    modal.className = "modal fade modal-scroll-insid";
    modal.setAttribute("aria-hidden", true);
    modal.setAttribute("id", "importCaseLibPriorityModal");
    modal.style.display = "none";
    parent.append(modal);
  }
 
  function addBatchListenerCaseLib() {
    const modal = document.getElementById("importCaseLibPriorityModal");
    const closeBtn = modal.querySelector("button.close");
    closeBtn.onclick = function () {
      modal.className = "modal fade modal-scroll-insid";
      modal.setAttribute("aria-hidden", true);
      modal.style.display = "none";
      document.getElementById("modalCoverCaseLib").remove();
    };
    const saveBtn = document.getElementById("importCaseLibPriorityBtn");
    saveBtn.onclick = function () {
      modal.className = "modal fade modal-scroll-insid";
      modal.setAttribute("aria-hidden", true);
      modal.style.display = "none";
 
      const priorities = document.getElementById("importPriorityCaseLib");
      const priorityArr = priorities.value.trim().replace(new RegExp("\n+", "gm"), ",").split(",");
      let selects = document.querySelectorAll("#tableBody>tbody>tr>td:nth-child(5)>div>a>span");
      for (let i = 0; i < priorityArr.length; i++) {
        let value = 3;
        if (priorityArr[i] > 0 && priorityArr[i] < 5) {
          value = priorityArr[i];
        }
        selects[i].setAttribute("title", value);
        selects[i].textContent = value;
      }
      priorities.value = "";
      document.getElementById("modalCoverCaseLib").remove();
    };
  }
 
  /**
   * Add the button of editing task.
   */
  function addEditTask(tasks) {
    let editButtons = document.querySelectorAll("td.c-actions>a.btn[title=编辑任务]");
    editButtons.forEach(button => {
      button.setAttribute("target", "_blank");
    });
    let parent = document.querySelector("#mainMenu > div.btn-toolbar.pull-left");
    let editButton = document.createElement("button");
    editButton.className = "edit";
    editButton.innerHTML = "编辑任务";
    editButton.title = "未选择任务时，编辑当前页面所有任务";
    parent.append(editButton);
 
    editButton.onclick = function () {
      let allTasks = [];
      let checkedTasks = [];
      tasks.forEach(task => {
        let editBtn = task.querySelector("td.c-actions>a.btn[title=编辑任务]");
        if (editBtn) {
          allTasks.push(editBtn);
          let inputEle = task.querySelector("td.c-id input[type=checkbox]");
          if (inputEle && inputEle.checked) {
            checkedTasks.push(editBtn);
          }
        }
      });
      if (checkedTasks.length != 0) {
        checkedTasks.forEach(btn => btn.click());
      } else {
        allTasks.forEach(btn => btn.click());
      }
    };
  }
 
  /**
   * call the API and return the response.
   * @param {String} url url.
   */
  function doGet(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "get",
        url: url,
        onload: function (res) {
          if (res.status === 200) {
            resolve(res.response);
          } else {
            console.warn("Get " + url + " Failed! Status: " + res.status);
            console.debug(res);
          }
        },
        onerror: function (err) {
          console.error("Get " + url + " Failed! Status: " + err.status);
          console.debug(err);
        },
      });
    });
  }
 
  function removeClass(element, className) {
    let name = element.className;
    if (name.indexOf(className) != -1) {
      element.className = name.replace(className, "").replace(/\s+/g, " ");
    }
  }
 
  function addClass(element, className) {
    let name = element.className;
    if (name.indexOf(className) == -1) {
      element.className = (name + " " + className).replace(/\s+/g, " ");
    }
  }
 
  /**
   * Log the title and version at the front of the console.
   * @param {String} title title.
   * @param {String} version script version.
   */
  function logInfo(title, version) {
    console.clear();
    const titleStyle = "color:white;background-color:#606060";
    const versionStyle = "color:white;background-color:#1475b2";
    const logTitle = " " + title + " ";
    const logVersion = " " + version + " ";
    console.log("%c" + logTitle + "%c" + logVersion, titleStyle, versionStyle);
  }
})();