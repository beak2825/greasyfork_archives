// ==UserScript==
// @name         Delete bilibili login box
// @name:en         Delete bilibili login box
// @name:ja         bilibiliのログイン用ボックスを削除

// @description  Remove login box on bilibili.
// @description:en       Remove the center box to log in to bilibili.
// @description:ja       bilibiliにログインするための中央のボックスを除去します。

// @namespace
// @version      1.0
// @author       Scri P

// @match        https://*.bilibili.com/*
// @namespace https://greasyfork.org/users/385753
// @downloadURL https://update.greasyfork.org/scripts/503719/Delete%20bilibili%20login%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/503719/Delete%20bilibili%20login%20box.meta.js
// ==/UserScript==

(function() {
  addCss([
    ' div.bili-mini-mask { display : none; }',
  ]);

  function addCss(a) {
    let styleTag = document.createElement("style");
    let head = document.getElementsByTagName("head")[0];
    head.appendChild(styleTag);
    let thisSheet = styleTag.sheet ? styleTag.sheet : styleTag.styleSheet;
    if (thisSheet.insertRule)
      for (let i in a)
        thisSheet.insertRule(a[i], 0);
  }

})();
