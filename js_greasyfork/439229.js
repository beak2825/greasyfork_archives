// ==UserScript==
// @name         格上财富，表格自动规范化，用于复制到 Excel
// @namespace    snomiao@gmail.com
// @version      0.1
// @description  格上财富的表格是用定宽span实现的，复制到 Excel会变成一行，这里把它改成table的实现方式就可以正确复制到Excel了
// @run-at       document-end
// @author       snomiao
// @include      *://www.licai.com/*
// @grant        https://code.jquery.com/jquery-3.3.1.js
// @downloadURL https://update.greasyfork.org/scripts/439229/%E6%A0%BC%E4%B8%8A%E8%B4%A2%E5%AF%8C%EF%BC%8C%E8%A1%A8%E6%A0%BC%E8%87%AA%E5%8A%A8%E8%A7%84%E8%8C%83%E5%8C%96%EF%BC%8C%E7%94%A8%E4%BA%8E%E5%A4%8D%E5%88%B6%E5%88%B0%20Excel.user.js
// @updateURL https://update.greasyfork.org/scripts/439229/%E6%A0%BC%E4%B8%8A%E8%B4%A2%E5%AF%8C%EF%BC%8C%E8%A1%A8%E6%A0%BC%E8%87%AA%E5%8A%A8%E8%A7%84%E8%8C%83%E5%8C%96%EF%BC%8C%E7%94%A8%E4%BA%8E%E5%A4%8D%E5%88%B6%E5%88%B0%20Excel.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var waitJQ_for = function (func, interval = 1000) {
    if (typeof jQuery == "undefined") {
      document.documentElement.appendChild(
        document.createElement("script")
      ).src = "https://code.jquery.com/jquery-3.3.1.js";
      setTimeout(() => waitJQ_for(func, interval), interval);
    } else {
      func();
    }
  };

  var replace_element_tag = function ($srcEle, tagName) {
    var attrs = {};
    $.each($srcEle[0].attributes, function (idx, attr) {
      attrs[attr.nodeName] = attr.nodeValue;
    });
    var $targetEle = $("<" + tagName + "/>", attrs).append($srcEle.contents());
    $srcEle.replaceWith(function () {
      return $targetEle;
    });
  };

  var start = function () {
    waitJQ_for(function () {
      var $srcEle1 = $("span.fund-main-title");
      var $srcEle2 = $("div.fund-main.fund-main-list, div.fund-main");
      var $srcEle3 = $("div.fund-main-wrapper");

      if ($srcEle1.length || $srcEle2.length || $srcEle3.length) {
        Array.from($srcEle1).map((ele, i) =>
          replace_element_tag($srcEle1.slice(i, i + 1), "td")
        );
        Array.from($srcEle2).map((ele, i) =>
          replace_element_tag($srcEle2.slice(i, i + 1), "tr")
        );
        Array.from($srcEle3).map((ele, i) =>
          replace_element_tag($srcEle3.slice(i, i + 1), "table")
        );
        var eleTable = $(".fund-main-wrapper")[0];
        window.getSelection().selectAllChildren(eleTable);
        document.title = "表格已规范化，并自动选取/" + Math.random();
      }
    });
  };

  start();
  setInterval(start, 1000);
})();
