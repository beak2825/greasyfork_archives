// ==UserScript==
// @name         SPU5A人群画像
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/assets/commodity/distribution?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        GM.xmlHttpRequest
// @license      MIT
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/473777/SPU5A%E4%BA%BA%E7%BE%A4%E7%94%BB%E5%83%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/473777/SPU5A%E4%BA%BA%E7%BE%A4%E7%94%BB%E5%83%8F.meta.js
// ==/UserScript==

(function () {
  "use strict"; 
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  const button = document.createElement("div");
  button.textContent = "导出画像";
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
    const likeComment = document.querySelector(".container-cPjE_3");
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
        this?._url?.slice(0, 44) == "/yuntu_ng/api/v1/GetSpuAudienceAssetPortrait"
      ) {
        target_data = JSON.parse(obj?.target?.response);
      }
    }
  })();

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
   //获取aadvid
   const aadvid = getQueryVariable("aadvid");


  function processData(a) {
    let b = [];
    for (let i = 0; i < a.length; i++) {
      let category = a[i];
      for (let j = 0; j < category.label_list.length; j++) {
        let label = category.label_list[j];
        let data = {
          feature_version: category.feature_version,
          name_en: category.name_en,
          name_zh: category.name_zh,
          name_zh_label: label.name_zh,
          label_id: label.label_id,
          value: label.value,
          tgi: label.tgi,
          label_all_cnt: label.label_all_cnt,
          effective_percentage: category.effective_percentage,
          can_pack: category.can_pack
        };
        b.push(data);
      }
    }
    return b;
  }

  async function getData(e) {
    const competitor_data = e.data.competitor_data //对比品牌
    const self_data = e.data.self_data //本品
    let competitor = processData(competitor_data)
    let self = processData(self_data)
    expExcel([self,competitor])
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

    let contrast = {
      name: "name_zh",
      name_label: "name_zh_label",
      占比:"value",
      tgi: "tgi",
    };

    let option = {};
    option.fileName = `SPU5A人群画像`; //文件名
    option.datas = e.map((v,i)=>{
      return {
        sheetName: i ? '对比品牌':'本品',
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
      getData(target_data);
    } else {
      loadingMsg = Qmsg.error("数据加载失败，请重试");
    }
  }
})();