// ==UserScript==
// @name         BTC\ETH等币种实时价格 + 折线图 (支持选择币种)
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  显示实时价格，支持左右选择币种，折线图展示，收起展开，全局控制，缓存50点数据。
// @author       Tom-dog
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547207/BTC%5CETH%E7%AD%89%E5%B8%81%E7%A7%8D%E5%AE%9E%E6%97%B6%E4%BB%B7%E6%A0%BC%20%2B%20%E6%8A%98%E7%BA%BF%E5%9B%BE%20%28%E6%94%AF%E6%8C%81%E9%80%89%E6%8B%A9%E5%B8%81%E7%A7%8D%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547207/BTC%5CETH%E7%AD%89%E5%B8%81%E7%A7%8D%E5%AE%9E%E6%97%B6%E4%BB%B7%E6%A0%BC%20%2B%20%E6%8A%98%E7%BA%BF%E5%9B%BE%20%28%E6%94%AF%E6%8C%81%E9%80%89%E6%8B%A9%E5%B8%81%E7%A7%8D%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 动态加载 Chart.js
  function loadChartJs(callback) {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";
    script.onload = callback;
    document.head.appendChild(script);
  }

  loadChartJs(() => {
    initUI();
    setInterval(updatePrices, 5000);
  });

  // ✅ 从 OKX 获取 USDT 交易对，然后写死在这里
  // 示例：你可以先请求一次 https://www.okx.com/api/v5/market/tickers?instType=SPOT
  // 筛选 instId 里包含 "-USDT" 的，把前半部分存进 coinList
  const coinList = [
    "BTC", "ETH", "OKB", "SOL", "XRP", "DOGE", "ADA", "TRX", "DOT", "MATIC",
    "LTC", "LINK", "FIL", "ATOM", "AVAX", "PEPE", "SHIB", "MEME"
  ];

  // 当前选择
  let selectedCoins = { left: "ETH", right: "BTC" };

  const charts = {};
  const priceSpans = { left: null, right: null };

  function initUI() {
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.top = "0";
    wrapper.style.left = "50%";
    wrapper.style.transform = "translateX(-50%)";
    wrapper.style.backgroundColor = "#fff";
    wrapper.style.color = "#000";
    wrapper.style.zIndex = "999999";
    wrapper.style.width = "650px";
    wrapper.style.padding = "5px";
    wrapper.style.fontSize = "14px";
    wrapper.style.border = "1px solid #ccc";

    // 顶部控制栏
    const controlBar = document.createElement("div");
    controlBar.style.display = "flex";
    controlBar.style.justifyContent = "space-between";
    controlBar.style.alignItems = "center";
    controlBar.style.marginBottom = "8px";

    // 左选择框
    const leftWrap = document.createElement("div");
    const leftSelect = document.createElement("select");
    coinList.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.text = c;
      if (c === selectedCoins.left) opt.selected = true;
      leftSelect.appendChild(opt);
    });
    leftSelect.onchange = () => {
      selectedCoins.left = leftSelect.value;
      resetChart("left", selectedCoins.left);
    };
    const leftPrice = document.createElement("span");
    leftPrice.style.marginLeft = "6px";
    leftPrice.innerText = "--";
    priceSpans.left = leftPrice;
    leftWrap.appendChild(leftSelect);
    leftWrap.appendChild(leftPrice);

    // 右选择框
    const rightWrap = document.createElement("div");
    const rightSelect = document.createElement("select");
    coinList.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.text = c;
      if (c === selectedCoins.right) opt.selected = true;
      rightSelect.appendChild(opt);
    });
    rightSelect.onchange = () => {
      selectedCoins.right = rightSelect.value;
      resetChart("right", selectedCoins.right);
    };
    const rightPrice = document.createElement("span");
    rightPrice.style.marginLeft = "6px";
    rightPrice.innerText = "--";
    priceSpans.right = rightPrice;
    rightWrap.appendChild(rightSelect);
    rightWrap.appendChild(rightPrice);

    // 收起展开按钮
    const toggleAllBtn = document.createElement("button");
    toggleAllBtn.innerText = "收起";
    toggleAllBtn.onclick = () => {
      const boxes = wrapper.querySelectorAll(".chart-box");
      const isHidden = Array.from(boxes).every((b) => b.style.display === "none");
      boxes.forEach((box) => (box.style.display = isHidden ? "block" : "none"));
      toggleAllBtn.innerText = isHidden ? "收起" : "展开";
    };

    controlBar.appendChild(leftWrap);
    controlBar.appendChild(rightWrap);
    controlBar.appendChild(toggleAllBtn);
    wrapper.appendChild(controlBar);

    // 图表容器
    const chartsContainer = document.createElement("div");
    chartsContainer.style.display = "flex";
    chartsContainer.style.gap = "8px";

    ["left", "right"].forEach((pos) => {
      const section = document.createElement("div");
      section.style.flex = "1";

      // 折线图容器
      const chartBox = document.createElement("div");
      chartBox.className = "chart-box";
      chartBox.style.height = "150px";
      const canvas = document.createElement("canvas");
      canvas.id = `chart-${pos}`;
      chartBox.appendChild(canvas);
      section.appendChild(chartBox);

      chartsContainer.appendChild(section);

      // 初始化图表
      charts[pos] = initChart(canvas, selectedCoins[pos]);
    });

    wrapper.appendChild(chartsContainer);
    document.body.appendChild(wrapper);
  }

  // 初始化 Chart
  function initChart(canvas, coin) {
    return new Chart(canvas, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: `${coin} Price`,
            data: [],
            borderColor: "blue",
            fill: false,
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        animation: false,
        plugins: {
          legend: { display: false }, // ✅ 不显示图例
        },
        scales: {
          x: { display: false },
          y: { beginAtZero: false },
        },
      },
    });
  }

  // 重置图表
  function resetChart(pos, coin) {
      const chart = charts[pos];
      // 清空旧数据
      chart.data.labels = [];
      chart.data.datasets[0].data = [];
      chart.data.datasets[0].label = `${coin} Price`;
      chart.update();

      // 价格置为 --
      priceSpans[pos].innerText = "--";
  }


  // 获取并更新价格
  async function updatePrices() {
    const time = new Date().getTime();

    for (const pos of ["left", "right"]) {
      const coin = selectedCoins[pos];
      try {
        const res = await fetch(
          `https://www.okx.com/api/v5/market/ticker?instId=${coin}-USDT&_=${time}`
        ).then((r) => r.json());

        const price = parseFloat(res.data[0].last);
        updateChart(pos, coin, price);
      } catch (e) {
        console.error(`获取 ${coin} 价格失败:`, e);
      }
    }
  }

  // 更新图表
  function updateChart(pos, coin, price) {
    const chart = charts[pos];
    const label = new Date().toLocaleTimeString();

    const dataset = chart.data.datasets[0];
    dataset.label = `${coin} Price`;
    dataset.data.push(price);
    chart.data.labels.push(label);

    // 限制最大 50 点
    if (dataset.data.length > 50) {
      dataset.data.shift();
      chart.data.labels.shift();
    }

    // ✅ 更新选择框后面的价格
    priceSpans[pos].innerText = `$${price}`;

    chart.update();
  }
})();
