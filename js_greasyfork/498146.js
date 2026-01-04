// ==UserScript==
// @name         即刻收藏导出
// @namespace    https://xhs.mundane.ink
// @version      1.0
// @description  导出即刻收藏
// @match        https://web.okjike.com/me/*
// @match        https://web.okjike.com/u/*/collection
// @license      MIT
// @run-at       document-start
// @grant        unsafeWindow
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js
// @icon         https://web.okjike.com/favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/498146/%E5%8D%B3%E5%88%BB%E6%94%B6%E8%97%8F%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/498146/%E5%8D%B3%E5%88%BB%E6%94%B6%E8%97%8F%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.log("即刻脚本生效了");

  const collectionList = [];
  const btnScroll = document.createElement("button");
  btnScroll.innerHTML = "自动滚动";
  btnScroll.style.position = "fixed";
  btnScroll.style.top = "160px";
  btnScroll.style.right = "20px";
  btnScroll.style.backgroundColor = "#056b00";
  btnScroll.style.color = "#fff";
  btnScroll.style.padding = "8px";
  btnScroll.style.borderRadius = "6px";
  btnScroll.style.zIndex = "1000";

  const btnCount = document.createElement("button");
  btnCount.innerHTML = "捕获数量：" + collectionList.length;
  btnCount.style.position = "fixed";
  btnCount.style.top = "210px";
  btnCount.style.right = "20px";
  btnCount.style.backgroundColor = "#056b00";
  btnCount.style.color = "#fff";
  btnCount.style.padding = "8px";
  btnCount.style.borderRadius = "6px";
  btnCount.style.zIndex = "1000";

  const btnExport = document.createElement("button");
  btnExport.innerHTML = "导出收藏";
  btnExport.style.position = "fixed";
  btnExport.style.top = "260px";
  btnExport.style.right = "20px";
  btnExport.style.backgroundColor = "#056b00";
  btnExport.style.color = "#fff";
  btnExport.style.padding = "8px";
  btnExport.style.borderRadius = "6px";
  btnExport.style.zIndex = "1000";

  document.body.appendChild(btnExport);
  document.body.appendChild(btnScroll);
  document.body.appendChild(btnCount);

  let isScrolling = false;
  let timerId;

  function simulateScroll() {
    // window.scrollBy(0, 200);
    window.scrollBy({ top: 200, left: 0, behavior: "smooth" });
  }

  function startScroll() {
    if (isScrolling) {
      return;
    }
    isScrolling = true;
    btnScroll.innerHTML = "停止滚动";
    btnScroll.style.backgroundColor = "#ff2442";
    timerId = setInterval(simulateScroll, 200);
  }

  function cancelScroll() {
    if (!isScrolling) {
      return;
    }
    isScrolling = false;
    btnScroll.style.backgroundColor = "#056b00";
    btnScroll.innerHTML = "自动滚动";
    if (timerId) {
      clearInterval(timerId);
    }
  }

  // 给按钮添加点击事件
  btnScroll.addEventListener("click", function () {
    if (isScrolling) {
      cancelScroll();
    } else {
      startScroll();
    }
  });

  btnExport.addEventListener("click", function () {
    // 创建工作簿
    const wb = XLSX.utils.book_new();

    // 准备数据
    const data = [
      ["链接", "内容", "用户", "创建时间"],
      ...collectionList.map((item) => [
        item.url,
        item.content,
        item.user,
        item.createdAt,
      ]),
    ];

    // 创建工作表
    const ws = XLSX.utils.aoa_to_sheet(data);

    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, "即刻收藏");

    // 生成 Excel 文件并下载
    XLSX.writeFile(wb, "即刻收藏.xlsx");
  });

  // 拦截 fetch 请求
  const originFetch = fetch;
  window.unsafeWindow.fetch = (url, options) => {
    return originFetch(url, options).then(async (response) => {
      if (url === "https://web-api.okjike.com/api/graphql") {
        const responseClone = response.clone();
        let res = await responseClone.json();
        intercept(res);
        const responseNew = new Response(JSON.stringify(res), response);
        return responseNew;
      } else {
        return response;
      }
    });
  };

  function formatDate(dateString) {
    // 创建 Date 对象
    const date = new Date(dateString);
    // 获取年、月、日、时、分、秒
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    // 组合成所需格式
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  function intercept(res) {
    if (
      res.data &&
      res.data.viewer &&
      res.data.viewer.collections &&
      res.data.viewer.collections.nodes
    ) {
      const nodes = res.data.viewer.collections.nodes;

      const collections = nodes.map((node) => {
        return {
          url: `https://web.okjike.com/originalPost/${node.id}`,
          content: node.content,
          user: node.user.screenName,
          createdAt: formatDate(node.createdAt),
        };
      });
      collectionList.push(...collections);

      btnCount.innerHTML = "捕获数量：" + collectionList.length;
    }
  }
})();
