// ==UserScript==
// @name         TOP品牌分析导出
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2.0.9
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/ecom/product/industry/marketProduct?*
// @match        *://yuntu.oceanengine.com/yuntu_brand/ecom/product/segmentedMarketDetail/marketProduct?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        GM.xmlHttpRequest
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/462014/TOP%E5%93%81%E7%89%8C%E5%88%86%E6%9E%90%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/462014/TOP%E5%93%81%E7%89%8C%E5%88%86%E6%9E%90%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);


  let button = document.createElement("button"); //创建一个按钮
  button.textContent = "导出数据";
  Object.assign(button.style, {
    height: "34px",
    lineHeight: "34px",
    alignItems: "center",
    color: "white",
    border: "none",
    background: "linear-gradient(90deg, rgba(0, 239, 253), rgba(64, 166, 254))",
    borderRadius: "5px",
    marginLeft: "10px",
    fontSize: "13px",
    padding: "0 10px",
    cursor: "pointer",
    fontWeight: "500",
  });
  button.addEventListener("click", userXhr); //监听按钮点击事件

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
    setTimeout(() => {
      var like_comment = document.querySelector(
        ".Brand__TitleContainer-JpNvA.jpMDPw"
      );
      if (like_comment) {
        like_comment.append(button); //把按钮加入到 x 的子节点中
        return;
      }
      appendDoc();
    }, 1000);
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
        this?._byted_url?.slice(0, 47) ==
        "/product_node/v2/api/industry/insightBrandStats"
      ) {
        target_data = JSON.parse(obj?.target?.response);
      }
    }
  })();

  function userXhr() {
    if (target_data) {
      loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
      expExcel(target_data);
    } else {
      loadingMsg = Qmsg.error("数据加载失败，请刷新页面");
    }
  }

  //提交数据到服务器
  function submitData(option) {
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    setTimeout(() => {
      loadingMsg.close();
    }, 1000);
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
    let sheetData = e?.data?.list?.map((v) => {
      return {
        brand: v.brand,
        rank: v.data.salesAmount.rank,
        salesAmountvalue: v.data.salesAmount.value,
        salesVolunevalue: v.data.salesVolune.value,
        purchaseUidCntvalue: v.data.purchaseUidCnt.value,
        productCntvalue: v.data.productCnt.value,
        productAvgPricevalue: v.data.productAvgPrice.value,
        perUidOrderCntvalue: v.data.perUidOrderCnt.value,
      };
    });

    let contrast = {
      销售额排名: "rank",
      品牌名称: "brand",
      "销售金额（指数）": "salesAmountvalue",
      "销售量（指数）": "salesVolunevalue",
      "购买人数（指数）": "purchaseUidCntvalue",
      "商品数（指数）": "productCntvalue",
      "商品平均价格（指数）": "productAvgPricevalue",
      "人均购买频次（指数）": "perUidOrderCntvalue",
    };
    let option = {};
    option.fileName = "TOP品牌分析数据";
    option.datas = [
      {
        sheetName: "sheet1",
        sheetData,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      },
    ];
    submitData(option);
  }
})();
