// ==UserScript==
// @name         山西农业大学信息学院 教务系统 CISAU
// @version      1.5
// @description  任何浏览器上登陆山西农业大学信息学院教务系统。 环境设计1606朱宇轩 17635388838
// @author       china朱宇轩
// @match       http://jwxt.cisau.com.cn:9090/*
// @match       http://jwxt.cisau.com.cn:9091/*
// @grant        none
// @namespace https://greasyfork.org/users/230858
// @downloadURL https://update.greasyfork.org/scripts/375253/%E5%B1%B1%E8%A5%BF%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%E4%BF%A1%E6%81%AF%E5%AD%A6%E9%99%A2%20%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%20CISAU.user.js
// @updateURL https://update.greasyfork.org/scripts/375253/%E5%B1%B1%E8%A5%BF%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%E4%BF%A1%E6%81%AF%E5%AD%A6%E9%99%A2%20%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%20CISAU.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var w = top.topFrame.document.getElementsByTagName("a");
    for(var i = 0;i < 7;i++)
    w[i+1].cIndex = i;
    if (typeof top.bottomFrame.mainFrame.setFlag() == 'function')
      top.bottomFrame.mainFrame.setFlag()
})();