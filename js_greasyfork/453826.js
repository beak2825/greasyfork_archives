// ==UserScript==
// @name         湖北大学校园网样式修改
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修改校园网登录界面样式
// @author       You
// @match        http://202.114.144.21/*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/453826/%E6%B9%96%E5%8C%97%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/453826/%E6%B9%96%E5%8C%97%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function () {
  "use strict";
  //add bg-img
  var imgArr = document.getElementsByTagName("img");
  imgArr[0].src = "https://gee.li/temp/2209/43e21e97f3622c7a.jpg";
  //delete tips
  var rowFluid = document.getElementsByClassName("row-fluid")[2];
  var notice = document.getElementsByClassName("span5")[0];
  var span1 = document.getElementsByClassName("span1")[0];
  rowFluid.removeChild(notice);
  rowFluid.removeChild(span1);

  //modify style
  var container = document.getElementsByClassName("container-fluid")[0];
  container.style.background = "transparent";
  container.style.margin = 0;

  //delete logo
  var logo = document.getElementById("logo");
  if (logo) {
    logo.remove();
  }

  var row = document.getElementById("row");
  if (row) {
    row.remove();
  }
})();
