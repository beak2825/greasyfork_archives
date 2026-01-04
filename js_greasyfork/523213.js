// ==UserScript==
// @name         Portal Identifier zeigen
// @namespace    http://tampermonkey.net/
// @version      2025-01-14
// @description  Hiermit wird der Portal Identifier von der aktuell besuchten Messeseite dargestellt
// @author       Vanakh Chea
// @match https://*/*
// @match http://*/*
// @grant        none
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/523213/Portal%20Identifier%20zeigen.user.js
// @updateURL https://update.greasyfork.org/scripts/523213/Portal%20Identifier%20zeigen.meta.js
// ==/UserScript==




(function() {
    'use strict'; // Enforce strict mode for better error handling



    // Retrieve current portal identifier of current website
    var pid = document.querySelector('meta[name="portal_identifier"]');
    if(pid == undefined){
        return 0;
        //pid = "(nicht gefunden)";
    } else {
        pid = pid.content;
    }

    // Element where the HTML message will be injected
    var theParent = document.querySelector("body");
    if(document.querySelector("footer")){ // Prefer footer if available
        theParent = document.querySelector("footer");
    }
    /*
    // Prefer header if available (commented out in the original code)
    if(document.querySelector("header")){
        theParent = document.querySelector("header");
    }
    */

    // Create a div element for the message
    var theKid = document.createElement("div");
    theKid.style.textAlign = 'center'; // Center text
    //theKid.style.border = '4px solid red'; // Red border for emphasis
            // Apply styles to make the div float
            theKid.style.position = 'fixed';
            theKid.style.bottom = '20px';
            //theKid.style.left = '50%';
            theKid.style.right = '20px'
            //theKid.style.transform = 'translateX(-50%)';
            theKid.style.width = '500px';
            theKid.style.height = '100px';
            theKid.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            theKid.style.color = 'white';
            theKid.style.display = 'flex';
            theKid.style.alignItems = 'center';
            theKid.style.justifyContent = 'center';
            theKid.style.borderRadius = '8px';
            theKid.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            theKid.style.zIndex = '1000';
            theKid.style.cursor = 'move'; // Change cursor to indicate draggable
            theKid.style.cssText += 'font-size: 2em !important;'; // Set font size with !important

            let isDragging = false;
            let offsetX, offsetY;

            theKid.addEventListener('mousedown', function(e) {
                isDragging = true;
                offsetX = e.clientX - theKid.offsetLeft;
                offsetY = e.clientY - theKid.offsetTop;
                theKid.style.transition = ''; // Remove any transition for smooth dragging
            });

            document.addEventListener('mousemove', function(e) {
                if (isDragging) {
                    theKid.style.left = `${e.clientX - offsetX}px`;
                    theKid.style.top = `${e.clientY - offsetY}px`;
                    theKid.style.transform = ''; // Disable transformation when dragging
                }
            });

            document.addEventListener('mouseup', function() {
                isDragging = false;
                theKid.style.transition = '0.3s'; // Optional: reapply transition
            });

            //document.body.appendChild(theKid);





    theKid.innerHTML = '<br><br><br><font color="red"> Portal Identifier:<br> "'+pid+'" </font>' ;
    //theParent.insertBefore(theKid, theParent.firstChild);
    theParent.appendChild(theKid);

})();