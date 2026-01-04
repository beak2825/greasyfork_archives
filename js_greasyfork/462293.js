// ==UserScript==
// @name         投后结案-活动总览
// @namespace    http://tampermonkey.net/
// @version      2.1.4
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/evaluation_brand/report/overview?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        GM.xmlHttpRequest
// @license      MIT
// @require      https://greasyfork.org/scripts/463728-lodash-js/code/lodashjs.js?version=1174104
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/462293/%E6%8A%95%E5%90%8E%E7%BB%93%E6%A1%88-%E6%B4%BB%E5%8A%A8%E6%80%BB%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/462293/%E6%8A%95%E5%90%8E%E7%BB%93%E6%A1%88-%E6%B4%BB%E5%8A%A8%E6%80%BB%E8%A7%88.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  var button = document.createElement("button"); //创建一个按钮
  button.textContent = "导出活动总览数据"; //按钮内容
  button.style.align = "center"; //文本居中
  button.style.color = "white"; //按钮文字颜色
  button.style.background = "#1f4bd9"; //按钮底色
  button.style.border = "1px solid #1f4bd9"; //边框属性
  button.style.borderRadius = "5px"; //按钮四个角弧度
  button.style.fontSize = "12px";
  button.style.padding = "5px";
  button.addEventListener("click", urlClick); //监听按钮点击事件
  const getRequestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const sheetArr = [];

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

  //导出（防抖）
  var debounce;

  function appendDoc() {
    setTimeout(() => {
      var like_comment = document.querySelector(
        ".styles__report-overview-header--fM1jW"
      );
      if (like_comment) {
        like_comment.append(button); //把按钮加入到 x 的子节点中
        return;
      }
      appendDoc();
    }, 1000);
  }
  appendDoc();

  function fetchFun(url, data, requestOptions = getRequestOptions) {
    const urlData = Object.keys(data)
      .map((v) => `${v}=${data[v]}`)
      .join("&");
    return fetch(`${url}?${urlData}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        debounce();
        return JSON.parse(result);
      })
      .catch((error) => console.log("error", error));
  }

  //活动总览tabs数据获取
  async function getTabs1Data(e) {
    let sheetName =
      e == 2
        ? "行业TOP5%品牌均值"
        : e == 3
        ? "行业TOP10%品牌均值"
        : e == 4
        ? "行业TOP25%品牌均值"
        : "对比品牌均值";
    let formdata = new FormData();
    let postRequestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };
    let data = {
      aadvid: getQueryVariable("aadvid"),
    };
    formdata.append("benchmark_type", 5);
    formdata.append("task_id", getQueryVariable("task_id"));
    let contrast = {
      曝光次数: "pv",
      行业曝光次数: "pv_benchmark",
      曝光人数: "uv",
      行业曝光人数: "uv_benchmark",
      CTR: "ctr",
      行业CTR: "ctr_benchmark",
      互动率: "engagement_rate",
      行业互动率: "engagement_rate_benchmark",
      消耗金额: "cost",
      行业消耗金额: "cost_benchmark",
      CPM: "cpm",
      行业CPM: "cpm_benchmark",
      CPC: "cpc",
      行业CPC: "cpc_benchmark",
      行业CPE: "cpe_benchmark",
      拉新人群规模: "a0_to_a1_4_uv",
      本品拉新比例: "a0_to_a1_4_uv_rate",
      行业拉新比例: "a0_to_a1_4_uv_rate_benchmark",
      转粉人群规模: "post_a5_uv",
      本品粉丝增长率: "post_a5_uv_rate",
      行业粉丝增长率: "post_a5_uv_rate_benchmark",
      关系加深人群规模: "pos_flow_uv",
      本品关系加深率: "pos_flow_uv_rate",
      行业关系加深率: "pos_flow_uv_rate_benchmark",
      投后日均搜索人数: "search_after_show_uv",
      投前7天搜索人数: "search_before_show_uv",
      本期投放NPS: "advertising_nps",
      本品整体NPS: "brand_nps",
      新增A3量: "a3_cnt",
      A3流转人数: "up_to_a3_uv",
      本期活动A3流转率: "up_to_a3_rate",
      行业A3流转率: "up_to_a3_rate_benchmark",
      "7日回搜率": "search_back_7d_uv_rate",
      行业7日回搜率: "search_back_7d_uv_rate_benchmark",
    };
    //品牌触达表现
    let requestData = await fetchFun(
      "https://yuntu.oceanengine.com/measurement/api/eva/get_evaluation_homepage_flow_overview",
      data,
      postRequestOptions
    );
    //品牌心智表现
    let requestData2 = await fetchFun(
      "https://yuntu.oceanengine.com/measurement/api/eva/get_evaluation_homepage_mind_overview",
      data,
      postRequestOptions
    );

    // requestData.data.rsp
    // console.log(requestData3.data?.total_metrics)
    let datas = {
      sheetName,
      sheetData: [{ ...requestData2.data, ...requestData.data.rsp }],
      sheetHeader: Object.keys(contrast),
      sheetFilter: Object.values(contrast),
      columnWidths: [], // 列宽
    };
    sheetArr.push(datas);
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

  function expExcel() {
    if (sheetArr.length !== 4) return;
    let fileName = document.querySelector(".index__title--ecfAB").childNodes[0].innerText;
    let option = {};
    option.fileName = fileName; //文件名
    option.datas = sheetArr;

    submitData(option);

  }

  function urlClick() {
    let benchmark_type = [2, 3, 4, 5];
    benchmark_type.forEach((e) => {
      getTabs1Data(e);
    });
    debounce = _.debounce(expExcel, 6000);
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
  }
})();
