// ==UserScript==
// @name        Auto Import Improvements
// @namespace   https://politicsandwar.com/n/Talus
// @match       https://politicsandwar.com/city/improvements/import/id=*&c=*
// @grant       none
// @version     1.0
// @author      Talus
// @description Automatically imports improvements if the import string is passed in as a comma separated string of values
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/484185/Auto%20Import%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/484185/Auto%20Import%20Improvements.meta.js
// ==/UserScript==

if (document.querySelector('.alert.alert-success') != null) {
  // Import already performed
  return;
}
if (document.querySelector('.alert.alert-danger') != null) {
  // Check import requirements
  return;
}
var improvementNames = ["infra_needed","imp_total","imp_coalpower","imp_oilpower","imp_windpower","imp_nuclearpower","imp_coalmine","imp_oilwell","imp_uramine","imp_leadmine","imp_ironmine","imp_bauxitemine","imp_farm","imp_gasrefinery","imp_aluminumrefinery","imp_munitionsfactory","imp_steelmill","imp_policestation","imp_hospital","imp_recyclingcenter","imp_subway","imp_supermarket","imp_bank","imp_mall","imp_stadium","imp_barracks","imp_factory","imp_hangars","imp_drydock"];
var urlParams = new URLSearchParams(window.location.href);
var improvementsNumbers = urlParams.get('c');
var improvementsArray = improvementsNumbers .split(',');
var improvementsJson = {}
for (var i = 0; i < improvementsArray .length; i++) {
  improvementsJson[improvementNames [i]] = improvementsArray [i];
}
document.querySelector('textarea[name="imp_import"]').value = JSON.stringify(improvementsJson);
document.querySelector('input[name="imp_import_execute"]').click();
