// ==UserScript==
// @name         数据工厂_标签工厂_人群标签
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/data_factory/tag_factory/tag_manage?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/494621/%E6%95%B0%E6%8D%AE%E5%B7%A5%E5%8E%82_%E6%A0%87%E7%AD%BE%E5%B7%A5%E5%8E%82_%E4%BA%BA%E7%BE%A4%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/494621/%E6%95%B0%E6%8D%AE%E5%B7%A5%E5%8E%82_%E6%A0%87%E7%AD%BE%E5%B7%A5%E5%8E%82_%E4%BA%BA%E7%BE%A4%E6%A0%87%E7%AD%BE.meta.js
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
    marginLeft: "10px",
    fontSize: "13px",
    padding: "0 10px",
    cursor: "pointer",
    fontWeight: "500",
  });
  button.addEventListener("click", urlClick);

  let fetchData = null;
  let keyWords = null;
  let listUrl = null;
  let getKeyWordUrl = null;

  window.au_fetch = window.fetch;
  window.fetch = async (...args) => {
    let [resource, config] = args;
    // request interceptor here
    const response = await window.au_fetch(resource, config);
    if (
      response.url.slice(0, 81) ==
      "https://yuntu.oceanengine.com/tag_factory_node/api/graphql/?op=getAudienceTagList"
    ) {
      listUrl = args[0];
      fetchData = JSON.parse(args[1].body);
    }
    if (
      response.url.slice(0, 83) ==
      "https://yuntu.oceanengine.com/tag_factory_node/api/graphql/?op=getAudienceTagDetail"
    ) {
      console.log(args);
      getKeyWordUrl = args[0];
      keyWords = JSON.parse(args[1].body);
    }
    return response;
  };

  //message.js
  let loadingMsg = null;

  function appendDoc() {
    const likeComment = document.querySelector(
      ".AudienceTagManage__OperationContainer-ekOkoV.iWHsQl"
    );
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  async function getData(e) {
    return new Promise((resolve, reject) => {
      let limit = document.querySelector(".tagFactory-pager-record").innerHTML;
      const regex = /\d+/;
      const result = limit.match(regex)[0];

      e.variables.getAudienceTagListArgs.limit = +result;

      let body = JSON.stringify(e);
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          let _this = JSON.parse(this.responseText);
          resolve(_this); // 将获取到的数据传递给resolve方法
        }
      });

      xhr.open("POST", listUrl);
      xhr.setRequestHeader("authority", "yuntu.oceanengine.com");
      xhr.setRequestHeader("accept", "*/*");
      xhr.setRequestHeader("accept-language", "zh-CN,zh;q=0.9");
      xhr.setRequestHeader("content-type", "application/json");

      xhr.send(body);
    });
  }

  async function getKeyWord(e) {
    return new Promise((resolve, reject) => {
      let data = keyWords;
      data.variables.id = e;
      let body = JSON.stringify(data);
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          if (this.status >= 200 && this.status < 300) {
            let _this = JSON.parse(this.responseText);
            resolve(_this); // 将获取到的数据传递给 resolve 方法
          } else {
            reject(new Error("请求失败")); // 请求失败时，使用 reject 方法抛出错误
          }
        }
      });

      // 添加错误处理逻辑
      xhr.onerror = function () {
        reject(new Error("请求发生错误")); // 请求发生错误时，使用 reject 方法抛出错误
      };

      xhr.open("POST", getKeyWordUrl);
      xhr.setRequestHeader("authority", "yuntu.oceanengine.com");
      xhr.setRequestHeader("accept", "*/*");
      xhr.setRequestHeader("accept-language", "zh-CN,zh;q=0.9");
      xhr.setRequestHeader("content-type", "application/json");

      xhr.send(body);
    });
  }

  function expExcel(e) {
    let data = e?.map((v) => {
      return {
        ...v,
        dataSource:
          v.dataSource === "item"
            ? "内容人群标签"
            : v.dataSource === "query"
            ? "搜索人群标签"
            : "商品人群标签",
            coverNumByApp: v.coverNumByApp.aweme || 0,
      };
    });

    let contrast = {
      标签名称: "name",
      标签ID: "id",
      标签类型: "dataSource",
      创建人: "creatorDisplayName",
      标签有效期: "validDay",
      行为时间起始: "dateStart",
      行为时间截止: "dateEnd",
      关键词: "wordRule",
      预估覆盖人数: "coverNumByApp",
    };
    let fileName = "数据工厂_标签工厂_人群标签";

    let option = {};
    option.fileName = fileName; //文件名
    option.datas = [
      {
        sheetName: "",
        sheetData: data,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      },
    ];
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    setTimeout(() => {
      loadingMsg.close();
    }, 1000);
  }

  function urlClick() {
    if (!keyWords) {
      Qmsg.error("请先点击任意一个标签的详情后再点击导出。");
      return;
    }
    if (fetchData) {
      loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
      getData(fetchData).then(async (res) => {
        let expData = [];
        await Promise.all(
          res.data.res.tags.map(async (v) => {
            let data;
            try {
              data = await getKeyWord(v.id);
            } catch (error) {
              // 处理接口报错情况
              console.error("接口请求错误，进行重新请求:", error);
              // 进行重新请求
              try {
                data = await getKeyWord(v.id);
              } catch (error) {
                console.error("重新请求仍然发生错误:", error);
                return; // 结束当前迭代，相当于 continue
              }
            }
  
            if (v.dataSource !== "product") {
              const str = data?.data?.detail?.data?.wordRule;
              const regex = /[\u4e00-\u9fa5a-zA-Z]+|\&|\~/g; // 匹配中文字符、英文字母和 &
              const result = str.match(regex);
              expData.push({
                wordRule: result,
                dateStart: data?.data?.detail?.data?.dateStart,
                dateEnd: data?.data?.detail?.data?.dateEnd,
                ...v,
              });
            } else {
              expData.push({
                dateStart: data?.data?.detail?.data?.dateStart,
                dateEnd: data?.data?.detail?.data?.dateEnd,
                ...v,
              });
            }
          })
        );
        expExcel(expData);
      });
    } else {
      loadingMsg = Qmsg.error("数据加载失败，请重试");
    }
  }
  //需求不明
})();
