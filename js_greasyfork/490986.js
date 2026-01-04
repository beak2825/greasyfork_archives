// ==UserScript==
// @name         QRCode for SurveyLink
// @namespace    http://tampermonkey.net/
// @version      2024-03-07
// @description  Generate a QR code when generating a new SurveyLink !
// @author       You
// @match        https://command-center.support.aws.a2z.com/troubleshooting
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require     https://update.greasyfork.org/scripts/383527/701631/Wait_for_key_elements.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js
// @grant        none
// @license damiendg@amazon.co.jp
// @downloadURL https://update.greasyfork.org/scripts/490986/QRCode%20for%20SurveyLink.user.js
// @updateURL https://update.greasyfork.org/scripts/490986/QRCode%20for%20SurveyLink.meta.js
// ==/UserScript==

/* global waitForKeyElements */
/* global QRCode */

function appendQRCode (jNode) {

    if(jNode.attr("href").indexOf("qualtrics.com") > -1 ){
        jNode.parent().append("<div id='qrcode'></div>")
        new QRCode(document.getElementById("qrcode"), jNode.attr("href"));
    }
}


waitForKeyElements ("a",appendQRCode);