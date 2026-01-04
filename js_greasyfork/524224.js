// ==UserScript==
// @name            wr-history-graph
// @namespace       npm/vite-plugin-monkey
// @version         0.0.4
// @author          monkey
// @description:en  Show graph of Mario Kart WR History
// @description:ja  マリオカートのWR Historyのグラフを表示します
// @license         MIT
// @icon            https://vitejs.dev/logo.svg
// @match           https://mkwrs.com/*
// @require         https://cdnjs.cloudflare.com/ajax/libs/apexcharts/4.3.0/apexcharts.min.js
// @description Show graph for Mario Kart WR History
// @downloadURL https://update.greasyfork.org/scripts/524224/wr-history-graph.user.js
// @updateURL https://update.greasyfork.org/scripts/524224/wr-history-graph.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  const toMilliseconds = (time) => {
    const regex = /(?:([\d]+)')?([\d]+)"([\d]+)/;
    const match = time.match(regex);
    if (!match) {
      return null;
    }
    const minutes = match[1] ? parseInt(match[1], 10) : 0;
    const seconds = parseInt(match[2], 10);
    const milliseconds = match[3].length === 3 ? parseInt(match[3], 10) : parseInt(match[3], 10) * 10;
    return minutes * 6e4 + seconds * 1e3 + milliseconds;
  };
  const toDateTime = (date) => {
    const dateTime = new Date(date).getTime();
    if (isNaN(dateTime)) {
      return null;
    }
    return dateTime;
  };
  class History {
    constructor(seriesName) {
      __publicField(this, "config");
      __publicField(this, "getTableData", () => {
        var _a;
        const rowIndexes = this.config.rowIndexes;
        const h2Elements = document.querySelectorAll("h2");
        let targetH2 = null;
        for (const h2 of Array.from(h2Elements)) {
          const h2Text = ((_a = h2.textContent) == null ? undefined : _a.trim()) ?? "";
          if (h2Text.includes("History") && !h2Text.includes("Graph")) {
            targetH2 = h2;
            break;
          }
        }
        if (!targetH2) {
          return [];
        }
        let nextElem = targetH2.nextElementSibling;
        if (!nextElem || !(nextElem instanceof HTMLTableElement)) {
          return [];
        }
        const tableData = [];
        const rows = nextElem.querySelectorAll("tr");
        rows.forEach((tr) => {
          const cells = tr.querySelectorAll("td");
          const rowData = Array.from(cells).map((td, index) => {
            var _a2, _b;
            if (index !== rowIndexes[3]) {
              return ((_a2 = td.textContent) == null ? undefined : _a2.trim()) ?? "";
            }
            return ((_b = td.querySelector("img")) == null ? undefined : _b.src) ?? "";
          });
          if (rowData.length === 0) {
            return;
          }
          const dateTime = toDateTime(rowData[rowIndexes[0]]);
          if (dateTime === null) {
            return;
          }
          tableData.push([
            dateTime,
            toMilliseconds(rowData[rowIndexes[1]]),
            rowData[rowIndexes[2]],
            rowData[rowIndexes[3]],
            rowData[rowIndexes[4]]
          ]);
        });
        tableData.push([
          (/* @__PURE__ */ new Date()).getTime(),
          tableData.at(-1)[1],
          tableData.at(-1)[2],
          tableData.at(-1)[3],
          tableData.at(-1)[4]
        ]);
        return tableData;
      });
      __publicField(this, "insertChartDiv", () => {
        var _a;
        const mainElement = document.querySelector("#main");
        if (!mainElement) {
          return null;
        }
        const h2Elements = document.querySelectorAll("h2");
        let targetH2 = null;
        for (const h2 of Array.from(h2Elements)) {
          if ((((_a = h2.textContent) == null ? undefined : _a.trim()) ?? "").endsWith(":")) {
            targetH2 = h2;
            break;
          }
        }
        if (!targetH2) {
          return null;
        }
        const chartTitle = document.createElement("h2");
        chartTitle.textContent = "WR History Graph";
        mainElement.insertBefore(chartTitle, targetH2);
        const chartDiv = document.createElement("div");
        chartDiv.id = "chart";
        mainElement.insertBefore(chartDiv, targetH2);
        return chartDiv;
      });
      let rowIndexes;
      switch (seriesName) {
        case "mkwii":
          rowIndexes = [0, 1, 2, 4, 11];
          break;
        case "mk64":
          rowIndexes = [0, 1, 3, 4, 6];
          break;
        default:
          rowIndexes = [0, 1, 2, 3, 4];
          break;
      }
      this.config = {
        rowIndexes
      };
    }
  }
  let ApexChartsLocal;
  const millisecondsToString = (value) => {
    const milliseconds = value % 1e3;
    const seconds = Math.floor(value / 1e3 % 60);
    const minutes = Math.floor(value / 6e4 % 60);
    return `${minutes}'${String(seconds).padStart(2, "0")}"${String(
    milliseconds.toFixed(0)
  ).padStart(3, "0")}`;
  };
  const getHistory = () => {
    const url = window.location.href;
    const seriesName = url.split("/")[3];
    return new History(seriesName);
  };
  const drawChart = (data) => {
    const options = {
      chart: {
        type: "line",
        height: 400,
        width: "90%",
        zoom: {
          enabled: true,
          type: "x",
          autoScaleYaxis: true
        }
      },
      markers: {
        size: 5
      },
      stroke: {
        curve: "stepline"
      },
      series: [
        {
          name: "history",
          data: data.map((d) => ({
            x: d[0],
            y: d[1],
            player: d[2],
            nation: d[3],
            duration: d[4]
          }))
        }
      ],
      tooltip: {
        custom: function({ seriesIndex, dataPointIndex, w }) {
          const data2 = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
          const date = new Date(data2.x).toLocaleDateString();
          const time = data2.y;
          const player = data2.player;
          const nation = data2.nation;
          const duration = data2.duration;
          return `
          <div style="padding:10px; top:1000px">
            <strong>Date:</strong> ${date}<br/>
            <strong>Time:</strong> ${millisecondsToString(time)}<br/>
            <strong>Player:</strong> ${player}<br/>
            <strong>Nation:</strong> <img src="${nation}"><br/>
            <strong>Duration:</strong> ${duration}
          </div>
        `;
        },
        followCursor: true
      },
      xaxis: {
        type: "datetime",
        tooltip: {
          enabled: false
        }
      },
      yaxis: {
        title: {
          text: "Time"
        },
        labels: {
          formatter: millisecondsToString
        }
      },
      grid: {
        xaxis: {
          lines: {
            show: true
          }
        }
      }
    };
    const chart = new ApexChartsLocal(document.querySelector("#chart"), options);
    chart.render();
  };
  const main = () => {
    const history = getHistory();
    const chartDiv = history.insertChartDiv();
    if (!chartDiv) {
      return;
    }
    const tableData = history.getTableData();
    drawChart(tableData);
  };
  {
    ApexChartsLocal = ApexCharts;
    main();
  }

})();