// ==UserScript==
// @name         Export and Import Cookies
// @version      1.0.1
// @description  Allows you to import and export cookies from any website.
// @author       yodaluca23
// @license      GNU GPLv3
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @namespace https://greasyfork.org/users/1315976
// @downloadURL https://update.greasyfork.org/scripts/524436/Export%20and%20Import%20Cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/524436/Export%20and%20Import%20Cookies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const signatureKey = 'cookie_manager_by_yodaluca23';

    // Function to export cookies and copy them to clipboard
    function exportCookies() {

        const cookiesExport = document.cookie.split('; ').map(cookie => {
            const [name, value] = cookie.split('=');
            return { name, value };
        });

        const cookiesWithSignature = {
            cookies: cookiesExport,
            signature: signatureKey
        };

        GM_setClipboard(JSON.stringify(cookiesWithSignature));
        alert("Cookies copied to clipboard.");
    }

    // Function to import cookies from clipboard
    function importCookies() {

        var cookiesLoading;
        var userInput = prompt("Please paste in your cookies previously exported:");
        console.log(userInput);
        if (userInput !== null && userInput !== "") {
            cookiesLoading = userInput;
        } else {
          return;
        }

        try {
            const cookiesWithSignature = JSON.parse(cookiesLoading);

            if (cookiesWithSignature.signature !== signatureKey) {
                alert("These cookies were not exported with this tool.");
                return;
            }

            const cookiesImport = cookiesWithSignature.cookies;

            cookiesImport.forEach(({ name, value }) => {
                document.cookie = `${name}=${value}; path=/; domain=${window.location.hostname}`;
            });

            let refresh = confirm("Cookies have been imported, would you like to refresh the page now?");
            if (refresh) {
                location.reload();
            }

        } catch (error) {
            alert("Error importing cookies: " + error.message);
        }
    }

    // Register menu commands for exporting and importing cookies
    GM_registerMenuCommand("Export Cookies", exportCookies);
    GM_registerMenuCommand("Import Cookies", importCookies);

})();