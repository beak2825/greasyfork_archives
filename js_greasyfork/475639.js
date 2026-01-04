// ==UserScript==
// @name         飞瓜_带货直播库
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  飞瓜扩展工具
// @author       siji-Xian
// @match        *://dy.feigua.cn/app*
// @icon         https://www.google.com/s2/favicons?domain=oceanengine.com
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/475639/%E9%A3%9E%E7%93%9C_%E5%B8%A6%E8%B4%A7%E7%9B%B4%E6%92%AD%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/475639/%E9%A3%9E%E7%93%9C_%E5%B8%A6%E8%B4%A7%E7%9B%B4%E6%92%AD%E5%BA%93.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let URL = "https://dy.feigua.cn/app/#/live-room-search/index?";
  if (location.href.startsWith(URL)) {
    
    var new_element = document.createElement("link");
    new_element.setAttribute("rel", "stylesheet");
    new_element.setAttribute(
      "href",
      "https://qmsg.refrain.xyz/message.min.css"
    );
    document.body.appendChild(new_element);

    const button = document.createElement("div");
    button.textContent = "导出数据";
    Object.assign(button.style, {
      height: "34px",
      lineHeight: "var(--line-height, 34px)",
      alignItems: "center",
      color: "white",
      background:
        "linear-gradient(90deg, rgba(0, 239, 253), rgba(64, 166, 254))",
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
    let target_data = [];

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
          this?.requestUrl?.slice(0, 20) ==
          "/api/v3/livelib/list"
        ) {
          let data = JSON.parse(obj?.target?.response)
          target_data.push(data.Data.Items)
        }
      }
    })();

    function appendDoc() {
      const likeComment = document.querySelector(".flex.align-center.flex-shrink");
      if (likeComment) {
        likeComment.append(button);
        return;
      }
      setTimeout(appendDoc, 1000);
    }
    appendDoc();

    function expExcel(e) {

      let data = e.flat()
      let expData = data.map(v=>{
        return {
          ...v,...v.BaseLiveDto,...v.BaseBloggerDto
        }
      })
      let contrast = {
        "直播间":"Title", 
        "日期":"LiveBeginTime", 
        "达人":"BloggerName", 
        "直播销售额":"LiveSaleGmvStr", 
        "直播销量": "LiveSaleCountStr",
        "人气峰值":"UserCountStr", 
        "平均在线":"AvgUserCountStr", 
        "观看人次":"TotalUserCountStr", 
        "客单价":"AvgKdjStr", 
        "UV价值":"AvgUserSaleStr"
      };

      let option = {};
      option.fileName = "飞瓜带货直播库"; //文件名
      option.datas = [
        {
          sheetName: "",
          sheetData: expData,
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
  }
})();
