// ==UserScript==
// @name         人群_机会人群_人群规模趋势
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/assets/industry_insight/industry?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/494612/%E4%BA%BA%E7%BE%A4_%E6%9C%BA%E4%BC%9A%E4%BA%BA%E7%BE%A4_%E4%BA%BA%E7%BE%A4%E8%A7%84%E6%A8%A1%E8%B6%8B%E5%8A%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/494612/%E4%BA%BA%E7%BE%A4_%E6%9C%BA%E4%BC%9A%E4%BA%BA%E7%BE%A4_%E4%BA%BA%E7%BE%A4%E8%A7%84%E6%A8%A1%E8%B6%8B%E5%8A%BF.meta.js
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
        this?._url?.slice(0, 38) ==
        "/yuntu_ng/api/v1/IndustryAudienceTrend"
      ) {
        target_data = JSON.parse(obj?.target?.response);
      }
    }
  })();

  function appendDoc() {
    const likeComment = document.querySelector(".assets-radio-group.assets-radio-group-type-filled.assets-radio-group-size-md");
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  function expExcel(e) {
    let contrast = {
      "date": "日期",
      "industry_audience_cover_num": "行业兴趣人群",
      "permeability": "本品牌行业渗透率",
    }

    let option = {};
    option.fileName = "人群_机会人群_人群规模趋势"; //文件名
    option.datas = [{
      sheetName: '',
      sheetData: e.data.trend,
      sheetHeader: Object.values(contrast),
      sheetFilter: Object.keys(contrast),
      columnWidths: [], // 列宽
    }]
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
