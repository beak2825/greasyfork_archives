// ==UserScript==
// @name        历史开奖栏目
// @namespace   Violentmonkey Scripts
// @grant       GM.xmlHttpRequest
// @version     1.0
// @license MIT
// @description 大乐透近期开奖
// @match       https://www.lottery.gov.cn/kj/kjlb.html*
// @downloadURL https://update.greasyfork.org/scripts/488178/%E5%8E%86%E5%8F%B2%E5%BC%80%E5%A5%96%E6%A0%8F%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/488178/%E5%8E%86%E5%8F%B2%E5%BC%80%E5%A5%96%E6%A0%8F%E7%9B%AE.meta.js
// ==/UserScript==
const lastPageNumber = 3;

(function () {
  'use strict';

  var button = document.createElement('button');
  button.textContent = '导出数据';
  button.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      padding: 5px 15px;
      font-size: 14px;
      border: none;
      border-radius: 3px;
      background-color: #87CEEB;
      color: white;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(135, 206, 235, 0.5);
      z-index: 10000;
  `;
  document.body.appendChild(button);

  button.addEventListener('click', function () {
    collectData().then(exportToCSV);
  });

  async function collectData() {
    let results = [];
    for (let i = 1; i <= lastPageNumber; i++) {
      const response = await fetchLotteryData(i);
      results = results.concat(response.value.list.map(item => ({
        drawTime: item.lotteryDrawTime,
        drawResult: item.lotteryDrawResult
      })));
    }
    return results;
  }

  function exportToCSV(data) {
    let csvContent = "data:text/csv;charset=utf-8,\ufeff";

    // 添加表头
    const header = "开奖时间,开奖结果";
    csvContent += header + "\r\n";

    // 添加数据行
    data.forEach(row => {
      const rowData = [row.drawTime, row.drawResult.replace(/,/g, ";")];
      csvContent += rowData.join(",") + "\r\n"; // CSV格式使用\r\n进行换行
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "lottery-results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function fetchLotteryData(pageNo) {
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: 'GET',
        url: `https://webapi.sporttery.cn/gateway/lottery/getHistoryPageListV1.qry?gameNo=85&provinceId=0&pageSize=30&isVerify=1&pageNo=${pageNo}`,
        onload: function (response) {
          try {
            resolve(JSON.parse(response.responseText));
          } catch (err) {
            reject(new Error('解析数据失败'));
          }
        },
        onerror: function () {
          reject(new Error('请求数据失败'));
        }
      });
    });
  }
})();