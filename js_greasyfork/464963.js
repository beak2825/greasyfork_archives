// ==UserScript==
// @name         单品分析_爆品指数_人群分析对比
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/product/productOverview/productAnalysis/crowd*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/464963/%E5%8D%95%E5%93%81%E5%88%86%E6%9E%90_%E7%88%86%E5%93%81%E6%8C%87%E6%95%B0_%E4%BA%BA%E7%BE%A4%E5%88%86%E6%9E%90%E5%AF%B9%E6%AF%94.user.js
// @updateURL https://update.greasyfork.org/scripts/464963/%E5%8D%95%E5%93%81%E5%88%86%E6%9E%90_%E7%88%86%E5%93%81%E6%8C%87%E6%95%B0_%E4%BA%BA%E7%BE%A4%E5%88%86%E6%9E%90%E5%AF%B9%E6%AF%94.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  const button = document.createElement("div");
  button.textContent = "导出画像";
  Object.assign(button.style, {
    height: "34px",
    lineHeight: "var(--line-height, 34px)",
    alignItems: "center",
    color: "#FFF",
    background: "linear-gradient(60deg, rgb(95, 240, 225), rgb(47, 132, 254))",
    borderRadius: "5px",
    marginLeft: "10px",
    fontSize: "13px",
    padding: "0 10px",
    cursor: "pointer",
    fontWeight: "500"
  });
  button.addEventListener("click", urlClick);

 //目标数据
 let target_data = null;
 let res_data = null;

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
       this?._url?.slice(0, 57) == "/product_node/v2/api/productAnalysis/productIndexPortrait"
     ) {
       target_data = JSON.parse(obj?.target?.response);
       res_data = JSON.parse(obj?.target?._data);
     }
   }
 })();

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  }
    
  const objData = {
    BRAND: '本品',
    COMPETITOR_BRAND: '对比商品',
    INDUSTRY_BRAND: '行业Top20',
    ALL: '全部',
    LIVE_ROOM: '直播',
    PRODUCT_CARD: '商品卡',
    SHORT_VIDEO: '短视频',
    PURCHASE: '商品购买',
    CLICK: '商品点击',
    CLICK_NOT_PURCHASE: '商品后未购',
    SHOW: '商品曝光',
    SHOW_NOT_PURCHASE: '曝光后未购',
    ADD_CART: '商品加购'
  }
  

  //获取aadvid
  const aadvid = getQueryVariable("aadvid");

  //message.js
  let loadingMsg = null;

  function appendDoc() {
    const likeComment = document.querySelectorAll(".byted-radio-group-size-md")[3];
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  function formatData(data) {
    const result = [];
    data.items.forEach((item) => {
      const newItem = {
        labelName: data.name,
        name: item.name,
        value: item.value,
      };
      result.push(newItem);
    });
    return result;
  }

  async function getData(e) {
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");

    const formatRes = (res) => {
      return res?.map((v) => {
          return formatData(v);
        })
        .flat();
    };
    const targetRes_formatted = formatRes(e?.data?.competitorData);
    const contrastRes_formatted = formatRes(e?.data?.selfData);

    const variables = res_data;
      expExcel([
      {
        label: `目标组A-${objData[variables.competitorDimension.benchmarkType]}-${objData[variables.competitorDimension.contentType]}-${objData[variables.competitorDimension.actionType]}`,
        value: targetRes_formatted,
      },
      {
        label: `目标组B-${objData[variables.selfDimension.benchmarkType]}-${objData[variables.selfDimension.contentType]}-${objData[variables.selfDimension.actionType]}`,
        value: contrastRes_formatted,
      },
    ]);
  }

  function expExcel(e) {
    let contrast = {
      标签类型: "labelName",
      标签: "name",
      占比: "value"
    };
    let fileName =
      document.querySelector(".byted-input-size-md").value || "data";
    let option = {};
    option.fileName = fileName; //文件名
    option.datas = e.map((v) => {
      return {
        sheetName: v.label,
        sheetData: v.value,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      };
    });
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



