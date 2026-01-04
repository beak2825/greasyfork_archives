// ==UserScript==
// @name         Update Portal Button
// @namespace    cpx.printiq
// @description  Add button to update portal
// @version      1.4
// @match        https://cpx.printiq.com/Boards/JobDetails.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=printiq.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475626/Update%20Portal%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/475626/Update%20Portal%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var buttonContainer = document.createElement('span');
    buttonContainer.setAttribute('id','buttonContainer');
    buttonContainer.setAttribute('style','padding-left:10px;');
    buttonContainer.innerHTML='<button type="button" id="updatePortalButton"><i class="fa fa-refresh"></i>&nbsp;Update Portal</button>';
    document.getElementsByClassName("iq-page-title job-details-title pp-secret")[0].appendChild(buttonContainer);
    document.getElementById ("updatePortalButton").addEventListener("click", ButtonClickAction, false);
})();

function ButtonClickAction (event) {
    event.preventDefault = true;
    var jobno = document.getElementsByClassName("job-number")[0].getAttribute('data-jobno');
    var xhr = new XMLHttpRequest();
    var url = "https://stage-portal-api.cpxonline.net.au/api/printiq/job/update";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("X-PrintIQ", "123456");
    var data = JSON.stringify({"JobNumber": jobno});
    xhr.send(data);

    xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200) {
                    // Successful response
                    PrintIQ.Toast.Show('Portal Updated', 'fa-link');
                } else {
                    // Handle error response
                    PrintIQ.Toast.Alert('Portal Update Failed');
                }
            }
        };


}
