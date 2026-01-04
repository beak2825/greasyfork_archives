// ==UserScript==
// @name         North - lootlog klanowy
// @version      2.4
// @description  North - lootlog klanowy dla NI
// @author       Groove Armada
// @match        http://*.margonem.pl/
// @match        https://*.margonem.pl/
// @match        http://*.margonem.com/
// @match        https://*.margonem.com/
// @grant        unsafeWindow
// @run-at       document-body
// @noframes
// @namespace https://greasyfork.org/users/738654
// @downloadURL https://update.greasyfork.org/scripts/421955/North%20-%20lootlog%20klanowy.user.js
// @updateURL https://update.greasyfork.org/scripts/421955/North%20-%20lootlog%20klanowy.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var targetWindow = typeof unsafeWindow !== 'undefined'
    ? unsafeWindow
    : window;

  function getScript(url) {
    var script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
  }

  function init() {
    if (typeof targetWindow.$ !== 'function') {
      setTimeout(init, 100);
      return;
    }

    if (typeof __build !== 'object' && typeof __bootNI === 'undefined') {
      return;
    }

    var d = new Date();
    var verStr = [d.getUTCDate(), d.getUTCMonth() + 1].join('.');

    // framework
    if (typeof GrooveObject !== 'object') {
      getScript('https://addons2.margonem.pl/get/69/69097dev.js?ver=' + verStr);
    }

    targetWindow.GACLL = targetWindow.GACLL || { clans: [] };
    targetWindow.GACLL.clans.push('north');

    if (!targetWindow.GACLL.init) {
      targetWindow.GACLL.init = true;
      getScript('https://addons2.margonem.pl/get/79/79443dev.js?v=' + verStr);
    }
  }

  init();
})();
