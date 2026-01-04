// ==UserScript==
// @name         数据工厂_模型结果导出
// @namespace    http://tampermonkey.net/
// @version      1.9.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/data_factory/model_prediction/model/list?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/495024/%E6%95%B0%E6%8D%AE%E5%B7%A5%E5%8E%82_%E6%A8%A1%E5%9E%8B%E7%BB%93%E6%9E%9C%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/495024/%E6%95%B0%E6%8D%AE%E5%B7%A5%E5%8E%82_%E6%A8%A1%E5%9E%8B%E7%BB%93%E6%9E%9C%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  var button2 = document.createElement("button"); //创建一个按钮
  button2.textContent = "导出特征信息熵"; //按钮内容
  button2.style.height = "34px"; //高
  button2.style.lineHeight = "34px"; //行高
  button2.style.align = "center"; //文本居中
  button2.style.color = "#FFF"; //按钮文字颜色
  button2.style.background = "rgb(234,94,32)"; //按钮底色
  button2.style.border = "0px solid #eee"; //边框属性
  button2.style.borderRadius = "2px"; //按钮四个角弧度
  button2.style.marginLeft = "10px";
  button2.style.fontSize = "14px";
  button2.style.padding = "0 15px";
  button2.style.position = "absolute";
  button2.style.top = "49px";
  button2.style.right = "0px";
  button2.style.zIndex = "999";
  button2.addEventListener("click", ()=>urlClick(1)); //监听按钮点击事件

  var button = document.createElement("button"); //创建一个按钮
  button.textContent = "导出数据"; //按钮内容
  button.style.height = "34px"; //高
  button.style.lineHeight = "34px"; //行高
  button.style.align = "center"; //文本居中
  button.style.color = "#FFF"; //按钮文字颜色
  button.style.background = "rgb(234,94,32)"; //按钮底色
  button.style.border = "0px solid #eee"; //边框属性
  button.style.borderRadius = "2px"; //按钮四个角弧度
  button.style.marginLeft = "10px";
  button.style.fontSize = "14px";
  button.style.padding = "0 15px";
  button.style.position = "absolute";
  button.style.top = "0px";
  button.style.right = "0px";
  button.style.zIndex = "999";
  button.addEventListener("click", ()=>urlClick(0)); //监听按钮点击事件

  const getRequestOptions = {
    method: "GET",
    redirect: "follow",
  };

  //获取brand信息
  let brand = localStorage.getItem("__Garfish__platform__yuntu_user") || "";
  let brands = JSON.parse(brand);

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

  //message.js
  let loadingMsg = null;

  let xhrList = [];

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
      if (this?._url?.slice(0, 28) == "/data_factory/api/model/list") {
        xhrList.push(obj.target._reqHeaders);
      }
    }
  })();

  function appendDoc() {
    setTimeout(() => {
      var like_comment = document.querySelectorAll("body")[0];
      if (like_comment) {
        like_comment.append(button); //把按钮加入到 x 的子节点中
        like_comment.append(button2); //把按钮加入到 x 的子节点中
        return;
      }
      appendDoc();
    }, 1000);
  }
  appendDoc();

  function checkElement() {
    const targetElement = document.querySelector(".index__name--cRoDQ");
    if (targetElement) {
      button.style.display = "block";
      button2.style.display = "block";
    } else {
      button.style.display = "none";
      button2.style.display = "none";
    }
  }

  const intervalId = setInterval(checkElement, 1000);

  function fetchFun(url, data, requestOptions = getRequestOptions) {
    const urlData = Object.keys(data)
      .map((v) => `${v}=${data[v]}`)
      .join("&");
    return fetch(`${url}?${urlData}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        return JSON.parse(result);
      })
      .catch((error) => console.log("error", error));
  }

  async function task_list() {
    let myHeaders = new Headers();
    myHeaders.append("accept", "application/json, text/plain, */*");
    myHeaders.append("content-type", "application/json;charset=UTF-8");
    myHeaders.append("x-csrf-token", xhrList[0]["x-csrf-token"]);

    let element = document.querySelector(".index__name--cRoDQ");
    let content = element.firstChild.innerText;
    let data = {
      aadvid: getQueryVariable("aadvid"),
    };

    let raw = JSON.stringify({
      limit: "10",
      offset: "0",
      without_detail: true,
    });
    const postRequestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    let total = await fetchFun(
      "https://yuntu.oceanengine.com/data_factory/api/model/list",
      data,
      postRequestOptions
    );
    let raw1 = JSON.stringify({
      limit: total?.data?.total,
      offset: "0",
      without_detail: true,
    });
    const postRequestOptions1 = {
      method: "POST",
      headers: myHeaders,
      body: raw1,
      redirect: "follow",
    };

    let res = await fetchFun(
      "https://yuntu.oceanengine.com/data_factory/api/model/list",
      data,
      postRequestOptions1
    );

    let targetObj = res?.data?.items?.filter((v) => {
      return v.model_name === content;
    })[0];

    return targetObj;
  }

  function convertArrayToObject(arr) {
    const headers = arr[0];
    const data = arr.slice(1);
    return data.map((row) =>
      Object.fromEntries(row.map((val, i) => [headers[i], val]))
    );
  }

  function transformData(arr,Maps) {
    const result = [];

    arr.forEach((data) => {
      const transformedDataArray = [];

      data.forEach((bucketData) => {
        const {
          categories,
          feature_id,
          bucket_name,
          cluster_id,
          one_proportion,
          all_one_proportion,
          tgi,
          sort_key,
        } = {...bucketData,...Maps.get(bucketData.feature_id)};

        let transformedData = transformedDataArray.find(
          (d) => d.feature_id === feature_id && d.bucket_name === bucket_name
        );

        if (!transformedData) {
          transformedData = {
            categories,
            feature_id,
            bucket_name,
          };
          transformedDataArray.push(transformedData);
        }

        transformedData[`one_proportion_${cluster_id}`] = one_proportion;
        transformedData[`all_one_proportion_${cluster_id}`] =
          all_one_proportion;
        transformedData[`tgi_${cluster_id}`] = tgi;
        transformedData[`sort_key_${cluster_id}`] = sort_key;
      });


      result.push(transformedDataArray);
    });

    return result;
  }

  async function getData(e) {
    let elements = Array.from(document.querySelectorAll(".dfmp-tag-closable"));
    let textContents = elements.map((element) => element.textContent);
    if (!textContents.length) {
      Qmsg.error("未选择特征！");
      return;
    }
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    let targetObj = await task_list();

    let inputArray = JSON.parse(targetObj.clustering_info);

    const outputArray = convertArrayToObject(inputArray);

    let data = {
      aadvid: getQueryVariable("aadvid"),
    };
    var myHeaders = new Headers();
    myHeaders.append("authority", "yuntu.oceanengine.com");
    myHeaders.append("accept", "application/json, text/plain, */*");
    myHeaders.append("accept-language", "zh-CN,zh;q=0.9");
    myHeaders.append("content-type", "application/json;charset=UTF-8");
    myHeaders.append("x-csrf-token", xhrList[0]["x-csrf-token"]);

    const postRequestOptions = {
      method: "POST",
      headers: myHeaders,
      body: "{}",
      redirect: "follow",
    };
    let barData = await fetchFun(
      "https://yuntu.oceanengine.com/data_factory/api/model/feature/list",
      data,
      postRequestOptions
    );

    let barDataList = barData?.data?.items?.map((v) => {
      return { categories: v.categories.join("/"), feature_id: v.feature_id };
    });
    const barDataListMap = new Map(
      barDataList.map((item) => [item.categories, item])
    );

    let target = []
    textContents?.forEach((v) => {
        if (barDataListMap.get(v)) {
            target.push(barDataListMap.get(v))
        }
    });

    if (e) {
        expExcel2(target)
        return
    }

    let filtrationData = target.map((v) => {
      return outputArray.filter((t) => {
        return v?.feature_id === t?.feature_id;
      });
    });

    const barDataMap = new Map(
      barDataList.map((item) => [item.feature_id, item])
    );

    let transformData_target = transformData(filtrationData, barDataMap);
    expExcel(transformData_target);
  }

  function expExcel(transformData_target) {
    let title = document.getElementsByClassName("dfmp-table-th-title");
    let titleArr = Array.from(title);
    let contrasts = {};

    titleArr
      .filter((v, i) => {
        return i >= 10;
      })
      .map((v, i) => {
        contrasts[v.textContent + "占比"] = `one_proportion_${i}`;
        contrasts[v.textContent + "TGI"] = `tgi_${i}`;
      });
    let contrast = {
      特征: "categories",
      特征值: "bucket_name",
      ...contrasts,
    };
    let fileName = `聚类模型数据`;

    setTimeout(() => {
      let option = {};
      option.fileName = fileName; //文件名
      option.datas = transformData_target.map((v, i) => {
        return {
          sheetName: '',
          // sheetName: sheetName[i],
          sheetData: v.map((item) => {
            return item;
          }),
          sheetHeader: Object.keys(contrast),
          sheetFilter: Object.values(contrast),
          columnWidths: [], // 列宽
        };
      });

      var toExcel = new ExportJsonExcel(option);
      toExcel.saveExcel();
      setTimeout(() => {
        loadingMsg.close();
      }, 1000);
    }, 1000);
  }

  function expExcel2(e) {
    let contrast = {
      特征: "categories",
      特征ID: "feature_id",
    };
    let fileName = `特征信息熵`;
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

  function urlClick(e) {
    getData(e);
  }
})();
