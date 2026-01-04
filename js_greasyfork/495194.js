// ==UserScript==
// @name        Log Summary JSON Extractor
// @namespace   Violentmonkey Scripts
// @match       https://console.cloud.google.com/logs/*
// @require     https://unpkg.com/arrive@2.4.1/src/arrive.js
// @require     https://unpkg.com/chart.js@2.9.4/dist/Chart.min.js
// @license MIT
// @grant       none
// @version     2.0
// @author      -
// @description 5/16/2024, 11:13:25 AM
// @downloadURL https://update.greasyfork.org/scripts/495194/Log%20Summary%20JSON%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/495194/Log%20Summary%20JSON%20Extractor.meta.js
// ==/UserScript==

const iconSize = 16;
let bottomChart;
let topChart;
let scriptInitialized = false;
let dialogInjected = false;
let currentDataAsText = "";
const dialog = document.createElement("dialog");
const loaderIconURL =
  "https://img.icons8.com/material-outlined/24/spinner-frame-2.png";
const chartIconURL = "https://img.icons8.com/ios-filled/50/pie-chart.png";

const colorGradient = [
  "#d60032",
  "#e32968",
  "#e44e99",
  "#da71c1",
  "#cb8fde",
  "#bda9f0",
  "#b7c0f6",
  "#bdd4f6",
  "#d0e4f3",
  "#ecf1f3",
].reverse();

function copyToClipboard() {
  navigator.clipboard
    .writeText(currentDataAsText)
    .then(() => {
      console.log("Text copied to clipboard");
    })
    .catch((error) => {
      alert("Failed to copy :(");
      console.error("Error copying text to clipboard:", error);
    });
}

// window.copyToClipboard = () => {
//   const el = document.createElement('textarea');
//   el.value = currentDataAsText;
//   el.setAttribute('readonly', '');
//   el.style.position = 'absolute';
//   el.style.left = '-9999px';
//   document.body.appendChild(el);
//   const selected =
//     document.getSelection().rangeCount > 0
//       ? document.getSelection().getRangeAt(0)
//       : false;
//   el.select();
//   document.execCommand('copy');
//   document.body.removeChild(el);
//   if (selected) {
//     document.getSelection().removeAllRanges();
//     document.getSelection().addRange(selected);
//   }
// };
const makeDownloadImage = () => {
  let img = document.createElement("img");
  img.width = iconSize;
  img.height = iconSize;
  img.src = chartIconURL;
  return img;
};
const splitData = (data) => {
  const result = [];
  const mean = Math.round(
    Object.values(data).reduce((acc, num, idx, arr) => {
      acc += num;
      if (idx === arr.length - 1) {
        return acc / arr.length;
      }
      return acc;
    }, 0),
  );
  let bottom = Object.fromEntries(
    Object.entries(data).filter(([key, val]) => val <= mean),
  );
  let top = Object.fromEntries(
    Object.entries(data).filter(([key, val]) => val >= mean),
  );
  return { bottom, top, mean };
};

function renderChart(chartId, rawData, chartTitle) {
  const labels = Object.keys(rawData);
  const data = Object.values(rawData);
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);

  const backgroundColor = data.map((value) => {
    const normalizedValue = Math.floor(
      ((value - minValue) / (maxValue - minValue)) * 9,
    );
    return colorGradient[normalizedValue];
  });
  const cfg = {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
        },
      ],
    },
    options: {
      title: { text: chartTitle, display: true },
      legend: {
        display: false,
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  };
  return new Chart(chartId, cfg);
}

function parentUntil(el, predicate, count = 0) {
  let currentEl = el;
  if (count > 20) {
    throw new Error("parentUntil out of bounds");
  }
  if (predicate(currentEl)) {
    return currentEl;
  }
  count++;
  return parentUntil(currentEl.parentElement, predicate, count);
}

async function wait(ms = 250) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

async function digest(el) {
  let isApprox = false;
  const root = parentUntil(el, (x) =>
    x.classList.contains("mat-expansion-panel"),
  );
  let moreToShow = root.querySelector(".show-more-button");
  while (moreToShow) {
    moreToShow.click();
    await wait(1000);
    moreToShow = root.querySelector(".show-more-button");
  }
  const data = Object.fromEntries(
    Array.from(root.querySelectorAll(".mdc-list-item__content")).map((x) => {
      const name = x
        .querySelector(".logs-field-aggregation-value-name")
        .textContent.trim();
      const preApproxCheck = x
        .querySelector(".logs-field-aggregation-value-count")
        .textContent.trim()
        .replaceAll(",", "");
      if (preApproxCheck.includes("~")) {
        isApprox = true;
      }
      const val = Number(preApproxCheck.replaceAll("~", ""));
      return [name, val];
    }),
  );
  return { data, isApprox };
}

const b = document.querySelector("body");
b.arrive(".logs-field-aggregation .logs-highlightable-text", async (el) => {
  if (!scriptInitialized) {
    console.log("initializing AESI");
    scriptInitialized = true;
    const styleText = `
      .aesi_rotate {
        animation: rotating 2s linear infinite;
      }
      .aesi_dialog {
        max-height: 50vh;
        min-width: 50vw;
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: min-content 1fr 1fr;
        align-items: start;
        gap: 10px 0px;
        grid-template-areas:
          "Buttons Buttons"
          "JSON ChartTop"
          "JSON ChartBottom";
      }
      .aesi_dialog .aesi_warning {
        grid-area: Buttons;
        font-weight: bold;
        font-size: 1.1rem;
        text-transform: uppercase;
        padding: 10px;
        background-color: #f95738;
        color: white;
        align-content: center;
        margin-left: auto;
      }
      .aesi_dialog .aesi_buttons {
        grid-area: Buttons;
        display: flex;
        gap: 10px;
      }
      .aesi_copy_json {
      }
      .aesi_buttons button,
      input[type="button"] {
        font-size: 1.2rem;
        border: none;
        padding: 10px;
        color: white;
        background-color: #3273dc;
        cursor: pointer;
      }
      .aesi_dialog pre {
        display: block;
        font-family: monospace;
        white-space: pre;
        padding: 1em;
        background-color: #f7f7f7;
        overflow: scroll;
        grid-area: JSON;
      }

      .aesi_dialog .aesi_canvas_top {
        grid-area: ChartTop;
      }
      .aesi_dialog .aesi_canvas_bottom {
        grid-area: ChartBottom;
      }

      @keyframes rotating {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
`;
    let style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = styleText;
    document.querySelector("head").appendChild(style);
    dialog.id = "aesi_dialog_root";
    dialog.innerHTML = `
      <div class="aesi_dialog">
        <form method="dialog" class="aesi_buttons">
          <button>Close</button>
          <input class="aesi_copy_json" type="button" value="Copy JSON" />
          <div class="aesi_warning">Note: Certain values are approximated</div>
        </form>
        <pre>Data go here</pre>
        <div class="aesi_canvas_top">
          <canvas id="aesi_chart_top" />
        </div>
        <div class="aesi_canvas_bottom">
          <canvas id="aesi_chart_bottom" />
        </div>
      </div>;
    `;
    document.querySelector("body").appendChild(dialog);
    document
      .querySelector(".aesi_copy_json")
      .addEventListener("click", copyToClipboard);
    console.log("AESI initialized");
  }
  if (!el.hasAttribute("aesi")) {
    el.setAttribute("aesi", 1);

    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.gap = `${iconSize / 2}px`;
    const icon = makeDownloadImage();
    icon.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      icon.src = loaderIconURL;
      icon.classList.add("aesi_rotate");
      digest(el)
        .then(({ data: rawData, isApprox }) => {
          currentDataAsText = JSON.stringify(rawData, null, 2);
          document.querySelector(".aesi_dialog pre").textContent =
            currentDataAsText;
          const { bottom, top, mean } = splitData(rawData);
          if (bottomChart) bottomChart.destroy();
          if (topChart) topChart.destroy();
          document.querySelector(".aesi_warning").style.display = isApprox
            ? "block"
            : "none";
          bottomChart = renderChart(
            "aesi_chart_bottom",
            bottom,
            `Under Mean of ${mean}`,
          );
          topChart = renderChart("aesi_chart_top", top, `Over Mean of ${mean}`);
          dialog.showModal();
        })
        .finally(() => {
          icon.src = chartIconURL;
          icon.classList.remove("aesi_rotate");
        });
    });
    el.prepend(icon);
  }
});
