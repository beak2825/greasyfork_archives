// ==UserScript==
// @name    Service_OR_Domain_ExpireDate
// @version  1.1.7
// @description show expire date in domain|service page
// @license AGPLv3.0
// @grant    none
// @match     https://clients.netafraz.com/admin/clientsservices.php*
// @match     https://clients.netafraz.com/admin/clientsdomains.php*
// @namespace https://clients.netafraz.com
// @downloadURL https://update.greasyfork.org/scripts/522881/Service_OR_Domain_ExpireDate.user.js
// @updateURL https://update.greasyfork.org/scripts/522881/Service_OR_Domain_ExpireDate.meta.js
// ==/UserScript==
// Programmed and developed by Farshad Mehryar (@farshad271)

(function () {
    'use strict';

    function runScript() {

        var url = location.href;
        var pageNameIncludeQueryStrings = url.substring(url.lastIndexOf('/') + 1);
        var tArray = pageNameIncludeQueryStrings.split("?");
        var pageName = tArray[0];

        if (pageName == "clientsservices.php" || pageName == "clientsdomains.php") {
            var inputNextDueDate;
            if (pageName == "clientsservices.php") {
                inputNextDueDate = document.getElementById("inputNextduedate");
            }
            if (pageName == "clientsdomains.php") {
                inputNextDueDate = document.getElementById("inputNextDueDate");
            }
            /* ------------------------------------------------------------------------- */
            var divParentInputNextDueDate = inputNextDueDate.parentElement;
            const spanDiffDateText = document.createElement("span");
            const spanDiffDateDigits = document.createElement("span");
            const spanLogicalDiffDateDigits = document.createElement("span");
            divParentInputNextDueDate.appendChild(spanDiffDateText);
            divParentInputNextDueDate.appendChild(spanDiffDateDigits);
            divParentInputNextDueDate.appendChild(spanLogicalDiffDateDigits);
            inputNextDueDate.style.display = "inline-block";
            spanDiffDateText.innerHTML = "Days Left : ";
            spanDiffDateText.style.padding = "5px";
            spanDiffDateText.style.backgroundColor = "#00BFFF";
            spanDiffDateDigits.textContent = "**";
            spanDiffDateDigits.style.padding = "5px";
            spanDiffDateDigits.style.marginLeft = "5px";
            spanDiffDateDigits.style.backgroundColor = "#00FF00";
            spanDiffDateDigits.style.fontWeight = "bold";
            spanDiffDateDigits.style.fontSize = "large";
            spanLogicalDiffDateDigits.textContent = "**";
            spanLogicalDiffDateDigits.style.padding = "5px";
            spanLogicalDiffDateDigits.style.marginLeft = "5px";
            spanLogicalDiffDateDigits.style.backgroundColor = "lightblue";
            spanLogicalDiffDateDigits.style.fontWeight = "normal";
            spanLogicalDiffDateDigits.style.fontSize = "x-small";
            /* ------------------------------------------------------------------------- */
            var nowDate = new Date(Date.now());
            var nowDate_string = `${nowDate.getFullYear()}/${nowDate.getMonth() + 1}/${nowDate.getDate()}`;
            var d1 = new Date(nowDate_string);
            var d2 = new Date(inputNextDueDate.value);
            var diff = d2.getTime() - d1.getTime();
            var daydiff = Math.floor(diff / (1000 * 60 * 60 * 24));
            var daydiffYears = Math.floor(daydiff / 365);
            var daydiffDays = daydiff % 365;
            if (daydiffYears < 0) {
                daydiffYears++;
            }
            /* ------------------------------------------------------------------------- */
            if (pageName == "clientsservices.php") {
                if (daydiffDays < 0) {
                    spanDiffDateDigits.style.backgroundColor = "#FF0000";
                    spanDiffDateDigits.textContent = daydiff;
                    spanLogicalDiffDateDigits.style.display = 'none';
                }
                else {
                    spanDiffDateDigits.textContent = daydiff + 1;
                    spanLogicalDiffDateDigits.textContent = `(Logical: ${daydiff})`;
                }
            }
            if (pageName == "clientsdomains.php") {
                if (daydiffYears < 0 || daydiffDays < 0) {
                    spanDiffDateDigits.style.backgroundColor = "#FF8888";
                }
                if (daydiffYears == 0) {
                    spanDiffDateDigits.textContent = `${daydiffDays}.D`;
                } else {
                    spanDiffDateDigits.textContent = `${daydiffYears}.Y And ${daydiffDays}.D`;
                    spanDiffDateDigits.style.fontSize = "medium";
                }
                spanLogicalDiffDateDigits.style.display = 'none';
            }
            /* ------------------------------------------------------------------------- */

            document.querySelector('div.form-group:nth-child(2) button.btn-xs').remove();

        }
    }

    if (document.readyState === "complete") {
        runScript();
    } else {
        document.addEventListener("readystatechange", function () {
            if (document.readyState === "complete") {
                runScript();
            }
        });
    }
})();