// ==UserScript==
// @name         Better Segments for Strava
// @namespace    https://github.com/twocaretcat
// @version      0.2.0
// @author       John Goodliff
// @description  A userscript for Strava that adds additional stats and features to the starred segments page.
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAA51BMVEUAAAD8TAL8TAL8TAIAAAD8TAL39/fg4OD8TAIAAAAAAAD8TAL8TAIAAAD8TAL8TAL8TAL8TAL8TAL8TAL8TAL8TAL8TAL8TAL8TAL8TAL8TAL8TALl5eX8TAL8TAL8TAL8TAL8TAL8TAL8TAL8TAL8TAL8TAL8TAL8TAL8TAL8TAL8TAL5+fn4+Pj8TAL8TAL8TALWQAL8TAL8TAL8TAL8TAL8TAL8TAL8TAL///8AuADjRAKq2Kqk1qTM58zKysqnpqZ8fHz39/ft7e3n5+fi8eLV1dXFxcWxsbHj4eHX19eampqZmZlUgKVHAAAAOHRSTlMAZJ6ZBwmnhfYYDOAeGigL8+LXsD8t+NzRq6iHfldKOv3vyr+5kHRvXkQwEaSkjYF4cRa4lFMgHLx0l9gAAAHDSURBVFjD7ZVnW8IwEIBRrBaK0kLZG9koAq6LqOzh+P+/x3BEbEkHtvLFp+8XknD3JiSX4PM4PBcxd/lCJBF2JUgDRN3k14FSc55fiAOlWHCa35YAUfoOBRVgXDrLv4EtGbtYVeDHmqAhb3DCqqbjj3D1EiphZjSFH3KIq7DksVYAYnfHX8ZEKSwksFHeWWNNBL2A7pRukiqmiS06lYhNv255FQBOAHLuZyAHSGOnzbgvASdAUm3s4ayakLvNar63KZwGMBGA0mRXCHtJQbcf7FqpEpgIkM46aTOF/LB7ImtZBsBSAPRA69zZ5wGp0cMDOwGI1TirPq4qix0RLAQKfmtS/xXQEJcMBccxzfqUR72gL2l+ZctvLNDsUFE1fBuQquAzE9AbxCbqGr1OiEL31kKAVWLyDqZYrVkIkJwMkuFLLCRAbvDx/EAo2jL5j7gN+awF9ngCT3BgwS/xBLygcOQA1fePCF6dItdBh/EBMn+lzEnvaC96hEymkykhga3g+YnyQgawFwMyWa4Wn1Ny7liwWC0/3kcuBGQ4ehsT5wKaPxzPxu5WMNOtAGEDtvDxwewZkrWrA9P4E4ZdJhfv8Td8Aar4+B4sHPOcAAAAAElFTkSuQmCC
// @homepage     https://johng.io/p/better-segments-for-strava
// @homepageURL  https://johng.io/p/better-segments-for-strava
// @source       https://github.com/twocaretcat/better-segments-for-strava.git
// @supportURL   https://github.com/twocaretcat/better-segments-for-strava/issues
// @match        https://www.strava.com/athlete/segments/starred*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545360/Better%20Segments%20for%20Strava.user.js
// @updateURL https://update.greasyfork.org/scripts/545360/Better%20Segments%20for%20Strava.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PROJECT = {
    EMOJI: "🏁",
    NAME: "Better Segments"
  };
  const SCRIPT_NAME = `${PROJECT.EMOJI} ${PROJECT.NAME}`;
  const buildLogPrefix = /* @__PURE__ */ (() => {
    const colorMap = {
      primary: "#fc5200",
      // Strava orange
      debug: "#009966",
      // TW 4 Emerald 600
      info: "#4f39f6",
      // TW 4 Indigo 600
      warn: "#fc5200",
      // Strava orange
      error: "#e7000b"
      // TW 4 Red 600
    };
    return (severity) => [
      `%c${SCRIPT_NAME} %c${severity}`,
      `font-style:italic;color:${colorMap.primary};`,
      `color:${colorMap[severity]};`
    ];
  })();
  const buildLogFn = (severity) => {
    const logFn = console[severity];
    const logPrefix = buildLogPrefix(severity);
    return (...args) => logFn(...logPrefix, ...args);
  };
  const debug = buildLogFn("debug");
  buildLogFn("info");
  buildLogFn("warn");
  buildLogFn("error");
  const pattern = /^\/athlete\/segments\/starred$/;
  const handler = () => {
    debug("Setting up starred segments page");
    const MSG = {
      rowNum: "#",
      recordDiffSeconds: "PR Diff Time",
      recordDiffPercent: "PR Diff %",
      gender: "Compare with Gender",
      itemsPerPage: "Items per Page",
      genderAny: "Any",
      genderMen: "Men",
      genderWomen: "Women",
      kilometersSuffix: "km",
      milesSuffix: "mi",
      feetSuffix: "ft",
      percentSuffix: "%",
      secondsSuffix: "s",
      plusPrefix: "+",
      minusPrefix: "-",
      placeholderValue: "—"
    };
    const SORT_INDICATOR = {
      1: " ▲",
      "-1": " ▼"
    };
    const ITEMS_PER_PAGE = [20, 50, 100, 200, 500, 1e3, 2e3];
    const GENDER = {
      any: MSG.genderAny,
      men: MSG.genderMen,
      women: MSG.genderWomen
    };
    const QUERY_PARAM = {
      itemsPerPage: "per_page",
      pageNum: "page"
    };
    const COL_INDEX = {
      rowNum: 0,
      star: 1,
      sport: 2,
      name: 3,
      category: 4,
      distance: 5,
      elevationDiff: 6,
      avgGrade: 7,
      menRecord: 8,
      womenRecord: 9,
      myRecord: 10,
      myGoal: 11,
      recordDiffSeconds: 12,
      recordDiffPercentage: 13
    };
    const COLS = [
      {
        parseFn: Number.parseInt,
        title: MSG.rowNum
      },
      {},
      {
        parseFn: parseText
      },
      {
        parseFn: parseText
      },
      {},
      {
        parseFn: parseDistance
      },
      {
        parseFn: parseDistance
      },
      {
        parseFn: parsePercentage
      },
      {
        parseFn: parseDuration
      },
      {
        parseFn: parseDuration
      },
      {
        parseFn: parseDuration
      },
      {
        parseFn: parseDuration
      },
      {
        parseFn: parseDuration,
        title: MSG.recordDiffSeconds
      },
      {
        parseFn: parsePercentage,
        title: MSG.recordDiffPercent
      }
    ];
    const DEFAULT = {
      itemsPerPage: ITEMS_PER_PAGE[0],
      gender: GENDER.any,
      sortColIndex: COL_INDEX.rowNum,
      sortDirection: 1
    };
    const sortIndicatorRegex = RegExp(
      ` [${Object.values(SORT_INDICATOR).join("")}]$`
    );
    const state = {
      gender: DEFAULT.gender,
      sort: { colIndex: DEFAULT.sortColIndex, direction: DEFAULT.sortDirection }
    };
    const [table, headerRow, rows] = buildTable();
    updateTable();
    sortTableByCol(0);
    function assertExists(value, msg) {
      if (value === null || value === void 0) throw new Error(msg);
      return value;
    }
    function formatTimeDiff(secondsDiff) {
      const absSecondsDiff = Math.abs(secondsDiff);
      if (absSecondsDiff < 60) return `${absSecondsDiff}${MSG.secondsSuffix}`;
      const minutes = Math.floor(absSecondsDiff / 60);
      const secondsString = String(absSecondsDiff % 60).padStart(2, "0");
      return `${minutes}:${secondsString}`;
    }
    function getSignFor(number) {
      return number < 0 ? MSG.minusPrefix : number > 0 ? MSG.plusPrefix : "";
    }
    function getQueryParam(key) {
      return new URLSearchParams(window.location.search).get(key);
    }
    function getColorFor(value) {
      const lightness = 0.7;
      const chroma = 0.15;
      const hue = 150 - Math.sign(value) * Math.abs(value) ** (1 / 5) * 30;
      return `oklch(${lightness} ${chroma} ${hue})`;
    }
    function parseDuration(durationString) {
      if (durationString === MSG.placeholderValue) return null;
      if (durationString.includes(":")) {
        const [min, sec] = durationString.split(":").map(Number);
        return min * 60 + sec;
      }
      if (durationString.endsWith("s")) {
        return Number.parseInt(durationString);
      }
      return Number.parseFloat(durationString);
    }
    function parsePercentage(percentageString) {
      if (percentageString === MSG.placeholderValue) return null;
      return Number.parseFloat(percentageString);
    }
    function parseDistance(distanceString) {
      const distanceValue = Number.parseFloat(distanceString);
      if (distanceString.endsWith(MSG.kilometersSuffix))
        return distanceValue * 1e3;
      if (distanceString.endsWith(MSG.milesSuffix))
        return distanceValue * 1609.344;
      if (distanceString.endsWith(MSG.feetSuffix)) return distanceValue * 0.3048;
      return distanceValue;
    }
    function parseText(textString) {
      return textString.toLowerCase();
    }
    function createCol(colIndex) {
      const colHeader = document.createElement("th");
      colHeader.textContent = COLS[colIndex].title;
      colHeader.style.cursor = "pointer";
      return colHeader;
    }
    function createSelector(title, optionNames, defaultOptionName, onChange) {
      const fragment = document.createDocumentFragment();
      const wrapperDiv = document.createElement("div");
      wrapperDiv.className = "edit-js editable-setting editing inset";
      wrapperDiv.style.background = "#f7f7fa";
      wrapperDiv.style.borderTop = "1px solid #f0f0f5";
      wrapperDiv.style.borderBottom = "1px solid #f0f0f5";
      wrapperDiv.style.marginTop = "20px";
      wrapperDiv.style.marginBottom = "-1px";
      const form = document.createElement("form");
      form.noValidate = true;
      const labelDiv = document.createElement("div");
      labelDiv.className = "setting-label";
      labelDiv.textContent = title;
      labelDiv.style.color = "#494950";
      labelDiv.style.position = "relative";
      const valueDiv = document.createElement("div");
      valueDiv.className = "setting-value";
      valueDiv.style.marginTop = "6px";
      const select = document.createElement("select");
      select.className = "valid";
      for (const optionName of optionNames) {
        const option = document.createElement("option");
        option.value = optionName;
        option.textContent = optionName;
        option.selected = optionName === defaultOptionName;
        select.appendChild(option);
      }
      select.addEventListener("change", onChange);
      valueDiv.appendChild(select);
      form.appendChild(labelDiv);
      form.appendChild(valueDiv);
      wrapperDiv.appendChild(form);
      fragment.appendChild(wrapperDiv);
      return fragment;
    }
    function buildTableOptions(table2) {
      const tableParent = assertExists(
        table2.parentElement,
        "Table parent not found."
      );
      const currentItemsPerPage = Number(getQueryParam(QUERY_PARAM.itemsPerPage)) ?? DEFAULT.itemsPerPage;
      const itemsPerPageSelector = createSelector(
        MSG.itemsPerPage,
        ITEMS_PER_PAGE,
        currentItemsPerPage,
        ({ target }) => {
          const url = new URL(window.location.href);
          url.searchParams.set(QUERY_PARAM.itemsPerPage, target.value);
          window.location.href = url.toString();
        }
      );
      const genderSelector = createSelector(
        MSG.gender,
        Object.values(GENDER),
        DEFAULT.gender,
        ({ target }) => {
          state.gender = target.value;
          updateTable();
          sortTableByCol();
        }
      );
      tableParent.insertBefore(itemsPerPageSelector, table2);
      tableParent.insertBefore(genderSelector, table2);
    }
    function buildTableHeaders(headerRow2) {
      const rowNumCol = createCol(COL_INDEX.rowNum);
      const recordDiffSecondsCol = createCol(COL_INDEX.recordDiffSeconds);
      const recordDiffPercentageCol = createCol(COL_INDEX.recordDiffPercentage);
      headerRow2.insertBefore(rowNumCol, headerRow2.firstChild);
      headerRow2.appendChild(recordDiffSecondsCol);
      headerRow2.appendChild(recordDiffPercentageCol);
      [...headerRow2.children].forEach((th, i) => {
        th.style.cursor = "pointer";
        th.addEventListener("click", () => sortTableByCol(i, true));
      });
    }
    function buildTableCols(rows2) {
      const pageNum = Number(getQueryParam(QUERY_PARAM.pageNum) ?? 1);
      const startIndex = (pageNum - 1) * DEFAULT.itemsPerPage + 1;
      rows2.forEach((row, i) => {
        const indexCell = row.insertCell(0);
        indexCell.textContent = startIndex + i;
        row.insertCell();
        row.insertCell();
      });
    }
    function buildTable() {
      const table2 = assertExists(
        document.querySelector("table.starred-segments"),
        "Table not found."
      );
      const headerRow2 = assertExists(
        table2.querySelector("thead tr"),
        "Table header row not found."
      );
      const rows2 = [...table2.querySelectorAll("tbody tr")];
      buildTableOptions(table2);
      buildTableHeaders(headerRow2);
      buildTableCols(rows2);
      return [table2, headerRow2, rows2];
    }
    function updateTable() {
      const gender = state.gender;
      for (const row of rows) {
        const cells = row.children;
        const [menRecordSeconds, womenRecordSeconds, myRecordSeconds] = [
          "menRecord",
          "womenRecord",
          "myRecord"
        ].map((key) => parseDuration(cells[COL_INDEX[key]].textContent.trim()));
        let recordSeconds = menRecordSeconds;
        if (gender === GENDER.women) {
          recordSeconds = womenRecordSeconds;
        } else if (gender === GENDER.any) {
          recordSeconds = Math.min(
            menRecordSeconds ?? Number.POSITIVE_INFINITY,
            womenRecordSeconds ?? Number.POSITIVE_INFINITY
          );
        }
        const recordDiffSecondsCell = cells[COL_INDEX.recordDiffSeconds];
        const recordDiffPercentageCell = cells[COL_INDEX.recordDiffPercentage];
        if (recordSeconds != null && myRecordSeconds != null) {
          const secondsDiff = myRecordSeconds - recordSeconds;
          const percentDiff = secondsDiff / recordSeconds * 100;
          const color = getColorFor(percentDiff);
          recordDiffSecondsCell.textContent = `${getSignFor(secondsDiff)}${formatTimeDiff(secondsDiff)}`;
          recordDiffPercentageCell.textContent = `${getSignFor(percentDiff)}${Math.abs(percentDiff).toFixed(0)}${MSG.percentSuffix}`;
          recordDiffSecondsCell.style.color = color;
          recordDiffPercentageCell.style.color = color;
        } else {
          recordDiffSecondsCell.textContent = MSG.placeholderValue;
          recordDiffPercentageCell.textContent = MSG.placeholderValue;
          recordDiffSecondsCell.style.color = "";
          recordDiffPercentageCell.style.color = "";
        }
      }
    }
    function sortTableByCol(colIndex = state.sort.colIndex, toggleDirection = false) {
      const { parseFn } = COLS[colIndex];
      if (!parseFn) {
        console.warn(`No parse function defined for column ${colIndex}`);
        return;
      }
      const direction = state.sort.direction * (toggleDirection ? -1 : 1);
      state.sort.colIndex = colIndex;
      state.sort.direction = direction;
      rows.sort((rowA, rowB) => {
        const [valA, valB] = [rowA, rowB].map(
          (row) => parseFn(row.children[colIndex].textContent.trim()) ?? Number.POSITIVE_INFINITY
        );
        if (typeof valA === "number" && typeof valB === "number") {
          return (valA - valB) * direction;
        }
        return String(valA).localeCompare(String(valB)) * direction;
      });
      [...headerRow.children].forEach((th, i) => {
        th.innerHTML = th.innerHTML.replace(sortIndicatorRegex, "");
        if (i === colIndex) {
          th.innerHTML += SORT_INDICATOR[direction];
        }
      });
      const tbody = table.querySelector("tbody");
      for (const row of rows) {
        tbody.appendChild(row);
      }
    }
  };
  const starredSegmentsRoute = {
    pattern,
    handler
  };
  const registerRouteHandlers = (routes) => {
    const path = location.pathname;
    for (const { pattern: pattern2, handler: handler2 } of routes) {
      if (pattern2.test(path)) {
        handler2();
        break;
      }
    }
  };
  const init = () => {
    debug("Script loaded");
    registerRouteHandlers([starredSegmentsRoute]);
    debug("Script unloaded");
  };
  init();

})();
