// ==UserScript==
// @name         品牌搜索(搜索词分析TOP20)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/search/brand?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/467627/%E5%93%81%E7%89%8C%E6%90%9C%E7%B4%A2%28%E6%90%9C%E7%B4%A2%E8%AF%8D%E5%88%86%E6%9E%90TOP20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/467627/%E5%93%81%E7%89%8C%E6%90%9C%E7%B4%A2%28%E6%90%9C%E7%B4%A2%E8%AF%8D%E5%88%86%E6%9E%90TOP20%29.meta.js
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
    background: "linear-gradient(60deg, rgb(95, 240, 225), rgb(47, 132, 254))",
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

  //目标数据
  let target_data = null;
  let date = null;

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
        this?._url?.slice(0, 44) ==
        "/search_node/api/search/brand/query/analysis"
      ) {
        target_data = JSON.parse(obj?.target?.response);
        date = JSON.parse(obj?.target?._data);
      }
    }
  })();

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

  //message.js
  let loadingMsg = null;

  function appendDoc() {
    const likeComment = document.querySelector(
      ".SearchAnalysisTable__TitleContainer-bHAcwj"
    );
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  async function fetchFun(url, data, requestOptions = getRequestOptions) {
    const params = new URLSearchParams(data).toString();
    try {
      const response = await fetch(`${url}?${params}`, requestOptions);
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        throw new Error(`Fetch failed: ${response.status}`);
      }
    } catch (error) {
      loadingMsg.close();
      Qmsg.error({
        content: `网络请求错误: ${error.message}`,
        timeout: 5000,
      });
      throw error;
    }
  }

  /**
   * 得到开始和结束日期，得到中间所有天返回数组
   * @param {String} startDay 开始日期'2021-7-1'
   * @param {String} endDay 结束日期'2021-8-1'
   * @return {Array} ['2021-07-01', '2021-07-01'...., '2021-08-01']
   */
  function getDayArr(startDay, endDay) {
    let startVal = moment(startDay).format("YYYY-MM-DD");
    let dayArr = [];
    while (moment(startVal).isBefore(endDay)) {
      dayArr.push(startVal);
      // 自增
      startVal = moment(startVal).add(1, "day").format("YYYY-MM-DD");
    }
    // 将结束日期的天放进数组
    dayArr.push(moment(endDay).format("YYYY-MM-DD"));
    return dayArr;
  }

  async function getOverview(word) {
    const data = {
      aadvid: getQueryVariable("aadvid"),
      word,
    };

    const targetPromise = await fetchFun(
      "https://yuntu.oceanengine.com/yuntu_ng/api/v1/keywords_packet/get_word_detail",
      data
    );

    let barDataList = targetPromise?.data?.trend;

    const barDataListMap = new Map(
      barDataList.map((item) => [item.date, item])
    );

    let datas = getDayArr(
      date?.periodSelector?.startDate,
      date?.periodSelector.endDate
    )
      .map((v) => {
        return barDataListMap.get(v) || { index: 0 };
      })
      .reduce((a, b) => {
        return a + b?.index;
      }, 0);

    return { key: word, value: datas };
  }

  async function getData() {
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    const getTop20 = (dataList, queryType) => {
      return dataList
        ?.filter((v) => {
          return v.queryType === queryType;
        })
        .slice(0, 20);
    };

    const requestData = await Promise.all(
      target_data?.data
        ?.filter((v, i) => i < 20)
        ?.map((v) => getOverview(v.keyword))
    );

    const ppcRequestData = await Promise.all(
      getTop20(target_data?.data, 1)?.map((v) => getOverview(v.keyword))
    );

    const plcRequestData = await Promise.all(
      getTop20(target_data?.data, 2)?.map((v) => getOverview(v.keyword))
    );

    const drcRequestData = await Promise.all(
      getTop20(target_data?.data, 3)?.map((v) => getOverview(v.keyword))
    );

    expExcel([requestData, ppcRequestData, plcRequestData, drcRequestData]);
  }

  function expExcel(e) {
    let contrast = {
      搜索词: "key",
      次数: "value",
    };
    let fileName = `搜索词分析TOP20`;
    let option = {};
    option.fileName = fileName; //文件名
    option.datas = e.map((v) => {
      return {
        sheetName: "",
        sheetData: v,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      };
    });

    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    setTimeout(() => {
      loadingMsg.close();
    }, 1000);
  }

  function urlClick() {
    getData();
  }
})();
