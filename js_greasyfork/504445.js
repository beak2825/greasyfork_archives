// ==UserScript==
// @name         自定义内容洞察_趋势
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_biz/analysis/content/report?*
// @icon         https://www.google.com/s2/favicons?domain=oceanengine.co
// @grant        none
// @connect      *
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/504445/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%86%85%E5%AE%B9%E6%B4%9E%E5%AF%9F_%E8%B6%8B%E5%8A%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/504445/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%86%85%E5%AE%B9%E6%B4%9E%E5%AF%9F_%E8%B6%8B%E5%8A%BF.meta.js
// ==/UserScript==
(function () {
  "use strict";
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);


  let button = document.createElement("button"); //创建一个按钮
  button.textContent = "导出数据";
  Object.assign(button.style, {
    height: "34px",
    lineHeight: "34px",
    alignItems: "center",
    color: "white",
    border: "none",
    background: "linear-gradient(90deg, rgba(0, 239, 253), rgba(64, 166, 254))",
    borderRadius: "5px",
    marginLeft: "10px",
    fontSize: "13px",
    padding: "0 10px",
    cursor: "pointer",
    fontWeight: "500",
  });
  button.addEventListener("click", userXhr); //监听按钮点击事件

  function appendDoc() {
    setTimeout(() => {
      var like_comment = document.querySelector(
        ".chartHeaderContainer-ifPEN1"
      );
      if (like_comment) {
        like_comment.append(button); //把按钮加入到 x 的子节点中
        return;
      }
      appendDoc();
    }, 1000);
  }
  appendDoc();

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
        this?._url?.slice(0, 46) ==
        "/yuntu_ng/api/v1/BrandQueryReportIndexAndTrend"
      ) {
        target_data = JSON.parse(obj?.target?.response);
      }
    }
  })();

  function userXhr() {
    if (target_data) {
      loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
      getData(target_data);
    } else {
      loadingMsg = Qmsg.error("数据加载失败，请刷新页面");
    }
  }

  function getData(e){
    let data1 = e.data[1].interactive_tendency
    let data2 = e.data[1].show_tendency
    let res = data1.map((v,i)=>{
      return {
        date:v.date,
        data1:v.index_val,
        data2:data2[i].index_val
      }
    })
    expExcel(res)

  }

  function expExcel(e) {

    let contrast = {
      新增互动数: "data1",
      曝光数: "data2",
      date: "date",
    };
    let option = {};
    option.fileName = "自定义内容洞察趋势数据";
    option.datas = [
      {
        sheetName: "sheet1",
        sheetData:e,
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
})();
