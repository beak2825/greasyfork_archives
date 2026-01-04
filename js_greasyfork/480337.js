// ==UserScript==
// @name         投后结案(231117批量需求)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/evaluation_brand/task_list?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/480337/%E6%8A%95%E5%90%8E%E7%BB%93%E6%A1%88%28231117%E6%89%B9%E9%87%8F%E9%9C%80%E6%B1%82%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480337/%E6%8A%95%E5%90%8E%E7%BB%93%E6%A1%88%28231117%E6%89%B9%E9%87%8F%E9%9C%80%E6%B1%82%29.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  let button = document.createElement("button"); //创建一个按钮
  button.textContent = "导出数据(231117)";
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
      var like_comment = document.getElementsByClassName(
        "index__btnWrapper--gvaIn"
      )[0];
      if (like_comment) {
        like_comment.append(button); //把按钮加入到 x 的子节点中
        return;
      }
      appendDoc();
    }, 1000);
  }
  appendDoc();

  const aadvid = getQueryVariable("aadvid");

  let myHeaders = new Headers();
  myHeaders.append("content-type", "application/json");

  async function fetchFun(url, data, requestOptions = getRequestOptions) {
    const urlData = Object.keys(data)
      .map((v) => `${v}=${data[v]}`)
      .join("&");
    try {
      const response = await fetch(`${url}?${urlData}`, requestOptions);
      const result_1 = await response.text();
      return JSON.parse(result_1);
    } catch (error) {
      return console.log("error", error);
    }
  }

  async function task_list(e) {
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    let eData = e.split(",");
    let offset = +(eData[0] - 1 + "0");
    let count = +(eData[1] - offset / 10 + "0");
    let search_word = document.querySelector(
      ".evaluation-input.evaluation-input-size-md"
    )?.value;
    let raw = JSON.stringify({
      main_brand_id: brands.brand_id,
      level_1_industry_id: industry_id,
      offset: offset,
      count: count,
      order_type: 1,
      search_word,
    });
    let data = {
      aadvid,
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
    // console.log(taskList);
    let res = taskList?.data?.task_list
      ?.map((v) => {
        return { task_name: v.task_name, task_id: v.task_id };
      })
      .filter((v) => v.task_id != "2280");

    let expExcelData1 = await Promise.all(
      res.map((v) => {
        let data = getData_hdzl(v);
        return data;
      })
    );

    let expExcelData2 = await Promise.all(
      res.map((v) => {
        let data = getData_llfx(v);
        return data;
      })
    );

    let expExcelData3 = await Promise.all(
      res.map((v) => {
        let data = getData_rqfx(v);
        return data;
      })
    );

    let expExcelData4 = await Promise.all(
      res.map((v) => {
        let data = getData_ppxx(v);
        return data;
      })
    );

    expExcel(
      [...expExcelData1, ...expExcelData2, ...expExcelData3, ...expExcelData4],
      e
    );
  }

  //活动总览数据获取
  async function getData_hdzl(e) {
    let formdata = new FormData();
    let postRequestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };
    let data = {
      aadvid,
    };
    formdata.append("benchmark_type", 5);
    formdata.append("task_id", e.task_id);
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

    let datas = {
      sheetName: `${e.task_name}_活动总览`,
      sheetData: [{ ...requestData2.data, ...requestData.data.rsp }],
      sheetHeader: Object.keys(contrast),
      sheetFilter: Object.values(contrast),
      columnWidths: [], // 列宽
    };
    return datas;
  }

  //流量分析数据获取
  async function getData_llfx(e) {
    let formdata = new FormData();
    let postRequestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };
    let data = {
      aadvid,
    };
    formdata.append("benchmark_type", 5);
    formdata.append("task_id", e.task_id);
    let contrast = {
      推广类型:'name',
      播放次数: "pv",
      行业播放次数: "pv_benchmark",
      播放人数: "uv",
      行业播放人数: "uv_benchmark",
      完播率: "play_over_rate",
      行业完播率: "play_over_rate_benchmark",
      "5s播放率": "play_5s_rate",
      行业5s播放率: "play_5s_rate_benchmark",
      平均观看时长: "avg_watch_duration",
      行业平均观看时长: "avg_watch_duration_benchmark",
      互动率: "engagement_rate",
      行业互动率: "engagement_rate_benchmark",
      涨粉率: "follow_rate",
      行业涨粉率: "follow_rate_benchmark",
      CTR: "ctr",
      行业CTR: "ctr_benchmark",
      CPE:'cpe',
      行业CPE:'cpe_benchmark',
      PVR:'pvr',
      消耗金额: "cost",
      行业消耗金额: "cost_benchmark",
      CPM: "cpm",
      行业CPM: "cpm_benchmark",
      CPC: "cpc",
      行业CPC: "cpc_benchmark",
      CPUV: "cpuv",
      行业CPUV: "cpuv_benchmark",
      CPE: "cpe",
      行业CPE: "cpe_benchmark",
      投稿人数:'author_cnt',
      投稿作品数:'item_cnt'
    };
    //请求接口
    let requestData = await fetchFun(
      "https://yuntu.oceanengine.com/measurement/api/eva/get_evaluation_flow_by_ad_result",
      data,
      postRequestOptions
    );

    let res = requestData.data;

    let arrDara = [
      {name:'星图达人视频',...res?.star},
      {name:'品牌广告',...res?.brand_ad},
      {name:'竞价广告',...res?.effect_ad},
      {name:'千川',...res?.qianchuan_ad},
      {name:'直播',...res?.live},
      {name:'UGC互动',...res?.challenge}
    ]

    let datas = {
      sheetName: `${e.task_name}_流量分析`,
      sheetData: arrDara,
      sheetHeader: Object.keys(contrast),
      sheetFilter: Object.values(contrast),
      columnWidths: [], // 列宽
    };
    return datas;
  }

  //人群分析数据获取
  async function getData_rqfx(e) {
    let raw = JSON.stringify({
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
    let raw2 = JSON.stringify({
      benchmark_type:5,
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
    let myHeaders = new Headers();
    myHeaders.append("accept", "application/json, text/plain, */*");
    myHeaders.append("accept-language", "zh-CN,zh;q=0.9");
    myHeaders.append("content-type", "application/json");

    let postRequestOptions = {
      method: "POST",
      body: raw,
      headers: myHeaders,
      redirect: "follow",
    };

    let postRequestOptions2 = {
      method: "POST",
      body: raw2,
      headers: myHeaders,
      redirect: "follow",
    };
    let data = {
      aadvid,
    };
    let contrast = {
      投前人群规模: "pre_a1_4_uv",
      投后人群规模: "post_a1_4_uv",
      拉新人群规模: "a0_to_a1_4_uv",
      拉新比例: "a0_to_a1_4_rate",
      对比品牌拉新比例均值: "bench_a0_to_a1_4_rate",
      投后粉丝人群: "a5_inc_uv",
      对比品牌投后粉丝人群均值: "bench_a5_inc_rate",
      "5A状态加深的人群": "pos_flow_uv",
      A1流转人数: "up_to_a1_uv",
      A1流转率: "up_to_a1_rate",
      A1流转率对比品牌均值: "bench_up_to_a1_rate",
      A2流转人数: "up_to_a2_uv",
      A2流转率: "up_to_a2_rate",
      A2流转率对比品牌均值: "bench_up_to_a2_rate",
      A3流转人数: "up_to_a3_uv",
      A3流转率: "up_to_a3_rate",
      A3流转率对比品牌均值: "bench_up_to_a3_rate",
      A4A5流转人数: "up_to_a4_uv",
      A4A5流转率: "up_to_a4_rate",
      A4A5流转率对比品牌均值: "bench_up_to_a4_rate",
    };
    //请求接口
    let requestData = await fetchFun(
      "https://yuntu.oceanengine.com/measurement/api/eva/get_evaluation_5a_total_analysis",
      data,
      postRequestOptions
    );
    //请求接口
    let requestData2 = await fetchFun(
      "https://yuntu.oceanengine.com/measurement/api/eva/get_evaluation_5a_total_analysis_bench",
      data,
      postRequestOptions2
    );

    let res = [{
      ...requestData.data,
      bench_a0_to_a1_4_rate:requestData2.data.a0_to_a1_4_rate,
      bench_a5_inc_rate:requestData2.data.a5_inc_rate,
      bench_pos_flow_uv:requestData2.data.pos_flow_uv,
      bench_post_a5_uv:requestData2.data.post_a5_uv,
      bench_up_to_a1_rate:requestData2.data.up_to_a1_rate,
      bench_up_to_a2_rate:requestData2.data.up_to_a2_rate,
      bench_up_to_a3_rate:requestData2.data.up_to_a3_rate,
      bench_up_to_a4_rate:requestData2.data.up_to_a4_rate,

    }]

    let datas = {
      sheetName: `${e.task_name}_人群分析`,
      sheetData: res,
      sheetHeader: Object.keys(contrast),
      sheetFilter: Object.values(contrast),
      columnWidths: [], // 列宽
    };
    return datas;
  }

  //品牌形象分析数据获取
  async function getData_ppxx(e) {
    let raw = JSON.stringify({
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
    let raw2 = JSON.stringify({
      benchmark_type: 2,
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
    let myHeaders = new Headers();
    myHeaders.append("accept", "application/json, text/plain, */*");
    myHeaders.append("accept-language", "zh-CN,zh;q=0.9");
    myHeaders.append("content-type", "application/json");

    let postRequestOptions = {
      method: "POST",
      body: raw,
      headers: myHeaders,
      redirect: "follow",
    };
    let postRequestOptions2 = {
      method: "POST",
      body: raw2,
      headers: myHeaders,
      redirect: "follow",
    };
    let data = {
      aadvid,
    };
    let contrast = {
      评论类型: "sentiment",
      本期投放评论数: "comment_cnt",
      行业本期投放评论数: "brand_comment_cnt",
      本期投放评论人数: "comment_uv",
      行业本期投放评论人数: "brand_comment_uv",
      本期投放评论率: "sentiment_comment_rate",
      品牌整体评论率: "brand_sentiment_comment_rate",
      本期投放贡献率: "advertising_comment_rate",
      行业TOP5品牌均值评论率: "contrast_sentiment_comment_rate",
      看后回搜人数: "search_after_show_uv",
      看后未搜人数: "non_search_after_show_uv",
      看后回搜占比: "search_uv_rate",
      看后1日回搜人数: "search_back_1d_uv",
      看后1日回搜率: "search_back_1d_uv_rate",
      看后3日回搜人数: "search_back_3d_uv",
      看后3日回搜率: "search_back_3d_uv_rate",
      看后7日回搜人数: "search_back_7d_uv",
      看后7日回搜率: "search_back_7d_uv_rate",
    };
    //请求接口
    let requestData = await fetchFun(
      "https://yuntu.oceanengine.com/measurement/api/eva/get_evaluation_comment_sentiment",
      data,
      postRequestOptions
    );
    //请求接口
    let requestData2 = await fetchFun(
      "https://yuntu.oceanengine.com/measurement/api/eva/get_evaluation_comment_sentiment_bench",
      data,
      postRequestOptions2
    );

    //请求接口
    let requestData3 = await fetchFun(
      "https://yuntu.oceanengine.com/measurement/api/eva/get_evaluation_search_analysis",
      data,
      postRequestOptions
    );

    let brand_res = [
      requestData.data.brand_pos,
      requestData.data.brand_neu,
      requestData.data.brand_neg,
    ];

    let brand_res2 = [
      requestData2.data.pos,
      requestData2.data.neu,
      requestData2.data.neg,
    ];

    let res = [
      requestData.data.advertising_pos,
      requestData.data.advertising_neu,
      requestData.data.advertising_neg,
    ].map((v, i) => {
      return {
        ...v,
        ...requestData3.data,
        brand_sentiment: brand_res[i]?.sentiment,
        brand_comment_cnt: brand_res[i]?.comment_cnt,
        brand_comment_uv: brand_res[i]?.comment_uv,
        brand_sentiment_comment_rate: brand_res[i]?.sentiment_comment_rate,
        contrast_sentiment_comment_rate: brand_res2[i]?.sentiment_comment_rate,
        brand_advertising_comment_rate: brand_res[i]?.advertising_comment_rate,
      };
    });

    let datas = {
      sheetName: `${e.task_name}_品牌形象`,
      sheetData: res,
      sheetHeader: Object.keys(contrast),
      sheetFilter: Object.values(contrast),
      columnWidths: [], // 列宽
    };
    return datas;
  }

  function expExcel(e, search) {
    let searchData = search.split(",");
    let fileName = `结案报告数据(${searchData[0]}-${searchData[1]}页)`;
    let option = {};
    option.fileName = fileName; //文件名
    option.datas = e;
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    setTimeout(() => {
      loadingMsg.close();
    }, 1000);
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
