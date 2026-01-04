// ==UserScript==
// @name         自定义人群_品牌触点分布
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/analysis/audience/report_portrait?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        GM.xmlHttpRequest
// @license      MIT
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/499565/%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BA%BA%E7%BE%A4_%E5%93%81%E7%89%8C%E8%A7%A6%E7%82%B9%E5%88%86%E5%B8%83.user.js
// @updateURL https://update.greasyfork.org/scripts/499565/%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BA%BA%E7%BE%A4_%E5%93%81%E7%89%8C%E8%A7%A6%E7%82%B9%E5%88%86%E5%B8%83.meta.js
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
        this?._url?.slice(0, 43) ==
        "/yuntu_ng/api/v1/get_trigger_point_analysis"
      ) {
        target_data = JSON.parse(obj?.target?.response);
      }
    }
  })();

  function appendDoc() {
    const likeComment = document.querySelector(".tabSection-AhS8C9");
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();


  //数据处理
  function flattenObject(obj, prefix = '') {
    var result = [];
  
    if (prefix !== '') {
      prefix += '_';
    }
  
    var item = {
        name_zh: prefix + obj.name_zh,
        value: obj.value
    };
  
    result.push(item);
  
    if (obj.children) {
      obj.children.forEach(function(child) {
        if (child.children && child.children.length > 0) {
          result.push(...flattenObject(child, item.name_zh));
        } else {
          var childItem = {
            name_zh: item.name_zh + '_' + child.name_zh,
            value: child.value
          };
          result.push(childItem);
        }
      });
    }
  
    return result;
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
    let data = e.data.distribution.map((v) => {
      return flattenObject(JSON.parse(v));
    });
    let expData = data.flat()

    let contrast = {
      name: "name_zh",
      value: "value"
    };

    let option = {};
    option.fileName = "品牌触点分布"; //文件名
    option.datas = [
      {
        sheetName: "sheet1",
        sheetData: expData,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      }
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
