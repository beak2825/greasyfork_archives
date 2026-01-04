// ==UserScript==
// @name         GMV TO 5A(成交概览)
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/assets/gta/monitoring?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/464724/GMV%20TO%205A%28%E6%88%90%E4%BA%A4%E6%A6%82%E8%A7%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/464724/GMV%20TO%205A%28%E6%88%90%E4%BA%A4%E6%A6%82%E8%A7%88%29.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  var button = document.createElement("button"); //创建一个按钮
  button.textContent = "成交概览"; //按钮内容
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

  //获取行业id
  async function getIndustryId() {
    let industry_id_url = `https://yuntu.oceanengine.com/yuntu_ng/api/v1/get_user_info`;
    let industryValue = document.querySelectorAll(".assets-input.assets-input-size-md")[0]
      .value.split("/")[
        document.querySelectorAll(".assets-input.assets-input-size-md")[0].value.split("/")
        .length - 1
    ];
    let res = await fetchFun(industry_id_url, {
      aadvid: getQueryVariable("aadvid"),
    });
    
    let data = res;
    let a = data?.data?.brandMetadata?.filter((e) => {
      return e?.industry_name == industryValue;
    })[0];
    return a.industry_id;
  }

  //message.js
  let loadingMsg = null;

  function appendDoc() {
    setTimeout(() => {
      var like_comment =
        document.getElementsByClassName("left-G8wUIL")[0];
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
    let [start, end] = e.split(",");
    let data = {
      aadvid: getQueryVariable("aadvid"),
    };
    const industry_id = await getIndustryId();
    let pageList = Array.from({ length: (+end) - (+start) + 1}, (_, i) => (+start) + i);
    let promiseAll = await Promise.all(
      pageList.map(async (v) => {
        let raw = JSON.stringify({
          brand_id: brands.brand_id,
          industry_id: industry_id,
          report_id: "",
          report_name: "",
          page_index: v,
          page_size: 6,
          query_type_v2: 1,
          report_type: 13,
        });
        const postRequestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        let taskList = await fetchFun(
          "https://yuntu.oceanengine.com/yuntu_ng/api/v1/AudienceGtaReportQueryListV2",
          data,
          postRequestOptions
        );
        return taskList?.data?.reports;
      })
    );
    let res = promiseAll.flat();
    return res;
  }

  async function getOverview(e) {
    let {
      report_name,
      impound_begin_date,
      impound_end_date,
      harvest_begin_date,
      harvest_end_date,
      report_id,
    } = e;
    let data = {
      aadvid: getQueryVariable("aadvid"),
      industry_id: await getIndustryId(),
      brand_id: brands.brand_id,
      report_id,
    };
    let requestData = await fetchFun(
      "https://yuntu.oceanengine.com/yuntu_ng/api/v1/AudienceGtaHarvestGmvProfile",
      data
    );
    let res = requestData?.data?.profile;
    let new_gmv = {};
    Object.keys(res?.new_gmv).forEach((v) => {
      new_gmv[`old_gmv_${v}`] = res.new_gmv[v];
    });
    let new_gmv_new_analysis = {};
    res.new_gmv.new_analysis.map((v, i) => {
      let name = i == 0 ? "old" : i == 1 ? "new" : "o";
      Object.keys(v).forEach((res) => {
        new_gmv_new_analysis[`${name}_${res}`] = v[res];
      });
    });

    let new_gmv_new_analysis_details = {};
    new_gmv_new_analysis.new_details.map((v, i) => {
      let name = i == 0 ? "new_A1" : i == 1 ? "new_A2" : "new_A3";
      Object.keys(v).forEach((res) => {
        new_gmv_new_analysis_details[`${name}_${res}`] = v[res];
      });
    });
    new_gmv_new_analysis.old_details.map((v, i) => {
      let name = i == 0 ? "old_A1" : i == 1 ? "old_A2" : "old_A3";
      Object.keys(v).forEach((res) => {
        new_gmv_new_analysis_details[`${name}_${res}`] = v[res];
      });
    });

    let old_gmv = {};
    Object.keys(res.old_gmv).forEach((v) => {
      old_gmv[`old_${v}`] = res.old_gmv[v];
    });
    let sheetData = {
      report_name,
      impound_begin_date,
      impound_end_date,
      harvest_begin_date,
      harvest_end_date,
      ...res,
      ...new_gmv,
      ...old_gmv,
      ...new_gmv_new_analysis,
      ...new_gmv_new_analysis_details,
    };
    return sheetData;
  }


  async function getData(e) {
    let taskList = await task_list(e);
    let requestData = await Promise.all(
      taskList?.map((v) => {
        return getOverview(v?.base_info);
      })
    );
    expExcel(requestData, e);
  }

  function expExcel(e, search) {
    let [start, end] = search.split(",");
    let contrast = {
      名称: "report_name",
      蓄水期开始时间: "impound_begin_date",
      蓄水期结束时间: "impound_end_date",
      活动期开始时间: "harvest_begin_date",
      活动期结束时间: "harvest_end_date",
      新客人数: "old_gmv_deal_cnt",
      新客GMV: "old_gmv_gmv",
      新客GMV占比: "old_gmv_gmv_ratio",
      新客客单价: "old_gmv_unit_price",
      老客人数: "old_deal_cnt",
      存量购买人数: "old_a4_cover_num",
      存量购买转化率: "old_a4_rate",
      老客GMV: "old_gmv",
      老客GMV占比: "old_gmv_ratio",
      老客客单价: "old_unit_price",
      活动期成交人数: "cover_num",
      活动期gmv: "gmv",
      活动期客单价: "unit_price",
      gmv目标完成度: "gmv_process",
      最新日期: "latest_date",
      新增A1规模: "new_A1_cover_num",
      新增A1贡献新客人数: "new_A1_deal_cnt",
      新增A1贡献占比: "new_A1_deal_rate",
      新增A1转化率: "new_A1_flow_rate",
      新增A2规模: "new_A2_cover_num",
      新增A2贡献新客人数: "new_A2_deal_cnt",
      新增A2贡献占比: "new_A2_deal_rate",
      新增A2转化率: "new_A2_flow_rate",
      新增A3规模: "new_A3_cover_num",
      新增A3贡献新客人数: "new_A3_deal_cnt",
      新增A3贡献占比: "new_A3_deal_rate",
      新增A3转化率: "new_A3_flow_rate",
      存量A1规模: "old_A1_cover_num",
      存量A1贡献新客人数: "old_A1_deal_cnt",
      存量A1贡献占比: "old_A1_deal_rate",
      存量A1转化率: "old_A1_flow_rate",
      存量A2规模: "old_A2_cover_num",
      存量A2贡献新客人数: "old_A2_deal_cnt",
      存量A2贡献占比: "old_A2_deal_rate",
      存量A2转化率: "old_A2_flow_rate",
      存量A3规模: "old_A3_cover_num",
      存量A3贡献新客人数: "old_A3_deal_cnt",
      存量A3贡献占比: "old_A3_deal_rate",
      存量A3转化率: "old_A3_flow_rate",
      o人群贡献占比: "o_rate",
    };
    let fileName = `GTA概览(${start}-${end}页)`;
    let option = {};
    option.fileName = fileName; //文件名
    option.datas = [
      {
        sheetName: "",
        sheetData: e,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      },
    ];
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
        getData(res);
        loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
      }
    } catch (err) {
      Qmsg.error(err.message);
    }
  }

})();
