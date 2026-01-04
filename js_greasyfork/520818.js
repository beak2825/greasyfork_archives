// ==UserScript==
// @name         简化测试
// @namespace    https://penyo.ru/
// @version      1.0.0
// @match        *://*/*
// @grant        none
// @license      WTFPL
// @description  变！
// @downloadURL https://update.greasyfork.org/scripts/520818/%E7%AE%80%E5%8C%96%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/520818/%E7%AE%80%E5%8C%96%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function () {
  "use strict";

  document.body.innerHTML = document.body.innerHTML.replace(/我/g, "测试咱喵");

  console.log("脚本运行成功！");
})();