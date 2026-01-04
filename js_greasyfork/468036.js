// ==UserScript==
// @name         商品概览_货品结构分析
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/product/productOverview/productStructure?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/468036/%E5%95%86%E5%93%81%E6%A6%82%E8%A7%88_%E8%B4%A7%E5%93%81%E7%BB%93%E6%9E%84%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/468036/%E5%95%86%E5%93%81%E6%A6%82%E8%A7%88_%E8%B4%A7%E5%93%81%E7%BB%93%E6%9E%84%E5%88%86%E6%9E%90.meta.js
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
    const likeComment = document.querySelector(".ProductAnalysis__Selector-xYEIw.dizBso");
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
        this?._url?.slice(0, 49) ==
        "/product_node/v2/api/productOverview/itemAnalysis"
      ) {
        target_data = JSON.parse(obj?.target?.response);
      }
    }
  })();

  async function getData(e) {
    expExcel(e)
  }


  function expExcel(e) {

    let fileName = `货品结构分析`

    let data = e.data?.list.map(v=>{
      return {...v,category:`${v.firstCategoryName}-${v.secondCategoryName}-${v.thirdCategoryName}`}
    })
    let contrast = {
      排名: "rank",
      商品信息: "itemName",
      商品ID:"itemId",
      图片链接:"imgUrl",
      商品品类: "category",
      销售额:"value",
      销售额占比:"ratio",
      销售量:"salesVolumn",
      曝光人数:"showUidCnt",
      点击人数:"clickUidCnt",
      购买人数:"purchaseUidCnt",
      点击率:"showClickRatio",
      转化率:"clickPurchaseRatio",
      曝光_购买转化率:"showPurchaseRatio",
      GPM:"gpm",
      客单价:"perUidValue",
      A4拉新人数:"pullA4Cnt",
      拉新率:"pullA4Ratio",
      爆品指数:"productScore",
    };

    let option = {};
    option.fileName = fileName; //文件名
    option.datas = [
      {
        sheetName: "",
        sheetData: data,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      }
    ];
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    loadingMsg.close();
  }

  function urlClick() {
    if (target_data) {
      loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
      getData(target_data);
    } else {
      loadingMsg = Qmsg.error("数据加载失败，请刷新页面！");
    }
  }
})();
