// ==UserScript==
// @name         Hebau-URP-教学评估快速选择
// @description  快速选择 (非常满意+主观评价为无)
// @namespace    https://github.com/Weidows/Web/raw/master/JavaScript/userscript/urp.user.js
// @homepage     https://greasyfork.org/zh-CN/scripts/457791
// @supportURL   https://github.com/Weidows/Web
// @version      0.2.0
// @author       Weidows
// @match        *://urp.hebau.edu.cn/*
// @match        *://urp.hebau.edu.cn:9001/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457791/Hebau-URP-%E6%95%99%E5%AD%A6%E8%AF%84%E4%BC%B0%E5%BF%AB%E9%80%9F%E9%80%89%E6%8B%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/457791/Hebau-URP-%E6%95%99%E5%AD%A6%E8%AF%84%E4%BC%B0%E5%BF%AB%E9%80%9F%E9%80%89%E6%8B%A9.meta.js
// ==/UserScript==

/*
 * @?: *********************************************************************
 * @Author: Weidows
 * @Date: 2023-01-07 15:39:40
 * @LastEditors: Weidows
 * @LastEditTime: 2023-01-07 17:54:09
 * @FilePath: \Web\JavaScript\userscript\urp.user.js
 * @Description:
 * @!: *********************************************************************
 */

(function () {
  "use strict";

  document.getElementsByTagName("textarea")[0].value = "无";
  var inputs = document.getElementsByTagName("input");
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].parentNode.childNodes[1] == inputs[i]) {
      inputs[i].checked = true;
    }
  }
})();
