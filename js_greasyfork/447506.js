// ==UserScript==
// @name         AutoWaxApprove
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  AutoWaxApprove1
// @author       Hazard
// @match        https://all-access.wax.io/cloud-wallet/signing/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447506/AutoWaxApprove.user.js
// @updateURL https://update.greasyfork.org/scripts/447506/AutoWaxApprove.meta.js
// ==/UserScript==

window.onload =(function Approve() {

    let checkBox=document.getElementsByClassName("jss44")[0];
    if(checkBox!=null && checkBox.checked==false)
        checkBox.click();

    let approveButton = document.getElementsByClassName("button button-secondary button-large text-1-5rem text-bold mx-1")[0];
    if(approveButton!=null)
    {
        approveButton.click();
        return;
    }

        setTimeout(Approve, 5);
})();