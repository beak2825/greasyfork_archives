// ==UserScript==
// @name         GitHub 仓库文件按提交时间排序（GitHub Commit Sort）
// @namespace    xiaohuohumax/userscripts/github-commit-sort
// @version      1.1.3
// @author       xiaohuohumax
// @description  GitHub 仓库无法快速查看最新的变更文件？试试这个 GitHub 仓库文件按提交时间排序的用户脚本吧！
// @license      MIT
// @icon         https://github.githubassets.com/favicons/favicon-dark.png
// @source       https://github.com/xiaohuohumax/userscripts.git
// @match        https://github.com/*
// @grant        GM_addValueChangeListener
// @grant        GM_getValue
// @grant        GM_setValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/522083/GitHub%20%E4%BB%93%E5%BA%93%E6%96%87%E4%BB%B6%E6%8C%89%E6%8F%90%E4%BA%A4%E6%97%B6%E9%97%B4%E6%8E%92%E5%BA%8F%EF%BC%88GitHub%20Commit%20Sort%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/522083/GitHub%20%E4%BB%93%E5%BA%93%E6%96%87%E4%BB%B6%E6%8C%89%E6%8F%90%E4%BA%A4%E6%97%B6%E9%97%B4%E6%8E%92%E5%BA%8F%EF%BC%88GitHub%20Commit%20Sort%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  const debounce = ({ delay }, func) => {
    let timer = void 0;
    let active = true;
    const debounced = (...args) => {
      if (active) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          active && func(...args);
          timer = void 0;
        }, delay);
      } else {
        func(...args);
      }
    };
    debounced.isPending = () => {
      return timer !== void 0;
    };
    debounced.cancel = () => {
      active = false;
    };
    debounced.flush = (...args) => func(...args);
    return debounced;
  };
  const ID = "github-commit-sort";
  const VERSION = "1.1.3";
  var _GM_addValueChangeListener = /* @__PURE__ */ (() => typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  class Store {
    constructor() {
      __publicField(this, "state", "default");
      __publicField(this, "listeners", []);
      __publicField(this, "SORT_ICON_MAP", {
        desc: "▴",
        asc: "▾",
        default: "="
      });
      this.state = _GM_getValue("state", "default");
      _GM_addValueChangeListener("state", (_key, _oldValue, newValue, remote) => {
        if (remote) {
          this.state = newValue;
          this.listeners.forEach((listener) => listener(this.state));
        }
      });
    }
    addChangeListener(listener) {
      this.listeners.push(listener);
    }
    toggleState() {
      const states = Object.keys(this.SORT_ICON_MAP);
      this.state = states[(states.indexOf(this.state) + 1) % states.length];
      _GM_setValue("state", this.state);
    }
    updateState(state) {
      this.state = state;
      _GM_setValue("state", this.state);
    }
    get sortIcon() {
      return this.SORT_ICON_MAP[this.state];
    }
  }
  const SORT_BUTTON_ID = `${ID}-sort-button`;
  const store = new Store();
  function queryTable() {
    return document.querySelector('table[aria-labelledby="folders-and-files"]');
  }
  function querySortButtonParent() {
    const table = queryTable();
    const mainTable = table == null ? void 0 : table.querySelector(
      'body tr[class^="DirectoryContent-module"] > td > div > div:last-child'
    );
    if (mainTable) {
      return { sortButtonParent: mainTable, isMainPage: true };
    }
    const treeTable = table == null ? void 0 : table.querySelector(
      "thead > tr > th:last-child > div"
    );
    return { sortButtonParent: treeTable, isMainPage: false };
  }
  function sortRowsByState(sortButton, toggle) {
    var _a;
    const tableBody = (_a = queryTable()) == null ? void 0 : _a.querySelector("tbody");
    if (!tableBody) {
      return;
    }
    const hasSkeleton = tableBody.querySelector('div[class^="Skeleton"]');
    if (hasSkeleton) {
      return;
    }
    const rowElements = tableBody.querySelectorAll(
      'tr[class^="react-directory-row"]'
    );
    const rows = Array.from(rowElements).map((element) => {
      const relativeTimeElement = element.querySelector("relative-time");
      const id = element.getAttribute("id");
      const datetime = relativeTimeElement.getAttribute("datetime");
      return {
        element,
        date: new Date(datetime),
        id,
        index: Number(id.split("-").pop())
      };
    });
    toggle && store.toggleState();
    sortButton.textContent = store.sortIcon;
    const sortedRows = rows.sort((a, b) => {
      if (store.state === "default") {
        return a.index - b.index;
      }
      const aDate = a.date.getTime();
      const bDate = b.date.getTime();
      return store.state === "asc" ? aDate - bDate : bDate - aDate;
    });
    const viewAllFilesElement = tableBody.querySelector(
      'tr[data-testid="view-all-files-row"'
    );
    sortedRows.forEach((row) => {
      row.element.remove();
      viewAllFilesElement ? tableBody.insertBefore(row.element, viewAllFilesElement) : tableBody.appendChild(row.element);
    });
  }
  function main(observer2) {
    const { sortButtonParent, isMainPage } = querySortButtonParent();
    if (!sortButtonParent) {
      return;
    }
    observer2 && observer2.disconnect();
    if (isMainPage) {
      sortButtonParent.style.alignItems = "center";
    } else {
      const th = sortButtonParent.parentNode;
      th.style.width = "170px";
    }
    let sortButton = document.getElementById(SORT_BUTTON_ID);
    if (!sortButton) {
      sortButton = document.createElement("button");
      sortButton.textContent = store.sortIcon;
      sortButton.classList.add("Button", "Button--iconOnly", "Button--secondary");
      sortButton.id = SORT_BUTTON_ID;
      sortButton.style.width = "var(--control-xsmall-size)";
      sortButton.style.height = "var(--control-xsmall-size)";
      sortButton.style.marginLeft = isMainPage ? "0" : "10px";
      sortButtonParent.appendChild(sortButton);
      sortButton.addEventListener("click", () => sortRowsByState(sortButton, true));
    }
    sortRowsByState(sortButton, false);
    observer2 && observer2.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  console.log(`${ID}(v${VERSION})`);
  const mainDebounced = debounce({ delay: 500 }, main);
  const observer = new MutationObserver(() => mainDebounced(observer));
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  store.addChangeListener(mainDebounced.bind(null, observer));

})();