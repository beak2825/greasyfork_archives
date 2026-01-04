// ==UserScript==
// @name         Remove YouTube Shorts button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the YouTube Shorts button from the guide menu
// @author       RandomPerson189
// @license      MIT
// @match        https://www.youtube.com/*
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440597/Remove%20YouTube%20Shorts%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/440597/Remove%20YouTube%20Shorts%20button.meta.js
// ==/UserScript==

function removeGuideButton()
{
    // Delete the Shorts guide element
    $('#endpoint.ytd-guide-entry-renderer.style-scope[title="Shorts"]').parent().remove();
}

// Call the function multiple times by waiting for elements with the id "endpoint" just so it doesn't fail the first time
waitForKeyElements ( "#endpoint", removeGuideButton );