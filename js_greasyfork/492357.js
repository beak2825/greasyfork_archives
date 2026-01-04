// ==UserScript==
// @name         隐藏百度内容推荐
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隐藏百度页面右侧的内容推荐
// @author       You
// @match        https://www.baidu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492357/%E9%9A%90%E8%97%8F%E7%99%BE%E5%BA%A6%E5%86%85%E5%AE%B9%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/492357/%E9%9A%90%E8%97%8F%E7%99%BE%E5%BA%A6%E5%86%85%E5%AE%B9%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function () {
  "use strict";

  document.getElementById("con-ceiling-wrapper").style.display = "none";
})();
