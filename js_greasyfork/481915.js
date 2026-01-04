// ==UserScript==
// @name         炼丹炉-品类分析
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  炼丹炉扩展工具
// @author       siji-Xian
// @match        *://www.huo1818.com/app/jd/market/analyze/category?*
// @icon         https://cdn.zhiyitech.cn/material/4efba8e6ba2cf8883526fce8b21eac28
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.17.1/dist/xlsx.full.min.js
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/481915/%E7%82%BC%E4%B8%B9%E7%82%89-%E5%93%81%E7%B1%BB%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/481915/%E7%82%BC%E4%B8%B9%E7%82%89-%E5%93%81%E7%B1%BB%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  const button = document.createElement("div");
  button.textContent = "导出数据";
  Object.assign(button.style, {
    height: "34px",
    lineHeight: "var(--line-height, 34px)",
    alignItems: "center",
    color: "white",
    background: "linear-gradient(90deg, rgba(0, 239, 253), rgba(64, 166, 254))",
    borderRadius: "5px",
    marginLeft: "10px",
    fontSize: "13px",
    padding: "0 10px",
    cursor: "pointer",
    fontWeight: "500",
  });
  button.addEventListener("click", urlClick);

  function appendDoc() {
    const likeComment = document.querySelector(".fuui-row._leftSub_1u19s_57");
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  //message.js
  let loadingMsg = null;

  //目标数据
  let target_data = null;

  (function listen() {
    var origin = {
      open: XMLHttpRequest.prototype.open,
      send: XMLHttpRequest.prototype.send,
    };
    XMLHttpRequest.prototype.open = function (a, b) {
      this.addEventListener("load", replaceFn);
      origin.open.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function (a, b) {
      origin.send.apply(this, arguments);
    };
    function replaceFn(obj) {
      if (
        this?.responseURL?.slice(0, 75) ==
        "https://www.huo1818.com/backend-api/huo1818-olap-jd/industry/category/trend"
      ) {
        target_data = JSON.parse(obj?.target?.response);
      }
    }
  })();

  const transformData = (inputData) => {
    const outputData = [];

    inputData.forEach(({ categoryName, trendList }) => {
      trendList.forEach(
        ({
          insertDate,
          saleVolume,
          saleAmount,
          saleSkuCount,
          brandCount,
          shopCount,
          saleVolumeMomRatio,
          saleAmountMomRatio,
          saleSkuCountMomRatio,
          brandCountMomRatio,
          shopCountMomRatio,
        }) => {
          const transformedItem = {
            categoryName,
            insertDate,
            saleVolume,
            saleAmount:saleAmount/100,
            saleSkuCount,
            brandCount,
            shopCount,
            saleVolumeMomRatio,
            saleAmountMomRatio,
            saleSkuCountMomRatio,
            brandCountMomRatio,
            shopCountMomRatio,
          };
          outputData.push(transformedItem);
        }
      );
    });

    return outputData;
  };

  function exportToExcel(data, headerAliases, fileName = "output.xlsx") {
    // 获取字段名数组
    const headers = Object.keys(data[0]);
  
    // 创建工作表
    const sheet = XLSX.utils.json_to_sheet(data, { header: headers, skipHeader: true });
  
    // 替换表头别名
    headers.forEach((header, index) => {
      if (headerAliases[header]) {
        sheet[XLSX.utils.encode_cell({ r: 0, c: index })].v = headerAliases[header];
      }
    });

    // 创建工作簿
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");
  
    // 将工作簿保存为 Excel 文件
    XLSX.writeFile(workbook, fileName);

    loadingMsg.close();
  }

  let contrast = {
    "categoryName":"name",
    "insertDate":"日期",
    "saleVolume":"销量",
    "saleAmount":"销售额",
    "brandCount":"热销品牌数",
    "shopCount":"热销店铺",
    "saleSkuCount":"商品数"
  };

  function urlClick() {
    if (target_data) {
      let fileName = document.querySelectorAll(".fuui-select-display--single-text")[0].innerHTML+"-"+document.querySelectorAll(".fuui-select-display--single-text")[1].innerHTML+"-"+document.querySelectorAll(".fuui-select-display--single-text")[2].innerHTML
      let res = transformData(target_data.result);
      loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
      exportToExcel(res, contrast, `${fileName}.xlsx`);
    } else {
      loadingMsg = Qmsg.error("数据加载失败，请重试");
    }
  }
})();
