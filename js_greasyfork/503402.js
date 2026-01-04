// ==UserScript==
// @name         Delete Facebook login box
// @name:en         Delete Facebook login box
// @name:ja         フェイスブックのログイン用ボックスを削除

// @description  Remove login box on facebook.
// @description:en       Remove the center box to log in to Facebook.
// @description:ja       Facebookにログインするための中央のボックスを除去します。

// @namespace
// @version      1.3
// @author       Scri P

// @match        https://*.facebook.com/*
// @match        https://facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd.onion/*
// @match        http://facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd.onion/*
// @namespace https://greasyfork.org/users/385753
// @downloadURL https://update.greasyfork.org/scripts/503402/Delete%20Facebook%20login%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/503402/Delete%20Facebook%20login%20box.meta.js
// ==/UserScript==

(function() {
  addCss([
    ' div.__fb-light-mode { display : none; }',
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
