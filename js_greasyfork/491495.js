// ==UserScript==
// @name         G7s
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  AutoInput Text
// @author       TANG YANJI
// @match        https://g7s.ucenter.huoyunren.com/app/ucenter/login.html
// @match        https://g7s.huoyunren.com/*
// @match        https://truck.g7s.huoyunren.com/v2/monitor/index.html?__displayrunner__=gateway
// @icon         https://www.google.com/s2/favicons?sz=64&domain=g7s.huoyunren.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491495/G7s.user.js
// @updateURL https://update.greasyfork.org/scripts/491495/G7s.meta.js
// ==/UserScript==
var centerLng = 113.153625;
var centerLat = 23.383647;
var inputValue1 = atob("Zmp5MDAx");
var inputValue2 = atob("R3Vhbmd6aG91MTIz");


var checkExistInterval = setInterval(function () {
  var element = document.getElementsByClassName("el-input__inner");
  if (element.length > 1) {
    console.log("元素已找到:", element);

    var inputEvent = new Event("input", {
      bubbles: true,  // 允许事件冒泡
      cancelable: true  // 允许事件被取消
    });

    var username = element.item(1)
    username.value = inputValue1;
    username.dispatchEvent(inputEvent);

    var password = element.item(2)
    password.value = inputValue2;
    password.dispatchEvent(inputEvent);
    //login
    document.getElementsByClassName("el-button login-box--button el-button--default el-button--small")[0].click()
    clearInterval(checkExistInterval);
  }
}, 1000); // 每隔1秒执行一次检查


var intervalCheckUrl = setInterval(() => {
  var url =  window.location.href 
  if ((url == 'https://g7s.huoyunren.com/#home.html') || (url == 'https://g7s.huoyunren.com/gscc/#/')) {
    window.location.href = 'https://truck.g7s.huoyunren.com/v2/monitor/index.html?__displayrunner__=gateway'
    clearInterval(intervalCheckUrl)
  }
}, 1000 * 1)

var interval2 = setInterval(() => {
  console.log('check monitor')
  if (window.g7smap_monitor) {
    var map = window.g7smap_monitor.map
    //设置地图等级（大小）
    map.Na = 13
    map.HG()

    setTimeout(() => {
      //设置中心点
      initCenter()
    }, 1000);
    //禁止滚轮缩放
    map.disableScrollWheelZoom()
    document.querySelector("#topTool").style.visibility='hidden'
    document.querySelector("#map_container > div.g7smap_tool").style.visibility = 'hidden'
    document.querySelector("#alarmArea").style.visibility='hidden'
    var car = document.querySelector("#setting_plate")
    if (car == null) {
        document.getElementById("monitor_setting_btn").click()
    }
    if (car.checked == false) {
        car.click()
    }

    var space = document.querySelector("#\\38 77F29E4D530D8D318BF678521758A39")
    if (space.checked == false) {
        space.click()
    }
    var spacename = document.querySelector("#setting_polygonName")
    if (spacename.checked == false){
      spacename.click()
    }
    clearInterval(interval2)
  }
}, 1000 * 1)

window.addEventListener('resize',function(){
  setTimeout(() => {
    initCenter()
  }, 500);
})


function initCenter(){
  var center = new BMap.Point(centerLng,centerLat)
  window.g7smap_monitor.map.setCenter(center)
}

//每10分钟自动回到中心
setInterval(() => {
  initCenter()
}, 10 * 60 * 1000);
