// ==UserScript==
// @name         SPU5A人群资产重叠分析
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/assets/commodity/related?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        GM.xmlHttpRequest
// @license      MIT
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/492308/SPU5A%E4%BA%BA%E7%BE%A4%E8%B5%84%E4%BA%A7%E9%87%8D%E5%8F%A0%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/492308/SPU5A%E4%BA%BA%E7%BE%A4%E8%B5%84%E4%BA%A7%E9%87%8D%E5%8F%A0%E5%88%86%E6%9E%90.meta.js
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
  let list_data = null;

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
        "/yuntu_ng/api/v1/GetSpuAudienceAssetOverlapSpu"
      ) {
        target_data = JSON.parse(obj?.target?.response);
      }
      if (
        this?._url?.slice(0, 51) ==
        "/yuntu_ng/api/v1/GetSpuAudienceAssetOverlapBrandSpu"
      ) {
        list_data = JSON.parse(obj?.target?.response);
      }
    }
  })();

  function appendDoc() {
    const likeComment = document.querySelector(".header-WBrkam");
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  }

  function transformData(inputData) {
    const outputData = [[], [], []];
  
    const xValues = Array.from(new Set(inputData.map(entry => entry.x)));
    const yValues = Array.from(new Set(inputData.map(entry => entry.y)));
  
    xValues.forEach(x => {
      const numObj = {};
      const rateObj = {};
      const compareRateObj = {};
  
      yValues.forEach(y => {
        const numEntry = inputData.find(entry => entry.x === x && entry.y === y);
        if (numEntry) {
          numObj[y] = numEntry.xy_overlap_cover_num;
          rateObj[y] = numEntry.xy_overlap_rate;
          compareRateObj[y] = numEntry.xy_compare_overlap_rate;
        } else {
          numObj[y] = "";
          rateObj[y] = "";
          compareRateObj[y] = "";
        }
      });
  
      outputData[0].push(numObj);
      outputData[1].push(rateObj);
      outputData[2].push(compareRateObj);
    });
  
    return outputData;
  }

  //提交数据到服务器
  function submitData(option) {
    //从localStorage获取statBaseUrl
    let statBaseUrl = localStorage.getItem("statBaseUrl");
    if (!statBaseUrl) {
      Qmsg.error("statBaseUrl获取失败，请联系管理员！");
      loadingMsg.close();
      return;
    }
    //获取当前脚本名称
    const scriptName = GM_info.script.name;
    //使用GM.xmlHttpRequest将数据提交到后端服务器
    GM.xmlHttpRequest({
      method: "POST",
      url: statBaseUrl,
      data: JSON.stringify({
        ...option,
        plugins_name: scriptName,
        advertiser_id: getQueryVariable("aadvid"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
      onload: function (response) {
        let res = JSON.parse(response.responseText);
        if (res.code == "990") {
          Qmsg.success("数据已上传");
          var toExcel = new ExportJsonExcel(option);
          toExcel.saveExcel();
          setTimeout(() => {
            loadingMsg.close();
          }, 1000);
        } else {
          loadingMsg.close();
          Qmsg.error("数据上传失败，请联系管理员！");
        }
      },
      onerror: function (response) {
        Qmsg.error("数据上传失败，请联系管理员！");
        loadingMsg.close();
      },
    });
  }

  

  function expExcel(e) {
    let data = transformData(e.data.heat_map_list)
    let contrast = {
      "SUP2-A1_SPU1-A1": "SPU2-A1",
      "SUP2-A2_SPU1-A1": "SPU2-A2",
      "SUP2-A3_SPU1-A1": "SPU2-A3",
      "SUP2-A4_SPU1-A1": "SPU2-A4",
      "SUP2-A5_SPU1-A1": "SPU2-A5",
    };

    let option = {};
    option.fileName = "SPU5A_指定SPU的人群资产重叠分布"; //文件名
    option.datas = data.map((v,i)=>{
      return {
        sheetName: i == 0 ? '重叠人数':i == 1 ? '占SPU2比重':'占SPU1比重' ,
        sheetData: v,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      }
    })
    submitData(option);
  }

  function urlClick() {
    if (target_data) {
      loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
      expExcel(target_data);
    } else {
      loadingMsg = Qmsg.error("数据加载失败，请重试");
    }
  }


  //本品牌SPU间的人群资产重叠情况
  const button1 = document.createElement("div");
  button1.textContent = "导出数据";
  Object.assign(button1.style, {
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
  button1.addEventListener("click", urlClick1);

  function appendDoc1() {
    const likeComment = document.querySelector(".index__extra--mzYeh");
    if (likeComment) {
      likeComment.append(button1);
      return;
    }
    setTimeout(appendDoc1, 1000);
  }
  appendDoc1();

  function expExcel1(e) {
    let contrast = {
      "商品名称": "spu_name",
      "商品ID": "spu_id",
      "分类1": "first_category_name",
      "分类2": "second_category_name",
      "分类1": "first_category_name",
      "分类3": "third_category_name",
      "重叠规模": "overlap_cover_num",
      "重叠比重": "overlap_rate",
    };

    let option = {};
    option.fileName = "本品牌SPU间的人群资产重叠情况"; //文件名
    option.datas = [{
      sheetName: '' ,
      sheetData: e.data.spu_overlap_info_list,
      sheetHeader: Object.keys(contrast),
      sheetFilter: Object.values(contrast),
      columnWidths: [], // 列宽
    }] ;
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    loadingMsg.close();
  }

  function urlClick1() {
    if (list_data) {
      loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
      expExcel1(list_data);
    } else {
      loadingMsg = Qmsg.error("数据加载失败，请重试");
    }
  }
})();
