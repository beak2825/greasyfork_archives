// ==UserScript==
// @name         营销触点_营销概览_爆文加热
// @namespace    http://tampermonkey.net/
// @version      2.0.3
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/strategy/medium/talent_markting/hotcontent?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        GM.xmlHttpRequest
// @license      MIT
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/497855/%E8%90%A5%E9%94%80%E8%A7%A6%E7%82%B9_%E8%90%A5%E9%94%80%E6%A6%82%E8%A7%88_%E7%88%86%E6%96%87%E5%8A%A0%E7%83%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/497855/%E8%90%A5%E9%94%80%E8%A7%A6%E7%82%B9_%E8%90%A5%E9%94%80%E6%A6%82%E8%A7%88_%E7%88%86%E6%96%87%E5%8A%A0%E7%83%AD.meta.js
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
      if (this?._url?.slice(0, 37) == "/yuntu_ng/api/v1/StarAdsRateProfileV2") {
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

  function appendDoc() {
    const likeComment = document.querySelector(".time-iYiwYi");
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();


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
    let res = e.data;
    let data = [{
      self_metrics_star_ads_rate: res.self_metrics.star_ads_rate,
      self_metrics_total_cost: res.self_metrics.total_cost,
      self_metrics_star_cost: res.self_metrics.star_cost,
      self_metrics_ad_cost: res.self_metrics.ad_cost,
      self_metrics_show_cnt: res.self_metrics.show_cnt,
      self_metrics_a3_increase_cnt: res.self_metrics.a3_increase_cnt,
      self_metrics_a3_increase_rate: res.self_metrics.a3_increase_rate,
      self_metrics_after_search_cnt: res.self_metrics.after_search_cnt,
      self_metrics_gmv_all: res.self_metrics.gmv_all,
      industry_metrics_star_ads_rate: res.industry_metrics.star_ads_rate,
      industry_metrics_total_cost: res.industry_metrics.total_cost,
      industry_metrics_star_cost: res.industry_metrics.star_cost,
      industry_metrics_ad_cost: res.industry_metrics.ad_cost,
      industry_metrics_show_cnt: res.industry_metrics.show_cnt,
      industry_metrics_a3_increase_cnt: res.industry_metrics.a3_increase_cnt,
      industry_metrics_a3_increase_rate: res.industry_metrics.a3_increase_rate,
      industry_metrics_after_search_cnt: res.industry_metrics.after_search_cnt,
      industry_metrics_gmv_all: res.industry_metrics.gmv_all
    }]

    let contrast = {
      本品加热消耗比:"self_metrics_star_ads_rate",
      本品全部消耗: "self_metrics_total_cost",
      本品星图一口价: "self_metrics_star_cost",
      本品加热广告金额: "self_metrics_ad_cost",
      本品曝光量: "self_metrics_show_cnt",
      本品新增A3量: "self_metrics_a3_increase_cnt",
      本品新增A3率: "self_metrics_a3_increase_rate",
      本品看后搜量: "self_metrics_after_search_cnt",
      本品挂车销售额: "self_metrics_gmv_all",
      行业加热消耗比: "industry_metrics_star_ads_rate",
      行业全部消耗: "industry_metrics_total_cost",
      行业星图一口价: "industry_metrics_star_cost",
      行业加热广告金额: "industry_metrics_ad_cost",
      行业曝光量: "industry_metrics_show_cnt",
      行业新增A3量: "industry_metrics_a3_increase_cnt",
      行业新增A3率: "industry_metrics_a3_increase_rate",
      行业看后搜量: "industry_metrics_after_search_cnt",
      行业挂车销售额: "industry_metrics_gmv_all",
    };

    let option = {};
    option.fileName = "本品牌星图视频加热数据"; //文件名
    option.datas = [
      {
        sheetName: "sheet1",
        sheetData: data,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      }
    ];
    submitData(option);
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
