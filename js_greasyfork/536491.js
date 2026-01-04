// ==UserScript==
// @name         接口请求响应监听器
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  监听指定接口的请求参数和返回数据
// @match        *://*.taobao.com/*
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.5/xlsx.full.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/536491/%E6%8E%A5%E5%8F%A3%E8%AF%B7%E6%B1%82%E5%93%8D%E5%BA%94%E7%9B%91%E5%90%AC%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/536491/%E6%8E%A5%E5%8F%A3%E8%AF%B7%E6%B1%82%E5%93%8D%E5%BA%94%E7%9B%91%E5%90%AC%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";
//html下载



//图片下载


async function initExport(jsonData) {
  try {
      // 示例数据（包含图片URL）
      // const jsonData = [
      //     {
      //         name: "产品A",
      //         price: 299,
      //         image: "https://gw1.alicdn.com/tfscom/tuitui/i4/2578794165/O1CN01UihFCg1gdcfbWXHc6_!!2578794165.jpg"
      //     },
      //     {
      //         name: "产品B",
      //         price: 599,
      //         image: "https://gw1.alicdn.com/tfscom/tuitui/i1/2199109256/O1CN010KnQJE2IFJ2e4cIjr_!!4611686018427387528-2-item_pic.png"
      //     }
      // ];

      // 创建Excel实例
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet1');
      const headers = Object.keys(jsonData[0]).map(key => ({
        header: key.replace(/([A-Z])/g, ' $1').toUpperCase(),
        key: key,
        width: key === 'picUrl' ? 30 : 20
    }));
      // 设置列定义（参考材料9†）
      // worksheet.columns = [
      //     { header: '产品名称', key: 'name', width: 20 },
      //     { header: '价格', key: 'price', width: 15 },
      //     { header: '产品图片', key: 'image', width: 30 }
      // ];
      worksheet.columns = headers;
      // 批量插入数据（参考材料1†）
     // 批量插入数据（参考材料1†）
     const rows = jsonData.map(item => {
      const row = {...item};
      // if(row.picUrl) row.picUrl = ' '; // 图片占位符
      return row;
  });
      worksheet.addRows(rows);

      // 并行处理图片（参考材料5†）
      await Promise.all(jsonData.map(async (item, index) => {
          const rowNumber = index + 2; // 数据从第2行开始
          try {
              // 获取图片数据（参考材料4†）
              const base64 = await fetchImageData(item.picUrl);

              // 注册图片（参考材料4†）
              const imageId = workbook.addImage({
                  base64: base64,
                  extension: 'jpeg',
                  hyperlinks: {
                      tooltip: '点击查看大图'
                  }
              });
              // 插入图片到C列（参考材料3†）指定列
              // const colIndex = headers.findIndex(h => h.key === 'picUrl');

              // 获取最后一列的索引
              const colIndex = headers.length - 1;
              worksheet.addImage(imageId, {
                  tl: { col: colIndex, row: rowNumber-1 },
                  br: { col: colIndex+1, row: rowNumber },
                  editAs: 'oneCell'
              });

              // 调整单元格尺寸（参考材料4†）
              worksheet.getRow(rowNumber).height = 100;
              worksheet.getColumn(3).width = 25;
          } catch (error) {
           console.error(`图片加载失败: ${item.image}`, error);
            worksheet.getCell(`${String.fromCharCode(65+colIndex)}${rowNumber}`)
          }
      }));

      // 生成文件并下载（参考材料6†）
      const buffer = await workbook.xlsx.writeBuffer();
      saveAsExcel(buffer, `带图片数据_${new Date().toISOString().slice(0,10)}.xlsx`);

  } catch (error) {
      console.error('导出过程发生错误:', error);
      alert('文件导出失败，请检查控制台输出');
  }
}

// 图片处理函数
async function fetchImageData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
  const blob = await response.blob();

  // 创建图片对象
  const img = new Image();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // 设置压缩后的尺寸
  const maxWidth = 300;  // 最大宽度
  const maxHeight = 300; // 最大高度

  return new Promise((resolve, reject) => {
    img.onload = () => {
      // 计算新的尺寸，保持宽高比
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      // 设置canvas尺寸
      canvas.width = width;
      canvas.height = height;

      // 填充白色背景
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // 绘制图片
      ctx.drawImage(img, 0, 0, width, height);

      // 转换为base64，设置压缩质量
      const base64 = canvas.toDataURL('image/jpeg', 0.7); // 0.7是压缩质量，范围0-1
      resolve(base64.split(',')[1]);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(blob);
  });
}

// 文件保存函数（参考材料2†）
function saveAsExcel(buffer, filename) {
  const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
  }, 100);
}





  // 核心创建方法
  var csv = [];
  // 核心导出方法
  const exportToExcel = (data) => {
    // 转换数据为工作表格式
    const worksheet = XLSX.utils.json_to_sheet(data, {
      header: Object.keys(data[0]), // 自动提取表头
      skipHeader: false,
    });

    // 创建工作簿
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "数据报表");

    // 生成文件（文件名带时间戳）
    const timestamp = new Date().toISOString().slice(0, 16).replace(/:/g, "-");
    XLSX.writeFile(workbook, `导出数据_${timestamp}.xlsx`);
  };

  // 创建悬浮控制面板
  const createControlPanel = () => {
    const panel = document.createElement("div");
    panel.style = `            position: fixed;
            bottom: 50px;
            right: 20px;
            z-index: 99999;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            min-width: 180px;
        `;

    const btn = document.createElement("button");
    btn.textContent = "启动监听";
    btn.style = `
            padding: 8px 15px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
        `;

    const status = document.createElement("div");
    status.textContent = "状态：未监听";
    status.style = "margin-top:10px;font-size:12px;color:#666;";
    // 创建浮动按钮
    const download = document.createElement("button");
    Object.assign(download.style, {
      padding: "8px 15px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      zIndex: 99999,
    });
    download.textContent = "导出Excel";

    // 创建单选项容器
    const radioContainer = document.createElement("div");
    radioContainer.style = "margin-top: 10px; display: flex; gap: 10px;";

    // 创建纯数据单选项
    const pureDataRadio = document.createElement("input");
    pureDataRadio.type = "radio";
    pureDataRadio.id = "pureData";
    pureDataRadio.name = "exportType";
    pureDataRadio.value = "pure";
    pureDataRadio.checked = true;

    const pureDataLabel = document.createElement("label");
    pureDataLabel.htmlFor = "pureData";
    pureDataLabel.textContent = "纯数据";
    pureDataLabel.style = "font-size: 12px;";

    // 创建带图片单选项
    const withImageRadio = document.createElement("input");
    withImageRadio.type = "radio";
    withImageRadio.id = "withImage";
    withImageRadio.name = "exportType";
    withImageRadio.value = "withImage";

    const withImageLabel = document.createElement("label");
    withImageLabel.htmlFor = "withImage";
    withImageLabel.textContent = "带图片";
    withImageLabel.style = "font-size: 12px;";

    // 添加单选项到容器
    radioContainer.appendChild(pureDataRadio);
    radioContainer.appendChild(pureDataLabel);
    radioContainer.appendChild(withImageRadio);
    radioContainer.appendChild(withImageLabel);

    // 点击事件处理
    download.addEventListener("click", () => {
      try {
        console.log(csv)

        // 图片操作
        for (let i = 0; i < csv.length; i++) {
          csv[i].picUrl = "https:"+csv[i].picUrl
        }

        // 根据选择的导出类型执行不同的导出方法
        if (withImageRadio.checked) {
          initExport(csv);
        } else {
          exportToExcel(csv);
        }

        download.style.backgroundColor = "#45a049";
        setTimeout(() => (download.style.backgroundColor = "#4CAF50"), 1000);

      } catch (e) {
        alert("导出失败: " + e.message);
      }
    });

    const n = document.createElement("div");
    n.className = "countN"
    n.textContent = `当前抓取数据:${csv.length}条`

    panel.append(btn, status, download, radioContainer, n);
    return { panel, btn, status };
  };

  // 主逻辑
  const main = () => {
    const { panel, btn, status } = createControlPanel();
    document.body.appendChild(panel);

    let isMonitoring = false;
    const targetAPI =
      "mtop.taobao.guangguang.matchmaking.material.item.collect.query";

    // 保存原始方法
    const nativeOpen = unsafeWindow.XMLHttpRequest.prototype.open;
    const nativeSend = unsafeWindow.XMLHttpRequest.prototype.send;
    const nativeFetch = unsafeWindow.fetch;

    // 重写XMLHttpRequest
    unsafeWindow.XMLHttpRequest.prototype.open = function (method, url) {
      this._requestURL = url; // 存储请求地址
      return nativeOpen.apply(this, arguments);
    };

    unsafeWindow.XMLHttpRequest.prototype.send = function (body) {
      if (isMonitoring && this._requestURL.includes(targetAPI)) {
        const requestData = {
          url: this._requestURL,
          method: this._method,
          params: body ? new URLSearchParams(body).toString() : null,
        };

        // 监听响应
        this.addEventListener("load", function () {
          try {
            const response = JSON.parse(this.responseText);
            console.groupCollapsed(`监听到接口 ${targetAPI}`);
            console.log("请求参数:", requestData);
            console.log("返回数据:", response);
            csv = csv.concat(response.data.data)
            document.querySelector('.countN').textContent = `当前抓取数据:${csv.length}条`
            console.groupEnd();
          } catch (e) {
            console.error("响应解析失败:", e);
          }
        });
      }
      return nativeSend.apply(this, arguments);
    };

    // 重写Fetch
    unsafeWindow.fetch = function (input, init) {
      const url = typeof input === "string" ? input : input.url;

      if (isMonitoring && url.includes(targetAPI)) {
        const requestData = {
          url,
          method: init?.method || "GET",
          params: init?.body ? new URLSearchParams(init.body).toString() : null,
        };

        return nativeFetch(input, init).then((response) => {
          response
            .clone()
            .json()
            .then((data) => {
              console.groupCollapsed(`监听到接口 ${targetAPI}`);
              console.log("请求参数:", requestData);
              console.log("返回数据:", data);
              console.groupEnd();
            });
          return response;
        });
      }
      return nativeFetch(input, init);
    };

    // 控制按钮交互
    btn.addEventListener("click", () => {
      if (isMonitoring) {
        console.log("已停止监听");
        csv = [];
        document.querySelector('.countN').textContent = `当前抓取数据:${csv.length}条`

      }
      isMonitoring = !isMonitoring;
      btn.textContent = isMonitoring ? "停止监听" : "启动监听";
      btn.style.background = isMonitoring ? "#4CAF50" : "#2196F3";
      status.textContent = `状态：${isMonitoring ? "监听中" : "未监听"}`;
    });
  };

  // 初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();
