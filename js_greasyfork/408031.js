// ==UserScript==
// @name         [not working] Unlock locked steps in Symbolab
// @namespace    http://*.symbolab.com/*
// @version      2.25
// @description  unlocks locked symbolab step-by-step instructions by overwriting XMLHttpRequest
// @author       joseph
// @match        *://*.symbolab.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/408031/%5Bnot%20working%5D%20Unlock%20locked%20steps%20in%20Symbolab.user.js
// @updateURL https://update.greasyfork.org/scripts/408031/%5Bnot%20working%5D%20Unlock%20locked%20steps%20in%20Symbolab.meta.js
// ==/UserScript==

(function(open) {
    const version = "2.2";

    let srcset = `
    console.log("Symbolab Unlock 2.0 is running.")

var PATCHED     = 0;
var ALERT_SHOWN = false;

// Symbolab internal constants
let INTERNAL_SOLUTIONS_OBJ_PTR = "SOLUTIONS";
let INTERNAL_SOLUTIONS_PROTO_PTR = "Solutions";
let INTERNAL_STEPS_OBJ_PTR = "SYSTEPS";
let INTERNAL_STEPS_PROTO_PTR = "SymbolabSteps";

if (window["SYMBOLAB"]["params"]["query"] !== null) {
    let INTERNAL_SOLUTIONS_PROTO_DEFAULT_ARGS = [
        window[INTERNAL_SOLUTIONS_OBJ_PTR].subject,
        window[INTERNAL_SOLUTIONS_OBJ_PTR].page,
        window[INTERNAL_SOLUTIONS_OBJ_PTR].query,
        window[INTERNAL_SOLUTIONS_OBJ_PTR].input,
        window[INTERNAL_SOLUTIONS_OBJ_PTR].input_back,
        window[INTERNAL_SOLUTIONS_OBJ_PTR].appLangs,
        window[INTERNAL_SOLUTIONS_OBJ_PTR].curLang,
        "true"
    ];

    let INTERNAL_STEPS_PROTO_DEFAULT_ARGS = [
        window[INTERNAL_STEPS_OBJ_PTR].requestLang,
        "true",
        false,
        window[INTERNAL_STEPS_OBJ_PTR].referer
    ];

    window[INTERNAL_STEPS_OBJ_PTR] = new window[INTERNAL_STEPS_PROTO_PTR](...INTERNAL_STEPS_PROTO_DEFAULT_ARGS);
    window[INTERNAL_SOLUTIONS_OBJ_PTR] = new window[INTERNAL_SOLUTIONS_PROTO_PTR](...INTERNAL_SOLUTIONS_PROTO_DEFAULT_ARGS);
    window[INTERNAL_SOLUTIONS_OBJ_PTR].init();

    // Thanks to ShortHax for the following--looks like SB even allows us to
    // check solutions on the backend!
    document.getElementById("click-capture").classList.add("click-capture-subscribed");
}
    `

    // Credits to ShortHax for the following method which forces the script to
    // execute at first priority.
    document.documentElement.setAttribute("onreset", srcset);
    document.documentElement.dispatchEvent(new CustomEvent("reset"));
    document.documentElement.removeAttribute("onreset");

    // v2.0 onboarding
    if (!localStorage.getItem("SyUnlock_v2_Onboarding"))
    {
        localStorage.setItem("SyUnlock_v2_Onboarding", true);
        alert(`Symbolab Unlock has been updated to version 2.0! Most importantly, the script has been rewritten with new methodology. Patching works again. You can now also check your answers. Many thanks to ShortHax on Greasyfork for discovering much of the new methodology. Enjoy!`)
    }

    var SIGNED_IN   = document.body.classList.contains('signedin');
    let NOT_SIGNED_IN_MESSAGE = "[Symbolab Unlock] ALERT! It looks like you are not logged into any Symbolab account. Note that Symbolab has recently changed their backend and steps are only sent if you are logged in. The script will not work until you create a free Symbolab account and sign in to it. If you are signed in, ignore this message.";

    if (!SIGNED_IN) {
        console.log("[Symbolab Unlock] Determined that the user is not signed in!")
        // Determine where we should place the alert
        referenceNode = document.getElementById("nl-mainNav");
    
        // Create warning div
        warningDiv = document.createElement("div");
        warningDiv.style.border = "2px dashed #f00";
        warningDiv.style.width = "60%";
        warningDiv.style.margin = "9px auto";
        warningDiv.id = "warning_text_symbolab_unlock";
        warningDiv.style.padding = "5px 5px 5px 5px";
    
        // Create warning text
        warningTxt = document.createElement("b");
        warningTxt.appendChild(document.createTextNode(NOT_SIGNED_IN_MESSAGE))
        warningTxt.style.color = "red";
    
        // Append text to div
        warningDiv.appendChild(warningTxt);
    
        // Append div to page
        referenceNode.parentNode.insertBefore(warningDiv, referenceNode.nextSibling);
    }

})(XMLHttpRequest.prototype.open);