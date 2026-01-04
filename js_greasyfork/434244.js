// ==UserScript==
// @name         WHITE MODE ALWAYS
// @namespace     A
// @author       SUBLIMINALMANGA
// @version      V1
// @description  WHITE MODE FOR ALL WEB PAGE. NO DEPRESSION
// @license      MIT
// @include      *
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434244/WHITE%20MODE%20ALWAYS.user.js
// @updateURL https://update.greasyfork.org/scripts/434244/WHITE%20MODE%20ALWAYS.meta.js
// ==/UserScript==

(function() {
  var isSet = window.localStorage.getItem('forcedLightMode');
  var defaultCSS = document.documentElement.style.cssText;

  function init() {
    document.documentElement.style.cssText =
      defaultCSS +
      (isSet ? '!important; background-color: white !important;' : '');
  }

  function toggle() {
    isSet = !isSet;
    init();
    window.localStorage.setItem('forcedLightMode', isSet || '');
  }

  window.addEventListener(
    'load',
    function() {
      var btn = document.createElement('BUTTON');
      var txt = document.createTextNode('LIGHT MODE');
      btn.setAttribute(
        'style',
        'color: white;font-size: 10px;position: fixed;bottom: 42px;right: -42px;transform: rotate(270deg);z-index: 100000;background: #80808021;cursor: pointer;font-weight: 100;margin: 0;padding: 2px;outline: none;'
      );
      btn.appendChild(txt);
      document.body.appendChild(btn);
      btn.onclick = toggle;
    },
    false
  );
  init();
})();
