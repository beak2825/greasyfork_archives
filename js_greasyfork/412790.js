// ==UserScript==
// @name         Forced Dark Mode
// @namespace    http://ashish.link/
// @author       Ashish Ranjan
// @version      0.2.0
// @description  Enable Dark mode toggle feature on your favourite website. Good for reading articles and blogs. Not suitable for websites with images or videos.
// @license      MIT
// @include      *
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412790/Forced%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/412790/Forced%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
  var isSet = window.localStorage.getItem('forcedDarkMode');
  var defaultCSS = document.documentElement.style.cssText;

  function init() {
    document.documentElement.style.cssText =
      defaultCSS +
      (isSet ? 'filter: invert(1) hue-rotate(180deg) !important; background-color: black !important;' : '');
  }

  function toggle() {
    isSet = !isSet;
    init();
    window.localStorage.setItem('forcedDarkMode', isSet || '');
  }

  window.addEventListener(
    'load',
    function() {
      var btn = document.createElement('BUTTON');
      var txt = document.createTextNode('Toggle Dark Mode');
      btn.setAttribute(
        'style',
        'color: black;font-size: 10px;position: fixed;bottom: 42px;right: -42px;transform: rotate(270deg);z-index: 100000;background: #80808021;cursor: pointer;font-weight: 100;margin: 0;padding: 2px;outline: none;'
      );
      btn.appendChild(txt);
      document.body.appendChild(btn);
      btn.onclick = toggle;
    },
    false
  );
  init();
})();
