// ==UserScript==
// @name         privacy.resistfingerprinting Blurry Google Docs/Sheets Fix
// @version      1.1
// @description  Fixes blurry font on Google Docs and Sheets. This issue is caused by resistfingerprinting forcing window.devicePixelRatio to be set to 1 no matter the actual value. WARNING! This overides the spoofed devicePixelRatio with the real value while in a Google Docs/Sheets document thus decreasing security.
// @author       Prismo
// @license      GPL-3.0-only
// @supportURL   https://github.com/hboyd2003/Privacyresistfingerprinting-Docs-Sheets-Fix/issues
// @namespace    https://greasyfork.org/users/976025
// @icon         https://raw.githubusercontent.com/hboyd2003/Privacyresistfingerprinting-Docs-Sheets-Fix/main/FixDocsIcon.png
// @match        *://docs.google.com/document/d*
// @match        *://docs.google.com/spreadsheets/d*
// @run-at       document-start
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/453863/privacyresistfingerprinting%20Blurry%20Google%20DocsSheets%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/453863/privacyresistfingerprinting%20Blurry%20Google%20DocsSheets%20Fix.meta.js
// ==/UserScript==

(function() {
    console.log("Set devicePixelRatio to real value");
    unsafeWindow.devicePixelRatio = 1.7647058823529411;
})();