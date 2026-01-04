// ==UserScript==
// @name         Tesla Order Status Page Enhancement
// @namespace    https://yibu.org/
// @version      0.3
// @description  Tesla Order Status Page Enhancement: Show more info hidden in the source code
// @author       yibum
// @match        https://www.tesla.com/*/teslaaccount/product-finalize?rn=RN*
// @match        https://www.tesla.com/teslaaccount/product-finalize?rn=RN*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447198/Tesla%20Order%20Status%20Page%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/447198/Tesla%20Order%20Status%20Page%20Enhancement.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const cdata = unsafeWindow.Tesla.ProductF;
    const isNotMatchedToRa00Vin = cdata.Data.DeliveryDetails.isNotMatchedToRa00Vin;
    const vinFromSourceCode = cdata.Data.Insurance.vin;

    let infoDiv = document.createElement("div");
    infoDiv.setAttribute("id", "info-div-for-enhancement");
    infoDiv.setAttribute("class", "padding-bottom");
    let matchedToRa00vinNode = document.createElement("div");
    if (isNotMatchedToRa00Vin) {
        matchedToRa00vinNode.innerHTML = '<span style="font-weight:600;color:#32527b">matchedToRa00vin:</span> NOT Matched yet!';
    } else {
        matchedToRa00vinNode.innerHTML = '<span style="font-weight:600;color:#32527b">matchedToRa00vin:</span> MATCHED!';
    }
    let vinNode = document.createElement("div");
    if (vinFromSourceCode) {
        vinNode.innerHTML = '<span style="font-weight:600;color:#E82127">VIN Assigned:</span> ' + vinFromSourceCode;
    } else {
        vinNode.innerHTML = '<span style="font-weight:600;color:#E82127">VIN Assigned:</span> NOT Assigned yet!';
    }
    infoDiv.appendChild(matchedToRa00vinNode);
    infoDiv.appendChild(vinNode);

    const refNode = document.getElementById("prod-final-deliver-desk-model-name");
    refNode.parentNode.insertBefore(infoDiv, refNode.nextSibling);

})();