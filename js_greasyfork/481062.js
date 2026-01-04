// ==UserScript==
// @name         品牌搜索(搜前引流分析)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/search/brand?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/481062/%E5%93%81%E7%89%8C%E6%90%9C%E7%B4%A2%28%E6%90%9C%E5%89%8D%E5%BC%95%E6%B5%81%E5%88%86%E6%9E%90%29.user.js
// @updateURL https://update.greasyfork.org/scripts/481062/%E5%93%81%E7%89%8C%E6%90%9C%E7%B4%A2%28%E6%90%9C%E5%89%8D%E5%BC%95%E6%B5%81%E5%88%86%E6%9E%90%29.meta.js
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
    background: "linear-gradient(60deg, rgb(95, 240, 225), rgb(47, 132, 254))",
    borderRadius: "5px",
    marginLeft: "10px",
    fontSize: "13px",
    padding: "0 10px",
    cursor: "pointer",
    fontWeight: "500",
  });
  button.addEventListener("click", urlClick); //监听按钮点击事件

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
        this?._url?.slice(0,51) ==
        "/search_node/api/search/brand/search_before/content"
      ) {
        target_data = JSON.parse(obj?.target?.response);
      }
    }
  })();

  //message.js
  let loadingMsg = null;

  function appendDoc() {
    const likeComment = document.querySelectorAll(
      ".FlowAnalysis__TitleContainer-eqYwYB.bWTvUL"
    )[0];
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  function processData(data) {
    let result = [];

    for (let i = 0; i < data.length; i++) {
        let item = data[i];

        // 处理主要信息
        let mainInfo = {
            rank: i + 1,
            content: item.contentTitle,
            id: item.contentId,
            video: item.contentUrl,
            source: '全部',
            searchKeys1: item.searchKeywords[0]?.keyword,
            searchKeys1Count: item.searchKeywords[0]?.searchCnt,
            searchKeys2: item.searchKeywords[1]?.keyword,
            searchKeys2Count: item.searchKeywords[1]?.searchCnt,
            searchKeys3: item.searchKeywords[2]?.keyword,
            searchKeys3Count: item.searchKeywords[2]?.searchCnt,
            authorName: item.authorName,
            authorType: item.authorType,
            videoCount: item.showCnt,
            searchCnt: item.searchCnt,
            searchRate: item.searchRate,
            searchUv: item.searchUv,
            totalAmount: item.totalAmount,
            orderUv: item.orderUv
        };

        result.push(mainInfo);

        // 处理子详情信息
        let subDetails = item.subDetails;
        for (let j = 0; j < subDetails.length; j++) {
            let subItem = subDetails[j];

            let subInfo = {
                rank: i + 1,
                source: subItem.source,
                searchKeys1: subItem.searchKeywords[0]?.keyword,
                searchKeys1Count: subItem.searchKeywords[0]?.searchCnt,
                searchKeys2: subItem.searchKeywords.length > 1 ? subItem.searchKeywords[1]?.keyword : '-',
                searchKeys2Count: subItem.searchKeywords.length > 1 ? subItem.searchKeywords[1]?.searchCnt : '-',
                searchKeys3: subItem.searchKeywords.length > 2 ? subItem.searchKeywords[2]?.keyword : '-',
                searchKeys3Count: subItem.searchKeywords.length > 2 ? subItem.searchKeywords[2]?.searchCnt : '-',
                videoCount: subItem.showCnt,
                searchRate: subItem.searchRate,
                searchUv: subItem.searchUv,
                totalAmount: subItem.totalAmount,
                orderUv: subItem.orderUv
            };

            result.push(subInfo);
        }
    }

    return result;
}

  async function getData(e) {
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    let res = e.data
    //处理数据
    let data = processData(res)
    
    expExcel(data);
  }

  function expExcel(e) {
    let contrast = {
      排名: "rank",
      内容: "content",
      视频ID: "id",
      视频资源: "video",	
      看后搜点位:"source",
      "核心搜索词1": "searchKeys1",	
      "核心搜索次数1": "searchKeys1Count",	
      "核心搜索词2": "searchKeys2",
      "核心搜索次数2": "searchKeys2Count",
      "核心搜索词3": "searchKeys3",	
      "核心搜索次数3": "searchKeys3Count",	
      作者: "authorName",
      类型: "authorType",
      视频曝光次数: "videoCount",
      看后搜索次数:"searchCnt",
      看后搜索率:'searchRate',
      看后搜索人数:'searchUv',	
      看后搜成交人数:'totalAmount',
      看后搜成交金额:'orderUv'
    };
    let fileName = `品牌搜索(搜前引流分析)`;
    let option = {};
    option.fileName = fileName; //文件名
    option.datas = [{
      sheetName: "",
      sheetData: e,
      sheetHeader: Object.keys(contrast),
      sheetFilter: Object.values(contrast),
      columnWidths: [], // 列宽
    }]

    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    setTimeout(() => {
      loadingMsg.close();
    }, 1000);
  }

  function urlClick() {
    if (target_data) {
      getData(target_data);
    } else {
      loadingMsg = Qmsg.error("数据加载失败，请重试");
    }
  }
})();
