// ==UserScript==
// @name         Delete archive.org blur
// @name:en         Delete archive.org blur
// @name:ja         archive.org のぼかし消し

// @description  Remove "Content may be inappropriate" in archive.org
// @description:en       Remove "Content may be inappropriate" in archive.org
// @description:ja       archive.org 以下の文言のぼかしを消します Content may be inappropriate

// @namespace
// @version      0.9
// @author       Scri P

// @match        https://*.archive.org/details/*
// @namespace
// @namespace https://greasyfork.org/users/385753
// @downloadURL https://update.greasyfork.org/scripts/545044/Delete%20archiveorg%20blur.user.js
// @updateURL https://update.greasyfork.org/scripts/545044/Delete%20archiveorg%20blur.meta.js
// ==/UserScript==

(function() {
  alert("test")
  addCss([
    ' .blur { filter: blur(0px) !important; border:10px red !important;}',
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