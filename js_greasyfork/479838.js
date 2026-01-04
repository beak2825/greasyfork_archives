// ==UserScript==
// @name         百度指数
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  百度指数爬虫工具
// @author       siji-Xian
// @match        *://index.baidu.com/v2/main/index.html*
// @icon         https://www.google.com/s2/favicons?domain=oceanengine.com
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/479838/%E7%99%BE%E5%BA%A6%E6%8C%87%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/479838/%E7%99%BE%E5%BA%A6%E6%8C%87%E6%95%B0.meta.js
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
    width: "90px",
    textAlign: "center",
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

  //加密数据
  let target_data = [];
  //密钥
  let ptbk = null;

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
        this?.responseURL?.slice(0, 43) ==
        "https://index.baidu.com/api/SearchApi/index"
      ) {
        let res = JSON.parse(obj?.target?.response);
        target_data = res.data.userIndexes;
      }
      if (
        this?.responseURL?.slice(0, 38) ==
        "https://index.baidu.com/Interface/ptbk"
      ) {
        let res = JSON.parse(obj?.target?.response);
        ptbk = res.data;
      }
    }
  })();

  function appendDoc() {
    const likeComment = document.querySelector(".index-trend-words");
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  let decrypt = function (t, e) {
    for (
      var n = t.split(""), i = e.split(""), a = {}, r = [], o = 0;
      o < n.length / 2;
      o++
    )
      a[n[o]] = n[n.length / 2 + o];
    for (var s = 0; s < e.length; s++) r.push(a[i[s]]);
    return r.join("");
  };

  /**
   * 得到开始和结束日期，得到中间所有天返回数组
   * @param {String} startDay 开始日期'2021-7-1'
   * @param {String} endDay 结束日期'2021-8-1'
   * @return {Array} ['2021-07-01', '2021-07-01'...., '2021-08-01']
   */
  function getDayArr(startDay, endDay) {
    let startVal = moment(startDay).format("YYYY-MM-DD");
    let dayArr = [];
    while (moment(startVal).isBefore(endDay)) {
      dayArr.push(startVal);
      // 自增
      startVal = moment(startVal).add(1, "day").format("YYYY-MM-DD");
    }
    // 将结束日期的天放进数组
    dayArr.push(moment(endDay).format("YYYY-MM-DD"));
    return dayArr;
  }

  function expExcel() {
    let dates = getDayArr(target_data[0].all.startDate,target_data[0].all.endDate)
    let data = target_data?.map((v,i)=>{
      return {
        key:v.word[0].name,
        value:decrypt(ptbk, v.all.data)?.split(',')?.map((y,z)=>{return {date:dates[z],value:y}}),
      }
    });
    
    let contrast = {
      date: "日期",
      value: "值"
    };

    let option = {};
    option.fileName = "百度指数"; //文件名
    option.datas = data.map(v=>{
      return {
        sheetName: v.key,
        sheetData: v.value,
        sheetHeader: Object.values(contrast),
        sheetFilter: Object.keys(contrast),
        columnWidths: [], // 列宽
      }
    });
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    loadingMsg.close();
  }

  function urlClick() {
    if (target_data.length) {
      loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
      expExcel(target_data);
    } else {
      loadingMsg = Qmsg.error("数据加载失败，请重试");
    }
  }
})();
