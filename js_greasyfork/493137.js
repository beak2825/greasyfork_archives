// ==UserScript==
// @name         商品_价位段Top商品
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/product/segmentedMarketDetail/marketProduct?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/493137/%E5%95%86%E5%93%81_%E4%BB%B7%E4%BD%8D%E6%AE%B5Top%E5%95%86%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/493137/%E5%95%86%E5%93%81_%E4%BB%B7%E4%BD%8D%E6%AE%B5Top%E5%95%86%E5%93%81.meta.js
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
    color: "#FFF",
    background: "linear-gradient(60deg, rgb(95, 240, 225), rgb(47, 132, 254))",
    borderRadius: "5px",
    margin: "0 10px",
    fontSize: "13px",
    padding: "0 10px",
    cursor: "pointer",
    fontWeight: "500",
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: "999"
  });
  button.addEventListener("click", urlClick);

  const getRequestOptions = {
    method: "GET",
    redirect: "follow",
  };


  //message.js
  let loadingMsg = null;

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
      if (this?._url?.slice(0, 49) == "/product_node/v2/api/industry/insightProductStats") {
        target_data = JSON.parse(obj?.target?.response);
      }
    }
  })();

  function appendDoc() {
    setTimeout(() => {
      var like_comment = document.querySelectorAll("body")[0];
      if (like_comment) {
        like_comment.append(button); //把按钮加入到 x 的子节点中
        return;
      }
      appendDoc();
    }, 1000);
  }
  appendDoc();

  function checkElement() {
    const targetElement = document.querySelector(".DrawerCloseBtn__CloseBtn-ciPfX.CLSfX");
    if (targetElement) {
      button.style.display = "block";
    } else {
      button.style.display = "none";
    }
  }

  const intervalId = setInterval(checkElement, 1000);

  function getData(e){
    let data = e.data.list.map(v=>{
        return {
            '商品名称':v.product.name,
            'ID':v.product.id,
            '销售金额':v.data.salesAmount.value,
            '销售量':v.data.salesVolune.value,
            '购买人数':v.data.purchaseUidCnt.value,
        }
    })

    expExcel(data)
  }

  function expExcel(data) {
    let title = document.querySelector(".DrillingChartDrawerContainer__SubTitle-kuqyDX.bvhnkz").innerHTML;
   
    let contrast = {
      '商品名称': '商品名称',
      'ID': 'ID',
      '销售金额': '销售金额',
      '销售量': '销售量',
      '购买人数': '购买人数'
    };

    let fileName = title;

    setTimeout(() => {
      let option = {};
      option.fileName = fileName; //文件名
      option.datas =[{
          sheetName: "",
          sheetData: data,
          sheetHeader: Object.keys(contrast),
          sheetFilter: Object.values(contrast),
          columnWidths: [], // 列宽
        }];
      var toExcel = new ExportJsonExcel(option);
      toExcel.saveExcel();
      setTimeout(() => {
        loadingMsg.close();
      }, 1000);
    }, 1000);
  }

  function urlClick() {
    if (target_data) {
        loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
        getData(target_data);
      } else {
        loadingMsg = Qmsg.error("数据加载失败，请重试");
      }
  }
})();
