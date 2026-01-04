// ==UserScript==
// @name           WorkHard
// @description    WorkHard,WorkHard
// @version        0.0.20250113
// @author         You
// @match          *://10.100.30.13/*

// @compatible     Firefox 100+
// @compatible     Chrome 85+
// @compatible     Edge 85+
// @compatible     Opera 71+
// @compatible     Safari 13.1+
// @grant          unsafeWindow
// @grant          GM_info
// @grant          GM_xmlhttpRequest
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM.info
// @grant          GM.xmlHttpRequest
// @grant          GM.setValue
// @grant          GM.getValue
// @grant          GM.deleteValue
// @incompatible   Internet Explorer
// @license        AGPL-3.0-or-later
// @namespace      https://blog.bgme.me
// @noframes
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/518281/WorkHard.user.js
// @updateURL https://update.greasyfork.org/scripts/518281/WorkHard.meta.js
// ==/UserScript==








function convertTime(ms) {
  if (ms < 0) {
    return 0
  } else {
    return ms;
  }

}
function convertToHMS(ms) {
  ms = ms * 60 * 60 * 1000
  let hours = Math.floor(ms / 3600000);
  ms = ms % 3600000;
  let minutes = Math.floor(ms / 60000);
  ms = ms % 60000;
  let seconds = Math.floor(ms / 1000);
  if (hours < 0 || minutes < 0 || seconds < 0) {
    return "00:00:00"
  } else {
    return `${hours.toString().padStart(2, '0')}小时${minutes.toString().padStart(2, '0')}分钟`;
  }
}

function getTable() {
  var tds = document.getElementsByTagName('td');
  var work_day_time = 0
  var week_day_time = 0
  for (var i = 0; i < tds.length; i++) {

    var week = Math.floor(i / 7) + 1
    var day = i % 7 + 1

    var item = document.querySelector("#rc-tabs-0-panel-calendar > div > div > div > div.ant-picker-panel > div > div > table > tbody > tr:nth-child(" + week.toString() + ") > td:nth-child(" + day.toString() + ") > div")
    if (item.children[1].children[0] !== undefined) {
      var text0 = item.children[1].children[0].children[1]
      var text1 = item.children[1].children[0].children[3]
      var text2 = item.children[1].children[0].children[4]
      if (text1 !== undefined && text2 !== undefined) {
        var realMonth = tds[i].title.toString() + " "


        let timestamp1 = Date.parse(text1.innerText.toString().replace("上班打卡：", realMonth));
        let timestamp2 = Date.parse(text2.innerText.toString().replace("下班打卡：", realMonth));
        // console.log(timestamp1,timestamp2)
        if (timestamp1.toString() === "NaN" || timestamp2.toString() === "NaN") {
          continue
        }

        if (text0.innerText === "休") {
          week_day_time = week_day_time + convertTime((timestamp2 - timestamp1) / 1000 / 60 / 60);
        } else if (text0.innerText === "班") {
          work_day_time = work_day_time + convertTime((timestamp2 - timestamp1) / 1000 / 60 / 60 - 10);
        } else {
          if (day === 6 || day === 7) {
            week_day_time = week_day_time + convertTime((timestamp2 - timestamp1) / 1000 / 60 / 60);
          } else {
            work_day_time = work_day_time + convertTime((timestamp2 - timestamp1) / 1000 / 60 / 60 - 10);
          }
        }
        // console.log(tds[i].title,`总时间${convertToHMS(work_day_time+week_day_time)}:工作日:${convertToHMS(work_day_time)}周末:${convertToHMS(week_day_time)}`)
      }
    }
  }
  const text = document.querySelector("#rc-tabs-0-panel-calendar > div > div > div > div:nth-child(1) > span")
  text.innerText = `总时间${convertToHMS(work_day_time + week_day_time)}   工作日:${convertToHMS(work_day_time)}   非工作日:${convertToHMS(week_day_time)}`;
}


(function () {
  setInterval(function () { // 在此处编写您要延迟运行的代码
    getTable()
  }, 3000); // 延迟时间为5000毫秒
})();