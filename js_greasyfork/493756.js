// ==UserScript==
// @name         数据工厂_商品评估
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/data_factory/tag_factory/audience_tag?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/493756/%E6%95%B0%E6%8D%AE%E5%B7%A5%E5%8E%82_%E5%95%86%E5%93%81%E8%AF%84%E4%BC%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/493756/%E6%95%B0%E6%8D%AE%E5%B7%A5%E5%8E%82_%E5%95%86%E5%93%81%E8%AF%84%E4%BC%B0.meta.js
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
    display: "flex",
    height: "34px",
    lineHeight: "var(--line-height, 34px)",
    width: "100px",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFF",
    background: "linear-gradient(60deg, rgb(95, 240, 225), rgb(47, 132, 254))",
    borderRadius: "5px",
    marginLeft: "10px",
    fontSize: "13px",
    padding: "0 10px",
    cursor: "pointer",
    fontWeight: "500",
  });
  button.addEventListener("click", urlClick);

  let target_data = null;

  window.au_fetch = window.fetch;
  window.fetch = async (...args) => {
    let [resource, config] = args;
    // request interceptor here
    const response = await window.au_fetch(resource, config);
    if (
      response.url.slice(0, 79) ==
      "https://yuntu.oceanengine.com/tag_factory_node/api/graphql/?op=createAndGetEval"
    ) {
      target_data={ response, body: args[1].body }
    }
    return response;
  };

  //message.js
  let loadingMsg = null;

  function appendDoc() {
    const likeComment = document.querySelectorAll(
      ".tagFactory-card-head-title"
    )[2];
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  async function getData(e) {
    return new Promise((resolve, reject) => {
      let body = target_data.body;
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          let _this = JSON.parse(this.responseText);
          expExcel(_this.data.eval.evalList)
        }
      });

      xhr.open("POST", target_data.response.url);
      xhr.setRequestHeader("authority", "yuntu.oceanengine.com");
      xhr.setRequestHeader("accept", "*/*");
      xhr.setRequestHeader("accept-language", "zh-CN,zh;q=0.9");
      xhr.setRequestHeader("content-type", "application/json");

      xhr.send(body);
    });
  }

  function expExcel(e) {

    let contrast = {
      名称: "title",
      类目: "itemData",
      热度: "coverNum",
    };
    let fileName = "数据工厂_商品评估";

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
    if (target_data) {
      loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
      getData(target_data)
      // expExcel(expData);
    } else {
      loadingMsg = Qmsg.error("数据加载失败，请先点击评估");
    }
  }
  //需求不明
})();
