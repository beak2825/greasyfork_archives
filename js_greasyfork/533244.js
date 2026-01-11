// ==UserScript==
// @name         快焊焊
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  检索焊接文件中的LCID元素，从PHP API获取对应的库号，并添加到对应位置，支持一键复制待取元件清单
// @author       Xano
// @match        file:///*/*.html
// @include      file:///*/*.html
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      Apache-2.0
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/533244/%E5%BF%AB%E7%84%8A%E7%84%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/533244/%E5%BF%AB%E7%84%8A%E7%84%8A.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // CID重定向配置
  // 格式: { targetCID: [sourceCID1, sourceCID2, ...] }
  // 例如: { 'C9999': ['C1900', 'C2455', 'C35678'] } 表示C1900、C2455、C35678都重定向到C9999
  const cidRedirectMap = {
    // 在这里废除掉 K016(用 K059), K018(用 K058), k011(用 K052)
    C22975: ["C105576", "C2907137", "C115336", "C2907022", "C25590"], // K002 2kΩ 1% 0603
    C100040: ["C1588", "C7503505", "C44369", "C277475", "C519404"], // K003 1nF 10% 50V 0603
    C23162: ["C99782", "C2907166", "C116693", "C105428", "C25999"], // K004 4.7kΩ 1% 0603
    C18220920: ["C9196", "C23631", "C161353", "C303946", "C527363"], // K005 1nF 10% 2kV 1206
    C23186: ["C105580", "C2907044", "C156350", "C26000", "C14677"], // K006 5.1kΩ 1% 0603
    C57112: ["C100042", "C1589", "C7503504", "C327204", "C77053"], // K007 10nF 10% 50V 0603
    C14663: ["C6119867", "C5137636", "C1591", "C30926", "C77055"], // K009 100nF 10% 50V 0603
    C22790: ["C114659", "C2906989", "C136587", "C42396614", "C144702"], // K010 12kΩ 1% 0603
    C114065: ["C31850", "C2907015", "C286577", "C23344", "C2907128"], // K012 22kΩ 1% 0603
    C23630: ["C43922", "C1607", "C914769", "C106853", "C86018"], // K013 2.2uF 10% 16V 0603
    C2909476: ["C21189", "C100044", "C95177", "C15402", "C136582"], // K014 0Ω 1% 0603
    C6119848: ["C913904", "C57895", "C99228", "C162273", "C309478"], // K015 2.2uF 10% 50V 0603
    C6119878: ["C96446", "C194427", "C92487", "C1691", "C7472959"], // K017 10uF 20% 35V 0603
    C19702: ["C6119842", "C1691", "C7472959", "C2959727", "C85713"], // K019 10uF 10% 10V 0603
    C23065: ["C137714", "C2933227", "C140086", "C705045", "C144655"], // K020 499Ω 1% 0603
    C6119889: ["C15850", "C440198", "C1713", "C2932476", "C40894"], // K021 10uF 10% 50V 0805
    C25803: ["C14675", "C2907088", "C115320", "C15458", "C2906980"], // K022 100kΩ 1% 0603
    C25976: ["C2933251", "C185315", "C321982", "C228015", "C22369904"], // K024 68.1kΩ 1% 0603
    C163844: ["C22775", "C105588", "C2907089", "C115420", "C25201"], // K026 100Ω 1% 0603
    C22935: ["C105578", "C136593", "C2907115", "C2907003", "C107698"], // K028 1MΩ 1% 0603
    C89855: ["C42441843"], // K032 MT9700
    C1980: ["C327044", "C172475", "C102672", "C840640", "C840647"], // K042 4.7kΩ 5% 0603*4 排阻
    C15849: ["C90540", "C6119852", "C1592", "C559769", "C59302"], // K052 1uF 10% 50V 0603
    C69593: ["C29718", "C107374", "C69593", "C102646", "C784821"], // K056 10kΩ 5% 0603*4 排阻
    C22997: ["C2933201", "C165758", "C321864", "C403168", "C3016450"], // K057 3.4kΩ 1% 0603
    C216802: ["C25804", "C98220", "C2930027", "C115324", "C99198"], // K058 10kΩ 1% 0603
    C21190: ["C22548", "C2907113", "C115325", "C2907002", "C14676"], // K059 1kΩ 1% 0603
  };

  // 创建反向查找映射，用于快速检查CID是否需要重定向
  const cidRedirectLookup = {};
  Object.entries(cidRedirectMap).forEach(([targetCid, sourceCids]) => {
    sourceCids.forEach((sourceCid) => {
      cidRedirectLookup[sourceCid] = targetCid;
    });
  });

  // 检查并重定向CID的函数
  function redirectCidIfNeeded(cid) {
    // 检查CID是否在重定向列表中
    if (cidRedirectLookup[cid]) {
      console.log(`重定向CID: ${cid} -> ${cidRedirectLookup[cid]}`);
      return cidRedirectLookup[cid];
    }
    // 如果不需要重定向，返回原始CID
    return cid;
  }

  // Function to build multipart/form-data body
  function buildMultipartBody(fields) {
    let boundary =
      "----WebKitFormBoundary" + Math.random().toString(36).substring(2);
    let body = "";

    for (let [key, value] of Object.entries(fields)) {
      body += `--${boundary}\r\n`;
      body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
      body += `${value}\r\n`;
    }

    body += `--${boundary}--`;

    return { body, boundary };
  }

  // Function to fetch tiaoma based on LCID using POST request
  function fetchTiaoma(lcid) {
    // 在发送请求前检查并重定向CID
    const redirectedLcid = redirectCidIfNeeded(lcid);
    // 内部函数处理API请求
    function makeRequest(searchValue) {
      return new Promise((resolve, reject) => {
        const fields = {
          "fields[]": "LCID",
          "values[]": searchValue,
        };

        const { body, boundary } = buildMultipartBody(fields);

        GM_xmlhttpRequest({
          method: "POST",
          url: "https://xedasearch.xano.cc/search.php",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${boundary}`,
          },
          data: body,
          onload: function (response) {
            if (response.status === 200) {
              try {
                const data = JSON.parse(response.responseText);
                console.log("Received data for " + searchValue + ":", data);
                resolve(data.length > 0 ? data[0].tiaoma : null);
              } catch (error) {
                console.error("Error parsing response:", error);
                reject(null);
              }
            } else {
              console.error(
                "Network connection test failed:",
                response.statusText
              );
              reject(null);
            }
          },
          onerror: function (error) {
            console.error("Network connection test error:", error);
            reject(null);
          },
        });
      });
    }

    // 主函数逻辑
    return new Promise(async (resolve, reject) => {
      try {
        // 先尝试使用 'K'+LCID 格式
        const kResult = await makeRequest("K" + redirectedLcid);
        if (kResult) {
          console.log("Found result with K prefix");
          resolve(kResult);
          return;
        }

        // 如果没有结果，使用原始LCID
        console.log("No result with K prefix, trying original LCID");
        const originalResult = await makeRequest(redirectedLcid);
        resolve(originalResult);
      } catch (error) {
        console.error("Error in fetchTiaoma:", error);
        reject(null);
      }
    });
  }

  // Select all elements with style="min-width: 66px;"
  const elements = document.querySelectorAll('[style="min-width: 66px;"]');

  // Regular expression to match the numbers like C2848197 (LCID)
  const numberPattern = /C\d+/;

  elements.forEach(async (element) => {
    const textElement = element.querySelector("p");
    if (textElement) {
      const text = textElement.textContent;
      console.log("Found text:", text);

      const match = text.match(numberPattern);
      if (match) {
        const lcid = match[0];
        console.log("Matched LCID:", lcid);

        // Fetch tiaoma from PHP API
        const tiaoma = await fetchTiaoma(lcid);
        if (tiaoma) {
          // Find the nearest previous element with style="position: relative; min-width: 70px;"
          const previousElement = element
            .closest("tr")
            .querySelector(
              '[style="position: relative; min-width: 70px;"] span'
            );
          if (previousElement) {
            console.log(
              "Inserting tiaoma:",
              tiaoma,
              "into element:",
              previousElement
            );
            previousElement.textContent += ` ${tiaoma}`;
            // 如果是重定向的CID，添加原始CID的标记
            if (cidRedirectLookup[lcid]) {
              console.log(
                `显示重定向信息: ${lcid} -> ${cidRedirectLookup[lcid]}`
              );
              previousElement.textContent += ` (替换)`;
            }
          }
        }

        // Wrap the matched number with <b> tags
        textElement.innerHTML = text.replace(numberPattern, `<b>${lcid}</b>`);
      }
    }
  });

  // 创建并添加按钮
  function createUnsolderButton() {
    // 查找title="导出"的div标签
    const exportButton = document.querySelector('div[title="导出"]');
    if (!exportButton) {
      console.error("未找到导出按钮，无法在其后添加按钮");
      return;
    }

    // 获取导出按钮的父元素（工具栏）
    const toolsDiv = exportButton.parentElement;
    if (!toolsDiv) {
      console.error("无法获取工具栏容器");
      return;
    }

    // 创建"待买元件"按钮
    const buyButton = document.createElement("div");
    buyButton.className = exportButton.className;
    buyButton.title = "导出无库存元件为CSV";
    buyButton.innerHTML = "<span>待买元件</span>";
    buyButton.addEventListener("click", exportNoStockToCsv);

    // 创建"待取元件"按钮
    const button = document.createElement("div");
    button.className = exportButton.className;
    button.title = "复制待取元件清单";
    button.innerHTML = "<span>待取元件</span>";
    button.addEventListener("click", getUnsoldered);

    // 在导出按钮后面依次插入：待买元件、待取元件
    if (exportButton.nextSibling) {
      toolsDiv.insertBefore(button, exportButton.nextSibling);
      toolsDiv.insertBefore(buyButton, exportButton.nextSibling);
    } else {
      toolsDiv.appendChild(buyButton);
      toolsDiv.appendChild(button);
    }

    console.log("成功添加待买元件和待取元件按钮");
  }

  // 导出无库存元件为CSV
  function exportNoStockToCsv() {
    const noStockItems = [];

    const cells = document.querySelectorAll(
      'td[style="position: relative; min-width: 70px;"]'
    );

    cells.forEach((cell) => {
      const checkbox = cell.querySelector('input[type="checkbox"]');
      if (!checkbox || !checkbox.checked) {
        const row = cell.closest("tr");
        const tds = row.querySelectorAll("td");

        const tiaoma = tds[0]?.querySelector("span")?.textContent.trim() || "";

        // 只收集无库存的元件（库号为空或显示"(无库存)"）
        if (!tiaoma || tiaoma === "(无库存)") {
          const key =
            tds[3]
              ?.querySelector("p")
              ?.textContent.replace("详情", "")
              .trim() || "";
          const model = tds[4]?.querySelector("p")?.textContent.trim() || "";
          const packaging =
            tds[5]?.querySelector("p")?.textContent.trim() || "";
          const lcid = tds[6]?.querySelector("b")?.textContent.trim() || "";
          const quantity =
            tds[7]
              ?.querySelector("p")
              ?.textContent.replace("使用:", "")
              .trim() || "";

          noStockItems.push({
            key,
            model,
            packaging,
            lcid,
            quantity,
          });
        }
      }
    });

    if (noStockItems.length === 0) {
      alert("没有找到无库存的元件");
      return;
    }

    // 生成CSV内容
    const headers = ["值", "型号", "封装", "立创编号", "使用数量"];
    const csvContent = [
      headers.join(","),
      ...noStockItems.map((item) =>
        [item.key, item.model, item.packaging, item.lcid, item.quantity]
          .map((v) => `"${v.replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    // 添加BOM以支持中文
    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], {
      type: "text/csv;charset=utf-8",
    });

    // 下载文件
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `待买元件_${new Date()
      .toLocaleDateString("zh-CN")
      .replace(/\//g, "-")}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    // 显示提示
    const toast = document.createElement("div");
    toast.textContent = `已导出 ${noStockItems.length} 个无库存元件到CSV`;
    toast.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #333;
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      z-index: 10001;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  }

  // 修改 getUnsoldered 函数
  function getUnsoldered() {
    console.log("getUnsoldered function called");
    const unsoldered = [];

    const cells = document.querySelectorAll(
      'td[style="position: relative; min-width: 70px;"]'
    );
    console.log("Found cells:", cells.length);

    // 收集所有未焊接元件信息
    cells.forEach((cell) => {
      const checkbox = cell.querySelector('input[type="checkbox"]');
      if (!checkbox || !checkbox.checked) {
        const row = cell.closest("tr");
        const tds = row.querySelectorAll("td"); // 获取所有td标签

        // 按照新的获取逻辑：使用td的索引位置来获取各个字段
        const tiaoma =
          tds[0]?.querySelector("span")?.textContent.trim() || "(无库存)";
        const key =
          tds[3]?.querySelector("p")?.textContent.replace("详情", "").trim() ||
          "";
        const model = tds[4]?.querySelector("p")?.textContent.trim() || "";
        const packaging = tds[5]?.querySelector("p")?.textContent.trim() || "";
        const lcid = tds[6]?.querySelector("b")?.textContent.trim() || "";
        const quantity =
          tds[7]?.querySelector("p")?.textContent.replace("使用:", "").trim() ||
          "";

        // 输出调试信息
        console.log("Row data:", {
          tiaoma,
          key,
          model,
          packaging,
          lcid,
          quantity,
        });

        unsoldered.push({
          tiaoma,
          key,
          model,
          packaging,
          lcid,
          quantity,
        });
      }
    });

    // 按前缀分组和排序
    const groups = {
      K: [],
      Y: [],
      R: [],
      C: [],
      U: [],
      D: [],
      T: [],
      others: [],
    };

    unsoldered.forEach((item) => {
      const tiaoma = item.tiaoma;
      if (!tiaoma) {
        groups.others.push(item);
        return;
      }

      const prefix = tiaoma.charAt(0);
      const number = parseInt(tiaoma.slice(1));

      if (prefix in groups && !isNaN(number)) {
        groups[prefix].push({ ...item, number });
      } else {
        groups.others.push(item);
      }
    });

    // 对每个分组按number排序
    for (let key in groups) {
      if (key !== "others") {
        groups[key].sort((a, b) => a.number - b.number);
      }
    }

    // 按指定顺序合并所有分组，排除K开头的条码
    const orderedGroups = [
      ...groups.Y, // Y开头的条码（按数字排序）
      ...groups.R, // R开头的条码（按数字排序）
      ...groups.C, // C开头的条码（按数字排序）
      ...groups.U, // U开头的条码（按数字排序）
      ...groups.D, // D开头的条码（按数字排序）
      ...groups.T, // T开头的条码（按数字排序）
      ...groups.others, // 其他条码
    ];

    // 记录被排除的K开头条码数量
    const excludedKCount = groups.K.length;

    // 创建表格样式的图片并复制到剪贴板
    function createTableImage(data) {
      // 表格设置
      const cellPadding = 10;
      const headerHeight = 50;
      const rowHeight = 40;
      const fontSize = 16;
      const headerFontSize = 18;
      const fontFamily = "Arial, sans-serif";
      const headerColor = "#f2f2f2";
      const borderColor = "#dddddd";
      const textColor = "#333333";
      const headerTextColor = "#000000";

      // 表头
      const headers = ["库号", "值", "型号", "封装", "立创编号", "使用数量"];

      // 计算每列所需的最大宽度（自适应宽度）
      const columnWidths = [];

      // 创建临时canvas用于测量文本宽度
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.font = `${fontSize}px ${fontFamily}`;

      // 初始化列宽为表头宽度
      tempCtx.font = `bold ${headerFontSize}px ${fontFamily}`;
      for (let i = 0; i < headers.length; i++) {
        columnWidths[i] =
          tempCtx.measureText(headers[i]).width + cellPadding * 3; // 额外留些空间
      }

      // 计算每列所需的最大宽度
      tempCtx.font = `${fontSize}px ${fontFamily}`;
      data.forEach((item) => {
        const values = [
          item.tiaoma,
          item.key,
          item.model,
          item.packaging,
          item.lcid,
          item.quantity,
        ];
        values.forEach((value, index) => {
          const width = tempCtx.measureText(value).width + cellPadding * 3;
          if (width > columnWidths[index]) {
            columnWidths[index] = width;
          }
        });
      });

      // 设置最小列宽
      const minColumnWidths = [120, 80, 120, 80, 80, 60];
      for (let i = 0; i < columnWidths.length; i++) {
        columnWidths[i] = Math.max(columnWidths[i], minColumnWidths[i]);
      }

      // 计算表格尺寸
      const tableWidth = columnWidths.reduce((sum, width) => sum + width, 0);
      const tableHeight = headerHeight + data.length * rowHeight;

      // 创建高清Canvas (使用2倍分辨率提高清晰度)
      const pixelRatio = 2; // 提高分辨率
      const canvas = document.createElement("canvas");
      canvas.width = tableWidth * pixelRatio;
      canvas.height = tableHeight * pixelRatio;
      canvas.style.width = tableWidth + "px";
      canvas.style.height = tableHeight + "px";
      const ctx = canvas.getContext("2d");
      ctx.scale(pixelRatio, pixelRatio); // 缩放上下文以匹配高分辨率

      // 绘制表格背景
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, tableWidth, tableHeight);

      // 绘制表头
      ctx.fillStyle = headerColor;
      ctx.fillRect(0, 0, tableWidth, headerHeight);

      // 设置表头文字样式
      ctx.font = `bold ${headerFontSize}px ${fontFamily}`;
      ctx.fillStyle = headerTextColor;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      // 绘制表头文字
      let xOffset = 0;
      headers.forEach((header, index) => {
        ctx.fillText(header, xOffset + cellPadding, headerHeight / 2);
        xOffset += columnWidths[index];
      });

      // 绘制表格内容
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = textColor;

      // 绘制每一行
      data.forEach((item, rowIndex) => {
        const y = headerHeight + rowIndex * rowHeight;

        // 交替行背景色
        if (rowIndex % 2 === 0) {
          ctx.fillStyle = "#f9f9f9";
          ctx.fillRect(0, y, tableWidth, rowHeight);
          ctx.fillStyle = textColor;
        }

        // 绘制单元格内容
        let x = 0;
        const values = [
          item.tiaoma,
          item.key,
          item.model,
          item.packaging,
          item.lcid,
          item.quantity,
        ];
        values.forEach((value, colIndex) => {
          // 截断过长的文本
          const maxWidth = columnWidths[colIndex] - cellPadding * 2;
          let displayText = value;
          if (ctx.measureText(displayText).width > maxWidth) {
            // 简单截断处理
            while (
              ctx.measureText(displayText + "...").width > maxWidth &&
              displayText.length > 0
            ) {
              displayText = displayText.substring(0, displayText.length - 1);
            }
            displayText += "...";
          }

          ctx.fillText(displayText, x + cellPadding, y + rowHeight / 2);
          x += columnWidths[colIndex];
        });
      });

      // 绘制表格线
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;

      // 绘制水平线
      for (let i = 0; i <= data.length; i++) {
        const y = headerHeight + i * rowHeight;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(tableWidth, y);
        ctx.stroke();
      }

      // 绘制垂直线
      xOffset = 0;
      for (let i = 0; i <= columnWidths.length; i++) {
        ctx.beginPath();
        ctx.moveTo(xOffset, 0);
        ctx.lineTo(xOffset, tableHeight);
        ctx.stroke();
        if (i < columnWidths.length) {
          xOffset += columnWidths[i];
        }
      }

      return canvas;
    }

    // 创建表格图片
    const canvas = createTableImage(orderedGroups);

    // 将Canvas转换为图片并复制到剪贴板
    canvas.toBlob((blob) => {
      // 创建一个ClipboardItem
      const item = new ClipboardItem({ "image/png": blob });

      // 尝试使用新的Clipboard API复制图片
      navigator.clipboard
        .write([item])
        .then(() => {
          // 创建临时提示
          const toast = document.createElement("div");
          let toastMessage = `已复制 ${orderedGroups.length} 个待取元件清单图片到剪贴板`;
          if (excludedKCount > 0) {
            toastMessage += `（不包含 K 库元件）`;
          }
          toast.textContent = toastMessage;
          toast.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: #333;
                        color: white;
                        padding: 10px 20px;
                        border-radius: 4px;
                        z-index: 10001;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    `;
          document.body.appendChild(toast);

          // 创建预览容器
          const previewContainer = document.createElement("div");
          previewContainer.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: white;
                        padding: 10px;
                        border-radius: 4px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.3);
                        z-index: 10000;
                        max-width: 90%;
                        max-height: 90vh;
                        display: flex;
                        flex-direction: column;
                    `;

          // 创建标题栏
          const titleBar = document.createElement("div");
          titleBar.style.cssText = `
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0 0 10px 0;
                        border-bottom: 1px solid #eee;
                        margin-bottom: 10px;
                        width: 100%;
                    `;

          // 添加标题
          const title = document.createElement("div");
          title.textContent = "待取元件清单预览";
          title.style.cssText = `
                        font-weight: bold;
                        font-size: 16px;
                    `;
          titleBar.appendChild(title);

          // 添加关闭按钮到标题栏
          const closeButton = document.createElement("button");
          closeButton.textContent = "关闭";
          closeButton.style.cssText = `
                        padding: 5px 15px;
                        background: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    `;
          closeButton.onclick = () =>
            document.body.removeChild(previewContainer);
          titleBar.appendChild(closeButton);

          // 添加标题栏到容器
          previewContainer.appendChild(titleBar);

          // 创建图片容器（带滚动条）
          const imageContainer = document.createElement("div");
          imageContainer.style.cssText = `
                        overflow: auto;
                        max-height: calc(90vh - 60px);
                    `;

          // 添加预览图片
          const img = new Image();
          img.src = canvas.toDataURL("image/png");
          img.style.maxWidth = "100%";
          imageContainer.appendChild(img);

          // 添加图片容器到预览容器
          previewContainer.appendChild(imageContainer);

          document.body.appendChild(previewContainer);

          // 3秒后移除提示
          setTimeout(() => {
            document.body.removeChild(toast);
          }, 3000);
        })
        .catch((err) => {
          console.error("复制图片失败:", err);
          // 如果新API失败，尝试备用方法：创建一个下载链接
          const link = document.createElement("a");
          link.download = "待取元件清单.png";
          link.href = canvas.toDataURL("image/png");
          link.click();

          // 显示备用方法的提示
          const toast = document.createElement("div");
          toast.textContent = `复制失败，已自动下载图片到本地`;
          toast.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: #333;
                        color: white;
                        padding: 10px 20px;
                        border-radius: 4px;
                        z-index: 10001;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    `;
          document.body.appendChild(toast);
          setTimeout(() => document.body.removeChild(toast), 3000);
        });
    }, "image/png");

    // 同时保留文本复制功能作为备用
    const textContent = orderedGroups
      .map(
        (item) =>
          `${item.tiaoma} ${item.key} ${item.model} ${item.packaging} ${item.lcid} ${item.quantity}`
      )
      .join("\n");

    // 将文本内容存储到localStorage以便需要时使用
    try {
      localStorage.setItem("lastCopiedComponentsList", textContent);
    } catch (e) {
      console.error("存储文本内容到localStorage失败:", e);
    }
  }

  // 初始化
  createUnsolderButton();
})();
