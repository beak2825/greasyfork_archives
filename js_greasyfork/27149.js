// ==UserScript==
// @name         Lnmtl Learn Chinese
// @namespace    http://lnmtl.com/chapter/
// @version      0.3
// @description  show the 字 next to the words that would usually be in popups
// @author       Nazgand
// @match        http://lnmtl.com/chapter/*
// @match        https://lnmtl.com/chapter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27149/Lnmtl%20Learn%20Chinese.user.js
// @updateURL https://update.greasyfork.org/scripts/27149/Lnmtl%20Learn%20Chinese.meta.js
// ==/UserScript==
document.querySelector('button.js-toggle-original').click();
document.querySelectorAll('.translated [data-original-title]').forEach(
  function(e) {
    e.innerText = '{' + e.getAttribute('data-title') + ':' + e.innerText + '}';
    e.style.whiteSpace = 'nowrap';
  });
document.querySelector('div[id="chat-killer"]').click();
