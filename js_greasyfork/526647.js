// ==UserScript==
// @name         点点数据详细页完整版
// @version      2025-02-12
// @author       DethanZ
// @description  在榜单详细页面加入候选, 并提供清单查看、删除和清空功能, 导出所有候选应用的 CSV 文件
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA+CAYAAABzwahEAAAE0klEQVRoBeXBPWjcZgCA4VefdGdHtppQixYfqJAhd0uXcEMhhpIETwZ5TJNs6eAbSungpgS6uNChNO7WDDGk2fKz2iVZjGsoXkqNl3a4yxCIQK7NXS6JfEp8sk7FgyEc+i4+6ZwE9DxKsxVFZJAgowQZJcgoQUYJMkqQUYKMEmSUIKMEGSXIKEFGaQzA39Vdfl/zed2oLrg8OUrBVDmwtOazXt1FZtzUMHSFopWjZOUxdIWjopGS2wipXG8QZ7MR8stXH7Jvac1n7vYz+lEu5bHP6NgTOoMmSKn2JOAwqk5Av9arbeZuP8O+tsXSms8gCVJyG3vIFK0cB2pOQFJuPWTu9jNmbzzFrYcMgiAltx4iUxhTOeD5EWmtbryiMl/HrYekJUip5gTIFEyVAzUnYBDcekhlvo7nR6QhOCIFU6Vo5dnn+R0Gya2HzN5okIbSbEURKbiNkKU1n27nTg9TtHIcWN14RdUJkPH8DjUnoOYEeH7EYcxdOYE9oZOE0mxFEe+ZpTWfhUUPtxHSi6ELln76GENX6JfgPWRP6Nz8zuTs6WF68fwOqxsvSUJptqKIhDw/4ubiC3b8Dq8b1QWV6Q8wdIW0Zm88ZXXjFTLlUp6Fqyb90kjh5uIL7i63iFOyctgTOmnNXTmBXd3C8yPirFfbeH6EoSv0Q5BCzQmQKZgqg2Dogplpg15qTpt+aaTg+REy42MacYbv3yK/8pB90cgo0cgo7XNTtM9PIWOf0VlY9PD8iDhVZ49yaYh+aKRQcwJkCqZKt/zKA4bv/UY37Z8NtH838L/+njiGLihaOdarbeJ4fod+CRJy6yEyRStHnNxffyKTX3nA8P1byBStHIMkSMht7CFj6ApxxPYmveRXHiJj6IJBEiRUcwJkilaOOOrjR/QitjdJwtAF/RIk5NZDZAqmRjexvcmbRCOjyNScNjKFMZV+CRLabOwhU7I0uont/3iT8OQpZGpP9pApWjn6JUjIrXeQGdVVuontTd6kfW6KODUnwG2ExCmYKgVTpV+ChDYbe8iULI1uYnuTXnbtC7TPTxHnzvIOMuXiEEkIEvD8Dp4fEacwphJHae0gs2tf4OWX3xDHbYQsrb1Exp44RhIaCVSdAJlxUyXOrn0B9fEjXheePEXw2efsfXoamcrPdWSKVo5yaYgkNBLY8SP61flonJ0ff6Uf8/ee4zZCZC5PjpCUIIGqEyBTc/YYhPl7z7m73ELm7Olh7AmdpAQJeH4HGc/vsF7dJSm3ETJzvc7d5RYyhq4w+8Vx0hAkYOiCXmZvNHHrIf3w/Iibix6Xf9hmvdqml8r0BxRMlTQ0EiiMqfTi+R3sa1vYZ45RLg0xbqp08/yIHb9D1QmoOQHr1TaHUZk2uDQ5QlpKsxVF9Mmth9jXtnjb7AmduSsnGARBAgVTpVzK8zZVpg3mrpxgUAQJVaYN3gZDV/j24nFmpg0GSZBQuTTE5ckRjlK5lGfhqsmlyREGTSOF2YvH2XdnucUgFUyVGdvAntA5KkqzFUWktLTms7Do4TZCkjJ0haKVozJtUC4NcdSUZiuKGJD16i5/bLyi5gQcRmFMpfhJjpKVo2jlMXSFt0VptqKIDBJklCCjBBklyChBRgkySpBRgowSZJQgowQZpfHuRbwD/wOX1rro0ceVGQAAAABJRU5ErkJggg==
// @match        https://app.diandian.com/rank/*
// @match        https://app.diandian.com/app/*
// @license      GPL-3.0 License
// @run-at       document-start
// @namespace    http://tampermonkey.net/
// @supportURL   https://github.com/dethanzhang/UserScript
// @homepageURL  https://github.com/dethanzhang/UserScript
// @downloadURL https://update.greasyfork.org/scripts/526647/%E7%82%B9%E7%82%B9%E6%95%B0%E6%8D%AE%E8%AF%A6%E7%BB%86%E9%A1%B5%E5%AE%8C%E6%95%B4%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/526647/%E7%82%B9%E7%82%B9%E6%95%B0%E6%8D%AE%E8%AF%A6%E7%BB%86%E9%A1%B5%E5%AE%8C%E6%95%B4%E7%89%88.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 存储候选应用清单
  const candidates = JSON.parse(localStorage.getItem("candidates")) || [];

  // 备份原始的 open 和 send 方法
  const _open = XMLHttpRequest.prototype.open;
  const _send = XMLHttpRequest.prototype.send;

  // 重写 open 方法
  XMLHttpRequest.prototype.open = function (
    method,
    url,
    async,
    user,
    password
  ) {
    this._url = url; // 记录请求的 URL
    return _open.apply(this, arguments);
  };

  // 使用闭包来确保每个页面有独立的 captured 和 rankjson 变量
  (function () {
    let captured = false;
    let rankjson = [];

    const pattern = /\/trend\?.*&brand_id=0/; // 判断是否为指定的请求链接

    // 重写 send 方法
    XMLHttpRequest.prototype.send = function (body) {
      // 如果是符合条件的url则捕获
      if (!captured && pattern.test(this._url)) {
        let _onload = this.onload; // 备份原来的 onload 事件（如果有）
        this.onload = function (event) {
          if (_onload) _onload.call(this, event); // 保持原来的逻辑
          rankjson.push(JSON.parse(this.responseText));
          captured = true; // 处理完后设置标志为 true，停止进一步捕获
        };
      }
      return _send.apply(this, arguments);
    };

    // **添加应用到候选清单&存储所有数据的逻辑**
    async function addToCandidates() {
      if (!captured) {
        clickBtn();
      }
      // 等待 captured 变为 true
      while (!captured) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // 等待
      }

      const { rank1, rank2, rank3 } = processJsonData(rankjson[0].data.list); // 处理jsonData

      const appName = document.querySelector("div.ellip.font-600")
        ? document.querySelector("div.ellip.font-600").innerText.trim()
        : "未知";
      const { appCategory, appDownloads } = getCategoryAndDownloads(); // 应用类别和下载量
      const appLink = window.location.href.replace(
        "/googleplay-rank?",
        "/googleplay?"
      );

      // 将当前应用的信息加入候选清单
      const appData = {
        name: appName,
        category: appCategory,
        rank1: rank1,
        rank2: rank2,
        rank3: rank3,
        downloads: formatNumberToChinese(appDownloads),
        pubtime: getPubTime(),
        link: appLink,
      };
      if (!candidates.some((app) => app.link === appData.link)) {
        candidates.push(appData); // 确保去重
        localStorage.setItem("candidates", JSON.stringify(candidates));
        // alert('已加入候选清单！');
        renderCandidatesPanel(); // 更新候选清单面板
      } else {
        alert("此应用已在候选清单中！");
      }
    }

    // 详情页显示“加入候选”
    if (window.location.href.includes("/app/")) {
      createButton("加入候选", addToCandidates);
    }
  })();

  // **获取当前日期（格式：YYYYMMDD）**
  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 月份是从 0 开始的
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  }

  // **格式化数字为中文格式**
  function formatNumberToChinese(numStr) {
    numStr = numStr.replace(/,/g, "");
    const hasPlus = numStr.includes("+");
    const num = parseFloat(numStr.replace("+", ""));

    let result;
    if (num >= 100000000) {
      result = Math.round(num / 100000000) + "亿"; // 四舍五入到整数
    } else if (num >= 10000) {
      result = Math.round(num / 10000) + "万"; // 四舍五入到整数
    } else {
      result = num.toString();
    }
    if (hasPlus) {
      result += "+";
    }
    return result;
  }

  // **监听页面可见性变化**
  function visibilityChangeHandler() {
    if (document.visibilityState === "hidden") {
      stopListener(); // 切到后台时停止监听
      requestAnimationFrame(startListener); // 下次回到前台时重新监听
    }
  }

  // **开始监听**
  function startListener() {
    // 重新读取 localStorage 中的 candidates
    const updatedCandidates =
      JSON.parse(localStorage.getItem("candidates")) || [];
    candidates.length = 0; // 清空当前数组
    candidates.push(...updatedCandidates); // 更新为最新的候选清单
    renderCandidatesPanel(); // 更新候选清单面板
    document.addEventListener("visibilitychange", visibilityChangeHandler);
  }

  // **停止监听**
  function stopListener() {
    document.removeEventListener("visibilitychange", visibilityChangeHandler);
  }

  // **创建上方按钮: 加入候选**
  function createButton(text, onClickHandler) {
    const button = document.createElement("button");
    button.innerText = text;
    button.style.position = "fixed";
    button.style.top = "60px";
    button.style.right = "20px";
    button.style.padding = "10px";
    button.style.background = "#007bff";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.zIndex = "1000";

    button.onclick = onClickHandler;
    document.body.appendChild(button);
  }

  // **创建按钮: 导出候选清单**
  function createExportButton() {
    const exportButton = document.createElement("button");
    exportButton.textContent = "导出候选清单CSV";
    exportButton.style.position = "absolute";
    exportButton.style.top = "10px";
    exportButton.style.right = "10px";
    exportButton.style.padding = "5px";
    exportButton.style.background = "#28a745";
    exportButton.style.color = "white";
    exportButton.style.border = "none";
    exportButton.style.borderRadius = "5px";
    exportButton.style.cursor = "pointer";
    exportButton.style.zIndex = "1000";

    exportButton.onclick = exportCandidateList;
    return exportButton;
  }

  // **创建候选清单面板**
  function createCandidatesPanel() {
    const panel = document.createElement("div");
    panel.id = "candidatesPanel";
    panel.style.position = "fixed";
    panel.style.bottom = "20px";
    panel.style.right = "20px";
    panel.style.width = "400px";
    panel.style.height = "200px";
    panel.style.overflowY = "auto";
    panel.style.backgroundColor = "white";
    panel.style.border = "1px solid #ccc";
    panel.style.padding = "10px";
    panel.style.zIndex = "1000";
    panel.style.display = "none"; // 默认隐藏

    const title = document.createElement("h3");
    title.innerText = "候选清单";
    panel.appendChild(title);

    // 添加导出候选清单按钮
    const exportButton = createExportButton();
    panel.appendChild(exportButton);

    // 添加清空候选清单按钮
    const clearButton = document.createElement("button");
    clearButton.innerText = "清空";
    clearButton.style.marginBottom = "10px";
    clearButton.onclick = clearCandidates;
    panel.appendChild(clearButton);

    document.body.appendChild(panel);
  }

  // **渲染候选清单**
  function renderCandidatesPanel() {
    const panel = document.getElementById("candidatesPanel");
    panel.style.display = "block"; // 显示候选面板

    // 清空现有清单
    panel.innerHTML = "<h3>候选清单</h3>";

    // 添加导出候选清单按钮
    const exportButton = createExportButton();
    panel.appendChild(exportButton);

    const clearButton = document.createElement("button");
    clearButton.innerText = "清空";
    clearButton.style.marginBottom = "10px";
    clearButton.onclick = clearCandidates;
    panel.appendChild(clearButton);

    // 渲染所有候选项
    candidates.forEach((app, index) => {
      const appDiv = document.createElement("div");
      appDiv.style.display = "flex";
      appDiv.style.justifyContent = "space-between";
      appDiv.style.marginBottom = "5px";

      const appInfo = document.createElement("span");
      appInfo.innerText = `${app.name} (${app.category})`;

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "删除";
      deleteButton.style.backgroundColor = "#ff6666";
      deleteButton.style.color = "white";
      deleteButton.style.border = "none";
      deleteButton.style.borderRadius = "3px";
      deleteButton.style.cursor = "pointer";
      deleteButton.onclick = () => deleteCandidate(index);

      appDiv.appendChild(appInfo);
      appDiv.appendChild(deleteButton);
      panel.appendChild(appDiv);
    });
  }

  // **删除候选清单中的某个应用**
  function deleteCandidate(index) {
    candidates.splice(index, 1);
    localStorage.setItem("candidates", JSON.stringify(candidates));
    renderCandidatesPanel(); // 更新面板
  }

  // **清空候选清单**
  function clearCandidates() {
    candidates.length = 0;
    localStorage.setItem("candidates", JSON.stringify(candidates));
    renderCandidatesPanel(); // 更新面板
  }

  // **获取应用类别和下载量**
  function getCategoryAndDownloads() {
    // 先获取正确的父容器
    const parentContainer = document.querySelector("div.app-info-card.dd-flex");
    if (!parentContainer) {
      console.log("未找到正确的父容器！");
      return "未知类别";
    }
    // 获取该容器下所有 app-info-card-item
    const items = parentContainer.querySelectorAll("div.app-info-card-item");

    // 获取items中的第3个元素
    const blockCategory = items[2].querySelector("div.app-desc-value");
    const categoryElement = blockCategory.querySelector("a.dd-desc-color");

    // 获取items中的倒数第2个元素
    const blockDownloads =
      items[items.length - 2].querySelector("div.app-value");
    const downloadsElement = blockDownloads.querySelector("a.app-value");
    // 返回类别和下载量
    return {
      appCategory: categoryElement
        ? categoryElement.innerText.trim()
        : "未知类别",
      appDownloads: downloadsElement
        ? downloadsElement.innerText.trim()
        : "未知下载量",
    };
  }

  // **获取应用发布时间**
  function getPubTime() {
    const parentContainer = document.querySelector("div.app-base-info-wrap");
    if (!parentContainer) {
      return "-";
    }
    const item = parentContainer.querySelectorAll(
      "div.content-title.dd-flex.dd-flex-end"
    )[1];
    return item ? item.innerText.trim() : "-";
  }

  // **模拟点击"排行榜全部"按钮**
  function clickBtn() {
    const btn = document
      .querySelector("ul.filter-list.filter-group.dd-overflow-visible")
      .querySelectorAll("a.toggle-item")[0];
    if (btn) {
      btn.click();
    }
  }

  // **将存储的jsonData进行处理**
  // "rank_type": 2, 游戏榜
  // "genre_id": 33, 游戏总榜
  // "brand_id": 1, 免费
  // "brand_id": 2, 畅销
  // "brand_id": 3, 付费
  // "brand_id": 5, 人气蹿升
  function processJsonData(rankData) {
    let rank1 = "-";
    let rank2 = "-";
    let rank3 = "-";

    rankData.forEach((item) => {
      if (
        item.rank_type === 2 &&
        item.genre_id === 33 &&
        (item.brand_id === 1 || item.brand_id === 3)
      ) {
        // 免费/付费榜排名
        rank1 = item.stats.at(-1).at(-1) ? item.stats.at(-1).at(-1) : "-";
      }
      if (item.rank_type === 2 && item.genre_id === 33 && item.brand_id === 2) {
        // 畅销榜排名
        rank2 = item.stats.at(-1).at(-1) ? item.stats.at(-1).at(-1) : "-";
      }
      if (item.rank_type === 2 && item.genre_id === 33 && item.brand_id === 5) {
        // 人气蹿升榜排名
        rank3 = item.stats.at(-1).at(-1) ? item.stats.at(-1).at(-1) : "-";
      }
    });
    return { rank1, rank2, rank3 };
  }

  // **通用 CSV 导出函数**
  function exportToCSV(data, filename) {
    // 去重：基于应用名称进行去重
    const uniqueData = Array.from(new Set(data.map((app) => app.name))).map(
      (name) => {
        return data.find((app) => app.name === name);
      }
    );

    let csvContent =
      "名称,类别,免费/付费榜,畅销榜,人气蹿升榜,下载量,发布时间,链接\n";
    uniqueData.forEach((app) => {
      csvContent += `"${app.name}","${app.category}","${app.rank1}","${app.rank2}","${app.rank3}","${app.downloads}","${app.pubtime}","${app.link}"\n`;
    });

    // 生成带日期的文件名
    const fullFilename = `${filename}_${getCurrentDate()}.csv`;

    // 创建 CSV 下载链接
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", fullFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // **导出候选清单**
  function exportCandidateList() {
    const candidateApps = [...candidates];
    if (candidateApps.length === 0) {
      alert("候选清单为空！");
      return;
    }
    exportToCSV(candidateApps, "详情页_候选清单");
    // **清空候选清单**
    clearCandidates();
  }

  // **主逻辑**
  requestAnimationFrame(startListener); // 开始监听页面可见性变化

  createCandidatesPanel(); // 创建候选清单面板
  renderCandidatesPanel(); // 渲染候选清单
})();
