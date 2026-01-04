// ==UserScript==
// @name         炼丹炉-品牌排行
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  炼丹炉扩展工具
// @author       siji-Xian
// @match        *://www.huo1818.com/app/jd/market/rank/brand?*
// @icon         https://cdn.zhiyitech.cn/material/4efba8e6ba2cf8883526fce8b21eac28
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.17.1/dist/xlsx.full.min.js
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/481921/%E7%82%BC%E4%B8%B9%E7%82%89-%E5%93%81%E7%89%8C%E6%8E%92%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/481921/%E7%82%BC%E4%B8%B9%E7%82%89-%E5%93%81%E7%89%8C%E6%8E%92%E8%A1%8C.meta.js
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
    const likeComment = document.querySelector(".fuui-row._title_1u19s_8");
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
        this?.responseURL?.slice(0, 36) ==
        "https://www.huo1818.com/backend-api/huo1818-olap-jd/industry/rank/brand-list"
      ) {
        target_data = JSON.parse(obj?.target?.response);
      }
    }
  })();

   //query参数获取
  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  }

  var myHeaders = new Headers();
  myHeaders.append("authority", "www.huo1818.com");
  myHeaders.append("accept", "*/*");
  myHeaders.append("accept-language", "zh-CN,zh;q=0.9");
  myHeaders.append("client", "web");
  myHeaders.append("group", "2");
  myHeaders.append("authorization", localStorage.getItem("__t"));
  myHeaders.append("name", "%E5%93%81%E7%89%8C%E6%8E%92%E8%A1%8C-%E8%A1%8C%E4%B8%9A%E5%88%86%E6%9E%90-%E7%82%BC%E4%B8%B9%E7%82%89");
  myHeaders.append("project", "huo");
  myHeaders.append("sec-ch-ua", "\"Google Chrome\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"");
  myHeaders.append("sec-ch-ua-mobile", "?0");
  myHeaders.append("sec-ch-ua-platform", "\"macOS\"");
  myHeaders.append("sec-fetch-dest", "empty");
  myHeaders.append("sec-fetch-mode", "cors");
  myHeaders.append("sec-fetch-site", "same-origin");
  myHeaders.append("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36");

  const getRequestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  async function fetchFun(url, data, requestOptions = getRequestOptions) {
    const params = new URLSearchParams(data).toString();
    try {
      const response = await fetch(`${url}?${params}`, requestOptions);
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        throw new Error(`Fetch failed: ${response.status}`);
      }
    } catch (error) {
      loadingMsg.close();
      Qmsg.error({
        content: `网络请求错误: ${error.message}`,
        timeout: 5000,
      });
      throw error;
    }
  }

  async function getData(date) {
    const targetPromise = await fetchFun(
      "https://www.huo1818.com/backend-api/huo1818-olap-jd/industry/rank/brand-list",
      {
        orderField:'saleVolume',
        orderType:'desc',
        pageNo:getQueryVariable("pageNo"),
        pageSize:20,
        date,
        dateGroupType:"MONTH_GROUP",
        categoryId:getQueryVariable("catId"),
      }
    );

    return {date,value:targetPromise};
  }

  function exportToExcel(dataArray, sheetNames, headerAliases, fileName = "output.xlsx") {
  const workbook = XLSX.utils.book_new();

  // 遍历每个 Sheet
  dataArray.forEach((sheetData, index) => {
    // 获取当前 Sheet 的字段名数组
    const headers = Object.keys(sheetData.value[0]);

    // 创建工作表
    const sheet = XLSX.utils.json_to_sheet(sheetData.value, { header: headers});

    // 替换表头别名
    headers.forEach((header, columnIndex) => {
      if (headerAliases[header]) {
        sheet[XLSX.utils.encode_cell({ r: 0, c: columnIndex })].v = headerAliases[header];
      }
    });

    // 使用提供的 Sheet 名称或默认名称
    const sheetName = sheetNames[index] || `Sheet${index + 1}`;

    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  });

  // 将工作簿保存为 Excel 文件
  XLSX.writeFile(workbook, fileName);

  loadingMsg.close();
}
  
  let contrast = {
    "brandId":"品牌ID",
    "brandName":"品牌名称",
    "saleVolume":"销量",
    "saleVolumeMomRatio":"销量环比",
    "saleAmount":"销售额",
    "saleAmountMomRatio":"销售额环比",
    "shopCount":"热销店铺数",
    "saleSkuCount":"动销SKU数"
  };

  async function urlClick() {
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
  
    let dates = ['202211','202212','202301','202302','202303','202304','202305','202306','202307','202308','202309','202310','202311'];
    let fetchData = [];
  
    async function fetchDataWithDelay() {
      for (const date of dates) {
        let result = await getData(date);
        fetchData.push(result);
  
        // 设置定时器，增加网络请求间隔，例如每隔500毫秒
        await delay(500);
      }
    }
  
    // 延迟函数
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  
    // 调用包含定时器的数据获取函数
    await fetchDataWithDelay(); // 使用 await 确保 fetchDataWithDelay 执行完毕
  
    let data = fetchData.map(v => {
      return {
        date: v.date,
        value: v.value.result.data.map(t=>{
          return {...t,saleAmount:t.saleAmount/100}
        })
      };
    });
  
    let fileName = '品牌排行' + document.querySelectorAll(".fuui-select-display--single-text")[0].innerHTML + "-" + document.querySelectorAll(".fuui-select-display--single-text")[1].innerHTML + "-" + document.querySelectorAll(".fuui-select-display--single-text")[2].innerHTML;
  
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    exportToExcel(data, dates, contrast, `${fileName}.xlsx`);
  }
  
})();
