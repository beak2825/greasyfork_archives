// ==UserScript==
// @name         [2021] Inspire Planner Better colour highlights for SF.com
// @version      1.5
// @description  This makes inspire planner on salesforce.com highlight the project name in red
// @description  GL with this script
// @author       AshAlliants
// @match        /^https?://*.lightning\.force\.com/
// @match        https://alliants.lightning.force.com
// @match        https://alliants.my.salesforce.com
// @include      /^https?://*.\.lightning\.force\.com/lightning/n/inspire1__TimeTracker_lightning.*$/
// @include      https://alliants.lightning.force.com/lightning/n/inspire1__TimeTracker_lightning
// @include      https://alliants.my.salesforce.com/_ui/identity/verification/method/TotpVerificationUi/e
// @namespace https://greasyfork.org/users/777108
// @downloadURL https://update.greasyfork.org/scripts/427162/%5B2021%5D%20Inspire%20Planner%20Better%20colour%20highlights%20for%20SFcom.user.js
// @updateURL https://update.greasyfork.org/scripts/427162/%5B2021%5D%20Inspire%20Planner%20Better%20colour%20highlights%20for%20SFcom.meta.js
// ==/UserScript==

if (document.location.host.indexOf(".lightning.force.com") != -1 && window.location.pathname.indexOf("TimeTracker") !== -1) {
    var style = document.createElement('style');
    style.innerHTML = `
      .weekly-timelog-row > td > div:nth-child(1) > span {
          font-weight: normal;
      }
      .weekly-timelog-row > td > div:nth-child(3) {
          font-weight: bold;
          color: red;
      }
      table.slds-table td:nth-child(2), table.slds-table td:nth-child(8) {
          display: none;
      }
    `;
    document.head.appendChild(style);
}
if (document.location.host.indexOf("alliants.my.salesforce.com") != -1 && window.location.pathname.indexOf("identity/verification") !== -1) {
    var mfaBox = document.getElementById("tc");
    if (mfaBox) {
        mfaBox.focus();
    }
}