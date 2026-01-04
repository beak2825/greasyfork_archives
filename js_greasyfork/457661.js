// ==UserScript==
// @name         教育盘免费下载
// @namespace    http://tampermonkey.net/
// @version      v1.0
// @description  搜索引擎搜索 2022 site:jiaoyupan.com 可找到自己想要的关键字搜索
// @author       aice.fu
// @match        *://jiaoyupan.com/*
// @license      End-User License Agreement
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457661/%E6%95%99%E8%82%B2%E7%9B%98%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/457661/%E6%95%99%E8%82%B2%E7%9B%98%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
      'use strict';
      var area = document.querySelectorAll(".download_box .download_box_container");
      for (var i = 0; i < area.length; i++) {
        (function (j) {
          var item = area[j]
          var div = document.createElement('div');
          div.style = "width: 120px; height: 40px; line-height: 40px; background: #1977fa; color: #fff; border-radius: 10px; cursor: pointer; font-size: 16px; text-align: center;";
          div.innerText = '点击我下载哦~';
          item.appendChild(div);
          div.onclick = function () {
            var pswd = item.querySelector(".copy_pswd");
            if (pswd) {
              var a = pswd.attributes.onclick.nodeValue;
              var b = a.split(",");
              var x = b[0].split("'")[1];
              var y = b[1].split("'")[1];
              var origin = window.location.origin;
              var href = origin + "/plugin.php?id=threed_attach:downld&aid=" + x + "&formhash=" + y;
              var link = document.createElement('a');
              link.href = href;
              link.target = '_blank';
              link.click();
            }
          };
        })(i);
      }
    })();