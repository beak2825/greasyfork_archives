// ==UserScript==
// @name         usedJSHeapSize Hud
// @namespace    https://alanslab.today/
// @version      2024-12-26
// @license      MIT
// @description  Add a usedJSHeapSize line chart at the bottom of your page.
// @author       Alan Zhang
// @include      https://glata-staging.bytedance.net/*
// @include      https://glata.bytedance.net/*
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js
// @downloadURL https://update.greasyfork.org/scripts/521930/usedJSHeapSize%20Hud.user.js
// @updateURL https://update.greasyfork.org/scripts/521930/usedJSHeapSize%20Hud.meta.js
// ==/UserScript==

(function () {
  "use strict";

  if (window.__HUD_INITED__) return;
  window.__HUD_INITED__ = true;

  const hud = document.createElement("canvas");
  hud.style.position = "fixed";
  hud.style.backgroundColor = "#eee";
  hud.style.bottom = "0";
  hud.style.right = "0";
  hud.style.width = "100%";
  hud.style.height = "300px";
  hud.style.zIndex = "9999";
  hud.addEventListener("click", () => {
    hud.style.bottom = hud.style.bottom === "0" ? "-290px" : "0";
  });
  window.document.body.appendChild(hud);

  const toggle = document.createElement("div");
  toggle.style.position = "fixed";
  toggle.style.bottom = "300px";
  toggle.style.right = "0";
  toggle.style.width = "50px";
  toggle.style.height = "30px";
  toggle.style.lineHeight = "30px";
  toggle.style.textAlign = "center";
  toggle.style.color = "white";
  toggle.style.backgroundColor = "darkgray";
  toggle.style.zIndex = "9999";
  toggle.style.cursor = "pointer";
  toggle.innerText = "HUD";
  let isShow = true;

  const toggleCallback = () => {
    if (isShow) {
      hud.style.backgroundColor = "transparent";
      hud.style.opacity = "0.6";
      hud.style.pointerEvents = "none";
    } else {
      hud.style.backgroundColor = "#eee";
      hud.style.opacity = "1";
      hud.style.pointerEvents = "auto";
    }
    isShow = !isShow;
  };
  toggle.addEventListener("click", toggleCallback);
  window.document.body.appendChild(toggle);

  toggleCallback();

  const chart = new Chart(hud, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "usedJSHeapSize",
          data: [],
        },
      ],
    },
    options: {
      responsive: true,
      interaction: {
        intersect: false,
        mode: "index",
      },
    },
  });

  setInterval(() => {
    chart.data.labels.push("");
    chart.data.datasets[0].data.push(
      window.performance.memory.usedJSHeapSize / 1024 / 1024,
    );
    chart.update();
  }, 3000);
})();
