// ==UserScript==
// @name         投后结案(新批量)
// @namespace    http://tampermonkey.net/
// @version      2.0.4
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/ecom/evaluation/task_list?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        GM.xmlHttpRequest
// @license      MIT
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/463875/%E6%8A%95%E5%90%8E%E7%BB%93%E6%A1%88%28%E6%96%B0%E6%89%B9%E9%87%8F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/463875/%E6%8A%95%E5%90%8E%E7%BB%93%E6%A1%88%28%E6%96%B0%E6%89%B9%E9%87%8F%29.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  var button = document.createElement("button"); //创建一个按钮
  button.textContent = "导出数据(新)"; //按钮内容
  // button.style.width = "120px"; //按钮宽度
  button.style.height = "34px";
  button.style.lineHeight = "34px";
  button.style.align = "center"; //文本居中
  button.style.color = "white"; //按钮文字颜色
  button.style.background = "#1f4bd9"; //按钮底色
  button.style.border = "1px solid #1f4bd9"; //边框属性
  button.style.borderRadius = "3px"; //按钮四个角弧度
  button.style.marginLeft = "10px";
  button.style.fontSize = "12px";
  button.style.padding = "0 10px";
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
        this?._url?.slice(0, 43) == "/yuntu_ng/api/eva/get_brand_competitor_list"
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
      var like_comment = document.getElementsByClassName(
        "reportManage-XI8MD5"
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

  async function task_list(e) {
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    let eData = e.split(",");
    let offset = +(eData[0] - 1 + "0");
    let count = +(eData[1] - offset / 10 + "0");
    let search_word = document.querySelector(".evaluation-input.evaluation-input-size-md")?.value
    let raw = JSON.stringify({
      main_brand_id: brands.brand_id,
      level_1_industry_id: industry_id,
      offset: offset,
      count: count,
      order_type: 1,
      search_word
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
      "https://yuntu.oceanengine.com/measurement/api/eva/get_evaluation_task_list_v2",
      data,
      postRequestOptions
    );
    console.log(taskList);
    let res = taskList?.data?.task_list
      ?.map((v) => {
        return { task_name: v.task_name, task_id: v.task_id };
      })
      .filter((v) => v.task_id != "2280");

    let expExcelData = await Promise.all(
      res.map((v) => {
        let data = getData(v);
        return data;
      })
    );
    expExcel(expExcelData, e);
    expExcelData = [];
  }

  //数据获取
  async function getData(e) {
    let raw = JSON.stringify({
      task_id: e.task_id,
      query_type: {
        promotion_type1: {
          query_type_point_id: "0",
          query_type_point_name_zh: "全部",
          query_type_point_name_en: "all",
        },
        app: {
          query_type_point_id: "0",
          query_type_point_name_zh: "全部",
          query_type_point_name_en: "all",
        },
        material_category: 3,
      },
      order_by_index: 1,
      order_type: 2,
      offset: 0,
      count: 1,
    });

    let raw2 = JSON.stringify({
      task_id: e.task_id,
      query_type: {
        promotion_type1: {
          query_type_point_id: "0",
          query_type_point_name_zh: "全部",
          query_type_point_name_en: "ALL",
        },
        app: {
          query_type_point_id: "0",
          query_type_point_name_zh: "全部",
        },
        level_3_trigger_point: {
          query_type_point_id: "0",
          query_type_point_name_zh: "全部",
        },
      },
    });

    let raw3 = JSON.stringify({
      task_id: e.task_id,
      benchmark_type: 2,
    });

    let raw4 = JSON.stringify({
      task_id: e.task_id,
      benchmark_type: 2,
    });

    let raw5 = JSON.stringify({
      task_id: e.task_id,
      group_by_type: 0,
      query_type: {
        promotion_type1: {
          query_type_point_id: "0",
          query_type_point_name_zh: "全部",
          query_type_point_name_en: "ALL",
        },
        app: {
          query_type_point_id: "0",
          query_type_point_name_zh: "全部",
        },
        level_3_trigger_point: {
          query_type_point_id: "0",
          query_type_point_name_zh: "全部",
        },
      },
    });

    let raw6 = JSON.stringify({
      task_id: e.task_id,
      query_type: {
        promotion_type1: {
          query_type_point_id: "0",
          query_type_point_name_zh: "全部",
          query_type_point_name_en: "ALL",
        },
        app: {
          query_type_point_id: "0",
          query_type_point_name_zh: "全部",
        },
        level_3_trigger_point: {
          query_type_point_id: "0",
          query_type_point_name_zh: "全部",
        },
      },
    });

    let postRequestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    let postRequestOptions2 = {
      method: "POST",
      headers: myHeaders,
      body: raw2,
      redirect: "follow",
    };

    let postRequestOptions3 = {
      method: "POST",
      headers: myHeaders,
      body: raw3,
      redirect: "follow",
    };

    let postRequestOptions4 = {
      method: "POST",
      headers: myHeaders,
      body: raw4,
      redirect: "follow",
    };

    let postRequestOptions5 = {
      method: "POST",
      headers: myHeaders,
      body: raw5,
      redirect: "follow",
    };

    let postRequestOptions6 = {
      method: "POST",
      headers: myHeaders,
      body: raw6,
      redirect: "follow",
    };

    let data = {
      aadvid: getQueryVariable("aadvid"),
    };

    let requestData = await fetchFun(
      "https://yuntu.oceanengine.com/measurement/api/eva/get_evaluation_material_stats_v2",
      data,
      postRequestOptions
    );

    let requestDataBrand = await fetchFun(
      "https://yuntu.oceanengine.com/measurement/api/eva/get_evaluation_search_analysis",
      data,
      postRequestOptions2
    );
    let requestNew = await fetchFun(
      "https://yuntu.oceanengine.com/measurement/api/eva/get_evaluation_homepage_mind_overview",
      data,
      postRequestOptions3
    );
    let requestDataCost = await fetchFun(
      "https://yuntu.oceanengine.com/measurement/api/eva/get_evaluation_homepage_flow_overview",
      data,
      postRequestOptions4
    );

    let requestDataAx = await fetchFun(
      "https://yuntu.oceanengine.com/measurement/api/eva/get_evaluation_5a_acquisition_analysis",
      data,
      postRequestOptions5
    );

    let requestDataAxtx = await fetchFun(
      "https://yuntu.oceanengine.com/measurement/api/eva/get_evaluation_5a_flow_analysis",
      data,
      postRequestOptions6
    );

    let requestTransformation = await fetchFun(
      "https://yuntu.oceanengine.com/measurement/api/eva/get_evaluation_convert_analysis_total",
      { ...data, task_id: e.task_id }
    );

    let requestDataAx_new = {};
    requestDataAx?.data?.acquisition_analysis?.map((v) => {
      requestDataAx_new = {
        ...requestDataAx_new,
        ["A" + v.ax + "uv"]: v.uv,
        ["A" + v.ax + "rate"]: v.rate,
      };
    });

    let requestDataAxtx_Data = {};

    let requestDataAxtx_1o3 = requestDataAxtx?.data?.flow_analysis?.filter(
      (v) => {
        return v.pre_ax === 1 && v.post_ax === 3 && v.end_ax == null;
      }
    )[0];
    Object.keys(requestDataAxtx_1o3 || {})?.map((v) => {
      if (v) {
        requestDataAxtx_Data = {
          ...requestDataAxtx_Data,
          ["A1A3" + v]: requestDataAxtx_1o3[v],
        };
      }
    });

    let requestDataAxtx_2o3 = requestDataAxtx?.data?.flow_analysis?.filter(
      (v) => {
        return v.pre_ax === 2 && v.post_ax === 3 && v.end_ax == null;
      }
    )[0];

    Object.keys(requestDataAxtx_2o3 || {})?.map((v) => {
      if (v) {
        requestDataAxtx_Data = {
          ...requestDataAxtx_Data,
          ["A2A3" + v]: requestDataAxtx_2o3[v],
        };
      }
    });

    let requestDataAxtx_3o4 = requestDataAxtx?.data?.flow_analysis?.filter(
      (v) => {
        return v.pre_ax === 3 && v.post_ax === 4 && v.end_ax == null;
      }
    )[0];

    Object.keys(requestDataAxtx_3o4 || {})?.map((v) => {
      if (v) {
        requestDataAxtx_Data = {
          ...requestDataAxtx_Data,
          ["A3A4" + v]: requestDataAxtx_3o4[v],
        };
      }
    });

    return requestData.data?.material_stats.length
      ? {
          ...requestData.data?.material_stats[0],
          ...requestDataCost?.data?.rsp,
          ...requestDataBrand?.data,
          ...e,
          ...requestNew?.data,
          ...requestDataAx_new,
          ...requestDataAxtx_Data,
          ...requestTransformation?.data?.total_metrics,
        }
      : {
          ...requestDataCost?.data?.rsp,
          ...requestDataBrand?.data,
          ...e,
          ...requestNew?.data,
          ...requestDataAx_new,
          ...requestDataAxtx_Data,
          ...requestTransformation?.data?.total_metrics,
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

  function expExcel(e, search) {
    let searchData = search.split(",");
    let contrast = {
      报告名称: "task_name",
      报告id: "task_id",
      达人视频订单名称: "material_title_list",
      达人视频订单id: "material_id",
      视频链接: "play_url",
      达人昵称: "nick_name",
      曝光次数: "show_cnt",
      完播率: "play_over_rate",
      "5s播放率": "play_5s_rate",
      消耗金额: "cost",
      CTR: "ctr",
      转发数: "share_cnt",
      评论数: "comment_cnt",
      点赞数: "like_cnt",
      曝光后已搜索人数: "search_after_show_uv",
      曝光后未搜索人数: "non_search_after_show_uv",
      拉新规模: "a0_to_a1_4_uv",
      拉新比例: "a0_to_a1_4_uv_rate",
      关系加深人群规模: "pos_flow_uv",
      关系加深比例: "pos_flow_uv_rate",
      A1: "A1uv",
      A2: "A2uv",
      A3: "A3uv",
      A4: "A4uv",
      "A1-A3绝对值": "A1A3uv",
      "A1-A3占比": "A1A3rate",
      "A2-A3绝对值": "A2A3uv",
      "A2-A3占比": "A2A3rate",
      "A3-A4绝对值": "A3A4uv",
      "A3-A4占比": "A3A4rate",
      转化金额: "convert_amount",
      转化次数: "convert_cnt",
      转化率: "convert_frequency",
      转化人数: "convert_uv",
    };
    let fileName = `结案报告数据(${searchData[0]}-${searchData[1]}页)`;
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

    submitData(option)
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
          task_list(res);
        }
      } catch (err) {
        Qmsg.error(err.message);
      }
  }
})();
