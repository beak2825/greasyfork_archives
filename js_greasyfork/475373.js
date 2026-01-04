// ==UserScript==
// @name        SACInfo
// @namespace   Violentmonkey Scripts
// @match       https://gs.sac.net.cn/pages/registration/sac-publicity-report.html
// @require     https://cdn.staticfile.org/xlsx/0.18.5/xlsx.full.min.js
// @require     https://cdn.staticfile.org/jszip/3.10.1/jszip.min.js
// @grant       GM_xmlhttpRequest
// @version     1.0
// @author      lx
// @license     MIT
// @description 2023/9/15 18:21:28
// @downloadURL https://update.greasyfork.org/scripts/475373/SACInfo.user.js
// @updateURL https://update.greasyfork.org/scripts/475373/SACInfo.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var oldElement = document.querySelector("input.input")
  // 创建一个新的元素
  var newElement = document.createElement("div");
  newElement.innerHTML = '<input type="button" class="input" onclick="searchList()" value="查询"><input type="button" id="output" class="input" value="导出">';
  // 用新元素替换旧元素
  oldElement.parentNode.replaceChild(newElement, oldElement);
  var button1 = document.getElementById("output");
  button1.addEventListener("click", downloadExcel);
})();

// 将工作簿写入Excel文件并下载
function downloadExcel() {
  // 示例JSON数据
  GM_xmlhttpRequest({
    method: "POST",
    url: 'https://gs.sac.net.cn/publicity/getOrgStat?orgType=10',
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.81"
    },
    onload: function (response) {
      var txt = response.responseText;
      if (response.status === 200) {
        var jtxt = JSON.parse(txt);
        convertJsonToExcel(jtxt['data']['data']);
        // console.log(jtxt);
      } else {
        console.log('获取失败', response.status);
      }
    },
    onerror: function (response) {
      reject("请求失败");
    },
  });
}

function convertJsonToExcel(jsonData) {
  // Your JSON data
  const excelFileName = "SACRegInfo_"+ getCurrentTime() + ".xlsx";
  const newJsonData = jsonData.map((dataItem) => (
    {
      "机构名称": dataItem.orgName,
      "从业人员数": dataItem.pracPersonCnt,
      "一般证券业务": dataItem.prac0Cnt,
      "一般证券业务(证券经纪业务营销)": dataItem.prac2Cnt,
      "一般证券业务(投资主办人)": dataItem.prac7Cnt,
      "证券投资咨询(分析师)": dataItem.prac4Cnt,
      "证券投资咨询(投资顾问)": dataItem.prac5Cnt,
      "证券投资咨询(其他)": dataItem.prac1Cnt,
      "证券经纪人": dataItem.prac3Cnt,
      "保荐代表人": dataItem.prac6Cnt,
     }));
  const ws = XLSX.utils.json_to_sheet(newJsonData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${excelFileName}`);
}

function getCurrentTime(){
  var now = new Date();
  var years = now.getFullYear();
  var months = now.getMonth() < 10 ? "0"+now.getMonth() : now.getMonth();
  var days = now.getDate() < 10 ? "0"+now.getDate() : now.getDate();
  var hours = now.getHours() < 10 ? "0"+now.getHours() : now.getHours();
  var minutes = now.getMinutes() < 10 ? "0"+now.getMinutes() : now.getMinutes();
  var seconds = now.getSeconds() < 10 ? "0"+now.getSeconds() : now.getSeconds();
  var currentTime = years+months+days+hours+minutes+seconds;
  return currentTime;
}