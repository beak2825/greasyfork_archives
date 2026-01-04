// ==UserScript==
// @name         5A关系资产_5A人群资产渗透分析
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/assets/crowd/distribution?*
// @grant        none
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://update.greasyfork.org/scripts/7223/29866/Momentjs.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/463728-lodash-js/code/lodashjs.js?version=1174104
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/462296/5A%E5%85%B3%E7%B3%BB%E8%B5%84%E4%BA%A7_5A%E4%BA%BA%E7%BE%A4%E8%B5%84%E4%BA%A7%E6%B8%97%E9%80%8F%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/462296/5A%E5%85%B3%E7%B3%BB%E8%B5%84%E4%BA%A7_5A%E4%BA%BA%E7%BE%A4%E8%B5%84%E4%BA%A7%E6%B8%97%E9%80%8F%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  var button = document.createElement("button"); //创建一个按钮
  button.textContent = "导出数据"; //按钮内容
  button.style.height = "32px"; //高
  button.style.lineHeight = "32px"; //行高
  button.style.align = "center"; //文本居中
  button.style.color = "white"; //按钮文字颜色
  button.style.background = "#1f4bd9"; //按钮底色
  button.style.border = "0px"; //边框属性
  button.style.borderRadius = "0px"; //按钮四个角弧度
  button.style.marginLeft = "10px";
  button.style.fontSize = "14px";
  button.style.padding = "0 15px";
  button.addEventListener("click", urlClick); //监听按钮点击事件

  var button1 = document.createElement("button"); //创建一个按钮
  button1.textContent = "资产渗透分析"; //按钮内容
  button1.style.height = "32px"; //高
  button1.style.lineHeight = "32px"; //行高
  button1.style.align = "center"; //文本居中
  button1.style.color = "white"; //按钮文字颜色
  button1.style.background = "#1f4bd9"; //按钮底色
  button1.style.border = "0px"; //边框属性
  button1.style.borderRadius = "0px"; //按钮四个角弧度
  button1.style.marginLeft = "10px";
  button1.style.fontSize = "14px";
  button1.style.padding = "0 15px";
  button1.addEventListener("click", urlClick1); //监听按钮点击事件

  //message.js
  let loadingMsg = null;
  let loadingMsg1 = null;

  //导出文件名
  let fileName = "";

  //默认GET请求
  const getRequestOptions = {
    method: "GET",
    redirect: "follow",
  };

  function appendDoc() {
    setTimeout(() => {
      var like_comment = document.getElementsByClassName(
        "assets-form-container-content"
      )[0];
      if (like_comment) {
        like_comment.append(button); //把按钮加入到 x 的子节点中
        like_comment.append(button1); //把按钮加入到 x 的子节点中
        return;
      }
      appendDoc();
    }, 1000);
  }
  appendDoc();

  //query参数获取
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
  async function getIndustryId(){
    let industry_id_url = `https://yuntu.oceanengine.com/yuntu_ng/api/v1/get_user_info`
    let res = await fetchFun2(industry_id_url,{aadvid:getQueryVariable('aadvid')})
    let industryValue = document.querySelectorAll('.assets-input.assets-input-size-md')[0].value.split('/')[document.querySelectorAll('.assets-input.assets-input-size-md')[0].value.split('/').length - 1]
    let data = res
    let a = data?.data?.brandMetadata?.filter((e)=>{
        let contentData = e?.industry_name.split('/')
        return contentData[contentData.length - 1] == industryValue
    })[0]
    return a.industry_id
  }

  //获取brand信息
  let brand = localStorage.getItem("__Garfish__platform__yuntu_user") || "";
  let brands = JSON.parse(brand);

  //封装网络请求
  function fetchFun2(url, data = {}, requestOptions = getRequestOptions) {
    const urlData = Object.keys(data)
      .map((v) => `${v}=${data[v]}`)
      .join("&");
    return fetch(`${url}?${urlData}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        return JSON.parse(result);
      })
      .catch((error) => console.log("error:", error));
  }


  //获取用户筛选条件
  async function getUseData() {
    let benchmark = {
      对比品牌均值: 1,
      行业TOP5品牌均值: 2,
      行业TOP20品牌均值: 3,
      行业TOP50品牌均值: 4,
      行业TOP100品牌均值: 5,
    };
    let industryValue1 = document.querySelectorAll
    (
      ".assets-input.assets-input-size-md"
    )[2].value;
    let industryValue2 = document.querySelectorAll(
      ".assets-input.assets-input-size-md"
    )[3].value;
    return {
      date: industryValue2,
      benchmark: benchmark[industryValue1],
      benchmark_str: industryValue1,
    };
  }

  //An人群item获取
  async function getAnItem(date, benchmark_str) {
    let industry_id = await getIndustryId();
    let data = {
      aadvid: getQueryVariable("aadvid"),
      industry_id,
      brand_id: brands.brand_id,
      date: moment(date).format("YYYYMMDD"),
    };
    let requestData = await fetchFun2(
      "https://yuntu.oceanengine.com/yuntu_ng/api/v1/get_audience_asset_profile",
      data
    );
    let anData = {
      date: moment(date).format("YYYY-MM-DD"),
      benchmark: benchmark_str,
    };
    let res = requestData?.data.profile;
    res.forEach((v, i) => {
      Object.keys(v).forEach((k) => {
        anData["A" + i + "_" + k] = v[k];
      });
    });
    return anData;
  }

  //5A人群资产结构分析
  async function get5Aassets(date, benchmark_str, benchmark) {
    let industry_id = await getIndustryId();
    let data = {
      aadvid: getQueryVariable("aadvid"),
      industry_id,
      brand_id: brands.brand_id,
      date: moment(date).format("YYYYMMDD"),
      card: 0,
      benchmark,
    };
    let requestData = await fetchFun2(
      "https://yuntu.oceanengine.com/yuntu_ng/api/v1/GetAudienceAssetStructure",
      data
    );
    let res = [
      ...requestData?.data?.structure_list,
      ...requestData?.data?.a3_list,
    ];
    let expData = { date: moment(date).format("YYYY-MM-DD") };
    res.map((v) => {
      expData[v.name + "_value"] = v.value;
      expData[v.name + "_rate"] = v.rate;
    });
    return expData;
  }

  let index_5A = 0
  //5A人群资产渗透分析
  async function get5Apenetration(date, benchmark_str, benchmark) {
    let industry_id = await getIndustryId();
    let data = {
      aadvid: getQueryVariable("aadvid"),
      industry_id,
      brand_id: brands.brand_id,
      date: moment(date).format("YYYYMMDD"),
    };
    let requestData = await fetchFun2(
      "https://yuntu.oceanengine.com/yuntu_ng/api/v1/GetAudienceAssetBig8Profile",
      data
    );
    console.log(requestData,'requestData');
    let res = requestData?.data?.ax_big8_profile[index_5A];
    let contrast = {
      name: "big8_name",
      规模: "big8_cnt",
      占比: "big8_percent",
      渗透率趋势: "big8_permeab",
    };
    let arr = [];
    fileName = `${moment(date).format("YYYY-MM-DD")}A${index_5A}人群资产渗透分析`;
    Object.keys(res).map((v) => {
      arr.push({
        sheetName:
          v == "compete_profile"
            ? "对比品牌"
            : v == "top5_profile"
            ? "行业TOP5品牌"
            : v == "top20_profile"
            ? "行业TOP20品牌"
            : v == "top50_profile"
            ? "行业TOP50品牌"
            : v == "top100_profile"
            ? "行业TOP100品牌"
            : "本品牌",
        sheetData: res[v].length ? res[v] : [{}],
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      });
    });
    expExcel(arr);
  }

  function expExcel(e) {
    let option = {};
    option.fileName = fileName; //文件名
    option.datas = e;
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    if (loadingMsg1) loadingMsg1.close();
    loadingMsg.close();
  }

  async function urlClick() {
    let useData = await getUseData();
    let res = prompt("导出天数（合法值 1～30）", 1);
    let contrast = {
      Benchmark: "benchmark",
      日期: "date",
      人群总资产: "A0_cover_num",
      人群总资产超同行: "A0_position_of_industry",
      A1了解: "A1_cover_num",
      A1了解超同行: "A1_position_of_industry",
      A2吸引: "A2_cover_num",
      A2吸引超同行: "A2_position_of_industry",
      A3问询: "A3_cover_num",
      A3问询超同行: "A3_position_of_industry",
      A4行动: "A4_cover_num",
      A4行动超同行: "A4_position_of_industry",
      A5拥护: "A5_cover_num",
      A5拥护超同行: "A5_position_of_industry",
    };
    let contrast1 = (e) => {
      return {
        日期: "date",
        本品牌A1: "a1_value",
        [e + "A1"]: "a1_compare_value",
        本品牌A2: "a2_value",
        [e + "A2"]: "a2_compare_value",
        本品牌A3: "a3_value",
        [e + "A3"]: "a3_compare_value",
        本品牌A4: "a4_value",
        [e + "A4"]: "a4_compare_value",
        本品牌A5: "a5_value",
        [e + "A5"]: "a5_compare_value",
        本品牌A1占比: "a1_rate",
        [e + "A1占比"]: "a1_compare_rate",
        本品牌A2占比: "a2_rate",
        [e + "A2占比"]: "a2_compare_rate",
        本品牌A3占比: "a3_rate",
        [e + "A3占比"]: "a3_compare_rate",
        本品牌A4占比: "a4_rate",
        [e + "A4占比"]: "a4_compare_rate",
        本品牌A5占比: "a5_rate",
        [e + "A5占比"]: "a5_compare_rate",
      };
    };
    if (res >= 1 && res <= 30) {
      loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
      let arr = new Array(+res);
      let datas = [];
      let datas_5A = [];
      let end_date = "";
      for (let i = 0; i < arr.length; i++) {
        let data = await getAnItem(
          moment(useData.date).add(-i, "days"),
          useData.benchmark_str
        );
        let get5Adata = await get5Aassets(
          moment(useData.date).add(-i, "days"),
          useData.benchmark_str,
          useData.benchmark
        );
        let get5Aenetration = await get5Apenetration(
          moment(useData.date).add(-i, "days"),
          useData.benchmark_str,
          useData.benchmark
        );
        end_date = moment(useData.date).add(-i, "days");
        datas.push(data);
        datas_5A.push(get5Adata);
        document.getElementsByClassName(
          "qmsg-content-loading"
        )[0].childNodes[2].innerHTML = `导出进度：${Math.round(
          (datas.length / arr.length) * 100
        )}%`;
      }
      if (datas.length === +res) {
        fileName = `${moment(end_date).format("YYYYMMDD")}_${moment(
          useData.date
        ).format("YYYYMMDD")}5A关系资产`;
        let expData = [
          {
            sheetName: `5A关系资产`,
            sheetData: datas.length ? datas : [{}],
            sheetHeader: Object.keys(contrast),
            sheetFilter: Object.values(contrast),
            columnWidths: [], // 列宽
          },
          {
            sheetName: `5A人群资产结构分析`,
            sheetData: datas_5A.length ? datas_5A : [{}],
            sheetHeader: Object.keys(contrast1(useData.benchmark_str)),
            sheetFilter: Object.values(contrast1(useData.benchmark_str)),
            columnWidths: [], // 列宽
          },
        ];
        expExcel(expData);
        datas = [];
      }
    } else if (res === null) {
      return;
    } else {
      alert("输入值有误");
      return;
    }
  }

  async function urlClick1() {
    try {
      let res = prompt(`
      O人群输入:0
      A1人群输入:1
      A2人群输入:2
      A3人群输入:3
      A4人群输入:4
      A5人群输入:5
      `);
      if (res) {
        index_5A = parseInt(res);

        let useData = await getUseData();

        loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
        await get5Apenetration(
          moment(useData.date),
          useData.benchmark_str,
          useData.benchmark
        );
      }
    } catch (err) {
      Qmsg.error(err.message+'请刷新页面后重试。');
    }

  }
})();
