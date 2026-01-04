// ==UserScript==
// @name         Completionator - Default Epic Games
// @namespace    https://github.com/theborg3of5/Userscripts/
// @version      1.2
// @description  Default values into the Completionator bulk import form, for weekly free Epic Games Store games.
// @author       Gavin Borg
// @match        https://*.completionator.com/Collection/BulkImport
// @downloadURL https://update.greasyfork.org/scripts/421385/Completionator%20-%20Default%20Epic%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/421385/Completionator%20-%20Default%20Epic%20Games.meta.js
// ==/UserScript==

document.querySelector("#ddlPlatform").value = 32; // Platform = PC / Windows
document.querySelector("#ddlPlatform").dispatchEvent(new Event("change")) // Trigger changed event so following fields populate appropriately
document.querySelector("#rdoDigital").click(); // Format = Digital, click instead of setting value so it makes other fields appear correctly
document.querySelector("#IsBacklog").checked = true; // Add imported games to my backlog = checked

// The above fields show and populate the format dropdown
window.setTimeout(function() {
    document.querySelector("#ddlDigitalFormatProvider").value = 1028; // Digital Format = Epic Games Store
}, 1000);