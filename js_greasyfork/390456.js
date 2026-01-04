// ==UserScript==
// @name         Restore Read in English button
// @namespace    http://qpwakaba.xyz/
// @version      0.12
// @description  Restore the Read in English button at docs.microsoft.com
// @author       King (qpwakaba)
// @match        https://docs.microsoft.com/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/390456/Restore%20Read%20in%20English%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/390456/Restore%20Read%20in%20English%20button.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (document.getElementById('language-toggle')) return;
  var pageActionsElements = document.getElementsByClassName('action-list');
  if (pageActionsElements.length === 0) return;
  var menu = pageActionsElements[0];
  var switchLang = document.createElement('li');
  switchLang.innerHTML = '<div class="lang-toggle-container" style="display: flex;"><label for="language-toggle" aria-hidden="true" tabindex="-1" class="x-hidden-focus">Read in English</label><div class="checkbox-toggle-wrapper"><input type="checkbox" id="language-toggle" aria-label="Read in English" data-m="{&quot;cN&quot;:&quot;language-toggle&quot;,&quot;value&quot;:&quot;off&quot;}"><label for="language-toggle" class="switch"></label></div></div>'
  if (menu.children.length >= 5) {
    menu.insertBefore(switchLang, menu.children[4]);
  } else {
    menu.appendChild(switchLang);
  }
})();
