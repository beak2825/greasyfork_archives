// ==UserScript==
// @name         聚合支付防止隐藏功能
// @namespace    https://github.com/dadaewqq/fun
// @version      0.2
// @description  去除disable=1
// @author       dadaewqq
// @match        https://yktpay.nwpu.edu.cn/cashier-mobile/*disable=1
// @icon         https://yktpay.nwpu.edu.cn/cashier-mobile/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460577/%E8%81%9A%E5%90%88%E6%94%AF%E4%BB%98%E9%98%B2%E6%AD%A2%E9%9A%90%E8%97%8F%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/460577/%E8%81%9A%E5%90%88%E6%94%AF%E4%BB%98%E9%98%B2%E6%AD%A2%E9%9A%90%E8%97%8F%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /*
自己写的

  var tiaozhuan = function () {
    if (location.pathname == "/cashier-mobile/payCode" || location.pathname == "/cashier-mobile/charge" || location.pathname == "/cashier-mobile/bill") {
      location.href = location.pathname + "?disable=0";
    }
  };

  setInterval(tiaozhuan, 100);
*/

  /*
chatgpt优化的

  setInterval(function () {
    if (location.pathname === "/cashier-mobile/payCode" || location.pathname === "/cashier-mobile/charge" || location.pathname === "/cashier-mobile/bill") {
      location.href = location.pathname + "?disable=0";
    }
  }, 100);

  // requestAnimationFrame
  function animate() {
    if (location.pathname === "/cashier-mobile/payCode" || location.pathname === "/cashier-mobile/charge" || location.pathname === "/cashier-mobile/bill") {
      location.href = location.pathname + "?disable=0";
    }
    requestAnimationFrame(animate);
  }
  animate();
*/

  // setTimeout
  function timeout() {
    if (location.pathname === "/cashier-mobile/payCode" || location.pathname === "/cashier-mobile/charge" || location.pathname === "/cashier-mobile/bill") {
      location.href = location.pathname + "?disable=0";
    }
    setTimeout(timeout, 100);
  }
  timeout();
})();
