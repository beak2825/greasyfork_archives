// ==UserScript==
// @name         IMVU Creator dev report Credit-Income
// @namespace    http://tampermonkey.net/
// @version      2024-04-07
// @description  add CSS to dev Credit-income page
// @author       Evehne
// @match        https://*.imvu.com/catalog/developer_report.php?*reporttype=incomelog*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imvu.com
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/491900/IMVU%20Creator%20dev%20report%20Credit-Income.user.js
// @updateURL https://update.greasyfork.org/scripts/491900/IMVU%20Creator%20dev%20report%20Credit-Income.meta.js
// ==/UserScript==

(function() {
    'use strict';
var e = document.querySelector('body');
e.innerHTML += `<style>
tr:nth-child(even) .pi_data_fixed,
tr:nth-child(even) .pi_data{
  background: #efefef;
}
tr:nth-child(even) .pi_data_fixed,
tr:nth-child(odd) .pi_data{
  background: #dfdfdf;
}
.pi_data:nth-child(2),
.pi_data:nth-child(6){
  font-weight: bold;
}
.pi_data:nth-child(6){
  min-width: 180px;
}
.pi_data:nth-child(2),
.pi_data:nth-child(5){
  max-width: 120px;
  word-break: break-all;
}
.pi_data:nth-child(10),
.pi_data:nth-child(11){
  font-weight: bold;
}
</style>`;
    
})();