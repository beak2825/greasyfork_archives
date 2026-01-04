// ==UserScript==
// @name         品牌形象洞察_提及量
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/image/insight/brand?indicator=1*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/477670/%E5%93%81%E7%89%8C%E5%BD%A2%E8%B1%A1%E6%B4%9E%E5%AF%9F_%E6%8F%90%E5%8F%8A%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/477670/%E5%93%81%E7%89%8C%E5%BD%A2%E8%B1%A1%E6%B4%9E%E5%AF%9F_%E6%8F%90%E5%8F%8A%E9%87%8F.meta.js
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
        this?._url?.slice(0, 43) ==
        "/measurement/api/v2/image/get_voice_insight"
      ) {
        target_data = JSON.parse(obj?.target?.response);
      }
    }
  })();

  function appendDoc() {
    const likeComment = document.querySelector(".brand-image-tab-bar-extra");
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  function transformData(inputData) {
    const appMapping = {
      1: "抖音",
      2: "头条",
      3: "抖音火山版",
      4: "西瓜视频",
      5: "其他",
    };
  
    const voiceSourceTypeMapping = {
      2: "自然内容",
      3: "内容评论",
      4: "品牌词搜索",
      5: "商品评论",
    };
  
    let outputData = [];
  
    inputData.forEach((level1) => {
      const { app, count, level2 } = level1;
  
      level2.forEach((level2Item) => {
        const { voice_source_type, count: level2Count } = level2Item;
        const appName = appMapping[app] || app;
        const voiceSourceType = voiceSourceTypeMapping[voice_source_type] || voice_source_type;
        outputData.push({
          app: appName,
          level1_count: count,
          voice_source_type: voiceSourceType,
          count: level2Count,
        });
      });
    });
  
    return outputData;
  }

  function transformData1(inputData) {
    const outputData = [];
  
    for (const item of inputData) {
      let app;
  
      switch (item.classification) {
        case 1:
          app = "话题";
          break;
        case 2:
          app = "产品";
          break;
        case 3:
          app = "营销娱乐";
          break;
        case 4:
          app = "其他";
          break;
        default:
          app = "未知"; // 如果有其他分类，可以根据需要进行扩展
      }
  
      const level1_count = item.count;
      const level2 = item.level2;
  
      for (const subItem of level2) {
        const voice_source_type = subItem.name;
        const count = subItem.count;
  
        outputData.push({
          app,
          level1_count,
          voice_source_type,
          count
        });
      }
    }
  
    return outputData;
  }

  function expExcel(e) {

    let data = [
      {
        sheetName:"原生分析",
        sheetData:transformData(e.data.voice_insight.voice_distribution),
        contrast :{
          "app": "level1",
          "level1_count": "level1数量",
          "voice_source_type": "level2",
          "count": "level2数量"
        }
      },
      {
        sheetName:"讨论角度分析",
        sheetData:transformData1(e.data.voice_insight.angle_of_discussion),
        contrast :{
          "app": "level1",
          "level1_count": "level1数量",
          "voice_source_type": "level2",
          "count": "level2数量"
        }
      }
    ]

    let option = {};
    option.fileName = "品牌形象洞察_提及量"; //文件名
    option.datas = data.map((v,i)=>{
      return {
        sheetName: v.sheetName,
        sheetData: v.sheetData,
        sheetHeader: Object.values(v.contrast),
        sheetFilter: Object.keys(v.contrast),
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
