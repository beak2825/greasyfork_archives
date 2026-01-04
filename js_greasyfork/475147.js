// ==UserScript==
// @name         SRM Sticky Headers
// @namespace    http://tampermonkey.net/
// @version      2023.06.30.1
// @description  Changes background color to reduce mistakes working between Test and Production
// @author       Vance M. Allen
// @match        https://srm.sde.idaho.gov/srm/protected/listData.do*
// @match        https://srmtest.sde.idaho.gov/srm/protected/listData.do*
// @match        https://srm2.sde.idaho.gov/srm/protected/listData.do*
// @match        https://srmtest2.sde.idaho.gov/srm/protected/listData.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idaho.gov
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475147/SRM%20Sticky%20Headers.user.js
// @updateURL https://update.greasyfork.org/scripts/475147/SRM%20Sticky%20Headers.meta.js
// ==/UserScript==

(function() {
    console.warn('Column headers made sticky by "SRM Sticky Headers" script.');
    let s = document.getElementsByClassName('dataTable').item(0).getElementsByTagName('thead').item(0).style;
    s.position = 'sticky';
    s.top = 0;
})();
