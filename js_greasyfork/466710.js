// ==UserScript==
// @name         学习的题库搜索按钮-->回车
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在使用学习强国搜索时，初始时输入关键字再回车，没有反应，需要使用鼠标点击搜索才会出现搜索结果；此插件功能就是不适用鼠标，在输入关键字后，敲击键盘的确认键（Enter）后就可以出现搜索结果。Bingo！！！！\n  题库的网址：techxuexi.js.org/tiku
// @author       Huang
// @match        http*://techxuexi.js.org/tiku/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aoj.lol
// @grant        none
// @license  none
// @downloadURL https://update.greasyfork.org/scripts/466710/%E5%AD%A6%E4%B9%A0%E7%9A%84%E9%A2%98%E5%BA%93%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE--%3E%E5%9B%9E%E8%BD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/466710/%E5%AD%A6%E4%B9%A0%E7%9A%84%E9%A2%98%E5%BA%93%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE--%3E%E5%9B%9E%E8%BD%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';


    document.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    // 在这里编写回车键事件的处理代码
      var button = document.getElementById("search");
      button.click();
  }
});
    // Your code here...
})();