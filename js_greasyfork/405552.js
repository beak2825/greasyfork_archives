// ==UserScript==ww
// @name         直接跳转知乎、简书的外链
// @namespace    https://github.com/XanderWang
// @version      0.1.3
// @description  直接跳转知乎和简书的外链
// @author       XanderWang
// @icon         https://i.loli.net/2020/05/29/DxSmHAy2o53FdUY.png
// @match        *://*.shiyanlou.com/*
// @match        *://*.jianshu.com/*
// @match        *://*.zhihu.com/*
// @match        *://*.csdn.net/*
// @match        *://*.imooc.com/*
// @match        *://*.juejin.cn/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405552/%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E7%9F%A5%E4%B9%8E%E3%80%81%E7%AE%80%E4%B9%A6%E7%9A%84%E5%A4%96%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/405552/%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E7%9F%A5%E4%B9%8E%E3%80%81%E7%AE%80%E4%B9%A6%E7%9A%84%E5%A4%96%E9%93%BE.meta.js
// ==/UserScript==

(function () {
  "use strict";
  function checkoutRealHref() {
    /// 获取所有 a 标签
    var aTagLists = document.getElementsByTagName("a");
    for (var i = 0; i < aTagLists.length; i++) {
      var _href = decodeURIComponent(aTagLists[i].href);
      var _hrefArrays = _href.split("=http");
      if (_hrefArrays.length > 1) {
        console.log("find url:", _href);
        console.log(" _hrefArrays", _hrefArrays);
        var realHref = "http" + _hrefArrays[1];
        console.log(" ori", _href, "real", realHref);
        aTagLists[i].setAttribute("href", realHref);
        // aTagLists[i].removeAttribute("rel");
        // aTagLists[i].removeAttribute("ref");
        // aTagLists[i].removeAttribute("target");
      }
    }
    var aTagLists = document.getElementsByTagName("a");
    for (var i = 0; i < aTagLists.length; i++) {
      var _href = decodeURIComponent(aTagLists[i].href);
      if (_href.indexOf("=http") > 0) {
        console.log("check url:", _href);
      }
    }
  }
  checkoutRealHref();
  window.onscroll = function () {
    setTimeout(function () {
      checkoutRealHref();
    }, 500);
  };
})();
