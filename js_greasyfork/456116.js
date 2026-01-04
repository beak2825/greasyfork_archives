// ==UserScript==
// @name         LDS Web Tools
// @namespace    zkw.at
// @version      0.8
// @description  Adds a clock to the SAP virtual terminal, showing the remaining worktime for today
// @author       LDS Team
// @match        https://zkrcip010001.sap.intranet.zkw.at:44300/sap/bc/ui2/flp*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zkw.at
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456116/LDS%20Web%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/456116/LDS%20Web%20Tools.meta.js
// ==/UserScript==

"use strict";
(() => {
  // src/ui/wrapper.ts
  var Wrapper = class {
    exists() {
      return Boolean(this.element());
    }
  };

  // src/ui/terminal/wrappers/clockInIndicator.ts
  var ClockInIndicator = class extends Wrapper {
    constructor() {
      super(...arguments);
      this.lastClockStatus = -1 /* _INVALID */;
      this.onClockStatusChange = null;
    }
    element() {
      return document.querySelector("span.sapMObjStatusText");
    }
    update() {
      this.checkClockStatus();
    }
    checkClockStatus() {
      const status = this.clockStatus();
      if (status != this.lastClockStatus) {
        this.lastClockStatus = status;
        if (this.onClockStatusChange) {
          this.onClockStatusChange(status);
        }
      }
    }
    clockStatus() {
      const e = this.element();
      if (!e) {
        return -1 /* _INVALID */;
      }
      if (["present", "anwesend"].includes(e.innerText)) {
        return 0 /* ClockedIn */;
      }
      if (["absent", "abwesend"].includes(e.innerText)) {
        return 1 /* ClockedOut */;
      }
      return -1 /* _INVALID */;
    }
  };

  // node_modules/uuid/dist/esm-browser/rng.js
  var getRandomValues;
  var rnds8 = new Uint8Array(16);
  function rng() {
    if (!getRandomValues) {
      getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
      if (!getRandomValues) {
        throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
      }
    }
    return getRandomValues(rnds8);
  }

  // node_modules/uuid/dist/esm-browser/stringify.js
  var byteToHex = [];
  for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 256).toString(16).slice(1));
  }
  function unsafeStringify(arr, offset = 0) {
    return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
  }

  // node_modules/uuid/dist/esm-browser/native.js
  var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
  var native_default = {
    randomUUID
  };

  // node_modules/uuid/dist/esm-browser/v4.js
  function v4(options, buf, offset) {
    if (native_default.randomUUID && !buf && !options) {
      return native_default.randomUUID();
    }
    options = options || {};
    const rnds = options.random || (options.rng || rng)();
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = rnds[i];
      }
      return buf;
    }
    return unsafeStringify(rnds);
  }
  var v4_default = v4;

  // src/ui/customElement.ts
  var CustomElement = class {
    constructor() {
      this.id = v4_default();
    }
    remove() {
      const e = this.element();
      if (!e) {
        return;
      }
      e.remove();
    }
    element() {
      return document.getElementById(this.id);
    }
    exists() {
      return Boolean(this.element());
    }
  };

  // src/ui/terminal/infoText.ts
  var InfoText = class extends CustomElement {
    element() {
      return super.element();
    }
    containerDiv() {
      const e = this.element();
      if (!e) {
        return null;
      }
      return e.querySelector("div div");
    }
    textElement() {
      const e = this.containerDiv();
      if (!e) {
        return null;
      }
      return e.querySelector("span");
    }
    build() {
      let e = this.element();
      if (!e) {
        e = document.createElement("div");
        e.id = this.id;
        e.className = "sapMOHAttrRow";
        const div2 = document.createElement("div");
        div2.className = "sapMOHAttr";
        div2.setAttribute("style", "width: 100%");
        const div3 = document.createElement("div");
        div3.className = "sapMObjectAttributeDiv";
        const span = document.createElement("span");
        span.className = "sapMObjectAttributeText";
        e.appendChild(div2);
        div2.appendChild(div3);
        div3.appendChild(span);
      }
      return e;
    }
    append(appendElement) {
      const e = this.containerDiv();
      if (!e) {
        return;
      }
      e.appendChild(appendElement);
    }
    setText(text, color = "#666") {
      const span = this.textElement();
      if (!span) {
        return;
      }
      span.innerText = text;
      span.setAttribute("style", `color: ${color}`);
    }
  };

  // src/settings.ts
  var Settings = class {
    constructor() {
      this.overtime = 0;
    }
  };
  var SettingsManager = class {
    static get() {
      const val = localStorage.getItem("userSettings");
      if (val) {
        return JSON.parse(val);
      } else {
        return new Settings();
      }
    }
    static set(settings) {
      localStorage.setItem("userSettings", JSON.stringify(settings));
    }
    static clear() {
      this.set(new Settings());
    }
    static setOvertime(overtime) {
      const s = this.get();
      s.overtime = overtime;
      this.set(s);
    }
  };

  // src/utils.ts
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function timeToMs(hours, minutes, seconds) {
    minutes += hours * 60;
    seconds += minutes * 60;
    return seconds * 1e3;
  }
  function dateToTime(date) {
    const sec = String(date.getSeconds()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    return `${hour}:${min}:${sec}`;
  }
  function msToTimeStr(ms, format = 1 /* HourMinSec */) {
    const sec = String(Math.floor(ms / 1e3 % 60)).padStart(2, "0");
    const min = String(Math.floor(ms / (60 * 1e3) % 60)).padStart(2, "0");
    const hour = String(Math.floor(ms / (60 * 60 * 1e3) % 24)).padStart(2, "0");
    if (format == 1 /* HourMinSec */) {
      return `${hour}:${min}:${sec}`;
    }
    if (format == 0 /* HourMin */) {
      return `${hour}:${min}`;
    }
    return "";
  }
  function getFavicon() {
    for (const node of document.getElementsByTagName("link")) {
      if ((node.getAttribute("rel") == "icon" || node.getAttribute("rel") == "shortcut icon") && node.hasAttribute("href")) {
        return node.getAttribute("href");
      }
    }
    return "";
  }
  var observeDOM = function() {
    return function(obj, callback, options) {
      var mutationObserver = new MutationObserver(callback);
      mutationObserver.observe(obj, options);
      return mutationObserver;
    };
  }();

  // src/terminal/settingsDialog.ts
  function getOvertime(e) {
    const times = e.value.split(":").filter((i) => i !== "");
    if (times.length == 1) {
      return timeToMs(Number(times[0]), 0, 0);
    }
    if (times.length == 2) {
      return timeToMs(Number(times[0]), Number(times[1]), 0);
    }
    return 0;
  }
  var SettingsDialog = class extends CustomElement {
    element() {
      return super.element();
    }
    build() {
      let e = this.element();
      if (e) {
        return e;
      }
      e = document.createElement("dialog");
      document.body.appendChild(e);
      e.id = this.id;
      e.innerHTML = `
<form>
    <p>
        <label title="The amount of overtime hours you'd like to work">
            Overtime Hours
            <input id="overtimeInput" type="time" min="00:00" max="04:00" title="The amount of overtime hours you'd like to work"></input>
        </label>
    </p>
    <div>
        <button id="cancelBtn" value="cancel" formmethod="dialog">Cancel</button>
        <button id="confirmBtn" value="default">Confirm</button>
    </div>
</form>`;
      const html = this.html();
      if (!html) {
        return e;
      }
      html.confirmButton.onclick = () => {
        if (e) {
          e.returnValue = "ok" /* Ok */;
          e.close();
        }
      };
      html.cancelButton.onclick = () => {
        if (e) {
          e.returnValue = "cancel" /* Cancel */;
          e.close();
        }
      };
      return e;
    }
    html() {
      const e = this.element();
      if (!e) {
        return null;
      }
      return {
        confirmButton: e.querySelector("#confirmBtn"),
        cancelButton: e.querySelector("#cancelBtn"),
        overtimeInput: e.querySelector("#overtimeInput")
      };
    }
    loadSettings(s) {
      const html = this.html();
      if (!html) {
        return;
      }
      html.overtimeInput.value = msToTimeStr(s.overtime, 0 /* HourMin */);
    }
    getSettings() {
      const s = new Settings();
      const html = this.html();
      if (!html) {
        return s;
      }
      s.overtime = getOvertime(html.overtimeInput);
      return s;
    }
    show() {
      let e = this.element();
      if (!e) {
        e = this.build();
      }
      e.showModal();
    }
  };

  // src/ui/terminal/settingsButton.ts
  var SettingsButton = class extends CustomElement {
    constructor() {
      super(...arguments);
      this.dialog = new SettingsDialog();
    }
    element() {
      return super.element();
    }
    build() {
      let e = this.element();
      if (e) {
        return e;
      }
      this.dialog.build();
      e = document.createElement("button");
      e.id = this.id;
      e.innerText = "Settings";
      e.onclick = () => {
        const eDlg = this.dialog.element();
        if (!eDlg) {
          return;
        }
        eDlg.onclose = () => {
          if (!eDlg) {
            return;
          }
          if (eDlg.returnValue == "ok") {
            SettingsManager.set(this.dialog.getSettings());
          }
        };
        this.dialog.loadSettings(SettingsManager.get());
        this.dialog.show();
      };
      return e;
    }
  };

  // src/ui/terminal/wrappers/infoBox.ts
  var InfoBox = class extends Wrapper {
    constructor() {
      super(...arguments);
      this.infoTexts = [];
      this.settingsButton = new SettingsButton();
    }
    element() {
      return document.querySelector(".sapMOH.sapMOHBgTransparent .sapMOHBottomRow");
    }
    addInfoText() {
      const text = new InfoText();
      this.infoTexts.push(text);
      this.update();
      return text;
    }
    removeInfoTexts() {
      for (const text of this.infoTexts) {
        text.remove();
      }
      this.infoTexts = [];
    }
    update() {
      const e = this.element();
      if (!e) {
        return;
      }
      if (!this.settingsButton.exists()) {
        e.append(this.settingsButton.build());
      }
      for (const text of this.infoTexts) {
        if (!text.exists()) {
          e.append(text.build());
        }
      }
    }
  };

  // src/ui/terminal/wrappers/tab.ts
  var clickElement = (e) => {
    e.dispatchEvent(new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      view: window
    }));
    e.dispatchEvent(new MouseEvent("mouseup", {
      bubbles: true,
      cancelable: true,
      view: window
    }));
  };
  var Tab = class {
    constructor() {
      this.select = () => {
        if (this.isSelected()) {
          return;
        }
        const e = this.selector.element();
        if (!e) {
          return;
        }
        clickElement(e);
      };
    }
    exists() {
      return this.selector.exists();
    }
    isSelected() {
      const e = this.selector.element();
      if (!e) {
        return false;
      }
      return e.classList.contains("sapMITBSelected");
    }
  };

  // src/ui/terminal/wrappers/terminalTab/selector.ts
  var Selector = class extends Wrapper {
    element() {
      for (const e of document.querySelectorAll(".sapMITBItem.sapMITBItemNoCount.sapMITBVertical.sapMITBFilter.sapMITBFilterNeutral")) {
        const textElem = e.querySelector(".sapMITBText");
        if (textElem && ["Terminal"].includes(textElem.innerText)) {
          return e;
        }
      }
      return null;
    }
  };

  // src/ui/terminal/wrappers/terminalTab/terminalTab.ts
  var TerminalTab = class extends Tab {
    constructor() {
      super(...arguments);
      this.selector = new Selector();
    }
  };

  // src/terminal/clockTime.ts
  var isClockIn = (text) => {
    return ["Clock-in", "Kommen"].includes(text);
  };
  var ClockTime = class {
    constructor(date, clockIn, reason) {
      this.date = new Date(date);
      this.clockIn = isClockIn(clockIn);
      this.reason = reason;
    }
  };

  // src/ui/terminal/wrappers/timeEventsTab/selector.ts
  var Selector2 = class extends Wrapper {
    element() {
      for (const e of document.querySelectorAll(".sapMITBItem.sapMITBItemNoCount.sapMITBVertical.sapMITBFilter.sapMITBFilterNeutral")) {
        const textElem = e.querySelector(".sapMITBText");
        if (textElem && ["Time events", "Auswertung"].includes(textElem.innerText)) {
          return e;
        }
      }
      return null;
    }
  };

  // src/ui/terminal/wrappers/timeEventsTab/table.ts
  var Table = class extends Wrapper {
    element() {
      return document.querySelector("table.sapMListTbl.sapMListUl.sapMListShowSeparatorsAll.sapMListModeNone");
    }
    rowsReady() {
      const e = this.element();
      if (!e) {
        return false;
      }
      const firstCell = e.querySelector("tbody.sapMListItems.sapMTableTBody tr td.sapMListTblCell");
      if (!firstCell) {
        return false;
      }
      return firstCell?.innerText != "";
    }
    rows() {
      const rows = [];
      const e = this.element();
      if (e) {
        for (const row of e.querySelectorAll("tbody.sapMListItems.sapMTableTBody tr")) {
          rows.push(row);
        }
      }
      return rows;
    }
  };

  // src/ui/terminal/wrappers/timeEventsTab/timeEventsTab.ts
  var getColNr = (row, nr) => {
    const cols = row.querySelectorAll("td.sapMListTblCell");
    for (const col of cols) {
      if (col.getAttribute("headers")?.endsWith(`--catalogTable_col${nr}`)) {
        return col;
      }
    }
    return null;
  };
  var stringsToDate = (date, time) => {
    date = date.split(".").reverse().join("-");
    return `${date}T${time}`;
  };
  var TimeEventsTab = class extends Tab {
    constructor() {
      super(...arguments);
      this.selector = new Selector2();
      this.table = new Table();
    }
    clockTimesReady() {
      return this.table.rowsReady();
    }
    getClockTimes() {
      const clockTimes = [];
      for (const row of this.table.rows()) {
        const colDate = getColNr(row, 1);
        const colDescription = getColNr(row, 3);
        const colTime = getColNr(row, 4);
        const colReason = getColNr(row, 5);
        if (!(colDate && colDescription && colTime && colReason)) {
          continue;
        }
        const clockTime = new ClockTime(stringsToDate(colDate.innerText, colTime.innerText), colDescription.innerText, colReason.innerText);
        clockTimes.push(clockTime);
      }
      clockTimes.reverse();
      return clockTimes;
    }
  };

  // src/ui/terminal/wrappers/title.ts
  var Title = class extends Wrapper {
    element() {
      const title = document.querySelector("div.sapMBarPH.sapMBarContainer div span");
      if (!title) {
        return null;
      }
      if (!["Virtuelles Terminal", "virtual Terminal"].includes(title.innerText)) {
        return null;
      }
      return title;
    }
  };

  // src/ui/terminal/terminal.ts
  var Terminal = class {
    constructor() {
      this.title = new Title();
      this.clockInIndicator = new ClockInIndicator();
      this.infoBox = new InfoBox();
      this.terminalTab = new TerminalTab();
      this.timeEventsTab = new TimeEventsTab();
    }
    update() {
      this.clockInIndicator.update();
      this.infoBox.update();
    }
    ready() {
      if (!this.title.exists()) {
        return false;
      }
      if (!this.clockInIndicator.exists()) {
        return false;
      }
      if (!this.infoBox.exists()) {
        return false;
      }
      if (!this.terminalTab.exists()) {
        return false;
      }
      if (!this.timeEventsTab.exists()) {
        return false;
      }
      return true;
    }
    selectedTab() {
      if (this.terminalTab.isSelected()) {
        return this.terminalTab;
      }
      if (this.timeEventsTab.isSelected()) {
        return this.timeEventsTab;
      }
      return null;
    }
    setInfoTexts(texts) {
      this.infoBox.removeInfoTexts();
      for (const text of texts) {
        this.infoBox.addInfoText().setText(text.text, text.color);
      }
      return this.infoBox.addInfoText();
    }
  };

  // src/colorText.ts
  var ColorText = class {
    constructor(text, color = "#666") {
      this.text = text;
      this.color = color;
    }
  };

  // src/notifications.ts
  async function sendNotification(title, options) {
    try {
      const n = new Notification(title, {
        icon: getFavicon(),
        ...options
      });
      setTimeout(() => {
        n.close();
      }, 5e3);
    } catch (error) {
      console.log(`Couldn't send notification '${title}'`);
    }
  }

  // src/terminal/timeCalculator.ts
  var nowMs = () => {
    return (/* @__PURE__ */ new Date()).getTime();
  };
  var calcTextColor = (remaining_time, critical_window) => {
    const ratio = Math.max(0, 1 - remaining_time / critical_window);
    const red = Math.max(0, Math.min(255, Math.floor(102 + 153 * ratio)));
    const green = Math.max(0, Math.min(255, Math.floor(102 - 102 * ratio)));
    const blue = Math.max(0, Math.min(255, Math.floor(102 - 102 * ratio)));
    return `#${red.toString(16).padStart(2, "0")}${green.toString(16).padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
  };
  function workTime() {
    return timeToMs(7, 42, 0);
  }
  function breakTime() {
    return timeToMs(0, 30, 0);
  }
  function calcTotalTime(clocks) {
    let total = 0;
    if (clocks.length == 0) {
      return total;
    }
    let last_clock = clocks.shift();
    for (const clock of clocks) {
      if (last_clock.clockIn) {
        total += clock.date.getTime() - last_clock.date.getTime();
      }
      last_clock = clock;
    }
    if (last_clock.clockIn) {
      total += nowMs() - last_clock.date.getTime();
    }
    return total;
  }
  var TimeCalculator = class {
    constructor(terminal) {
      this.lastNotificationTime = 0;
      this.terminal = terminal;
    }
    getClockTimesToday() {
      const todayTimes = [];
      for (const time of this.terminal.getClockTimes()) {
        if (time.date.getDate() == (/* @__PURE__ */ new Date()).getDate()) {
          todayTimes.push(time);
        }
      }
      return todayTimes;
    }
    /**
     * @returns ms difference
     */
    workedTimeToday() {
      return calcTotalTime(this.getClockTimesToday());
    }
    wantedOvertime() {
      return SettingsManager.get().overtime;
    }
    /**
     * Time left to work. Doesn't take into account clock-out time limit of 20:00!
     * For that, use possibleRemainingTimeMs()
     */
    remainingTimeMs() {
      return workTime() + breakTime() + this.wantedOvertime() - this.workedTimeToday();
    }
    /**
     * Actual time the user has/can work, so they don't exceed 20:00
     */
    possibleRemainingTimeMs() {
      return this.remainingTimeMs() - this.impossibleRemainingTimeMs();
    }
    latestClockOutTime() {
      const date = /* @__PURE__ */ new Date();
      date.setHours(20, 0, 0);
      return date;
    }
    clockOutTime() {
      const clockOutTime = new Date(nowMs() + this.remainingTimeMs());
      if (clockOutTime.getTime() > this.latestClockOutTime().getTime()) {
        return this.latestClockOutTime();
      }
      return clockOutTime;
    }
    /**
     * Remaining time to work that would lie outside of possible working hours.
     */
    impossibleRemainingTimeMs() {
      const clockOutTime = new Date(nowMs() + this.remainingTimeMs());
      const diffMs = clockOutTime.getTime() - this.latestClockOutTime().getTime();
      return Math.max(0, diffMs);
    }
    async calcTexts() {
      const clockStatus = this.terminal.clockStatus();
      const remainingTimeMs = this.possibleRemainingTimeMs();
      const clockOutTime = this.clockOutTime();
      const impossibleMs = this.impossibleRemainingTimeMs();
      const remainingTimeColor = calcTextColor(remainingTimeMs, this.wantedOvertime() / 2);
      const texts = [];
      if (clockStatus == 0 /* ClockedIn */) {
        if (remainingTimeMs < 0) {
          texts.push(new ColorText(`Time exceeded by ${msToTimeStr(-remainingTimeMs)}!`, remainingTimeColor));
        } else {
          texts.push(new ColorText(`${msToTimeStr(remainingTimeMs)} remaining (clock out at ${dateToTime(clockOutTime)})`, remainingTimeColor));
          if (impossibleMs > 0) {
            texts.push(new ColorText(`Can't do ${msToTimeStr(impossibleMs)} before clock-out`, "#F96"));
          }
        }
      } else if (clockStatus == 1 /* ClockedOut */) {
        texts.push(new ColorText(`You worked ${msToTimeStr(this.workedTimeToday() - breakTime())} today`));
      } else {
        texts.push(new ColorText("Error: Invalid clock status", "#F00"));
      }
      return texts;
    }
    trySendNotification() {
      if (this.terminal.clockStatus() != 0 /* ClockedIn */) {
        return;
      }
      const remainingTimeMs = this.possibleRemainingTimeMs();
      if (remainingTimeMs < 0 && this.lastNotificationTime + timeToMs(0, 1, 0) < nowMs()) {
        this.lastNotificationTime = nowMs();
        sendNotification("Clock-out", {
          body: `You need to clock out now!`
        });
      } else if (remainingTimeMs < timeToMs(0, 15, 0) && this.lastNotificationTime + timeToMs(0, 5, 0) < nowMs()) {
        this.lastNotificationTime = nowMs();
        sendNotification("Clock-out", {
          body: `Don't forget to clock out in ${msToTimeStr(remainingTimeMs)}`
        });
      }
    }
  };

  // src/terminal/terminal.ts
  var Terminal2 = class {
    constructor() {
      this.ui = new Terminal();
      this.clockTimesCache = [];
      this.running = false;
      this.timeCalculator = new TimeCalculator(this);
      this.ui.clockInIndicator.onClockStatusChange = async () => {
        while (this.ui.title.exists() && !this.ui.clockInIndicator.exists()) {
          await sleep(100);
        }
        this.refreshClockTimes();
      };
    }
    getClockTimes() {
      if (this.ui.timeEventsTab.clockTimesReady()) {
        this.clockTimesCache = this.ui.timeEventsTab.getClockTimes();
      }
      return this.clockTimesCache;
    }
    clockStatus() {
      return this.ui.clockInIndicator.clockStatus();
    }
    async refreshClockTimes() {
      if (!this.ui.ready()) {
        return;
      }
      const timeEventsTab = this.ui.timeEventsTab;
      const previousTab = this.ui.selectedTab();
      while (!timeEventsTab.clockTimesReady()) {
        timeEventsTab.select();
        await sleep(100);
      }
      this.clockTimesCache = timeEventsTab.getClockTimes();
      if (previousTab) {
        previousTab.select();
      }
    }
    setInfoTexts(texts) {
      this.ui.setInfoTexts(texts);
    }
    clockTimesOutOfDate() {
      return this.clockTimesCache.length == 0;
    }
    async updateTime() {
      if (this.clockTimesOutOfDate()) {
        await this.refreshClockTimes();
      }
      this.setInfoTexts(await this.timeCalculator.calcTexts());
      this.timeCalculator.trySendNotification();
    }
    async update() {
      if (!this.running) {
        return;
      }
      try {
        if (this.ui.ready()) {
          this.ui.update();
          await this.updateTime();
        }
      } catch (e) {
        this.setInfoTexts([new ColorText(e.message, "#F00")]);
        throw e;
      }
      setTimeout(async () => {
        await this.update();
      }, 500);
    }
    stop() {
      this.running = false;
    }
    start() {
      if (this.running) {
        return;
      }
      this.running = true;
      this.update();
    }
  };

  // src/ui/leaveRequests/legendItem.ts
  var LegendItem = class extends CustomElement {
    constructor() {
      super(...arguments);
      this.text = "";
      this.color = "";
    }
    element() {
      return super.element();
    }
    squareDiv() {
      return this.element()?.querySelector("div.sapUiUnifiedLegendSquare");
    }
    squareColorDiv() {
      return this.element()?.querySelector("div.sapUiUnifiedLegendSquareColor");
    }
    textDiv() {
      return this.element()?.querySelector("div.sapUiUnifiedLegendDescription");
    }
    build() {
      let e = this.element();
      if (!e) {
        e = document.createElement("div");
        e.id = this.id;
        e.role = "listitem";
        e.className = "sapUiUnifiedLegendItem";
        const squareDiv = document.createElement("div");
        squareDiv.className = "sapUiUnifiedLegendSquare";
        e.appendChild(squareDiv);
        const squareColorDiv = document.createElement("div");
        squareColorDiv.className = "sapUiUnifiedLegendSquareColor";
        squareColorDiv.style.background = this.color;
        squareDiv.appendChild(squareColorDiv);
        const textDiv = document.createElement("div");
        textDiv.className = "sapUiUnifiedLegendDescription";
        textDiv.innerText = this.text;
        e.appendChild(textDiv);
      }
      return e;
    }
    setText(text) {
      this.text = text;
      const div = this.textDiv();
      if (div) {
        div.innerText = text;
      }
    }
    setColor(color) {
      this.color = color;
      const div = this.squareColorDiv();
      if (div) {
        div.style.background = color;
      }
    }
  };

  // src/ui/leaveRequests/wrappers/legend.ts
  var Legend = class extends Wrapper {
    constructor() {
      super(...arguments);
      this.items = [];
    }
    element() {
      return document.querySelector("div.sapUiUnifiedLegendItems");
    }
    addItem(item) {
      this.items.push(item);
      this.update();
    }
    update() {
      const e = this.element();
      if (!e) {
        return;
      }
      for (const item of this.items) {
        if (!item.exists()) {
          e.appendChild(item.build());
        }
      }
    }
  };

  // src/ui/leaveRequests/leaveRequests.ts
  var wfhColor = "#00b3df";
  var timeOffColor = "#01c13b";
  var LeaveRequests = class {
    constructor() {
      this.legend = new Legend();
      this.wfhItem = new LegendItem();
      this.timeOffItem = new LegendItem();
      this.wfhItem.setText("Working-from-Home");
      this.wfhItem.setColor(wfhColor);
      this.legend.addItem(this.wfhItem);
      this.timeOffItem.setText("Time off");
      this.timeOffItem.setColor(timeOffColor);
      this.legend.addItem(this.timeOffItem);
    }
    update() {
      if (!this.ready()) {
        return;
      }
      this.legend.update();
      for (const box of this.wfhBoxes()) {
        const span = box.querySelector("span");
        if (span) {
          span.style.boxShadow = wfhColor + " inset 0 -0.25rem 0";
        }
      }
      for (const box of this.timeOffBoxes()) {
        const span = box.querySelector("span");
        if (span) {
          span.style.boxShadow = timeOffColor + " inset 0 -0.25rem 0";
        }
      }
    }
    ready() {
      if (!this.legend.exists()) {
        return false;
      }
      if (!Boolean(document.querySelector("div.sapUiCalItem span.sapUiCalItemText"))) {
        return false;
      }
      return true;
    }
    approvedRequestBoxes() {
      return document.querySelectorAll("div.sapUiCalItem.sapUiCalItemType08");
    }
    wfhBoxes() {
      let wfh = [];
      for (const box of this.approvedRequestBoxes()) {
        if (box.title == "Working-from-Home") {
          wfh.push(box);
        }
      }
      return wfh;
    }
    timeOffBoxes() {
      let wfh = [];
      for (const box of this.approvedRequestBoxes()) {
        if (box.title == "Time off") {
          wfh.push(box);
        }
      }
      return wfh;
    }
  };

  // src/leaveRequests/leaveRequests.ts
  var LeaveRequests2 = class {
    constructor() {
      this.ui = new LeaveRequests();
      this.running = false;
    }
    async update() {
      if (!this.running) {
        return;
      }
      try {
        if (this.ui.ready()) {
          this.ui.update();
        }
      } catch (e) {
        throw e;
      }
      setTimeout(async () => {
        await this.update();
      }, 500);
    }
    stop() {
      this.running = false;
    }
    start() {
      if (this.running) {
        return;
      }
      this.running = true;
      this.update();
    }
  };

  // src/main.ts
  (() => {
    "use strict";
    const terminal = new Terminal2();
    terminal.start();
    const leaveRequests = new LeaveRequests2();
    leaveRequests.start();
  })();
})();
