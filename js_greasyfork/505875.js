// ==UserScript==
// @name         商品_行业洞察_市场构成
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  云图扩展工具
// @author       Amos
// @match        *://yuntu.oceanengine.com/yuntu_brand/product/industry/marketProduct?*
// @match        *://yuntu.oceanengine.com/yuntu_brand/product/segmentedMarketDetail/marketProduct?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/505875/%E5%95%86%E5%93%81_%E8%A1%8C%E4%B8%9A%E6%B4%9E%E5%AF%9F_%E5%B8%82%E5%9C%BA%E6%9E%84%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/505875/%E5%95%86%E5%93%81_%E8%A1%8C%E4%B8%9A%E6%B4%9E%E5%AF%9F_%E5%B8%82%E5%9C%BA%E6%9E%84%E6%88%90.meta.js
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
    color: "#FFF",
    background: "linear-gradient(60deg, rgb(95, 240, 225), rgb(47, 132, 254))",
    borderRadius: "5px",
    margin: "0 10px",
    fontSize: "13px",
    padding: "0 10px",
    cursor: "pointer",
    fontWeight: "500",
    display: "inline-flex", // 使按钮作为内联块显示
    justifyContent: "center", // 水平居中
    alignItems: "center", // 垂直居中
  });
  button.addEventListener("click", urlClick);

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
        this?._url?.slice(0, 47) ==
        "/product_node/v2/api/industry/insightBrandStats"
      ) {
        target_data = JSON.parse(obj?.target?.response);
      }
    }
  })();

  //message.js
  let loadingMsg = null;


  function appendDoc() {
    setTimeout(() => {
    var container = document.querySelector(
      '[data-log-module="Top品牌分析"] .byted-card-head'
    );
      if (container) {
        container.append(button);
        return;
      }
      appendDoc();
    }, 1000);
  }
 appendDoc();

  async function getData(e) {
    let body = e;
    
    let expData = body?.data?.list?.map((v) => {
      return {
        ...v.aweme,
        name: v.brand,
        perUidOrderCnt: v.data.perUidOrderCnt.value,
        perUidPurchaseProductCnt: v.data.perUidPurchaseProductCnt.value,
        productAvgPrice: v.data.productAvgPrice.value,
        productCnt: v.data.productCnt.value,
        purchaseUidCnt: v.data.purchaseUidCnt.value,
        salesAmount: v.data.salesAmount.value,
        salesAmountRank: v.data.salesAmount.rank,
        salesVolune: v.data.salesVolune.value,
      };
    });
    expExcel(expData);
  }

  function expExcel(e) {
    let contrast = {
      '排名': "salesAmountRank",
      '名称': "name",
      "销售金额(指数)": "salesAmount",
      "销售量(指数)": "salesVolune",
      "购买人数(指数)": "purchaseUidCnt",
      "商品数(指数)": "productCnt",
      "商品平均价格":"productAvgPrice",
      "人均购买频次(指数)": "perUidOrderCnt",
      "人均购买量(指数)": "perUidPurchaseProductCnt",
    };
    let fileName = "Top品牌分析";
    let option = {};
    option.fileName = fileName; //文件名
    option.datas = [
      {
        sheetName: "",
        sheetData: e,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      },
    ];
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    setTimeout(() => {
      loadingMsg.close();
    }, 1000);
  }

  function urlClick() {
    if (target_data) {
      loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
      getData(target_data);
    } else {
      loadingMsg = Qmsg.error("数据加载失败，请重试");
    }
  }
})();
