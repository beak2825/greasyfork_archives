// ==UserScript==
// @name         投后结案_星图达人视频圈选
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/ecom/evaluation_brand/task_create?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        GM.xmlHttpRequest
// @license      MIT
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/469406/%E6%8A%95%E5%90%8E%E7%BB%93%E6%A1%88_%E6%98%9F%E5%9B%BE%E8%BE%BE%E4%BA%BA%E8%A7%86%E9%A2%91%E5%9C%88%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/469406/%E6%8A%95%E5%90%8E%E7%BB%93%E6%A1%88_%E6%98%9F%E5%9B%BE%E8%BE%BE%E4%BA%BA%E8%A7%86%E9%A2%91%E5%9C%88%E9%80%89.meta.js
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
        this?._url?.slice(0, 50) ==
        "/measurement/api/eva/get_evaluation_report_list_v2"
      ) {
        let data = JSON.parse(obj?.target?._data);
        let res = JSON.parse(obj?.target?.response);
        target_data = { data, res };
      }
    }
  })();

  //message.js
  let loadingMsg = null;

  function appendDoc() {
    const likeComment = document.querySelector(".footer__footer--WAlNF");
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
   * 传入需要获取的URL参数key，返回该参数value
   * @param {String} variable urlParam'aadvid'
   * @return {String} '1648829********'
   */

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

  async function getData() {
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    const {
      end_date,
      end_date_filter,
      id_type,
      industry_id,
      level_2_industry_id,
      start_date,
      start_date_filter,
      start_index = 0,
    } = target_data?.data;
    let bodyData = {
      end_date,
      end_date_filter,
      id_type:13,
      industry_id,
      level_2_industry_id,
      start_date,
      start_date_filter,
      start_index,
      end_index: target_data.res.data.total_count,
    };
    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json, text/plain, */*");
    myHeaders.append("accept-language", "zh-CN,zh;q=0.9");
    myHeaders.append("content-type", "application/json");
    const postRequestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(bodyData),
      redirect: "follow",
    };

    let result = await fetchFun(
      "https://yuntu.oceanengine.com/measurement/api/eva/get_evaluation_report_list_v2",
      { aadvid: getQueryVariable("aadvid") },
      postRequestOptions
    );

    expExcel(result.data.reports);
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
      达人视频订单名称: "report_name",
      达人视频订单ID: "report_id",
      达人昵称: "author_name",
      视频创建时间: "start_date",
      视频发布时间: "video_upload_time"
    };
    let fileName = `星图达人视频圈选`;
    let option = {};
    option.fileName = fileName; //文件名
    option.datas = [
      {
        sheetName: "sheet1",
        sheetData: e,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      },
    ];
    submitData(option);
  }

  function urlClick() {
    getData();
  }
})();
