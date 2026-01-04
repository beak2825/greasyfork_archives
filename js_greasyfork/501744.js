// ==UserScript==
// @name         达人优选_内容偏好
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/strategy/medium/select/ta?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/501744/%E8%BE%BE%E4%BA%BA%E4%BC%98%E9%80%89_%E5%86%85%E5%AE%B9%E5%81%8F%E5%A5%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/501744/%E8%BE%BE%E4%BA%BA%E4%BC%98%E9%80%89_%E5%86%85%E5%AE%B9%E5%81%8F%E5%A5%BD.meta.js
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
      if (this?._url?.slice(0, 35) == "/yuntu_ng/api/v2/get_talent_type_v2") {
        target_data = JSON.parse(obj?.target?.response);
      }
    }
  })();

  function appendDoc() {
    const likeComment = document.querySelector(".opBtn-o4PQF3");
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  function expExcel(e) {
    let contrast = {
      name: "type_name",
      占比: "occupancy_rate",
      tgi: "tgi"
    };

    let option = {};
    option.fileName = "TA选达人内容偏好"; //文件名
    option.datas = [
      {
        sheetName: "占比前10",
        sheetData: e.data.type_list_1_oc,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      },
      {
        sheetName: "TGI前10",
        sheetData: e.data.type_list_1_tgi,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      },
      {
        sheetName: "二级占比前10",
        sheetData: e.data.type_list_2_oc,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      },
      {
        sheetName: "二级TGI前10",
        sheetData: e.data.type_list_2_tgi,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      },
    ];
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    loadingMsg.close();
  }

  function urlClick() {
    if (target_data) {
      loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
      expExcel(target_data);
    } else {
      loadingMsg = Qmsg.error("数据加载失败，请重试");
    }
  }
})();
