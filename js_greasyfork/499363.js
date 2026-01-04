// ==UserScript==
// @name         人群_报告市场_触达频次分析
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2.0.4
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/ecom/analysis/audience/report_portrait?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        GM.xmlHttpRequest
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/499363/%E4%BA%BA%E7%BE%A4_%E6%8A%A5%E5%91%8A%E5%B8%82%E5%9C%BA_%E8%A7%A6%E8%BE%BE%E9%A2%91%E6%AC%A1%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/499363/%E4%BA%BA%E7%BE%A4_%E6%8A%A5%E5%91%8A%E5%B8%82%E5%9C%BA_%E8%A7%A6%E8%BE%BE%E9%A2%91%E6%AC%A1%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  setTimeout(() => {
    document.body.appendChild(new_element);
  }, 2000);

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

  function appendDoc() {
    setTimeout(() => {
      var like_comment = document.querySelector(".header-AIFTwz");
      if (like_comment) {
        like_comment.append(button); //把按钮加入到 x 的子节点中
        return;
      }
      appendDoc();
    }, 1000);
  }
  appendDoc();

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
        this?._url?.slice(0, 43) ==
        "/yuntu_ng/api/v1/get_trigger_point_analysis"
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
      触达频次: "touch_x",
      付费触达人数: "pricing_uv",
      深关系加深率: "pricing_a3_rate",
      全部触点: "full_uv",
      "全部%": "full_uv_rate",
      竞价广告: "cvr_uv",
      "竞价%": "cvr_uv_rate",
      常规广告: "ctr_uv",
      "常规%": "ctr_uv_rate",
    };
    let option = {};
    option.fileName = "人群_报告市场_触达频次分析";
    option.datas = [
      {
        sheetName: "付费触点",
        sheetData: e.data.reach_frequency_data_v2.metrics_report,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      },
    ];

    submitData(option);
  }
})();
