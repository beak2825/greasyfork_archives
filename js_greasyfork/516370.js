// ==UserScript==
// @name         SDVX难度表功能增强
// @namespace    fun.sanhei
// @version      2024-11-08
// @description  在SDVX难度表中查看歌曲详情时添加追加日、物量、雷达图，信息来自sdvxindex.com
// @author       Sanhei
// @match        sdvx.maya2silence.com
// @include      *://sdvx.maya2silence.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=maya2silence.com
// @grant        GM_xmlhttpRequest
// @connect      sdvxindex.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516370/SDVX%E9%9A%BE%E5%BA%A6%E8%A1%A8%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/516370/SDVX%E9%9A%BE%E5%BA%A6%E8%A1%A8%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // 使用 GM_xmlhttpRequest 请求跨域数据
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://sdvxindex.com/js/data.js",
    onload: function (response) {
      if (response.status === 200) {
        // 移除声明并解析 JSON 数据
        const text = response.responseText
          .replace("const songs = ", "")
          .replace(/;\s*$/, "");
        const jsonData = JSON.parse(text);

        // 查找 modal_body 元素并观察其变化
        const modalBody = document.querySelector("#modal_body");
        if (modalBody) {
          const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
              if (mutation.type === "childList") {
                // 检查是否有新的 .chartinfo_body 元素被添加
                mutation.addedNodes.forEach((node) => {
                  if (
                    node.nodeType === 1 &&
                    node.classList.contains("modal-content")
                  ) {
                    const chartinfoBody =
                      document.querySelector(".chartinfo_body");
                    const jacket = document.querySelector("#chartinfo_jacket");
                    // 修改展示的信息
                    proc(chartinfoBody, jacket, jsonData);
                  }
                });
              }
            }
          });

          // 监听 modal_body 子元素变化
          observer.observe(modalBody, { childList: true, subtree: true });
        }
      } else {
        console.error("Failed to fetch data.js:", response.statusText);
      }
    },
    onerror: function (error) {
      console.error("Error fetching data.js:", error);
    },
  });

  function proc(chartinfoBody, jacket, songsData) {
    // 查找包含 'タイトル' 文本的 dt 元素并找到后面的 dd 元素
    const dtElements = chartinfoBody.querySelectorAll("dt");
    let titleElement = null;

    // 获取难度类型
    const diffTypeMap = {
      EXH: "exhaust",
      MXM: "maximum",
      INF: "infinite",
      GRV: "gravity",
      HVN: "heavenly",
      VVD: "vivid",
      XCD: "exceed",
    };
    const diffType = jacket ? jacket.getAttribute("data-diff_type") : null;
    const difficulty = diffTypeMap[diffType];

    dtElements.forEach((dt) => {
      if (dt.textContent.trim() === "タイトル") {
        titleElement = dt.nextElementSibling;
      }
    });

    if (titleElement) {
      const titleText = titleElement.innerText.trim();
      const matchingSong = songsData.find((song) => song.title === titleText);
      if (matchingSong) {
        // 查找 "ノーツ数" 的 dt 元素
        let notesElement = null;
        dtElements.forEach((dt) => {
          if (dt.textContent.trim() === "ノーツ数") {
            notesElement = dt.nextElementSibling;
          }
        });

        if (notesElement && difficulty) {
          const difficultyData = matchingSong.difficulties.find(
            (d) => d.type === difficulty
          );
          if (difficultyData) {
            notesElement.textContent = difficultyData.max_chain;

            // 创建一个雷达图
            const radarCanvas = document.createElement("canvas");
            radarCanvas.width = 150;
            radarCanvas.height = 150;

            // 设置雷达图的样式，覆盖在 jacket 元素上
            radarCanvas.style.position = "absolute";
            radarCanvas.style.top = "50%";
            radarCanvas.style.left = "50%";
            radarCanvas.style.transform = "translate(-50%, -50%)";
            radarCanvas.style.pointerEvents = "none";

            jacket.appendChild(radarCanvas);

            const radarData = [
              difficultyData.radar.notes,
              difficultyData.radar.peak,
              difficultyData.radar.tsumami,
              difficultyData.radar.tricky,
              difficultyData.radar.handtrip,
              difficultyData.radar.onehand,
            ];

            drawRadarChart(radarCanvas, radarData);
          }
        }

        const dateAddedLabel = document.createElement("dt");
        dateAddedLabel.textContent = "追加日";
        const dateAddedValue = document.createElement("dd");
        dateAddedValue.textContent = matchingSong.date;

        chartinfoBody.appendChild(dateAddedLabel);
        chartinfoBody.appendChild(dateAddedValue);
      }
    }
  }

  function drawRadarChart(canvas, data) {
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 75;
    const halfRadius = radius / 2;
    const maxDataValue = 200;
    const angleOffset = Math.PI / 3;

    // Draw the outer hexagon (full radius)
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = i * angleOffset - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fill();
    ctx.strokeStyle = "#ddd";
    ctx.stroke();

    // Draw the inner hexagon (half radius)
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = i * angleOffset - Math.PI / 2;
      const x = centerX + halfRadius * Math.cos(angle);
      const y = centerY + halfRadius * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.strokeStyle = "#bbb";
    ctx.stroke();

    // Draw the radar data (hexagon filled)
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const angle = i * angleOffset - Math.PI / 2;
      const valueRadius = (data[i] / maxDataValue) * radius;
      const x = centerX + valueRadius * Math.cos(angle);
      const y = centerY + valueRadius * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(0, 128, 255, 0.8)";
    ctx.fill();
    ctx.strokeStyle = "#44aaff";
    ctx.stroke();
  }
})();
