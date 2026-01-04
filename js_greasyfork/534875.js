// ==UserScript==
// @name         禁漫去广告
// @namespace    http://tampermonkey.net/
// @version      2025-05-04
// @description  禁漫去广告,匹配域名中包含18comic的网站，进行广告剔除；
// @author       You
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534875/%E7%A6%81%E6%BC%AB%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/534875/%E7%A6%81%E6%BC%AB%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const host = window.location.host;

  if (!/18comic/i.test(host)) {
    return;
  }

  document.querySelectorAll('[data-show="ok"]').forEach((el) => {
    el.remove();
  });

  var iframes = document.getElementsByTagName("iframe");
  for (var i = 0; i < iframes.length; i++) {
    var iframe = iframes[i];
    var iframeDocument =
      iframe.contentDocument || iframe.contentWindow.document;

    const divs = iframeDocument.querySelectorAll("div");

    var isfound = false;
    divs.forEach((div) => {
      if (div.textContent.trim().toLowerCase() == "ad") {
        isfound = true;
        return;
      }
    });

    if (isfound) {
      iframes[i].remove();
    }
  }

  document.querySelectorAll("div.group-notice").forEach((el) => {
    if (el.textContent.trim().toLowerCase() == "ad") {
      el.parentNode.remove();
    }
  });
})();
