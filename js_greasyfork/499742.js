// ==UserScript==
// @name         自定义人群_品牌触点分布_批量
// @namespace    http://tampermonkey.net/
// @version      2.0.4
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/analysis/audience/report?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        GM.xmlHttpRequest
// @license      MIT
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/499742/%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BA%BA%E7%BE%A4_%E5%93%81%E7%89%8C%E8%A7%A6%E7%82%B9%E5%88%86%E5%B8%83_%E6%89%B9%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/499742/%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BA%BA%E7%BE%A4_%E5%93%81%E7%89%8C%E8%A7%A6%E7%82%B9%E5%88%86%E5%B8%83_%E6%89%B9%E9%87%8F.meta.js
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
  let industry_id = null;

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
        this?._url?.slice(0, 42) ==
        "/yuntu_ng/api/v1/get_brand_competitor_list"
      ) {
        industry_id = JSON.parse(obj?.target?.response).data[0].industry_id;
      }
    }
  })();


  //获取brand信息
  let brand = localStorage.getItem("__Garfish__platform__yuntu_user") || "";
  let brands = JSON.parse(brand);

  let myHeaders = new Headers();
  myHeaders.append("content-type", "application/json");

  const getRequestOptions = {
    method: "GET",
    redirect: "follow",
  };

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

  async function getData(v) {
    let res = await fetchFun(
      "https://yuntu.oceanengine.com/yuntu_ng/api/v1/get_trigger_point_analysis",
      {
        aadvid: getQueryVariable("aadvid"),
        report_id: v.report_id,
        brand_id: v.brand_id,
        industry_id: industry_id,
        authority_id: 0,
      }
    );
    let data = res.data?.distribution?.map((v) => {
      if (v) {
        return flattenObject(JSON.parse(v));
      }
    });
    console.log(data);
    let expData = data?.flat()
    return {
      name: v.custom_audience_name,
      data: expData,
    }
  }

  async function task_list(e) {
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    let eData = e.split(",");
    let page = +eData[0];
    let count = +(+eData[1] - +eData[0] + 1 ) * 10;
    let raw = JSON.stringify({
      "report_id": "",
      "report_name": "",
      "industry_id": industry_id,
      "brand_id": brands.brand_id,
      "authority_id": 0,
      "page": page,
      "num": count,
      "create_time_sort": 1,
      "trigger_or_kol": ""
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
      "https://yuntu.oceanengine.com/yuntu_ng/api/v1/get_insight_report_list",
      data,
      postRequestOptions
    );
    let res = taskList?.data?.report_list
      ?.map((v) => {
        return { custom_audience_name: v.custom_audience_name,brand_id:v.brand_id, report_id: v.report_id,status: v.status };
      })
      .filter((v) => v.status === 2);

    let expExcelData = await Promise.all(
      res.map((v) => {
        let data = getData(v);
        return data;
      })
    );
    console.log(expExcelData);
    
    expExcel(expExcelData);
    expExcelData = [];
  }

  function appendDoc() {
    const likeComment = document.querySelector(".leftPart-K1nOML");
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();


  //数据处理
  function flattenObject(obj, prefix = '') {
    var result = [];
  
    if (prefix !== '') {
      prefix += '_';
    }
  
    var item = {
        name_zh: prefix + obj.name_zh,
        value: obj.value
    };
  
    result.push(item);
  
    if (obj.children) {
      obj.children.forEach(function(child) {
        if (child.children && child.children.length > 0) {
          result.push(...flattenObject(child, item.name_zh));
        } else {
          var childItem = {
            name_zh: item.name_zh + '_' + child.name_zh,
            value: child.value
          };
          result.push(childItem);
        }
      });
    }
  
    return result;
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
      name: "name_zh",
      value: "value"
    };

    let option = {};
    option.fileName = "品牌触点分布_批量"; //文件名
    option.datas = e.map((v) => {
      return {
        sheetName: v.name,
        sheetData: v.data || [{}],
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      }
    });
   
    submitData(option);
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
