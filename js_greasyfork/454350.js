// ==UserScript==
// @name         XDisk bypass redirector ads
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.1
// @license      AGPL v3
// @author       jcunews
// @description  Bypasses XDisk redirector ads when downloading file
// @match        https://xdisk.cloud/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/454350/XDisk%20bypass%20redirector%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/454350/XDisk%20bypass%20redirector%20ads.meta.js
// ==/UserScript==

(f => {
  f = String.prototype.indexOf;
  String.prototype.indexOf = function(s) {
    if (s === "ready") {
      var e = document.scripts[document.scripts.length - 1], a = e.text;
      if (a.includes("convertedString")) {
        if (a = a.match(/\?dec2=([^"]+)/)) {
          e.insertAdjacentHTML("beforebegin", '<br>Download link:<br><a></a>');
          e.previousElementSibling.textContent = e.previousElementSibling.href = a[1]
        }
        throw undefined
      }
    }
    return f.apply(this, arguments)
  }
})()
