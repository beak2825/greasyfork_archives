// ==UserScript==
// @name         小米应用商店直接下载APP
// @version      1.2
// @description  在小米应用商店中直接下载APP
// @author       ChatGPT
// @match    https://m.app.mi.com/*
// @match        https://app.xiaomi.com/details?id=*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/473115/%E5%B0%8F%E7%B1%B3%E5%BA%94%E7%94%A8%E5%95%86%E5%BA%97%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BDAPP.user.js
// @updateURL https://update.greasyfork.org/scripts/473115/%E5%B0%8F%E7%B1%B3%E5%BA%94%E7%94%A8%E5%95%86%E5%BA%97%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BDAPP.meta.js
// ==/UserScript==

// 获取当前网址
var currentUrl = window.location.href;

// 检查当前域名是否为 app.xiaomi.com
if (currentUrl.includes("app.xiaomi.com")) {
  // 替换URL中的部分内容
  var replacedUrl = currentUrl.replace("https://app.xiaomi.com/details?id=", "https://m.app.mi.com/details?id=");

  // 直接访问替换后的链接
  window.location.href = replacedUrl;
}
(function() {
  function executeFunction() {
    // 获取当前网页链接
    var currentUrl = window.location.href;

    // 检查当前网页链接是否包含 detail&id=
    if (currentUrl.includes("detail&id=")) {
      // 提取 "detail&id=" 后面的字符
      var startIndex = currentUrl.indexOf("detail&id=") + 10;
      var endIndex = currentUrl.length;

      // 截取需要拼接的部分字符串
      var detailId = currentUrl.substring(startIndex, endIndex);

      // 拼接新的链接
      var newUrl = "https://m.app.mi.com/download/" + detailId;

      // 直接访问拼接好的链接
      window.location.href = newUrl;
    }
  }
executeFunction();
  // 绑定 touchend 事件
  document.addEventListener("touchend", function() {
    setTimeout(executeFunction, 200);
  });
})();