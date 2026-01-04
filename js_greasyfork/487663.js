// ==UserScript==
// @version      1.0.9
// @name         汇总抖音直播间数据-油猴脚本
// @namespace    qinshaoyou
// @license      GNU GPLv3
// @description  汇总抖音直播间数据-油猴脚本 try to take over the world!
// @author       You
// @match        https://developer.open-douyin.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/echarts/5.4.3/echarts.min.js
// @antifeature    referral-link 此提示为GreasyFork代码规范要求含有查券功能的脚本必须添加，实际使用无任何强制跳转，代码可查，请知悉。
// @downloadURL https://update.greasyfork.org/scripts/487663/%E6%B1%87%E6%80%BB%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E9%97%B4%E6%95%B0%E6%8D%AE-%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/487663/%E6%B1%87%E6%80%BB%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E9%97%B4%E6%95%B0%E6%8D%AE-%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // Your code here...
  let 抖音统计缓存前缀="dytj_"
  let 抖音目录缓存前缀="douyin_mulu"
  let 自动刷新时间 = 10 * 1000; //秒
  window.onload = function () {
    let 地址 = location.href;
    if (地址.indexOf("https://developer.open-douyin.com/console?") > -1) {
      显示直播间基础数据();
    } else if (
      地址.indexOf("https://developer.open-douyin.com/microapp/") > -1
    ) {
      setTimeout(function () {
        获取直播间基础数据();
      }, 4000);
    }
  };

  let rootDom = document.querySelector("#root");
  let section = document.querySelector("#root>section");
  let divFu = document.createElement("div");
  let div绘制父 = document.createElement("div");
  let 一键清除按钮 = document.createElement("div");

  var 一键清除按钮文字 = document.createTextNode(" 一键清理全部 ");
  function 显示直播间基础数据() {
    div绘制父.style.display = "flex";
    div绘制父.style.flexWrap = "wrap";
    divFu.style.marginTop = "100px";
    divFu.style.marginLeft = "50px";
    divFu.setAttribute("id", "divFu");
    let waijiade = document.createElement("div");
    waijiade.setAttribute("id", "waijiade");
    waijiade.style.marginTop = "50px";
    waijiade.style.display = "flex";
    divFu.appendChild(div绘制父);
    divFu.appendChild(waijiade);
    rootDom.insertBefore(divFu, section);
    一键清除按钮.style.backgroundColor = "red";
    一键清除按钮.style.color = "white";
    一键清除按钮.style.marginTop = "-50px";
    一键清除按钮.style.left = "20px";
    一键清除按钮.style.position = "fixed";
    一键清除按钮.style.zIndex = "102";
    一键清除按钮.style.position = "-50px";
    一键清除按钮.style.width = "150px";
    一键清除按钮.style.padding = "0 10px";
    一键清除按钮.style.borderRadius = "20px";
    一键清除按钮.style.textAlign = "center";
    一键清除按钮.style.cursor = "grab";
    一键清除按钮.appendChild(一键清除按钮文字);
    divFu.insertBefore(一键清除按钮, div绘制父);
    一键清除按钮.addEventListener("click", function () {
      localStorage.setItem(抖音目录缓存前缀, JSON.stringify([]));
      
      // 清除所有的相关缓存
      for (let key in localStorage) {
        if (key.indexOf(抖音统计缓存前缀) > -1) {
          localStorage.removeItem(key);
        }
      }
      location.reload();

      setTimeout(function () {
        location.reload();
      }, 100);
    });


    let 抖音目录数组 = JSON.parse(localStorage.getItem(抖音目录缓存前缀));
    let 处理目录 = [];
    if (!抖音目录数组 || !抖音目录数组.length) {
      return false;
    }
    for (let i = 0; i < 抖音目录数组.length; i++) {
      if (抖音目录数组[i]) {
        处理目录.push(抖音目录数组[i]);
      }
    }
    let 真实目录 = [];
    //删除不存在的目录
    for (let i = 处理目录.length - 1; i >= 0; i--) {
      if (!localStorage.getItem(处理目录[i].name)) {
      } else {
        真实目录.push(处理目录[i]);
      }
    }
    处理目录 = 真实目录;
    localStorage.setItem(抖音目录缓存前缀, JSON.stringify(真实目录));
    for (let i = 处理目录.length - 1; i >= 0; i--) {
      if (处理目录[i]) {
        创建直播间统计div(处理目录[i]);
        绘制折线图外观(处理目录[i]);
      }
    }
  }

  function 创建直播间统计div(当前直播间数据) {
    let div = document.createElement("div");
    div.style.width = "200px";

    var 备注按钮 = document.createElement("span");
    备注按钮.style.color = "green";
    备注按钮.setAttribute("id", "beizhu" + 当前直播间数据.name);
    var 备注文字 = document.createTextNode(" 备注 ");
    备注按钮.appendChild(备注文字);
    备注按钮.addEventListener("click", function () {
      var str = prompt("清输入备注", "");
      if (str) {
        let 抖音目录数组 = JSON.parse(localStorage.getItem(抖音目录缓存前缀));
        for (let i = 0; i < 抖音目录数组.length; i++) {
          if (抖音目录数组[i].name == 当前直播间数据.name) {
            抖音目录数组[i].remark = str;
          }
        }
        localStorage.setItem(抖音目录缓存前缀, JSON.stringify(抖音目录数组));
        setTimeout(function () {
          location.reload();
        }, 1000);
      }
    });

    var 删除按钮 = document.createElement("span");
    删除按钮.style.color = "red";
    删除按钮.setAttribute("id", "shanchuanniu" + 当前直播间数据.name);
    var 删除文字 = document.createTextNode(" 删除 ");
    删除按钮.appendChild(删除文字);
    删除按钮.addEventListener("click", function () {
      let 抖音目录数组 = JSON.parse(localStorage.getItem(抖音目录缓存前缀));
      let 新的抖音目录数组 = [];
      for (let i = 0; i < 抖音目录数组.length; i++) {
        if (抖音目录数组[i].name == 当前直播间数据.name) {
        } else {
          新的抖音目录数组.push(抖音目录数组[i]);
        }
      }
      localStorage.removeItem(当前直播间数据.name);
      localStorage.setItem(抖音目录缓存前缀, JSON.stringify(新的抖音目录数组));     
    });

    var 标题外 = document.createElement("span");
    let 要显示的标题 = 当前直播间数据.name.split("_")[1];
    if (当前直播间数据.remark) {
      要显示的标题 = 要显示的标题 + " " + 当前直播间数据.remark;
    }
    var 标题文字 = document.createTextNode(要显示的标题);
    标题外.appendChild(标题文字);
    标题外.appendChild(备注按钮);
    标题外.appendChild(删除按钮);
    // 标题外.style.fontSize = "x-large";
    标题外.style.fontWeight = "500";
    var divChild = document.createElement("div");
    let 这个直播间统计 = JSON.parse(localStorage.getItem(当前直播间数据.name));
    let 最小的个数 = 30;
    if (这个直播间统计 && 这个直播间统计.length < 30) {
      最小的个数 = 这个直播间统计.length - 1;
    }
    for (let i = 0; i < 最小的个数; i++) {
      let new_trdiv = document.createElement("div");
      new_trdiv.setAttribute("class", "new_trdiv" + 当前直播间数据.name);
      var text时间统计 = document.createTextNode(
        "" +
          这个直播间统计[i]["time_live"] +
          " 人数：" +
          这个直播间统计[i]["user_count"]
      );
      new_trdiv.appendChild(text时间统计);
      divChild.appendChild(new_trdiv);
    }
    // 实时刷新数据
    setInterval(function () {
      这个直播间统计 = JSON.parse(localStorage.getItem(当前直播间数据.name));
      for (let i = 0; i < 最小的个数; i++) {
        let new_trdiv = document.querySelectorAll(
          ".new_trdiv" + 当前直播间数据.name
        );
        new_trdiv[i].innerText =
          "" +
          这个直播间统计[i]["time_live"] +
          " 人数：" +
          这个直播间统计[i]["user_count"];
      }

      let 当前直播间目录 = JSON.parse(localStorage.getItem(抖音目录缓存前缀));

      let 当前折线图上方详细数据DIV = document.getElementById(
        "containerdetails" + 当前直播间数据.name
      );
      for (let i = 0; i < 当前直播间目录.length; i++) {
        if (这个直播间统计[0].roomid == 当前直播间目录[i].roomid) {
          // 当前直播间目录[i]["LivingUserCount"] = allData.LivingUserCount;
          // 当前直播间目录[i]["PerCapitaTime"] = allData.PerCapitaTime;
          // 当前直播间目录[i]["IncreasedFansCount"] = allData.IncreasedFansCount;
          // 当前直播间目录[i]["ProductClickRate"] = allData.ProductClickRate;
          // 当前直播间目录[i]["MicroClickCount"] = allData.MicroClickCount;
          // 当前直播间目录[i]["MicroClickRate"] = allData.MicroClickRate;

          let 新的详情数据 =
            " 小程序点击数:" + 当前直播间目录[i].MicroClickCount + "<br/>";
          新的详情数据 +=
            " 小程序点击率:" +
            parseInt(当前直播间目录[i].MicroClickRate) +
            "%<br/>";
          新的详情数据 +=
            " 最高在线:" +
            parseInt(当前直播间目录[i].LivingUserCount) +
            "人<br/>";
          新的详情数据 +=
            " 人均观看:" +
            parseInt(当前直播间目录[i].PerCapitaTime) +
            "秒<br/>";
          新的详情数据 +=
            " 新增粉丝:" +
            parseInt(当前直播间目录[i].IncreasedFansCount) +
            "人<br/>";
          新的详情数据 +=
            " 商品点击率:" +
            parseInt(当前直播间目录[i].ProductClickRate) +
            "%<br/>";
          当前折线图上方详细数据DIV.innerHTML = 新的详情数据;
          break;
        }
      }
    }, 自动刷新时间);

    div.appendChild(标题外);
    div.appendChild(divChild);
    document.querySelector("#waijiade").appendChild(div);

    //开始循环任务
    setInterval(function () {
      获取直播间统计数据(
        当前直播间数据.appid,
        当前直播间数据.nickname,
        当前直播间数据.logo,
        当前直播间数据.current_createTime,
        当前直播间数据.roomid
      );
    }, 自动刷新时间);
  }

  function 绘制折线图外观(当前直播间数据) {
    let 折线图上方详细数据 = document.createElement("div");
    折线图上方详细数据.style.width = "125px";
    折线图上方详细数据.innerHTML = " 小程序点击数:  <br/>";
    div绘制父.appendChild(折线图上方详细数据);
    let 折线图外观DIV = document.createElement("div");
    折线图外观DIV.setAttribute("id", "container" + 当前直播间数据.name);
    折线图上方详细数据.setAttribute(
      "id",
      "containerdetails" + 当前直播间数据.name
    );
    折线图外观DIV.style.minWidth = "600px";
    折线图外观DIV.style.height = "400px";
    div绘制父.appendChild(折线图外观DIV);

    绘制折线图(当前直播间数据);
  }

  function 绘制折线图(当前直播间数据) {
    let 这个直播间统计 = JSON.parse(localStorage.getItem(当前直播间数据.name));
    let 最小的个数 = 30;
    if (这个直播间统计 && 这个直播间统计.length < 30) {
      最小的个数 = 这个直播间统计.length - 1;
    }
    let yy = [],
      xx = [];
    for (let i = 0; i <= 最小的个数; i++) {
      if (这个直播间统计[i]) {
        yy.push(这个直播间统计[i].user_count);
        xx.push(这个直播间统计[i].time_live.split(" ")[1]);
      }
    }
    xx = xx.reverse();
    yy = yy.reverse();
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(
      document.getElementById("container" + 当前直播间数据.name)
    );

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: 当前直播间数据.remark
          ? 当前直播间数据.remark + " " + 当前直播间数据.name.split("_")[1]
          : 当前直播间数据.name.split("_")[1],
      },
      tooltip: {},
      legend: {
        data: ["销量"],
      },
      xAxis: {
        data: xx,
      },
      yAxis: {},
      series: [
        {
          name: 这个直播间统计[0].time_live.split(" ")[0] + "在线人数 ",
          type: "line",
          data: yy,
        },
      ],
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    setInterval(function () {
      这个直播间统计 = JSON.parse(localStorage.getItem(当前直播间数据.name));
      这个直播间统计 = JSON.parse(localStorage.getItem(当前直播间数据.name));
      最小的个数 = 30;
      if (这个直播间统计 && 这个直播间统计.length < 30) {
        最小的个数 = 这个直播间统计.length - 1;
      }
      xx = [];
      yy = [];
      for (let i = 0; i <= 最小的个数; i++) {
        if (这个直播间统计[i]) {
          yy.push(这个直播间统计[i].user_count);
          xx.push(这个直播间统计[i].time_live.split(" ")[1]);
        }
      }
      xx = xx.reverse();
      yy = yy.reverse();
      myChart.setOption({
        xAxis: {
          data: xx,
        },
        series: [
          {
            data: yy,
          },
        ],
      });
    }, 自动刷新时间);
  }

  function 获取直播间基础数据() {
    let current_appid = GetQueryString("appid");
    let current_createTime = GetQueryString("createTime");
    let RoomID = GetQueryString("roomId");
    let tab = GetQueryString("tab");
    if (tab == "living" && current_appid && current_createTime && RoomID) {
      $.ajax({
        url:
          "https://developer.open-douyin.com/bff_api/app/console/" +
          current_appid +
          "/appmanagerservice/mGetApplicationInfoByAppId?appid=" +
          current_appid +
          "&applicationType=1",
        success: function (result) {
          let allData = result.data.applicationInfoMap[current_appid];
          获取直播间统计数据(
            allData.applicationId,
            allData.applicationName,
            allData.applicationIconUrl,
            current_createTime,
            RoomID
          );
        },
      });
    }
  }
  function 获取直播间统计数据(appid, name, logo, current_createTime, RoomID) {
    let 当前时间 = parseInt(new Date().getTime() / 1000 - 60 * 60);
    当前时间 = current_createTime;
    let localKey =抖音统计缓存前缀 + name + "_" + RoomID;

    let 目录缓存 = localStorage.getItem(抖音目录缓存前缀)
      ? localStorage.getItem(抖音目录缓存前缀)
      : "[]";
    if (目录缓存.indexOf(localKey) > -1) {
    } else if (name) {
      目录缓存 = JSON.parse(目录缓存);
      目录缓存.push({
        name: localKey,
        roomid: RoomID,
        current_createTime: current_createTime,
        appid: appid,
        logo: logo,
        nickname: name,
        remark: "",
      });
      localStorage.setItem(抖音目录缓存前缀, JSON.stringify(目录缓存));
    }
    获取直播间点击数等数据(appid, name, logo, current_createTime, RoomID);
    $.ajax({
      url:
        "https://developer.open-douyin.com/bff_api_v2/app/merchant/dataservice/getTradeDataByRoomInfo?AppID=" +
        appid +
        "&CreateTime=" +
        当前时间 +
        "&RoomID=" +
        RoomID +
        "&TpAppID=",
      success: function (result) {
        let allData = result.data.OrderInfo.UserCount;

        allData.sort((a, b) => {
          return a.key - b.key;
        });
        let oldTonjig = JSON.parse(localStorage.getItem(localKey));
        if (!oldTonjig) {
          oldTonjig = [];
          localStorage.setItem(localKey, JSON.stringify(oldTonjig));
        }

        for (let i = 0; i < allData.length - 1; i++) {
          if (
            oldTonjig &&
            oldTonjig.length &&
            oldTonjig[0].time_live < TimestampToDate2(allData[i].key * 1000)
          ) {
            oldTonjig.unshift({
              name: name,
              roomid: RoomID,
              time_live: TimestampToDate2(allData[i].key * 1000),
              user_count: allData[i].value,
              img: logo,
              appid: appid,
            });
          }
          if (!oldTonjig.length) {
            oldTonjig.push({
              name: name,
              roomid: RoomID,
              time_live: TimestampToDate2(allData[i].key * 1000),
              user_count: allData[i].value,
              img: logo,
              appid: appid,
            });
          }
        }
        // 最多统计半小时详细数据
        oldTonjig.splice(100,oldTonjig.length-99)
        localStorage.setItem(localKey, JSON.stringify(oldTonjig));
      },
    });
  }

  function 获取直播间点击数等数据(
    appid,
    name,
    logo,
    current_createTime,
    RoomID
  ) {
    let 当前时间 = parseInt(new Date().getTime() / 1000 - 60 * 60);
    当前时间 = current_createTime;
    $.ajax({
      url:
        "https://developer.open-douyin.com/bff_api_v2/app/merchant/dataservice/getBaseDataByRoomInfo?AppID=" +
        appid +
        "&CreateTime=" +
        当前时间 +
        "&RoomID=" +
        RoomID +
        "&TpAppID=",
      success: function (result) {
        if (
          result &&
          result.data &&
          typeof result.data.LiveBaseInfo != "undefined" &&
          result.data.LiveBaseInfo
        ) {
          let allData = result.data.LiveBaseInfo;
          let 老抖音目录 = JSON.parse(localStorage.getItem(抖音目录缓存前缀));
          for (let i = 0; i < 老抖音目录.length; i++) {
            if (RoomID == 老抖音目录[i].roomid) {
              老抖音目录[i]["LivingUserCount"] = allData.LivingUserCount;
              老抖音目录[i]["PerCapitaTime"] = allData.PerCapitaTime;
              老抖音目录[i]["IncreasedFansCount"] = allData.IncreasedFansCount;
              老抖音目录[i]["ProductClickRate"] = allData.ProductClickRate;
              老抖音目录[i]["MicroClickCount"] = allData.MicroClickCount;
              老抖音目录[i]["MicroClickRate"] = allData.MicroClickRate;
              break;
            }
          }
          localStorage.setItem(抖音目录缓存前缀, JSON.stringify(老抖音目录));
        }
      },
    });
  }
  function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null) context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined"
      ? ""
      : context;
  }
  function TimestampToDate2(Timestamp) {
    let now = new Date(Timestamp),
      y = now.getFullYear(),
      m = now.getMonth() + 1,
      d = now.getDate();
    return (
      // y +
      // "-" +
      (m < 10 ? "0" + m : m) +
      "-" +
      (d < 10 ? "0" + d : d) +
      " " +
      now.toTimeString().substr(0, 5)
    );
  }
})();
