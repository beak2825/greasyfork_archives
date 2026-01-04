// ==UserScript==
// @name         恢复彩色
// @namespace    myitian.all.nofilter
// @version      2.3
// @author       Myitian
// @license      Unlicense
// @description  清除网页filter，可实现黑白网页恢复彩色
// @match        */*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455697/%E6%81%A2%E5%A4%8D%E5%BD%A9%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/455697/%E6%81%A2%E5%A4%8D%E5%BD%A9%E8%89%B2.meta.js
// ==/UserScript==

function createStyleElement() {
  var styleElement = document.createElement('style');
  styleElement.id = "myitian-all-nofilter-style";
  styleElement.appendChild(document.createTextNode("*{-webkit-filter:none!important;-moz-filter:none!important;-ms-filter:none!important;-o-filter:none!important;filter:none!important;}"));
  return styleElement;
}

function addStyle(doc) {
  if (doc) {
    if (!doc.querySelector("style#myitian-all-nofilter-style")) {
      doc.body.style += "-webkit-filter:none!important;-moz-filter:none!important;-ms-filter:none!important;-o-filter:none!important;filter:none!important;";
      var styleElement = createStyleElement();
      doc.body.appendChild(styleElement);
      console.log("Appended!");
      console.log(styleElement);
    }
    var iframes = doc.querySelectorAll("iframe");
    for (var i = 0; i < iframes.length; i++) {
      if (iframes[i].contentDocument) {
        addStyle(iframes[i].contentDocument);
        iframes[i].addEventListener("load", function() { addStyle(this.contentDocument); });
      }
    }
  }
}

window.addEventListener("load", function() { addStyle(document); });
addStyle(document);