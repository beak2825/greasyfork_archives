// ==UserScript==
// @name        spiegel.de: Stop autoplay next
// @namespace   https://greasyfork.org/en/users/13300-littlepluto
// @description verhindert, dass automatisch das nächste Video abgespielt wird
// @match       *://www.spiegel.de/*/*-a-*
// @grant       none
// @run-at      document-start
// @version     1.0
// @author      -
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/395297/spiegelde%3A%20Stop%20autoplay%20next.user.js
// @updateURL https://update.greasyfork.org/scripts/395297/spiegelde%3A%20Stop%20autoplay%20next.meta.js
// ==/UserScript==

Object.defineProperty(window,"jwDefaults",{configurable:true, set(value){
  delete window.jwDefaults;
  value.related.oncomplete = "show"; //"hide" um nur replay button zu zeigen
  value.nextUpDisplay = false;
  window.jwDefaults = value;
  }
});