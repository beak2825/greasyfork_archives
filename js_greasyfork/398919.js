// ==UserScript==
// @name         NEU-stuinfo-autocompleter
// @namespace    https://e-report.neu.edu.cn/
// @description  东北大学师生健康信息上报平台的自动填写，自动提交
// @version      1.7.1
// @author       Marshall Sun
// @match        https://e-report.neu.edu.cn/notes/create
// @match        https://e-report.neu.edu.cn/report/forms/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398919/NEU-stuinfo-autocompleter.user.js
// @updateURL https://update.greasyfork.org/scripts/398919/NEU-stuinfo-autocompleter.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (window.location.href.substr(0, 33) == "https://e-report.neu.edu.cn/notes") {
    var r = confirm(
      "请确认你满足下列所有条件：\n\n" +
      "1.本次为本人上报\n" +
      "2.目前身体状况正常\n" +
      "3.所处位置无变化\n" +
      "\n你是否确认？"
    );
    if (r == true) {
      document.getElementsByName("jibenxinxi_shifoubenrenshangbao")[0].click();
      document.getElementsByName("jiankangxinxi_muqianshentizhuangkuang")[0].click();
      setTimeout(() => (document.getElementsByName("xingchengxinxi_weizhishifouyoubianhua")[1].click()), 900);
      setTimeout(() => (document.getElementsByTagName("button")[2].click()), 1000);
    }
  }

  if (window.location.href.substr(0, 34) == "https://e-report.neu.edu.cn/report") {
    document.getElementsByTagName("input")[1].click();
    document.getElementsByTagName("input")[3].click();
    document.getElementsByTagName("input")[5].click();
    document.getElementsByTagName("input")[7].click();
    document.getElementsByTagName("input")[9].click();
    setTimeout(() => (document.getElementsByTagName("button")[0].click()), 10);
  }
})();
