// ==UserScript==
// @name         投后结案(流量分析)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/evaluation_brand/task_list?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/465756/%E6%8A%95%E5%90%8E%E7%BB%93%E6%A1%88%28%E6%B5%81%E9%87%8F%E5%88%86%E6%9E%90%29.user.js
// @updateURL https://update.greasyfork.org/scripts/465756/%E6%8A%95%E5%90%8E%E7%BB%93%E6%A1%88%28%E6%B5%81%E9%87%8F%E5%88%86%E6%9E%90%29.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  const button = document.createElement("div");
  button.textContent = "流量分析";
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
    fontWeight: "500"
  });
  button.addEventListener("click", urlClick);

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
    const likeComment = document.querySelector(".index__btnWrapper--gvaIn");
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  const getRequestOptions = {
    method: "GET",
    redirect: "follow",
  };

  async function fetchFun(url, data, requestOptions = getRequestOptions()) {
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
        timeout: 5000
      });
      throw error;
    }
  }

  //活动总览tabs数据获取
  async function getTabs1Data(e,task) {
    var myHeaders = new Headers();
    myHeaders.append("content-type", "application/json;charset=UTF-8");

    let bodyData = {
      task_id:task.task_id,
      benchmark_type: 2,
      stat_types: [1, 2, 7],
      if_level_3_trigger_point: true,
      trigger_point: {
        level_1_trigger_point: { query_type_point_id: e },
      },
    };
    let postRequestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(bodyData),
      redirect: "follow",
    };
    let data = {
      aadvid: getQueryVariable("aadvid"),
    };

    let requestData = await fetchFun(
      "https://yuntu.oceanengine.com/measurement/api/v2/get_evaluation_flow_by_day_result",
      data,
      postRequestOptions
    );

    let expData = requestData?.data?.item_list?.map((v, i) => {
      let data = {};
      Object.keys(v.by_day_list).map((r) => {
        //pv：曝光次数  uv：曝光人数  cost：消耗金额
        data[r] = v.by_day_list[r]?.cost;
      });
      let a = Object.values(v.trigger_point).map((v) => {
        return v.query_type_point_name_zh;
      });
      data["point_name"] = a.join("/");
      return {
        data,
      };
    });
    console.log(expData,1111)
    return expData.map((v) => v?.data);
  }

  async function task_list(e) {
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");

    let offset = +(e.startPage - 1 + "0");
    let count = +(e.endPage - offset / 10 + "0");
    let search_word = document.querySelector(".evaluation-input.evaluation-input-size-md")?.value

    let params = {
        main_brand_id: brands.brand_id,
        level_1_industry_id: industry_id,
        offset: offset,
        count: count,
        order_type: 1
    }

    if (search_word) {
        params.search_word = search_word
    }

    let raw = JSON.stringify(params);
    let data = {
      aadvid: getQueryVariable("aadvid"),
    };
    let myHeaders = new Headers();
    myHeaders.append("content-type", "application/json");

    let postRequestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    let taskList = await fetchFun(
      "https://yuntu.oceanengine.com/measurement/api/v2/get_evaluation_task_list_v2",
      data,
      postRequestOptions
    );
    let res = taskList?.data?.task_list
      ?.map((v) => {
        return { task_name: v.task_name, task_id: v.task_id, task_status:v.task_status };
      })
      .filter((v) => v.task_id != "2280" && v.task_status == 3);


    let expExcelData = await Promise.all(
      res.map((v) => {
        let data = getData(v);
        return data;
      })
    );
    // console.log(expExcelData);
    expExcel(expExcelData);
  }


  function expExcel(e) {
    let title = {
        "触点/日期": "point_name",
    };



    let datas = e.map(v=>{
      let contrast = {}
      let maxCount = 0;
      let maxObj;
      v.value.forEach(obj => {
        const count = Object.keys(obj).length;
        if (count > maxCount) {
          maxCount = count;
          maxObj = obj;
        }
      });
      Object.keys(maxObj).map((item) => {
          if (item!=='point_name') {
              contrast[moment(item).format("YYYY-MM-DD")] = item;
          }
      });
      console.log(v.value)
      let datas = {
          sheetName: v?.key,
          sheetData: v?.value,
          sheetHeader: Object.keys({ ...title, ...contrast }),
          sheetFilter: Object.values({ ...title, ...contrast }),
          columnWidths: [], // 列宽
      };
      return datas
    })

    let option = {};
    option.fileName = "流量分析_byDay"; //文件名
    option.datas = datas
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    loadingMsg.close();
  }

  async function getData(task) {
    let pointId = ["130000", "150000"];
    let promiseData = await Promise.all(
      pointId.map(async (v) => {
        let data = await getTabs1Data(v,task);
        return data;
      })
    );
    let res = {key:task.task_name,value:promiseData.flat()}
    return res
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
          task_list({ startPage, endPage });
        }
      } catch (err) {
        Qmsg.error(err.message);
      }
  }

})();
