// ==UserScript==
// @name         vungle - Prevent Auto Downloads
// @namespace    https://github.com/Procyon-b
// @version      1.0.1
// @description  Block automatic file downloads
// @author       Achernar
// @match        https://publisher.vungle.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539329/vungle%20-%20Prevent%20Auto%20Downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/539329/vungle%20-%20Prevent%20Auto%20Downloads.meta.js
// ==/UserScript==

(function() {
"use strict'";

document.addEventListener('click', function(e) {
  var el = e.target.closest('a[download]');
  if (el) {
    //console.log('Blocked download link:', el.href);
    let st=(new Error()).stack;
    //console.info({st}, st);
    if (st.search(/MessagePort\._|bundle\.main/) == -1) return;
    e.preventDefault();
    e.stopPropagation();
    }
  }, true);

})();
