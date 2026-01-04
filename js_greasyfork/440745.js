// ==UserScript==
// @name walmart 绩效快速统计
// @namespace http://tampermonkey.net/
// @version 1.4
// @description 用在沃尔玛运营时候简化一部分操作用 私人脚本
// @author w1w
// @match *://seller.walmart.com/partner-analytics/performance/financials*
// @require http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require https://cdn.bootcdn.net/ajax/libs/noty/3.1.4/noty.min.js
// @icon https://www.google.com/s2/favicons?domain=walmart.com
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440745/walmart%20%E7%BB%A9%E6%95%88%E5%BF%AB%E9%80%9F%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/440745/walmart%20%E7%BB%A9%E6%95%88%E5%BF%AB%E9%80%9F%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==
//缝缝补补用三年 简化下沃尔玛后台的运营操作。

window.hide = (el, showtime, time) => {
  let alpha = 100;
  el.style.opacity = alpha / 100;
  setTimeout(() => {
    let a = setInterval(() => {
      //console.log(alpha)
      el.style.opacity = alpha / 100;
      alpha -= 2;
      if (alpha <= 15) {
        el.style.opacity = 0;
        clearInterval(a);
      }
    }, time / 50);
  }, showtime);
};
window.copy = () => {
  let transfer = document.querySelector("#textarea22588");
  transfer.style.display = "";
  transfer.value = copyData; // 这里表示想要复制的内容
  transfer.focus();
  transfer.select();
  //alert("复制完成");
  hide(document.querySelector("artDilog"), 1.6e3, 1.6e3);
  if (document.execCommand("copy")) {
    document.execCommand("copy");
  }
  transfer.blur();
  transfer.style.display = "none";
  console.log("复制成功");

  //document.body.removeChild(transfer);
};
window.todayValue = function () {
  var d = new Date();
  var todayValue =
    d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  return todayValue;
};
window.addZero = function (data) {
  if (data.length < 2) {
    return "0" + data;
  } else {
    return data;
  }
};
window.id = "tab" + Date.now();
window.timeIsRight = 1;
var tem =
  ` <form class="newSearch" style="text-align:center;">

    <input type="text" id="nowTime" value=""/>
                            <span>开始时间:</span><input type="text" id="stt" value="2021-10-1"/>
                            <span>结束时间：</span><input type="text" id="ent" value="2021-10-1"/>
                            <!--<input type="button" id='today' value="数据直到今天" />--!>
                            <input type="button" id = 'TDay' value="最近三天" />
                            <input type="button" id = 'SDay' value="最近七天" />
                            <input type="button" id = 'sameDay' value="同一天" />
                            <input type="button" id = 'go' value="开始" />
                            <input type="button" id = 'copyData' value="复制" />
                        <span>时间跨度单次上限100天（不要改系统时区，时间计算会出错的）</span></form>
                        <tab id="` +
  id +
  `"><br/></tab><textarea id = "textarea22588" style = "display:none"></textarea>

                            <artDilog style="opacity: 0;">
        <div
            style="z-index:2147483646;min-width:200px;display:flex; align-items :center;justify-content: center; max-width: 270px; width: 15%; background-color: #fee; box-shadow: 3px 4px 4px #c2c2c2; border-radius: 10px; height: 100px; box-sizing: border-box; padding: 25px 36px; position: fixed; right: 66px; top: 66px;">
            <svg width="30" height="30" t="1646120175810" class="icon"
                    viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2065">
                    <path
                        d="M512 0C229.2 0 0 229.2 0 512s229.2 512 512 512 512-229.2 512-512S794.8 0 512 0z m-32 769V353c0-17.7 14.3-32 32-32s32 14.3 32 32v416c0 8.8-3.6 16.8-9.4 22.6-5.8 5.8-13.8 9.4-22.6 9.4-17.7 0-32-14.3-32-32z m64-543.5c0 8.8-3.6 16.8-9.4 22.6-5.8 5.8-13.8 9.4-22.6 9.4-17.7 0-32-14.3-32-32v-1c0-17.7 14.3-32 32-32s32 14.3 32 32v1z"
                        p-id="2066" fill="#72dcfc"></path>
                </svg>
            <div style="display: inline;font-size: 20px;padding-left: 10px;">复制成功</div>
        </div>

    </artDilog>

                        `;
window.templete = `<tr>
            <td class='newT'> Data</td>
            <td class='newT'> ITEM ID</td>
            <td class='newT'> DEPARTMENT</td>
            <td class='newT'> BRAND</td>
            <td class='newT'> GMV</td>
            <td class='newT'> COMMISSION</td>
            <td class='newT'> GMV - COMMISSION</td>
            <td class='newT'> AUR</td>
            <td class='newT'> TOTAL UNITS SOLD</td>
            <td class='newT'> CANCELLED UNITS</td>
            <td class='newT'> CANCELLED SALES</td>
            <td class='newT'> CANCELLED SALES %</td>
            <td class='newT'> CANCELLED UNITS %</td>
            <td class='newT'> ITEM CONVERSION RATE</td>
            <td class='newT'> BASE ITEM ID</td>
            <td class='newT'> SKU</td>
            <td class='newT'> TOTAL PRODUCT VISITS</td>
        </tr>`;
window.getDayilyData = (dateTime) => {
  window.tempVal = [];
  let offsetTime = new Date(dateTime);
  offsetTime = offsetTime.getTime() - 86400000 * 1;
  offsetTime = new Date(offsetTime);
  offsetTime =
    offsetTime.getFullYear() +
    "-" +
    addZero("" + (offsetTime.getMonth() + 1)) +
    "-" +
    addZero("" + offsetTime.getDate());
  $.ajax({
    url: "https://seller.walmart.com/api/aurora/financial/getItemSales",
    type: "POST",
    async: false,
    contentType: "application/json",
    dataType: "json",
    tryCount: 0,
    retryLimit: 5,
    headers: {
      Accept: "application/json",
      "x-xsrf-token": window.xtoken,
    },
    data:
      '{"filter":{"filterBy":{"duration":["' +
      offsetTime +
      '","' +
      offsetTime +
      '"],"program":"ALL"},"sortBy":{}},"pagination":{"pageNumber":1,"pageSize":25}}',
    success(e) {
      console.log("seccucs...");
      allDate.push(e["data"]);
      tempVal.push(e);
    },
    error(xhr, textStatus, errorThrown) {
      this.tryCount++;
      if (this.tryCount <= this.retryLimit) {
        //try again
        $.ajax(this);
        return;
      }
    },
  });
};
window.getDaily = function () {
  window.allDate = [];
  window.tableData = "";
  window.timeList = [];
  let stt = $("#stt").val();
  let ent = $("#ent").val();
  stt = new Date(stt);
  ent = new Date(ent);
  if (stt == "Invalid Date" || ent == "Invalid Date") {
    alert("请输入正确时间格式！");
    timeIsRight = 0;
    return 0;
  }
  var stt_T = stt.getTime();
  var ent_T = ent.getTime();
  if (stt_T > ent_T) {
    alert("请输入正确时间顺序！");
    timeIsRight = 0;
    return 0;
  } else {
    timeIsRight = 1;
  }
  ent =
    ent.getFullYear() +
    "-" +
    addZero("" + (ent.getMonth() + 1)) +
    "-" +
    addZero("" + ent.getDate());
  var iii = 100; //单次搜索上限
  let temp =
    stt.getFullYear() +
    "-" +
    addZero("" + (stt.getMonth() + 1)) +
    "-" +
    addZero("" + stt.getDate());
  timeList.push(temp);
  if (temp != ent) {
    while (iii > 0) {
      stt_T = 86400000 + stt_T;
      let temDate = new Date(stt_T);
      temp =
        temDate.getFullYear() +
        "-" +
        addZero("" + (temDate.getMonth() + 1)) +
        "-" +
        addZero("" + temDate.getDate());
      timeList.push(temp);
      if (temp == ent) {
        break;
      } else {
        iii--;
      }
    }
  }

  return 0;
};

window.mainLunch = function () {
  var getXToken = () => {
    var r = new RegExp("XSRF-TOKEN=(.*?);");
    window.xtoken = document.cookie.match(r)[1].toString();
  };
  window.fetchFishedCount = 0;
  getXToken();
  console.log("点击开始运行");
  getDaily();
  if (timeIsRight == 0) {
    return 0;
  }
  console.log(timeList.length);
  for (var i = 0; i < timeList.length; i++) {
    console.log("dataTime: " + timeList[i]);
    getDayilyData2(timeList[i], i);
  }
  window.runMaxTime = 20; //最长等待时间 1 = 0.5s
  var checkState = setInterval(() => {
    if (runMaxTime <= 0 || window.fetchFishedCount === timeList.length) {
      tempVal2.sort((a, b) => {
        return a[0] - b[0];
      });
      tempVal2.forEach((data) => {
        allDate.push(data[1]);
      });
      formatTable();
      clearTable();
      insertTable();
      $("#copyData")[0].style.background = "#f99";
      clearInterval(checkState);
    }
    if (runMaxTime > 0) {
      runMaxTime -= 1;
    }
  }, 500);
};
window.clearTable = function () {
  if ($("#" + id).children().length > 1) {
    $("#" + id)
      .children()[0]
      .remove();
  }
};
window.insertTable = function () {
  window.allTable = window.templete + window.tableData;
  window.div_tab = document.createElement("table");
  div_tab.innerHTML = allTable;
  $("#" + id)
    .children()[0]
    .before(div_tab);
  $("#" + id).children()[0].style.fontSize = "6px";
  $("#" + id).children()[0].style.border = "1px solid";
  $("#" + id).children()[0].style.textAlign = "center";
};
window.formatTable = function () {
  window.copyData = "";
  for (var i = 0; i < allDate.length; i++) {
    let temp = allDate[i];
    if (temp == []) {
      if (i !== allDate.length) {
        alert(i + "是空白");
      }
      continue;
    } else {
      for (var ii = 0; ii < temp.length; ii++) {
        var tempDate = temp[ii];
        window.copyData +=
          timeList[i] +
          "\t" +
          tempDate["catlgItemId"] +
          "\t" +
          tempDate["department"] +
          "\t" +
          tempDate["brandName"] +
          "\t" +
          tempDate["TotalGMV"] +
          "\t" +
          tempDate["TotalCommissions"] +
          "\t" +
          (tempDate["TotalGMV"] - tempDate["TotalCommissions"]) +
          "\t" +
          tempDate["AuthAUR"] +
          "\t" +
          tempDate["TotalUnits"] +
          "\t" +
          tempDate["TotalCancelUnits"] +
          "\t" +
          tempDate["TotalCancelAmt"] +
          "\t" +
          tempDate["TotalCancelAmt"] / tempDate["TotalAuthAmt"] +
          "\t" +
          tempDate["TotalCancelUnits"] / tempDate["TotalAuthUnits"] +
          "\t" +
          tempDate["Conversion"] +
          "\t" +
          tempDate["baseItemId"] +
          "\t" +
          tempDate["skuId"] +
          "\t" +
          tempDate["TotalProductVisitsItemLvl"] + //似乎这里有修改
          "\r\n";
        window.tableData =
          window.tableData +
          "<tr><td class= 'newT'>" +
          timeList[i] +
          "</td><td class= 'newT'>" +
          tempDate["catlgItemId"] +
          "</td><td class= 'newT'>" +
          tempDate["department"] +
          "</td><td class= 'newT'>" +
          tempDate["brandName"] +
          "</td><td class= 'newT'>" +
          tempDate["TotalGMV"] +
          "</td><td class= 'newT'>" +
          tempDate["TotalCommissions"] +
          "</td><td class= 'newT'>" +
          (tempDate["TotalGMV"] - tempDate["TotalCommissions"]) +
          "</td><td class= 'newT'>" +
          tempDate["AuthAUR"] +
          "</td><td class= 'newT'>" +
          tempDate["TotalUnits"] +
          "</td><td class= 'newT'>" +
          tempDate["TotalCancelUnits"] +
          "</td><td class= 'newT'>" +
          tempDate["TotalCancelAmt"] +
          "</td><td class= 'newT'>" +
          tempDate["TotalCancelAmt"] / tempDate["TotalAuthAmt"] +
          "</td><td class= 'newT'>" +
          tempDate["TotalCancelUnits"] / tempDate["TotalAuthUnits"] +
          "</td><td class= 'newT'>" +
          tempDate["Conversion"] +
          "</td><td class= 'newT'>" +
          tempDate["baseItemId"] +
          "</td><td class= 'newT'>" +
          tempDate["skuId"] +
          "</td><td class= 'newT'>" +
          tempDate["TotalProductVisitsItemLvl"] +   //似乎这里有修改
          "</td></tr>";
      }
    }
  }
};

$().ready(function () {
  let date = new Date();
  date = date.getTime();
  let div_section = document.createElement("section");
  let tempDate;
  div_section.innerHTML = tem;
  setTimeout(() => {
    document
      .querySelector(
        "#subapp-main-0 > div > div:nth-child(1) > div > div:nth-child(3) > div"
      )
      .before(div_section);
    tempDate = date - 86400000 * 5;
    tempDate = new Date(tempDate);
    $("#ent").val(todayValue());
    $("#stt").val(
      tempDate.getFullYear() +
        "-" +
        addZero("" + (tempDate.getMonth() + 1)) +
        "-" +
        addZero("" + tempDate.getDate())
    );
    $("#sameDay").bind("click", function () {
      $("#ent").val($("#stt").val());
    });
    $("#TDay").bind("click", function () {
      $("#ent").val(todayValue());
      tempDate = date - 86400000 * 3;
      tempDate = new Date(tempDate);
      $("#stt").val(
        tempDate.getFullYear() +
          "-" +
          addZero("" + (tempDate.getMonth() + 1)) +
          "-" +
          addZero("" + tempDate.getDate())
      );
    });
    $("#SDay").bind("click", function () {
      $("#ent").val(todayValue());
      tempDate = date - 86400000 * 7;
      tempDate = new Date(tempDate);
      $("#stt").val(
        tempDate.getFullYear() +
          "-" +
          addZero("" + (tempDate.getMonth() + 1)) +
          "-" +
          addZero("" + tempDate.getDate())
      );
    });
    $("#go").bind("click", function () {
      mainLunch();
    });
    $("#today").bind("click", function () {
      $("#ent").val(todayValue());
    });
    $("#copyData").bind("click", function () {
      copy();
    });
    var nowTime = () => {
      let d = new Date();
      $("#nowTime").val(
        "" +
          d.getHours() +
          ":" +
          addZero("" + d.getMinutes()) +
          ":" +
          addZero("" + d.getSeconds())
      );
    };
    setInterval(nowTime, 500);
  }, 1500);
});

window.getDayilyData2 = (dateTime, sort) => {
  window.tempVal2 = [];
  let offsetTime = new Date(dateTime);
  offsetTime = offsetTime.getTime() - 86400000 * 1;
  offsetTime = new Date(offsetTime);
  offsetTime =
    offsetTime.getFullYear() +
    "-" +
    addZero("" + (offsetTime.getMonth() + 1)) +
    "-" +
    addZero("" + offsetTime.getDate());

  async function postData(url = "") {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      contentType: "application/json",
      dataType: "json",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "x-xsrf-token": window.xtoken,
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json",
      },
      body:
        '{"filter":{"filterBy":{"duration":["' +
        offsetTime +
        '","' +
        offsetTime +
        '"],"program":"ALL"},"sortBy":{}},"pagination":{"pageNumber":1,"pageSize":25}}',
    });
    return response.json();
  }
  postData("https://seller.walmart.com/api/aurora/financial/getItemSales").then(
    (data) => {
      tempVal2.push([sort, data["data"]]);
      window.fetchFishedCount += 1;
    }
  );
};
