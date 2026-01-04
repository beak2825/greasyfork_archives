// ==UserScript==
// @name         5A关系资产(用户趋势)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/assets/crowd/distribution?*
// @grant        none
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/463728-lodash-js/code/lodashjs.js?version=1174104
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/481569/5A%E5%85%B3%E7%B3%BB%E8%B5%84%E4%BA%A7%28%E7%94%A8%E6%88%B7%E8%B6%8B%E5%8A%BF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/481569/5A%E5%85%B3%E7%B3%BB%E8%B5%84%E4%BA%A7%28%E7%94%A8%E6%88%B7%E8%B6%8B%E5%8A%BF%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  const button = document.createElement("div");
  button.textContent = "用户趋势";
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
        this?._url?.slice(0, 41) ==
        "/yuntu_ng/api/v1/get_audience_asset_trend"
      ) {
        target_data = JSON.parse(obj?.target?.response);
      }
    }
  })();


  function appendDoc() {
    setTimeout(() => {
      var like_comment = document.querySelector(
        ".header-BBQ8Fc"
      );
      if (like_comment) {
        like_comment.append(button); //把按钮加入到 x 的子节点中
        return;
      }
      appendDoc();
    }, 1000);
  }
  appendDoc();

  function expExcel(e) {
    let data = e?.data?.trend_points
    let contrast = {
      "日期":"date",
      "本品牌总资产":"cover_num",
      "本品牌日新增":"day_added",
      "本品牌日流失":"day_loss",
      "对比品牌总资产":"count_average",
      "对比品牌日新增":"day_added_compare",
      "对比品牌日流失":"day_loss_compare",
    }

    let option = {};
    option.fileName = "5A关系资产(用户趋势)"; //文件名
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

  async function urlClick() {
    if (target_data) {
      loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
      expExcel(target_data)
    }else{
      loadingMsg = Qmsg.error("数据加载失败，请刷新页面");
    }
  }

})();
