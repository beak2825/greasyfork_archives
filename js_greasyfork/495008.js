// ==UserScript==
// @name         区域门店洞察_团品策略
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/life_service/insight/area?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/495008/%E5%8C%BA%E5%9F%9F%E9%97%A8%E5%BA%97%E6%B4%9E%E5%AF%9F_%E5%9B%A2%E5%93%81%E7%AD%96%E7%95%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/495008/%E5%8C%BA%E5%9F%9F%E9%97%A8%E5%BA%97%E6%B4%9E%E5%AF%9F_%E5%9B%A2%E5%93%81%E7%AD%96%E7%95%A5.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  const button = document.createElement("div");
  button.textContent = "导出商品";
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
        this?._url?.slice(0, 41) ==
        "/yuntu_biz/api/lifeService/GetProductList"
      ) {
        target_data = JSON.parse(obj?.target?.response);
      }
    }
  })();

  function appendDoc() {
    const likeComment = document.querySelectorAll(".life_service_insight-tab-bar-items-inner")[1];
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  function expExcel(e) {
    let contrast = {
      "ProductName": "团品",
      "ProductUrl": "图片",
      "CardShowCnt": "团品曝光量",
      "PayCnt": "团品购买量",
      "PayUv": "团品购买人数",
      "VerifyCnt": "团品核销量",
      "VerifyUv": "团品核销人数",
      "VerifyGmv": "团品核销金额"
    }

    let option = {};
    option.fileName = "区域门店洞察_团品策略"; //文件名
    option.datas = [{
      sheetName: '',
      sheetData: e.data.ProductList,
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
