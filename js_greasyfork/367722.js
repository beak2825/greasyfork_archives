// ==UserScript==
// @name         ACS Abstract with Supporting Information
// @description  Download supporting infomation from the American Chemical Society (ACS) abstract page directly.
// @author       itianda
// @version      0.6.1
// @namespace    http://itianda.com/
// @match        *://pubs.acs.org/doi/abs/*
// @match        *://pubs.acs.org.ccindex.cn/doi/abs/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367722/ACS%20Abstract%20with%20Supporting%20Information.user.js
// @updateURL https://update.greasyfork.org/scripts/367722/ACS%20Abstract%20with%20Supporting%20Information.meta.js
// ==/UserScript==

window.addEventListener("DOMContentLoaded", function() {
  var o = document.getElementById('supInfoBox');
  if (o) {
    o.style = 'display: block'
  }
})
