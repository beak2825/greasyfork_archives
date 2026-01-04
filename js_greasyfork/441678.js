// ==UserScript==
// @name         Twentysided Unicode Fixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allow Twentysided comments to contain unicode
// @author       Retsam
// @match        https://www.shamusyoung.com/twentysidedtale/?p=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
/* jshint esversion:6 */
// @downloadURL https://update.greasyfork.org/scripts/441678/Twentysided%20Unicode%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/441678/Twentysided%20Unicode%20Fixer.meta.js
// ==/UserScript==

const escapeUnicodeForChar = (c) => {
    const code = c.charCodeAt(0);
    return code > 126 ? `&#${code};` : c;
}

/** Transforms a string one char at time based on the map function provided */
const mapChars = (str, mapChar) => str.split("").map(mapChar).join("");

const replaceUnicodeOnSubmit = (evt) => {
    // Only mess with the comment form
    if(evt.target.id !== "commentform") return;

    const commentEl = evt.target.querySelector("#comment");
    if(!commentEl) return;

    commentEl.value = mapChars(commentEl.value, escapeUnicodeForChar);
};

(function() {
    'use strict';

    // Listen for all submit events - the comment form moves around, easier to just catch all events and filter for the one that we're interested in.
    document.body.addEventListener("submit", replaceUnicodeOnSubmit);
})();