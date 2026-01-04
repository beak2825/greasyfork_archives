// ==UserScript==
// @name         新疆会计继续教育加速
// @version      0.1
// @description  用于加速完成会计继续教育
// @author
// @match        https://kjgl.xjcz.gov.cn/accNet/index/toHome.htm*
// @grant        none
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/438901/%E6%96%B0%E7%96%86%E4%BC%9A%E8%AE%A1%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/438901/%E6%96%B0%E7%96%86%E4%BC%9A%E8%AE%A1%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==
$(function () {
  setInterval(() => {
    if (document.querySelector("video")) {
      document.querySelector("video").play();
    }
  }, 3 * 1000);
});