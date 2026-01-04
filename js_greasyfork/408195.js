// ==UserScript==
// @name         Waze Reporting Tool: remove required flag for subcategory
// @author       Tom 'Glodenox' Puttemans
// @namespace    http://www.tomputtemans.com/
// @version      0.2
// @description  Because Waze is requiring you to fill in a disabled field, it is not possible to submit alerts for types without subcategories. This script should fix that.
// @match        https://www.waze.com/reporting*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408195/Waze%20Reporting%20Tool%3A%20remove%20required%20flag%20for%20subcategory.user.js
// @updateURL https://update.greasyfork.org/scripts/408195/Waze%20Reporting%20Tool%3A%20remove%20required%20flag%20for%20subcategory.meta.js
// ==/UserScript==

var container = document.querySelector('.leaflet-fullscreen');
var changeListener = new MutationObserver(function() {
  var subcategory = container.querySelector('.rep-alert-view__subtype');
  if (subcategory) {
    subcategory.required = false;
  }
});
changeListener.observe(container, {
  childList: true
});