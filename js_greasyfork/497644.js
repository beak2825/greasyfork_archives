// ==UserScript==
// @name         SOOP - 참여 통계 리캡
// @namespace    https://www.afreecatv.com/
// @version      4.1.7
// @description  참여 통계에 스트리머 별 총 시간을 표시합니다
// @author       Jebibot
// @match        *://broadstatistic.sooplive.co.kr/*
// @icon         https://res.sooplive.co.kr/favicon.ico
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      myapi.sooplive.co.kr
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497644/SOOP%20-%20%EC%B0%B8%EC%97%AC%20%ED%86%B5%EA%B3%84%20%EB%A6%AC%EC%BA%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/497644/SOOP%20-%20%EC%B0%B8%EC%97%AC%20%ED%86%B5%EA%B3%84%20%EB%A6%AC%EC%BA%A1.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let shouldReload = false;
  const favorites = {};
  const fetchFavorites = () =>
    new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: "https://myapi.sooplive.co.kr/api/favorite",
        onload: (response) => {
          try {
            const res = JSON.parse(response.responseText);
            if (res.data != null) {
              for (const s of res.data) {
                favorites[s.user_nick] = s.user_id;
              }
            }
            resolve();
          } catch (e) {
            reject(e);
          }
        },
        onerror: reject,
      });
    });
  const loadScript = (src, sri) =>
    new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.type = "text/javascript";
      if (sri) {
        s.crossOrigin = "anonymous";
        s.integrity = sri;
      }
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  const loadModule = (name) =>
    loadScript(
      `https://static.sooplive.co.kr/asset/library/highcharts/js/modules/${name}.js`
    );
  Promise.all([
    fetchFavorites(),
    loadScript(
      "https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js",
      "sha256-8glLv2FBs1lyLE/kVOtsSw8OQswQzHr5IfwVj864ZTk="
    ),
    loadModule("treemap"),
    loadModule("exporting"),
  ])
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
    container.style.alignItems = "flex-start";
    chart.parentNode.appendChild(container);
    return container;
  };
  const container = createContainer("recap0");
  createContainer("recap1");
  createContainer("recap2");

  const oPage = unsafeWindow.oPage;
  const setMultipleChart = oPage.setMultipleChart.bind(oPage);
  oPage.setMultipleChart = (data) => {
    shouldReload = true;
    setMultipleChart(data);

    const numberFormat = Intl.NumberFormat();
    const formatMin = (m) => `${numberFormat.format(Math.floor(m))}분`;
    const formatTime = (m, text) =>
      `${text ? "" : "<b>"}${Math.floor(m / 60)}시간 ${Math.floor(m) % 60}분${
        text ? "" : "</b>"
      } (${formatMin(m)})`;
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
    const recapData = recap
      .slice(0, -1)
      .map((t) => ({ name: t[0], value: t[1] }));
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
      const d3 = unsafeWindow.d3;
      const color = d3.scaleOrdinal(d3.schemeSet3);
      const pack = d3.pack().size([540, 540]).padding(5);
      const root = pack(
        d3.hierarchy({ children: recapData }).sum((d) => d.value)
      );

      const svg = d3
        .create("svg")
        .attr("width", 540)
        .attr("height", 540)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("background-color", "white")
        .style("isolation", "isolate");
      const node = svg
        .append("g")
        .selectAll()
        .data(root.leaves())
        .join("g")
        .attr("transform", (d) => `translate(${d.x},${d.y})`);
      const svgNode = svg.node();

      node
        .append("title")
        .text((d) => `${d.data.name}\n${formatTime(d.value, true)}`);
      node
        .append("circle")
        .attr("fill", (d) => color(d.data.name))
        .attr("r", (d) => d.r);

      node
        .filter((d) => !!favorites[d.data.name])
        .append("image")
        .attr("href", (d) => {
          const id = favorites[d.data.name];
          return `https://stimg.sooplive.co.kr/LOGO/${id.slice(
            0,
            2
          )}/${id}/${id}.webp`;
        })
        .attr("x", (d) => -d.r)
        .attr("y", (d) => -d.r)
        .attr("width", (d) => d.r * 2)
        .attr("height", (d) => d.r * 2)
        .attr("preserveAspectRatio", "xMidYMid slice")
        .attr("clip-path", (d) => `circle(${d.r})`);

      const text = node
        .append("text")
        .attr("clip-path", (d) => `circle(${d.r})`);
      text
        .filter((d) => !favorites[d.data.name])
        .append("tspan")
        .attr("x", 0)
        .attr("y", "0.35em")
        .text((d) => d.data.name);
      text
        .filter((d) => d.r > 40)
        .append("tspan")
        .attr("x", 0)
        .attr("y", (d) => d.r - 9)
        .text((d) => formatMin(d.value))
        .attr("stroke", "white")
        .attr("stroke-width", 3)
        .attr("paint-order", "stroke");

      const status = document.createElement("div");
      status.style.display = "none";
      status.style.position = "absolute";
      status.style.padding = "0.3em";
      status.style.backgroundColor = "#ddd";
      status.style.whiteSpace = "nowrap";

      const button = document.createElement("button");
      button.textContent = "💾";
      button.title = "다운로드";
      button.style.fontSize = "18px";
      button.addEventListener("click", async () => {
        try {
          container.scrollIntoView({ block: "center" });
          status.style.display = "block";
          status.textContent = "스크립트 로딩 중..";
          if (typeof unsafeWindow.GIF === "undefined") {
            await loadScript(
              "https://cdn.jsdelivr.net/npm/gif.js.optimized@1.0.1/dist/gif.js",
              "sha256-5A2Bh5t94U3qJPH34JFdAitO3i71TbnH4uWgZ/5J8TI="
            );
          }
          status.textContent = "화면 공유를 허용하여 주세요.";
          const stream = await navigator.mediaDevices.getDisplayMedia({
            preferCurrentTab: true,
          });
          const [track] = stream.getVideoTracks();
          await track.restrictTo(await RestrictionTarget.fromElement(svgNode));

          const video = document.createElement("video");
          video.srcObject = stream;
          video.muted = true;
          await video.play();

          const interval = 30;
          const workerBlob = new Blob(
            [
              `importScripts('https://cdn.jsdelivr.net/npm/gif.js.optimized@1.0.1/dist/gif.worker.js');`,
            ],
            { type: "application/javascript" }
          );
          const workerScript = URL.createObjectURL(workerBlob);
          const gif = new unsafeWindow.GIF({
            workers: 4,
            workerScript,
            dither: "FloydSteinberg-serpentine",
            quality: 5,
            width: video.videoWidth,
            height: video.videoHeight,
          });

          for (let i = 0; i < 90; i++) {
            status.textContent = `${i + 1}/90 프레임 녹화 중..`;
            gif.addFrame(video, { copy: true, delay: interval });
            await new Promise((resolve) => setTimeout(resolve, interval));
          }
          track.stop();

          const { promise: gifPromise, resolve } = Promise.withResolvers();
          gif.on("progress", (p) => {
            status.textContent = `${Math.floor(p * 100)}% 렌더링 중..`;
          });
          gif.on("finished", resolve);
          gif.render();
          const blob = await gifPromise;

          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `recap-${Date.now()}.gif`;
          a.click();
          URL.revokeObjectURL(url);
          status.textContent = "";
          status.style.display = "none";
        } catch (e) {
          alert(`오류가 발생했습니다: ${e}`);
        }
      });

      container.replaceChildren(
        ...(typeof RestrictionTarget === "undefined"
          ? [svgNode]
          : [svgNode, button, status])
      );
    } catch {}

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
            data: recapData,
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
