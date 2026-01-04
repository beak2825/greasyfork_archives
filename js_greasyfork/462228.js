// ==UserScript==
// @name         GTA导出
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.8
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_ng/assets/crowd/monitoring?*
// @icon         https://www.google.com/s2/favicons?domain=oceanengine.com
// @grant        none
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/463728-lodash-js/code/lodashjs.js?version=1174104
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/462228/GTA%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/462228/GTA%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var analysis_type = 1, //0是蓄水期， 1是活动期
    gta_type = 1; //1是新客蓄水期 ，2是新客活动期 ，4是老客   //analysis_type = 0 不用管这个

  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  var button1_1 = document.createElement("button"); //创建一个按钮
  button1_1.textContent = "进行中蓄水"; //按钮内容
  button1_1.style.height = "32px"; //高
  button1_1.style.lineHeight = "32px"; //行高
  button1_1.style.align = "center"; //文本居中
  button1_1.style.color = "white"; //按钮文字颜色
  button1_1.style.background = "#1f4bd9"; //按钮底色
  button1_1.style.border = "0px"; //边框属性
  button1_1.style.borderRadius = "0px"; //按钮四个角弧度
  button1_1.style.marginLeft = "10px";
  button1_1.style.fontSize = "12px";
  button1_1.style.padding = "0 5px";
  button1_1.addEventListener("click", urlClick1_1); //监听按钮点击事件

  var button1_2 = document.createElement("button"); //创建一个按钮
  button1_2.textContent = "进行中新客蓄水"; //按钮内容
  button1_2.style.height = "32px"; //高
  button1_2.style.lineHeight = "32px"; //行高
  button1_2.style.align = "center"; //文本居中
  button1_2.style.color = "white"; //按钮文字颜色
  button1_2.style.background = "#1f4bd9"; //按钮底色
  button1_2.style.border = "0px"; //边框属性
  button1_2.style.borderRadius = "0px"; //按钮四个角弧度
  button1_2.style.marginLeft = "10px";
  button1_2.style.fontSize = "12px";
  button1_2.style.padding = "0 5px";
  button1_2.addEventListener("click", urlClick1_2); //监听按钮点击事件

  var button1_3 = document.createElement("button"); //创建一个按钮
  button1_3.textContent = "进行中活动新增"; //按钮内容
  button1_3.style.height = "32px"; //高
  button1_3.style.lineHeight = "32px"; //行高
  button1_3.style.align = "center"; //文本居中
  button1_3.style.color = "white"; //按钮文字颜色
  button1_3.style.background = "#1f4bd9"; //按钮底色
  button1_3.style.border = "0px"; //边框属性
  button1_3.style.borderRadius = "0px"; //按钮四个角弧度
  button1_3.style.marginLeft = "10px";
  button1_3.style.fontSize = "12px";
  button1_3.style.padding = "0 5px";
  button1_3.addEventListener("click", urlClick1_3); //监听按钮点击事件

  var button1_4 = document.createElement("button"); //创建一个按钮
  button1_4.textContent = "进行中老客转化"; //按钮内容
  button1_4.style.height = "32px"; //高
  button1_4.style.lineHeight = "32px"; //行高
  button1_4.style.align = "center"; //文本居中
  button1_4.style.color = "white"; //按钮文字颜色
  button1_4.style.background = "#1f4bd9"; //按钮底色
  button1_4.style.border = "0px"; //边框属性
  button1_4.style.borderRadius = "0px"; //按钮四个角弧度
  button1_4.style.marginLeft = "10px";
  button1_4.style.fontSize = "12px";
  button1_4.style.padding = "0 5px";
  button1_4.addEventListener("click", urlClick1_4); //监听按钮点击事件

  var button = document.createElement("button"); //创建一个按钮
  button.textContent = "进行中成交概览"; //按钮内容
  button.style.height = "32px"; //高
  button.style.lineHeight = "32px"; //行高
  button.style.align = "center"; //文本居中
  button.style.color = "white"; //按钮文字颜色
  button.style.background = "#1f4bd9"; //按钮底色
  button.style.border = "0px"; //边框属性
  button.style.borderRadius = "0px"; //按钮四个角弧度
  button.style.marginLeft = "10px";
  button.style.fontSize = "12px";
  button.style.padding = "0 5px";
  button.addEventListener("click", urlClick); //监听按钮点击事件

  var button2_1 = document.createElement("button"); //创建一个按钮
  button2_1.textContent = "历史蓄水"; //按钮内容
  button2_1.style.height = "32px"; //高
  button2_1.style.lineHeight = "32px"; //行高
  button2_1.style.align = "center"; //文本居中
  button2_1.style.color = "white"; //按钮文字颜色
  button2_1.style.background = "#1f4bd9"; //按钮底色
  button2_1.style.border = "0px"; //边框属性
  button2_1.style.borderRadius = "0px"; //按钮四个角弧度
  button2_1.style.marginLeft = "10px";
  button2_1.style.fontSize = "12px";
  button2_1.style.padding = "0 5px";
  button2_1.addEventListener("click", urlClick2_1); //监听按钮点击事件

  var button2_2 = document.createElement("button"); //创建一个按钮
  button2_2.textContent = "历史新客蓄水"; //按钮内容
  button2_2.style.height = "32px"; //高
  button2_2.style.lineHeight = "32px"; //行高
  button2_2.style.align = "center"; //文本居中
  button2_2.style.color = "white"; //按钮文字颜色
  button2_2.style.background = "#1f4bd9"; //按钮底色
  button2_2.style.border = "0px"; //边框属性
  button2_2.style.borderRadius = "0px"; //按钮四个角弧度
  button2_2.style.marginLeft = "10px";
  button2_2.style.fontSize = "12px";
  button2_2.style.padding = "0 5px";
  button2_2.addEventListener("click", urlClick2_2); //监听按钮点击事件

  var button2_3 = document.createElement("button"); //创建一个按钮
  button2_3.textContent = "历史新客新增"; //按钮内容
  button2_3.style.height = "32px"; //高
  button2_3.style.lineHeight = "32px"; //行高
  button2_3.style.align = "center"; //文本居中
  button2_3.style.color = "white"; //按钮文字颜色
  button2_3.style.background = "#1f4bd9"; //按钮底色
  button2_3.style.border = "0px"; //边框属性
  button2_3.style.borderRadius = "0px"; //按钮四个角弧度
  button2_3.style.marginLeft = "10px";
  button2_3.style.fontSize = "12px";
  button2_3.style.padding = "0 5px";
  button2_3.addEventListener("click", urlClick2_3); //监听按钮点击事件

  var button2_4 = document.createElement("button"); //创建一个按钮
  button2_4.textContent = "历史老客转化"; //按钮内容
  button2_4.style.height = "32px"; //高
  button2_4.style.lineHeight = "32px"; //行高
  button2_4.style.align = "center"; //文本居中
  button2_4.style.color = "white"; //按钮文字颜色
  button2_4.style.background = "#1f4bd9"; //按钮底色
  button2_4.style.border = "0px"; //边框属性
  button2_4.style.borderRadius = "0px"; //按钮四个角弧度
  button2_4.style.marginLeft = "10px";
  button2_4.style.fontSize = "12px";
  button2_4.style.padding = "0 5px";
  button2_4.addEventListener("click", urlClick2_4); //监听按钮点击事件

  var button3_1 = document.createElement("button"); //创建一个按钮
  button3_1.textContent = "自定义蓄水"; //按钮内容
  button3_1.style.height = "32px"; //高
  button3_1.style.lineHeight = "32px"; //行高
  button3_1.style.align = "center"; //文本居中
  button3_1.style.color = "white"; //按钮文字颜色
  button3_1.style.background = "#1f4bd9"; //按钮底色
  button3_1.style.border = "0px"; //边框属性
  button3_1.style.borderRadius = "0px"; //按钮四个角弧度
  button3_1.style.marginLeft = "10px";
  button3_1.style.fontSize = "12px";
  button3_1.style.padding = "0 5px";
  button3_1.addEventListener("click", urlClick3_1); //监听按钮点击事件

  var button3_2 = document.createElement("button"); //创建一个按钮
  button3_2.textContent = "自定义新客蓄水"; //按钮内容
  button3_2.style.height = "32px"; //高
  button3_2.style.lineHeight = "32px"; //行高
  button3_2.style.align = "center"; //文本居中
  button3_2.style.color = "white"; //按钮文字颜色
  button3_2.style.background = "#1f4bd9"; //按钮底色
  button3_2.style.border = "0px"; //边框属性
  button3_2.style.borderRadius = "0px"; //按钮四个角弧度
  button3_2.style.marginLeft = "10px";
  button3_2.style.fontSize = "12px";
  button3_2.style.padding = "0 5px";
  button3_2.addEventListener("click", urlClick3_2); //监听按钮点击事件

  var button3_3 = document.createElement("button"); //创建一个按钮
  button3_3.textContent = "自定义新客新增"; //按钮内容
  button3_3.style.height = "32px"; //高
  button3_3.style.lineHeight = "32px"; //行高
  button3_3.style.align = "center"; //文本居中
  button3_3.style.color = "white"; //按钮文字颜色
  button3_3.style.background = "#1f4bd9"; //按钮底色
  button3_3.style.border = "0px"; //边框属性
  button3_3.style.borderRadius = "0px"; //按钮四个角弧度
  button3_3.style.marginLeft = "10px";
  button3_3.style.fontSize = "12px";
  button3_3.style.padding = "0 5px";
  button3_3.addEventListener("click", urlClick3_3); //监听按钮点击事件

  var button3_4 = document.createElement("button"); //创建一个按钮
  button3_4.textContent = "自定义老客转化"; //按钮内容
  button3_4.style.height = "32px"; //高
  button3_4.style.lineHeight = "32px"; //行高
  button3_4.style.align = "center"; //文本居中
  button3_4.style.color = "white"; //按钮文字颜色
  button3_4.style.background = "#1f4bd9"; //按钮底色
  button3_4.style.border = "0px"; //边框属性
  button3_4.style.borderRadius = "0px"; //按钮四个角弧度
  button3_4.style.marginLeft = "10px";
  button3_4.style.fontSize = "12px";
  button3_4.style.padding = "0 5px";
  button3_4.addEventListener("click", urlClick3_4); //监听按钮点击事件

  var button3 = document.createElement("button"); //创建一个按钮
  button3.textContent = "自定义成交概览"; //按钮内容
  button3.style.height = "32px"; //高
  button3.style.lineHeight = "32px"; //行高
  button3.style.align = "center"; //文本居中
  button3.style.color = "white"; //按钮文字颜色
  button3.style.background = "#1f4bd9"; //按钮底色
  button3.style.border = "0px"; //边框属性
  button3.style.borderRadius = "0px"; //按钮四个角弧度
  button3.style.marginLeft = "10px";
  button3.style.fontSize = "12px";
  button3.style.padding = "0 5px";
  button3.addEventListener("click", urlClick3); //监听按钮点击事件

  //品牌
  let brandObj = {
    1672744273970184: "沙宣",
    1713035740313614: "海昌",
    1672744301182989: "潘婷",
    1713573417704462: "SSS",
    1716472555224075: "奶糖派NTP",
    1718566610217988: "南国食品旗舰店",
    1718731435013124: "beautigo",
    1726899190084611: "Kate Somerville海外旗舰店",
    1729546814550019: "让缇丝Jean d'estrées",
    1730713495040007: "科施佳官方旗舰店",
    1732519757634573: "xinmei@golong.cn",
    1733594070401032: "Sepai",
    1736238360556548: "杭州天萃诗化妆品有限公司",
    1739400043457611: "瑞斐时天津碧捷",
    1744999758913544: "HORMETA欧米达",
    1648829120397320: "Filorga/菲洛嘉",
    1696356811251726: "HADAY/海天",
    1648829117571079: "Nivea/妮维雅",
    1648829118742542: "HomeFacialPro",
    1672744346769421: "Mionsoo/棉上",
    1702602772284429: "AUX/奥克斯",
    1696356998849550: "Bear/小熊",
    1672744362622983: "Baby elephant/红色小象",
    1657598035549197: "OLAY/玉兰油",
    1657598044429383: "BIOHYALUX/润百颜",
    1672744296373261: "a2/至初",
    1672744348379143: "最生活",
    1672744376680456: "MANTING/满婷",
    1672744368166926: "pwu/朴物大美",
    1703060893535310: "UNISKIN/优时颜",
    1679081331241997: "ClorisLand/花皙蔻",
    1710507460462600: "Bb LABORATORIES/苾莱宝",
    1702602792209421: "BRITA/碧然德",
    1696356993701902: "FLYCO/飞科",
    1696356967609421: "PMPM",
    1703060791743559: "RELLET/颐莲",
    1708581408431111: "timage/彩棠",
    1715399324706823: "Dermalogica/德美乐嘉",
    1713035750084616: "肌肉科技",
    1696356873768974: "官栈",
    1713035741929479: "MOODY",
    1713035776524360: "猎聘",
    1703060860826648: "Prof.Ling/凌博士",
    1696356964662285: "LUONENG/罗能",
    1696356991309896: "Ulike",
    1702602808232974: "JINKAIRUI/金凯瑞",
    1713035768359943: "Zhong An Insurance/众安保险",
    1726246245022727: "书亦烧仙草",
    1726246207527048: "可复美",
    1728619073817672: "BeautiGO",
    1728619134274567: "奶糖派",
    1731407696747534: "MURAD",
    1731407714116622: "OVF",
    1737060287995918: "JEAND'ESTREES/让缇丝",
  };
  //message.js
  let loadingMsg = null;

  // //导出文件名
  let fileName = "";

  //默认GET请求
  const getRequestOptions = {
    method: "GET",
    redirect: "follow",
  };

  // const htmlModel = `<div style="display: flex;flex: 1;">
  //         <button id='' style="height:32px;line-height:32px;border: 0;background-color: #1f4bd9;color: #fff; padding: 0 5px;border-radius: 3px;">自定义成交概览</button>
  //     </div>`

  function appendDoc() {
    let like_comment;
    setTimeout(() => {
      like_comment = document.getElementsByClassName(
        "index__container--QOzF4"
      )[0];
      if (like_comment && urlClick3_4) {
        like_comment.append(button1_2); //把按钮加入到 x 的子节点中
        like_comment.append(button1_3); //把按钮加入到 x 的子节点中
        like_comment.append(button1_4); //把按钮加入到 x 的子节点中
        like_comment.append(button);
        // like_comment.append(button2_1); //把按钮加入到 x 的子节点中
        // like_comment.append(button2_2); //把按钮加入到 x 的子节点中
        // like_comment.append(button2_3); //把按钮加入到 x 的子节点中
        // like_comment.append(button2_4); //把按钮加入到 x 的子节点中
        like_comment.append(button3_1); //把按钮加入到 x 的子节点中
        like_comment.append(button3_2); //把按钮加入到 x 的子节点中
        like_comment.append(button3_3); //把按钮加入到 x 的子节点中
        like_comment.append(button3_4); //把按钮加入到 x 的子节点中
        like_comment.append(button3); //把按钮加入到 x 的子节点中
        return;
      }
      appendDoc();
    }, 1000);
  }
  appendDoc();

  //导出（防抖）
  var debounce;

  //导出数据
  let sheetArr = [];
  let sheetArr1 = [];

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
  //获取brand信息
  let brand = localStorage.getItem("__Garfish__platform__yuntu_user") || "";
  let brands = JSON.parse(brand);

  //封装网络请求(带导出)
  function fetchFun(url, data = {}, requestOptions = getRequestOptions) {
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
  function fetchFun2(url, data = {}, requestOptions = getRequestOptions) {
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
  //获取行业id
  async function getIndustryId() {
    let industry_id_url = `https://yuntu.oceanengine.com/yuntu_ng/api/v1/get_user_info`;
    let res = await fetchFun2(industry_id_url, {
      aadvid: getQueryVariable("aadvid"),
    });
    let industryValue = document
      .getElementsByClassName("byted-input-size-md")[0]
      .value.split("/")[
      document.getElementsByClassName("byted-input-size-md")[0].value.split("/")
        .length - 1
    ];
    let data = res;
    let a = data?.data?.brandMetadata?.filter((e) => {
      return e?.industry_name == industryValue;
    })[0];
    return a.industry_id;
  }

  //活动类型记录获取
  async function getQueryType(e) {
    let industry_id = await getIndustryId();

    let data = {
      report_name: "",
      page_index: 1,
      page_size: 1,
      query_type: e, //1:进行中活动，2:历史活动 3:自定义
      report_status: 0,
      aadvid: getQueryVariable("aadvid"),
      brand_id: brands.brand_id,
      industry_id,
    };
    let requestData1 = await fetchFun2(
      "https://yuntu.oceanengine.com/yuntu_ng/api/v1/AudienceGtaReportQueryList",
      data
    );
    data.page_size = requestData1.data.total;
    let requestData = await fetchFun2(
      "https://yuntu.oceanengine.com/yuntu_ng/api/v1/AudienceGtaReportQueryList",
      data
    );
    let titleValue =
      document.getElementsByClassName("index__name--yem7b")[0]?.innerText;
    if (titleValue) {
      let arrList = requestData.data.reports.filter(
        (v) => v.report_name === titleValue
      );
      arrList.forEach((v) => {
        getTermTabsItem(
          v.report_name,
          v.impound_begin_date,
          v.impound_end_date,
          v.harvest_begin_date,
          v.harvest_end_date,
          v.report_id,
          arrList.length
        ); //这是活动期转化分析
      });
    } else {
        if (!requestData.data.reports.length){
            Qmsg.error('暂无数据'); 
            loadingMsg.close(); 
            return ;
        } 
      requestData.data.reports.forEach((v) => {
        getTermTabsItem(
          v.report_name,
          v.impound_begin_date,
          v.impound_end_date,
          v.harvest_begin_date,
          v.harvest_end_date,
          v.report_id,
          requestData.data.reports.length
        ); //这是活动期转化分析
      });
    }
  }

  
  //活动类型记录获取
  async function getQueryType1(e) {
    let industry_id = await getIndustryId();

    let data = {
      report_name: "",
      page_index: 1,
      page_size: 1,
      query_type: e, //1:进行中活动，2:历史活动 3:自定义
      report_status: 0,
      aadvid: getQueryVariable("aadvid"),
      brand_id: brands.brand_id,
      industry_id,
    };
    let requestData1 = await fetchFun2(
      "https://yuntu.oceanengine.com/yuntu_ng/api/v1/AudienceGtaReportQueryList",
      data
    );
    data.page_size = requestData1.data.total;
    let requestData = await fetchFun2(
      "https://yuntu.oceanengine.com/yuntu_ng/api/v1/AudienceGtaReportQueryList",
      data
    );
    let titleValue =
      document.getElementsByClassName("index__name--yem7b")[0]?.innerText;
    if (titleValue) {
      let arrList = requestData.data.reports.filter(
        (v) => v.report_name === titleValue
      );
      arrList.forEach((v) => {
        getTabsData(
          v.report_name,
          v.impound_begin_date,
          v.impound_end_date,
          v.harvest_begin_date,
          v.harvest_end_date,
          v.report_id,
          v.report_name,
          arrList.length
        ); //这是上面的取数
      });
    } else {
        if (!requestData.data.reports.length){
            Qmsg.error('暂无数据'); 
            loadingMsg.close(); 
            return ;
        } 
      requestData.data.reports.forEach((v) => {
        getTabsData(
          v.report_name,
          v.impound_begin_date,
          v.impound_end_date,
          v.harvest_begin_date,
          v.harvest_end_date,
          v.report_id,
          v.report_name,
          requestData.data.reports.length
        ); //这是上面的取数
      });
    }
    // requestData.data.reports.forEach(v => {
    //     getTabsData(v.impound_begin_date,v.impound_end_date,v.harvest_begin_date,v.harvest_end_date,v.report_id,v.report_name,requestData.data.reports.length)  //这是上面的取数
    // });
  }

  //活动数据获取
  async function getTabsData(
    sheetName,
    impound_begin_date,
    impound_end_date,
    harvest_begin_date,
    harvest_end_date,
    report_id,
    report_name
  ) {
    let industry_id = await getIndustryId();

    let contrast = {
      sheetName: "sheetName",
      蓄水期开始时间: "impound_begin_date",
      蓄水期结束时间: "impound_end_date",
      活动期开始时间: "harvest_begin_date",
      活动期结束时间: "harvest_end_date",
      新客人数: "old_gmv_deal_cnt",
      新客GMV: "old_gmv_gmv",
      新客客单价: "old_gmv_unit_price",
      老客人数: "old_deal_cnt",
      存量购买人数: "old_a4_cover_num",
      存量购买转化率: "old_a4_rate",
      老客GMV: "old_gmv",
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

    let data = {
      industry_id,
      aadvid: getQueryVariable("aadvid"),
      brand_id: brands.brand_id,
      report_id,
    };
    let requestData = await fetchFun(
      "https://yuntu.oceanengine.com/yuntu_ng/api/v1/AudienceGtaHarvestGmvProfile",
      data
    );
    let res = requestData?.data?.profiles || requestData?.data?.profile;

    let new_gmv = {};
    Object.keys(res.new_gmv).forEach((v) => {
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
      sheetName,
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
    let datas = {
      sheetName: `(${report_id})`,
      sheetData,
      sheetHeader: Object.keys(contrast),
      sheetFilter: Object.values(contrast),
      columnWidths: [], // 列宽
    };
    sheetArr1.push(sheetData);
  }
  let expDatas = [];
  //活动期转化Item获取
  async function getTermTabsItem(
    report_name,
    impound_begin_date,
    impound_end_date,
    harvest_begin_date,
    harvest_end_date,
    report_id,
    i
  ) {
    let contrast =
      analysis_type === 0
        ? {
            蓄水期开始时间: "impound_begin_date",
            蓄水期结束时间: "impound_end_date",
            触点: "trigger_point_name",
            ID: "trigger_point_id",
            曝光次数: "show_cnt",
            曝光人数: "show_uv",
            曝光人数: "show_uv",
            人均曝光次数: "show_avg",
            流转规模: "to_a3_cnt",
            流转率: "to_a3_rate",
          }
        : {
            活动期开始时间: "harvest_begin_date",
            活动期结束时间: "harvest_end_date",
            触点: "trigger_point_name",
            ID: "trigger_point_id",
            曝光次数: "show_cnt",
            曝光人数: "show_uv",
            曝光人数: "show_uv",
            人均曝光次数: "show_avg",
            存量转化人数: "to_a4_cnt",
            存量转化率: "to_a4_rate",
          };
    let industry_id = await getIndustryId();
    let data = {
      aadvid: getQueryVariable("aadvid"),
      industry_id,
      brand_id: brands.brand_id,
      report_id,
      gta_type: gta_type,
    };
    let requestData = await fetchFun2(
      "https://yuntu.oceanengine.com/yuntu_ng/api/v1/AudienceGtaHarvestAnalysisProfile",
      data
    );
    let res =
      requestData?.data?.profiles || requestData?.data?.profile?.analysis;
    let expExcel2Data = await Promise.all(
      res.map(async (v) => {
        let a = await getTermTabsData(report_id, report_name, v.card);
        return a;
      })
    );
    let arrData = [
      {
        impound_begin_date,
        impound_end_date,
        harvest_begin_date,
        harvest_end_date,
      },
    ];
    expExcel2Data.forEach((v) => {
      arrData.push(...v.sheetData);
    });

    expDatas.push({
      sheetName: `(${report_id})${report_name}`,
      sheetData: arrData.length ? arrData : [{}],
      sheetHeader: Object.keys(contrast),
      sheetFilter: Object.values(contrast),
      columnWidths: [], // 列宽
    });

    if (expDatas.length === i) {
      expExcel2(
        `${brandObj[getQueryVariable("aadvid")]}${fileName}${moment().format(
          "YYYYMMDDHHmmss"
        )}GTA数据`,
        expDatas
      );
    }
  }
  //活动期转化数据获取
  async function getTermTabsData(report_id, report_name, card) {
    let contrast =
      analysis_type === 0
        ? {
            触点: "trigger_point_name",
            ID: "trigger_point_id",
            曝光次数: "show_cnt",
            曝光人数: "show_uv",
            曝光人数: "show_uv",
            人均曝光次数: "show_avg",
            流转规模: "to_a3_cnt",
            流转率: "to_a3_rate",
          }
        : {
            触点: "trigger_point_name",
            ID: "trigger_point_id",
            曝光次数: "show_cnt",
            曝光人数: "show_uv",
            曝光人数: "show_uv",
            人均曝光次数: "show_avg",
            存量转化人数: "to_a4_cnt",
            存量转化率: "to_a4_rate",
          };
    let baseUrl =
      analysis_type === 0
        ? "https://yuntu.oceanengine.com/yuntu_ng/api/v1/AudienceGtaImpoundAnalysis"
        : "https://yuntu.oceanengine.com/yuntu_ng/api/v1/AudienceGtaHarvestAnalysis";
    let industry_id = await getIndustryId();
    let data = {
      aadvid: getQueryVariable("aadvid"),
      industry_id,
      brand_id: brands.brand_id,
      report_id,
      gta_type: gta_type,
      analysis_type: 1,
      card,
    };
    let requestData = await fetchFun2(baseUrl, data);
    let res = requestData.data.ax_analysis.tps;
    let res2 = res.map((v) => {
      return {
        ...v,
        trigger_point_name: `A${card}${v.trigger_point_name}`,
      };
    });
    return {
      sheetName: `${report_name}_A${card}`,
      sheetData: res2,
      sheetHeader: Object.keys(contrast),
      sheetFilter: Object.values(contrast),
      columnWidths: [], // 列宽
    };
  }

  function expExcel() {
    let option = {};
    option.fileName = fileName; //文件名
    option.datas = sheetArr;
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    loadingMsg.close();
  }

  function expExcel1() {
    let contrast = {
      sheetName: "sheetName",
      蓄水期开始时间: "impound_begin_date",
      蓄水期结束时间: "impound_end_date",
      活动期开始时间: "harvest_begin_date",
      活动期结束时间: "harvest_end_date",
      新客人数: "old_gmv_deal_cnt",
      新客GMV: "old_gmv_gmv",
      新客客单价: "old_gmv_unit_price",
      老客人数: "old_deal_cnt",
      存量购买人数: "old_a4_cover_num",
      存量购买转化率: "old_a4_rate",
      老客GMV: "old_gmv",
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
    let option = {};
    option.fileName = fileName; //文件名
    option.datas = [
      {
        sheetName: "sheet1",
        sheetData: sheetArr1,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      },
    ];

    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    loadingMsg.close();
    sheetArr1 = []
  }

  function expExcel2(e, data) {
    let option = {};
    option.fileName = e; //文件名
    option.datas = data;
    // setdata_mgdb(data)
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    loadingMsg.close();
    expDatas = [];
  }

  function urlClick1_1() {
    analysis_type = 0;
    fileName = "进行中蓄水";
    debounce = _.debounce(expExcel, 5000);
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    getQueryType(1);
  }
  function urlClick1_2() {
    analysis_type = 1;
    fileName = "进行中新客蓄水";
    gta_type = 1;
    debounce = _.debounce(expExcel, 5000);
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    getQueryType(1);
  }
  function urlClick1_3() {
    analysis_type = 1;
    gta_type = 2;
    fileName = "进行中新客新增";
    debounce = _.debounce(expExcel, 5000);
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    getQueryType(1);
  }
  function urlClick1_4() {
    analysis_type = 1;
    gta_type = 4;
    fileName = "进行中老客转化";
    debounce = _.debounce(expExcel, 5000);
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    getQueryType(1);
  }

  function urlClick() {
    fileName = `${brandObj[getQueryVariable("aadvid")]}进行中成交概览数据`;
    debounce = _.debounce(expExcel1, 5000);
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    getQueryType1(1);
  }

  function urlClick3() {
    fileName = `${brandObj[getQueryVariable("aadvid")]}自定义成交概览数据`;
    debounce = _.debounce(expExcel1, 5000);
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    getQueryType1(3);
  }

  function urlClick2_1() {
    analysis_type = 0;
    fileName = "GTA历史活动蓄水期数据";
    debounce = _.debounce(expExcel, 5000);
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    getQueryType(2);
  }
  function urlClick2_2() {
    analysis_type = 1;
    gta_type = 1;
    fileName = "GTA历史活动新客蓄水期数据";
    debounce = _.debounce(expExcel, 5000);
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    getQueryType(2);
  }
  function urlClick2_3() {
    analysis_type = 1;
    gta_type = 2;
    analysis_type = 0;
    fileName = "GTA历史活动新客活动期数据";
    debounce = _.debounce(expExcel, 5000);
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    getQueryType(2);
  }
  function urlClick2_4() {
    analysis_type = 1;
    gta_type = 4;
    fileName = "GTA历史活动老客转化数据";
    debounce = _.debounce(expExcel, 5000);
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    getQueryType(2);
  }

  function urlClick3_1() {
    analysis_type = 0;
    fileName = "进行中蓄水";
    debounce = _.debounce(expExcel, 5000);
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    getQueryType(3);
  }
  function urlClick3_2() {
    analysis_type = 1;
    gta_type = 1;
    fileName = "进行中新客蓄水";
    debounce = _.debounce(expExcel, 5000);
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    getQueryType(3);
  }
  function urlClick3_3() {
    analysis_type = 1;
    gta_type = 2;
    fileName = "进行中新客新增";
    debounce = _.debounce(expExcel, 5000);
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    getQueryType(3);
  }
  function urlClick3_4() {
    analysis_type = 1;
    gta_type = 4;
    fileName = "进行中老客转化";
    debounce = _.debounce(expExcel, 5000);
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    getQueryType(3);
  }
})();
