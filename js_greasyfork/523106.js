// ==UserScript==
// @name         百度搜索页面增强搜索功能
// @namespace    https://github.com/Cyrus-Qiu
// @version      1.0
// @description  在百度搜索页面新增一个按钮，将搜索词自动加上“-robin”
// @author       Cyrus
// @include      http*://www.baidu.com/s?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523106/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E5%A2%9E%E5%BC%BA%E6%90%9C%E7%B4%A2%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/523106/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E5%A2%9E%E5%BC%BA%E6%90%9C%E7%B4%A2%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var URLSite = window.location.href;
  var reBD = /baidu/i;
  if (reBD.test(URLSite)) {
    document.getElementById("form").style.width = "745px";
    var baiduBtn = document.getElementById("su");
    baiduBtn.style = "width:100px";
    baiduBtn.value = "百度一下";
    var yybdBtn = document.createElement("span");
    yybdBtn.className = baiduBtn.parentNode.className;
    yybdBtn.innerHTML =
      "<input type='button' id='yybd' value='增强搜索' class='btn bg s_btn' style='width:100px;border-radius:10px;'>";
    yybdBtn.addEventListener("click", function () {
      var input = document.getElementById("kw");
      var keyword = input.value.replace(/(^\s*)|(\s*$)/g, "");
      if (keyword !== "") {
        return yyyySearch(keyword);
      }
    });
    var bdform = document.getElementsByClassName("fm")[0];
		bdform.style.width = '845px'
		// var sBtnWr = bdform.querySelector(".bg.s_btn_wr");
		// sBtnWr.parentNode.insertBefore(yybdBtn, sBtnWr.nextSibling);
    bdform.appendChild(yybdBtn);
  }
  function yyyySearch(keyword) {
    var newKeyword = `${keyword}-robin`;
    var currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('wd', newKeyword);
    window.location.href = currentUrl.href;
  }
})();
