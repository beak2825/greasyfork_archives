// ==UserScript==
// @name         segmentfault | 简书 免登录复制  复制去除版权信息
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  无
// @author       Peace&Love
// @include        *://segmentfault.com/*
// @include        *://www.jianshu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406744/segmentfault%20%7C%20%E7%AE%80%E4%B9%A6%20%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%20%20%E5%A4%8D%E5%88%B6%E5%8E%BB%E9%99%A4%E7%89%88%E6%9D%83%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/406744/segmentfault%20%7C%20%E7%AE%80%E4%B9%A6%20%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%20%20%E5%A4%8D%E5%88%B6%E5%8E%BB%E9%99%A4%E7%89%88%E6%9D%83%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function () {
    "use strict";

      if (window.location.href.indexOf("segmentfault") != -1) {
        sf();
      }

      function sf() {
        var fakeLogin = document.createElement("span");
        fakeLogin.id = "SFUserId";
        document.body.appendChild(fakeLogin);

        document.querySelectorAll("article.article").forEach(function(t) {
          t.addEventListener(
            "copy",
            function(e) {
              e.stopPropagation();
            },
            true
          );
        });
      }


    document.addEventListener(
        "copy",
        function (e) {
            e.stopPropagation();
        },
        true
    );
})();