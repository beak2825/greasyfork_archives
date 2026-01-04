// ==UserScript==
// @name         投后结案_流量分析_触点流量总览
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/evaluation_brand/report/flow?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/492307/%E6%8A%95%E5%90%8E%E7%BB%93%E6%A1%88_%E6%B5%81%E9%87%8F%E5%88%86%E6%9E%90_%E8%A7%A6%E7%82%B9%E6%B5%81%E9%87%8F%E6%80%BB%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/492307/%E6%8A%95%E5%90%8E%E7%BB%93%E6%A1%88_%E6%B5%81%E9%87%8F%E5%88%86%E6%9E%90_%E8%A7%A6%E7%82%B9%E6%B5%81%E9%87%8F%E6%80%BB%E8%A7%88.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  //指定SPU的人群资产重叠分布

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
      if (
        this?._url?.slice(0, 58) ==
        "/measurement/api/eva/get_evaluation_flow_by_trigger_result"
      ) {
        target_data = JSON.parse(obj?.target?.response);
      }
    }
  })();

  function appendDoc() {
    const likeComment = document.querySelector(".styles-module__overview-extra--Tc0lo");
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  function generatePointName(input) {
    let point_name = '';
    
    // 处理第一级触发点
    if (input.level_1_trigger_point) {
      point_name += input.level_1_trigger_point.query_type_point_name_zh;
    }
    
    // 处理第二级触发点
    if (input.level_2_trigger_point) {
      point_name += '/' + input.level_2_trigger_point.query_type_point_name_zh;
    }
    
    // 处理第三级触发点
    if (input.level_3_trigger_point) {
      point_name += '/' + input.level_3_trigger_point.query_type_point_name_zh;
    }
    
    return { point_name };
  }


  function expExcel(e) {
    let res = e.data.flow_by_trigger.map(v=>{
      return {...v.matix,...generatePointName(v.trigger_point)}
    })
    console.log(res)
    let contrast = {
      "触点": "point_name",
      "本品曝光次数": "pv",
      "本品曝光人数": "uv",
      "本品消耗金额": "cost"
    }
    let option = {};
    option.fileName = "投后结案_流量分析_触点流量总览"; //文件名
    option.datas = [{
      sheetName: '',
      sheetData: res,
      sheetHeader: Object.keys(contrast),
      sheetFilter: Object.values(contrast),
      columnWidths: [], // 列宽
    }]
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
