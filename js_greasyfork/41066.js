// ==UserScript==
// @name        WME: Increase Pan Amount
// @namespace   http://gdp.org
// @description Increases the pan amount to 200 pixels
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version     0.0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/41066/WME%3A%20Increase%20Pan%20Amount.user.js
// @updateURL https://update.greasyfork.org/scripts/41066/WME%3A%20Increase%20Pan%20Amount.meta.js
// ==/UserScript==

// Initialisation of the script, this will only run completely one time
function init(e) {
  if (e && e.user == null) {
    return;
  }
  // if you require certain features to be loaded, you can add them here
  if (typeof I18n === 'undefined' || typeof W === 'undefined' ||  typeof W.loginManager === 'undefined') {
    setTimeout(init, 200);
    return;
  }
  if (!W.loginManager.user) {
    W.loginManager.events.register("login", null, init);
    W.loginManager.events.register("loginStatus", null, init);
    if (!W.loginManager.user) {
      return;
    }
  }
  performScript();
}

function performScript() {
  // Your userscript logic can go here. The Waze editor has been loaded and seems to be ready for your userscript.
  W.map.DefaultPanInPixel = 250; // pixels
}

init();