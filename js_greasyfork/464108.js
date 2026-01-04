// ==UserScript==
// @name        Copy all mails to clipboard
// @namespace   Violentmonkey Scripts
// @match       https://*.foodsharing.*/*
// @run-at      document-idle
// @version     1.3
// @author      Martin G. (166111)
// @license     MIT
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @description Extension for foodsharing.de - Collect all email addresses of the listed groups and copy them to the clipboard
// @downloadURL https://update.greasyfork.org/scripts/464108/Copy%20all%20mails%20to%20clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/464108/Copy%20all%20mails%20to%20clipboard.meta.js
// ==/UserScript==


let btn = document.createElement("BUTTON");
let div = document.querySelector(".metanav-container");
div.appendChild(btn);
btn.innerHTML = "Copy";

btn.onclick = () => {
  var liste = "";
  var links = document.querySelectorAll("a");

  Array.prototype.forEach.call(links, function(link) {
    if (link.href.indexOf("mailto:") != -1) {
      liste += link.href += ";";
    }
  })

  liste = liste.replaceAll("mailto:", "");
  navigator.clipboard.writeText(liste);
};

