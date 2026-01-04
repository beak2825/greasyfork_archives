// ==UserScript==
// @name         爆品指数_竞争分析_流入流出总体分析
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/product/productOverview/productAnalysis/competition*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/477096/%E7%88%86%E5%93%81%E6%8C%87%E6%95%B0_%E7%AB%9E%E4%BA%89%E5%88%86%E6%9E%90_%E6%B5%81%E5%85%A5%E6%B5%81%E5%87%BA%E6%80%BB%E4%BD%93%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/477096/%E7%88%86%E5%93%81%E6%8C%87%E6%95%B0_%E7%AB%9E%E4%BA%89%E5%88%86%E6%9E%90_%E6%B5%81%E5%85%A5%E6%B5%81%E5%87%BA%E6%80%BB%E4%BD%93%E5%88%86%E6%9E%90.meta.js
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
        this?._url?.slice(0, 54) == "/product_node/v2/api/productAnalysis/productCompetitor"
      ) {
        target_data = JSON.parse(obj?.target?.response);
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
    
  //获取aadvid
  const aadvid = getQueryVariable("aadvid");

  //message.js
  let loadingMsg = null;

  function appendDoc() {
    const likeComment = document.querySelectorAll(".right")[1];
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  function expExcel(e) {
    let data = e.data.map(v=>{
      return {...v.crowd,...v.product}
    })

    let contrast = {
      竞平名称: "name",
      ID: "id",
      到手价: "avgGmv",
      所属品牌: "brandName",
      共同点击人数: "commonClickUidCnt",
      占本品点击比例: "clickRatio",
      流入人数: "flowInUidCnt",
      流入占比: "flowInRatio",
      流出人数: "flowOutUidCnt",
      流出占比: "flowOutRatio",
      净流入比例: "dryFlowInRatio",
      都购买: "allBuyUidCnt",
      都未购买: "allNotBuyUidCnt",
    };
    let fileName = "爆品指数_竞争分析_流入流出总体分析";
    let option = {};
    option.fileName = fileName; //文件名
    option.datas = [{
      sheetName: '',
      sheetData: data,
      sheetHeader: Object.keys(contrast),
      sheetFilter: Object.values(contrast),
      columnWidths: [], // 列宽
    }]
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    setTimeout(() => {
      loadingMsg.close();
    }, 1000);
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
