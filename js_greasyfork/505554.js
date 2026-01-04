// ==UserScript==
// @name        理财监控
// @namespace   Violentmonkey Scripts
// @match       https://bytedynamic.github.io/balcony/licai/index.html
// @version     1.0
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @license MIT
// @author      -
// @description 2024/8/28 12:21:32
// @downloadURL https://update.greasyfork.org/scripts/505554/%E7%90%86%E8%B4%A2%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/505554/%E7%90%86%E8%B4%A2%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==
(function () {
  "use strict";
  var button1 = document.getElementById("xiugai");
  var button2 = document.getElementById("chaxun");
  document.getElementById("name").value = GM_getValue("ids");
  // document.getElementById("date_range").value = GM_getValue("date_range");
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
  // let dts = document.getElementById("date_range").value;
  // GM_setValue("date_range", dts);
  alert("监控指标更新成功！");
  document.getElementById("name").value = GM_getValue("ids");
  // document.getElementById("date_range").value = GM_getValue("date_range");
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

function searchPrices(id, price_db) {
  // if (!price_db.includes(id+'_'+tradeDate)) {
  //   return null
  // }
  return price_db[id];
}

//按照万元收益涨跌幅降序序排列
function up(x, y) {
  return y.ipwy - x.ipwy;
}

function get_income_per_wan(start_date, end_date, start_value, end_value) {
  // 定义两个日期
  let date1 = new Date(start_date);
  let date2 = new Date(end_date);
  // 计算日期之间的差值（毫秒数）
  let differenceInMilliseconds = date2 - date1;
  // 将毫秒转换为天数
  let differenceInDays = differenceInMilliseconds / (1000 * 3600 * 24);
  if (differenceInDays > 0) {
    let ipwd = (parseFloat(end_value) - parseFloat(start_value)) / differenceInDays * (10000 / parseFloat(start_value));
    let ipwy = ipwd * 365;
    console.log(ipwd.toFixed(4), ipwy.toFixed(2));
    return [ipwd.toFixed(4), ipwy.toFixed(2)];
  }
  else {
    return [0, 0]
  }
}

function getPrices() {
  let ids = GM_getValue("ids").split(",");
  // let startDate = GM_getValue("date_range");
  // let endDate = getCurrentTime();
  let promiseArray = [];
  for (var i = 0, len = ids.length; i < len; i++) {
    let id = ids[i];
    if (!id.trim()) {
      continue;
    }
    let url = `https://www.chinawealth.com.cn/lccpJzcpServlet.go?cpdjbm=` + id;
    console.log(url)
    promiseArray.push(
      new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
          url: url,
          method: "POST",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50",
            "Accept": "application/json",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive"
          },
          onload: function (response) {
            const txt = response.responseText;
            console.log(response);
            if (txt.length > 10 && response.status === 200) {
              var jtxt = JSON.parse(txt);
              let res = {};
              jtxt['List'].forEach((data, index) => {
                res['pId'] = id;
                res['pName'] = data["cpms"];
                res['pNetValue'] = data["cpjz"];
                res['pCumNetValue'] = data["ljjz"];
                res['benchmarkUp'] = data["yjbjjzsx"];
                res['benchmarkLow'] = data["yjbjjzxx"];
                res['pStartDate'] = data["cpqsrq"];
                res['pStartValue'] = data["csjz"];
                res['pPublishDate'] = data["kfzqjsr"];
                let ipw = get_income_per_wan(data["cpqsrq"], data["kfzqjsr"], data["csjz"], data["ljjz"]);
                res['ipwd'] = ipw[0];
                res['ipwy'] = ipw[1];
                // let ky = id;
                // let vl = (pName, pPublishDate, pCumNetValue, pStartDate, pStartValue, ipwd, ipwy, benchmarkUp, benchmarkLow)
                // res[id] = vl;
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
      res = res.sort(up);
      console.log(res);
      let FUND_listHtml = '<tbody id="panel_content">';
      // pName, pPublishDate, pCumNetValue, pStartDate, pStartValue, ipwd, ipwy, benchmarkUp, benchmarkLow
      for (var i = 0; i < res.length; i++) {
        FUND_listHtml += `<tr><td>${res[i]["pName"]}<BR>${res[i]["pId"]}</td><td>${res[i]["pPublishDate"]}</td><td>${res[i]["pCumNetValue"]}</td><td>${res[i]["pStartDate"]}</td><td>${res[i]["pStartValue"]}</td><td>${res[i]["ipwd"]}</td><td>${res[i]["ipwy"]}</td><td>${res[i]["benchmarkUp"]}%</td><td>${res[i]["benchmarkLow"]}%</td></tr>`;
      }
      FUND_listHtml += "</tbody>";
      var container = document.getElementById("panel_content");
      container.innerHTML = FUND_listHtml;
    })
    .catch(function (reason) {
      console.log(reason);
    });
}