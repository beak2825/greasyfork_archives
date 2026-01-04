// ==UserScript==
// @name        Automatic registration for spdpo credit activities
// @name:zh-CN  spdpo学分活动自动报名
// @namespace   Violentmonkey Scripts
// @match       https://spdpo.nottingham.edu.cn/study/selection/activitydetail/*
// @grant       none
// @version     1.0
// @author      mxdh(面向大海)
// @description Visit the page of the activitiy you want to register for, the script will automatically get the registration start time and register on time. Be careful not to close the page or make it hang.
// @description:zh-CN 访问你要报名的活动页面，脚本会自动获取报名开始时间并按时报名。注意不要关掉页面或使页面挂起。
// @license     GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/461674/Automatic%20registration%20for%20spdpo%20credit%20activities.user.js
// @updateURL https://update.greasyfork.org/scripts/461674/Automatic%20registration%20for%20spdpo%20credit%20activities.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const pn=window.location.pathname;

  console.log(pn);

  var scheduleId = pn.split('/')[4];

  console.log(scheduleId);

  var param = {
    ScheduleId: scheduleId,
  };

  const regStartTimeString=document.getElementById('divRegStart').innerHTML;
  var waitTime=Date.parse(regStartTimeString)-Date.now()-300;

  if (waitTime<0) waitTime=0;

  console.log(waitTime);

  setTimeout(try_reg, waitTime);

  function try_reg() {
    var requestLogin = $.post("/study/Selection/StudentSelection", param, null, "json");
    var whenRequest = $.when(requestLogin);
    whenRequest.done(function (returnLogin) {
      Alert(returnLogin.message);
      if (returnLogin.result==false)
        setTimeout(try_reg, 300);

    });
  }
})();