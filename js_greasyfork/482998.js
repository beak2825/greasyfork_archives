// ==UserScript==
// @name        二八轮动-EM
// @namespace   Violentmonkey Scripts
// @match       https://2080.netlify.app/
// @match       http*://*/balcony/twenty_eighty/index.html
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @connect     eastmoney.com
// @version     1.5
// @license     MIT
// @author      lx
// @description 2024/2/8 12:50:00
// @downloadURL https://update.greasyfork.org/scripts/482998/%E4%BA%8C%E5%85%AB%E8%BD%AE%E5%8A%A8-EM.user.js
// @updateURL https://update.greasyfork.org/scripts/482998/%E4%BA%8C%E5%85%AB%E8%BD%AE%E5%8A%A8-EM.meta.js
// ==/UserScript==
(function () {
  "use strict";
  var button1 = document.getElementById("confirm");
  var button2 = document.getElementById("calculate");
  document.getElementById("name").value = GM_getValue("ids");
  document.getElementById("date_range").value = GM_getValue("date_range");
  button1.addEventListener("click", modifiedParams);
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

function modifiedParams() {
  let ids = document.getElementById("name").value;
  GM_setValue("ids", ids);
  let dts = document.getElementById("date_range").value;
  GM_setValue("date_range", dts);
  alert("监控指标更新成功！");
  document.getElementById("name").value = GM_getValue("ids");
  document.getElementById("date_range").value = GM_getValue("date_range");
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

function tradeDate_desc(x, y) {
  return y.tradeDate - x.tradeDate;
}

function pnl_desc(x, y) {
  return y.pnl - x.pnl;
}

const genUrl = (id) => {
  if (id.slice(0,1) == '5') {
    return `https://quote.eastmoney.com/sh${id}.html`
  }
  else {
    return `https://quote.eastmoney.com/sz${id}.html`
  }
}

function getPrices() {
  let ids = skimNull(GM_getValue("ids").split(","));
  let date_range = Number(GM_getValue("date_range"));
  // let endDate = getCurrentTime();
  // let startDate = endDate - 10000;
  console.log(ids, date_range);
  let promiseArray = [];
  for (var i = 0, len = ids.length; i < len; i++) {
    let id = ids[i];
    if (!id.trim()) {
      continue;
    }
    let ts = Date.now();
    let url = `https://push2his.eastmoney.com/api/qt/stock/kline/get?cb=&secid=${id}&ut=fa5fd1943c7b386f172d6893dbfba10b&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5%2Cf6&fields2=f51%2Cf53&klt=101&fqt=1&end=20500101&lmt=${date_range+2}&_=${ts}`
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
              let res = [];
              let small_json = jtxt["data"];
              let indexCode = small_json["code"];
              let indexNameCN = small_json["name"];
              let klines = small_json["klines"]
              if (klines.length >= date_range+2) {
                let e_data = klines[klines.length-1];
                let s_data = klines[2];
                let tradeDate1 = e_data.split(',')[0];
                let close1 = e_data.split(',')[1];
                let tradeDate2 = s_data.split(',')[0];
                let close2 = s_data.split(',')[1];
                // 算前一天的资产收益率，表示当前持有的资产
                let e_data_f1 = klines[klines.length-2];
                let s_data_f1 = klines[1];
                let tradeDate1_f1 = e_data_f1.split(',')[0];
                let close1_f1 = e_data_f1.split(',')[1];
                let tradeDate2_f1 = s_data_f1.split(',')[0];
                let close2_f1 = s_data_f1.split(',')[1];
                // 算前2天的资产收益率，表示前一期持有的资产
                let e_data_f2 = klines[klines.length-3];
                let s_data_f2 = klines[0];
                let tradeDate1_f2 = e_data_f2.split(',')[0];
                let close1_f2 = e_data_f2.split(',')[1];
                let tradeDate2_f2 = s_data_f2.split(',')[0];
                let close2_f2 = s_data_f2.split(',')[1];
                res.push(
                    [indexCode, indexNameCN, tradeDate1, close1, tradeDate1_f1, close1_f1, tradeDate1_f2, close1_f2],  //终止日
                    [indexCode, indexNameCN, tradeDate2, close2, tradeDate2_f1, close2_f1, tradeDate2_f2, close2_f2],  //起始日
                )
                resolve(res);
              }
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
      // console.log(res);
      let nres = [];
      let nres_f1 = [];
      let nres_f2 = [];
      for (var i = 0, len = res.length; i < len; i++) {
        let id = res[i][0][0];
        let cName = res[i][0][1];
        let tradeDate = res[i][0][2];
        let stradeDate = res[i][1][2];
        let sPrice = res[i][1][3];
        let ePrice = res[i][0][3];
        let tradeDate_f1 = res[i][0][4];
        let stradeDate_f1 = res[i][1][4];
        let sPrice_f1 = res[i][1][5];
        let ePrice_f1 = res[i][0][5];
        let tradeDate_f2 = res[i][0][6];
        let stradeDate_f2 = res[i][1][6];
        let sPrice_f2 = res[i][1][7];
        let ePrice_f2 = res[i][0][7];
        let pnl = (ePrice/sPrice-1)*100;
        let pnl_f1 = (ePrice_f1/sPrice_f1-1)*100;
        let pnl_f2 = (ePrice_f2/sPrice_f2-1)*100;
        nres.push({
          'id': id,
          'cName': cName,
          'tradeDate': tradeDate,
          'stradeDate': stradeDate,
          'sPrice': sPrice,
          'ePrice': ePrice,
          'pnl': pnl,
        });
        nres_f1.push({
          'id': id,
          'cName': cName,
          'tradeDate': tradeDate_f1,
          'stradeDate': stradeDate_f1,
          'sPrice': sPrice_f1,
          'ePrice': ePrice_f1,
          'pnl': pnl_f1,
        });
        nres_f2.push({
          'id': id,
          'cName': cName,
          'tradeDate': tradeDate_f2,
          'stradeDate': stradeDate_f2,
          'sPrice': sPrice_f2,
          'ePrice': ePrice_f2,
          'pnl': pnl_f2,
        });
      }
      nres = nres.sort(pnl_desc);
      nres_f1 = nres_f1.sort(pnl_desc);
      nres_f2 = nres_f2.sort(pnl_desc);
      let HOLDING_Html = '<tbody id="holding_content">';
      let idurl2 = genUrl(nres_f2[0]["id"]);
      let idurl1 = genUrl(nres_f1[0]["id"]);
      let idurl = genUrl(nres[0]["id"]);
      HOLDING_Html += `<tr><td><a href="${idurl2}" target="_blank">${nres_f2[0]["cName"]}<br>${nres_f2[0]["id"]}</a><br><b>${nres_f2[0]["pnl"].toFixed(2)}%</b></td><td><a href="${idurl1}" target="_blank">${nres_f1[0]["cName"]}<br>${nres_f1[0]["id"]}</a><br><b>${nres_f1[0]["pnl"].toFixed(2)}%</b></td><td><a href="${idurl}" target="_blank">${nres[0]["cName"]}<br>${nres[0]["id"]}</a><br><b>${nres[0]["pnl"].toFixed(2)}%</b></td></tr>`;
      HOLDING_Html += "</tbody>";
      var container1 = document.getElementById("holding_content");
      container1.innerHTML = HOLDING_Html;
      let FUND_listHtml = '<tbody id="panel_content">';
      for (var i = 0, len = nres.length; i < len; i++) {
        let nresa = nres[i];
        let link = genUrl(nresa["id"]);
        FUND_listHtml += `<tr><td><a href="${link}" target="_blank"> ${nresa["cName"]}<br>${nresa["id"]}</a></td><td>${nresa["stradeDate"]}：${nresa["sPrice"]}<br>${nresa["tradeDate"]}：${nresa["ePrice"]}</td><td>${nresa["pnl"].toFixed(2)}%</td></tr>`;
      }
      FUND_listHtml += "</tbody>";
      var container = document.getElementById("panel_content");
      container.innerHTML = FUND_listHtml;
    })
    .catch(function (reason) {
      console.log(reason);
    });
}