// ==UserScript==
// @name         湖南古树名木管理系统自动提交审批
// @namespace    https://431230.xyz:81
// @version      0.8
// @description  自动提交和审批
// @author       大鹏
// @match        https://lydsj.lyj.hunan.gov.cn:8085/gsmm/*
// @icon         https://lydsj.lyj.hunan.gov.cn:8085/gsmm/favicon.ico
// @grant        none
// @license      大鹏
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/499673/%E6%B9%96%E5%8D%97%E5%8F%A4%E6%A0%91%E5%90%8D%E6%9C%A8%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%E5%AE%A1%E6%89%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/499673/%E6%B9%96%E5%8D%97%E5%8F%A4%E6%A0%91%E5%90%8D%E6%9C%A8%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%E5%AE%A1%E6%89%B9.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var count = 0;
  var jc = 0;
  var timer = 10000;
  var t = setInterval(dp, timer);
  var county = '通道侗族自治县';

  function dp() {
    switch (count) {
      case 0:
        const dtjList = document.querySelectorAll("div.table-left-classification > div");
        if (dtjList.length > 0) {
          for (let i = 0; i < dtjList.length; i++) {
            if (dtjList[i].innerText == '待提交' && dtjList[i + 1].innerText != '0') {
              console.log(dtjList[i].innerText);
              console.log(dtjList[i + 1].innerText);
              dtjList[i].click();
              count = 7;
              clearInterval(t);
              t = null;
              timer = 5000;
              t = setInterval(dp, timer);
            } else if (dtjList[i].innerText == '待办件' && dtjList[i + 1].innerText != '0') {
              console.log(dtjList[i].innerText);
              console.log(dtjList[i + 1].innerText);
              dtjList[i].click();
              count = 7;
              clearInterval(t);
              t = null;
              timer = 5000;
              t = setInterval(dp, timer);
            }
          }
        }
        break;
      case 7:
        const tdList = document.querySelectorAll("tr.ant-table-row.ng-star-inserted");
        if (tdList.length > 0) {
          if (tdList[tdList.length - 1].innerText.indexOf(county) != -1) {
            console.log(county);
            count = 1;
            clearInterval(t);
            t = null;
            timer = 5000;
            t = setInterval(dp, timer);
          } else {
            console.log(tdList[tdList.length - 1].innerText);
            count = 0;
            clearInterval(t);
            t = null;
            timer = 10000;
            t = setInterval(dp, timer);
          }
        }
        break;
      case 1:
        const czanList = document.querySelectorAll("a.ant-dropdown-link.ant-dropdown-trigger");
        if (czanList.length > 0) {
          var event = new Event('mouseenter');
          console.log(jc);
          czanList[jc].dispatchEvent(event);
          console.log('操作');
          count = 2;
          clearInterval(t);
          t = null;
          timer = 1000;
          t = setInterval(dp, timer);
        } else {
          count = 0;
        }
        break;
      case 2:
        const spanList = document.querySelectorAll("li.ant-dropdown-menu-item > a");
        if (spanList.length > 0) {
          for (let i = 0; i < spanList.length; i++) {
            if (spanList[i].innerText == '审批') {
              console.log(spanList[i].innerText);
              spanList[i].click();
              count = 3;
              clearInterval(t);
              t = null;
              timer = 3000;
              t = setInterval(dp, timer);
            }
          }
        } else {
          count = 1;
        }
        break;
      case 3:
        const tjan = document.querySelector("i.anticon.icon.anticon-safety.ng-star-inserted");
        if (tjan) {
          console.log('提交');
          tjan.click();
          count = 4;
          clearInterval(t);
          t = null;
          timer = 1000;
          t = setInterval(dp, timer);
        }
        break;
      case 4:
        const zjwt = document.querySelector("div.ant-modal-title > div.ng-star-inserted");
        if (zjwt) {
          if (zjwt.innerText == '质检问题') {
            console.log(zjwt.innerText);
            document.querySelector("i.anticon.ant-modal-close-icon.anticon-close.ng-star-inserted").click();
            jc++;
          }
          count = 5;
          clearInterval(t);
          t = null;
          timer = 10000;
          t = setInterval(dp, timer);
        }
        break;
      case 5:
        const czqran = document.querySelector("div.ant-modal-content > div.ant-modal-body > form > div > div > button.ant-btn.form-button + button.ant-btn.ant-btn-primary");
        if (czqran) {
          console.log('确认');
          czqran.click();
          count = 6;
        }
        break;
      case 6:
        const gban = document.querySelector("i.anticon.icon.anticon-logout");
        if (gban) {
          console.log('关闭');
          gban.click();
          count = 0;
        }
        break;
    }
  }

})();