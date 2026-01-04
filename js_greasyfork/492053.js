// ==UserScript==
// @name         炼丹炉-行业品类
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  炼丹炉扩展工具
// @author       siji-Xian
// @match        *://www.huo1818.com/app/industry/detail?*
// @icon         https://cdn.zhiyitech.cn/material/4efba8e6ba2cf8883526fce8b21eac28
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.17.1/dist/xlsx.full.min.js
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/492053/%E7%82%BC%E4%B8%B9%E7%82%89-%E8%A1%8C%E4%B8%9A%E5%93%81%E7%B1%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/492053/%E7%82%BC%E4%B8%B9%E7%82%89-%E8%A1%8C%E4%B8%9A%E5%93%81%E7%B1%BB.meta.js
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
    const likeComment = document.querySelector(".fuui-row.undefined");
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  //message.js
  let loadingMsg = null;
  let loadingMsg1 = null;

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
        this?.responseURL?.slice(0, 66) ==
        "https://www.huo1818.com/backend-api/huo1818-oltp/user/monitor/list"
      ) {
        target_data = JSON.parse(obj?.target?.response);
      }
    }
  })();

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
      if (loadingMsg) loadingMsg.close();
      Qmsg.error({
        content: `网络请求错误: ${error.message}`,
        timeout: 5000,
      });
      throw error;
    }
  }

  async function getData(e,level) {
    if (level === 1) {
      const targetPromise = await fetchFun(
        "https://www.huo1818.com/backend-api/huo1818-olap/industry/overview/category-rank",
        {
          dateGroupType: 'MONTH_GROUP',
          date: 202403,
          bigCatId: e.bigCategoryId,
          cat1tId: e.cat1tId,
          catId: e.cat1tId,
          categoryId: e.cat1tId,
          platformId: ''
        }
      );
      let data = targetPromise.result.map(v=>{
        return {
          categoryName:v.categoryName,
          categoryId:v.categoryId,
          cat1tName:e.cat1tName,
          cat1tId:e.cat1tId
        }
      })
  
      return data;
    } else {
      const targetPromise = await fetchFun(
        "https://www.huo1818.com/backend-api/huo1818-olap/industry/common/category-selector",
        {
          categoryId: e.categoryId,
          categoryLevel: 2
        }
      );
        if (targetPromise.result.length) {
          let data = targetPromise.result.map(v=>{
            return {
              level3Name:v.categoryName,
              level3Id:v.categoryId,
              categoryName:e.categoryName,
              categoryId:e.categoryId,
              level1Name:e.cat1tName,
              level1Id:e.cat1tId
            }
          })
          return data;
        }else{
          return [{
            categoryName:e.categoryName,
            categoryId:e.categoryId,
            level1Name:e.cat1tName,
            level1Id:e.cat1tId
          }]
        }
    }
    
  }

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

    loadingMsg1.close();
  }

  
  let contrast = {
    "level1Name":"行业",
    "level1Id":"行业ID",
    "categoryName":"品类",
    "categoryId":"品类ID",
    "level3Name":"二级品类",
    "level3Id":"二级品类ID"
  };

  async function urlClick() {
    if (target_data) {
      loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
      let target_data_res = target_data.result.userMonitorList.map(v=>{
        return {
          cat1tName:v.cat1tName,
          cat1tId:v.cat1tId,
          bigCategoryId:v.bigCategoryId
        }
      })

      let fetchData = [];

     
      async function fetchDataWithDelay() {
        for (const item of target_data_res) {
          let result = await getData(item,1);
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

      let level2Data = fetchData.flat()

      loadingMsg.close()
      loadingMsg1 = Qmsg.loading(`数据较多，请耐心等待（共${level2Data.length}个接口，预计导出耗时${Math.floor(level2Data.length/60)}分钟）`);
  

      let fetchData2 = [];
  
      async function fetchDataWithDelay2() {
        for (const item of level2Data) {
          let result = await getData(item,2);
          fetchData2.push(result);
    
          // 设置定时器，增加网络请求间隔，例如每隔500毫秒
          await delay(500);
        }
      }
    
      // 调用包含定时器的数据获取函数
      await fetchDataWithDelay2(); // 使用 await 确保 fetchDataWithDelay2 执行完毕

      // console.log(fetchData2.flat());

      let data = fetchData2.flat()

      let fileName = '品牌排行';
      exportToExcel(data, contrast, `${fileName}.xlsx`);
    } else {
      loadingMsg = Qmsg.error("数据加载失败，请重试");
    }
  }
  
})();
