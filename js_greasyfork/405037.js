// ==UserScript==
// @name         RAD DB Description Box Resize
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Resize the ridiculously small Description box in the RAD db
// @author       Gordon Mancuso
// @match        cq-webserver.code1.emi.philips.com/cqweb/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405037/RAD%20DB%20Description%20Box%20Resize.user.js
// @updateURL https://update.greasyfork.org/scripts/405037/RAD%20DB%20Description%20Box%20Resize.meta.js
// ==/UserScript==
//debugger;
(function() {
    'use strict';

    function changeDescriptionSize() {
        var mystuff = document.querySelectorAll(".cqReadonlyControl");
        var i;
        for (i = 0; i < mystuff.length; i++) {
            if ((mystuff[i].style.height == "136px" || mystuff[i].style.height == "300px") && mystuff[i].style.top == "519px" ) {
                mystuff[i].style.height = "300px";
                var kid = mystuff[i].querySelector(".cqReadonlyControl,.dijitTextBox");
                if (kid && kid.style.height == "136px") {
                    kid.style.height = "300px";
                }
            }
        }

        setTimeout(changeDescriptionSize,250);

    }

    window.onload = changeDescriptionSize;

})();