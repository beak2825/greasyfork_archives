// ==UserScript==
// @name         Symbolab Premium - Unlock Step-by-Step (FIXED)
// @namespace    http://*.symbolab.com/*
// @version      1.2
// @description  unlocks locked symbolab step-by-step instructions by overwriting XMLHttpRequest
// @author       Shopee San Adjie
// @match        *://*.symbolab.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433743/Symbolab%20Premium%20-%20Unlock%20Step-by-Step%20%28FIXED%29.user.js
// @updateURL https://update.greasyfork.org/scripts/433743/Symbolab%20Premium%20-%20Unlock%20Step-by-Step%20%28FIXED%29.meta.js
// ==/UserScript==

(function(open) {
    
    var patched = 0;
    var signedIn = true;
    var shownAlert = false;
    
    let NOT_SIGNED_IN_MESSAGE = "[Symbolab Unlock] Halo Kak, Terima Kasih sudah order! Untuk Menggunakan kk harus login terlebih dahulu! ";

    function patchResponseLoop(obj) {
        for (var k in obj)
        {
            if (typeof obj[k] == "object" && obj[k] !== null) {
                patchResponseLoop(obj[k]);
            } else {
                if (k == "isLocked") {
                    obj[k] = false;
                    console.log("[patcher] patched a symbolab isLocked property");
                    patched++;
                }
            }
        }
    }

    var open_prototype = XMLHttpRequest.prototype.open,
        intercept_response = function(urlpattern, callback) {
            XMLHttpRequest.prototype.open = function() {
                arguments['1'].match(urlpattern) && this.addEventListener('readystatechange', function(event) {
                    if ( this.readyState === 4 ) {
                        var response = callback(event.target.responseText);
                        // allow intercepted responses to be written to
                        Object.defineProperty(this, 'response', {writable: true});
                        Object.defineProperty(this, 'responseText', {writable: true});

                        this.response = this.responseText = response;
                    }
                });
                return open_prototype.apply(this, arguments);
            };
        };

    if (signedIn) {
        intercept_response(/steps/i, function(response) {
            console.log("[patcher] intercept request, current RES ", JSON.parse(response));

            var parsedO = JSON.parse(response);

            patchResponseLoop(parsedO);

            console.log("[patcher] === PATCHSET COMPLETE, enjoy ===");
            document.getElementById("PlotLink").innerHTML = "<b>Unlocked " + patched + " step(s)!</b>";
    
            return JSON.stringify(parsedO);
        });
    } else {
        document.getElementById("PlotLink").innerHTML = "<b>Please sign in to Symbolab to unlock steps.</b>";
    }
    // tell the user that the script will not work unless they are
    // signed into a free account
    
    if (document.getElementsByClassName("signedin").length < 5 && !document.getElementById("warning_text_symbolab_unlock")) { // hacky way to determine whether logged in
        signedIn = false;
        
        // Determine where we should place the alert
        referenceNode = document.getElementById("nl-mainNav");
        
        /**<div style="border: 1px solid #f00; width:60%; margin: 0 auto;">
<b style="color:red;">[Symbolab Unlock] ALERT! It looks like you are not logged into any Symbolab account. Note that Symbolab has recently changed their backend and steps are only sent if you are logged in. The script will not work until you create a free Symbolab account and sign in to it. If you are signed in, ignore this message.</b>

</div>*/
        
        // Create warning div
        warningDiv = document.createElement("div");
        warningDiv.style.border = "1px solid #f00";
        warningDiv.style.width = "60%";
        warningDiv.style.margin = "0 auto";
        warningDiv.id = "warning_text_symbolab_unlock"
        
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
