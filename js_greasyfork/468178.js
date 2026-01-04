// ==UserScript==
// @name         营销概览_达人组合分析
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/strategy/medium/talent_markting/talentMarix?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        GM.xmlHttpRequest
// @license      MIT
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/468178/%E8%90%A5%E9%94%80%E6%A6%82%E8%A7%88_%E8%BE%BE%E4%BA%BA%E7%BB%84%E5%90%88%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/468178/%E8%90%A5%E9%94%80%E6%A6%82%E8%A7%88_%E8%BE%BE%E4%BA%BA%E7%BB%84%E5%90%88%E5%88%86%E6%9E%90.meta.js
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

  function appendDoc() {
    const likeComment = document.querySelector(".container-hhTwgX");
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  //message.js
  let loadingMsg = null;

  //目标数据
  let target_data = null;
  
  //query参数获取
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
        this?._url?.slice(0, 41) == "/yuntu_ng/api/v1/TalentMktingDistribution"
      ) {
        target_data = JSON.parse(obj?.target?.response);
      }
    }
  })();

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
    const MapArr = new Map(e.data.group_list.map((item) => [item.name, item]));

    const keys = ["1000w+", "500-1000w", "100-500w", "10-100w", "0-10w"];
    const data = keys
      .map((v) => {
        return MapArr.get(v);
      })
      .map((v) => {
        // return { ...v, ...v.index_map };
        return { ...v };
      });

    let contrast = {
      name: "name",
      本品牌左侧指标: "left_value",
      本品牌右侧指标占比: "right_ratio",
      对比品牌左侧指标: "competitor_left_value",
      对比品牌右侧指标占比: "competitor_right_ratio",
      CPM均值: "10004",
      CPE均值: "10006",
    };

    let option = {};
    option.fileName = `达人组合分析`; //文件名
    option.datas = [
      {
        sheetName: "sheet1",
        sheetData: data,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      },
    ];

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
})();
