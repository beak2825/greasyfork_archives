// ==UserScript==
// @name         GMV TO 5A(批量删除)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_ng/assets/gta/monitoring?*
// @icon         https://www.google.com/s2/favicons?domain=oceanengine.com
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/467363/GMV%20TO%205A%28%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/467363/GMV%20TO%205A%28%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%29.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  var button = document.createElement("button"); //创建一个按钮
  button.textContent = "批量删除"; //按钮内容
  button.style.height = "34px";
  button.style.lineHeight = "34px";
  button.style.align = "center"; //文本居中
  button.style.color = "white"; //按钮文字颜色
  button.style.background = "red"; //按钮底色
  button.style.border = "1px solid red"; //边框属性
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
    let res = await fetchFun(industry_id_url, {
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

  //message.js
  let loadingMsg = null;

  function appendDoc() {
    setTimeout(() => {
      var like_comment =
        document.getElementsByClassName("index__left--G8wUI")[0];
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
    let { report_id } = e;
    let myHeaders = new Headers();
    myHeaders.append("accept", "application/json, text/plain, */*");
    myHeaders.append("content-type", "application/json");

    let data = {
        aadvid: getQueryVariable("aadvid"),
    };

    let raw = JSON.stringify({
      industry_id: await getIndustryId(),
      brand_id: brands.brand_id,
      report_id,
    });

    const postRequestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    let requestData = await fetchFun(
      "https://yuntu.oceanengine.com/yuntu_ng/api/v1/AudienceGtaReportDel",
      data,
      postRequestOptions
    );

    let res = requestData?.data;
    return res;
  }

  async function getData(e) {
    let taskList = await task_list(e);
    await Promise.all(
      taskList?.map((v) => {
        return getOverview(v?.base_info);
      })
    );
    loadingMsg.close();
    loadingMsg = Qmsg.success('删除成功！')
    location.reload();
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
        loadingMsg = Qmsg.loading("正在批量删除");
      }
    } catch (err) {
      Qmsg.error(err.message);
    }
  }

})();
