// ==UserScript==
// @name        MARKET RADAR
// @namespace   Violentmonkey Scripts
// @match       https://marketradar.netlify.app/
// @match       http*://*/balcony/marketradar/index.html
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @connect     eastmoney.com
// @version     1.2
// @author      lx
// @license     MIT
// @description 2024/2/8 12:50:00
// @downloadURL https://update.greasyfork.org/scripts/485746/MARKET%20RADAR.user.js
// @updateURL https://update.greasyfork.org/scripts/485746/MARKET%20RADAR.meta.js
// ==/UserScript==

// ==/UserScript==
(function e() {
  "use strict";
  var cdnum = GM_getValue("countdownnum");
  if (!cdnum) {
    GM_setValue("countdownnum", "5");
  }
  findUrl();
  document.getElementById("minute").innerText = GM_getValue("countdownnum");
  document.getElementById("second").innerText = "0";
  var button1 = document.getElementById("xiugai");
  var button2 = document.getElementById("countDownNum1");
  var button3 = document.getElementById("huoqu");
  var button4 = document.getElementById("tingzhi");
  var button5 = document.getElementById("danci");
  var bg = document.getElementById("biaoge");
  document.getElementById("shuru1").value = GM_getValue("ids");
  document.getElementById("shuru2").value = GM_getValue("date_range");
  button1.addEventListener("click", modifiedParams);
  button2.addEventListener("click", modifiedCountDownNum);
  button3.addEventListener("click", clickStart);
  button4.addEventListener("click", clickStop);
  button5.addEventListener("click", clickSingle);
  window.intervalId;
})();

function modifiedParams() {
  let ids = document.getElementById("shuru1").value;
  GM_setValue("ids", ids);
  document.getElementById("shuru1").value = GM_getValue("ids");
  let date_range = document.getElementById("shuru2").value;
  GM_setValue("date_range", date_range);
  document.getElementById("shuru2").value = GM_getValue("date_range");
  alert("参数更新成功！");
}


function modifiedCountDownNum() {
  let cdn = window.prompt("请设置刷新间隔（分钟）");
  GM_setValue("countdownnum", cdn);
}

//按照估值涨跌幅降序序排列
function up(x, y) {
  return y.gszzl - x.gszzl;
}

function clickStart() {
  clearInterval(window.intervalId);
  mainFunction();
  let countdownTime = GM_getValue("countdownnum") * 60;
  let stime = Date.now();
  let countdown = function () {
    if ((countdownTime <= 0) || (Date.now() - stime >= countdownTime*1000)) {
      document.getElementById("minute").innerText = "0";
      document.getElementById("second").innerText = "0";
      countdownTime = GM_getValue("countdownnum") * 60;
      stime = Date.now();
      mainFunction();
    } else {
      document.getElementById("minute").innerText = parseInt(
        countdownTime / 60
      );
      document.getElementById("second").innerText = parseInt(
        countdownTime % 60
      );
      countdownTime--;
    }
  };
  window.intervalId = setInterval(countdown, 1000);
  console.log("Start Update");
}

function clickSingle() {
  clearInterval(window.intervalId);
  document.getElementById("minute").innerText = GM_getValue("countdownnum");
  document.getElementById("second").innerText = "0";
  mainFunction();
}

function clickStop() {
  clearInterval(window.intervalId);
  document.getElementById("minute").innerText = GM_getValue("countdownnum");
  document.getElementById("second").innerText = "0";
  console.log("Stop Update");
  // mainFunction();
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

function eRet_desc(x, y) {
  return y.eRet - x.eRet;
}

function getTimer() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = month < 10 ? '0' + month : month;
  let day = date.getDate();
  day = day < 10 ? '0' + day : day;
  let h = date.getHours();
  h = h < 10 ? '0' + h : h;
  let m = date.getMinutes();
  m = m < 10 ? '0' + m : m;
  let s = date.getSeconds();
  s = s < 10 ? '0' + s : s;
  return year + '-' + month + '-' + day + '<br>' + h + ':' + m + ':' + s;
}

function findUrl() {
  const urls = document.querySelectorAll("a#id_url");
  const oids = document.querySelectorAll("span#single_id");
  // let l = {};
  for (var i = 0; i < oids.length; i++) {
    // l[oids[i].innerText] = urls[i].href;
    if (GM_getValue(oids[i].innerText)) {
      continue;
    }
    else {
      GM_setValue(oids[i].innerText, urls[i].href);
    }
  }
}

function mainFunction() {
  let ids = skimNull(GM_getValue("ids").split(","));
  let date_range = GM_getValue("date_range");
  console.log(ids, date_range);
  let promiseArray = [];
  for (var i = 0, len = ids.length; i < len; i++) {
    let id = ids[i];
    if (!id.trim()) {
      continue;
    }
    let ts = Date.now();
    /**
     * f51: 'TRADEDATE'
     * f52: 'OPENPRICE'
     * f53: 'CLOSEPRICE'
     * f54: 'HIGHPRICE'
     * f55: 'LOWPRICE'
     * f56: 'VOL'
     * f57: 'AMOUNT'
     * f58: 'AMPLITUDE'
     * f59: 'RET'
     * f60: 'CHANGE'
     * f61: 'TURNOVER'
    **/
    let url = `https://push2his.eastmoney.com/api/qt/stock/kline/get?cb=&secid=${id}&ut=fa5fd1943c7b386f172d6893dbfba10b&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5%2Cf6&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf57%2Cf59&klt=101&fqt=1&end=20500101&lmt=${date_range}&_=${ts}`
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
              if (klines.length == date_range) {
                let e_data = klines[klines.length-1]; //f51(TRADEDATE), f52(OPENPRICE), f53(CLOSEPRICE), f54(HIGHPRICE), f55(LOWPRICE), f57(AMOUNT), f59(RET)
                let s_data = klines[0];  //f51(TRADEDATE), f52(OPENPRICE), f53(CLOSEPRICE), f54(HIGHPRICE), f55(LOWPRICE), f57(AMOUNT), f59(RET)
                let tradeDate_e = e_data.split(',')[0];
                let open_e = e_data.split(',')[1];
                let close_e = e_data.split(',')[2];
                let high_e = e_data.split(',')[3];
                let low_e = e_data.split(',')[4];
                let amount_e = e_data.split(',')[5];
                let ret_e = e_data.split(',')[6];
                let tradeDate_s = s_data.split(',')[0];
                let open_s = s_data.split(',')[1];
                let close_s = s_data.split(',')[2];
                let high_s = s_data.split(',')[3];
                let low_s = s_data.split(',')[4];
                let amount_s = s_data.split(',')[5];
                let ret_s = s_data.split(',')[6];
                res.push(
                    [indexCode, indexNameCN, tradeDate_e, open_e, close_e, high_e, low_e, amount_e, ret_e, id],  //终止日
                    [indexCode, indexNameCN, tradeDate_s, open_s, close_s, high_s, low_s, amount_s, ret_s, id],  //起始日
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
      for (var i = 0, len = res.length; i < len; i++) {
        // 0: indexCode, 1: indexNameCN, 2: tradeDate_e, 3: open_e, 4: close_e, 5: high_e, 6: low_e, 7: amount, 8: ret_e, 9: oid
        let item_e = res[i][0];
        let item_s = res[i][1];
        let id = item_e[0];
        let cName = item_e[1];
        let eTradeDate = item_e[2];
        let eOpenPrice = item_e[3];
        let eClosePrice = item_e[4];
        let eHighPrice = item_e[5];
        let eLowPrice = item_e[6];
        let eAmount = item_e[7];
        let eRet = item_e[8];
        let sTradeDate = item_s[2];
        let sOpenPrice = item_s[3];
        let sClosePrice = item_s[4];
        let sHighPrice = item_s[5];
        let sLowPrice = item_s[6];
        let sAmount = item_s[7];
        let sRet = item_s[8];
        let oid = item_e[9];
        let pnl = (eClosePrice/sClosePrice-1)*100;
        nres.push({
          'id': id,
          'cName': cName,
          'eTradeDate': eTradeDate,
          'sTradeDate': sTradeDate,
          'eClosePrice': eClosePrice,
          'eOpenPrice': eOpenPrice,
          'eLowPrice': eLowPrice,
          'eHighPrice': eHighPrice,
          'eAmount': eAmount/100000000,
          'eRet': eRet,
          'pnl': pnl,
          'oid': oid,
        });
      }
      nres = nres.sort(eRet_desc);
      let tsp = getTimer();
      let FUND_listHtml =
    `<table align="center" width="100%"><thead><tr align="center"><th>证券名称</th><th class="text-right">涨跌幅</th><th class="text-center">最新行情</th><th class="text-center">更新时间</th></tr></thead><tbody>`;
      FUND_listHtml += '<tbody">';
      //证券名称(证券代码,链接) 当前价格(涨跌幅) 当日行情 区间涨跌幅(区间范围) 更新时间
      for (var j = 0, len = nres.length; j < len; j++) {
        let nresa = nres[j];
        let idlink = GM_getValue(nresa["oid"]);
        if (idlink) {
          FUND_listHtml += `<tr> <td><a href="${idlink}" target="_blank"> ${nresa["cName"]}<br>${nresa["id"]} </a> </td> <td><b>${nresa["eRet"]}%</b><br>[${date_range}D] ${nresa["pnl"].toFixed(2)}%</td> <td><b>收：${nresa["eClosePrice"]}</b>  开：${nresa["eOpenPrice"]}<br>高：${nresa["eHighPrice"]}  低：${nresa["eLowPrice"]}</td><td>${tsp}</td></tr>`;
        }
        else {
          FUND_listHtml += `<tr> <td>${nresa["cName"]}<br>${nresa["id"]}</td> <td><b>${nresa["eRet"]}%</b><br>[${date_range}D] ${nresa["pnl"].toFixed(2)}%</td> <td><b>收：${nresa["eClosePrice"]}</b>  开：${nresa["eOpenPrice"]}<br>高：${nresa["eHighPrice"]}  低：${nresa["eLowPrice"]}</td><td>${tsp}</td></tr>`;
        }
      }
      FUND_listHtml += "</tbody>";
      console.log(FUND_listHtml);
      var container = document.getElementById("container");
      container.innerHTML = FUND_listHtml;
    })
    .catch(function (reason) {
      console.log(reason);
    });
  }
