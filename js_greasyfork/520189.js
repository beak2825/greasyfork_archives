// ==UserScript==
// @name         助学盘 教育盘免费下载白嫖
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  this is biaobai jiaoyunpan
// @author       marksong
// @match        *://jiaoyupan.cc/*
// @match        *://zhuxuepan.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520189/%E5%8A%A9%E5%AD%A6%E7%9B%98%20%E6%95%99%E8%82%B2%E7%9B%98%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD%E7%99%BD%E5%AB%96.user.js
// @updateURL https://update.greasyfork.org/scripts/520189/%E5%8A%A9%E5%AD%A6%E7%9B%98%20%E6%95%99%E8%82%B2%E7%9B%98%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD%E7%99%BD%E5%AB%96.meta.js
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