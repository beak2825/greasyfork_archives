// ==UserScript==
// @name         TsTools for AHM Beta
// @namespace    TsTools.AHM
// @version      1.0.11
// @description  AHM用户体验增强插件，支持故障页快速查询航班计划信息。
// @author       Johnson-62117
// @match        http://ahm.xiamenair.com.cn/ahm/*
// @match        https://ahm.xiamenair.com.cn/ahm/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// require      file://D:\TsTools\dev.js
// @downloadURL https://update.greasyfork.org/scripts/430672/TsTools%20for%20AHM%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/430672/TsTools%20for%20AHM%20Beta.meta.js
// ==/UserScript==

//http://ahm.xiamenair.com.cn/ahm/html/fault_process/fault_process/fp_list_menu/fault_see.html故障日志详细页面

var MAX_FLIGHTPLAN_DAY = 3; //获取飞行计划天数
var MAX_FLIGHTDATA_DAY = 2;//获取实际飞行数据天数（包括当日）
var REFRESH_INTERVAL = 30; //设置航班信息刷新间隔（单位：秒）

var iframe, divFlightInfo, divMsg;


sessionStorage.removeItem("isFaultPage");
sessionStorage.div_acList_open = 0

$("#reset").after(`<span id='btnGetFlightInfo' class='label btn btn-info glyphicon glyphicon-send' style='float: right;margin-right: 5px;'>刷新航班数据</span></div>`);
//iframe加载完毕后执行初始化操作
$("iframe").load(function () {
  
  console.log("load ok");
  var src = $("iframe#contentFrame").attr("src");
  if(src.indexOf("fault_process") > 0){
    //和故障处置相关页面载入才执行的操作
    getACReg();
  }
  if (src.indexOf("fault_process/faultprocess_list.html") < 0) {
    console.log("不是故障处置页");
    return;
  }
  if (src.indexOf("fault_process/faultprocess_list.html") > 0) {
  //故障处置页  
    sessionStorage.isFaultPage = true;
    iframe = $("iframe").contents();
    iframe.find("div#addwin").after(`<div id='divFlightInfo'></div>`).after(`<div id='divMsg'></div>`);
    iframe.find(".guzhanrizhi").attr("colSpan",2);
    // iframe.find(".faultDate").before(`
    // <tr>
    //   <td align="right" id="td_check">
    //   <span class="k-icon k-i-rss "></span> 航班快查：</td>
    //   <td>
    //     <input id="info_acReg"/>
    //   </td>
    // </tr>
    // `);
    iframe.find(".faultLogWorkDate:last").after(`
    <td align="right" id="td_check" style="border-bottom:#0000FF solid 1px;">
      <span class="k-icon k-i-rss " ></span> 航班快查：
    </td>
    <td class="faultLogWorkDate">
      <div><input id="info_acReg"/></div>
    </td>
    `);
    
    setTimeout(function () {
      iframe.find("#info_acReg").kendoComboBox({
        placeholder: "请输入机号",
        template: "#= AC_REG # (#= AC_TYPE #) | #=CARRIER# <br/>布局：#=LAYOUT#",
        filter: "contains",
        dataTextField: "AC_REG",
        dataValueField: "AC_REG",
        dataSource: JSON.parse(sessionStorage.getItem("acRegList")),
        open:function(){
          sessionStorage.div_acList_open = 1
        },
        close:function(){
          sessionStorage.div_acList_open = 0
        },
        change:function(){
          console.log("change");
          if((ac.value().length == 4) && (ac.value().indexOf("B-")<0) || (ac.value().length == 6)){
            var reg = (ac.value().length == 6)?ac.value():`B-${ac.value()}`;
            var plan = filterDataByReg(reg,JSON.parse(sessionStorage.flightPlan));
            var data = filterDataByReg(reg,JSON.parse(sessionStorage.flightData));
            showFlightInfo(reg,data,plan);
          }
        },
        filtering: function () {
          setTimeout(() => {
            if (sessionStorage.div_acList_open == 0) {
              ac.open();
            }
          }, 130);
        }
      });
      ac = iframe.find("#info_acReg").data("kendoComboBox");
      ac.ul.parent().parent().css({position:"absolute","top":81})
    },1500);

    divFlightInfo = iframe.find("div#divFlightInfo");
    divMsg = iframe.find("div#divMsg");
    divFlightInfo.kendoWindow({
      title: "航班信息",
      //content: "This is your Kendo Dialog.",
      //modal: false,
      width: "680px",
      visible: false
    });
    divFlightInfo = divFlightInfo.data("kendoWindow");


    //初始化载入所有数据
    getFlightPlan(1, true);
    getFlightData(0, true);

    //每隔30秒刷新一次当日航班数据
    setInterval(function () {
      getFlightData(0, false);
    }, 1000 * REFRESH_INTERVAL);

    //航班信息窗口以外点击，自动关闭航班窗口
    $("div#divFlightInfo").blur(function (e) {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        $("div#divFlightInfo").focus();
        divFlightInfo.close();
        return;
      }
      //设置一个延时，防止焦点一丢失就没办法关闭窗口
      setTimeout(function () {
        $("div#divFlightInfo").focus();
      }, 500);
    });
  }

});

$("#btnGetFlightInfo").on("click", function (e) {
  //手动刷新航班信息
  getFlightPlan(1, true);
  getFlightData(0, true);
});

//没法判断表格什么时候加载完毕，因此每隔2秒对表格事件进行绑定
setInterval(function () {
  /*
   var td=this.parentNode,tr=td.parentNode;
   alert('点击了第'+(tr.rowIndex+1)+'行，第'+(td.cellIndex+1)+'列')
  */
  var logItem = $("iframe").contents().find("div#faultprocesslist td div");
  if (logItem.length > 0) {
    //循环绑定事件需要对原click事件进行接棒，否则会多次响应
    logItem.off('click').on('click', function (e) {
      if ((sessionStorage.getItem("flightData") == null) || (sessionStorage.getItem("flightPlan") == null)) {
        showNotification("尚未获取飞行计划和飞行数据，请点击刷新数据后重试", "warning");
        return;
      }
      //如果鼠标移动到前四列（故障日期-航班号）之间
      if (($(this).parent().index()) < 5) {
        acReg = ($(this).parent()).parent().children('td').eq(2).children(":first").text();
        console.log(acReg);
        //获取选中飞机的航班信息
        var flightPlan = JSON.parse(sessionStorage.flightPlan);
        var flightData = JSON.parse(sessionStorage.flightData);
        // var filter_flightData = {};
        // var filter_flightPlan = {};
        // for (plan in flightPlan) {
        //   filter_flightPlan[plan] = flightPlan[plan].filter(function (n) {
        //     return n.AC_REG == acReg;
        //   })
        // }
        // for (data in flightData) {
        //   filter_flightData[data] = flightData[data].filter(function (n) {
        //     return n.AC_REG == acReg;
        //   })
        // }
        var filter_flightPlan = filterDataByReg(acReg,flightPlan);
        var filter_flightData = filterDataByReg(acReg,flightData);
        console.log(getFlightDataStr(filter_flightData[0]));
        showFlightInfo(acReg,filter_flightData,filter_flightPlan);
      }
    });
  }

}, 2000);

function filterDataByReg(acReg,dataToBeFiltered){
  var filtered_data = {};
  for (data in dataToBeFiltered) {
    filtered_data[data] = dataToBeFiltered[data].filter(function (n) {
      return n.AC_REG == acReg;
    })
  }
  //return JSON.stringify(filtered_data); 
  return filtered_data;
}

function showFlightInfo(acReg,filter_flightData,filter_flightPlan) {
  divFlightInfo.open().title(`<h3><b>${acReg}</b>航班信息</h3>`).content(function () {
    return `<ul id="ulFlightInfoPanel">
        <li id="divDay-2"><h2>${getDateString(-2)}  ${isNoFlight(filter_flightData[2])}${getFlightDataStr(filter_flightData[2])}</h2><div id='divFlightData_day-2'></div></li>
        <li id="divDay-1"><h2>${getDateString(-1)}（昨天）  ${isNoFlight(filter_flightData[1])}${getFlightDataStr(filter_flightData[1])}</h2><div id='divFlightData_day-1'></div></li>
        <li id="divDay0" class="k-state-active"><h2>${getDateString(0)}（今天）  ${isNoFlight(filter_flightData[0])}${getFlightDataStr(filter_flightData[0])}</h2><div id='divFlightData_day0'></div></li>
        <li id="divDay1" class="k-state-active"><h2>${getDateString(1)}（明天）  ${isNoFlight(filter_flightPlan[1])}${getFlightPlanStr(filter_flightPlan[1])}</h2><div id='divFlightPlan_day1'></div></li>
        <li id="divDay2"><h2>${getDateString(2)}  ${isNoFlight(filter_flightPlan[2])}${getFlightPlanStr(filter_flightPlan[2])}</h2><div id='divFlightPlan_day2'></div></li>
    </ul>`
    //这段代码不包含折叠功能
    /*return `${getDateString(0)}<div id='divFlightData_day0'></div> 
     ${getDateString(1)}<div id='divFlightPlan_day1'></div> 
    ${getDateString(2)} <div id='divFlightPlan_day2'></div> 
    航班历史<br/>
    ${getDateString(-2)} <div id='divFlightData_day-2'></div> 
    ${getDateString(-1)} <div id='divFlightData_day-1'></div>`*/
  });
  //console.log(filter_flightData);
  //console.log(filter_flightPlan);
  $("#ulFlightInfoPanel").kendoPanelBar({
    expandMode: "multiple"
  });

  loadFlightDataToGrid(filter_flightData[0], "divFlightData_day0");
  loadFlightDataToGrid(filter_flightData[1], "divFlightData_day-1");
  loadFlightDataToGrid(filter_flightData[2], "divFlightData_day-2");

  loadFlightPlanToGrid(filter_flightPlan[1], "divFlightPlan_day1");
  loadFlightPlanToGrid(filter_flightPlan[2], "divFlightPlan_day2");
}

function showNotification(msg = "系统消息", msgType = "info") {
  //"info", "success", "warning", and "error"
  var wnd = $("div#divMsg");
  if (wnd.length == 0) {
    wnd = $("iframe#contentFrame").contents().find("div#divMsg");
  }
  wnd = wnd.kendoNotification({
    stacking: "up",
    autoHideAfter: 5000
  }).data("kendoNotification");
  wnd.show(msg, msgType);
}

//判断航班是否全天停场
function isNoFlight(flightData = []) {
  if (flightData.length == 0) {
    return "全天停场";
  }
  return "";
}

//将航班数据载入指定id的div中
function loadFlightDataToGrid(flightData, divIDForGird) {
  $(`div#${divIDForGird}`).kendoGrid({
    dataSource: {
      data: flightData,
      schema: {
        model: {
          fields: {
            FLIGHT_NO: { type: "string" },
            DEPARTURE: { type: "string" },
            STAND_OUT: { type: "string" },
            STD: { type: "date" },
            ETD: { type: "date" },
            ATD: { type: "date" },
            ARRIVAL: { type: "string" },
            STAND_INN: { type: "string" },
            STA: { type: "date" },
            ETA: { type: "date" },
            ATA: { type: "date" },
            CAPTAIN_NAME: { type: "string" }
          }
        }
      },
      sort: { field: "STD", dir: "asc" }
    },
    sortable: true,
    scrollable: false,
    columns: [
      { field: "FLIGHT_NO", title: "航班号" },
      { field: "DEPARTURE", title: "起飞" },
      { field: "STAND_OUT", title: "出港机位" },
      { field: "STD", title: "计飞", format: "{0: HH:mm}" },
      { field: "ETD", title: "预飞", format: "{0: HH:mm}" },
      { field: "ATD", title: "实飞", format: "{0: HH:mm}" },
      { field: "ARRIVAL", title: "到达", format: "{0: HH:mm}" },
      { field: "STAND_INN", title: "进港机位" },
      { field: "STA", title: "计达", format: "{0: HH:mm}" },
      { field: "ETA", title: "预达", format: "{0: HH:mm}" },
      { field: "ATA", title: "实达", format: "{0: HH:mm}" },
      { field: "CAPTAIN_NAME", title: "机长" }
    ]
  });
}

function loadFlightPlanToGrid(flightPlan, divIDForGird) {
  $(`div#${divIDForGird}`).kendoGrid({
    dataSource: {
      data: flightPlan,
      schema: {
        model: {
          fields: {
            FLIGHT_NO: { type: "string" },
            DEPCITY: { type: "string" },
            STD1: { type: "date" },
            ARRCITY1: { type: "string" },
            STA1: { type: "date" },
            STD2: { type: "date" },
            ARRCITY2: { type: "string" },
            STA2: { type: "date" }
          }
        }
      }
    },
    sortable: true,
    scrollable: false,
    columns: [
      { field: "FLIGHT_NO", title: "航班号" },
      { field: "DEPCITY", title: "起飞" },
      { field: "STD1", title: "计飞", format: "{0: HH:mm}" },
      { field: "ARRCITY1", title: "到达1" },
      { field: "STA1", title: "计达1", format: "{0: HH:mm}" },
      { field: "STD2", title: "计飞", format: "{0: HH:mm}" },
      { field: "ARRCITY2", title: "到达2", format: "{0: HH:mm}" },
      { field: "STA2", title: "计达", format: "{0: HH:mm}" }
    ]
  });
}

//获取航班数据字符串
function getFlightDataStr(flightData) {
  if (flightData.length == 0) {
    return "";
  }
  var idx = flightData.length - 1;
  var str = `${flightData[idx].DEPARTURE}-${flightData[idx].ARRIVAL}`;
  if (flightData.length > 1) {
    for (var i = idx - 1; i >= 0; i--) {
      str = `${str}-${flightData[i].ARRIVAL}`
    }
  }
  return str;
}

//获取航班计划字符串
function getFlightPlanStr(flightPlan) {
  if (flightPlan.length == 0) {
    return "";
  }
  var str = `${flightPlan[0].DEPCITY}-${flightPlan[0].ARRCITY1}${flightPlan[0].ARRCITY2==null?"":"-" + flightPlan[0].ARRCITY2}`;
  if(flightPlan.length>1){
    for(var i=1;i<flightPlan.length;i++)
    str = `${str}-${flightPlan[i].ARRCITY1}${flightPlan[i].ARRCITY2==null?"":"-" + flightPlan[i].ARRCITY2}`
  }
  return str;
}

//获取日期字符串
function getDateString(day_diff = 0) {
  var required_date = new Date();
  required_date.setDate(required_date.getDate() + day_diff)
  var str_date = required_date.getFullYear() + '-' + (required_date.getMonth() + 1) + '-' + required_date.getDate();
  return str_date;
}
//获取航班信息
function getFlightPlan(day_diff = 1, refreshAllFlighPlan = false) {
  // 飞行信息： http://aoc.xiamenair.com.cn/api/flight/gantt/?startDate=2021-08-08&endDate=2021-08-08&carrier=MF
  // 飞行计划：http://aoc.xiamenair.com.cn/api/flight/inOutPortFlightInfo/?flightDate=" + str_date + "&carrier=ALL
  /*
    如果refreshAllFlighPlan为真，表示需要刷新航班数据，航班数据默认获取明天的数据
    在sessionStorage存放内容说明：
      flightPlan 飞行数据 
      planIndex指向最新需要更新的地址
    */
  var flightPlan = sessionStorage.getItem("flightPlan");
  if (flightPlan == null) {
    sessionStorage.setItem("flightPlan", "{}");
  }
  if (refreshAllFlighPlan == true) {
    //refreshAllFlighPlan == true 表示需要刷新全部数据
    sessionStorage.setItem("refreshAllFlighPlan", refreshAllFlighPlan);
    sessionStorage.setItem("planIndex", day_diff);
  }
  var required_date = new Date();
  required_date.setDate(required_date.getDate() + day_diff)
  var str_date = required_date.getFullYear() + '-' + (required_date.getMonth() + 1) + '-' + required_date.getDate();

  var targetURL = "http://aoc.xiamenair.com.cn/api/flight/inOutPortFlightInfo/?flightDate=" + str_date + "&carrier=ALL";


  GM_xmlhttpRequest({
    method: "GET",
    url: targetURL,
    onload: function (res) {
      if (res.status == 200) {
        res = JSON.parse(res.responseText);
        res = res.result
        if (sessionStorage.getItem("refreshAllFlighPlan") == "true") {
          //刷新全部数据，获取flightPlan 并且将数据更新入对应的planIndex内
          var flightPlan = JSON.parse(sessionStorage.getItem("flightPlan"));
          var planIndex = parseInt(sessionStorage.getItem("planIndex"));
          flightPlan[planIndex] = res;
          sessionStorage.setItem("flightPlan", JSON.stringify(flightPlan));
          planIndex = planIndex + 1;
          if (planIndex > MAX_FLIGHTPLAN_DAY) {
            sessionStorage.setItem("planIndex", 1);
            sessionStorage.removeItem("refreshAllFlighPlan");
            console.log("plan ok");
            return;
          }
          else {
            sessionStorage.setItem("planIndex", planIndex);
            //再次回调确保数据获取完成
            return getFlightPlan(planIndex, true);
          }
        }
        else {
          //获取某一天的数据，将数据存入oneTime_flightPlan
          sessionStorage.setItem("oneTime_flightPlan", res);
        }
      }
      if (res.status == 401) {
        showNotification("TsTools提示：无法连接到运行网系统。请访问运行网http://aoc.xiamenair.com.cn确认登录状态。", "error");
      }
    }
  });
}

function getFlightData(day_diff = 0, refreshAllFlightData = false) {
  // 飞行信息： http://aoc.xiamenair.com.cn/api/flight/gantt/?startDate=2021-08-08&endDate=2021-08-08&carrier=MF
  /*
    如果refreshAllFlightData为真，表示需要刷新航班数据
    在sessionStorage存放内容说明：
      flightData 飞行数据 
      flightDataIndex指向最新需要更新的地址
    */
  var flightData = sessionStorage.getItem("flightData");
  if (flightData == null) {
    sessionStorage.setItem("flightData", "{}");
  }
  if (refreshAllFlightData == true) {
    //refreshAllFlightData == true 表示需要刷新全部数据
    sessionStorage.setItem("refreshAllFlightData", refreshAllFlightData);
    sessionStorage.setItem("flightDataIndex", day_diff);
  }
  if ((refreshAllFlightData == false) && (day_diff == 0)) {
    //表示刷新当日数据
    sessionStorage.setItem("refreshTodayData", true);
  }
  var required_date = new Date();
  required_date.setDate(required_date.getDate() - day_diff)
  var str_date = required_date.getFullYear() + '-' + (required_date.getMonth() + 1) + '-' + required_date.getDate();

  var targetURL = "http://aoc.xiamenair.com.cn/api/flight/gantt/?startDate=" + str_date + "&endDate=" + str_date + "&carrier=ALL";
  GM_xmlhttpRequest({
    method: "GET",
    url: targetURL,
    onload: function (res) {
      if (res.status == 200) {
        //console.log(res.response);
        res = JSON.parse(res.responseText);
        res = res.result
        flightDataIndex = parseInt(sessionStorage.getItem("flightDataIndex"));
        if ((sessionStorage.getItem("refreshAllFlightData") == "true")) {
          //刷新全部数据，获取flightData 并且将数据更新入对应的flightDataIndex内
          var flightData = JSON.parse(sessionStorage.getItem("flightData"));
          var flightDataIndex = parseInt(sessionStorage.getItem("flightDataIndex"));
          flightData[flightDataIndex] = res;
          sessionStorage.setItem("flightData", JSON.stringify(flightData));
          flightDataIndex = flightDataIndex + 1;
          if (flightDataIndex > MAX_FLIGHTDATA_DAY) {
            sessionStorage.setItem("flightDataIndex", 0);
            sessionStorage.removeItem("refreshAllFlightData");
            console.log("data ok");
            return;
          }
          else {
            sessionStorage.setItem("flightDataIndex", flightDataIndex);
            //再次回调确保数据获取完成
            return getFlightData(flightDataIndex, true);
          }
        }
        else {
          if (sessionStorage.getItem("refreshTodayData") == "true") {
            //刷新当日数据
            sessionStorage.removeItem("refreshTodayData");
            var flightData = JSON.parse(sessionStorage.getItem("flightData"));
            var flightDataIndex = parseInt(sessionStorage.getItem("flightDataIndex"));
            flightData[0] = res;
            sessionStorage.setItem("flightData", JSON.stringify(flightData));
            console.log("今日数据已刷新");
            return;
          }
          //获取某一天的数据，将数据存入oneTime_flightData
          sessionStorage.setItem("oneTime_flightData", res);
        }
      }
      if (res.status == 401) {
        showNotification(`TsTools提示：无法连接到运行网系统。请访问运行网http://aoc.xiamenair.com.cn确认登录状态。`, "error");
      }
    }
  });
}

function getACReg(){
  //获取所有飞机信息： http://aoc.xiamenair.com.cn/api/basic/aircraftDetailInfo/
  var targetURL = `http://aoc.xiamenair.com.cn/api/basic/aircraftDetailInfo/`;
  GM_xmlhttpRequest({
    method: "GET",
    url: targetURL,
    onload: function (res) {
      if (res.status == 200) {
        //console.log(res.response);
        res = JSON.parse(res.responseText);
        res = res.result;
        sessionStorage.setItem("acRegList",JSON.stringify(res));
      }
      if (res.status == 401) {
        showNotification(`TsTools提示：无法连接到运行网系统。请访问运行网http://aoc.xiamenair.com.cn确认登录状态。`, "error");
      }
    }
  });
}
