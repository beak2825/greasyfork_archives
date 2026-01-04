// ==UserScript==
// @name         阳光开奖下载
// @match        https://www.cwl.gov.cn/ygkj/wqkjgg/ssq/*
// @icon         https://www.cwl.gov.cn/images/logo-top.png
// @grant        none
// @description  阳光开奖页面增加下载按钮
// @version 0.0.1.20240206133207
// @namespace https://greasyfork.org/users/17538
// @downloadURL https://update.greasyfork.org/scripts/486771/%E9%98%B3%E5%85%89%E5%BC%80%E5%A5%96%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/486771/%E9%98%B3%E5%85%89%E5%BC%80%E5%A5%96%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

function jsonToExcel(data, fileName = '导出的文件名') {
  let csvContent = "data:text/csv;charset=utf-8,\ufeff";

  // 添加表头
  const header = "期号,开奖日期,红球1,红球2,红球3,红球4,红球5,红球6,蓝球";
  csvContent += header + "\n";

  // 添加数据行
  data.forEach(row => {
    const rowData = [];
    rowData.push(row.code, row.date, ...row.red.split(","), row.blue);
    csvContent += rowData.join(",") + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", fileName + ".csv");
  document.body.appendChild(link); // 不显示链接
  link.click(); // 触发下载
  document.body.removeChild(link); // 清除链接
}

(function() {
  const btnContainer = document.querySelector("div.ygkj_wqkjgg > div > div.body-content-item > div.table-hea > div");
  const downloadBtn = document.createElement("button");
  downloadBtn.innerText = "下载开奖结果";
  btnContainer.appendChild(downloadBtn);

  downloadBtn.addEventListener("click", async () => {
    const lastPageElem = document.querySelector("#layui-laypage-1 > a.layui-laypage-next").previousElementSibling;
    const lastPageNumber = parseInt(lastPageElem.innerText);

    let results = [];
    for (let i = 1; i <= lastPageNumber; i++) {
      const response = await fetch(`https://www.cwl.gov.cn/cwl_admin/front/cwlkj/search/kjxx/findDrawNotice?name=ssq&pageNo=${i}&pageSize=30&systemType=PC`, {
        headers: {
          "accept": "application/json, text/javascript, */*; q=0.01",
          "x-requested-with": "XMLHttpRequest"
        },
        method: "GET",
        credentials: "include"
      });
      const data = await response.json();

      const pageResults = data.result.map(item => ({
          code: item.code, // 期号
          date: item.date, // 开奖日期
          red: item.red,   // 红球
          blue: item.blue  // 蓝球
      }));
      results = results.concat(pageResults);
    }

    // 执行数据导出
    jsonToExcel(results, "彩票开奖结果");
  });
})();