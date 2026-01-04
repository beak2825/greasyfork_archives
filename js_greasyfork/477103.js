// ==UserScript==
// @name         SPU5A流转_品品人群分析
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/assets/commodity/flow?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        GM.xmlHttpRequest
// @license      MIT
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/477103/SPU5A%E6%B5%81%E8%BD%AC_%E5%93%81%E5%93%81%E4%BA%BA%E7%BE%A4%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/477103/SPU5A%E6%B5%81%E8%BD%AC_%E5%93%81%E5%93%81%E4%BA%BA%E7%BE%A4%E5%88%86%E6%9E%90.meta.js
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
    const likeComment = document.querySelector(
      ".container-S_uvmt"
    );
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
        this?._url?.slice(0, 57) ==
        "/yuntu_ng/api/v1/GetSpuAudienceAssetFlowAnalysisBeyondSpu"
      ) {
        target_data = obj?.target?._url;
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

  const getRequestOptions = {
    method: "GET",
    redirect: "follow",
  };

  async function fetchFun(url, data, requestOptions = getRequestOptions) {
    const params = new URLSearchParams(data).toString();
    try {
      const response = await fetch(`${url}?${params}`, requestOptions);
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        throw new Error(`Fetch failed: ${response.status}`);
      }
    } catch (error) {
      loadingMsg.close();
      Qmsg.error({
        content: `网络请求错误: ${error.message}`,
        timeout: 5000,
      });
      throw error;
    }
  }

  const parseUrl = (url) => {
    const [path, queryString] = url.split("?");
    const argument = Object.fromEntries(new URLSearchParams(queryString));

    return {
      url: path,
      argument,
    };
  };

  async function getData(e) {
    const { url, argument } = parseUrl(e);
    let raw = [1, 2];
    let resData = await Promise.all(
      raw.map(async (v) => {
        let res = await fetchFun(url, { ...argument, beyond_spu_type: v });
        return res;
      })
    );
    let data = resData.map(v=>{
      return [v.data.flow_zhongcao_detail_list,v.data.flow_purchase_detail_list]
    }).flat()
    expExcel(data);
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
      商品名称: "spu_name",
      ID: "spu_id",
      分类1: "first_category_name",
      分类2: "second_category_name",
      分类3: "third_category_name",
      被其他品种草人群规模: "flow_cover_num",
      占比其他品种草人群: "flow_cover_num_rate",
    };

    let contrast2 = {
      商品名称: "spu_name",
      ID: "spu_id",
      分类1: "first_category_name",
      分类2: "second_category_name",
      分类3: "third_category_name",
      品牌: "brand_name",
      被同类目其他品种草人群规模: "flow_cover_num",
    };

    let option = {};
    option.fileName = `SPU5A流转_品品人群分析`; //文件名
    option.datas = e.map((v, i) => {
      if (i < 2) {
        return {
          sheetName: `sheet${2*i}`,
          sheetData: v,
          sheetHeader: Object.keys(contrast),
          sheetFilter: Object.values(contrast),
          columnWidths: [], // 列宽
        };
      }else{
        return {
          sheetName: `sheet${2*i-1}`,
          sheetData: v,
          sheetHeader: Object.keys(contrast2),
          sheetFilter: Object.values(contrast2),
          columnWidths: [], // 列宽
        };
      }
      
    });
    submitData(option)
  }

  function urlClick() {
    if (target_data) {
      loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
      getData(target_data);
    } else {
      loadingMsg = Qmsg.error("数据加载失败，请先切换到‘品品人群分析’");
    }
  }
})();
