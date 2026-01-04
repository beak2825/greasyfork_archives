// ==UserScript==
// @name        Fund Monitor
// @namespace   Violentmonkey Scripts
// @match       https://datafanclub.github.io/fundmonitor/
// @match       http*://*/balcony/fundmonitor/index.html
// @match       https://fundmonitor.netlify.app/
// @match       file:///*:/*/fundmonitor/index.html
// @connect     1234567.com.cn
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.8
// @license     MIT
// @author      -
// @description 2024/4/12 12:55:55
// @downloadURL https://update.greasyfork.org/scripts/474468/Fund%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/474468/Fund%20Monitor.meta.js
// ==/UserScript==
(function e() {
  "use strict";
  var cdnum = GM_getValue("countdownnum");
  if (!cdnum) {
    GM_setValue("countdownnum", "5");
  }
  document.getElementById("minute").innerText = GM_getValue("countdownnum");
  document.getElementById("second").innerText = "0";
  var button1 = document.getElementById("xiugai");
  var button2 = document.getElementById("countDownNum1");
  var button3 = document.getElementById("huoqu");
  var button4 = document.getElementById("tingzhi");
  var button5 = document.getElementById("danci");
  var bg = document.getElementById("biaoge");
  document.getElementById("shuru").value = GM_getValue("ids");
  button1.addEventListener("click", modifiedIDs);
  button2.addEventListener("click", modifiedCountDownNum);
  button3.addEventListener("click", clickStart);
  button4.addEventListener("click", clickStop);
  button5.addEventListener("click", clickSingle);
  window.intervalId;
})();

function modifiedIDs() {
  let ids = document.getElementById("shuru").value;
  GM_setValue("ids", ids);
  alert("监控代码更新成功！");
  document.getElementById("shuru").value = GM_getValue("ids");
}

function modifiedCountDownNum() {
  let cdn = window.prompt("请设置刷新间隔（分钟）");
  GM_setValue("countdownnum", cdn);
}

//按照估值涨跌幅降序序排列
function up(x, y) {
  return y.gszzl*100 - x.gszzl*100;
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

function mainFunction() {
  let url_prefix = "https://fundgz.1234567.com.cn/js/";
  let valuenames = ["fundcode", "name", "gsz", "gszzl", "gztime"];
  let FUND_listHtml =
    '<table align="center"><thead><tr align="center"><th>基金代码</th><th>基金名称</th><th class="text-right">当前估值</th><th class="text-center">涨跌幅</th><th class="text-right">更新时间</th></tr></thead><tbody>';
  let promiseArray = [];
  let ids = GM_getValue("ids").split(",");
  for (var i = 0, len = ids.length; i < len; i++) {
    if (!(ids[i].trim())) {
      continue;
    }
    let url = url_prefix + ids[i].trim() + ".js?rt=" + new Date().getTime();
    console.log(url);
    promiseArray.push(
      new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
          method: "GET",
          url: url,
          headers: { "Content-Type": "application/json;charset=UTF-8" },
          onload: function (response) {
            let txt = response.responseText;
            if ((typeof txt != "undefined") && (response.status === 200) && (Object.keys(txt).length > 10)) {
              var startIndex = txt.length;
              var endIndex = txt.length - 2;
              var jtxt = JSON.parse(txt.substring(8, endIndex));
              resolve(jtxt);
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
      let newres = [];
      for (let i=0; i<res.length; i++) {
        if (res[i]) {newres.push(res[i])}
      }
      newres = newres.sort(up);
      for (let i = 0; i < newres.length; i++) {
        FUND_listHtml += "<tr>";
        for (let j = 0; j < valuenames.length; j++) {
          if (valuenames[j] === "gszzl") {
            FUND_listHtml += "<td>" + newres[i][valuenames[j]] + "%</td>";
          }
          else if (valuenames[j] === "fundcode") {
            // let link = "https://fundgz.1234567.com.cn/js/" + res[i][valuenames[j]] + ".js?rt=" + new Date().getTime();
            let link = "https://fund.eastmoney.com/" + newres[i][valuenames[j]] + ".html";
            FUND_listHtml += `<td><a href="${link}" target="_blank"> ${newres[i][valuenames[j]]}</a></td>`;
          } else {
            FUND_listHtml += "<td>" + newres[i][valuenames[j]] + "</td>";
          }
        }
        FUND_listHtml += "</tr>";
      }
      FUND_listHtml += "</tbody></table>";
      var container = document.getElementById("container");
      container.innerHTML = FUND_listHtml;
    })
    .catch(function (reason) {
      console.log(reason);
    });
}