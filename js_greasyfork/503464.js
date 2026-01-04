// ==UserScript==
// @name         Delete tiktok login box
// @name:en         Delete tiktok login box
// @name:ja         ティックトックのログイン用ボックスを削除

// @description  Remove login box on tiktok.
// @description:en       Remove the center box to log in to tiktok.
// @description:ja       tiktokにログインするための中央のボックスを除去します。

// @namespace
// @version      1.2
// @author       Scri P

// @match        https://*.tiktok.com/*
// @namespace https://greasyfork.org/users/385753
// @downloadURL https://update.greasyfork.org/scripts/503464/Delete%20tiktok%20login%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/503464/Delete%20tiktok%20login%20box.meta.js
// ==/UserScript==

(function() {
  addCss([
    ' div.css-behvuc-DivModalContainer { display : none !important; }',
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
