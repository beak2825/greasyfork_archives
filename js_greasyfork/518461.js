// ==UserScript==
// @name         SPU5A流转_单品流转分析_触点效率分析
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/ecom/assets/commodity/flow?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        GM.xmlHttpRequest
// @license      MIT
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/518461/SPU5A%E6%B5%81%E8%BD%AC_%E5%8D%95%E5%93%81%E6%B5%81%E8%BD%AC%E5%88%86%E6%9E%90_%E8%A7%A6%E7%82%B9%E6%95%88%E7%8E%87%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/518461/SPU5A%E6%B5%81%E8%BD%AC_%E5%8D%95%E5%93%81%E6%B5%81%E8%BD%AC%E5%88%86%E6%9E%90_%E8%A7%A6%E7%82%B9%E6%95%88%E7%8E%87%E5%88%86%E6%9E%90.meta.js
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
    const likeComment = document.querySelector(
      ".assets-tab-bar-items-inner"
    );
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
        this?._url?.slice(0, 60) ==
        "/yuntu_ng/api/v1/GetSpuAudienceFlowTriggerEfficiencyAnalysis"
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

  async function getData(e) {
    console.log(e,'e');
    let data = e.data.analysis;
    expExcel(data);
  }

  //提交数据到服务器
  function submitData(option) {
  var toExcel = new ExportJsonExcel(option);
  toExcel.saveExcel();
    setTimeout(() => {
      loadingMsg.close();
  }, 1000);
  return
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
    let contrast = {
      触点: "trigger_point_name",
      新增种草规模: "zhongcao_cover_num",
      新增种草规模参考: "benchmark_zhongcao_cover_num",
      新增种草率: "zhongcao_rate",
      新增种草率参考: "benchmark_zhongcao_rate",
      新增转化规模: "convert_cover_num",
      新增转化规模参考: "benchmark_convert_cover_num",
      新增转化率: "convert_rate",
      新增转化规模参考: "benchmark_convert_rate",
      新增种草转化规模: "zhongcao_convert_cover_num",
      新增种草转化规模参考: "benchmark_zhongcao_convert_cover_num",
      种草转化率: "zhongcao_convert_rate",
      种草转化率参考: "benchmark_zhongcao_convert_rate",

    };

    let option = {};
    option.fileName = `SPU5A流转_单品流转分析_触点效率分析`; //文件名
    option.datas = [{
      sheetName: `sheet1`,
      sheetData: e,
      sheetHeader: Object.keys(contrast),
      sheetFilter: Object.values(contrast),
      columnWidths: [], // 列宽
    }]
    submitData(option)
  }

  function urlClick() {
    if (target_data) {
      loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
      getData(target_data);
    } else {
      loadingMsg = Qmsg.error("数据加载失败，请先切换到‘品品人群分析’");
    }
  }
})();
