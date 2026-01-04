// ==UserScript==
// @name         Jira click to edit disabled
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  disables jira click to edit feature
// @author       You
// @match        https://*.atlassian.net/browse/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458339/Jira%20click%20to%20edit%20disabled.user.js
// @updateURL https://update.greasyfork.org/scripts/458339/Jira%20click%20to%20edit%20disabled.meta.js
// ==/UserScript==

document.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey) {
        return; // allow normal click-to-edit when key is held
    }
    let e = event.target;

    if (["A","IMG"].includes(e.tagName)) {
        return; // allow normal click on normal hyperlinks
    }
    while (e !== document) {
        const aa = e.attributes;
        for (let i = 0; i < aa.length; ++i) {
            const a = aa[i];
            if (a.name === 'role' && a.value === 'presentation' && e.tagName !== 'SPAN') {
                // This is an attempt to cleanly match relevant elements (comments, description) despite class obfuscation.
                // Excluding <span> avoids inhibiting clicks on attach/link buttons.

                console.log("CLICKED TO NOT EDIT, hold ctrl/cmd if you really want the thing to happen");
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        }
        e = e.parentNode;
    }
},
                          { capture: true }
                         )
