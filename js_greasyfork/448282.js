// ==UserScript==
// @name         福利吧百家姓暗号
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  福利吧百家姓暗号脚本
// @author       marksong
// @match        *://www.wnflb99.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448282/%E7%A6%8F%E5%88%A9%E5%90%A7%E7%99%BE%E5%AE%B6%E5%A7%93%E6%9A%97%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/448282/%E7%A6%8F%E5%88%A9%E5%90%A7%E7%99%BE%E5%AE%B6%E5%A7%93%E6%9A%97%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var iframe = document.createElement("iframe");
      iframe.src = "https://fuliba2021.net/anhao.html";
      iframe.id = "bjxtocl";
      iframe.width = 425;
      iframe.style =
        "display:none; position: fixed; z-index: 99999; top: 130px; right: 40px; background: #fff; border: 10px dashed red;";
      document.body.appendChild(iframe);

      var div = document.createElement("div");
      div.style =
        "width: 120px; height: 40px; line-height: 40px; background: #1977fa; color: #fff; border-radius: 10px; cursor: pointer; font-size: 16px; text-align: center; position: fixed; top: 80px; right: 40px; z-index: 99999;";
      div.innerHTML = "百家姓暗号";
      div.onclick = function() {
        var el = document.getElementById("bjxtocl");
        if (el) {
          var display = el.style.display;
          el.style.display = display === "block" ? "none" : "block";
        }
      };
      document.body.appendChild(div);
})();