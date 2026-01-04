// ==UserScript==
// @name        PNR Captcha Bypass
// @namespace   http://www.indianrail.gov.in/pnr_Enq.html
// @description Autofill Captcha on Indian Railways Website for PNR Enquiry
// @copyright   2017, sammyangel99 (https://greasyfork.org/id/users/164325-krmfbns)
// @license     PNR-Bypassed-Captcha-Script
// @version     1.0
// @include     http://www.indianrail.gov.in/pnr_Enq.html
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/36653/PNR%20Captcha%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/36653/PNR%20Captcha%20Bypass.meta.js
// ==/UserScript==
window.addEventListener('load', function() {
document.getElementById("txtInput").value=document.getElementById("txtCaptcha").value;
}, false);

var e = document.getElementById("btnrefresh");
e.addEventListener("click", modifyText, false);
function modifyText() {
document.getElementById("txtInput").value=document.getElementById("txtCaptcha").value;
}