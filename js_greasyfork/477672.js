// ==UserScript==
// @name         品牌形象洞察_美誉度
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/image/insight/brand?indicator=2*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/477672/%E5%93%81%E7%89%8C%E5%BD%A2%E8%B1%A1%E6%B4%9E%E5%AF%9F_%E7%BE%8E%E8%AA%89%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/477672/%E5%93%81%E7%89%8C%E5%BD%A2%E8%B1%A1%E6%B4%9E%E5%AF%9F_%E7%BE%8E%E8%AA%89%E5%BA%A6.meta.js
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
      if (
        this?._url?.slice(0, 41) ==
        "/measurement/api/v2/image/get_nsr_insight"
      ) {
        target_data = JSON.parse(obj?.target?.response);
      }
    }
  })();

  function appendDoc() {
    const likeComment = document.querySelector(".brand-image-tab-bar-extra");
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  function expExcel(e) {
    let data = [
      {
        sheetName:"品牌话题分析",
        sheetData:e.data.nsr_insight.topic_analysis,
        contrast :{
          "topic_name": "话题名称",
          "nsr": "原声净情感度（NSR）",
          "period_on_period": "环比",
          "positive_cnt": "正向量级",
          "negative_cnt": "负向量级",
          "positive_rate": "正向占比",
          "negative_rate": "负向占比"
        }
      },
      {
        sheetName:"品牌形象分析",
        sheetData:e.data.nsr_insight.tag_list,
        contrast :{
          "tag_name": "标签名称",
          "nsr": "标签净情感度（NSR）",
          "period_on_period": "环比",
          "positive_cnt": "正向量级",
          "negative_cnt": "负向量级",
          "positive_rate": "正向占比",
          "negative_rate": "负向占比"
        }
      },
      {
        sheetName:"商品评论分析",
        sheetData:e.data.nsr_insight.product_analysis,
        contrast :{
          "product_name": "商品名称",
          "product_id": "商品ID",
          "nsr": "评论净情感度（NSR）",
          "period_on_period": "环比",
          "positive_cnt": "正向量级",
          "negative_cnt": "负向量级",
          "positive_rate": "正向占比",
          "negative_rate": "负向占比"
        }
      },
      {
        sheetName:"营销内容评论分析",
        sheetData:e.data.nsr_insight.marketing_analysis,
        contrast :{
          "marketing_item_title": "营销内容标题",
          "item_id":"视频ID",
          "nsr": "评论净情感度（NSR）",
          "period_on_period": "环比",
          "positive_cnt": "正向量级",
          "negative_cnt": "负向量级",
          "positive_rate": "正向占比",
          "negative_rate": "负向占比"
        }
      }
    ]

    let option = {};
    option.fileName = "品牌形象洞察_美誉度"; //文件名
    option.datas = data.map((v,i)=>{
      return {
        sheetName: v.sheetName,
        sheetData: v.sheetData,
        sheetHeader: Object.values(v.contrast),
        sheetFilter: Object.keys(v.contrast),
        columnWidths: [], // 列宽
      }
    })
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
