// ==UserScript==
// @name         SOOP - 참여 통계 리캡
// @namespace    https://www.afreecatv.com/
// @version      3.1.2
// @description  참여 통계에 스트리머 별 총 시간을 표시합니다
// @author       Jebibot
// @match        *://broadstatistic.sooplive.co.kr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.sooplive.co.kr
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497644/SOOP%20-%20%EC%B0%B8%EC%97%AC%20%ED%86%B5%EA%B3%84%20%EB%A6%AC%EC%BA%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/497644/SOOP%20-%20%EC%B0%B8%EC%97%AC%20%ED%86%B5%EA%B3%84%20%EB%A6%AC%EC%BA%A1.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let shouldReload = false;
  const loadModule = (name) =>
    new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.type = "text/javascript";
      s.src = `https://static.sooplive.co.kr/asset/library/highcharts/js/modules/${name}.js`;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  Promise.all([loadModule("treemap"), loadModule("exporting")])
    .then(() => loadModule("offline-exporting"))
    .then(() => {
      Object.assign(unsafeWindow.Highcharts.getOptions().lang, {
        contextButtonTitle: "차트 메뉴",
        printChart: "인쇄",
        downloadPNG: ".png 다운로드",
        downloadJPEG: ".jpeg 다운로드",
        downloadSVG: ".svg 다운로드",
      });
      shouldReload && unsafeWindow.callVodAjax();
    });

  const chart = document.getElementById("containchart");
  if (chart == null) {
    return;
  }
  const createContainer = (id) => {
    const container = document.createElement("div");
    container.id = id;
    container.style.height = "100%";
    container.style.display = "flex";
    container.style.justifyContent = "center";
    chart.parentNode.appendChild(container);
  };
  createContainer("recap1");
  createContainer("recap2");

  const oPage = unsafeWindow.oPage;
  const setMultipleChart = oPage.setMultipleChart.bind(oPage);
  oPage.setMultipleChart = (data) => {
    shouldReload = true;
    setMultipleChart(data);

    const numberFormat = Intl.NumberFormat();
    const formatTime = (m) =>
      `<b>${Math.floor(m / 60)}시간 ${
        Math.floor(m) % 60
      }분</b> (${numberFormat.format(Math.floor(m))}분)`;
    const recap = data.data_stack
      .map((t) => [t.bj_nick, t.data.reduce((a, b) => a + b, 0) / 60])
      .sort((a, b) => {
        if (a[0] === "기타") {
          return 1;
        } else if (b[0] === "기타") {
          return -1;
        } else {
          return b[1] - a[1];
        }
      });
    const labels = {
      style: {
        fontSize: "14px",
      },
    };
    const options = {
      title: {
        text: null,
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          colorByPoint: true,
        },
      },
      xAxis: {
        type: "category",
        labels,
      },
      credits: {
        enabled: false,
      },
      exporting: {
        fallbackToExportServer: false,
        filename: "recap",
        scale: 1.5,
      },
    };

    try {
      new unsafeWindow.Highcharts.Chart({
        ...options,
        chart: {
          renderTo: "recap1",
          width: 800,
          height: 400,
        },
        tooltip: {
          pointFormatter: function () {
            return `<b>${this.name}</b>: ${formatTime(this.value)}<br/>`;
          },
        },
        series: [
          {
            type: "treemap",
            layoutAlgorithm: "squarified",
            data: recap.slice(0, -1).map((t) => ({ name: t[0], value: t[1] })),
            dataLabels: labels,
          },
        ],
      });
    } catch {}

    new unsafeWindow.Highcharts.Chart({
      ...options,
      chart: {
        renderTo: "recap2",
        width: 900,
        height: Math.max(300, recap.length * 40),
        zoomType: "xy",
      },
      yAxis: {
        opposite: true,
        title: {
          text: null,
        },
      },
      tooltip: {
        pointFormatter: function () {
          return `${formatTime(this.y)}<br/>`;
        },
      },
      series: [
        {
          type: "bar",
          data: recap,
        },
      ],
    });
  };
})();
