// ==UserScript==
// @name         5A关系流转(流转分析)
// @namespace    http://tampermonkey.net/
// @version      2.1.5
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/assets/crowd/flow?*
// @match        *://yuntu.oceanengine.com/yuntu_biz/assets/crowd/flow?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/493343/5A%E5%85%B3%E7%B3%BB%E6%B5%81%E8%BD%AC%28%E6%B5%81%E8%BD%AC%E5%88%86%E6%9E%90%29.user.js
// @updateURL https://update.greasyfork.org/scripts/493343/5A%E5%85%B3%E7%B3%BB%E6%B5%81%E8%BD%AC%28%E6%B5%81%E8%BD%AC%E5%88%86%E6%9E%90%29.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  const button = document.createElement("div");
  button.textContent = "流转分析";
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
// 获取当前页面的 URL
  let currentURL = window.location.href;
  //message.js
  let loadingMsg = null;

  //目标数据
  let res_data = null;

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
      if (this?._url?.slice(0, 42) == "/yuntu_ng/api/v1/AudienceFlowSceneAnalysis") {
        res_data = JSON.parse(obj?.target?._data);
      }
    }
  })();

  function appendDoc() {
    const likeComment = document.querySelector(
      ".tabs-n2rDwo"
    );
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

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

  //默认GET请求
  const getRequestOptions = {
    method: "GET",
    redirect: "follow",
  };

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

  async function getData(e, c, t) {
    let data = {
      aadvid: getQueryVariable("aadvid"),
    };
    let myHeaders = new Headers();
    myHeaders.append("content-type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    let res = [];
    for (let v of t) {
      const requests = [];
      for (let p of c) {
        let params = {
          ...e,
          card: p,
          type: v,
        };

        let raw = JSON.stringify(params);
        let postRequestOptions = { ...requestOptions, body: raw };

        // 延迟1秒
        await delay(1000);

        let response = await fetchFun(
          "https://yuntu.oceanengine.com/yuntu_ng/api/v1/AudienceFlowAnalysis",
          data,
          postRequestOptions
        );

        requests.push(response.data.analysis);
      }

      res.push(await Promise.all(requests));
    }
    expExcel(res.flat(2));
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function expExcel(e) {
    let dataObj = {
      "-1": "O机会",
      1: "A1了解",
      2: "A2吸引",
      3: "A3问询",
      4: "A4行动",
      5: "A5复购",
    };
    let data = e.map((v) => {
      return {
        ...v,
        from_card: dataObj[v.from_card.toString()] || v.from_card,
        to_card: dataObj[v.to_card.toString()] || v.to_card,
      };
    });

    let contrast = {
      来源: "from_card",
      流向: "to_card",
      本品流转: "flow_num",
      本品占比: "rate",
      竞品流转: "competitor_flow_num",
      竞品占比: "competitor_rate",
    };

    let option = {};
    option.fileName = "5A关系流转流转分析"; //文件名
    option.datas = [
      {
        sheetName: "",
        sheetData: data,
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
    if (/^https:\/\/yuntu\.oceanengine\.com\/(yuntu_brand)\//.test(currentURL)) {
      let card = [1, 2, 3, 4, 5];
      let type = [0, 1];
      console.log(res_data);
      if (res_data) {
        loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
        getData(res_data, card, type);
      } else {
        loadingMsg = Qmsg.error("数据加载失败，请刷新页面");
      }
    } else if (/^https:\/\/yuntu\.oceanengine\.com\/(yuntu_biz)\//.test(currentURL)) {
      let card = [1, 2, 3, 4];
      let type = [0, 1];
      if (res_data) {
        loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
        getData(res_data, card, type);
      } else {
        loadingMsg = Qmsg.error("数据加载失败，请刷新页面");
      }
    } else {
        console.log("当前页面的 URL 不符合预期的格式");
    }

  }
})();