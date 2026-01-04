// ==UserScript==
// @name         商品概览_带货矩阵_抖音号分析
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/product/productOverview/sellMatrix?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        GM.xmlHttpRequest
// @license      MIT
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/468777/%E5%95%86%E5%93%81%E6%A6%82%E8%A7%88_%E5%B8%A6%E8%B4%A7%E7%9F%A9%E9%98%B5_%E6%8A%96%E9%9F%B3%E5%8F%B7%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/468777/%E5%95%86%E5%93%81%E6%A6%82%E8%A7%88_%E5%B8%A6%E8%B4%A7%E7%9F%A9%E9%98%B5_%E6%8A%96%E9%9F%B3%E5%8F%B7%E5%88%86%E6%9E%90.meta.js
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
    marginLeft: "10px",
    fontSize: "13px",
    padding: "0 10px",
    cursor: "pointer",
    fontWeight: "500"
  });
  button.addEventListener("click", urlClick);

  function appendDoc() {
    const likeComment = document.querySelectorAll(".ModuleWrapper__Header-guwZQm.kSeHNw")[0];
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  let target_data = null;
  let body_data = null;

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
      if (this?._url?.slice(0, 49) == "/product_node/v2/api/productOverview/itemAnalysis") {
        target_data = JSON.parse(obj?.target?.response);
        body_data = JSON.parse(obj?.target?._data);
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

  //获取aadvid
  const aadvid = getQueryVariable("aadvid");


  async function fetchFun(url, data, requestOptions = getRequestOptions()) {
    const params = new URLSearchParams(data).toString();
    try {
      const response = await fetch(`${url}?${params}`, requestOptions);
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        throw new Error(`Fetch failed: ${response.status}`);
      }
    } catch (error) {
      loadingMsg.close();
      Qmsg.error({
        content: `网络请求错误: ${error.message}`,
        timeout: 5000
      });
      throw error;
    }
  }

  async function getData(e){

    let myHeaders = new Headers();
    myHeaders.append("content-type", "application/json");
  

    const postRequestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    const data = {
      aadvid,
    };

    const raw1 = JSON.stringify({
      ...body_data,
      pageSize: target_data.data.total.toString()
    });

    const targetPromise = await fetchFun(
      "https://yuntu.oceanengine.com/product_node/v2/api/productOverview/itemAnalysis",
      data,
      {
        ...postRequestOptions,
        body: raw1,
      }
    );

    expExcel(targetPromise);
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
      排名:'rank',
      名字:'itemName',
      抖音号:'uniqueId',
      粉丝数量:'fansNum',
      销售额:'gmv',
      销售额占比:'gmvRatio',
      销售量:'salesVolumn',
      曝光人数:'showUidCnt',
      点击人数:'clickUidCnt',
      购买人数:'purchaseUidCnt',
      点击率:'showClickRatio',
      转化率:'clickPurchaseRatio',
      '曝光-购买转化率':'showPurchaseRatio',
      GPM:'gpm',
      客单价:'perUidValue',
      A4拉新人数:'pullA4Cnt',
      拉新率:'pullA4Ratio'
    };
    let fileName ='抖音号分析';
    let option = {};
    option.fileName = fileName; //文件名
    option.datas =[{
        sheetName: 'sheet1',
        sheetData: e.data.list,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      }];

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
