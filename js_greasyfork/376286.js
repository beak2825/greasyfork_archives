// ==UserScript==
// @name         op.fi userscript
// @namespace    sami@kankaristo.fi
// @version      1.0.0
// @description  Minor improvements on op.fi
// @author       sami@kankaristo.fi
// @match        https://op.fi/*
// @match        https://www.op.fi/*
// @match        https://saml-idp.op.fi/*
// @match        https://*.op.fi/*
// @grant        none
// @require      https://greasyfork.org/scripts/405927-utillibrary/code/UtilLibrary.js
// @downloadURL https://update.greasyfork.org/scripts/376286/opfi%20userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/376286/opfi%20userscript.meta.js
// ==/UserScript==


Util.LOGGING_ID = "op.fi userscript";

const username = "44583092";

const accountNumbers = {
    "FI26 1470 5000 0377 29": "Antti Tujula",
    "FI88 5410 2050 0321 34": "Eeva Vuorinen",
    "FI29 3939 0052 7208 51": "Erik Kokki",
    "FI52 5259 0420 0861 31": "Johannes Ylönen",
    "FI69 4712 0010 0286 38": "Jussi Jantunen",
    "FI85 4355 1320 0119 28": "Jussi Kankaristo",
    "FI62 5711 6120 0802 35": "Nianzu Yang",
    "FI27 1552 3500 0357 81": "Sami Eklund",
    "FI80 5710 5220 1502 38": "Sami Kankaristo",
    "FI61 1770 3500 0017 89": "Tuukka Aro",
    
    "FI56 8919 9710 0007 24": "Verohallinto",
    "FI67 5711 6110 0023 30": "Veritas Eläkevakuutus",
};


///
/// Continuous loop on op.fi.
///
function OsuuspankkiLoop() {
    //Util.Log("OsuuspankkiLoop()");
    
    // Find continue button
    const continueButton = document.querySelector(".op-login-session-timeout-cancel");
    
    if ((continueButton != null) && (continueButton.offsetParent != null)) {
        Util.Log("Clicking continue session button");
        
        // Click the button
        continueButton.dispatchEvent(Util.CreateClickEvent());
    }
    
    // Auto-fill username box
    const usernameBox = document.getElementById("auth-device-userid-mobilekey");
    if ((usernameBox != null) && (usernameBox.value == "")) {
        //Util.Log("Clickety click");
        // Set the username input value
        // NOTE: This stopped working, OP does not recognize that the box has a value...
        //usernameBox.value = username;
    }
    
    // Auto-fill recipient name based on account number
    const recipientAccountNumberBox = (
        // Old form
        document.getElementById("recipientAccountNumber")
        // New form
        || document.getElementById("payeeAccountNumber")
    );
    window.recipientAccountNumberBox = recipientAccountNumberBox;
    const recipientNameBox = (
        // Old form
        document.getElementById("recipientName")
        // New form
        || document.getElementById("payeeName")
    );
    
    if ((recipientNameBox != null) && (recipientAccountNumberBox != null) && (recipientAccountNumberBox.value != "")) {
        const currentAccountNumber = recipientAccountNumberBox.value;
        
        for (const accountNumber in accountNumbers) {
            if (currentAccountNumber == accountNumber) {
                const recipientName = accountNumbers[accountNumber];
                Util.Log("Found account number match: ", accountNumber, recipientName);
                recipientNameBox.value = recipientName;
                
                break;
            }
        }
    }
}


(
    function () {
        "use strict";
        
        setInterval(OsuuspankkiLoop, 1000);
    }
)();
