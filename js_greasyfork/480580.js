// ==UserScript==
// @name         投后结案_抖店数据_商品
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/evaluation_brand/task_create?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/480580/%E6%8A%95%E5%90%8E%E7%BB%93%E6%A1%88_%E6%8A%96%E5%BA%97%E6%95%B0%E6%8D%AE_%E5%95%86%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/480580/%E6%8A%95%E5%90%8E%E7%BB%93%E6%A1%88_%E6%8A%96%E5%BA%97%E6%95%B0%E6%8D%AE_%E5%95%86%E5%93%81.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  const button = document.createElement("div");
  button.textContent = "导出商品数据";
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
        this?._url?.slice(0, 48) ==
        "/measurement/api/eva/get_evaluation_doushop_info"
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
      industry_id,
      level_2_industry_id,
      main_brand_id,
      type,
      start_date,
      end_date,
      search_info,
      shop_ids,
      start_index,
    } = target_data?.data;
    let bodyData = {
      industry_id,
      level_2_industry_id,
      main_brand_id,
      type,
      start_date,
      end_date,
      search_info,
      shop_ids,
      start_index,
      end_index: target_data.res.data.tot_item_cnt,
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
      "https://yuntu.oceanengine.com/measurement/api/eva/get_evaluation_doushop_info",
      { aadvid: getQueryVariable("aadvid") },
      postRequestOptions
    );
    // return 
    expExcel(result.data.shop_item);
  }

  function expExcel(e) {
    let contrast = {
      商品名称: "name",
      URL:"url",
      商品ID: "id",
      所属店铺: "shop_belongs",
      成交数量: "order_cnt",
      GMV: "gmv",
    };
    let fileName = `抖店数据_商品`;
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
    getData();
  }
})();
