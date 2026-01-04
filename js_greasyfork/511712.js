// ==UserScript==
// @name         Linux.do 抽奖器
// @namespace    http://linux.do/
// @version      1.0.3
// @description  在Linux.do平台上进行抽奖，支持文章切换时自动更新，以表格形式展示结果，包含用户头像和参与时间，支持时间范围选择
// @author       PastKing
// @match        https://www.linux.do/t/topic/*
// @match        https://linux.do/t/topic/*
// @grant        none
// @license      MIT
// @icon         https://cdn.linux.do/uploads/default/optimized/1X/3a18b4b0da3e8cf96f7eea15241c3d251f28a39b_2_32x32.png
// @downloadURL https://update.greasyfork.org/scripts/511712/Linuxdo%20%E6%8A%BD%E5%A5%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/511712/Linuxdo%20%E6%8A%BD%E5%A5%96%E5%99%A8.meta.js
// ==/UserScript==
(function () {
  "use strict";
  let uiElements = null;
  // 创建UI元素
  function createUI() {
    const container = document.createElement("div");
    container.style.cssText = `
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            margin: 30px auto;
            text-align: center;
            max-width: 800px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            font-family: Arial, sans-serif;
            margin-bottom: 0 !important;
        `;
    const title = document.createElement("h2");
    title.textContent = "🎉 Linux.do 抽奖器 - @PastKing";
    title.style.cssText = `
            color: #2c3e50;
            margin-bottom: 25px;
            font-weight: bold;
        `;
    const dateContainer = document.createElement("div");
    dateContainer.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 25px;
        `;
    const startDateTimeInput = document.createElement("input");
    startDateTimeInput.type = "datetime-local";
    startDateTimeInput.style.cssText = `
            padding: 10px;
            margin: 0 10px;
            border: 1px solid #bdc3c7;
            border-radius: 5px;
            font-size: 14px;
        `;
    const endDateTimeInput = document.createElement("input");
    endDateTimeInput.type = "datetime-local";
    endDateTimeInput.style.cssText = startDateTimeInput.style.cssText;
    dateContainer.appendChild(createLabel("开始时间："));
    dateContainer.appendChild(startDateTimeInput);
    dateContainer.appendChild(createLabel("结束时间："));
    dateContainer.appendChild(endDateTimeInput);
    const inputContainer = document.createElement("div");
    inputContainer.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 25px;
        `;
    const input = document.createElement("input");
    input.type = "number";
    input.min = "1";
    input.placeholder = "抽取数量";
    input.style.cssText = `
            padding: 10px;
            margin-right: 15px;
            border: 1px solid #bdc3c7;
            border-radius: 5px;
            font-size: 14px;
            width: 120px;
            marginBottom: '0 !important'
        `;
    const button = document.createElement("button");
    button.textContent = "开始抽奖";
    button.style.cssText = `
            padding: 10px 20px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
        `;
    button.onmouseover = () => (button.style.backgroundColor = "#2980b9");
    button.onmouseout = () => (button.style.backgroundColor = "#3498db");
    inputContainer.appendChild(input);
    inputContainer.appendChild(button);
    const result = document.createElement("div");
    container.appendChild(title);
    container.appendChild(dateContainer);
    container.appendChild(inputContainer);
    container.appendChild(result);
    return {
      container,
      input,
      button,
      result,
      startDateTimeInput,
      endDateTimeInput,
    };
  }
  function createLabel(text) {
    const label = document.createElement("label");
    label.textContent = text;
    label.style.cssText = `
            font-size: 14px;
            color: #34495e;
            margin-right: 5px;
        `;
    return label;
  }
  // 格式化日期
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  // 获取候选人列表
  async function getCandidateList(startDateTime, endDateTime) {
    const topicId = window.location.pathname.split("/")[3];
    let candidateList = [];
    let nameList = new Set();
    const start = startDateTime ? new Date(startDateTime) : null;
    const end = endDateTime ? new Date(endDateTime) : null;

    // 首先获取主题信息以确定总页数
    const initialResponse = await fetch(`/t/${topicId}.json`);
    const initialData = await initialResponse.json();
    const totalPosts = initialData.posts_count;
    const totalPages = Math.ceil(totalPosts / 20); // 每页20个帖子
    const topicOwner = initialData.details.created_by.username;

    // 更新进度显示
    const progressDiv = document.createElement("div");
    progressDiv.style.cssText = `
        margin: 10px 0;
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 5px;
    `;
    uiElements.result.appendChild(progressDiv);

    // 分批处理页面
    const batchSize = 5; // 每批处理的页面数
    for (let page = 1; page <= totalPages; page += batchSize) {
      const batchPromises = [];

      // 创建这一批次的请求
      for (let i = 0; i < batchSize && page + i <= totalPages; i++) {
        const currentPage = page + i;
        batchPromises.push(
          fetch(`/t/${topicId}.json?page=${currentPage}`).then((response) =>
            response.ok ? response.json() : null
          )
        );
      }

      // 等待这一批次的所有请求完成
      const results = await Promise.all(batchPromises);

      // 处理结果
      results.forEach((result) => {
        if (result && result.post_stream && result.post_stream.posts) {
          result.post_stream.posts.forEach((post) => {
            const postDate = new Date(post.created_at);
            if ((start && postDate < start) || (end && postDate > end)) return;

            const onlyName = post.username;
            if (!nameList.has(onlyName) && onlyName !== topicOwner) {
              const candidate = {
                only_name: onlyName,
                display_name: post.display_username,
                post_number: post.post_number,
                created_at: post.created_at,
                avatar: post.avatar_template.replace("{size}", "90"),
              };
              candidateList.push(candidate);
              nameList.add(onlyName);
            }
          });
        }
      });

      // 更新进度
      const progress = Math.min(
        100,
        Math.round(((page + batchSize - 1) / totalPages) * 100)
      );
      progressDiv.innerHTML = `正在加载数据... ${progress}% (${candidateList.length} 个候选人)`;

      // 添加短暂延迟以避免请求过快
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    progressDiv.remove();
    return candidateList;
  }
  // 执行抽奖
  async function performLottery(count, startDateTime, endDateTime) {
    uiElements.result.innerHTML =
      '<p style="color: #3498db; font-weight: bold;">正在收集候选人数据...</p>';

    const candidates = await getCandidateList(startDateTime, endDateTime);

    if (candidates.length === 0) {
      return { error: "在选定的时间范围内没有找到任何候选人。" };
    }

    if (count > candidates.length) {
      return {
        error: `抽奖人数不能多于唯一发帖人数。当前只有 ${candidates.length} 个符合条件的候选人。`,
      };
    }

    const chosenPosts = [];
    const winners = new Set();
    while (winners.size < count && candidates.length > 0) {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      const winner = candidates.splice(randomIndex, 1)[0];
      if (!winners.has(winner.only_name)) {
        winners.add(winner.only_name);
        chosenPosts.push(winner);
      }
    }

    return { winners: chosenPosts };
  }
  // 显示抽奖结果
  function displayResults(results) {
    uiElements.result.innerHTML =
      '<h3 style="color: #2c3e50; margin-bottom: 20px;">🏆 抽奖结果 <button id="copyAllButton" style="padding: 5px 10px; background-color: #e67e22; color: white; border: none; border-radius: 5px; font-size: 14px; cursor: pointer;">一键复制全体中奖信息</button></h3>';
    const copyAllButton = document.getElementById("copyAllButton");
    copyAllButton.onclick = () => {
      const winnerNames = results
        .map((result) => `@${result.only_name}`)
        .join(", ");
      const currentDate = new Date().toLocaleString("zh-CN", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      const markdownText = `🎉📢 恭喜以下幸运用户成功中奖：\n   ${winnerNames}\n\n📅 开奖日期：${currentDate}\n🎁 奖品信息：\n   \n\n✨ 再次感谢所有参与者的热情支持！\n💫 未中奖的小伙伴也不要灰心，继续关注我们的后续活动哦~\n\n**请中奖用户及时关注私信**`;
      navigator.clipboard.writeText(markdownText).then(
        () => {
          alert("全体中奖信息已复制到剪贴板！");
        },
        () => {
          alert("复制失败，请手动复制。");
        }
      );
    };

    const table = document.createElement("table");
    table.style.cssText = `
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        `;
    const headerRow = table.insertRow();
    ["序号", "头像", "用户名", "楼层", "参与时间", "独立中奖信息"].forEach(
      (text) => {
        const th = document.createElement("th");
        th.textContent = text;
        th.style.cssText = `
                padding: 15px;
                background-color: #f2f2f2;
                color: #333;
                font-weight: bold;
                text-align: left;
                border-bottom: 2px solid #ddd;
            `;
        headerRow.appendChild(th);
      }
    );
    results.forEach((result, index) => {
      const row = table.insertRow();
      row.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#f9f9f9";

      const cellIndex = row.insertCell();
      cellIndex.textContent = index + 1;
      cellIndex.style.cssText = `
                padding: 12px 15px;
                text-align: center;
                font-weight: bold;
                color: #3498db;
            `;

      const cellAvatar = row.insertCell();
      const avatar = document.createElement("img");
      avatar.src = result.avatar.startsWith("http")
        ? result.avatar
        : `https://linux.do${result.avatar}`;
      avatar.style.cssText = `
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: block;
                margin: 0 auto;
                border: 2px solid #3498db;
            `;
      cellAvatar.appendChild(avatar);
      cellAvatar.style.padding = "12px 15px";

      const cellUsername = row.insertCell();
      const userLink = document.createElement("a");
      userLink.href = `https://linux.do/u/${encodeURIComponent(
        result.only_name
      )}/summary`;
      userLink.textContent = `@${result.only_name}`;
      userLink.target = "_blank";
      userLink.style.cssText = `
                text-decoration: none;
                color: #3498db;
                font-weight: bold;
                transition: color 0.3s;
            `;
      userLink.onmouseover = () => (userLink.style.color = "#2980b9");
      userLink.onmouseout = () => (userLink.style.color = "#3498db");
      cellUsername.appendChild(userLink);
      cellUsername.style.cssText = `
                padding: 12px 15px;
                text-align: left;
            `;

      const cellNumber = row.insertCell();
      cellNumber.textContent = `#${result.post_number}`;
      cellNumber.style.cssText = `
                padding: 12px 15px;
                text-align: center;
                color: #7f8c8d;
            `;

      const cellTime = row.insertCell();
      cellTime.textContent = formatDate(result.created_at);
      cellTime.style.cssText = `
                padding: 12px 15px;
                text-align: center;
                color: #7f8c8d;
            `;

      const cellCopy = row.insertCell();
      const copyButton = document.createElement("button");
      copyButton.textContent = "复制信息";
      copyButton.style.cssText = `
                padding: 5px 10px;
                background-color: #2ecc71;
                color: white;
                border: none;
                border-radius: 5px;
                font-size: 14px;
                cursor: pointer;
            `;
      copyButton.onclick = () => {
        const currentDate = new Date().toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        const markdownText = `🎉🎊 热烈祝贺 @${result.only_name}！成功中奖！🏆\n\n📅 中奖日期: ${currentDate}\n🔢 幸运楼层: #${result.post_number}\n🎁 获得奖品:\n   -   (具体奖品信息请查看活动详情)\n\n🙏 感谢你的热情参与和支持！\n🌟 希望你能继续关注我们的后续活动哦~`;
        navigator.clipboard.writeText(markdownText).then(
          () => {
            alert("信息已复制到剪贴板！");
          },
          () => {
            alert("复制失败，请手动复制。");
          }
        );
      };
      cellCopy.appendChild(copyButton);
      cellCopy.style.cssText = `
                padding: 12px 15px;
                text-align: center;
            `;
    });
    uiElements.result.appendChild(table);
  }
  // 主函数
  function main() {
    uiElements = createUI();
    // 插入UI到指定位置
    const targetElement = document.querySelector("#post_1 > div.row");
    if (targetElement) {
      targetElement.parentNode.insertBefore(
        uiElements.container,
        targetElement.nextSibling
      );
      // 强制移除目标元素的 marginBottom
      function removeMarginBottom() {
        targetElement.style.setProperty("margin-bottom", "0", "important");
        const computedStyle = window.getComputedStyle(targetElement);
        if (computedStyle.getPropertyValue("margin-bottom") !== "0px") {
          targetElement.style.setProperty("margin-bottom", "-9px", "important");
        }
      }
      removeMarginBottom();
      const observer = new MutationObserver(removeMarginBottom);
      observer.observe(targetElement, {
        attributes: true,
        attributeFilter: ["style"],
      });
      setInterval(removeMarginBottom, 100);
    } else {
      console.error("无法找到目标插入位置");
      return;
    }
    uiElements.button.addEventListener("click", async () => {
      const count = parseInt(uiElements.input.value);
      if (isNaN(count) || count < 1) {
        uiElements.result.innerHTML =
          '<p style="color: #e74c3c; font-weight: bold;">请输入有效的抽取数量。</p>';
        return;
      }
      const startDateTime = uiElements.startDateTimeInput.value
        ? new Date(uiElements.startDateTimeInput.value)
        : null;
      const endDateTime = uiElements.endDateTimeInput.value
        ? new Date(uiElements.endDateTimeInput.value)
        : null;
      if (startDateTime && endDateTime && startDateTime > endDateTime) {
        uiElements.result.innerHTML =
          '<p style="color: #e74c3c; font-weight: bold;">开始时间不能晚于结束时间。</p>';
        return;
      }
      uiElements.button.disabled = true;
      uiElements.button.textContent = "抽奖中...";
      uiElements.button.style.backgroundColor = "#bdc3c7";
      uiElements.result.innerHTML =
        '<p style="color: #3498db; font-weight: bold;">正在抽奖，请稍候...</p>';
      const lotteryResults = await performLottery(
        count,
        startDateTime,
        endDateTime
      );
      if (lotteryResults.error) {
        uiElements.result.innerHTML = `<p style="color: #e74c3c; font-weight: bold;">${lotteryResults.error}</p>`;
      } else {
        displayResults(lotteryResults.winners);
      }
      uiElements.button.disabled = false;
      uiElements.button.textContent = "开始抽奖";
      uiElements.button.style.backgroundColor = "#3498db";
    });
  }
  // 运行主函数
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();
