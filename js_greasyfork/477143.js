// ==UserScript==
// @name         SPU5A_指定SPU的人群资产重叠分布
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_ng/assets/commodity/related?*
// @icon         https://www.google.com/s2/favicons?domain=oceanengine.com
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/477143/SPU5A_%E6%8C%87%E5%AE%9ASPU%E7%9A%84%E4%BA%BA%E7%BE%A4%E8%B5%84%E4%BA%A7%E9%87%8D%E5%8F%A0%E5%88%86%E5%B8%83.user.js
// @updateURL https://update.greasyfork.org/scripts/477143/SPU5A_%E6%8C%87%E5%AE%9ASPU%E7%9A%84%E4%BA%BA%E7%BE%A4%E8%B5%84%E4%BA%A7%E9%87%8D%E5%8F%A0%E5%88%86%E5%B8%83.meta.js
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
        this?._url?.slice(0, 46) ==
        "/yuntu_ng/api/v1/GetSpuAudienceAssetOverlapSpu"
      ) {
        target_data = JSON.parse(obj?.target?.response);
      }
    }
  })();

  function appendDoc() {
    const likeComment = document.querySelector(".index__legend--RaIVx");
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  function transformData(inputData) {
    const outputData = [[], [], []];
  
    const xValues = Array.from(new Set(inputData.map(entry => entry.x)));
    const yValues = Array.from(new Set(inputData.map(entry => entry.y)));
  
    xValues.forEach(x => {
      const numObj = {};
      const rateObj = {};
      const compareRateObj = {};
  
      yValues.forEach(y => {
        const numEntry = inputData.find(entry => entry.x === x && entry.y === y);
        if (numEntry) {
          numObj[y] = numEntry.xy_overlap_cover_num;
          rateObj[y] = numEntry.xy_overlap_rate;
          compareRateObj[y] = numEntry.xy_compare_overlap_rate;
        } else {
          numObj[y] = "";
          rateObj[y] = "";
          compareRateObj[y] = "";
        }
      });
  
      outputData[0].push(numObj);
      outputData[1].push(rateObj);
      outputData[2].push(compareRateObj);
    });
  
    return outputData;
  }
  

  function expExcel(e) {
    let data = transformData(e.data.heat_map_list)
    let contrast = {
      "SUP2-A1_SPU1-A1": "SPU2-A1",
      "SUP2-A2_SPU1-A1": "SPU2-A2",
      "SUP2-A3_SPU1-A1": "SPU2-A3",
      "SUP2-A4_SPU1-A1": "SPU2-A4",
      "SUP2-A5_SPU1-A1": "SPU2-A5",
    };

    let option = {};
    option.fileName = "SPU5A_指定SPU的人群资产重叠分布"; //文件名
    option.datas = data.map((v,i)=>{
      return {
        sheetName: i == 0 ? '重叠人数':i == 1 ? '占SPU2比重':'占SPU1比重' ,
        sheetData: v,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      }
    })
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    loadingMsg.close();
  }

  function urlClick() {
    if (target_data) {
      loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
      expExcel(target_data);
    } else {
      loadingMsg = Qmsg.error("数据加载失败，请重试");
    }
  }
})();
