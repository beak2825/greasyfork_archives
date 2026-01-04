// ==UserScript==
// @name         onlyMpos
// @namespace    https://github.com/R0g3rT
// @version      1.3
// @license      MIT
// @description  burn rubber not your soul!!
// @author       R0g3rT
// @match        https://partner.jifeline.com/portal/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jifeline.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487291/onlyMpos.user.js
// @updateURL https://update.greasyfork.org/scripts/487291/onlyMpos.meta.js
// ==/UserScript==

(function () {
    'use strict';

    
     function toggleMPOS(action) {
        var ticketNumber = window.location.href.split('/').pop();
        var apiUrl = 'https://partner.jifeline.com/api/provider/private/tickets/' + ticketNumber;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {

                if (data.client_name && (data.client_name.includes("RMP") || data.client_name.includes("SLF") || data.client_name.includes("Autoland"))) {

                    navigator.clipboard.writeText(data.vin_number);
                   setTimeout(function () {
                    var windowWidth = 800;
                    var windowHeight = 600;
                    var screenWidth = 5110;
                    var screenHeight = 1440;

                    var leftPosition = screenWidth - windowWidth;
                    var topPosition = screenHeight - windowHeight;

                    window.open('https://mpos.rameder.eu/backend/calendar/pendingcodings', '_blank', 'width=' + windowWidth + ',height=' + windowHeight + ',left=' + leftPosition + ',top=' + topPosition + ',location=no,menubar=no,scrollbars=yes,status=no,toolbar=no');
                }, 500);

                } else {
                  alert('!!! kein Montagepoint !!!');
                }
            });
    }

    function doc_keyUp(e) {
        if (e.altKey && e.key === "p") {
            toggleMPOS();

        }
    }

    var mposButton = document.createElement('button');
    mposButton.innerHTML = 'MPOS';
    mposButton.classList.add('custom-mpos-Button');
    mposButton.onclick = function () {
        toggleMPOS('start');
    };




    document.body.appendChild(mposButton);
    var style = document.createElement('style');
    style.textContent = `.custom-mpos-Button { position: fixed; top: 60px; left: 80px; z-index: 9999; color: var(--bs-nav-link-color); background-color: #e4e7ed; border: none; }
    `
    ;
      document.head.appendChild(style);
      document.addEventListener("keyup", doc_keyUp, false);

})();
