// ==UserScript==
// @license MIT 
// @name         skip feishu security warning page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  skip feishu security page
// @author       simmy
// @match       https://security.feishu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/463896/skip%20feishu%20security%20warning%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/463896/skip%20feishu%20security%20warning%20page.meta.js
// ==/UserScript==

(function() {
  function clickLink() {
    var elements = document.getElementsByClassName("link JS-continue");
    if (elements) {
        console.log("found and click");
        elements.item(0).click();
    } else {
        console.log("element not found,wait 1s");
    }
  }
  var int = self.setInterval(clickLink, 1000);
})();