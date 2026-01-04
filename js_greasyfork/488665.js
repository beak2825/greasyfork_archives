// ==UserScript==
// @name         商品_细分市场_市场概览
// @namespace    http://tampermonkey.net/
// @version      2.0.8
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/product/segmentedMarketList?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        GM.xmlHttpRequest
// @license      MIT
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/488665/%E5%95%86%E5%93%81_%E7%BB%86%E5%88%86%E5%B8%82%E5%9C%BA_%E5%B8%82%E5%9C%BA%E6%A6%82%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/488665/%E5%95%86%E5%93%81_%E7%BB%86%E5%88%86%E5%B8%82%E5%9C%BA_%E5%B8%82%E5%9C%BA%E6%A6%82%E8%A7%88.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  let button = document.createElement("button"); //创建一个按钮
  button.textContent = "导出数据(市场概览)";
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
  button.addEventListener("click", urlClick); //监听按钮点击事件
  const getRequestOptions = {
    method: "GET",
    redirect: "follow",
  };

  //获取brand信息
  let brand = localStorage.getItem("__Garfish__platform__yuntu_user") || "";
  let brands = JSON.parse(brand);

  //获取industry_id
  let industry_id = null;

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
        this?._url?.slice(0, 42) == "/yuntu_ng/api/v1/get_brand_competitor_list"
      ) {
        industry_id = JSON.parse(obj?.target?.response).data[0].industry_id;
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

  //message.js
  let loadingMsg = null;

  function appendDoc() {
    setTimeout(() => {
      var like_comment = document.querySelectorAll(
        ".ReportListHeader__ButtonContainer-hbhHEO.fLMUtj"
      )[0];
      if (like_comment) {
        like_comment.append(button); //把按钮加入到 x 的子节点中
        return;
      }
      appendDoc();
    }, 1000);
  }
  appendDoc();

  let myHeaders = new Headers();
  myHeaders.append("content-type", "application/json");

  function fetchFun(url, data, requestOptions = getRequestOptions) {
    const urlData = Object.keys(data)
      .map((v) => `${v}=${data[v]}`)
      .join("&");
    return fetch(`${url}?${urlData}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        return JSON.parse(result);
      })
      .catch((error) => console.log("error", error));
  }

  async function task_list(startPage, endPage) {
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    let page = +startPage;
    let pageSize = +((endPage + 1 - +startPage) * 10);
    let search_word = document.querySelector(
      ".byted-input.byted-input-size-md"
    )?.value;
    let raw = JSON.stringify({
      ids: [],
      page,
      pageSize,
      keyword: search_word,
    });
    let data = {
      aadvid: getQueryVariable("aadvid"),
    };
    let postRequestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    let taskList = await fetchFun(
      "/product_node/v2/api/segmentedMarket/reportList",
      data,
      postRequestOptions
    );

    let res = taskList?.data?.list
      ?.map((v) => {
        return {
          name: v.name,
          reportId: v.reportId,
          endTime: v.endTime,
          status: v.status,
          periodType: v.periodType,
        };
      })
      .filter((v) => v.status == "COMPLETED");

    let expExcelData = await Promise.all(
      res.map((v) => {
        let data = getData(v);
        return data;
      })
    );
    expExcel(expExcelData, startPage, endPage);
    expExcelData = [];
  }

  //数据获取
  async function getData(e) {
    let raw = JSON.stringify({
      reportId: e.reportId,
      categoryId: "0",
      contentType: "ALL",
      startDate: "0",
      endDate: e.endTime,
      dateType: e.periodType,
    });

    let postRequestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    let data = {
      aadvid: getQueryVariable("aadvid"),
    };

    let requestData = await fetchFun(
      "https://yuntu.oceanengine.com/product_node/v2/api/industry/insightOverviewStats",
      data,
      postRequestOptions
    );

    return {
      name: e.name,
      salesAmount: requestData.data?.salesAmount.value,
      salesVolune: requestData.data?.salesVolune.value,
      purchaseUidCnt: requestData.data?.purchaseUidCnt.value,
      productCnt: requestData.data?.productCnt.value,
      productAvgPrice: requestData.data?.productAvgPrice.value,
      perUidOrderCnt: requestData.data?.perUidOrderCnt.value,
      perUidPurchaseProductCnt:
        requestData.data?.perUidPurchaseProductCnt.value,
    };
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

  function expExcel(e, startPage, endPage) {
    let contrast = {
      报告名称: "name",
      "销售金额（指数）": "salesAmount",
      "销售量（指数）": "salesVolune",
      "购买人数（指数）": "purchaseUidCnt",
      "商品数量（指数）": "productCnt",
      "商品平均价格（指数）": "productAvgPrice",
      "人均购买频次（指数）": "perUidOrderCnt",
      "人均购买量（指数）": "perUidPurchaseProductCnt",
    };
    let fileName = `细分市场报告(${startPage}-${endPage}页)`;
    let option = {};
    option.fileName = fileName; //文件名
    option.datas = [
      {
        sheetName: "sheel1",
        sheetData: e,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      },
    ];
    submitData(option);
  }

  function urlClick() {
    try {
      let res = prompt("页码，例: 1,2 （起始页和结束页中间用英文逗号分隔）");
      if (res) {
        let [startPage, endPage] = res.split(",");
        startPage = parseInt(startPage);
        endPage = parseInt(endPage);
        if (isNaN(startPage) || isNaN(endPage) || endPage < startPage) {
          throw new Error("页码格式错误！");
        }
        task_list(startPage, endPage);
      }
    } catch (err) {
      Qmsg.error(err.message);
    }
  }
})();
