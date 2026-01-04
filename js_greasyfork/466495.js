// ==UserScript==
// @name         5A关系流转(内容分析)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/assets/crowd/flow?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/466495/5A%E5%85%B3%E7%B3%BB%E6%B5%81%E8%BD%AC%28%E5%86%85%E5%AE%B9%E5%88%86%E6%9E%90%29.user.js
// @updateURL https://update.greasyfork.org/scripts/466495/5A%E5%85%B3%E7%B3%BB%E6%B5%81%E8%BD%AC%28%E5%86%85%E5%AE%B9%E5%88%86%E6%9E%90%29.meta.js
// ==/UserScript==

(function () {
    "use strict";
    var new_element = document.createElement("œœœœlink");
    new_element.setAttribute("rel", "stylesheet");œ
    new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
    document.body.appendChild(new_element);
  
    const button = document.createElement("div");
    button.textContent = "内容分析";
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
          this?._url?.slice(0, 52) == "/yuntu_ng/api/v1/ContentFlowAnalysisGetReportContent"
        ) {
          target_data = JSON.parse(obj?.target?.response);
        } 
      }
    })();
  
    function appendDoc() {
      const likeComment = document.querySelector(".container-QOzF47");
      if (likeComment) {
        likeComment.append(button);
        return;
      }
      setTimeout(appendDoc, 1000);
    }
    appendDoc();
    
    function expExcel(e) {
      let data = e?.data?.materials.map(v=>{
        return {...v,trigger_points:v.trigger_points[0].label}
      })

      let contrast = {
        "内容":"material_title",
        "时长":"material_ts",
        "链接":"play_url",
        "所属触点":"trigger_points",
        "视频关键词":"item_keywords",
        "流转人数":"flow_num",
        "流转率":"flow_rate",
        "曝光量":"show_cnt",
        "完播率":"play_over_ratio",
        "互动率":"interactive_rate",
      }
  
      let option = {};
      option.fileName = "5A流转内容分析"; //文件名
      option.datas = [{
        sheetName: '',
        sheetData: data,
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
        expExcel(target_data)
      }else{
        loadingMsg = Qmsg.error("数据加载失败，请刷新页面");
      }
    }
  })();
  