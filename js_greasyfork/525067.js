// ==UserScript==
// @name         Script Update Checker
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Automatically checks for script updates by comparing the version number and redirects to the update page if needed (For development)
// @author       Unknown Hacker
// @match        *://*/*
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/525067/Script%20Update%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/525067/Script%20Update%20Checker.meta.js
// ==/UserScript==

(function() {
    const scriptUrl = "https://update.greasyfork.org/scripts/525067/Script%20Update%20Checker.user.js"; 
    const updatePageUrl = "https://greasyfork.org/en/scripts/525067-script-update-checker";

    async function checkForUpdates() {
        try {
            const response = await fetch(scriptUrl);
            const latestScriptContent = await response.text();
            const versionMatch = latestScriptContent.match(/\/\/ @version\s+([^\s]+)/);

            if (versionMatch) {
                const latestVersion = versionMatch[1];
                const currentVersion = GM_info.script.version;

                if (latestVersion !== currentVersion) {
                    console.log("Update available!");
                    alert("A new update is available for the script! Redirecting to the update page.");
                    GM_openInTab(updatePageUrl, { active: true });
                } else {
                    console.log("You are using the latest version!");
                }
            } else {
                console.error("Could not find version information in the latest script.");
            }
        } catch (error) {
            console.error("Error checking for updates:", error);
        }
    }

    checkForUpdates();
})();
