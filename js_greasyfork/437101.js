// ==UserScript==
// @name         MELcloud with CoP
// @version      0.1
// @namespace    http://userscripts.org/users/419370
// @description  Tricks MELcloud into showing more information
// @author              Timbones
// @match        https://app.melcloud.com/
// @icon         https://www.google.com/s2/favicons?domain=melcloud.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437101/MELcloud%20with%20CoP.user.js
// @updateURL https://update.greasyfork.org/scripts/437101/MELcloud%20with%20CoP.meta.js
// ==/UserScript==

(function() {
  'use strict';

  Structure.prototype.getDeviceLocationOrig = Structure.prototype.getDeviceLocation;
  Structure.prototype.getDeviceLocation = function (a, c, b, e) {
    var f = this.getDeviceLocationOrig(a, c, b, e);
    if (f != null) {
      f.Device.CanMeasureEnergyProduced=true;
      oReporting.isEnergyEstimated=false;
    }
    return f;
  }

  function enableControls() {
    $(".can-configure-energy-costs").visible(true);
    $(".atw-diagnostics").visible(true);
  }
  setTimeout(enableControls, 2021);

  console.log("Patched by userscript");
})();