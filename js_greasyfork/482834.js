// ==UserScript==
// @name        雪球监控
// @namespace   Violentmonkey Scripts
// @match       *://*/snowballmonitor*
// @match       http*://*/balcony/snowballmonitor/index.html
// @match       https://snowballmonitor.netlify.app/
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @connect     csindex.com.cn
// @version     1.5
// @author      lx
// @license MIT
// @description 2024/2/8 12:50:00
// @downloadURL https://update.greasyfork.org/scripts/482834/%E9%9B%AA%E7%90%83%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/482834/%E9%9B%AA%E7%90%83%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var button1 = document.getElementById("xiugai");
  var button2 = document.getElementById("chaxun");
  document.getElementById("name").value = GM_getValue("ids");
  document.getElementById("date_range").value = GM_getValue("date_range");
  button1.addEventListener("click", modifiedIDs);
  button2.addEventListener("click", getPrices);
})();

function getCurrentTime() {
  var date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const now = `${year}${month}${day}`;
  return now;
}

function getTimeStamp(sdate, lag = 0) {
  // console.log(sdate);
  var date = new Date();
  if (sdate != "") {
    date = new Date(sdate.substring(0,4) + "-" + sdate.substring(4,6) + "-" + sdate.substring(6,8));
  }
  date.setDate(date.getDate() - lag);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  let res = `${year}${month}${day}`;
  return res;
}

function modifiedIDs() {
  let ids = document.getElementById("name").value;
  GM_setValue("ids", ids);
  let dts = document.getElementById("date_range").value;
  GM_setValue("date_range", dts);
  alert("监控指标更新成功！");
  document.getElementById("name").value = GM_getValue("ids");
  document.getElementById("date_range").value = GM_getValue("date_range");
}

function get_ids(arr) {
  let nst = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    if (arr[i]) {
      let [cName, id, cStartDate, adjbase] = arr[i].split(",");
      if (!nst.includes(id)) {
        nst.push(id);
      }
    }
  }
  return nst;
}

function skimNull(arr) {
  let nst = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    if (arr[i]) {
      nst.push(arr[i]);
    }
  }
  return nst;
}

function searchPrices(id, searchDate, price_db) {
  // if (!price_db.includes(id+'_'+tradeDate)) {
  //   return null
  // }
  return price_db[id+"_"+searchDate];  
}

function getPrices() {
  let ids = get_ids(skimNull(GM_getValue("ids").split(";")));
  console.log(ids);
  let startDate = GM_getValue("date_range");
  let endDate = getCurrentTime();
  let promiseArray = [];
  for (var i = 0, len = ids.length; i < len; i++) {
    let id = ids[i];
    if (!id.trim()) {
      continue;
    }
    let url = `https://www.csindex.com.cn/csindex-home/perf/index-perf?indexCode=${id}&startDate=${startDate}&endDate=${endDate}`;
    console.log(url);
    promiseArray.push(
      new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
          method: "GET",
          url: url,
          headers: { "Content-Type": "application/json;charset=UTF-8" },
          onload: function (response) {
            const txt = response.responseText;
            if (txt.length > 10 && response.status === 200) {
              var jtxt = JSON.parse(txt);
              let res = {};
              jtxt["data"].forEach((data, index) => {
                let ky = data["indexCode"] + "_" + data["tradeDate"];
                let vl = data["close"];
                res[ky] = vl;
              });
              resolve(res);
            } else {
              resolve(0);
            }
          },
          onerror: function (response) {
            reject("请求失败");
          },
        });
      })
    );
  }
  Promise.all(promiseArray)
    .then(function (res) {
      const price_db = res.reduce((accumulator, currentValue) => {
        return { ...accumulator, ...currentValue };
      }, {});
      // console.log(price_db);
      showResult(price_db);
    })
    .catch(function (reason) {
      console.log(reason);
    });
}

function showResult(price_db) {
  let inds = skimNull(GM_getValue("ids").split(";"));
  let valuenames = ["cname", "id", "baselineDate", "baselinePrice", "lastTradeDate", "lastPrice", "pnl"];
  let FUND_listHtml = '<tbody id="panel_content">';
    // '<table id="panel" align="center"><thead><tr align="center"><th>合约名称</th><th>挂钩标的</th><th>基准日</th><th>起初价</th><th>基准调整</th><th>基准价</th><th>最新交易日</th><th>最新价</th><th>盈亏状态</th></thead><tbody>';
  for (let i = 0; i < inds.length; i++) {
    let [cName, id, cStartDate, adjbase] = inds[i].split(",");
    //获得当前最新交易日收盘价
    let ndate = getCurrentTime();
    let nprc, tradeDate;
    for (var j = 0; j<5000; j++) {
      tradeDate = getTimeStamp(sdate=ndate, lag = j);
      nprc = searchPrices(id=id, searchDate=tradeDate, price_db=price_db);
      if (nprc) {
        console.log(tradeDate, nprc);
        break;
      }
    }
    //获得基准日
    let bslp, startDate;
    for (var j = 0; j<5000; j++) {
      startDate = getTimeStamp(sdate=cStartDate, lag = j);
      bslp = searchPrices(id=id, searchDate=startDate, price_db=price_db);
      if (bslp) {
        console.log(startDate, bslp);
        break;
      }
    }
    let adbslp = bslp * adjbase;
    adbslp = adbslp.toFixed(2);
    let pnl = 100 * ((nprc - adbslp) / adbslp); 
    pnl = pnl.toFixed(2);
    let padjbase = adjbase * 100;
    padjbase = padjbase.toFixed(2);
    FUND_listHtml += `<tr><td>${cName}</td><td>${id}</td><td>${cStartDate}</td><td>${bslp}</td><td>${padjbase}%</td><td>${adbslp}</td><td>${tradeDate}</td><td>${nprc}</td><td>${pnl}%</td></tr>`;
  }
  FUND_listHtml += "</tbody>";
  var container = document.getElementById("panel_content");
  container.innerHTML = FUND_listHtml;
}
