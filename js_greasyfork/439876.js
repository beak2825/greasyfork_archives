// ==UserScript==
// @license MIT
// @name         Test Bank ID Autofill
// @namespace    http://tampermonkey.net/
// @require      http://code.jquery.com/jquery-3.4.1.min.js

// @version      0.2
// @author       You
// @description  Automatically fills out the form for test bank id.
// @connect      fejka.nu
// @match        https://demo.bankid.com/Hamta.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bankid.com
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/439876/Test%20Bank%20ID%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/439876/Test%20Bank%20ID%20Autofill.meta.js
// ==/UserScript==

(function() {
    'use strict';
try {
    GM.xmlHttpRequest({
      method: "GET",
      url: "http://fejka.nu\?age_min=18\&json=1",
      onload: function(response) {
        var fejk = JSON.parse(response.responseText);
        $("#MainContent_txtPnrHamta").val(fejk.pnr.replace('-',''));
        $("#MainContent_txtFirstName").val(fejk.fname);
        $("#MainContent_txtLastName").val(fejk.lname);
      }
    });
} catch (e) {
    console.log(e);
}
})();