// ==UserScript==
// @name         ORF.at adfree
// @namespace    orf
// @version      2024-04-26
// @description  Zeigt normale Bilder beim Artikel, entfernt die Werbung auf der Seite
// @author       You
// @match        https://*.orf.at/*
// @license MIT
// @grant        GM_addStyle
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/493347/ORFat%20adfree.user.js
// @updateURL https://update.greasyfork.org/scripts/493347/ORFat%20adfree.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a major design
    change introduced in GM 1.0. It restores the sandbox.

    If in Tampermonkey, use "// @unwrap" to enable sandbox instead.
*/

console.log('Tampermonkey orf.at starting');

(new MutationObserver(check)).observe(document, {childList: true, subtree: true});

function check(changes, observer) {
    if(document.querySelector("[id='sitebar-banner']") || (document.querySelector("[id='ticker-banner']"))) {
        console.log("QuerySelecter executed and found: [id='sitebar-banner']");
        //observer.disconnect();
        // actions to perform after #mySelector is found
        document.querySelectorAll("[id='sitebar-banner'],[id='ticker-banner']").forEach(function(elem) {
            console.log('Removing element: ', elem);
            elem.remove();
        })
    }
}