// ==UserScript==
// @name         百度指数数据导出工具
// @namespace    https://github.com/siaikin/baidu-index-export
// @version      1.3.1
// @author       siaikin
// @description  这是一个 Tampermonkey 的脚本，用于将 baidu index 的数据导出为 csv
// @copyright    https://github.com/siaikin
// @homepage     https://github.com/siaikin/baidu-index-export
// @supportURL   https://github.com/siaikin/baidu-index-export/issues
// @match        *://index.baidu.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/490991/%E7%99%BE%E5%BA%A6%E6%8C%87%E6%95%B0%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/490991/%E7%99%BE%E5%BA%A6%E6%8C%87%E6%95%B0%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var ChartType = /* @__PURE__ */ ((ChartType2) => {
    ChartType2[ChartType2["TREND"] = 0] = "TREND";
    ChartType2[ChartType2["BRAND"] = 1] = "BRAND";
    return ChartType2;
  })(ChartType || {});
  const BOM = new Uint8Array([239, 187, 191]);
  function exportCSV(chartData, withBOM = false) {
    const titleRow = ["name"].concat(chartData.xAxisData);
    const dataRows = chartData.series.map((item) => [`"${item.name}"`].concat(item.data));
    const csv = [titleRow.join(",") + "\n"];
    dataRows.forEach((row) => csv.push(row.join(",") + "\n"));
    download(
      new Blob(withBOM ? [BOM, ...csv] : csv, { type: "text/csv" }),
      `${chartData.series.map((item) => item.name).join(",")}_${chartData.startDate}-${chartData.endDate}.csv`
    );
  }
  function exportNewsCSV(chartData, withBOM = false) {
    const titleRow = ["name", "date", "newsDate", "newsSource", "newsTitle", "newsUrl"];
    let dataRows = [];
    for (const [name, dateList] of Object.entries(chartData.newDatas)) {
      const rows = dateList.map(({ xAxis, news }) => news.map((item) => [
        `"${name}"`,
        xAxis,
        `"${item.date}"`,
        `"${item.source}"`,
        `"${item.title}"`,
        `"${item.url}"`
      ])).flat();
      dataRows = dataRows.concat(rows);
    }
    const csv = [titleRow.join(",") + "\n"];
    dataRows.forEach((row) => csv.push(row.join(",") + "\n"));
    download(
      new Blob(withBOM ? [BOM, ...csv] : csv, { type: "text/csv" }),
      `${chartData.series.map((item) => item.name).join(",")}_${chartData.startDate}-${chartData.endDate}.news.csv`
    );
  }
  function download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }
  async function loadExportTrendFeature(chartDataKey) {
    var _a, _b, _c, _d;
    let chartData = null;
    Object.defineProperty(
      Object.prototype,
      chartDataKey,
      {
        configurable: true,
        get: () => chartData,
        set(value) {
          delete Object.prototype[chartDataKey];
          chartData = value;
          Object.defineProperty(
            this,
            chartDataKey,
            {
              configurable: true,
              get: () => chartData,
              set(value2) {
                chartData = value2;
              }
            }
          );
        }
      }
    );
    await new Promise((resolve) => window.addEventListener("load", resolve));
    const container = document.querySelectorAll(".index-trend-content")[1];
    const splitline = container.querySelector(".splitline");
    const shareButton = container.querySelector(".share-icon");
    if (!splitline || !shareButton)
      return;
    const downloadButton = shareButton.cloneNode();
    downloadButton.innerHTML = '<a href="javascript:void(0)" class="share-icon">下载（无 BOM）</a>';
    downloadButton.addEventListener("click", () => handleDownloadClick(false));
    (_a = shareButton.parentNode) == null ? void 0 : _a.append(splitline.cloneNode());
    (_b = shareButton.parentNode) == null ? void 0 : _b.append(downloadButton);
    const downloadButtonWithBOM = shareButton.cloneNode();
    downloadButtonWithBOM.innerHTML = '<a href="javascript:void(0)" class="share-icon">下载（带有 BOM，Excel可用）</a>';
    downloadButtonWithBOM.addEventListener("click", () => handleDownloadClick(true));
    (_c = shareButton.parentNode) == null ? void 0 : _c.append(splitline.cloneNode());
    (_d = shareButton.parentNode) == null ? void 0 : _d.append(downloadButtonWithBOM);
    function handleDownloadClick(withBOM = false) {
      if (!chartData) {
        console.error("[baidu-index-export] chartData is not ready");
        alert("数据未准备好，请稍后再试");
        return;
      }
      exportCSV(chartData.all, withBOM);
      exportNewsCSV(chartData.all, withBOM);
    }
  }
  async function loadExportFeedFeature(chartDataKey) {
    var _a, _b, _c, _d;
    let chartData = null;
    Object.defineProperty(
      Object.prototype,
      chartDataKey,
      {
        configurable: true,
        get: () => chartData,
        set(value) {
          delete Object.prototype[chartDataKey];
          chartData = value;
          Object.defineProperty(
            this,
            chartDataKey,
            {
              configurable: true,
              get: () => chartData,
              set(value2) {
                chartData = value2;
              }
            }
          );
        }
      }
    );
    await new Promise((resolve) => window.addEventListener("load", resolve));
    const container = document.querySelectorAll(".index-trend-content")[2];
    const splitline = container.querySelector(".splitline");
    const regionButton = container.querySelector(".index-region");
    if (!splitline || !regionButton)
      return;
    const downloadButton = regionButton.cloneNode();
    downloadButton.innerHTML = '<a href="javascript:void(0)" class="share-icon">下载（无 BOM）</a>';
    downloadButton.addEventListener("click", () => handleDownloadClick(false));
    (_a = regionButton.parentNode) == null ? void 0 : _a.append(splitline.cloneNode());
    (_b = regionButton.parentNode) == null ? void 0 : _b.append(downloadButton);
    const downloadButtonWithBOM = regionButton.cloneNode();
    downloadButtonWithBOM.innerHTML = '<a href="javascript:void(0)" class="share-icon">下载（带有 BOM，Excel可用）</a>';
    downloadButtonWithBOM.addEventListener("click", () => handleDownloadClick(true));
    (_c = regionButton.parentNode) == null ? void 0 : _c.append(splitline.cloneNode());
    (_d = regionButton.parentNode) == null ? void 0 : _d.append(downloadButtonWithBOM);
    function handleDownloadClick(withBOM = false) {
      if (!chartData) {
        console.error("[baidu-index-export] chartData is not ready");
        alert("数据未准备好，请稍后再试");
        return;
      }
      exportCSV(chartData, withBOM);
      exportNewsCSV(chartData, withBOM);
    }
  }
  async function loadExportBrandFeature(chartDataKey) {
    var _a, _b, _c, _d;
    let chartData = null;
    let pageThis = null;
    Object.defineProperty(
      Object.prototype,
      chartDataKey,
      {
        configurable: true,
        get: () => chartData,
        set(value) {
          delete Object.prototype[chartDataKey];
          chartData = value;
          pageThis = this;
          Object.defineProperty(
            this,
            chartDataKey,
            {
              configurable: true,
              get: () => chartData,
              set(value2) {
                chartData = {
                  ...chartData,
                  ...value2,
                  startDate: pageThis.startDate,
                  endDate: pageThis.endDate
                };
              }
            }
          );
        }
      }
    );
    await new Promise((resolve) => window.addEventListener("load", resolve));
    const container = document.querySelectorAll(".index-brand-content")[0];
    const splitline = container.querySelector(".splitline");
    const shareButton = container.querySelector(".share-icon");
    if (!splitline || !shareButton)
      return;
    const downloadButton = shareButton.cloneNode();
    downloadButton.innerHTML = '<a href="javascript:void(0)" class="share-icon">下载（无 BOM）</a>';
    downloadButton.addEventListener("click", () => handleDownloadClick(false));
    (_a = shareButton.parentNode) == null ? void 0 : _a.append(splitline.cloneNode());
    (_b = shareButton.parentNode) == null ? void 0 : _b.append(downloadButton);
    const downloadButtonWithBOM = shareButton.cloneNode();
    downloadButtonWithBOM.innerHTML = '<a href="javascript:void(0)" class="share-icon">下载（带有 BOM，Excel可用）</a>';
    downloadButtonWithBOM.addEventListener("click", () => handleDownloadClick(true));
    (_c = shareButton.parentNode) == null ? void 0 : _c.append(splitline.cloneNode());
    (_d = shareButton.parentNode) == null ? void 0 : _d.append(downloadButtonWithBOM);
    function handleDownloadClick(withBOM = false) {
      if (!chartData) {
        console.error("[baidu-index-export] chartData is not ready");
        alert("数据未准备好，请稍后再试");
        return;
      }
      exportCSV(chartData, withBOM);
    }
  }
  const chartType = (() => {
    const hash = window.location.hash;
    if (hash.startsWith("#/trend/"))
      return ChartType.TREND;
    else if (hash.startsWith("#/brand/"))
      return ChartType.BRAND;
    else
      return ChartType.TREND;
  })();
  (() => {
    switch (chartType) {
      case ChartType.BRAND:
        loadExportBrandFeature("brandDatas");
        break;
      case ChartType.TREND:
        loadExportTrendFeature("chartDatas");
        loadExportFeedFeature("chartDatas2");
        break;
    }
  })();

})();