// ==UserScript==
// @name         商品_细分市场_市场构成
// @namespace    http://tampermonkey.net/
// @version      2.0.3
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/product/segmentedMarketDetail/marketAweme?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        GM.xmlHttpRequest
// @license      MIT
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/468985/%E5%95%86%E5%93%81_%E7%BB%86%E5%88%86%E5%B8%82%E5%9C%BA_%E5%B8%82%E5%9C%BA%E6%9E%84%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/468985/%E5%95%86%E5%93%81_%E7%BB%86%E5%88%86%E5%B8%82%E5%9C%BA_%E5%B8%82%E5%9C%BA%E6%9E%84%E6%88%90.meta.js
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
        "/product_node/v2/api/industry/insightAwemeStats"
      ) {
        target_data = JSON.parse(obj?.target?.response);
      }
    }
  })();
  //message.js
  let loadingMsg = null;

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

  function appendDoc() {
    const likeComment = document.querySelector(
      ".ModuleWrapper__Header-guwZQm"
    );
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  async function getData(e) {
    let body = e;
    let expData = body?.data?.list?.map((v) => {
      return {
        ...v.aweme,
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


  //提交数据到服务器
  function submitData(option) {
    //从localStorage获取statBaseUrl
    let statBaseUrl = localStorage.getItem("statBaseUrl");
    if (!statBaseUrl) {
      Qmsg.error("statBaseUrl获取失败，请联系管理员！");
      loadingMsg.close();
      return;
    }
    //获取当前脚本名称
    const scriptName = GM_info.script.name;
    //使用GM.xmlHttpRequest将数据提交到后端服务器
    GM.xmlHttpRequest({
      method: "POST",
      url: statBaseUrl,
      data: JSON.stringify({
        ...option,
        plugins_name: scriptName,
        advertiser_id: getQueryVariable("aadvid"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
      onload: function (response) {
        let res = JSON.parse(response.responseText);
        if (res.code == "990") {
          Qmsg.success("数据已上传");
          var toExcel = new ExportJsonExcel(option);
          toExcel.saveExcel();
          setTimeout(() => {
            loadingMsg.close();
          }, 1000);
        } else {
          loadingMsg.close();
          Qmsg.error("数据上传失败，请联系管理员！");
        }
      },
      onerror: function (response) {
        Qmsg.error("数据上传失败，请联系管理员！");
        loadingMsg.close();
      },
    });
  }

  function expExcel(e) {
    let contrast = {
      '排名': "salesAmountRank",
      '头像': "imageUrl",
      '名称': "name",
      '抖音号': "awemeId",
      '抖音号类型': "authorType",
      '主推类目': "liveMainCategory",
      "销售金额(指数)": "salesAmount",
      "销售量(指数)": "salesVolune",
      "购买人数(指数)": "purchaseUidCnt",
      "商品数(指数)": "productCnt",
      "人均购买频次(指数)": "perUidOrderCnt",
      "人均购买量(指数)": "perUidPurchaseProductCnt",
    };
    let fileName = "市场构成(抖音号分析)";
    let option = {};
    option.fileName = fileName; //文件名
    option.datas = [
      {
        sheetName: "sheet1",
        sheetData: e,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      },
    ];
    
    submitData(option);
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
