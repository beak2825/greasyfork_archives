// ==UserScript==
// @name         服务商中心_团队管理
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/service_provider/team/all_brand_members
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/466832/%E6%9C%8D%E5%8A%A1%E5%95%86%E4%B8%AD%E5%BF%83_%E5%9B%A2%E9%98%9F%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/466832/%E6%9C%8D%E5%8A%A1%E5%95%86%E4%B8%AD%E5%BF%83_%E5%9B%A2%E9%98%9F%E7%AE%A1%E7%90%86.meta.js
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

  //获取brand信息
  let brand = localStorage.getItem("__Garfish__platform__yuntu_user") || "";
  let brands = JSON.parse(brand);

  //获取service_provider_id
  let service_provider_id = null;

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
        this?._url?.slice(0, 59) ==
        "/service_provider/api/v1/team/query_service_provider_member"
      ) {
        service_provider_id = JSON.parse(
          obj?.target?.response
        ).data_list[0].service_provider_id;
      }
    }
  })();

  //默认GET请求
  const getRequestOptions = {
    method: "GET",
    redirect: "follow",
  };

  //message.js
  let loadingMsg = null;

  function appendDoc() {
    const likeComment = document.querySelector(".left_YEVa");
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

  async function brandsRequest(e) {
    let bodyData = {
      service_provider_id: service_provider_id,
      page: e,
      fuzzy_word: ""
    };
    let result = await fetchFun(
      "https://yuntu.oceanengine.com/service_provider/api/v1/team/query_service_provider_member",
      bodyData
    );
    return result.data_list
  }

  function getRecordCount(text) {
    const recordCount = text.match(/\d+/)[0];
    const count = parseInt(recordCount)
    const pages = Math.ceil(count/10)
    return pages;
  }

  function createNumberList(end) {
    const result = [];
    for (let i = 1; i <= end; i++) {
      result.push(i);
    }
    return result;
  }
  

  async function task_list() {
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    let countText = document.querySelector('.team-pager-record').innerHTML
    let count = 0
    if (countText) {
      count = getRecordCount(countText);
    } else {
      count = 0;
    }
    
    let pages = createNumberList(count)

    let res = await Promise.all(pages.map(async v=>{
        let result = await brandsRequest(v);
        return result;
    }))

    let flatResult = res.flat()

    expExcel(flatResult)
  }

  function expExcel(e) {
    let res = e.map(v=>{
        return {...v, brinds:v.auth_brand_list.map(v=>v.brand_name)}
    })
    let contrast = {
      成员姓名: "user_name",
      邮箱: "email",
      手机号: "phone",
      服务品牌: "brinds"
    };

    let datas = {
        sheetName: '',
        sheetData: res,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
    };

    let option = {};
    option.fileName = "团队管理-所有成员"; //文件名
    option.datas = [datas];
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    loadingMsg.close();
  }

  function urlClick() {
    task_list();
  }
})();
