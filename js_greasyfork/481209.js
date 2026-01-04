// ==UserScript==
// @name         Loot Links Ad Skipper
// @namespace    mali
// @license      none
// @version      2
// @description  Redirects to the publisher link if "loot" is in the URL
// @author       malidev
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481209/Loot%20Links%20Ad%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/481209/Loot%20Links%20Ad%20Skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.href.includes("loot")) {
        if (PUBLISHER_LINK) {
            window.location.href = decodeURIComponent(decodeBase64WithKey(PUBLISHER_LINK));
        } else {
            console.error("PUBLISHER_LINK variable is not defined on the page.");
        }
    }
    
    function decodeBase64WithKey(encodedText, keyLength = 5) {
    let decodedText = '';
    let decodedString = atob(encodedText);
    let key = decodedString.substring(0, keyLength);
    let encodedMessage = decodedString.substring(keyLength);
    
    for (let i = 0; i < encodedMessage.length; i++) {
        let encodedCharCode = encodedMessage.charCodeAt(i);
        let keyCharCode = key.charCodeAt(i % key.length);
        let decodedCharCode = encodedCharCode ^ keyCharCode;
        decodedText += String.fromCharCode(decodedCharCode);
    }
    
    return decodedText;
}
})();