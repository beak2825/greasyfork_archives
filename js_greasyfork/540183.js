// ==UserScript==
// @name        Google Ai Eradicator
// @name:de     Google Ki Entferner
// @namespace   HanneKaffeeKanne
// @license     GPL 3.0
// @match       https://www.google.com/search*
// @match       https://mail.google.com/mail*
// @version     1.4
// @author      Hannes Leonhartsberger
// @description Removes the google ai overview from a search query and removes the "Try gemini" button from gmail
// @description:de Entfernt die Ki Zusammenfassung einer Suchanfrage auf google und entfernt den "Gemini ausprobieren" Knopf von GMail.
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/540183/Google%20Ai%20Eradicator.user.js
// @updateURL https://update.greasyfork.org/scripts/540183/Google%20Ai%20Eradicator.meta.js
// ==/UserScript==

//! Remove ai overview from google search
if(document.location.href.includes("google.com/search")) {
    if(!document.location.href.includes("&udm=")) {
        // Change from tab All to tab Web
        document.location.href = document.location.href + "&udm=14";
    } else {
        // Switch the All and Web tab
        let tabs = document.querySelector("div.crJ18e > div[role=list]");

        for(let [i, node] of Array.from(tabs.children).entries()) {
            if(i === 0) {
                node.remove();
            }

            if(node.innerHTML.includes("Web")) {
                tabs.prepend(node);
            }
        }
    }
}

//! Remove Mail Ai
const disconnect = VM.observe(document.body, () => {
    const node = document.querySelector("div:has(> div.r4vW1e.e5IPTd)");

    if(node) {
        node.remove();

        return true;
    }
});
